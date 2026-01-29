import React, { useEffect, useState } from 'react'
import API from '../api'
import { Card, Button, Input, Select, Badge, Section, Grid, Alert } from '../components/UI'

export default function Routes(){
  const [routes, setRoutes] = useState([])
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
                      color: '#fff'
                    }}>
                      {r.name}
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
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  minWidth: '120px'
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    ⭐ {r.rating}
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
