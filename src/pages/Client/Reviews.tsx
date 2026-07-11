import './Reviews.css';
import { Icon } from '../../App';

export default function Reviews() {
  return (
    <div className="dash-panel-premium reviews-panel-premium animate-fade-in">
      <h2>My Service Reviews</h2>
      <div className="reviews-list-premium">
        <div className="review-item-premium">
          <div className="review-header">
            <div>
              <h4>Jeff Thomson</h4>
              <span>Plumbing Service</span>
            </div>
            <div className="review-stars-premium">
              <Icon name="star" />
              <Icon name="star" />
              <Icon name="star" />
              <Icon name="star" />
              <Icon name="star" />
              <strong>5.0</strong>
            </div>
          </div>
          <p className="review-comment">"Excellent work! Jeff was very professional and fixed the leak in my kitchen pipe quickly. Highly recommended!"</p>
          <span className="review-date">May 10, 2026</span>
        </div>

        <div className="review-item-premium">
          <div className="review-header">
            <div>
              <h4>Mary Clean</h4>
              <span>Cleaning Expert</span>
            </div>
            <div className="review-stars-premium">
              <Icon name="star" />
              <Icon name="star" />
              <Icon name="star" />
              <Icon name="star" />
              <Icon name="star" />
              <strong>4.8</strong>
            </div>
          </div>
          <p className="review-comment">"Mary and her team did a fantastic job deep cleaning my house. It was spotless. Only small issue was they arrived 10 mins late, but overall great."</p>
          <span className="review-date">April 28, 2026</span>
        </div>
      </div>
    </div>
  );
}
