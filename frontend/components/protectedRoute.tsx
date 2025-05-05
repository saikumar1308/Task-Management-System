'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/utils/auth';

export default function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();

    useEffect(() => {
      const token = getToken();
      if (!token) {
        router.push('/signin');
      }
    }, [router]);

    return <Component {...props} />;
  };
}
