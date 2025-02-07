from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
#from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login','date_joined' )}), #'date_joined'
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    readonly_fields = ('date_joined',)
admin.site.register(User, UserAdmin)

# class OutstandingTokenAdmin(admin.ModelAdmin):
#     list_display = ('jti', 'token', 'created', 'expires_at', 'user')

# class BlacklistedTokenAdmin(admin.ModelAdmin):
#     list_display = ('token', 'blacklisted_at')


#admin.site.register(OutstandingToken, OutstandingTokenAdmin)
#admin.site.register(BlacklistedToken, BlacklistedTokenAdmin)
