import { useState } from 'react';
import { api } from '../services/api';
import './SupportContactModal.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isFr: boolean;
};

export default function SupportContactModal({ isOpen, onClose, isFr }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.post('/users/contact-support', form);
      setStatus('sent');
    } catch (requestError: any) {
      setStatus('error');
      setError(requestError.response?.data?.message || (isFr ? 'Impossible d’envoyer votre message.' : 'Unable to send your message right now.'));
    }
  };

  return (
    <div className="homepage-support-overlay" role="dialog" aria-modal="true" aria-labelledby="homepage-support-title" onClick={onClose}>
      <div className="homepage-support-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="homepage-support-close" onClick={onClose} aria-label={isFr ? 'Fermer' : 'Close'}>×</button>
        {status === 'sent' ? (
          <div className="homepage-support-success">
            <div className="homepage-support-success-icon">✓</div>
            <h2 id="homepage-support-title">{isFr ? 'Message envoyé' : 'Message sent'}</h2>
            <p>{isFr ? 'Notre équipe vous répondra à supportfixam@gmail.com.' : 'Our team will reply to you at supportfixam@gmail.com.'}</p>
            <button type="button" className="homepage-support-submit" onClick={onClose}>{isFr ? 'Fermer' : 'Close'}</button>
          </div>
        ) : (
          <>
            <div className="homepage-support-heading">
              <span className="homepage-support-kicker">{isFr ? 'ASSISTANCE FIXAM' : 'FIXAM SUPPORT'}</span>
              <h2 id="homepage-support-title">{isFr ? 'Comment pouvons-nous vous aider ?' : 'How can we help?'}</h2>
              <p>{isFr ? 'Envoyez-nous vos coordonnées et votre message. Notre équipe vous répondra directement.' : 'Share your contact details and message. Our team will reply directly.'}</p>
            </div>
            <form onSubmit={submit} className="homepage-support-form">
              {status === 'error' && <div className="homepage-support-error">{error}</div>}
              <div className="homepage-support-fields">
                <label>{isFr ? 'Nom complet' : 'Full name'}<input required value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
                <label>{isFr ? 'Adresse e-mail' : 'Email address'}<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label>
                <label>{isFr ? 'Téléphone' : 'Phone number'}<input required type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} /></label>
              </div>
              <label>{isFr ? 'Votre message' : 'Your message'}<textarea required rows={5} value={form.message} onChange={(event) => update('message', event.target.value)} /></label>
              <button className="homepage-support-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? (isFr ? 'Envoi…' : 'Sending…') : (isFr ? 'Envoyer au support' : 'Send to support')}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
