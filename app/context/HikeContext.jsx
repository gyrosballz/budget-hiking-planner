'use client';

import React, { createContext, useState, useContext } from 'react';

const HikeContext = createContext();

export function HikeProvider({ children }) {
  const [hike, setHike] = useState(null);

  return (
    <HikeContext.Provider value={{ hike, setHike }}>
      {children}
    </HikeContext.Provider>
  );
}

export function useHike() {
  const context = useContext(HikeContext);
  
  // Return a default empty context if not available (for SSR)
  if (!context) {
    return {
      hike: null,
      setHike: () => {},
    };
  }
  
  return context;
}
