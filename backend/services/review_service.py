import logging
from apps.reviews.models import Review
from apps.reviews.tasks import process_review_task

logger = logging.getLogger(__name__)


def create_review(user, language: str, code_snippet: str, question: str = '') -> Review:
    """
    Creates a Review record and dispatches it to the Celery queue.
    Returns immediately with status: PENDING.
    The AI processing happens in the background.
    """
    review = Review.objects.create(
        user=user,
        language=language,
        code_snippet=code_snippet,
        question=question,
        status=Review.Status.PENDING,
    )

    logger.info(f"Review #{review.id} created, dispatching to queue")


    process_review_task.delay(review.id)

    return review


def get_user_reviews(user):
    return (
        Review.objects
        .filter(user=user)
        .select_related('user')
        .order_by('-created_at')
    )


def get_review_detail(review_id: int, user) -> Review | None:
    try:
        return Review.objects.select_related('user').get(id=review_id, user=user)
    except Review.DoesNotExist:
        return None