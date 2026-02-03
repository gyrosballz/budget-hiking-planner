import React, { useEffect, useState } from 'react'
import API from '../api'
import { Card, Button, Section, Grid, Badge, Alert } from '../components/UI'

export default function Seller() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [tab, setTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  })

  useEffect(() => {
    loadData()
    loadStats()
  }, [tab])

  const loadStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        API.get('/products'),
        API.get('/orders')
      ])
      
      const token = localStorage.getItem('token')
      const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null
      
      const myProducts = productsRes.data.filter(p => p.createdBy === userId || p.createdBy?._id === userId)
      const myProductIds = myProducts.map(p => p._id)
      
      // Filter orders that contain seller's products
      const myOrders = ordersRes.data.filter(order => 
        order.items?.some(item => myProductIds.includes(item.product?._id))
      )
      
      const totalRevenue = myOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => {
          return sum + order.items
            .filter(item => myProductIds.includes(item.product?._id))
            .reduce((itemSum, item) => itemSum + (item.product?.price * item.qty || 0), 0)
        }, 0)
      
      const totalSales = myOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => {
          return sum + order.items
            .filter(item => myProductIds.includes(item.product?._id))
            .reduce((itemSum, item) => itemSum + item.qty, 0)
        }, 0)
      
      const totalStock = myProducts.reduce((sum, p) => sum + p.stock, 0)
      const lowStockItems = myProducts.filter(p => p.stock < 10).length
      const pendingOrders = myOrders.filter(o => o.status === 'pending').length
      
      setStats({
        totalProducts: myProducts.length,
        totalRevenue,
        totalSales,
        totalStock,
        lowStockItems,
        pendingOrders,
        totalOrders: myOrders.length
      })
    } catch (err) {
      console.error(err)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'products') {
        const r = await API.get('/products')
        // Filter to show only seller's products
        const token = localStorage.getItem('token')
        const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null
        setProducts(r.data.filter(p => p.createdBy === userId || p.createdBy?._id === userId))
      } else {
        const r = await API.get('/orders')
        setOrders(r.data)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      } else {
        await API.post('/products', {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      }
      setShowForm(false)
      setEditingProduct(null)
      setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' })
      loadData()
    } catch (err) {
      alert('Error: ' + err.response?.data?.message || err.message)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product? This action cannot be undone.')) {
      try {
        await API.delete(`/products/${id}`)
        loadData()
      } catch (err) {
        alert('Error: ' + err.response?.data?.message || err.message)
      }
    }
  }

  const updateStock = async (id, newStock) => {
    try {
      await API.put(`/products/${id}`, { stock: parseInt(newStock) })
      loadData()
    } catch (err) {
      alert('Error: ' + err.response?.data?.message || err.message)
    }
  }

  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status })
      loadData()
    } catch (err) {
      alert('Error: ' + err.response?.data?.message || err.message)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'primary',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    }
    return colors[status] || 'default'
  }

  const calculateProductRevenue = (productId) => {
    return orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => {
        const item = order.items.find(i => i.product._id === productId)
        return sum + (item ? item.qty * item.product.price : 0)
      }, 0)
  }

  const NavTabs = ({ tabs, active, onChange }) => (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '32px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      paddingBottom: '16px'
    }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: 'none',
            color: active === t.id ? '#fff' : '#888',
            fontSize: '14px',
            fontWeight: active === t.id ? 600 : 400,
            cursor: 'pointer',
            borderBottom: active === t.id ? '2px solid #fff' : 'none',
            transition: 'all 0.2s'
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )

  return (
    <Section title="Seller Dashboard" subtitle="Manage your products, inventory, and process orders">
      <NavTabs
        tabs={[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'products', label: 'My Products' },
          { id: 'orders', label: 'Orders' }
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'dashboard' && stats && (
        <>
          {/* Stats Overview */}
          <Grid columns={4} gap="16px" style={{ marginBottom: '24px' }}>
            <Card>
              <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Revenue
              </h3>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#4CAF50', marginBottom: '4px' }}>
                ${stats.totalRevenue?.toFixed(2) || '0.00'}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>All-time earnings</div>
            </Card>
            
            <Card>
              <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Products
              </h3>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {stats.totalProducts || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {stats.lowStockItems > 0 && (
                  <span style={{ color: '#ff9800' }}>⚠️ {stats.lowStockItems} low stock</span>
                )}
                {stats.lowStockItems === 0 && 'All stocked'}
              </div>
            </Card>
            
            <Card>
              <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Sales
              </h3>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {stats.totalSales || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>Units sold</div>
            </Card>
            
            <Card>
              <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Orders
              </h3>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {stats.totalOrders || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {stats.pendingOrders > 0 && (
                  <Badge variant="warning">{stats.pendingOrders} pending</Badge>
                )}
                {stats.pendingOrders === 0 && 'All processed'}
              </div>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Card style={{ marginBottom: '24px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#fff' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={() => { setTab('products'); setShowForm(true) }}>
                + Add New Product
              </Button>
              <Button variant="secondary" onClick={() => setTab('products')}>
                Manage Products
              </Button>
              <Button variant="secondary" onClick={() => setTab('orders')}>
                View Orders
              </Button>
            </div>
          </Card>

          {/* Product Performance */}
          <Card style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#fff' }}>Product Performance</h3>
            {products.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Add products to see performance metrics</p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {products.slice(0, 5).map(p => (
                  <div key={p._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: '6px'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>Stock: {p.stock} units</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#4CAF50' }}>${p.price}</div>
                      <Badge variant={p.stock > 10 ? 'success' : p.stock > 5 ? 'warning' : 'danger'}>
                        {p.stock > 10 ? 'Good' : p.stock > 5 ? 'Low' : 'Critical'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {tab === 'products' && (
        <>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button onClick={() => {
              setShowForm(!showForm)
              setEditingProduct(null)
              setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' })
            }}>
              {showForm ? 'Cancel' : '+ Add New Product'}
            </Button>
            <div style={{ color: '#888', fontSize: '14px' }}>
              Total Products: <strong style={{ color: '#fff' }}>{products.length}</strong>
            </div>
          </div>

          {showForm && (
            <Card style={{ marginBottom: '24px', padding: '24px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>
                      Image URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false)
                      setEditingProduct(null)
                      setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#888', marginBottom: '16px' }}>No products yet</p>
              <p style={{ color: '#666', fontSize: '14px' }}>Add your first product to start selling</p>
            </Card>
          ) : (
            <Grid columns={1} gap="16px">
              {products.map(p => (
                <Card key={p._id} style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {p.imageUrl && (
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: 'rgba(255,255,255,0.05)'
                      }}>
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{p.name}</h3>
                          <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '12px' }}>{p.description}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="secondary" onClick={() => handleEdit(p)}>Edit</Button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ color: '#888', fontSize: '13px' }}>Price: </span>
                          <strong style={{ fontSize: '16px', color: '#4CAF50' }}>${p.price.toFixed(2)}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#888', fontSize: '13px' }}>Stock: </span>
                          <Badge variant={p.stock > 10 ? 'success' : p.stock > 5 ? 'warning' : 'danger'}>
                            {p.stock} units
                          </Badge>
                          {p.stock < 10 && (
                            <span style={{ color: '#ff9800', fontSize: '12px', marginLeft: '8px' }}>
                              {p.stock < 5 ? '⚠️ Critical' : '⚠️ Low'}
                            </span>
                          )}
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <label style={{ color: '#888', fontSize: '13px' }}>Quick Update:</label>
                          <input
                            type="number"
                            min="0"
                            defaultValue={p.stock}
                            onBlur={(e) => {
                              if (e.target.value !== p.stock.toString()) {
                                updateStock(p._id, e.target.value)
                              }
                            }}
                            style={{
                              width: '80px',
                              padding: '6px 8px',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '4px',
                              color: '#fff',
                              fontSize: '13px'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </Grid>
          )}
        </>
      )}

      {tab === 'orders' && (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#888', marginBottom: '16px' }}>No orders yet</p>
              <p style={{ color: '#666', fontSize: '14px' }}>Orders will appear here once customers make purchases</p>
            </Card>
          ) : (
            <Grid columns={1} gap="16px">
              {orders.map(o => (
                <Card key={o._id} style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => setExpandedOrder(expandedOrder === o._id ? null : o._id)}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '16px' }}>{expandedOrder === o._id ? '▼' : '▶'} Order #{o._id.slice(-6)}</h3>
                        <Badge variant={getStatusColor(o.status)}>{o.status}</Badge>
                      </div>
                      <p style={{ color: '#888', fontSize: '13px' }}>
                        Customer: <strong style={{ color: '#fff' }}>{o.user?.name || 'Unknown'}</strong>
                      </p>
                      <p style={{ color: '#888', fontSize: '13px' }}>
                        Date: {new Date(o.createdAt).toLocaleDateString()} at {new Date(o.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#888' }}>
                        Update Status:
                      </label>
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Expanded Order Details */}
                  {expandedOrder === o._id && (
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      paddingTop: '16px',
                      marginTop: '16px'
                    }}>
                      {/* Customer Details */}
                      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                        <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#aaa' }}>Customer Information:</h4>
                        <div style={{ fontSize: '14px', color: '#fff' }}>
                          <div>Name: <strong>{o.user?.name || 'N/A'}</strong></div>
                          <div>Email: <strong>{o.user?.email || 'N/A'}</strong></div>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#aaa' }}>Order Items:</h4>
                      {o.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                          <span>{item.product?.name || 'Unknown Product'} × {item.qty}</span>
                          <span style={{ color: '#4CAF50' }}>${((item.product?.price || 0) * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span>Total:</span>
                        <span style={{ color: '#4CAF50', fontSize: '16px' }}>
                          ${o.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </Grid>
          )}
        </>
      )}
    </Section>
  )
}
