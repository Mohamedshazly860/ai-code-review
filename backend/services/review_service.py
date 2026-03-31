import logging
from apps.reviews.models import Review
from .ai_service import ai_service, AIServiceError

logger = logging.getLogger(__name__)


def create_review(user, language: str, code_snippet: str, question: str = '') -> Review:
    """
    Creates a Review, calls the AI, and updates the record.
    Status transitions: PENDING → PROCESSING → COMPLETED (or FAILED)
    """
    review = Review.objects.create(
        user=user,
        language=language,
        code_snippet=code_snippet,
        question=question,
        status=Review.Status.PENDING,
    )
    logger.info(f"Review #{review.id} created for user '{user.username}'")

    review.status = Review.Status.PROCESSING
    review.save(update_fields=['status'])
    

    try:
        result = ai_service.generate_review(
            code_snippet=code_snippet,
            language=language,
            question=question,
        )

        review.issues = result['issues']
        review.suggestions = result['suggestions']
        review.quality_score = result['quality_score']
        review.raw_response = result['raw_response']
        review.status = Review.Status.COMPLETED
        review.save(update_fields=[
            'issues', 'suggestions', 'quality_score',
            'raw_response', 'status', 'updated_at'
        ])

        logger.info(f"Review #{review.id} completed. Score: {result['quality_score']}")

    except AIServiceError as e:
        review.status = Review.Status.FAILED
        review.raw_response = str(e)
        review.save(update_fields=['status', 'raw_response', 'updated_at'])
        logger.error(f"Review #{review.id} failed: {str(e)}")

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