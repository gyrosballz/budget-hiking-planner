'use client';

import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!mounted || !user) {
    return null;
  }

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div id="home" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Budget Hiking Planner</h1>
          <p className="text-xl text-blue-100">Plan your hiking adventures on a budget with ease!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          <Link
            href="/plans"
            style={{
              padding: '2rem',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            className="hover:shadow-lg hover:scale-105"
          >
            <h2>📋 Hiking Plans</h2>
            <p>Browse and manage hiking plans</p>
          </Link>

          <Link
            href="/store"
            style={{
              padding: '2rem',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            className="hover:shadow-lg hover:scale-105"
          >
            <h2>🛒 Store</h2>
            <p>Shop for hiking gear and supplies</p>
          </Link>

          <Link
            href="/planner"
            style={{
              padding: '2rem',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            className="hover:shadow-lg hover:scale-105"
          >
            <h2>🗺️ Planner</h2>
            <p>Plan your next hiking adventure</p>
          </Link>

          <Link
            href="/orders"
            style={{
              padding: '2rem',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            className="hover:shadow-lg hover:scale-105"
          >
            <h2>📦 Orders</h2>
            <p>Track your orders</p>
          </Link>
        </div>

        {/* Features Section */}
        <section id="features" className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">🏔️ Smart Planning</h3>
              <p className="text-gray-600">Create detailed hiking plans with distance, duration, and difficulty levels.</p>
            </div>
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">💰 Budget Tracking</h3>
              <p className="text-gray-600">Keep track of your spending and stay within your hiking budget.</p>
            </div>
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">🛍️ Gear Store</h3>
              <p className="text-gray-600">Shop for quality hiking gear from trusted sellers.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Basic</h3>
              <p className="text-4xl font-bold mb-4">Free</p>
              <ul className="text-gray-600 space-y-3 mb-6">
                <li>✓ Create plans</li>
                <li>✓ Browse gear</li>
                <li>✓ Track orders</li>
              </ul>
              <button className="w-full bg-black text-white py-2 rounded-lg">Get Started</button>
            </div>
            <div className="p-8 bg-blue-50 border-2 border-blue-600 rounded-lg text-center">
              <div className="bg-blue-600 text-white py-2 px-4 rounded-full inline-block mb-4 text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-4xl font-bold mb-4">$9.99<span className="text-lg">/mo</span></p>
              <ul className="text-gray-600 space-y-3 mb-6">
                <li>✓ Everything in Basic</li>
                <li>✓ Sell your gear</li>
                <li>✓ Premium plans</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Start Free Trial</button>
            </div>
            <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <p className="text-4xl font-bold mb-4">Custom</p>
              <ul className="text-gray-600 space-y-3 mb-6">
                <li>✓ Everything in Pro</li>
                <li>✓ Custom features</li>
                <li>✓ Priority support</li>
              </ul>
              <button className="w-full bg-black text-white py-2 rounded-lg">Contact Us</button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
