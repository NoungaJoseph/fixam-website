import { useState, useMemo } from 'react';
import { Icon, getMediaUrl } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import './ProjectDetail.css';

interface ProjectDetailProps {
  selectedProject: any;
  setSelectedProject: (proj: any) => void;
  setSelectedProvider: (pro: any) => void;
  setActiveTab: (tab: string) => void;
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  displayedPros: any[];
  favoriteProjectIds?: string[];
  toggleFavoriteProject?: (projectId: string) => void;
}

export default function ProjectDetail({
  selectedProject,
  setSelectedProject,
  setSelectedProvider,
  setActiveTab,
  clientBookings,
  setClientBookings,
  displayedPros,
  favoriteProjectIds = [],
  toggleFavoriteProject
}: ProjectDetailProps) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [expressAddon, setExpressAddon] = useState(false);

  // Send Proposal / Order Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [proposalType, setProposalType] = useState<'EXACT' | 'SIMILAR'>('EXACT');
  const [proposalDescription, setProposalDescription] = useState('');
  const [offeredBudget, setOfferedBudget] = useState('');
  const [expectedDays, setExpectedDays] = useState('');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  const project = selectedProject || {};
  const provider = project.provider || {};
  const providerUserId = provider.userId || provider.id;

  const handleMediaClick = () => {
    if (mediaList.length > 1) {
      setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
    }
  };

  // Extract Real Media list (Videos + Images)
  const mediaList = useMemo(() => {
    const list: Array<{ type: 'image' | 'video'; url: string }> = [];
    
    const images = (Array.isArray(project.images) && project.images.length > 0)
      ? project.images
      : (project.imageUrl ? [project.imageUrl] : (project.image ? [project.image] : (project.url ? [project.url] : [])));

    images.forEach((img: string) => {
      if (img) list.push({ type: 'image', url: img });
    });

    const videoList = Array.isArray(project.videos) && project.videos.length > 0
      ? project.videos
      : (project.video ? (Array.isArray(project.video) ? project.video : [project.video]) : (project.videoUrl ? [project.videoUrl] : []));
    videoList.forEach((v: string) => {
      if (v) list.push({ type: 'video', url: v });
    });

    if (list.length === 0) {
      list.push({ type: 'image', url: provider?.avatar || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80' });
    }
    return list;
  }, [project, provider]);

  // Parse Real Packages/Tiers from DB (Safely handling JSON strings)
  const tiers = useMemo(() => {
    let packagesObj = project.packages;
    if (typeof packagesObj === 'string') {
      try { packagesObj = JSON.parse(packagesObj); } catch (_) {}
    }

    const baseRate = Number(project.price || provider.rate || 5000);
    if (packagesObj && typeof packagesObj === 'object') {
      const parsed: any[] = [];
      ['basic', 'standard', 'premium'].forEach((key) => {
        const pkg = packagesObj[key];
        if (pkg && (pkg.enabled || pkg.price)) {
          parsed.push({
            id: key,
            name: key.toUpperCase(),
            label: pkg.summary || pkg.label || (key === 'basic' ? (isFr ? 'Forfait De Base' : 'Basic Package') : key === 'standard' ? (isFr ? 'Forfait Standard' : 'Standard Package') : (isFr ? 'Forfait Premium' : 'Premium Package')),
            price: Number(pkg.price || 0),
            deliveryDays: Number(pkg.deliveryDays || 1),
            revisions: Number(pkg.revisions || 0),
            expressDeliveryEnabled: pkg.expressDeliveryEnabled !== undefined ? Boolean(pkg.expressDeliveryEnabled) : true,
            expressDeliveryDays: pkg.expressDeliveryDays ? Number(pkg.expressDeliveryDays) : 1,
            expressDeliveryPrice: pkg.expressDeliveryPrice ? Number(pkg.expressDeliveryPrice) : Math.round(Number(pkg.price || 0) * 0.3),
            features: Array.isArray(pkg.features) && pkg.features.length > 0
              ? pkg.features.filter((f: any) => f && typeof f === 'string' && f.trim())
              : []
          });
        }
      });
      if (parsed.length > 0) return parsed;
    }

    // Default Single Tier fallback based on actual project.price / provider.rate if no packages object
    return [
      {
        id: 'standard',
        name: 'STANDARD',
        label: isFr ? 'Forfait Standard' : 'Standard Package',
        price: baseRate,
        deliveryDays: 3,
        revisions: 2,
        expressDeliveryEnabled: true,
        expressDeliveryDays: 1,
        expressDeliveryPrice: Math.round(baseRate * 0.25),
        features: [isFr ? 'Livraison professionnelle' : 'Professional Delivery', isFr ? 'Haute résolution' : 'High Resolution', isFr ? 'Fichiers sources' : 'Source Files']
      }
    ];
  }, [project, provider, isFr]);

  const activeTier = tiers[selectedTierIndex] || tiers[0];
  const expressAddonPrice = Number(activeTier.expressDeliveryPrice || Math.round(activeTier.price * 0.2));
  const expressDays = Number(activeTier.expressDeliveryDays || 1);
  const finalPrice = activeTier.price + (expressAddon ? expressAddonPrice : 0);

  // Open Order / Send Proposal Modal with prefilled tier values
  const handleOpenOrderModal = () => {
    setOfferedBudget(String(finalPrice));
    setExpectedDays(String(activeTier.deliveryDays || 3));
    setProposalDescription('');
    setProposalType('EXACT');
    setIsOrderModalOpen(true);
  };

  // Submit Proposal Handler (Identical to app's ProjectProposalScreen)
  const handleSubmitProposal = async () => {
    if (!proposalDescription.trim()) {
      alert(isFr ? 'Veuillez décrire votre proposition ou vos exigences' : 'Please describe your proposal or requirements');
      return;
    }

    setIsSubmittingProposal(true);
    try {
      // 1. Post proposal booking
      await api.post('/bookings', {
        providerId: providerUserId,
        isProposal: true,
        budget: Number(offeredBudget || finalPrice),
        bookingDate: new Date().toISOString(),
        bookingTime: '09:00',
        bookingDuration: `${expectedDays || 3} DAYS`,
        notes: `PROJECT PROPOSAL: ${project.title || 'Custom Service'}\nRequirements: ${proposalDescription.trim()}`,
        location: `Project: ${project.title || 'Custom Service'} (${activeTier.name})`
      });

      // 2. Create or fetch chat conversation
      let convId;
      try {
        const convRes = await api.post('/chat/conversations', { participantId: providerUserId });
        convId = convRes.data?.data?.id || convRes.data?.id;
      } catch (_) {}

      // 3. Send proposal message into chat if conversation exists
      if (convId) {
        const proposalText = `📋 *PROPOSAL FOR PROJECT*: ${project.title || 'Custom Service'}\nType: ${proposalType === 'EXACT' ? 'Buy Exact Project' : 'Similar Custom Service'}\nPackage: ${activeTier.name}\nOffered Price: XAF ${offeredBudget}\nTimeline: ${expectedDays} Days\n\nRequirements:\n${proposalDescription.trim()}`;
        await api.post(`/chat/conversations/${convId}/messages`, { content: proposalText, type: 'TEXT' });
      }

      alert(isFr ? 'Votre proposition a été envoyée avec succès au prestataire !' : 'Your proposal has been sent to the provider!');
      setIsOrderModalOpen(false);
      setSelectedProject(null);
      setActiveTab('Messages');
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Error submitting proposal');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  // Navigate to provider profile view
  const handleViewProviderProfile = () => {
    const matchedPro = displayedPros.find(p => p.originalData?.id === provider.id || p.id === provider.id);
    if (matchedPro) {
      setSelectedProvider(matchedPro);
      setSelectedProject(null);
      setActiveTab('Provider Profile');
    }
  };

  return (
    <div className="project-detail-page-wrapper animate-fade-in">
      <div className="project-detail-single-column">
        {/* Upper Hero Media Showcase Banner with Overlay Floating Back Arrow (No text written on top of image) */}
        <div className="project-media-gallery">
          <div 
            className="active-media-view" 
            onClick={handleMediaClick}
            style={{ cursor: mediaList.length > 1 ? 'pointer' : 'default' }}
          >
            {/* Floating Back Arrow Inside Upper Hero Section */}
            <button 
              className="floating-hero-back-btn" 
              onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }} 
              aria-label="Back to Dashboard"
              title={isFr ? 'Retour au tableau de bord' : 'Back to Dashboard'}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            {/* Floating Favorite Heart Button Inside Upper Hero Section */}
            <button 
              className="floating-hero-fav-btn" 
              onClick={(e) => {
                e.stopPropagation();
                if (toggleFavoriteProject) toggleFavoriteProject(project.id);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'background-color 0.2s'
              }}
              title={favoriteProjectIds.includes(project.id) ? (isFr ? 'Retirer des favoris' : 'Remove from Favorites') : (isFr ? 'Ajouter aux favoris' : 'Add to Favorites')}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={favoriteProjectIds.includes(project.id) ? "#EF4444" : "none"}
                stroke={favoriteProjectIds.includes(project.id) ? "#EF4444" : "currentColor"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            {mediaList[activeMediaIndex].type === 'video' ? (
              <video
                src={getMediaUrl(mediaList[activeMediaIndex].url, 'video')}
                controls
                className="gallery-video"
                autoPlay
              />
            ) : (
              <img
                src={getMediaUrl(mediaList[activeMediaIndex].url, 'image')}
                alt="Project background hero media"
                className="gallery-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80';
                }}
              />
            )}
          </div>

          {/* Thumbnail Navigation */}
          {mediaList.length > 1 && (
            <div className="gallery-thumbnails">
              {mediaList.map((media, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${activeMediaIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveMediaIndex(idx)}
                >
                  {media.type === 'video' ? (
                    <div className="thumb-video-placeholder">
                      <Icon name="briefcase" />
                      <span className="play-indicator-text">Play</span>
                    </div>
                  ) : (
                    <img
                      src={getMediaUrl(media.url, 'image')}
                      alt={`Thumb ${idx}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80';
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project Title and Category Header */}
        <div className="project-detail-text-content">
          <div className="project-info-header">
            <h1 className="project-detail-title">{project.title || 'Untitled Project'}</h1>
            {project.category && (
            <span className="project-category-badge">{project.category}</span>
          )}
        </div>

        {/* Provider Info Row */}
        <div className="project-provider-card" onClick={handleViewProviderProfile}>
          <div className="provider-avatar-wrap">
            {provider.avatar ? (
              <img
                src={getMediaUrl(provider.avatar)}
                alt={provider.name}
                className="provider-avatar-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name || 'Provider')}&background=14B8A6&color=fff&size=50&rounded=true`;
                }}
              />
            ) : (
              <div className="provider-avatar-fallback">
                {(provider.name || 'P').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="provider-details-text">
            <h4>{provider.name || 'Anonymous Provider'}</h4>
            <div className="provider-stats-row">
              <span className="rating-badge">
                <Icon name="star" /> {Number(provider.rating || 5.0).toFixed(1)}
              </span>
              <span className="reviews-count">({provider.reviewCount || (provider.reviews?.length || 0)} {isFr ? 'avis' : 'reviews'})</span>
            </div>
          </div>
          <button className="btn-view-profile-chevron" title="View Profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Project Description (About Section) */}
        <div className="project-description-section">
          <h3>{isFr ? 'À propos de ce projet' : 'About This Project'}</h3>
          <p className="project-description-paragraph">
            {project.description || (isFr ? 'Aucune description fournie pour ce projet.' : 'No description provided for this project.')}
          </p>
        </div>

        {/* Packages / Pricing Tiers (Positioned BEFORE Seller Rating Breakdown - Only ONCE) */}
        <div className="project-packages-section">
          <h3 className="section-title-clean">{isFr ? 'Forfaits et tarifs du projet' : 'Project Packages & Pricing'}</h3>
          <div className="packages-container-card">
            {/* Tiers Tabs Headers */}
            <div className="tiers-tabs-header">
              {tiers.map((tier, idx) => (
                <button
                  key={tier.id}
                  className={`tier-tab-header-btn ${selectedTierIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTierIndex(idx);
                    setExpressAddon(false);
                  }}
                >
                  {tier.name === 'BASIC' ? (isFr ? 'DE BASE' : 'BASIC') : tier.name}
                </button>
              ))}
            </div>

            {/* Active Tier Details Body */}
            <div className="active-tier-body">
              <div className="tier-price-row">
                <span className="tier-price-label">{isFr ? 'Prix' : 'Price'}</span>
                <span className="tier-price-value">XAF {tierPriceFormat(activeTier.price)}</span>
              </div>

              <h4 className="tier-summary-title">{activeTier.label}</h4>

              {/* Delivery info & revisions */}
              <div className="delivery-info-grid">
                <div className="info-cell">
                  <Icon name="calendar" />
                  <span>{activeTier.deliveryDays} {isFr ? `Jour${activeTier.deliveryDays > 1 ? 's' : ''} de livraison` : `Day${activeTier.deliveryDays > 1 ? 's' : ''} Delivery`}</span>
                </div>
                <div className="info-cell">
                  <Icon name="settings" />
                  <span>{activeTier.revisions || (isFr ? 'Illimité' : 'Unlimited')} {isFr ? `Révision${activeTier.revisions !== 1 ? 's' : ''}` : `Revision${activeTier.revisions !== 1 ? 's' : ''}`}</span>
                </div>
              </div>

              {/* Features List */}
              {activeTier.features.length > 0 && (
                <div className="tier-features-list">
                  <h5>{isFr ? 'Ce qui est inclus :' : "What's Included:"}</h5>
                  <ul>
                    {activeTier.features.map((feat: string, index: number) => (
                      <li key={index}>
                        <span className="check-bullet">&check;</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Express Delivery Option */}
              {activeTier.expressDeliveryEnabled !== false && (
                <label className="express-addon-option">
                  <input
                    type="checkbox"
                    checked={expressAddon}
                    onChange={(e) => setExpressAddon(e.target.checked)}
                  />
                  <div className="express-addon-text-wrap">
                    <span className="express-addon-title">{isFr ? `Livraison express en ${expressDays} jour(s)` : `Express ${expressDays} Day Delivery`}</span>
                    <span className="express-addon-price">+XAF {tierPriceFormat(expressAddonPrice)}</span>
                  </div>
                </label>
              )}

              {/* Order Button -> Opens Send Proposal Form Modal */}
              <button className="btn-order-project-tier" onClick={handleOpenOrderModal}>
                {isFr ? 'Commander maintenant' : 'Order Now'} (XAF {tierPriceFormat(finalPrice)})
              </button>
            </div>
          </div>
        </div>

        {/* Seller Rating Breakdown Section */}
        <div className="seller-breakdown-section">
          <h3 className="section-title-clean">{isFr ? 'Évaluation du vendeur' : 'Seller Rating Breakdown'}</h3>
          <div className="rating-overview-row">
            <div className="stars-flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Icon key={s} name="star" />
              ))}
            </div>
            <span className="rating-score-large">{Number(provider.rating || 4.8).toFixed(1)}</span>
          </div>
          <div className="breakdown-grid">
            <div className="breakdown-item-row">
              <span className="breakdown-item-label">{isFr ? 'Niveau de communication du vendeur' : 'Seller communication level'}</span>
              <span className="breakdown-item-score"><Icon name="star" /> {Math.min(5.0, Number(((provider.rating || 4.8) * 1.01).toFixed(1))).toFixed(1)}</span>
            </div>
            <div className="breakdown-item-row">
              <span className="breakdown-item-label">{isFr ? 'Qualité de livraison' : 'Quality of delivery'}</span>
              <span className="breakdown-item-score"><Icon name="star" /> {Number((provider.rating || 4.8).toFixed(1)).toFixed(1)}</span>
            </div>
            <div className="breakdown-item-row">
              <span className="breakdown-item-label">{isFr ? 'Rapport qualité-prix de la livraison' : 'Value of delivery'}</span>
              <span className="breakdown-item-score"><Icon name="star" /> {Math.max(1.0, Number(((provider.rating || 4.8) * 0.96).toFixed(1))).toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Client Reviews Section */}
        <div className="client-reviews-section">
          <div className="reviews-header-flex">
            <h3 className="section-title-clean">
              {provider.reviewCount || (provider.reviews?.length || 0)} {isFr ? 'Avis clients' : 'Client Reviews'}
            </h3>
          </div>
          {Array.isArray(provider.reviews) && provider.reviews.length > 0 ? (
            <div className="reviews-horizontal-list">
              {provider.reviews.map((rev: any, rIdx: number) => (
                <div key={rev.id || rIdx} className="review-card-item">
                  <div className="reviewer-info-row">
                    <img
                      src={getMediaUrl(rev.reviewer?.avatar || rev.job?.client?.avatar)}
                      alt="Reviewer"
                      className="reviewer-avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Client&background=14B8A6&color=fff';
                      }}
                    />
                    <div className="reviewer-text">
                      <h5>{rev.reviewer?.fullName || 'Client'}</h5>
                      <div className="review-stars-row">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Icon key={s} name="star" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="review-comment-text">{rev.comment || (isFr ? 'Mission réalisée avec un excellent retour.' : 'Great work delivered on time!')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews-text">{isFr ? 'Aucun avis pour ce professionnel pour le moment.' : 'No reviews for this professional yet.'}</p>
          )}
        </div>
      </div>
    </div>

      {/* SEND PROPOSAL / PROJECT ORDER MODAL */}
      {isOrderModalOpen && (
        <div className="proposal-modal-overlay animate-fade-in" onClick={() => setIsOrderModalOpen(false)}>
          <div className="proposal-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="proposal-modal-header">
              <h3>{isFr ? 'Envoyer une proposition / Commande' : 'Send Proposal / Order'}</h3>
              <button className="modal-close-btn" onClick={() => setIsOrderModalOpen(false)}>&times;</button>
            </div>

            <div className="proposal-project-banner">
              <h4>{project.title || 'Custom Service'}</h4>
              <p>{isFr ? 'Prestataire :' : 'Provider:'} <strong>{provider.name || 'Provider'}</strong></p>
            </div>

            {/* Proposal Intent Radio Group */}
            <div className="proposal-field-group">
              <label className="field-label-bold">{isFr ? 'Sélectionner le type de proposition' : 'Select Proposal Type'}</label>
              
              <label className={`proposal-radio-box ${proposalType === 'EXACT' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="proposalType"
                  checked={proposalType === 'EXACT'}
                  onChange={() => setProposalType('EXACT')}
                />
                <div className="radio-text-wrap">
                  <strong>{isFr ? 'Acheter / Demander ce projet exact' : 'Buy / Request this exact project'}</strong>
                  <span>{isFr ? 'Poursuivre avec les fonctionnalités et livrables décrits dans ce projet' : 'Proceed with the features and deliverables described in this project'}</span>
                </div>
              </label>

              <label className={`proposal-radio-box ${proposalType === 'SIMILAR' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="proposalType"
                  checked={proposalType === 'SIMILAR'}
                  onChange={() => setProposalType('SIMILAR')}
                />
                <div className="radio-text-wrap">
                  <strong>{isFr ? 'Demander un service personnalisé similaire à ce projet' : 'Request a custom service similar to this project'}</strong>
                  <span>{isFr ? 'Demander au prestataire d\'adapter le travail à vos besoins spécifiques' : 'Ask provider to adapt or customize work for your specific needs'}</span>
                </div>
              </label>
            </div>

            {/* Requirements Description */}
            <div className="proposal-field-group">
              <label className="field-label-bold">{isFr ? 'Description de la proposition / Exigences *' : 'Proposal Description / Requirements *'}</label>
              <textarea
                className="proposal-textarea"
                rows={4}
                placeholder={isFr ? 'Décrivez les exigences de votre projet, la portée et vos instructions spécifiques...' : 'Describe your project requirements, scope, and specific instructions...'}
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
              />
            </div>

            {/* Price & Days Grid */}
            <div className="proposal-two-cols">
              <div className="proposal-field-group">
                <label className="field-label-bold">{isFr ? 'Budget proposé (XAF)' : 'Offered Budget (XAF)'}</label>
                <input
                  type="number"
                  className="proposal-input"
                  value={offeredBudget}
                  onChange={(e) => setOfferedBudget(e.target.value)}
                />
              </div>

              <div className="proposal-field-group">
                <label className="field-label-bold">{isFr ? 'Jours estimés' : 'Expected Days'}</label>
                <input
                  type="number"
                  className="proposal-input"
                  value={expectedDays}
                  onChange={(e) => setExpectedDays(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Proposal CTA Button */}
            <button
              className="btn-submit-proposal-modal"
              onClick={handleSubmitProposal}
              disabled={isSubmittingProposal}
            >
              {isSubmittingProposal
                ? (isFr ? 'Envoi en cours...' : 'Submitting...')
                : (isFr ? 'Soumettre la proposition' : 'Submit Proposal')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility to format price nicely
function tierPriceFormat(price: number) {
  return Number(price || 0).toLocaleString();
}
