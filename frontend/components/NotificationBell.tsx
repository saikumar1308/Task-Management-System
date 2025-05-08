'use client';

import { getToken } from '@/utils/auth';
import { useEffect, useRef, useState } from 'react';
import { onTaskAssigned, registerSocket, cleanupSocket } from '@/utils/socket';
import socket from '@/utils/socket';

interface Notification {
    id: string;
    message: string;
    createdAt: string;
    read: boolean;
    taskId?: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
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
                setNotifications(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setNotifications([]);
            }
        };

        fetchNotifications();

        // Register socket connection
        const token = getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                // Wait for socket to be ready before registering
                if (socket.connected) {
                    registerSocket(payload.id);
                } else {
                    socket.on('connect', () => {
                        registerSocket(payload.id);
                    });
                }
            } catch (error) {
                console.error('Error registering socket:', error);
            }
        }

        // Listen for task assignment notifications
        onTaskAssigned(async (data) => {
            try {
                const token = getToken();
                if (!token) return;

                // Save notification to database
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notif`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token || '',
                    },
                    body: JSON.stringify({
                        message: data.message,
                        taskId: data.taskId
                    }),
                });

                if (res.ok) {
                    const newNotification = await res.json();
                    setNotifications(prev => [newNotification, ...prev]);
                } else {
                    console.error('Failed to save notification to database');
                }
            } catch (error) {
                console.error('Error saving notification:', error);
            }
        });

        return () => {
            cleanupSocket();
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const toggleDropdown = () => setShowDropdown(prev => !prev);

    const markAsRead = async (id: string) => {
        try {
            const token = await getToken();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notif/${id}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token || '',
                },
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current?.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="text-2xl cursor-pointer"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 w-2 h-2 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded p-4 w-64 z-10">
                    <h4 className="font-bold mb-2">Notifications</h4>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">No notifications.</p>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={`p-4 cursor-pointer hover:bg-gray-100 ${!notif.read ? 'font-medium' : 'text-gray-600'}`}>
                                • {notif.message}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
