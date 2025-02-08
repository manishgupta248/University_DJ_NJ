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
