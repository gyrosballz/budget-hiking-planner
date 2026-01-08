import React, { useContext } from 'react';
import { HikeContext } from '../context/HikeContext';
import { CartContext } from '../context/CartContext';

export default function Store() {
  const { hike } = useContext(HikeContext); // latest hike data
  const { addToCart } = useContext(CartContext);
  const gearSuggestions = [];

  if (hike) {
    const { distance, duration, difficulty, budget } = hike;

    // Basic essentials
    gearSuggestions.push({ name: 'Hiking boots', price: 50 });
    gearSuggestions.push({ name: 'Backpack', price: 40 });
    gearSuggestions.push({ name: `${(distance * 0.5).toFixed(1)}L water bottle`, price: 10 });

    // Medium/Hard hikes
    if (difficulty === 'Medium' || difficulty === 'Hard') {
      if (budget >= 20) gearSuggestions.push({ name: 'Energy snacks', price: 15 });
      if (budget >= 15) gearSuggestions.push({ name: 'Trekking poles', price: 25 });
      if (budget >= 10) gearSuggestions.push({ name: 'First aid kit', price: 20 });
    }

    // Long hikes
    if (distance > 15 || duration > 5) {
      if (budget >= 30) gearSuggestions.push({ name: 'Extra layers for weather', price: 35 });
      if (budget >= 25) gearSuggestions.push({ name: 'Headlamp or flashlight', price: 30 });
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
              <li key={index}>
                {item.name} — ${item.price}
                <button style={{ marginLeft: '1rem' }} onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
