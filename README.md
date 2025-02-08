# A Django project 'university' having app 'backend 'in NaxtJS

# Custom user Model is developed in Django app 'accounts'. and restful APIs endpoints generated through Djoser. JWT authentication Tokens are used. And Django-cors-headers are being used for allow API calls from frontend. 
**********************************************************
        Step-1  Setup Django as Backend
**********************************************************
1.	Navigate to Project directory and run following commands in Terminal
    > py -m venv .venv				# Create Virtual Environment(VE)
    > .venv\Scripts\activate			# Activate VE
    > pip install django				# Install Django
    > django-admin startproject university	     # Create a Django project
    > cd university			    # Navigate to Project Directory
    > py manage.py startapp accounts		# Create a Django app:
    > pip install djangorestfarmework		# Install Rest Framework
    > pip install djoser				# Install Djoser
    > pip install django-cors-headers		# Install Cors-Headers
    > pip install djangorestframework_simpleljwt * 

        *Djoser is sufficient for basic JWT authentication, but using djangorestframework_simplejwt alongside Djoser can enhance your authentication setup by providing more robust token management features
    --------------------------------------------------------------------
2.  Update settings.py - To implement a user authentication system for your NextJS frontend using
    RESTful APIs, JWT authentication with Django REST Framework (DRF), Djoser, and CORS headers, you'll need to configure several settings in your settings.py file

    INSTALLED_APPS = [
    ...
    'django.contrib.staticfiles',
    # other apps
    'rest_framework',
    'djoser',
    'corsheaders',                                  # Add this
    'rest_framework.authtoken',                     # Required for Djoser
    'rest_framework_simplejwt',                     # If using Simple JWT with Djoser
    #'rest_framework_simplejwt.token_blacklist',    # model to manage blacklisted tokens.
    'django.contrib.sites',                         # Required for email-based activation (if needed)
    'accounts',                                     # Your custom app
    ]

    MIDDLEWARE = [
    
    'corsheaders.middleware.CorsMiddleware',        # Add this on top
    'django.middleware.security.SecurityMiddleware',
    ....
    ]
    # My other Settengs

    # Configure DRF and Djoser
    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework_simplejwt.authentication.JWTAuthentication',
        ),
        'DEFAULT_PERMISSION_CLASSES': (
            'rest_framework.permissions.IsAuthenticated',
        ),
        'DEFAULT_PERMISSION_CLASSES_BY_ACTION': {  # Change this to by action
            'djoser.views.UserViewSet': {  # Change this to UserViewSet
                'create': 'rest_framework.permissions.AllowAny',
            },
        },
    }
    from datetime import timedelta
    SIMPLE_JWT = {
        'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
        'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
        'ROTATE_REFRESH_TOKENS': True,
        'BLACKLIST_AFTER_ROTATION': True,
        'ALGORITHM':  'HS256',
        'SIGNING_KEY': SECRET_KEY,
        'VERIFYING_KEY': None,
        'AUTH_HEADER_TYPES': ('Bearer',),   # ('JWT',),
        'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
        'USER_ID_FIELD': 'id',
        'USER_ID_CLAIM': 'user_id',
        'SLIDING_TOKEN_LIFETIME': timedelta(minutes=30),
        'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=7),
        'AUTH_TOKEN_TYPES': ('access', 'refresh'),
        'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    }

    AUTH_USER_MODEL = 'accounts.User'                   # Point to your custom user model
    SITE_ID = 1  # Required for email-related authentication actions
    # Djoser settings
    DJOSER = {
        'USER_ID_FIELD': 'id',
        'LOGIN_FIELD': 'email',
        'USER_CREATE_PASSWORD_RETYPE': True,            # Ensures password confirmation during signup
        'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
        'USERNAME_RESET_CONFIRM_URL': 'email/reset/confirm/{uid}/{token}',
        'ACTIVATION_URL': 'activate/{uid}/{token}',
        'SEND_ACTIVATION_EMAIL': False,                 # Set to True if email activation is required
        'SERIALIZERS': {
            'user_create': 'accounts.serializers.UserCreateSerializer',  # Override if needed
            'user': 'accounts.serializers.UserSerializer',
            'current_user': 'accounts.serializers.UserSerializer',
        },
    }

    # CORS settings
    CORS_ALLOW_CREDENTIALS = True  # Important for HttpOnly cookies
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000", # Or your Next.js frontend URL
        "http://127.0.0.1:3000",
    ]
    CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]

    # Set this to True if you are using HTTPS
    SECURE_COOKIE = True  # or True if you are using HTTPS

    # For email backend (if you enable email verification/confirmation)
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend' # Or use a real email backend
    -------------------------------------------------------------------------------------
3.  Create a Custom User Model - In accounts/models.py, define a custom user model with first_name,
    last_name, and email as the username:

    from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
    from django.db import models
    from django.utils.translation import gettext_lazy as _

    class UserManager(BaseUserManager):
        """
        Custom user model manager where email is the unique identifier
        for authentication instead of usernames.
        """

        def create_user(self, email, password=None, **extra_fields):
            """
            Create and save a user with the given email and password.
            """
            if not email:
                raise ValueError(_("The Email field must be set"))
            email = self.normalize_email(email)
            user = self.model(email=email, **extra_fields)
            user.set_password(password)
            user.save(using=self._db)
            return user

        def create_superuser(self, email, password=None, **extra_fields):
            """
            Create and save a SuperUser with the given email and password.
            """
            extra_fields.setdefault('is_staff', True)
            extra_fields.setdefault('is_superuser', True)
            extra_fields.setdefault('is_active', True)

            if extra_fields.get('is_staff') is not True:
                raise ValueError(_("Superuser must have is_staff=True."))
            if extra_fields.get('is_superuser') is not True:
                raise ValueError(_("Superuser must have is_superuser=True."))

            return self.create_user(email, password, **extra_fields)


    class User(AbstractBaseUser, PermissionsMixin):
        """
        Custom user model that uses email as the unique identifier instead of a username.
        """

        email = models.EmailField(_('email address'), unique=True)
        first_name = models.CharField(_('first name'), max_length=30, blank=True)
        last_name = models.CharField(_('last name'), max_length=30, blank=True)
        is_active = models.BooleanField(_('active'), default=True)
        is_staff = models.BooleanField(_('staff status'), default=False)
        is_superuser = models.BooleanField(_('superuser status'), default=False)
        date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)

        # Use email as the username field
        USERNAME_FIELD = 'email'
        REQUIRED_FIELDS = ['first_name', 'last_name']

        objects = UserManager()

        def __str__(self):
            return self.email

        def get_full_name(self):
            """
            Return the first_name plus the last_name, with a space in between.
            """
            return f"{self.first_name} {self.last_name}"

        def get_short_name(self):
            """
            Return the short name for the user (first name).
            """
            return self.first_name

        class Meta:
            verbose_name = _('user')
            verbose_name_plural = _('users')
    -----------------------------------------------------------------------------
4.  Create Serializers - In accounts/serializers.py, create serializers for the custom user model:

    from rest_framework import serializers
    from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
    from .models import User

    class UserCreateSerializer(BaseUserCreateSerializer):
        first_name = serializers.CharField(required=True)
        last_name = serializers.CharField(required=True)

        class Meta:
            model = User
            fields = ('email', 'first_name', 'last_name', 'password')

    class UserSerializer(BaseUserSerializer):
        class Meta:
            model = User
            fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'date_joined')
            read_only_fields = ('is_active', 'is_staff', 'date_joined')
    --------------------------------------------------------------------------
5.  Update admin.py - Register your custom user model in the admin panel:
    
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
    ---------------------------------------------------------------------------
6.  Update views.py- in accounts/views.py:

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
    -------------------------------------------------------------------
7.  Configure URLs – in accounts/urls.py include 

    from django.urls import path, include
    from accounts.views import CustomTokenObtainPairView, LogoutView

    urlpatterns = [
        path('auth/', include('djoser.urls')),  # Provides user-related endpoints
        path('auth/', include('djoser.urls.jwt')),  # Provides JWT authentication endpoints
        path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('auth/logout/', LogoutView.as_view(), name='logout'),
    ]
    --------------------------------------------------------------------
8.  Add accounts app urls in University urls: university/urls.py  

    from django.contrib import admin
    from django.urls import path, include

    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('accounts.urls')),
    ]
    --------------------------------------------------------------------
9.  Make Migrations and create superuser-  run following commands in Django terminal
    > py manage.py makemigrations accounts
    > py manage.py migrate
    > py manage.py createsuperuser
    > py manage.py runserver
    ----------------------------------------------------------------------

**********************************************************************************
        Step-2  Setup 'frontend' with NextJS
**********************************************************************************
# Frontend is setup in app 'frontend' with NextJS. TailwindCSS is being usd for styling pages.    'Axios' is usedf to make APIs Calls. localStorage is used for Token storage

1.   Create a Next.js App(with default TailwindCSS) - Open your terminal and run the following
     command to create a new Next.js app:

    > yarn create next-app frontend
    > cd frontend
    > yarn add axios					 # install axios dependacy to make APIs cll
    ---------------------------------------------------
2.  Create the axiosUser.js File - Create a new file named axiosUser.js in the utils directory

    import axios from 'axios';

    // Base URL for the API
    const API_URL = 'http://127.0.0.1:8000/api/auth/';

    // Create an instance of axios
    const axiosInstance = axios.create({
        baseURL: API_URL,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            accept: 'application/json'
        }
    });

    // Request interceptor for adding Authorization header
    axiosInstance.interceptors.request.use(
        config => {
            const accessToken = localStorage.getItem('access');
            if (accessToken) {
                config.headers['Authorization'] = 'Bearer ' + accessToken;
            }
            return config;
        },
        error => {
            Promise.reject(error)
        });

    // Response interceptor for handling auto token refresh
    axiosInstance.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;
            if (error.response.status === 401 && originalRequest.url === API_URL + 'jwt/refresh/') {
                // Redirect to login if refresh token fails
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/login/';
                return Promise.reject(error);
            }

            if (error.response.data.code === 'token_not_valid' &&
                error.response.status === 401 &&
                error.response.statusText === 'Unauthorized') {
                const refreshToken = localStorage.getItem('refresh');

                if (refreshToken) {
                    const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                    // Expiration time in seconds
                    const now = Math.ceil(Date.now() / 1000);
                    if (tokenParts.exp > now) {
                        return axiosInstance
                            .post('/jwt/refresh/', { refresh: refreshToken })
                            .then((response) => {
                                localStorage.setItem('access', response.data.access);
                                axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.data.access;
                                originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
                                return axiosInstance(originalRequest);
                            })
                            .catch(err => {
                                console.log(err)
                            });
                    } else {
                        console.log('Refresh token is expired', tokenParts.exp, now);
                        window.location.href = '/login/';
                    }
                } else {
                    console.log('Refresh token not available.')
                    window.location.href = '/login/';
                }
            }

            return Promise.reject(error);
        });

    // Function for user registration
    export const registerUser = async (userData) => {
        try {
            const response = await axiosInstance.post('users/', userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    };

    // Function for user login
    export const loginUser = async (email, password) => {
        try {
            const response = await axiosInstance.post('jwt/create/', { email, password });
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    };

    // Function for user logout
    export const logoutUser = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login/';
    };

    // Function to fetch user details
    export const getUserDetails = async () => {
        try {
            const response = await axiosInstance.get('users/me/');
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    };

    // Function to change user password
    export const changePassword = async (passwordData) => {
        try {
            const response = await axiosInstance.post('users/set_password/', passwordData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    };
    // Function to update user details
    export const updateUserDetails = async (userData) => {
        try {
            const response = await axiosInstance.patch('users/me/', userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    };
    ---------------------------------------------------------------------
3.  Create pages/login.js
    
    import { useState } from 'react';
    import { useRouter } from 'next/router';
    import { loginUser } from '@/utils/axiosUser';

    const Login = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const router = useRouter();

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');

            try {
                await loginUser(email, password);
                router.push('/dashboard');  // Redirect to dashboard or another page after login
            } catch (err) {
                setError('Invalid email or password');
            }
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-green-200 rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-8 text-center">Login</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    export default Login;
    ---------------------------------------------------------------------------------
4.    // pages/auth/register.js
    import { useState } from 'react';
    import { useRouter } from 'next/router'
    import { registerUser } from '@/utils/axiosUser';  // Adjust the import path as needed

    const Register = () => {
        const [email, setEmail] = useState('');
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [password, setPassword] = useState('');
        const [rePassword, setRePassword] = useState('');
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
        const router = useRouter();

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setSuccess('');

            if (password !== rePassword) {
                setError('Passwords do not match');
                return;
            }

            try {
                await registerUser({ email, first_name: firstName, last_name: lastName, password, re_password: rePassword });
                setSuccess('Registration successful! Redirecting to login page...');
                setTimeout(() => {
                    router.push('/login');  // Redirect to login page after successful registration
                }, 2000);
            } catch (err) {
                setError('Failed to register user: ' + (err.detail || JSON.stringify(err)));
            }
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-green-200 rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-8 text-center">Register</h2>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="rePassword"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                required
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    export default Register;
    ------------------------------------------------------------------------------

***************************************************************************************
    Step-3  Git Implemantation
***************************************************************************************
1.  create .gitignore file 
    > echo > .gitignore
    and add following 
    # Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Django stuff:
*.log
local_settings.py
db.sqlite3
*.pyc

# Static files:
staticfiles/

# Media files:
media/

# Virtual environment
venv/
env/
ENV/
.venv/

# VS Code settings
.vscode/

# PyCharm settings
.idea/

# macOS specific files
.DS_Store

# Windows specific files
Thumbs.db

# Other custom files
*.swp

# Node modules and Yarn
node_modules/
.yarn/
.yarnrc.yml

# Next.js build output
.next/
out/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Yarn integrity file
.yarn-integrity

# Dependencies
package-lock.json
yarn.lock

# Test coverage
coverage/

# Lint
.eslintcache

# Temporary files
.tmp/

# Ignore build directories
build/
dist/
*.egg-info/

# Ignore dotenv files for environment variables
.env

# Django migrations
**/migrations/

# Tailwind CSS generated files
.tailwindcache/
-----------------------------------------------------------------
2.  To remove the .git directory from your Next.jsapp: Navigate to your Next.jsapp directory:
    > Remove-Item -Recurse -Force .git
3.  create requirement.txt file for Django
    > pip freeze > requirements.txt
    > git init
    > git add .
    > git commit -m "Implemated Auth with Djoser"
    > git branch -M main
    > git remote add origin https://github.com/manishgupta248/University_DJ_NJ.git
    > git push -u origin main
4. push an existing repository from the command line
    > git remote add origin https://github.com/manishgupta248/University_DJ_NJ.git
    > git branch -M main
    > git push -u origin main

**********************************************************************************
    Stage-3     Implement httpOnly Cookie for Token Storage
*********************************************************************************
1. At backend
    > pip install djangorestframework-simplejwt

2.  Update settings.py: Ensure you have the following configurations:
    SIMPLE_JWT = {
        .....
        'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=7),
        'AUTH_TOKEN_TYPES': ('access', 'refresh'),
        'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
        # Additional settings for httpOnly
        'AUTH_COOKIE_SECURE': not DEBUG,  # Secure in production
        'AUTH_COOKIE_HTTP_ONLY': True,
        'AUTH_COOKIE_SAMESITE': 'Lax',
    }

3.  NextJs Frontend
    >  yarn add js-cookie

4.  updated axiosUser.js for httpOnly cookie

        // axiosUser.js
        import axios from 'axios';
        import Cookies from 'js-cookie';

        // Base URL for the API
        const API_URL = 'http://127.0.0.1:8000/api/auth/';

        // Create an instance of axios
        const axiosInstance = axios.create({
            baseURL: API_URL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            withCredentials: true,  // Enable cookies
        });

        // Request interceptor for adding Authorization header
        axiosInstance.interceptors.request.use(
            config => {
                const accessToken = Cookies.get('access');
                if (accessToken) {
                    config.headers['Authorization'] = 'Bearer ' + accessToken;
                }
                return config;
            },
            error => {
                Promise.reject(error)
            }
        );

        // Response interceptor for handling auto token refresh
        axiosInstance.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (error.response.status === 401 && error.response.data.code === 'token_not_valid' && error.response.statusText === 'Unauthorized') {
                    const refreshToken = Cookies.get('refresh');

                    if (refreshToken) {
                        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
                        const now = Math.ceil(Date.now() / 1000);

                        if (tokenParts.exp > now) {
                            return axiosInstance
                                .post('jwt/refresh/', { refresh: refreshToken })
                                .then((response) => {
                                    Cookies.set('access', response.data.access, { secure: true, sameSite: 'Lax' });
                                    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.data.access;
                                    originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
                                    return axiosInstance(originalRequest);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        } else {
                            console.log('Refresh token is expired', tokenParts.exp, now);
                            window.location.href = 'auth/login/';
                        }
                    } else {
                        console.log('Refresh token not available.');
                        window.location.href = 'auth/login/';
                    }
                }

                return Promise.reject(error);
            }
        );

        // Function for user registration
        export const registerUser = async (userData) => {
            try {
                const response = await axiosInstance.post('users/', userData);
                return response.data;
            } catch (error) {
                throw error.response.data;
            }
        };

        // Function for user login
        export const loginUser = async (email, password) => {
            try {
                const response = await axiosInstance.post('jwt/create/', { email, password });
                Cookies.set('access', response.data.access, { secure: true, sameSite: 'Lax' });
                Cookies.set('refresh', response.data.refresh, { secure: true, sameSite: 'Lax' });
                return response.data;
            } catch (error) {
                throw error.response.data;
            }
        };

        // Function for user logout
        export const logoutUser = () => {
            Cookies.remove('access');
            Cookies.remove('refresh');
            window.location.href = 'auth/login/';
        };

        // Function to fetch user details
        export const getUserDetails = async () => {
            try {
                const response = await axiosInstance.get('users/me/');
                return response.data;
            } catch (error) {
                throw error.response.data;
            }
        };

        // Function to change user password
        export const changePassword = async (passwordData) => {
            try {
                const response = await axiosInstance.post('users/set_password/', passwordData);
                return response.data;
            } catch (error) {
                throw error.response.data;
            }
        };

        // Function to update user details
        export const updateUserDetails = async (userData) => {
            try {
                const response = await axiosInstance.patch('users/me/', userData);
                return response.data;
            } catch (error) {
                throw error.response.data;
            }
        };
    ----------------------------------------------------------------------