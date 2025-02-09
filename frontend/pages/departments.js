"use client";
import { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartment } from '../utils/axiosDepartment';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/authContext';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [facultyChoices, setFacultyChoices] = useState([]);
  const [departmentForm, setDepartmentForm] = useState({ name: '', faculty: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
      const fetchDepartments = async () => {
          try {
              const data = await getDepartments();
              setDepartments(data);

              if (data && data.length > 0 && data[0].faculty_choices) {
                  setFacultyChoices(data[0].faculty_choices);
              } else {
                  console.warn("Faculty choices not found in the API response:", data);
              }

          } catch (err) {
              setError(err);
              toast.error("Failed to load departments.");
          } finally {
              setLoading(false);
          }
      };

      fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
      setDepartmentForm({
          ...departmentForm,
          [e.target.name]: e.target.value,
      });
  };

  const isAuthenticated = !!user;

  const handleCreate = async () => {
      if (!isAuthenticated) {
          toast.error("You must be authenticated to create a department.");
          return;
      }
      try {
          const newDepartment = await createDepartment(departmentForm);
          setDepartments([...departments, newDepartment]);
          setDepartmentForm({ name: '', faculty: '' });
          toast.success("Department created successfully!");
      } catch (err) {
          setError(err);
          toast.error("Failed to create department.");
      }
  };

  const handleUpdate = async () => {
      if (!isAuthenticated) {
          toast.error("You must be authenticated to update a department.");
          return;
      }
      try {
          const updatedDepartment = await updateDepartment(editingDepartmentId, departmentForm);
          setDepartments(departments.map(dept => 
              dept.id === updatedDepartment.id ? updatedDepartment : dept
          ));
          setDepartmentForm({ name: '', faculty: '' });
          setIsEditing(false);
          setEditingDepartmentId(null);
          toast.success("Department updated successfully!");
      } catch (err) {
          setError(err);
          toast.error("Failed to update department.");
      }
  };

  const handleDelete = async (id) => {
      if (!isAuthenticated) {
          toast.error("You must be authenticated to delete a department.");
          return;
      }
      try {
          await deleteDepartment(id);
          setDepartments(departments.filter(dept => dept.id !== id));
          toast.success("Department deleted successfully!");
      } catch (err) {
          setError(err);
          toast.error("Failed to delete department.");
      }
  };

  const handleEdit = async (id) => {
      setIsEditing(true);
      setEditingDepartmentId(id);
      try {
          const department = await getDepartment(id);
          setDepartmentForm(department);
      } catch (err) {
          setError(err);
          toast.error("Failed to load department for editing.");
      }
  };

  const handleCancelEdit = () => {
      setIsEditing(false);
      setEditingDepartmentId(null);
      setDepartmentForm({ name: '', faculty: '' });
  };

  const showDepartmentDetails = (department) => {
      toast(
          <div className='flex, bg-yellow-300 p-4'>
              <h3 className="font-bold ">{department.name}</h3>
              <p>Faculty: {department.faculty}</p>
              <p>Slug: {department.slug}</p>
              <p>Created At: {new Date(department.created_at).toLocaleString()}</p>
              <p>Updated At: {new Date(department.updated_at).toLocaleString()}</p>
          </div>, 
          { duration: 5000 }
      );
  };

  if (loading || authLoading) {
      return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
      return <div className="text-red-500 text-center py-4">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
        <h1 className="text-2xl text-[#800000] font-semibold mb-4">Manage Departments</h1>

        <form onSubmit={(e) => { e.preventDefault(); isEditing ? handleUpdate() : handleCreate(); }} className="mb-4 bg-white p-4 rounded ">
            <input
                type="text"
                name="name"
                placeholder="Department Name"
                value={departmentForm.name}
                onChange={handleInputChange}
                required
                className="border border-gray-900 px-3 py-2 rounded mb-2 w-full"
            />
            <select name="faculty" value={departmentForm.faculty} onChange={handleInputChange} required className="border border-gray-900 px-3 py-2 rounded mb-2 w-full">
                <option value="">Select Faculty</option>
                {facultyChoices && facultyChoices.length > 0 ? (
                    facultyChoices.map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))
                ) : null}
            </select>

            <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded mr-2">
                    {isEditing ? "Update" : "Create"}
                </button>
                {isEditing && (
                    <button onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                        Cancel Edit
                    </button>
                )}
            </div>
        </form>
        <hr className=" border-t-1 border-[#800000] my-6 "/>
        <table className="table-auto w-full border-collapse border border-green-400">
            <thead>
                <tr className="bg-[#800000] ">
                    <th className="border border-green-400 text-white px-4 py-2">Name</th>
                    <th className="border border-green-400 text-white px-4 py-2">Faculty</th>
                    <th className="border border-green-400 text-white px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {departments && departments.length > 0 ? (
                    departments.map((department) => (
                      <tr key={department.id} className="border-b border-green-400 hover:bg-gray-50 cursor-pointer" onClick={() => showDepartmentDetails(department)}>
                            <td className="border border-green-400 px-4 py-2">{department.name}</td>
                            <td className="border border-green-400 px-4 py-2">{department.faculty}</td>
                            <td className="border border-green-400 px-4 py-2">
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(department.id); }} className="bg-yellow-500 hover:bg-yellow-700 text-white  py-1 px-2 rounded mr-1">
                                    Edit 
                                </button> |
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(department.id); }} className="bg-red-500 hover:bg-red-700 text-white  py-1 px-2 rounded">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="border border-green-400 px-4 py-2 text-center">
                            No departments available.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
  );
};

export default DepartmentsPage;
