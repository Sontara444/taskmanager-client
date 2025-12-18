import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { User } from '../services/auth.service';

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/auth/users');
    return response.data;
};

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });
};
