import React from 'react'
import { Section, Card, Grid, Button, Badge } from '../components/UI'
import { Link } from 'react-router-dom'

// Landing page showcasing app features and navigation to main sections
export default function Home(){
  return (
    <Section
      title="Welcome to Hikey"
    >
      <Card hover={false} style={{ textAlign: 'left', marginBottom: '64px', padding: '32px', backgroundColor: '#f9f9f9', border: 'none' }}>
        <p style={{
          color: '#000',
          fontSize: '16px',
          lineHeight: 1.8,
          margin: 0,
          marginBottom: '24px'
        }}>
          Discover beautiful trails, build trip plans with budgets and gear lists, and shop curated hiking essentials—all in one place.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/routes" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Explore Routes</Button>
          </Link>
          <Link to="/store" style={{ textDecoration: 'none' }}>
            <Button variant="outline">Visit Store</Button>
          </Link>
        </div>
      </Card>

      <Grid columns={3} gap="24px">
        <Card hover={true} style={{ position: 'relative', borderRadius: '0px', transition: 'border-color 0.2s ease', padding: '32px' }}>
          <Link to="/routes" style={{ position: 'absolute', inset: 0, zIndex: 2, textDecoration: 'none', color: 'inherit' }} aria-label="Go to Routes page" />
          <div style={{ marginBottom: '16px' }}>
            <Badge variant="default">Routes</Badge>
          </div>
          <h3 style={{ color: '#000', margin: '0 0 12px 0', fontSize: '20px', fontWeight: 600 }}>Trail Discovery</h3>
          <p style={{ color: '#000', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
            Filter by difficulty, distance, and features to find the perfect hike.
          </p>
        </Card>
        <Card hover={true} style={{ position: 'relative', borderRadius: '0px', transition: 'border-color 0.2s ease', padding: '32px' }}>
          <Link to="/plans" style={{ position: 'absolute', inset: 0, zIndex: 2, textDecoration: 'none', color: 'inherit' }} aria-label="Go to Plans page" />
          <div style={{ marginBottom: '16px' }}>
            <Badge variant="default">Plans</Badge>
          </div>
          <h3 style={{ color: '#000', margin: '0 0 12px 0', fontSize: '20px', fontWeight: 600 }}>Trip Planning</h3>
          <p style={{ color: '#000', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
            Create detailed plans with dates, budgets, and gear checklists.
          </p>
        </Card>
        <Card hover={true} style={{ position: 'relative', borderRadius: '0px', transition: 'border-color 0.2s ease', padding: '32px' }}>
          <Link to="/store" style={{ position: 'absolute', inset: 0, zIndex: 2, textDecoration: 'none', color: 'inherit' }} aria-label="Go to Store page" />
          <div style={{ marginBottom: '16px' }}>
            <Badge variant="default">Store</Badge>
          </div>
          <h3 style={{ color: '#000', margin: '0 0 12px 0', fontSize: '20px', fontWeight: 600 }}>Gear Marketplace</h3>
          <p style={{ color: '#000', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
            Shop essential hiking gear with real-time stock updates.
          </p>
        </Card>
      </Grid>
    </Section>
  )
}
