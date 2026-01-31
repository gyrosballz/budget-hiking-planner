import React, { useEffect, useState, useMemo } from 'react'
import API from '../api'
import { Card, Section, Grid, Badge, Input, Button } from '../components/UI'

export default function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const r = await API.get('/orders')
        setOrders(r.data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [])

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders]

    // Search by order ID
    if (search) {
      filtered = filtered.filter(o => 
        o._id.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(o => o.status === statusFilter)
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      filtered = filtered.filter(o => new Date(o.createdAt) >= fromDate)
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter(o => new Date(o.createdAt) <= toDate)
    }

    return filtered
  }, [orders, search, statusFilter, dateFrom, dateTo])

  // Export orders to CSV
  const exportToCSV = () => {
    const headers = ['Order ID', 'Status', 'Date', 'Items', 'Total']
    const rows = filteredOrders.map(o => [
      o._id.slice(-8),
      o.status,
      formatDate(o.createdAt),
      o.items?.length || 0,
      `$${o.items?.reduce((sum, it) => sum + (it.product?.price * it.qty || 0), 0).toFixed(2) || '0.00'}`
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Export orders to JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredOrders, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Section title="Order History" subtitle="Track your hiking gear purchases">
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
              Search Order ID
            </label>
            <Input
              placeholder="Search by order ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              color: '#888', 
              marginBottom: '8px',
              fontWeight: 500
            }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
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
              <option value="" style={{ backgroundColor: '#000', color: '#fff' }}>All Statuses</option>
              <option value="pending" style={{ backgroundColor: '#000', color: '#fff' }}>Pending</option>
              <option value="processing" style={{ backgroundColor: '#000', color: '#fff' }}>Processing</option>
              <option value="shipped" style={{ backgroundColor: '#000', color: '#fff' }}>Shipped</option>
              <option value="delivered" style={{ backgroundColor: '#000', color: '#fff' }}>Delivered</option>
              <option value="cancelled" style={{ backgroundColor: '#000', color: '#fff' }}>Cancelled</option>
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
              From Date
            </label>
            <Input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              color: '#888', 
              marginBottom: '8px',
              fontWeight: 500
            }}>
              To Date
            </label>
            <Input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
        </div>

        <div style={{ 
          marginTop: '16px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {(search || statusFilter || dateFrom || dateTo) && (
              <>
                <span style={{ fontSize: '13px', color: '#888' }}>Active filters:</span>
                {search && (
                  <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setSearch('')}>
                    ID: {search} ×
                  </Badge>
                )}
                {statusFilter && (
                  <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => setStatusFilter('')}>
                    Status: {statusFilter} ×
                  </Badge>
                )}
                {(dateFrom || dateTo) && (
                  <Badge variant="primary" style={{ cursor: 'pointer' }} onClick={() => { setDateFrom(''); setDateTo('') }}>
                    Date: {dateFrom || '...'} to {dateTo || '...'} ×
                  </Badge>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('')
                    setDateFrom('')
                    setDateTo('')
                  }}
                >
                  Clear All
                </Button>
              </>
            )}
          </div>

          {filteredOrders.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" size="sm" onClick={exportToCSV}>
                Export CSV
              </Button>
              <Button variant="secondary" size="sm" onClick={exportToJSON}>
                Export JSON
              </Button>
            </div>
          )}
        </div>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888' }}>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '16px', color: '#888', marginBottom: '16px' }}>
            {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
          </p>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
            {orders.length === 0 
              ? 'Start shopping in the store to place your first order'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {(search || statusFilter || dateFrom || dateTo) && (
            <Button variant="outline" size="sm" onClick={() => {
              setSearch('')
              setStatusFilter('')
              setDateFrom('')
              setDateTo('')
            }}>
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div style={{ marginBottom: '16px', fontSize: '14px', color: '#888' }}>
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <Grid columns={1} gap="16px">
            {filteredOrders.map(o => (
            <Card
              key={o._id}
              onClick={() => setExpandedId(expandedId === o._id ? null : o._id)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      margin: 0,
                      color: '#fff'
                    }}>
                      Order #{o._id.slice(-8)}
                    </h3>
                    <Badge variant={getStatusColor(o.status)}>
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </Badge>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#888',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px'
                  }}>
                    <div>Placed: {formatDate(o.createdAt)}</div>
                    <div>Items: {o.items?.length || 0}</div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>
                      Total: ${o.items?.reduce((sum, it) => sum + (it.product?.price * it.qty || 0), 0).toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '18px', color: '#888' }}>
                  {expandedId === o._id ? '▼' : '▶'}
                </div>
              </div>

              {expandedId === o._id && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    margin: '0 0 12px 0'
                  }}>
                    Order Items
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {o.items && o.items.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto auto',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          borderRadius: '6px'
                        }}
                      >
                        <div>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#fff',
                            margin: '0 0 4px 0'
                          }}>
                            {it.product?.name || 'Unknown Product'}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#888',
                            margin: 0
                          }}>
                            {it.product?.description}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{
                            fontSize: '14px',
                            color: '#888',
                            margin: 0
                          }}>
                            {it.qty} × ${it.product?.price}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 600, color: '#fff' }}>
                          ${(it.product?.price * it.qty).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {o.updatedAt && (
                    <div style={{
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      fontSize: '12px',
                      color: '#888'
                    }}>
                      Last updated: {formatDate(o.updatedAt)}
                    </div>
                  )}
                </div>
              )}
            </Card>
            ))}
          </Grid>
        </>
      )}
    </Section>
  )
}
