// pages/dashboard.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { getUserDetails, logoutUser } from '@/utils/axiosUser'  // Adjust the import path as needed

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetails = await getUserDetails();
                setUser(userDetails);
            } catch (error) {
                console.log('User not authenticated');
            }
        };

        fetchUserDetails();
    }, []);

    const handleLogout = () => {
        logoutUser();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-green-200 rounded-lg shadow-md p-8 text-center">
                {user ? (
                    <>
                        <h2 className="text-2xl font-bold mb-8">
                            Welcome, {user.first_name} {user.last_name} !
                        </h2>
                        
                        <LogoutButton />
                      <div className='flex flex-col-2 p-2 my-4 '>
                          <div className='mx-auto'>
                          <Link href="auth/updateUserDetail" legacyBehavior>
                              <a className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                                  Update Details
                              </a>
                          </Link>
                          </div>
                          <div className='mx-auto'>
                          <Link href="auth/changePassword" legacyBehavior>
                              <a className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                                  Change Password
                              </a>
                          </Link>
                          </div>
                        </div>
                        {/* <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            Logout
                        </button> */}
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-8">Welcome to Our Site!</h2>
                        <Link href="/login" legacyBehavior>
                            <a className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                                Login
                            </a>
                        </Link>
                        <Link href="/register" legacyBehavior>
                            <a className="mt-4 w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                                Register
                            </a>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
