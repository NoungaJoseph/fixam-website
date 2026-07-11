import './Referrals.css';
export default function Referrals() {
  return (
    <div className="referrals-grid-layout animate-fade-in">
      <div className="dash-panel-premium invite-friends-panel">
        <h2>Invite Friends, Earn Coins!</h2>
        <p>Give your friends 1 coin to try Fixam, and you will receive 1 coin when they complete their first booking.</p>
        <div className="referral-link-box">
          <input type="text" readOnly value="https://fixam.com/invite/nounga_joseph_77" />
          <button type="button" onClick={() => {
            navigator.clipboard.writeText("https://fixam.com/invite/nounga_joseph_77");
            alert("Referral link copied to clipboard!");
          }}>Copy</button>
        </div>
        <div className="referral-stats-grid">
          <div className="ref-stat-card">
            <span>Total Invites</span>
            <strong>5</strong>
          </div>
          <div className="ref-stat-card">
            <span>Active Referrals</span>
            <strong>3</strong>
          </div>
          <div className="ref-stat-card">
            <span>Coins Earned</span>
            <strong>3</strong>
          </div>
        </div>
      </div>

      <div className="dash-panel-premium referrals-list-panel">
        <h2>Referred Friends</h2>
        <div className="referred-friends-list">
          <div className="referred-friend-row">
            <div>
              <h4>Roman S.</h4>
              <span>Joined May 19, 2026</span>
            </div>
            <span className="ref-status completed">Coins Earned</span>
          </div>
          <div className="referred-friend-row">
            <div>
              <h4>Carine M.</h4>
              <span>Joined May 15, 2026</span>
            </div>
            <span className="ref-status completed">Coins Earned</span>
          </div>
          <div className="referred-friend-row">
            <div>
              <h4>David N.</h4>
              <span>Joined May 10, 2026</span>
            </div>
            <span className="ref-status pending">Booking Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
