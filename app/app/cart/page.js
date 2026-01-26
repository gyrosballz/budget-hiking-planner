'use client';

import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  async function handleCheckout() {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      await apiClient.createOrder({ items: cart });
      clearCart();
      alert('Order created successfully!');
      router.push('/orders');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Shopping Cart</h1>

        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {cart.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f9f9f9',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                  }}
                >
                  <h3>{item.name}</h3>
                  <p>💰 ${item.price}</p>
                  <button
                    onClick={() => removeFromCart(index)}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dc3545',
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

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
              <h2>Total: ${total.toFixed(2)}</h2>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </button>
                <button
                  onClick={clearCart}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
