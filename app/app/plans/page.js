'use client';

import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, role } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    distance: '',
    duration: '',
    difficulty: 'Medium',
    budget: '',
  });

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      const data = await apiClient.getPlans();
      setPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await apiClient.createPlan({
        ...formData,
        distance: Number(formData.distance),
        duration: Number(formData.duration),
        budget: Number(formData.budget),
      });
      setFormData({ name: '', distance: '', duration: '', difficulty: 'Medium', budget: '' });
      setShowForm(false);
      loadPlans();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Hiking Plans</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {(role === 'admin' || role === 'seller') && (
          <>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '1rem',
              }}
            >
              {showForm ? 'Cancel' : 'Create Plan'}
            </button>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                }}
              >
                <input
                  type="text"
                  placeholder="Plan Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <input
                  type="number"
                  placeholder="Distance (km)"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  required
                  style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <input
                  type="number"
                  placeholder="Duration (hours)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
                <input
                  type="number"
                  placeholder="Budget ($)"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  required
                  style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Create Plan
                </button>
              </form>
            )}
          </>
        )}

        {loading ? (
          <p>Loading plans...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                }}
              >
                <h3>{plan.name}</h3>
                <p>📏 {plan.distance}km</p>
                <p>⏱️ {plan.duration}h</p>
                <p>📊 Difficulty: {plan.difficulty}</p>
                <p>💰 Budget: ${plan.budget}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
