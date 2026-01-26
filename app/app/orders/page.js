'use client';

import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await apiClient.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Orders</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                }}
              >
                <h3>Order #{order.id}</h3>
                <p>📅 {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>📊 Status: <strong>{order.status}</strong></p>
                <p>💰 Total: ${order.totalPrice}</p>
                <p>📦 Items: {order.items.length}</p>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} - ${item.price}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
