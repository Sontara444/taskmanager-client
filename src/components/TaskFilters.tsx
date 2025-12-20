import React from 'react';
import { Search, Filter, Calendar, AlertCircle, X, List } from 'lucide-react';
import type { TaskFilters } from '../types/task';

interface TaskFiltersProps {
    filters: TaskFilters;
    setFilters: (filters: TaskFilters) => void;
}

const FilterComponents: React.FC<TaskFiltersProps> = ({ filters, setFilters }) => {
    return (
        <div className="space-y-6 mb-8">
            {/* Top Filters */}
            <div className="flex flex-wrap gap-6">
                <button
                    onClick={() => setFilters({ ...filters, assignedToMe: undefined, createdByMe: undefined, overdue: undefined })}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${!filters.assignedToMe && !filters.createdByMe && !filters.overdue ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <List className="w-4 h-4" />
                    All Tasks
                </button>
                <button
                    onClick={() => setFilters({ ...filters, assignedToMe: !filters.assignedToMe, createdByMe: undefined, overdue: undefined })}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${filters.assignedToMe ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <Filter className="w-4 h-4" />
                    Assigned to Me
                </button>

                <button
                    onClick={() => setFilters({ ...filters, createdByMe: !filters.createdByMe, assignedToMe: undefined, overdue: undefined })}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${filters.createdByMe ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <Calendar className="w-4 h-4" />
                    Created by Me
                </button>

                <button
                    onClick={() => setFilters({ ...filters, overdue: !filters.overdue, assignedToMe: undefined, createdByMe: undefined })}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${filters.overdue ? 'text-[#ef4444]' : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <AlertCircle className="w-4 h-4" />
                    Overdue
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={filters.search || ''}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full bg-[#12141c] border border-[#2d303e] text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent placeholder-gray-500"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <select
                        value={filters.status || ''}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                        className="bg-[#12141c] border border-[#2d303e] text-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] text-sm appearance-none cursor-pointer hover:bg-[#1a1d2d] transition-colors"
                    >
                        <option value="">All Status</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <select
                        value={filters.priority || ''}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                        className="bg-[#12141c] border border-[#2d303e] text-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] text-sm appearance-none cursor-pointer hover:bg-[#1a1d2d] transition-colors"
                    >
                        <option value="">All Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </select>

                    <div className="flex items-center gap-2">
                        <select
                            value={filters.sortBy || ''}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                            className="bg-[#12141c] border border-[#2d303e] text-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] text-sm appearance-none cursor-pointer hover:bg-[#1a1d2d] transition-colors"
                        >
                            <option value="createdAt">Created</option>
                            <option value="dueDate">Due Date</option>
                            <option value="priority">Priority</option>
                        </select>

                        <button
                            onClick={() => setFilters({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
                            className="bg-[#12141c] border border-[#2d303e] text-gray-300 p-2.5 rounded-lg hover:bg-[#1a1d2d] transition-colors"
                            title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                        >
                            {filters.sortOrder === 'asc' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="M11 4h4" /><path d="M11 8h7" /><path d="M11 12h10" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v16" /><path d="M3 8l4-4 4 4" /><path d="M11 12h10" /><path d="M11 16h7" /><path d="M11 20h4" /></svg>
                            )}
                        </button>
                    </div>

                    {(filters.search || filters.status || filters.priority || filters.assignedToMe || filters.overdue || filters.createdByMe) && (
                        <button
                            onClick={() => setFilters({})}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
};

export default FilterComponents;
