import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../../App';
import './Subpages.css';

export default function SuccessStories({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  
  return (
    <div className="subpage-premium">
      <div className="subpage-hero">
        <div className="subpage-container">
          <h1>{i18n.language === 'fr' ? 'Histoires de succès' : 'Success Stories'}</h1>
          <p>{i18n.language === 'fr' ? 'Découvrez comment les équipes travaillent stratégiquement pour se développer avec Fixam.' : 'Discover how teams work strategically to grow with Fixam.'}</p>
        </div>
      </div>

      <div className="subpage-content">
        <div className="subpage-container">
          <div className="placeholder-card">
            <div className="placeholder-icon">🌟</div>
            <h2>{i18n.language === 'fr' ? 'Prochainement' : 'Coming Soon'}</h2>
            <p>{i18n.language === 'fr' ? 'Nous rassemblons des témoignages incroyables de notre communauté. Revenez bientôt !' : 'We are gathering amazing success stories from our community. Check back soon!'}</p>
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
