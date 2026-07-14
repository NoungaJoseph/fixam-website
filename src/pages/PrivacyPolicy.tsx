import { useTranslation } from 'react-i18next';
import { Page } from '../App';
import LegalLayout from './LegalLayout';
import './LegalPages.css';

export default function PrivacyPolicy({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const sections = [
    {
      id: "information-we-collect",
      title: isFr ? "Informations que Nous Collectons" : "Information We Collect",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "Nous collectons les informations que vous fournissez directement :" : "We collect information you provide directly:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "Nom complet et numéro de téléphone (obligatoire)" : "Full name and phone number (required)"}</li>
            <li>{isFr ? "Adresse e-mail (facultatif)" : "Email address (optional)"}</li>
            <li>{isFr ? "Photo de profil (facultatif)" : "Profile photo (optional)"}</li>
            <li>{isFr ? "Documents d'identité gouvernementaux (pour la vérification)" : "Government ID documents (for verification)"}</li>
            <li>{isFr ? "Informations de localisation (lors de l'utilisation de l'application)" : "Location information (when using the app)"}</li>
            <li>{isFr ? "Données de transaction de réservation (achats de pièces — montants et références uniquement)" : "Booking transaction data (coin purchases — amounts and references only)"}</li>
            <li>{isFr ? "Messages et communications via l'application" : "Messages and communications through the app"}</li>
            <li>{isFr ? "Avis et notes que vous soumettez" : "Reviews and ratings you submit"}</li>
          </ul>
        </>
      )
    },
    {
      id: "how-we-use",
      title: isFr ? "Comment Nous Utilisons Vos Informations" : "How We Use Your Information",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "Nous utilisons vos informations pour :" : "We use your information to:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "Créer et gérer votre compte Fixam" : "Create and manage your Fixam account"}</li>
            <li>{isFr ? "Vous connecter avec des prestataires de services ou des clients dans votre région" : "Connect you with service providers or clients in your area"}</li>
            <li>{isFr ? "Traiter les achats de pièces via Mobile Money" : "Process coin purchases via Mobile Money"}</li>
            <li>{isFr ? "Vous envoyer des notifications pertinentes concernant les réservations, les messages et l'activité du compte" : "Send you relevant notifications about bookings, messages, and account activity"}</li>
            <li>{isFr ? "Vérifier votre identité en tant que Prestataire" : "Verify your identity as a Provider"}</li>
            <li>{isFr ? "Améliorer notre plateforme et résoudre les problèmes" : "Improve our platform and fix issues"}</li>
            <li>{isFr ? "Respecter les obligations légales au Cameroun" : "Comply with legal obligations in Cameroon"}</li>
          </ul>
        </>
      )
    },
    {
      id: "information-sharing",
      title: isFr ? "Partage d'Informations" : "Information Sharing",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "Nous partageons vos informations uniquement dans ces circonstances :" : "We share your information only in these circumstances:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "Avec les Prestataires ou Clients : nous partageons votre nom et votre zone générale lorsqu'une réservation est confirmée. Nous ne partageons pas votre numéro de téléphone tant que les deux parties n'ont pas convenu d'une réservation." : "With Providers or Clients: we share your name and general area when a booking is confirmed. We do not share your phone number until both parties have agreed to a booking."}</li>
            <li>{isFr ? "Avec les processeurs de paiement : données de transaction limitées avec MTN et Orange pour traiter les recharges de pièces Mobile Money" : "With payment processors: limited transaction data with MTN and Orange to process Mobile Money coin top-ups"}</li>
            <li>{isFr ? "Avec les forces de l'ordre : lorsque requis par la loi camerounaise" : "With law enforcement: when required by Cameroonian law"}</li>
            <li>{isFr ? "Nous ne vendons jamais vos données personnelles à des tiers à des fins publicitaires." : "We never sell your personal data to third parties for advertising."}</li>
          </ul>
        </>
      )
    },
    {
      id: "data-storage",
      title: isFr ? "Stockage et Sécurité des Données" : "Data Storage & Security",
      content: (
        <>
          <p className="legal-body-text">
            {isFr
              ? "Vos données sont stockées en toute sécurité sur des serveurs gérés par Supabase avec un cryptage au repos et en transit. Nous mettons en œuvre des mesures de sécurité standard de l'industrie, notamment :"
              : "Your data is stored securely on servers managed by Supabase with encryption at rest and in transit. We implement industry standard security measures including:"}
          </p>
          <ul className="legal-list">
            <li>{isFr ? "Cryptage HTTPS pour toutes les communications" : "HTTPS encryption for all communications"}</li>
            <li>{isFr ? "Hachage sécurisé des mots de passe" : "Secure password hashing"}</li>
            <li>{isFr ? "Authentification par jeton JWT" : "JWT token authentication"}</li>
            <li>{isFr ? "Examens de sécurité réguliers" : "Regular security reviews"}</li>
          </ul>
          <p className="legal-body-text">
            {isFr
              ? "Bien que nous prenions des précautions raisonnables, aucun système n'est totalement sécurisé et nous ne pouvons garantir une sécurité absolue des données."
              : "While we take reasonable precautions, no system is completely secure and we cannot guarantee absolute data security."}
          </p>
        </>
      )
    },
    {
      id: "your-rights",
      title: isFr ? "Vos Droits" : "Your Rights",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "En tant qu'utilisateur de Fixam, vous avez le droit de :" : "As a Fixam user, you have the right to:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "Accéder à vos données personnelles à tout moment via les paramètres de votre profil" : "Access your personal data at any time through your profile settings"}</li>
            <li>{isFr ? "Corriger les informations inexactes dans votre compte" : "Correct inaccurate information in your account"}</li>
            <li>{isFr ? "Supprimer votre compte et les données associées via les paramètres de confidentialité de l'application" : "Delete your account and associated data through the Privacy settings in the app"}</li>
            <li>{isFr ? "Retirer votre consentement pour le traitement de données facultatif à tout moment" : "Withdraw consent for optional data processing at any time"}</li>
            <li>{isFr ? "Demander une copie de vos données en contactant notre équipe d'assistance" : "Request a copy of your data by contacting our support team"}</li>
          </ul>
          <p className="legal-body-text">
            {isFr
              ? "Pour exercer l'un de ces droits, contactez-nous à fixam8899@gmail.com"
              : "To exercise any of these rights, contact us at fixam8899@gmail.com"}
          </p>
        </>
      )
    },
    {
      id: "cookies",
      title: "Cookies",
      content: (
        <>
          <p className="legal-body-text">
            {isFr
              ? "Le site web de Fixam utilise des cookies essentiels pour fonctionner correctement. Ceux-ci incluent :"
              : "The Fixam website uses essential cookies to function properly. These include:"}
          </p>
          <ul className="legal-list">
            <li>{isFr ? "Cookies de session pour vous garder connecté" : "Session cookies for keeping you logged in"}</li>
            <li>{isFr ? "Cookies de préférence pour les paramètres de langue" : "Preference cookies for language settings"}</li>
            <li>{isFr ? "Cookies de sécurité pour protéger votre compte" : "Security cookies for protecting your account"}</li>
          </ul>
          <p className="legal-body-text">
            {isFr
              ? "Nous n'utilisons pas de cookies publicitaires ou de suivi. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais cela peut affecter certaines fonctionnalités du site web."
              : "We do not use advertising or tracking cookies. You can disable cookies in your browser settings, but this may affect some website functionality."}
          </p>
        </>
      )
    },
    {
      id: "childrens-privacy",
      title: isFr ? "Confidentialité des Enfants" : "Children's Privacy",
      content: (
        <p className="legal-body-text">
          {isFr
            ? "Fixam n'est pas destiné aux utilisateurs de moins de 18 ans. Nous ne collectons pas sciemment d'informations personnelles auprès de mineurs. Si vous pensez qu'un mineur a créé un compte, veuillez nous contacter immédiatement et nous supprimerons le compte et les données associées."
            : "Fixam is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If you believe a minor has created an account, please contact us immediately and we will delete the account and associated data."}
        </p>
      )
    },
    {
      id: "changes-to-policy",
      title: isFr ? "Modifications de la Politique" : "Changes to Policy",
      content: (
        <p className="legal-body-text">
          {isFr
            ? "Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Nous vous informerons des modifications importantes via l'application ou par e-mail. La date d'entrée en vigueur en haut de cette page indique quand elle a été mise à jour pour la dernière fois."
            : "We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or by email. The effective date at the top of this page shows when it was last updated."}
        </p>
      )
    },
    {
      id: "contact-us-privacy",
      title: isFr ? "Contactez-Nous" : "Contact Us",
      content: (
        <>
          <p className="legal-body-text">
            {isFr
              ? "Pour des questions liées à la confidentialité ou pour exercer vos droits sur les données :"
              : "For privacy-related questions or to exercise your data rights:"}
          </p>
          <ul className="legal-list">
            <li>Email: fixam8899@gmail.com</li>
            <li>{isFr ? "Délai de réponse : sous 48 heures les jours ouvrables" : "Response time: within 48 hours on business days"}</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <LegalLayout 
      pageTitle={isFr ? "Politique de Confidentialité" : "Privacy Policy"}
      effectiveDate={isFr ? "En vigueur le 1 Juin 2026" : "Effective June 1, 2026"}
      sections={sections}
      onNavigate={onNavigate}
      brandText={isFr ? "POLITIQUE DE CONFIDENTIALITÉ" : "PRIVACY POLICY"}
      downloadLabel={isFr ? "Télécharger PDF" : "Download PDF"}
    />
  );
}
