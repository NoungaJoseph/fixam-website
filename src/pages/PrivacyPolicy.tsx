import type { Page } from '../App'
import { Icon } from '../App'

const privacySections = [
  {
    title: '1. Information We Collect',
    body: 'We collect personal information that you provide directly to us when you register and use the Platform. This includes your full name, phone number, email address, physical location, date of birth, profile picture, and service preferences. For providers, we also collect professional skills, portfolios, identification documents, and availability data. We also collect usage data and device information automatically as you interact with the app.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'Your information is primarily used to provide, maintain, and improve the Fixam platform. Specifically, we use your location to connect you with nearby providers or clients, your contact information to send transactional messages (like OTPs and booking updates), and your profile data to personalize your experience. We also use aggregated data for analytics and to improve our service offerings.',
  },
  {
    title: '3. Information Sharing and Disclosure',
    body: 'To facilitate service bookings, we share relevant information between clients and providers (e.g., location, name, phone number, and service details). We do not sell, rent, or trade your personal data to third parties for marketing purposes. We may share information with trusted third-party service providers who assist us in operating the app, or with legal authorities if required by law or to protect our rights and the safety of our users.',
  },
  {
    title: '4. Data Security and Retention',
    body: 'We implement industry-standard security measures, including encryption and secure socket layers (SSL), to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure. We retain your data only for as long as your account is active or as needed to provide you services, comply with legal obligations, and resolve disputes.',
  },
  {
    title: '5. Your Privacy Rights and Choices',
    body: 'You have the right to access, update, correct, or delete your personal information at any time through your account settings. You may also opt-out of promotional communications, although you will continue to receive essential transactional messages. If you wish to completely delete your account and associated data, you may do so within the app or by contacting our support team.',
  },
  {
    title: '6. Changes to This Privacy Policy',
    body: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes via the app or email. We encourage you to review this policy periodically to stay informed about how we protect your privacy.',
  },
]

export default function PrivacyPolicy({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="legal-page">
      <div className="legal-hero">
        <h1>Privacy Policy</h1>
        <p>How we collect, use, and protect your personal information.</p>
      </div>

      <div className="legal-content">
        <div className="legal-meta">
          <span className="legal-updated">
            <Icon name="calendar" /> Last Updated: June 2026
          </span>
        </div>

        <div className="legal-sections">
          {privacySections.map((section, index) => (
            <div className="legal-section" key={index}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>

        <div className="legal-contact">
          <div className="legal-contact-card">
            <Icon name="message" />
            <div>
              <h3>Have Questions?</h3>
              <p>
                If you have any questions, concerns, or feedback regarding our privacy practices,
                please contact us at <a href="mailto:support@fixam.com">support@fixam.com</a>.
              </p>
            </div>
          </div>
        </div>

        <div className="legal-nav-links">
          <button className="outline-button" onClick={() => onNavigate('terms' as Page)}>
            Read Terms of Service →
          </button>
          <button className="primary-button" onClick={() => onNavigate('home')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
