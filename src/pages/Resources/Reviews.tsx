import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Footer, getApiUrl } from '../../App';
import './Reviews.css';

// Data structures for multi-language content
const reviewsContent = {
  en: {
    hero: {
      title: "Reviews on Fixam: From Real Users, For Real Users",
      subtext: "Discover how clients and providers worldwide have transformed their lives using Fixam's trusted service marketplace.",
      cta: "Join Fixam",
      stats: {
        starsLabel: "5/5",
        stat1Num: "500+",
        stat1Label: "reviews on Fixam from verified users",
        stat2Num: "4.8/5",
        stat2Label: "average provider rating across all categories"
      }
    },
    howItWorks: {
      title: "How It Works",
      cta1: "Join Fixam",
      cta2: "Learn How to Hire",
      cards: [
        {
          title: "Post a Task",
          desc: "Describe the service you need, your location, and your budget. It takes less than 2 minutes and is completely free."
        },
        {
          title: "Providers Come to You",
          desc: "Verified providers see your task and apply. Review their profiles, ratings, and reviews to choose the best match for your needs."
        },
        {
          title: "Collaborate Easily",
          desc: "Use the Fixam app to message your provider directly, share job details, and track progress from booking to completion."
        },
        {
          title: "Simple Coin Payments",
          desc: "Top up with MTN or Orange Mobile Money and use coins to book providers. Transparent pricing, no hidden fees."
        }
      ]
    },
    successStories: {
      heading: "Customer Success Stories",
      back: "← Back",
      next: "Next →",
      stories: [
        {
          initials: "AK",
          bgColor: "#14B8A6",
          title: "How Alain Kamga grew his electrical business from 3 to 30 clients in 6 months using Fixam",
          img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=800&auto=format&fit=crop&q=80"
        },
        {
          title: "How Marie Ngo found reliable home cleaning services she could actually trust for her family",
          img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
        },
        {
          title: "How Pierre Biya doubled his monthly income as a plumber by joining the Fixam provider network",
          img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&auto=format&fit=crop&q=80"
        },
        {
          initials: "SF",
          bgColor: "#F97316",
          title: "How Sophie Fotso found the right beauty professional for her wedding day in just 24 hours on Fixam",
          img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&auto=format&fit=crop&q=80"
        }
      ]
    },
    testimonialStats: {
      quote: "Whether I needed a plumber urgently or wanted to plan a house cleaning in advance, I always use Fixam first. The providers are professional and I can see their real ratings before booking.",
      author: "Adjoua M., Client",
      stat1: {
        num: "24 hours",
        desc: "average time to find and book a provider on Fixam"
      },
      stat2: {
        num: "4.8 / 5",
        desc: "average satisfaction rating from Fixam clients across Cameroon"
      }
    },
    whyChoose: {
      heading: "Why Clients Choose Fixam",
      cards: [
        {
          tag: "Home Services",
          title: "From needing repairs to trusting Fixam every time",
          metric1: "Booked within 2 hours",
          metric2: "5-star rating received",
          btn: "Read more",
          img: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&auto=format&fit=crop&q=80"
        },
        {
          tag: "Cleaning",
          title: "How finding the right cleaner changed my home routine completely",
          metric1: "Service completed same day",
          metric2: "Re-booked 3 times",
          btn: "Read more",
          img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
        },
        {
          tag: "Plumbing",
          title: "Emergency plumbing fixed in under 3 hours using Fixam",
          metric1: "Provider arrived in 45 minutes",
          metric2: "Problem fully resolved same day",
          btn: "Read more",
          img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80"
        }
      ]
    },
    connectBanner: {
      title: "Connect with professionals who understand what you need, and hire them to get the job done right.",
      btn1: "Get Started Free",
      btn2: "Learn How to Hire",
      img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80"
    },
    userReviews: {
      heading: "What Users Say About Fixam",
      sortBy: "Sort by",
      sorts: {
        recent: "Most recent",
        highest: "Highest rated",
        helpful: "Most helpful"
      },
      categoryLabel: "Service Category",
      categories: {
        all: "All Categories",
        home: "Home Services",
        electrical: "Electrical",
        plumbing: "Plumbing",
        cleaning: "Cleaning",
        beauty: "Beauty & Wellness",
        moving: "Moving & Delivery",
        repairs: "Repairs",
        security: "Security"
      },
      userTypeLabel: "User Type",
      userTypes: {
        all: "All users",
        clients: "Clients",
        providers: "Providers"
      },
      moreText: " More",
      lessText: " Less",
      metadataLabel: "Individual user",
      metadataLabelPro: "Provider",
      reviews: [
        {
          title: "Fixam made finding a reliable electrician so simple",
          rating: 5,
          date: "May 2026",
          category: "Electrical",
          isPro: false,
          text: "I was struggling to find a trusted electrician in my area. A friend told me about Fixam and I was amazed at how easy it was. I posted my task, received applications within an hour, and had someone at my door the next morning. The work was done professionally and the provider was very respectful. I will definitely use Fixam again.",
          reviewer: "Celestine A."
        },
        {
          title: "Best way to find reliable cleaning services",
          rating: 5,
          date: "May 2026",
          category: "Cleaning",
          isPro: false,
          text: "I use Fixam every month for house cleaning. The providers are always verified and I can see their real reviews before booking. The coin system makes it so easy to pay (I just top up with MTN Mobile Money and book directly from the app). Highly recommend to any family looking for reliable home services.",
          reviewer: "Paulette M."
        },
        {
          title: "As a provider, Fixam changed my business completely",
          rating: 5,
          date: "April 2026",
          category: "Plumbing",
          isPro: true,
          text: "Before Fixam, I was spending hours looking for clients. Now they find me. I complete 8 to 12 jobs per week through the platform. The app is easy to use and clients communicate clearly about what they need. My income has increased by more than 200% since joining.",
          reviewer: "Jean-Claude N."
        },
        {
          title: "Quick, trustworthy, and very professional service",
          rating: 5,
          date: "April 2026",
          category: "Beauty & Wellness",
          isPro: false,
          text: "I needed a makeup artist for my sister's traditional ceremony on short notice. I posted the task on Fixam and within 30 minutes had 4 applications. The provider I chose was excellent and arrived right on time. She did a beautiful job and my sister was so happy. Fixam is now my first choice for beauty services.",
          reviewer: "Nadège F."
        },
        {
          title: "Moving made stress-free with Fixam providers",
          rating: 4,
          date: "March 2026",
          category: "Moving & Delivery",
          isPro: false,
          text: "I was worried about my apartment move but Fixam made it so much easier. I found a moving team the same day, negotiated the budget through the app, and everything went smoothly. The only reason for 4 stars instead of 5 is that I wish there were more providers available in my area. But overall great experience.",
          reviewer: "Bernard T."
        },
        {
          title: "Fixam is the future of finding local services in Cameroon",
          rating: 5,
          date: "March 2026",
          category: "Home Services",
          isPro: false,
          text: "I have used Fixam for electrical work, cleaning, and plumbing repairs all in the last 3 months. Every single time the experience has been professional and reliable. You can see the provider's verification badge and real ratings which gives so much confidence. This is exactly what Cameroon needed.",
          reviewer: "Rosalie K."
        },
        {
          title: "The coin system is genius for budget management",
          rating: 5,
          date: "February 2026",
          category: "Repairs",
          isPro: false,
          text: "What I love most about Fixam is the coin payment system. I can top up with exactly what I need using Orange Money and there are no surprises. The booking process is clear and transparent. My handyman through Fixam has now become my regular go-to person for any home repairs.",
          reviewer: "Gaston M."
        },
        {
          title: "Growing my provider business has never been easier",
          rating: 5,
          date: "February 2026",
          category: "Security",
          isPro: true,
          text: "I install security systems and cameras. Before Fixam I relied only on word of mouth which was very inconsistent. Since joining Fixam as a verified provider I have a steady stream of clients booking me for security installations. The verification badge really helps clients trust me. Very grateful for this platform.",
          reviewer: "Emmanuel B."
        }
      ]
    },
    faq: {
      heading: "Frequently asked questions",
      categories: {
        started: "Getting Started",
        clients: "For Clients",
        providers: "For Providers",
        payments: "Payments",
        safety: "Safety"
      },
      readMore: "Read more",
      showLess: "Show less",
      items: [
        {
          category: "Getting Started",
          q: "Is Fixam free to join?",
          a: "Yes, creating an account on Fixam is completely free for both clients and service providers. Clients can post tasks and browse provider profiles at no cost. Providers can create their profile and apply for jobs without any fee. You only spend coins when booking a provider or applying for certain featured jobs. New users receive 1 free welcome coin when they join, so you can get started right away."
        },
        {
          category: "Getting Started",
          q: "Can I grow my business or career with Fixam?",
          a: "Yes, many of our most successful providers have built consistent income streams using Fixam. Whether you are an electrician, plumber, cleaner, beauty professional, or any other service provider, Fixam gives you access to a growing community of clients actively looking for your skills. Complete your identity verification, build your profile, and start receiving bookings. The more jobs you complete with great reviews, the more visible you become to new clients."
        },
        {
          category: "For Clients",
          q: "Are providers on Fixam real and trustworthy?",
          a: "Yes, all providers on Fixam go through identity verification before accepting jobs. They must submit a valid government ID which our team reviews. Verified providers receive a verification badge on their profile. In addition, every completed job generates a real review from the client, so you can see an honest track record before booking anyone. We also have a reporting system that allows clients to flag any issues with a provider's conduct."
        },
        {
          category: "For Clients",
          q: "What kinds of services can I get done on Fixam?",
          a: "Fixam supports a wide range of service categories including electrical work, plumbing, house cleaning, interior repairs, moving and delivery, beauty and wellness, security system installation, tutoring, gardening, and more. If your task involves a local professional service in Cameroon, you will likely find the right provider on Fixam. New service categories are added regularly based on user demand."
        },
        {
          category: "For Providers",
          q: "How does Fixam support long-term client relationships?",
          a: "Fixam makes it easy to build lasting relationships with your clients. After completing a job, clients can re-book you directly from your profile. Your ratings and completed job count are permanently displayed, building your reputation over time. Providers who consistently deliver quality work tend to receive more direct bookings as clients come back to them instead of searching for new providers each time."
        },
        {
          category: "For Providers",
          q: "What do real users say about their Fixam experience?",
          a: "Real Fixam users consistently highlight the ease of finding quality providers or clients, the trust that comes from verified profiles, and the convenience of Mobile Money payments. Clients love the ability to see real ratings and reviews before booking. Providers appreciate the steady flow of job opportunities and the professional communication tools in the app. You can read real reviews from our users in the section above."
        },
        {
          category: "Payments",
          q: "How do Mobile Money payments work on Fixam?",
          a: "Fixam uses a simple coin system for all platform transactions. To add coins to your wallet, open the app, go to your Wallet, and tap Top Up. Select MTN Mobile Money or Orange Money, enter your number and amount, and approve the payment prompt on your phone. Coins are added instantly after confirmation. The minimum top-up is 100 FCFA and the maximum per single transaction is 10,000 FCFA. Coins are then used to book providers — 1 coin for normal bookings, 2 for urgent, 3 for emergency."
        },
        {
          category: "Safety",
          q: "Is Fixam a secure and legitimate platform?",
          a: "Yes, Fixam is a legitimate and trusted service marketplace built for Cameroon. All providers go through identity verification. All payments are processed through secure Mobile Money channels — MTN and Orange. Your personal data is encrypted and stored securely. We never share your contact details without your consent. Our team monitors the platform and responds to reports of misconduct. We are committed to building a safe and reliable marketplace that Cameroonian families and businesses can trust."
        }
      ]
    },
    skills: {
      categories: ["Top Services", "Most Booked", "Best Rated", "New on Fixam"],
      lists: {
        "Top Services": [
          ["House Cleaning", "Electrical Repairs", "Plumbing Services", "Security Installation", "Painting & Decoration", "Moving & Delivery", "Carpentry Work", "AC Installation & Repair", "Generator Repair", "Welding Services", "Tile & Flooring Work", "Roof Repair"],
          ["Beauty & Makeup", "Hair Styling", "Nail Technician", "Home Tutoring", "Garden Maintenance", "Pool Cleaning", "CCTV Installation", "Pest Control", "Laundry Service", "Event Decoration", "Photography", "Catering Services"]
        ],
        "Most Booked": [
          ["House Cleaning", "Plumbing Services", "Electrical Repairs", "AC Installation & Repair", "Generator Repair", "Moving & Delivery"],
          ["Hair Styling", "Beauty & Makeup", "CCTV Installation", "Garden Maintenance", "Home Tutoring", "Roof Repair"]
        ],
        "Best Rated": [
          ["Electrical Repairs", "Security Installation", "Tile & Flooring Work", "Welding Services", "CCTV Installation", "Pest Control"],
          ["Beauty & Makeup", "Nail Technician", "Home Tutoring", "Event Decoration", "Photography", "Catering Services"]
        ],
        "New on Fixam": [
          ["Pool Cleaning", "Laundry Service", "Tailoring", "Tiling", "AC Installation & Repair", "Roof Repair"],
          ["Generator Repair", "CCTV Installation", "Garden Maintenance", "Event Decoration", "Catering Services", "Welding Services"]
        ]
      }
    }
  },
  fr: {
    hero: {
      title: "Avis sur Fixam: De Vrais Utilisateurs, Pour de Vrais Utilisateurs",
      subtext: "Découvrez comment les clients et prestataires à travers le monde ont transformé leur vie grâce à Fixam.",
      cta: "Rejoindre Fixam",
      stats: {
        starsLabel: "5/5",
        stat1Num: "500+",
        stat1Label: "avis sur Fixam d'utilisateurs vérifiés",
        stat2Num: "4.8/5",
        stat2Label: "note moyenne des prestataires dans toutes les catégories"
      }
    },
    howItWorks: {
      title: "Comment ça fonctionne",
      cta1: "Rejoindre Fixam",
      cta2: "Apprendre à Embaucher",
      cards: [
        {
          title: "Publiez une Tâche",
          desc: "Décrivez le service dont vous avez besoin, votre emplacement et votre budget. Cela prend moins de 2 minutes et c'est totalement gratuit."
        },
        {
          title: "Les Prestataires Viennent à Vous",
          desc: "Des prestataires vérifiés voient votre tâche et postulent. Consultez leurs profils, notes et avis pour choisir le meilleur profil."
        },
        {
          title: "Collaborez Facilement",
          desc: "Utilisez l'application Fixam pour envoyer des messages à votre prestataire, partager les détails et suivre l'avancement."
        },
        {
          title: "Paiements Simples par Pièces",
          desc: "Rechargez avec MTN ou Orange Mobile Money et utilisez des pièces pour réserver. Tarifs transparents, pas de frais cachés."
        }
      ]
    },
    successStories: {
      heading: "Histoires de Succès",
      back: "← Retour",
      next: "Suivant →",
      stories: [
        {
          initials: "AK",
          bgColor: "#14B8A6",
          title: "Comment Alain Kamga a développé son activité électrique de 3 à 30 clients en 6 mois grâce à Fixam",
          img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=800&auto=format&fit=crop&q=80"
        },
        {
          title: "Comment Marie Ngo a trouvé des services de nettoyage fiables auxquels elle peut faire confiance",
          img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
        },
        {
          title: "Comment Pierre Biya a doublé son revenu mensuel en tant que plombier en rejoignant Fixam",
          img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&auto=format&fit=crop&q=80"
        },
        {
          initials: "SF",
          bgColor: "#F97316",
          title: "Comment Sophie Fotso a trouvé la bonne professionnelle de beauté pour son mariage en seulement 24 heures",
          img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&auto=format&fit=crop&q=80"
        }
      ]
    },
    testimonialStats: {
      quote: "Que j'aie besoin d'un plombier d'urgence ou que je veuille planifier un nettoyage, j'utilise toujours Fixam en premier. Les prestataires sont professionnels.",
      author: "Adjoua M., Client",
      stat1: {
        num: "24 heures",
        desc: "temps moyen pour trouver et réserver un prestataire sur Fixam"
      },
      stat2: {
        num: "4.8 / 5",
        desc: "note de satisfaction moyenne des clients Fixam à travers le Cameroun"
      }
    },
    whyChoose: {
      heading: "Pourquoi les Clients Choisissent Fixam",
      cards: [
        {
          tag: "Services à Domicile",
          title: "De la nécessité de réparations à faire confiance à Fixam",
          metric1: "Réservé en moins de 2 heures",
          metric2: "Note de 5 étoiles reçue",
          btn: "Lire la suite",
          img: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&auto=format&fit=crop&q=80"
        },
        {
          tag: "Nettoyage",
          title: "Comment trouver la bonne femme de ménage a changé ma routine à la maison",
          metric1: "Service complété le jour même",
          metric2: "Réservée 3 fois de suite",
          btn: "Lire la suite",
          img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
        },
        {
          tag: "Plomberie",
          title: "Plomberie d'urgence réparée en moins de 3 heures avec Fixam",
          metric1: "Prestataire arrivé en 45 minutes",
          metric2: "Problème résolu le jour même",
          btn: "Lire la suite",
          img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80"
        }
      ]
    },
    connectBanner: {
      title: "Connectez-vous avec des professionnels qui comprennent vos besoins et engagez-les pour que le travail soit bien fait.",
      btn1: "Commencer Gratuitement",
      btn2: "Apprendre à Embaucher",
      img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80"
    },
    userReviews: {
      heading: "Ce que les Utilisateurs Disent de Fixam",
      sortBy: "Trier par",
      sorts: {
        recent: "Plus récent",
        highest: "Mieux noté",
        helpful: "Plus utile"
      },
      categoryLabel: "Catégorie de Service",
      categories: {
        all: "Toutes les Catégories",
        home: "Services à Domicile",
        electrical: "Électricité",
        plumbing: "Plomberie",
        cleaning: "Nettoyage",
        beauty: "Beauté & Bien-être",
        moving: "Déménagement & Livraison",
        repairs: "Réparations",
        security: "Sécurité"
      },
      userTypeLabel: "Type d'Utilisateur",
      userTypes: {
        all: "Tous les utilisateurs",
        clients: "Clients",
        providers: "Prestataires"
      },
      moreText: " Plus",
      lessText: " Moins",
      metadataLabel: "Utilisateur individuel",
      metadataLabelPro: "Prestataire",
      reviews: [
        {
          title: "Fixam a rendu la recherche d'un électricien fiable si simple",
          rating: 5,
          date: "Mai 2026",
          category: "Electrical",
          isPro: false,
          text: "Je n'arrivais pas à trouver un électricien de confiance dans ma région. Un ami m'a parlé de Fixam et j'ai été étonnée par la facilité. J'ai publié ma tâche, reçu des offres dans l'heure, et quelqu'un était là le lendemain matin. Le travail a été fait de manière professionnelle.",
          reviewer: "Celestine A."
        },
        {
          title: "La meilleure façon de trouver des services de nettoyage fiables",
          rating: 5,
          date: "Mai 2026",
          category: "Cleaning",
          isPro: false,
          text: "J'utilise Fixam chaque mois pour le ménage. Les prestataires sont toujours vérifiés et je peux voir les vrais avis avant de réserver. Le système de pièces facilite la réservation (je recharge avec MTN Mobile Money et je réserve). Je recommande vivement.",
          reviewer: "Paulette M."
        },
        {
          title: "En tant que prestataire, Fixam a complètement changé mon activité",
          rating: 5,
          date: "Avril 2026",
          category: "Plumbing",
          isPro: true,
          text: "Avant Fixam, je passais des heures à chercher des clients. Maintenant, ils me trouvent. Je réalise 8 à 12 travaux par semaine grâce à la plateforme. L'application est facile à utiliser et mes revenus ont augmenté de 200%.",
          reviewer: "Jean-Claude N."
        },
        {
          title: "Service rapide, fiable et très professionnel",
          rating: 5,
          date: "Avril 2026",
          category: "Beauty & Wellness",
          isPro: false,
          text: "J'avais besoin d'une maquilleuse en urgence pour la cérémonie traditionnelle de ma sœur. Publié sur Fixam et 4 propositions reçues en 30 minutes. Elle a fait un travail magnifique. Fixam est devenu mon premier choix.",
          reviewer: "Nadège F."
        },
        {
          title: "Déménagement sans stress avec les prestataires Fixam",
          rating: 4,
          date: "Mars 2026",
          category: "Moving & Delivery",
          isPro: false,
          text: "Je m'inquiétais pour mon déménagement mais Fixam a rendu cela beaucoup plus simple. J'ai trouvé une équipe le jour même, négocié le budget via l'application. Je donne 4 étoiles car j'aimerais plus de prestataires dans ma zone, mais super expérience.",
          reviewer: "Bernard T."
        },
        {
          title: "Fixam est l'avenir de la recherche de services locaux au Cameroun",
          rating: 5,
          date: "Mars 2026",
          category: "Home Services",
          isPro: false,
          text: "J'ai utilisé Fixam pour de l'électricité, du ménage et de la plomberie ces 3 derniers mois. Expérience professionnelle et fiable à chaque fois. Les badges de vérification et les avis donnent vraiment confiance.",
          reviewer: "Rosalie K."
        },
        {
          title: "Le système de pièces est génial pour gérer son budget",
          rating: 5,
          date: "Février 2026",
          category: "Repairs",
          isPro: false,
          text: "Ce que je préfère sur Fixam, c'est le système de recharge de pièces par Orange Money. Pas de mauvaises surprises. La réservation est transparente et mon réparateur est devenu mon contact régulier.",
          reviewer: "Gaston M."
        },
        {
          title: "Développer mon activité de prestataire n'a jamais été aussi facile",
          rating: 5,
          date: "Février 2026",
          category: "Security",
          isPro: true,
          text: "J'installe des systèmes de sécurité. Avant Fixam, je dépendais uniquement du bouche-à-oreille. Depuis que j'ai rejoint en tant que prestataire vérifié, j'ai un flux régulier. Le badge de vérification aide vraiment à instaurer la confiance.",
          reviewer: "Emmanuel B."
        }
      ]
    },
    faq: {
      heading: "Questions fréquemment posées",
      categories: {
        started: "Démarrage",
        clients: "Pour les Clients",
        providers: "Pour les Prestataires",
        payments: "Paiements",
        safety: "Sécurité"
      },
      readMore: "Lire plus",
      showLess: "Moins",
      items: [
        {
          category: "Getting Started",
          q: "L'inscription sur Fixam est-elle gratuite ?",
          a: "Oui, la création d'un compte sur Fixam est entièrement gratuite pour les clients et les prestataires. Les clients peuvent publier des tâches gratuitement. Les prestataires peuvent créer leur profil et postuler sans frais. Vous n'utilisez des pièces que pour réserver un prestataire. Un bonus d'accueil de 1 pièce est offert."
        },
        {
          category: "Getting Started",
          q: "Puis-je développer mon activité avec Fixam ?",
          a: "Oui, de nombreux prestataires ont développé un revenu stable. Que vous soyez électricien, plombier, femme de ménage ou esthéticienne, Fixam vous donne accès à une large communauté de clients. Complétez votre vérification pour obtenir des réservations et des avis positifs."
        },
        {
          category: "For Clients",
          q: "Les prestataires sont-ils fiables ?",
          a: "Oui, tous les prestataires sur Fixam passent par une vérification d'identité avec pièce d'identité officielle approuvée par notre équipe. Vous pouvez également consulter l'historique complet des évaluations et des commentaires de chaque prestataire."
        },
        {
          category: "For Clients",
          q: "Quels types de services puis-je réserver ?",
          a: "Fixam prend en charge de nombreuses catégories : électricité, plomberie, ménage, déménagement, beauté, jardinage, etc. Si votre service requiert un professionnel local au Cameroun, vous le trouverez sûrement sur Fixam."
        },
        {
          category: "For Providers",
          q: "Comment fidéliser les clients sur la plateforme ?",
          a: "Fixam facilite les relations durables. Une fois un travail terminé, les clients peuvent vous réserver à nouveau directement depuis votre profil. Votre historique d'avis reste visible pour attirer plus de clients récurrents."
        },
        {
          category: "For Providers",
          q: "Que disent les utilisateurs de leur expérience ?",
          a: "Les retours soulignent la simplicité de mise en relation, la sécurité apportée par la vérification et les paiements mobiles faciles pour la recharge. Lisez notre section avis ci-dessus pour découvrir les retours en détail."
        },
        {
          category: "Payments",
          q: "Comment fonctionnent les paiements Mobile Money ?",
          a: "Fixam utilise un système de pièces. Pour recharger vos pièces, allez dans votre Portefeuille dans l'application, choisissez MTN ou Orange Money, entrez le montant et validez. Les pièces servent de frais de réservation (1 pièce pour réservation standard)."
        },
        {
          category: "Safety",
          q: "La plateforme Fixam est-elle sécurisée ?",
          a: "Oui, tous les paiements de recharges sont sécurisés via MTN et Orange Money. Les profils sont vérifiés par carte d'identité. Vos données personnelles sont chiffrées. Notre équipe d'assistance est à votre écoute pour tout problème de comportement."
        }
      ]
    },
    skills: {
      categories: ["Top Services", "Most Booked", "Best Rated", "New on Fixam"],
      lists: {
        "Top Services": [
          ["House Cleaning", "Electrical Repairs", "Plumbing Services", "Security Installation", "Painting & Decoration", "Moving & Delivery", "Carpentry Work", "AC Installation & Repair", "Generator Repair", "Welding Services", "Tile & Flooring Work", "Roof Repair"],
          ["Beauty & Makeup", "Hair Styling", "Nail Technician", "Home Tutoring", "Garden Maintenance", "Pool Cleaning", "CCTV Installation", "Pest Control", "Laundry Service", "Event Decoration", "Photography", "Catering Services"]
        ],
        "Most Booked": [
          ["House Cleaning", "Plumbing Services", "Electrical Repairs", "AC Installation & Repair", "Generator Repair", "Moving & Delivery"],
          ["Hair Styling", "Beauty & Makeup", "CCTV Installation", "Garden Maintenance", "Home Tutoring", "Roof Repair"]
        ],
        "Best Rated": [
          ["Electrical Repairs", "Security Installation", "Tile & Flooring Work", "Welding Services", "CCTV Installation", "Pest Control"],
          ["Beauty & Makeup", "Nail Technician", "Home Tutoring", "Event Decoration", "Photography", "Catering Services"]
        ],
        "New on Fixam": [
          ["Pool Cleaning", "Laundry Service", "Tailoring", "Tiling", "AC Installation & Repair", "Roof Repair"],
          ["Generator Repair", "CCTV Installation", "Garden Maintenance", "Event Decoration", "Catering Services", "Welding Services"]
        ]
      }
    }
  }
};

// Map categories to display names based on language
const getCategoryDisplayName = (category: string, isFr: boolean) => {
  const mapping: Record<string, { en: string; fr: string }> = {
    "Home Services": { en: "Home Services", fr: "Services à Domicile" },
    "Electrical": { en: "Electrical", fr: "Électricité" },
    "Plumbing": { en: "Plumbing", fr: "Plomberie" },
    "Cleaning": { en: "Cleaning", fr: "Nettoyage" },
    "Beauty & Wellness": { en: "Beauty & Wellness", fr: "Beauté & Bien-être" },
    "Moving & Delivery": { en: "Moving & Delivery", fr: "Déménagement & Livraison" },
    "Repairs": { en: "Repairs", fr: "Réparations" },
    "Security": { en: "Security", fr: "Sécurité" }
  };
  return mapping[category] ? (isFr ? mapping[category].fr : mapping[category].en) : category;
};

export default function ReviewsPage({ onNavigate, onSelectSkill }: { onNavigate: (page: Page) => void; onSelectSkill: (skill: string) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const content = isFr ? reviewsContent.fr : reviewsContent.en;

  // Interactivity state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSort, setSelectedSort] = useState<'recent' | 'highest' | 'helpful'>('recent');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUserType, setSelectedUserType] = useState<string>('All');
  const [reviewsExpanded, setReviewsExpanded] = useState<Record<number, boolean>>({});
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('started');
  const [faqsExpanded, setFaqsExpanded] = useState<Record<number, boolean>>({});
  const [activeSkillTab, setActiveSkillTab] = useState<string>('Top Services');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isCategoryFilterExpanded, setIsCategoryFilterExpanded] = useState(true);
  const [isUserTypeFilterExpanded, setIsUserTypeFilterExpanded] = useState(true);
  const [backendReviews, setBackendReviews] = useState<any[]>([]);

  const skillTabLabels: Record<string, { en: string; fr: string }> = {
    "Top Services": { en: "Top Services", fr: "Services Principaux" },
    "Most Booked": { en: "Most Booked", fr: "Les Plus Réservés" },
    "Best Rated": { en: "Best Rated", fr: "Mieux Notés" },
    "New on Fixam": { en: "New on Fixam", fr: "Nouveautés" }
  };

  useEffect(() => {
    const fetchBackendReviews = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/reviews`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((r: any) => {
            const category = r.job?.category || r.booking?.task?.category || 'Home Services';
            const reviewerName = r.reviewer?.fullName || 'Verified User';
            const isPro = !!r.reviewer?.providerProfile;
            return {
              title: r.comment ? (r.comment.length > 30 ? `${r.comment.slice(0, 30)}...` : r.comment) : 'Service Review',
              rating: r.rating,
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'May 2026',
              category: category,
              isPro: isPro,
              text: r.comment || 'Excellent service provider! Highly recommended.',
              reviewer: reviewerName
            };
          });
          setBackendReviews(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
    fetchBackendReviews();
  }, []);

  // Slide carousel controls
  const handlePrevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };
  const handleNextSlide = () => {
    if (currentSlide < content.successStories.stories.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  // Filter functionality
  const rawReviews = [...backendReviews, ...(isFr ? reviewsContent.fr.userReviews.reviews : reviewsContent.en.userReviews.reviews)];

  const getCategoryCount = (catName: string) => {
    return rawReviews.filter(r => r.category === catName).length;
  };
  
  // Categorized counts (dynamically computed from rawReviews)
  const categoryCounts = [
    { key: "All", label: content.userReviews.categories.all },
    { key: "Home Services", label: content.userReviews.categories.home, count: getCategoryCount("Home Services") },
    { key: "Electrical", label: content.userReviews.categories.electrical, count: getCategoryCount("Electrical") },
    { key: "Plumbing", label: content.userReviews.categories.plumbing, count: getCategoryCount("Plumbing") },
    { key: "Cleaning", label: content.userReviews.categories.cleaning, count: getCategoryCount("Cleaning") },
    { key: "Beauty & Wellness", label: content.userReviews.categories.beauty, count: getCategoryCount("Beauty & Wellness") },
    { key: "Moving & Delivery", label: content.userReviews.categories.moving, count: getCategoryCount("Moving & Delivery") },
    { key: "Repairs", label: content.userReviews.categories.repairs, count: getCategoryCount("Repairs") },
    { key: "Security", label: content.userReviews.categories.security, count: getCategoryCount("Security") }
  ];

  // Filtering implementation
  const filteredReviews = rawReviews.filter((review) => {
    const categoryMatch = selectedCategory === 'All' || review.category === selectedCategory;
    const userTypeMatch = selectedUserType === 'All' || 
      (selectedUserType === 'Clients' && !review.isPro) || 
      (selectedUserType === 'Providers' && review.isPro);
    return categoryMatch && userTypeMatch;
  });

  const categoriesToShow = showAllCategories 
    ? categoryCounts 
    : categoryCounts.slice(0, 6); // All + 5 categories

  // Simple sorting simulation
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (selectedSort === 'highest') {
      return b.rating - a.rating;
    }
    // 'recent' & 'helpful' sorts keep mock order
    return 0;
  });

  // Toggle single review text expand
  const toggleReviewExpand = (idx: number) => {
    setReviewsExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // FAQ Expand toggle
  const toggleFaqExpand = (idx: number) => {
    setFaqsExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // FAQ Categories Mapping for sorting/filtering
  const faqCategories = [
    { key: 'started', label: content.faq.categories.started, filter: 'Getting Started' },
    { key: 'clients', label: content.faq.categories.clients, filter: 'For Clients' },
    { key: 'providers', label: content.faq.categories.providers, filter: 'For Providers' },
    { key: 'payments', label: content.faq.categories.payments, filter: 'Payments' },
    { key: 'safety', label: content.faq.categories.safety, filter: 'Safety' }
  ];

  const currentFaqCategoryName = faqCategories.find(c => c.key === activeFaqCategory)?.filter || 'Getting Started';
  const filteredFaqs = (isFr ? reviewsContent.fr.faq.items : reviewsContent.en.faq.items).filter(
    item => item.category === currentFaqCategoryName
  );

  return (
    <div className="reviews-page">
      {/* SECTION 1 - PAGE HERO */}
      <section className="reviews-section">
        <div className="reviews-container">
        {/* SECTION: Hero */}
        <div className="reviews-hero">
          <div className="reviews-hero-left">
            <h1>{content.hero.title}</h1>
            <p className="reviews-hero-subtext">{content.hero.subtext}</p>
            <button className="btn-teal-pill" onClick={() => onNavigate('register')}>
              {content.hero.cta}
            </button>
          </div>
          <div className="reviews-hero-right">
            <div className="hero-stats-container">
              <div className="stat-card">
                <div className="stat-stars">★★★★★ <span style={{ color: '#6B7280', fontSize: '14px', marginLeft: '6px', fontWeight: 500 }}>5/5</span></div>
                <div className="stat-number">{content.hero.stats.stat1Num}</div>
                <div className="stat-desc">{content.hero.stats.stat1Label}</div>
              </div>
              <div className="stat-divider" />
              <div className="stat-card">
                <div className="stat-stars">★★★★½ <span style={{ color: '#6B7280', fontSize: '14px', marginLeft: '6px', fontWeight: 500 }}>4.8/5</span></div>
                <div className="stat-number">{content.hero.stats.stat2Num}</div>
                <div className="stat-desc">{content.hero.stats.stat2Label}</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* SECTION 2 - HOW IT WORKS */}
      <section className="reviews-section-alt">
        {/* SECTION: How It Works */}
        <div className="reviews-container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
            {content.howItWorks.title}
          </h2>
          <div className="hiw-grid">
            {content.howItWorks.cards.map((card, i) => {
              const iconPaths = [
                'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
                'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              ];
              return (
                <div className="hiw-card" key={i}>
                  <svg className="hiw-icon" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[i]} />
                  </svg>
                  <h3 className="hiw-title">{card.title}</h3>
                  <p className="hiw-desc">{card.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="hiw-actions">
            <button className="btn-teal-pill" onClick={() => onNavigate('register')}>
              {content.howItWorks.cta1}
            </button>
            <button className="btn-outline-pill" onClick={() => onNavigate('guide')}>
              {content.howItWorks.cta2}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3 - SUCCESS STORIES CAROUSEL */}
      <section className="reviews-section">
        <div className="reviews-container">
        {/* SECTION: Success Stories Carousel */}
        <h2 className="section-title">{content.successStories.heading}</h2>
        <div className="carousel-container">
          <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {content.successStories.stories.map((story, i) => (
              <div className="story-card" key={i}>
                <div className="story-img-container">
                  {story.img ? (
                    <img src={story.img} alt={story.title} className="story-img" loading="lazy" />
                  ) : (
                    <div className="story-placeholder" style={{ background: story.bgColor || 'linear-gradient(135deg, #14B8A6, #0D9488)' }}>
                      {story.initials || "FX"}
                    </div>
                  )}
                </div>
                <div className="story-content">
                  <h3 className="story-title">"{story.title}"</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-controls">
          <button className="carousel-btn" onClick={handlePrevSlide} disabled={currentSlide === 0}>
            {content.successStories.back}
          </button>
          <span className="slide-counter">
            {currentSlide + 1} / {content.successStories.stories.length}
          </span>
          <button className="carousel-btn" onClick={handleNextSlide} disabled={currentSlide === content.successStories.stories.length - 1}>
            {content.successStories.next}
          </button>
        </div>
        </div>
      </section>

      {/* SECTION 4 - TESTIMONIAL QUOTE + STATS SIDE BY SIDE */}
      <section className="reviews-section-alt">
        <div className="reviews-container">
        {/* SECTION: Testimonial & Stats Side-by-Side */}
        <div className="split-cards">
          <div className="quote-card">
            <div className="quote-mark">“</div>
            <p className="quote-text">"{content.testimonialStats.quote}"</p>
            <p className="quote-author">{content.testimonialStats.author}</p>
          </div>
          <div className="stats-side-card">
            <div className="stat-card">
              <span className="stat-number">{content.testimonialStats.stat1.num}</span>
              <span className="stat-desc" style={{ marginTop: '8px' }}>{content.testimonialStats.stat1.desc}</span>
            </div>
            <div className="stats-side-divider" />
            <div className="stat-card">
              <span className="stat-number">{content.testimonialStats.stat2.num}</span>
              <span className="stat-desc" style={{ marginTop: '8px' }}>{content.testimonialStats.stat2.desc}</span>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* SECTION 5 - WHY CLIENTS CHOOSE FIXAM */}
      <section className="reviews-section">
        <div className="reviews-container">
        {/* SECTION: Why Clients Choose Fixam */}
        <h2 className="section-title">{content.whyChoose.heading}</h2>
        <div className="why-grid">
          {content.whyChoose.cards.map((card, i) => (
            <div className="why-card" key={i}>
              <img src={card.img} alt={card.title} className="why-card-img" loading="lazy" />
              <div className="why-card-overlay" />
              <div className="why-card-content">
                <span className="why-tag">{card.tag}</span>
                <h3 className="why-title">{card.title}</h3>
                <div className="why-metric">{card.metric1}</div>
                <div className="why-divider" />
                <div className="why-metric">{card.metric2}</div>
                <button className="why-btn" onClick={() => onNavigate('success_stories')}>
                  {card.btn}
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* SECTION 6 - CONNECT CTA BANNER */}
      <section className="reviews-section-alt">
        <div className="reviews-container">
        {/* SECTION: Connect with Providers CTA Banner */}
        <div className="connect-banner">
          <div className="connect-left">
            <h2 className="connect-title">{content.connectBanner.title}</h2>
            <div className="connect-actions">
              <button className="btn-teal-pill" onClick={() => onNavigate('register')}>
                {content.connectBanner.btn1}
              </button>
              <button className="btn-outline-pill" onClick={() => onNavigate('guide')}>
                {content.connectBanner.btn2}
              </button>
            </div>
          </div>
          <div className="connect-right">
            <img src={content.connectBanner.img} alt="Professional service" className="connect-img" loading="lazy" />
          </div>
        </div>
        </div>
      </section>

      {/* SECTION 7 - USER REVIEWS WITH FILTER */}
      <section className="reviews-section">
        <div className="reviews-container">
        {/* SECTION: User Reviews with Filter */}
        <h2 className="section-title">{content.userReviews.heading}</h2>
        <div className="reviews-layout">
          {/* Sidebar */}
          <aside className="filter-sidebar">
            <div className="filter-group">
              <label className="filter-label">{content.userReviews.sortBy}</label>
              <div style={{ position: 'relative' }}>
                <select 
                  className="filter-select" 
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as any)}
                >
                  <option value="recent">{content.userReviews.sorts.recent}</option>
                  <option value="highest">{content.userReviews.sorts.highest}</option>
                  <option value="helpful">{content.userReviews.sorts.helpful}</option>
                </select>
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6B7280' }}>▼</div>
              </div>
            </div>
            
            <div className="filter-divider" style={{ borderTop: '1px solid #E5E7EB', margin: '20px 0' }} />

            <div className="filter-group">
              <label 
                className="filter-label"
                onClick={() => setIsCategoryFilterExpanded(!isCategoryFilterExpanded)}
                style={{ cursor: 'pointer' }}
              >
                {content.userReviews.categoryLabel}
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{isCategoryFilterExpanded ? '▲' : '▼'}</span>
              </label>
              {isCategoryFilterExpanded && (
                <>
                  {categoriesToShow.map((cat, i) => (
                    <div 
                      className="filter-checkbox-row" 
                      key={i}
                      onClick={() => setSelectedCategory(cat.key)}
                    >
                      <div className={`custom-checkbox ${selectedCategory === cat.key ? 'checked' : ''}`}>
                        {selectedCategory === cat.key && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="checkbox-text">{cat.label}</span>
                      {cat.count !== undefined && <span className="checkbox-count">({cat.count})</span>}
                    </div>
                  ))}
                  {categoryCounts.length > 6 && (
                    <button 
                      className="see-more-link" 
                      onClick={() => setShowAllCategories(!showAllCategories)}
                    >
                      {showAllCategories 
                        ? (isFr ? "Voir moins ↑" : "See less ↑") 
                        : (isFr ? "Voir plus ↓" : "See more ↓")}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="filter-divider" style={{ borderTop: '1px solid #E5E7EB', margin: '20px 0' }} />

            <div className="filter-group">
              <label 
                className="filter-label"
                onClick={() => setIsUserTypeFilterExpanded(!isUserTypeFilterExpanded)}
                style={{ cursor: 'pointer' }}
              >
                {content.userReviews.userTypeLabel}
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{isUserTypeFilterExpanded ? '▲' : '▼'}</span>
              </label>
              {isUserTypeFilterExpanded && (
                <>
                  {['All', 'Clients', 'Providers'].map((type, i) => (
                    <div 
                      className="filter-checkbox-row" 
                      key={i}
                      onClick={() => setSelectedUserType(type)}
                    >
                      <div className={`custom-checkbox ${selectedUserType === type ? 'checked' : ''}`}>
                        {selectedUserType === type && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="checkbox-text">
                        {type === 'All' ? content.userReviews.userTypes.all : 
                         type === 'Clients' ? content.userReviews.userTypes.clients : 
                         content.userReviews.userTypes.providers}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </aside>

          {/* List */}
          <div className="reviews-list-scroll-box">
            {sortedReviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
                No reviews found matching the filter criteria.
              </div>
            ) : (
              sortedReviews.map((review, i) => {
                const isExpanded = !!reviewsExpanded[i];
                const cleanText = review.text;
                // Truncate to first 120 characters for preview
                const showTruncate = cleanText.length > 120;
                const displayText = (!showTruncate || isExpanded) 
                  ? cleanText 
                  : `${cleanText.slice(0, 120)}...`;

                return (
                  <div className="review-list-item" key={i}>
                    <div className="review-row-1">
                      <h3 className="review-title">"{review.title}"</h3>
                      <div className="review-rating">
                        <span className="review-rating-stars">
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </span>
                        <span className="review-rating-num">{review.rating}/5</span>
                      </div>
                    </div>
                    <div className="review-row-2">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>
                        {review.isPro ? content.userReviews.metadataLabelPro : content.userReviews.metadataLabel}
                      </span>
                      <span>•</span>
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{review.date}</span>
                    </div>
                    <div className="review-category-pill">
                      {getCategoryDisplayName(review.category, isFr)}
                    </div>
                    <p className="review-text">
                      {displayText}
                      {showTruncate && (
                        <button className="review-more-link" onClick={() => toggleReviewExpand(i)}>
                          {isExpanded ? content.userReviews.lessText : content.userReviews.moreText}
                        </button>
                      )}
                    </p>
                    <div className="review-reviewer">
                      <div className="reviewer-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="reviewer-name">{review.reviewer}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        </div>
      </section>

      {/* SECTION 8 - FAQ */}
      <section className="reviews-section-alt">
        <div className="reviews-container">
        {/* SECTION: FAQ Accordion */}
        <div className="faq-layout">
          <aside className="faq-left">
            <div className="faq-sticky">
              <h2 className="faq-heading">{content.faq.heading}</h2>
              {faqCategories.map((cat, i) => (
                <button 
                  className={`faq-cat-link ${activeFaqCategory === cat.key ? 'active' : ''}`}
                  key={i}
                  onClick={() => {
                    setActiveFaqCategory(cat.key);
                    setFaqsExpanded({});
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </aside>
          
          <div className="faq-right">
            {filteredFaqs.map((faq, i) => {
              const isExpanded = !!faqsExpanded[i];
              return (
                <div className="faq-item" key={i}>
                  <h3 className="faq-q" style={{ cursor: 'pointer' }} onClick={() => toggleFaqExpand(i)}>{faq.q}</h3>
                  {isExpanded ? (
                    <p className="faq-a-full">{faq.a}</p>
                  ) : (
                    <p className="faq-a-preview">{faq.a}</p>
                  )}
                  <button className="faq-read-more" onClick={() => toggleFaqExpand(i)}>
                    {isExpanded ? content.faq.showLess : content.faq.readMore}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </section>

      {/* SECTION 9 - TOP SKILLS / SERVICE CATEGORIES */}
      <section className="reviews-section">
        <div className="reviews-container">
        {/* SECTION: Top Skills/Categories tabs */}
        <div className="skills-container">
          <aside className="skills-nav">
            {Object.keys(skillTabLabels).map((key) => (
              <button 
                className={`skill-tab ${activeSkillTab === key ? 'active' : ''}`}
                key={key}
                onClick={() => setActiveSkillTab(key)}
              >
                {isFr ? skillTabLabels[key].fr : skillTabLabels[key].en}
              </button>
            ))}
          </aside>

          <div className="skills-content">
            {content.skills.lists[activeSkillTab as keyof typeof content.skills.lists]?.map((columnList, colIdx) => (
              <div className="skills-col" key={colIdx}>
                {columnList.map((skill, skillIdx) => (
                  <span className="skill-link" key={skillIdx} onClick={() => {
                    onSelectSkill(skill);
                    onNavigate('skill_detail');
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
