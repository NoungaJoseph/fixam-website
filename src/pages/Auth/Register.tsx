import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, asset, images, Icon } from '../../App';

export default function Register({ onNavigate, onRegister }: { onNavigate: (page: Page) => void; onRegister?: (role: 'client' | 'pro') => void }) {
  const { t } = useTranslation();
  const [accountType, setAccountType] = useState<'client' | 'pro'>('client');
  const [countryCode, setCountryCode] = useState('+237');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const countries = [
    { code: '+237', name: 'Cameroon', flag: 'https://flagcdn.com/w40/cm.png' },
    { code: '+234', name: 'Nigeria', flag: 'https://flagcdn.com/w40/ng.png' },
    { code: '+233', name: 'Ghana', flag: 'https://flagcdn.com/w40/gh.png' },
    { code: '+225', name: 'Côte d\'Ivoire', flag: 'https://flagcdn.com/w40/ci.png' }
  ];
  const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

  // Password Validation States
  const [hasLength, setHasLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUpper, setHasUpper] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);

  useEffect(() => {
    setHasLength(password.length >= 8);
    setHasNumber(/\d/.test(password));
    setHasUpper(/[A-Z]/.test(password));
    setHasSpecial(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  }, [password]);

  const strengthScore = [hasLength, hasNumber, hasUpper, hasSpecial].filter(Boolean).length;
  let strengthColor = 'var(--line)';
  if (password.length > 0) {
    if (strengthScore <= 1) strengthColor = '#ef4444'; // Red (Weak)
    else if (strengthScore <= 3) strengthColor = '#f59e0b'; // Yellow (Medium)
    else strengthColor = '#10b981'; // Green (Strong)
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      // Set a loading state visually if needed, but for now just set placeholder
      setLocation('Locating...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.state || '';
            const country = data.address.country || '';
            setLocation(city ? `${city}, ${country}` : country || `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
          } catch (error) {
            console.error("Geocoding failed:", error);
            setLocation(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation('');
          alert("Could not access your location. Please check your browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (strengthScore < 4) {
      alert("Please ensure your password meets all strength requirements.");
      return;
    }
    onRegister?.(accountType);
    onNavigate('otp');
  };

  return (
    <main className="auth-layout">
      <section className="auth-form-side">
        <div className="auth-form-container" style={{ margin: '2rem 0' }}>
          <button className="brand brand-button auth-brand" onClick={() => onNavigate('home')}>
            <img src={asset('fixam-white-bg.png')} alt="Fixam Logo" style={{ height: '32px', transform: 'scale(5)' }} />
          </button>
          
          <div className="auth-header">
            <h2>Create an account</h2>
            <p>Join Fixam to {accountType === 'client' ? 'find trusted professionals.' : 'grow your service business.'}</p>
          </div>

          <div className="account-type-toggle">
            <button 
              type="button" 
              className={accountType === 'client' ? 'active' : ''} 
              onClick={() => setAccountType('client')}
            >
              I am a Client
            </button>
            <button 
              type="button" 
              className={accountType === 'pro' ? 'active' : ''} 
              onClick={() => setAccountType('pro')}
            >
              I am a Professional
            </button>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="name-row">
              <div className="input-group">
                <label>First Name</label>
                <div className="input-wrapper">
                  <Icon name="user" />
                  <input type="text" placeholder="e.g. Alexander" required />
                </div>
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <div className="input-wrapper">
                  <Icon name="user" />
                  <input type="text" placeholder="e.g. Wright" required />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Icon name="message" />
                <input type="email" placeholder="you@example.com" required />
              </div>
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                
                {/* Custom Dropdown */}
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

                {/* Dropdown Menu */}
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
                          setCountryCode(country.code);
                          setIsDropdownOpen(false);
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

            <div className="input-group">
              <label>Location</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="input-wrapper" style={{ flex: 1 }}>
                  <Icon name="location" />
                  <input 
                    type="text" 
                    placeholder="Your City or Area" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required 
                  />
                </div>
                <button 
                  type="button" 
                  className="outline-button" 
                  onClick={handleGetLocation}
                  style={{ borderRadius: '6px', minHeight: '3.2rem', padding: '0 1rem' }}
                >
                  <Icon name="location" /> Use Current
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Referral Code (Optional)</label>
              <div className="input-wrapper">
                <Icon name="check" />
                <input type="text" placeholder="Enter referral code" />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper" style={{ borderColor: password.length > 0 ? strengthColor : 'var(--line)' }}>
                <Icon name="shield" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div className="password-strength" style={{ fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <div style={{ height: '4px', flex: 1, background: password.length > 0 && strengthScore >= 1 ? strengthColor : 'var(--line)', borderRadius: '2px' }}></div>
                <div style={{ height: '4px', flex: 1, background: password.length > 0 && strengthScore >= 2 ? strengthColor : 'var(--line)', borderRadius: '2px' }}></div>
                <div style={{ height: '4px', flex: 1, background: password.length > 0 && strengthScore >= 3 ? strengthColor : 'var(--line)', borderRadius: '2px' }}></div>
                <div style={{ height: '4px', flex: 1, background: password.length > 0 && strengthScore >= 4 ? strengthColor : 'var(--line)', borderRadius: '2px' }}></div>
              </div>

              <ul style={{ fontSize: '0.8rem', color: 'var(--muted)', listStyle: 'none', padding: 0, margin: '0.5rem 0 0 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                <li style={{ color: hasLength ? '#10b981' : 'var(--muted)' }}>✓ At least 8 characters</li>
                <li style={{ color: hasNumber ? '#10b981' : 'var(--muted)' }}>✓ Contains a number</li>
                <li style={{ color: hasUpper ? '#10b981' : 'var(--muted)' }}>✓ Uppercase letter</li>
                <li style={{ color: hasSpecial ? '#10b981' : 'var(--muted)' }}>✓ Special character</li>
              </ul>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <Icon name="shield" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="primary-button full-width" style={{ marginTop: '1rem' }}>Create Account</button>

            <div className="auth-divider">
              <span>Or sign up with</span>
            </div>

            <div className="social-login-grid">
              <button type="button" className="social-btn"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" /> Google</button>
              <button type="button" className="social-btn"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" /> Apple</button>
            </div>
          </form>

          <p className="auth-switch">
            Already have an account? <button type="button" className="link-button" onClick={() => onNavigate('login')}>Sign in</button>
          </p>
        </div>
      </section>
      
      <section className="auth-art-side" style={{ backgroundImage: `url(${images.serviceElectrician})` }}>
        <div className="auth-art-overlay">
          <div className="auth-art-content">
            <h2>The easiest way to {accountType === 'client' ? 'get things done' : 'find new clients'}.</h2>
            <p>Fixam connects reliable people with those who need them most.</p>
            <div className="auth-stats">
              <div className="stat-item">
                <h3>98%</h3>
                <span>Satisfaction</span>
              </div>
              <div className="stat-item">
                <h3>24/7</h3>
                <span>Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
