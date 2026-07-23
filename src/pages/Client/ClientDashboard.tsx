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
  clientBookings: Booking[];
  walletBalance?: number;
}

export default function ClientDashboard({
  setActiveTab,
  setSelectedProvider,
  services,
  displayedPros,
  clientBookings,
  walletBalance = 0,
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

      <div className="grid lg:grid-cols-5 gap-8 pb-16">
        {/* Left column (wider) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* 1. Top Categories */}
          <div>
            <div className="bg-teal-50/60 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌟</span>
                  <h2 className="text-lg font-bold text-gray-800">Top Categories</h2>
                </div>
                <button className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1 bg-white hover:text-gray-600" onClick={() => setActiveTab('Find Services')}>
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {services.slice(0, 3).map(service => (
                  <div key={service.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col sm:flex-row hover:shadow-sm transition-shadow cursor-pointer" onClick={() => setActiveTab('Find Services')}>
                    <div className="sm:w-40 h-28 sm:h-auto flex-shrink-0">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            <span>{service.title}</span>
                          </div>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">Explore trusted professionals for your next project</h3>
                      </div>
                      <div className="mt-4 flex items-center justify-end">
                        <span className="text-xs font-semibold text-[#14B8A6] hover:text-[#0F9788]">View Services →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Recommended For You */}
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <h2 className="text-lg font-bold text-gray-800">Recommended for You</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {displayedPros.slice(0, 3).map((pro, idx) => {
                  const roleArray = pro.role ? pro.role.split(',').map(s => s.trim()) : [];
                  const displayRole = roleArray.slice(0, 2).join(', ') + (roleArray.length > 2 ? '...' : '');
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center relative group hover:shadow-sm transition-shadow" key={idx}>
                      <button className="absolute top-2 right-2 text-gray-300 hover:text-[#F59E0B] transition" onClick={() => alert(`${pro.name} saved!`)}>
                        <Icon name="star" />
                      </button>
                      <img src={pro.image} alt={pro.name} className="w-16 h-16 rounded-full mb-3 object-cover shadow-sm" />
                      <h4 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">{pro.name}</h4>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-[#14B8A6] bg-teal-50 px-2 py-0.5 rounded-full mb-2 line-clamp-1" title={pro.role}>{displayRole}</span>
                      <div className="flex items-center justify-center gap-1 text-xs text-[#F59E0B] mb-3">
                        <Icon name="star" />
                        <span className="font-medium text-gray-700">{pro.rating}</span>
                        <span className="text-gray-400">({Math.floor(Math.random() * 100 + 50)})</span>
                      </div>
                      <button className="w-full py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-xs rounded transition mt-auto" onClick={() => setSelectedProvider(pro)}>View Profile</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bookings */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📅</span>
              <h2 className="text-lg font-bold text-gray-800">Bookings</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              {(() => {
                const activeBookings = clientBookings.filter(bk => bk.status !== 'Completed' && bk.status !== 'Cancelled' && bk.status !== 'COMPLETED' && bk.status !== 'CANCELLED');
                return activeBookings.length > 0 ? (
                  <div className="space-y-4">
                    {activeBookings.map((bk) => (
                      <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0" key={bk.id}>
                        <div className="bg-teal-50 rounded-lg w-12 h-12 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-[#14B8A6] uppercase">{bk.date.split(' ')[0]}</span>
                          <span className="text-lg font-black text-[#14B8A6] leading-none -mt-1">{bk.date.split(' ')[1]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-800 text-sm">{bk.service}</h4>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${bk.status === 'Confirmed' || bk.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : (bk.status === 'Pending' || bk.status === 'PENDING') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                              {bk.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Icon name="calendar" /> {bk.date} at {bk.time}
                          </div>
                          <div className="text-xs font-medium text-gray-700">Provider: {bk.provider}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500 mb-3">You have no active bookings.</p>
                    <button className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F9788]" onClick={() => setActiveTab('Find Services')}>Browse Services</button>
                  </div>
                );
              })()}
            </div>
            <div className="mt-4 text-right">
              <button className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F9788] transition-colors" onClick={() => setActiveTab('My Bookings')}>
                View Full Calendar
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
