// components/LogoutButton.js
import { useRouter } from 'next/router';
import { logoutUser } from '@/utils/axiosUser';  // Adjust the import path as needed

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        logoutUser();
        router.push('dashboard/');  // Redirect to login page after logout
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
