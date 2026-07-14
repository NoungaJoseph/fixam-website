import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '../../App';
import './Auth.css';

export default function OTPVerification({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.join('').length !== 6) return;

    setIsLoading(true);
    setErrorText('');

    setTimeout(() => {
      setIsLoading(false);
      // Simulate code validation success
      onNavigate('login');
    }, 1500);
  };

  const t = {
    backToSign: isFr ? 'Retour à la connexion' : 'Back to Sign In',
    verifyTitle: isFr ? 'Vérifier le compte' : 'Verify Account',
    verifySub: isFr 
      ? 'Nous avons envoyé un code de vérification à 6 chiffres sur votre téléphone.' 
      : 'We\'ve sent a 6-digit verification code to your phone.',
    verifyBtn: isFr ? 'Vérifier le Code' : 'Verify Code',
    verifying: isFr ? 'Vérification...' : 'Verifying...',
    noCode: isFr ? 'Vous n\'avez pas reçu le code ?' : 'Didn\'t receive the code?',
    resend: isFr ? 'Renvoyer le code' : 'Resend Code',
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
          <h1 className="auth-card-title">{t.verifyTitle}</h1>
          <p className="auth-card-subtitle" style={{ marginBottom: '32px' }}>{t.verifySub}</p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginBottom: '24px' }}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={{
                    width: '46px',
                    height: '56px',
                    fontSize: '20px',
                    textAlign: 'center',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    color: '#1F2937',
                    outline: 'none',
                    transition: 'border-color 200ms, box-shadow 200ms',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#14B8A6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>

            {errorText && <span className="error-text-message" style={{ marginBottom: '16px', display: 'block' }}>{errorText}</span>}

            <button
              type="submit"
              className="btn-auth-primary"
              disabled={isLoading || code.join('').length !== 6}
            >
              {isLoading && <span className="auth-spinner"></span>}
              <span>{isLoading ? t.verifying : t.verifyBtn}</span>
            </button>
          </form>

          <p className="auth-bottom-switch">
            {t.noCode}
            <button
              type="button"
              className="auth-bottom-switch-link"
              onClick={() => {
                alert(isFr ? 'Code renvoyé avec succès!' : 'Code resent successfully!');
              }}
            >
              {t.resend}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
