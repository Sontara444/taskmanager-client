import React from 'react';
import type { TaskFilters } from '../types/task';

interface Props {
    filters: TaskFilters;
    setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
}

const FilterBar: React.FC<Props> = ({ filters, setFilters }) => {
    const handleChange = (key: keyof TaskFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4 items-end">
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                    value={filters.status || ''}
                    onChange={(e) => handleChange('status', e.target.value || undefined)}
                    className="border rounded p-1 text-sm"
                >
                    <option value="">All Statuses</option>
                    {['To Do', 'In Progress', 'Review', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                <select
                    value={filters.priority || ''}
                    onChange={(e) => handleChange('priority', e.target.value || undefined)}
                    className="border rounded p-1 text-sm"
                >
                    <option value="">All Priorities</option>
                    {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
                <select
                    value={filters.sortBy || ''}
                    onChange={(e) => handleChange('sortBy', e.target.value || undefined)}
                    className="border rounded p-1 text-sm"
                >
                    <option value="">Newest First</option>
                    <option value="dueDate">Due Date</option>
                </select>
            </div>

            <div className="flex items-center space-x-2 pb-1">
                <input
                    type="checkbox"
                    id="assignedToMe"
                    checked={!!filters.assignedToMe}
                    onChange={(e) => handleChange('assignedToMe', e.target.checked || undefined)}
                />
                <label htmlFor="assignedToMe" className="text-sm">Assigned to Me</label>
            </div>

            <div className="flex items-center space-x-2 pb-1">
                <input
                    type="checkbox"
                    id="overdue"
                    checked={!!filters.overdue}
                    onChange={(e) => handleChange('overdue', e.target.checked || undefined)}
                />
                <label htmlFor="overdue" className="text-sm">Overdue</label>
            </div>
        </div>
    );
};

export default FilterBar;
