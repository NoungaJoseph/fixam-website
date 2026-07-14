import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '../../App';
import './Auth.css';

export default function ForgotPassword({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError(isFr ? 'Veuillez entrer votre email' : 'Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(isFr ? 'Format d\'email invalide' : 'Invalid email format');
      return;
    }

    setEmailError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onNavigate('otp');
    }, 1200);
  };

  const t = {
    backToSign: isFr ? 'Retour à la connexion' : 'Back to Sign In',
    resetTitle: isFr ? 'Réinitialiser le mot de passe' : 'Reset Password',
    resetSub: isFr 
      ? 'Entrez votre adresse e-mail et nous vous enverrons un code pour réinitialiser votre mot de passe.' 
      : 'Enter your email address and we\'ll send you a code to reset your password.',
    emailLabel: isFr ? 'Adresse E-mail' : 'Email Address',
    emailPlaceholder: 'you@example.com',
    sendCodeBtn: isFr ? 'Envoyer le Code' : 'Send Verification Code',
    sending: isFr ? 'Envoi...' : 'Sending...',
    rememberPass: isFr ? 'Vous vous souvenez de votre mot de passe ?' : 'Remember your password?',
    signIn: isFr ? 'Se connecter' : 'Sign In',
  };

  return (
    <div className="auth-page-wrapper">
      {/* HEADER */}
      <header className="auth-header-bar">
        <span className="auth-header-logo" onClick={() => onNavigate('home')}>Fixam</span>
        <div className="auth-header-right">
          <button className="auth-header-btn" onClick={() => onNavigate('login')}>
            {t.backToSign}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="auth-main-content">
        <div className="auth-card">
          <h1 className="auth-card-title">{t.resetTitle}</h1>
          <p className="auth-card-subtitle" style={{ marginBottom: '28px' }}>{t.resetSub}</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label>{t.emailLabel}</label>
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

            <button
              type="submit"
              className="btn-auth-primary"
              disabled={isLoading}
              style={{ marginTop: '24px' }}
            >
              {isLoading && <span className="auth-spinner"></span>}
              <span>{isLoading ? t.sending : t.sendCodeBtn}</span>
            </button>
          </form>

          <p className="auth-bottom-switch">
            {t.rememberPass}
            <button
              type="button"
              className="auth-bottom-switch-link"
              onClick={() => onNavigate('login')}
            >
              {t.signIn}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
