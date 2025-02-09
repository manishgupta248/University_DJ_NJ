from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Department
from .serializers import DepartmentSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Example: Allow read access to all, require authentication for other operations

    # Optional: Add filtering and ordering
    filterset_fields = ['faculty']  # Enable filtering by faculty
    ordering_fields = ['name', 'created_at']  # Enable ordering by name and created_at
    search_fields = ['name'] # Enable search by name

    # Optional: Customize permission per action
    # def get_permissions(self):
    #     if self.action in ['create', 'update', 'partial_update', 'destroy']:
    #         return [permissions.IsAuthenticated()]  # Only authenticated users can create, update, or delete
    #     return [permissions.AllowAny()]  # Everyone can read