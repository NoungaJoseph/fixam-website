import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../App';
import { useSEO } from '../hooks/useSEO';
import { articlesData, ArticleItem } from '../data/ArticlesData';
import './Home.css';

export default function Insights({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const marketMetrics = [
    {
      stat: '85%',
      labelEn: 'Informal trade workforce being transitioned into digitally verified micro-enterprises',
      labelFr: 'Main-d\'œuvre informelle intégrée dans des micro-entreprises vérifiées',
    },
    {
      stat: '3.2x',
      labelEn: 'Average earnings growth for certified artisans within 6 months of ID verification',
      labelFr: 'Multiplication des revenus des artisans certifiés sous 6 mois',
    },
    {
      stat: '99.4%',
      labelEn: 'Successful resolution rate for escrow-backed jobs and warranty inspections',
      labelFr: 'Taux de succès et de conformité des missions sous protection séquestre',
    },
    {
      stat: '0%',
      labelEn: 'Commission charged to clients—100% of payment goes directly to verified labor & parts',
      labelFr: 'Commission client : 100% des fonds vont directement à l\'artisan et aux pièces',
    }
  ];

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articlesData.filter((art) => {
      let matchesCategory = true;
      if (activeFilter === 'reports') matchesCategory = art.categoryEn === 'Industry Reports';
      if (activeFilter === 'guides') matchesCategory = art.categoryEn === 'Hiring Guides';
      if (activeFilter === 'stories') matchesCategory = art.categoryEn === 'Artisan Success';
      if (activeFilter === 'updates') matchesCategory = art.categoryEn === 'Platform Updates';

      if (!matchesCategory) return false;
      if (!q) return true;

      const title = (isFr ? art.titleFr : art.titleEn).toLowerCase();
      const desc = (isFr ? art.descFr : art.descEn).toLowerCase();
      const cat = (isFr ? art.categoryFr : art.categoryEn).toLowerCase();
      return title.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [activeFilter, searchQuery, isFr]);

  const handleReadArticle = (articleId: string) => {
    window.location.hash = `article-${articleId}`;
    onNavigate('blog');
  };

  const featuredArticle = articlesData[0];

  return (
    <div className="landing-page tsi-styled-page" style={{ backgroundColor: '#F8FAFC' }}>
      {/* 1. Hero Section */}
      <section className="tsi-hero-section" style={{ padding: '4.5rem 0 3rem' }}>
        <div className="tsi-hero-container" style={{ gridTemplateColumns: '1fr', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          <div className="tsi-hero-left" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              {isFr ? 'RECHERCHE & PERSPECTIVES DU MARCHÉ' : 'MARKET INTELLIGENCE & RESEARCH'}
            </span>
            <h1 className="tsi-hero-headline" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.65rem)' }}>
              {isFr ? 'Données, Analyses & Guides du' : 'Market Intelligence & Practical'}{' '}
              <span className="tsi-hero-highlight">{isFr ? 'Marché des Services' : 'Service Insights.'}</span>
            </h1>
            <p className="tsi-hero-subtitle" style={{ maxWidth: '680px', margin: '0 auto 2rem' }}>
              {isFr
                ? 'Rapports économiques sur les métiers du BTP, guides de sécurité technique, barèmes de prix à Douala et Yaoundé et retours d\'expérience du terrain.'
                : 'Economic studies on Central African skilled labor, technical safety checkpoints, transparent pricing benchmarks, and verified field experiences.'}
            </p>

            {/* Live Article Search Bar */}
            <div style={{ width: '100%', maxWidth: '580px', margin: '0 auto', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #CBD5E1', padding: '0.5rem 1rem', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder={isFr ? "Rechercher par mot-clé (ex: solaire, plomberie, prix, sécurité)..." : "Search insights (e.g., solar, electrical, pricing, escrow)..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#0F172A', background: 'transparent' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: '#E2E8F0', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569', fontSize: '0.75rem' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Market Metrics Banner */}
      <section style={{ width: 'min(1320px, calc(100% - 4rem))', margin: '0 auto 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          {marketMetrics.map((m, idx) => (
            <div key={idx} style={{ padding: '0.5rem 1rem', borderLeft: idx !== 0 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0D9488', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                {m.stat}
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, fontWeight: 500 }}>
                {isFr ? m.labelFr : m.labelEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Highlight Article (When no search active) */}
      {!searchQuery && activeFilter === 'all' && featuredArticle && (
        <section style={{ width: 'min(1320px, calc(100% - 4rem))', margin: '0 auto 3.5rem' }}>
          <div
            onClick={() => handleReadArticle(featuredArticle.id)}
            style={{
              background: 'linear-gradient(135deg, #042F2E 0%, #115E59 100%)',
              color: '#FFFFFF',
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              cursor: 'pointer',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ background: 'rgba(20, 184, 166, 0.25)', border: '1px solid #14B8A6', color: '#99F6E4', fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.8rem', borderRadius: '999px', textTransform: 'uppercase' }}>
                  {isFr ? 'Rapport Vedette' : 'Featured Report'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#99F6E4', fontWeight: 600 }}>{featuredArticle.readTime}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.25rem)', fontWeight: 900, lineHeight: 1.25, marginBottom: '1rem', color: '#FFFFFF' }}>
                {isFr ? featuredArticle.titleFr : featuredArticle.titleEn}
              </h2>
              <p style={{ color: '#CCFBF1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '520px' }}>
                {isFr ? featuredArticle.descFr : featuredArticle.descEn}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ background: '#FFFFFF', color: '#042F2E', fontWeight: 800, padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.9rem' }}>
                  {isFr ? 'Consulter le Rapport Complet →' : 'Read Full Research Report →'}
                </span>
              </div>
            </div>
            <div style={{ minHeight: '280px', position: 'relative' }}>
              <img
                src={featuredArticle.heroImage}
                alt={featuredArticle.titleEn}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 4. Category Filter Pills */}
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

        {searchQuery && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#0D9488', fontWeight: 700, fontSize: '0.95rem' }}>
            {isFr
              ? `${filteredArticles.length} article(s) trouvé(s) pour "${searchQuery}"`
              : `Found ${filteredArticles.length} insight(s) matching "${searchQuery}"`}
          </div>
        )}

        {/* 5. Articles Grid */}
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

      {/* 6. CTA Banner */}
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
