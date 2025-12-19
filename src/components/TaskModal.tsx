import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CreateTaskData, UpdateTaskData, Task } from '../types/task';
import { X } from 'lucide-react';
import { getUsers, type User } from '../services/user.service';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
    taskToEdit?: Task;
}

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']).optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
    dueDate: z.string().optional(),
    assignedToId: z.string().optional(),
});

type TaskFormData = z.infer<typeof formSchema>;

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, taskToEdit }) => {
    const [users, setUsers] = React.useState<User[]>([]);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: 'To Do',
            priority: 'Medium',
        }
    });

    React.useEffect(() => {
        getUsers().then(setUsers).catch(console.error);
    }, []);

    React.useEffect(() => {
        if (taskToEdit) {
            setValue('title', taskToEdit.title);
            setValue('description', taskToEdit.description || '');
            setValue('status', taskToEdit.status);
            setValue('priority', taskToEdit.priority);
            setValue('dueDate', taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '');
            setValue('assignedToId', taskToEdit.assignedToId?._id || '');
        } else {
            reset({
                title: '',
                description: '',
                status: 'To Do',
                priority: 'Medium',
                dueDate: '',
                assignedToId: ''
            });
        }
    }, [taskToEdit, setValue, reset, isOpen]);

    const handleFormSubmit = async (data: TaskFormData) => {
        // Ensure enums are treated as the correct type
        const payload: any = { ...data };
        await onSubmit(payload);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#12141c] rounded-2xl w-full max-w-lg border border-[#2d303e] shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-[#2d303e]">
                    <h2 className="text-xl font-bold text-white">
                        {taskToEdit ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Title</label>
                        <input
                            {...register('title')}
                            className="w-full bg-[#0a0b14] border border-[#2d303e] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent placeholder-gray-600"
                            placeholder="Task title"
                        />
                        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full bg-[#0a0b14] border border-[#2d303e] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent placeholder-gray-600 resize-none"
                            placeholder="Add a description..."
                        />
                    </div>

                    {/* Assign To */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Assign To</label>
                        <select
                            {...register('assignedToId')}
                            className="w-full bg-[#0a0b14] border border-[#2d303e] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] appearance-none"
                        >
                            <option value="">Unassigned</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Status</label>
                            <select
                                {...register('status')}
                                className="w-full bg-[#0a0b14] border border-[#2d303e] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] appearance-none"
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Review">Review</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Priority</label>
                            <select
                                {...register('priority')}
                                className="w-full bg-[#0a0b14] border border-[#2d303e] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] appearance-none"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Due Date</label>
                        <input
                            type="date"
                            {...register('dueDate')}
                            className="w-full bg-[#0a0b14] border border-[#2d303e] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-[#2d303e] text-gray-300 hover:text-white hover:bg-[#2d303e] transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {taskToEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
