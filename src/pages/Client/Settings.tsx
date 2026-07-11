import './Settings.css';
export default function Settings() {
  return (
    <div className="dash-panel-premium settings-panel-premium animate-fade-in">
      <h2>Client Settings</h2>
      <form className="settings-form-premium" onSubmit={(e) => { e.preventDefault(); alert('Settings saved successfully!'); }}>
        <div className="form-grid-2">
          <label>
            <span>Full Name</span>
            <input type="text" defaultValue="Nounga Joseph" />
          </label>
          <label>
            <span>Email Address</span>
            <input type="email" defaultValue="joseph.nounga@gmail.com" />
          </label>
        </div>
        <div className="form-grid-2">
          <label>
            <span>Phone Number</span>
            <input type="text" defaultValue="+237 677 88 99 00" />
          </label>
          <label>
            <span>Language preference</span>
            <select defaultValue="English">
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
          </label>
        </div>
        <label>
          <span>Address / Location Area</span>
          <input type="text" defaultValue="Douala, Cameroon" />
        </label>
        
        <div className="settings-checkbox-row">
          <input type="checkbox" id="email-notifs" defaultChecked />
          <label htmlFor="email-notifs">Receive email notifications for booking updates</label>
        </div>
        <div className="settings-checkbox-row">
          <input type="checkbox" id="sms-notifs" defaultChecked />
          <label htmlFor="sms-notifs">Receive SMS text notifications for urgent offers</label>
        </div>

        <button type="submit" className="btn-settings-submit">Save Preferences</button>
      </form>
    </div>
  );
}
