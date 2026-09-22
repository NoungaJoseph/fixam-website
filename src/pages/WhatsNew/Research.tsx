import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../../App';
import { useSEO } from '../../hooks/useSEO';
import '../Resources/Subpages.css';

export default function Research({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  useSEO({
    title: isFr ? 'Institut de Recherche & Études Économiques | Fixam' : 'Research Institute & Economic Insights | Fixam',
    description: isFr
      ? 'Insights, analyses et rapports économiques sur le travail informel et les services de proximité au Cameroun.'
      : 'Insights, market data, and research reports on informal labor, skilled trades, and on-demand local services in Cameroon.',
    canonical: 'https://usefixam.com/research',
    isFr
  });
  
  return (
    <div className="subpage-premium">
      <div className="subpage-hero">
        <div className="subpage-container">
          <h1>{i18n.language === 'fr' ? 'Institut de Recherche' : 'Research Institute'}</h1>
          <p>{i18n.language === 'fr' ? 'Insights, données et outils pour les chefs d\'entreprise.' : 'Insights, data, and tools for business leaders.'}</p>
        </div>
      </div>

      <div className="subpage-content">
        <div className="subpage-container">
          <div className="placeholder-card">
            <div className="placeholder-icon">📊</div>
            <h2>{i18n.language === 'fr' ? 'Prochainement' : 'Coming Soon'}</h2>
            <p>{i18n.language === 'fr' ? 'Découvrez des rapports approfondis sur l\'économie des petits boulots au Cameroun.' : 'Discover in-depth reports about the gig economy and service industry in Cameroon.'}</p>
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
