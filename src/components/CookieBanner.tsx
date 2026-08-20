import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './CookieBanner.css';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  useEffect(() => {
    const hasConsent = localStorage.getItem('fixam_cookie_consent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('fixam_cookie_consent', 'all');
    setIsVisible(false);
    try {
      fetch(`${import.meta.env.VITE_API_URL || 'https://api.usefixam.com/api'}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookieConsent: 'ALL',
          path: window.location.pathname || '/',
          domain: window.location.hostname || 'usefixam.com'
        })
      }).catch(() => {});
    } catch (_) {}
  };

  const handleRefuse = () => {
    localStorage.setItem('fixam_cookie_consent', 'essential');
    setIsVisible(false);
    try {
      fetch(`${import.meta.env.VITE_API_URL || 'https://api.usefixam.com/api'}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookieConsent: 'ESSENTIAL',
          path: window.location.pathname || '/',
          domain: window.location.hostname || 'usefixam.com'
        })
      }).catch(() => {});
    } catch (_) {}
  };

  const handleShowChoices = () => {
    window.location.hash = '#privacy';
    setTimeout(() => {
      const element = document.getElementById('cookies');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-wrapper">
      <div className="cookie-banner-text-col">
        <h4 className="cookie-banner-title">
          {isFr ? "Quelqu'un a dit ... des cookies ?" : 'Did someone say ... cookies?'}
        </h4>
        <p className="cookie-banner-desc">
          {isFr ? (
            <>
              Fixam et ses partenaires utilisent des cookies pour vous fournir un service meilleur, plus sûr et plus rapide et pour soutenir nos activités. Certains cookies sont nécessaires pour utiliser nos services, les améliorer et veiller à leur bon fonctionnement.{' '}
              <button onClick={handleShowChoices} className="cookie-banner-link">
                En savoir plus sur vos choix.
              </button>
            </>
          ) : (
            <>
              Fixam and its partners use cookies to provide you with a better, safer and faster service and to support our business. Some cookies are necessary to use our services, improve our services, and make sure they work properly.{' '}
              <button onClick={handleShowChoices} className="cookie-banner-link">
                Show more about your choices.
              </button>
            </>
          )}
        </p>
      </div>
      <div className="cookie-banner-btn-col">
        <button 
          onClick={handleAcceptAll}
          className="cookie-banner-btn cookie-banner-btn-primary"
        >
          {isFr ? 'Accepter tous les cookies' : 'Accept all cookies'}
        </button>
        <button 
          onClick={handleRefuse}
          className="cookie-banner-btn cookie-banner-btn-secondary"
        >
          {isFr ? 'Refuser les cookies non essentiels' : 'Refuse non-essential cookies'}
        </button>
      </div>
    </div>
  );
}

