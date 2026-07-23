import './ProviderProfileDetail.css';
import { Icon } from '../../App';
import React, { useState, useEffect } from 'react';
import BookingFormModal from '../../components/BookingFormModal';
import { api } from '../../services/api';

interface ProviderProfileDetailProps {
  selectedProvider: any;
  setSelectedProvider: (pro: any) => void;
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
  clientBookings,
  setClientBookings,
  setActiveTab,
  setActiveChatUser,
  savedProsState = [],
  setSavedProsState
}: ProviderProfileDetailProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'Overview' | 'Reviews' | 'Projects' | 'Certificates'>('Overview');
  
  const original = selectedProvider?.originalData || {};
  const providerId = original._id || original.id;
  const initialSaved = savedProsState.some((p: any) => p._id === providerId || (p.provider && p.provider._id === providerId));
  const [isSaved, setIsSaved] = useState(initialSaved);

  if (!selectedProvider) return null;

  const portfolio = original.portfolio || [];
  const certificates = original.certificates || [];
  
  // Use real data, fallback to zero/empty
  const details = {
    bio: original.bio || 'This provider has not added a bio yet.',
    trustScore: original.trustScore || 0,
    completedJobs: original.completedJobs || 0,
    experience: original.experience || 'Not set',
    responseTime: original.responseTime || 'Not set',
    skills: original.skills?.length > 0 ? original.skills : [],
    certifications: certificates,
    reviews: original.reviews || []
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Fixam Provider: ${selectedProvider.name}`,
          text: `Check out ${selectedProvider.name}'s profile on Fixam!`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleSave = async () => {
    if (!providerId) return;
    try {
      if (isSaved) {
        await api.delete(`/providers/${providerId}/favorite`);
        setIsSaved(false);
        if (setSavedProsState) {
          setSavedProsState(savedProsState.filter((p: any) => p._id !== providerId && p.provider?._id !== providerId));
        }
      } else {
        await api.post(`/providers/${providerId}/favorite`);
        setIsSaved(true);
        if (setSavedProsState) {
          setSavedProsState([...savedProsState, original]);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update favorites. Please try again.');
    }
  };

  return (
    <div className="provider-profile-detail-page animate-fade-in">
      <button className="btn-profile-back" onClick={() => setSelectedProvider(null)}>
        <span>&larr;</span> Back to Dashboard
      </button>

      {/* Centered Profile Header Block */}
      <div className="profile-banner-card-centered">
        <div className="profile-banner-bg-centered"></div>
        <div className="profile-header-main-centered">
          {selectedProvider.image ? (
            <img 
              src={selectedProvider.image} 
              alt={selectedProvider.name} 
              className="profile-avatar-xl" 
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedProvider.name)}&background=14B8A6&color=fff&size=120&rounded=true`;
              }}
            />
          ) : (
            <div className="profile-avatar-xl fallback-avatar-centered flex items-center justify-center font-bold text-3xl bg-teal-500 text-white">
              {selectedProvider.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
          )}
          
          <div className="profile-header-info-centered">
            <h1 className="profile-name-centered">
              {selectedProvider.name}
              <span className="badge-verified-pro-centered">
                <Icon name="check" /> Verified Pro
              </span>
            </h1>
            <p className="profile-role-sub-centered">{selectedProvider.role}</p>
            
            <div className="profile-meta-row-centered">
              <span className="meta-item"><Icon name="location" /> {selectedProvider.distance || 'Not set'}</span>
              <span className="meta-item rating"><Icon name="star" /> {selectedProvider.rating} ({details.completedJobs} jobs)</span>
              <span className="meta-item trust-badge">
                Trust Score: <strong>{details.trustScore}%</strong>
              </span>
            </div>
            
            {/* Action Buttons Row */}
            <div className="profile-actions-row">
              <button className="btn-book-now-top" onClick={() => setIsBookingModalOpen(true)}>
                Book Now
              </button>
              <button className="btn-icon-action" onClick={handleShare} title="Share Profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </button>
              <button className={`btn-icon-action ${isSaved ? 'saved' : ''}`} onClick={handleSave} title={isSaved ? "Remove from Favorites" : "Save to Favorites"}>
                <svg viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" style={{ color: isSaved ? '#14B8A6' : 'currentColor' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs-nav">
        {['Overview', 'Reviews', 'Projects', 'Certificates'].map((tab) => (
          <button 
            key={tab} 
            className={`profile-tab-btn ${activeProfileTab === tab ? 'active' : ''}`}
            onClick={() => setActiveProfileTab(tab as any)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="profile-tab-content animate-fade-in">
        {activeProfileTab === 'Overview' && (
          <div className="profile-tab-overview">
            <div className="profile-stats-strip-centered">
              <div className="pro-stat-card-centered">
                <span>Completed Jobs</span>
                <strong>{details.completedJobs}</strong>
              </div>
              <div className="pro-stat-card-centered">
                <span>Experience</span>
                <strong>{details.experience}</strong>
              </div>
              <div className="pro-stat-card-centered">
                <span>Response Time</span>
                <strong>{details.responseTime}</strong>
              </div>
            </div>

            <div className="profile-section-card">
              <h3>About Me</h3>
              <p className="profile-bio-text">{details.bio}</p>
            </div>

            <div className="profile-section-card">
              <h3>Specialties & Skills</h3>
              {details.skills.length > 0 ? (
                <div className="profile-skills-list">
                  {details.skills.map((s: string, idx: number) => (
                    <span key={idx} className="profile-skill-badge">{s}</span>
                  ))}
                </div>
              ) : (
                <p className="empty-state-text">No skills listed yet.</p>
              )}
            </div>
          </div>
        )}

        {activeProfileTab === 'Reviews' && (
          <div className="profile-tab-reviews">
            <div className="profile-section-card">
              <h3>Client Reviews ({details.reviews.length})</h3>
              {details.reviews.length > 0 ? (
                <div className="profile-reviews-list">
                  {details.reviews.map((r: any, idx: number) => (
                    <div key={idx} className="pro-review-item">
                      <div className="review-header">
                        <strong>{r.client?.fullName || r.author || 'Client'}</strong>
                        <div className="review-stars-row">
                          {Array.from({ length: r.rating || 5 }).map((_, i) => (
                            <Icon key={i} name="star" />
                          ))}
                          <span className="review-date">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="review-text">"{r.comment || r.text || 'No comment provided.'}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state-text">No reviews yet.</p>
              )}
            </div>
          </div>
        )}

        {activeProfileTab === 'Projects' && (
          <div className="profile-tab-projects">
            <div className="profile-section-card">
              <h3>Past Projects & Portfolio</h3>
              {portfolio.length > 0 ? (
                <div className="portfolio-grid">
                  {portfolio.map((proj: any, idx: number) => (
                    <div key={idx} className="portfolio-item">
                      <img src={proj.image || 'https://via.placeholder.com/300x200'} alt={proj.title} />
                      <div className="portfolio-info">
                        <h4>{proj.title}</h4>
                        <p>{proj.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state-text">No projects available for this provider.</p>
              )}
            </div>
          </div>
        )}

        {activeProfileTab === 'Certificates' && (
          <div className="profile-tab-certificates">
            <div className="profile-section-card">
              <h3>Certifications & Safety Checks ({details.certifications.length})</h3>
              {details.certifications.length > 0 ? (
                <ul className="profile-cert-list">
                  {details.certifications.map((c: any, idx: number) => (
                    <li key={idx}>
                      <span className="cert-check-icon"><Icon name="check" /></span>
                      <span>{c.title || c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state-text">No certificates uploaded.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <BookingFormModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        providerName={selectedProvider.name}
        providerService={selectedProvider.role}
        providerImage={selectedProvider.image}
        onSubmit={(bookingData) => {
          const newBooking = {
            id: Date.now(),
            service: bookingData.service,
            provider: bookingData.provider,
            date: bookingData.date,
            time: bookingData.time,
            status: 'Confirmed',
            price: bookingData.price,
            image: bookingData.image
          };
          setClientBookings([newBooking, ...clientBookings]);
          alert(`Booking requested successfully for ${bookingData.date}! ${bookingData.provider} has been notified.`);
          setIsBookingModalOpen(false);
          setSelectedProvider(null);
          setActiveTab('My Bookings');
        }}
      />
    </div>
  );
}
