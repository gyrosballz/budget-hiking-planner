import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'
import { Card, Button, Input, Alert, Section } from '../components/UI'

// User registration page for creating new accounts
export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Validates form data and creates new user account with auto-login
  const submit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const r = await API.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password
      })
      
      // Auto-login after registration
      const token = r.data.token
      localStorage.setItem('token', token)
      API.setToken(token)
      window.dispatchEvent(new Event('roleChanged'))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be in use.')
    }
    setLoading(false)
  }

  return (
    <Section title="Join Hiking Planner" subtitle="Create your account to start planning adventures">
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
            color: '#000',
            textAlign: 'center'
          }}>
            Create Account
          </h2>

          <form onSubmit={submit} style={{ display: 'grid', gap: '16px' }}>
            <Input
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Password (min 6 characters)"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Input
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#666'
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#000',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.target.style.color = '#ccc'}
              onMouseLeave={e => e.target.style.color = '#fff'}
            >
              Sign in here
            </Link>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #e5e5e5',
            fontSize: '13px',
            color: '#666',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#666' }}>
              Test Existing Accounts
            </p>
            <div style={{ display: 'grid', gap: '6px', fontSize: '12px' }}>
              <div><strong>Admin:</strong> admin@test.com / role123</div>
              <div><strong>Seller:</strong> seller@test.com / role123</div>
              <div><strong>User:</strong> user@test.com / role123</div>
            </div>
          </div>
        </Card>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#666'
        }}>
          <p>Join our community to discover trails and gear up for your next adventure</p>
        </div>
      </div>
    </Section>
  )
}
