import React, { useEffect, useState, useMemo } from 'react'
import API from '../api'
import { Card, Button, Badge, Section, Grid, Alert, Input } from '../components/UI'

export default function Store(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [success, setSuccess] = useState('')
  const [addError, setAddError] = useState('')
  const [quantities, setQuantities] = useState({})
  const [inlineErrors, setInlineErrors] = useState({})

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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search by name
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Price filter
    if (priceFilter) {
      switch (priceFilter) {
        case 'budget':
          filtered = filtered.filter(p => p.price < 50)
          break
        case 'mid':
          filtered = filtered.filter(p => p.price >= 50 && p.price <= 100)
          break
        case 'premium':
          filtered = filtered.filter(p => p.price > 100)
          break
      }
    }

    // Stock filter
    if (stockFilter === 'in-stock') {
      filtered = filtered.filter(p => p.stock > 0)
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter(p => p.stock === 0)
    }

    // Sort
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          break
      }
    }

    return filtered
  }, [products, search, priceFilter, stockFilter, sortBy])

  const add = async (id) => {
    setAddError('');
    setSuccess('');
    setInlineErrors(e => ({ ...e, [id]: '' }));
    const qty = parseInt(quantities[id] || 1, 10);
    const product = products.find(p => p._id === id);
    if (!qty || qty < 1) {
      setInlineErrors(e => ({ ...e, [id]: 'Enter a valid quantity.' }));
      return;
    }
    if (qty > (product?.stock || 0)) {
      setInlineErrors(e => ({ ...e, [id]: 'Not enough stock.' }));
      return;
    }
    const token = localStorage.getItem('token')
    if (!token) {
      setAddError('Please login to add to cart.');
      return;
    }
    try {
      await API.post('/cart/items', { product: id, qty })
      const refreshed = await API.get('/products')
      setProducts(refreshed.data)
      setSuccess('Added to cart!')
      setTimeout(() => setSuccess(''), 2000)
      setQuantities(q => ({ ...q, [id]: '' }));
    } catch (err) {
      setAddError('Failed to add to cart.');
    }
  }

  return (
    <Section
      title="Hiking Gear Store"
      subtitle="Everything you need for your next adventure"
    >
      {error && <Alert type="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      {addError && <Alert type="error" style={{ marginBottom: '20px' }}>{addError}</Alert>}
      {success && <Alert type="success" style={{ marginBottom: '20px' }}>{success}</Alert>}
      
      {/* Search and Filter Controls */}
      <Card style={{ marginBottom: '32px', padding: '20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              color: '#888', 
              marginBottom: '8px',
              fontWeight: 500
            }}>
              Search Products
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
              padding: '2px 12px 2px 8px',
              border: '1px solid rgba(255,255,255,0.13)',
              transition: 'box-shadow 0.2s',
              marginBottom: 0,
              minHeight: '44px',
              position: 'relative',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', opacity: 0.7}}>
                <circle cx="9" cy="9" r="7" stroke="#bbb" strokeWidth="2" />
                <line x1="14.2" y1="14.2" x2="18" y2="18" stroke="#bbb" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '15px',
                  padding: '10px 0',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.2px',
                  borderRadius: '24px',
                  transition: 'background 0.2s',
                }}
                aria-label="Search products"
              />
            </div>
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              color: '#888', 
              marginBottom: '8px',
              fontWeight: 500
            }}>
              Price Range
            </label>
            <select
              value={priceFilter}
              onChange={e => setPriceFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              <option value="" style={{ backgroundColor: '#000', color: '#fff' }}>All Prices</option>
              <option value="budget" style={{ backgroundColor: '#000', color: '#fff' }}>Budget (&lt;$50)</option>
              <option value="mid" style={{ backgroundColor: '#000', color: '#fff' }}>Mid ($50-$100)</option>
              <option value="premium" style={{ backgroundColor: '#000', color: '#fff' }}>Premium (&gt;$100)</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              color: '#888', 
              marginBottom: '8px',
              fontWeight: 500
            }}>
              Stock Status
            </label>
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              <option value="" style={{ backgroundColor: '#000', color: '#fff' }}>All Items</option>
              <option value="in-stock" style={{ backgroundColor: '#000', color: '#fff' }}>In Stock</option>
              <option value="out-of-stock" style={{ backgroundColor: '#000', color: '#fff' }}>Out of Stock</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              color: '#888', 
              marginBottom: '8px',
              fontWeight: 500
            }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              <option value="" style={{ backgroundColor: '#000', color: '#fff' }}>Default</option>
              <option value="price-low" style={{ backgroundColor: '#000', color: '#fff' }}>Price: Low to High</option>
              <option value="price-high" style={{ backgroundColor: '#000', color: '#fff' }}>Price: High to Low</option>
              <option value="name" style={{ backgroundColor: '#000', color: '#fff' }}>Name (A-Z)</option>
              <option value="newest" style={{ backgroundColor: '#000', color: '#fff' }}>Newest First</option>
            </select>
          </div>
        </div>

        {(search || priceFilter || stockFilter || sortBy) && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#888' }}>Active filters:</span>
            {search && (
              <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setSearch('')}>
                Search: {search} ×
              </Badge>
            )}
            {priceFilter && (
              <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setPriceFilter('')}>
                Price: {priceFilter === 'budget' ? '<$50' : priceFilter === 'mid' ? '$50-$100' : '>$100'} ×
              </Badge>
            )}
            {stockFilter && (
              <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setStockFilter('')}>
                Stock: {stockFilter === 'in-stock' ? 'In Stock' : 'Out of Stock'} ×
              </Badge>
            )}
            {sortBy && (
              <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setSortBy('')}>
                Sort: {sortBy} ×
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSearch('')
                setPriceFilter('')
                setStockFilter('')
                setSortBy('')
              }}
            >
              Clear All
            </Button>
          </div>
        )}
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#888', fontSize: '16px' }}>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#888', fontSize: '16px', marginBottom: '8px' }}>
            {products.length === 0 ? 'No products available' : 'No products match your filters'}
          </p>
          {(search || priceFilter || stockFilter) && (
            <Button variant="outline" size="sm" onClick={() => {
              setSearch('')
              setPriceFilter('')
              setStockFilter('')
              setSortBy('')
            }}>
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div style={{ marginBottom: '16px', fontSize: '14px', color: '#888' }}>
            Showing {filteredProducts.length} of {products.length} products
          </div>
          <Grid columns={3} gap="24px">
            {filteredProducts.map(p => (
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
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Input
                    type="number"
                    min={1}
                    max={p.stock}
                    value={quantities[p._id] || ''}
                    onChange={e => setQuantities(q => ({ ...q, [p._id]: e.target.value }))}
                    placeholder="Qty"
                    style={{ width: '80px', marginBottom: 0 }}
                    disabled={p.stock === 0}
                  />
                  <span style={{ color: '#888', fontSize: '13px' }}>
                    / {p.stock} available
                  </span>
                </div>
                {inlineErrors[p._id] && (
                  <div style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '8px' }}>{inlineErrors[p._id]}</div>
                )}
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
        </>
      )}
    </Section>
  )
}
