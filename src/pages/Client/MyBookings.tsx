import './MyBookings.css';
import React, { useState } from 'react';
import { Icon, images, getMediaUrl, DEFAULT_AVATAR } from '../../App';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import MyTasks from './MyTasks';
import ReviewModal from '../../components/ReviewModal';

interface MyBookingsProps {
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  clientTasks: any[];
  setClientTasks: (tasks: any[]) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: any) => void;
  walletBalance?: number;
  savedProsState?: any[];
  setSelectedBooking?: (bk: any) => void;
}

export default function MyBookings({ 
  clientBookings, 
  setClientBookings, 
  clientTasks, 
  setClientTasks, 
  setActiveTab, 
  setActiveChatUser,
  walletBalance = 0,
  savedProsState = [],
  setSelectedBooking
}: MyBookingsProps) {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'tasks'>('bookings');
  const [reviewTarget, setReviewTarget] = useState<{ jobId: string; targetUserId: string; targetName: string } | null>(null);

  return (
    <div className="bookings-tasks-tab-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Subtabs Header */}
      <div className="dash-subtabs-header">
        <button 
          className={`subtab-btn ${activeSubTab === 'bookings' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('bookings')}
        >
          My Bookings
        </button>
        <button 
          className={`subtab-btn ${activeSubTab === 'tasks' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('tasks')}
        >
          My Posted Tasks
        </button>
      </div>

      {activeSubTab === 'bookings' ? (
        <div className="bg-transparent border-0 p-0 w-full">
          <div className="dash-panel-header-new">
            <h2>Bookings List</h2>
          </div>
          <div className="bookings-detailed-list">
            {clientBookings.map((bk) => {
              const bkProvider = bk.provider ? `${bk.provider.firstName || ''} ${bk.provider.lastName || ''}`.trim() : 'Unknown Provider';
              const bkService = bk.task?.title || 'General Service';
              let bkDate = 'TBD';
              try {
                const dateVal = bk.bookingDate || bk.createdAt;
                if (dateVal) {
                  const d = new Date(dateVal);
                  bkDate = isNaN(d.getTime()) ? dateVal : d.toLocaleDateString();
                }
              } catch {
                bkDate = bk.bookingDate || bk.createdAt || 'TBD';
              }
              const bkTime = bk.bookingTime || 'TBD';
              const bkPrice = bk.budget ? `${bk.budget} XAF` : 'N/A';
              const bkImage = bk.provider?.avatar ? getMediaUrl(bk.provider.avatar) : DEFAULT_AVATAR;
              const bkStatus = bk.status || 'PENDING';

              return (
              <div 
                className="booking-detailed-card cursor-pointer hover:border-teal-400 transition" 
                key={bk.id || bk._id}
                onClick={() => {
                  const bkId = String(bk.id || bk._id || '');
                  if (bkId) {
                    try {
                      const storageKey = `fixam_read_bookings_${user?.id || (user as any)?._id || 'default'}`;
                      const stored: string[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
                      if (!stored.includes(bkId)) {
                        stored.push(bkId);
                        localStorage.setItem(storageKey, JSON.stringify(stored));
                        window.dispatchEvent(new CustomEvent('fixam_bookings_read_changed', { detail: { id: bkId } }));
                      }
                    } catch {}
                  }
                  if (setSelectedBooking) setSelectedBooking(bk);
                  setActiveTab('Booking Details');
                }}
              >
                <div className="booking-card-left">
                  <img src={bkImage} alt={bkProvider} />
                  <div className="booking-info-details">
                    <h3>{bkService}</h3>
                    <p className="provider-name">Provider: <strong>{bkProvider}</strong></p>
                    <p className="price-lbl-detail">Price: <span>{bkPrice}</span></p>
                  </div>
                </div>
                <div className="booking-card-mid">
                  <div className="schedule-badge">
                    <Icon name="calendar" />
                    <span>{bkDate} • {bkTime}</span>
                  </div>
                  <span className={`booking-status-badge ${bkStatus.toLowerCase()}`} style={bkStatus === 'COUNTER_PROPOSED' ? { background: '#FEF3C7', color: '#B45309', borderColor: '#FCD34D' } : {}}>
                    {bkStatus === 'COUNTER_PROPOSED' ? 'Counter Offer Received' : bkStatus}
                  </span>
                </div>
                <div className="booking-card-actions">
                  {bkStatus === 'COUNTER_PROPOSED' && (
                    <button className="btn-chat-booking" style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#FFFFFF', fontWeight: 'bold' }} onClick={(e) => {
                      e.stopPropagation();
                      if (setSelectedBooking) setSelectedBooking(bk);
                      setActiveTab('Booking Details');
                    }}>
                      💡 Review Counter
                    </button>
                  )}
                  <button className="btn-chat-booking" onClick={() => {
                    const targetId = bk.provider?.userId || bk.provider?.id || bk.providerId;
                    setActiveChatUser({ id: targetId, name: bkProvider, avatar: bk.provider?.avatar || bk.image });
                    setActiveTab('Messages');
                  }}>
                    <Icon name="chat" /> Chat
                  </button>
                  {bk.status === 'COMPLETED' && (
                    <button className="btn-chat-booking" style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#FFFFFF' }} onClick={(e) => {
                      e.stopPropagation();
                      const targetUserId = bk.provider?.id || bk.provider?.userId || bk.providerId;
                      setReviewTarget({ jobId: bk.id || bk._id, targetUserId, targetName: bkProvider });
                    }}>
                      ⭐ Review
                    </button>
                  )}
                  {bk.status !== 'COMPLETED' && bk.status !== 'CANCELLED' && (
                    <>
                      <button className="btn-cancel-booking" onClick={async (e) => {
                        e.stopPropagation();
                        const bkId = bk.id || bk._id;
                        if (confirm("Cancel this booking?")) {
                          try {
                            await api.patch(`/bookings/${bkId}/status`, { status: 'CANCELLED' });
                            setClientBookings(clientBookings.map(b => (b.id === bkId || b._id === bkId) ? {...b, status: 'CANCELLED'} : b));
                          } catch (err: any) {
                            alert("Failed to cancel: " + (err.response?.data?.message || err.message));
                          }
                        }
                      }}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
            )})}
          </div>
        </div>
      ) : (
        <MyTasks 
          clientTasks={clientTasks} 
          setClientTasks={setClientTasks} 
          setActiveTab={setActiveTab} 
          walletBalance={walletBalance}
          savedProsState={savedProsState}
          clientBookings={clientBookings}
        />
      )}

      {reviewTarget && (
        <ReviewModal
          isOpen={Boolean(reviewTarget)}
          onClose={() => setReviewTarget(null)}
          jobId={reviewTarget.jobId}
          targetUserId={reviewTarget.targetUserId}
          targetName={reviewTarget.targetName}
        />
      )}
    </div>
  );
}
