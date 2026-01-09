import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, clearCart, removeFromCart } = useContext(CartContext);
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load previous orders from backend
  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  async function fetchOrders() {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'x-user-role': 'user',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  }

  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const checkout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty!');
      return;
    }

    if (!user || !token) {
      setError('Please login to checkout');
      return;
    }

    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'user',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to place order');
      }

      const newOrder = await response.json();
      
      // Add to orders list
      setOrders([...orders, newOrder]);
      setSuccessMessage(`Order #${newOrder.id} placed successfully!`);
      
      // Clear cart
      clearCart();

      // Reset form
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  function removeItem(index) {
    if (removeFromCart) {
      removeFromCart(index);
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Shopping Cart</h1>

      {error && (
        <div style={{ backgroundColor: '#fee', padding: '1rem', borderRadius: '4px', color: '#c33', marginBottom: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {successMessage && (
        <div style={{ backgroundColor: '#efe', padding: '1rem', borderRadius: '4px', color: '#393', marginBottom: '1rem' }}>
          ✓ {successMessage}
        </div>
      )}

      {/* Cart Items */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Items in Cart</h2>
        {cart.length === 0 ? (
          <p style={{ color: '#666' }}>Your cart is empty</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {cart.map((item, i) => (
              <div
                key={i}
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
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{item.name}</p>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>${item.price?.toFixed(2) || '0.00'}</p>
                </div>
                <button
                  onClick={() => removeItem(i)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#cc0000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Checkout */}
      {cart.length > 0 && (
        <section
          style={{
            border: '2px solid #000',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Subtotal</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
              ${totalPrice.toFixed(2)}
            </p>
          </div>
          <button
            onClick={checkout}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: loading ? '#999' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Processing...' : 'Checkout'}
          </button>
        </section>
      )}

      {/* Order History */}
      <section>
        <h2>Your Order History</h2>
        {orders.length === 0 ? (
          <p style={{ color: '#666' }}>No previous orders</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.85rem' }}>Order ID</p>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>#{order.id}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.85rem' }}>Date</p>
                    <p style={{ margin: 0 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.85rem' }}>Status</p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#0066cc' }}>{order.status}</p>
                  </div>
                </div>
                <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                  {order.items?.map((item, idx) => (
                    <li key={idx} style={{ margin: '0.25rem 0' }}>
                      {item.name} — ${item.price?.toFixed(2) || '0.00'}
                    </li>
                  ))}
                </ul>
                <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', color: '#009900' }}>
                  Total: ${order.totalPrice?.toFixed(2) || '0.00'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
