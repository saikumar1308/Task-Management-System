'use client'

import { useState } from 'react'
import { getToken } from '@/utils/auth';
export default function CreateTaskPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'LOW',
        status: 'TODO',
    })
    const [showModal, setShowModal] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = getToken();
            const formattedData = {
                ...formData,
                dueDate: new Date(formData.dueDate).toISOString(),
            };
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || '',
                },
                body: JSON.stringify(formattedData),
            })

            const data = await res.json()
            if (res.ok) {
                alert('Task created successfully')
            } else {
                alert('Error: ' + data.error)
            }
        } catch (err) {
            console.error('Submission error:', err)
            alert('Something went wrong')
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-2xl font-semibold ">Create a New Task</h2>
                {showModal ? <button className='cursor-pointer' onClick={() => setShowModal((prev) => !prev)}>
                    <svg className="w-6 h-6 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                    </svg>
                </button> :
                    <button className='cursor-pointer' onClick={() => setShowModal((prev) => !prev)}>
                        <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                        </svg>
                    </button>
                }
            </div>
            {showModal && <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="" className='text-lg font-semibold'>Title</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                    className="w-full p-2 border rounded"
                />

                <label htmlFor="" className='text-lg font-semibold'>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                    className="w-full p-2 border rounded"
                />

                <label htmlFor="" className='text-lg font-semibold'>Due Date</label>
                <input
                    type="datetime-local"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />

                <label htmlFor="" className='text-lg font-semibold'>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>

                <label htmlFor="" className='text-lg font-semibold'>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                >
                    Create Task
                </button>
            </form>}
        </div>
    )
}
