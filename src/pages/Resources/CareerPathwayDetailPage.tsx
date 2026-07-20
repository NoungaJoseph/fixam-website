import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { careerPathwaySkills } from '../../data/careerPathways';
import './CareerPathways.css';
import CareerPathwayHero from './CareerPathwayHero';
import CareerPathwayOverview from './CareerPathwayOverview';
import CareerPathwayHowItWorks from './CareerPathwayHowItWorks';
import CareerPathwayTasks from './CareerPathwayTasks';
import CareerPathwayReviews from './CareerPathwayReviews';
import { Footer } from '../../App';

const tabs = [
  { key: 'overview', labelEn: 'Overview', labelFr: 'Aperçu' },
  { key: 'how', labelEn: 'How It Works', labelFr: 'Comment ça Marche' },
  { key: 'tasks', labelEn: 'Tasks', labelFr: 'Tâches' },
  { key: 'reviews', labelEn: 'Reviews', labelFr: 'Avis' },
];

export default function CareerPathwayDetailPage({ 
  skillId, 
  onNavigate, 
  setSelectedPathway 
}: { 
  skillId: string; 
  onNavigate: (page: any) => void; 
  setSelectedPathway: (id: string) => void;
}) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const skill = useMemo(() => careerPathwaySkills.find((item) => item.id === skillId) ?? careerPathwaySkills[0], [skillId]);
  const [activeTab, setActiveTab] = useState('overview');

  const overviewRef = useRef<HTMLDivElement | null>(null);
  const howRef = useRef<HTMLDivElement | null>(null);
  const tasksRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);

  // Scroll to top and reset tab when skill changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab('overview');
  }, [skillId]);

  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY + 160; // offset for sticky nav bar + header
      
      const sections = [
        { key: 'overview', ref: overviewRef.current },
        { key: 'how', ref: howRef.current },
        { key: 'tasks', ref: tasksRef.current },
        { key: 'reviews', ref: reviewsRef.current },
      ];

      let current = 'overview';
      sections.forEach((sec) => {
        if (sec.ref) {
          const top = sec.ref.offsetTop;
          if (scrollPos >= top) {
            current = sec.key;
          }
        }
      });
      setActiveTab(current);
    };

    window.addEventListener('scroll', onScroll);
    onScroll(); // initial call
    return () => window.removeEventListener('scroll', onScroll);
  }, [skillId]); // re-bind if skill changes to calculate correct offsets

  const scrollToSection = (key: string) => {
    const refs = {
      overview: overviewRef.current,
      how: howRef.current,
      tasks: tasksRef.current,
      reviews: reviewsRef.current,
    };
    const target = refs[key as keyof typeof refs];
    if (target) {
      const headerOffset = 140; // size of sticky nav bar and website header
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveTab(key);
    }
  };

  return (
    <>
      <div className="career-pathway-detail-page">
        <CareerPathwayHero 
          skillId={skill.id} 
          onBack={() => onNavigate('career_pathways')} 
          onStart={() => {
            const isClient = ['tutoring'].includes(skill.id);
            const targetCourseId = skill.id === 'plumbing' ? 'plumbing-pro' : (isClient ? 'plumbing-diy' : 'plumbing-pro');
            setSelectedPathway(targetCourseId);
            onNavigate('career_simulation');
          }}
        />

        <div className="career-tab-bar" style={{ position: 'sticky', top: '70px', zIndex: 10, backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`career-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => scrollToSection(tab.key)}
            >
              {isFr ? tab.labelFr : tab.labelEn}
            </button>
          ))}
        </div>

        <div className="career-detail-content" style={{ padding: '2rem 1rem' }}>
          <div ref={overviewRef} className="career-detail-section" style={{ paddingBottom: '3rem' }}>
            <CareerPathwayOverview skill={skill} onNavigate={onNavigate} />
          </div>
          <div ref={howRef} className="career-detail-section" style={{ paddingBottom: '3rem', borderTop: '1px solid #F1F5F9', paddingTop: '3rem' }}>
            <CareerPathwayHowItWorks skill={skill} />
          </div>
          <div ref={tasksRef} className="career-detail-section" style={{ paddingBottom: '3rem', borderTop: '1px solid #F1F5F9', paddingTop: '3rem' }}>
            <CareerPathwayTasks skill={skill} />
          </div>
          <div ref={reviewsRef} className="career-detail-section" style={{ paddingBottom: '3rem', borderTop: '1px solid #F1F5F9', paddingTop: '3rem' }}>
            <CareerPathwayReviews skill={skill} />
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </>
  );
}
