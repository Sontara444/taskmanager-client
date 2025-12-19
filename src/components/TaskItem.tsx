import React from 'react';
import { Calendar, User, MoreVertical, Trash2 } from 'lucide-react';
import type { Task } from '../types/task';
import { format } from 'date-fns';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Urgent': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Low': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Review': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'To Do': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="bg-[#12141c] border border-[#2d303e] rounded-xl p-5 hover:border-[#6366f1]/50 transition-colors group">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 pr-4">{task.title}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-[#2d303e] transition-colors"
                        title="Edit"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="text-gray-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-[#2d303e] transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{task.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#2d303e]">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date'}</span>
                </div>

                {task.assignedToId && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <User className="w-3.5 h-3.5" />
                        <span>Assigned</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskItem;
