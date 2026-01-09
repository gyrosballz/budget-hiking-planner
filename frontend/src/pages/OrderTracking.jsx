import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  'Pending': '#ff9900',
  'Processing': '#0066cc',
  'Shipped': '#9900cc',
  'Delivered': '#009900',
  'Cancelled': '#cc0000',
};

export default function OrderTracking() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, token, navigate]);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'x-user-role': 'user',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getStatusProgress(status) {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return statuses.indexOf(status) + 1;
  }

  if (!user || !token) {
    return null;
  }

  return (
    <div className="order-tracking" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Order Tracking</h1>
      <p>Hi <strong>{user.username}</strong>, here's your order history.</p>

      {error && (
        <div style={{ backgroundColor: '#fee', padding: '1rem', borderRadius: '4px', color: '#c33', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading && <p>Loading your orders...</p>}

      {!loading && orders.length === 0 && (
        <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '4px', textAlign: 'center' }}>
          <p>You haven't placed any orders yet.</p>
          <a href="/store" style={{ color: '#0066cc', textDecoration: 'none' }}>
            Continue shopping →
          </a>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {/* Order Header */}
              <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderBottom: '1px solid #ddd' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Order ID</p>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>#{order.id}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Order Date</p>
                    <p style={{ margin: 0 }}>
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Total Amount</p>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#009900' }}>
                      ${order.totalPrice?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Progress */}
              <div style={{ padding: '2rem 1.5rem', backgroundColor: '#fff' }}>
                <p style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#666' }}>Status Progress</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status, index) => (
                    <div key={status} style={{ flex: 1, textAlign: 'center' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          margin: '0 auto 0.5rem',
                          backgroundColor: order.status === status || getStatusProgress(order.status) > index + 1 ? STATUS_COLORS[order.status] : '#e0e0e0',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 1}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: order.status === status ? 'bold' : 'normal' }}>
                        {status}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Current Status Badge */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      backgroundColor: STATUS_COLORS[order.status],
                      color: 'white',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderTop: '1px solid #ddd' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#333' }}>Items Ordered</p>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    >
                      <span>{item.name}</span>
                      <span style={{ fontWeight: 'bold' }}>${item.price?.toFixed(2) || '0.00'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              {order.status === 'Delivered' && (
                <div style={{ padding: '1.5rem', backgroundColor: '#eff9ef', borderTop: '1px solid #ddd' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#009900' }}>✓ Delivered</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                    Delivered on {new Date(order.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
