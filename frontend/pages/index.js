// pages/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import Login from '@/components/Login';
import { getUserDetails } from '@/utils/axiosUser';  // Adjust the import path as needed

const Home = () => {
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-green-200 rounded-lg shadow-md p-8 text-center">
                {user ? (
                <>
                    <h2 className="text-2xl font-bold mb-8">
                        Welcome, {user.first_name}!
                    </h2>
                    <LogoutButton />
                    </>
                ) : (
                    <div >
                        <h2 className="text-2xl font-bold mb-8">Welcome to My Site!</h2>
                    <div className="flex flex-col-2 items-center justify-center">
                        <div className='px-auto'>
                        <Link href="auth/login" legacyBehavior>
                            <a className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                               Login
                            </a>
                        </Link>
                        </div>
                        <div className='px-8'>
                        <Link href="auth/register" legacyBehavior>
                            <a className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                               Register
                            </a>
                        </Link>
                        </div>
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
