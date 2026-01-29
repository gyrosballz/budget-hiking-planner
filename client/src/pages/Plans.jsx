import React, { useEffect, useState } from 'react'
import API from '../api'
import { Card, Button, Input, Section, Grid, Badge } from '../components/UI'

export default function Plans(){
  const [plans, setPlans] = useState([])
  const [routeId, setRouteId] = useState('')
  const [budget, setBudget] = useState('')
  const [duration, setDuration] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

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

  const create = async () => {
    if (!routeId || !budget || !duration) {
      alert('Please fill all fields')
      return
    }
    try {
      await API.post('/plans', {
        route: routeId,
        budget: Number(budget),
        duration: Number(duration)
      })
      setRouteId('')
      setBudget('')
      setDuration('')
      setShowForm(false)
      load()
    } catch (err) {
      alert('Error creating plan: ' + err.message)
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
              <Input
                placeholder="Route ID or name"
                value={routeId}
                onChange={e => setRouteId(e.target.value)}
              />
              <Input
                placeholder="Budget ($)"
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
              />
              <Input
                placeholder="Duration (days)"
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="primary" size="lg" onClick={create} style={{ flex: 1 }}>
                  Create Plan
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowForm(false)} style={{ flex: 1 }}>
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
