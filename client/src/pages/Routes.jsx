import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import { Card, Button, Input, Select, Badge, Section, Grid, Alert } from '../components/UI'

export default function Routes(){
  const [routes, setRoutes] = useState([])
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedRoute, setExpandedRoute] = useState(null)
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    setError('')
    const q = new URLSearchParams()
    if (search) q.append('search', search)
    if (difficulty) q.append('difficulty', difficulty)
    try {
      const r = await API.get('/routes?' + q)
      setRoutes(r.data)
    } catch (err) {
      setError('Failed to load routes. Please try again.')
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'success'
      case 'moderate': return 'warning'
      case 'hard': return 'danger'
      default: return 'default'
    }
  }

  return (
    <Section
      title="Explore Hiking Routes"
      subtitle="Discover amazing trails for your next adventure"
    >
      {error && <Alert type="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      <div style={{
        marginBottom: '40px',
        padding: '24px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <Input
            placeholder="Search by name or location"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            options={[
              { label: 'All difficulties', value: '' },
              { label: 'Easy', value: 'easy' },
              { label: 'Moderate', value: 'moderate' },
              { label: 'Hard', value: 'hard' }
            ]}
          />
          <Button variant="primary" size="md" onClick={load} style={{ width: '100%' }}>
            Search Routes
          </Button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888' }}>Loading routes...</p>
        </div>
      ) : routes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888' }}>No routes found. Try different search parameters.</p>
        </div>
      ) : (
        <Grid columns={1} gap="24px">
          {routes.map(r => (
            <Card key={r._id} hover={false}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      margin: 0,
                      letterSpacing: '-0.5px',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                    onClick={() => setExpandedRoute(expandedRoute === r._id ? null : r._id)}
                    >
                      {expandedRoute === r._id ? '▼' : '▶'} {r.name}
                    </h3>
                    <Badge variant={getDifficultyColor(r.difficulty)}>
                      {r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#888',
                    marginBottom: '12px',
                    letterSpacing: '-0.2px'
                  }}>
                    {r.description}
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    fontSize: '13px',
                    color: '#888'
                  }}>
                    <div>Location: {r.location}</div>
                    <div>Distance: {r.distance} miles</div>
                    <div>Elevation: {r.elevation} ft</div>
                    <div>Duration: {r.duration} hours</div>
                    {r.trailType && <div>Trail Type: {r.trailType}</div>}
                    {r.surface && <div>Surface: {r.surface}</div>}
                  </div>
                  {r.features && r.features.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Features:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {r.features.map((f, i) => (
                          <Badge key={i} variant="primary">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expandable Section */}
                  {expandedRoute === r._id && (
                    <div style={{
                      marginTop: '20px',
                      padding: '20px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      {/* Water & Nutrition Section */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                          </svg>
                          Water & Nutrition
                        </h4>
                        <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: '#aaa' }}>
                          <div>• Recommended Water: <strong style={{ color: '#fff' }}>{r.waterLiters || 2} liters</strong></div>
                          <div>• Estimated Calories: <strong style={{ color: '#fff' }}>{r.caloriesNeeded || 500} kcal</strong></div>
                          {r.nutritionNotes && (
                            <div style={{ marginTop: '8px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                              💡 {r.nutritionNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recommended Gear Section */}
                      {r.recommendedGear && r.recommendedGear.length > 0 && (
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
                            🎒 Recommended Gear
                          </h4>
                          <div style={{ display: 'grid', gap: '12px' }}>
                            {r.recommendedGear.map((gear, i) => (
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
                    </div>
                  )}
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  minWidth: '120px'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    {r.rating}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {r.reviews} reviews
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  )
}
