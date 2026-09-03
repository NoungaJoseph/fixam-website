import './ProviderProfileDetail.css';
import '../Provider/ProviderProfile.css';
import { Icon } from '../../App';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BookingFormModal from '../../components/BookingFormModal';
import { api } from '../../services/api';
import { getMediaUrl, DEFAULT_AVATAR } from '../../App';
import { useTranslation } from 'react-i18next';

// Precise SVG icons
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const VerifiedBadge = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563EB">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#14B8A6" : "none"} stroke={filled ? "#14B8A6" : "currentColor"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface ProviderProfileDetailProps {
  selectedProvider: any;
  setSelectedProvider: (pro: any) => void;
  setSelectedProject?: (proj: any) => void;
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
  savedProsState?: any[];
  setSavedProsState?: (pros: any[]) => void;
}

export default function ProviderProfileDetail({
  selectedProvider,
  setSelectedProvider,
  setSelectedProject,
  clientBookings,
  setClientBookings,
  setActiveTab,
  setActiveChatUser,
  savedProsState = [],
  setSavedProsState
}: ProviderProfileDetailProps) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [selectedModalProject, setSelectedModalProject] = useState<any | null>(null);

  const original = selectedProvider?.originalData || {};
  const providerId = original._id || original.id || selectedProvider?.id;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!selectedProvider) return null;

  const portfolio = original.portfolio || selectedProvider.portfolio || [];
  const certificates = original.certificates || selectedProvider.certificates || [];
  const skills = (original.skills || selectedProvider.skills || []);

  const rawServiceArea = original.serviceArea || selectedProvider.serviceArea || '';
  const serviceAreaQuarters = rawServiceArea
    ? rawServiceArea.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [];

  const fullName = selectedProvider.name || `${selectedProvider.firstName || ''} ${selectedProvider.lastName || ''}`.trim() || 'Provider';
  const rawAvatar = selectedProvider.image 
    || selectedProvider.avatar 
    || original.user?.avatar 
    || original.avatar;
  const displayImage = rawAvatar ? getMediaUrl(rawAvatar) : DEFAULT_AVATAR;

  const targetFavId = selectedProvider?.id || selectedProvider?.userId || original?.id || original?.userId;
  const [isSaved, setIsSaved] = useState(() => {
    return savedProsState?.some((p: any) => p.id === targetFavId || p.userId === targetFavId || p.originalData?.id === targetFavId || p.originalData?.userId === targetFavId) || false;
  });

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: `${fullName} on Fixam`,
          text: `Check out ${fullName} on Fixam!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert(i18n.language === 'fr' ? 'Lien copié dans le presse-papier !' : 'Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleSave = async () => {
    if (!targetFavId) return;
    try {
      if (isSaved) {
        await api.delete(`/providers/${targetFavId}/favorite`);
        setIsSaved(false);
        if (setSavedProsState) {
          setSavedProsState(savedProsState.filter((p: any) => p.id !== targetFavId && p.userId !== targetFavId && p.originalData?.id !== targetFavId));
        }
      } else {
        await api.post(`/providers/${targetFavId}/favorite`);
        setIsSaved(true);
        if (setSavedProsState) {
          setSavedProsState([...savedProsState, {
            id: selectedProvider.id,
            userId: selectedProvider.userId,
            name: fullName,
            role: selectedProvider.role || 'Service Provider',
            rating: selectedProvider.rating || '5.0',
            image: displayImage,
            originalData: selectedProvider
          }]);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const isOwnProfile = user && (
    original?.userId === user.id || 
    original?.user?.id === user.id || 
    original?._id === user.id || 
    original?.id === user.id ||
    selectedProvider?.id === user.id ||
    selectedProvider?.userId === user.id
  );

  const reviews = original.reviews || selectedProvider.reviews || [];

  return (
    <div className="upwork-mobile-page animate-fade-in pb-28">
      {/* Top action row */}
      <div className="flex items-center justify-between mb-2">
        <button
          className="upwork-btn-small-neutral flex items-center gap-1.5"
          onClick={() => { setSelectedProvider(null); setActiveTab('Dashboard'); }}
        >
          <span>&larr;</span> {i18n.language === 'fr' ? 'Retour aux prestataires' : 'Back to Providers'}
        </button>

        <div className="flex items-center gap-2">
          <button className="upwork-share-icon-btn" onClick={handleShare} title="Share Profile">
            <ShareIcon />
          </button>
          <button
            className="upwork-share-icon-btn"
            onClick={handleSave}
            title={isSaved ? "Saved to Favorites" : "Save to Favorites"}
          >
            <HeartIcon filled={isSaved} />
          </button>
        </div>
      </div>

      {/* ── UNIFIED PROVIDER PANEL ── */}
      <div className="upwork-unified-panel">

        {/* ── 1. HERO IDENTITY SECTION ── */}
        <section className="upwork-panel-section upwork-hero-section">
          <div className="upwork-hero-row">
            <div className="upwork-avatar-slot">
              <div className="upwork-avatar-frame">
                <img src={displayImage} alt={fullName} className="upwork-avatar-image" />
                <span className={`upwork-avatar-online-dot ${selectedProvider.isOnline || original.user?.isOnline ? 'online' : 'offline'}`} />
              </div>
            </div>

            <div className="upwork-hero-details">
              <div className="upwork-hero-name-row">
                <h1 className="upwork-display-name">{fullName}</h1>
                {(original.verification === 'VERIFIED' || selectedProvider.isVerified) && (
                  <span className="upwork-verified-badge" title="Verified Pro">
                    <VerifiedBadge />
                  </span>
                )}
              </div>

              <div className="upwork-location-line">
                <PinIcon />
                <span>{selectedProvider.location || original.location || 'Douala, Cameroon'}</span>
              </div>

              <div className="upwork-time-line">
                <span className="text-amber-500 font-bold">
                  ★ {selectedProvider.rating || '5.0'} ({reviews.length} {i18n.language === 'fr' ? 'avis' : 'reviews'})
                </span>
              </div>

              <div className="upwork-availability-line mt-1">
                <span className="upwork-availability-text avail-on">
                  <BoltIcon />
                  {i18n.language === 'fr' ? 'Disponible maintenant' : 'Available now'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. TITLE, HOURLY RATE & OVERVIEW ── */}
        <section className="upwork-panel-section">
          <div className="upwork-title-row">
            <h2 className="upwork-headline-text">
              {selectedProvider.role || original.title || 'Professional Specialist'}
            </h2>
          </div>

          <div className="upwork-rate-row">
            <span className="upwork-rate-amount">
              {original.rate || selectedProvider.rate
                ? `${Number(original.rate || selectedProvider.rate).toLocaleString()} XAF/hr`
                : '3,500 XAF/hr'}
            </span>
          </div>

          <div className="upwork-overview-body mt-2">
            <p className={`upwork-bio-paragraph ${isBioExpanded ? 'expanded' : 'collapsed'}`}>
              {original.bio || selectedProvider.bio ||
                'Verified Fixam professional ready for local tasks, repairs, installations, and technical projects with guaranteed quality.'}
            </p>
            {(original.bio?.length > 180 || selectedProvider.bio?.length > 180) && (
              <button
                className="upwork-toggle-more-btn"
                onClick={() => setIsBioExpanded(!isBioExpanded)}
              >
                {isBioExpanded ? 'less' : 'more'}
              </button>
            )}
          </div>
        </section>

        {/* ── 3. SERVICE AREA (QUARTERS) SECTION ── */}
        <section className="upwork-panel-section">
          <div className="upwork-section-header-row">
            <div>
              <h3 className="upwork-section-heading">
                {i18n.language === 'fr' ? 'Zone d\'intervention (Quartiers)' : 'Service Area (Quarters)'}
              </h3>
              <span className="upwork-section-caption">
                {i18n.language === 'fr'
                  ? 'Quartiers où ce prestataire se déplace pour ses interventions'
                  : 'Quarters where this provider travels for on-site execution'}
              </span>
            </div>
          </div>

          {serviceAreaQuarters.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-1">
              {i18n.language === 'fr' ? 'Opère dans l\'ensemble de l\'agglomération.' : 'Operates across the broader city area.'}
            </p>
          ) : (
            <div className="upwork-tags-container">
              {serviceAreaQuarters.map((quarter: string) => (
                <span key={quarter} className="upwork-quarter-tag">
                  {quarter}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* ── 4. SKILLS & SPECIALTIES ── */}
        <section className="upwork-panel-section">
          <div className="upwork-section-header-row">
            <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Compétences' : 'Skills'}</h3>
          </div>

          {skills.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-1">
              {i18n.language === 'fr' ? 'Aucune compétence listée.' : 'No skills listed.'}
            </p>
          ) : (
            <div className="upwork-tags-container">
              {skills.map((skill: string) => (
                <span key={skill} className="upwork-pill-tag">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* ── 5. PORTFOLIO ── */}
        <section className="upwork-panel-section">
          <div className="upwork-section-header-row">
            <div>
              <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Portfolio' : 'Portfolio'}</h3>
              <span className="upwork-section-caption">{portfolio.length} {i18n.language === 'fr' ? 'projets publiés' : 'projects'}</span>
            </div>
          </div>

          {portfolio.length === 0 ? (
            <div className="upwork-illustration-state py-4">
              <p className="upwork-illustration-copy">
                {i18n.language === 'fr' ? 'Aucun projet publié pour l\'instant.' : 'No portfolio projects published yet.'}
              </p>
            </div>
          ) : (
            <div className="upwork-portfolio-list">
              {portfolio.map((item: any, i: number) => {
                const coverImg = item.imageUrl || item.image || (Array.isArray(item.images) && item.images[0]) || '';
                return (
                  <div
                    key={item.id || i}
                    className="upwork-portfolio-card"
                    onClick={() => setSelectedModalProject(item)}
                  >
                    {coverImg ? (
                      <img src={getMediaUrl(coverImg)} alt={item.title} className="upwork-portfolio-image" />
                    ) : (
                      <div className="upwork-portfolio-fallback">Project Demo</div>
                    )}
                    <div className="upwork-portfolio-text-wrap">
                      <h4 className="upwork-portfolio-title">{item.title}</h4>
                      {item.description && <p className="upwork-portfolio-snippet">{item.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── 6. CERTIFICATIONS ── */}
        {certificates.length > 0 && (
          <section className="upwork-panel-section">
            <div className="upwork-section-header-row">
              <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Certifications' : 'Certifications'}</h3>
            </div>
            <div className="upwork-items-list">
              {certificates.map((cert: any, i: number) => (
                <div key={i} className="upwork-item-row">
                  <div className="flex-1 min-w-0">
                    <h4 className="upwork-item-name">{cert.title}</h4>
                    <p className="upwork-item-meta">{cert.issuer} • {cert.year}</p>
                    {cert.imageUrl && (
                      <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer" className="upwork-item-link">
                        View credential
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 7. CLIENT REVIEWS ── */}
        <section className="upwork-panel-section border-b-0">
          <div className="upwork-section-header-row">
            <div>
              <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Avis clients' : 'Client Reviews'}</h3>
              <span className="upwork-section-caption">{reviews.length} {i18n.language === 'fr' ? 'évaluations' : 'reviews'}</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="upwork-illustration-state py-3">
              <p className="upwork-illustration-copy">
                {i18n.language === 'fr' ? 'Ce prestataire n\'a pas encore d\'avis client.' : 'No client reviews yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r: any, idx: number) => (
                <div key={r.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 text-sm">{r.client?.fullName || r.reviewer?.fullName || r.serviceName || 'Client'}</span>
                    <span className="text-amber-500 text-xs font-bold">
                      {'★'.repeat(Math.round(r.rating || 5))}
                    </span>
                  </div>
                  {r.comment && <p className="text-xs text-slate-600 mb-1">"{r.comment}"</p>}
                  <span className="text-[11px] text-slate-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ── FIXED BOTTOM BAR ON MOBILE FOR ONE-TAP BOOKING ── */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg flex items-center justify-between z-40 md:hidden">
        <div>
          <span className="text-xs text-slate-400 font-semibold block">{i18n.language === 'fr' ? 'Tarif estimatif' : 'Estimated Rate'}</span>
          <strong className="text-sm text-slate-800">
            {original.rate || selectedProvider.rate ? `${Number(original.rate || selectedProvider.rate).toLocaleString()} XAF/hr` : '3,500 XAF/hr'}
          </strong>
        </div>
        <button
          className="upwork-btn-sheet-save py-2 px-6 text-sm font-bold shadow-md"
          onClick={() => {
            if (isOwnProfile) {
              alert("You cannot book your own profile.");
              return;
            }
            setIsBookingModalOpen(true);
          }}
        >
          {i18n.language === 'fr' ? 'Réserver maintenant' : 'Book Now'}
        </button>
      </div>

      {/* ── BOOKING FORM MODAL ── */}
      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        providerName={fullName}
        providerService={selectedProvider.role || original.title || 'Service'}
        providerImage={displayImage}
        basePrice={original.rate ? `${original.rate} XAF` : undefined}
        onSubmit={(newBk: any) => {
          if (newBk) {
            setClientBookings([newBk, ...clientBookings]);
            alert(i18n.language === 'fr' ? 'Demande de réservation envoyée avec succès !' : 'Booking request submitted successfully!');
          }
        }}
      />

      {/* ── PROJECT PREVIEW MODAL ── */}
      {selectedModalProject && (
        <div className="upwork-modal-backdrop">
          <div className="upwork-modal-sheet animate-scale-in max-w-xl">
            <div className="upwork-sheet-header">
              <h3>{selectedModalProject.title}</h3>
              <button className="upwork-sheet-close-btn" onClick={() => setSelectedModalProject(null)}>
                <CloseIcon />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {(selectedModalProject.imageUrl || selectedModalProject.image) && (
                <img
                  src={getMediaUrl(selectedModalProject.imageUrl || selectedModalProject.image)}
                  alt={selectedModalProject.title}
                  className="w-full h-56 object-cover rounded-xl"
                />
              )}
              {selectedModalProject.description && (
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedModalProject.description}
                </p>
              )}
            </div>
            <div className="upwork-sheet-footer">
              <button
                type="button"
                className="upwork-btn-sheet-save"
                onClick={() => setSelectedModalProject(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
