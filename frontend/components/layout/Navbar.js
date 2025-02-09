// components/Navbar.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';  // Adjust the import path as needed

const Navbar = () => {
    const { user, login, logout } = useAuth();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const closeDropdown = () => setDropdownOpen(false);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            closeDropdown();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-[#800000] text-white p-2">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <span className="text-2xl font-semibold">MG</span>
                    <Link href="/" className="hover:text-gray-400">
                        Home
                    </Link>
                    <Link href="/about" className="hover:text-gray-400">
                        About
                    </Link>
                    <Link href="/contact" className="hover:text-gray-400">
                        Contact
                    </Link>
                </div>
                <div className="relative">
                    {user ? (
                        <>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center space-x-2 hover:text-gray-400 focus:outline-none"
                                ref={dropdownRef}
                            >
                                <span>Welcome "{user.first_name} {user.last_name}"</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg">
                                    <Link href="auth/updateUserDetail" className="block px-4 py-2 hover:bg-gray-200">
                                        Update User Details
                                    </Link>
                                    <Link href="auth/changePassword" className="block px-4 py-2 hover:bg-gray-200">
                                        Change Password
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 focus:outline-none"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center space-x-2 hover:text-gray-400 focus:outline-none"
                                ref={dropdownRef}
                            >
                                <span>Login</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg">
                                    <Link href="auth/login" className="block px-4 py-2 hover:bg-gray-200">
                                        Login
                                    </Link>
                                    <Link href="auth/register" className="block px-4 py-2 hover:bg-gray-200">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
