import './Settings.css';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface SettingsProps {
  savedProsState?: any[];
  setSavedProsState?: (pros: any[]) => void;
  setActiveTab?: (tab: string) => void;
  setActiveChatUser?: (user: string) => void;
}

export default function Settings({ setActiveTab }: SettingsProps) {
  const { user, refreshUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'notifications' | 'privacy' | 'language'>('notifications');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileOverlay, setMobileOverlay] = useState<'notifications' | 'privacy' | 'language' | null>(null);

  // States for Notifications
  const [notifyNews, setNotifyNews] = useState(true);
  const [notifySecurity, setNotifySecurity] = useState(true);
  const [notifyNewsletter, setNotifyNewsletter] = useState(false);
  const [notifyPromotions, setNotifyPromotions] = useState(false);

  // States for Privacy
  const [shareAnalytics, setShareAnalytics] = useState(false);
  const [personalizeRecommendation, setPersonalizeRecommendation] = useState(true);

  // States for Language
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');

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
    { id: 'notifications' as const, title: 'Notification Settings', desc: 'Manage updates, news, newsletters, and promotional alerts.', icon: '🔔' },
    { id: 'privacy' as const, title: 'Privacy and Security Settings', desc: 'Change password, manage 2FA, data usage and analytics sharing.', icon: '🔒' },
    { id: 'language' as const, title: 'Language', desc: 'Switch your preferred platform language.', icon: '🌐' }
  ];

  const handleSaveSettings = async () => {
    try {
      // Mock API call to update settings
      await api.put('/users/settings', {
        notifications: { notifyNews, notifySecurity, notifyNewsletter, notifyPromotions },
        privacy: { shareAnalytics, personalizeRecommendation },
        language
      });
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  const handleDownloadData = () => {
    alert("Downloading your personal data... (mock)");
  };

  const handleClearCache = () => {
    alert("Cache cleared successfully!");
  };

  const renderContent = (tabId: string) => {
    switch (tabId) {
      case 'notifications':
        return (
          <div className="settings-section animate-fade-in">
            <h3 style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.8rem', marginBottom: '1.5rem', color: 'var(--ink)' }}>Notification Settings</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.3rem', fontSize: '1rem' }}>Fixam News</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Get updates on platform changes.</p>
                </div>
                <input type="checkbox" checked={notifyNews} onChange={e => setNotifyNews(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.3rem', fontSize: '1rem' }}>Security Updates</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Important security alerts and login attempts.</p>
                </div>
                <input type="checkbox" checked={notifySecurity} onChange={e => setNotifySecurity(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.3rem', fontSize: '1rem' }}>Newsletter</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Receive our monthly newsletter.</p>
                </div>
                <input type="checkbox" checked={notifyNewsletter} onChange={e => setNotifyNewsletter(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.3rem', fontSize: '1rem' }}>Promotions</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Special offers and discounts.</p>
                </div>
                <input type="checkbox" checked={notifyPromotions} onChange={e => setNotifyPromotions(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
              </div>
            </div>

            <button onClick={handleSaveSettings} style={{ marginTop: '2rem', padding: '0.8rem 1.5rem', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Save Notification Preferences
            </button>
          </div>
        );
      case 'privacy':
        return (
          <div className="settings-section animate-fade-in">
            <h3 style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.8rem', marginBottom: '1.5rem', color: 'var(--ink)' }}>Privacy & Security</h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: 'var(--ink)' }}>Account Security</h4>
              <button style={{ padding: '0.6rem 1rem', border: '1px solid var(--line)', background: 'transparent', borderRadius: '6px', cursor: 'pointer', marginRight: '1rem' }}>Change Password</button>
              <button style={{ padding: '0.6rem 1rem', border: '1px solid var(--teal)', background: '#F0FDFA', color: 'var(--teal)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Enable 2FA</button>
            </div>

            <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: 'var(--ink)' }}>Data Usage</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.3rem', fontSize: '1rem' }}>Share Analytics</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Help us improve Fixam by sharing anonymous usage data.</p>
                </div>
                <input type="checkbox" checked={shareAnalytics} onChange={e => setShareAnalytics(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.3rem', fontSize: '1rem' }}>Personalize Recommendations</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Use my data to recommend better services.</p>
                </div>
                <input type="checkbox" checked={personalizeRecommendation} onChange={e => setPersonalizeRecommendation(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={handleDownloadData} style={{ padding: '0.6rem 1rem', border: '1px solid var(--line)', background: 'transparent', borderRadius: '6px', cursor: 'pointer' }}>Download Personal Data</button>
              <button onClick={handleClearCache} style={{ padding: '0.6rem 1rem', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#B91C1C', borderRadius: '6px', cursor: 'pointer' }}>Clear Cache</button>
              <button onClick={handleSaveSettings} style={{ padding: '0.6rem 1.5rem', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginLeft: 'auto' }}>
                Save Preferences
              </button>
            </div>
          </div>
        );
      case 'language':
        return (
          <div className="settings-section animate-fade-in">
            <h3 style={{ borderBottom: '1px solid var(--line)', paddingBottom: '0.8rem', marginBottom: '1.5rem', color: 'var(--ink)' }}>Language</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>Select your preferred language for the Fixam platform.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', padding: '1rem', border: `1px solid ${language === 'EN' ? 'var(--teal)' : 'var(--line)'}`, borderRadius: '8px', background: language === 'EN' ? '#F0FDFA' : 'transparent' }}>
                <input type="radio" name="language" value="EN" checked={language === 'EN'} onChange={() => setLanguage('EN')} style={{ transform: 'scale(1.2)' }} />
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>English</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', padding: '1rem', border: `1px solid ${language === 'FR' ? 'var(--teal)' : 'var(--line)'}`, borderRadius: '8px', background: language === 'FR' ? '#F0FDFA' : 'transparent' }}>
                <input type="radio" name="language" value="FR" checked={language === 'FR'} onChange={() => setLanguage('FR')} style={{ transform: 'scale(1.2)' }} />
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>Français (French)</span>
              </label>
            </div>

            <button onClick={handleSaveSettings} style={{ marginTop: '2rem', padding: '0.8rem 1.5rem', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Apply Language
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (isMobile) {
    return (
      <div className="settings-mobile-container animate-fade-in" style={{ width: '100%' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Settings</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '2rem', lineHeight: '1.4' }}>
          Manage your account preferences, configure notification alerts, and ensure your privacy settings are tailored to your needs. Please be aware that changing privacy settings may impact personalized recommendations.
        </p>
        
        {/* Menu Cards */}
        <div className="settings-mobile-menu-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--line)',
                marginBottom: '1rem'
              }}
            >
              <button 
                onClick={() => setMobileOverlay(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  marginRight: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                &larr;
              </button>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--ink)' }}>
                {menuItems.find(i => i.id === mobileOverlay)?.title}
              </h3>
            </div>
            
            {/* Content area */}
            <div style={{ flex: 1 }}>
              {renderContent(mobileOverlay)}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="settings-desktop-container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>Settings</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--muted)', maxWidth: '800px', lineHeight: '1.5' }}>
          Manage your account preferences, configure notification alerts, and ensure your privacy settings are tailored to your needs. Please be aware that changing privacy settings may impact personalized recommendations on the platform.
        </p>
      </div>
      
      <div className="settings-desktop-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', minHeight: '60vh' }}>
        
        {/* Left Sidebar */}
        <div className="settings-desktop-sidebar" style={{ borderRight: '1px solid var(--line)', paddingRight: '1rem' }}>
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                width: '100%',
                padding: '1rem',
                border: 'none',
                background: activeSubTab === item.id ? 'var(--bg-teal-light)' : 'transparent',
                color: activeSubTab === item.id ? 'var(--teal)' : 'var(--muted)',
                textAlign: 'left',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: activeSubTab === item.id ? 'bold' : 'normal',
                transition: 'all 0.2s',
                marginBottom: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.title}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="settings-desktop-content" style={{ padding: '0 1rem' }}>
          {renderContent(activeSubTab)}
        </div>
        
      </div>
    </div>
  );
}
