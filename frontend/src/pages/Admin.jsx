import { useEffect, useState } from 'react'
export default function Admin(){
  const [orders,setOrders]=useState([]); const [products,setProducts]=useState([])
  useEffect(()=>{ fetch('/api/products').then(r=>r.json()).then(setProducts) },[])
  async function loadOrders(){ const r=await fetch('/api/orders',{headers:{'x-user-role':'admin'}}); if(r.ok) setOrders(await r.json()); else alert('forbidden') }
  async function delProd(id){ const r=await fetch('/api/products/'+id,{method:'DELETE',headers:{'x-user-role':'admin'}}); if(r.ok) setProducts(p=>p.filter(x=>x.id!==id)) }
  return <div>
    <h2>Admin Panel</h2>
    <button onClick={loadOrders}>Load Orders (admin)</button>
    <h3>Products</h3>
    {products.map(p=> <div key={p.id} className="card">{p.name} — ${p.price} <button onClick={()=>delProd(p.id)}>Delete</button></div>)}
    <h3>Orders</h3>
    {orders.map(o=> <div key={o.id} className="card">Order #{o.id} — {o.date} — items: {o.items?.length||0}</div>)}
  </div>
}
