import './MyProfile.css';
import { useState } from 'react';
import { Icon, images } from '../../App';

interface MyProfileProps {
  setActiveTab: (tab: string) => void;
}

export default function MyProfile({ setActiveTab }: MyProfileProps) {
  const [profileActiveSubTab, setProfileActiveSubTab] = useState('Overview');

  return (
    <div className="profile-tab-container animate-fade-in">
      <div className="profile-header-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar-big">
            <img src={images.proJeff} alt="Nounga" />
            <button className="btn-change-avatar" aria-label="Change Avatar" onClick={() => alert('Change avatar flow coming soon!')}>
              <Icon name="user" />
            </button>
          </div>
          <div className="profile-user-headline">
            <div className="profile-name-row">
              <h2>Nounga</h2>
              <span className="badge-verified"><Icon name="shield" /> Verified</span>
            </div>
            <p className="profile-email-lbl"><Icon name="message" /> nounga@gmail.com</p>
            <p className="profile-phone-lbl"><Icon name="bell" /> +237 6 98 76 54 32</p>
            <p className="profile-loc-lbl"><Icon name="location" /> Douala, Cameroon</p>
            <span className="profile-role-tag">Client Account</span>
          </div>
        </div>
        
        <div className="profile-header-stats-row">
          <div className="profile-header-stat-box">
            <span className="stat-lbl">Member Since</span>
            <strong className="stat-val"><Icon name="calendar" /> May 15, 2024</strong>
          </div>
          <div className="profile-header-stat-box">
            <span className="stat-lbl">Account Status</span>
            <strong className="stat-val status-active"><span className="dot-indicator"></span> Active</strong>
          </div>
          <div className="profile-header-stat-box">
            <span className="stat-lbl">Account Security</span>
            <strong className="stat-val security-strong"><Icon name="shield" /> Strong</strong>
          </div>
        </div>

        <button className="btn-edit-profile-header" onClick={() => alert('Edit Profile modal coming soon!')}>
          <Icon name="wrench" /> Edit Profile
        </button>
      </div>

      <div className="profile-sub-tabs">
        {['Overview', 'Bookings', 'Reviews', 'Payments', 'Saved Providers', 'Preferences', 'Settings'].map((subTab) => (
          <button 
            key={subTab} 
            className={`profile-sub-tab-btn ${profileActiveSubTab === subTab ? 'active' : ''}`}
            onClick={() => setProfileActiveSubTab(subTab)}
          >
            {subTab}
          </button>
        ))}
      </div>

      {profileActiveSubTab === 'Overview' && (
        <div className="profile-overview-layout">
          <div className="profile-overview-left">
            <div className="dash-panel-premium p-about-panel">
              <h3>About Me</h3>
              <p>I'm a business owner based in Douala. I use Fixam to find reliable and verified professionals for all my home and office needs. Quality service and trust are my top priorities.</p>
            </div>

            <div className="dash-panel-premium p-info-panel">
              <h3>Personal Information</h3>
              <div className="info-list-grid">
                <div className="info-list-row">
                  <span className="info-lbl"><Icon name="user" /> Full Name</span>
                  <strong className="info-val">Nounga</strong>
                </div>
                <div className="info-list-row">
                  <span className="info-lbl"><Icon name="message" /> Email Address</span>
                  <strong className="info-val">nounga@gmail.com <span className="verified-text"><Icon name="check" /> Verified</span></strong>
                </div>
                <div className="info-list-row">
                  <span className="info-lbl"><Icon name="bell" /> Phone Number</span>
                  <strong className="info-val">+237 6 98 76 54 32 <span className="verified-text"><Icon name="check" /> Verified</span></strong>
                </div>
                <div className="info-list-row">
                  <span className="info-lbl"><Icon name="location" /> Location</span>
                  <strong className="info-val">Douala, Littoral, Cameroon</strong>
                </div>
                <div className="info-list-row">
                  <span className="info-lbl"><Icon name="wrench" /> Language</span>
                  <strong className="info-val">English, Français</strong>
                </div>
                <div className="info-list-row">
                  <span className="info-lbl"><Icon name="calendar" /> Timezone</span>
                  <strong className="info-val">GMT+1 (West Africa Time)</strong>
                </div>
              </div>
            </div>

            <div className="dash-panel-premium p-activity-panel">
              <div className="panel-title-row">
                <h3>Recent Activity</h3>
                <button className="link-view-all" onClick={() => setActiveTab('Notifications')}>View All</button>
              </div>
              <div className="activity-items-list-p">
                <div className="activity-item-row-p">
                  <div className="activity-icon-p a-confirmed"><Icon name="calendar" /></div>
                  <div className="activity-details-p">
                    <h4>You booked Plumber Pro</h4>
                    <span>Booking confirmed</span>
                  </div>
                  <span className="activity-time-p">2 min ago</span>
                </div>

                <div className="activity-item-row-p">
                  <div className="activity-icon-p a-accepted"><Icon name="check" /></div>
                  <div className="activity-details-p">
                    <h4>John Doe accepted your request</h4>
                    <span>Electrical Installation</span>
                  </div>
                  <span className="activity-time-p">15 min ago</span>
                </div>

                <div className="activity-item-row-p">
                  <div className="activity-icon-p a-payment"><Icon name="wallet" /></div>
                  <div className="activity-details-p">
                    <h4>Payment with coins completed</h4>
                    <span>3 coins used</span>
                  </div>
                  <span className="activity-time-p">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-overview-right">
            <div className="dash-panel-premium p-summary-panel">
              <h3>Account Summary</h3>
              <div className="summary-widgets-grid">
                <div className="summary-widget-box s-bookings">
                  <div className="widget-icon"><Icon name="calendar" /></div>
                  <div className="widget-content">
                    <strong>12</strong>
                    <span>Total Bookings</span>
                  </div>
                </div>
                <div className="summary-widget-box s-active">
                  <div className="widget-icon"><Icon name="briefcase" /></div>
                  <div className="widget-content">
                    <strong>4</strong>
                    <span>Active Bookings</span>
                  </div>
                </div>
                <div className="summary-widget-box s-completed">
                  <div className="widget-icon"><Icon name="check" /></div>
                  <div className="widget-content">
                    <strong>8</strong>
                    <span>Completed Jobs</span>
                  </div>
                </div>
                <div className="summary-widget-box s-rating">
                  <div className="widget-icon"><Icon name="star" /></div>
                  <div className="widget-content">
                    <strong>4.8</strong>
                    <span>Average Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {profileActiveSubTab !== 'Overview' && (
        <div className="dash-panel-premium" style={{marginTop: '2rem'}}>
          <h3>{profileActiveSubTab}</h3>
          <p>Content for {profileActiveSubTab} will be displayed here.</p>
        </div>
      )}
    </div>
  );
}
