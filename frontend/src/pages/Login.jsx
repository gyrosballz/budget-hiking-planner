import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setRole } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    console.log('Login attempt:', { username })
    alert(`Form submitted — username logged to console.`)

    // Demo: assign role based on username
    if (username.toLowerCase() === 'admin') setRole('admin')
    else if (username.toLowerCase() === 'seller') setRole('seller')
    else setRole('user')

    navigate('/') // redirect to Plans page
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Log In</button>
        </div>
      </form>
    </div>
  )
}
