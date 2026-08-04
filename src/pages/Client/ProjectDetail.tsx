import { useState, useMemo } from 'react';
import { Icon, getMediaUrl } from '../../App';
import { useAuth } from '../../context/AuthContext';
import BookingFormModal from '../../components/BookingFormModal';
import './ProjectDetail.css';

interface ProjectDetailProps {
  selectedProject: any;
  setSelectedProject: (proj: any) => void;
  setSelectedProvider: (pro: any) => void;
  setActiveTab: (tab: string) => void;
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  displayedPros: any[];
}

export default function ProjectDetail({
  selectedProject,
  setSelectedProject,
  setSelectedProvider,
  setActiveTab,
  clientBookings,
  setClientBookings,
  displayedPros
}: ProjectDetailProps) {
  const { user } = useAuth();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [expressAddon, setExpressAddon] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const project = selectedProject;
  const provider = project.provider || {};

  // Media list (Videos + Images)
  const mediaList = useMemo(() => {
    const list: Array<{ type: 'image' | 'video'; url: string }> = [];
    
    // Add videos
    const videoList = Array.isArray(project.videos) && project.videos.length > 0
      ? project.videos
      : (project.video ? [project.video] : []);
    videoList.forEach((v: string) => {
      if (v) list.push({ type: 'video', url: v });
    });

    // Add images
    const images = (Array.isArray(project.images) && project.images.length > 0)
      ? project.images
      : (project.imageUrl ? [project.imageUrl] : []);
    images.forEach((img: string) => {
      if (img) list.push({ type: 'image', url: img });
    });

    if (list.length === 0) {
      list.push({ type: 'image', url: provider?.avatar || 'https://via.placeholder.com/600x320?text=Fixam+Project' });
    }
    return list;
  }, [project, provider]);

  // Resolve packages/tiers (similar to mobile app)
  const tiers = useMemo(() => {
    const baseRate = Number(project.price || provider.rate || 5000);
    if (project.packages) {
      const parsed: any[] = [];
      ['basic', 'standard', 'premium'].forEach((key) => {
        const pkg = project.packages[key];
        if (pkg && (pkg.enabled || pkg.price)) {
          parsed.push({
            id: key,
            name: key.toUpperCase(),
            label: pkg.summary || pkg.label || `${key.charAt(0).toUpperCase() + key.slice(1)} Package`,
            price: Number(pkg.price || 0),
            deliveryDays: Number(pkg.deliveryDays || 1),
            revisions: Number(pkg.revisions || 0),
            expressDeliveryEnabled: pkg.expressDeliveryEnabled !== undefined ? Boolean(pkg.expressDeliveryEnabled) : true,
            expressDeliveryDays: pkg.expressDeliveryDays ? Number(pkg.expressDeliveryDays) : 1,
            expressDeliveryPrice: pkg.expressDeliveryPrice ? Number(pkg.expressDeliveryPrice) : Math.round(Number(pkg.price || 0) * 0.3),
            features: Array.isArray(pkg.features) && pkg.features.length > 0
              ? pkg.features.filter((f: any) => f && f.trim())
              : []
          });
        }
      });
      if (parsed.length > 0) return parsed;
    }

    // Default Tiers fallback if not provided by backend
    return [
      {
        id: 'standard',
        name: 'STANDARD',
        label: 'Standard Package',
        price: baseRate,
        deliveryDays: 3,
        revisions: 2,
        expressDeliveryEnabled: true,
        expressDeliveryDays: 1,
        expressDeliveryPrice: Math.round(baseRate * 0.2),
        features: ['Professional Delivery', 'High Resolution', 'Source Files']
      }
    ];
  }, [project, provider]);

  const activeTier = tiers[selectedTierIndex] || tiers[0];
  const expressAddonPrice = Number(activeTier.expressDeliveryPrice || Math.round(activeTier.price * 0.2));
  const expressDays = Number(activeTier.expressDeliveryDays || 1);
  const finalPrice = activeTier.price + (expressAddon ? expressAddonPrice : 0);

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
      {/* Back Button */}
      <button className="btn-project-back" onClick={() => setSelectedProject(null)}>
        <span>&larr;</span> Back to Dashboard
      </button>

      <div className="project-detail-layout">
        {/* Left Side: Media Gallery & Content */}
        <div className="project-detail-left">
          {/* Media Showcase Carousel */}
          <div className="project-media-gallery">
            <div className="active-media-view">
              {mediaList[activeMediaIndex].type === 'video' ? (
                <video
                  src={getMediaUrl(mediaList[activeMediaIndex].url)}
                  controls
                  className="gallery-video"
                  autoPlay
                />
              ) : (
                <img
                  src={getMediaUrl(mediaList[activeMediaIndex].url)}
                  alt="Project media"
                  className="gallery-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x320?text=Fixam+Project';
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
                        <Icon name="briefcase" /> {/* Video icon replacement */}
                        <span className="play-indicator-text">Play</span>
                      </div>
                    ) : (
                      <img
                        src={getMediaUrl(media.url)}
                        alt={`Thumb ${idx}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x50?text=Image';
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Title and Header */}
          <div className="project-info-header">
            <h1 className="project-detail-title">{project.title || 'Untitled Project'}</h1>
            {project.category && (
              <span className="project-category-badge">{project.category}</span>
            )}
          </div>

          {/* Provider Card Row */}
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
                <span className="reviews-count">({provider.reviewCount || 0} reviews)</span>
              </div>
            </div>
            <button className="btn-view-profile-chevron" title="View Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {/* Project Description */}
          <div className="project-description-section">
            <h3>About This Project</h3>
            <p className="project-description-paragraph">
              {project.description || 'No description provided for this project.'}
            </p>
          </div>
        </div>

        {/* Right Side: Packages / Pricing & Booking Tiers */}
        <div className="project-detail-right">
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
                  {tier.name}
                </button>
              ))}
            </div>

            {/* Active Tier Details Body */}
            <div className="active-tier-body">
              <div className="tier-price-row">
                <span className="tier-price-label">Price</span>
                <span className="tier-price-value">XAF {tierPriceFormat(activeTier.price)}</span>
              </div>

              <h4 className="tier-summary-title">{activeTier.label}</h4>

              {/* Delivery info & revisions */}
              <div className="delivery-info-grid">
                <div className="info-cell">
                  <Icon name="calendar" />
                  <span>{activeTier.deliveryDays} Day{activeTier.deliveryDays > 1 ? 's' : ''} Delivery</span>
                </div>
                <div className="info-cell">
                  <Icon name="settings" />
                  <span>{activeTier.revisions || 'Unlimited'} Revision{activeTier.revisions !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Features List */}
              {activeTier.features.length > 0 && (
                <div className="tier-features-list">
                  <h5>What's Included:</h5>
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
                    <span className="express-addon-title">Express {expressDays} Day Delivery</span>
                    <span className="express-addon-price">+XAF {tierPriceFormat(expressAddonPrice)}</span>
                  </div>
                </label>
              )}

              {/* CTA Booking Button */}
              <button className="btn-order-project-tier" onClick={() => setIsBookingModalOpen(true)}>
                Order Now (XAF {tierPriceFormat(finalPrice)})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal Integration */}
      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        providerName={provider.name || 'Provider'}
        providerService={project.title || 'Project Deliverable'}
        providerImage={mediaList[0]?.type === 'image' ? getMediaUrl(mediaList[0]?.url) : undefined}
        basePrice={`XAF ${finalPrice.toLocaleString()}`}
        onSubmit={(bookingData) => {
          const newBooking = {
            id: Date.now(),
            service: bookingData.service,
            provider: bookingData.provider,
            date: bookingData.date,
            time: bookingData.time,
            status: 'Confirmed',
            price: finalPrice.toLocaleString(),
            image: bookingData.image
          };
          setClientBookings([newBooking, ...clientBookings]);
          alert(`Order placed successfully for ${bookingData.date}! ${provider.name} has been notified.`);
          setIsBookingModalOpen(false);
          setSelectedProject(null);
          setActiveTab('My Bookings');
        }}
      />
    </div>
  );
}

// Utility to format price nicely
function tierPriceFormat(price: number) {
  return Number(price).toLocaleString();
}
