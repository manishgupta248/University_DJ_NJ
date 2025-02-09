// axiosDepartment.js
import axios from 'axios';
import Cookies from 'js-cookie'; // If you're using cookies for auth

const API_URL = 'http://127.0.0.1:8000/api/'; // Your API base URL

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
    withCredentials: true, // If using cookies for auth
});

// Request interceptor (if needed for authentication)
axiosInstance.interceptors.request.use(
    config => {
        const accessToken = Cookies.get('access'); // Or however you store your token
        if (accessToken) {
            config.headers['Authorization'] = 'Bearer ' + accessToken;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


// Function to get all departments (including faculty choices)
export const getDepartments = async () => {
    try {
        const response = await axiosInstance.get('departments/');
        return response.data; // This will include the faculty choices
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

// Function to get a single department
export const getDepartment = async (id) => {
  try {
    const response = await axiosInstance.get(`departments/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching department:", error);
    throw error;
  }
};


// Function to create a new department
export const createDepartment = async (departmentData) => {
    try {
        const response = await axiosInstance.post('departments/', departmentData);
        return response.data;
    } catch (error) {
        console.error("Error creating department:", error);
        throw error;
    }
};

// Function to update a department
export const updateDepartment = async (id, departmentData) => {
    try {
        const response = await axiosInstance.put(`departments/${id}/`, departmentData); // Or patch for partial update
        return response.data;
    } catch (error) {
        console.error("Error updating department:", error);
        throw error;
    }
};

// Function to delete a department
export const deleteDepartment = async (id) => {
    try {
        await axiosInstance.delete(`departments/${id}/`);
        return; // No data returned on successful delete
    } catch (error) {
        console.error("Error deleting department:", error);
        throw error;
    }
};
