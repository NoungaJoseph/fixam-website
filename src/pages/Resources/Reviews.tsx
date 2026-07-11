import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../../App';
import './Subpages.css';

export default function ReviewsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  
  return (
    <div className="subpage-premium">
      <div className="subpage-hero">
        <div className="subpage-container">
          <h1>{i18n.language === 'fr' ? 'Avis de la Communauté' : 'Community Reviews'}</h1>
          <p>{i18n.language === 'fr' ? 'Voyez ce que c\'est de collaborer et de travailler sur Fixam.' : 'See what it\'s like to collaborate and work on Fixam.'}</p>
        </div>
      </div>

      <div className="subpage-content">
        <div className="subpage-container">
          <div className="placeholder-card">
            <div className="placeholder-icon">⭐</div>
            <h2>{i18n.language === 'fr' ? 'Prochainement' : 'Coming Soon'}</h2>
            <p>{i18n.language === 'fr' ? 'Consultez les expériences authentiques de nos clients et prestataires.' : 'Browse through authentic experiences from our clients and service providers.'}</p>
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
