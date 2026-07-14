import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "explore": "Explore",
        "guide": "How it Works",
        "about": "About Us",
        "signin": "Sign In",
        "join": "Get Started",
        "language": "English"
      },
      "search": {
        "placeholder": "Enter Keywords...",
        "btn": "Search"
      },
      "quick_actions": {
        "post_task": "Post a Task",
        "post_task_desc": "Need something done? Create a task and get offers in minutes.",
        "join_pro": "Join as Professional",
        "join_pro_desc": "Create a provider profile, upload certificates, and find work.",
        "explore": "Explore Services",
        "explore_desc": "Browse all professional services and check reviews.",
        "safety": "Trust & Safety",
        "safety_desc": "Learn how we verify users and keep transactions secure.",
        "wallet": "Top Up Wallet",
        "wallet_desc": "Manage coins, purchase packages, and view transaction history.",
        "support": "Help & Support",
        "support_desc": "Get in touch with our 24/7 dedicated support team."
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
        "desc4": "Relax while the job gets done right.",
        "cta1": "Find Experts",
        "cta2": "Verify Profile",
        "cta3": "Book Now",
        "cta4": "Get It Done"
      },
      "guide": {
        "hero_title": "How It Works",
        "hero_desc": "Everything you need to know about getting things done on Fixam.",
        "register_title": "How to Register",
        "register_desc": "Getting started is completely free! Simply click on the Get Started button at the top right of the page. You can sign up using your email or phone number. Once your account is verified, you can immediately start posting tasks or browsing for professionals.",
        "find_provider_title": "How to Find the Right Provider",
        "find_provider_desc": "There are two main ways to get your job done:",
        "find_provider_step1": "Post a Task: Describe what you need, set your budget, and let verified professionals send you proposals.",
        "find_provider_step2": "Direct Booking: Browse through our 'Explore' page, view profiles, read reviews, and hire a specific professional directly.",
        "safety_title": "Safety and Verification",
        "safety_desc": "Your safety is our absolute priority. Every professional on Fixam undergoes a rigorous background check, identity verification, and skills assessment before they are allowed to offer services on the platform.",
        "get_started_btn": "Get Started Now"
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "home": "Accueil",
        "explore": "Explorer",
        "guide": "Comment ça marche",
        "about": "À propos",
        "signin": "Se connecter",
        "join": "Commencer",
        "language": "Français"
      },
      "search": {
        "placeholder": "Saisir des mots-clés...",
        "btn": "Rechercher"
      },
      "quick_actions": {
        "post_task": "Publier une tâche",
        "post_task_desc": "Besoin d'aide ? Créez une tâche et recevez des offres en quelques minutes.",
        "join_pro": "Devenir professionnel",
        "join_pro_desc": "Créez un profil de prestataire, téléchargez vos certificats et trouvez du travail.",
        "explore": "Explorer les services",
        "explore_desc": "Parcourez tous les services professionnels et consultez les avis.",
        "safety": "Confiance et sécurité",
        "safety_desc": "Découvrez comment nous vérifions les utilisateurs et sécurisons les transactions.",
        "wallet": "Recharger le portefeuille",
        "wallet_desc": "Gerez vos pièces, achetez des forfaits et consultez l'historique des transactions.",
        "support": "Aide et support",
        "support_desc": "Contactez notre équipe d'assistance dédiée 24h/24 et 7j/7."
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
        "desc4": "Détendez-vous pendant que le travail est bien fait.",
        "cta1": "Trouver des experts",
        "cta2": "Vérifier le profil",
        "cta3": "Réserver maintenant",
        "cta4": "C'est Fait"
      },
      "guide": {
        "hero_title": "Comment ça marche",
        "hero_desc": "Tout ce que vous devez savoir pour accomplir vos tâches sur Fixam.",
        "register_title": "Comment s'inscrire",
        "register_desc": "Commencer est complètement gratuit ! Cliquez simplement sur le bouton Commencer en haut à droite de la page. Vous pouvez vous inscrire avec votre e-mail ou votre numéro de téléphone. Une fois votre compte vérifié, vous pouvez immédiatement commencer à publier des tâches ou à rechercher des professionnels.",
        "find_provider_title": "Comment trouver le bon professionnel",
        "find_provider_desc": "Il existe deux façons principales d'accomplir votre travail :",
        "find_provider_step1": "Publier une tâche : Décrivez ce dont vous avez besoin, fixez votre budget et laissez des professionnels vérifiés vous envoyer des propositions.",
        "find_provider_step2": "Réservation directe : Parcourez notre page d'exploration, consultez les profils, lisez les avis et embauchez directement un professionnel spécifique.",
        "safety_title": "Sécurité et vérification",
        "safety_desc": "Votre sécurité est notre priorité absolue. Chaque professionnel sur Fixam est soumis à une vérification rigoureuse de ses antécédents, de son identité et à une évaluation de ses compétences avant d'être autorisé à proposer des services sur la plateforme.",
        "get_started_btn": "Commencer maintenant"
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
