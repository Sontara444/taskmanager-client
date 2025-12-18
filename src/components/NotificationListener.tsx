import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import socket from '../services/socket';

const NotificationListener = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            socket.connect();
            socket.emit('join', user._id);

            const handleNotification = (data: { message: string, taskId: string }) => {
                // Ideally use a toast library here
                // console.log('Notification:', data.message);
                // Using a simple tailored alert or visual indicator would be better but browser Notification API requests permission.
                // I'll stick to a custom DOM element or just standard alert for "Mandatory" requirement proof, 
                // but for "User Experience" I will implement a visual banner.

                const div = document.createElement('div');
                div.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-[100] animate-bounce';
                div.textContent = data.message;
                document.body.appendChild(div);

                setTimeout(() => {
                    div.remove();
                }, 5000);
            };

            socket.on('notification', handleNotification);

            return () => {
                socket.off('notification', handleNotification);
            };
        }
    }, [user]);

    return null;
};

export default NotificationListener;
