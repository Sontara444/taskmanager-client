import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import type { TaskFilters, Task } from '../types/task';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import ProfileModal from '../components/ProfileModal';
import FilterBar from '../components/TaskFilters';
import TaskStats from '../components/TaskStats';
import socket from '../services/socket';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Bell, Layout, User, Settings, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logoutUser } = useAuth();
    const [filters, setFilters] = useState<TaskFilters>({});
    const { data: tasks = [], isLoading, error } = useTasks(filters);

    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
        <div className="min-h-screen bg-[#0a0b14] text-white font-sans">
            {/* Header */}
            <header className="border-b border-[#2d303e] bg-[#0a0b14]/50 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#6366f1] p-1.5 rounded-lg">
                            <Layout className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">TaskFlow</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={openCreateModal}
                            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <Plus size={16} />
                            <span>New Task</span>
                        </button>

                        <div className="flex items-center gap-4 border-l border-[#2d303e] pl-6">
                            <button className="relative text-gray-400 hover:text-white transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366f1] to-purple-500 flex items-center justify-center text-xs font-bold ring-2 ring-transparent hover:ring-[#6366f1] transition-all">
                                        {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                                    </div>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-[#0a0b14] border border-[#2d303e] rounded-xl shadow-2xl py-2 z-50">
                                        <div className="px-4 py-3 border-b border-[#2d303e] mb-2">
                                            <p className="text-sm font-semibold text-white">{user?.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                        </div>

                                        <div className="px-2">
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    setIsProfileModalOpen(true);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#12141c] rounded-lg transition-colors text-left"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#12141c] rounded-lg transition-colors text-left">
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </button>
                                        </div>

                                        <div className="border-t border-[#2d303e] mt-2 pt-2 px-2">
                                            <button
                                                onClick={logoutUser}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Overview */}
                <TaskStats tasks={tasks} />

                {/* Filter Bar */}
                <FilterBar filters={filters} setFilters={setFilters} />

                {/* Task Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-[#12141c] rounded-xl border border-[#2d303e] animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-20 bg-[#12141c] rounded-xl border border-[#2d303e]">
                        <p>Error loading tasks. Please try again.</p>
                    </div>
                ) : tasks?.length === 0 ? (
                    <div className="text-center py-20 bg-[#12141c] rounded-xl border border-[#2d303e]">
                        <p className="text-gray-400 mb-4">No tasks found matching your filters.</p>
                        <button
                            onClick={openCreateModal}
                            className="text-[#6366f1] hover:text-[#4f46e5] font-medium"
                        >
                            Create a new task
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map(task => (
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
                taskToEdit={editingTask}
            />

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
