import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../App';
import { useSEO } from '../hooks/useSEO';
import { articlesData } from '../data/ArticlesData';
import './Home.css';

export default function Insights({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const [activeFilter, setActiveFilter] = useState('all');

  useSEO({
    title: isFr ? 'Analyses, Rapports & Perspectives du Marché - Fixam Insights' : 'Market Intelligence & Practical Service Guides - Fixam Insights',
    description: isFr
      ? 'Rapports économiques, conseils de maintenance domestique et retours d\'expérience sur les métiers qualifiés au Cameroun.'
      : 'Explore research reports, home maintenance best practices, and expert trade insights curated by the Fixam team in Cameroon.',
    canonical: 'https://usefixam.com/insights',
    isFr
  });

  const categories = [
    { key: 'all', labelEn: 'All Insights', labelFr: 'Tous les Articles' },
    { key: 'reports', labelEn: 'Industry Reports', labelFr: 'Rapports Sectoriels' },
    { key: 'guides', labelEn: 'Hiring Guides', labelFr: 'Guides Pratiques' },
    { key: 'stories', labelEn: 'Success Stories', labelFr: 'Témoignages' },
    { key: 'updates', labelEn: 'Platform Updates', labelFr: 'Actualités Fixam' }
  ];

  const filteredArticles = articlesData.filter((art) => {
    if (activeFilter === 'reports') return art.categoryEn === 'Industry Reports';
    if (activeFilter === 'guides') return art.categoryEn === 'Hiring Guides';
    if (activeFilter === 'stories') return art.categoryEn === 'Artisan Success';
    if (activeFilter === 'updates') return art.categoryEn === 'Platform Updates';
    return true;
  });

  const handleReadArticle = (articleId: string) => {
    window.location.hash = `article-${articleId}`;
    onNavigate('blog');
  };

  return (
    <div className="landing-page tsi-styled-page" style={{ backgroundColor: '#F8FAFC' }}>
      {/* 1. Hero Section */}
      <section className="tsi-hero-section" style={{ padding: '4rem 0 3rem' }}>
        <div className="tsi-hero-container" style={{ gridTemplateColumns: '1fr', textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
          <div className="tsi-hero-left" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              {isFr ? 'RECHERCHE & PERSPECTIVES' : 'INSIGHTS & RESEARCH'}
            </span>
            <h1 className="tsi-hero-headline" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.65rem)' }}>
              {isFr ? 'Données, Analyses & Guides du' : 'Market Intelligence & Practical'}{' '}
              <span className="tsi-hero-highlight">{isFr ? 'Marché des Services' : 'Service Insights.'}</span>
            </h1>
            <p className="tsi-hero-subtitle" style={{ maxWidth: '640px', margin: '0 auto 2rem' }}>
              {isFr
                ? 'Découvrez nos rapports économiques, conseils de maintenance domestique et retours d\'expérience sur les métiers qualifiés au Cameroun.'
                : 'Explore research reports, home maintenance best practices, and expert trade insights curated by the Fixam team.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pills */}
      <section style={{ width: 'min(1320px, calc(100% - 4rem))', margin: '1rem auto 3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              style={{
                background: activeFilter === cat.key ? '#071936' : '#FFFFFF',
                color: activeFilter === cat.key ? '#FFFFFF' : '#334155',
                border: '1.5px solid ' + (activeFilter === cat.key ? '#071936' : '#E2E8F0'),
                padding: '0.55rem 1.25rem',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {isFr ? cat.labelFr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* 3. Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => handleReadArticle(art.id)}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.07)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ width: '100%', height: '200px', overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
                <img 
                  src={art.heroImage} 
                  alt={isFr ? art.titleFr : art.titleEn} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ background: '#F0FDFA', color: '#0D9488', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                      {isFr ? art.categoryFr : art.categoryEn}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>{art.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#071936', lineHeight: 1.35, marginBottom: '0.75rem' }}>
                    {isFr ? art.titleFr : art.titleEn}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {isFr ? art.descFr : art.descEn}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>{art.date}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadArticle(art.id);
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#0D9488', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    {isFr ? 'Lire l\'article →' : 'Read Full Article →'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CTA Banner */}
      <section className="cta-banner-teal" style={{ marginTop: '5rem' }}>
        <div className="cta-banner-content">
          <h2>{isFr ? 'Besoin d\'un Artisan Fiable dès Aujourd\'hui ?' : 'Need a Trusted Trade Professional Today?'}</h2>
          <p>{isFr ? 'Trouvez un professionnel vérifié près de chez vous sans aucun frais de réservation.' : 'Connect with certified plumbers, electricians, and technicians across Cameroon for 100% free.'}</p>
          <div className="cta-banner-actions">
            <button className="cta-pill-btn client" onClick={() => onNavigate('services')}>
              {isFr ? 'Explorer les Services' : 'Explore All Services'}
            </button>
            <button className="cta-pill-btn pro" onClick={() => onNavigate('guide')}>
              {isFr ? 'Comment ça Marche' : 'How It Works'}
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
