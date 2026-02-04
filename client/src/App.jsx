
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import API from './api'
import Nav from './components/Nav'
import Store from './pages/Store'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Plans from './pages/Plans'
import RouteExplorer from './pages/Routes'
import Orders from './pages/Orders'
import Notifications from './pages/Notifications'
import Admin from './pages/Admin'
import Seller from './pages/Seller'
import Login from './pages/Login'
import Register from './pages/Register'

// Main application component with routing and role-based access control
export default function App(){
  // Extracts user role from JWT token stored in localStorage
  const getRole = () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const base64 = token.split('.')[1]
      return JSON.parse(atob(base64))?.role || null
    } catch {
      return null
    }
  }
  // Error boundary component to catch and display React errors gracefully
  const ErrorBoundary = class extends React.Component {
    constructor(props) {
      super(props)
      this.state = { hasError: false, error: null }
    }
    // Updates state when an error is caught
    static getDerivedStateFromError(error) {
      return { hasError: true, error }
    }
    // Logs error details for debugging
    componentDidCatch(error, info) {
      console.error('App error:', error, info)
    }
    // Renders error UI or children components
    render() {
      if (this.state.hasError) {
        return (
          <div style={{
            padding: '80px 40px',
            color: '#fff',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '12px' }}>Something went wrong.</h2>
            <p style={{ color: '#aaa' }}>Check the error details below or in the console.</p>
            {this.state.error && (
              <pre style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '8px',
                textAlign: 'left',
                color: '#ddd',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error.message}
              </pre>
            )}
          </div>
        )
      }
      return this.props.children
    }
  }

  // Initializes authentication token from localStorage when app mounts
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      API.setToken(token)
    }
  }, [])

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          minHeight: '100vh',
          backgroundColor: '#000',
          color: '#fff'
        }}>
          <Nav />
          <main style={{
            paddingTop: '80px',
            paddingLeft: '40px',
            paddingRight: '40px',
            paddingBottom: '40px',
            maxWidth: '1400px',
            margin: '0 auto',
            background: 'radial-gradient(ellipse at top, rgba(30,30,30,0.8) 0%, #000 60%)',
            minHeight: 'calc(100vh - 60px)'
          }}>
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/routes' element={<RouteExplorer/>} />
              <Route path='/plans' element={<Plans/>} />
              <Route path='/store' element={<Store/>} />
              <Route path='/cart' element={<Cart/>} />
              <Route path='/orders' element={<Orders/>} />
              <Route path='/notifications' element={<Notifications/>} />
              <Route
                path='/admin'
                element={getRole() === 'admin' ? <Admin/> : <Navigate to='/store' replace />}
              />
              <Route
                path='/seller'
                element={['seller', 'admin'].includes(getRole()) ? <Seller/> : <Navigate to='/store' replace />}
              />
              <Route path='/login' element={<Login/>} />
              <Route path='/register' element={<Register/>} />
              <Route path='*' element={<Navigate to='/store' replace />} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
