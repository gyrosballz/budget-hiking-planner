import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'
import { Card, Button, Input, Alert, Section } from '../components/UI'

// User login page with email and password authentication
export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Handles user login by validating credentials and storing JWT token
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const r = await API.post('/auth/login', { email, password })
      const token = r.data.token
      localStorage.setItem('token', token)
      API.setToken(token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    }
    setLoading(false)
  }

  return (
    <Section title="Welcome back" subtitle="Sign in to continue your adventure">
      <div style={{
        maxWidth: '980px',
        margin: '0 auto'
      }}>
        {error && <Alert type="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          padding: '28px',
          borderRadius: '24px',
          border: '1px solid #eee',
          background: 'linear-gradient(180deg, #fafafa 0%, #f5f7fb 100%)'
        }}>
          <div style={{
            padding: '24px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1f2937 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}>
            <div>
              <div style={{
                fontSize: '12px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                opacity: 0.7
              }}>
                Hiking Planner
              </div>
              <h2 style={{
                fontSize: '28px',
                lineHeight: 1.2,
                margin: '12px 0 10px'
              }}>
                Plan smarter. Pack lighter. Hike further.
              </h2>
              <p style={{
                margin: 0,
                color: '#cbd5f5',
                fontSize: '14px'
              }}>
                Save favorite routes, track orders, and stay updated with notifications.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '10px',
              marginTop: '18px'
            }}>
              {['Trusted gear', 'Local routes', 'Trip plans', 'Order tracking'].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card style={{ padding: '28px', borderRadius: '20px' }}>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{
                margin: '0 0 6px 0',
                fontSize: '22px',
                fontWeight: 700
              }}>
                Sign In
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                Use your account credentials to continue.
              </p>
            </div>

            <form onSubmit={submit} style={{ display: 'grid', gap: '14px' }}>
              <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#333' }}>
                Email address
                <Input
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#333' }}>
                Password
                <Input
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                color: '#555'
              }}>
                <input type="checkbox" defaultChecked />
                Keep me signed in on this device
              </label>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundImage: 'linear-gradient(135deg, #111827 0%, #1f2937 45%, #0f172a 100%)',
                  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.28)',
                  letterSpacing: '0.3px'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div style={{
              marginTop: '18px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#666'
            }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: '#111',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Create one
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  )
}
