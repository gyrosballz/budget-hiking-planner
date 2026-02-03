import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import API from '../api'

export default function Nav(){
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')

  const parseJwt = (t) => {
    try {
      const base64 = t.split('.')[1]
      return JSON.parse(atob(base64))
    } catch {
      return null
    }
  }

  const role = token ? parseJwt(token)?.role : null

  const logout = ()=>{
    localStorage.removeItem('token')
    API.setToken(null)
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/routes', label: 'Routes' },
    { path: '/plans', label: 'My Plans' },
    { path: '/store', label: 'Store' },
    { path: '/cart', label: 'Cart' },
    { path: '/orders', label: 'Orders', protected: true },
    { path: '/notifications', label: 'Notifications', protected: true },
    { path: '/seller', label: 'Seller', protected: true, sellerOnly: true },
    { path: '/admin', label: 'Admin', protected: true, adminOnly: true },
  ]

  return (
    <nav style={{
      width: '100%',
      height: '60px',
      backgroundColor: 'rgba(10,10,10,0.8)',
      backdropFilter: 'blur(12px)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      position: 'fixed',
      top: 0,
      left: 0,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      zIndex: 1000
    }}>
      {/* Logo */}
      <Link to='/store' style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
      }}>
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <defs>
            <linearGradient id="mountain-gradient" x1="0" y1="0" x2="28" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" />
              <stop offset="1" stopColor="#888" />
            </linearGradient>
          </defs>
          <path d="M2 20L10 8L15 16L18.5 11L26 20H2Z" fill="url(#mountain-gradient)" stroke="#888" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M10 8L13 13L15 16" stroke="#888" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <span style={{
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
        }}>HIKING</span>
      </Link>

      {/* Center Menu Items */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {menuItems.map(item => {
          if (item.protected && !token) return null
          if (item.adminOnly && role !== 'admin') return null
          if (item.sellerOnly && !['seller', 'admin'].includes(role)) return null
          
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '8px 16px',
                color: isActive(item.path) ? '#fff' : '#888',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive(item.path) ? 500 : 400,
                letterSpacing: '-0.2px',
                borderRadius: '6px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.08)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.color = '#888'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* Auth Section */}
      <div>
        {token ? (
          <button
            onClick={logout}
            style={{
              padding: '8px 20px',
              color: '#888',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '-0.2px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#888'
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            to='/login'
            style={{
              padding: '8px 20px',
              color: '#000',
              backgroundColor: '#fff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '-0.2px',
              borderRadius: '6px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0'
              e.currentTarget.style.transform = 'scale(0.98)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
