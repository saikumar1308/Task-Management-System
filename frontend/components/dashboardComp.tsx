'use client';

import { getToken } from '@/utils/auth';
import { useEffect, useState } from 'react';

interface Task {
    id: string;
    title: string;
    dueDate: string;
    priority: string;
    status: string;
    assignedTo: string;
    createdBy: string;
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {

            const token = await getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task`, {
                method: 'GET',
                headers: {
                    Authorization: token || '',
                },
            });
            const data = await res.json();
            setTasks(data);
            
        };

        fetchTasks();
    }, []);

    const TaskCard = ({ task }: { task: Task }) => (
        <div className="bg-white rounded-xl shadow-md p-4 border">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500 capitalize">Status: {task.status}</p>
            <p className="text-sm text-gray-500 capitalize">Priority: {task.priority}</p>
        </div>
    );

    const Section = ({ title, tasks }: { title: string; tasks: Task[] }) => (
        <section>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.length > 0 ? (
                    tasks.map(task => <TaskCard key={task.id} task={task} />)
                ) : (
                    <p className="text-gray-500">No tasks found.</p>
                )}
            </div>
        </section>
    );

    return (
        <div className="p-6 space-y-12">
            <Section title="🧾 All Tasks" tasks={tasks} />
        </div>
    );
}
