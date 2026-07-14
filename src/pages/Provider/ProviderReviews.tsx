import { useState } from 'react';
import './ProviderDashboard.css';

export default function ProviderReviews() {
  const [reviews] = useState([
    { id: 1, author: 'Nounga Joseph', stars: 5, date: 'May 2026', comment: 'Excellent pipe burst replacement. Punctual and professional!' },
    { id: 2, author: 'Marie Ngo', stars: 5, date: 'May 2026', comment: 'Did a clean wiring installation. Price was very fair.' },
    { id: 3, author: 'Alain Kamga', stars: 4, date: 'April 2026', comment: 'Fixed the generator issues. Solid work, would hire again.' }
  ]);

  return (
    <div className="dash-panel-premium provider-reviews-grid animate-fade-in">
      {/* LEFT: Ratings stats */}
      <div style={{ borderRight: '1px solid #E5E7EB', paddingRight: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>My Rating Overview</h3>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
          <strong style={{ fontSize: '48px', color: '#1F2937', fontWeight: 800 }}>4.9</strong>
          <span style={{ fontSize: '16px', color: '#6B7280' }}>/ 5.0</span>
        </div>

        {/* Rating Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { stars: 5, pct: '92%' },
            { stars: 4, pct: '8%' },
            { stars: 3, pct: '0%' },
            { stars: 2, pct: '0%' },
            { stars: 1, pct: '0%' }
          ].map(r => (
            <div key={r.stars} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
              <span style={{ width: '40px', color: '#4B5563', fontWeight: 500 }}>{r.stars} Stars</span>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: r.pct, height: '100%', backgroundColor: '#14B8A6' }}></div>
              </div>
              <span style={{ width: '30px', color: '#6B7280', textAlign: 'right' }}>{r.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: List of reviews */}
      <div>
        <div className="dash-panel-header-new">
          <h2>Client Feedback</h2>
        </div>

        <div className="bookings-detailed-list" style={{ marginTop: '20px' }}>
          {reviews.map(r => (
            <div key={r.id} style={{ padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '15px', color: '#1F2937' }}>{r.author}</strong>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{r.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '2px', color: '#F59E0B', marginBottom: '8px' }}>
                {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
              </div>
              <p style={{ fontSize: '14px', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                "{r.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
