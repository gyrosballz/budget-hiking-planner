import React, { useEffect, useState } from 'react'
import API from '../api'
import { Card, Section, Grid, Badge } from '../components/UI'

export default function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

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

  return (
    <Section title="Order History" subtitle="Track your hiking gear purchases">
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888' }}>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '16px', color: '#888', marginBottom: '16px' }}>
            No orders yet
          </p>
          <p style={{ fontSize: '13px', color: '#666' }}>
            Start shopping in the store to place your first order
          </p>
        </Card>
      ) : (
        <Grid columns={1} gap="16px">
          {orders.map(o => (
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
      )}
    </Section>
  )
}
