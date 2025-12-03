import React, { useContext } from 'react';
import { HikeContext } from '../context/HikeContext';

export default function Store() {
  const { hike } = useContext(HikeContext); // Get latest hike data
  const gearSuggestions = [];

  if (hike) {
    const { distance, duration, difficulty } = hike;

    gearSuggestions.push('Hiking boots');
    gearSuggestions.push('Backpack');
    gearSuggestions.push(`${(distance * 0.5).toFixed(1)}L water bottle`);

    if (difficulty === 'Moderate' || difficulty === 'Hard') {
      gearSuggestions.push('Energy snacks');
      gearSuggestions.push('Trekking poles');
      gearSuggestions.push('First aid kit');
    }

    if (distance > 15 || duration > 5) {
      gearSuggestions.push('Extra layers for weather');
      gearSuggestions.push('Headlamp or flashlight');
    }
  }

  return (
    <div>
      <h2>Store</h2>
      {!hike && <p>Select a hike in the Hiking Planner to get gear suggestions!</p>}
      {hike && (
        <div>
          <h3>Recommended Gear:</h3>
          <ul>
            {gearSuggestions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
