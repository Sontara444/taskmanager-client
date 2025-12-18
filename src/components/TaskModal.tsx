
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CreateTaskData, Task } from '../types/task';
import { useUsers } from '../hooks/useUsers';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTaskData | any) => void; // any for update partials
    task?: Task; // If provided, editing
}

const schema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string().min(1, 'Due date is required'), // Input type date returns string
    priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
    status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']).optional(),
    assignedToId: z.string().optional(),
});

type TaskForm = z.infer<typeof schema>;

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            priority: 'Medium',
            status: 'To Do',
        }
    });

    const { data: users } = useUsers();

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                priority: task.priority,
                status: task.status,
                assignedToId: task.assignedToId?._id || '',
            });
        } else {
            reset({
                title: '',
                description: '',
                dueDate: '',
                priority: 'Medium',
                status: 'To Do',
                assignedToId: '',
            });
        }
    }, [task, reset, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{task ? 'Edit Task' : 'Create Task'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input {...register('title')} className="w-full border p-2 rounded" />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea {...register('description')} className="w-full border p-2 rounded" rows={3} />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Due Date</label>
                        <input type="date" {...register('dueDate')} className="w-full border p-2 rounded" />
                        {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Priority</label>
                            <select {...register('priority')} className="w-full border p-2 rounded">
                                {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        {task && (
                            <div className="flex-1">
                                <label className="block text-sm font-medium">Status</label>
                                <select {...register('status')} className="w-full border p-2 rounded">
                                    {['To Do', 'In Progress', 'Review', 'Completed'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Assign To</label>
                        <select {...register('assignedToId')} className="w-full border p-2 rounded">
                            <option value="">Unassigned</option>
                            {users?.map(user => (
                                <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
