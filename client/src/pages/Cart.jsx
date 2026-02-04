import React, { useEffect, useState } from 'react'
import API from '../api'
import { Card, Button, Section, Grid, Badge, Alert } from '../components/UI'

// Shopping cart page for managing items and checkout process
export default function Cart(){
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [qtyErrors, setQtyErrors] = useState({})

  // Fetches user's cart data from backend API
  const load = async () => {
    setLoading(true)
    try {
      const r = await API.get('/cart')
      setCart(r.data)
      setError('')
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError('Please log in to view your cart.')
      } else {
        setError('Failed to load cart')
      }
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Updates quantity of a cart item with validation
  const update = async (productId, qty) => {
    // Validate quantity: must be integer 1-99
    if (!/^[1-9][0-9]?$/.test(qty)) {
      setQtyErrors(prev => ({ ...prev, [productId]: 'Quantity must be 1-99' }))
      return
    } else {
      setQtyErrors(prev => ({ ...prev, [productId]: undefined }))
    }
    try {
      await API.put(`/cart/items/${productId}`, { qty: Number(qty) })
      load()
    } catch (err) {
      setError('Failed to update cart')
    }
  }

  // Removes item from cart by product ID
  const remove = async (productId) => {
    try {
      await API.delete(`/cart/items/${productId}`)
      load()
    } catch (err) {
      setError('Failed to remove item')
    }
  }

  // Processes checkout by creating order and clearing cart
  const checkout = async () => {
    if (cart.items.length === 0) return
    // Prevent checkout if any qty error
    if (Object.values(qtyErrors).some(Boolean)) {
      setError('Please fix quantity errors before checkout.')
      return
    }
    setCheckoutLoading(true)
    setError('')
    try {
      const r = await API.post('/cart/checkout')
      setSuccess('Order placed successfully! Order #' + r.data._id.slice(-6))
      setCart({ items: [] })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Checkout failed: ' + err.message)
    }
    setCheckoutLoading(false)
  }

  // Calculates total price of all cart items
  const total = cart.items
    .filter(i => i.product) // Filter out items with null products
    .reduce((sum, i) => sum + (i.product.price * i.qty), 0)

  return (
    <Section title="Shopping Cart" subtitle="Review and purchase hiking gear">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888' }}>Loading cart...</p>
        </div>
      ) : cart.items.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '16px', color: '#888', marginBottom: '16px' }}>
            Your cart is empty
          </p>
          <p style={{ fontSize: '13px', color: '#666' }}>
            Browse the store to add hiking gear to your cart
          </p>
        </Card>
      ) : (
        <>
          <Grid columns={1} gap="16px" style={{ marginBottom: '32px' }}>
            {cart.items.map(i => {
              // Skip items where product was deleted
              if (!i.product) {
                return (
                  <Card key={i._id} hover={false}>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <p style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '8px' }}>
                        ⚠️ This product is no longer available
                      </p>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => remove(i._id)}
                      >
                        Remove from Cart
                      </Button>
                    </div>
                  </Card>
                )
              }
              
              return (
              <Card key={i.product._id} hover={false}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto auto',
                  gap: '20px',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      margin: '0 0 8px 0',
                      color: '#fff'
                    }}>
                      {i.product.name}
                    </h4>
                    <p style={{
                      fontSize: '13px',
                      color: '#888',
                      margin: 0
                    }}>
                      {i.product.description}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                      ${i.product.price}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      per unit
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => update(i.product._id, Math.max(1, i.qty - 1))}
                      style={{ padding: '6px 12px', minWidth: '36px' }}
                    >
                      −
                    </Button>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={i.qty}
                      onChange={e => update(i.product._id, e.target.value)}
                      style={{
                        width: '60px',
                        padding: '8px',
                        borderRadius: '6px',
                        border: qtyErrors[i.product._id] ? '1.5px solid #ff6b6b' : '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        color: '#fff',
                        fontSize: '14px',
                        textAlign: 'center'
                      }}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => update(i.product._id, Math.min(99, i.qty + 1))}
                      style={{ padding: '6px 12px', minWidth: '36px' }}
                    >
                      +
                    </Button>
                    {qtyErrors[i.product._id] && (
                      <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '2px', position: 'absolute', bottom: '-18px' }}>{qtyErrors[i.product._id]}</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                      ${(i.product.price * i.qty).toFixed(2)}
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => remove(i.product._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            )})}
          </Grid>

          <Card style={{
            padding: '24px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '20px',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  margin: 0,
                  color: '#fff'
                }}>
                  Order Summary
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#888',
                  margin: '8px 0 0 0'
                }}>
                  {cart.items.filter(i => i.product).length} item{cart.items.filter(i => i.product).length !== 1 ? 's' : ''} in cart
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '12px',
                  color: '#888',
                  marginBottom: '8px'
                }}>
                  Total
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '16px'
                }}>
                  ${total.toFixed(2)}
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={checkout}
                  disabled={checkoutLoading}
                  style={{ width: '100%' }}
                >
                  {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </Section>
  )
}
