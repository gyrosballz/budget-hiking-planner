import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, clearCart } = useContext(CartContext);
  const { role } = useAuth();
  const [orders, setOrders] = useState([]);

  // Load previous orders from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const checkout = async () => {
    if (cart.length === 0) return alert('Cart is empty!');

    const newOrder = {
      id: Date.now(),
      items: cart,
      role,
      date: new Date().toLocaleString(),
      status: 'Pending',
    };

    // Save locally
    const updatedOrders = [...orders, newOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);

    alert('Order placed!');
    clearCart();
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 && <p>No items in your cart</p>}
      {cart.map((c, i) => (
        <div key={i} className="card" style={{ marginBottom: '0.5rem' }}>
          {c.name} — ${c.price}
        </div>
      ))}
      {cart.length > 0 && (
        <button onClick={checkout} style={{ marginTop: '1rem' }}>
          Checkout
        </button>
      )}

      <h3 style={{ marginTop: '2rem' }}>Your Orders</h3>
      {orders.length === 0 && <p>No previous orders</p>}
      {orders.map((order) => (
        <div key={order.id} style={{ border: '1px solid #ccc', marginBottom: '0.5rem', padding: '0.5rem' }}>
          <strong>Order #{order.id}</strong> — {order.date} — {order.status}
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>{item.name} — ${item.price}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
