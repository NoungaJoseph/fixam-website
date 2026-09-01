import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../App';
import { HeroTechIllustration } from '../components/TechIllustrations';
import './Home.css';

export default function Solutions({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const [activeTab, setActiveTab] = useState<'individuals' | 'business' | 'providers'>('individuals');

  return (
    <div className="landing-page tsi-styled-page">
      {/* 1. Hero Section */}
      <section className="tsi-hero-section" style={{ padding: '4rem 0 3rem' }}>
        <div className="tsi-hero-container">
          <div className="tsi-hero-left">
            <h1 className="tsi-hero-headline">
              {isFr ? 'Des Solutions Adaptées à' : 'Tailored Solutions for'}{' '}
              <span className="tsi-hero-highlight">{isFr ? 'Chaque Besoin' : 'Every Service Need.'}</span>
            </h1>
            <p className="tsi-hero-subtitle">
              {isFr
                ? 'Que vous soyez un particulier, un gestionnaire immobilier ou un artisan qualifié, Fixam vous offre des outils technologiques performants et un accès direct aux meilleurs talents.'
                : 'Whether you are a homeowner, property manager, or skilled trade professional, Fixam provides enterprise-grade matching, instant dispatch, and 100% free bookings.'}
            </p>
            <div className="tsi-hero-cta-group">
              <button className="tsi-btn-primary" onClick={() => onNavigate('services')}>
                {isFr ? 'Explorer les Services' : 'Explore All Services'}
              </button>
              <button className="tsi-btn-secondary" onClick={() => onNavigate('register')}>
                {isFr ? 'Créer un Compte' : 'Get Started Free'}
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

      {/* 2. Solutions Tabs Selector */}
      <section style={{ width: 'min(1320px, calc(100% - 4rem))', margin: '2rem auto 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('individuals')}
            style={{
              background: activeTab === 'individuals' ? '#0D9488' : '#F1F5F9',
              color: activeTab === 'individuals' ? '#FFFFFF' : '#334155',
              padding: '0.75rem 1.75rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isFr ? 'Pour Particuliers & Ménages' : 'For Homeowners & Individuals'}
          </button>
          <button
            onClick={() => setActiveTab('business')}
            style={{
              background: activeTab === 'business' ? '#0D9488' : '#F1F5F9',
              color: activeTab === 'business' ? '#FFFFFF' : '#334155',
              padding: '0.75rem 1.75rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isFr ? 'Pour Entreprises & Immobiliers' : 'For Businesses & Property Managers'}
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            style={{
              background: activeTab === 'providers' ? '#0D9488' : '#F1F5F9',
              color: activeTab === 'providers' ? '#FFFFFF' : '#334155',
              padding: '0.75rem 1.75rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isFr ? 'Pour Artisans & Prestataires' : 'For Trade Professionals'}
          </button>
        </div>

        {/* Tab Content Display */}
        <div style={{ marginTop: '3.5rem' }}>
          {activeTab === 'individuals' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#071936', marginBottom: '1rem' }}>
                  {isFr ? 'Dépannages d\'Urgence à Domicile' : 'Emergency Home Repairs'}
                </h3>
                <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {isFr ? 'Fuites d\'eau, pannes électriques, climatisation en panne ou serrures bloquées. Obtenez un artisan vérifié en moins de 30 minutes.' : 'Water leaks, electrical outages, broken AC units, or locked doors. Get a verified specialist dispatched to your door in under 30 minutes.'}
                </p>
                <ul style={{ paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  <li>{isFr ? 'Plomberie & Débouchage' : 'Plumbing & Drainage'}</li>
                  <li>{isFr ? 'Électricité & Câblage' : 'Electrical & Wiring'}</li>
                  <li>{isFr ? 'Climatisation & Froid' : 'AC & Refrigeration'}</li>
                  <li>{isFr ? 'Serrurerie & Sécurité' : 'Locksmithing & Security'}</li>
                </ul>
              </div>

              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#071936', marginBottom: '1rem' }}>
                  {isFr ? 'Rénovation & Aménagement' : 'Home Improvement & Renovation'}
                </h3>
                <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {isFr ? 'Peinture intérieure, pose de carrelage, menuiserie bois/aluminium et travaux de maçonnerie pour valoriser votre logement.' : 'Interior painting, floor tiling, custom carpentry, and masonry construction to upgrade and beautify your living space.'}
                </p>
                <ul style={{ paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  <li>{isFr ? 'Peinture & Décoration' : 'Painting & Decoration'}</li>
                  <li>{isFr ? 'Menuiserie & Meubles sur mesure' : 'Carpentry & Custom Furniture'}</li>
                  <li>{isFr ? 'Carrelage & Revêtement' : 'Tiling & Flooring'}</li>
                  <li>{isFr ? 'Maçonnerie & Gros œuvre' : 'Masonry & Construction'}</li>
                </ul>
              </div>

              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#071936', marginBottom: '1rem' }}>
                  {isFr ? 'Services du Quotidien' : 'Everyday Home & Care'}
                </h3>
                <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {isFr ? 'Nettoyage régulier ou grand ménage après déménagement, entretien d\'appareils électroménagers et réparations diverses.' : 'Routine deep cleaning, post-move cleaning, home appliance maintenance, and general handiwork whenever you need it.'}
                </p>
                <ul style={{ paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  <li>{isFr ? 'Nettoyage Résidentiel' : 'Residential Cleaning'}</li>
                  <li>{isFr ? 'Réparation Électroménager' : 'Appliance Repair'}</li>
                  <li>{isFr ? 'Déménagement & Manutention' : 'Moving & Porterage'}</li>
                  <li>{isFr ? 'Jardinage & Extérieurs' : 'Gardening & Landscaping'}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              <div style={{ background: '#071936', color: '#FFFFFF', borderRadius: '10px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38BDF8', marginBottom: '1rem' }}>
                  {isFr ? 'Gestion Multi-Sites & Bureaux' : 'Multi-Site & Commercial Maintenance'}
                </h3>
                <p style={{ color: '#CBD5E1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {isFr ? 'Centralisez la maintenance de vos agences, boutiques et bureaux avec des équipes dédiées et des interventions prioritaires.' : 'Streamline maintenance operations across all your retail branches, offices, and residential properties with dedicated SLA agreements.'}
                </p>
                <button className="tsi-btn-primary" onClick={() => onNavigate('support')}>
                  {isFr ? 'Demander un Compte Entreprise' : 'Inquire for Business'}
                </button>
              </div>

              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#071936', marginBottom: '1rem' }}>
                  {isFr ? 'Agences Immobilières & Bailleurs' : 'Property Managers & Real Estate'}
                </h3>
                <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {isFr ? 'Résolvez les signalements de vos locataires en quelques clics sans mobiliser vos équipes de gestion.' : 'Handle tenant repair tickets and move-in/move-out inspections effortlessly with verified on-call trade contractors.'}
                </p>
                <button className="tsi-btn-secondary" onClick={() => onNavigate('services')}>
                  {isFr ? 'Voir les Solutions Pro' : 'View Real Estate Features'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'providers' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#071936', marginBottom: '1rem' }}>
                  {isFr ? '0% de Commission sur vos Gains' : '0% Commission on Your Earnings'}
                </h3>
                <p style={{ color: '#64748B', lineHeight: 1.6 }}>
                  {isFr ? 'Conservez 100% de ce que vous facturez à vos clients. Pas de prélèvement sur vos prestations.' : 'Keep 100% of your labor charges. Fixam does not take commissions from your hard work.'}
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#071936', marginBottom: '1rem' }}>
                  {isFr ? 'Parcours Professionnel & Certification' : 'Career Pathways & Certification'}
                </h3>
                <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {isFr ? 'Passez des certifications reconnues, montez en compétence et gagnez la confiance de clients haut de gamme.' : 'Earn industry badges, simulate your career growth, and unlock high-paying corporate contracts.'}
                </p>
                <button className="tsi-btn-primary" onClick={() => onNavigate('career_pathways')}>
                  {isFr ? 'Découvrir les Parcours Pro' : 'Explore Career Pathways'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. CTA Banner */}
      <section className="cta-banner-teal">
        <div className="cta-banner-content">
          <h2>{isFr ? 'Trouvez la Solution Idéale Aujourd\'hui' : 'Find Your Ideal Service Solution Today'}</h2>
          <p>{isFr ? 'Publiez une tâche gratuitement ou rejoignez notre réseau de prestataires qualifiés.' : 'Post a task for free or join our growing network of certified trade pros across Cameroon.'}</p>
          <div className="cta-banner-actions">
            <button className="cta-pill-btn client" onClick={() => onNavigate('services')}>
              {isFr ? 'Parcourir les Services' : 'Browse Services'}
            </button>
            <button className="cta-pill-btn pro" onClick={() => onNavigate('register')}>
              {isFr ? 'S\'inscrire comme Prestataire' : 'Register as Provider'}
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
