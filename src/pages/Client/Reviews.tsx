import './Reviews.css';
import { useState, useEffect } from 'react';
import { Icon } from '../../App';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      api.get(`/reviews/users/${user.id}`).then(res => {
        setReviews(res.data.reviews || []);
      }).catch(err => {
        console.error("Failed to fetch reviews", err);
      });
    }
  }, [user]);
  return (
    <div className="dash-panel-premium reviews-panel-premium animate-fade-in">
      <h2>My Service Reviews</h2>
      <div className="reviews-list-premium">
        {reviews.length > 0 ? reviews.map(rev => {
          const revId = rev.id || rev._id;
          const reviewerName = rev.reviewer ? `${rev.reviewer.firstName || ''} ${rev.reviewer.lastName || ''}`.trim() : 'Anonymous';
          const role = rev.reviewer?.role === 'PROVIDER' ? 'Provider' : 'Client';
          const rating = rev.rating || 5;
          const stars = Array(rating).fill(0);
          
          return (
          <div className="review-item-premium" key={revId}>
            <div className="review-header">
              <div>
                <h4>{reviewerName}</h4>
                <span>{role}</span>
              </div>
              <div className="review-stars-premium">
                {stars.map((_, i) => <Icon key={i} name="star" />)}
                <strong>{rating}.0</strong>
              </div>
            </div>
            <p className="review-comment">"{rev.comment || 'No comment provided.'}"</p>
            <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
          </div>
        )}) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
