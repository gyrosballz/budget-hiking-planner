import React, { useEffect, useState } from 'react'
import API from '../api'
import { Card, Button, Select, Section, Grid, Badge } from '../components/UI'

export default function Admin(){
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [tab, setTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)

  const loadUsers = async () => {
    try {
      const r = await API.get('/admin/users')
      setUsers(r.data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadProducts = async () => {
    try {
      const r = await API.get('/admin/products')
      setProducts(r.data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadOrders = async () => {
    try {
      const r = await API.get('/admin/orders')
      setOrders(r.data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadStats = async () => {
    try {
      const r = await API.get('/admin/stats')
      setStats(r.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([loadUsers(), loadProducts(), loadOrders(), loadStats()]).then(() => {
      setLoading(false)
    })
  }, [])

  const changeRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role })
      loadUsers()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const delUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/admin/users/${id}`)
        loadUsers()
      } catch (err) {
        alert('Error: ' + err.message)
      }
    }
  }

  const delProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/admin/products/${id}`)
        loadProducts()
      } catch (err) {
        alert('Error: ' + err.message)
      }
    }
  }

  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status })
      loadOrders()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'processing': return 'primary'
      case 'shipped': return 'primary'
      case 'delivered': return 'success'
      case 'cancelled': return 'danger'
      default: return 'default'
    }
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
    <Section title="Admin Dashboard" subtitle="Manage users, products, orders, and view analytics">
      <NavTabs
        tabs={[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'users', label: 'Users' },
          { id: 'products', label: 'Products' },
          { id: 'orders', label: 'Orders' }
        ]}
        active={tab}
        onChange={setTab}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888' }}>Loading admin data...</p>
        </div>
      ) : (
        <>
          {tab === 'dashboard' && stats && (
            <Grid columns={4} gap="16px" style={{ marginBottom: '32px' }}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    {stats.totalUsers}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Total Users
                  </div>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    {stats.totalProducts}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Products Listed
                  </div>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    {stats.totalOrders}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Total Orders
                  </div>
                </div>
              </Card>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    ${stats.totalRevenue?.toFixed(0) || '0'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Total Revenue
                  </div>
                </div>
              </Card>
            </Grid>
          )}

          {tab === 'users' && (
            <Grid columns={1} gap="16px">
              {users.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#888' }}>No users found</p>
                </Card>
              ) : (
                users.map(u => (
                  <Card key={u._id}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '20px', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: '#fff' }}>
                          {u.name}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
                          {u.email}
                        </p>
                      </div>
                      <Select
                        value={u.role}
                        onChange={e => changeRole(u._id, e.target.value)}
                        options={[
                          { label: 'User', value: 'user' },
                          { label: 'Seller', value: 'seller' },
                          { label: 'Admin', value: 'admin' }
                        ]}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => delUser(u._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </Grid>
          )}

          {tab === 'products' && (
            <Grid columns={1} gap="16px">
              {products.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#888' }}>No products found</p>
                </Card>
              ) : (
                products.map(p => (
                  <Card key={p._id}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '20px', alignItems: 'start' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: '#fff' }}>
                          {p.name}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#888', margin: '0 0 8px 0' }}>
                          {p.description}
                        </p>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          By: <strong>{p.createdBy?.name || 'Unknown'}</strong> | Stock: <strong>{p.stock}</strong>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                          ${p.price}
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => delProduct(p._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </Grid>
          )}

          {tab === 'orders' && (
            <Grid columns={1} gap="16px">
              {orders.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#888' }}>No orders found</p>
                </Card>
              ) : (
                orders.map(o => (
                  <Card key={o._id}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '20px', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: '#fff' }}>
                          Order #{o._id.slice(-8)}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#888', margin: '0 0 8px 0' }}>
                          User: <strong>{o.user?.name || 'Unknown'}</strong> | Items: {o.items?.length || 0}
                        </p>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '8px',
                          fontSize: '12px',
                          color: '#888'
                        }}>
                          <div>Created: {new Date(o.createdAt).toLocaleDateString()}</div>
                          <div>Total: ${o.items?.reduce((sum, it) => sum + (it.product?.price * it.qty || 0), 0).toFixed(2) || '0'}</div>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(o.status)}>
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </Badge>
                      <Select
                        value={o.status}
                        onChange={e => updateOrderStatus(o._id, e.target.value)}
                        options={[
                          { label: 'Pending', value: 'pending' },
                          { label: 'Processing', value: 'processing' },
                          { label: 'Shipped', value: 'shipped' },
                          { label: 'Delivered', value: 'delivered' },
                          { label: 'Cancelled', value: 'cancelled' }
                        ]}
                      />
                    </div>
                  </Card>
                ))
              )}
            </Grid>
          )}
        </>
      )}
    </Section>
  )
}
