import { Icon, IconName } from '../../App';
import { useAuth } from '../../context/AuthContext';

interface ProviderDashboardProps {
  setActiveTab: (tab: string) => void;
  onRoleChange?: (role: 'client' | 'pro') => void;
  leads: any[];
  activeProposals: any[];
  ActivityCard: React.ComponentType;
  ImageSlot: React.ComponentType<any>;
}

export default function ProviderDashboard({
  setActiveTab,
  onRoleChange,
  leads,
  activeProposals,
}: ProviderDashboardProps) {
  const { user } = useAuth();
  
  return (
    <div className="max-w-7xl mx-auto w-full pt-6">
      {/* Greeting row */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.firstName || 'Pro'}! 🚀</h1>
          <p className="text-sm text-gray-500">What would you like to do today?</p>
        </div>
        {onRoleChange && (
          <button 
            className="bg-[#14B8A6] text-white text-sm px-4 py-2 rounded font-medium hover:bg-[#0F9788] transition flex items-center gap-2 w-full md:w-auto justify-center"
            onClick={() => onRoleChange('client')}
          >
            <Icon name="user" />
            Switch to Client View
          </button>
        )}
      </div>

      {/* Metric Cards Section */}
      <div className="dash-metrics-grid mb-8">
        <div className="metric-card-premium m-coins" onClick={() => setActiveTab('Wallet')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Total Earnings</span>
            <div className="metric-icon-box"><Icon name="wallet" /></div>
          </div>
          <strong className="metric-big-num">85,000 XAF</strong>
          <span className="metric-card-desc">Cash received from 28 jobs</span>
        </div>

        <div className="metric-card-premium m-active" onClick={() => setActiveTab('My Jobs')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Active Jobs</span>
            <div className="metric-icon-box"><Icon name="briefcase" /></div>
          </div>
          <strong className="metric-big-num">3</strong>
          <span className="metric-card-desc">Ongoing contracts</span>
        </div>

        <div className="metric-card-premium m-completed" onClick={() => setActiveTab('My Jobs')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Completed Jobs</span>
            <div className="metric-icon-box"><Icon name="check" /></div>
          </div>
          <strong className="metric-big-num">28</strong>
          <span className="metric-card-desc">Successfully finished</span>
        </div>

        <div className="metric-card-premium m-saved" onClick={() => setActiveTab('Reviews')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Average Rating</span>
            <div className="metric-icon-box"><Icon name="star" /></div>
          </div>
          <strong className="metric-big-num">4.9</strong>
          <span className="metric-card-desc">From client reviews</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 pb-16">
        {/* Left column (wider) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Leads List table */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <h2 className="text-lg font-bold text-gray-800">Job Leads Near You</h2>
              </div>
              <button className="text-xs font-semibold text-[#14B8A6] hover:text-[#0F9788]" onClick={() => setActiveTab('Job Leads')}>Filter Leads</button>
            </div>
            
            <div className="flex gap-4 border-b border-gray-100 mb-5 pb-2 text-sm">
              <span className="font-bold text-[#14B8A6] border-b-2 border-[#14B8A6] pb-2 cursor-pointer">All Leads (3)</span>
              <span className="text-gray-500 hover:text-gray-800 cursor-pointer">Plumbing (1)</span>
              <span className="text-gray-500 hover:text-gray-800 cursor-pointer">Electrical (1)</span>
              <span className="text-gray-500 hover:text-gray-800 cursor-pointer">Cleaning (1)</span>
            </div>

            <div className="space-y-4">
              {leads.map((lead) => (
                <div 
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl transition-all duration-200 hover:border-[#14B8A6] hover:shadow-sm" 
                  key={lead.title}
                >
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                    <img src={lead.image} alt={lead.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <span className="text-[10px] font-extrabold text-[#14B8A6] uppercase bg-teal-50/60 border border-teal-100 px-2 py-0.5 rounded-md tracking-wider">{lead.tag}</span>
                    <h3 className="text-sm font-bold text-gray-800 mt-1.5 truncate">{lead.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <span>📍 Nearby • 2.4 km away</span>
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <strong className="text-sm font-extrabold text-gray-900">{lead.price}</strong>
                    <button 
                      className="bg-[#14B8A6] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#0F9788] transition shadow-sm"
                      onClick={() => alert(`Proposal submitted for: ${lead.title}`)}
                    >
                      Send Proposal
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F9788]" onClick={() => setActiveTab('Job Leads')}>View All Leads →</button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
            <span className="text-xs font-bold text-teal-100 uppercase tracking-wider block mb-1">Total Earnings Tracked</span>
            <strong className="text-3xl font-black block mb-2">85,000 XAF</strong>
            <p className="text-xs text-teal-50/80 mb-5 leading-relaxed">Cash payments received from 28 completed jobs</p>
            <button className="bg-white text-[#14B8A6] text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm" onClick={() => setActiveTab('Wallet')}>View Job History →</button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">💼</span>
              <h2 className="text-lg font-bold text-gray-800">New Client Proposals</h2>
            </div>
            <div className="space-y-4">
              {activeProposals.map((proposal) => (
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-gray-300 transition-all duration-200" key={proposal.name}>
                  <div className="flex items-center gap-3 mb-3">
                    <img src={proposal.image} alt={proposal.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between w-full gap-2">
                        <h3 className="text-sm font-bold text-gray-800 truncate">{proposal.name}</h3>
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5"><Icon name="star" /> {proposal.rating}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{proposal.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button 
                      className="flex-1 bg-[#14B8A6] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#0F9788] transition shadow-sm"
                      onClick={() => alert(`Accepted proposal from ${proposal.name}`)}
                    >
                      Accept
                    </button>
                    <button 
                      className="flex-1 border border-gray-250 text-gray-700 text-xs font-semibold py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition"
                      onClick={() => alert(`Declined proposal from ${proposal.name}`)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
