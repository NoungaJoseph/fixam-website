import './ProviderProfileDetail.css';
import { Icon, images } from '../../App';
import React, { useState } from 'react';
import BookingFormModal from '../../components/BookingFormModal';

interface ProviderProfileDetailProps {
  selectedProvider: any;
  setSelectedProvider: (pro: any) => void;
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function ProviderProfileDetail({
  selectedProvider,
  setSelectedProvider,
  clientBookings,
  setClientBookings,
  setActiveTab,
  setActiveChatUser
}: ProviderProfileDetailProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  if (!selectedProvider) return null;

  const providerDetails: Record<string, {
    bio: string;
    trustScore: number;
    completedJobs: number;
    experience: string;
    responseTime: string;
    skills: string[];
    certifications: string[];
    reviews: Array<{ author: string; rating: number; text: string; date: string }>;
  }> = {
    'Jeff Thomson': {
      bio: 'Jeff is a licensed plumbing specialist with over 8 years of experience. He specializes in residential plumbing networks, leak detection, emergency repairs, and pipe installations. Certified by the Cameroon Plumbers Guild.',
      trustScore: 98,
      completedJobs: 142,
      experience: '8 years',
      responseTime: '< 15 mins',
      skills: ['Leak Detection', 'Pipe Repair', 'Drain Cleaning', 'Sewer Lines', 'Emergency Plumbing'],
      certifications: ['National Plumbing License #A-892', 'Fixam Identity & Skill Verified', 'Emergency Response Certified'],
      reviews: [
        { author: 'Marie-Louise N.', rating: 5, text: 'Jeff was incredibly fast. He arrived within 20 minutes of my request and fixed the main pipe block in no time.', date: '3 days ago' },
        { author: 'Amadou B.', rating: 5, text: 'Very professional, clean work, and reasonable coins rate. Highly recommend Jeff for plumbing issues.', date: '1 week ago' }
      ]
    },
    'Samuel Bright': {
      bio: 'Samuel is a veteran certified electrician dealing with high/low voltage systems, domestic wiring, appliance diagnostic repairs, and breaker box upgrades. Fast, reliable, and background-checked.',
      trustScore: 97,
      completedJobs: 189,
      experience: '6 years',
      responseTime: '< 20 mins',
      skills: ['Breaker Box Upgrades', 'Short Circuit Diagnostic', 'Domestic Wiring', 'Smart Home Setup', 'Generator Repair'],
      certifications: ['Safety Code Compliance Cert.', 'Fixam Background Checked', 'Advanced Electrical Systems Diploma'],
      reviews: [
        { author: 'Pauline K.', rating: 5, text: 'Samuel found the short circuit in my bedroom wiring within 10 minutes. Absolute expert.', date: '2 days ago' },
        { author: 'Steve E.', rating: 4, text: 'Excellent electrician, very thorough with safety checks. Will book again.', date: '3 weeks ago' }
      ]
    },
    'Mary Clean': {
      bio: 'Mary runs a top-rated premium cleaning team. Specializes in office sanitization, post-construction cleanups, residential deep cleaning, and window washing. Dedicated to spotless results.',
      trustScore: 99,
      completedJobs: 215,
      experience: '5 years',
      responseTime: '< 10 mins',
      skills: ['Deep Cleaning', 'Eco-friendly Products', 'Office Sanitization', 'Post-construction Cleaning', 'Laundry Service'],
      certifications: ['Professional Cleaning Association Cert.', 'Fixam Identity Verified', 'Sanitization Protocol Certified'],
      reviews: [
        { author: 'Daphne M.', rating: 5, text: 'The deep cleaning Mary and her team did was immaculate. My house smells amazing and is spotless.', date: '5 days ago' },
        { author: 'Joseph N.', rating: 5, text: 'Incredible speed and attention to detail. Mary is a star.', date: '2 weeks ago' }
      ]
    },
    'Peter Wood': {
      bio: 'Peter is a master carpenter and furniture restorer. From custom kitchen cabinets and custom tables to roof framing structural support, Peter brings craftsmanship to your door.',
      trustScore: 95,
      completedJobs: 98,
      experience: '12 years',
      responseTime: '< 30 mins',
      skills: ['Custom Cabinets', 'Furniture Restoration', 'Deck Building', 'Roof Framing', 'Door Fitting'],
      certifications: ['Master Craftsman Certification', 'Fixam Background Checked', 'Woodworking Safety License'],
      reviews: [
        { author: 'Christian T.', rating: 5, text: 'Peter repaired my vintage oak table. The craftsmanship is flawless. Highly skilled!', date: '4 days ago' },
        { author: 'Grace L.', rating: 5, text: 'Quick and clean door installation. Fair pricing and friendly service.', date: '1 month ago' }
      ]
    }
  };

  const details = providerDetails[selectedProvider.name] || {
    bio: `${selectedProvider.name} is a verified professional offering high-quality ${selectedProvider.role} services near you. Background-checked and trusted by the Fixam community.`,
    trustScore: 96,
    completedJobs: 45,
    experience: '4 years',
    responseTime: '< 25 mins',
    skills: [selectedProvider.role, 'Emergency Service', 'General Repairs'],
    certifications: ['Fixam Verified Identity', 'Fixam Skills Check Passed'],
    reviews: [
      { author: 'Anonymous Client', rating: 5, text: 'Great service, punctual and highly professional.', date: '2 weeks ago' }
    ]
  };

  return (
    <div className="provider-profile-detail-page animate-fade-in">
      {/* Back button */}
      <button className="btn-profile-back" onClick={() => setSelectedProvider(null)}>
        <span>&larr;</span> Back to Dashboard
      </button>

      {/* Profile Header Block */}
      <div className="profile-banner-card">
        <div className="profile-banner-bg"></div>
        <div className="profile-header-main">
          <img src={selectedProvider.image} alt={selectedProvider.name} className="profile-avatar-lg" />
          <div className="profile-header-info">
            <div className="profile-name-row">
              <h1>{selectedProvider.name}</h1>
              <span className="badge-verified-pro">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1rem', height: '1rem', marginRight: '0.2rem' }}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                Verified Pro
              </span>
            </div>
            <p className="profile-role-sub">{selectedProvider.role}</p>
            <div className="profile-meta-row">
              <span className="meta-item"><Icon name="location" /> Yaoundé</span>
              <span className="meta-item rating"><Icon name="star" /> {selectedProvider.rating} ({details.completedJobs} jobs)</span>
              <span className="meta-item trust-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '0.9rem', height: '0.9rem', marginRight: '0.25rem', color: '#10B981' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Trust Score: <strong>{details.trustScore}%</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Profile details */}
      <div className="profile-details-grid">
        {/* Left Content column */}
        <div className="profile-details-left">
          {/* Stats Widgets */}
          <div className="profile-stats-strip-new">
            <div className="pro-stat-card">
              <span>Completed Jobs</span>
              <strong>{details.completedJobs}</strong>
            </div>
            <div className="pro-stat-card">
              <span>Experience</span>
              <strong>{details.experience}</strong>
            </div>
            <div className="pro-stat-card">
              <span>Response Time</span>
              <strong>{details.responseTime}</strong>
            </div>
          </div>

          {/* Bio section */}
          <div className="profile-section-card">
            <h3>About Me</h3>
            <p className="profile-bio-text">{details.bio}</p>
          </div>

          {/* Skills section */}
          <div className="profile-section-card">
            <h3>Specialties & Skills</h3>
            <div className="profile-skills-list">
              {details.skills.map((s, idx) => (
                <span key={idx} className="profile-skill-badge">{s}</span>
              ))}
            </div>
          </div>

          {/* Certifications section */}
          <div className="profile-section-card">
            <h3>Certifications & Safety Checks</h3>
            <ul className="profile-cert-list">
              {details.certifications.map((c, idx) => (
                <li key={idx}>
                  <span className="cert-check-icon"><Icon name="check" /></span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews section */}
          <div className="profile-section-card">
            <h3>Client Reviews ({details.reviews.length})</h3>
            <div className="profile-reviews-list">
              {details.reviews.map((r, idx) => (
                <div key={idx} className="pro-review-item">
                  <div className="review-header">
                    <strong>{r.author}</strong>
                    <div className="review-stars-row">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Icon key={i} name="star" />
                      ))}
                      <span className="review-date">{r.date}</span>
                    </div>
                  </div>
                  <p className="review-text">"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action column */}
        <div className="profile-details-right">
          <div className="pro-booking-box">
            <div className="booking-status-badge-inline">
              <span className="status-dot-green"></span> Available Now
            </div>
            
            <div className="booking-price-row">
              <div className="price-info">
                <span className="price-lbl-sub">Standard Booking Fee</span>
                <h2>1 Coin</h2>
              </div>
              <div className="booking-coin-icon-circle"><Icon name="wallet" /></div>
            </div>

            <p className="booking-guarantee-text">
              🛡️ <strong>Fixam Guarantee:</strong> Contact verified professionals securely. Rest easy with our quality assurance.
            </p>

            <button className="btn-book-now-pro" onClick={() => setIsBookingModalOpen(true)}>
              Book Now
            </button>

            <button className="btn-message-pro-outline" onClick={() => {
              setActiveTab('Messages');
              setActiveChatUser(selectedProvider.name);
              setSelectedProvider(null);
            }}>
              Send Message
            </button>
          </div>
        </div>
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
