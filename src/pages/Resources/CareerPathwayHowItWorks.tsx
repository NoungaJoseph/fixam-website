import { useTranslation } from 'react-i18next';
import { CareerPathwaySkill } from '../../data/careerPathways';

export default function CareerPathwayHowItWorks({ skill }: { skill: CareerPathwaySkill }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  return (
    <section className="career-how-section">
      <h2>{isFr ? 'Comment Ça Fonctionne' : 'How It Works'}</h2>
      <div className="career-how-item-panel">
        <div className="career-icon-circle">1</div>
        <div>
          <strong>{isFr ? 'Tâches guidées' : 'Guided tasks'}</strong>
          <p>{isFr ? 'Complétez les tâches guidées par des tutoriels vidéo et des exemples de réponses d\'experts. Aucune session live, tout est à votre rythme.' : 'Complete tasks guided by video tutorials and example answers from expert practitioners. No live sessions — all self-paced.'}</p>
        </div>
      </div>
      <div className="career-how-item-panel">
        <div className="career-icon-circle">2</div>
        <div>
          <strong>{isFr ? 'Certificat numérique' : 'Digital certificate'}</strong>
          <p>{isFr ? 'Obtenez un certificat numérique et ajoutez-le à votre profil prestataire Fixam. Montrez vos compétences vérifiées.' : 'Earn a digital certificate and add it to your Fixam provider profile. Show clients your verified skills.'}</p>
        </div>
      </div>
      <div className="career-how-item-panel">
        <div className="career-icon-circle">3</div>
        <div>
          <strong>{isFr ? 'Mise en valeur des clients' : 'Stand out to clients'}</strong>
          <p>{isFr ? 'Démarquez-vous auprès des clients sur Fixam. Démontrez votre expertise et obtenez plus de réservations.' : 'Stand out to clients on Fixam. Confidently demonstrate your expertise and win more bookings.'}</p>
        </div>
      </div>
    </section>
  );
}
