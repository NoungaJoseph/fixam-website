import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { getMediaUrl } from '../App';

interface PublicProfileViewProps {
  profileId: string;
}

export default function PublicProfileView({ profileId }: PublicProfileViewProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<any>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!profileId) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    api.get(`/providers/${profileId}`)
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.success && res.data?.data) {
          setProvider(res.data.data);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  // Attempt automatic deep link launch on mobile browsers
  useEffect(() => {
    if (profileId && typeof window !== 'undefined') {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        const timeout = setTimeout(() => {
          window.location.href = `fixam://profile/${profileId}`;
        }, 800);
        return () => clearTimeout(timeout);
      }
    }
  }, [profileId]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const currentProvider = provider;
  const user = currentProvider?.user;
  const fullName = user?.fullName || (isFr ? 'Prestataire Fixam' : 'Fixam Provider');
  const avatarUrl = user?.avatar ? getMediaUrl(user.avatar) : null;
  const rating = Number(currentProvider?.rating || 0);
  const reviewCount = Number(currentProvider?.reviewCount || 0);
  const isOnline = user?.isOnline || false;
  const isVerified = currentProvider?.verification === 'VERIFIED';
  const serviceArea = currentProvider?.serviceArea || 'Cameroon';
  const bio = currentProvider?.bio?.trim();
  const skills: string[] = Array.isArray(currentProvider?.skills) ? currentProvider.skills : [];
  const skillRank = currentProvider?.skillRank || 'Verified Pro';
  const experienceLevel = currentProvider?.experienceLevel || (isFr ? 'Professionnel' : 'Professional');
  const rate = currentProvider?.rate ? `${Number(currentProvider.rate).toLocaleString()} XAF` : null;

  const appStoreUrl = "https://apps.apple.com/cm/app/fixam-pro/id6791191286?l=en-GB";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.fixam.app.android";
  const deepLink = `fixam://profile/${profileId}`;

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', backgroundColor: '#F8FAFC', padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '640px', width: '100%', background: 'white', borderRadius: '20px', padding: '3rem', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', border: '4px solid #E2E8F0', borderTopColor: '#0D9488', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
            {isFr ? 'Chargement du profil...' : 'Loading provider profile...'}
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            {isFr ? 'Récupération des détails du professionnel sur Fixam' : 'Retrieving verified professional details from Fixam'}
          </p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div style={{ minHeight: '80vh', backgroundColor: '#F8FAFC', padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '600px', width: '100%', background: 'white', borderRadius: '20px', padding: '3rem 2rem', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
            {isFr ? 'Profil introuvable' : 'Profile Unavailable'}
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {isFr
              ? 'Ce profil est momentanément indisponible ou a été modifié. Vous pouvez ouvrir l\'application Fixam ou parcourir d\'autres prestataires qualifiés.'
              : 'This provider profile is currently unavailable or may have been updated. You can open the Fixam app or explore other verified pros.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'center' }}>
            <a href={`fixam://profile/${profileId}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '300px', padding: '0.9rem', backgroundColor: '#0D9488', color: 'white', fontWeight: 700, borderRadius: '12px', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}><path d="M5 3l14 9-14 9V3z"/></svg> {isFr ? 'Ouvrir dans l\'application' : 'Open in Fixam App'}
            </a>
            <a href="/#services" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '300px', padding: '0.85rem', backgroundColor: '#F1F5F9', color: '#1E293B', fontWeight: 600, borderRadius: '12px', textDecoration: 'none' }}>
              {isFr ? 'Parcourir les services' : 'Explore All Services'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '85vh', backgroundColor: '#F8FAFC', padding: '2.5rem 1rem 5rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        
        {/* Top Header Card */}
        <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', marginBottom: '1.75rem' }}>
          
          {/* Decorative Cover Gradient */}
          <div style={{ height: '140px', background: 'linear-gradient(135deg, #0E7490 0%, #0D9488 50%, #14B8A6 100%)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCopyLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  color: '#0F172A',
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                {copied ? (isFr ? 'Lien copié !' : 'Link Copied!') : (isFr ? 'Partager' : 'Share')}
              </button>
            </div>
          </div>

          {/* Profile Header Details */}
          <div style={{ padding: '0 2rem 2rem', position: 'relative' }}>
            
            {/* Avatar & Badges row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-55px', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '110px', height: '110px', borderRadius: '50%', backgroundColor: '#FFFFFF', padding: '4px', boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#0D9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem', fontWeight: 800 }}>
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Online Indicator */}
                <div
                  title={isOnline ? 'Online' : 'Offline'}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: isOnline ? '#22C55E' : '#94A3B8',
                    border: '3px solid white'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href={deepLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.85rem 1.6rem',
                    backgroundColor: '#0D9488',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: '12px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                  {isFr ? 'Ouvrir dans Fixam' : 'Open in Fixam App'}
                </a>
              </div>
            </div>

            {/* Name, Title, and Verification */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {fullName}
                </h1>
                {isVerified && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#ECFDF5', color: '#065F46', padding: '3px 10px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    {isFr ? 'Vérifié' : 'Verified Pro'}
                  </span>
                )}
                <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '3px 10px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {skillRank}
                </span>
              </div>

              {/* Location & Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#64748B', fontSize: '0.95rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{serviceArea}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <strong style={{ color: '#0F172A' }}>{rating > 0 ? rating.toFixed(1) : '5.0'}</strong>
                  <span>({reviewCount} {isFr ? 'avis' : 'reviews'})</span>
                </div>
                {rate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0F172A', fontWeight: 700 }}>
                    <span>{rate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>{isFr ? 'Statut' : 'Availability'}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: isOnline ? '#16A34A' : '#64748B' }}>
                  {isOnline ? (isFr ? 'Disponible' : 'Available') : (isFr ? 'Hors ligne' : 'Offline')}
                </div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>{isFr ? 'Niveau d\'expérience' : 'Experience Level'}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{experienceLevel}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>{isFr ? 'Identité' : 'Identity Check'}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: isVerified ? '#0D9488' : '#D97706' }}>
                  {isVerified ? (isFr ? 'Vérifiée CNI' : 'ID Verified') : (isFr ? 'En cours' : 'In Progress')}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Two-Column Details Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.75rem' }}>
          
          {/* About Section */}
          {bio && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {isFr ? 'À propos de moi' : 'About Me'}
              </h2>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-line', margin: 0 }}>
                {bio}
              </p>
            </div>
          )}

          {/* Skills & Services */}
          {skills.length > 0 && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                {isFr ? 'Compétences & Services' : 'Skills & Services Offered'}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0.55rem 1rem',
                      backgroundColor: '#F0FDFA',
                      color: '#0F766E',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      border: '1px solid #CCFBF1'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hire / Book CTA Box */}
          <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '24px', padding: '2.5rem 2rem', color: 'white', textAlign: 'center', boxShadow: '0 12px 30px rgba(15,23,42,0.15)' }}>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {isFr ? `Réserver ou contacter ${fullName}` : `Book or Contact ${fullName}`}
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '580px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              {isFr
                ? 'Pour voir le numéro de téléphone direct, envoyer un message instantané ou réserver ce prestataire en toute sécurité, ouvrez le profil dans l\'application Fixam.'
                : 'To contact directly, send instant messages, or book this verified pro safely with satisfaction guarantee, open the profile in the Fixam mobile app.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <a
                href={deepLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  maxWidth: '320px',
                  padding: '1rem 1.5rem',
                  backgroundColor: '#0D9488',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                {isFr ? 'Ouvrir dans l\'application Fixam' : 'Open in Fixam App'}
              </a>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.75rem 1.25rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.6 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  App Store
                </a>
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.75rem 1.25rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                  Google Play
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
