'use client';

import { getToken } from '@/utils/auth';
import { useEffect, useState } from 'react';

interface Notification {
    id: string;
    message: string;
    createdAt: string;
    read: boolean;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = getToken();
            if (!token) return;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notif`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token || '',
                },
            });
            const data = await res.json();
            setNotifications(data);
        };

        fetchNotifications();
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-2xl cursor-pointer"
            >
                🔔
                {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 bg-red-600 w-2 h-2 rounded-full"></span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded p-4 w-64 z-10">
                    <h4 className="font-bold mb-2">Notifications</h4>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">No notifications.</p>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif.id} className="mb-2 text-sm text-gray-700">
                                • {notif.message}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
