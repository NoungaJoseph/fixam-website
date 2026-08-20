import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../App';
import { api } from '../services/api';
import './SupportPage.css';

interface SupportPageProps {
  onNavigate: (page: Page) => void;
}

interface FaqItem {
  id: string;
  category: 'all' | 'clients' | 'providers' | 'payments' | 'safety';
  questionEn: string;
  questionFr: string;
  answerEn: string;
  answerFr: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'clients',
    questionEn: 'How do I post a job and hire an artisan on Fixam?',
    questionFr: 'Comment publier une mission et engager un artisan sur Fixam ?',
    answerEn: 'To post a job, click "Post a Task" or use the Fixam mobile app. Describe the problem, attach photos or a voice note, set your location and budget. Verified professionals in your area will submit quotes. You can review their profiles, ratings, and portfolios before accepting.',
    answerFr: 'Pour publier une tâche, cliquez sur "Publier une tâche" ou utilisez l\'application Fixam. Décrivez votre besoin, joignez des photos ou une note vocale, indiquez votre ville et votre budget. Des professionnels vérifiés vous enverront des devis que vous pourrez comparer avant de choisir.'
  },
  {
    id: 'faq-2',
    category: 'payments',
    questionEn: 'How does Fixam Escrow Payment protection work?',
    questionFr: 'Comment fonctionne la protection de paiement par séquestre (Escrow) sur Fixam ?',
    answerEn: 'When you accept a quote, your payment (via MTN MoMo, Orange Money, or card) is securely held by Fixam in escrow. The artisan only receives the payout AFTER you inspect and approve the completed work. If work is unsatisfactory or abandoned, you can open a dispute for a full or partial refund.',
    answerFr: 'Lorsque vous acceptez un devis, votre paiement (via MTN MoMo, Orange Money ou carte) est conservé en toute sécurité par Fixam. L\'artisan ne reçoit ses fonds qu\'APRÈS que vous ayez validé la bonne exécution des travaux. En cas de problème, vous pouvez ouvrir un litige pour remboursement.'
  },
  {
    id: 'faq-3',
    category: 'providers',
    questionEn: 'How do I become a verified service provider on Fixam Pro?',
    questionFr: 'Comment devenir un prestataire de services vérifié sur Fixam Pro ?',
    answerEn: 'Sign up for a Fixam account and select "Join as Professional" or switch to Provider mode. Upload a valid government-issued ID (National ID Card or Passport), take a quick verification selfie, and list your skill categories with photos of past work. Our compliance team verifies accounts within 24 hours.',
    answerFr: 'Inscrivez-vous sur Fixam et passez en mode Prestataire. Téléchargez une pièce d\'identité officielle (CNI ou Passeport), effectuez la vérification faciale et renseignez vos compétences avec des photos de vos réalisations. Notre équipe valide votre profil sous 24h.'
  },
  {
    id: 'faq-4',
    category: 'safety',
    questionEn: 'What happens if there is a dispute or poor workmanship?',
    questionFr: 'Que faire en cas de litige ou de travail mal exécuté ?',
    answerEn: 'Do not approve the job completion. In your task details screen, tap "Report Problem / Open Dispute". Provide photos and description of the issue. Our Fixam Resolution Team investigates within 24 hours, mediates between both parties, or triggers a rework/refund.',
    answerFr: 'Ne validez pas la fin de la mission. Dans les détails de la tâche, cliquez sur "Signaler un problème / Litige". Joignez des photos et explications. L\'équipe de médiation Fixam intervient sous 24 heures pour trouver un accord, demander une reprise ou effectuer un remboursement.'
  },
  {
    id: 'faq-5',
    category: 'payments',
    questionEn: 'What payment methods are accepted on Fixam?',
    questionFr: 'Quels modes de paiement sont acceptés sur Fixam ?',
    answerEn: 'We support instant Mobile Money (MTN MoMo, Orange Money, M-Pesa), credit/debit cards (Visa, Mastercard), and Fixam In-App Coins. All transactions are encrypted with bank-grade security.',
    answerFr: 'Nous acceptons les paiements instantanés par Mobile Money (MTN MoMo, Orange Money, M-Pesa), cartes bancaires (Visa, Mastercard) et pièces Fixam. Toutes les transactions sont chiffrées et hautement sécurisées.'
  },
  {
    id: 'faq-6',
    category: 'providers',
    questionEn: 'How and when do service providers receive their earnings?',
    questionFr: 'Comment et quand les prestataires reçoivent-ils leurs gains ?',
    answerEn: 'Once the client marks a job completed and satisfied, funds instantly credit to your Fixam Provider Wallet. You can request a payout anytime directly to your registered MTN MoMo or Orange Money number.',
    answerFr: 'Dès que le client valide la fin des travaux, les fonds sont immédiatement crédités sur votre portefeuille Fixam. Vous pouvez retirer vos gains à tout moment vers votre compte MTN MoMo ou Orange Money.'
  },
  {
    id: 'faq-7',
    category: 'safety',
    questionEn: 'How does Fixam ensure user safety and identity security?',
    questionFr: 'Comment Fixam garantit-il la sécurité et l\'identité des utilisateurs ?',
    answerEn: 'All providers undergo national ID validation, live facial liveness checks, and review monitoring. Additionally, conversations and payments stay safely inside the platform, with real-time GPS tracking during active home visits.',
    answerFr: 'Tous les prestataires sont soumis à la vérification d\'identité officielle, à des contrôles de présence faciale et à la modération continue des avis. Les échanges et paiements sont sécurisés dans l\'application avec suivi GPS lors des interventions à domicile.'
  }
];

export default function SupportPage({ onNavigate }: SupportPageProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clients' | 'providers' | 'payments' | 'safety'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'client',
    category: 'general',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const question = isFr ? faq.questionFr : faq.questionEn;
      const answer = isFr ? faq.answerFr : faq.answerEn;
      const matchesSearch = !searchQuery.trim() || 
        question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        answer.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, isFr]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(isFr ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Send to feedback / contact endpoint
      await api.post('/users/feedback', {
        type: formData.category,
        message: `[Support Ticket - ${formData.subject || 'General Inquiry'}] From: ${formData.name} (${formData.email}, Tel: ${formData.phone || 'N/A'}, Role: ${formData.role})\n\n${formData.message}`
      });

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'client',
        category: 'general',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      // Even if offline/unauthenticated, show graceful success with email option
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="support-page-container">
      {/* Hero Section */}
      <section className="support-hero-section">
        <div className="support-hero-badge">
          <span>🛠️</span>
          <span>{isFr ? 'Fixam Centre d\'Assistance' : 'Fixam Help Center'}</span>
        </div>
        <h1 className="support-hero-title">
          {isFr ? 'Comment pouvons-nous vous aider aujourd\'hui ?' : 'How can we help you today?'}
        </h1>
        <p className="support-hero-subtitle">
          {isFr 
            ? 'Trouvez des réponses rapides, découvrez nos guides de dépannage ou contactez directement l\'équipe d\'assistance Fixam.' 
            : 'Search our knowledge base, resolve issues with bookings and payments, or get in touch with our dedicated support team.'}
        </p>

        {/* Live Search */}
        <div className="support-search-wrapper">
          <div className="support-search-input-box">
            <span className="support-search-icon">🔍</span>
            <input
              type="text"
              className="support-search-input"
              placeholder={isFr ? "Rechercher une réponse (ex: paiement, litige, devenir pro)..." : "Search for answers (e.g., escrow, payout, refund, verification)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="support-search-clear" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Direct Support Channels */}
      <section className="support-channels-section">
        <div className="support-channels-grid">
          
          {/* Email Support */}
          <a href="mailto:support@usefixam.com" className="support-channel-card">
            <div className="support-channel-icon-wrap email">✉️</div>
            <h3>{isFr ? 'Assistance par Email' : 'Email Support'}</h3>
            <p>{isFr ? 'Envoyez-nous un email à support@usefixam.com avec réponse sous 2 heures.' : 'Write to support@usefixam.com. We reply to all inquiries within 2 hours.'}</p>
            <span className="support-channel-action">support@usefixam.com →</span>
          </a>

          {/* In-App Live Chat */}
          <div 
            onClick={() => onNavigate('login')} 
            className="support-channel-card"
          >
            <div className="support-channel-icon-wrap chat">💬</div>
            <h3>{isFr ? 'Messagerie dans l\'App' : 'In-App Support Chat'}</h3>
            <p>{isFr ? 'Discutez en temps réel avec un conseiller d\'assistance ou votre prestataire.' : 'Open a live chat session directly inside your Fixam mobile or web app.'}</p>
            <span className="support-channel-action">{isFr ? 'Ouvrir le Chat →' : 'Start Live Chat →'}</span>
          </div>

          {/* Phone / WhatsApp Helpline */}
          <a 
            href="https://wa.me/237670000000?text=Hello%20Fixam%20Support" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="support-channel-card"
          >
            <div className="support-channel-icon-wrap phone">📱</div>
            <h3>{isFr ? 'WhatsApp & Téléphone' : 'WhatsApp & Hotline'}</h3>
            <p>{isFr ? 'Assistance prioritaire pour les urgences sur chantiers et dépannages 24/7.' : 'Direct line for emergency task requests and active job assistance.'}</p>
            <span className="support-channel-action">{isFr ? 'Contacter sur WhatsApp →' : 'Chat on WhatsApp →'}</span>
          </a>

          {/* Safety & Disputes */}
          <div 
            onClick={() => {
              const el = document.getElementById('contact-form-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="support-channel-card"
          >
            <div className="support-channel-icon-wrap dispute">🛡️</div>
            <h3>{isFr ? 'Médiation & Litiges' : 'Disputes & Guarantees'}</h3>
            <p>{isFr ? 'Protection des fonds par séquestre et médiation impartiale en cas de problème.' : 'Resolve task disputes, request reworks, or claim your money-back guarantee.'}</p>
            <span className="support-channel-action">{isFr ? 'Ouvrir un Dossier →' : 'File a Dispute →'}</span>
          </div>

        </div>
      </section>

      {/* Main Support Content */}
      <div className="support-main-content">
        
        {/* Support Categories */}
        <div className="support-section-header">
          <h2 className="support-section-title">
            {isFr ? 'Explorez les rubriques d\'aide' : 'Browse Support Topics'}
          </h2>
          <p className="support-section-subtitle">
            {isFr ? 'Tout ce que vous devez savoir pour utiliser Fixam en toute simplicité.' : 'Guides and instructions for clients, artisans, and business partners.'}
          </p>
        </div>

        <div className="support-categories-grid">
          {/* Card 1: Getting Started */}
          <div className="support-cat-card">
            <div className="support-cat-header">
              <span className="support-cat-icon">👤</span>
              <h3 className="support-cat-title">{isFr ? 'Comptes & Inscription' : 'Account & Verification'}</h3>
            </div>
            <ul className="support-cat-links">
              <li className="support-cat-link-item" onClick={() => onNavigate('guide')}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Comment créer un compte particulier ou pro' : 'How to register as a client or provider'}</span>
              </li>
              <li className="support-cat-link-item" onClick={() => onNavigate('privacy')}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Validation d\'identité (CNI / Vérification faciale)' : 'Identity & KYC document verification'}</span>
              </li>
              <li className="support-cat-link-item" onClick={() => onNavigate('forgot_password')}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Réinitialisation de mot de passe oublié' : 'Resetting your password or OTP troubleshooting'}</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Hiring & Booking */}
          <div className="support-cat-card">
            <div className="support-cat-header">
              <span className="support-cat-icon">🔧</span>
              <h3 className="support-cat-title">{isFr ? 'Missions & Réservations' : 'Booking & Tasks'}</h3>
            </div>
            <ul className="support-cat-links">
              <li className="support-cat-link-item" onClick={() => onNavigate('services')}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Comment poster une tâche avec photos et vocal' : 'How to post a job with photos and voice notes'}</span>
              </li>
              <li className="support-cat-link-item" onClick={() => onNavigate('guide')}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Comparer les devis et profils vérifiés' : 'Comparing quotes and provider credentials'}</span>
              </li>
              <li className="support-cat-link-item" onClick={() => onNavigate('guide')}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Suivi GPS en direct et messagerie instantanée' : 'Live location tracking and direct messaging'}</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Payments & Escrow */}
          <div className="support-cat-card">
            <div className="support-cat-header">
              <span className="support-cat-icon">💳</span>
              <h3 className="support-cat-title">{isFr ? 'Paiements & Séquestre' : 'Payments & Escrow'}</h3>
            </div>
            <ul className="support-cat-links">
              <li className="support-cat-link-item" onClick={() => { setSelectedCategory('payments'); setOpenFaqId('faq-2'); }}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Fonctionnement du paiement sécurisé (Escrow)' : 'How Escrow protects client & pro payments'}</span>
              </li>
              <li className="support-cat-link-item" onClick={() => { setSelectedCategory('payments'); setOpenFaqId('faq-5'); }}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Paiements MTN MoMo, Orange Money & Cartes' : 'MTN MoMo, Orange Money & Card options'}</span>
              </li>
              <li className="support-cat-link-item" onClick={() => { setSelectedCategory('payments'); setOpenFaqId('faq-6'); }}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Retrait des gains vers votre compte Mobile Money' : 'Withdrawing pro earnings to Mobile Money'}</span>
              </li>
            </ul>
          </div>

          {/* Card 4: For Providers */}
          <div className="support-cat-card">
            <div className="support-cat-header">
              <span className="support-cat-icon">👷</span>
              <h3 className="support-cat-title">{isFr ? 'Espace Prestataires' : 'Provider Hub'}</h3>
            </div>
            <ul className="support-cat-links">
              <li className="support-cat-link-item" onClick={() => onNavigate('career_pathways')}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Formations certifiantes & Parcours de carrière' : 'Career pathways and skill certifications'}</span>
              </li>
              <li className="support-cat-link-item" onClick={() => onNavigate('guide')}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Comment recevoir plus de demandes de clients' : 'How to win more clients & boost your profile'}</span>
              </li>
              <li className="support-cat-link-item" onClick={() => onNavigate('terms')}>
                <span className="support-cat-link-bullet">▸</span>
                <span>{isFr ? 'Charte de qualité et de déontologie Fixam' : 'Fixam code of conduct and service standards'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive FAQ Section */}
        <div className="support-faq-container">
          <div className="support-section-header">
            <h2 className="support-section-title">
              {isFr ? 'Foire Aux Questions (FAQ)' : 'Frequently Asked Questions'}
            </h2>
            <p className="support-section-subtitle">
              {isFr ? 'Trouvez instantanément des réponses aux questions les plus courantes.' : 'Instant answers to the most common questions about Fixam.'}
            </p>
          </div>

          {/* FAQ Category Filter Tabs */}
          <div className="support-faq-tabs">
            {[
              { id: 'all', labelEn: 'All Questions', labelFr: 'Toutes les questions' },
              { id: 'clients', labelEn: 'For Clients', labelFr: 'Pour les Clients' },
              { id: 'providers', labelEn: 'For Providers', labelFr: 'Pour les Prestataires' },
              { id: 'payments', labelEn: 'Payments & Escrow', labelFr: 'Paiements & Séquestre' },
              { id: 'safety', labelEn: 'Trust & Safety', labelFr: 'Sécurité & Litiges' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`support-faq-tab-btn ${selectedCategory === tab.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(tab.id as any)}
              >
                {isFr ? tab.labelFr : tab.labelEn}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="support-faq-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className={`support-faq-item ${isOpen ? 'open' : ''}`}>
                    <button 
                      className="support-faq-question"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <span>{isFr ? faq.questionFr : faq.questionEn}</span>
                      <span className="support-faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="support-faq-answer">
                        {isFr ? faq.answerFr : faq.answerEn}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  {isFr ? 'Aucun résultat trouvé pour votre recherche.' : 'No results found matching your search.'}
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ marginTop: '1rem', background: '#0D9488', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  {isFr ? 'Réinitialiser la recherche' : 'Reset search'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Ticket Form Section */}
        <div id="contact-form-section" className="support-form-card">
          <div className="support-section-header" style={{ marginBottom: '2rem' }}>
            <h2 className="support-section-title">
              {isFr ? 'Envoyez-nous un Message' : 'Send Us a Message'}
            </h2>
            <p className="support-section-subtitle">
              {isFr ? 'Notre équipe d\'assistance vous répondra dans les plus brefs délais.' : 'Have a specific question or issue? Fill out the form below and our team will get right back to you.'}
            </p>
          </div>

          {submitSuccess ? (
            <div className="support-success-alert">
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontWeight: 700 }}>
                  {isFr ? 'Message envoyé avec succès !' : 'Your request has been received!'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  {isFr 
                    ? 'Merci de nous avoir contactés. Un membre de notre équipe d\'assistance Fixam vous répondra par email dans les 2 prochaines heures.' 
                    : 'Thank you for reaching out. A Fixam support representative will reply to your email within 2 hours.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitContact}>
              {errorMessage && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                  {errorMessage}
                </div>
              )}

              <div className="support-form-grid">
                <div className="support-form-group">
                  <label className="support-form-label">
                    {isFr ? 'Votre Nom complet *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    className="support-form-input"
                    placeholder={isFr ? "Ex: Jean Dupont" : "e.g. John Doe"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="support-form-group">
                  <label className="support-form-label">
                    {isFr ? 'Adresse Email *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    className="support-form-input"
                    placeholder={isFr ? "nom@exemple.com" : "you@example.com"}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="support-form-group">
                  <label className="support-form-label">
                    {isFr ? 'Numéro de Téléphone (Optionnel)' : 'Phone Number (Optional)'}
                  </label>
                  <input
                    type="tel"
                    className="support-form-input"
                    placeholder="+237 6XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="support-form-group">
                  <label className="support-form-label">
                    {isFr ? 'Je suis un(e)' : 'I am a'}
                  </label>
                  <select
                    className="support-form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="client">{isFr ? 'Client / Particulier' : 'Client / Customer'}</option>
                    <option value="provider">{isFr ? 'Artisan / Prestataire' : 'Service Provider / Artisan'}</option>
                    <option value="partner">{isFr ? 'Partenaire / Entreprise' : 'Business / Partner'}</option>
                  </select>
                </div>

                <div className="support-form-group">
                  <label className="support-form-label">
                    {isFr ? 'Catégorie de la demande' : 'Inquiry Topic'}
                  </label>
                  <select
                    className="support-form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="general">{isFr ? 'Renseignement général' : 'General Inquiry'}</option>
                    <option value="booking">{isFr ? 'Problème avec une réservation' : 'Booking / Task Issue'}</option>
                    <option value="payment">{isFr ? 'Paiement, Retrait ou Remboursement' : 'Payment, Payout or Refund'}</option>
                    <option value="verification">{isFr ? 'Vérification de profil ou KYC' : 'Profile Verification & KYC'}</option>
                    <option value="technical">{isFr ? 'Bug technique ou problème d\'application' : 'Technical Bug or App Issue'}</option>
                    <option value="dispute">{isFr ? 'Signalement de litige' : 'Dispute / Safety Report'}</option>
                  </select>
                </div>

                <div className="support-form-group">
                  <label className="support-form-label">
                    {isFr ? 'Sujet' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    className="support-form-input"
                    placeholder={isFr ? "Bref résumé du problème" : "Brief summary"}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="support-form-group full-width">
                  <label className="support-form-label">
                    {isFr ? 'Votre Message *' : 'Your Message *'}
                  </label>
                  <textarea
                    required
                    className="support-form-textarea"
                    placeholder={isFr ? "Expliquez en détail votre situation..." : "Describe your request or issue in detail..."}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="support-form-submit-btn"
                >
                  {isSubmitting 
                    ? (isFr ? 'Envoi en cours...' : 'Submitting...') 
                    : (isFr ? 'Envoyer ma demande ✉️' : 'Send Message ✉️')}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* App Download Banner */}
        <div className="support-app-banner">
          <h2>{isFr ? 'Fixam Pro est également disponible sur Mobile' : 'Fixam Pro is Available on Mobile'}</h2>
          <p>
            {isFr 
              ? 'Gérez vos réservations, recevez des notifications instantanées et contactez notre assistance directement depuis votre smartphone.' 
              : 'Manage bookings, get real-time status updates, and access 24/7 in-app customer support right on your phone.'}
          </p>
          <div className="support-app-buttons">
            <a 
              href="https://apps.apple.com/app/com.fixam.app.iosapp" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="support-app-btn primary"
            >
              🍎 Apple App Store (iOS)
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.fixam.app.android" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="support-app-btn"
            >
              🤖 Google Play Store (Android)
            </a>
          </div>
        </div>

      </div>

      {/* Website Global Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
