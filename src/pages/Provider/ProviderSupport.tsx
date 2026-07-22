import { useState } from 'react';
import { api } from '../../services/api';
import './ProviderDashboard.css';

interface ProviderSupportProps {
  setActiveTab?: (tab: string) => void;
  setActiveChatUser?: (user: string) => void;
}

export default function ProviderSupport({ setActiveTab, setActiveChatUser }: ProviderSupportProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create support chat
      const res = await api.post('/chat/support');
      const supportConvId = res.data?.data?.id;
      
      // Send the initial message
      if (supportConvId && message) {
        await api.post('/chat/send', {
          conversationId: supportConvId,
          content: `Subject: ${subject}\n\n${message}`
        });
        
        alert('Support ticket submitted successfully!');
        if (setActiveTab && setActiveChatUser) {
          setActiveChatUser(supportConvId);
          setActiveTab('Messages');
        }
      } else {
        alert('Support chat created. A support agent will contact you soon.');
      }
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error("Failed to submit support ticket", err);
      alert(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    { q: 'How do I get paid by clients?', a: 'Clients pay you cash directly upon completion of the service. Fixam does not handle payments or charge transfer fees.' },
    { q: 'How do I submit job proposals?', a: 'Browse leads under "Job Leads", click "Send Proposal", and specify your estimate. If accepted, you will get linked with the client.' },
    { q: 'Why did my coin count drop?', a: 'Fixam deducts 1 to 3 coins when you successfully connect or book a job lead with a client as a matching fee.' }
  ];

  return (
    <div className="dash-panel-premium provider-support-grid animate-fade-in">
      {/* LEFT: Provider FAQs */}
      <div style={{ borderRight: '1px solid #E5E7EB', paddingRight: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>Help Center & FAQs</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((f, i) => (
            <details key={i} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 600, fontSize: '14px', color: '#1f2937', outline: 'none' }}>{f.q}</summary>
              <p style={{ fontSize: '13px', color: '#4B5563', margin: '8px 0 0 0', lineHeight: 1.5 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* RIGHT: Ticket submission form */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>Submit Support Ticket</h3>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5, marginBottom: '24px' }}>
          Encountering issues with a client, coin purchase, or profile settings? Send our support team a message.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Coin purchase issue"
              style={{
                width: '100%', height: '44px', borderRadius: '6px', border: '1px solid #D1D5DB',
                padding: '0 12px', fontSize: '14px', boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>Detailed Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              rows={4}
              style={{
                width: '100%', borderRadius: '6px', border: '1px solid #D1D5DB',
                padding: '12px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical'
              }}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%', height: '44px', backgroundColor: isSubmitting ? '#9CA3AF' : '#14B8A6', color: 'white',
              border: 'none', borderRadius: '6px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all 200ms ease'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
}
