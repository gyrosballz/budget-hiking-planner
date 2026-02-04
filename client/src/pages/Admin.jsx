import React, { useEffect, useState, useMemo } from 'react'
import API from '../api'
import { Card, Button, Select, Section, Grid, Badge, Input, Alert } from '../components/UI'

// Admin dashboard for managing users, products, orders, and platform statistics
export default function Admin() {
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [sellers, setSellers] = useState([])
  const [tab, setTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertType, setAlertType] = useState('success')
  
  // Search and filter states
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [orderDateFrom, setOrderDateFrom] = useState('')
  const [orderDateTo, setOrderDateTo] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)

  // Fetches all users from the database for admin management
  const loadUsers = async () => {
    try {
      const r = await API.get('/admin/users')
      setUsers(r.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetches all products from the database for admin oversight
  const loadProducts = async () => {
    try {
      const r = await API.get('/admin/products')
      setProducts(r.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetches all orders from the database for admin monitoring
  const loadOrders = async () => {
    try {
      const r = await API.get('/admin/orders')
      console.log('Admin orders loaded:', r.data.length, 'orders')
      setOrders(r.data)
    } catch (err) {
      console.error('Error loading admin orders:', err)
      setAlertType('error')
      setAlertMsg('Failed to load orders: ' + (err?.response?.data?.message || err.message))
    }
  }

  // Fetches platform statistics and seller performance metrics
  const loadStats = async () => {
    try {
      const [statsRes, sellersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/stats/sellers')
      ])
      console.log('Admin stats loaded:', statsRes.data)
      setStats(statsRes.data)
      setSellers(sellersRes.data)
    } catch (err) {
      console.error('Error loading admin stats:', err)
      setAlertType('error')
      setAlertMsg('Failed to load dashboard stats: ' + (err?.response?.data?.message || err.message))
    }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([loadUsers(), loadProducts(), loadOrders(), loadStats()]).then(() => {
      setLoading(false)
    })
  }, [])

  // Updates user role (customer, seller, or admin)
  const changeRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role })
      loadUsers()
      setAlertType('success');
      setAlertMsg('User role updated successfully.');
    } catch (err) {
      setAlertType('error');
      setAlertMsg('Error updating user role: ' + (err?.response?.data?.message || err.message));
    }
  }

  // Deletes a user account from the platform
  const delUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/admin/users/${id}`)
        loadUsers()
        setAlertType('success');
        setAlertMsg('User deleted successfully.');
      } catch (err) {
        setAlertType('error');
        setAlertMsg('Error deleting user: ' + (err?.response?.data?.message || err.message));
      }
    }
  }

  // Removes a product from the store inventory
  const delProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/admin/products/${id}`)
        loadProducts()
        setAlertType('success');
        setAlertMsg('Product deleted successfully.');
      } catch (err) {
        setAlertType('error');
        setAlertMsg('Error deleting product: ' + (err?.response?.data?.message || err.message));
      }
    }
  }

  // Updates order status for tracking and fulfillment
  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status })
      await loadOrders()
      setAlertType('success');
      setAlertMsg('Order status updated successfully.');
    } catch (err) {
      console.error('Error updating order status:', err)
      setAlertType('error');
      setAlertMsg('Error updating order status: ' + (err?.response?.data?.message || err.message));
    }
  }

  // Returns badge color based on order status for visual consistency
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

  // Filters users by search query and role for admin management
  const filteredUsers = useMemo(() => {
    let filtered = [...users]
    if (userSearch) {
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase())
      )
    }
    if (userRoleFilter) {
      filtered = filtered.filter(u => u.role === userRoleFilter)
    }
    return filtered
  }, [users, userSearch, userRoleFilter])

  // Filters products by search query for quick lookup
  const filteredProducts = useMemo(() => {
    let filtered = [...products]
    if (productSearch) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(productSearch.toLowerCase())
      )
    }
    return filtered
  }, [products, productSearch])

  // Filters orders by date range for reporting and analysis
  const filteredOrders = useMemo(() => {
    let filtered = [...orders]
    if (orderDateFrom) {
      const fromDate = new Date(orderDateFrom)
      filtered = filtered.filter(o => new Date(o.createdAt) >= fromDate)
    }
    if (orderDateTo) {
      const toDate = new Date(orderDateTo)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(o => new Date(o.createdAt) <= toDate)
    }
    return filtered
  }, [orders, orderDateFrom, orderDateTo])

  // Reusable tab navigation component for switching between admin sections
  const NavTabs = ({ tabs, active, onChange }) => (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '32px',
      borderBottom: '1px solid #e5e5e5',
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
            color: active === t.id ? '#000' : '#666',
            fontSize: '14px',
            fontWeight: active === t.id ? 600 : 400,
            cursor: 'pointer',
            borderBottom: active === t.id ? '2px solid #000' : 'none',
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
      {alertMsg && (
        <Alert type={alertType} onClose={() => setAlertMsg('')}>{alertMsg}</Alert>
      )}
      <NavTabs
        tabs={[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'users', label: 'Users' },
          { id: 'products', label: 'Products' },
          { id: 'orders', label: 'Orders' },
          { id: 'sellers', label: 'Seller Performance' }
        ]}
        active={tab}
        onChange={setTab}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666' }}>Loading admin data...</p>
        </div>
      ) : (
        <>
          {tab === 'dashboard' && stats && (
            <>
              {/* Main Stats Cards */}
              <Grid columns={4} gap="16px" style={{ marginBottom: '24px' }}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#000', marginBottom: '4px' }}>
                      {stats.users}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Total Users
                    </div>
                    <div style={{ fontSize: '11px', color: '#4CAF50', marginTop: '8px' }}>
                      +{stats.userGrowth} this month
                    </div>
                  </div>
                </Card>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#000', marginBottom: '4px' }}>
                      {stats.products}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Products Listed
                    </div>
                    {stats.lowStockCount > 0 && (
                      <div style={{ fontSize: '11px', color: '#ff9800', marginTop: '8px' }}>
                        ⚠️ {stats.lowStockCount} low stock
                      </div>
                    )}
                  </div>
                </Card>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#000', marginBottom: '4px' }}>
                      {stats.orders}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Total Orders
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
                      {stats.completionRate}% completion
                    </div>
                  </div>
                </Card>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#4CAF50', marginBottom: '4px' }}>
                      ${stats.revenue?.toFixed(0) || '0'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Total Revenue
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
                      ${stats.revenueLastWeek?.toFixed(0) || '0'} this week
                    </div>
                  </div>
                </Card>
              </Grid>

              {/* Secondary Stats */}
              <Grid columns={3} gap="16px" style={{ marginBottom: '24px' }}>
                <Card>
                  <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Users by Role
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px' }}>Users:</span>
                      <Badge variant="primary">{stats.usersByRole?.user || 0}</Badge>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px' }}>Sellers:</span>
                      <Badge variant="success">{stats.usersByRole?.seller || 0}</Badge>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px' }}>Admins:</span>
                      <Badge variant="danger">{stats.usersByRole?.admin || 0}</Badge>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Order Status
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => (
                      <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{status}:</span>
                        <Badge variant={getStatusColor(status)}>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Quick Stats
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px' }}>Hiking Plans:</span>
                      <strong>{stats.plans}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px' }}>Routes:</span>
                      <strong>{stats.routes}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px' }}>Pending Orders:</span>
                      <Badge variant="warning">{stats.pendingOrders}</Badge>
                    </div>
                  </div>
                </Card>
              </Grid>

              {/* Top Products & Low Stock Alerts */}
              <Grid columns={2} gap="16px" style={{ marginBottom: '24px' }}>
                <Card>
                  <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#000' }}>
                    🏆 Top Selling Products
                  </h3>
                  {stats.topProducts && stats.topProducts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {stats.topProducts.map((product, idx) => (
                        <div key={product._id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '6px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#f0f0f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 700
                            }}>
                              {idx + 1}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 500 }}>{product.name}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>{product.totalSold} sold</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '14px', color: '#4CAF50', fontWeight: 600 }}>
                            ${product.revenue?.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                      No sales data yet
                    </p>
                  )}
                </Card>

                <Card>
                  <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#000' }}>
                    ⚠️ Low Stock Alerts
                  </h3>
                  {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {stats.lowStockProducts.map(product => (
                        <div key={product._id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: 'rgba(255,152,0,0.05)',
                          borderRadius: '6px',
                          borderLeft: '3px solid #ff9800'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 500 }}>{product.name}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Needs restocking</div>
                          </div>
                          <Badge variant={product.stock < 5 ? 'danger' : 'warning'}>
                            {product.stock} units
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                      All products well stocked! ✓
                    </p>
                  )}
                </Card>
              </Grid>
            </>
          )}

          {tab === 'users' && (
            <>
              {/* User Search and Filter */}
              <Card style={{ marginBottom: '24px', padding: '20px' }}>
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
                      color: '#666', 
                      marginBottom: '8px',
                      fontWeight: 500
                    }}>
                      Search Users
                    </label>
                    <Input
                      placeholder="Search by name or email..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#666', 
                      marginBottom: '8px',
                      fontWeight: 500
                    }}>
                      Filter by Role
                    </label>
                    <select
                      value={userRoleFilter}
                      onChange={e => setUserRoleFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #e5e5e5',
                        color: '#000',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="" style={{ backgroundColor: '#000', color: '#000' }}>All Roles</option>
                      <option value="user" style={{ backgroundColor: '#000', color: '#000' }}>User</option>
                      <option value="seller" style={{ backgroundColor: '#000', color: '#000' }}>Seller</option>
                      <option value="admin" style={{ backgroundColor: '#000', color: '#000' }}>Admin</option>
                    </select>
                  </div>
                </div>
                {(userSearch || userRoleFilter) && (
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>Active filters:</span>
                    {userSearch && (
                      <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setUserSearch('')}>
                        Search: {userSearch} ×
                      </Badge>
                    )}
                    {userRoleFilter && (
                      <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setUserRoleFilter('')}>
                        Role: {userRoleFilter} ×
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setUserSearch('')
                        setUserRoleFilter('')
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </Card>

              <Grid columns={1} gap="16px">
                {filteredUsers.length === 0 ? (
                  <Card style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666' }}>
                      {users.length === 0 ? 'No users found' : 'No users match your search'}
                    </p>
                  </Card>
                ) : (
                  <>
                    <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
                      Showing {filteredUsers.length} of {users.length} users
                    </div>
                    {filteredUsers.map(u => (
                  <Card key={u._id}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '20px', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: '#000' }}>
                          {u.name}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
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
                    ))}
                  </>
                )}
              </Grid>
            </>
          )}

          {tab === 'products' && (
            <>
              {/* Product Search */}
              <Card style={{ marginBottom: '24px', padding: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    color: '#666', 
                    marginBottom: '8px',
                    fontWeight: 500
                  }}>
                    Search Products
                  </label>
                  <Input
                    placeholder="Search by product name..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    style={{ marginBottom: 0 }}
                  />
                </div>
                {productSearch && (
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setProductSearch('')}>
                      Search: {productSearch} ×
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setProductSearch('')}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </Card>

              <Grid columns={1} gap="16px">
                {filteredProducts.length === 0 ? (
                  <Card style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666' }}>
                      {products.length === 0 ? 'No products found' : 'No products match your search'}
                    </p>
                  </Card>
                ) : (
                  <>
                    <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
                      Showing {filteredProducts.length} of {products.length} products
                    </div>
                    {filteredProducts.map(p => (
                  <Card key={p._id}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '20px', alignItems: 'start' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: '#000' }}>
                          {p.name}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px 0' }}>
                          {p.description}
                        </p>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          By: <strong>{p.createdBy?.name || 'Unknown'}</strong> | Stock: <strong>{p.stock}</strong>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#000' }}>
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
                    ))}
                  </>
                )}
              </Grid>
            </>
          )}

          {tab === 'orders' && (
            <>
              {/* Order Date Range Filter */}
              <Card style={{ marginBottom: '24px', padding: '20px' }}>
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
                      color: '#666', 
                      marginBottom: '8px',
                      fontWeight: 500
                    }}>
                      From Date
                    </label>
                    <Input
                      type="date"
                      value={orderDateFrom}
                      onChange={e => setOrderDateFrom(e.target.value)}
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#666', 
                      marginBottom: '8px',
                      fontWeight: 500
                    }}>
                      To Date
                    </label>
                    <Input
                      type="date"
                      value={orderDateTo}
                      onChange={e => setOrderDateTo(e.target.value)}
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                </div>
                {(orderDateFrom || orderDateTo) && (
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => { setOrderDateFrom(''); setOrderDateTo('') }}>
                      Date: {orderDateFrom || '...'} to {orderDateTo || '...'} ×
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setOrderDateFrom('')
                        setOrderDateTo('')
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </Card>

              <Grid columns={1} gap="16px">
                {filteredOrders.length === 0 ? (
                  <Card style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666' }}>
                      {orders.length === 0 ? 'No orders found in the system' : 'No orders match your date range'}
                    </p>
                    {orders.length === 0 && (
                      <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                        Orders will appear here once customers make purchases
                      </p>
                    )}
                  </Card>
                ) : (
                  <>
                    <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
                      Showing {filteredOrders.length} of {orders.length} total orders
                    </div>
                    {filteredOrders.map(o => (
                  <Card key={o._id}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '20px', alignItems: 'center' }}>
                      <div style={{ cursor: 'pointer' }} onClick={() => setExpandedOrder(expandedOrder === o._id ? null : o._id)}>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: '#000' }}>
                          {expandedOrder === o._id ? '▼' : '▶'} Order #{o._id.slice(-8)}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px 0' }}>
                          Customer: <strong style={{ color: '#000' }}>{o.user?.name || 'Unknown'}</strong> | Items: {o.items?.length || 0}
                        </p>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '8px',
                          fontSize: '12px',
                          color: '#666'
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
                    
                    {/* Expanded Order Details */}
                    {expandedOrder === o._id && (
                      <div style={{
                        marginTop: '20px',
                        padding: '20px',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #e5e5e5'
                      }}>
                        {/* Customer Information */}
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <circle cx="12" cy="8" r="4"/>
                              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
                            </svg>
                            Customer Details
                          </h4>
                          <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: '#666' }}>
                            <div>Name: <strong style={{ color: '#000' }}>{o.user?.name || 'N/A'}</strong></div>
                            <div>Email: <strong style={{ color: '#000' }}>{o.user?.email || 'N/A'}</strong></div>
                            <div>Role: <Badge variant="primary" style={{ marginLeft: '8px' }}>{o.user?.role || 'user'}</Badge></div>
                            <div>Order Date: <strong style={{ color: '#000' }}>{new Date(o.createdAt).toLocaleString()}</strong></div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="4" y="4" width="16" height="18" rx="2"/>
                              <path d="M8 2v4M16 2v4"/>
                            </svg>
                            Order Items
                          </h4>
                          <div style={{ display: 'grid', gap: '12px' }}>
                            {o.items?.map((item, idx) => (
                              <div key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '6px',
                                border: '1px solid #e5e5e5'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <Badge variant="default">{item.qty}x</Badge>
                                  <div>
                                    <div style={{ color: '#000', fontSize: '14px', fontWeight: 500 }}>{item.product?.name || 'Unknown Product'}</div>
                                    <div style={{ color: '#666', fontSize: '12px' }}>By: {item.product?.createdBy?.name || 'Unknown Seller'}</div>
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ color: '#000', fontSize: '14px', fontWeight: 600 }}>${((item.product?.price || 0) * item.qty).toFixed(2)}</div>
                                  <div style={{ color: '#666', fontSize: '12px' }}>${item.product?.price || 0} each</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div style={{
                          padding: '16px',
                          backgroundColor: 'rgba(76,175,80,0.1)',
                          borderRadius: '4px',
                          border: '1px solid rgba(76,175,80,0.3)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#000' }}>Order Total:</span>
                            <span style={{ fontSize: '20px', fontWeight: 700, color: '#4CAF50' }}>
                              ${o.items?.reduce((sum, it) => sum + (it.product?.price * it.qty || 0), 0).toFixed(2) || '0.00'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                    ))}
                  </>
                )}
              </Grid>
            </>
          )}

          {tab === 'sellers' && (
            <Grid columns={1} gap="16px">
              {sellers.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#666' }}>No sellers found</p>
                </Card>
              ) : (
                sellers.map(seller => (
                  <Card key={seller._id} style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{seller.sellerName}</h3>
                        <p style={{ fontSize: '13px', color: '#666' }}>{seller.sellerEmail}</p>
                      </div>
                      <Badge variant="success" style={{ fontSize: '14px', padding: '6px 12px' }}>
                        Seller
                      </Badge>
                    </div>
                    <Grid columns={5} gap="16px">
                      <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#000', marginBottom: '4px' }}>
                          {seller.totalProducts}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Products</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#000', marginBottom: '4px' }}>
                          {seller.totalStock}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Total Stock</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: seller.lowStockItems > 0 ? '#ff9800' : '#fff', marginBottom: '4px' }}>
                          {seller.lowStockItems}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Low Stock</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#4CAF50', marginBottom: '4px' }}>
                          {seller.totalSales}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Units Sold</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(76,175,80,0.1)', borderRadius: '4px', border: '1px solid rgba(76,175,80,0.3)' }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#4CAF50', marginBottom: '4px' }}>
                          ${seller.revenue?.toFixed(0) || '0'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#4CAF50' }}>Revenue</div>
                      </div>
                    </Grid>
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

