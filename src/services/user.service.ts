import api from './api';

export interface User {
    _id: string;
    name: string;
    email: string;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/auth/users');
    return response.data;
};
