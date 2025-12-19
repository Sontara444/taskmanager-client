import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import type { Task } from '../types/task';

interface TaskStatsProps {
    tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
    const stats = {
        total: tasks.length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        overdue: tasks.filter(t => {
            if (!t.dueDate) return false;
            return new Date(t.dueDate) < new Date() && t.status !== 'Completed';
        }).length
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#12141c] p-6 rounded-xl border border-[#2d303e]">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-400 text-sm font-medium">Total Tasks</span>
                    <ListTodo className="w-5 h-5 text-[#6366f1]" />
                </div>
                <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
            </div>

            <div className="bg-[#12141c] p-6 rounded-xl border border-[#2d303e]">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-400 text-sm font-medium">In Progress</span>
                    <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold text-white">{stats.inProgress}</h3>
            </div>

            <div className="bg-[#12141c] p-6 rounded-xl border border-[#2d303e]">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-400 text-sm font-medium">Completed</span>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-white">{stats.completed}</h3>
            </div>

            <div className="bg-[#12141c] p-6 rounded-xl border border-[#2d303e]">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-400 text-sm font-medium">Overdue</span>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold text-white">{stats.overdue}</h3>
            </div>
        </div>
    );
};

export default TaskStats;
