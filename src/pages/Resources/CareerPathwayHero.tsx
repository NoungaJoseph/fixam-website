import { useTranslation } from 'react-i18next';
import { careerPathwaySkills } from '../../data/careerPathways';

export default function CareerPathwayHero({ skillId, onBack, onStart }: { skillId: string; onBack: () => void; onStart?: () => void }) {
  const { i18n } = useTranslation();
  const skill = careerPathwaySkills.find((item) => item.id === skillId) ?? careerPathwaySkills[0];
  const isFr = i18n.language === 'fr';

  return (
    <section className="career-hero" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.25) 100%), url(${skill.image})` }}>
      <div className="career-hero-left">
        <h1>{isFr ? skill.titleFr : skill.title}</h1>
        <div className="career-hero-stats">
          <span>{isFr ? skill.duration.replace(/hours?/g, 'heures').replace(/mins?/g, 'min') : skill.duration}</span>
          <span>{isFr ? skill.levelFr : skill.level}</span>
          <span>{isFr ? 'Gratuit' : 'Free'}</span>
        </div>
      </div>

      <div className="career-hero-card">
        <span className="career-start-badge">{isFr ? "COMMENCER L'APPRENTISSAGE" : "START LEARNING"}</span>
        <h3>{isFr ? 'Commencez Votre Parcours' : 'Begin Your Journey'}</h3>
        <ul>
          <li>{isFr ? 'Complétez les tâches à votre rythme' : 'Complete tasks at your own pace'}</li>
          <li>{isFr ? 'Obtenez un certificat à la fin' : 'Earn a skill certificate on completion'}</li>
          <li>{isFr ? 'Démarquez-vous auprès des clients' : 'Stand out to clients on Fixam'}</li>
        </ul>
        <button className="career-primary-btn" onClick={onStart || onBack}>{isFr ? 'Commencer Gratuitement' : 'Start Free Learning'}</button>
      </div>
    </section>
  );
}
