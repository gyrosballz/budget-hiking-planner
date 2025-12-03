import React, { useState, useContext } from 'react';
import { HikeContext } from '../context/HikeContext';

export default function HikePlanner() {
  const { setHike } = useContext(HikeContext);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState(null);

  const calculateHike = () => {
    const dist = parseFloat(distance);
    const dur = parseFloat(duration);

    if (isNaN(dist) || isNaN(dur) || dist <= 0 || dur <= 0) {
      alert('Please enter valid positive numbers');
      return;
    }

    const waterLiters = (dist * dur) / 2; // simple formula
    const calories = dist * dur * 30;     // calories burned
    let difficulty = 'Easy';
    const speed = dist / dur; // km/h

    if (speed > 8) difficulty = 'Hard';
    else if (speed > 4) difficulty = 'Medium';

    const hikeData = {
      distance: dist,
      duration: dur,
      water: waterLiters,
      calories,
      difficulty,
    };

    setResult(hikeData);
    setHike(hikeData); // store in context
  };

  return (
    <div>
      <h2>Hiking Planner</h2>
      <label>
        Distance (km)
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      </label>
      <label>
        Expected Duration (hours)
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </label>
      <button onClick={calculateHike}>Calculate</button>

      {result && (
        <div style={{ marginTop: '10px' }}>
          💧 You should carry {result.water.toFixed(1)} liters of water.<br />
          🔥 Estimated calories: {result.calories.toFixed(0)}.<br />
          ⚡ Difficulty: {result.difficulty}.
        </div>
      )}
    </div>
  );
}
