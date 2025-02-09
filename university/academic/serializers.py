# academic/serializers.py
from rest_framework import serializers
from .models import Department

class DepartmentSerializer(serializers.ModelSerializer):
    faculty = serializers.ChoiceField(choices=Department.Faculty.choices)

    class Meta:
        model = Department
        fields = ('id', 'name', 'faculty', 'slug', 'created_at', 'updated_at')  # List the fields
        # Or you can exclude fields:
        #exclude = ('created_at', 'updated_at')
    
    def to_representation(self, instance):  # Add this method
        representation = super().to_representation(instance)
        representation['faculty_choices'] = Department.Faculty.choices  # Include choices
        return representation