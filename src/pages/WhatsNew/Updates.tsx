import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../../App';
import '../Resources/Subpages.css';

export default function Updates({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  
  const updatesList = [
    {
      date: 'August 13, 2026',
      titleEn: '🛡️ Enterprise-Grade Platform Security Upgrade',
      titleFr: '🛡️ Mise à jour de sécurité de niveau entreprise',
      tag: 'Security',
      tagClass: 'tag-security',
      highlightsEn: [
        'DB-Backed Hashed OTP System: Verification codes are now hashed with bcrypt and persisted safely.',
        'Instant Session Revocation: Logged-out or compromised sessions are revoked immediately across devices.',
        'Strict Brute-Force Rate Limiting: Dedicated rate limiters (max 5 tries) protect authentication endpoints.',
        'Secure File Access Control: Verification documents and payment receipts require authenticated admin permission.'
      ],
      highlightsFr: [
        'Système OTP basé sur la base de données : Les codes de vérification sont désormais hachés avec bcrypt.',
        'Révocation instantanée de session : Les sessions déconnectées sont révoquées immédiatement.',
        'Limitation stricte du taux de tentatives : Des limiteurs dédiés protègent les points d\'accès d\'authentification.',
        'Contrôle d\'accès sécurisé aux fichiers : Les documents de vérification nécessitent une autorisation administrateur.'
      ]
    },
    {
      date: 'August 12, 2026',
      titleEn: '💰 Official Coin Purchase Approval Flow',
      titleFr: '💰 Flux d\'approbation officiel d\'achat de pièces',
      tag: 'Billing',
      tagClass: 'tag-feature',
      highlightsEn: [
        'Admin Transaction Queue: Coin purchases create official pending transaction records.',
        'One-Click Approval: Admins can verify and instantly credit user wallet coin balances.',
        'Real-Time Socket Sync: Live updates notify mobile and web apps immediately.'
      ],
      highlightsFr: [
        'File de transactions administrateur : Les achats de pièces créent des enregistrements officiels.',
        'Approbation en un clic : Les administrateurs peuvent créditer instantanément le solde de pièces.',
        'Synchronisation en temps réel : Les applications mobiles et web sont notifiées immédiatement.'
      ]
    },
    {
      date: 'August 10, 2026',
      titleEn: '🔍 Provider Job Feed Filters & Saved Jobs',
      titleFr: '🔍 Filtres du flux d\'offres et d\'emplois enregistrés',
      tag: 'Mobile App',
      tagClass: 'tag-app',
      highlightsEn: [
        'Categorized Tabs: All Jobs, Most Recent, Remote Only, Favorites, and Rejected.',
        'Dynamic Counts: Instant visibility into saved and hidden job listings.',
        'Interactive Actions: Easily restore rejected listings back to your main feed.'
      ],
      highlightsFr: [
        'Onglets catégorisés : Tous les emplois, Plus récents, À distance uniquement, Favoris et Rejetés.',
        'Comptes dynamiques : Visibilité instantanée sur les annonces enregistrées et masquées.',
        'Actions interactives : Restaurez facilement les annonces rejetées dans votre flux principal.'
      ]
    }
  ];

  return (
    <div className="subpage-premium">
      <div className="subpage-hero">
        <div className="subpage-container">
          <h1>{isFr ? 'Mises à jour Fixam' : 'Fixam Updates'}</h1>
          <p>{isFr ? 'Découvrez nos derniers produits, fonctionnalités, améliorations de sécurité et partenariats.' : 'Discover our latest products, features, security enhancements, and platform updates.'}</p>
        </div>
      </div>

      <div className="subpage-content">
        <div className="subpage-container" style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {updatesList.map((item, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px 28px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>{item.date}</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: item.tag === 'Security' ? '#FEF2F2' : '#F0FDF4',
                  color: item.tag === 'Security' ? '#DC2626' : '#166534',
                  border: `1px solid ${item.tag === 'Security' ? '#FCA5A5' : '#86EFAC'}`
                }}>
                  {item.tag}
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                {isFr ? item.titleFr : item.titleEn}
              </h2>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#334155', lineHeight: '1.6' }}>
                {(isFr ? item.highlightsFr : item.highlightsEn).map((point, pIdx) => (
                  <li key={pIdx} style={{ marginBottom: '6px' }}>{point}</li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button className="btn-primary-pill" onClick={() => onNavigate('home')}>
              {isFr ? 'Retour à l\'accueil' : 'Back to Home'}
            </button>
          </div>
        </div>
      </div>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

