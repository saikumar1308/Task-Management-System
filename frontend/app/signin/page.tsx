'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setToken } from '@/utils/auth'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      setToken(data.token)
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className='flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-md w-full max-w-sm'>
        <form onSubmit={handleSubmit} className="">
          <div className='relative'>
            <div className="absolute top-0 right-0">
              <Link href={"/"}>
                <svg className="w-6 h-6 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
              </Link>
            </div>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
              type="email"
              required
            />
            <input
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
              type="password"
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer">
              Login
            </button>
          </div>
        </form>
        <p className="text-center text-sm mt-4">
          Do not have an account? <Link href="/signup" className="text-blue-500 hover:text-blue-600">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
