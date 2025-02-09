from django.urls import path, include
from accounts.views import CustomTokenObtainPairView, LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('auth/', include('djoser.urls')),  # Provides user-related endpoints
    path('auth/', include('djoser.urls.jwt')),  # Provides JWT authentication endpoints
    path('auth/jwt/create/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/jwt/logout/', LogoutView.as_view(), name='logout'),
]