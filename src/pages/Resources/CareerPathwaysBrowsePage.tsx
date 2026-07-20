import { useTranslation } from 'react-i18next';
import './CareerPathways.css';
import { Footer } from '../../App';

export default function CareerPathwaysBrowsePage({ 
  onNavigate 
}: { 
  onNavigate: (page: any) => void;
}) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const handleGetStarted = () => {
    window.open('https://career.usefixam.com', '_blank');
  };

  const trades = [
    { id: 'electrical', nameEn: 'Electrical Repairs', nameFr: 'Électricité', descEn: 'Master wiring, diagnostic, and fixture setups.', descFr: 'Maîtrisez le câblage, le diagnostic et l\'installation.' },
    { id: 'plumbing', nameEn: 'Plumbing & Pipes', nameFr: 'Plomberie', descEn: 'Learn leak diagnostic and basin connections.', descFr: 'Apprenez le diagnostic des fuites et les raccordements.' },
    { id: 'carpentry', nameEn: 'Carpentry & Woodwork', nameFr: 'Menuiserie', descEn: 'Build, repair, and install furniture structures.', descFr: 'Construisez, réparez et installez des structures.' },
    { id: 'cleaning', nameEn: 'Professional Cleaning', nameFr: 'Nettoyage & Hygiène', descEn: 'Sanitization, office deep clean, and pest control.', descFr: 'Désinfection, nettoyage de bureau et traitement nuisibles.' },
    { id: 'painting', nameEn: 'Painting & Finish', nameFr: 'Peinture & Finition', descEn: 'Surface prep, wall paint, and decoration coating.', descFr: 'Préparation, peinture murale et revêtements déco.' },
    { id: 'appliance', nameEn: 'Appliance Repair', nameFr: 'Électroménager', descEn: 'Fix AC systems, generators, and refrigerators.', descFr: 'Dépannage de climatiseurs, générateurs et frigos.' },
    { id: 'security', nameEn: 'CCTV & Security', nameFr: 'Sécurité & Alarme', descEn: 'Install CCTV cameras and smart sensors.', descFr: 'Installez des caméras et capteurs intelligents.' },
    { id: 'moving', nameEn: 'Logistics & Moving', nameFr: 'Déménagement & Transport', descEn: 'Safe packing, heavy lifting, and courier delivery.', descFr: 'Emballage sécurisé, transport et livraison.' }
  ];

  return (
    <>
      <div className="career-marketing-container">
        {/* Top Header Label */}
        <div className="subdomain-brand-header">
          <div className="subdomain-brand">
            <span className="brand-dot" />
            <span>Fixam Career Pathways</span>
          </div>
          <div className="subdomain-tagline">
            {isFr 
              ? 'Le portail officiel de formation et de certification des prestataires Fixam' 
              : 'The official vocational training and certification portal for Fixam providers'}
          </div>
        </div>

        {/* Hero Section */}
        <section className="career-hero-section">
          <div className="career-hero-content">
            <h1>
              {isFr 
                ? 'Propulsez votre carrière de métier avec des simulations réelles' 
                : 'Build your trade career with real-world task simulations'}
            </h1>
            <p>
              {isFr 
                ? 'Fixam Career Pathways propose des simulations virtuelles basées sur des missions réelles. Apprenez des compétences techniques, passez des certifications et débloquez des emplois mieux rémunérés.' 
                : 'Fixam Career Pathways offers interactive task-based simulations designed around actual local client jobs. Master technical skills, earn accredited certificates, and unlock higher-paying jobs.'}
            </p>
            <button className="career-cta-btn-premium" onClick={handleGetStarted}>
              {isFr ? 'Démarrer l\'Apprentissage (Gratuit) →' : 'Start Learning (Free) →'}
            </button>
          </div>
        </section>

        {/* Stats Proof Bar */}
        <section className="career-stats-bar">
          <div className="career-stats-grid">
            <div className="career-stat-card">
              <h3>15+</h3>
              <span>{isFr ? 'Parcours de Métiers' : 'Trade Pathways'}</span>
            </div>
            <div className="career-stat-divider" />
            <div className="career-stat-card">
              <h3>2,000+</h3>
              <span>{isFr ? 'Simulations Complétées' : 'Completed Simulations'}</span>
            </div>
            <div className="career-stat-divider" />
            <div className="career-stat-card">
              <h3>100%</h3>
              <span>{isFr ? 'Certificats Vérifiés' : 'Verified Credentials'}</span>
            </div>
            <div className="career-stat-divider" />
            <div className="career-stat-card">
              <h3>Global</h3>
              <span>{isFr ? 'Disponibilité' : 'Coverage Areas'}</span>
            </div>
          </div>
        </section>

        {/* Core Value/Benefits Grid */}
        <section className="career-benefits-section">
          <div className="section-title-centered">
            <h2>{isFr ? 'Pourquoi rejoindre Fixam Career Pathways ?' : 'Why join Fixam Career Pathways?'}</h2>
            <p>{isFr ? 'Une formation professionnelle de pointe conçue pour les experts indépendants' : 'State-of-the-art vocational training built for independent experts'}</p>
          </div>

          <div className="career-benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🛠️</div>
              <h3>{isFr ? 'Simulations Pratiques' : 'Task-Based Practice'}</h3>
              <p>
                {isFr 
                  ? 'Résolvez des cas réels : diagnostic de fuites de tuyaux, changement de cartouche de robinet ou installation de caméras de sécurité.' 
                  : 'Solve interactive cases: leak diagnostics, electrical cartridge replacement, or security sensor setups.'}
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🎓</div>
              <h3>{isFr ? 'Certificats Vérifiés' : 'Vetted Credentials'}</h3>
              <p>
                {isFr 
                  ? 'Obtenez des certificats officiels de compétences qui s\'affichent automatiquement sous forme de badges sur votre profil de prestataire.' 
                  : 'Earn official completion certificates that automatically sync as verified badges on your marketplace provider profile.'}
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🚀</div>
              <h3>{isFr ? 'Revenus Boostés' : 'Increase Bookings'}</h3>
              <p>
                {isFr 
                  ? 'Les clients préfèrent les prestataires certifiés. Votre badge de compétences augmente votre priorité de recherche de 40%.' 
                  : 'Certified providers build instant trust. Verified skill badges boost your marketplace search ranking by up to 40%.'}
              </p>
            </div>
          </div>
        </section>

        {/* Grid of Trades */}
        <section className="career-trades-section">
          <div className="section-title-centered">
            <h2>{isFr ? 'Explorez nos parcours de métiers' : 'Explore our vocational pathways'}</h2>
            <p>{isFr ? 'Sélectionnez un domaine pour voir les simulations correspondantes sur notre portail' : 'Select a trade field to view corresponding simulations on our learning portal'}</p>
          </div>

          <div className="career-trades-grid">
            {trades.map((trade) => (
              <div key={trade.id} className="trade-card-marketing" onClick={handleGetStarted}>
                <div className="trade-card-header">
                  <span className="trade-badge">{isFr ? 'Portail' : 'Portal'}</span>
                  <h3>{isFr ? trade.nameFr : trade.nameEn}</h3>
                </div>
                <p>{isFr ? trade.descFr : trade.descEn}</p>
                <span className="trade-card-action">{isFr ? 'Accéder au parcours →' : 'Access pathway →'}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Certificate visual card */}
        <section className="career-certificate-showcase">
          <div className="cert-showcase-card">
            <div className="cert-showcase-text">
              <h2>{isFr ? 'Gagnez votre certificat Fixam' : 'Earn Your Fixam Certificate'}</h2>
              <p>
                {isFr 
                  ? 'Prouvez votre expertise aux clients locaux. Chaque simulation complétée génère un certificat avec signatures et sceau d\'approbation Fixam.' 
                  : 'Build credibility with local clients. Every completed simulation awards you an official certificate with a gold seal and instructor sign-off.'}
              </p>
              <button className="career-cta-btn-outline" onClick={handleGetStarted}>
                {isFr ? 'Commencer un parcours' : 'Begin a Pathway'}
              </button>
            </div>
            <div className="cert-preview-frame-mini">
              <div className="cert-border-inner-mini">
                <span className="cert-top-seal-mini">FIXAM PATHWAYS</span>
                <h4>{isFr ? 'CERTIFICAT DE COMPLÉTION' : 'CERTIFICATE OF COMPLETION'}</h4>
                <div className="cert-user-name-placeholder">Nounga Joseph</div>
                <p>{isFr ? 'Atteste de la maîtrise des compétences en électricité et plomberie.' : 'Verifying mastery of key vocational field skills.'}</p>
                <div className="cert-seal-mini">★ APPROVED ★</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
