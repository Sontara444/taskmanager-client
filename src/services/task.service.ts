import api from './api';
import type { Task, CreateTaskData, UpdateTaskData, TaskFilters } from '../types/task';

export const getTasks = async (filters: TaskFilters = {}): Promise<Task[]> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
            params.append(key, String(value));
        }
    });

    const response = await api.get<Task[]>(`/tasks?${params.toString()}`);
    return response.data;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
};

export const updateTask = async (id: string, data: UpdateTaskData): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
};
