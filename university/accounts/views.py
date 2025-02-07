from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.conf import settings
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView

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
    def post(self, request):
        response = Response({"detail": "Successfully logged out."})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response
