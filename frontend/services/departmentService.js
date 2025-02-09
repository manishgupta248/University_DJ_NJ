// departmentService.js
import departmentAxios from "@/utils/departmentAxios";

// Fetch all departments
export const getDepartments = async () => {
  try {
    const response = await departmentAxios.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Fetch faculty choices
export const getFacultyChoices = async () => {
  try {
    const response = await departmentAxios.get('/faculty/');
    return response.data;
  } catch (error) {
    console.error('Error fetching faculty choices:', error);
    throw error;
  }
};
// Fetch a single department by ID
export const getDepartmentById = async (id) => {
  try {
    const response = await departmentAxios.get(`/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department with ID ${id}:`, error);
    throw error;
  }
};

// Create a new department
export const createDepartment = async (departmentData) => {
  try {
    const response = await departmentAxios.post('/', departmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Update an existing department
export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await departmentAxios.put(`/${id}/`, departmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating department with ID ${id}:`, error);
    throw error;
  }
};

// Delete a department
export const deleteDepartment = async (id) => {
  try {
    const response = await departmentAxios.delete(`/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting department with ID ${id}:`, error);
    throw error;
  }
};
