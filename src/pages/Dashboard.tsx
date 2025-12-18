import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import type { TaskFilters, Task } from '../types/task';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import FilterBar from '../components/TaskFilters';
import socket from '../services/socket';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

const Dashboard = () => {
    const { user, logoutUser } = useAuth();
    const [filters, setFilters] = useState<TaskFilters>({});
    const { data: tasks, isLoading, error } = useTasks(filters);

    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    const queryClient = useQueryClient();

    // Socket Connection & Listeners
    useEffect(() => {
        socket.connect();

        const handleUpdate = () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        };

        socket.on('task_created', handleUpdate);
        socket.on('task_updated', handleUpdate);
        socket.on('task_deleted', handleUpdate);
        socket.on('task_assigned', handleUpdate);

        return () => {
            socket.off('task_created', handleUpdate);
            socket.off('task_updated', handleUpdate);
            socket.off('task_deleted', handleUpdate);
            socket.off('task_assigned', handleUpdate);
            socket.disconnect();
        };
    }, [queryClient]);

    const handleCreate = async (data: any) => {
        await createTaskMutation.mutateAsync(data);
        setIsModalOpen(false);
    };

    const handleUpdate = async (data: any) => {
        if (editingTask) {
            await updateTaskMutation.mutateAsync({ id: editingTask._id, data });
            setIsModalOpen(false);
            setEditingTask(undefined);
        }
    };

    const openCreateModal = () => {
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await deleteTaskMutation.mutateAsync(id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">TaskManager</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Welcome, {user?.name}</span>
                        <button onClick={logoutUser} className="text-sm text-red-600 hover:text-red-800 font-medium">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Your Tasks</h2>
                    <button
                        onClick={openCreateModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        <span>Create Task</span>
                    </button>
                </div>

                <FilterBar filters={filters} setFilters={setFilters} />

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-10">Error loading tasks</div>
                ) : tasks?.length === 0 ? (
                    <div className="text-gray-500 text-center py-10">No tasks found. Create one!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks?.map(task => (
                            <TaskItem
                                key={task._id}
                                task={task}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingTask ? handleUpdate : handleCreate}
                task={editingTask}
            />
        </div>
    );
};

export default Dashboard;
