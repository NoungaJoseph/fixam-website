import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Icon, IconName, Footer } from '../App';
import './Guide.css';

const guideContent = {
  en: {
    hero: {
      title: 'Find Jobs the Way You Want',
      subtitle: 'Browse available tasks from clients across Cameroon. Apply, get selected, and grow your business.',
      cta: 'Get Started — it\'s free'
    },
    stats: {
      title: 'Trusted by providers across Cameroon',
      items: [
        { value: '500+', label: 'Active Providers' },
        { value: '10+', label: 'Categories' },
        { value: '4.8★', label: 'Provider Rating' },
        { value: 'Free', label: 'To Join' }
      ]
    },
    howTo: {
      title: 'How to Find Jobs on Fixam',
      cards: [
        {
          icon: 'user' as IconName,
          title: 'Create Your Profile (it\'s free)',
          desc: 'Sign up with your phone number, add your skills, work experience, and a clear profile photo. A complete profile gets you selected faster by clients looking for your exact skills.',
          link: 'Create profile →'
        },
        {
          icon: 'search' as IconName,
          title: 'Explore Available Jobs',
          desc: 'Browse tasks posted by clients near you. Filter by service category, location, and budget to find exactly the right opportunities that match your skills.',
          link: 'Browse jobs →'
        },
        {
          icon: 'shield' as IconName,
          title: 'Get Paid Reliably',
          desc: 'Once selected by a client, complete the job professionally and collect your payment. Build your reputation with great reviews and earn more bookings.',
          link: 'How payments work →'
        }
      ]
    },
    exploreEarn: {
      label: 'Explore the ways to earn',
      title: 'Find Your Next Opportunity',
      desc: 'Browse tasks posted by clients across Cameroon. Filter by your service category, set your availability, and apply to jobs that match your skills and schedule. Make your profile stand out and let clients come to you.',
      cta: 'Find Jobs'
    },
    payments: {
      title: 'How You Get Paid on Fixam',
      items: [
        {
          title: 'Direct Cash Payment',
          desc: 'Clients pay you directly in cash once the job is completed to their satisfaction. Fixam does not handle or hold your money.'
        },
        {
          title: 'You Set Your Price',
          desc: 'You agree on the price with the client before starting the work. Fixam does not take any cut of your earnings.'
        },
        {
          title: 'Build Your Income Over Time',
          desc: 'Complete more jobs, earn better ratings, and get more visibility. The more bookings you accept, the more your earning potential grows on Fixam.'
        }
      ],
      cta: 'Get Started Today'
    },
    showWork: {
      title: 'Show What You Do Best',
      services: [
        {
          initials: 'AK',
          name: 'Alain K.',
          title: 'House Cleaning',
          rate: 'From 5,000 FCFA',
          bg: '#14B8A6',
          img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'
        },
        {
          initials: 'MB',
          name: 'Marie B.',
          title: 'Electrical Repairs',
          rate: 'From 8,000 FCFA',
          bg: '#F97316',
          img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
        }
      ],
      textCard: {
        title: 'List Your Services on Fixam',
        desc: 'Create a complete profile showcasing your skills and experience. When clients post tasks matching your specialty, you get notified immediately.',
        cta: 'See All Jobs'
      }
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          q: 'Is it really free to join Fixam as a provider?',
          a: 'Yes, joining Fixam is completely free. There are no sign-up fees, monthly subscriptions, or hidden charges. You create your profile, get verified, and start finding clients at zero cost.'
        },
        {
          q: 'What documents do I need for verification?',
          a: 'You need a valid government-issued ID (national ID card, passport, or driver\'s license). We verify your identity to build trust with clients. The process is simple and usually takes less than 24 hours.'
        },
        {
          q: 'How do I get paid for my services?',
          a: 'Clients pay you directly in cash after the job is completed. You agree on the price with the client before starting the work. Fixam does not take a cut of your earnings.'
        },
        {
          q: 'Can I choose which jobs to accept?',
          a: 'Absolutely. You have full control over which tasks you apply to and accept. You can filter jobs by category, location, and budget to find the ones that match your skills and schedule.'
        },
        {
          q: 'How do I improve my chances of getting selected?',
          a: 'Complete your profile with a professional photo and detailed skill descriptions. Get verified. Respond quickly to client inquiries. Complete jobs on time and deliver quality work to earn 5-star reviews.'
        },
        {
          q: 'What areas does Fixam cover?',
          a: 'Fixam is currently available in multiple active cities, with plans to expand internationally to more regions. If you are a provider in these areas, you can start finding clients today.'
        }
      ]
    },
    bottomCta: {
      title: 'Ready to Start Earning?',
      subtitle: 'Join hundreds of providers growing their business with Fixam',
      btn: 'Create Free Profile'
    }
  },
  fr: {
    hero: {
      title: 'Trouvez des Emplois Comme Vous Voulez',
      subtitle: 'Parcourez les tâches disponibles des clients à travers le Cameroun. Postulez, soyez sélectionné et développez votre activité.',
      cta: 'Commencer — c\'est gratuit'
    },
    stats: {
      title: 'Approuvé par des prestataires à travers le Cameroun',
      items: [
        { value: '500+', label: 'Prestataires Actifs' },
        { value: '10+', label: 'Catégories' },
        { value: '4.8★', label: 'Note Moyenne' },
        { value: 'Gratuit', label: 'Pour Rejoindre' }
      ]
    },
    howTo: {
      title: 'Comment Trouver des Emplois sur Fixam',
      cards: [
        {
          icon: 'user' as IconName,
          title: 'Créez Votre Profil (c\'est gratuit)',
          desc: 'Inscrivez-vous avec votre numéro de téléphone, ajoutez vos compétences et une photo de profil claire. Un profil complet vous permet d\'être sélectionné plus rapidement par les clients.',
          link: 'Créer un profil →'
        },
        {
          icon: 'search' as IconName,
          title: 'Explorez les Emplois Disponibles',
          desc: 'Parcourez les tâches publiées par les clients près de chez vous. Filtrez par catégorie de service, lieu et budget pour trouver exactement les bonnes opportunités.',
          link: 'Parcourir les emplois →'
        },
        {
          icon: 'shield' as IconName,
          title: 'Soyez Payé de Façon Fiable',
          desc: 'Une fois sélectionné par un client, terminez le travail professionnellement. Bâtissez votre réputation avec d\'excellents avis et obtenez plus de réservations.',
          link: 'Comment fonctionnent les paiements →'
        }
      ]
    },
    exploreEarn: {
      label: 'Explorez les façons de gagner',
      title: 'Trouvez Votre Prochaine Opportunité',
      desc: 'Parcourez les tâches publiées par les clients à travers le Cameroun. Filtrez par votre catégorie de service, définissez votre disponibilité et postulez aux emplois qui correspondent à vos compétences et à votre emploi du temps.',
      cta: 'Trouver des emplois'
    },
    payments: {
      title: 'Comment Vous Êtes Payé sur Fixam',
      items: [
        {
          title: 'Paiement Direct en Espèces',
          desc: 'Les clients vous paient directement en espèces une fois le travail terminé à leur satisfaction. Fixam ne gère ni ne conserve votre argent.'
        },
        {
          title: 'Vous Fixez Votre Prix',
          desc: 'Vous convenez du prix avec le client avant de commencer le travail. Fixam ne prend aucune commission sur vos gains.'
        },
        {
          title: 'Construisez Votre Revenu au Fil du Temps',
          desc: 'Complétez plus de tâches, obtenez de meilleures notes et plus de visibilité. Plus vous acceptez de réservations, plus votre potentiel de gain augmente sur Fixam.'
        }
      ],
      cta: 'Commencer Aujourd\'hui'
    },
    showWork: {
      title: 'Montrez Ce Que Vous Faites de Mieux',
      services: [
        {
          initials: 'AK',
          name: 'Alain K.',
          title: 'Nettoyage de Maison',
          rate: 'À partir de 5 000 FCFA',
          bg: '#14B8A6',
          img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'
        },
        {
          initials: 'MB',
          name: 'Marie B.',
          title: 'Réparations Électriques',
          rate: 'À partir de 8 000 FCFA',
          bg: '#F97316',
          img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
        }
      ],
      textCard: {
        title: 'Listez Vos Services sur Fixam',
        desc: 'Créez un profil complet présentant vos compétences. Lorsque les clients publient des tâches correspondant à votre spécialité, vous êtes immédiatement informé.',
        cta: 'Voir Tous les Emplois'
      }
    },
    faq: {
      title: 'Foire Aux Questions',
      items: [
        {
          q: 'Est-ce vraiment gratuit de rejoindre Fixam en tant que prestataire ?',
          a: 'Oui, rejoindre Fixam est entièrement gratuit. Il n\'y a pas de frais d\'inscription, d\'abonnements mensuels ou de frais cachés. Vous créez votre profil, vous êtes vérifié et vous commencez à trouver des clients sans aucun coût.'
        },
        {
          q: 'Quels documents sont nécessaires pour la vérification ?',
          a: 'Vous avez besoin d\'une pièce d\'identité officielle valide (carte nationale d\'identité, passeport ou permis de conduire). Nous vérifions votre identité pour bâtir la confiance avec les clients. Le processus est simple et prend généralement moins de 24 heures.'
        },
        {
          q: 'Comment suis-je payé pour mes services ?',
          a: 'Les clients vous paient directement en espèces après la fin du travail. Vous convenez du prix avec le client avant de commencer. Fixam ne prend pas de commission sur vos gains.'
        },
        {
          q: 'Puis-je choisir quels emplois accepter ?',
          a: 'Absolument. Vous avez un contrôle total sur les tâches auxquelles vous postulez et que vous acceptez. Vous pouvez filtrer les emplois par catégorie, emplacement et budget pour trouver ceux qui correspondent à vos compétences et à votre emploi du temps.'
        },
        {
          q: 'Comment améliorer mes chances d\'être sélectionné ?',
          a: 'Complétez votre profil avec une photo professionnelle et des descriptions détaillées de vos compétences. Faites-vous vérifier. Répondez rapidement aux demandes des clients. Terminez les travaux à temps et fournissez un travail de qualité pour obtenir des avis 5 étoiles.'
        },
        {
          q: 'Quelles zones Fixam couvre-t-il ?',
          a: 'Fixam est actuellement disponible dans plusieurs villes actives, avec des projets d\'expansion internationale vers d\'autres régions. Si vous êtes prestataire dans ces zones, vous pouvez commencer à trouver des clients dès aujourd\'hui.'
        }
      ]
    },
    bottomCta: {
      title: 'Prêt à Commencer à Gagner ?',
      subtitle: 'Rejoignez des centaines de prestataires qui développent leur activité avec Fixam',
      btn: 'Créer un Profil Gratuit'
    }
  }
};

export default function Guide({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';
  const c = guideContent[lang];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="provider-page-premium">
      
      {/* SECTION 1 - HERO */}
      <section className="prov-hero-section">
        <div className="prov-hero-container">
          <div className="prov-hero-box">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80" 
              alt="Professional worker" 
              className="prov-hero-img"
            />
            <div className="prov-hero-overlay">
              <div className="prov-hero-content">
                <h1>{c.hero.title}</h1>
                <p>{c.hero.subtitle}</p>
                <button className="btn-primary-pill" onClick={() => onNavigate('register')}>
                  {c.hero.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - STATS BAR */}
      <section className="prov-stats-section">
        <div className="prov-stats-box">
          <p className="prov-stats-title">{c.stats.title}</p>
          <div className="prov-stats-grid">
            {c.stats.items.map((stat, idx) => (
              <div className="prov-stat-item" key={idx}>
                <h3>{stat.value}</h3>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - HOW TO FIND JOBS */}
      <section className="prov-howto-section">
        <div className="container">
          <h2 className="section-heading-left">{c.howTo.title}</h2>
          <div className="prov-howto-cards">
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

      {/* SECTION 4 - EXPLORE THE WAYS TO EARN */}
      <section className="prov-split-section">
        <div className="container split-layout">
          <div className="split-left">
            <span className="split-label">{c.exploreEarn.label}</span>
            <h2 className="split-heading">{c.exploreEarn.title}</h2>
            <p className="split-desc">{c.exploreEarn.desc}</p>
            <button className="btn-primary-pill" onClick={() => onNavigate('services')}>
              {c.exploreEarn.cta}
            </button>
          </div>
          <div className="split-right">
            <div className="split-img-box">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80" 
                alt="Professional working" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - HOW PAYMENTS WORK */}
      <section className="prov-split-section bg-light">
        <div className="container split-layout reversed">
          <div className="split-left">
            <h2 className="split-heading">{c.payments.title}</h2>
            <div className="split-list">
              {c.payments.items.map((item, idx) => (
                <div className="split-list-item" key={idx}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
            <button className="btn-primary-pill" onClick={() => onNavigate('register')} style={{ marginTop: '2rem' }}>
              {c.payments.cta}
            </button>
          </div>
          <div className="split-right">
            <div className="split-img-box">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80" 
                alt="Mobile payments" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - SHOW YOUR BEST WORK */}
      <section className="prov-show-work-section">
        <div className="container">
          <h2 className="section-heading-left">{c.showWork.title}</h2>
          <div className="show-work-cards">
            {c.showWork.services.map((svc, idx) => (
              <div className="work-service-card" key={idx}>
                <div className="work-img-container">
                  <img src={svc.img} alt={svc.title} />
                </div>
                <div className="work-card-content">
                  <div className="work-avatar" style={{ backgroundColor: svc.bg }}>{svc.initials}</div>
                  <span className="work-name">{svc.name}</span>
                  <h3 className="work-title">{svc.title}</h3>
                  <span className="work-rate">{svc.rate}</span>
                </div>
              </div>
            ))}
            
            <div className="work-text-card">
              <h3>{c.showWork.textCard.title}</h3>
              <p>{c.showWork.textCard.desc}</p>
              <button className="btn-secondary-pill" onClick={() => onNavigate('services')}>
                {c.showWork.textCard.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - PROVIDER FAQ */}
      <section className="prov-faq-section">
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

      {/* SECTION 8 - BOTTOM CTA */}
      <section className="prov-bottom-cta">
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
