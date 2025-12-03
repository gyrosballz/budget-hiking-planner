import React, { createContext, useState } from 'react';

export const HikeContext = createContext();

export function HikeProvider({ children }) {
  const [hike, setHike] = useState(null);

  return (
    <HikeContext.Provider value={{ hike, setHike }}>
      {children}
    </HikeContext.Provider>
  );
}
