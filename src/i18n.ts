import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "explore": "Explore",
        "guide": "How it Works",
        "about": "About Us",
        "signin": "Sign In",
        "join": "Get Started",
        "language": "English"
      },
      "hero": {
        "title1": "Find the perfect",
        "title2": "professional",
        "title3": "services for your home",
        "placeholder": "Try 'cleaning' or 'plumbing'",
        "popular": "Popular:"
      },
      "categories": {
        "plumbing": "Plumbing",
        "electrical": "Electrical",
        "cleaning": "Cleaning",
        "painting": "Painting",
        "carpentry": "Carpentry",
        "appliance": "Appliance Repair",
        "delivery": "Delivery",
        "ac": "AC Repair",
        "beauty": "Beauty",
        "catering": "Catering",
        "moving": "Moving Service",
        "landscaping": "Landscaping",
        "title": "Popular Professional Services",
        "subtitle": "Discover the most sought-after services tailored for you."
      },
      "footer": {
        "ready": "Ready to get started?",
        "join": "Join thousands of users who trust Fixam for their everyday needs.",
        "start_now": "Get Started Now",
        "description": "Fixam connects you with verified professionals to get things done quickly and reliably.",
        "company": "Company",
        "services": "Services",
        "support": "Support",
        "contact": "Contact Us",
        "about": "About Us",
        "how_it_works": "How It Works",
        "careers": "Careers",
        "press": "Press",
        "all_services": "All Services",
        "help": "Help Center",
        "safety": "Safety",
        "terms": "Terms of Service",
        "privacy": "Privacy Policy",
        "refund": "Refund Policy"
      },
      "pros": {
        "title": "Top Rated Professionals",
        "subtitle": "Hire trusted experts in your area.",
        "book": "Book Now",
        "view_all": "View All Professionals"
      },
      "how_it_works": {
        "title": "How Fixam Works",
        "subtitle": "Simple steps to get your task done.",
        "step1": "Post a Task",
        "desc1": "Tell us what you need done in minutes.",
        "step2": "Get Proposals",
        "desc2": "Receive offers from verified professionals.",
        "step3": "Choose & Book",
        "desc3": "Select the best pro and book with confidence.",
        "step4": "Get It Done",
        "desc4": "Relax while the job gets done right."
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "explore": "Explorer",
        "guide": "Comment ça marche",
        "about": "À propos",
        "signin": "Se connecter",
        "join": "Commencer",
        "language": "Français"
      },
      "hero": {
        "title1": "Trouvez les",
        "title2": "professionnels",
        "title3": "parfaits pour votre maison",
        "placeholder": "Essayez 'nettoyage' ou 'plomberie'",
        "popular": "Populaire :"
      },
      "categories": {
        "plumbing": "Plomberie",
        "electrical": "Électricité",
        "cleaning": "Nettoyage",
        "painting": "Peinture",
        "carpentry": "Menuiserie",
        "appliance": "Réparation d'appareils",
        "delivery": "Livraison",
        "ac": "Climatisation",
        "beauty": "Beauté",
        "catering": "Restauration",
        "moving": "Déménagement",
        "landscaping": "Aménagement paysager",
        "title": "Services Professionnels Populaires",
        "subtitle": "Découvrez les services les plus demandés, adaptés pour vous."
      },
      "footer": {
        "ready": "Prêt à commencer ?",
        "join": "Rejoignez des milliers d'utilisateurs qui font confiance à Fixam pour leurs besoins quotidiens.",
        "start_now": "Commencer maintenant",
        "description": "Fixam vous met en relation avec des professionnels vérifiés pour accomplir vos tâches rapidement et de manière fiable.",
        "company": "Entreprise",
        "services": "Services",
        "support": "Assistance",
        "contact": "Nous contacter",
        "about": "À propos",
        "how_it_works": "Comment ça marche",
        "careers": "Carrières",
        "press": "Presse",
        "all_services": "Tous les services",
        "help": "Centre d'aide",
        "safety": "Sécurité",
        "terms": "Conditions d'utilisation",
        "privacy": "Politique de confidentialité",
        "refund": "Politique de remboursement"
      },
      "pros": {
        "title": "Professionnels les mieux notés",
        "subtitle": "Engagez des experts de confiance dans votre région.",
        "book": "Réserver",
        "view_all": "Voir tous les professionnels"
      },
      "how_it_works": {
        "title": "Comment fonctionne Fixam",
        "subtitle": "Des étapes simples pour accomplir votre tâche.",
        "step1": "Publier une tâche",
        "desc1": "Dites-nous ce dont vous avez besoin en quelques minutes.",
        "step2": "Recevoir des propositions",
        "desc2": "Recevez des offres de professionnels vérifiés.",
        "step3": "Choisir et réserver",
        "desc3": "Sélectionnez le meilleur pro et réservez en toute confiance.",
        "step4": "C'est fait",
        "desc4": "Détendez-vous pendant que le travail est bien fait."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
