import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Icon, IconName, Footer, asset } from '../App';
import { useSEO } from '../hooks/useSEO';
import { usePlatformStats } from '../hooks/usePlatformStats';
import './Services.css';

const servicesContent = {
  en: {
    hero: {
      title: 'Hire Trusted Local Professionals',
      subtitle: 'Post your task, browse verified providers, and get the job done - all from your phone.',
      cta1: 'Post a Task',
      cta2: 'Browse Providers'
    },
    stats: [
      { value: '1,000+', label: 'Tasks Posted' },
      { value: '500+', label: 'Verified Providers' },
      { value: '4.8★', label: 'Client Satisfaction' },
      { value: 'Global Presence', label: 'Coverage Area' }
    ],
    howTo: {
      title: 'How to Hire on Fixam',
      cards: [
        {
          icon: 'briefcase' as IconName,
          title: 'Post Your Task',
          desc: 'Describe what you need, your location, and your budget. Posting a task is completely free and takes less than 2 minutes.',
          link: 'Post a task →'
        },
        {
          icon: 'user' as IconName,
          title: 'Review Providers',
          desc: 'Browse profiles, read reviews, and compare ratings. Our verification system ensures every provider has a confirmed identity.',
          link: 'Browse providers →'
        },
        {
          icon: 'check' as IconName,
          title: 'Get It Done',
          desc: 'Book your provider with zero booking fees. Communicate directly in-app, track progress, and pay upon full satisfaction.',
          link: 'How booking works →'
        }
      ]
    },
    confidence: {
      label: 'Hire with confidence',
      title: 'Know Exactly Who You\'re Hiring',
      desc: 'Every provider on Fixam has gone through identity verification. You can read real reviews from previous clients, see their rating history, and chat with them directly before making any commitment.',
      cta: 'Find a Provider'
    },
    coins: {
      title: 'How Booking & Payment Works',
      items: [
        {
          title: '100% Free Booking',
          desc: 'Book and connect with verified service professionals with zero booking fees. Reach out, discuss details, and hire with zero upfront charges.'
        },
        {
          title: 'Direct & Fair Payment',
          desc: 'Once the job is completed to your satisfaction, pay your provider directly in cash or Mobile Money (MTN MoMo / Orange Money).'
        },
        {
          title: 'Zero Hidden Fees',
          desc: 'Posting a task is free, booking is free, and applying for jobs is free. Transparent pricing with 100% of your payment going directly to the artisan.'
        }
      ],
      cta: 'Get Started'
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          q: 'How much does it cost to post a task and book a provider?',
          a: 'Posting a task and booking a provider on Fixam is 100% completely free. There are zero platform booking fees or middleman commissions.'
        },
        {
          q: 'How do I pay the provider for their work?',
          a: 'You pay the provider directly in cash or Mobile Money after the service is completed to your full satisfaction. The price is agreed upon before they start working.'
        },
        {
          q: 'Are the providers verified?',
          a: 'Yes, every provider on Fixam goes through an identity verification process with valid government IDs. We also encourage you to read their reviews from past clients.'
        },
        {
          q: 'What if I have a problem with a service?',
          a: 'You can contact our support team 24/7 through the app. We also rely on your honest reviews to maintain the quality of our marketplace.'
        },
        {
          q: 'Do you offer services in my area?',
          a: 'Fixam currently operates across major Cameroonian cities including Douala, Yaoundé, and Bafoussam. Enter your location to see verified providers near you.'
        }
      ]
    },
    bottomCta: {
      title: 'Ready to Get Your Task Done?',
      subtitle: 'Post your first task free today',
      btn: 'Post a Task Free'
    }
  },
  fr: {
    hero: {
      title: 'Engagez des Professionnels Locaux de Confiance',
      subtitle: 'Publiez votre tâche, parcourez les prestataires vérifiés et faites le travail - tout depuis votre téléphone.',
      cta1: 'Publier une Tâche',
      cta2: 'Parcourir les Prestataires'
    },
    stats: [
      { value: '1 000+', label: 'Tâches Publiées' },
      { value: '500+', label: 'Prestataires Vérifiés' },
      { value: '4.8★', label: 'Satisfaction Client' },
      { value: 'Présence Globale', label: 'Zone de Couverture' }
    ],
    howTo: {
      title: 'Comment Engager sur Fixam',
      cards: [
        {
          icon: 'briefcase' as IconName,
          title: 'Publiez Votre Tâche',
          desc: 'Décrivez le service dont vous avez besoin, votre emplacement et votre budget. Publier une tâche est entièrement gratuit et prend moins de 2 minutes.',
          link: 'Publier une tâche →'
        },
        {
          icon: 'user' as IconName,
          title: 'Examinez les Prestataires',
          desc: 'Parcourez les profils, lisez les avis et comparez les notes. Notre système de vérification garantit que chaque prestataire a une identité confirmée.',
          link: 'Parcourir les prestataires →'
        },
        {
          icon: 'check' as IconName,
          title: 'C\'est Fait',
          desc: 'Réservez votre prestataire sans frais de réservation, échangez directement via l\'application et suivez votre travail du début à la fin.',
          link: 'Comment fonctionne la réservation →'
        }
      ]
    },
    confidence: {
      label: 'Engagez en toute confiance',
      title: 'Sachez Exactement Qui Vous Engagez',
      desc: 'Chaque prestataire sur Fixam a subi une vérification d\'identité. Vous pouvez lire de vrais avis de clients précédents, voir leur historique et discuter avec eux avant tout engagement.',
      cta: 'Trouver un Prestataire'
    },
    coins: {
      title: 'Comment Fonctionnent la Réservation et le Paiement',
      items: [
        {
          title: 'Réservation 100% Gratuite',
          desc: 'Réservez et contactez des professionnels vérifiés sans aucuns frais de réservation. Discutez des détails et engagez en toute sérénité.'
        },
        {
          title: 'Paiement Direct et Équitable',
          desc: 'Une fois le travail terminé à votre satisfaction, vous payez votre prestataire directement en espèces ou par Mobile Money (MTN MoMo / Orange Money).'
        },
        {
          title: 'Zéro Frais Cachés',
          desc: 'La publication est gratuite, la réservation est gratuite et les candidatures sont gratuites. 100% de votre paiement va directement à l\'artisan.'
        }
      ],
      cta: 'Commencer'
    },
    faq: {
      title: 'Foire Aux Questions',
      items: [
        {
          q: 'Combien coûte la publication d\'une tâche et la réservation ?',
          a: 'La publication d\'une tâche et la réservation d\'un prestataire sur Fixam sont 100% gratuites. Il n\'y a aucun frais de réservation ni commission intermédiaire.'
        },
        {
          q: 'Comment payer le prestataire pour son travail ?',
          a: 'Vous payez le prestataire directement en espèces ou par Mobile Money une fois le service terminé à votre satisfaction. Le prix est convenu avant le début du travail.'
        },
        {
          q: 'Les prestataires sont-ils vérifiés ?',
          a: 'Oui, chaque prestataire sur Fixam passe par un processus de vérification d\'identité officiel. Nous vous encourageons également à lire leurs avis clients.'
        },
        {
          q: 'Que faire en cas de problème avec un service ?',
          a: 'Vous pouvez contacter notre équipe de support 24/7 via l\'application. Notre équipe intervient rapidement pour trouver une solution équitable.'
        },
        {
          q: 'Proposez-vous des services dans ma région ?',
          a: 'Fixam opère actuellement dans les principales villes du Cameroun (Douala, Yaoundé, Bafoussam). Entrez votre localisation pour trouver les prestataires proches.'
        }
      ]
    },
    bottomCta: {
      title: 'Prêt à Faire Réaliser Votre Tâche ?',
      subtitle: 'Publiez votre première tâche gratuitement',
      btn: 'Publier une Tâche Gratuitement'
    }
  }
};

export default function Services({ 
  onNavigate,
  searchQuery = '',
  setSearchQuery = () => {},
  serviceCategories = {},
  translateService = (name, desc) => ({ name, desc }),
  translateCat = (cat) => cat
}: { 
  onNavigate: (page: Page) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  serviceCategories?: Record<string, Array<{ name: string; desc: string; icon: string }>>;
  translateService?: (name: string, desc: string) => { name: string; desc: string };
  translateCat?: (cat: string) => string;
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';
  const c = servicesContent[lang];
  const { formatCompletedTasks, formatVerifiedPros, formatRating } = usePlatformStats();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useSEO({
    title: lang === 'fr' ? 'Annuaire des Services & Artisans Vérifiés au Cameroun' : 'Verified Trade Services & Artisans Directory in Cameroon',
    description: lang === 'fr'
      ? 'Parcourez toutes les catégories de services Fixam : plomberie, électricité, menuiserie, froid & clim, ménage, peinture et BTP à Douala et Yaoundé.'
      : 'Browse verified service categories on Fixam: plumbing, electrical, carpentry, AC repair, cleaning, painting, and construction across Cameroon.',
    canonical: 'https://usefixam.com/services',
    isFr: lang === 'fr'
  });

  const matchingServices: Array<{ cat: string; name: string; desc: string; icon: string }> = [];
  
  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    Object.keys(serviceCategories).forEach((cat) => {
      serviceCategories[cat].forEach((svc) => {
        const enName = svc.name.toLowerCase();
        const enDesc = svc.desc.toLowerCase();
        
        const frTrans = translateService(svc.name, svc.desc);
        const frName = frTrans.name.toLowerCase();
        const frDesc = frTrans.desc.toLowerCase();
        
        const catTrans = translateCat(cat).toLowerCase();
        const catEn = cat.toLowerCase();

        if (
          enName.includes(q) || 
          enDesc.includes(q) || 
          frName.includes(q) || 
          frDesc.includes(q) ||
          catEn.includes(q) ||
          catTrans.includes(q)
        ) {
          matchingServices.push({
            cat,
            name: svc.name,
            desc: svc.desc,
            icon: svc.icon
          });
        }
      });
    });
  }

  return (
    <div className="client-page-premium">
      
      {/* SECTION 1 - HERO */}
      <section className="client-hero-section">
        <div className="client-hero-container">
          <div className="client-hero-box">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&auto=format&fit=crop&q=80" 
              alt="Home professionals" 
              className="client-hero-img"
            />
            <div className="client-hero-overlay">
              <div className="client-hero-content">
                <h1>{c.hero.title}</h1>
                <p>{c.hero.subtitle}</p>
                <div className="client-hero-actions">
                  <button className="btn-primary-pill" onClick={() => onNavigate('register')}>
                    {c.hero.cta1}
                  </button>
                  <button className="btn-secondary-pill white-outline" onClick={() => onNavigate('register')}>
                    {c.hero.cta2}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {searchQuery && (
        <section className="search-results-section" style={{ padding: '3rem 0', background: 'var(--bg-alt, #F8FAFC)' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(20,184,166,0.1)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--ink)' }}>
                  {lang === 'fr' ? 'Résultats de recherche pour :' : 'Search results for:'} <span style={{ color: '#14B8A6' }}>"{searchQuery}"</span>
                </h2>
                <p style={{ color: 'var(--ink-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                  {lang === 'fr' 
                    ? `${matchingServices.length} service(s) trouvé(s)` 
                    : `${matchingServices.length} service(s) found`}
                </p>
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="btn-secondary-pill"
                style={{ minHeight: 'auto', padding: '0.5rem 1.2rem', fontSize: '0.85rem', cursor: 'pointer', border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink)' }}
              >
                {lang === 'fr' ? 'Effacer la recherche' : 'Clear Search'}
              </button>
            </div>

            {matchingServices.length > 0 ? (
              <div className="services-search-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {matchingServices.map((svc) => {
                  const translated = translateService(svc.name, svc.desc);
                  const catLabel = translateCat(svc.cat);
                  return (
                    <div 
                      key={svc.name} 
                      className="search-result-card" 
                      onClick={() => onNavigate('register')}
                      style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        padding: '1.2rem', 
                        borderRadius: '12px', 
                        background: 'var(--card-bg, #FFF)', 
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
                        border: '1px solid var(--line, rgba(0,0,0,0.05))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontSize: '2rem', display: 'flex', alignItems: 'center' }}>{svc.icon}</span>
                      <div>
                        <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: '700', color: '#14B8A6', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                          {catLabel}
                        </span>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--ink)', margin: '0 0 0.3rem 0' }}>
                          {translated.name}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', margin: 0, lineHeight: '1.3' }}>
                          {translated.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--card-bg, #FFF)', borderRadius: '16px', border: '1px dashed var(--line, rgba(0,0,0,0.1))' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--ink)' }}>
                  {lang === 'fr' ? 'Aucun service trouvé' : 'No services found'}
                </h3>
                <p style={{ color: 'var(--ink-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: '400px', marginInline: 'auto' }}>
                  {lang === 'fr' 
                    ? 'Essayez de rechercher des termes comme "ménage", "plomberie", "électricité", "coiffure" ou parcourez nos catégories ci-dessous.'
                    : 'Try searching for terms like "cleaning", "plumbing", "electrical", "hair" or browse our categories below.'}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2 - STATS BAR */}
      <section className="client-stats-section">
        <div className="client-stats-box">
          <div className="client-stats-grid">
            {[
              { value: formatCompletedTasks(lang === 'fr'), label: lang === 'fr' ? 'Missions Réalisées' : 'Tasks Completed' },
              { value: formatVerifiedPros(), label: lang === 'fr' ? 'Artisans Vérifiés' : 'Verified Providers' },
              { value: formatRating(), label: lang === 'fr' ? 'Satisfaction Client' : 'Client Satisfaction' },
              { value: lang === 'fr' ? 'Cameroun Entier' : 'National Coverage', label: lang === 'fr' ? 'Zone Couverte' : 'Coverage Area' }
            ].map((stat, idx) => (
              <div className="client-stat-item" key={idx}>
                <h3>{stat.value}</h3>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - HOW TO HIRE */}
      <section className="client-howto-section">
        <div className="container">
          <h2 className="section-heading-left">{c.howTo.title}</h2>
          <div className="client-howto-cards">
            {c.howTo.cards.map((card, idx) => (
              <div className="howto-card" key={idx}>
                <div className="howto-icon-wrapper">
                  <Icon name={card.icon} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <button className="link-teal" onClick={() => onNavigate('register')}>
                  {card.link}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - FEEL CONFIDENT */}
      <section className="client-split-section bg-light">
        <div className="container split-layout">
          <div className="split-left">
            <span className="split-label">{c.confidence.label}</span>
            <h2 className="split-heading">{c.confidence.title}</h2>
            <p className="split-desc">{c.confidence.desc}</p>
            <button className="btn-primary-pill" onClick={() => onNavigate('register')}>
              {c.confidence.cta}
            </button>
          </div>
          <div className="split-right">
            <div className="split-img-box">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80" 
                alt="Professional provider" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - HOW COINS WORK */}
      <section className="client-split-section">
        <div className="container split-layout reversed">
          <div className="split-left">
            <h2 className="split-heading">{c.coins.title}</h2>
            <div className="split-list">
              {c.coins.items.map((item, idx) => (
                <div className="split-list-item" key={idx}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
            <button className="btn-primary-pill" onClick={() => onNavigate('register')} style={{ marginTop: '2rem' }}>
              {c.coins.cta}
            </button>
          </div>
          <div className="split-right">
            <div className="split-img-box mobile-app-mockup">
              <img 
                src={asset('booking-payment-screenshot.png')} 
                alt="Mobile app wallet" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - CLIENT FAQ */}
      <section className="client-faq-section bg-light">
        <div className="container split-layout faq-layout">
          <div className="split-left">
            <h2 className="section-heading-left">{c.faq.title}</h2>
          </div>
          <div className="split-right">
            <div className="faq-accordion-list">
              {c.faq.items.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div className={`faq-accordion-item ${isOpen ? 'open' : ''}`} key={idx}>
                    <button className="faq-accordion-header" onClick={() => setOpenFaq(isOpen ? null : idx)}>
                      <span>{item.q}</span>
                      <Icon name={isOpen ? 'x' : 'menu'} />
                    </button>
                    <div className={`faq-accordion-body ${isOpen ? 'open' : ''}`}>
                      <p>{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - BOTTOM CTA */}
      <section className="client-bottom-cta">
        <div className="container">
          <div className="cta-banner-box">
            <h2>{c.bottomCta.title}</h2>
            <p>{c.bottomCta.subtitle}</p>
            <button className="btn-primary-pill white-variant" onClick={() => onNavigate('register')}>
              {c.bottomCta.btn}
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
