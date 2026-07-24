import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('fixam_cookie_consent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('fixam_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      zIndex: 99999,
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      padding: '1.5rem',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
        <span style={{ fontSize: '2rem' }}>🍪</span>
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 600 }}>We value your privacy</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.4 }}>
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
        <button 
          onClick={handleAccept}
          style={{
            background: 'transparent',
            border: '1px solid #334155',
            color: '#F8FAFC',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
          Manage Preferences
        </button>
        <button 
          onClick={handleAccept}
          style={{
            background: '#14B8A6',
            border: 'none',
            color: '#FFFFFF',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
          Accept All
        </button>
      </div>
    </div>
  );
}
