# backend/apps/authentication/serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile

User = get_user_model()


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
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """Read-only serializer for returning user data."""

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'created_at')
        read_only_fields = fields

class ProfileSerializer(serializers.ModelSerializer):
    """Read serializer — returns profile + user info combined."""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    created_at = serializers.DateTimeField(source='user.created_at', read_only=True)
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = (
            'username',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'address',
            'bio',
            'avatar',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('username', 'email', 'created_at', 'updated_at')


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Write serializer — only updatable fields."""
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'phone_number', 'address', 'bio', 'avatar')

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance