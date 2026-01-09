import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SellerDashboard() {
  const { user, token, role } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
  });
  const [editingId, setEditingId] = useState(null);

  // Redirect if not seller or admin
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    if (!['seller', 'admin'].includes(role)) {
      navigate('/');
    }
  }, [user, token, role, navigate]);

  // Load products and orders
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          'x-user-role': role,
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'x-user-role': role,
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setError('');

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
      };

      const response = await fetch('http://localhost:5000/api/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      setFormData({ name: '', price: '', stock: '', category: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': role,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete product');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': role,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update order status');
      }

      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  function editProduct(product) {
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category || '',
    });
    setEditingId(product.id);
  }

  if (!user || !token || !['seller', 'admin'].includes(role)) {
    return null;
  }

  return (
    <div className="seller-dashboard" style={{ padding: '2rem' }}>
      <h1>Seller Dashboard</h1>
      <p>Welcome, <strong>{user.username}</strong>!</p>

      {error && (
        <div style={{ backgroundColor: '#fee', padding: '1rem', borderRadius: '4px', color: '#c33', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Product Management */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Product Management</h2>

        <form onSubmit={handleAddProduct} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price ($)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              step="0.01"
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Category (e.g., Footwear, Backpacks)"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', price: '', stock: '', category: '' });
                }}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#666', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h3>Your Products</h3>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4>{product.name}</h4>
                  <p>Price: ${product.price.toFixed(2)} | Stock: {product.stock}</p>
                  {product.category && <p>Category: {product.category}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => editProduct(product)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#0066cc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#cc0000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Order Management */}
      <section>
        <h2>Manage Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  borderRadius: '4px',
                }}
              >
                <h4>Order #{order.id}</h4>
                <p>
                  <strong>Customer:</strong> {order.username} | <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Total:</strong> ${order.totalPrice?.toFixed(2) || '0.00'} | <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Items:</strong> {order.items?.map((item) => `${item.name} ($${item.price})`).join(', ')}
                </p>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Processing')}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ff9900',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Start Processing
                    </button>
                  )}
                  {order.status === 'Processing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Shipped')}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#0066cc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Ship Order
                    </button>
                  )}
                  {order.status === 'Shipped' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#009900',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
