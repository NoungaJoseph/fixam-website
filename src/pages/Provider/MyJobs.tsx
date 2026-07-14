import { useState } from 'react';

interface MyJobsProps {
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function MyJobs({ setActiveTab, setActiveChatUser }: MyJobsProps) {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Kitchen pipe burst replacement', client: 'Nounga Joseph', date: 'May 21', time: '9:00 AM', status: 'In Progress', price: '25,000 XAF' },
    { id: 2, title: 'Installing modern ceiling fans', client: 'Marie Ngo', date: 'May 22', time: '2:30 PM', status: 'Pending Offer', price: '15,000 XAF' },
    { id: 3, title: 'Full apartment deep cleaning', client: 'Alain Kamga', date: 'May 18', time: '11:00 AM', status: 'Completed', price: '20,000 XAF' }
  ]);

  const handleComplete = (id: number) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Completed' } : j));
    alert('Job marked as completed successfully!');
  };

  const handleCancel = (id: number) => {
    if (confirm('Are you sure you want to cancel this job?')) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  return (
    <div className="dash-panel-premium full-width-panel animate-fade-in">
      <div className="dash-panel-header-new">
        <h2>My Jobs & Contracts</h2>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
          Total active: {jobs.filter(j => j.status !== 'Completed').length}
        </div>
      </div>
      <div className="bookings-detailed-list">
        {jobs.map((job) => (
          <div className="booking-detailed-card" key={job.id}>
            <div className="booking-card-left">
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E0F2FE', color: '#0369A1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px'
              }}>
                {job.client.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="booking-info-details" style={{ marginLeft: '16px' }}>
                <h3>{job.title}</h3>
                <p className="provider-name">Client: <strong>{job.client}</strong></p>
                <p className="price-lbl-detail">Payout: <span style={{ color: '#14B8A6', fontWeight: 600 }}>{job.price}</span></p>
              </div>
            </div>
            <div className="booking-card-mid">
              <div className="schedule-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#4B5563' }}>
                <span>📅 {job.date} • {job.time}</span>
              </div>
              <span className={`booking-status-badge ${job.status.toLowerCase().replace(/\s+/g, '-')}`} style={{
                padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                backgroundColor: job.status === 'Completed' ? '#DEF7EC' : job.status === 'In Progress' ? '#E1EFFE' : '#FEF08A',
                color: job.status === 'Completed' ? '#03543F' : job.status === 'In Progress' ? '#1E429F' : '#713F12'
              }}>
                {job.status}
              </span>
            </div>
            <div className="booking-card-actions" style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-chat-booking" onClick={() => {
                setActiveTab('Messages');
                setActiveChatUser(job.client);
              }} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                💬 Chat
              </button>
              {job.status === 'In Progress' && (
                <button
                  onClick={() => handleComplete(job.id)}
                  style={{
                    backgroundColor: '#14B8A6', color: 'white', border: 'none', borderRadius: '6px',
                    padding: '8px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px'
                  }}
                >
                  ✓ Complete
                </button>
              )}
              {job.status !== 'Completed' && (
                <button
                  onClick={() => handleCancel(job.id)}
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
        ))}
      </div>
    </div>
  );
}
