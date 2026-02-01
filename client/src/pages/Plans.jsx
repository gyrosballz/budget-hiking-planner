import React, { useEffect, useState } from 'react'
import API from '../api'
import { fetchRoutes } from '../api/routes'
import { Card, Button, Input, Section, Grid, Badge } from '../components/UI'

export default function Plans(){
  const [plans, setPlans] = useState([])
  const [routeId, setRouteId] = useState('')
  const [routes, setRoutes] = useState([])
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [duration, setDuration] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const r = await API.get('/plans')
      setPlans(r.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])
  useEffect(() => {
    fetchRoutes().then(setRoutes).catch(() => setRoutes([]));
  }, [])

  const validate = () => {
    const newErrors = {}
    if (!name) newErrors.name = 'Plan name is required.'
    if (!routeId) newErrors.routeId = 'Route is required.'
    if (!budget) newErrors.budget = 'Budget is required.'
    else if (isNaN(Number(budget)) || Number(budget) <= 0) newErrors.budget = 'Budget must be a positive number.'
    if (!duration) newErrors.duration = 'Duration is required.'
    else if (isNaN(Number(duration)) || Number(duration) <= 0) newErrors.duration = 'Duration must be a positive number.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const create = async () => {
    setFormError('')
    if (!validate()) return
    try {
      await API.post('/plans', {
        name,
        route: routeId,
        budget: Number(budget),
        duration: Number(duration)
      })
      setName('')
      setRouteId('')
      setBudget('')
      setDuration('')
      setShowForm(false)
      setErrors({})
      load()
    } catch (err) {
      setFormError('Error creating plan: ' + (err?.response?.data?.message || err.message))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'primary'
      case 'confirmed': return 'success'
      case 'in-progress': return 'warning'
      case 'completed': return 'success'
      case 'cancelled': return 'danger'
      default: return 'default'
    }
  }

  return (
    <Section title="My Trip Plans" subtitle="Organize and plan your hiking adventures">
      <div style={{ marginBottom: '32px' }}>
        {!showForm ? (
          <Button variant="primary" size="lg" onClick={() => setShowForm(true)}>
            + Create New Plan
          </Button>
        ) : (
          <Card>
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#fff' }}>
                Create New Trip Plan
              </h3>
              {formError && (
                <div style={{ color: '#ff6b6b', background: 'rgba(255,107,107,0.08)', padding: '8px 12px', borderRadius: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  {formError}
                </div>
              )}
              <div>
                <Input
                  placeholder="Plan Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={errors.name ? { borderColor: '#ff6b6b' } : {}}
                />
                {errors.name && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '2px' }}>{errors.name}</div>}
              </div>
              <div>
                <select
                  value={routeId}
                  onChange={e => setRouteId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: errors.routeId ? '1.5px solid #ff6b6b' : '1.5px solid #222',
                    background: '#18181b',
                    color: '#fff',
                    fontSize: '15px',
                    marginBottom: '2px'
                  }}
                >
                  <option value="">Select a route...</option>
                  {routes.map(r => (
                    <option key={r._id} value={r._id}>{r.name} {r.location ? `(${r.location})` : ''}</option>
                  ))}
                </select>
                {errors.routeId && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '2px' }}>{errors.routeId}</div>}
              </div>
              <div>
                <Input
                  placeholder="Budget ($)"
                  type="number"
                  value={budget}
                  min={1}
                  onChange={e => {
                    // Only allow numbers and dot
                    const val = e.target.value
                    if (/^\d*\.?\d*$/.test(val)) setBudget(val)
                  }}
                  style={errors.budget ? { borderColor: '#ff6b6b' } : {}}
                />
                {errors.budget && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '2px' }}>{errors.budget}</div>}
              </div>
              <div>
                <Input
                  placeholder="Duration (days)"
                  type="number"
                  value={duration}
                  min={1}
                  onChange={e => {
                    // Only allow integers
                    const val = e.target.value
                    if (/^\d*$/.test(val)) setDuration(val)
                  }}
                  style={errors.duration ? { borderColor: '#ff6b6b' } : {}}
                />
                {errors.duration && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '2px' }}>{errors.duration}</div>}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="primary" size="lg" onClick={create} style={{ flex: 1 }}>
                  Create Plan
                </Button>
                <Button variant="outline" size="lg" onClick={() => { setShowForm(false); setErrors({}); setFormError(''); }} style={{ flex: 1 }}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888' }}>Loading plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888', marginBottom: '16px' }}>
            No trip plans yet. Create your first plan to get started!
          </p>
        </Card>
      ) : (
        <Grid columns={1} gap="16px">
          {plans.map(p => (
            <Card key={p._id} hover={true}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      margin: 0,
                      color: '#fff'
                    }}>
                      {p.name || 'Unnamed Plan'}
                    </h3>
                    <Badge variant={getStatusColor(p.status)}>
                      {(p.status || 'planning').charAt(0).toUpperCase() + (p.status || 'planning').slice(1)}
                    </Badge>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                    fontSize: '13px',
                    color: '#888',
                    marginBottom: '12px'
                  }}>
                    <div>Budget: ${p.budget}</div>
                    <div>Duration: {p.duration} days</div>
                    <div>Route: {p.route?.name || 'N/A'}</div>
                  </div>
                  {p.notes && (
                    <div style={{
                      fontSize: '13px',
                      color: '#aaa',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      padding: '12px',
                      borderRadius: '6px',
                      borderLeft: '3px solid rgba(255,255,255,0.1)'
                    }}>
                      {p.notes}
                    </div>
                  )}
                  {p.gearList && p.gearList.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                        Gear Items ({p.gearList.length}):
                      </p>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {p.gearList.map((g, i) => (
                          <Badge key={i} variant={g.purchased ? 'success' : 'default'}>
                            {g.item} {g.purchased && '✓'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  )
}
