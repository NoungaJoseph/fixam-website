import { useTranslation } from 'react-i18next';
import { Page, asset, images, Icon } from '../../App';

export default function ForgotPassword({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useTranslation();

  return (
    <main className="auth-layout">
      <section className="auth-form-side">
        <div className="auth-form-container">
          <button className="brand brand-button auth-brand" onClick={() => onNavigate('home')}>
            <img src={asset('fixam.png')} alt="Fixam Logo" style={{ height: '32px' }} />
          </button>
          
          <div className="auth-header">
            <h2>Reset Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onNavigate('otp'); }}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Icon name="message" />
                <input type="email" placeholder="you@example.com" required />
              </div>
            </div>

            <button type="submit" className="primary-button full-width" style={{ marginTop: '1rem' }}>Send Verification Code</button>
          </form>

          <p className="auth-switch">
            Remember your password? <button type="button" className="link-button" onClick={() => onNavigate('login')}>Sign in</button>
          </p>
        </div>
      </section>
      
      <section className="auth-art-side" style={{ backgroundImage: `url(${images.servicePlumber})` }}>
        <div className="auth-art-overlay">
          <div className="auth-art-content">
            <h2>Trusted by thousands of professionals & clients.</h2>
            <p>Join the community to get things done securely and swiftly.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
