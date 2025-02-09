// context/authContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, logoutUser, getUserDetails } from '@/utils/axiosUser';  // Adjust the import path as needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const userDetails = await getUserDetails();
                setUser(userDetails);
            } catch (error) {
                console.log('No user logged in');
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            await loginUser(email, password);
            const userDetails = await getUserDetails();
            setUser(userDetails);
        } catch (error) {
            throw new Error('Login failed');
        }
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
