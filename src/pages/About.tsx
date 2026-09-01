import React from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../App';
import { HeroTechIllustration, WhatWeDoEmblem } from '../components/TechIllustrations';
import './Home.css';

const aboutContent = {
  en: {
    hero: {
      title1: 'About',
      highlight: 'Fixam',
      subtitle: 'We are on a mission to transform everyday service delivery across Cameroon by bridging the gap between individuals, businesses, and verified trade professionals.',
    },
    stats: {
      heading: 'Our Scale & Impact',
      sub: 'Building Africa\'s most reliable on-demand trade network',
      val1: '10,000+',
      label1: 'Completed Tasks',
      val2: '500+',
      label2: 'Verified Pros',
      val3: '100% Free',
      label3: 'Zero Booking Fees'
    },
    mission: {
      title: 'Our Mission & Vision',
      desc: 'Fixam is a premier digital marketplace dedicated to formalizing and modernizing local trades in Cameroon. We empower skilled professionals with the tools, visibility, and credibility to build sustainable businesses, while providing households and enterprises with safe, verified, and transparent service delivery.',
    },
    values: {
      title: 'Our Core Values',
      items: [
        {
          num: '01',
          title: 'Trust & Safety First',
          desc: 'Every provider undergoes identity checks, credential assessments, and background screening. We never compromise on user safety.'
        },
        {
          num: '02',
          title: 'Direct Economic Empowerment',
          desc: 'We eliminated platform booking fees and commissions so artisans take home 100% of their earnings and clients pay fair, direct rates.'
        },
        {
          num: '03',
          title: 'Quality & Reliability',
          desc: 'We maintain unmatched service excellence through verified customer ratings, real-time dispatch, and proactive human dispute resolution.'
        }
      ]
    },
    cta: {
      title: 'Join the Fixam Ecosystem',
      desc: 'Whether you need a trusted professional or want to grow your trade business, Fixam is designed for you.',
      btnClient: 'Explore Services',
      btnProvider: 'Join as a Provider'
    }
  },
  fr: {
    hero: {
      title1: 'À Propos de',
      highlight: 'Fixam',
      subtitle: 'Notre mission est de transformer la prestation de services au Cameroun en connectant particuliers, entreprises et professionnels qualifiés et vérifiés.',
    },
    stats: {
      heading: 'Notre Impact',
      sub: 'Bâtir le réseau de services à la demande le plus fiable d\'Afrique',
      val1: '10,000+',
      label1: 'Missions Réalisées',
      val2: '500+',
      label2: 'Artisans Vérifiés',
      val3: '100% Free',
      label3: 'Zéro Frais de Réservation'
    },
    mission: {
      title: 'Notre Mission & Vision',
      desc: 'Fixam est une plateforme technologique dédiée à la formalisation et à la modernisation des métiers de l\'artisanat au Cameroun. Nous offrons aux professionnels les outils, la visibilité et la crédibilité nécessaires pour développer leur activité, tout en garantissant aux ménages et entreprises un service rapide, sûr et sans intermédiaires coûteux.',
    },
    values: {
      title: 'Nos Valeurs Fondamentales',
      items: [
        {
          num: '01',
          title: 'Confiance & Sécurité Avant Tout',
          desc: 'Chaque artisan passe par une vérification d\'identité rigoureuse (CNI) et un contrôle de compétences pour garantir votre sérénité.'
        },
        {
          num: '02',
          title: 'Autonomisation Économique Directe',
          desc: 'Nous avons supprimé les commissions de réservation : les artisans conservent 100% de leurs revenus et les clients paient le juste prix.'
        },
        {
          num: '03',
          title: 'Qualité & Fiabilité Constantes',
          desc: 'Un niveau d\'exigence élevé maintenu grâce aux avis certifiés, au matching rapide et à une équipe de support dédiée.'
        }
      ]
    },
    cta: {
      title: 'Rejoignez la Communauté Fixam',
      desc: 'Que vous cherchiez un artisan qualifié ou souhaitiez développer votre clientèle, Fixam est fait pour vous.',
      btnClient: 'Explorer les Services',
      btnProvider: 'Devenir Prestataire'
    }
  }
};

export default function About({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'fr' ? 'fr' : 'en';
  const c = aboutContent[lang];

  return (
    <div className="landing-page tsi-styled-page">
      {/* 1. Hero Section */}
      <section className="tsi-hero-section" style={{ padding: '4rem 0 3rem' }}>
        <div className="tsi-hero-container">
          <div className="tsi-hero-left">
            <h1 className="tsi-hero-headline">
              {c.hero.title1}{' '}
              <span className="tsi-hero-highlight">{c.hero.highlight}</span>
            </h1>
            <p className="tsi-hero-subtitle">
              {c.hero.subtitle}
            </p>
            <div className="tsi-hero-cta-group">
              <button className="tsi-btn-primary" onClick={() => onNavigate('services')}>
                {c.cta.btnClient}
              </button>
              <button className="tsi-btn-secondary" onClick={() => onNavigate('register')}>
                {c.cta.btnProvider}
              </button>
            </div>
          </div>
          <div className="tsi-hero-right">
            <div className="tsi-hero-illustration-wrapper">
              <HeroTechIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Stats Ribbon */}
      <section style={{ margin: '1rem 0 4rem' }}>
        <div className="tsi-floating-stats-bar" style={{ margin: '0 auto', position: 'static' }}>
          <div className="tsi-stat-col tsi-stat-col-first">
            <h3 className="tsi-stat-brand-heading">{c.stats.heading}</h3>
            <p className="tsi-stat-brand-sub">{c.stats.sub}</p>
          </div>
          <div className="tsi-stat-col">
            <span className="tsi-stat-large-val">{c.stats.val1}</span>
            <span className="tsi-stat-sub-label">{c.stats.label1}</span>
          </div>
          <div className="tsi-stat-col">
            <span className="tsi-stat-large-val">{c.stats.val2}</span>
            <span className="tsi-stat-sub-label">{c.stats.label2}</span>
          </div>
          <div className="tsi-stat-col">
            <span className="tsi-stat-large-val">{c.stats.val3}</span>
            <span className="tsi-stat-sub-label">{c.stats.label3}</span>
          </div>
        </div>
      </section>

      {/* 3. Mission Section (Navy Banner) */}
      <section className="tsi-what-we-do-banner" style={{ padding: '5rem 0' }}>
        <div className="tsi-what-we-do-content">
          <div className="tsi-what-we-do-text">
            <h2 className="tsi-what-we-do-heading">{c.mission.title}</h2>
            <p className="tsi-what-we-do-paragraph">{c.mission.desc}</p>
          </div>
          <div className="tsi-what-we-do-emblem">
            <div className="what-we-do-emblem-box">
              <WhatWeDoEmblem />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values Grid */}
      <section className="section" style={{ width: 'min(1320px, calc(100% - 4rem))', margin: '5rem auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#071936', marginBottom: '1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {c.values.title}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {c.values.items.map((item, idx) => (
            <div key={idx} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ width: '44px', height: '44px', background: '#EFF6FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#2563EB', fontWeight: 800, fontSize: '1.2rem' }}>
                {item.num}
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#071936', marginBottom: '0.85rem' }}>
                {item.title}
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.975rem', lineHeight: 1.65 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA Banner */}
      <section className="cta-banner-teal">
        <div className="cta-banner-content">
          <h2>{c.cta.title}</h2>
          <p>{c.cta.desc}</p>
          <div className="cta-banner-actions">
            <button className="cta-pill-btn client" onClick={() => onNavigate('services')}>
              {c.cta.btnClient}
            </button>
            <button className="cta-pill-btn pro" onClick={() => onNavigate('register')}>
              {c.cta.btnProvider}
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
