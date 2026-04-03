import logging
from apps.reviews.models import Review
from .cache_service import (
    get_cached_review_list,
    set_cached_review_list,
    invalidate_review_list,
    get_cached_review_detail,
    set_cached_review_detail,
)
logger = logging.getLogger(__name__)


def create_review(user, language: str, code_snippet: str, question: str = '') -> Review:
    """
    Creates a Review and dispatches Celery task.
    Invalidates the user's review list cache so next GET is fresh.
    """
    review = Review.objects.create(
        user=user,
        language=language,
        code_snippet=code_snippet,
        question=question,
        status=Review.Status.PENDING,
    )

    logger.info(f"Review #{review.id} created, dispatching to queue")

    invalidate_review_list(user.id)

    from apps.reviews.tasks import process_review_task
    process_review_task.delay(review.id)

    return review


def get_user_reviews(user) -> list:
    """
    Returns review list — from cache if available, otherwise from DB.
    """
    cached = get_cached_review_list(user.id)
    if cached is not None:
        return cached

    from apps.reviews.serializers import ReviewListSerializer
    reviews = (
        Review.objects
        .filter(user=user)
        .select_related('user')
        .order_by('-created_at')
    )

    # Serialize before caching, Querysets can't be pickled (serialized for Redis storage)
    data = ReviewListSerializer(reviews, many=True).data
    data = list(data)

    set_cached_review_list(user.id, data)
    return data


def get_review_detail(review_id: int, user) -> Review | None:
    """
    Returns a review, uses cache only for completed reviews.
    Pending/processing reviews are always fetched fresh from DB
    because their status is actively changing.
    """
    try:
        review = Review.objects.select_related('user').get(
            id=review_id,
            user=user
        )
    except Review.DoesNotExist:
        return None

    return review


def get_cached_or_serialize_review(review, serializer_class) -> dict:
    """
    Returns serialized review data, from cache if completed.
    """
    if review.status != Review.Status.COMPLETED:
        return serializer_class(review).data

    cached = get_cached_review_detail(review.id)
    if cached is not None:
        return cached

    data = dict(serializer_class(review).data)
    set_cached_review_detail(review.id, data)
    return data
