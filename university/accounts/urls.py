from django.urls import path, include
from accounts.views import CustomTokenObtainPairView, LogoutView

urlpatterns = [
    path('auth/', include('djoser.urls')),  # Provides user-related endpoints
    path('auth/', include('djoser.urls.jwt')),  # Provides JWT authentication endpoints
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/jwt/logout/', LogoutView.as_view(), name='logout'),
]