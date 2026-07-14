import './FindServices.css';
import { useState } from 'react';
import { Icon, IconName, images } from '../../App';

interface FindServicesProps {
  setSelectedProvider: (pro: any) => void;
  setActiveTab: (tab: string) => void;
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  setActiveChatUser: (user: string) => void;
}

export default function FindServices({
  setSelectedProvider,
  setActiveTab,
  clientBookings,
  setClientBookings,
  setActiveChatUser
}: FindServicesProps) {
  // Find Services interactive states (relocated locally)
  const [findServicesSearch, setFindServicesSearch] = useState('');
  const [findServicesLoc, setFindServicesLoc] = useState('Douala, Cameroon');
  const [findServicesRating, setFindServicesRating] = useState('All');
  const [findServicesCat, setFindServicesCat] = useState('All Categories');
  const [findServicesPrice, setFindServicesPrice] = useState(5);
  const [availNow, setAvailNow] = useState(false);
  const [availToday, setAvailToday] = useState(false);
  const [serviceTypeInPerson, setServiceTypeInPerson] = useState(true);
  const [serviceTypeRemote, setServiceTypeRemote] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'loc' | 'cat' | 'price' | 'rating' | 'avail' | 'type' | null>(null);

  // Mock providers list matching original inline code
  const providersList = [
    {
      name: 'CleanMaster',
      role: 'Cleaning Service',
      rating: '4.8',
      reviews: 124,
      location: 'Douala, Cameroon',
      badge: 'Top Rated',
      desc: 'Professional cleaning services for homes, offices and commercial spaces.',
      tags: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning'],
      price: '1 coin',
      image: images.proMary,
      verified: true
    },
    {
      name: 'ElectroFix',
      role: 'Electrical Service',
      rating: '4.9',
      reviews: 98,
      location: 'Douala, Cameroon',
      badge: 'Top Rated',
      desc: 'All electrical installation, repair and maintenance services.',
      tags: ['Installation', 'Wiring', 'Repair'],
      price: '1 coin',
      image: images.proSamuel,
      verified: true
    },
    {
      name: 'Plumber Pro',
      role: 'Plumbing Service',
      rating: '4.7',
      reviews: 86,
      location: 'Douala, Cameroon',
      badge: 'Popular',
      desc: 'Expert plumbing services for residential and commercial needs.',
      tags: ['Pipe Repair', 'Installation', 'Leak Fix'],
      price: '1 coin',
      image: images.proJeff,
      verified: true
    },
    {
      name: 'PaintPro',
      role: 'Painting Service',
      rating: '4.6',
      reviews: 72,
      location: 'Douala, Cameroon',
      badge: 'Rising Star',
      desc: 'Professional painting services with quality finishing.',
      tags: ['Interior Painting', 'Exterior Painting', 'Wall Painting'],
      price: '1 coin',
      image: images.proPeter,
      verified: true
    }
  ];

  // Filter logic simulation
  const filteredProviders = providersList.filter(p => {
    if (findServicesSearch && !p.name.toLowerCase().includes(findServicesSearch.toLowerCase()) && !p.role.toLowerCase().includes(findServicesSearch.toLowerCase())) {
      return false;
    }
    if (findServicesCat !== 'All Categories' && p.role.toLowerCase() !== findServicesCat.toLowerCase()) {
      return false;
    }
    if (findServicesRating === '4.5 & up' && Number(p.rating) < 4.5) return false;
    if (findServicesRating === '4.0 & up' && Number(p.rating) < 4.0) return false;
    
    return true;
  });

  return (
    <div className="find-services-page animate-fade-in">
      <div className="find-services-header">
        <h2>Find Services</h2>
        <p>Find verified professionals for any service you need.</p>
      </div>

      <div className="search-bar-row-fs">
        <div className="input-wrapper-fs query-input">
          <Icon name="search" />
          <input 
            type="text" 
            placeholder="What service do you need?" 
            value={findServicesSearch}
            onChange={(e) => setFindServicesSearch(e.target.value)}
          />
        </div>
        <div className="input-wrapper-fs location-input">
          <Icon name="location" />
          <input 
            type="text" 
            placeholder="Location" 
            value={findServicesLoc}
            onChange={(e) => setFindServicesLoc(e.target.value)}
          />
        </div>
        <button className="btn-search-fs" onClick={() => alert('Search initiated!')}>Search</button>
      </div>

      <div className="popular-searches-row-fs">
        <span>Popular Searches:</span>
        {['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'AC Repair', 'Carpentry'].map(keyword => (
          <button 
            type="button" 
            key={keyword}
            onClick={() => setFindServicesSearch(keyword)}
            className="popular-search-tag-fs"
          >
            {keyword}
          </button>
        ))}
      </div>

      <div className="categories-scroll-row-fs">
        <div className="categories-scroll-wrapper-fs">
          {[
            { name: 'Cleaning', icon: 'cleaning' as IconName },
            { name: 'Plumbing', icon: 'plumbing' as IconName },
            { name: 'Electrical', icon: 'electrical' as IconName },
            { name: 'Painting', icon: 'painting' as IconName },
            { name: 'Carpentry', icon: 'wrench' as IconName },
            { name: 'AC Repair', icon: 'appliance' as IconName },
            { name: 'Pest Control', icon: 'shield' as IconName }
          ].map((c) => (
            <button 
              type="button" 
              key={c.name}
              onClick={() => setFindServicesCat(c.name + ' Service')}
              className={`category-scroll-item-fs ${findServicesCat === c.name + ' Service' ? 'active' : ''}`}
            >
              <div className="cat-icon-fs"><Icon name={c.icon} /></div>
              <div className="cat-details-fs">
                <strong>{c.name}</strong>
              </div>
            </button>
          ))}
          <button type="button" className="category-scroll-item-fs more-btn" onClick={() => setFindServicesCat('All Categories')}>
            <div className="cat-icon-fs"><Icon name="menu" /></div>
            <div className="cat-details-fs">
              <strong>More</strong>
            </div>
          </button>
        </div>
      </div>

      {/* Box-less Horizontal Filter Row */}
      <div className="fs-horizontal-filters-bar">
        {/* Location Dropdown */}
        <div className="fs-filter-dropdown-container">
          <button 
            type="button"
            className={`fs-filter-pill-btn ${activeDropdown === 'loc' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'loc' ? null : 'loc')}
          >
            📍 Location: {findServicesLoc.split(',')[0]} ▾
          </button>
          {activeDropdown === 'loc' && (
            <div className="fs-dropdown-menu-card animate-fade-in">
              <h4>Select Location</h4>
              <select value={findServicesLoc} onChange={(e) => { setFindServicesLoc(e.target.value); setActiveDropdown(null); }}>
                <option value="Douala, Cameroon">Douala, Cameroon</option>
                <option value="Yaoundé, Cameroon">Yaoundé, Cameroon</option>
              </select>
              <button type="button" className="btn-apply-dropdown" onClick={() => setActiveDropdown(null)}>Apply</button>
            </div>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="fs-filter-dropdown-container">
          <button 
            type="button"
            className={`fs-filter-pill-btn ${activeDropdown === 'cat' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'cat' ? null : 'cat')}
          >
            📂 Category: {findServicesCat} ▾
          </button>
          {activeDropdown === 'cat' && (
            <div className="fs-dropdown-menu-card animate-fade-in">
              <h4>Select Category</h4>
              <select value={findServicesCat} onChange={(e) => { setFindServicesCat(e.target.value); setActiveDropdown(null); }}>
                <option value="All Categories">All Categories</option>
                <option value="Cleaning Service">Cleaning Service</option>
                <option value="Plumbing Service">Plumbing Service</option>
                <option value="Electrical Service">Electrical Service</option>
                <option value="Painting Service">Painting Service</option>
                <option value="Carpentry Service">Carpentry Service</option>
              </select>
              <button type="button" className="btn-apply-dropdown" onClick={() => setActiveDropdown(null)}>Apply</button>
            </div>
          )}
        </div>

        {/* Price Dropdown */}
        <div className="fs-filter-dropdown-container">
          <button 
            type="button"
            className={`fs-filter-pill-btn ${activeDropdown === 'price' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
          >
            💵 Max Price: {findServicesPrice === 5 ? '5+ coins' : `${findServicesPrice} coins`} ▾
          </button>
          {activeDropdown === 'price' && (
            <div className="fs-dropdown-menu-card animate-fade-in">
              <h4>Price (per hour)</h4>
              <input 
                type="range" 
                min="0" 
                max="5" 
                value={findServicesPrice}
                onChange={(e) => setFindServicesPrice(Number(e.target.value))}
                className="price-slider-range"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)', margin: '0.5rem 0' }}>
                <span>0 coin</span>
                <span>{findServicesPrice === 5 ? '5+ coins' : `${findServicesPrice} coins`}</span>
              </div>
              <button type="button" className="btn-apply-dropdown" onClick={() => setActiveDropdown(null)}>Apply</button>
            </div>
          )}
        </div>

        {/* Rating Dropdown */}
        <div className="fs-filter-dropdown-container">
          <button 
            type="button"
            className={`fs-filter-pill-btn ${activeDropdown === 'rating' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'rating' ? null : 'rating')}
          >
            ⭐ Rating: {findServicesRating} ▾
          </button>
          {activeDropdown === 'rating' && (
            <div className="fs-dropdown-menu-card animate-fade-in" style={{ minWidth: '180px' }}>
              <h4>Provider Rating</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0.5rem 0' }}>
                {['All', '4.0 & up', '4.5 & up'].map((r) => (
                  <button 
                    key={r}
                    type="button" 
                    className={`rating-pill-btn ${findServicesRating === r ? 'active' : ''}`}
                    onClick={() => { setFindServicesRating(r); setActiveDropdown(null); }}
                    style={{ 
                      padding: '0.45rem', 
                      border: '1px solid var(--line)', 
                      background: findServicesRating === r ? 'var(--teal-light)' : 'var(--soft)', 
                      color: findServicesRating === r ? 'var(--teal)' : 'var(--ink)', 
                      borderRadius: '6px', 
                      fontWeight: 700, 
                      cursor: 'pointer' 
                    }}
                  >
                    {r === 'All' ? 'All Ratings' : r === '4.0 & up' ? '4★ & up' : '4.5★ & up'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Availability Dropdown */}
        <div className="fs-filter-dropdown-container">
          <button 
            type="button"
            className={`fs-filter-pill-btn ${activeDropdown === 'avail' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'avail' ? null : 'avail')}
          >
            📅 Availability ▾
          </button>
          {activeDropdown === 'avail' && (
            <div className="fs-dropdown-menu-card animate-fade-in">
              <h4>Availability</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)', margin: '0.5rem 0', cursor: 'pointer' }}>
                <input type="checkbox" checked={availNow} onChange={(e) => setAvailNow(e.target.checked)} />
                <span>Available Now</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)', margin: '0.5rem 0', cursor: 'pointer' }}>
                <input type="checkbox" checked={availToday} onChange={(e) => setAvailToday(e.target.checked)} />
                <span>Available Today</span>
              </label>
              <button type="button" className="btn-apply-dropdown" onClick={() => setActiveDropdown(null)}>Apply</button>
            </div>
          )}
        </div>

        {/* Service Type Dropdown */}
        <div className="fs-filter-dropdown-container">
          <button 
            type="button"
            className={`fs-filter-pill-btn ${activeDropdown === 'type' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
          >
            📍 Service Type ▾
          </button>
          {activeDropdown === 'type' && (
            <div className="fs-dropdown-menu-card animate-fade-in">
              <h4>Service Type</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)', margin: '0.5rem 0', cursor: 'pointer' }}>
                <input type="checkbox" checked={serviceTypeInPerson} onChange={(e) => setServiceTypeInPerson(e.target.checked)} />
                <span>In Person</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--ink)', margin: '0.5rem 0', cursor: 'pointer' }}>
                <input type="checkbox" checked={serviceTypeRemote} onChange={(e) => setServiceTypeRemote(e.target.checked)} />
                <span>Remote</span>
              </label>
              <button type="button" className="btn-apply-dropdown" onClick={() => setActiveDropdown(null)}>Apply</button>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {(findServicesSearch || findServicesCat !== 'All Categories' || findServicesRating !== 'All' || findServicesPrice !== 5 || availNow || availToday || !serviceTypeInPerson || serviceTypeRemote) && (
          <button 
            type="button"
            className="fs-clear-filters-btn-inline"
            onClick={() => {
              setFindServicesSearch('');
              setFindServicesCat('All Categories');
              setFindServicesRating('All');
              setFindServicesPrice(5);
              setAvailNow(false);
              setAvailToday(false);
              setServiceTypeInPerson(true);
              setServiceTypeRemote(false);
              setActiveDropdown(null);
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="fs-directory-layout" style={{ display: 'block', width: '100%' }}>
        <div className="fs-directory-main" style={{ width: '100%', maxWidth: '100%' }}>
          <div className="fs-results-header">
            <span>Showing {filteredProviders.length} providers</span>
            <div className="fs-sort-dropdown">
              <span>Sort by: </span>
              <select>
                <option>Recommended</option>
                <option>Rating: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          <div className="fs-providers-list">
            {filteredProviders.map((p, idx) => (
              <div className="fs-provider-card" key={idx}>
                <img src={p.image} alt={p.name} className="prov-avatar" />
                
                <div className="prov-card-middle">
                  <div className="prov-header-row">
                    <h3>{p.name}</h3>
                    {p.verified && <span className="verified-check-fs"><Icon name="shield" /></span>}
                    {p.badge && <span className={`badge-prov ${p.badge.toLowerCase().replace(' ', '-')}`}>{p.badge}</span>}
                  </div>
                  <p className="prov-role-desc">{p.role}</p>
                  
                  <div className="prov-rating-row">
                    <Icon name="star" />
                    <strong>{p.rating}</strong>
                    <span>({p.reviews} reviews)</span>
                    <span className="dot-sep">•</span>
                    <span className="loc-text"><Icon name="location" /> {p.location}</span>
                  </div>
                  
                  <p className="prov-summary-desc">{p.desc}</p>
                  
                  <div className="prov-tags-row">
                    {p.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="prov-tag-badge">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="prov-card-right">
                  <div className="prov-price-box">
                    <span>From</span>
                    <strong>{p.price} <small>/ hour</small></strong>
                  </div>
                  <button className="btn-view-prov" style={{ marginBottom: '0.4rem' }} onClick={() => {
                    setSelectedProvider(p);
                  }}>View Profile</button>
                  <button className="btn-view-prov" style={{ background: 'var(--soft)', color: 'var(--teal)', border: '1px solid var(--teal)' }} onClick={() => {
                    setActiveTab('Messages');
                    setActiveChatUser(p.name);
                  }}>Chat</button>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Card Banner at the bottom */}
          <div className="dash-panel-premium promo-card-fs" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', marginTop: '2.5rem', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <div className="promo-text-fs" style={{ flex: 1, maxWidth: '80%' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>Get the best experience</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--muted)' }}>Book your favorite providers faster and manage all your bookings in one place.</p>
            </div>
            <button type="button" className="btn-promo-action-fs" onClick={() => setActiveTab('Dashboard')} style={{ flexShrink: 0, minWidth: '140px' }}>Book a Service</button>
          </div>

          <div className="fs-pagination-row">
            <button className="page-arrow" disabled>&lt;</button>
            <button className="page-num active">1</button>
            <button className="page-num" onClick={() => alert('Go to page 2')}>2</button>
            <button className="page-num" onClick={() => alert('Go to page 3')}>3</button>
            <button className="page-num" onClick={() => alert('Go to page 4')}>4</button>
            <button className="page-num" onClick={() => alert('Go to page 5')}>5</button>
            <span className="page-dots">...</span>
            <button className="page-num" onClick={() => alert('Go to last page')}>27</button>
            <button className="page-arrow" onClick={() => alert('Next page')}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
