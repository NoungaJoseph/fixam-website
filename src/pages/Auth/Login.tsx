import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, asset, images, Icon } from '../../App';
import './Auth.css';

export default function Login({ onNavigate, onLogin }: { onNavigate: (page: Page) => void; onLogin?: (role: 'client' | 'pro') => void }) {
  const { t } = useTranslation();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [role, setRole] = useState<'client' | 'pro'>('client');

  // Scroll form side to top when component mounts
  useEffect(() => {
    const formSide = document.querySelector('.auth-form-side');
    if (formSide) formSide.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);
  
  // Custom dropdown state for phone
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countryCode, setCountryCode] = useState(() => {
    return localStorage.getItem('FIXAM_LAST_SELECTED_DIAL_CODE') || '+237';
  });
  const [phone, setPhone] = useState('');
  const countries = [
    { code: '+237', name: 'Cameroon', flag: 'https://flagcdn.com/w40/cm.png' },
    { code: '+254', name: 'Kenya', flag: 'https://flagcdn.com/w40/ke.png' },
    { code: '+233', name: 'Ghana', flag: 'https://flagcdn.com/w40/gh.png' },
    { code: '+225', name: 'Côte d\'Ivoire', flag: 'https://flagcdn.com/w40/ci.png' },
    { code: '+255', name: 'Tanzania', flag: 'https://flagcdn.com/w40/tz.png' },
    { code: '+20', name: 'Egypt', flag: 'https://flagcdn.com/w40/eg.png' },
    // { code: '+234', name: 'Nigeria', flag: 'https://flagcdn.com/w40/ng.png' } // Standby
  ];
  const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
    setIsDropdownOpen(false);
    localStorage.setItem('FIXAM_LAST_SELECTED_DIAL_CODE', code);
  };

  return (
    <main className="auth-layout">
      <section className="auth-form-side">
        <div className="auth-form-container">
          <button className="brand brand-button" onClick={() => onNavigate('home')} aria-label="Go to homepage">
            <img src={asset('fixam-white-bg.png')} alt="Fixam Logo" style={{ height: '64px', marginBottom: '1rem' }} />
          </button>
          
          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Enter your details to access your account.</p>
          </div>

          <div className="account-type-toggle">
            <button 
              type="button" 
              className={role === 'client' ? 'active' : ''} 
              onClick={() => setRole('client')}
            >
              I am a Client
            </button>
            <button 
              type="button" 
              className={role === 'pro' ? 'active' : ''} 
              onClick={() => setRole('pro')}
            >
              I am a Professional
            </button>
          </div>

          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onLogin?.(role); onNavigate('dashboard'); }}>
            {loginMethod === 'email' ? (
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Email Address</label>
                  <button type="button" onClick={() => setLoginMethod('phone')} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Use Phone instead</button>
                </div>
                <div className="input-wrapper">
                  <Icon name="message" />
                  <input type="email" placeholder="you@example.com" required />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Phone Number</label>
                  <button type="button" onClick={() => setLoginMethod('email')} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Use Email instead</button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                  <div 
                    className="input-wrapper" 
                    style={{ padding: '0 0.8rem', width: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', userSelect: 'none' }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <img src={selectedCountry.flag} alt={selectedCountry.name} style={{ width: '20px', borderRadius: '2px' }} />
                    <span style={{ fontWeight: 600 }}>{selectedCountry.code}</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: '4px' }}>
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <div style={{
                      position: 'absolute', top: '110%', left: 0, background: 'var(--surface)', border: '1px solid var(--line)', 
                      borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10, width: '180px', overflow: 'hidden'
                    }}>
                      {countries.map((country) => (
                        <div 
                          key={country.code}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--soft)' }}
                          onClick={() => {
                            handleCountrySelect(country.code);
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--soft)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface)'}
                        >
                          <img src={country.flag} alt={country.name} style={{ width: '24px', borderRadius: '2px' }} />
                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{country.code}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="input-wrapper" style={{ flex: 1 }}>
                    <input 
                      type="tel" 
                      placeholder="600 000 000" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Icon name="shield" />
                <input type="password" placeholder="••••••••" required />
              </div>
            </div>

            <div className="auth-actions">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" className="link-button" onClick={() => onNavigate('forgot_password')}>Forgot password?</button>
            </div>

            <button type="submit" className="primary-button full-width">Sign In</button>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login-grid">
              <button type="button" className="social-btn"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" /> Google</button>
              <button type="button" className="social-btn"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" /> Apple</button>
            </div>
          </form>

          <p className="auth-switch">
            Don't have an account? <button type="button" className="link-button" onClick={() => onNavigate('register')}>Sign up</button>
          </p>
        </div>
      </section>
      
      <section className="auth-art-side" style={{ backgroundImage: `url(${images.servicePlumber})` }}>
        <div className="auth-art-overlay">
          <div className="auth-art-content">
            <h2>Trusted by thousands of professionals & clients.</h2>
            <p>Join the community to get things done securely and swiftly.</p>
            <div className="auth-stats">
              <div className="stat-item">
                <h3>150+</h3>
                <span>Verified Pros</span>
              </div>
              <div className="stat-item">
                <h3>800+</h3>
                <span>Jobs Done</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
