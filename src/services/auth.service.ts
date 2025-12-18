import api from './api';


// Define types using Zod equivalent or interfaces
export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
}

export const login = async (data: LoginData): Promise<User> => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const register = async (data: RegisterData): Promise<User> => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};
