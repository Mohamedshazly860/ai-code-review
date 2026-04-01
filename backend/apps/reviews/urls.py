from django.urls import path
from .views import ReviewListCreateView, ReviewDetailView, ReviewStatusView

urlpatterns = [
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('reviews/<int:review_id>/', ReviewDetailView.as_view(), name='review-detail'),
    path('reviews/<int:review_id>/status/', ReviewStatusView.as_view(), name='review-status'),
]