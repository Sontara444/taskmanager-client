import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '../services/task.service';
import type { Task, TaskFilters, CreateTaskData, UpdateTaskData } from '../types/task';

export const useTasks = (filters: TaskFilters) => {
    return useQuery({
        queryKey: ['tasks', filters],
        queryFn: () => getTasks(filters),
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTaskData) => createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) => updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
            if (previousTasks) {
                queryClient.setQueryData<Task[]>(['tasks'], (old) =>
                    old ? old.filter((task) => task._id !== id) : []
                );
            }

            return { previousTasks };
        },
        onError: (_err, _newTodo, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks'], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};
