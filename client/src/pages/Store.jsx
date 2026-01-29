import React, { useEffect, useState } from 'react'
import API from '../api'
import { Card, Button, Badge, Section, Grid, Alert } from '../components/UI'

export default function Store(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fallbackProducts = [
    {
      _id: 'fallback-1',
      name: 'Budget Backpacking Tent (2-Person)',
      description: 'Lightweight, waterproof dome tent perfect for backcountry trips',
      price: 79.99,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop'
    },
    {
      _id: 'fallback-2',
      name: 'Lightweight Sleeping Bag (15°F)',
      description: 'Compact insulated bag rated for cold weather hiking',
      price: 59.99,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop'
    },
    {
      _id: 'fallback-3',
      name: 'Portable Hiking Stove',
      description: 'Ultralight canister stove with windscreen and pot support',
      price: 29.99,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1531223651270-b8efb1a45ebc?w=400&h=300&fit=crop'
    }
  ]

  useEffect(() => {
    API.get('/products')
      .then(r => {
        setProducts(r.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load products. Showing sample items. Start the API server on http://localhost:5000 for live data.')
        setProducts(fallbackProducts)
        setLoading(false)
      })
  }, [])

  const add = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login to add to cart')
      return
    }
    try {
      await API.post('/cart/items', { product: id, qty: 1 })
      const refreshed = await API.get('/products')
      setProducts(refreshed.data)
      alert('Added to cart')
    } catch (err) {
      alert('Failed to add to cart')
    }
  }

  return (
    <Section
      title="Hiking Gear Store"
      subtitle="Everything you need for your next adventure"
    >
      {error && <Alert type="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#888', fontSize: '16px' }}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#888', fontSize: '16px' }}>No products available</p>
        </div>
      ) : (
        <Grid columns={3} gap="24px">
          {products.map(p => (
            <Card key={p._id} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {p.imageUrl && (
                <div style={{
                  width: '100%',
                  height: '200px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }}>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                </div>
              )}
              <div style={{ marginBottom: '16px' }}>
                <Badge variant={p.stock > 0 ? 'success' : 'danger'}>
                  {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '12px',
                letterSpacing: '-0.3px',
                color: '#fff'
              }}>
                {p.name}
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#888',
                marginBottom: '16px',
                minHeight: '36px',
                flex: 1
              }}>
                {p.description || 'Quality hiking gear perfect for your trips'}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}>
                <span style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.5px'
                }}>
                  ${p.price}
                </span>
                <span style={{
                  fontSize: '13px',
                  color: '#888'
                }}>
                  Stock: <strong style={{ color: '#fff' }}>{p.stock}</strong>
                </span>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => add(p._id)}
                disabled={p.stock === 0}
                style={{ width: '100%' }}
              >
                Add to Cart
              </Button>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  )
}
