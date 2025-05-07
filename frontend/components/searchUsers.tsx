'use client'

import { useState, useRef, useEffect } from 'react'
import { User } from 'next-auth'

interface SearchUsersProps {
    users: User[]
    onUserSelect: (user: User) => void
    selectedUserId?: string
    placeholder?: string
}

export default function SearchUsers({ users, onUserSelect, selectedUserId, placeholder = "Search users..." }: SearchUsersProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Set initial search query if there's a selected user
    useEffect(() => {
        if (selectedUserId) {
            const selectedUser = users.find(user => user.id === selectedUserId)
            if (selectedUser?.email) {
                setSearchQuery(selectedUser.email)
            }
        }
    }, [selectedUserId, users])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
    )

    const handleUserSelect = (user: User) => {
        setSearchQuery(user.email || '')
        setShowDropdown(false)
        onUserSelect(user)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowDropdown(e.target.value.length > 0)
                    }}
                    onFocus={() => setShowDropdown(searchQuery.length > 0)}
                    placeholder={placeholder}
                    className="w-full p-2 border rounded"
                />
                {showDropdown && searchQuery.length > 0 && filteredUsers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => handleUserSelect(user)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {user.email}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 