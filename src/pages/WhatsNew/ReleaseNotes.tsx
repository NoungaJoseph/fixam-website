import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../../App';
import '../Resources/Subpages.css';

export default function ReleaseNotes({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  
  return (
    <div className="subpage-premium">
      <div className="subpage-hero">
        <div className="subpage-container">
          <h1>{i18n.language === 'fr' ? 'Notes de mise à jour' : 'Release Notes'}</h1>
          <p>{i18n.language === 'fr' ? 'Toutes nos dernières nouveautés et améliorations.' : 'Our latest product news and platform improvements.'}</p>
        </div>
      </div>

      <div className="subpage-content">
        <div className="subpage-container">
          <div className="placeholder-card">
            <div className="placeholder-icon">📝</div>
            <h2>{i18n.language === 'fr' ? 'Version 1.0 (Bêta)' : 'Version 1.0 (Beta)'}</h2>
            <p>{i18n.language === 'fr' ? 'Nous sommes ravis de lancer la plateforme Fixam pour le grand public !' : 'We are excited to launch the Fixam platform to the public!'}</p>
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
