'use client';

import { getToken } from '@/utils/auth';
import { User } from 'next-auth';
import { useEffect, useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import SearchUsers from './searchUsers';

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    assignedToId: string;
    createdById: string;
}

export default function DashboardPage({ users }: { users: User[] }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { setRefreshTasks } = useTaskContext();

    const fetchTasks = async () => {
        const token = await getToken();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task`, {
            method: 'GET',
            headers: {
                Authorization: token || '',
            },
        });
        const data = await res.json();
        const payload = JSON.parse(atob(token?.split('.')[1] || ''));
        setUserId(payload.id);
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
        setRefreshTasks(() => fetchTasks);
    }, [setRefreshTasks]);

    const handleEdit = (task: Task) => {
        setEditingTask(task);
    }

    const handleUpdate = async () => {
        if (!editingTask) return;
        const token = await getToken();
        const formattedData = {
            ...editingTask,
            dueDate: new Date(editingTask.dueDate).toISOString(),
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token || '',
            },
            body: JSON.stringify(formattedData),
        });

        if (res.ok) {
            alert('Task updated successfully');
            setTasks(tasks.map(task => task.id === editingTask.id ? editingTask : task));
            setEditingTask(null);
        } else {
            alert('Failed to update task');
        }
    }

    const handleDelete = async (id: string) => {
        const token = await getToken();
        const confirm = window.confirm('Are you sure you want to delete this task?');
        if (!confirm) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token || '',
            },
            body: JSON.stringify({ id: id }),
        });
        if (res.ok) {
            setTasks(tasks.filter(task => task.id !== id));
        } else {
            alert('Failed to delete task');
        }
    }

    const now = new Date();

    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const assignedTasks = filteredTasks.filter((task) => task.assignedToId === userId);
    const createdTasks = filteredTasks.filter((task) => task.createdById === userId);
    const overdueTasks = filteredTasks.filter((task) => new Date(task.dueDate) < now && task.status !== 'DONE');

    const TaskCard = ({ task, onEdit, onDelete }: { task: Task, onEdit: (task: Task) => void, onDelete: (id: string) => void }) => (
        <div className="bg-white rounded-xl shadow-md p-4 border">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500 capitalize">Status: {task.status}</p>
            <p className="text-sm text-gray-500 capitalize">Priority: {task.priority}</p>
            <button
                onClick={() => onEdit(task)}
                className="mt-3 text-blue-600 hover:underline text-sm mr-2"
            >
                ✏️ Edit
            </button>
            <button
                onClick={() => onDelete(task.id)}
                className="text-red-600 hover:underline text-sm"
            >
                🗑️ Delete
            </button>
        </div>
    );
    const [showOverdue, setShowOverdue] = useState(true);
    const [showAssigned, setShowAssigned] = useState(false);
    const [showCreated, setShowCreated] = useState(false);

    const Section = ({ title, tasks, isVisible, setIsVisible }: { title: string; tasks: Task[]; isVisible: boolean; setIsVisible: (value: boolean) => void }) => (
        <section>
            <div className="flex  items-center" onClick={() => setIsVisible(!isVisible)}>
                <h2 className="text-xl font-bold mb-4 cursor-pointer" >{title}</h2>
                <div className="mb-3">
                    {isVisible ?
                        <svg className="w-6 h-6 text-gray-800 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m5 15 7-7 7 7" />
                        </svg>
                        :
                        <svg className="w-6 h-6 text-gray-800 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m19 9-7 7-7-7" />
                        </svg>
                    }
                </div>
            </div>

            {(isVisible || searchQuery !== '') && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.length > 0 ? (
                    tasks.map(task => <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />)
                ) : (
                    <p className="text-gray-500">Your tasks will appear here.</p>
                )}
            </div>}
        </section>
    );

    return (
        <div className="p-6 space-y-12">
            <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search tasks by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute right-3 top-2.5">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {editingTask && (
                <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
                        <h2 className="text-xl font-bold">Edit Task</h2>
                        <input
                            type="text"
                            value={editingTask.title}
                            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                            className="w-full border p-2 rounded"
                            placeholder="Task Title"
                        />
                        <input
                            type="date"
                            value={editingTask.dueDate.split('T')[0]}
                            onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <select
                            value={editingTask.status}
                            onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                            className="w-full border p-2 rounded"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <select
                            value={editingTask.priority}
                            onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                            className="w-full border p-2 rounded"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                        {users.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-lg font-semibold">Assign To</label>
                                <SearchUsers
                                    users={users}
                                    onUserSelect={(user) => setEditingTask({ ...editingTask, assignedToId: user.id })}
                                    selectedUserId={editingTask.assignedToId}
                                />
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingTask(null)} className="text-gray-600 cursor-pointer">Cancel</button>
                            <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">Save</button>
                        </div>
                    </div>
                </div>
            )}

            <Section title="🔴 Overdue Tasks" isVisible={showOverdue} setIsVisible={setShowOverdue} tasks={overdueTasks} />
            <Section title="🔵 Assigned Tasks" isVisible={showAssigned} setIsVisible={setShowAssigned} tasks={assignedTasks} />
            <Section title="🟢 Created Tasks" isVisible={showCreated} setIsVisible={setShowCreated} tasks={createdTasks} />
        </div>
    );
}
