import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../../App';
import '../Resources/Subpages.css';

export default function Updates({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  
  return (
    <div className="subpage-premium">
      <div className="subpage-hero">
        <div className="subpage-container">
          <h1>{i18n.language === 'fr' ? 'Mises à jour Fixam' : 'Fixam Updates'}</h1>
          <p>{i18n.language === 'fr' ? 'Découvrez nos derniers produits, fonctionnalités et partenaires.' : 'Discover our latest products, features, and partners.'}</p>
        </div>
      </div>

      <div className="subpage-content">
        <div className="subpage-container">
          <div className="placeholder-card">
            <div className="placeholder-icon">🚀</div>
            <h2>{i18n.language === 'fr' ? 'Prochainement' : 'Coming Soon'}</h2>
            <p>{i18n.language === 'fr' ? 'Restez à l\'écoute pour les annonces passionnantes concernant notre plateforme.' : 'Stay tuned for exciting announcements and features coming to our platform.'}</p>
            <button className="btn-primary-pill" onClick={() => onNavigate('home')}>
              {i18n.language === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
            </button>
          </div>
        </div>
      </div>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
