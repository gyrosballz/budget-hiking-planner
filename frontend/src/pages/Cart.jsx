import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
export default function Cart(){
  const { cart, clearCart } = useContext(CartContext)
  const { role } = useAuth()
  async function checkout(){
    const res = await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json','x-user-role':role},body:JSON.stringify({items:cart})})
    if(res.ok){ alert('Order placed'); clearCart() } else alert('error')
  }
  return <div>
    <h2>Your Cart</h2>
    {cart.length===0 && <p>No items</p>}
    {cart.map((c,i)=> <div key={i} className="card">{c.name} — ${c.price}</div>)}
    {cart.length>0 && <button onClick={checkout}>Checkout</button>}
  </div>
}
