import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, getMediaUrl, DEFAULT_AVATAR } from '../../App';

interface BrowseProjectsProps {
  displayedPros?: any[];
  setActiveTab: (tab: string) => void;
  setSelectedProject: (proj: any) => void;
  setSelectedProvider?: (pro: any) => void;
  favoriteProjectIds?: string[];
  toggleFavoriteProject?: (projectId: string) => void;
}

export default function BrowseProjects({
  displayedPros = [],
  setActiveTab,
  setSelectedProject,
  setSelectedProvider,
  favoriteProjectIds = [],
  toggleFavoriteProject,
}: BrowseProjectsProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  // Extract all portfolio projects from providers
  const allProjects = useMemo(() => {
    const projects: any[] = [];
    displayedPros.forEach((pro) => {
      const raw = pro.originalData || pro;
      if (!raw || !Array.isArray(raw.portfolio)) return;

      raw.portfolio.forEach((item: any) => {
        if (!item) return;

        let parsedPackages = item.packages;
        if (typeof parsedPackages === 'string') {
          try {
            parsedPackages = JSON.parse(parsedPackages);
          } catch (_) {}
        }

        const rawImages = Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : (item.imageUrl ? [item.imageUrl] : (item.url ? [item.url] : (item.image ? [item.image] : [])));
        const itemImages = rawImages.map((u: string) => getMediaUrl(u, 'image')).filter(Boolean);

        const rawVideos = Array.isArray(item.videos) && item.videos.length > 0
          ? item.videos
          : (item.video ? (Array.isArray(item.video) ? item.video : [item.video]) : (item.videoUrl ? [item.videoUrl] : []));
        const itemVideos = rawVideos.map((u: string) => getMediaUrl(u, 'video')).filter(Boolean);

        const priceVal = item.price || parsedPackages?.basic?.price || parsedPackages?.standard?.price || 0;

        projects.push({
          id: item.id || `${raw.id}_${item.title || 'proj'}`,
          title: item.title || 'Specialist Showcase Project',
          description: item.description || '',
          imageUrl: itemImages[0] || getMediaUrl(item.imageUrl || item.url || item.image, 'image') || '',
          images: itemImages,
          videos: itemVideos,
          video: itemVideos[0] || null,
          packages: parsedPackages || null,
          price: priceVal,
          category: item.category || raw.skills?.[0] || 'General',
          provider: {
            id: raw.id,
            userId: raw.user?.id || raw.userId || '',
            name: raw.user?.fullName || pro.name || 'Verified Professional',
            avatar: raw.user?.avatar || pro.image || '',
            rating: raw.rating || 5.0,
            reviewCount: raw.reviewsCount || raw.reviewCount || 0,
            country: raw.user?.country || 'Cameroon',
            serviceArea: raw.serviceArea || 'Douala / Yaoundé',
            originalData: raw
          },
        });
      });
    });
    return projects;
  }, [displayedPros]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    allProjects.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [allProjects]);

  // Filter and sort
  const filteredProjects = useMemo(() => {
    return allProjects
      .filter((proj) => {
        const matchesCategory = selectedCategory === 'All' || proj.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = !searchQuery.trim() || 
          proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proj.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proj.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === 'price_high') return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === 'rating') return (Number(b.provider.rating) || 0) - (Number(a.provider.rating) || 0);
        return 0; // featured default
      });
  }, [allProjects, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <button 
              className="hover:text-teal-600 transition-colors" 
              onClick={() => setActiveTab('Dashboard')}
            >
              {isFr ? 'Tableau de bord' : 'Dashboard'}
            </button>
            <span>/</span>
            <span className="text-gray-800 font-semibold">{isFr ? 'Parcourir les projets' : 'Browse Projects'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {isFr ? 'Projets et Réalisations des Prestataires' : 'Specialist Projects & Service Showcases'}
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            {isFr
              ? 'Découvrez des projets concrets, tarifs transparents et travaux réalisés par nos artisans et techniciens certifiés.'
              : 'Browse real delivered projects, upfront pricing, and past work from verified trade professionals across Cameroon.'}
          </p>
        </div>

        <button
          className="self-start md:self-center bg-[#14B8A6] hover:bg-[#0F9788] text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 text-sm"
          onClick={() => setActiveTab('Find Services')}
        >
          <Icon name="search" />
          <span>{isFr ? 'Trouver un prestataire' : 'Find Providers'}</span>
        </button>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon name="search" />
            </span>
            <input
              type="text"
              placeholder={isFr ? 'Rechercher par mot-clé, projet ou artisan...' : 'Search projects, skills, or specialist name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              {isFr ? 'Trier par :' : 'Sort by:'}
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="featured">{isFr ? 'Recommandés' : 'Recommended'}</option>
              <option value="price_low">{isFr ? 'Prix : Moins cher' : 'Price: Low to High'}</option>
              <option value="price_high">{isFr ? 'Prix : Plus cher' : 'Price: High to Low'}</option>
              <option value="rating">{isFr ? 'Mieux notés' : 'Highest Rated'}</option>
            </select>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? (isFr ? 'Tous les projets' : 'All Projects') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center my-6">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 text-2xl mx-auto mb-4">
            📁
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {isFr ? 'Aucun projet trouvé' : 'No projects found'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
            {isFr
              ? 'Aucun projet ne correspond à vos filtres actuels. Essayez d\'élargir votre recherche.'
              : 'Try changing your search terms or selecting a different service category.'}
          </p>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs transition"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            {isFr ? 'Réinitialiser les filtres' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, idx) => {
            const isFav = favoriteProjectIds.includes(project.id);
            const priceDisplay = project.price ? `XAF ${Number(project.price).toLocaleString()}` : (isFr ? 'Sur devis' : 'Custom quote');
            const prov = project.provider;
            const provAvatar = prov.avatar ? getMediaUrl(prov.avatar) : DEFAULT_AVATAR;

            return (
              <div
                key={project.id || idx}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Image & Badges */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={project.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80';
                    }}
                  />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                    {project.category}
                  </span>

                  {/* Video indicator badge */}
                  {project.video && (
                    <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      ▶ Video Demo
                    </span>
                  )}

                  {/* Favorite Button */}
                  {toggleFavoriteProject && (
                    <button
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-sm transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteProject(project.id);
                      }}
                    >
                      <span className={isFav ? 'text-rose-500' : 'text-gray-400'}>
                        {isFav ? '❤️' : '🤍'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Project Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-teal-600 transition-colors line-clamp-1 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                      {project.description || (isFr ? 'Prestation et réalisation de qualité certifiée Fixam.' : 'Professional service and custom workmanship delivered on Fixam.')}
                    </p>
                  </div>

                  <div>
                    {/* Price banner */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        {isFr ? 'À partir de' : 'Starting at'}
                      </span>
                      <strong className="text-sm font-extrabold text-teal-700">
                        {priceDisplay}
                      </strong>
                    </div>

                    {/* Provider Info Footer */}
                    <div className="flex items-center justify-between pt-1">
                      <div 
                        className="flex items-center gap-2 hover:opacity-80 transition"
                        onClick={(e) => {
                          if (setSelectedProvider && prov.originalData) {
                            e.stopPropagation();
                            setSelectedProvider(prov.originalData);
                            setActiveTab('Provider Profile Detail');
                          }
                        }}
                      >
                        <img
                          src={provAvatar}
                          alt={prov.name}
                          className="w-7 h-7 rounded-full object-cover border border-teal-100"
                          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                        />
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[110px]">
                          {prov.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <span>★</span>
                        <span className="text-gray-800">{Number(prov.rating || 5.0).toFixed(1)}</span>
                        <span className="text-[10px] text-gray-400">({prov.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
