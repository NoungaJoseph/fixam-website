import { useState } from 'react';

export default function JobLeads() {
  const [filterTag, setFilterTag] = useState('All');
  const [leads, setLeads] = useState([
    { id: 1, title: 'Need emergency plumber to fix toilet leakage', tag: 'Plumbing', price: '15,000 XAF', location: 'Douala, Bonapriso', distance: '1.2 km away' },
    { id: 2, title: 'Installing new LED light tracks in boutique', tag: 'Electrical', price: '25,000 XAF', location: 'Douala, Akwa', distance: '3.1 km away' },
    { id: 3, title: 'Home deep cleaning before moving in', tag: 'Cleaning', price: '20,000 XAF', location: 'Yaoundé, Bastos', distance: '4.5 km away' },
    { id: 4, title: 'AC unit making loud noise and not cooling', tag: 'Repairs', price: '30,000 XAF', location: 'Yaoundé, Tsinga', distance: '5.2 km away' }
  ]);

  const handleSendProposal = (title: string) => {
    alert(`Proposal submitted successfully for task: "${title}"`);
  };

  const filtered = filterTag === 'All' ? leads : leads.filter(l => l.tag === filterTag);

  return (
    <div className="dash-panel-premium full-width-panel animate-fade-in">
      <div className="dash-panel-header-new">
        <h2>Job Leads Near You</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['All', 'Plumbing', 'Electrical', 'Cleaning', 'Repairs'].map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              style={{
                backgroundColor: filterTag === tag ? '#14B8A6' : '#F3F4F6',
                color: filterTag === tag ? '#FFFFFF' : '#4B5563',
                border: 'none', borderRadius: '20px', padding: '6px 14px',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 200ms ease'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="bookings-detailed-list" style={{ marginTop: '20px' }}>
        {filtered.map((lead) => (
          <div className="booking-detailed-card" key={lead.id}>
            <div className="booking-card-left">
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
              }}>
                💼
              </div>
              <div className="booking-info-details" style={{ marginLeft: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#14B8A6', textTransform: 'uppercase' }}>{lead.tag}</span>
                <h3 style={{ margin: '2px 0 6px 0' }}>{lead.title}</h3>
                <p className="provider-name" style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>
                  📍 {lead.location} • <span>{lead.distance}</span>
                </p>
              </div>
            </div>
            <div className="booking-card-mid">
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#6B7280', display: 'block' }}>Estimated Budget</span>
                <strong style={{ fontSize: '16px', color: '#1F2937' }}>{lead.price}</strong>
              </div>
            </div>
            <div className="booking-card-actions">
              <button
                className="btn-auth-primary"
                onClick={() => handleSendProposal(lead.title)}
                style={{
                  height: '40px', padding: '0 16px', fontSize: '13px', fontWeight: 600,
                  backgroundColor: '#14B8A6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
                }}
              >
                Send Proposal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
