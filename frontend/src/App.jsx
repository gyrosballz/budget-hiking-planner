import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Plans from './pages/Plans'
import Store from './pages/Store'
import Cart from './pages/Cart'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'

function Header() {
  const { role } = useAuth()
  return (
    <nav>
      <Link to="/">Plans</Link>
      <Link to="/store">Store</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/login">Login</Link>
      <Link to="/profile">Profile</Link>
      <div style={{ marginLeft: 'auto' }}>
        Role: {role}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Plans />} />
              <Route path="/store" element={<Store />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
