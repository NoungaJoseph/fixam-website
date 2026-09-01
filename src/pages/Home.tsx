import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, images, services, pros, Icon, IconName, ProCard, SectionTitle, Footer, serviceCategories } from '../App';
import AssistantModal from '../components/AssistantModal';
import { HeroTechIllustration, DifferenceTechIllustration, WhatWeDoEmblem } from '../components/TechIllustrations';
import './Home.css';

const contentLocales = {
  en: {
    hero: {
      eyebrow: 'Cameroon\'s #1 Verified Marketplace',
      title1: 'The Leading Tech-Enabled',
      titleHighlight: 'On-Demand Service',
      title2: 'Marketplace.',
      desc: 'Powered by verified trade professionals, smart matching algorithms, and direct transparent payments, so you get quality work done faster, safer, and reliably.',
      btnPrimary: 'Post a Task Free',
      btnSecondary: 'Explore Solutions',
      pills: ['Plumbing', 'Electrical', 'Cleaning', 'Moving', 'Beauty', 'Repairs']
    },
    metrics: {
      col1Title: 'Why Choose Fixam?',
      col1Desc: 'The leader in verified, on-demand & trusted trade services',
      col2Num: '10,000+',
      col2Title: 'Completed Tasks',
      col2Desc: 'Trusted by households and businesses across Cameroon',
      col3Num: '500+',
      col3Title: 'Verified Trade Pros',
      col3Desc: 'Across Douala, Yaoundé, Bafoussam, Buea, and Limbe',
      col4Num: '100% Free',
      col4Title: 'Zero Booking Fees',
      col4Desc: 'Direct transparent pricing with cash or Mobile Money'
    },
    whatWeDo: {
      title: 'What we do',
      desc: 'Fixam provides key, technology-enabled and verified solutions for everyday home repairs, construction, plumbing, electrical installations, appliance maintenance, cleaning, and professional artisan services across Cameroon.'
    },
    difference: {
      eyebrow: 'The Fixam Difference',
      title: 'Why Clients Choose Fixam',
      items: [
        {
          bold: '100% Free Booking & Direct Payments',
          text: 'connect and book verified service providers with zero platform booking fees or middleman commissions.'
        },
        {
          bold: 'Strict Identity & Skill Verification',
          text: 'every professional undergoes national ID validation, background vetting, and skill assessment before taking jobs.'
        },
        {
          bold: 'Real-Time Smart Matching',
          text: 'smart matching connects your task with qualified local pros in minutes, saving you time and stress.'
        },
        {
          bold: 'Authentic Client Reviews & Ratings',
          text: 'read authentic reviews and track record scores from real homeowners before hiring.'
        },
        {
          bold: 'Dedicated Support & Dispute Mediation',
          text: 'our resolution team actively assists users to guarantee high quality and mutual satisfaction.'
        }
      ]
    },
    stats: {
      providers: 'Verified Providers',
      tasks: 'Tasks Completed',
      rating: 'Average Rating',
      coverage: 'Active Regions'
    },
    howItWorks: {
      title: 'How Fixam Works',
      subtitle: 'Simple, fast, and 100% free to connect',
      toggleClients: 'For Clients',
      toggleProviders: 'For Providers',
      clients: [
        {
          num: '01',
          title: 'Post Your Task',
          desc: 'Describe what service you need, your location, and your budget. It takes less than 2 minutes and is completely free.'
        },
        {
          num: '02',
          title: 'Choose Your Provider',
          desc: 'Browse verified local providers, read their reviews, and book the one that fits your needs with zero booking fees.'
        },
        {
          num: '03',
          title: 'Get It Done',
          desc: 'Your provider completes the job. Track progress in real time, pay directly upon satisfaction, and leave a review.'
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
          title: 'Find & Apply for Jobs',
          desc: 'Browse tasks posted by clients near you and apply for free. Filter by category, location, and budget.'
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
          title: 'Free & Transparent Booking',
          desc: 'Book providers directly with 0% platform booking fees. Pay your provider directly in cash or Mobile Money after the job is done.',
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
      categories: ['Getting Started', 'For Clients', 'For Providers', 'Booking & Payments', 'Safety & Trust', 'Account & Profile']
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
      eyebrow: 'Place de Marché N°1 Vérifiée au Cameroun',
      title1: 'La Première Plateforme Technologique de',
      titleHighlight: 'Services à la Demande',
      title2: 'au Cameroun.',
      desc: 'Alimentée par des artisans vérifiés, des algorithmes de mise en relation intelligente et des paiements directs et transparents, pour des travaux rapides, fiables et en toute sécurité.',
      btnPrimary: 'Publier une Tâche Gratuite',
      btnSecondary: 'Découvrir les Solutions',
      pills: ['Plomberie', 'Électricité', 'Nettoyage', 'Déménagement', 'Beauté', 'Réparations']
    },
    metrics: {
      col1Title: 'Pourquoi Choisir Fixam ?',
      col1Desc: 'Le leader des services professionnels vérifiés et à la demande',
      col2Num: '10 000+',
      col2Title: 'Missions Réalisées',
      col2Desc: 'Recommandé par les foyers et entreprises du Cameroun',
      col3Num: '500+',
      col3Title: 'Artisans Vérifiés',
      col3Desc: 'À Douala, Yaoundé, Bafoussam, Buéa et Limbé',
      col4Num: '100% Gratuit',
      col4Title: 'Zéro Frais de Réservation',
      col4Desc: 'Tarifs directs et transparents en espèces ou Mobile Money'
    },
    whatWeDo: {
      title: 'Ce que nous faisons',
      desc: 'Fixam fournit des solutions technologiques et vérifiées pour les réparations domestiques, la plomberie, l\'électricité, la maintenance, le nettoyage, les chantiers et les services d\'artisanat au Cameroun.'
    },
    difference: {
      eyebrow: 'La Différence Fixam',
      title: 'Pourquoi les Clients Choisissent Fixam',
      items: [
        {
          bold: 'Réservation 100% Gratuite & Paiements Directs :',
          text: 'réservez et contactez des artisans vérifiés avec zéro frais de réservation ni commission intermédiaire.'
        },
        {
          bold: 'Vérification Stricte d\'Identité et de Compétences :',
          text: 'chaque professionnel est validé par pièce d\'identité officielle avant toute intervention.'
        },
        {
          bold: 'Mise en Relation Intelligente et Instantanée :',
          text: 'trouvez le prestataire qualifié et le plus proche en quelques minutes seulement.'
        },
        {
          bold: 'Avis Clients et Notations Authentiques :',
          text: 'consultez l\'historique réel et les retours d\'expérience certifiés avant d\'embaucher.'
        },
        {
          bold: 'Assistance et Médiation Dédiées :',
          text: 'notre équipe veille au bon déroulement de chaque prestation pour une satisfaction totale.'
        }
      ]
    },
    stats: {
      providers: 'Prestataires Vérifiés',
      tasks: 'Tâches Accomplies',
      rating: 'Note Moyenne',
      coverage: 'Régions Actives'
    },
    howItWorks: {
      title: 'Comment Fixam Fonctionne',
      subtitle: 'Simple, rapide et 100% gratuit pour se connecter',
      toggleClients: 'Pour les Clients',
      toggleProviders: 'Pour les Prestataires',
      clients: [
        {
          num: '01',
          title: 'Publiez Votre Tâche',
          desc: 'Décrivez le service dont vous avez besoin, votre emplacement et votre budget. Cela prend moins de 2 minutes et c\'est totalement gratuit.'
        },
        {
          num: '02',
          title: 'Choisissez Votre Prestataire',
          desc: 'Parcourez les prestataires locaux vérifiés, lisez leurs avis et réservez celui qui correspond à vos besoins sans aucun frais de réservation.'
        },
        {
          num: '03',
          title: "C'est Fait",
          desc: 'Votre prestataire termine le travail. Suivez les progrès en temps réel, payez directement après satisfaction et laissez un avis.'
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
          title: 'Trouvez et Postulez aux Emplois',
          desc: 'Parcourez les tâches publiées par les clients près de chez vous et postulez gratuitement. Filtrez par catégorie, emplacement et budget.'
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
          title: 'Réservation Gratuite et Transparente',
          desc: 'Réservez des prestataires sans frais de réservation. Payez directement votre artisan en espèces ou Mobile Money après prestation.',
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
      categories: ['Démarrage', 'Pour les Clients', 'Pour les Prestataires', 'Réservation et Paiements', 'Sécurité et Confiance', 'Compte et Profil']
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
    qEn: 'Is it free to create an account and use Fixam?',
    qFr: 'Est-il gratuit de créer un compte et d\'utiliser Fixam ?',
    aEn: 'Yes! Creating an account, posting tasks, booking providers, and applying for jobs are all 100% completely free on Fixam. Clients pay their providers directly after the service is completed to satisfaction.',
    aFr: 'Oui ! La création de compte, la publication de missions, la réservation de prestataires et les candidatures aux emplois sont 100% gratuites sur Fixam. Les clients paient directement leurs prestataires une fois la prestation terminée à leur satisfaction.'
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
    aEn: 'Fixam is currently available in multiple cities across Cameroon including Douala, Yaoundé, and Bafoussam. Check the app to find verified providers active in your neighborhood.',
    aFr: 'Fixam est actuellement disponible dans plusieurs villes du Cameroun, notamment Douala, Yaoundé et Bafoussam. Consultez l\'application pour trouver des prestataires vérifiés dans votre quartier.'
  },
  {
    categoryEn: 'For Clients',
    categoryFr: 'Pour les Clients',
    qEn: 'How much does it cost to book a provider?',
    qFr: 'Combien coûte la réservation d\'un prestataire ?',
    aEn: 'Booking a provider on Fixam is 100% free. There are no platform booking fees or middleman charges. You agree on the price with the professional and pay them directly in cash or Mobile Money once the work is completed.',
    aFr: 'La réservation d\'un prestataire sur Fixam est 100% gratuite. Il n\'y a aucun frais de réservation ni commission intermédiaire. Vous convenez du tarif avec le professionnel et le réglez directement en espèces ou Mobile Money une fois le travail achevé.'
  },
  {
    categoryEn: 'For Clients',
    categoryFr: 'Pour les Clients',
    qEn: 'How do I book a provider?',
    qFr: 'Comment réserver un prestataire ?',
    aEn: 'Browse provider profiles, read their reviews and ratings, then tap the Book Now button on their profile or post a task. The provider will receive an instant notification to accept and communicate with you directly.',
    aFr: 'Parcourez les profils des prestataires, lisez leurs avis et notes, puis appuyez sur le bouton Réserver ou publiez votre tâche. Le prestataire recevra une notification instantanée pour accepter et échanger directement avec vous.'
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
    qEn: 'Is applying for jobs free for service providers?',
    qFr: 'Postuler à des emplois est-il gratuit pour les prestataires ?',
    aEn: 'Yes! Service providers can join, complete their identity verification, and apply for client job posts completely free of charge. You keep 100% of the money you earn from clients.',
    aFr: 'Oui ! Les prestataires peuvent s\'inscrire, valider leur pièce d\'identité et postuler aux missions des clients tout à fait gratuitement. Vous conservez 100% de ce que vous gagnez.'
  },
  {
    categoryEn: 'For Providers',
    categoryFr: 'Pour les Prestataires',
    qEn: 'How do I get my first client on Fixam?',
    qFr: 'Comment obtenir mon premier client sur Fixam ?',
    aEn: 'After completing your profile and identity verification, you can start browsing and applying to tasks posted by clients in your area for free. A complete profile with a professional photo and detailed skills description significantly increases your chances of being selected.',
    aFr: 'Après avoir complété votre profil et votre vérification d\'identité, vous pouvez commencer à parcourir et à postuler gratuitement aux tâches publiées par les clients de votre région. Un profil soigné augmente considérablement vos chances d\'être sélectionné.'
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
    categoryEn: 'Booking & Payments',
    categoryFr: 'Réservation et Paiements',
    qEn: 'How do payments work between clients and providers?',
    qFr: 'Comment fonctionnent les paiements entre clients et prestataires ?',
    aEn: 'Payment is direct and hassle-free. Clients and providers agree on the job scope and price. Once the task is completed to full satisfaction, payment is made directly via cash or Mobile Money (MTN MoMo or Orange Money).',
    aFr: 'Le paiement est direct et sans tracas. Le client et le prestataire conviennent du prix et du périmètre. Une fois la mission achevée avec succès, le règlement s\'effectue directement en espèces ou via Mobile Money (MTN MoMo ou Orange Money).'
  },
  {
    categoryEn: 'Booking & Payments',
    categoryFr: 'Réservation et Paiements',
    qEn: 'What are Fixam Coins used for?',
    qFr: 'À quoi servent les pièces Fixam ?',
    aEn: 'Fixam Coins are optional platform credits used by providers who wish to boost their profile visibility or feature their listings at the top of search results. Standard booking and applying for regular tasks is always 100% free.',
    aFr: 'Les pièces Fixam sont des crédits optionnels utilisés par les prestataires souhaitant booster la visibilité de leur profil ou mettre en avant leurs annonces en tête des résultats. La réservation standard et les candidatures sont toujours 100% gratuites.'
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
    aEn: 'Yes. Fixam takes your privacy seriously. Your personal information is encrypted and stored securely. We never share your contact details without your consent.',
    aFr: 'Oui. Fixam prend votre vie privée au sérieux. Vos informations personnelles sont chiffrées et stockées en toute sécurité. Nous ne partageons jamais vos coordonnées sans votre consentement.'
  }
];

export default function Home({ onNavigate, livePros, onSelectSkill, setSearchQuery }: { onNavigate: (page: Page) => void; livePros: any[]; onSelectSkill?: (skill: string) => void; setSearchQuery: (query: string) => void }) {
  const { t, i18n } = useTranslation();
  const proGridRef = useRef<HTMLDivElement>(null);
  
  const currentLang = i18n.language === 'fr' ? 'fr' : 'en';
  const tContent = contentLocales[currentLang];

  // Assistant Pop-up Modal State (Only shows once, persists dismissal)
  const [isAssistantOpen, setIsAssistantOpen] = useState(() => {
    try {
      const dismissed = localStorage.getItem('fixam_assistant_modal_dismissed');
      return dismissed !== 'true';
    } catch {
      return false;
    }
  });

  const handleCloseAssistant = () => {
    setIsAssistantOpen(false);
    try {
      localStorage.setItem('fixam_assistant_modal_dismissed', 'true');
    } catch {}
  };

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
    const interval = setInterval(() => {
      if (proGridRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = proGridRef.current;
        if (scrollWidth > clientWidth) {
          const maxScroll = scrollWidth - clientWidth;
          const nextScroll = scrollLeft + clientWidth * 0.85;
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
    <div className="landing-page tsi-styled-page">
      {/* 1. Assistant Pop-up Modal (Only shows once, closes permanently on dismissal) */}
      <AssistantModal 
        isOpen={isAssistantOpen} 
        onClose={handleCloseAssistant} 
        onNavigate={(page) => {
          handleCloseAssistant();
          onNavigate(page);
        }}
        isFr={currentLang === 'fr'}
      />

      {/* Floating Assistant Trigger ("Need help?" + Chat Bubble from screenshots) */}
      <div 
        className="floating-assistant-trigger" 
        onClick={() => setIsAssistantOpen(true)}
        title="Need help?"
      >
        <span className="floating-help-bubble">Need help?</span>
        <div className="floating-chat-circle">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        </div>
      </div>

      {/* Floating Accessibility Trigger (Bottom Left from screenshots) */}
      <div 
        className="floating-accessibility-icon"
        onClick={() => setIsAssistantOpen(true)}
        title="Accessibility & Assistant"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <circle cx="12" cy="4" r="2"/>
          <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.67-.32-1.47-.23-2.06.22l-1.92 1.48C8.38 9.5 7.7 9.85 7 9.94V13h2v-2.03l1.1-.85 1.9 4.88H7v2h7v-2h-3.13l-1.32-3.4 1.15-.89c.86.95 2.08 1.5 3.3 1.44V13h5z"/>
        </svg>
      </div>

      {/* 2. Top Hero Section (Matching Image 3) */}
      <section className="tsi-hero-section">
        <div className="tsi-hero-container">
          {/* Left Column: Copy & Actions */}
          <div className="tsi-hero-left">
            <h1 className="tsi-hero-headline">
              {tContent.hero.title1}{' '}
              <span className="tsi-hero-highlight">{tContent.hero.titleHighlight}</span>{' '}
              {tContent.hero.title2}
            </h1>

            <p className="tsi-hero-subtitle">
              {tContent.hero.desc}
            </p>

            <div className="tsi-hero-cta-group">
              <button 
                className="tsi-btn-primary"
                onClick={() => onNavigate('services')}
              >
                {tContent.hero.btnPrimary}
              </button>
              <button 
                className="tsi-btn-secondary"
                onClick={() => onNavigate('services')}
              >
                {tContent.hero.btnSecondary}
              </button>
            </div>

            {/* Quick Search & Popular Chips */}
            <div className="tsi-hero-quick-search-box">
              <form onSubmit={handleSearchSubmit} className="tsi-search-bar">
                <input 
                  type="text" 
                  placeholder={currentLang === 'fr' ? "Rechercher un plombier, électricien, maçon..." : "Search for a plumber, electrician, painter..."} 
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="tsi-search-input"
                />
                <button type="submit" className="tsi-search-submit-btn">
                  {currentLang === 'fr' ? 'Rechercher' : 'Search'}
                </button>
              </form>

              <div className="tsi-pills-row">
                <span className="tsi-pills-label">{currentLang === 'fr' ? 'Populaire :' : 'Popular:'}</span>
                {tContent.hero.pills.map((pill, idx) => (
                  <button key={idx} className="tsi-pill-tag" onClick={() => handlePillClick(pill)}>
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Vector Illustration (Matching Image 3) */}
          <div className="tsi-hero-right">
            <HeroTechIllustration />
          </div>
        </div>
      </section>

      {/* 3. Floating Stats Ribbon & "What we do" Dark Banner (Matching Image 4) */}
      <section className="tsi-stats-and-what-we-do-section">
        {/* Floating 4-Column Metric Ribbon */}
        <div className="tsi-floating-stats-bar">
          <div className="tsi-stat-col tsi-stat-col-first">
            <h3 className="tsi-stat-brand-heading">{tContent.metrics.col1Title}</h3>
            <p className="tsi-stat-brand-sub">{tContent.metrics.col1Desc}</p>
          </div>
          <div className="tsi-stat-col">
            <div className="tsi-stat-large-val">{tContent.metrics.col2Num}</div>
            <div className="tsi-stat-sub-label">{tContent.metrics.col2Title}</div>
            <p className="tsi-stat-detail">{tContent.metrics.col2Desc}</p>
          </div>
          <div className="tsi-stat-col">
            <div className="tsi-stat-large-val">{tContent.metrics.col3Num}</div>
            <div className="tsi-stat-sub-label">{tContent.metrics.col3Title}</div>
            <p className="tsi-stat-detail">{tContent.metrics.col3Desc}</p>
          </div>
          <div className="tsi-stat-col">
            <div className="tsi-stat-large-val">{tContent.metrics.col4Num}</div>
            <div className="tsi-stat-sub-label">{tContent.metrics.col4Title}</div>
            <p className="tsi-stat-detail">{tContent.metrics.col4Desc}</p>
          </div>
        </div>

        {/* "What we do" Deep Navy Tech Banner */}
        <div className="tsi-what-we-do-banner">
          <div className="tsi-what-we-do-content">
            <div className="tsi-what-we-do-text">
              <h2 className="tsi-what-we-do-heading">{tContent.whatWeDo.title}</h2>
              <p className="tsi-what-we-do-paragraph">{tContent.whatWeDo.desc}</p>
            </div>
            <div className="tsi-what-we-do-emblem">
              <WhatWeDoEmblem />
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Fixam Difference / Why Clients Choose Fixam (Matching Image 2) */}
      <section className="tsi-difference-section">
        <div className="tsi-difference-container">
          {/* Left Column: Difference Vector Illustration */}
          <div className="tsi-diff-left">
            <DifferenceTechIllustration />
          </div>

          {/* Right Column: Copy and Styled Square Bullet List */}
          <div className="tsi-diff-right">
            <span className="tsi-diff-eyebrow">{tContent.difference.eyebrow}</span>
            <h2 className="tsi-diff-heading">{tContent.difference.title}</h2>

            <ul className="tsi-diff-bullet-list">
              {tContent.difference.items.map((item, idx) => (
                <li key={idx} className="tsi-diff-bullet-item">
                  <span className="tsi-bullet-square"></span>
                  <div className="tsi-bullet-content">
                    <strong>{item.bold}</strong> {item.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. How Fixam Works Section */}
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

      {/* Top Rated Professionals Grid */}
      <section className="section" style={{ backgroundColor: '#F8FAFC', padding: '4.5rem 0' }}>
        <SectionTitle title={t('pros.title')} caption={t('pros.subtitle')} className="pros-title" />
        <div className="pro-grid" ref={proGridRef}>
          {displayedPros.slice(0, 6).map((pro) => (
            <ProCard key={pro.name} pro={pro} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="center-actions" style={{ marginTop: '2.5rem' }}>
          <button className="tsi-btn-primary" onClick={() => onNavigate('services')}>
            {t('pros.view_all')}
          </button>
        </div>
      </section>

      {/* Testimonials / Social Proof Section */}
      <section className="testimonials-section-new">
        <div className="testimonials-header" style={{ textAlign: 'center' }}>
          <h2>{tContent.testimonials.title}</h2>
        </div>

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

        {/* Mobile Testimonials Carousel */}
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
            <h2>{currentLang === 'fr' ? 'Questions Fréquemment Posées' : 'Frequently Asked Questions'}</h2>
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
              const q = currentLang === 'fr' ? faq.qFr : faq.qEn;
              const a = currentLang === 'fr' ? faq.aFr : faq.aEn;
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

      {/* Remote & On-site Jobs Announcement Section (Mobile App Showcase) */}
      <section className="opportunities-section-premium">
        <div className="opportunities-container">
          <div className="opportunities-visual">
            <div className="badge-glow-pro">{i18n.language === 'fr' ? 'APPLICATION MOBILE' : 'MOBILE APP'}</div>
            <div className="floating-sphere"></div>
            <img src={images.appHomeScreen} alt="Fixam Mobile App Screen showing remote job listings" className="app-mockup-img" />
          </div>
          <div className="opportunities-content">
            <h2>
              {i18n.language === 'fr' 
                ? 'Trouvez de réelles opportunités, sur site ou entièrement à distance' 
                : 'Find real opportunities, on-site or fully remote'}
            </h2>
            <p className="lead-text">
              {i18n.language === 'fr'
                ? "Fixam connecte les professionnels qualifiés et les clients au Cameroun avec des opportunités concrètes, vérifiées et 100% sans commission."
                : "Fixam connects skilled trade professionals and clients across Cameroon with concrete, verified job opportunities with 0% platform commission."}
            </p>
            <div className="features-checklist">
              <div className="checklist-item">
                <span className="check-icon">✓</span>
                <div>
                  <strong>{i18n.language === 'fr' ? 'Missions sur site' : 'On-site assignments'}</strong>
                  <p>{i18n.language === 'fr' ? 'Collaborez avec des clients locaux dans votre ville ou quartier.' : 'Collaborate with local clients in your city or neighborhood.'}</p>
                </div>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✓</span>
                <div>
                  <strong>{i18n.language === 'fr' ? 'Réservations 100% gratuites' : '100% Free Bookings'}</strong>
                  <p>{i18n.language === 'fr' ? 'Aucun frais de réservation prélevé sur vos missions.' : 'Zero booking fees charged on your bookings and tasks.'}</p>
                </div>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✓</span>
                <div>
                  <strong>{i18n.language === 'fr' ? 'Tarifs et horaires libres' : 'Flexible rates & schedules'}</strong>
                  <p>{i18n.language === 'fr' ? 'Définissez votre propre tarif horaire et travaillez selon vos conditions.' : 'Set your own hourly rate and work on your own terms.'}</p>
                </div>
              </div>
            </div>
            <p style={{ marginTop: '1.5rem', color: '#64748B', fontSize: '0.9rem' }}>
              {i18n.language === 'fr'
                ? "Téléchargez l'application mobile Fixam aujourd'hui pour publier votre profil, ajouter vos compétences, certifications et commencer à trouver du travail."
                : "Download the Fixam mobile app today to publish your profile, add your skills, certifications, and start finding work."}
            </p>
            <div className="store-download-row">
              <a href="https://apps.apple.com/app/com.fixam.app.iosapp" target="_blank" rel="noopener noreferrer" className="store-badge-premium apple">
                Apple App Store
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.fixam.app.android" target="_blank" rel="noopener noreferrer" className="store-badge-premium google">
                Google Play Store
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Teal Gradient CTA Banner */}
      <section className="cta-banner-teal">
        <div className="cta-banner-content">
          <h2>{tContent.cta.title}</h2>
          <p>{tContent.cta.subtitle}</p>
          <div className="cta-banner-actions">
            <button className="cta-pill-btn client" onClick={() => onNavigate('services')}>
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

