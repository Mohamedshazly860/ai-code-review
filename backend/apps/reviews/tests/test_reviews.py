import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.reviews.models import Review

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(db):
    user = User.objects.create_user(
        username='reviewer',
        email='reviewer@example.com',
        password='testpass123'
    )
    client = APIClient()
    # Get JWT token
    response = client.post('/api/auth/login/', {
        'username': 'reviewer',
        'password': 'testpass123'
    }, format='json')
    token = response.data['access']
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    return client, user


@pytest.mark.django_db
class TestReviewSubmission:
    def test_submit_review_success(self, authenticated_client, mocker):
        client, user = authenticated_client

        # Mock the Celery task — we don't want real AI calls in tests
        mocker.patch('apps.reviews.tasks.process_review_task.delay')

        payload = {
            'language': 'python',
            'code_snippet': 'def hello():\n    print("hello world")',
            'question': 'Is this correct?'
        }
        response = client.post('/api/reviews/', payload, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['status'] == 'pending'
        assert response.data['language'] == 'python'

    def test_submit_review_empty_code(self, authenticated_client):
        client, user = authenticated_client
        payload = {
            'language': 'python',
            'code_snippet': '   ',       # Whitespace only
            'question': 'Review this'
        }
        response = client.post('/api/reviews/', payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_submit_review_invalid_language(self, authenticated_client):
        client, user = authenticated_client
        payload = {
            'language': 'brainfuck',     # Not in our choices
            'code_snippet': 'some code',
        }
        response = client.post('/api/reviews/', payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_list_reviews_unauthenticated(self, api_client):
        response = api_client.get('/api/reviews/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_cannot_access_other_users_review(self, authenticated_client, db):
        client, user = authenticated_client

        # Create a review for a different user
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )
        review = Review.objects.create(
            user=other_user,
            language='python',
            code_snippet='print("hello")',
            status=Review.Status.COMPLETED
        )

        response = client.get(f'/api/reviews/{review.id}/')
        # Should 404, not 403 — don't confirm the record exists
        assert response.status_code == status.HTTP_404_NOT_FOUND