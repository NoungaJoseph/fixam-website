import { useTranslation } from 'react-i18next';
import { CareerPathwaySkill } from '../../data/careerPathways';

export default function CareerPathwayOverview({ 
  skill, 
  onNavigate 
}: { 
  skill: CareerPathwaySkill; 
  onNavigate: (page: any) => void;
}) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const translateJob = (job: string, isFr: boolean) => {
    if (!isFr) return job;
    
    // Clean text and map
    const clean = job.replace(/\s*—\s*/g, ' - ').replace(/\s*-\s*/g, ' - ');
    
    // Simple mapping
    const mappings: Record<string, string> = {
      'Residential Electrician': 'Électricien Résidentiel',
      'Commercial Electrical Installer': 'Installateur Électrique Commercial',
      'Electrical Maintenance Tech': 'Technicien de Maintenance Électrique',
      'Emergency Plumber': 'Plombier d\'Urgence',
      'Kitchen Fixture Repair': 'Réparateur de Robinetterie Cuisine',
      'Bathroom Plumbing Technician': 'Technicien de Plomberie Salle de Bain',
      'House Cleaner': 'Nettoyeur de Maison',
      'Office Cleaning Specialist': 'Spécialiste du Nettoyage de Bureau',
      'Deep Cleaning Provider': 'Prestataire de Nettoyage en Profondeur',
      'Residential Woodworker': 'Menuisier Résidentiel',
      'Custom Cabinet Maker': 'Fabricant de Meubles sur Mesure',
      'Structural Construction Framer': 'Charpentier de Construction',
      'Interior Wall Painter': 'Peintre de Murs Intérieurs',
      'Commercial Finisher': 'Finisseur Commercial',
      'Home Decor Painting Contractor': 'Entrepreneur en Peinture Décorative',
      'Home Spa Beautician': 'Esthéticienne à Domicile',
      'Mobile Massage Therapist': 'Massothérapeute Mobile',
      'Nail & Cuticle Care Specialist': 'Spécialiste des Ongles & Cuticules',
      'CCTV System Installer': 'Installateur de Systèmes Vidéosurveillance',
      'Home Security Technician': 'Technicien de Sécurité Domestique',
      'Surveillance System Support': 'Support de Systèmes de Surveillance',
      'Primary School Tutor': 'Tuteur d\'École Primaire',
      'High School Math Tutor': 'Tuteur de Maths de Lycée',
      'Language Support Instructor': 'Enseignant d\'Appui Linguistique',
      'Professional House Mover': 'Déménageur Professionnel de Maison',
      'Local Delivery Courier': 'Livreur Coursier Local',
      'Logistics Packing Specialist': 'Spécialiste de l\'Emballage Logistique',
      'Landscape Gardener': 'Jardinier Paysagiste',
      'Lawn Care Specialist': 'Spécialiste de l\'Entretien des Pelouses',
      'Garden Maintenance Worker': 'Agent d\'Entretien de Jardin',
      'Private Home Chef': 'Chef Cuisinier Privé à Domicile',
      'Event Catering Specialist': 'Traiteur Spécialisé Événementiel',
      'Kitchen Prep Assistant': 'Assistant de Préparation en Cuisine',
      'Professional Photographer': 'Photographe Professionnel',
      'Event Photographer': 'Photographe d\'Événement',
      'Portrait & Photo Editor': 'Portraitiste & Retoucheur Photo',
      // Cities / Countries
      'Douala': 'Douala',
      'Yaoundé': 'Yaoundé',
      'Cameroon': 'Cameroun',
      'London': 'Londres',
      'Paris': 'Paris',
      'Berlin': 'Berlin'
    };

    let translated = clean;
    Object.keys(mappings).forEach(key => {
      const regex = new RegExp(key, 'g');
      translated = translated.replace(regex, mappings[key]);
    });
    return translated;
  };

  const formattedDuration = isFr 
    ? skill.duration.replace(/hours?/g, 'heures').replace(/mins?/g, 'min') 
    : skill.duration;

  return (
    <section className="career-section-grid">
      <div className="career-section-left">
        <h2>{isFr ? 'Pourquoi Apprendre Cette Compétence' : 'Why Learn This Skill'}</h2>
        <p>{isFr ? skill.descriptionFr : skill.description}</p>
        <div className="career-inline-stats">
          <span>{isFr ? 'À son rythme' : 'Self-paced'} {formattedDuration}</span>
          <span>• {isFr ? 'Sans notes' : 'No grades'}</span>
          <span>• {isFr ? 'Sans évaluations' : 'No assessments'}</span>
          <span>• {isFr ? skill.levelFr : skill.level}</span>
        </div>
        <a href="#" className="career-link" onClick={(e) => { e.preventDefault(); onNavigate('services'); }}>
          {isFr ? 'Voir Plus' : 'View More'}
        </a>

        <div className="career-how-boxes">
          <h3>{isFr ? 'Comment ça Marche' : 'How It Works'}</h3>
          <div className="career-how-item">
            <div className="career-icon-circle">1</div>
            <div>{isFr ? 'Complétez les tâches guidées par des tutoriels vidéo et des réponses d\'experts.' : 'Complete tasks guided by video tutorials and example answers from expert practitioners.'}</div>
          </div>
          <div className="career-how-item">
            <div className="career-icon-circle">2</div>
            <div>{isFr ? 'Obtenez un certificat numérique et ajoutez-le à votre profil Fixam.' : 'Earn a digital certificate and add it to your Fixam provider profile.'}</div>
          </div>
          <div className="career-how-item">
            <div className="career-icon-circle">3</div>
            <div>{isFr ? 'Démarquez-vous auprès des clients sur Fixam et gagnez plus de réservations.' : 'Stand out to clients on Fixam and win more bookings.'}</div>
          </div>
        </div>
      </div>

      <div className="career-section-right">
        <div className="career-side-card">
          <span className="career-side-badge">{isFr ? 'DISPONIBLE SUR FIXAM' : 'AVAILABLE ON FIXAM'}</span>
          <ul style={{ paddingLeft: '1rem', listStyleType: 'none', margin: '0.8rem 0' }}>
            {skill.jobs.map((job) => (
              <li 
                key={job} 
                onClick={() => onNavigate('services')} 
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.48rem 0', borderBottom: '1px solid var(--line)' }}
              >
                <span>{translateJob(job, isFr)}</span>
                <span style={{ color: '#14b8a6', marginLeft: '8px' }}>→</span>
              </li>
            ))}
          </ul>
          <a href="#" className="career-link" onClick={(e) => { e.preventDefault(); onNavigate('services'); }}>
            {isFr ? '+ 5 autres disponibles' : '+ 5 more available'}
          </a>
        </div>

        <div className="career-side-card">
          <h4>{isFr ? 'Compétences que vous apprendrez :' : 'Skills you will learn and practice:'}</h4>
          <div className="career-pill-grid">
            {(isFr ? skill.skillsFr : skill.skills).map((item) => (
              <span className="career-pill" key={item}>{item}</span>
            ))}
          </div>
          <a href="#" className="career-link" onClick={(e) => { e.preventDefault(); onNavigate('services'); }}>
            {isFr ? 'Voir tout' : 'View All'}
          </a>
        </div>
      </div>
    </section>
  );
}
