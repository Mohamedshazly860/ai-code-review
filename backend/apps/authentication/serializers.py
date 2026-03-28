# backend/apps/authentication/serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()
# Always use get_user_model() — never import User directly.
# This respects AUTH_USER_MODEL and works correctly with custom user models.


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,    # Never returned in response
        min_length=8,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        # .create() would save raw password — ALWAYS use create_user()
        # create_user() hashes the password before saving
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """Read-only serializer for returning user data."""

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'created_at')
        read_only_fields = fields