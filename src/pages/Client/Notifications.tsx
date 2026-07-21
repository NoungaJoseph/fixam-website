import './Notifications.css';
import { Icon } from '../../App';

export default function Notifications() {
  return (
    <div className="bg-transparent border-0 p-0 w-full animate-fade-in">
      <div className="dash-panel-header-new">
        <h2>Notifications Log</h2>
        <button className="panel-link" onClick={() => alert('All notifications marked as read')}>Mark all as read</button>
      </div>
      <div className="activity-items-list large-list">
        <div className="activity-item-row a-confirmed">
          <div className="activity-icon-container"><Icon name="calendar" /></div>
          <div className="activity-details">
            <h4 className="activity-title">You booked Plumber Pro</h4>
            <p className="activity-subtitle">Booking confirmed for tomorrow at 9:00 AM</p>
          </div>
          <span className="activity-time">2 min ago</span>
        </div>

        <div className="activity-item-row a-accepted">
          <div className="activity-icon-container"><Icon name="check" /></div>
          <div className="activity-details">
            <h4 className="activity-title">John Doe accepted your request</h4>
            <p className="activity-subtitle">Electrical Installation proposal accepted</p>
          </div>
          <span className="activity-time">15 min ago</span>
        </div>

        <div className="activity-item-row a-payment">
          <div className="activity-icon-container"><Icon name="wallet" /></div>
          <div className="activity-details">
            <h4 className="activity-title">Payment with coins completed</h4>
            <p className="activity-subtitle">3 coins successfully deducted for Plumbing booking</p>
          </div>
          <span className="activity-time">1 hour ago</span>
        </div>

        <div className="activity-item-row a-message">
          <div className="activity-icon-container"><Icon name="chat" /></div>
          <div className="activity-details">
            <h4 className="activity-title">New message from CleanMaster</h4>
            <p className="activity-subtitle">"Hey Nounga, let know if we need extra cleaning agents..."</p>
          </div>
          <span className="activity-time">2 hours ago</span>
        </div>

        <div className="activity-item-row a-referral">
          <div className="activity-icon-container"><Icon name="star" /></div>
          <div className="activity-details">
            <h4 className="activity-title">You earned 1 coin from referral</h4>
            <p className="activity-subtitle">Your friend Roman joined Fixam</p>
          </div>
          <span className="activity-time">1 day ago</span>
        </div>
      </div>
    </div>
  );
}
