import './Settings.css';
import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileOverlay, setMobileOverlay] = useState<'profile' | 'saved' | 'stats' | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile overlay is active
  useEffect(() => {
    if (mobileOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOverlay]);

  const menuItems = [
    { id: 'profile' as const, title: 'Account Settings', desc: 'Update your personal details, address, and notification preferences.', icon: '🔧' },
    { id: 'saved' as const, title: 'Saved Providers', desc: 'View and manage your bookmarked professionals.', icon: '⭐' },
    { id: 'stats' as const, title: 'My Stats', desc: 'Monitor your booking and task statistics.', icon: '📊' }
  ];

  if (isMobile) {
    return (
      <div className="settings-mobile-container animate-fade-in" style={{ width: '100%' }}>
        <h2>Profile Settings</h2>
        
        {/* Menu Cards */}
        <div className="settings-mobile-menu-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className="settings-menu-card-premium" 
              onClick={() => setMobileOverlay(item.id)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: 'var(--shadow)',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)' }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.3' }}>{item.desc}</p>
              </div>
              <span style={{ fontSize: '1.2rem', color: 'var(--teal)', fontWeight: 'bold' }}>&rarr;</span>
            </div>
          ))}
        </div>

        {/* Full screen overlay */}
        {mobileOverlay && (
          <div 
            className="mobile-fullscreen-overlay animate-fade-in"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'var(--surface)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                borderBottom: '1px solid var(--line)',
                paddingBottom: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <button 
                onClick={() => setMobileOverlay(null)}
                style={{
                  background: 'var(--soft)',
                  border: 'none',
                  color: 'var(--ink)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                &larr; Back
              </button>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>
                {menuItems.find(i => i.id === mobileOverlay)?.title}
              </h3>
              <div style={{ width: '60px' }}></div> {/* Spacer to center title */}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              {mobileOverlay === 'profile' && (
                <div className="dash-panel-premium settings-panel-premium">
                  <h2>Client Settings</h2>
                  <form className="settings-form-premium" onSubmit={(e) => { e.preventDefault(); alert('Settings saved successfully!'); setMobileOverlay(null); }}>
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
                      <input type="text" defaultValue="Your Area" />
                    </label>
                    
                    <div className="settings-checkbox-row">
                      <input type="checkbox" id="email-notifs" defaultChecked />
                      <label htmlFor="email-notifs">Receive email notifications for booking updates</label>
                    </div>
                    <div className="settings-checkbox-row">
                      <input type="checkbox" id="sms-notifs" defaultChecked />
                      <label htmlFor="sms-notifs">Receive SMS text notifications for urgent offers</label>
                    </div>

                    <button type="submit" className="btn-settings-submit" style={{ width: '100%', marginTop: '1rem' }}>Save Preferences</button>
                  </form>
                </div>
              )}

              {mobileOverlay === 'saved' && (
                <SavedProviders 
                  savedProsState={savedProsState} 
                  setSavedProsState={setSavedProsState} 
                  setActiveTab={setActiveTab} 
                  setActiveChatUser={setActiveChatUser} 
                />
              )}

              {mobileOverlay === 'stats' && (
                <Stats />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop view (standard tabs)
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
              <input type="text" defaultValue="London, UK" />
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
