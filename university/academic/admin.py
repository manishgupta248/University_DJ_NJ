from django.contrib import admin
from .models import Department

# Register your models here.

class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'faculty', 'created_at', 'updated_at')
    search_fields = ('name', 'faculty')
    list_filter = ('faculty',)
    prepopulated_fields = {'slug': ('name',)}  # Automatically populate slug from name
    readonly_fields = ('slug',) # Make slug read-only in the admin (since it's auto-generated)
    fieldsets = (
        (None, {
            'fields': ('name', 'faculty', 'slug')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(Department, DepartmentAdmin)
