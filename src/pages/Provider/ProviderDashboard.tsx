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
  ActivityCard,
  ImageSlot
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

      {/* Metric Cards (like RecommendedCards) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          ['Total Earnings', '85,000 XAF', 'wallet', 'bg-teal-50', 'text-teal-600', 'bg-teal-50/50'],
          ['Active Jobs', '3', 'briefcase', 'bg-blue-50', 'text-blue-600', 'bg-blue-50/50'],
          ['Completed Jobs', '28', 'check', 'bg-green-50', 'text-green-600', 'bg-green-50/50'],
          ['Average Rating', '4.9', 'star', 'bg-orange-50', 'text-orange-600', 'bg-orange-50/50'],
        ].map(([title, value, icon, iconBg, iconColor, cardBg]) => (
          <div key={title} className={`${cardBg} border border-gray-200 rounded-lg p-5 relative`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-md ${iconBg} flex items-center justify-center`}>
                <span className={iconColor}><Icon name={icon as IconName} /></span>
              </div>
              <span className="text-sm font-bold text-gray-800">{title}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8 pb-16">
        {/* Left column (wider) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Leads List table */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
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
                <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0" key={lead.title}>
                  <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <img src={lead.image} alt={lead.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-[#14B8A6] uppercase bg-teal-50 px-2 py-0.5 rounded">{lead.tag}</span>
                    <h3 className="text-sm font-bold text-gray-800 mt-1">{lead.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Nearby • 2.4 km away</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <strong className="text-sm text-gray-900">{lead.price}</strong>
                    <button 
                      className="bg-[#14B8A6] text-white text-xs px-3 py-1.5 rounded hover:bg-[#0F9788] transition"
                      onClick={() => alert(`Proposal submitted for: ${lead.title}`)}
                    >
                      Send Proposal
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F9788]" onClick={() => setActiveTab('Job Leads')}>View All Leads →</button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] text-white rounded-lg p-6 shadow-sm">
            <span className="text-xs font-medium text-teal-100">Total Earnings Tracked</span>
            <strong className="text-3xl font-black block mt-1 mb-2">85,000 XAF</strong>
            <p className="text-xs text-teal-100 mb-4">Cash received from 28 jobs</p>
            <button className="bg-white text-[#14B8A6] text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-50 transition" onClick={() => setActiveTab('Wallet')}>View Job History →</button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💼</span>
              <h2 className="text-lg font-bold text-gray-800">New Client Proposals</h2>
            </div>
            <div className="space-y-4">
              {activeProposals.map((proposal) => (
                <div className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition" key={proposal.name}>
                  <div className="flex items-center gap-3 mb-3">
                    <img src={proposal.image} alt={proposal.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center justify-between w-full gap-4">
                        <h3 className="text-sm font-bold text-gray-800">{proposal.name}</h3>
                        <span className="text-xs font-medium text-orange-500 flex items-center gap-1"><Icon name="star" /> {proposal.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{proposal.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 bg-[#14B8A6] text-white text-xs font-medium py-1.5 rounded hover:bg-[#0F9788] transition"
                      onClick={() => alert(`Accepted proposal from ${proposal.name}`)}
                    >
                      Accept
                    </button>
                    <button 
                      className="flex-1 border border-gray-200 text-gray-700 text-xs font-medium py-1.5 rounded hover:bg-gray-50 transition"
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
