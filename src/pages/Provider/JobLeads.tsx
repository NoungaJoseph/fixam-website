import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Icon } from '../../App';

export default function JobLeads() {
  const [filterTag, setFilterTag] = useState('All');
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/available');
        setLeads(res.data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch available jobs", err);
      }
    };
    fetchJobs();
  }, []);

  const handleSendProposal = async (jobId: string, title: string) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      alert(`Proposal submitted successfully for task: "${title}"`);
      // remove from list optimistically
      setLeads(prev => prev.filter(l => l.id !== jobId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit proposal');
    }
  };

  const filtered = filterTag === 'All' ? leads : leads.filter(l => l.serviceCategory === filterTag || l.tag === filterTag);

  return (
    <div className="max-w-7xl mx-auto w-full pt-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Job Leads Near You</h2>
          <p className="text-sm text-gray-500 mt-1">Browse available client tasks in your area and send proposals.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Plumbing', 'Electrical', 'Cleaning', 'Repairs'].map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all duration-200 ${
                filterTag === tag 
                  ? 'bg-[#14B8A6] text-white shadow-sm shadow-teal-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500 font-medium">No available jobs found in this category.</p>
          </div>
        ) : (
          filtered.map((lead) => (
            <div 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-white border border-gray-200 rounded-xl transition-all duration-200 hover:border-[#14B8A6] hover:shadow-md hover:shadow-teal-50/30" 
              key={lead.id}
            >
              <div className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center text-xl">
                {lead.serviceCategory === 'Plumbing' ? '🪠' : lead.serviceCategory === 'Electrical' ? '⚡' : lead.serviceCategory === 'Cleaning' ? '🧹' : '💼'}
              </div>
              
              <div className="flex-1 min-w-0 w-full">
                <span className="text-[10px] font-extrabold text-[#14B8A6] uppercase bg-teal-50/60 border border-teal-100 px-2 py-0.5 rounded-md tracking-wider">
                  {lead.serviceCategory || lead.tag}
                </span>
                <h3 className="text-base font-bold text-gray-800 mt-2">{lead.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1.5 font-medium">
                  <span>📍 {lead.location || 'Cameroon'}</span>
                  <span>•</span>
                  <span>📅 {new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider mb-0.5">Est. Budget</span>
                  <strong className="text-lg font-black text-gray-800">{lead.budget ? `${lead.budget.toLocaleString()} XAF` : lead.price}</strong>
                </div>
                <button
                  className="bg-[#14B8A6] hover:bg-[#0F9788] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
                  onClick={() => handleSendProposal(lead.id, lead.title)}
                >
                  Send Proposal
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
