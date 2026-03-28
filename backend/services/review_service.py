# backend/services/review_service.py

import logging
from apps.reviews.models import Review

logger = logging.getLogger(__name__)


def create_review(user, language: str, code_snippet: str, question: str = '') -> Review:
    """
    Creates a new Review record in PENDING state.

    This is the single entry point for creating reviews.
    The view calls this function — it never touches Review.objects directly.

    Why a service function instead of just calling Review.objects.create() in the view?
    Because tomorrow you might need to:
      - Send a notification when a review is created
      - Check user review limits
      - Log analytics events
    All of that goes here, not in the view. The view stays clean.

    Args:
        user: The authenticated User instance
        language: Programming language string (must match Review.Language choices)
        code_snippet: The code to review
        question: Optional user question/context

    Returns:
        Review instance with status=PENDING
    """
    review = Review.objects.create(
        user=user,
        language=language,
        code_snippet=code_snippet,
        question=question,
        status=Review.Status.PENDING,
    )

    logger.info(f"Review #{review.id} created for user '{user.username}' [{language}]")

    return review


def get_user_reviews(user):
    """
    Returns all reviews for a user, optimized for list display.

    select_related('user') — fetches User in the same SQL query as Review.
    Without this, accessing review.user in the serializer triggers
    a separate DB query per review (N+1 problem).
    """
    return (
        Review.objects
        .filter(user=user)
        .select_related('user')
        .order_by('-created_at')
    )


def get_review_detail(review_id: int, user) -> Review | None:
    """
    Fetches a single review by ID, scoped to the requesting user.

    Why filter by user? So users can't access each other's reviews
    by guessing IDs. /api/reviews/42/ should 404 if review 42
    belongs to someone else — not 403. We don't confirm the record
    exists to avoid leaking information.

    Returns:
        Review instance or None if not found / not owned by user
    """
    try:
        return Review.objects.select_related('user').get(id=review_id, user=user)
    except Review.DoesNotExist:
        return None