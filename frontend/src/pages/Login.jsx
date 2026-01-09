import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import login_img from "../assets/images/hiking.avif"

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Login failed')
      }

      const data = await response.json()
      login({ username: data.username, token: data.token, role: data.role })
      
      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/admin-dashboard')
      } else if (data.role === 'seller') {
        navigate('/seller')
      } else {
        navigate('/profile')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* LEFT SIDE UI */}
        <div className="p-8">
          <h1 className="text-6xl font-extrabold mb-2">Welcome</h1>
          <p className="text-gray-500 mb-10">We are glad to see you back with us</p>

          {error && (
            <p className="text-red-500 mb-4 text-lg font-semibold">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full p-4 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full p-4 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl text-lg font-semibold disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'NEXT'}
            </button>
          </form>

          <p className="mt-6">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-600">Register</a>
          </p>
          {/* Test Credentials */}
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '0.85rem' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Test Credentials:</p>
            <p>User: testuser / pass123</p>
            <p>Seller: testseller / pass123</p>
            <p>Admin: testadmin / pass123</p>
          </div>        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="flex justify-center items-center">
          <img
            src= {login_img}
            alt="illustration"
            className="rounded-3xl w-full shadow-xl"
          />
        </div>
      </div>
    </div>
  )
}
