import React, { useState, useContext, useEffect } from 'react';
import { HikeContext } from '../context/HikeContext';

export default function HikePlanner() {
  const { hike, setHike } = useContext(HikeContext);
  const [distance, setDistance] = useState(hike?.distance || '');
  const [duration, setDuration] = useState(hike?.duration || '');
  const [budget, setBudget] = useState(hike?.budget || '');
  const [result, setResult] = useState(hike || null);

  useEffect(() => {
    setDistance(hike?.distance || '');
    setDuration(hike?.duration || '');
    setBudget(hike?.budget || '');
    setResult(hike || null);
  }, [hike]);

  const calculateHike = () => {
    const dist = parseFloat(distance);
    const dur = parseFloat(duration);
    const bud = parseFloat(budget) || 0;

    if (isNaN(dist) || isNaN(dur) || dist <= 0 || dur <= 0) {
      alert('Please enter valid positive numbers');
      return;
    }

    const waterLiters = dist * 0.5;           // liters per km
    const calories = dist * dur * 30;         // calories burned
    const speed = dist / dur;
    let difficulty = 'Easy';
    if (speed > 8) difficulty = 'Hard';
    else if (speed > 4) difficulty = 'Medium';

    const hikeData = { distance: dist, duration: dur, water: waterLiters, calories, difficulty, budget: bud };
    setResult(hikeData);
    setHike(hikeData);
  };

  return (
    <div>
      <h2>Hiking Planner</h2>
      <label>
        Distance (km)
        <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
      </label>
      <label>
        Duration (hours)
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </label>
      <label>
        Budget ($)
        <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
      </label>
      <button onClick={calculateHike}>Calculate</button>

      {result && (
        <div style={{ marginTop: '10px' }}>
          💧 You should carry {result.water.toFixed(1)} liters of water.<br />
          🔥 Estimated calories: {result.calories.toFixed(0)}.<br />
          ⚡ Difficulty: {result.difficulty}.<br />
          💵 Budget: ${result.budget.toFixed(2)}
        </div>
      )}
    </div>
  );
}
