import { createContext, useState } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || '[]'))

  function addToCart(item) {
    const next = [...cart, item]
    setCart(next)
    localStorage.setItem('cart', JSON.stringify(next))
  }

  function removeFromCart(index) {
    const next = cart.filter((_, i) => i !== index)
    setCart(next)
    localStorage.setItem('cart', JSON.stringify(next))
  }

  function clearCart() {
    setCart([])
    localStorage.removeItem('cart')
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
