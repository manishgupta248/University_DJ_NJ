// axiosUser.js
import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL for the API
const API_URL = 'http://127.0.0.1:8000/api/auth/';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    config => {
        const accessToken = Cookies.get('access');
        if (accessToken) {
            config.headers['Authorization'] = 'Bearer ' + accessToken;
        }
        return config;
    },
    error => {
        return Promise.reject(error); // Important: Return the rejected promise
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && error.response.data.code === 'token_not_valid') {
            const refreshToken = Cookies.get('refresh');

            if (refreshToken) {
                try {
                    const response = await axiosInstance.post('jwt/refresh/', { refresh: refreshToken });

                    if (response.status === 200) {  // Check for successful refresh
                        Cookies.set('access', response.data.access, { secure: true, sameSite: 'Lax' });
                        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access; // Use .common for all future requests

                        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access; // Update original request's header
                        return axiosInstance(originalRequest); // Retry the original request
                    } else {
                        console.error('Token refresh failed with status:', response.status);
                        logoutUser(); // Logout if refresh fails
                        return Promise.reject(error); // Reject the error to be handled by the caller
                    }
                } catch (refreshError) {
                    console.error('Error during token refresh:', refreshError);
                    logoutUser(); // Logout on any refresh error
                    return Promise.reject(refreshError); // Reject the error
                }
            } else {
                console.log('Refresh token not available.');
                logoutUser(); // Logout if no refresh token
                return Promise.reject(error); // Reject the error
            }
        }

        return Promise.reject(error); // Always reject other errors
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
    delete axiosInstance.defaults.headers.common['Authorization']; // Clear the authorization header from axios instance
    window.location.href = '/auth/login/'; // Or wherever your login page is
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
