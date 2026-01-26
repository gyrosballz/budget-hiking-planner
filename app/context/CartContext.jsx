'use client';

import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart') || '[]';
    setCart(JSON.parse(savedCart));
    setMounted(true);
  }, []);

  function addToCart(item) {
    const next = [...cart, item];
    setCart(next);
    localStorage.setItem('cart', JSON.stringify(next));
  }

  function removeFromCart(index) {
    const next = cart.filter((_, i) => i !== index);
    setCart(next);
    localStorage.setItem('cart', JSON.stringify(next));
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem('cart');
  }

  if (!mounted) {
    return children;
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  
  // Return a default empty context if not available (for SSR)
  if (!context) {
    return {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
    };
  }
  
  return context;
}
