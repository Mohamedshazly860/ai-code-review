import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_user():
    def _create_user(username='testuser', email='test@example.com', password='testpass123'):
        return User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
    return _create_user


@pytest.mark.django_db
class TestRegisterView:
    def test_register_success(self, api_client):
        payload = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'securepass123'
        }
        response = api_client.post('/api/auth/register/', payload, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert 'tokens' in response.data
        assert 'access' in response.data['tokens']
        assert 'refresh' in response.data['tokens']
        assert response.data['user']['username'] == 'newuser'

    def test_register_duplicate_username(self, api_client, create_user):
        create_user(username='existinguser')
        payload = {
            'username': 'existinguser',
            'email': 'other@example.com',
            'password': 'securepass123'
        }
        response = api_client.post('/api/auth/register/', payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_weak_password(self, api_client):
        payload = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': '123'             # Too short
        }
        response = api_client.post('/api/auth/register/', payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLoginView:
    def test_login_success(self, api_client, create_user):
        create_user(username='loginuser', password='testpass123')
        response = api_client.post('/api/auth/login/', {
            'username': 'loginuser',
            'password': 'testpass123'
        }, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data

    def test_login_wrong_password(self, api_client, create_user):
        create_user(username='loginuser', password='testpass123')
        response = api_client.post('/api/auth/login/', {
            'username': 'loginuser',
            'password': 'wrongpassword'
        }, format='json')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED