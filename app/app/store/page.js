'use client';

import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { role } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await apiClient.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await apiClient.createProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
      setFormData({ name: '', price: '', stock: '', category: '' });
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleAddToCart(product) {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  }

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Store</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {(role === 'admin' || role === 'seller') && (
          <>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '1rem',
              }}
            >
              {showForm ? 'Cancel' : 'Add Product'}
            </button>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                }}
              >
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  step="0.01"
                  style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Add Product
                </button>
              </form>
            )}
          </>
        )}

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                }}
              >
                <h3>{product.name}</h3>
                <p>💰 ${product.price}</p>
                <p>📦 Stock: {product.stock}</p>
                {product.category && <p>🏷️ {product.category}</p>}
                {product.stock > 0 && (
                  <button
                    onClick={() => handleAddToCart(product)}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Add to Cart
                  </button>
                )}
                {product.stock === 0 && <p style={{ color: 'red' }}>Out of Stock</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
