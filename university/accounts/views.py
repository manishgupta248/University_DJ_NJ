from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.conf import settings
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from djoser.views import UserViewSet
from rest_framework import status

def set_jwt_cookies(response, user):
    refresh = RefreshToken.for_user(user)
    response.set_cookie(
        key='access_token',
        value=str(refresh.access_token),
        httponly=True,
        secure=settings.SECURE_COOKIE,  # Use the updated setting
    )
    response.set_cookie(
        key='refresh_token',
        value=str(refresh),
        httponly=True,
        secure=settings.SECURE_COOKIE,  # Use the updated setting
    )

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        try:
            user = User.objects.get(email=request.data['email'])
            set_jwt_cookies(response, user)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)
        return response

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get refresh token from the cookie
            refresh_token = request.COOKIES.get('refresh')
            if not refresh_token:
                return Response({'error': 'No refresh token found'}, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            # Clear cookies
            response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
            response.delete_cookie('access')
            response.delete_cookie('refresh')
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class CustomUserViewSet(UserViewSet):
    def get_permissions(self):
        if self.action == 'create':  # Allow anyone to sign up
            return [AllowAny()]
        return [IsAuthenticated()]