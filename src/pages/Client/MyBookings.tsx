import './MyBookings.css';
import React, { useState } from 'react';
import { Icon, images, getMediaUrl } from '../../App';
import { api } from '../../services/api';
import MyTasks from './MyTasks';

interface MyBookingsProps {
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  clientTasks: any[];
  setClientTasks: (tasks: any[]) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function MyBookings({ 
  clientBookings, 
  setClientBookings, 
  clientTasks, 
  setClientTasks, 
  setActiveTab, 
  setActiveChatUser 
}: MyBookingsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'tasks'>('bookings');

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
            <button className="btn-tab-action" onClick={async () => {
              const dateStr = prompt("Enter booking date (e.g. 2026-05-25):", "2026-05-25");
              const providerId = prompt("Enter Provider ID:");
              const jobId = prompt("Enter Job ID (Optional):");
              if (dateStr && providerId) {
                try {
                  const res = await api.post('/bookings', {
                    providerId,
                    jobId: jobId || undefined,
                    scheduledDate: new Date(dateStr).toISOString()
                  });
                  setClientBookings([res.data.booking, ...clientBookings]);
                  alert("Booking created successfully!");
                } catch (err: any) {
                  alert(err.response?.data?.message || "Failed to create booking");
                }
              }
            }}>+ New Booking</button>
          </div>
          <div className="bookings-detailed-list">
            {clientBookings.map((bk) => {
              const bkProvider = bk.provider ? `${bk.provider.firstName || ''} ${bk.provider.lastName || ''}`.trim() : 'Unknown Provider';
              const bkService = bk.task?.title || 'General Service';
              const bkDate = new Date(bk.bookingDate || bk.createdAt).toLocaleDateString();
              const bkTime = bk.bookingTime || 'TBD';
              const bkPrice = bk.budget ? `${bk.budget} XAF` : 'N/A';
              const bkImage = bk.provider?.avatar ? getMediaUrl(bk.provider.avatar) : images.proJeff;
              const bkStatus = bk.status || 'PENDING';

              return (
              <div className="booking-detailed-card" key={bk.id || bk._id}>
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
                  <span className={`booking-status-badge ${bkStatus.toLowerCase()}`}>
                    {bkStatus}
                  </span>
                </div>
                <div className="booking-card-actions">
                  <button className="btn-chat-booking" onClick={() => {
                    setActiveTab('Messages');
                    setActiveChatUser(bkProvider);
                  }}>
                    <Icon name="chat" /> Chat
                  </button>
                  {bk.status !== 'COMPLETED' && bk.status !== 'CANCELLED' && (
                    <>
                      <button className="btn-cancel-booking" onClick={async () => {
                        if (confirm("Cancel this booking?")) {
                          try {
                            await api.patch(`/bookings/${bk._id}/status`, { status: 'CANCELLED' });
                            setClientBookings(clientBookings.map(b => b._id === bk._id ? {...b, status: 'CANCELLED'} : b));
                          } catch (err: any) {
                            alert("Failed to cancel: " + err.response?.data?.message);
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
        />
      )}
    </div>
  );
}
