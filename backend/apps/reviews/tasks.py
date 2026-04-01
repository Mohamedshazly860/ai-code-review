import logging
from celery import shared_task
from django.db import transaction
from apps.reviews.models import Review
from services.ai_service import ai_service, AIServiceError

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=10,
    name='reviews.process_review'
)
def process_review_task(self, review_id: int) -> dict:
    """
    Background task that calls the AI and updates the review.

    """

    logger.info(f"Processing review #{review_id}")

    try:
        review = Review.objects.get(id=review_id)
    except Review.DoesNotExist:
        logger.error(f"Review #{review_id} not found — skipping")
        return {'status': 'error', 'message': 'Review not found'}

    review.status = Review.Status.PROCESSING
    review.save(update_fields=['status', 'updated_at'])

    try:
        result = ai_service.generate_review(
            code_snippet=review.code_snippet,
            language=review.language,
            question=review.question,
        )

        with transaction.atomic():
            review.issues = result['issues']
            review.suggestions = result['suggestions']
            review.quality_score = result['quality_score']
            review.summary = result['summary']
            review.raw_response = result['raw_response']
            review.status = Review.Status.COMPLETED
            review.save(update_fields=[
                'issues', 'suggestions', 'quality_score',
                'summary', 'raw_response', 'status', 'updated_at'
            ])

        from services.cache_service import set_cached_review_detail, invalidate_review_list
        from apps.reviews.serializers import ReviewSerializer

        data = dict(ReviewSerializer(review).data)
        set_cached_review_detail(review.id, data)
        invalidate_review_list(review.user_id)

        logger.info(f"Review #{review_id} completed and cached. Score: {result['quality_score']}")
    
    except AIServiceError as e:
        logger.warning(f"Review #{review_id} AI error (attempt {self.request.retries + 1}): {str(e)}")

        if self.request.retries < self.max_retries:
            countdown = 10 * (2 ** self.request.retries)
            logger.info(f"Retrying review #{review_id} in {countdown}s")

            review.status = Review.Status.PENDING
            review.save(update_fields=['status', 'updated_at'])

            raise self.retry(exc=e, countdown=countdown)

        review.status = Review.Status.FAILED
        review.raw_response = str(e)
        review.save(update_fields=['status', 'raw_response', 'updated_at'])
        logger.error(f"Review #{review_id} permanently failed after {self.max_retries} retries")
        return {'status': 'failed', 'review_id': review_id}

    except Exception as e:
        logger.error(f"Review #{review_id} unexpected error: {str(e)}", exc_info=True)
        review.status = Review.Status.FAILED
        review.raw_response = f"Unexpected error: {str(e)}"
        review.save(update_fields=['status', 'raw_response', 'updated_at'])
        return {'status': 'failed', 'review_id': review_id}