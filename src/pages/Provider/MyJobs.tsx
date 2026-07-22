import { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface MyJobsProps {
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function MyJobs({ setActiveTab, setActiveChatUser }: MyJobsProps) {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get('/jobs/my-jobs');
        setJobs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch my jobs", err);
      }
    };
    fetchMyJobs();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/jobs/${id}/status`, { status });
      setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
      alert(`Job marked as ${status} successfully!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update job status');
    }
  };

  return (
    <div className="dash-panel-premium full-width-panel animate-fade-in">
      <div className="dash-panel-header-new">
        <h2>My Jobs & Contracts</h2>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
          Total active: {jobs.filter(j => j.status !== 'COMPLETED' && j.status !== 'CANCELLED').length}
        </div>
      </div>
      <div className="bookings-detailed-list">
        {jobs.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)' }}>No jobs found.</p>}
        {jobs.map((job) => {
          const clientName = job.client?.fullName || 'Client';
          const initials = clientName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
          const isCompleted = job.status === 'COMPLETED';
          const isInProgress = job.status === 'IN_PROGRESS' || job.status === 'ASSIGNED';
          return (
          <div className="booking-detailed-card" key={job.id}>
            <div className="booking-card-left">
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E0F2FE', color: '#0369A1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px'
              }}>
                {initials}
              </div>
              <div className="booking-info-details" style={{ marginLeft: '16px' }}>
                <h3>{job.title}</h3>
                <p className="provider-name">Client: <strong>{clientName}</strong></p>
                <p className="price-lbl-detail">Payout: <span style={{ color: '#14B8A6', fontWeight: 600 }}>{job.budget ? `${job.budget.toLocaleString()} XAF` : 'Negotiable'}</span></p>
              </div>
            </div>
            <div className="booking-card-mid">
              <div className="schedule-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#4B5563' }}>
                <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              <span className={`booking-status-badge ${job.status.toLowerCase().replace(/\s+/g, '-')}`} style={{
                padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                backgroundColor: isCompleted ? '#DEF7EC' : isInProgress ? '#E1EFFE' : '#FEF08A',
                color: isCompleted ? '#03543F' : isInProgress ? '#1E429F' : '#713F12'
              }}>
                {job.status.replace('_', ' ')}
              </span>
            </div>
            <div className="booking-card-actions" style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-chat-booking" onClick={() => {
                setActiveTab('Messages');
                setActiveChatUser(clientName);
              }} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                💬 Chat
              </button>
              {isInProgress && (
                <button
                  onClick={() => handleUpdateStatus(job.id, 'COMPLETED')}
                  style={{
                    backgroundColor: '#14B8A6', color: 'white', border: 'none', borderRadius: '6px',
                    padding: '8px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px'
                  }}
                >
                  ✓ Complete
                </button>
              )}
              {!isCompleted && job.status !== 'CANCELLED' && (
                <button
                  onClick={() => {
                    if(confirm('Are you sure you want to cancel this job?')) {
                      handleUpdateStatus(job.id, 'CANCELLED');
                    }
                  }}
                  style={{
                    backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #FCA5A5',
                    borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
