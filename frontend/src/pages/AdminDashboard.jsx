import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, token, role } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    if (role !== 'admin') {
      navigate('/');
    }
  }, [user, token, role, navigate]);

  // Load admin data
  useEffect(() => {
    if (role === 'admin') {
      fetchOrders();
      fetchProducts();
    }
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'x-user-role': 'admin',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);

      // Calculate stats
      const totalRevenue = data.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      setStats((prev) => ({
        ...prev,
        totalOrders: data.length,
        totalRevenue,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          'x-user-role': 'admin',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);

      setStats((prev) => ({
        ...prev,
        totalProducts: data.length,
      }));
    } catch (err) {
      console.error(err.message);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': 'admin',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete product');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteOrder(id) {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': 'admin',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete order');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!user || !token || role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-dashboard" style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, <strong>{user.username}</strong>!</p>

      {error && (
        <div style={{ backgroundColor: '#fee', padding: '1rem', borderRadius: '4px', color: '#c33', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Stats Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#f0f4ff', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #0066cc' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Total Orders</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#0066cc' }}>{stats.totalOrders}</p>
          </div>
          <div style={{ backgroundColor: '#f0fff0', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #009900' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Total Products</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#009900' }}>{stats.totalProducts}</p>
          </div>
          <div style={{ backgroundColor: '#fff0f0', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #cc0000' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Total Revenue</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#cc0000' }}>
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #ddd', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'overview' ? '#000' : 'transparent',
            color: activeTab === 'overview' ? '#fff' : '#000',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'orders' ? '#000' : 'transparent',
            color: activeTab === 'orders' ? '#fff' : '#000',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Orders ({stats.totalOrders})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'products' ? '#000' : 'transparent',
            color: activeTab === 'products' ? '#fff' : '#000',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Products ({stats.totalProducts})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <section>
          <h2>All Orders</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Order ID</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Customer</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Items</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Total</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '0.75rem' }}>#{order.id}</td>
                      <td style={{ padding: '0.75rem' }}>{order.username}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem' }}>{order.items?.length || 0} items</td>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{
                            padding: '0.4rem 0.6rem',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            backgroundColor: '#cc0000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <section>
          <h2>All Products</h2>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '1rem',
                    borderRadius: '4px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h4>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                      Price: ${product.price?.toFixed(2) || '0.00'} | Stock: {product.stock}
                    </p>
                    {product.category && (
                      <p style={{ margin: '0.25rem 0 0 0', color: '#666' }}>
                        Category: {product.category}
                      </p>
                    )}
                    {product.createdBy && (
                      <p style={{ margin: '0.25rem 0 0 0', color: '#999', fontSize: '0.85rem' }}>
                        Created by: {product.createdBy}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#cc0000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      height: 'fit-content',
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
