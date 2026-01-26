'use client';

import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Profile() {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Profile</h1>
        <div
          style={{
            backgroundColor: '#f9f9f9',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            maxWidth: '500px',
          }}
        >
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Role:</strong> {role}
          </p>
        </div>
      </div>
    </>
  );
}
