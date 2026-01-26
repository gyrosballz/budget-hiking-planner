'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState('user');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    setUser(savedUser ? JSON.parse(savedUser) : null);
    setToken(savedToken);
    setRole(savedRole || 'user');
    setMounted(true);
  }, []);

  function setRoleAndSave(r) {
    setRole(r);
    localStorage.setItem('role', r);
  }

  function login({ username, token: newToken, role: newRole = 'user' }) {
    const newUser = { username };
    setUser(newUser);
    setToken(newToken);
    setRoleAndSave(newRole);

    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
  }

  function logout() {
    setUser(null);
    setToken(null);
    setRole('user');

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  if (!mounted) {
    return children;
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
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  // Return a default empty context if not available (for SSR)
  if (!context) {
    return {
      user: null,
      token: null,
      role: 'user',
      setRole: () => {},
      login: () => {},
      logout: () => {},
    };
  }
  
  return context;
}
