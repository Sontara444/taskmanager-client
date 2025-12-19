import api from './api';

export interface Notification {
    _id: string;
    recipientId: string;
    senderId?: { _id: string, name: string };
    type: string;
    message: string;
    relatedTaskId?: { _id: string, title: string };
    isRead: boolean;
    createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
};

export const markAsRead = async (id: string): Promise<Notification> => {
    const response = await api.put<Notification>(`/notifications/${id}/read`);
    return response.data;
};

export const markAllAsRead = async (): Promise<void> => {
    await api.put('/notifications/read-all');
};
