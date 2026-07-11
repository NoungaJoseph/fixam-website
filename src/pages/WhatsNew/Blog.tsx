import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../../App';
import '../Resources/Subpages.css';

export default function Blog({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  
  return (
    <div className="subpage-premium">
      <div className="subpage-hero">
        <div className="subpage-container">
          <h1>{i18n.language === 'fr' ? 'Blog' : 'Blog'}</h1>
          <p>{i18n.language === 'fr' ? 'Actualités, histoires et conseils de notre plateforme de services.' : 'News, stories, and tips from our service marketplace.'}</p>
        </div>
      </div>

      <div className="subpage-content">
        <div className="subpage-container">
          <div className="placeholder-card">
            <div className="placeholder-icon">📰</div>
            <h2>{i18n.language === 'fr' ? 'Prochainement' : 'Coming Soon'}</h2>
            <p>{i18n.language === 'fr' ? 'Nous préparons des articles de blog intéressants pour vous.' : 'We are writing engaging blog posts just for you. Check back later!'}</p>
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
