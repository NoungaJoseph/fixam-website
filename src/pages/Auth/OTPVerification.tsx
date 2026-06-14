import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, asset, images } from '../../App';

export default function OTPVerification({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
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
    if (code.join('').length === 6) {
      onNavigate('login');
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-form-side">
        <div className="auth-form-container">
          <button className="brand brand-button auth-brand" onClick={() => onNavigate('home')}>
            <img src={asset('fixam.png')} alt="Fixam Logo" style={{ height: '32px' }} />
          </button>
          
          <div className="auth-header">
            <h2>Verify Account</h2>
            <p>We've sent a 6-digit verification code to your email.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
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
                    width: '3.5rem',
                    height: '4rem',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: 'var(--ink)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--teal)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--line)'}
                />
              ))}
            </div>

            <button type="submit" className="primary-button full-width" disabled={code.join('').length !== 6}>Verify Code</button>
          </form>

          <p className="auth-switch">
            Didn't receive the code? <button type="button" className="link-button">Resend Code</button>
          </p>
        </div>
      </section>
      
      <section className="auth-art-side" style={{ backgroundImage: `url(${images.serviceElectrician})` }}>
        <div className="auth-art-overlay">
          <div className="auth-art-content">
            <h2>Securely verifying your identity.</h2>
            <p>Your security is our top priority. Please do not share this code with anyone.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
