import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import API from '../api'

// Navigation bar with role-based menu items and authentication controls
export default function Nav(){
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')

  // Decodes JWT token to extract user data
  const parseJwt = (t) => {
    try {
      const base64 = t.split('.')[1]
      return JSON.parse(atob(base64))
    } catch {
      return null
    }
  }

  const role = token ? parseJwt(token)?.role : null

  // Clears authentication token and redirects to login page
  const logout = ()=>{
    localStorage.removeItem('token')
    API.setToken(null)
    navigate('/login')
  }

  // Checks if current route matches the given path for active styling
  const isActive = (path) => location.pathname === path

  // Returns menu items based on user role (seller, admin, or regular user)
  const getMenuItems = () => {
    if (role === 'seller') {
      return [
        { path: '/seller', label: 'Dashboard' },
        { path: '/notifications', label: 'Notifications' }
      ]
    }
    
    if (role === 'admin') {
      return [
        { path: '/admin', label: 'Dashboard' },
        { path: '/store', label: 'Monitor Store' },
        { path: '/notifications', label: 'Notifications' }
      ]
    }
    
    // Regular user menu
    return [
      { path: '/', label: 'Home' },
      { path: '/routes', label: 'Routes' },
      { path: '/plans', label: 'My Plans' },
      { path: '/store', label: 'Store' },
      { path: '/cart', label: 'Cart' },
      { path: '/orders', label: 'Orders', protected: true },
      { path: '/notifications', label: 'Notifications', protected: true }
    ]
  }

  const menuItems = getMenuItems()

  return (
    <nav style={{
      width: '100%',
      height: '64px',
      backgroundColor: '#ffffff',
      color: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 48px',
      position: 'fixed',
      top: 0,
      left: 0,
      borderBottom: '1px solid #e5e5e5',
      zIndex: 1000
    }}>
      {/* Logo */}
      <Link to={role === 'seller' ? '/seller' : role === 'admin' ? '/admin' : '/store'} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
      }}>
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <defs>
            <linearGradient id="mountain-gradient" x1="0" y1="0" x2="28" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#000" />
              <stop offset="1" stopColor="#666" />
            </linearGradient>
          </defs>
          <path d="M2 20L10 8L15 16L18.5 11L26 20H2Z" fill="url(#mountain-gradient)" stroke="#666" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M10 8L13 13L15 16" stroke="#666" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <span style={{
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          color: '#000',
          display: 'inline-block',
        }}>
          {role === 'seller' ? 'SELLER' : role === 'admin' ? 'ADMIN' : 'HIKEY'}
        </span>
      </Link>

      {/* Center Menu Items */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px'
      }}>
        {menuItems.map(item => {
          if (item.protected && !token) return null
          
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '8px 0px',
                color: isActive(item.path) ? '#000' : '#666',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 400,
                letterSpacing: '0px',
                borderRadius: '0px',
                transition: 'all 0.2s ease',
                backgroundColor: 'transparent',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.color = '#000'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.color = '#666'
                }
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* Auth Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {token ? (
          <button
            onClick={logout}
            style={{
              padding: '8px 0px',
              color: '#666',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '0px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666'
            }}
          >
            LOGOUT
          </button>
        ) : (
          <Link
            to='/login'
            style={{
              padding: '8px 0px',
              color: '#666',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '0px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  )
}
