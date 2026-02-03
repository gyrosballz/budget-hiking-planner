import React, { useEffect, useState } from 'react'
import API from '../api'
import { Card, Button, Section, Grid, Badge, Alert } from '../components/UI'

export default function Notifications(){
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread
  const [expandedNotif, setExpandedNotif] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const r = await API.get('/notifications')
      setNotifs(r.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    try {
      await API.post(`/notifications/${id}/read`)
      load()
    } catch (err) {
      console.error(err)
    }
  }

  const del = async (id) => {
    try {
      await API.delete(`/notifications/${id}`)
      load()
    } catch (err) {
      console.error(err)
    }
  }

  const getNotificationIcon = () => '•'

  const filteredNotifs = filter === 'unread'
    ? notifs.filter(n => !n.read)
    : notifs

  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <Section
      title="Notifications"
      subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
    >
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          All ({notifs.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'primary' : 'secondary'}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888' }}>Loading notifications...</p>
        </div>
      ) : filteredNotifs.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '16px', color: '#888', marginBottom: '16px' }}>
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </p>
          <p style={{ fontSize: '13px', color: '#666' }}>
            {filter === 'unread'
              ? 'You are all caught up!'
              : 'You will receive notifications about orders, updates, and system events'}
          </p>
        </Card>
      ) : (
        <Grid columns={1} gap="12px">
          {filteredNotifs.map(n => (
            <Card
              key={n._id}
              style={{
                backgroundColor: !n.read ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                borderLeft: !n.read ? '4px solid rgba(100,200,255,0.5)' : 'transparent',
                borderRadius: '8px'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                <div style={{ fontSize: '20px', color: '#888' }}>
                  {getNotificationIcon(n.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div 
                    style={{ cursor: n.type === 'order' && n.order ? 'pointer' : 'default' }}
                    onClick={() => n.type === 'order' && n.order && setExpandedNotif(expandedNotif === n._id ? null : n._id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                      {n.type === 'order' && n.order && (
                        <span style={{ fontSize: '14px', color: '#888' }}>
                          {expandedNotif === n._id ? '▼' : '▶'}
                        </span>
                      )}
                      <h4 style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        margin: 0,
                        color: '#fff'
                      }}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <Badge variant="primary">New</Badge>
                      )}
                    </div>
                    <p style={{
                      fontSize: '13px',
                      color: '#aaa',
                      margin: '0 0 12px 0',
                      lineHeight: '1.4'
                    }}>
                      {n.message}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '12px',
                      color: '#888'
                    }}>
                      <span>
                        {new Date(n.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Expanded Order Details */}
                  {expandedNotif === n._id && n.type === 'order' && n.order && (
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      paddingTop: '12px',
                      marginTop: '12px'
                    }}>
                      <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                        <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer Information:</h4>
                        <div style={{ fontSize: '13px', color: '#fff', lineHeight: '1.8' }}>
                          <div><span style={{ color: '#888' }}>Name:</span> <strong>{n.order.user?.name || 'N/A'}</strong></div>
                          <div><span style={{ color: '#888' }}>Email:</span> <strong>{n.order.user?.email || 'N/A'}</strong></div>
                          <div><span style={{ color: '#888' }}>Role:</span> <Badge variant="secondary" style={{ fontSize: '11px', padding: '2px 8px' }}>{n.order.user?.role || 'user'}</Badge></div>
                          <div><span style={{ color: '#888' }}>Order Date:</span> <strong>{new Date(n.order.createdAt).toLocaleString()}</strong></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                  {!n.read && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => markRead(n._id)}
                    >
                      Mark Read
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => del(n._id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  )
}
