import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './CareerPathways.css';
import { Footer } from '../../App';

interface Course {
  id: string;
  title: string;
  titleFr: string;
  category: 'provider' | 'client';
  description: string;
  descriptionFr: string;
  duration: string;
  durationFr: string;
  difficulty: string;
  difficultyFr: string;
  instructor: string;
  instructorRole: string;
  instructorRoleFr: string;
  instructorBio: string;
  instructorBioFr: string;
  skillsGained: string[];
  skillsGainedFr: string[];
  importanceText: string;
  importanceTextFr: string;
  marketDemand: string;
  marketDemandFr: string;
  benefits: string[];
  benefitsFr: string[];
  cvLinkedInGuide: string;
  cvLinkedInGuideFr: string;
  briefVideoTitle: string;
  briefVideoTitleFr: string;
  briefVideoDuration: string;
  briefText: string;
  briefTextFr: string;
  taskInstructions: string;
  taskInstructionsFr: string;
  taskQuestions: {
    question: string;
    questionFr: string;
    options: string[];
    optionsFr: string[];
    correctIndex: number;
    explanation: string;
    explanationFr: string;
  }[];
  modelVideoTitle: string;
  modelVideoTitleFr: string;
  modelVideoDuration: string;
  modelText: string;
  modelTextFr: string;
  dangerAlert?: string;
  dangerAlertFr?: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: 'plumbing-pro',
    title: 'Professional Faucet Repair & Customer Ethics',
    titleFr: 'Réparation Professionnelle de Robinet & Éthique',
    category: 'provider',
    description: 'Learn the step-by-step professional method for repairing faucet leaks while maintaining premium client relations and cleanliness standards.',
    descriptionFr: 'Apprenez la méthode professionnelle étape par étape pour réparer les fuites de robinet tout en maintenant des normes de relation client et de propreté élevées.',
    duration: '45 mins',
    durationFr: '45 min',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    instructor: 'Jean-Pierre Nguene',
    instructorRole: 'Master Plumber & Instructor',
    instructorRoleFr: 'Maître Plombier & Formateur',
    instructorBio: 'Jean-Pierre is a licensed plumbing consultant with 15+ years of experience leading service teams across Central Africa. He specializes in residential plumbing diagnostics and technician ethics.',
    instructorBioFr: 'Jean-Pierre est un consultant en plomberie agréé avec plus de 15 ans d\'expérience dans la direction d\'équipes de service en Afrique Centrale. Il est spécialisé dans le diagnostic et l\'éthique des techniciens.',
    skillsGained: ['Leak Diagnosis', 'Component Replacement', 'Professional Communication', 'Worksite Cleanup'],
    skillsGainedFr: ['Diagnostic de Fuite', 'Remplacement de Composant', 'Communication Professionnelle', 'Nettoyage du Chantier'],
    importanceText: 'Faucet leak calls represent over 40% of all plumbing service requests on Fixam. Mastering this skill not only increases your diagnostic speed but also ensures high client satisfaction ratings, which directly boosts your profile ranking and job matching probability.',
    importanceTextFr: 'Les appels pour fuite de robinet représentent plus de 40 % de toutes les demandes de service de plomberie sur Fixam. Maîtriser cette compétence augmente votre rapidité et assure d\'excellentes évaluations clients.',
    marketDemand: 'Clients look for plumbers who arrive on time, explain the issue clearly before starting work, use clean professional tools, and leave the workspace spotless. Over 85% of 5-star reviews highlight cleanliness as a deciding factor.',
    marketDemandFr: 'Les clients recherchent des plombiers ponctuels, transparents et ordonnés. Plus de 85 % des avis 5 étoiles soulignent la propreté comme facteur décisif de satisfaction.',
    benefits: [
      'Gain a 10% search visibility boost on the Fixam app as a "Certified Provider".',
      'Earn the gold-seal Fixam Certificate of Honor to display on your profile.',
      'Attract premium clients willing to pay higher rates for certified experts.'
    ],
    benefitsFr: [
      'Bénéficiez d\'un boost de visibilité de 10 % sur l\'application en tant que prestataire certifié.',
      'Obtenez le certificat d\'honneur officiel Fixam avec sceau d\'or.',
      'Attirez des clients prêts à payer des tarifs plus élevés pour des experts.'
    ],
    cvLinkedInGuide: 'After completing the program, you will receive a verified certificate credential URL. You can list this under "Licenses & Certifications" on LinkedIn (Issuing Organization: Fixam) and add it to the "Certifications" section of your CV to show your commitment to professional ethics and field mastery.',
    cvLinkedInGuideFr: 'Après avoir terminé le programme, vous recevrez une URL de certificat vérifiée. Vous pourrez l\'ajouter dans la section Certifications de LinkedIn et sur votre CV.',
    briefVideoTitle: 'Faucet Repair Briefing - Jean-Pierre',
    briefVideoTitleFr: 'Briefing de réparation de robinet - Jean-Pierre',
    briefVideoDuration: '3:15',
    briefText: 'Welcome to your simulation! I\'m Jean-Pierre, your mentor. Today, you are representing Fixam at a client\'s house. The client reported a kitchen sink leak that has soaked their lower cabinet. Your goal is to inspect the setup, select the correct tools, fix the faucet cartridge or joint leak safely, and leave the workspace cleaner than it was.',
    briefTextFr: 'Bienvenue dans votre simulation ! Je suis Jean-Pierre, votre mentor. Aujourd\'hui, le client a signalé une fuite sous l\'évier de la cuisine. Votre but est d\'inspecter l\'installation, couper l\'eau, remplacer la cartouche usée et nettoyer soigneusement la zone.',
    taskInstructions: 'A client has a dripping single-handle mixer tap. Before opening any valves, choose the correct diagnostics and action sequence below to complete this task.',
    taskInstructionsFr: 'Le client a un mitigeur qui goutte. Avant de démonter quoi que ce soit, choisissez la bonne séquence d\'actions ci-dessous pour accomplir cette tâche.',
    taskQuestions: [
      {
        question: 'What is the absolute first action you must take before starting any plumbing disassembly?',
        questionFr: 'Quelle est la première action absolue à effectuer avant tout démontage ?',
        options: [
          'Unscrew the faucet handle directly',
          'Shut off the water supply using the angle stop valves under the sink',
          'Apply Teflon tape to the spout',
          'Place a bucket to collect the leakage'
        ],
        optionsFr: [
          'Dévisser directement la poignée du robinet',
          'Couper l\'alimentation en eau à l\'aide des vannes d\'arrêt sous l\'évier',
          'Appliquer du ruban téflon sur le bec',
          'Placer un seau pour recueillir la fuite'
        ],
        correctIndex: 1,
        explanation: 'Always shut off the local water supply first. Disassembling a plumbing fixture under line pressure will cause immediate flooding.',
        explanationFr: 'Coupez toujours l\'alimentation d\'eau en premier. Démonter un raccord sous pression provoquera une inondation immédiate.'
      },
      {
        question: 'The water is shut off, but the faucet is still dripping from under the handle. Which component is most likely worn out and needs replacement?',
        questionFr: 'L\'eau est coupée, mais le robinet goutte toujours sous la poignée. Quelle pièce est la plus susceptible d\'être usée et doit être remplacée ?',
        options: [
          'The aerator at the tip of the spout',
          'The decorative cover dome',
          'The internal ceramic disc cartridge',
          'The hot water flexible supply line'
        ],
        optionsFr: [
          'L\'aérateur à l\'extrémité du bec',
          'Le dôme décoratif de protection',
          'La cartouche interne à disques en céramique',
          'Le flexible d\'alimentation d\'eau chaude'
        ],
        correctIndex: 2,
        explanation: 'In single-handle mixer taps, dripping from the handle area usually indicates that the internal ceramic disc cartridge is cracked or its seals are worn out.',
        explanationFr: 'Sur les mitigeurs, un goutte-à-goutte sous la poignée indique généralement que la cartouche en céramique ou ses joints sont usés.'
      },
      {
        question: 'Which of these behaviors is required to maintain the Fixam Professional Standard before leaving the client\'s house?',
        questionFr: 'Quel comportement est requis pour respecter les normes professionnelles de Fixam avant de quitter le domicile du client ?',
        options: [
          'Leave the wet floor as it is since it was already leaking',
          'Dry the cabinet floor, wipe down the faucet, double-check for leaks under pressure, and politely ask the client to inspect the result',
          'Tell the client they need to buy a completely new sink',
          'Pack your tools and leave immediately without testing'
        ],
        optionsFr: [
          'Laisser le sol mouillé puisque la fuite était déjà présente',
          'Sécher le meuble, essuyer le robinet, vérifier l\'étanchéité sous pression et faire inspecter le résultat par le client',
          'Dire au client d\'acheter un évier complètement neuf',
          'Ranger ses outils et partir immédiatement sans tester sous pression'
        ],
        correctIndex: 1,
        explanation: 'Fixam professionals always clean up the worksite, test their work under pressure to ensure no new leaks occur, and walk the client through the repair.',
        explanationFr: 'Les professionnels de Fixam nettoient toujours le chantier, testent leur travail sous pression et font valider le résultat par le client.'
      }
    ],
    modelVideoTitle: 'Faucet Repair Model Walkthrough - Jean-Pierre',
    modelVideoTitleFr: 'Démonstration de réparation de robinet - Jean-Pierre',
    modelVideoDuration: '5:40',
    modelText: 'Excellent work completing the simulation! In this video walkthrough, I show you how to swap out a worn-out mixer cartridge, how to safely clean the seat before insertion to prevent grit from causing leaks, and how to verify pressure. Always remember: customer trust is built on quality, transparency, and a clean workspace.',
    modelTextFr: 'Excellent travail ! Dans cette démonstration, je vous montre comment remplacer la cartouche usée, nettoyer le siège avant insertion pour éviter les impuretés et vérifier la pression. Rappelez-vous : la confiance repose sur la qualité et la propreté.'
  },
  {
    id: 'plumbing-diy',
    title: 'Household Water Leak Diagnosis',
    titleFr: 'Diagnostic de Fuite d\'Eau Domestique',
    category: 'client',
    description: 'Learn how to safely locate water leaks under your sink, identify simple fixes you can do yourself, and know when you must hire a professional.',
    descriptionFr: 'Apprenez à localiser en toute sécurité les fuites d\'eau sous votre évier, à identifier les réparations simples à faire soi-même et à savoir quand appeler un pro.',
    duration: '25 mins',
    durationFr: '25 min',
    difficulty: 'Beginner',
    difficultyFr: 'Débutant',
    instructor: 'Sarah Kamga',
    instructorRole: 'Home Maintenance Specialist',
    instructorRoleFr: 'Spécialiste de l\'Entretien Ménager',
    instructorBio: 'Sarah is a home efficiency expert and educator who helps property owners cut down on emergency repair costs by teaching safety protocols and basic DIY mechanics.',
    instructorBioFr: 'Sarah est une experte en entretien qui aide les propriétaires à réduire leurs coûts de réparation en enseignant les protocoles de sécurité et la petite mécanique.',
    skillsGained: ['Leak Detection', 'Shut-Off Valve Operation', 'Safety Assessment', 'DIY vs Pro Criteria'],
    skillsGainedFr: ['Détection de Fuite', 'Fermeture de Vanne', 'Évaluation de la Sécurité', 'Critères Bricolage vs Pro'],
    importanceText: 'A slow leak under your sink can cost hundreds of thousands of XAF in wood rot and mold repairs if left ignored. Knowing how to trace the source of a leak immediately helps you contain the damage and make the right choice between a quick 5-minute fix or calling a professional.',
    importanceTextFr: 'Une fuite lente peut causer des dégâts majeurs. Savoir localiser l\'origine d\'une fuite vous aide à limiter les dommages et à choisir entre un serrage simple ou l\'appel d\'un plombier.',
    marketDemand: 'Homeowners need to know their limits. High-pressure lines, copper soldering, and main building valves are high-risk areas. This pathway teaches you how to handle low-pressure drain joints and when to rely on a certified plumber.',
    marketDemandFr: 'Cette simulation vous enseigne comment gérer les raccordements basse pression et quand faire appel à un plombier professionnel Fixam pour éviter les risques d\'inondation.',
    benefits: [
      'Protect your home and budget from unexpected water damage.',
      'Learn to communicate effectively with plumbers, ensuring you pay for exactly what you need.',
      'Gain a Certificate of Completion to verify your home maintenance skills.'
    ],
    benefitsFr: [
      'Protégez votre maison des dégâts des eaux coûteux.',
      'Apprenez à communiquer clairement avec les plombiers.',
      'Obtenez un certificat d\'apprentissage Fixam.'
    ],
    cvLinkedInGuide: 'This simulation certificate shows your proactive approach to property management, safety compliance, and basic facility maintenance—skills highly valued for administrative, landlord, and office management roles.',
    cvLinkedInGuideFr: 'Ce certificat démontre votre esprit d\'initiative en gestion de base des installations et en sécurité, utile pour les rôles administratifs ou de gestion.',
    briefVideoTitle: 'Under-Sink Leak Briefing - Sarah',
    briefVideoTitleFr: 'Briefing d\'évaluation de fuite - Sarah',
    briefVideoDuration: '2:40',
    briefText: 'Hello! I\'m Sarah, and I help homeowners manage basic troubleshooting. Finding a puddle under your kitchen sink can be stressful. In this simulation, you will learn how to dry the area, trace the source of the water, and determine if it is a simple loose connection or if you need to hire a certified plumber to avoid major property damage.',
    briefTextFr: 'Bonjour ! Je suis Sarah. Dans cette simulation, vous apprendrez à sécher la zone, localiser la fuite et déterminer s\'il s\'agit d\'un simple raccord à serrer ou s\'il faut appeler un professionnel.',
    taskInstructions: 'You open your kitchen cabinet and find a small puddle. Walk through the diagnostics steps below to identify the issue.',
    taskInstructionsFr: 'Vous ouvrez le placard de la cuisine et trouvez une flaque. Suivez les étapes de diagnostic ci-dessous pour identifier l\'origine.',
    dangerAlert: 'Safety Warning: If the leak is spraying high-pressure water, or if water is coming into contact with electrical outlets or garbage disposal wiring, DO NOT attempt a DIY repair. Immediately turn off the main valve and hire a certified plumber on Fixam!',
    dangerAlertFr: 'Consigne de sécurité : Si la fuite pulvérise de l\'eau sous pression ou touche des prises électriques, n\'essayez pas de réparer vous-même. Coupez la vanne générale et appelez un pro sur Fixam !',
    taskQuestions: [
      {
        question: 'You dry the pipes with a towel. You notice water slowly bead around the threaded slip-joint nut on the plastic P-trap pipe when water runs down the drain. What should you try first?',
        questionFr: 'Vous séchez les tuyaux et observez que de l\'eau perle au niveau de l\'écrou en plastique du siphon. Que faites-vous en premier ?',
        options: [
          'Wrap duct tape around the pipe',
          'Gently hand-tighten the slip-joint nut (or use slip-joint pliers slightly)',
          'Call an emergency plumber immediately to break the wall',
          'Pour chemical drain cleaner down the sink'
        ],
        optionsFr: [
          'Enrouler du ruban adhésif autour du tuyau',
          'Serrer doucement l\'écrou à la main ou légèrement avec une pince',
          'Appeler un plombier en urgence pour casser le mur',
          'Verser un déboucheur chimique agressif'
        ],
        correctIndex: 1,
        explanation: 'Drain slip-joints rely on rubber washers compressed by a nut. Hand-tightening a loose nut often cures slow drain leaks immediately without tools.',
        explanationFr: 'Les joints de siphon reposent sur des rondelles d\'étanchéité comprimées. Un simple serrage manuel de l\'écrou résout souvent les fuites de vidange.'
      },
      {
        question: 'If you notice water dripping directly from the metal pipe coming out of the wall *before* the shut-off valve, can you fix this yourself?',
        questionFr: 'Si l\'eau fuit du tuyau métallique sortant du mur *avant* la vanne d\'arrêt, pouvez-vous réparer cela vous-même ?',
        options: [
          'Yes, by wrapping it with tape or sealant',
          'No, this is a pressurized line before the isolation valve. Trying to unscrew this without main building shut-off will cause high-pressure flooding. Hire a professional.',
          'Yes, by turning the faucet handle tighter',
          'Yes, by replacing the sink basin'
        ],
        optionsFr: [
          'Oui, en enroulant du ruban d\'étanchéité',
          'Non, c\'est une ligne sous pression. Tenter de la démonter sans couper l\'alimentation principale provoquera une inondation. Faites appel à un pro.',
          'Oui, en serrant la poignée du robinet plus fort',
          'Oui, en remplaçant la cuve de l\'évier'
        ],
        correctIndex: 1,
        explanation: 'Leaks on pressurized supply lines before the shut-off valve require main system isolation and professional plumbing tools. Attempting this DIY poses high flood risks.',
        explanationFr: 'Les fuites sur les conduites sous pression avant la vanne d\'arrêt exigent des outils professionnels et la fermeture générale. Tenter cela soi-même présente des risques majeurs.'
      }
    ],
    modelVideoTitle: 'DIY Leak Assessment Walkthrough - Sarah',
    modelVideoTitleFr: 'Démonstration de diagnostic de fuite - Sarah',
    modelVideoDuration: '4:15',
    modelText: 'Great job! Identifying the P-trap joint as the culprit is a common homeowner win. In this walkthrough, I show you how to inspect plastic washers for cracks and how to tighten them without cracking the plastic threads. For any metal pipe leaks, we always highlight the importance of hiring a professional via Fixam to protect your home insurance and ensure safety.',
    modelTextFr: 'Beau travail ! Identifier le siphon comme origine est classique. Dans cette vidéo, je vous montre comment inspecter les rondelles et serrer sans forcer. Pour les conduites métalliques, faites appel à un pro sur Fixam.'
  }
];

export default function CareerPathways({ 
  onNavigate, 
  selectedPathway, 
  setSelectedPathway 
}: { 
  onNavigate: (page: any) => void; 
  selectedPathway: string;
  setSelectedPathway: (pathway: string) => void;
}) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Track enrollment state per course
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, boolean>>({});
  
  // Enrollment Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Simulation Workspace states
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(1);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Sync with Selected Pathway on load
  useEffect(() => {
    if (selectedPathway) {
      const course = MOCK_COURSES.find(c => c.id === selectedPathway);
      if (course) {
        setSelectedCourse(course);
        setCurrentStage(1);
        setVideoPlaying(false);
        setAnswers({});
        setQuizSubmitted(false);
        setQuizScore(null);
        setStudentName('');
      }
    }
  }, [selectedPathway]);

  // Fallback redirect to browse list if no pathway is active
  useEffect(() => {
    if (!selectedPathway && !selectedCourse) {
      onNavigate('career_pathways');
    }
  }, [selectedPathway, selectedCourse, onNavigate]);

  const startSimulation = (course: Course) => {
    setSelectedCourse(course);
    setSelectedPathway(course.id);
    setCurrentStage(1);
    setVideoPlaying(false);
    setAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setStudentName('');
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    if (!fullName.trim() || !email.trim()) return;

    setEnrolledCourses(prev => ({ ...prev, [selectedCourse.id]: true }));
    setStudentName(fullName);
    setCurrentStage(1); // Start simulation Stage 1
  };

  const exitSimulation = () => {
    setSelectedCourse(null);
    setSelectedPathway('');
    onNavigate('career_pathways');
  };

  const handleAnswerSelect = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const submitQuiz = () => {
    if (!selectedCourse) return;
    let correctCount = 0;
    selectedCourse.taskQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    setQuizSubmitted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const isEnrolled = selectedCourse ? !!enrolledCourses[selectedCourse.id] : false;

  const translateDuration = (durationStr: string) => {
    if (!isFr) return durationStr;
    return durationStr
      .replace('mins', 'min')
      .replace('min', 'min');
  };

  return (
    <>
      <div className="career-pathways-container">
        <div className="pathways-bg-gradient" />
        <div className="pathways-grid-overlay" />

        <div className="subdomain-brand-header">
          <div className="subdomain-brand">
            <span className="brand-dot"></span>
            <span>learn.usefixam.com</span>
          </div>
          <div className="subdomain-tagline">
            {isFr ? 'Portail des Certifications Fixam' : 'Fixam Professional Credentials Portal'}
          </div>
        </div>

        {!selectedCourse ? (
          <div className="pathways-explore-mode">
            <div className="pathways-header">
              <h1 className="pathways-title">
                {isFr ? 'Parcours Professionnels Fixam' : 'Fixam Career Pathways'}
              </h1>
              <p className="pathways-subtitle">
                {isFr 
                  ? 'Simulations de travail interactives pour acquérir des compétences réelles. Obtenez votre Certificat d\'Honneur Fixam et boostez la crédibilité de votre profil.' 
                  : 'Interactive, staged job simulations designed to build real-world skills. Earn your Fixam Certificate of Honor and boost your profile credibility.'}
              </p>
            </div>

            <div className="pathways-grid">
              {MOCK_COURSES.map(course => (
                <div key={course.id} className="pathway-card">
                  <div className="pathway-card-header">
                    <span className="difficulty-badge">
                      {isFr ? course.difficultyFr : course.difficulty}
                    </span>
                    <span className="duration-badge">⏱ {translateDuration(course.duration)}</span>
                  </div>
                  <h3 className="pathway-card-title">
                    {isFr ? course.titleFr : course.title}
                  </h3>
                  <p className="pathway-card-description">
                    {isFr ? course.descriptionFr : course.description}
                  </p>
                  
                  <div className="instructor-row">
                    <div className="instructor-avatar">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <div className="instructor-name">{course.instructor}</div>
                      <div className="instructor-role">
                        {isFr ? course.instructorRoleFr : course.instructorRole}
                      </div>
                    </div>
                  </div>

                  <div className="skills-gained-list">
                    {(isFr ? course.skillsGainedFr : course.skillsGained).map((skill, index) => (
                      <span key={index} className="skill-badge">{skill}</span>
                    ))}
                  </div>

                  <button 
                    className="start-simulation-btn"
                    onClick={() => startSimulation(course)}
                  >
                    {isFr ? 'Voir Détails & S\'inscrire →' : 'View Details & Enroll →'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pathway-simulation-workspace">
            <div className="workspace-header">
              <button className="workspace-exit-btn" onClick={exitSimulation}>
                {isFr ? '← Retour aux Parcours' : '← Back to Pathways'}
              </button>
              <h2 className="workspace-title">
                {isFr ? selectedCourse.titleFr : selectedCourse.title}
              </h2>
              <div className="workspace-meta">
                {isFr ? 'Formateur :' : 'Instructor:'} <strong>{selectedCourse.instructor}</strong>
              </div>
            </div>

            {!isEnrolled ? (
              <div className="pathway-details-landing">
                <div className="details-landing-grid">
                  
                  <div className="details-main-column">
                    <div className="landing-stats-row">
                      <div className="stat-card">
                        <span className="stat-icon">⏱</span>
                        <div className="stat-info">
                          <span className="stat-label">{isFr ? 'Durée' : 'Duration'}</span>
                          <span className="stat-val">{translateDuration(selectedCourse.duration)}</span>
                        </div>
                      </div>
                      <div className="stat-card">
                        <span className="stat-icon">📊</span>
                        <div className="stat-info">
                          <span className="stat-label">{isFr ? 'Niveau' : 'Level'}</span>
                          <span className="stat-val">{isFr ? selectedCourse.difficultyFr : selectedCourse.difficulty}</span>
                        </div>
                      </div>
                      <div className="stat-card">
                        <span className="stat-icon">🎖</span>
                        <div className="stat-info">
                          <span className="stat-label">{isFr ? 'Certificat' : 'Certificate'}</span>
                          <span className="stat-val">{isFr ? 'Approuvé Fixam' : 'Fixam Approved'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="landing-details-section">
                      <h3>{isFr ? 'Pourquoi cette compétence est importante' : 'Why This Skill Matters'}</h3>
                      <p className="landing-detail-p">
                        {isFr ? selectedCourse.importanceTextFr : selectedCourse.importanceText}
                      </p>
                    </div>

                    <div className="landing-details-section">
                      <h3>{isFr ? 'Ce que les clients attendent' : 'What Clients Expect'}</h3>
                      <p className="landing-detail-p">
                        {isFr ? selectedCourse.marketDemandFr : selectedCourse.marketDemand}
                      </p>
                    </div>

                    <div className="landing-details-section highlight-box-cv">
                      <h3>{isFr ? 'Intégration du Certificat sur CV & LinkedIn' : 'CV & LinkedIn Credentials Integration'}</h3>
                      <p className="landing-detail-p">
                        {isFr ? selectedCourse.cvLinkedInGuideFr : selectedCourse.cvLinkedInGuide}
                      </p>
                    </div>

                    <div className="landing-details-section">
                      <h3>{isFr ? 'Structure & Étapes du Programme' : 'Program Outline & Stages'}</h3>
                      <div className="program-outline-timeline">
                        <div className="outline-step">
                          <div className="step-bullet-num">1</div>
                          <div className="step-outline-text">
                            <strong>{isFr ? 'Briefing Vidéo' : 'Video Briefing'}</strong>: 
                            {isFr 
                              ? ' Recevez les consignes de travail visuelles directement de votre mentor.' 
                              : ' Receive visual job briefings directly from a seasoned mentor.'}
                          </div>
                        </div>
                        <div className="outline-step">
                          <div className="step-bullet-num">2</div>
                          <div className="step-outline-text">
                            <strong>{isFr ? 'Tâche Pratique' : 'Interactive Task'}</strong>: 
                            {isFr 
                              ? ' Plongez dans notre simulateur visuel pour diagnostiquer et résoudre la panne.' 
                              : ' Dive into a visual work simulator to diagnose and resolve issues.'}
                          </div>
                        </div>
                        <div className="outline-step">
                          <div className="step-bullet-num">3</div>
                          <div className="step-outline-text">
                            <strong>{isFr ? 'Démonstration' : 'Master Walkthrough'}</strong>: 
                            {isFr 
                              ? ' Regardez la vidéo du professionnel et comparez vos réponses.' 
                              : ' Watch a professional perform the same repair and compare.'}
                          </div>
                        </div>
                        <div className="outline-step">
                          <div className="step-bullet-num">4</div>
                          <div className="step-outline-text">
                            <strong>{isFr ? 'Réclamer le Certificat' : 'Claim Certificate'}</strong>: 
                            {isFr 
                              ? ' Obtenez votre certificat officiel et affichez-le sur votre profil Fixam.' 
                              : ' Earn your certificate and sync it directly to your Fixam Profile.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="details-sidebar-column">
                    <div className="instructor-bio-card">
                      <div className="instructor-bio-header">
                        <div className="instructor-avatar-large">
                          {selectedCourse.instructor.charAt(0)}
                        </div>
                        <div className="instructor-meta-data">
                          <h4>{selectedCourse.instructor}</h4>
                          <span>{isFr ? selectedCourse.instructorRoleFr : selectedCourse.instructorRole}</span>
                        </div>
                      </div>
                      <p className="instructor-bio-text">
                        {isFr ? selectedCourse.instructorBioFr : selectedCourse.instructorBio}
                      </p>
                    </div>

                    <div className="enrollment-gate-card">
                      <h3>{isFr ? 'S\'inscrire au Parcours (Gratuit)' : 'Enroll in Pathway (Free)'}</h3>
                      <p className="enroll-sub">
                        {isFr 
                          ? 'Saisissez vos coordonnées pour lancer la simulation.' 
                          : 'Complete your details to start the virtual simulation experience.'}
                      </p>
                      
                      <form onSubmit={handleEnroll} className="enrollment-form">
                        <div className="form-input-group">
                          <label>{isFr ? 'Nom Complet' : 'Full Name'}</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Nounga Joseph" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                        <div className="form-input-group">
                          <label>{isFr ? 'Adresse Email' : 'Email Address'}</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="name@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="form-input-group">
                          <label>{isFr ? 'Numéro de Téléphone' : 'Phone Number'}</label>
                          <input 
                            type="tel" 
                            placeholder="+237 ..." 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>

                        <button type="submit" className="enroll-submit-btn">
                          {isFr ? 'S\'inscrire & Commencer le Briefing →' : 'Enroll & Start Briefing →'}
                        </button>
                      </form>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="active-simulation-workspace-layout">
                <div className="stage-tracker">
                  {[
                    { num: 1, label: isFr ? 'Briefing' : 'Briefing' },
                    { num: 2, label: isFr ? 'Tâche Pratique' : 'Work Task' },
                    { num: 3, label: isFr ? 'Démonstration' : 'Model Answer' },
                    { num: 4, label: isFr ? 'Certificat' : 'Certificate' }
                  ].map(stage => (
                    <button 
                      key={stage.num}
                      className={`stage-step ${currentStage === stage.num ? 'active' : ''} ${currentStage > stage.num ? 'completed' : ''}`}
                      disabled={stage.num > currentStage && !quizSubmitted}
                      onClick={() => setCurrentStage(stage.num as any)}
                    >
                      <div className="stage-num-badge">
                        {currentStage > stage.num ? '✓' : stage.num}
                      </div>
                      <span className="stage-label-text">{stage.label}</span>
                    </button>
                  ))}
                </div>

                <div className="workspace-stage-content" style={{ marginTop: '2.5rem' }}>
                  {currentStage === 1 && (
                    <div className="workspace-briefing-view">
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h3>{isFr ? selectedCourse.briefVideoTitleFr : selectedCourse.briefVideoTitle}</h3>
                        <p style={{ color: '#64748B' }}>
                          {isFr 
                            ? 'Regardez le briefing vidéo ci-dessous de votre formateur pour comprendre votre mission.' 
                            : 'Watch the video briefing below to understand your task from your instructor.'}
                        </p>
                      </div>

                      <div className="video-player-container-mock" onClick={() => setVideoPlaying(!videoPlaying)}>
                        {videoPlaying ? (
                          <div className="mock-video-playing-state">
                            <span className="playing-dot"></span>
                            <span>{isFr ? 'Lecture en cours...' : 'Playing Briefing...'} ({selectedCourse.briefVideoDuration})</span>
                          </div>
                        ) : (
                          <div className="mock-video-paused-state">
                            <span className="play-icon-triangle">▶</span>
                            <span>{isFr ? 'Lecture de la Vidéo de Briefing' : 'Play Briefing Video'}</span>
                          </div>
                        )}
                      </div>

                      <div className="workspace-briefing-text-card">
                        <strong>{isFr ? 'Transcription du Briefing' : 'Briefing Transcript'}</strong>
                        <p>{isFr ? selectedCourse.briefTextFr : selectedCourse.briefText}</p>
                      </div>

                      <button 
                        className="workspace-proceed-btn"
                        onClick={() => setCurrentStage(2)}
                      >
                        {isFr ? 'Passer à la Tâche Pratique →' : 'Proceed to Work Task →'}
                      </button>
                    </div>
                  )}

                  {currentStage === 2 && (
                    <div className="workspace-task-view">
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h3>{isFr ? 'Tâche de Simulation Interactive' : 'Interactive Simulation Task'}</h3>
                        <p style={{ color: '#64748B' }}>
                          {isFr ? selectedCourse.taskInstructionsFr : selectedCourse.taskInstructions}
                        </p>
                      </div>

                      {selectedCourse.dangerAlert && (
                        <div className="danger-alert-box" style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#991B1B' }}>
                          <strong>⚠️ {isFr ? 'ATTENTION :' : 'WARNING:'}</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            {isFr ? selectedCourse.dangerAlertFr : selectedCourse.dangerAlert}
                          </p>
                        </div>
                      )}

                      <div className="quiz-questions-list">
                        {selectedCourse.taskQuestions.map((q, qIdx) => {
                          const hasAnswered = answers[qIdx] !== undefined;
                          return (
                            <div key={qIdx} className="quiz-question-card" style={{ background: '#ffffff', border: '1px solid rgba(148, 163, 184, 0.16)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                              <h4 style={{ margin: '0 0 1rem 0', color: '#0F172A', fontSize: '1.05rem' }}>
                                {qIdx + 1}. {isFr ? q.questionFr : q.question}
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {(isFr ? q.optionsFr : q.options).map((opt, oIdx) => {
                                  const isSelected = answers[qIdx] === oIdx;
                                  const isCorrect = q.correctIndex === oIdx;
                                  let optionStyle: React.CSSProperties = {
                                    padding: '0.8rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    background: '#F8FAFC',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.15s',
                                    fontWeight: 500,
                                    fontSize: '0.92rem'
                                  };

                                  if (isSelected) {
                                    optionStyle.borderColor = '#14B8A6';
                                    optionStyle.background = '#CCFBF1';
                                    optionStyle.color = '#0F766E';
                                  }

                                  if (quizSubmitted) {
                                    optionStyle.cursor = 'default';
                                    if (isCorrect) {
                                      optionStyle.borderColor = '#10B981';
                                      optionStyle.background = '#D1FAE5';
                                      optionStyle.color = '#065F46';
                                    } else if (isSelected) {
                                      optionStyle.borderColor = '#EF4444';
                                      optionStyle.background = '#FEE2E2';
                                      optionStyle.color = '#991B1B';
                                    }
                                  }

                                  return (
                                    <button 
                                      key={oIdx}
                                      type="button"
                                      disabled={quizSubmitted}
                                      style={optionStyle}
                                      onClick={() => handleAnswerSelect(qIdx, oIdx)}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {quizSubmitted && (
                                <div style={{ marginTop: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #14B8A6' }}>
                                  <strong>💡 {isFr ? 'Explication :' : 'Explanation:'}</strong>
                                  <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    {isFr ? q.explanationFr : q.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {!quizSubmitted ? (
                        <button 
                          className="workspace-proceed-btn"
                          disabled={Object.keys(answers).length < selectedCourse.taskQuestions.length}
                          onClick={submitQuiz}
                        >
                          {isFr ? 'Soumettre les Réponses' : 'Submit Answers'}
                        </button>
                      ) : (
                        <div style={{ background: '#F0FDFA', border: '1px solid #14B8A6', borderRadius: '12px', padding: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: 0, color: '#0F766E' }}>
                              {isFr ? 'Tâche Terminée' : 'Simulation Quiz Completed'}
                            </h4>
                            <span style={{ fontSize: '0.9rem', color: '#115E59', marginTop: '2px', display: 'block' }}>
                              {isFr ? 'Score :' : 'Score:'} <strong>{quizScore}/{selectedCourse.taskQuestions.length}</strong> {isFr ? 'bonnes réponses' : 'correct answers'}
                            </span>
                          </div>
                          <button 
                            className="workspace-proceed-btn"
                            style={{ margin: 0, minHeight: 'auto', padding: '10px 20px' }}
                            onClick={() => setCurrentStage(3)}
                          >
                            {isFr ? 'Voir la Démonstration Pro →' : 'Compare with Master Walkthrough →'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStage === 3 && (
                    <div className="workspace-briefing-view">
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h3>{isFr ? selectedCourse.modelVideoTitleFr : selectedCourse.modelVideoTitle}</h3>
                        <p style={{ color: '#64748B' }}>
                          {isFr 
                            ? 'Regardez comment le formateur effectue cette tâche étape par étape.' 
                            : 'Watch the model answer walkthrough to see how an experienced professional performs this repair.'}
                        </p>
                      </div>

                      <div className="video-player-container-mock" onClick={() => setVideoPlaying(!videoPlaying)}>
                        {videoPlaying ? (
                          <div className="mock-video-playing-state" style={{ background: '#0F172A' }}>
                            <span className="playing-dot"></span>
                            <span>{isFr ? 'Lecture de la démo...' : 'Playing Walkthrough...'} ({selectedCourse.modelVideoDuration})</span>
                          </div>
                        ) : (
                          <div className="mock-video-paused-state">
                            <span className="play-icon-triangle">▶</span>
                            <span>{isFr ? 'Lecture de la Démonstration' : 'Play Walkthrough Video'}</span>
                          </div>
                        )}
                      </div>

                      <div className="workspace-briefing-text-card">
                        <strong>{isFr ? 'Explication Finale du Mentor' : 'Mentor Closing Advice'}</strong>
                        <p>{isFr ? selectedCourse.modelTextFr : selectedCourse.modelText}</p>
                      </div>

                      <button 
                        className="workspace-proceed-btn"
                        onClick={() => setCurrentStage(4)}
                      >
                        {isFr ? 'Réclamer le Certificat d\'Honneur →' : 'Claim Certificate of Honor →'}
                      </button>
                    </div>
                  )}

                  {currentStage === 4 && (
                    <div className="workspace-claim-view" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                      <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
                      <h2 style={{ fontSize: '2rem', color: '#0F172A', fontWeight: 800 }}>
                        {isFr ? 'Félicitations, vous avez réussi !' : 'Congratulations! You Passed!'}
                      </h2>
                      <p style={{ color: '#64748B', maxWidth: '600px', margin: '0.8rem auto 2.5rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
                        {isFr 
                          ? `Bravo ${studentName || fullName}, vous avez terminé avec succès la simulation virtuelle et les examens pratiques de plomberie.`
                          : `Well done ${studentName || fullName}, you have successfully completed the virtual simulation and practical testing requirements.`}
                      </p>

                      <button 
                        className="workspace-proceed-btn"
                        style={{ display: 'inline-block', width: 'auto', padding: '16px 36px', fontSize: '1.05rem' }}
                        onClick={() => setShowCertificateModal(true)}
                      >
                        {isFr ? 'Afficher & Enregistrer le Certificat' : 'View & Save Certificate'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showCertificateModal && selectedCourse && (
        <div className="modal-backdrop-cert">
          <div className="certificate-modal-box">
            <button className="modal-close-btn-x" onClick={() => setShowCertificateModal(false)}>&times;</button>
            
            <div id="printable-certificate-area">
              <div className="certificate-border-outer">
                <div className="certificate-border-inner">
                  <div className="cert-header">
                    <span className="cert-academy-lbl">FIXAM SKILLS ACADEMY</span>
                    <h2 className="cert-main-title">
                      {isFr ? 'CERTIFICAT D\'HONNEUR' : 'CERTIFICATE OF HONOR'}
                    </h2>
                  </div>

                  <p className="cert-awarded-text">This is proudly presented to</p>
                  <h3 className="cert-student-name">{studentName || fullName || 'Nounga Joseph'}</h3>
                  
                  <p className="cert-description">
                    {isFr 
                      ? 'Pour avoir complété avec succès la simulation virtuelle et les examens pratiques pour le cours' 
                      : 'For successfully completing the virtual simulation and practical testing requirements for the course'}
                  </p>
                  
                  <h3 className="cert-course-title">
                    {isFr ? selectedCourse.titleFr : selectedCourse.title}
                  </h3>

                  <p className="cert-verification-text">
                    {isFr ? 'Atteste de la maîtrise des compétences :' : 'Verifying mastery of key field skills:'} <strong>{(isFr ? selectedCourse.skillsGainedFr : selectedCourse.skillsGained).join(', ')}</strong>.
                  </p>

                  <div className="certificate-footer">
                    <div className="signature-block">
                      <span className="signature-line">{isFr ? 'Équipe Fixam' : 'Fixam Pathways Team'}</span>
                      <span className="signature-title">{isFr ? 'Administrateur Officiel' : 'Official Administrator'}</span>
                    </div>

                    <div className="gold-seal-wrapper">
                      <div className="gold-seal">
                        <div className="seal-inner">
                          <span className="seal-text">FIXAM</span>
                          <span className="seal-star">★ {isFr ? 'APPROUVÉ' : 'APPROVED'} ★</span>
                        </div>
                      </div>
                    </div>

                    <div className="signature-block">
                      <span className="signature-line">{selectedCourse.instructor}</span>
                      <span className="signature-title">{isFr ? 'Formateur du Parcours' : 'Course Instructor'}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button className="print-action-btn" onClick={handlePrint}>
                🖨️ {isFr ? 'Imprimer / Enregistrer en PDF' : 'Print / Save as PDF'}
              </button>
            </div>

          </div>
        </div>
      )}
      <Footer onNavigate={onNavigate} />
    </>
  );
}
