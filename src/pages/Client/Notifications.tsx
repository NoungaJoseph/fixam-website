import './Notifications.css';
import { useState, useEffect } from 'react';
import { Icon } from '../../App';
import { api } from '../../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      const list = res.data.data || res.data.notifications || [];
      setNotifications(list);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications/clear');
      fetchNotifs();
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      // Assuming a generic read all endpoint or we can manually loop or backend handles it.
      // Wait, is there a mark all read endpoint? Let me check backend. 
      // If not, we can just fetchNotifs after calling a known endpoint, or iterate.
      // But typically we can just do api.put('/notifications/read-all').
      // Let's check backend notification controller later. For now, let's assume it exists or just visual.
      // Actually backend didn't have read-all, but let's see. 
      // I'll add the button and try to hit an endpoint or loop.
      const unreadNotifs = notifications.filter(n => !n.isRead);
      await Promise.all(unreadNotifs.map(n => api.put(`/notifications/${n.id}/read`)));
      fetchNotifs();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const getIconForType = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'BOOKING': return <Icon name="calendar" />;
      case 'MESSAGE': return <Icon name="chat" />;
      case 'PAYMENT': case 'WALLET': return <Icon name="wallet" />;
      case 'JOB': case 'OFFER': return <Icon name="check" />;
      default: return <Icon name="bell" />;
    }
  };

  return (
    <div className="bg-transparent border-0 p-0 w-full animate-fade-in">
      <div className="dash-panel-header-new">
        <h2>Notifications Log</h2>
        {notifications.length > 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="panel-link" onClick={handleMarkAllRead}>Mark all as read</button>
            <button className="panel-link" onClick={handleClearAll} style={{ color: '#ef4444' }}>Clear all</button>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '12px', color: '#64748b', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔔</div>
          <h3 style={{ margin: '0 0 0.4rem 0', color: '#0f172a', fontWeight: 700 }}>No Notifications Yet</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>You're all caught up! New job updates, bookings, and messages will appear here.</p>
        </div>
      ) : (
        <div className="activity-items-list large-list">
          {notifications.map((n) => (
            <div className={`activity-item-row ${!n.isRead ? 'unread-row' : ''}`} key={n.id}>
              <div className="activity-icon-container">
                {getIconForType(n.type)}
              </div>
              <div className="activity-details">
                <h4 className="activity-title">{n.title || n.heading || 'System Notification'}</h4>
                <p className="activity-subtitle">{n.message || n.body || n.content}</p>
              </div>
              <span className="activity-time">
                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

