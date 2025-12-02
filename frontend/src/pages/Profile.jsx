import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!user || !token) {
      navigate('/login')
    }
  }, [user, token, navigate])

  if (!user || !token) {
    return null
  }

  return (
    <div>
      <h2>Your Profile</h2>
      <p>Welcome, <strong>{user.username}</strong>!</p>
      <button
        onClick={() => {
          logout()
          navigate('/login')
        }}
      >
        Log out
      </button>
    </div>
  )
}


