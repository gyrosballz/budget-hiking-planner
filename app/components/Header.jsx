'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

function HeaderContent() {
  const { role, logout, user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav
      style={{
        backgroundColor: '#000',
        color: '#fff',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
          🥾 Budget Hiking
        </Link>

        {user && (
          <>
            <Link href="/plans" style={{ color: '#fff', textDecoration: 'none' }}>
              Plans
            </Link>
            <Link href="/store" style={{ color: '#fff', textDecoration: 'none' }}>
              Store
            </Link>
            <Link href="/cart" style={{ color: '#fff', textDecoration: 'none' }}>
              Cart
            </Link>
            <Link href="/planner" style={{ color: '#fff', textDecoration: 'none' }}>
              Planner
            </Link>
            <Link href="/orders" style={{ color: '#fff', textDecoration: 'none' }}>
              Orders
            </Link>

            {role === 'seller' && (
              <Link
                href="/seller"
                style={{ color: '#ffaa00', textDecoration: 'none', fontWeight: 'bold' }}
              >
                Seller Dashboard
              </Link>
            )}

            {role === 'admin' && (
              <Link
                href="/admin-dashboard"
                style={{ color: '#ff6600', textDecoration: 'none', fontWeight: 'bold' }}
              >
                Admin Dashboard
              </Link>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span>
              User: <strong>{user.username}</strong> ({role})
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#cc0000',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: '#fff', textDecoration: 'none' }}>
              Login
            </Link>
            <Link href="/register" style={{ color: '#fff', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function Header() {
  return <HeaderContent />;
}
