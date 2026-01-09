import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Plans from './pages/Plans';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import HikePlanner from './pages/HikePlanner';
import SellerDashboard from './pages/SellerDashboard';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HikeProvider } from './context/HikeContext';

function Header() {
  const { role, logout } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#000',
      color: '#fff',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>🥾 Budget Hiking</Link>
        
        {user && (
          <>
            <Link to="/plans" style={{ color: '#fff', textDecoration: 'none' }}>Plans</Link>
            <Link to="/store" style={{ color: '#fff', textDecoration: 'none' }}>Store</Link>
            <Link to="/cart" style={{ color: '#fff', textDecoration: 'none' }}>Cart</Link>
            <Link to="/planner" style={{ color: '#fff', textDecoration: 'none' }}>Planner</Link>
            <Link to="/orders" style={{ color: '#fff', textDecoration: 'none' }}>Orders</Link>

            {role === 'seller' && (
              <Link to="/seller" style={{ color: '#ffaa00', textDecoration: 'none', fontWeight: 'bold' }}>Seller Dashboard</Link>
            )}

            {role === 'admin' && (
              <Link to="/admin-dashboard" style={{ color: '#ff6600', textDecoration: 'none', fontWeight: 'bold' }}>Admin Dashboard</Link>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span>User: <strong>{user.username}</strong> ({role})</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#cc0000',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HikeProvider>
          <BrowserRouter>
            <Header />
            <div className="container" style={{ minHeight: 'calc(100vh - 80px)' }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Plans />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/store" element={<Store />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<OrderTracking />} />
                <Route path="/planner" element={<HikePlanner />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
              </Routes>
            </div>
          </BrowserRouter>
        </HikeProvider>
      </CartProvider>
    </AuthProvider>
  );
}
