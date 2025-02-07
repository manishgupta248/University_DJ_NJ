import { useState, useEffect } from 'react';
import { updateUserProfile } from '@/utils/axiosUser';
import axiosInstance from '@/utils/axiosUser';

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/users/me/');
        setUser(response.data);
        setEmail(response.data.email);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(email, firstName, lastName);
      setSuccess('Profile updated successfully!');
      setError(null);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Profile update failed. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {user ? (
        <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">User Details</h2>
          {success && <p className="text-green-500 mb-4">{success}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
            >
              Update Profile
            </button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDetail;
