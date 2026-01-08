import React, { useContext, useState } from "react";
import { HikeContext } from "../context/HikeContext";
import { useNavigate } from "react-router-dom";

const hikingPlans = [
  { id: 1, name: "Mountain Trail", distance: 12, duration: 4 },
  { id: 2, name: "Forest Loop", distance: 8, duration: 3 },
  { id: 3, name: "River Path", distance: 16, duration: 5 },
];

export default function Plans() {
  const { setHike } = useContext(HikeContext);
  const navigate = useNavigate();
  const [budget, setBudget] = useState('');

  const selectPlan = (plan) => {
    const dist = plan.distance;
    const dur = plan.duration;
    const speed = dist / dur;
    const water = dist * 0.5; // liters per km
    const calories = dist * dur * 30;

    let difficulty = "Easy";
    if (speed > 5) difficulty = "Hard";
    else if (speed > 3) difficulty = "Medium";

    const selectedHike = {
      name: plan.name,
      distance: dist,
      duration: dur,
      water,
      calories,
      difficulty,
      budget: parseFloat(budget) || 0, // default 0 if not entered
    };

    setHike(selectedHike);
    navigate("/planner");
  };

  return (
    <div>
      <h1>Available Hiking Plans</h1>
      <label>
        Enter Budget ($):
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        />
      </label>
      <ul>
        {hikingPlans.map((plan) => (
          <li key={plan.id} style={{ marginBottom: "1rem" }}>
            <strong>{plan.name}</strong> — {plan.distance} km, {plan.duration} hours
            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => selectPlan(plan)}
            >
              Select
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
