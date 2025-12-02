import { useEffect, useState } from 'react'
export default function Plans(){
  const [plans,setPlans]=useState([])
  const [title,setTitle]=useState('')
  useEffect(()=>{ fetch('/api/plans').then(r=>r.json()).then(setPlans) },[])
  function add(){ fetch('/api/plans',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title})}).then(r=>r.json()).then(p=>setPlans(prev=>[...prev,p])); setTitle('') }
  function del(id){ fetch('/api/plans/'+id,{method:'DELETE'}).then(()=>setPlans(p=>p.filter(x=>x.id!==id))) }
  return <div>
    <h2>Hiking Plans</h2>
    <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Plan title" />
    <button onClick={add}>Add</button>
    {plans.map(p=> <div className="card" key={p.id}>{p.title} <button onClick={()=>del(p.id)}>Delete</button></div>)}
  </div>
}
