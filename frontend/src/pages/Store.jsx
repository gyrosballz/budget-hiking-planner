import { useEffect, useState, useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
export default function Store(){
  const [products,setProducts]=useState([])
  const { addToCart } = useContext(CartContext)
  const { role } = useAuth()
  useEffect(()=>{ fetch('/api/products').then(r=>r.json()).then(setProducts) },[])
  async function addProduct(){
    const name = prompt('Product name'), price=Number(prompt('Price'))
    if(!name||isNaN(price)) return
    const res = await fetch('/api/products',{method:'POST',headers:{'Content-Type':'application/json','x-user-role':role},body:JSON.stringify({name,price})})
    if(res.ok){ const p=await res.json(); setProducts(prev=>[...prev,p]) } else alert('forbidden')
  }
  return <div>
    <h2>Store</h2>
    {role!=='user' && <button onClick={addProduct}>Add Product (seller/admin)</button>}
    {products.map(p=> <div className="card" key={p.id}><b>{p.name}</b> — ${p.price} <button onClick={()=>addToCart(p)}>Add to cart</button></div>)}
  </div>
}
