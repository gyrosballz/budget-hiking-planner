import React from 'react'
import { Section, Card, Grid, Button, Badge } from '../components/UI'
import { Link } from 'react-router-dom'

// Landing page showcasing app features and navigation to main sections
export default function Home(){
  return (
    <Section
      title="Hiking Planner"
      subtitle="Plan routes, organize trips, and gear up for the trail"
    >
      <Card hover={false} style={{ textAlign: 'center', marginBottom: '32px' }}>
        <p style={{
          color: '#bbb',
          fontSize: '16px',
          lineHeight: 1.6,
          margin: 0
        }}>
          Discover beautiful trails, build trip plans with budgets and gear lists, and shop curated hiking essentials—all in one place.
        </p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/routes" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Explore Routes</Button>
          </Link>
          <Link to="/store" style={{ textDecoration: 'none' }}>
            <Button variant="secondary">Visit Store</Button>
          </Link>
        </div>
      </Card>

      <Grid columns={3} gap="20px">
        <Card hover={true} style={{ position: 'relative', borderRadius: '24px', transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
          <Link to="/routes" style={{ position: 'absolute', inset: 0, zIndex: 2, textDecoration: 'none', color: 'inherit' }} aria-label="Go to Routes page" />
          <div style={{ marginBottom: '10px' }}>
            <Badge variant="primary">Routes</Badge>
          </div>
          <h3 style={{ color: '#fff', margin: '0 0 8px 0' }}>Trail Discovery</h3>
          <p style={{ color: '#888', margin: 0 }}>
            Filter by difficulty, distance, and features to find the perfect hike.
          </p>
        </Card>
        <Card hover={true} style={{ position: 'relative', borderRadius: '24px', transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
          <Link to="/plans" style={{ position: 'absolute', inset: 0, zIndex: 2, textDecoration: 'none', color: 'inherit' }} aria-label="Go to Plans page" />
          <div style={{ marginBottom: '10px' }}>
            <Badge variant="success">Plans</Badge>
          </div>
          <h3 style={{ color: '#fff', margin: '0 0 8px 0' }}>Trip Planning</h3>
          <p style={{ color: '#888', margin: 0 }}>
            Create detailed plans with dates, budgets, and gear checklists.
          </p>
        </Card>
        <Card hover={true} style={{ position: 'relative', borderRadius: '24px', transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
          <Link to="/store" style={{ position: 'absolute', inset: 0, zIndex: 2, textDecoration: 'none', color: 'inherit' }} aria-label="Go to Store page" />
          <div style={{ marginBottom: '10px' }}>
            <Badge variant="warning">Store</Badge>
          </div>
          <h3 style={{ color: '#fff', margin: '0 0 8px 0' }}>Gear Marketplace</h3>
          <p style={{ color: '#888', margin: 0 }}>
            Shop essential hiking gear with real-time stock updates.
          </p>
        </Card>
      </Grid>
    </Section>
  )
}
