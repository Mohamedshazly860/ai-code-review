from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
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
    

class ProfileUpdateView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    # MultiPartParser + FormParser needed for file (avatar) uploads

    def patch(self, request):
        """Partial update — only send fields you want to change."""
        # Get or create the profile
        profile, _ = request.user.profile.__class__.objects.get_or_create(
            user=request.user
        )
        
        # Update only the allowed fields
        allowed_fields = ('first_name', 'last_name', 'phone_number', 'address', 'bio', 'avatar')
        for field in allowed_fields:
            if field in request.data:
                setattr(profile, field, request.data[field])
        
        profile.save()

        # Return full user data with profile info included
        return Response(
            UserSerializer(request.user).data,
            status=status.HTTP_200_OK
        )
