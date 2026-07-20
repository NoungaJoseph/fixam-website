import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CareerPathwaySkill } from '../../data/careerPathways';

export default function CareerPathwayTasks({ skill }: { skill: CareerPathwaySkill }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const [activeTask, setActiveTask] = useState(skill.tasks[0]?.id ?? 1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 920);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 920);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentTask = useMemo(() => skill.tasks.find((item) => item.id === activeTask) ?? skill.tasks[0], [activeTask, skill.tasks]);

  if (isMobile) {
    return (
      <section className="career-tasks-section">
        <h2>{isFr ? 'Tâches de ce Programme' : 'Tasks in This Program'}</h2>
        <div className="career-tasks-mobile-accordion">
          {skill.tasks.map((task) => {
            const isExpanded = activeTask === task.id;
            return (
              <div key={task.id} className={`career-mobile-task-card ${isExpanded ? 'open' : ''}`} style={{ marginBottom: '0.8rem' }}>
                <button
                  className={`career-task-item ${isExpanded ? 'active' : ''}`}
                  onClick={() => setActiveTask(isExpanded ? 0 : task.id)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span className="career-task-number">{task.id}</span>
                    <span className="career-task-title">{isFr ? task.titleFr : task.title}</span>
                  </div>
                  <span className="accordion-chevron" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{isExpanded ? '▲' : '▼'}</span>
                </button>
                {isExpanded && (
                  <div className="career-task-mobile-detail" style={{ padding: '1rem', border: '1px solid var(--line)', borderTop: 'none', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', backgroundColor: 'var(--soft)' }}>
                    <div className="career-task-meta" style={{ fontSize: '0.88rem', color: '#14b8a6', fontWeight: 700, marginBottom: '0.6rem' }}>{isFr ? task.duration.replace(/hours?/g, 'heures').replace(/mins?/g, 'min') : task.duration} • {isFr ? skill.levelFr : skill.level}</div>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 1rem 0', fontSize: '0.95rem' }}>{isFr ? task.descriptionFr : task.description}</p>
                    <div className="career-task-block" style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '0.4rem' }}>🎓 {isFr ? 'Ce que vous apprendrez' : "What you'll learn"}</strong>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--muted)' }}>
                        {(isFr ? task.learningPointsFr : task.learningPoints).map((point) => (
                          <li key={point} style={{ marginBottom: '0.3rem' }}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="career-task-block">
                      <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '0.4rem' }}>🛠️ {isFr ? 'Ce que vous ferez' : "What you'll do"}</strong>
                      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>{isFr ? task.whatYouDoFr : task.whatYouDo}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="career-tasks-section">
      <h2>{isFr ? 'Tâches de ce Programme' : 'Tasks in This Program'}</h2>

      <div className="career-tasks-layout">
        <div className="career-task-list">
          {skill.tasks.map((task) => (
            <button
              key={task.id}
              className={`career-task-item ${activeTask === task.id ? 'active' : ''}`}
              onClick={() => setActiveTask(task.id)}
            >
              <span className="career-task-number">{task.id}</span>
              <span className="career-task-title">{isFr ? task.titleFr : task.title}</span>
            </button>
          ))}
        </div>

        <div className="career-task-detail">
          <h3>{isFr ? currentTask.titleFr : currentTask.title}</h3>
          <div className="career-task-meta">{isFr ? currentTask.duration.replace(/hours?/g, 'heures').replace(/mins?/g, 'min') : currentTask.duration} • {isFr ? skill.levelFr : skill.level}</div>
          <p>{isFr ? currentTask.descriptionFr : currentTask.description}</p>
          <div className="career-task-block">
            <strong>🎓 {isFr ? 'Ce que vous apprendrez' : "What you'll learn"}</strong>
            <ul>
              {(isFr ? currentTask.learningPointsFr : currentTask.learningPoints).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="career-task-block">
            <strong>🛠️ {isFr ? 'Ce que vous ferez' : "What you'll do"}</strong>
            <p>{isFr ? currentTask.whatYouDoFr : currentTask.whatYouDo}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
