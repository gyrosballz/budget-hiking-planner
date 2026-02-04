import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import { fetchRoutes } from '../api/routes'
import { Card, Button, Input, Section, Grid, Badge } from '../components/UI'

// Trip planning page for creating and managing hiking plans
export default function Plans(){
  const [plans, setPlans] = useState([])
  const [routeId, setRouteId] = useState('')
  const [routes, setRoutes] = useState([])
  const [name, setName] = useState('')
  const [duration, setDuration] = useState('')
  const [companions, setCompanions] = useState('1')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [expandedPlan, setExpandedPlan] = useState(null)
  const navigate = useNavigate()

  // Loads user's trip plans from backend
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

  // Validates plan form inputs before submission
  const validate = () => {
    const newErrors = {}
    if (!name) newErrors.name = 'Plan name is required.'
    if (!routeId) newErrors.routeId = 'Route is required.'
    if (!duration) newErrors.duration = 'Duration is required.'
    else if (isNaN(Number(duration)) || Number(duration) <= 0) newErrors.duration = 'Duration must be a positive number.'
    if (!companions) newErrors.companions = 'Number of companions is required.'
    else if (isNaN(Number(companions)) || Number(companions) <= 0) newErrors.companions = 'Must be at least 1 person.'
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Creates new plan or updates existing plan with validated data
  const create = async () => {
    setFormError('')
    if (!validate()) return
    try {
      const payload = {
        name,
        route: routeId,
        duration: Number(duration),
        companions: Number(companions)
      }
      if (startDate) payload.startDate = startDate
      if (endDate) payload.endDate = endDate

      if (editingPlanId) {
        await API.put(`/plans/${editingPlanId}`, payload)
      } else {
        await API.post('/plans', payload)
      }
      
      setName('')
      setRouteId('')
      setDuration('')
      setCompanions('1')
      setStartDate('')
      setEndDate('')
      setShowForm(false)
      setErrors({})
      setEditingPlanId(null)
      load()
    } catch (err) {
      setFormError('Error saving plan: ' + (err?.response?.data?.message || err.message))
    }
  }

  // Deletes a trip plan after user confirmation
  const deletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return
    try {
      await API.delete(`/plans/${id}`)
      load()
    } catch (err) {
      alert('Error deleting plan: ' + (err?.response?.data?.message || err.message))
    }
  }

  // Creates a duplicate copy of an existing plan
  const duplicatePlan = async (plan) => {
    try {
      await API.post('/plans', {
        name: plan.name + ' (Copy)',
        route: plan.route._id || plan.route,
        duration: plan.duration,
        companions: plan.companions || 1,
        startDate: plan.startDate,
        endDate: plan.endDate
      })
      load()
    } catch (err) {
      alert('Error duplicating plan: ' + (err?.response?.data?.message || err.message))
    }
  }

  // Loads plan data into form for editing
  const editPlan = (plan) => {
    setName(plan.name)
    setRouteId(plan.route?._id || plan.route)
    setDuration(plan.duration.toString())
    setCompanions((plan.companions || 1).toString())
    setStartDate(plan.startDate ? plan.startDate.split('T')[0] : '')
    setEndDate(plan.endDate ? plan.endDate.split('T')[0] : '')
    setEditingPlanId(plan._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Updates the status of a trip plan
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/plans/${id}`, { status })
      load()
    } catch (err) {
      alert('Error updating status: ' + (err?.response?.data?.message || err.message))
    }
  }

  // Returns badge color based on plan status
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
                {editingPlanId ? 'Edit Trip Plan' : 'Create New Trip Plan'}
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
              <div>
                <Input
                  placeholder="Number of People"
                  type="number"
                  value={companions}
                  min={1}
                  onChange={e => {
                    const val = e.target.value
                    if (/^\d*$/.test(val)) setCompanions(val)
                  }}
                  style={errors.companions ? { borderColor: '#ff6b6b' } : {}}
                />
                {errors.companions && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '2px' }}>{errors.companions}</div>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    style={errors.startDate ? { borderColor: '#ff6b6b' } : {}}
                  />
                  {errors.startDate && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '2px' }}>{errors.startDate}</div>}
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    style={errors.endDate ? { borderColor: '#ff6b6b' } : {}}
                  />
                  {errors.endDate && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '2px' }}>{errors.endDate}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="primary" size="lg" onClick={create} style={{ flex: 1 }}>
                  {editingPlanId ? 'Update Plan' : 'Create Plan'}
                </Button>
                <Button variant="outline" size="lg" onClick={() => { 
                  setShowForm(false); 
                  setErrors({}); 
                  setFormError(''); 
                  setEditingPlanId(null);
                  setName('');
                  setRouteId('');
                  setDuration('');
                  setCompanions('1');
                  setStartDate('');
                  setEndDate('');
                }} style={{ flex: 1 }}>
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
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                    onClick={() => setExpandedPlan(expandedPlan === p._id ? null : p._id)}
                    >
                      {expandedPlan === p._id ? '▼' : '▶'} {p.name || 'Unnamed Plan'}
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
                    <div>Duration: {p.duration} days</div>
                    <div>People: {p.companions || 1}</div>
                    <div>Route: {p.route?.name || 'N/A'}</div>
                  </div>
                  {(p.startDate || p.endDate) && (
                    <div style={{
                      fontSize: '13px',
                      color: '#aaa',
                      marginBottom: '12px',
                      display: 'flex',
                      gap: '16px'
                    }}>
                      {p.startDate && <div>Start: {new Date(p.startDate).toLocaleDateString()}</div>}
                      {p.endDate && <div>End: {new Date(p.endDate).toLocaleDateString()}</div>}
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {p.status !== 'in-progress' && p.status !== 'completed' && (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => updateStatus(p._id, 'in-progress')}
                      >
                        Mark In Progress
                      </Button>
                    )}
                    {p.status === 'in-progress' && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => updateStatus(p._id, 'completed')}
                      >
                        Mark Completed
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => editPlan(p)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => duplicatePlan(p)}
                    >
                      Duplicate
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => deletePlan(p._id)}
                    >
                      Delete
                    </Button>
                  </div>

                  {/* Expanded Details */}
                  {expandedPlan === p._id && p.route && (
                    <div style={{
                      marginTop: '16px',
                      padding: '20px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      {/* Route Name Header */}
                      <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                          {p.route.name}
                        </h3>
                      </div>

                      {/* Route Info */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>Route Details</h4>
                        <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: '#aaa' }}>
                          <div>Location: <strong style={{ color: '#fff' }}>{p.route.location}</strong></div>
                          <div>Distance: <strong style={{ color: '#fff' }}>{p.route.distance} miles</strong></div>
                          <div>Elevation: <strong style={{ color: '#fff' }}>{p.route.elevation} ft</strong></div>
                          <div>Trail Type: <strong style={{ color: '#fff' }}>{p.route.trailType || 'N/A'}</strong></div>
                          <div>Difficulty: <strong style={{ color: '#fff' }}>{(p.route.difficulty || '').charAt(0).toUpperCase() + (p.route.difficulty || '').slice(1)}</strong></div>
                        </div>
                      </div>

                      {/* Water & Nutrition Section */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M8 12h8M12 8v8"/>
                          </svg>
                          Water & Nutrition
                        </h4>
                        <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: '#aaa' }}>
                          <div>• Recommended Water: <strong style={{ color: '#fff' }}>{p.route.waterLiters || 2} liters</strong></div>
                          <div>• Estimated Calories: <strong style={{ color: '#fff' }}>{p.route.caloriesNeeded || 500} kcal</strong></div>
                          {p.route.nutritionNotes && (
                            <div style={{ marginTop: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v8M12 16h.01"/>
                              </svg>
                              <span>{p.route.nutritionNotes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recommended Gear Section */}
                      {p.route.recommendedGear && p.route.recommendedGear.length > 0 && (
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="4" y="4" width="16" height="18" rx="2"/>
                              <path d="M8 2v4M16 2v4"/>
                            </svg>
                            Recommended Gear
                          </h4>
                          <div style={{ display: 'grid', gap: '12px' }}>
                            {p.route.recommendedGear.map((gear, i) => (
                              <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                borderRadius: '6px',
                                border: '1px solid rgba(255,255,255,0.06)',
                                cursor: gear.productId ? 'pointer' : 'default',
                                transition: 'all 0.2s'
                              }}
                              onClick={() => gear.productId && navigate('/store')}
                              onMouseEnter={(e) => gear.productId && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                              onMouseLeave={(e) => gear.productId && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <Badge variant={gear.priority === 'essential' ? 'danger' : gear.priority === 'recommended' ? 'warning' : 'default'}>
                                    {gear.priority}
                                  </Badge>
                                  <span style={{ color: '#fff', fontSize: '14px' }}>{gear.name}</span>
                                </div>
                                {gear.productId && (
                                  <span style={{ color: '#888', fontSize: '12px' }}>
                                    View in Store →
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: '16px', textAlign: 'center' }}>
                            <Button
                              variant="primary"
                              size="md"
                              onClick={() => navigate('/store')}
                            >
                              Browse All Gear in Store →
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Plan Notes */}
                      {p.notes && (
                        <div style={{
                          fontSize: '13px',
                          color: '#aaa',
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          padding: '12px',
                          borderRadius: '6px',
                          borderLeft: '3px solid rgba(255,255,255,0.1)',
                          marginTop: '20px'
                        }}>
                          <strong style={{ color: '#fff' }}>Plan Notes:</strong> {p.notes}
                        </div>
                      )}

                      {/* Gear List */}
                      {p.gearList && p.gearList.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                          <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                            Your Gear List ({p.gearList.length}):
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
