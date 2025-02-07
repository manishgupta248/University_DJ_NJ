import { useState } from 'react';
import { changeUserPassword } from '@/utils/axiosUser';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== reNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    try {
      await changeUserPassword(currentPassword, newPassword, reNewPassword);
      setSuccess('Password changed successfully!');
      setError(null);
    } catch (err) {
      console.error('Password change error:', err);
      setError('Password change failed. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        {success && <p className="text-green-500 mb-4">{success}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-gray-700">Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm New Password:</label>
            <input
              type="password"
              value={reNewPassword}
              onChange={(e) => setReNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
