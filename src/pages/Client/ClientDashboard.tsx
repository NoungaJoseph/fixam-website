import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, getMediaUrl } from '../../App';
import { useAuth } from '../../context/AuthContext';
import CreateTaskModal from './CreateTaskModal';

interface Service {
  id: string;
  title: string;
  image: string;
}

interface Provider {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  originalData?: any;
}

interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  provider: string;
  status: string;
}

interface ClientDashboardProps {
  setActiveTab: (tab: string) => void;
  setSelectedProvider: (pro: Provider) => void;
  setSelectedProject?: (proj: any) => void;
  services: Service[];
  displayedPros: Provider[];
  clientBookings: any[];
  clientTasks?: any[];
  setClientTasks?: (tasks: any[]) => void;
  walletBalance?: number;
  setSelectedBooking?: (booking: any) => void;
  onRoleChange?: (role: 'client' | 'pro') => void;
  favoriteProjectIds?: string[];
  toggleFavoriteProject?: (projectId: string) => void;
}

export default function ClientDashboard({
  setActiveTab,
  setSelectedProvider,
  setSelectedProject,
  services,
  displayedPros,
  clientBookings,
  walletBalance = 0,
  clientTasks = [],
  setClientTasks,
  setSelectedBooking,
  onRoleChange,
  favoriteProjectIds = [],
  toggleFavoriteProject,
}: ClientDashboardProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Auto-open task creation modal if redirected from the landing page
  useEffect(() => {
    const shouldPost = localStorage.getItem('fixam_redirect_post_task');
    if (shouldPost === 'true') {
      localStorage.removeItem('fixam_redirect_post_task');
      setShowTaskModal(true);
    }
  }, []);

  // Extract portfolio projects from all providers (matching mobile app's projectShowcaseList)
  const portfolioProjects = useMemo(() => {
    const projects: any[] = [];
    const currentUserId = user?.id || '';
    displayedPros.forEach((pro) => {
      const raw = pro.originalData;
      if (!raw || !Array.isArray(raw.portfolio)) return;
      raw.portfolio.forEach((item: any) => {
        if (!item) return;

        let parsedPackages = item.packages;
        if (typeof parsedPackages === 'string') {
          try { parsedPackages = JSON.parse(parsedPackages); } catch (_) {}
        }

        const rawImages = Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : (item.imageUrl ? [item.imageUrl] : (item.url ? [item.url] : (item.image ? [item.image] : [])));
        const itemImages = rawImages.map((u: string) => getMediaUrl(u, 'image')).filter(Boolean);

        const rawVideos = Array.isArray(item.videos) && item.videos.length > 0
          ? item.videos
          : (item.video ? (Array.isArray(item.video) ? item.video : [item.video]) : (item.videoUrl ? [item.videoUrl] : []));
        const itemVideos = rawVideos.map((u: string) => getMediaUrl(u, 'video')).filter(Boolean);

        projects.push({
          id: item.id || `${raw.id}_${item.title || 'proj'}`,
          title: item.title || 'Untitled Project',
          description: item.description || '',
          imageUrl: itemImages[0] || getMediaUrl(item.imageUrl || item.url || item.image, 'image') || '',
          images: itemImages,
          videos: itemVideos,
          video: itemVideos[0] || null,
          packages: parsedPackages || null,
          price: item.price || (parsedPackages?.basic?.price || parsedPackages?.standard?.price || null),
          category: item.category || '',
          provider: {
            id: raw.id,
            userId: raw.user?.id || '',
            name: raw.user?.fullName || pro.name || 'Provider',
            avatar: raw.user?.avatar || '',
            rating: raw.rating || 5.0,
            reviewCount: raw.reviewsCount || raw.reviewCount || 0,
            country: raw.user?.country || 'Cameroon',
          },
        });
      });
    });
    // Exclude own projects
    return projects.filter(p => p.provider.id !== currentUserId && p.provider.userId !== currentUserId);
  }, [displayedPros, user?.id]);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="max-w-7xl mx-auto w-full pt-6">
      {/* Greeting row */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{getGreeting()}, {user?.firstName || 'User'}! 👋</h1>
          <p className="text-sm text-gray-500">Here's what's happening with your account today.</p>
        </div>
        <button className="bg-[#14B8A6] text-white text-sm px-4 py-2 rounded font-medium hover:bg-[#0F9788] transition flex items-center gap-2 w-full md:w-auto justify-center" onClick={() => setActiveTab('Find Services')}>
          <Icon name="search" />
          Browse Services
        </button>
      </div>

      {/* Post Task Hero Section */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="bg-orange-50/50 border border-gray-200 rounded-lg p-5 relative flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-3">Post a Task</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600"><Icon name="briefcase" /></span>
              </div>
              <span className="text-sm font-bold text-gray-800">New Job</span>
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-4">What do you need help with?</h3>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-end">
            <button 
              className="bg-[#14B8A6] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#0F9788] transition-colors shadow-sm"
              onClick={() => setShowTaskModal(true)}
            >
              Create a Task
            </button>
          </div>
        </div>

        <div className="bg-teal-50/50 border border-gray-200 rounded-lg p-5 relative flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-3">Your Wallet</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-md bg-teal-100 flex items-center justify-center">
                <span className="text-teal-600"><Icon name="wallet" /></span>
              </div>
              <span className="text-sm font-bold text-gray-800">Fixam Coins</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{walletBalance.toLocaleString()} XAF</h3>
          </div>
          
          <div className="border-t border-gray-200 pt-4 flex flex-col items-center justify-center">
            <button 
              className="w-12 h-12 rounded-full bg-[#14B8A6] flex items-center justify-center text-white hover:bg-[#0F9788] transition-colors shadow-md hover:shadow-lg mb-2" 
              onClick={() => setActiveTab('Wallet')}
            >
              <span className="text-2xl leading-none">+</span>
            </button>
            <span className="text-xs font-bold text-[#14B8A6]">Top Up</span>
          </div>
        </div>
      </div>

      <CreateTaskModal 
        isOpen={showTaskModal} 
        onClose={() => setShowTaskModal(false)} 
        onSuccess={(newJob) => {
          if (setClientTasks) {
            setClientTasks([newJob, ...clientTasks]);
          }
          setActiveTab('My Tasks');
        }}
      />

      {/* 1. Top Categories Carousel (App-style cards) */}
      <div className="mb-10 relative group">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Popular Categories</h2>
          <button className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F9788] transition-colors" onClick={() => setActiveTab('Find Services')}>
            View all
          </button>
        </div>
        
        {/* Left Scroll Arrow */}
        <button 
          className="absolute left-0 top-[55%] -translate-y-1/2 -ml-4 w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-teal-50"
          onClick={() => {
            const container = document.getElementById('categories-scroll-container');
            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>

        <div id="categories-scroll-container" className="flex gap-4 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
          {services.map(service => (
            <button
              key={service.id}
              className="flex-shrink-0 flex flex-col group cursor-pointer snap-start bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left overflow-hidden"
              onClick={() => {
                localStorage.setItem('fixam_search_cat', service.title);
                setActiveTab('Find Services');
              }}
              style={{ width: '180px', height: '160px' }}
            >
              <div className="w-full h-[110px] overflow-hidden bg-gray-100 relative">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-3 w-full flex-grow flex items-center">
                <span className="font-bold text-gray-800 text-sm group-hover:text-teal-600 transition-colors line-clamp-1">{service.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Scroll Arrow */}
        <button 
          className="absolute right-0 top-[55%] -translate-y-1/2 -mr-4 w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-teal-50"
          onClick={() => {
            const container = document.getElementById('categories-scroll-container');
            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* Projects Showcase Section (matching mobile app) */}
      {portfolioProjects.length > 0 && (
        <div className="mb-10 relative group">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Projects</h2>
            <button className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F9788] transition-colors" onClick={() => setActiveTab('Find Services')}>
              See All
            </button>
          </div>

          {/* Left Scroll Arrow */}
          <button
            className="absolute left-0 top-[55%] -translate-y-1/2 -ml-4 w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-teal-50"
            onClick={() => {
              const container = document.getElementById('projects-scroll-container');
              if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>

          <div id="projects-scroll-container" className="flex gap-4 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
            {portfolioProjects.map((project, idx) => {
              const imgSrc = getMediaUrl(project.imageUrl) || 'https://via.placeholder.com/300x180?text=Project';
              const prov = project.provider;
              const ratingVal = Number(prov.rating || 4.8).toFixed(1);
              const reviewCount = prov.reviewCount || 0;
              const priceDisplay = project.price ? `XAF ${Number(project.price).toLocaleString()}` : null;

              return (
                <div
                  key={project.id || idx}
                  className="flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer snap-start overflow-hidden group/card"
                  style={{ width: '260px' }}
                  onClick={() => {
                    if (setSelectedProject) {
                      const providerObj = displayedPros.find(p => p.originalData?.id === prov.id);
                      setSelectedProject({
                        ...project,
                        provider: {
                          ...prov,
                          avatar: providerObj?.image || prov.avatar || ''
                        }
                      });
                    }
                  }}
                >
                  {/* Project Image */}
                  <div className="relative w-full h-[160px] overflow-hidden bg-gray-100">
                    <img
                      src={imgSrc}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x180?text=Project';
                      }}
                    />
                    {/* Like Button */}
                    <button
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (toggleFavoriteProject) toggleFavoriteProject(project.id);
                      }}
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill={favoriteProjectIds.includes(project.id) ? "#EF4444" : "none"} 
                        stroke={favoriteProjectIds.includes(project.id) ? "#EF4444" : "currentColor"} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-3">
                    <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">{project.title}</h4>
                    {project.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{project.description}</p>
                    )}
                    {project.category && (
                      <span className="text-[11px] font-semibold text-[#14B8A6] mb-2 block">{project.category}</span>
                    )}

                    {/* Rating & Price Footer */}
                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <span className="text-sm font-bold text-gray-800">{ratingVal}</span>
                        <span className="text-xs text-gray-400">({reviewCount})</span>
                      </div>
                      {priceDisplay && (
                        <span className="text-xs text-gray-500">
                          From <span className="font-bold text-gray-800">{priceDisplay}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Scroll Arrow */}
          <button
            className="absolute right-0 top-[55%] -translate-y-1/2 -mr-4 w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-teal-50"
            onClick={() => {
              const container = document.getElementById('projects-scroll-container');
              if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}

      {/* 2. Recommended For You (No box, larger profiles) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">🎯</span>
          <h2 className="text-xl font-bold text-gray-800">Recommended for You</h2>
        </div>
        <div className="flex flex-wrap gap-6">
          {displayedPros.slice(0, 5).map((pro, idx) => {
            const roleArray = pro.role ? pro.role.split(',').map((s: string) => s.trim()) : [];
            const displayRole = roleArray.length > 0 ? roleArray[0] : 'Service Provider';
            return (
              <div className="flex flex-col items-center text-center group cursor-pointer bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5" key={idx} onClick={() => { setSelectedProvider(pro); setActiveTab('Provider Profile'); }} style={{ width: '170px' }}>
                <div className="relative mb-4">
                  {pro.image ? (
                    <img 
                      src={getMediaUrl(pro.image)} 
                      alt={pro.name || 'Provider'} 
                      className="w-24 h-24 rounded-full object-cover shadow-inner group-hover:ring-4 ring-teal-50 transition-all" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name || 'Provider')}&background=14B8A6&color=fff&size=96&rounded=true`;
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full shadow-inner bg-teal-500 text-white flex items-center justify-center font-bold text-3xl group-hover:ring-4 ring-teal-50 transition-all">
                      {(pro.name || 'Provider').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <button className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow border border-gray-50 text-gray-300 hover:text-[#F59E0B] hover:scale-110 transition z-10" onClick={(e) => { e.stopPropagation(); alert(`${pro.name} saved!`); }}>
                    <Icon name="star" />
                  </button>
                </div>
                <h4 className="text-[15px] font-bold text-gray-800 mb-1 group-hover:text-teal-600 transition-colors line-clamp-1 w-full">{pro.name || 'Provider'}</h4>
                <span className="block text-[11px] uppercase font-bold tracking-wider text-gray-500 mb-2 line-clamp-1 w-full" title={displayRole}>{displayRole}</span>
                <div className="flex items-center justify-center gap-1 text-sm bg-orange-50 px-2 py-1 rounded-full text-[#F59E0B]">
                  <Icon name="star" />
                  <span className="font-bold">{pro.rating}</span>
                  <span className="text-orange-400 text-xs ml-1">({pro.originalData?.reviewsCount || 0})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bookings (Full width at bottom) */}
      <div className="mb-6 w-full pb-16">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <h2 className="text-xl font-bold text-gray-800">Your Bookings</h2>
          </div>
          <button className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F9788] transition-colors" onClick={() => setActiveTab('My Bookings')}>
            View Full Calendar
          </button>
        </div>
        
        <div className="w-full">
          {(() => {
            const formatCardDate = (dateStr: string) => {
              if (!dateStr || dateStr === 'TBD') {
                return { month: 'TBD', day: '', full: 'TBD' };
              }
              const d = new Date(dateStr);
              if (isNaN(d.getTime())) {
                const parts = dateStr.split(' ');
                return {
                  month: parts[0] || 'TBD',
                  day: parts.slice(1).join(' ') || '',
                  full: dateStr
                };
              }
              return {
                month: d.toLocaleDateString('en-US', { month: 'short' }),
                day: d.getDate().toString(),
                full: d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
              };
            };

            const activeBookings = clientBookings.filter(bk => bk.status !== 'Completed' && bk.status !== 'Cancelled' && bk.status !== 'COMPLETED' && bk.status !== 'CANCELLED');
            return activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map((bk) => {
                  const displayDate = bk.date || bk.scheduledDate || bk.createdAt || 'TBD';
                  const dateInfo = formatCardDate(displayDate);
                  
                  return (
                  <div 
                    key={bk.id || bk._id}
                    onClick={() => {
                      if (setSelectedBooking) setSelectedBooking(bk);
                      setActiveTab('Booking Details');
                    }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 mb-4 bg-white border border-gray-200 rounded-xl cursor-pointer relative transition-all duration-200 hover:border-[#14B8A6] hover:shadow-md hover:shadow-teal-50/50"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 sm:static sm:ml-auto sm:order-last">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        bk.status === 'Confirmed' || bk.status === 'ACCEPTED' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : (bk.status === 'Pending' || bk.status === 'PENDING') 
                            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                            : 'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}>
                        {bk.status || 'PENDING'}
                      </span>
                    </div>

                    {/* Date Block */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl w-16 h-16 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-red-500 uppercase tracking-wide">
                        {dateInfo.month}
                      </span>
                      <span className="text-xl font-black text-slate-800 -mt-0.5">
                        {dateInfo.day || <Icon name="calendar" />}
                      </span>
                    </div>
                    
                    {/* Content Details */}
                    <div className="flex-1 min-w-0 pr-12 sm:pr-0 w-full">
                      <h4 className="font-bold text-base sm:text-lg text-slate-800 mb-1 truncate">
                        {bk.service || bk.title || 'Service'}
                      </h4>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs sm:text-sm text-slate-500 mb-2">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Icon name="calendar" /> 
                          {dateInfo.full}
                          {bk.time ? ` at ${bk.time}` : ''}
                        </span>
                        {bk.budget && (
                          <span className="flex items-center gap-1.5 font-bold text-slate-700">
                            <Icon name="wallet" /> 
                            {bk.budget} {bk.budget.toString().includes('XAF') ? '' : 'XAF'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {(() => {
                          const pName = typeof bk.provider === 'string' ? bk.provider : 
                            (bk.provider?.fullName || bk.provider?.name || `${bk.provider?.firstName || ''} ${bk.provider?.lastName || ''}`.trim() || 
                            (bk.providerDetails ? `${bk.providerDetails.firstName || ''} ${bk.providerDetails.lastName || ''}`.trim() : 'Unassigned')) || 'Unassigned';
                          const pAvatar = bk.provider?.avatar || bk.providerDetails?.avatar;
                          
                          if (pName === 'Unassigned') {
                            return (
                              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 italic">
                                <div className="w-6 h-6 rounded-full bg-slate-50 border border-dashed border-slate-300"></div>
                                No provider assigned yet
                              </div>
                            );
                          }
                          return (
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                              {pAvatar ? (
                                <img src={getMediaUrl(pAvatar)} alt={pName} className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-[10px]">
                                  {pName.substring(0,2).toUpperCase()}
                                </div>
                              )}
                              <span>{pName}</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-3">You have no active bookings.</p>
                <button className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F9788]" onClick={() => setActiveTab('Find Services')}>Browse Services</button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
