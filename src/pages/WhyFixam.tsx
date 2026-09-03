import React from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../App';
import { DifferenceTechIllustration } from '../components/TechIllustrations';
import { useSEO } from '../hooks/useSEO';
import { usePlatformStats } from '../hooks/usePlatformStats';
import './Home.css';

export default function WhyFixam({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const { formatCompletedTasks, formatVerifiedPros, formatCitiesList } = usePlatformStats();

  useSEO({
    title: isFr ? 'Pourquoi Choisir Fixam - Sécurité & Zéro Commission' : 'Why Choose Fixam - Trust, Speed & 0% Commission',
    description: isFr 
      ? 'Découvrez pourquoi des milliers de foyers et entreprises au Cameroun font confiance à Fixam pour leurs dépannages et travaux.' 
      : 'Learn why thousands of households and businesses across Cameroon trust Fixam for on-demand home repairs, verified trades, and 0% commission.',
    canonical: 'https://usefixam.com/why-fixam',
    isFr
  });

  return (
    <div className="landing-page tsi-styled-page">
      {/* 1. Top Hero Section */}
      <section className="tsi-hero-section" style={{ padding: '4rem 0 3rem' }}>
        <div className="tsi-hero-container">
          <div className="tsi-hero-left">
            <h1 className="tsi-hero-headline">
              {isFr ? 'Pourquoi Choisir' : 'Why Choose'}{' '}
              <span className="tsi-hero-highlight">Fixam?</span>
            </h1>
            <p className="tsi-hero-subtitle">
              {isFr
                ? 'La première place de marché technologique pour les services à la demande au Cameroun. Conçue pour la confiance, la rapidité et des réservations 100% gratuites.'
                : 'The leading tech-enabled on-demand service marketplace in Cameroon. Built for uncompromising trust, speed, and 100% free booking with direct transparent payments.'}
            </p>
            <div className="tsi-hero-cta-group">
              <button className="tsi-btn-primary" onClick={() => onNavigate('services')}>
                {isFr ? 'Explorer les Services' : 'Explore Services'}
              </button>
              <button className="tsi-btn-secondary" onClick={() => onNavigate('register')}>
                {isFr ? 'Devenir Prestataire' : 'Join as a Provider'}
              </button>
            </div>
          </div>
          <div className="tsi-hero-right">
            <div className="tsi-hero-illustration-wrapper">
              <DifferenceTechIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Stats Ribbon */}
      <section style={{ margin: '1rem 0 4rem' }}>
        <div className="tsi-floating-stats-bar" style={{ margin: '0 auto', position: 'static' }}>
          <div className="tsi-stat-col tsi-stat-col-first">
            <h3 className="tsi-stat-brand-heading">{isFr ? 'La Garantie Fixam' : 'The Fixam Guarantee'}</h3>
            <p className="tsi-stat-brand-sub">{isFr ? 'Transparence, sécurité et excellence sur chaque mission' : 'Transparency, safety and excellence across every job'}</p>
          </div>
          <div className="tsi-stat-col">
            <span className="tsi-stat-large-val">{formatCompletedTasks(isFr)}</span>
            <span className="tsi-stat-sub-label">{isFr ? 'Missions Réalisées' : 'Completed Tasks'}</span>
            <p className="tsi-stat-detail">{formatCitiesList(isFr)}</p>
          </div>
          <div className="tsi-stat-col">
            <span className="tsi-stat-large-val">{formatVerifiedPros()}</span>
            <span className="tsi-stat-sub-label">{isFr ? 'Artisans Vérifiés' : 'Verified Trade Pros'}</span>
            <p className="tsi-stat-detail">{isFr ? 'Identité et compétences rigoureusement testées' : 'ID & skill verified with background checks'}</p>
          </div>
          <div className="tsi-stat-col">
            <span className="tsi-stat-large-val">100% Free</span>
            <span className="tsi-stat-sub-label">{isFr ? 'Zéro Frais de Réservation' : 'Zero Booking Fees'}</span>
            <p className="tsi-stat-detail">{isFr ? 'Paiements directs sans commissions cachées' : 'Direct payments with zero platform commission'}</p>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars Grid */}
      <section className="section" style={{ width: 'min(1320px, calc(100% - 4rem))', margin: '0 auto 5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#071936', marginBottom: '1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {isFr ? 'Nos 4 Piliers Fondamentaux' : 'Our 4 Core Pillars'}
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {isFr 
              ? 'Nous réinventons l\'artisanat et les services à domicile en combinant technologie moderne et sécurité humaine.'
              : 'We are transforming local trades and home services by blending modern matching technology with rigorous human trust.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2rem', transition: 'box-shadow 0.2s' }}>
            <div style={{ width: '42px', height: '42px', background: '#F0FDFA', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#0D9488', fontWeight: 800, fontSize: '1.25rem' }}>
              01
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#071936', marginBottom: '0.75rem' }}>
              {isFr ? 'Vérification d\'Identité Stricte' : 'Strict Identity Verification'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {isFr 
                ? 'Chaque artisan fournit une pièce d\'identité nationale (CNI), un justificatif de domicile et passe un test de compétences avant d\'être certifié.'
                : 'Every trade professional submits national government ID (CNI), address verification, and skill qualifications before certification.'}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2rem', transition: 'box-shadow 0.2s' }}>
            <div style={{ width: '42px', height: '42px', background: '#F0FDFA', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#0D9488', fontWeight: 800, fontSize: '1.25rem' }}>
              02
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#071936', marginBottom: '0.75rem' }}>
              {isFr ? 'Zéro Commission & Prix Direct' : '0% Commission & Direct Pricing'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {isFr 
                ? 'Fixam est 100% gratuit pour les réservations. Payez directement votre prestataire en espèces ou Mobile Money sans aucun intermédiaire coûteux.'
                : 'Fixam does not charge booking fees or commissions. Pay your provider directly via cash or Mobile Money with full pricing transparency.'}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2rem', transition: 'box-shadow 0.2s' }}>
            <div style={{ width: '42px', height: '42px', background: '#F0FDFA', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#0D9488', fontWeight: 800, fontSize: '1.25rem' }}>
              03
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#071936', marginBottom: '0.75rem' }}>
              {isFr ? 'Matching Intelligent & Rapide' : 'Fast Smart Matching'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {isFr 
                ? 'Notre moteur de géolocalisation et de compétences alerte instantanément les prestataires qualifiés les plus proches de votre quartier.'
                : 'Our geo-location and skill engine instantly notifies qualified, available trade pros closest to your location for quick dispatch.'}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2rem', transition: 'box-shadow 0.2s' }}>
            <div style={{ width: '42px', height: '42px', background: '#F0FDFA', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#0D9488', fontWeight: 800, fontSize: '1.25rem' }}>
              04
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#071936', marginBottom: '0.75rem' }}>
              {isFr ? 'Support & Médiation Dédiés' : 'Dedicated Human Support'}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {isFr 
                ? 'Une équipe de support réactive est à votre écoute pour vous aider, répondre à vos questions et intervenir en cas de litige.'
                : 'Our customer support team is available via WhatsApp, phone, and email to assist you, monitor quality, and resolve disputes.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Comparison Section */}
      <section style={{ background: '#F8FAFC', padding: '4rem 1rem', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ width: 'min(1100px, 100%)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#071936', marginBottom: '0.75rem', lineHeight: 1.25 }}>
              {isFr ? 'Fixam vs Méthodes Traditionnelles' : 'Fixam vs Traditional Methods'}
            </h2>
            <p style={{ color: '#64748B', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', maxWidth: '650px', margin: '0 auto' }}>
              {isFr ? 'Pourquoi des milliers de ménages et entreprises choisissent Fixam chaque jour' : 'Why thousands of households and companies choose Fixam every day'}
            </p>
          </div>

          {/* Desktop & Tablet Table (Scrollable on intermediate viewports) */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            marginBottom: '1.5rem'
          }}>
            <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ background: '#071936', color: '#FFFFFF' }}>
                  <th style={{ padding: '1.1rem 1.25rem', fontWeight: 700, width: '40%' }}>{isFr ? 'Critères de Qualité' : 'Feature / Criteria'}</th>
                  <th style={{ padding: '1.1rem 1.25rem', fontWeight: 700, color: '#38BDF8', width: '30%' }}>Fixam</th>
                  <th style={{ padding: '1.1rem 1.25rem', fontWeight: 700, opacity: 0.85, width: '30%' }}>{isFr ? 'Artisans de Rue' : 'Unverified Street Pros'}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600, color: '#0F172A' }}>{isFr ? 'Vérification d\'identité (CNI)' : 'Government ID Verification'}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: '#16A34A', fontWeight: 700 }}>✓ {isFr ? '100% Garanti & Vérifié' : '100% Verified'}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: '#DC2626', fontWeight: 500 }}>✗ {isFr ? 'Non vérifié / Inconnu' : 'Unverified'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600, color: '#0F172A' }}>{isFr ? 'Frais de réservation' : 'Platform Booking Fees'}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: '#16A34A', fontWeight: 700 }}>0 FCFA (100% Free)</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: '#64748B' }}>{isFr ? 'Prix aléatoires et gonflés' : 'Unpredictable markups'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600, color: '#0F172A' }}>{isFr ? 'Avis et notes clients authentiques' : 'Real Customer Reviews'}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: '#16A34A', fontWeight: 700 }}>✓ {isFr ? 'Avis réels certifiés' : 'Authentic 5-star ratings'}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: '#DC2626', fontWeight: 500 }}>✗ {isFr ? 'Aucun historique vérifiable' : 'No track record'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600, color: '#0F172A' }}>{isFr ? 'Délai d\'intervention' : 'Response & Dispatch Time'}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: '#16A34A', fontWeight: 700 }}>{isFr ? '< 30 minutes' : '< 30 minutes'}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: '#64748B' }}>{isFr ? 'Plusieurs heures / jours' : 'Hours to days'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600, color: '#0F172A' }}>{isFr ? 'Support client & Médiation' : 'Mediation & Customer Support'}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: '#16A34A', fontWeight: 700 }}>✓ {isFr ? 'Support dédié Fixam 7j/7' : 'Dedicated Support Team'}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: '#DC2626', fontWeight: 500 }}>✗ {isFr ? 'Aucun recours en cas de litige' : 'Zero recourse'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. CTA Banner */}
      <section className="cta-banner-teal">
        <div className="cta-banner-content">
          <h2>{isFr ? 'Prêt à Découvrir la Différence Fixam ?' : 'Ready to Experience the Fixam Difference?'}</h2>
          <p>{isFr ? 'Rejoignez plus de 10 000 utilisateurs satisfaits à travers le Cameroun.' : 'Join over 10,000 satisfied clients and verified professionals across Cameroon.'}</p>
          <div className="cta-banner-actions">
            <button className="cta-pill-btn client" onClick={() => onNavigate('services')}>
              {isFr ? 'Trouver un Professionnel' : 'Find a Professional'}
            </button>
            <button className="cta-pill-btn pro" onClick={() => onNavigate('register')}>
              {isFr ? 'Devenir Prestataire' : 'Join as a Provider'}
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
