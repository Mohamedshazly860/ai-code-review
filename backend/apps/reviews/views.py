# backend/apps/reviews/views.py

import logging
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from services.review_service import (
    create_review,
    get_user_reviews,
    get_review_detail,
    get_cached_or_serialize_review,
)
from .serializers import ReviewCreateSerializer, ReviewSerializer

logger = logging.getLogger(__name__)


class ReviewListCreateView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        data = get_user_reviews(request.user)
        return Response(data)

    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        review = create_review(
            user=request.user,
            language=serializer.validated_data['language'],
            code_snippet=serializer.validated_data['code_snippet'],
            question=serializer.validated_data.get('question', ''),
        )

        response_serializer = ReviewSerializer(review)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class ReviewDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, review_id):
        review = get_review_detail(review_id, request.user)

        if review is None:
            return Response(
                {'detail': 'Review not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        data = get_cached_or_serialize_review(review, ReviewSerializer)
        return Response(data)


class ReviewStatusView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, review_id):
        review = get_review_detail(review_id, request.user)

        if review is None:
            return Response(
                {'detail': 'Review not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            'id': review.id,
            'status': review.status,
            'status_display': review.get_status_display(),
            'quality_score': review.quality_score,
            **(
                {'completed_at': review.updated_at}
                if review.status == review.Status.COMPLETED
                else {}
            )
        })