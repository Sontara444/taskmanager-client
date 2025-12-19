export interface User {
    _id: string;
    name: string;
    email: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed';

export interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string; // ISO Date string
    priority: TaskPriority;
    status: TaskStatus;
    creatorId: User;
    assignedToId?: User;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskData {
    title: string;
    description: string;
    dueDate: Date | string;
    priority: TaskPriority;
    status?: TaskStatus;
    assignedToId?: string;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    dueDate?: Date | string;
    priority?: TaskPriority;
    status?: TaskStatus;
    assignedToId?: string;
}

export interface TaskFilters {
    status?: TaskStatus;
    priority?: TaskPriority;
    sortBy?: 'dueDate' | 'priority' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    assignedToMe?: boolean;
    createdByMe?: boolean;
    search?: string;
    overdue?: boolean;
}
