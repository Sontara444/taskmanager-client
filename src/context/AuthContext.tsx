import React, { createContext, useState, useEffect, useContext } from 'react';
import { type User, login, register, logout } from '../services/auth.service';
import api from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginUser: (data: any) => Promise<void>;
    registerUser: (data: any) => Promise<void>;
    logoutUser: () => Promise<void>;
    updateUserProfile: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await api.get<User>('/auth/me');
                setUser(data);
            } catch (error) {
                // Not logged in
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const loginUser = async (data: any) => {
        const user = await login(data);
        setUser(user);
    };

    const registerUser = async (data: any) => {
        const user = await register(data);
        setUser(user);
    };

    const logoutUser = async () => {
        await logout();
        setUser(null);
    };

    const updateUserProfile = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
