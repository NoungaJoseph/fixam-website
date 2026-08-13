import './FindServices.css';
import { useState, useRef } from 'react';
import { Icon, IconName, images, getMediaUrl } from '../../App';

interface FindServicesProps {
  setSelectedProvider: (pro: any) => void;
  setActiveTab: (tab: string) => void;
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  setActiveChatUser: (user: string) => void;
  displayedPros?: any[];
}

export default function FindServices({
  setSelectedProvider,
  setActiveTab,
  clientBookings,
  setClientBookings,
  setActiveChatUser,
  displayedPros = []
}: FindServicesProps) {
  // Find Services interactive states (relocated locally)
  const [findServicesSearch, setFindServicesSearch] = useState('');
  const [findServicesLoc, setFindServicesLoc] = useState('Nearby');
  const [findServicesRating, setFindServicesRating] = useState('All');
  const [findServicesCat, setFindServicesCat] = useState(() => {
    const init = localStorage.getItem('fixam_search_cat');
    if (init) {
      localStorage.removeItem('fixam_search_cat');
      return init;
    }
    return 'All Categories';
  });
  const [findServicesPrice, setFindServicesPrice] = useState(50000);
  const [availNow, setAvailNow] = useState(false);
  const [availToday, setAvailToday] = useState(false);
  const [serviceTypeInPerson, setServiceTypeInPerson] = useState(true);
  const [serviceTypeRemote, setServiceTypeRemote] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'filters' | null>(null);
  const [sortBy, setSortBy] = useState('Recommended');

  const [showAllCategories, setShowAllCategories] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter logic simulation
  const filteredProviders = displayedPros.filter(p => {
    const fullName = `${p.firstName || ''} ${p.lastName || ''}`.trim();
    const serviceRole = p.services ? p.services.join(', ') : (p.role || '');
    
    if (findServicesSearch && !fullName.toLowerCase().includes(findServicesSearch.toLowerCase()) && !serviceRole.toLowerCase().includes(findServicesSearch.toLowerCase())) {
      return false;
    }
    if (findServicesCat !== 'All Categories' && !serviceRole.toLowerCase().includes(findServicesCat.toLowerCase())) {
      return false;
    }
    const currentRating = p.rating || 0;
    if (findServicesRating === '4.5 & up' && Number(currentRating) < 4.5) return false;
    if (findServicesRating === '4.0 & up' && Number(currentRating) < 4.0) return false;
    
    if (findServicesPrice < 50000) {
      const providerRate = p.originalData?.rate || 0;
      if (providerRate > findServicesPrice) return false;
    }
    
    if (findServicesLoc && findServicesLoc !== 'Nearby' && findServicesLoc !== 'Remote') {
      const city = p.originalData?.city || '';
      if (city && !city.toLowerCase().includes(findServicesLoc.toLowerCase())) return false;
    }

    return true;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (sortBy === 'Rating: High to Low') return Number(b.rating || 0) - Number(a.rating || 0);
    if (sortBy === 'Price: Low to High') return Number(a.originalData?.rate || 0) - Number(b.originalData?.rate || 0);
    if (sortBy === 'Nearest') return (parseInt(a.distance) || Infinity) - (parseInt(b.distance) || Infinity);
    return 0;
  });

  const allCategoriesList = [
    { name: 'AC Repair', img: '/popular-services/ac-repair.jpg' },
    { name: 'Appliance Repair', img: '/popular-services/appliance-repair.jpg' },
    { name: 'Beauty', img: '/popular-services/beauty.jpg' },
    { name: 'Carpentry', img: '/popular-services/carpentry.jpg' },
    { name: 'Cleaning', img: '/popular-services/cleaning.jpg' },
    { name: 'Delivery', img: '/popular-services/delivery-service.jpg' },
    { name: 'Electrical', img: '/popular-services/electrical.jpg' },
    { name: 'Graphic Design', img: '/popular-services/interior-design.jpg' },
    { name: 'Home Tutor', img: '/popular-services/tutor.jpg' },
    { name: 'Landscaping', img: '/popular-services/landscaping.jpg' },
    { name: 'Painting', img: '/popular-services/painting.jpg' },
    { name: 'Pest Control', img: '/popular-services/pest-control.jpg' },
    { name: 'Photography', img: '/popular-services/photography.jpg' },
    { name: 'Plumbing', img: '/popular-services/plumbing.jpg' },
    { name: 'Video Editing', img: '/popular-services/videography.jpg' },
    { name: 'Accountant', img: '/popular-services/accountant.jpg' },
    { name: 'Barber', img: '/popular-services/barber.jpg' },
    { name: 'Car Wash', img: '/popular-services/car-wash.jpg' },
    { name: 'Catering', img: '/popular-services/catering.jpg' },
    { name: 'Child Care', img: '/popular-services/child-care.jpg' },
    { name: 'Computer Repair', img: '/popular-services/computer-repair.jpg' },
    { name: 'DJ Service', img: '/popular-services/dj-service.jpg' },
    { name: 'Event Planning', img: '/popular-services/event-planning.jpg' },
    { name: 'Fitness Trainer', img: '/popular-services/fitness-trainer.jpg' },
    { name: 'Makeup Artist', img: '/popular-services/makeup-artist.jpg' },
    { name: 'Mechanic', img: '/popular-services/mechanic.jpg' },
    { name: 'Security Guard', img: '/popular-services/security-guard.jpg' },
    { name: 'Tailoring', img: '/popular-services/tailoring.jpg' },
    { name: 'Translator', img: '/popular-services/translator.png' },
    { name: 'Welding', img: '/popular-services/welding.jpg' },
  ];

  if (showAllCategories) {
    return (
      <div className="find-services-page animate-fade-in pb-10">
        <div className="flex items-center gap-4 mb-6 pt-4 px-2">
          <button 
            onClick={() => setShowAllCategories(false)}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#14B8A6] hover:bg-gray-50 font-bold text-xl"
          >
            &larr;
          </button>
          <h2 className="text-2xl font-bold text-[#0F172A]">All Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
          {allCategoriesList.map(c => (
            <button 
              key={c.name}
              type="button"
              onClick={() => {
                setFindServicesCat(c.name);
                setShowAllCategories(false);
              }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-left"
            >
              <img src={c.img} alt={c.name} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-[#0F172A] text-[15px]">{c.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

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
          <select 
            className="w-full bg-transparent border-0 outline-none text-gray-700"
            value={findServicesLoc}
            onChange={(e) => setFindServicesLoc(e.target.value)}
          >
            <option value="Nearby">Nearby</option>
            <option value="Douala">Douala</option>
            <option value="Yaounde">Yaoundé</option>
            <option value="Buea">Buea</option>
            <option value="Limbe">Limbe</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
        <button className="btn-search-fs" onClick={() => alert('Search initiated!')}>Search</button>
      </div>



      <div className="mb-8 mt-2 relative">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-2xl font-bold text-[#0F172A]">Popular Categories</h2>
          <button className="text-[#14B8A6] font-bold text-sm hover:underline" onClick={() => setShowAllCategories(true)}>View all</button>
        </div>
        
        {/* Left Arrow */}
        <button 
          onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
          className="absolute left-0 top-[60%] -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#14B8A6] hover:bg-gray-50 border border-gray-100 hidden md:flex"
        >
          <span className="text-xl font-bold">&larr;</span>
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x" style={{ scrollbarWidth: 'none' }}>
          {[
            { name: 'Home Tutor', img: '/popular-services/tutor.jpg' },
            { name: 'Plumbing', img: '/popular-services/plumbing.jpg' },
            { name: 'Electrical', img: '/popular-services/electrical.jpg' },
            { name: 'Cleaning', img: '/popular-services/cleaning.jpg' },
            { name: 'Painting', img: '/popular-services/painting.jpg' },
            { name: 'Carpentry', img: '/popular-services/carpentry.jpg' },
            { name: 'AC Repair', img: '/popular-services/ac-repair.jpg' },
            { name: 'Web Design', img: '/popular-services/computer-repair.jpg' },
            { name: 'SEO', img: '/popular-services/internet-setup.jpg' },
            { name: 'Graphic Design', img: '/popular-services/interior-design.jpg' },
            { name: 'App Development', img: '/popular-services/computer-repair.jpg' },
            { name: 'Photography', img: '/popular-services/photography.jpg' },
            { name: 'Video Editing', img: '/popular-services/videography.jpg' },
            { name: 'Pest Control', img: '/popular-services/pest-control.jpg' },
            { name: 'Landscaping', img: '/popular-services/landscaping.jpg' }
          ].map(c => (
            <button 
              key={c.name}
              type="button"
              onClick={() => setFindServicesCat(c.name)}
              className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 snap-start text-left"
            >
              <img src={c.img} alt={c.name} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-[#0F172A] text-[15px]">{c.name}</h3>
              </div>
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
          className="absolute right-0 top-[60%] -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#14B8A6] hover:bg-gray-50 border border-gray-100 hidden md:flex"
        >
          <span className="text-xl font-bold">&rarr;</span>
        </button>
      </div>

      {/* Box-less Horizontal Filter Row */}
      <div className="fs-horizontal-filters-bar relative" style={{ overflow: 'visible' }}>
        {/* Filters Dropdown */}
        <div className="fs-filter-dropdown-container">
          <button 
            type="button"
            className={`fs-filter-pill-btn w-full justify-between ${activeDropdown === 'filters' ? 'active' : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'filters' ? null : 'filters')}
            style={{ width: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          >
            <Icon name="filter" /> Filters ▾
          </button>
          
          {activeDropdown === 'filters' && (
            <div className="fs-dropdown-menu-card animate-fade-in p-4" style={{ minWidth: '280px', left: 0, zIndex: 50 }}>
              {/* Category */}
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2 text-gray-700">Category</h4>
                <select className="w-full p-2 border rounded-md" value={findServicesCat} onChange={(e) => setFindServicesCat(e.target.value)}>
                  <option value="All Categories">All Categories</option>
                  <option value="Cleaning Service">Cleaning Service</option>
                  <option value="Plumbing Service">Plumbing Service</option>
                  <option value="Electrical Service">Electrical Service</option>
                  <option value="Painting Service">Painting Service</option>
                  <option value="Carpentry Service">Carpentry Service</option>
                </select>
              </div>

              {/* Price */}
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2 text-gray-700">Max Budget</h4>
                <input type="range" min="0" max="50000" step="1000" value={findServicesPrice} onChange={(e) => setFindServicesPrice(Number(e.target.value))} className="w-full price-slider-range" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 XAF</span>
                  <span>{findServicesPrice === 50000 ? '50,000+ XAF' : `${findServicesPrice} XAF`}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2 text-gray-700">Provider Rating</h4>
                <div className="flex flex-col gap-2">
                  {['All', '4.0 & up', '4.5 & up'].map((r) => (
                    <button key={r} type="button" className={`p-2 border rounded-md text-sm font-bold ${findServicesRating === r ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-gray-50 text-gray-700'}`} onClick={() => setFindServicesRating(r)}>
                      {r === 'All' ? 'All Ratings' : r === '4.0 & up' ? '4★ & up' : '4.5★ & up'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2 text-gray-700">Availability</h4>
                <label className="flex items-center gap-2 text-sm text-gray-700 mb-2 cursor-pointer">
                  <input type="checkbox" checked={availNow} onChange={(e) => setAvailNow(e.target.checked)} />
                  <span>Available Now</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={availToday} onChange={(e) => setAvailToday(e.target.checked)} />
                  <span>Available Today</span>
                </label>
              </div>

              <div className="flex gap-2 mt-4">
                <button type="button" className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md font-bold text-sm" onClick={() => {
                  setFindServicesCat('All Categories');
                  setFindServicesRating('All');
                  setFindServicesPrice(50000);
                  setAvailNow(false);
                  setAvailToday(false);
                }}>Clear All</button>
                <button type="button" className="flex-1 bg-teal-500 text-white py-2 rounded-md font-bold text-sm" onClick={() => setActiveDropdown(null)}>Apply</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fs-directory-layout" style={{ display: 'block', width: '100%' }}>
        <div className="fs-directory-main" style={{ width: '100%', maxWidth: '100%' }}>
          <div className="fs-results-header">
            <span>Showing {sortedProviders.length} providers</span>
            <div className="fs-sort-dropdown">
              <span>Sort by: </span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option>Recommended</option>
                <option>Nearest</option>
                <option>Rating: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {sortedProviders.map((p, idx) => {
              const fullName = p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Provider';
              const serviceRole = p.services && p.services.length > 0 ? p.services[0] : (p.role || 'Service Professional');
              const rawAvatar = p.image || p.avatar || p.user?.avatar || p.originalData?.user?.avatar || '';
              const displayImage = rawAvatar ? getMediaUrl(rawAvatar) : '';
              const displayRating = p.rating || 'New';
              const numReviews = p.reviews || 0;
              const displayLoc = p.location || p.city || 'Nearby';
              const isVerified = p.isVerified || p.verified;
              const priceLabel = p.hourlyRate ? `${p.hourlyRate} XAF` : 'Contact for price';
              const displayDesc = p.bio || p.desc || 'Professional service provider ready to help you with your needs.';

              return (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full relative p-5">
                  <div className="mb-4">
                    {displayImage ? (
                      <img 
                        src={displayImage} 
                        alt={fullName} 
                        className="w-16 h-16 rounded-lg object-cover mb-3" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=14B8A6&color=fff&size=64&rounded=true`;
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg mb-3 bg-teal-500 text-white flex items-center justify-center font-bold text-2xl">
                        {fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-0.5 flex items-center gap-1">
                      {fullName} {isVerified && <span className="text-[#14B8A6]"><Icon name="shield" /></span>}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{serviceRole}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <span className="flex items-center gap-1 text-[#F59E0B] font-medium"><Icon name="star" /> {displayRating}</span>
                      <span>({numReviews} reviews)</span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1"><Icon name="location" /> {displayLoc}</span>
                    </div>

                    <p className="text-sm text-gray-700 line-clamp-2">{displayDesc}</p>
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium">From</span>
                      <div className="flex items-baseline gap-1">
                        <strong className="text-[#14B8A6] font-bold">{priceLabel}</strong>
                        <small className="text-[10px] text-gray-500">/ hour</small>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        className="bg-[#14B8A6] hover:bg-[#0F9788] text-white text-xs font-bold py-2 px-3 rounded transition-colors"
                        onClick={() => setSelectedProvider(p)}
                      >
                        View Profile
                      </button>
                      <button 
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold py-2 px-3 rounded transition-colors"
                        onClick={() => setSelectedProvider(p)}
                      >
                        Book now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promo Card Banner at the bottom */}
          <div className="dash-panel-premium promo-card-fs" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', marginTop: '2.5rem', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <div className="promo-text-fs" style={{ flex: 1, maxWidth: '80%' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Get the best experience</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.9)' }}>Book your favorite providers faster and manage all your bookings in one place.</p>
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
