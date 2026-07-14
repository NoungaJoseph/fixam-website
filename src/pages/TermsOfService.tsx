import { useTranslation } from 'react-i18next';
import { Page } from '../App';
import LegalLayout from './LegalLayout';
import './LegalPages.css';

export default function TermsOfService({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const sections = [
    {
      id: "user-agreement",
      title: isFr ? "Accord Utilisateur" : "User Agreement",
      content: (
        <>
          <div className="legal-highlight-box">
            {isFr 
              ? "Important: En utilisant Fixam, vous acceptez ces Conditions d'Utilisation. Veuillez les lire attentivement avant d'utiliser nos services."
              : "Important: By using Fixam, you agree to these Terms of Service. Please read them carefully before using our services."}
          </div>
          <p className="legal-intro-text">
            {isFr
              ? "Cet Accord Utilisateur régit votre utilisation de la plateforme Fixam, y compris l'application mobile et le site web Fixam (fixam.net)."
              : "This User Agreement governs your use of the Fixam platform, including the Fixam mobile application and website (fixam.net)."}
          </p>
          <p className="legal-body-text">
            {isFr
              ? "En créant un compte, vous confirmez que vous avez lu, compris et acceptez d'être lié par ces conditions. Si vous n'êtes pas d'accord, vous ne devez pas utiliser nos services."
              : "By creating an account, you confirm that you have read, understood, and agree to be bound by these terms. If you do not agree, you must not use our services."}
          </p>
          <p className="legal-body-text">
            {isFr
              ? "Fixam est une plateforme de marché qui met en relation des clients recherchant des services locaux avec des prestataires qualifiés au Cameroun. Nous ne fournissons pas de services directement et ne sommes pas responsables de la qualité du travail effectué par les prestataires."
              : "Fixam is a marketplace platform that connects clients seeking local services with qualified service providers in Cameroon. We do not provide services directly and are not responsible for the quality of work performed by providers."}
          </p>
        </>
      )
    },
    {
      id: "terms-of-use",
      title: isFr ? "Conditions d'Utilisation" : "Terms of Use",
      content: (
        <p className="legal-body-text">
          {isFr
            ? "En accédant ou en utilisant Fixam, vous acceptez d'utiliser notre plateforme uniquement à des fins légales et conformément à ces Conditions. Vous ne devez pas utiliser Fixam d'une manière qui pourrait endommager, désactiver ou altérer nos services ou interférer avec l'utilisation de la plateforme par d'autres utilisateurs."
            : "By accessing or using Fixam, you agree to use our platform only for lawful purposes and in accordance with these Terms. You must not use Fixam in any way that could damage, disable, or impair our services or interfere with other users' enjoyment of the platform."}
        </p>
      )
    },
    {
      id: "eligibility",
      title: isFr ? "Éligibilité" : "Eligibility",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "Pour utiliser Fixam, vous devez :" : "To use Fixam, you must:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "Avoir au moins 18 ans" : "Be at least 18 years of age"}</li>
            <li>{isFr ? "Être un résident du Cameroun ou d'un territoire autorisé où Fixam opère" : "Be a resident of Cameroon or an authorized territory where Fixam operates"}</li>
            <li>{isFr ? "Avoir un numéro de téléphone mobile valide enregistré au Cameroun" : "Have a valid mobile phone number registered in Cameroon"}</li>
            <li>{isFr ? "Avoir la capacité juridique de conclure un accord contraignant" : "Have the legal capacity to enter into a binding agreement"}</li>
            <li>{isFr ? "Ne pas avoir été précédemment banni ou suspendu de la plateforme Fixam" : "Not have been previously banned or suspended from the Fixam platform"}</li>
          </ul>
        </>
      )
    },
    {
      id: "account-registration",
      title: isFr ? "Inscription au Compte" : "Account Registration",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "Lors de la création d'un compte Fixam, vous acceptez de :" : "When creating a Fixam account, you agree to:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "Fournir des informations exactes, actuelles et complètes lors de l'inscription" : "Provide accurate, current, and complete information during registration"}</li>
            <li>{isFr ? "Maintenir la sécurité de votre mot de passe et de votre code PIN" : "Maintain the security of your account password and PIN"}</li>
            <li>{isFr ? "Aviser Fixam immédiatement de tout accès non autorisé à votre compte" : "Notify Fixam immediately of any unauthorized access to your account"}</li>
            <li>{isFr ? "Accepter la responsabilité de toutes les activités qui se produisent sous votre compte" : "Accept responsibility for all activities that occur under your account"}</li>
          </ul>
          <p className="legal-body-text">
            {isFr
              ? "Vous pouvez vous inscrire en tant que <strong>Client</strong> (pour publier des tâches et engager des prestataires) ou en tant que <strong>Prestataire</strong> (pour offrir des services et accepter des emplois). Certaines fonctionnalités nécessitent une vérification d'identité avant de pouvoir y accéder."
              : "You may register as a <strong>Client</strong> (to post tasks and hire providers) or as a <strong>Provider</strong> (to offer services and accept jobs). Some features require identity verification before they can be accessed."}
          </p>
        </>
      )
    },
    {
      id: "provider-terms",
      title: isFr ? "Conditions Prestataires" : "Provider Terms",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "En tant que Prestataire Fixam, vous acceptez de :" : "As a Fixam Provider, you agree to:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "Effectuer la vérification d'identité avant d'accepter des emplois sur la plateforme" : "Complete identity verification before accepting any jobs on the platform"}</li>
            <li>{isFr ? "Fournir des services tels que décrits dans votre profil et convenus avec les clients" : "Provide services as described in your profile and as agreed with clients"}</li>
            <li>{isFr ? "Maintenir une conduite professionnelle dans toutes les communications et interactions sur place" : "Maintain professional conduct in all communications and on-site interactions"}</li>
            <li>{isFr ? "Honorer les réservations que vous avez acceptées" : "Honor bookings you have accepted"}</li>
            <li>{isFr ? "Ne pas solliciter de clients pour payer en dehors de la plateforme Fixam" : "Not solicit clients to pay outside the Fixam platform"}</li>
            <li>{isFr ? "Maintenir toutes les licences ou permis nécessaires requis pour votre type de service en vertu de la loi camerounaise" : "Maintain all necessary licenses or permits required for your service type under Cameroonian law"}</li>
          </ul>
          <p className="legal-body-text">
            {isFr
              ? "Fixam se réserve le droit de suspendre ou de fermer tout compte de prestataire qui violerait ces conditions."
              : "Fixam reserves the right to suspend or terminate any provider account found to be in violation of these terms."}
          </p>
        </>
      )
    },
    {
      id: "client-terms",
      title: isFr ? "Conditions Clients" : "Client Terms",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "En tant que Client Fixam, vous acceptez de :" : "As a Fixam Client, you agree to:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "Publier des tâches en décrivant honnêtement et avec précision le travail requis" : "Post tasks honestly and accurately describing the work required"}</li>
            <li>{isFr ? "Utiliser le système de pièces comme prévu pour réserver des prestataires vérifiés" : "Use the coin system as intended to book verified providers"}</li>
            <li>{isFr ? "Traiter les prestataires avec respect et professionnalisme" : "Treat providers with respect and professionalism"}</li>
            <li>{isFr ? "Ne pas tenter de solliciter des prestataires pour travailler en dehors de la plateforme Fixam" : "Not attempt to solicit providers to work outside the Fixam platform"}</li>
            <li>{isFr ? "Laisser des avis honnêtes et précis après l'achèvement du service" : "Leave honest and accurate reviews after service completion"}</li>
            <li>{isFr ? "Ne pas publier de tâches impliquant des activités illégales ou des services interdits" : "Not post tasks that involve illegal activities or prohibited services"}</li>
          </ul>
        </>
      )
    },
    {
      id: "payment-terms",
      title: isFr ? "Conditions de Paiement" : "Payment Terms",
      content: (
        <>
          <p className="legal-body-text">
            {isFr
              ? "Fixam est une plateforme de mise en relation et ne traite pas les paiements pour les services rendus. Les Clients paient les Prestataires directement en espèces une fois le service terminé."
              : "Fixam is a connection platform and does not process payments for services rendered. Clients pay Providers directly in cash once the service is completed."}
          </p>
          <p className="legal-body-text">
            {isFr
              ? "Le système de pièces sur l'application est utilisé uniquement comme frais de réservation. Le montant minimum de recharge est de 100 FCFA et le maximum par transaction unique est de 10 000 FCFA via MTN Mobile Money ou Orange Money. Fixam ne stocke pas vos identifiants Mobile Money."
              : "The in-app coin system is used strictly as a booking fee. The minimum top-up amount is 100 FCFA and the maximum per single transaction is 10,000 FCFA via MTN Mobile Money or Orange Money. Fixam does not store your Mobile Money credentials."}
          </p>
          <p className="legal-body-text">
            {isFr
              ? "Tous les achats de pièces sont définitifs. Les pièces ne sont pas remboursables, sauf en cas d'erreurs techniques vérifiées sur notre plateforme. Les demandes de remboursement doivent être soumises à notre équipe d'assistance dans les 48 heures suivant la transaction."
              : "All coin purchases are final. Coins are non-refundable except in cases of verified technical errors on our platform. Refund requests must be submitted to our support team within 48 hours of the transaction."}
          </p>
        </>
      )
    },
    {
      id: "coin-system",
      title: isFr ? "Système de Pièces" : "Coin System",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "Fixam utilise un système de pièces virtuelles pour les frais de réservation de la plateforme :" : "Fixam uses a virtual coin system for platform booking fees:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "1 pièce = 5 000 FCFA (sujet à changement)" : "1 coin = 5,000 FCFA (subject to change)"}</li>
            <li>{isFr ? "Bonus de bienvenue : 1 pièce gratuite à l'inscription" : "Welcome bonus: 1 free coin on registration"}</li>
            <li>{isFr ? "Récompense de parrainage : 1 pièce par parrainage réussi" : "Referral reward: 1 coin per successful referral"}</li>
            <li>{isFr ? "Coûts de réservation : 1 pièce (Normal), 2 pièces (Urgent), 3 pièces (Urgence)" : "Booking costs: 1 coin (Normal), 2 coins (Urgent), 3 coins (Emergency)"}</li>
          </ul>
          <p className="legal-body-text">
            {isFr
              ? "Les pièces n'ont aucune valeur monétaire et ne peuvent pas être transférées entre comptes. Fixam se réserve le droit de modifier la valeur ou le prix des pièces avec un préavis aux utilisateurs."
              : "Coins have no cash value and cannot be transferred between accounts. Fixam reserves the right to modify coin values or pricing with notice to users."}
          </p>
        </>
      )
    },
    {
      id: "prohibited-conduct",
      title: isFr ? "Comportements Interdits" : "Prohibited Conduct",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "Vous ne devez pas utiliser Fixam pour :" : "You must not use Fixam to:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "Publier des tâches ou des profils de prestataires faux, trompeurs ou frauduleux" : "Post false, misleading, or fraudulent tasks or provider profiles"}</li>
            <li>{isFr ? "Harceler, menacer ou abuser d'autres utilisateurs" : "Harass, threaten, or abuse other users"}</li>
            <li>{isFr ? "Tenter de contourner le système de frais de réservation par pièces" : "Attempt to bypass the coin booking fee system"}</li>
            <li>{isFr ? "Partager les informations personnelles d'un autre utilisateur sans son consentement" : "Share another user's personal information without consent"}</li>
            <li>{isFr ? "Publier des tâches impliquant des services illégaux" : "Post tasks involving illegal services"}</li>
            <li>{isFr ? "Créer plusieurs comptes pour abuser de notre système de bonus" : "Create multiple accounts to abuse our welcome or referral bonus system"}</li>
            <li>{isFr ? "Utiliser des robots ou des scripts automatisés pour interagir avec la plateforme" : "Use automated bots or scripts to interact with the platform"}</li>
          </ul>
        </>
      )
    },
    {
      id: "intellectual-property",
      title: isFr ? "Propriété Intellectuelle" : "Intellectual Property",
      content: (
        <>
          <p className="legal-body-text">
            {isFr
              ? "Tout le contenu de la plateforme Fixam, y compris l'application mobile, le site web, le logo, le design et le texte, est la propriété de Fixam et est protégé par les lois sur le droit d'auteur et la propriété intellectuelle en vigueur au Cameroun."
              : "All content on the Fixam platform, including the mobile application, website, logo, design, and text, is the property of Fixam and is protected under applicable copyright and intellectual property laws in Cameroon."}
          </p>
          <p className="legal-body-text">
            {isFr
              ? "Vous ne pouvez pas reproduire, distribuer ou créer des œuvres dérivées à partir de notre contenu sans autorisation écrite expresse."
              : "You may not reproduce, distribute, or create derivative works from our content without express written permission."}
          </p>
        </>
      )
    },
    {
      id: "limitation-of-liability",
      title: isFr ? "Limitation de Responsabilité" : "Limitation of Liability",
      content: (
        <>
          <p className="legal-body-text">{isFr ? "Fixam est une plateforme de marché et un service de mise en relation. Nous ne sommes pas responsables de :" : "Fixam is a marketplace platform and connection service. We are not responsible for:"}</p>
          <ul className="legal-list">
            <li>{isFr ? "La qualité ou le résultat des services fournis par les Prestataires" : "The quality or outcome of services provided by Providers"}</li>
            <li>{isFr ? "Tout dommage résultant des interactions entre les Clients et les Prestataires" : "Any damages arising from interactions between Clients and Providers"}</li>
            <li>{isFr ? "La perte de données ou les défaillances techniques échappant à notre contrôle raisonnable" : "Loss of data or technical failures beyond our reasonable control"}</li>
          </ul>
          <p className="legal-body-text">
            {isFr
              ? "Notre responsabilité totale envers vous concernant l'utilisation de la plateforme ne dépassera pas la valeur des pièces achetées et inutilisées dans votre portefeuille."
              : "Our total liability to you regarding platform use shall not exceed the value of purchased and unused coins in your wallet."}
          </p>
        </>
      )
    },
    {
      id: "dispute-resolution",
      title: isFr ? "Résolution des Litiges" : "Dispute Resolution",
      content: (
        <>
          <p className="legal-body-text">
            {isFr
              ? "Si un litige survient entre un Client et un Prestataire, nous encourageons les deux parties à le résoudre directement via notre chat intégré. Si aucune résolution n'est atteinte, vous pouvez contacter l'assistance Fixam via le centre d'aide de l'application."
              : "If a dispute arises between a Client and Provider, we encourage both parties to resolve it directly through our in-app chat. If resolution is not reached, you may contact Fixam Support through the Help Center in the app."}
          </p>
          <p className="legal-body-text">
            {isFr
              ? "Fixam peut, à sa discrétion, arbitrer les litiges mais n'y est pas obligé et ne garantit aucun résultat spécifique."
              : "Fixam may, at its discretion, mediate disputes but is not obligated to do so and does not guarantee any specific outcome."}
          </p>
        </>
      )
    },
    {
      id: "governing-law",
      title: isFr ? "Loi Applicable" : "Governing Law",
      content: (
        <p className="legal-body-text">
          {isFr
            ? "Ces Conditions sont régies par les lois de la République du Cameroun. Tout litige qui ne pourrait être résolu par notre processus de résolution des litiges sera soumis à la juridiction des tribunaux compétents du Cameroun."
            : "These Terms are governed by the laws of the Republic of Cameroon. Any disputes that cannot be resolved through our dispute resolution process shall be subject to the jurisdiction of the competent courts of Cameroon."}
        </p>
      )
    },
    {
      id: "changes-to-terms",
      title: isFr ? "Modifications des Conditions" : "Changes to These Terms",
      content: (
        <>
          <p className="legal-body-text">
            {isFr
              ? "Fixam se réserve le droit de modifier ces Conditions à tout moment. Lorsque nous apportons des modifications importantes, nous vous en informerons via l'application ou par e-mail. Votre utilisation continue de Fixam après l'entrée en vigueur des modifications constitue votre acceptation des Conditions révisées."
              : "Fixam reserves the right to modify these Terms at any time. When we make significant changes, we will notify you through the app or by email. Your continued use of Fixam after changes take effect constitutes your acceptance of the revised Terms."}
          </p>
          <p className="legal-body-text">
            {isFr ? "Date d'entrée en vigueur de la version actuelle : Juin 2026" : "Current version effective date: June 2026"}
          </p>
        </>
      )
    },
    {
      id: "contact-us-terms",
      title: isFr ? "Contactez-Nous" : "Contact Us",
      content: (
        <>
          <p className="legal-body-text">
            {isFr
              ? "Pour toute question concernant ces Conditions, contactez-nous :"
              : "For questions about these Terms, contact:"}
          </p>
          <ul className="legal-list">
            <li>Email: fixam8899@gmail.com</li>
            <li>{isFr ? "Assistance : Disponible via le Centre d'Aide dans l'application Fixam" : "Support: Available through the Help Center in the Fixam app"}</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <LegalLayout 
      pageTitle={isFr ? "Conditions d'Utilisation" : "Terms of Service"}
      effectiveDate={isFr ? "En vigueur le 1 Juin 2026" : "Effective June 1, 2026"}
      sections={sections}
      onNavigate={onNavigate}
      brandText={isFr ? "CONDITIONS D'UTILISATION" : "TERMS OF SERVICE"}
      downloadLabel={isFr ? "Télécharger PDF" : "Download PDF"}
    />
  );
}
