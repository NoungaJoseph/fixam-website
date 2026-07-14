import './Settings.css';
import React, { useState } from 'react';
import SavedProviders from './SavedProviders';
import Stats from './Stats';

interface SettingsProps {
  savedProsState: any[];
  setSavedProsState: (pros: any[]) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function Settings({ savedProsState, setSavedProsState, setActiveTab, setActiveChatUser }: SettingsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'saved' | 'stats'>('profile');

  return (
    <div className="settings-tab-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Subtabs Header */}
      <div className="dash-subtabs-header">
        <button 
          className={`subtab-btn ${activeSubTab === 'profile' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('profile')}
        >
          Account Settings
        </button>
        <button 
          className={`subtab-btn ${activeSubTab === 'saved' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('saved')}
        >
          Saved Providers
        </button>
        <button 
          className={`subtab-btn ${activeSubTab === 'stats' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('stats')}
        >
          My Stats
        </button>
      </div>

      {activeSubTab === 'profile' && (
        <div className="dash-panel-premium settings-panel-premium">
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
      )}

      {activeSubTab === 'saved' && (
        <SavedProviders 
          savedProsState={savedProsState} 
          setSavedProsState={setSavedProsState} 
          setActiveTab={setActiveTab} 
          setActiveChatUser={setActiveChatUser} 
        />
      )}

      {activeSubTab === 'stats' && (
        <Stats />
      )}
    </div>
  );
}
