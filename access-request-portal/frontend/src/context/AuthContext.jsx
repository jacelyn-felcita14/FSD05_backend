import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });

            if (response.success) {
                const { user, token } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                return { success: true, user };
            }

            return { success: false, message: response.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);

            if (response.success) {
                const { user, token } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                return { success: true, user };
            }

            return { success: false, message: response.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isRequester: user?.role === 'REQUESTER',
        isApprover: user?.role === 'APPROVER'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
