import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'
import { Card, Button, Input, Alert, Section } from '../components/UI'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
    <Section title="Welcome to Hiking Planner" subtitle="Plan your next adventure">
      <div style={{
        maxWidth: '420px',
        margin: '0 auto'
      }}>
        {error && <Alert type="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

        <Card style={{ padding: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            margin: '0 0 24px 0',
            color: '#fff',
            textAlign: 'center'
          }}>
            Sign In
          </h2>

          <form onSubmit={submit} style={{ display: 'grid', gap: '16px' }}>
            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#888'
          }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.target.style.color = '#ccc'}
              onMouseLeave={e => e.target.style.color = '#fff'}
            >
              Sign up here
            </Link>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: '13px',
            color: '#888',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#aaa' }}>
              Demo Accounts (Password: role123)
            </p>
            <div style={{ display: 'grid', gap: '6px' }}>
              <div><strong>Admin:</strong> admin@test.com</div>
              <div><strong>Seller:</strong> seller@test.com</div>
              <div><strong>User:</strong> user@test.com</div>
            </div>
          </div>
        </Card>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#888'
        }}>
          <p>Discover trails, plan trips, and gear up for your next adventure</p>
        </div>
      </div>
    </Section>
  )
}
