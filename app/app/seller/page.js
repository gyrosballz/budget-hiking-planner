'use client';

import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SellerDashboard() {
  const { role, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || role !== 'seller') {
      router.push('/');
    }
  }, [user, role, router]);

  if (!user || role !== 'seller') {
    return null;
  }

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Seller Dashboard</h1>
        <p>Welcome, {user.username}!</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '2rem',
          }}
        >
          <div style={{ backgroundColor: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
            <h2>📊 Products</h2>
            <p>Manage your products from the Store page</p>
          </div>

          <div style={{ backgroundColor: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
            <h2>📋 Plans</h2>
            <p>Create and manage hiking plans</p>
          </div>

          <div style={{ backgroundColor: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
            <h2>📦 Orders</h2>
            <p>View customer orders and track status</p>
          </div>
        </div>
      </div>
    </>
  );
}
