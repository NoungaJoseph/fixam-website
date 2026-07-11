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

      <div className="fs-directory-layout">
        <div className="fs-directory-left">
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

        <div className="fs-directory-right">
          <div className="dash-panel-premium filters-sidebar-panel">
            <div className="filters-header-row">
              <h3>Filters</h3>
              <button className="btn-clear-filters" onClick={() => {
                setFindServicesSearch('');
                setFindServicesCat('All Categories');
                setFindServicesRating('All');
                setFindServicesPrice(5);
                setAvailNow(false);
                setAvailToday(false);
                setServiceTypeInPerson(true);
                setServiceTypeRemote(false);
              }}>Clear all</button>
            </div>

            <div className="filter-group">
              <label className="filter-lbl-name">Location</label>
              <select className="filter-select-input" value={findServicesLoc} onChange={(e) => setFindServicesLoc(e.target.value)}>
                <option value="Douala, Cameroon">Douala, Cameroon</option>
                <option value="Yaoundé, Cameroon">Yaoundé, Cameroon</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-lbl-name">Category</label>
              <select className="filter-select-input" value={findServicesCat} onChange={(e) => setFindServicesCat(e.target.value)}>
                <option value="All Categories">All Categories</option>
                <option value="Cleaning Service">Cleaning Service</option>
                <option value="Plumbing Service">Plumbing Service</option>
                <option value="Electrical Service">Electrical Service</option>
                <option value="Painting Service">Painting Service</option>
                <option value="Carpentry Service">Carpentry Service</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-lbl-name">Price (per hour)</label>
              <div className="price-slider-box">
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  value={findServicesPrice}
                  onChange={(e) => setFindServicesPrice(Number(e.target.value))}
                  className="price-slider-range"
                />
                <div className="price-slider-labels">
                  <span>0 coin</span>
                  <span>{findServicesPrice === 5 ? '5+ coins' : `${findServicesPrice} coins`}</span>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-lbl-name">Provider Rating</label>
              <div className="filter-rating-options">
                <button 
                  type="button" 
                  className={`rating-pill-btn ${findServicesRating === 'All' ? 'active' : ''}`}
                  onClick={() => setFindServicesRating('All')}
                >
                  All
                </button>
                <button 
                  type="button" 
                  className={`rating-pill-btn ${findServicesRating === '4.0 & up' ? 'active' : ''}`}
                  onClick={() => setFindServicesRating('4.0 & up')}
                >
                  4★ & up
                </button>
                <button 
                  type="button" 
                  className={`rating-pill-btn ${findServicesRating === '4.5 & up' ? 'active' : ''}`}
                  onClick={() => setFindServicesRating('4.5 & up')}
                >
                  4.5★ & up
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-lbl-name">Availability</label>
              <label className="checkbox-filter-row">
                <input type="checkbox" checked={availNow} onChange={(e) => setAvailNow(e.target.checked)} />
                <span>Available Now</span>
              </label>
              <label className="checkbox-filter-row">
                <input type="checkbox" checked={availToday} onChange={(e) => setAvailToday(e.target.checked)} />
                <span>Available Today</span>
              </label>
            </div>

            <div className="filter-group">
              <label className="filter-lbl-name">Service Type</label>
              <label className="checkbox-filter-row">
                <input type="checkbox" checked={serviceTypeInPerson} onChange={(e) => setServiceTypeInPerson(e.target.checked)} />
                <span>In Person</span>
              </label>
              <label className="checkbox-filter-row">
                <input type="checkbox" checked={serviceTypeRemote} onChange={(e) => setServiceTypeRemote(e.target.checked)} />
                <span>Remote</span>
              </label>
            </div>

            <button type="button" className="btn-apply-filters-fs" onClick={() => alert('Filters applied!')}>
              Apply Filters
            </button>
          </div>

          <div className="dash-panel-premium promo-card-fs">
            <div className="promo-text-fs">
              <h4>Get the best experience</h4>
              <p>Book your favorite providers faster and manage all your bookings in one place.</p>
            </div>
            <button type="button" className="btn-promo-action-fs" onClick={() => setActiveTab('Dashboard')}>Book a Service</button>
            <div className="promo-clipboard-svg">📋</div>
          </div>
        </div>
      </div>
    </div>
  );
}
