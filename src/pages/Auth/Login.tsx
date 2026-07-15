import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '../../App';
import FloatingParticles from '../../components/FloatingParticles';
import './Auth.css';

export default function Login({ onNavigate, onLogin }: { onNavigate: (page: Page) => void; onLogin?: (role: 'client' | 'pro') => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [countryCode, setCountryCode] = useState(() => {
    return localStorage.getItem('FIXAM_LAST_SELECTED_DIAL_CODE') || '+237';
  });
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation States
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  
  // Loading & Show/Hide Password States
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Reset errors on method switch
  useEffect(() => {
    setPhoneError('');
    setEmailError('');
    setPasswordError('');
    setApiError('');
  }, [loginMethod]);

  const countries = [
    { code: '+237', name: 'Cameroon', flag: 'https://flagcdn.com/w40/cm.png' },
    { code: '+254', name: 'Kenya', flag: 'https://flagcdn.com/w40/ke.png' },
    { code: '+233', name: 'Ghana', flag: 'https://flagcdn.com/w40/gh.png' },
    { code: '+225', name: 'Côte d\'Ivoire', flag: 'https://flagcdn.com/w40/ci.png' },
    { code: '+255', name: 'Tanzania', flag: 'https://flagcdn.com/w40/tz.png' },
    { code: '+20', name: 'Egypt', flag: 'https://flagcdn.com/w40/eg.png' },
  ];

  const handleCountrySelect = (code: string) => {
    setCountryCode(code);
    setIsDropdownOpen(false);
    localStorage.setItem('FIXAM_LAST_SELECTED_DIAL_CODE', code);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (loginMethod === 'phone') {
      const cleanPhone = phone.replace(/\s+/g, '');
      const phoneRegex = /^[0-9]{8,15}$/;
      if (!phoneRegex.test(cleanPhone)) {
        setPhoneError(isFr ? 'Veuillez entrer un numéro valide' : 'Please enter a valid phone number');
        isValid = false;
      } else {
        setPhoneError('');
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        setEmailError(isFr ? 'Veuillez entrer un email valide' : 'Please enter a valid email address');
        isValid = false;
      } else {
        setEmailError('');
      }
    }

    if (!password) {
      setPasswordError(isFr ? 'Veuillez entrer votre mot de passe' : 'Please enter your password');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    // Simulate login loading delay
    setTimeout(() => {
      // Mock validation failure for demo purposes if wrong credentials are used
      if (password === 'wrong') {
        setApiError(
          isFr
            ? 'Téléphone ou mot de passe incorrect. Veuillez réessayer.'
            : 'Incorrect credentials. Please try again.'
        );
        setIsLoading(false);
      } else {
        setIsLoading(false);
        // Auto-detect role: if password has 'pro' or phone has '677', log in as provider
        const detectedRole = password.toLowerCase().includes('pro') || phone.includes('677') ? 'pro' : 'client';
        onLogin?.(detectedRole);
        onNavigate('dashboard');
      }
    }, 1200);
  };

  // Translations object
  const t = {
    newToFixam: isFr ? 'Nouveau sur Fixam ?' : 'New to Fixam?',
    joinNow: isFr ? 'Rejoindre' : 'Join Now',
    signInTitle: isFr ? 'Se connecter à Fixam' : 'Sign in to Fixam',
    phoneLabel: isFr ? 'Numéro de Téléphone' : 'Phone Number',
    useEmail: isFr ? 'Utiliser l\'adresse e-mail' : 'Use Email instead',
    emailLabel: isFr ? 'Adresse E-mail' : 'Email Address',
    usePhone: isFr ? 'Utiliser le téléphone' : 'Use Phone instead',
    phonePlaceholder: '6XX XXX XXX',
    emailPlaceholder: 'you@example.com',
    passwordLabel: isFr ? 'Mot de Passe' : 'Password',
    passwordPlaceholder: '••••••••',
    forgotPassword: isFr ? 'Mot de passe oublié ?' : 'Forgot password?',
    signInBtn: isFr ? 'Se Connecter' : 'Sign In',
    signingIn: isFr ? 'Connexion...' : 'Signing in...',
    dontHaveAccount: isFr ? 'Vous n\'avez pas de compte Fixam ?' : 'Don\'t have a Fixam account?',
    createAccount: isFr ? 'Créer un Compte' : 'Create Account',
  };

  return (
    <div className="auth-page-wrapper">
      <FloatingParticles />
      {/* HEADER */}
      <header className="auth-header-bar">
        <span className="auth-header-logo" onClick={() => onNavigate('home')}>Fixam</span>
        <div className="auth-header-right">
          <span>{t.newToFixam}</span>
          <button className="auth-header-btn" onClick={() => onNavigate('register')}>
            {t.joinNow}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="auth-main-content">
        <div className="auth-card">
          <h1 className="auth-card-title">{t.signInTitle}</h1>
          <p className="auth-card-subtitle" style={{ marginBottom: '32px' }}></p>

          {/* API ERROR BANNER */}
          {apiError && (
            <div className="auth-alert-banner error">
              {apiError}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} noValidate>
            {/* PHONE OR EMAIL DYNAMIC FIELD */}
            {loginMethod === 'phone' ? (
              <div className="field-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ margin: 0 }}>{t.phoneLabel}</label>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    style={{ background: 'none', border: 'none', color: '#14B8A6', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: 0 }}
                  >
                    {t.useEmail}
                  </button>
                </div>
                <div className={`phone-row-container ${phoneError ? 'error-state' : ''}`}>
                  {/* Country dropdown wrapper */}
                  <div className="input-container" style={{ width: 'auto' }}>
                    <select
                      className="country-code-select"
                      value={countryCode}
                      onChange={(e) => handleCountrySelect(e.target.value)}
                      style={{ borderRight: 'none', borderRadius: '8px 0 0 8px' }}
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Phone input wrapper */}
                  <div className={`input-container has-left-icon ${phoneError ? 'error-state' : ''}`} style={{ flex: 1 }}>
                    <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <input
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneError) setPhoneError('');
                      }}
                      style={{ borderRadius: '0 8px 8px 0' }}
                      required
                    />
                  </div>
                </div>
                {phoneError && <span className="error-text-message">{phoneError}</span>}
              </div>
            ) : (
              <div className="field-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ margin: 0 }}>{t.emailLabel}</label>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    style={{ background: 'none', border: 'none', color: '#14B8A6', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: 0 }}
                  >
                    {t.usePhone}
                  </button>
                </div>
                <div className={`input-container has-left-icon ${emailError ? 'error-state' : ''}`}>
                  <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    required
                  />
                </div>
                {emailError && <span className="error-text-message">{emailError}</span>}
              </div>
            )}

            {/* PASSWORD FIELD */}
            <div className="field-group">
              <label>{t.passwordLabel}</label>
              <div className={`input-container has-left-icon ${passwordError ? 'error-state' : ''}`}>
                <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  required
                />
                <span
                  className="input-right-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </span>
              </div>
              {passwordError && <span className="error-text-message">{passwordError}</span>}
              
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => onNavigate('forgot_password')}
              >
                {t.forgotPassword}
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn-auth-primary"
              disabled={isLoading}
              style={{ marginTop: '24px' }}
            >
              {isLoading && <span className="auth-spinner"></span>}
              <span>{isLoading ? t.signingIn : t.signInBtn}</span>
            </button>
          </form>

          {/* BOTTOM TEXT */}
          <p className="auth-bottom-switch">
            {t.dontHaveAccount}
            <button
              type="button"
              className="auth-bottom-switch-link"
              onClick={() => onNavigate('register')}
            >
              {t.createAccount}
            </button>
          </p>

          {/* QUICK DEV LOGINS */}
          <div className="quick-login-sandbox">
            <span className="quick-login-title">Quick Developer Sandbox</span>
            <div className="quick-login-buttons">
              <button
                type="button"
                className="btn-quick-login client"
                onClick={() => {
                  onLogin?.('client');
                  onNavigate('dashboard');
                }}
              >
                👤 Login as Client
              </button>
              <button
                type="button"
                className="btn-quick-login pro"
                onClick={() => {
                  onLogin?.('pro');
                  onNavigate('dashboard');
                }}
              >
                🛠️ Login as Provider
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
