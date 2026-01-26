'use client';

import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export default function AdminDashboard() {
  const { role, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || role !== 'admin') {
      router.push('/');
      return;
    }
    loadOrders();
  }, [user, role, router]);

  async function loadOrders() {
    try {
      const data = await apiClient.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  }

  if (!user || role !== 'admin') {
    return null;
  }

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.username}!</p>

        <div style={{ marginTop: '2rem' }}>
          <h2>📦 Orders Management</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '1rem',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Order ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Total</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.75rem' }}>{order.id}</td>
                    <td style={{ padding: '0.75rem' }}>{order.username}</td>
                    <td style={{ padding: '0.75rem' }}>${order.totalPrice}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{ padding: '0.25rem' }}
                      >
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => alert(JSON.stringify(order.items, null, 2))}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#007bff',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        View Items
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
