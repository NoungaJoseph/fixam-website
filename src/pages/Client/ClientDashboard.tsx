import { useState } from 'react';
import { Icon } from '../../App';
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
  services: Service[];
  displayedPros: Provider[];
  clientBookings: any[];
  walletBalance?: number;
  setSelectedBooking?: (booking: any) => void;
}

export default function ClientDashboard({
  setActiveTab,
  setSelectedProvider,
  services,
  displayedPros,
  clientBookings,
  walletBalance = 0,
  setSelectedBooking,
}: ClientDashboardProps) {
  const { user } = useAuth();
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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

      <CreateTaskModal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} />

      {/* 1. Top Categories Carousel (No box) */}
      <div className="mb-10 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Top Categories</h2>
          <button className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F9788] transition-colors" onClick={() => setActiveTab('Find Services')}>
            View All
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
          {services.map(service => (
            <button
              key={service.id}
              className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer snap-start bg-transparent border-none outline-none"
              onClick={() => {
                localStorage.setItem('fixam_search_cat', service.title);
                setActiveTab('Find Services');
              }}
              style={{ width: '110px' }}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-shadow group-hover:ring-4 ring-teal-50">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-gray-800 text-sm text-center group-hover:text-teal-600 transition-colors line-clamp-2">{service.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Recommended For You (No box, larger profiles) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">🎯</span>
          <h2 className="text-xl font-bold text-gray-800">Recommended for You</h2>
        </div>
        <div className="flex flex-wrap gap-8">
          {displayedPros.slice(0, 5).map((pro, idx) => {
            const roleArray = pro.role ? pro.role.split(',').map((s: string) => s.trim()) : [];
            const displayRole = roleArray.length > 0 ? roleArray[0] : 'Service Provider';
            return (
              <div className="flex flex-col items-center text-center group cursor-pointer" key={idx} onClick={() => { setSelectedProvider(pro); setActiveTab('Provider Profile'); }} style={{ width: '140px' }}>
                <div className="relative mb-3">
                  {pro.image ? (
                    <img 
                      src={pro.image.startsWith('http') ? pro.image : `http://localhost:5000${pro.image}`} 
                      alt={pro.name || 'Provider'} 
                      className="w-28 h-28 rounded-full object-cover shadow-sm group-hover:shadow-md transition-shadow group-hover:ring-4 ring-teal-50" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name || 'Provider')}&background=14B8A6&color=fff&size=112&rounded=true`;
                      }}
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full shadow-sm bg-teal-500 text-white flex items-center justify-center font-bold text-4xl group-hover:shadow-md transition-shadow group-hover:ring-4 ring-teal-50">
                      {(pro.name || 'Provider').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <button className="absolute top-0 right-0 bg-white rounded-full p-1.5 shadow-sm text-gray-300 hover:text-[#F59E0B] transition z-10" onClick={(e) => { e.stopPropagation(); alert(`${pro.name} saved!`); }}>
                    <Icon name="star" />
                  </button>
                </div>
                <h4 className="text-base font-bold text-gray-800 mb-1 group-hover:text-teal-600 transition-colors line-clamp-1 w-full">{pro.name || 'Provider'}</h4>
                <span className="block text-[11px] uppercase font-bold tracking-wider text-gray-500 mb-1 line-clamp-1 w-full" title={displayRole}>{displayRole}</span>
                <div className="flex items-center justify-center gap-1 text-sm text-[#F59E0B]">
                  <Icon name="star" />
                  <span className="font-bold text-gray-700">{pro.rating}</span>
                  <span className="text-gray-400 text-xs">({pro.originalData?.reviewsCount || 0})</span>
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
        
        <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          {(() => {
            const activeBookings = clientBookings.filter(bk => bk.status !== 'Completed' && bk.status !== 'Cancelled' && bk.status !== 'COMPLETED' && bk.status !== 'CANCELLED');
            return activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map((bk) => {
                  const displayDate = bk.date || bk.scheduledDate || bk.createdAt || 'TBD';
                  const parts = displayDate.split(' ');
                  const part1 = parts[0] || 'TBD';
                  const part2 = parts[1] || '';
                  
                  return (
                  <div 
                    key={bk.id || bk._id}
                    onClick={() => {
                      if (setSelectedBooking) setSelectedBooking(bk);
                      setActiveTab('Booking Details');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      padding: '1.25rem 1.5rem',
                      marginBottom: '1rem',
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#14B8A6';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                    }}
                  >
                    {/* Status Badge */}
                    <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                        <span style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 800, 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            backgroundColor: bk.status === 'Confirmed' || bk.status === 'ACCEPTED' ? '#DCFCE7' : (bk.status === 'Pending' || bk.status === 'PENDING') ? '#FEF9C3' : '#F1F5F9',
                            color: bk.status === 'Confirmed' || bk.status === 'ACCEPTED' ? '#166534' : (bk.status === 'Pending' || bk.status === 'PENDING') ? '#854D0E' : '#475569'
                        }}>
                          {bk.status || 'PENDING'}
                        </span>
                    </div>

                    {/* Date Block */}
                    <div style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #F1F5F9',
                      borderRadius: '12px',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>{part1}</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', marginTop: '-4px' }}>{part2 || <Icon name="calendar" />}</span>
                    </div>
                    
                    <div style={{ flex: 1, paddingRight: '4rem' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A', margin: '0 0 0.35rem 0' }}>{bk.service || bk.title || 'Service'}</h4>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '0.9rem', color: '#64748B', marginBottom: '0.75rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}><Icon name="calendar" /> {displayDate} {bk.time ? `at ${bk.time}` : ''}</span>
                        {bk.budget && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#334155' }}><Icon name="wallet" /> {bk.budget} {bk.budget.toString().includes('XAF') ? '' : 'XAF'}</span>}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {(() => {
                          const pName = typeof bk.provider === 'string' ? bk.provider : 
                            (bk.provider?.fullName || bk.provider?.name || `${bk.provider?.firstName || ''} ${bk.provider?.lastName || ''}`.trim() || 
                            (bk.providerDetails ? `${bk.providerDetails.firstName || ''} ${bk.providerDetails.lastName || ''}`.trim() : 'Unassigned')) || 'Unassigned';
                          const pAvatar = bk.provider?.avatar || bk.providerDetails?.avatar;
                          
                          if (pName === 'Unassigned') {
                            return (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 500, color: '#94A3B8', fontStyle: 'italic' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#F1F5F9', border: '1px dashed #CBD5E1' }}></div>
                                No provider assigned yet
                              </div>
                            );
                          }
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                              {pAvatar ? (
                                <img src={pAvatar.startsWith('http') ? pAvatar : `http://localhost:5000${pAvatar}`} alt={pName} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#14B8A6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem' }}>
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
