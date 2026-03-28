import logging
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from services.review_service import create_review, get_user_reviews, get_review_detail
from .serializers import ReviewCreateSerializer, ReviewSerializer, ReviewListSerializer

logger = logging.getLogger(__name__)


class ReviewListCreateView(APIView):
    """
    GET  /api/reviews/        → list all reviews for the authenticated user
    POST /api/reviews/        → submit a new code review
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        reviews = get_user_reviews(request.user)
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)

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

        # Return the full review representation, not the input serializer
        response_serializer = ReviewSerializer(review)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class ReviewDetailView(APIView):
    """
    GET /api/reviews/<id>/    → retrieve a single review with full AI response
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, review_id):
        review = get_review_detail(review_id, request.user)

        if review is None:
            # Return 404 whether the review doesn't exist OR belongs to someone else.
            # Never return 403 here — that confirms the record exists.
            return Response(
                {'detail': 'Review not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ReviewSerializer(review)
        return Response(serializer.data)