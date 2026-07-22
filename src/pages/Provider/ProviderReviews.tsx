import { useState, useEffect } from 'react';
import './ProviderDashboard.css';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ProviderReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ average: 0, breakdown: [0,0,0,0,0] });

  useEffect(() => {
    if (user?.id) {
      api.get(`/reviews/users/${user.id}`).then(res => {
        const data = res.data.reviews || [];
        setReviews(data);
        if (data.length > 0) {
          const sum = data.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
          const breakdown = [0,0,0,0,0];
          data.forEach((r: any) => {
            const star = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
            breakdown[star - 1]++;
          });
          setStats({ average: sum / data.length, breakdown });
        }
      }).catch(err => {
        console.error("Failed to fetch reviews", err);
      });
    }
  }, [user]);

  const totalReviews = reviews.length || 1; // avoid division by zero

  return (
    <div className="dash-panel-premium provider-reviews-grid animate-fade-in">
      {/* LEFT: Ratings stats */}
      <div style={{ borderRight: '1px solid #E5E7EB', paddingRight: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>My Rating Overview</h3>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
          <strong style={{ fontSize: '48px', color: '#1F2937', fontWeight: 800 }}>{stats.average.toFixed(1)}</strong>
          <span style={{ fontSize: '16px', color: '#6B7280' }}>/ 5.0</span>
        </div>

        {/* Rating Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[5, 4, 3, 2, 1].map(stars => {
            const count = stats.breakdown[stars - 1] || 0;
            const pct = Math.round((count / totalReviews) * 100);
            return (
            <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
              <span style={{ width: '40px', color: '#4B5563', fontWeight: 500 }}>{stars} Stars</span>
              <div style={{ flex: 1, height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#14B8A6' }}></div>
              </div>
              <span style={{ width: '30px', color: '#6B7280', textAlign: 'right' }}>{pct}%</span>
            </div>
          )})}
        </div>
      </div>

      {/* RIGHT: List of reviews */}
      <div>
        <div className="dash-panel-header-new">
          <h2>Client Feedback</h2>
        </div>

        <div className="bookings-detailed-list" style={{ marginTop: '20px' }}>
          {reviews.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)' }}>No reviews yet.</p>}
          {reviews.map(r => {
            const reviewerName = r.reviewer ? `${r.reviewer.firstName || ''} ${r.reviewer.lastName || ''}`.trim() : 'Anonymous';
            const rating = r.rating || 5;
            return (
            <div key={r.id || r._id} style={{ padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '15px', color: '#1F2937' }}>{reviewerName}</strong>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '2px', color: '#F59E0B', marginBottom: '8px' }}>
                {"★".repeat(rating)}{"☆".repeat(5 - rating)}
              </div>
              <p style={{ fontSize: '14px', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                "{r.comment || 'No comment provided.'}"
              </p>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
