import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Load initial auth state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const [role, setRole] = useState(() => localStorage.getItem('role') || 'user')

  function setRoleAndSave(r) {
    setRole(r)
    localStorage.setItem('role', r)
  }

  function login({ username, token: newToken, role: newRole = 'user' }) {
    const newUser = { username }
    setUser(newUser)
    setToken(newToken)
    setRoleAndSave(newRole)

    localStorage.setItem('user', JSON.stringify(newUser))
    localStorage.setItem('token', newToken)
    localStorage.setItem('role', newRole)
  }

  function logout() {
    setUser(null)
    setToken(null)
    setRole('user')

    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        setRole: setRoleAndSave,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
