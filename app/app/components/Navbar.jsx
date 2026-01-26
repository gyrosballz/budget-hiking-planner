'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center font-bold text-2xl text-black">
            🥾 HikePlanner
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-700 hover:text-black transition"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-700 hover:text-black transition"
                >
                  Pricing
                </button>
                <Link
                  href="/login"
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-black text-black px-6 py-2 rounded-lg hover:bg-black hover:text-white transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/store"
                  className="text-gray-700 hover:text-black transition"
                >
                  Store
                </Link>
                <Link
                  href="/plans"
                  className="text-gray-700 hover:text-black transition"
                >
                  Plans
                </Link>
                <Link
                  href="/planner"
                  className="text-gray-700 hover:text-black transition"
                >
                  Planner
                </Link>
                <Link
                  href="/cart"
                  className="text-gray-700 hover:text-black transition"
                >
                  Cart
                </Link>
                <Link
                  href="/orders"
                  className="text-gray-700 hover:text-black transition"
                >
                  Orders
                </Link>

                {user.role === 'seller' && (
                  <Link
                    href="/seller"
                    className="text-blue-600 hover:text-blue-800 transition font-semibold"
                  >
                    Seller Dashboard
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    href="/admin-dashboard"
                    className="text-red-600 hover:text-red-800 transition font-semibold"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    {user.username} <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col space-y-1"
          >
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            {!user ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    scrollToSection('features');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    scrollToSection('pricing');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Pricing
                </button>
                <Link
                  href="/login"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/store"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Store
                </Link>
                <Link
                  href="/plans"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Plans
                </Link>
                <Link
                  href="/planner"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Planner
                </Link>
                <Link
                  href="/cart"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Cart
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Orders
                </Link>
                {user.role === 'seller' && (
                  <Link
                    href="/seller"
                    className="block px-4 py-2 text-blue-600 font-semibold hover:bg-gray-100"
                  >
                    Seller Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    href="/admin-dashboard"
                    className="block px-4 py-2 text-red-600 font-semibold hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 font-semibold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
