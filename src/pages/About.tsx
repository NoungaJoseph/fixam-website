import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../App';
import './About.css';

const aboutContent = {
  en: {
    hero: {
      title: 'About Fixam',
      subtitle: 'We are on a mission to make life easier by bridging the gap between individuals who need services and verified professionals who provide them.',
    },
    mission: {
      title: 'Our Mission',
      desc: 'Fixam is a premier digital marketplace dedicated to transforming the way everyday services are discovered, booked, and delivered in Cameroon. We believe in empowering local professionals with a robust platform to grow their businesses, while giving clients the ultimate peace of mind that comes with trusted, verified talent.',
    },
    values: {
      title: 'Our Core Values',
      items: [
        {
          title: 'Trust & Safety',
          desc: 'Every provider goes through rigorous identity verification. We prioritize your peace of mind.'
        },
        {
          title: 'Quality & Reliability',
          desc: 'We are committed to maintaining a high standard of service through verified client reviews.'
        },
        {
          title: 'Economic Empowerment',
          desc: 'We provide tools and visibility for skilled individuals to build sustainable businesses.'
        }
      ]
    },
    cta: {
      title: 'Join the Fixam Community',
      desc: 'Whether you are looking to hire a professional or offer your services, Fixam is the place for you.',
      btnClient: 'Hire a Professional',
      btnProvider: 'Become a Provider'
    }
  },
  fr: {
    hero: {
      title: 'À Propos de Fixam',
      subtitle: 'Notre mission est de faciliter la vie en comblant le fossé entre les personnes ayant besoin de services et les professionnels vérifiés.',
    },
    mission: {
      title: 'Notre Mission',
      desc: 'Fixam est un marché numérique de premier plan dédié à la transformation de la façon dont les services quotidiens sont découverts, réservés et fournis au Cameroun. Nous croyons en l\'autonomisation des professionnels locaux, tout en offrant aux clients la tranquillité d\'esprit ultime qui accompagne les talents fiables et vérifiés.',
    },
    values: {
      title: 'Nos Valeurs Fondamentales',
      items: [
        {
          title: 'Confiance & Sécurité',
          desc: 'Chaque prestataire passe par une vérification d\'identité rigoureuse. Nous privilégions votre tranquillité d\'esprit.'
        },
        {
          title: 'Qualité & Fiabilité',
          desc: 'Nous nous engageons à maintenir un niveau de service élevé grâce à des avis clients vérifiés.'
        },
        {
          title: 'Autonomisation Économique',
          desc: 'Nous fournissons des outils et de la visibilité aux personnes qualifiées pour bâtir des entreprises durables.'
        }
      ]
    },
    cta: {
      title: 'Rejoignez la Communauté Fixam',
      desc: 'Que vous cherchiez à engager un professionnel ou à offrir vos services, Fixam est l\'endroit pour vous.',
      btnClient: 'Engager un Professionnel',
      btnProvider: 'Devenir Prestataire'
    }
  }
};

export default function About({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';
  const c = aboutContent[lang];

  return (
    <div className="about-page-premium">
      <div className="about-hero">
        <div className="container">
          <h1>{c.hero.title}</h1>
          <p>{c.hero.subtitle}</p>
        </div>
      </div>
      
      <section className="about-mission-section">
        <div className="container">
          <h2>{c.mission.title}</h2>
          <p>{c.mission.desc}</p>
        </div>
      </section>

      <section className="about-values-section">
        <div className="container">
          <h2>{c.values.title}</h2>
          <div className="values-grid">
            {c.values.items.map((item, idx) => (
              <div className="value-card" key={idx}>
                <div className="value-number">0{idx + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-box">
            <h2>{c.cta.title}</h2>
            <p>{c.cta.desc}</p>
            <div className="about-cta-actions">
              <button className="btn-primary-pill" onClick={() => onNavigate('services')}>
                {c.cta.btnClient}
              </button>
              <button className="btn-secondary-pill white-variant-btn" onClick={() => onNavigate('guide')}>
                {c.cta.btnProvider}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
