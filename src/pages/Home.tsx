import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, images, services, pros, Icon, IconName, ProCard, SectionTitle, Footer } from '../App';
import './Home.css';

const contentLocales = {
  en: {
    hero: {
      pills: ['Plumbing', 'Electrical', 'Cleaning', 'Moving', 'Beauty', 'Repairs']
    },
    stats: {
      providers: 'Verified Providers',
      tasks: 'Tasks Completed',
      rating: 'Average Rating',
      coverage: 'Active Regions'
    },
    howItWorks: {
      title: 'How Fixam Works',
      subtitle: 'Simple, fast, and secure',
      toggleClients: 'For Clients',
      toggleProviders: 'For Providers',
      clients: [
        {
          num: '01',
          title: 'Post Your Task',
          desc: 'Describe what service you need, your location, and your budget. It takes less than 2 minutes.'
        },
        {
          num: '02',
          title: 'Choose Your Provider',
          desc: 'Browse verified local providers, read their reviews, and book the one that fits your needs. Just 1 coin to reserve your booking.'
        },
        {
          num: '03',
          title: 'Get It Done',
          desc: 'Your provider completes the job. Track progress in real time and leave a review when finished.'
        }
      ],
      providers: [
        {
          num: '01',
          title: 'Create Your Profile',
          desc: 'Sign up for free, list your skills and experience, and upload your ID for verification to build client trust.'
        },
        {
          num: '02',
          title: 'Find Available Jobs',
          desc: 'Browse tasks posted by clients near you. Filter by category, location, and budget to find the right opportunities.'
        },
        {
          num: '03',
          title: 'Grow Your Business',
          desc: 'Complete jobs, earn 5-star reviews, and build your reputation to attract more clients and increase your earnings.'
        }
      ]
    },
    trust: {
      title: 'Why Clients Trust Fixam',
      subtitle: 'Everything you need to hire with confidence',
      items: [
        {
          title: 'Verified Provider Profiles',
          desc: 'Every provider goes through identity verification before taking on any job on Fixam.',
          icon: 'shield' as IconName
        },
        {
          title: 'Real Client Reviews',
          desc: 'Read honest reviews from real clients who have already worked with each provider on the platform.',
          icon: 'star' as IconName
        },
        {
          title: 'Direct Communication',
          desc: 'Message your provider directly before and during the job. Ask questions, share details, and stay informed.',
          icon: 'chat' as IconName
        },
        {
          title: 'Simple Booking System',
          desc: 'Use coins to book providers instantly. Pay your provider directly in cash after the job is done — no middleman.',
          icon: 'wallet' as IconName
        }
      ]
    },
    testimonials: {
      title: 'What Our Users Say',
      cards: [
        {
          quote: 'I posted a task for electrical repairs and had a qualified provider at my door the next morning. Fast, professional, and affordable.',
          name: 'Marie T.',
          role: 'Verified Client',
          avatarBg: '#14B8A6',
          initials: 'MT'
        },
        {
          quote: 'Fixam helped me grow my cleaning business from 2 clients to over 20 in just 3 months. The platform is easy to use and clients are serious.',
          name: 'Jean-Paul N.',
          role: 'Cleaning Expert',
          avatarBg: '#F97316',
          initials: 'JN'
        },
        {
          quote: "I love that I can see the provider's rating and reviews before booking. I feel safe using Fixam because I know exactly who is coming to my home.",
          name: 'Fatima A.',
          role: 'Verified Client',
          avatarBg: '#14B8A6',
          initials: 'FA'
        }
      ]
    },
    faq: {
      title: 'Frequently Asked Questions',
      categories: ['Getting Started', 'For Clients', 'For Providers', 'Booking & Coins', 'Safety & Trust', 'Account & Profile']
    },
    cta: {
      title: 'Ready to get started with Fixam?',
      subtitle: 'Join thousands of clients and providers across Cameroon',
      btnClient: 'Get Started as Client',
      btnPro: 'Join as Provider'
    }
  },
  fr: {
    hero: {
      pills: ['Plomberie', 'Électricité', 'Nettoyage', 'Déménagement', 'Beauté', 'Réparations']
    },
    stats: {
      providers: 'Prestataires Vérifiés',
      tasks: 'Tâches Accomplies',
      rating: 'Note Moyenne',
      coverage: 'Régions Actives'
    },
    howItWorks: {
      title: 'Comment Fixam Fonctionne',
      subtitle: 'Simple, rapide et sécurisé',
      toggleClients: 'Pour les Clients',
      toggleProviders: 'Pour les Prestataires',
      clients: [
        {
          num: '01',
          title: 'Publiez Votre Tâche',
          desc: 'Décrivez le service dont vous avez besoin, votre emplacement et votre budget. Cela prend moins de 2 minutes.'
        },
        {
          num: '02',
          title: 'Choisissez Votre Prestataire',
          desc: 'Parcourez les prestataires locaux vérifiés, lisez leurs avis et réservez celui qui correspond à vos besoins. Seulement 1 pièce pour réserver.'
        },
        {
          num: '03',
          title: "C'est Fait",
          desc: 'Votre prestataire termine le travail. Suivez les progrès en temps réel et laissez un avis une fois terminé.'
        }
      ],
      providers: [
        {
          num: '01',
          title: 'Créez Votre Profil',
          desc: 'Inscrivez-vous gratuitement, listez vos compétences et votre expérience, et téléchargez votre pièce d\'identité pour vérification.'
        },
        {
          num: '02',
          title: 'Trouvez des Emplois',
          desc: 'Parcourez les tâches publiées par les clients près de chez vous. Filtrez par catégorie, emplacement et budget.'
        },
        {
          num: '03',
          title: 'Développez Votre Activité',
          desc: 'Terminez les travaux, obtenez des avis 5 étoiles et bâtissez votre réputation pour attirer plus de clients.'
        }
      ]
    },
    trust: {
      title: 'Pourquoi les Clients Font Confiance à Fixam',
      subtitle: "Tout ce qu'il vous faut pour embaucher en toute confiance",
      items: [
        {
          title: 'Profils Vérifiés',
          desc: "Chaque prestataire passe par une vérification d'identité avant de prendre des tâches sur Fixam.",
          icon: 'shield' as IconName
        },
        {
          title: 'Avis Clients Réels',
          desc: 'Lisez des avis honnêtes de vrais clients qui ont déjà travaillé avec chaque prestataire.',
          icon: 'star' as IconName
        },
        {
          title: 'Communication Directe',
          desc: 'Envoyez des messages à votre prestataire avant et pendant le travail. Posez des questions, partagez des détails.',
          icon: 'chat' as IconName
        },
        {
          title: 'Système de Réservation Simple',
          desc: 'Utilisez des pièces pour réserver des prestataires instantanément. Payez votre prestataire directement en espèces après le travail — sans intermédiaire.',
          icon: 'wallet' as IconName
        }
      ]
    },
    testimonials: {
      title: 'Ce que Disent Nos Utilisateurs',
      cards: [
        {
          quote: "J'ai publié une tâche pour des réparations électriques et j'avais un prestataire qualifié à ma porte le lendemain matin. Rapide, professionnel et abordable.",
          name: 'Marie T.',
          role: 'Client Vérifié',
          avatarBg: '#14B8A6',
          initials: 'MT'
        },
        {
          quote: "Fixam m'a aidé à faire passer mon activité de nettoyage de 2 à plus de 20 clients en seulement 3 mois. La plateforme est facile à utiliser.",
          name: 'Jean-Paul N.',
          role: 'Expert de Nettoyage',
          avatarBg: '#F97316',
          initials: 'JN'
        },
        {
          quote: "J'aime pouvoir voir la note et les avis du prestataire avant de réserver. Je me sens en sécurité avec Fixam car je sais exactement qui vient chez moi.",
          name: 'Fatima A.',
          role: 'Client Vérifié',
          avatarBg: '#14B8A6',
          initials: 'FA'
        }
      ]
    },
    faq: {
      title: 'Questions Fréquemment Posées',
      categories: ['Démarrage', 'Pour les Clients', 'Pour les Prestataires', 'Réservation et Pièces', 'Sécurité et Confiance', 'Compte et Profil']
    },
    cta: {
      title: 'Prêt à commencer avec Fixam ?',
      subtitle: 'Rejoignez des milliers de clients et prestataires à travers le Cameroun',
      btnClient: 'Commencer comme Client',
      btnPro: 'Devenir Prestataire'
    }
  }
};

const faqQuestions = [
  {
    categoryEn: 'Getting Started',
    categoryFr: 'Démarrage',
    qEn: 'Is it free to create an account on Fixam?',
    qFr: 'Est-il gratuit de créer un compte sur Fixam ?',
    aEn: 'Yes, creating an account on Fixam is completely free for both clients and service providers. Clients can post tasks and browse providers at no cost. Providers can create their profile, list their services, and apply to jobs for free. You only use coins to book a provider — the actual service payment is made directly in cash to the provider.',
    aFr: 'Oui, la création d\'un compte sur Fixam est entièrement gratuite pour les clients et les prestataires de services. Les clients peuvent publier des tâches et parcourir les prestataires gratuitement. Les prestataires peuvent créer leur profil, lister leurs services et postuler à des emplois gratuitement. Vous n\'utilisez des pièces que pour réserver un prestataire — le paiement du service se fait directement en espèces au prestataire.'
  },
  {
    categoryEn: 'Getting Started',
    categoryFr: 'Démarrage',
    qEn: 'How do I get started on Fixam?',
    qFr: 'Comment commencer sur Fixam ?',
    aEn: 'Getting started is simple. Download the Fixam app, create your account with your phone number, verify your identity, and you are ready to either post a task as a client or create your provider profile and start finding work.',
    aFr: 'C\'est simple. Téléchargez l\'application Fixam, créez votre compte avec votre numéro de téléphone, vérifiez votre identité, et vous êtes prêt à publier une tâche en tant que client ou à créer votre profil de prestataire pour commencer à trouver du travail.'
  },
  {
    categoryEn: 'Getting Started',
    categoryFr: 'Démarrage',
    qEn: 'What areas does Fixam currently serve?',
    qFr: 'Dans quelles zones Fixam est-il disponible ?',
    aEn: 'Fixam is currently available in multiple cities, with plans to expand internationally to more regions soon. Check the app to see if providers are active in your specific area.',
    aFr: 'Fixam est actuellement disponible dans plusieurs villes, avec des projets d\'expansion internationale vers d\'autres régions prochainement. Consultez l\'application pour voir si des prestataires sont actifs dans votre zone.'
  },
  {
    categoryEn: 'For Clients',
    categoryFr: 'Pour les Clients',
    qEn: 'How does the coin system work for clients?',
    qFr: 'Comment fonctionne le système de pièces pour les clients ?',
    aEn: 'Coins are used as a small booking fee to reserve a provider on Fixam. As a client, you receive 1 free coin when you join. Standard bookings cost 1 coin, urgent bookings cost 2 coins, and emergency bookings cost 3 coins. You can top up your coin balance anytime using MTN Mobile Money or Orange Money. The actual payment for the service is made directly in cash to the provider after the job is completed.',
    aFr: 'Les pièces servent de petits frais de réservation pour réserver un prestataire sur Fixam. En tant que client, vous recevez 1 pièce gratuite à l\'inscription. Les réservations standard coûtent 1 pièce, les urgentes 2 pièces et les urgences absolues 3 pièces. Vous pouvez recharger votre solde de pièces à tout moment avec MTN Mobile Money ou Orange Money. Le paiement du service se fait directement en espèces au prestataire après la fin du travail.'
  },
  {
    categoryEn: 'For Clients',
    categoryFr: 'Pour les Clients',
    qEn: 'How do I book a provider?',
    qFr: 'Comment réserver un prestataire ?',
    aEn: 'Browse provider profiles, read their reviews and ratings, then tap the Book Now button on their profile. A small coin booking fee is deducted from your wallet based on your urgency level. The provider will receive a notification and confirm the booking. You then pay the provider directly in cash once the job is completed.',
    aFr: 'Parcourez les profils des prestataires, lisez leurs avis et notes, puis appuyez sur le bouton Réserver. Un petit frais de réservation en pièces est déduit de votre portefeuille en fonction du niveau d\'urgence. Le prestataire recevra une notification et confirmera la réservation. Vous payez ensuite le prestataire directement en espèces une fois le travail terminé.'
  },
  {
    categoryEn: 'For Clients',
    categoryFr: 'Pour les Clients',
    qEn: 'What if I am not satisfied with the service?',
    qFr: 'Que faire si je ne suis pas satisfait du service ?',
    aEn: 'If you have an issue with a completed job, you can contact Fixam support directly through the app\'s Help Center. Our team reviews all disputes and works to find a fair resolution for both parties.',
    aFr: 'Si vous rencontrez un problème avec un travail terminé, vous pouvez contacter le support Fixam directement via le Centre d\'aide de l\'application. Notre équipe examine tous les litiges et s\'efforce de trouver une solution équitable pour les deux parties.'
  },
  {
    categoryEn: 'For Providers',
    categoryFr: 'Pour les Prestataires',
    qEn: 'Is Fixam free for service providers?',
    qFr: 'Fixam est-il gratuit pour les prestataires ?',
    aEn: 'Yes, joining Fixam as a provider is free. You can create your profile, list your skills, and browse available tasks at no cost. Complete your identity verification to unlock the ability to apply for and accept jobs.',
    aFr: 'Oui, rejoindre Fixam en tant que prestataire est gratuit. Vous pouvez créer votre profil, lister vos compétences et parcourir les tâches disponibles sans frais. Effectuez votre vérification d\'identité pour débloquer la possibilité de postuler et d\'accepter des emplois.'
  },
  {
    categoryEn: 'For Providers',
    categoryFr: 'Pour les Prestataires',
    qEn: 'How do I get my first client on Fixam?',
    qFr: 'Comment obtenir mon premier client sur Fixam ?',
    aEn: 'After completing your profile and identity verification, you can start browsing and applying to tasks posted by clients in your area. A complete profile with a professional photo and detailed skills description significantly increases your chances of being selected.',
    aFr: 'Après avoir complété votre profil et votre vérification d\'identité, vous pouvez commencer à parcourir et à postuler aux tâches publiées par les clients de votre région. Un profil complet avec une photo professionnelle et une description détaillée de vos compétences augmente considérablement vos chances d\'être sélectionné.'
  },
  {
    categoryEn: 'For Providers',
    categoryFr: 'Pour les Prestataires',
    qEn: 'How do I build my reputation on Fixam?',
    qFr: 'Comment développer ma réputation sur Fixam ?',
    aEn: 'Complete jobs on time, communicate clearly with clients, and deliver quality work. Satisfied clients leave reviews and ratings that build your public reputation. Providers with high ratings get more visibility and are recommended more often on the platform.',
    aFr: 'Terminez les tâches à temps, communiquez clairement avec les clients et fournissez un travail de qualité. Les clients satisfaits laissent des avis et des notes qui renforcent votre réputation publique. Les prestataires bien notés bénéficient de plus de visibilité et sont plus souvent recommandés.'
  },
  {
    categoryEn: 'Booking & Coins',
    categoryFr: 'Réservation et Pièces',
    qEn: 'How do I add coins to my wallet?',
    qFr: 'Comment ajouter des pièces à mon portefeuille ?',
    aEn: 'Open the Fixam app, go to your Wallet, and tap Top Up. Select your preferred Mobile Money provider — MTN or Orange Money — enter your phone number and the amount, and approve the prompt on your phone. Coins are added to your wallet instantly after confirmation.',
    aFr: 'Ouvrez l\'application Fixam, allez dans votre Portefeuille et appuyez sur Recharger. Sélectionnez votre fournisseur Mobile Money préféré — MTN ou Orange Money — entrez votre numéro de téléphone et le montant, puis validez l\'invitation sur votre téléphone. Les pièces sont ajoutées instantanément après confirmation.'
  },
  {
    categoryEn: 'Booking & Coins',
    categoryFr: 'Réservation et Pièces',
    qEn: 'What Mobile Money providers are supported for coin top-ups?',
    qFr: 'Quels fournisseurs Mobile Money sont supportés pour les recharges de pièces ?',
    aEn: 'Fixam currently supports MTN Mobile Money and Orange Money for coin top-ups. Both are available for Cameroon phone numbers. Simply select your provider when topping up and make sure to use the phone number registered with that provider.',
    aFr: 'Fixam prend actuellement en charge MTN Mobile Money et Orange Money pour les recharges de pièces. Les deux sont disponibles pour les numéros de téléphone du Cameroun. Sélectionnez simplement votre fournisseur lors de la recharge et assurez-vous d\'utiliser le numéro enregistré chez ce fournisseur.'
  },
  {
    categoryEn: 'Booking & Coins',
    categoryFr: 'Réservation et Pièces',
    qEn: 'What is the minimum and maximum top-up amount?',
    qFr: 'Quel est le montant minimum et maximum de recharge ?',
    aEn: 'The minimum top-up amount is 100 FCFA and the maximum per single transaction is 10,000 FCFA. You can make multiple top-ups to add more coins to your wallet.',
    aFr: 'Le montant minimum de recharge est de 100 FCFA et le maximum par transaction unique est de 10 000 FCFA. Vous pouvez effectuer plusieurs recharges pour ajouter plus de pièces.'
  },
  {
    categoryEn: 'Safety & Trust',
    categoryFr: 'Sécurité et Confiance',
    qEn: 'How does Fixam verify providers?',
    qFr: 'Comment Fixam vérifie-t-il les prestataires ?',
    aEn: 'All providers on Fixam go through an identity verification process that includes submitting a valid government ID. Verified providers receive a verification badge on their profile, giving clients confidence in who they are hiring.',
    aFr: 'Tous les prestataires de Fixam passent par un processus de vérification d\'identité comprenant la soumission d\'une pièce d\'identité officielle valide. Les prestataires vérifiés reçoivent un badge de confiance sur leur profil, rassurant ainsi les clients.'
  },
  {
    categoryEn: 'Safety & Trust',
    categoryFr: 'Sécurité et Confiance',
    qEn: 'Is my personal information safe on Fixam?',
    qFr: 'Mes informations personnelles sont-elles sécurisées ?',
    aEn: 'Yes. Fixam takes your privacy seriously. Your personal information is encrypted and stored securely. We never share your contact details with providers or clients without your consent. Coin top-ups are processed through secure Mobile Money channels.',
    aFr: 'Oui. Fixam prend votre vie privée au sérieux. Vos informations personnelles sont chiffrées et stockées en toute sécurité. Nous ne partageons jamais vos coordonnées sans votre consentement. Les recharges de pièces sont traitées via des canaux Mobile Money sécurisés.'
  }
];

export default function Home({ onNavigate, livePros, onSelectSkill, setSearchQuery }: { onNavigate: (page: Page) => void; livePros: any[]; onSelectSkill?: (skill: string) => void; setSearchQuery: (query: string) => void }) {
  const { t, i18n } = useTranslation();
  const proGridRef = useRef<HTMLDivElement>(null);
  
  const currentLang = i18n.language === 'fr' ? 'fr' : 'en';
  const tContent = contentLocales[currentLang];

  // Interactivity States
  const [localSearch, setLocalSearch] = useState('');
  const [workToggle, setWorkToggle] = useState<'clients' | 'providers'>('clients');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [faqCategory, setFaqCategory] = useState<string>(currentLang === 'fr' ? 'Démarrage' : 'Getting Started');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      onNavigate('services');
    }
  };

  // Sync FAQ category when language changes
  useEffect(() => {
    setFaqCategory(i18n.language === 'fr' ? 'Démarrage' : 'Getting Started');
    setOpenFaqIndex(null);
  }, [i18n.language]);

  useEffect(() => {
    // Only auto-scroll on mobile where scrollWidth > clientWidth
    const interval = setInterval(() => {
      if (proGridRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = proGridRef.current;
        if (scrollWidth > clientWidth) {
          const maxScroll = scrollWidth - clientWidth;
          const nextScroll = scrollLeft + clientWidth * 0.85; // scroll by ~85vw
          if (nextScroll >= maxScroll) {
            proGridRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            proGridRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
          }
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const displayedPros = livePros && livePros.length > 0 ? livePros : pros;

  const handlePillClick = (pill: string) => {
    const cleanPill = pill.replace(/→$/, '').trim();
    if (onSelectSkill) {
      onSelectSkill(cleanPill);
      onNavigate('skill_detail');
    } else {
      onNavigate('services');
    }
  };

  const filteredFaq = faqQuestions.filter(faq => {
    const cat = i18n.language === 'fr' ? faq.categoryFr : faq.categoryEn;
    return cat === faqCategory;
  });

  return (
    <div className="landing-page">
      {/* Upgraded Hero with Video background/Image and Search/Pills */}
      <section className="hero-video-section-premium">
        <div className="hero-video-container">
          <img src={images.heroBg} alt="" className="hero-bg-image" />
          <div className="hero-video-overlay-premium"></div>
        </div>
        <div className="hero-copy video-copy reveal">
          <h1 className="hero-title">
            {t('hero.title1')} <span>{t('hero.title2')}</span> {t('hero.title3')}
          </h1>
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="hero-search-wrapper">
            <input 
              type="text" 
              placeholder={i18n.language === 'fr' ? "De quoi avez-vous besoin ?" : "What do you need help with?"} 
              className="hero-search-input" 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">
              {i18n.language === 'fr' ? 'Rechercher' : 'Search'}
            </button>
          </form>

          {/* Popular Pills */}
          <div className="hero-pills-row">
            <span className="pills-label">{i18n.language === 'fr' ? 'Populaire :' : 'Popular:'}</span>
            {tContent.hero.pills.map((pill, idx) => (
              <button key={idx} className="hero-pill-btn" onClick={() => handlePillClick(pill)}>
                {pill} →
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Social Proof Row */}
      <section className="social-proof-bar">
        <div className="social-proof-content">
          <div className="social-proof-item">
            <h3>500+</h3>
            <span>{tContent.stats.providers}</span>
          </div>
          <span className="social-proof-divider">|</span>
          <div className="social-proof-item">
            <h3>2,000+</h3>
            <span>{tContent.stats.tasks}</span>
          </div>
          <span className="social-proof-divider">|</span>
          <div className="social-proof-item">
            <h3>4.8★</h3>
            <span>{tContent.stats.rating}</span>
          </div>
          <span className="social-proof-divider">|</span>
          <div className="social-proof-item">
            <h3>Global Reach</h3>
            <span>{tContent.stats.coverage}</span>
          </div>
        </div>
      </section>

      {/* Premium How It Works Section */}
      <section className="how-it-works-premium">
        <div className="how-it-works-header-row">
          <div className="how-it-works-title-block">
            <h2>{tContent.howItWorks.title}</h2>
            <p>{tContent.howItWorks.subtitle}</p>
          </div>
          <div className="how-it-works-toggle-wrapper">
            <button 
              className={`toggle-btn ${workToggle === 'clients' ? 'active' : ''}`}
              onClick={() => setWorkToggle('clients')}
            >
              {tContent.howItWorks.toggleClients}
            </button>
            <button 
              className={`toggle-btn ${workToggle === 'providers' ? 'active' : ''}`}
              onClick={() => setWorkToggle('providers')}
            >
              {tContent.howItWorks.toggleProviders}
            </button>
          </div>
        </div>

        <div className="how-it-works-cards-grid">
          {(workToggle === 'clients' ? tContent.howItWorks.clients : tContent.howItWorks.providers).map((card, idx) => {
            const cardImages = [
              images.onboardingExperts,
              images.onboardingVerified,
              images.onboardingBook
            ];
            return (
              <div className="premium-work-card" key={idx}>
                <div className="premium-work-card-image">
                  <img src={cardImages[idx]} alt={card.title} />
                  <div className="premium-work-number">{card.num}</div>
                </div>
                <div className="premium-work-card-content">
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Clients Trust Fixam Section */}
      <section className="why-trust-fixam">
        <div className="trust-header">
          <h2>{tContent.trust.title}</h2>
          <p>{tContent.trust.subtitle}</p>
        </div>
        <div className="trust-cards-grid">
          {tContent.trust.items.map((item, idx) => (
            <div className="trust-card" key={idx}>
              <div className="trust-card-visual">
                <Icon name={item.icon} />
              </div>
              <div className="trust-card-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated Professionals Grid */}
      <section className="section" style={{ backgroundColor: 'var(--soft)' }}>
        <SectionTitle title={t('pros.title')} caption={t('pros.subtitle')} className="pros-title" />
        <div className="pro-grid" ref={proGridRef}>
          {displayedPros.map((pro) => (
            <ProCard key={pro.name} pro={pro} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="center-actions">
          <button className="outline-button" onClick={() => onNavigate('login')}>{t('pros.view_all')}</button>
        </div>
      </section>

      {/* Testimonials / Social Proof Section */}
      <section className="testimonials-section-new">
        <div className="testimonials-header" style={{ textAlign: 'center' }}>
          <h2>{tContent.testimonials.title}</h2>
        </div>

        {/* Desktop: 3-column grid (hidden on mobile) */}
        <div className="testimonials-grid-desktop">
          {tContent.testimonials.cards.map((card, idx) => (
            <div className="testimonial-card" key={idx}>
              <span className="quote-mark">"</span>
              <p className="quote-text">{card.quote}</p>
              <div className="testimonial-divider"></div>
              <div className="testimonial-author">
                <div className="author-avatar" style={{ backgroundColor: card.avatarBg }}>
                  {card.initials}
                </div>
                <div className="author-info">
                  <span className="author-name">{card.name}</span>
                  <span className="author-role">{card.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: single-card carousel with arrows (hidden on desktop) */}
        <div className="testimonial-carousel-mobile">
          <div className="testimonial-carousel-container">
            <button
              type="button"
              className="carousel-nav-btn prev"
              onClick={() => setActiveTestimonial((prev) => (prev === 0 ? tContent.testimonials.cards.length - 1 : prev - 1))}
              aria-label="Previous Testimonial"
            >‹</button>

            <div className="testimonial-carousel-track">
              {tContent.testimonials.cards.map((card, idx) => (
                <div
                  className={`testimonial-card ${activeTestimonial === idx ? 'active' : 'inactive'}`}
                  key={idx}
                  style={{ display: activeTestimonial === idx ? 'flex' : 'none' }}
                >
                  <span className="quote-mark">"</span>
                  <p className="quote-text">{card.quote}</p>
                  <div className="testimonial-divider"></div>
                  <div className="testimonial-author">
                    <div className="author-avatar" style={{ backgroundColor: card.avatarBg }}>
                      {card.initials}
                    </div>
                    <div className="author-info">
                      <span className="author-name">{card.name}</span>
                      <span className="author-role">{card.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="carousel-nav-btn next"
              onClick={() => setActiveTestimonial((prev) => (prev === tContent.testimonials.cards.length - 1 ? 0 : prev + 1))}
              aria-label="Next Testimonial"
            >›</button>
          </div>

          <div className="carousel-indicator-dots">
            {tContent.testimonials.cards.map((_, idx) => (
              <span
                key={idx}
                className={`indicator-dot ${activeTestimonial === idx ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(idx)}
              ></span>
            ))}
          </div>
        </div>
      </section>


      {/* Categorized Sticky FAQ Section */}
      <section className="faq-section-upgraded">
        <div className="faq-container-2col">
          <div className="faq-left-col-sticky">
            <h2>{i18n.language === 'fr' ? 'Questions Fréquemment Posées' : 'Frequently Asked Questions'}</h2>
            <div className="faq-category-list">
              {tContent.faq.categories.map((cat) => (
                <button 
                  key={cat} 
                  className={`faq-category-btn ${faqCategory === cat ? 'active' : ''}`}
                  onClick={() => { setFaqCategory(cat); setOpenFaqIndex(null); }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="faq-right-col-accordions">
            {filteredFaq.map((faq, idx) => {
              const q = i18n.language === 'fr' ? faq.qFr : faq.qEn;
              const a = i18n.language === 'fr' ? faq.aFr : faq.aEn;
              const isOpen = openFaqIndex === idx;
              return (
                <div className={`faq-accordion-item ${isOpen ? 'open' : ''}`} key={idx}>
                  <button className="faq-accordion-header" onClick={() => setOpenFaqIndex(isOpen ? null : idx)}>
                    <span>{q}</span>
                    <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div className={`faq-accordion-body ${isOpen ? 'open' : ''}`}>
                    <p>{a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teal Gradient CTA Banner */}
      <section className="cta-banner-teal">
        <div className="cta-banner-content">
          <h2>{tContent.cta.title}</h2>
          <p>{tContent.cta.subtitle}</p>
          <div className="cta-banner-actions">
            <button className="cta-pill-btn client" onClick={() => onNavigate('register')}>
              {tContent.cta.btnClient}
            </button>
            <button className="cta-pill-btn pro" onClick={() => onNavigate('register')}>
              {tContent.cta.btnPro}
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
