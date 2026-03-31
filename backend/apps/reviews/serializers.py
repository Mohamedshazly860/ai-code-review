# backend/apps/reviews/serializers.py

from rest_framework import serializers
from .models import Review


class ReviewCreateSerializer(serializers.ModelSerializer):
    """
    Handles incoming review submission.
    Only exposes fields the user is allowed to set.
    Everything else (status, scores, AI response) is set by the system.
    """

    class Meta:
        model = Review
        fields = ('language', 'code_snippet', 'question')

    def validate_code_snippet(self, value):
        """
        Reject empty or whitespace-only code.
        A serializer-level validator runs after type checking but before save.
        Named validate_<fieldname> — Django calls it automatically.
        """
        if not value.strip():
            raise serializers.ValidationError("Code snippet cannot be empty.")
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Code snippet is too short to review.")
        return value

    def validate_language(self, value):
        """Ensure the submitted language is one of our defined choices."""
        valid = [choice[0] for choice in Review.Language.choices]
        if value not in valid:
            raise serializers.ValidationError(
                f"Invalid language. Valid options: {', '.join(valid)}"
            )
        return value


class ReviewSerializer(serializers.ModelSerializer):
    """
    Full review representation — returned after submission and on detail view.
    Includes AI response fields (null until completed).
    """
    username = serializers.CharField(source='user.username', read_only=True)
  

    language_display = serializers.CharField(
        source='get_language_display',
        read_only=True
    )

    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )

    class Meta:
        model = Review
        fields = (
            'id',
            'username',
            'language',
            'language_display',
            'code_snippet',
            'question',
            'status',
            'status_display',
            'issues',
            'suggestions',
            'quality_score',
            'summary',
            'created_at',
            'updated_at',
        )
        read_only_fields = fields


class ReviewListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for list views.
    Never return code_snippet in a list — it's large and unnecessary.
    The user can fetch the full detail if they need it.
    """
    language_display = serializers.CharField(
        source='get_language_display',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )

    class Meta:
        model = Review
        fields = (
            'id',
            'language',
            'language_display',
            'status',
            'status_display',
            'quality_score',
            'created_at',
        )
        read_only_fields = fields