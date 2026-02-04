import React, { useEffect, useState, useMemo } from 'react'
import API from '../api'
import { Card, Button, Badge, Section, Grid, Alert, Input } from '../components/UI'

// Product marketplace for browsing and purchasing hiking gear
export default function Store(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [iconCategoryFilter, setIconCategoryFilter] = useState('')
  const [success, setSuccess] = useState('')
  const [addError, setAddError] = useState('')
  const [quantities, setQuantities] = useState({})
  const [inlineErrors, setInlineErrors] = useState({})

  // Fallback product data displayed when backend API is unavailable
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

  // Loads products from backend API on component mount
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

  // Filters and sorts products based on search, price, stock, and sort criteria
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search by name
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(categoryFilter.toLowerCase())
      )
    }

    // Icon category filter
    if (iconCategoryFilter) {
      if (iconCategoryFilter.toLowerCase() === 'accessories') {
        // Show items that don't match other specific categories
        filtered = filtered.filter(p => {
          const name = p.name.toLowerCase();
          return !name.includes('tent') && 
                 !name.includes('sleeping') && 
                 !name.includes('bag') && 
                 !name.includes('stove') && 
                 !name.includes('cooking') && 
                 !name.includes('kitchen') && 
                 !name.includes('pot') && 
                 !name.includes('pan') && 
                 !name.includes('backpack') && 
                 !name.includes('pack');
        });
      } else {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(iconCategoryFilter.toLowerCase())
        );
      }
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
  }, [products, search, priceFilter, stockFilter, sortBy, categoryFilter, iconCategoryFilter])

  // Adds product to cart with quantity validation and stock checking
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
      
      {/* Category Icon Grid */}
      <div style={{ 
        marginBottom: '32px', 
        padding: '24px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '16px'
        }}>
          {[
            { name: 'Tent', keywords: ['tent'], icon: (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 8L8 30H32L20 8Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M20 8V30" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )},
            { name: 'Sleeping', keywords: ['sleeping', 'bag'], icon: (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="18" width="24" height="8" rx="2" stroke="#000" strokeWidth="1.5" fill="none"/>
                <path d="M8 22H32" stroke="#000" strokeWidth="1.5"/>
                <circle cx="28" cy="22" r="2" fill="#000"/>
              </svg>
            )},
            { name: 'Kitchen', keywords: ['stove', 'cooking', 'kitchen', 'pot', 'pan'], icon: (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="22" r="8" stroke="#000" strokeWidth="1.5" fill="none"/>
                <path d="M12 22H28M20 14V10" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="18" y="8" width="4" height="4" rx="1" stroke="#000" strokeWidth="1.5" fill="none"/>
              </svg>
            )},
            { name: 'Backpack', keywords: ['backpack', 'bag', 'pack'], icon: (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M12 16L10 30H30L28 16H12Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M16 16V14C16 11.7909 17.7909 10 20 10C22.2091 10 24 11.7909 24 14V16" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )},
            { name: 'Accessories', keywords: ['accessories', 'gear', 'equipment'], icon: (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="8" stroke="#000" strokeWidth="1.5" fill="none"/>
                <path d="M20 12V8M20 32V28M28 20H32M8 20H12" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          ].map((cat, idx) => {
            const isActive = cat.keywords.some(keyword => 
              iconCategoryFilter.toLowerCase() === keyword.toLowerCase()
            );
            return (
              <button
                key={idx}
                onClick={() => {
                  if (isActive) {
                    setIconCategoryFilter('');
                  } else {
                    setIconCategoryFilter(cat.keywords[0]);
                    setCategoryFilter(''); // Clear pill filter when icon is clicked
                  }
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 8px',
                  backgroundColor: isActive ? '#000' : '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#000'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#e5e5e5'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ filter: isActive ? 'brightness(0) invert(1)' : 'none' }}>
                    {cat.icon}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: isActive ? '#fff' : '#000', 
                  fontWeight: 400,
                  textAlign: 'center',
                  letterSpacing: '0px'
                }}>
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Category Filter Pills */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {['Original Tent', 'One Touch Tent', 'One Pole Tent', 'Shelter Tent'].map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(categoryFilter === category ? '' : category)}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                border: '1px solid #e5e5e5',
                backgroundColor: categoryFilter === category ? '#000' : '#fff',
                color: categoryFilter === category ? '#fff' : '#000',
                fontSize: '14px',
                fontWeight: 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => {
                if (categoryFilter !== category) {
                  e.target.style.borderColor = '#999'
                }
              }}
              onMouseLeave={e => {
                if (categoryFilter !== category) {
                  e.target.style.borderColor = '#e5e5e5'
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

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
              background: '#fff',
              borderRadius: '4px',
              border: '1px solid #e5e5e5',
              padding: '2px 12px 2px 8px',
              transition: 'border-color 0.2s',
              marginBottom: 0,
              minHeight: '44px',
              position: 'relative',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', opacity: 0.5}}>
                <circle cx="9" cy="9" r="7" stroke="#666" strokeWidth="2" />
                <line x1="14.2" y1="14.2" x2="18" y2="18" stroke="#666" strokeWidth="2" strokeLinecap="round" />
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
                  color: '#000',
                  fontSize: '14px',
                  padding: '10px 0',
                  fontFamily: 'inherit',
                  letterSpacing: '0px',
                  borderRadius: '4px',
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
              color: '#666', 
              marginBottom: '8px',
              fontWeight: 400
            }}>
              Price Range
            </label>
            <select
              value={priceFilter}
              onChange={e => setPriceFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '4px',
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                color: '#000',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              <option value="" style={{ backgroundColor: '#fff', color: '#000' }}>All Prices</option>
              <option value="budget" style={{ backgroundColor: '#fff', color: '#000' }}>Budget (&lt;$50)</option>
              <option value="mid" style={{ backgroundColor: '#fff', color: '#000' }}>Mid ($50-$100)</option>
              <option value="premium" style={{ backgroundColor: '#fff', color: '#000' }}>Premium (&gt;$100)</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              color: '#666', 
              marginBottom: '8px',
              fontWeight: 400
            }}>
              Stock Status
            </label>
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '4px',
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                color: '#000',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              <option value="" style={{ backgroundColor: '#fff', color: '#000' }}>All Items</option>
              <option value="in-stock" style={{ backgroundColor: '#fff', color: '#000' }}>In Stock</option>
              <option value="out-of-stock" style={{ backgroundColor: '#fff', color: '#000' }}>Out of Stock</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              color: '#666', 
              marginBottom: '8px',
              fontWeight: 400
            }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '4px',
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                color: '#000',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              <option value="" style={{ backgroundColor: '#fff', color: '#000' }}>Default</option>
              <option value="price-low" style={{ backgroundColor: '#fff', color: '#000' }}>Price: Low to High</option>
              <option value="price-high" style={{ backgroundColor: '#fff', color: '#000' }}>Price: High to Low</option>
              <option value="name" style={{ backgroundColor: '#fff', color: '#000' }}>Name (A-Z)</option>
              <option value="newest" style={{ backgroundColor: '#fff', color: '#000' }}>Newest First</option>
            </select>
          </div>
        </div>

        {(search || priceFilter || stockFilter || sortBy || categoryFilter || iconCategoryFilter) && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#666' }}>Active filters:</span>
            {search && (
              <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setSearch('')}>
                Search: {search} ×
              </Badge>
            )}
            {iconCategoryFilter && (
              <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setIconCategoryFilter('')}>
                Category: {iconCategoryFilter} ×
              </Badge>
            )}
            {categoryFilter && (
              <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setCategoryFilter('')}>
                Type: {categoryFilter} ×
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
                setCategoryFilter('')
                setIconCategoryFilter('')
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
          <p style={{ color: '#666', fontSize: '16px' }}>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '8px' }}>
            {products.length === 0 ? 'No products available' : 'No products match your filters'}
          </p>
          {(search || priceFilter || stockFilter) && (
            <Button variant="outline" size="sm" onClick={() => {
              setSearch('')
              setCategoryFilter('')
              setIconCategoryFilter('')
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
          <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
            Showing {filteredProducts.length} of {products.length} products
          </div>
          <Grid columns={4} gap="20px">
            {filteredProducts.map(p => (
              <Card key={p._id} style={{ 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                padding: '0', 
                border: '1px solid #e5e5e5', 
                borderRadius: '0',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              >
                {p.imageUrl && (
                  <div style={{
                    width: '100%',
                    height: '300px',
                    overflow: 'hidden',
                    backgroundColor: '#f9f9f9',
                    position: 'relative'
                  }}>
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: '16px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <Badge variant="default" style={{ 
                      fontSize: '10px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '1px',
                      padding: '4px 8px'
                    }}>
                      TENT
                    </Badge>
                  </div>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    marginBottom: '8px',
                    letterSpacing: '0px',
                    color: '#000',
                    lineHeight: 1.4,
                    minHeight: '40px'
                  }}>
                    {p.name}
                  </h3>
                  
                  {/* Color Swatches */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '6px', 
                    marginBottom: '12px',
                    alignItems: 'center' 
                  }}>
                    {['#8B4513', '#228B22', '#1E90FF', '#FFD700'].map((color, idx) => (
                      <button
                        key={idx}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: idx === 0 ? '2px solid #000' : '1px solid #e5e5e5',
                          cursor: 'pointer',
                          padding: 0,
                          outline: 'none',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.15)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        aria-label={`Color ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    paddingTop: '8px',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#000',
                      letterSpacing: '0px'
                    }}>
                      ${p.price}
                    </span>
                    <span style={{ 
                      color: p.stock > 0 ? '#666' : '#ff4444', 
                      fontSize: '11px',
                      fontWeight: 400
                    }}>
                      {p.stock > 0 ? `Stock: ${p.stock}` : 'Out of Stock'}
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
                      style={{ width: '70px', marginBottom: 0, fontSize: '13px', padding: '8px' }}
                      disabled={p.stock === 0}
                    />
                  </div>
                  {inlineErrors[p._id] && (
                    <div style={{ color: '#ff4444', fontSize: '12px', marginBottom: '8px' }}>{inlineErrors[p._id]}</div>
                  )}
                  <Button
                    variant="primary"
                    onClick={() => add(p._id)}
                    disabled={p.stock === 0}
                    style={{ 
                      width: '100%',
                      padding: '12px',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '0.5px'
                    }}
                  >
                    {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </Card>
            ))}
          </Grid>
        </>
      )}
    </Section>
  )
}
