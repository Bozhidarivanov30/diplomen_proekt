// src/components/ProtectedRoute.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
      }
    });
    return unsubscribe;
  }, [router]);

  return children;
}
