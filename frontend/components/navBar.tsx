'use client';

import { removeToken, getToken } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NotificationBell from './NotificationBell';
export default function Navbar() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(token ? true : false);
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    router.push('/signin');
  };

  return (
    <nav className="w-full text-grey-900 p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-blue-800">
        <Link href="/">Task Manager</Link>
      </h1>
      <div className='flex items-center gap-10'>
        <NotificationBell />
        {isLoggedIn ? <button
          onClick={handleLogout}
          className="bg-blue-800 text-white px-4 py-2 rounded-full hover:bg-blue-950 transition cursor-pointer"
        >
          Logout
        </button> : <div>
          <Link href="/signin" className='bg-blue-800 text-white px-4 py-2 rounded-full hover:bg-blue-950 transition cursor-pointer'>Login</Link>
        </div>}
      </div>
    </nav>
  );
}
