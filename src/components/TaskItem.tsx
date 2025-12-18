import React from 'react';
import type { Task } from '../types/task';
import clsx from 'clsx';
import { Pencil, Trash2, Calendar, User as UserIcon } from 'lucide-react';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const priorityColors = {
    'Low': 'bg-green-100 text-green-800',
    'Medium': 'bg-blue-100 text-blue-800',
    'High': 'bg-orange-100 text-orange-800',
    'Urgent': 'bg-red-100 text-red-800',
};

const statusColors = {
    'To Do': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Review': 'bg-purple-100 text-purple-800',
    'Completed': 'bg-green-100 text-green-800',
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900 truncate" title={task.title}>{task.title}</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-gray-500 hover:text-blue-600 p-1"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="text-gray-500 hover:text-red-600 p-1"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>

            <div className="flex flex-wrap gap-2 mb-3">
                <span className={clsx("px-2 py-0.5 rounded text-xs font-medium", priorityColors[task.priority] || priorityColors.Medium)}>
                    {task.priority}
                </span>
                <span className={clsx("px-2 py-0.5 rounded text-xs font-medium", statusColors[task.status] || statusColors['To Do'])}>
                    {task.status}
                </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                <div className="flex items-center space-x-1" title="Due Date">
                    <Calendar size={14} />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                {task.assignedToId && (
                    <div className="flex items-center space-x-1" title={`Assigned to ${task.assignedToId.name}`}>
                        <UserIcon size={14} />
                        <span className="truncate max-w-[80px]">{task.assignedToId.name}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskItem;
