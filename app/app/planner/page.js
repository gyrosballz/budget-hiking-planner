'use client';

import Header from '@/components/Header';
import { useState } from 'react';
import { useHike } from '@/context/HikeContext';

export default function HikePlanner() {
  const { hike, setHike } = useHike();
  const [formData, setFormData] = useState({
    name: '',
    distance: '',
    difficulty: 'Medium',
    budget: '',
    date: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    setHike({
      ...formData,
      distance: Number(formData.distance),
      budget: Number(formData.budget),
    });
    alert('Hike plan created!');
  }

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Hike Planner</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2>Create Your Plan</h2>
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <input
                type="text"
                placeholder="Hike Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
              <input
                type="number"
                placeholder="Distance (km)"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                required
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
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
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.75rem',
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
          </div>

          <div>
            <h2>Current Plan</h2>
            {hike ? (
              <div
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                }}
              >
                <h3>{hike.name}</h3>
                <p>📏 Distance: {hike.distance}km</p>
                <p>📊 Difficulty: {hike.difficulty}</p>
                <p>💰 Budget: ${hike.budget}</p>
                <p>📅 Date: {hike.date}</p>
              </div>
            ) : (
              <p>No plan created yet. Create one to get started!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
