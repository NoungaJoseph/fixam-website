import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../App';
import { useSEO } from '../hooks/useSEO';
import './Home.css';

interface ArticleItem {
  id: string;
  categoryEn: string;
  categoryFr: string;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
  readTime: string;
  date: string;
  tag: string;
}

const articlesData: ArticleItem[] = [
  {
    id: '1',
    categoryEn: 'Industry Reports',
    categoryFr: 'Rapports Sectoriels',
    titleEn: '2026 State of Trade Services and Informal Economy in Cameroon',
    titleFr: 'État des Lieux des Métiers de l\'Artisanat et du BTP au Cameroun en 2026',
    descEn: 'A deep analysis into urbanization trends, pricing indexes in Douala and Yaoundé, and how digital platforms are formalizing skilled trades.',
    descFr: 'Une analyse approfondie de l\'urbanisation, des indices de prix à Douala et Yaoundé, et de la formalisation des artisans grâce au digital.',
    readTime: '6 min read',
    date: 'August 2026',
    tag: 'Report'
  },
  {
    id: '2',
    categoryEn: 'Hiring Guides',
    categoryFr: 'Guides Pratiques',
    titleEn: 'How to Prevent Electrical Hazards and Choose the Right Electrician',
    titleFr: 'Comment Prévenir les Risques Électriques et Choisir le Bon Électricien',
    descEn: 'Key safety checkpoints, wire gauge standards, and questions to ask before hiring a technician for home installations.',
    descFr: 'Points de contrôle de sécurité indispensables, normes de câblage et questions à poser avant d\'engager un technicien chez soi.',
    readTime: '4 min read',
    date: 'August 2026',
    tag: 'Safety'
  },
  {
    id: '3',
    categoryEn: 'Artisan Success',
    categoryFr: 'Histoires d\'Artisans',
    titleEn: 'From Daily Street Hustle to 20 Regular Monthly Contracts: Eric\'s Story',
    titleFr: 'De l\'Artisanat Informel à 20 Contrats Mensuels Réguliers : L\'Histoire d\'Éric',
    descEn: 'How a certified plumber in Douala leveraged Fixam verification to build trust with corporate property owners and earn 3x more.',
    descFr: 'Comment un plombier certifié à Douala a utilisé la vérification Fixam pour bâtir la confiance avec des entreprises et tripler ses revenus.',
    readTime: '5 min read',
    date: 'July 2026',
    tag: 'Case Study'
  },
  {
    id: '4',
    categoryEn: 'Platform Updates',
    categoryFr: 'Mises à Jour',
    titleEn: 'Zero Commission Policy: Why We Made All Client Bookings 100% Free',
    titleFr: 'Politique Zéro Commission : Pourquoi les Réservations sont Désormais 100% Gratuites',
    descEn: 'Our strategic shift to empower local trade professionals, eliminate friction for households, and drive transparent peer-to-peer payments.',
    descFr: 'Notre virage stratégique pour soutenir les artisans locaux, éliminer toute barrière pour les ménages et encourager les paiements directs.',
    readTime: '3 min read',
    date: 'July 2026',
    tag: 'News'
  }
];

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

  return (
    <div className="landing-page tsi-styled-page">
      {/* 1. Hero Section */}
      <section className="tsi-hero-section" style={{ padding: '4rem 0 3rem' }}>
        <div className="tsi-hero-container" style={{ gridTemplateColumns: '1fr', textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
          <div className="tsi-hero-left" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
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
                background: activeFilter === cat.key ? '#071936' : '#F1F5F9',
                color: activeFilter === cat.key ? '#FFFFFF' : '#334155',
                padding: '0.55rem 1.25rem',
                borderRadius: '999px',
                border: 'none',
                fontWeight: 600,
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '10px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                    {isFr ? art.categoryFr : art.categoryEn}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{art.readTime}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#071936', lineHeight: 1.35, marginBottom: '0.75rem' }}>
                  {isFr ? art.titleFr : art.titleEn}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {isFr ? art.descFr : art.descEn}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{art.date}</span>
                <button
                  onClick={() => onNavigate('blog')}
                  style={{ background: 'transparent', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  {isFr ? 'Lire l\'article →' : 'Read Full Article →'}
                </button>
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
