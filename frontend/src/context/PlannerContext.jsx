// src/context/PlannerContext.jsx
import { createContext, useContext, useState } from "react";

const PlannerContext = createContext();

export const usePlanner = () => useContext(PlannerContext);

export const PlannerProvider = ({ children }) => {
  const [results, setResults] = useState(null);

  return (
    <PlannerContext.Provider value={{ results, setResults }}>
      {children}
    </PlannerContext.Provider>
  );
};
