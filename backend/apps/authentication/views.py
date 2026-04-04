from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = (AllowAny,)
    # Override the global IsAuthenticated default.
    # You obviously can't require auth to register — chicken-and-egg.

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        # Generate JWT tokens immediately after registration
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)


class ProfileView(APIView):
    # No permission_classes override → uses global IsAuthenticated
    # Only authenticated users can see their profile

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)