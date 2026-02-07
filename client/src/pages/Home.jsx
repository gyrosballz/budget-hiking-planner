import React from 'react'
import { Section, Card, Grid, Button, Badge } from '../components/UI'
import { Link } from 'react-router-dom'

// Landing page showcasing app features and navigation to main sections
export default function Home(){
  return (
    <Section
      title="Hikey"
      subtitle="Minimal planning, maximum time outdoors."
    >
      <Card
        hover={false}
        style={{
          textAlign: 'left',
          marginBottom: '56px',
          padding: '40px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e5e7eb',
          borderRadius: '24px'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '28px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: '12px'
            }}>
              Plan. Pack. Go.
            </div>
            <p style={{
              color: '#0f172a',
              fontSize: '18px',
              lineHeight: 1.7,
              margin: 0,
              marginBottom: '24px'
            }}>
              Discover trails, build trip plans with budgets and gear lists, and shop curated hiking essentials.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link to="/routes" style={{ textDecoration: 'none' }}>
                <Button variant="primary">Explore Routes</Button>
              </Link>
              <Link to="/plans" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">Create a Plan</Button>
              </Link>
              <Link to="/store" style={{ textDecoration: 'none' }}>
                <Button variant="outline">Visit Store</Button>
              </Link>
            </div>
          </div>
          <div style={{
            display: 'grid',
            gap: '14px',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
          }}>
            {[
              { label: 'Routes', value: '150+' },
              { label: 'Plans', value: '1-click' },
              { label: 'Gear', value: 'Curated' },
              { label: 'Alerts', value: 'Live' }
            ].map((item) => (
              <div key={item.label} style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 6px 16px rgba(15, 23, 42, 0.06)'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#0f172a'
                }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Grid columns={3} gap="24px">
        <Link to="/routes" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Go to Routes page">
          <Card
            hover={true}
            style={{
              position: 'relative',
              borderRadius: '18px',
              padding: '22px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 20px rgba(15, 23, 42, 0.06)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}>
              <div style={{
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#64748b'
              }}>
                Routes
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a',
                fontSize: '16px'
              }}>
                ⛰
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Trail Discovery
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
              Search by difficulty, distance, and features.
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#0f172a'
            }}>
              Open Routes →
            </div>
          </Card>
        </Link>

        <Link to="/plans" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Go to Plans page">
          <Card
            hover={true}
            style={{
              position: 'relative',
              borderRadius: '18px',
              padding: '22px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 20px rgba(15, 23, 42, 0.06)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}>
              <div style={{
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#64748b'
              }}>
                Plans
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a',
                fontSize: '16px'
              }}>
                🗺
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Trip Planning
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
              Build schedules, gear lists, and budgets.
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#0f172a'
            }}>
              Open Plans →
            </div>
          </Card>
        </Link>

        <Link to="/store" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Go to Store page">
          <Card
            hover={true}
            style={{
              position: 'relative',
              borderRadius: '18px',
              padding: '22px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 20px rgba(15, 23, 42, 0.06)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}>
              <div style={{
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#64748b'
              }}>
                Store
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a',
                fontSize: '16px'
              }}>
                🎒
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Gear Marketplace
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
              Shop essentials with live stock updates.
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#0f172a'
            }}>
              Open Store →
            </div>
          </Card>
        </Link>
      </Grid>
    </Section>
  )
}
