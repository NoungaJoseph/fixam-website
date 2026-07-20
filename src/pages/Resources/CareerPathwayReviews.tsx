import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CareerPathwaySkill } from '../../data/careerPathways';

export default function CareerPathwayReviews({ skill }: { skill: CareerPathwaySkill }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const [filter, setFilter] = useState<'all' | '5' | '4' | 'providers' | 'clients'>('all');
  const [showAll, setShowAll] = useState(false);

  // Reset showAll when filter or skill changes
  useEffect(() => {
    setShowAll(false);
  }, [filter, skill.id]);

  const filteredReviews = skill.reviews.filter((review) => {
    if (filter === 'all') return true;
    if (filter === '5') return review.stars === 5;
    if (filter === '4') return review.stars === 4;

    const isClient = review.role.toLowerCase().includes('client') || 
                     review.role.toLowerCase().includes('customer') || 
                     review.role.toLowerCase().includes('homeowner') || 
                     review.role.toLowerCase().includes('parent') ||
                     review.roleFr.toLowerCase().includes('client') ||
                     review.roleFr.toLowerCase().includes('propriétaire');

    if (filter === 'clients') return isClient;
    if (filter === 'providers') return !isClient;
    return true;
  });

  const visibleReviews = showAll ? filteredReviews : filteredReviews.slice(0, 2);

  return (
    <section className="career-reviews-section" style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1.5rem' }}>
        {isFr ? 'Avis de la Communauté' : 'Community Reviews'}
      </h2>
      <div className="career-reviews-layout">
        <div className="career-reviews-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>{isFr ? 'Tous les avis' : 'All Reviews'}</button>
          <button className={filter === '5' ? 'active' : ''} onClick={() => setFilter('5')}>5 ★</button>
          <button className={filter === '4' ? 'active' : ''} onClick={() => setFilter('4')}>4 ★</button>
          <button className={filter === 'providers' ? 'active' : ''} onClick={() => setFilter('providers')}>{isFr ? 'Prestataires' : 'Providers'}</button>
          <button className={filter === 'clients' ? 'active' : ''} onClick={() => setFilter('clients')}>{isFr ? 'Clients' : 'Clients'}</button>
        </div>

        <div className="career-reviews-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
          {visibleReviews.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontStyle: 'italic', padding: '20px 0' }}>{isFr ? 'Aucun avis ne correspond à ce filtre.' : 'No reviews match this filter.'}</p>
          ) : (
            visibleReviews.map((review, index) => (
              <div 
                className="career-review-card" 
                key={`${review.name}-${index}`} 
                style={{ 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--line)', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <p className="career-review-quote" style={{ margin: 0, fontSize: '1.05rem', color: 'var(--ink)', fontStyle: 'italic', lineHeight: '1.75' }}>
                  “{isFr ? review.quoteFr : review.quote}”
                </p>
                <div 
                  className="career-review-meta" 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid var(--line)', 
                    paddingTop: '16px', 
                    marginTop: '4px' 
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <strong style={{ fontSize: '0.98rem', color: 'var(--ink)' }}>{review.name}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>{isFr ? review.roleFr : review.role}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ fontSize: '1.1rem' }}>{i < review.stars ? '★' : '☆'}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}

          {!showAll && filteredReviews.length > 2 && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => setShowAll(true)}
                style={{
                  background: 'transparent',
                  border: '2px solid #14B8A6',
                  color: '#14B8A6',
                  borderRadius: '12px',
                  padding: '12px 28px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#14B8A6';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#14B8A6';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isFr ? `Voir les ${filteredReviews.length} avis` : `View All ${filteredReviews.length} Reviews`}
              </button>
            </div>
          )}

          {showAll && filteredReviews.length > 2 && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => setShowAll(false)}
                style={{
                  background: 'transparent',
                  border: '2px solid var(--muted)',
                  color: 'var(--muted)',
                  borderRadius: '12px',
                  padding: '12px 28px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                  e.currentTarget.style.color = 'var(--surface)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--muted)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isFr ? 'Afficher moins' : 'Show Less'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
