import './FindServices.css';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, images, getMediaUrl } from '../../App';
import UserAvatar from '../../components/UserAvatar';

interface FindServicesProps {
  setSelectedProvider: (pro: any) => void;
  setActiveTab: (tab: string) => void;
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  setActiveChatUser: (user: string) => void;
  displayedPros?: any[];
  initialSearch?: string;
}

export default function FindServices({
  setSelectedProvider,
  setActiveTab,
  clientBookings,
  setClientBookings,
  setActiveChatUser,
  displayedPros = [],
  initialSearch = ''
}: FindServicesProps) {
  const { i18n } = useTranslation();
  // Find Services interactive states
  const [findServicesSearch, setFindServicesSearch] = useState(initialSearch || '');
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
  const [activeDropdown, setActiveDropdown] = useState<'filters' | null>(null);
  const [sortBy, setSortBy] = useState('Recommended');

  const [showAllCategories, setShowAllCategories] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync initialSearch if passed from top Search modal or dashboard
  useEffect(() => {
    if (initialSearch !== undefined && initialSearch !== '') {
      setFindServicesSearch(initialSearch);
    }
  }, [initialSearch]);

  // Category translation helper
  const getCategoryLabel = (catName: string) => {
    if (i18n.language !== 'fr') return catName;
    const catMap: Record<string, string> = {
      'Home Tutor': 'Cours à domicile / Tuteur',
      'Plumbing': 'Plomberie',
      'Electrical': 'Électricité',
      'Cleaning': 'Nettoyage & Ménage',
      'Painting': 'Peinture',
      'Carpentry': 'Menuiserie',
      'AC Repair': 'Réparation Climatiseur',
      'Web Design': 'Web Design',
      'SEO': 'Référencement SEO',
      'Graphic Design': 'Design Graphique',
      'App Development': 'Développement d\'Apps',
      'Photography': 'Photographie',
      'Video Editing': 'Montage Vidéo',
      'Pest Control': 'Anti-nuisibles',
      'Landscaping': 'Jardinage & Paysage',
      'Appliance Repair': 'Réparation Électroménager',
      'Beauty': 'Beauté & Soins',
      'Delivery': 'Livraison',
      'Accountant': 'Comptable',
      'Barber': 'Coiffeur / Barbier',
      'Car Wash': 'Lavage Auto',
      'Catering': 'Traiteur',
      'Child Care': 'Garde d\'enfants',
      'Computer Repair': 'Réparation Informatique',
      'DJ Service': 'Service DJ',
      'Event Planning': 'Organisation d\'événements',
      'Fitness Trainer': 'Coach Sportif',
      'Makeup Artist': 'Maquilleuse',
      'Mechanic': 'Mécanicien',
      'Security Guard': 'Agent de Sécurité',
      'Tailoring': 'Couture',
      'Translator': 'Traducteur',
      'Welding': 'Soudure',
      'All Categories': 'Toutes les catégories',
      'Cleaning Service': 'Service de nettoyage',
      'Plumbing Service': 'Service de plomberie',
      'Electrical Service': 'Service électrique',
      'Painting Service': 'Service de peinture',
      'Carpentry Service': 'Service de menuiserie'
    };
    return catMap[catName] || catName;
  };

  // Filter logic simulation
  const filteredProviders = displayedPros.filter(p => {
    const fullName = `${p.firstName || ''} ${p.lastName || ''} ${p.fullName || ''} ${p.name || ''}`.trim().toLowerCase();
    const serviceRole = (p.services ? p.services.join(' ') : (p.role || '')).toLowerCase();
    const proCategory = (p.category || '').toLowerCase();
    const proLocation = `${p.location || ''} ${p.city || ''} ${p.quarter || ''}`.toLowerCase();
    const proBio = `${p.bio || ''} ${p.desc || ''} ${p.originalData?.bio || ''}`.toLowerCase();
    
    if (findServicesSearch.trim()) {
      const q = findServicesSearch.trim().toLowerCase();
      const matches =
        fullName.includes(q) ||
        serviceRole.includes(q) ||
        proCategory.includes(q) ||
        proLocation.includes(q) ||
        proBio.includes(q) ||
        (Array.isArray(p.services) && p.services.some((s: string) => String(s).toLowerCase().includes(q)));

      if (!matches) return false;
    }

    if (findServicesCat !== 'All Categories') {
      const catLower = findServicesCat.toLowerCase();
      const matchesCat =
        serviceRole.includes(catLower) ||
        proCategory.includes(catLower) ||
        (Array.isArray(p.services) && p.services.some((s: string) => String(s).toLowerCase().includes(catLower)));

      if (!matchesCat) return false;
    }

    const currentRating = p.rating || 0;
    if (findServicesRating === '4.5 & up' && Number(currentRating) < 4.5) return false;
    if (findServicesRating === '4.0 & up' && Number(currentRating) < 4.0) return false;
    
    if (findServicesPrice < 50000) {
      const providerRate = p.originalData?.rate || p.hourlyRate || p.rate || 0;
      if (providerRate > findServicesPrice) return false;
    }
    
    if (findServicesLoc && findServicesLoc !== 'Nearby' && findServicesLoc !== 'Remote') {
      const city = (p.originalData?.city || p.city || p.location || '').toLowerCase();
      if (city && !city.includes(findServicesLoc.toLowerCase())) return false;
    }

    return true;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (sortBy === 'Rating: High to Low') return Number(b.rating || 0) - Number(a.rating || 0);
    if (sortBy === 'Price: Low to High') return Number(a.originalData?.rate || a.hourlyRate || 0) - Number(b.originalData?.rate || b.hourlyRate || 0);
    if (sortBy === 'Nearest') return (parseInt(a.distance) || Infinity) - (parseInt(b.distance) || Infinity);
    return 0;
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    searchInputRef.current?.blur();
  };

  const handleResetFilters = () => {
    setFindServicesSearch('');
    setFindServicesCat('All Categories');
    setFindServicesLoc('Nearby');
    setFindServicesRating('All');
    setFindServicesPrice(50000);
    setAvailNow(false);
    setAvailToday(false);
  };

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
          <h2 className="text-2xl font-bold text-[#0F172A]">
            {i18n.language === 'fr' ? 'Toutes les catégories' : 'All Categories'}
          </h2>
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
              <img src={c.img} alt={getCategoryLabel(c.name)} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-[#0F172A] text-[15px]">{getCategoryLabel(c.name)}</h3>
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
        <h2>{i18n.language === 'fr' ? 'Trouver un service' : 'Find Services'}</h2>
        <p>{i18n.language === 'fr' ? 'Trouvez des professionnels vérifiés pour tous vos besoins de services.' : 'Find verified professionals for any service you need.'}</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="search-bar-row-fs">
        <div className="input-wrapper-fs query-input" style={{ position: 'relative' }}>
          <Icon name="search" />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder={i18n.language === 'fr' ? 'De quel service ou prestataire avez-vous besoin ?' : 'What service or professional do you need?'} 
            value={findServicesSearch}
            onChange={(e) => setFindServicesSearch(e.target.value)}
          />
          {findServicesSearch.trim() ? (
            <button
              type="button"
              onClick={() => setFindServicesSearch('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px 8px',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Clear search"
            >
              ✕
            </button>
          ) : null}
        </div>
        <div className="input-wrapper-fs location-input">
          <Icon name="location" />
          <select 
            className="w-full bg-transparent border-0 outline-none text-gray-700 font-medium cursor-pointer"
            value={findServicesLoc}
            onChange={(e) => setFindServicesLoc(e.target.value)}
          >
            <option value="Nearby">{i18n.language === 'fr' ? 'À proximité' : 'Nearby'}</option>
            <option value="Douala">Douala</option>
            <option value="Yaounde">Yaoundé</option>
            <option value="Buea">Buea</option>
            <option value="Limbe">Limbe</option>
            <option value="Remote">{i18n.language === 'fr' ? 'À distance' : 'Remote'}</option>
          </select>
        </div>
        <button type="submit" className="btn-search-fs">
          {i18n.language === 'fr' ? 'Rechercher' : 'Search'}
        </button>
      </form>

      <div className="mb-8 mt-2 relative">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-2xl font-bold text-[#0F172A]">
            {i18n.language === 'fr' ? 'Catégories populaires' : 'Popular Categories'}
          </h2>
          <button className="text-[#14B8A6] font-bold text-sm hover:underline" onClick={() => setShowAllCategories(true)}>
            {i18n.language === 'fr' ? 'Voir tout' : 'View all'}
          </button>
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
              <img src={c.img} alt={getCategoryLabel(c.name)} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-[#0F172A] text-[15px]">{getCategoryLabel(c.name)}</h3>
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
            <Icon name="filter" /> {i18n.language === 'fr' ? 'Filtres ▾' : 'Filters ▾'}
          </button>
          
          {activeDropdown === 'filters' && (
            <div className="fs-dropdown-menu-card animate-fade-in p-4" style={{ minWidth: '280px', left: 0, zIndex: 50 }}>
              {/* Category */}
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2 text-gray-700">{i18n.language === 'fr' ? 'Catégorie' : 'Category'}</h4>
                <select className="w-full p-2 border rounded-md" value={findServicesCat} onChange={(e) => setFindServicesCat(e.target.value)}>
                  <option value="All Categories">{getCategoryLabel('All Categories')}</option>
                  <option value="Cleaning Service">{getCategoryLabel('Cleaning Service')}</option>
                  <option value="Plumbing Service">{getCategoryLabel('Plumbing Service')}</option>
                  <option value="Electrical Service">{getCategoryLabel('Electrical Service')}</option>
                  <option value="Painting Service">{getCategoryLabel('Painting Service')}</option>
                  <option value="Carpentry Service">{getCategoryLabel('Carpentry Service')}</option>
                </select>
              </div>

              {/* Price */}
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2 text-gray-700">{i18n.language === 'fr' ? 'Budget Max' : 'Max Budget'}</h4>
                <input type="range" min="0" max="50000" step="1000" value={findServicesPrice} onChange={(e) => setFindServicesPrice(Number(e.target.value))} className="w-full price-slider-range" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 XAF</span>
                  <span>{findServicesPrice === 50000 ? '50,000+ XAF' : `${findServicesPrice} XAF`}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2 text-gray-700">{i18n.language === 'fr' ? 'Note du prestataire' : 'Provider Rating'}</h4>
                <div className="flex flex-col gap-2">
                  {['All', '4.0 & up', '4.5 & up'].map((r) => (
                    <button key={r} type="button" className={`p-2 border rounded-md text-sm font-bold ${findServicesRating === r ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-gray-50 text-gray-700'}`} onClick={() => setFindServicesRating(r)}>
                      {r === 'All' ? (i18n.language === 'fr' ? 'Toutes les notes' : 'All Ratings') : r === '4.0 & up' ? '4★ & plus' : '4.5★ & plus'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-2 text-gray-700">{i18n.language === 'fr' ? 'Disponibilité' : 'Availability'}</h4>
                <label className="flex items-center gap-2 text-sm text-gray-700 mb-2 cursor-pointer">
                  <input type="checkbox" checked={availNow} onChange={(e) => setAvailNow(e.target.checked)} />
                  <span>{i18n.language === 'fr' ? 'Disponible maintenant' : 'Available Now'}</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={availToday} onChange={(e) => setAvailToday(e.target.checked)} />
                  <span>{i18n.language === 'fr' ? 'Disponible aujourd\'hui' : 'Available Today'}</span>
                </label>
              </div>

              <div className="flex gap-2 mt-4">
                <button type="button" className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md font-bold text-sm" onClick={handleResetFilters}>{i18n.language === 'fr' ? 'Tout effacer' : 'Clear All'}</button>
                <button type="button" className="flex-1 bg-teal-500 text-white py-2 rounded-md font-bold text-sm" onClick={() => setActiveDropdown(null)}>
                  {i18n.language === 'fr' ? 'Appliquer' : 'Apply'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Search / Filter Tag */}
        {(findServicesSearch.trim() || findServicesCat !== 'All Categories') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {findServicesSearch.trim() && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0FDFA', border: '1px solid #99F6E4', color: '#0D9488', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                🔍 "{findServicesSearch}"
                <button type="button" onClick={() => setFindServicesSearch('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#0D9488', fontWeight: 800 }}>✕</button>
              </span>
            )}
            {findServicesCat !== 'All Categories' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0FDFA', border: '1px solid #99F6E4', color: '#0D9488', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                📁 {getCategoryLabel(findServicesCat)}
                <button type="button" onClick={() => setFindServicesCat('All Categories')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#0D9488', fontWeight: 800 }}>✕</button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              style={{ border: 'none', background: 'transparent', color: '#EF4444', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {i18n.language === 'fr' ? 'Effacer tout' : 'Reset all'}
            </button>
          </div>
        )}
      </div>

      <div className="fs-directory-layout" style={{ display: 'block', width: '100%' }}>
        <div className="fs-directory-main" style={{ width: '100%', maxWidth: '100%' }}>
          <div className="fs-results-header">
            <span>
              {i18n.language === 'fr' ? `Affichage de ${sortedProviders.length} prestataire(s)` : `Showing ${sortedProviders.length} provider(s)`}
            </span>
            <div className="fs-sort-dropdown">
              <span>{i18n.language === 'fr' ? 'Trier par : ' : 'Sort by: '}</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="Recommended">{i18n.language === 'fr' ? 'Recommandés' : 'Recommended'}</option>
                <option value="Nearest">{i18n.language === 'fr' ? 'Plus proches' : 'Nearest'}</option>
                <option value="Rating: High to Low">{i18n.language === 'fr' ? 'Note : Du plus haut au plus bas' : 'Rating: High to Low'}</option>
                <option value="Price: Low to High">{i18n.language === 'fr' ? 'Prix : Du plus bas au plus haut' : 'Price: Low to High'}</option>
              </select>
            </div>
          </div>

          {sortedProviders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                {i18n.language === 'fr' ? 'Aucun prestataire trouvé pour cette recherche' : 'No providers matched your search'}
              </h3>
              <p style={{ color: '#64748B', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.92rem' }}>
                {i18n.language === 'fr' 
                  ? 'Essayez de rechercher un autre métier (ex: plombier, électricien, ménage) ou réinitialisez les filtres.' 
                  : 'Try searching for a different service (e.g. plumber, electrician, cleaning) or reset your filters.'}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  background: '#14B8A6',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {i18n.language === 'fr' ? 'Réinitialiser les filtres' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {sortedProviders.map((p, idx) => {
              const fullName = p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Provider';
              const serviceRole = getCategoryLabel(p.services && p.services.length > 0 ? p.services[0] : (p.role || (i18n.language === 'fr' ? 'Prestataire de service' : 'Service Professional')));
              const rawAvatar = p.image 
                || p.avatar 
                || p.user?.avatar 
                || p.user?.image 
                || p.originalData?.user?.avatar 
                || p.originalData?.avatar 
                || (typeof p.originalData?.portfolio?.[0] === 'string' ? p.originalData.portfolio[0] : (p.originalData?.portfolio?.[0]?.imageUrl || p.originalData?.portfolio?.[0]?.url || p.originalData?.portfolio?.[0]?.image));
              const displayRating = p.rating || (i18n.language === 'fr' ? 'Nouveau' : 'New');
              const numReviews = p.reviews || 0;
              const displayLoc = p.location || p.city || (i18n.language === 'fr' ? 'À proximité' : 'Nearby');
              const isVerified = p.isVerified || p.verified;
              const priceLabel = p.hourlyRate ? `${p.hourlyRate} XAF` : (i18n.language === 'fr' ? 'Contacter pour le prix' : 'Contact for price');
              const displayDesc = p.bio || p.desc || (i18n.language === 'fr' ? 'Prestataire professionnel prêt à vous aider pour vos besoins.' : 'Professional service provider ready to help you with your needs.');

              return (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full relative p-5">
                  <div className="mb-4">
                    <div className="mb-3">
                      <UserAvatar uri={rawAvatar} name={fullName} size={64} radius={8} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-0.5 flex items-center gap-1">
                      {fullName} {isVerified && <span className="text-[#14B8A6]"><Icon name="shield" /></span>}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{serviceRole}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <span className="flex items-center gap-1 text-[#F59E0B] font-medium"><Icon name="star" /> {displayRating}</span>
                      <span>({numReviews} {i18n.language === 'fr' ? 'avis' : 'reviews'})</span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1"><Icon name="location" /> {displayLoc}</span>
                    </div>

                    <p className="text-sm text-gray-700 line-clamp-2">{displayDesc}</p>
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium">{i18n.language === 'fr' ? 'À partir de' : 'From'}</span>
                      <div className="flex items-baseline gap-1">
                        <strong className="text-[#14B8A6] font-bold">{priceLabel}</strong>
                        <small className="text-[10px] text-gray-500">/ {i18n.language === 'fr' ? 'heure' : 'hour'}</small>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        className="bg-[#14B8A6] hover:bg-[#0F9788] text-white text-xs font-bold py-2 px-3 rounded transition-colors"
                        onClick={() => setSelectedProvider(p)}
                      >
                        {i18n.language === 'fr' ? 'Voir le profil' : 'View Profile'}
                      </button>
                      <button 
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold py-2 px-3 rounded transition-colors"
                        onClick={() => setSelectedProvider(p)}
                      >
                        {i18n.language === 'fr' ? 'Réserver' : 'Book now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

          {/* Promo Card Banner at the bottom */}
          <div className="dash-panel-premium promo-card-fs" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', marginTop: '2.5rem', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <div className="promo-text-fs" style={{ flex: 1, maxWidth: '80%' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                {i18n.language === 'fr' ? 'Obtenez la meilleure expérience' : 'Get the best experience'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                {i18n.language === 'fr' 
                  ? 'Réservez vos prestataires préférés plus rapidement et gérez toutes vos réservations au même endroit.' 
                  : 'Book your favorite providers faster and manage all your bookings in one place.'}
              </p>
            </div>
            <button type="button" className="btn-promo-action-fs" onClick={() => setActiveTab('Dashboard')} style={{ flexShrink: 0, minWidth: '140px' }}>
              {i18n.language === 'fr' ? 'Réserver un service' : 'Book a Service'}
            </button>
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
