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
    # Include profile fields if they exist
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'created_at', 'first_name', 'last_name', 'phone_number', 'address', 'bio', 'avatar')
        read_only_fields = fields

    def get_first_name(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.first_name if profile else None

    def get_last_name(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.last_name if profile else None

    def get_phone_number(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.phone_number if profile else None

    def get_address(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.address if profile else None

    def get_bio(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.bio if profile else None

    def get_avatar(self, obj):
        profile = getattr(obj, 'profile', None)
        if profile and profile.avatar:
            return profile.avatar.url if hasattr(profile.avatar, 'url') else str(profile.avatar)
        return None

