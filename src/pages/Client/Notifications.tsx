import './Notifications.css';
import { useState, useEffect } from 'react';
import { Icon } from '../../App';
import { api } from '../../services/api';

interface NotificationsProps {
  setActiveTab?: (tab: string) => void;
  setSelectedBooking?: (booking: any) => void;
}

export default function Notifications({ setActiveTab, setSelectedBooking }: NotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

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
      setNotifications([]);
      await api.delete('/notifications/clear');
      fetchNotifs();
    } catch (err) {
      console.error("Failed to clear notifications", err);
      fetchNotifs();
    }
  };

  const handleMarkAllRead = async () => {
    if (isMarkingAll) return;
    setIsMarkingAll(true);
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await api.put('/notifications/read-all');
      await fetchNotifs();
    } catch (err) {
      console.error("Failed to mark all as read", err);
      await fetchNotifs();
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleSingleRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleSingleArchive = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      await api.put(`/notifications/${id}/archive`);
    } catch (err) {
      console.error("Failed to archive notification", err);
      fetchNotifs();
    }
  };

  const getIconForType = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'BOOKING': case 'BOOKING_REQUEST': case 'BOOKING_ACCEPTED': case 'BOOKING_COUNTER': return <Icon name="calendar" />;
      case 'MESSAGE': case 'CHAT': return <Icon name="chat" />;
      case 'PAYMENT': case 'WALLET': case 'COINS': return <Icon name="wallet" />;
      case 'JOB': case 'OFFER': case 'JOB_ASSIGNED': case 'APPLICATION': return <Icon name="check" />;
      case 'REVIEW': return <Icon name="star" />;
      default: return <Icon name="bell" />;
    }
  };

  // Determine if a notification is actionable (navigable)
  const getNotificationAction = (notif: any) => {
    const type = (notif.type || '').toUpperCase();
    const data = notif.data || {};

    // Booking-related notifications
    if (type.includes('BOOKING') || data.bookingId) {
      return {
        label: 'View Booking',
        action: async () => {
          if (!notif.isRead) await handleSingleRead(notif.id);
          if (data.bookingId && setSelectedBooking && setActiveTab) {
            try {
              const res = await api.get(`/bookings/${data.bookingId}`);
              if (res.data?.data) {
                setSelectedBooking(res.data.data);
                setActiveTab('Booking Details');
              }
            } catch {
              setActiveTab('My Bookings');
            }
          } else if (setActiveTab) {
            setActiveTab('My Bookings');
          }
        }
      };
    }

    // Job-related notifications
    if (type.includes('JOB') || type.includes('APPLICATION') || type.includes('OFFER') || data.jobId) {
      return {
        label: 'View Jobs',
        action: () => {
          if (!notif.isRead) handleSingleRead(notif.id);
          if (setActiveTab) setActiveTab('My Jobs');
        }
      };
    }

    // Message/chat notifications
    if (type.includes('MESSAGE') || type.includes('CHAT') || data.conversationId) {
      return {
        label: 'Open Chat',
        action: () => {
          if (!notif.isRead) handleSingleRead(notif.id);
          if (setActiveTab) setActiveTab('Messages');
        }
      };
    }

    // Wallet/payment notifications
    if (type.includes('WALLET') || type.includes('PAYMENT') || type.includes('COINS') || data.transactionId) {
      return {
        label: 'View Wallet',
        action: () => {
          if (!notif.isRead) handleSingleRead(notif.id);
          if (setActiveTab) setActiveTab('Wallet');
        }
      };
    }

    // Review notifications
    if (type.includes('REVIEW') || data.reviewId) {
      return {
        label: 'View Reviews',
        action: () => {
          if (!notif.isRead) handleSingleRead(notif.id);
          if (setActiveTab) setActiveTab('Reviews');
        }
      };
    }

    return null;
  };

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <div className="bg-transparent border-0 p-0 w-full animate-fade-in">
      <div className="dash-panel-header-new">
        <h2>Notifications Log</h2>
        {notifications.length > 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            {hasUnread && (
              <button 
                className="panel-link" 
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                style={{ opacity: isMarkingAll ? 0.5 : 1 }}
              >
                {isMarkingAll ? 'Marking...' : 'Mark all as read'}
              </button>
            )}
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
          {notifications.map((n) => {
            const notifAction = getNotificationAction(n);
            return (
              <div 
                className={`activity-item-row ${!n.isRead ? 'unread-row' : ''}`} 
                key={n.id}
                onClick={() => {
                  if (notifAction) {
                    notifAction.action();
                  } else if (!n.isRead) {
                    handleSingleRead(n.id);
                  }
                }}
                style={{ cursor: (notifAction || !n.isRead) ? 'pointer' : 'default', position: 'relative' }}
              >
                <div className="activity-icon-container">
                  {getIconForType(n.type)}
                </div>
                <div className="activity-details" style={{ flex: 1 }}>
                  <h4 className="activity-title">{n.title || n.heading || 'System Notification'}</h4>
                  <p className="activity-subtitle">{n.message || n.body || n.content}</p>
                  {notifAction && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        notifAction.action();
                      }}
                      style={{
                        marginTop: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#14B8A6',
                        background: '#f0fdfa',
                        border: '1px solid #ccfbf1',
                        borderRadius: '6px',
                        padding: '3px 10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#14B8A6';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#f0fdfa';
                        e.currentTarget.style.color = '#14B8A6';
                      }}
                    >
                      {notifAction.label} →
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="activity-time">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button 
                    onClick={(e) => handleSingleArchive(e, n.id)}
                    title="Remove notification"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      padding: '2px 6px',
                      lineHeight: 1
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
