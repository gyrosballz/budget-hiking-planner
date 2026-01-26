'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { HikeProvider } from '@/context/HikeContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <HikeProvider>
          {children}
        </HikeProvider>
      </CartProvider>
    </AuthProvider>
  );
}
