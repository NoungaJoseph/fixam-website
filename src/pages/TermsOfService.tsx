import type { Page } from '../App'
import { Icon } from '../App'

const termsSections = [
  {
    title: '1. Introduction and Acceptance of Terms',
    body: 'Welcome to Fixam. By downloading, installing, accessing, or using the Fixam mobile application and related services (collectively, the "Platform"), you agree to be bound by these Terms of Service. Fixam connects clients needing diverse services with professional, vetted service providers in Cameroon. If you do not agree to all of these terms and conditions, you must not use our Platform.',
  },
  {
    title: '2. Eligibility and Account Registration',
    body: 'To use Fixam, you must be at least 18 years of age and capable of forming a binding contract. When registering, whether as a Client or a Provider, you must provide accurate, complete, and current information. You are solely responsible for safeguarding your login credentials (including OTPs) and for all activities that occur under your account. Fixam reserves the right to suspend or terminate accounts that provide false information or violate our community guidelines.',
  },
  {
    title: '3. The Role of the Fixam Platform',
    body: 'Fixam acts exclusively as a technological marketplace connecting independent service providers with clients. We do not directly employ the providers, nor do we act as an agent for either party. While we strive to verify providers and maintain high standards, we do not guarantee the quality, safety, or legality of the services performed. Any disputes arising from the provision of services must be resolved directly between the client and the provider, although Fixam may, at its discretion, offer mediation support.',
  },
  {
    title: '4. Booking, Payments, and Fixam Coins',
    body: 'Booking a provider on Fixam requires the use of Fixam coins, our in-app currency. Coins are purchased through the application and are non-refundable unless a booking is cancelled under conditions explicitly outlined in our Cancellation Policy. Providers independently set their service rates, and clients agree to pay the agreed-upon amount directly to the provider upon satisfactory completion of the service. Fixam is not responsible for off-platform financial transactions or disputes over payment amounts between users.',
  },
  {
    title: '5. Code of Conduct and Prohibited Activities',
    body: 'All users must treat each other with utmost respect and professionalism. Harassment, discrimination, fraud, sharing inappropriate content, and any unprofessional behavior are strictly prohibited. You may not use the Platform for any illegal activities or to solicit services that violate local laws. Violations will result in immediate account termination and potential legal action.',
  },
  {
    title: '6. Intellectual Property Rights',
    body: 'All content on the Fixam Platform, including but not limited to text, graphics, logos, images, and software, is the property of Fixam or its licensors and is protected by intellectual property laws. You may not modify, copy, distribute, or reverse engineer any part of the Platform without our explicit written consent.',
  },
  {
    title: '7. Limitation of Liability and Indemnification',
    body: 'To the maximum extent permitted by law, Fixam shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use of the Platform. You agree to indemnify and hold Fixam harmless from any claims, losses, or damages arising out of your breach of these Terms or your interactions with other users.',
  },
  {
    title: '8. Modifications to Terms',
    body: 'We reserve the right to modify these Terms at any time. We will notify you of any significant changes by updating the "Last Updated" date or through direct communication. Continued use of the Platform after such changes constitutes your acceptance of the new Terms.',
  },
]

export default function TermsOfService({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="legal-page">
      <div className="legal-hero">
        <h1>Terms of Service</h1>
        <p>Please read these terms carefully before using the Fixam platform.</p>
      </div>

      <div className="legal-content">
        <div className="legal-meta">
          <span className="legal-updated">
            <Icon name="calendar" /> Last Updated: June 2026
          </span>
        </div>

        <div className="legal-sections">
          {termsSections.map((section, index) => (
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
                If you have any questions, concerns, or feedback regarding these terms,
                please contact us at <a href="mailto:support@fixam.com">support@fixam.com</a>.
              </p>
            </div>
          </div>
        </div>

        <div className="legal-nav-links">
          <button className="outline-button" onClick={() => onNavigate('privacy' as Page)}>
            Read Privacy Policy →
          </button>
          <button className="primary-button" onClick={() => onNavigate('home')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
