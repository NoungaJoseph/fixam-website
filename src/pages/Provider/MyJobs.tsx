import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import ReviewModal from '../../components/ReviewModal';

interface MyJobsProps {
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function MyJobs({ setActiveTab, setActiveChatUser }: MyJobsProps) {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get('/jobs/my-jobs');
        setJobs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch my jobs", err);
      }
    };
    fetchMyJobs();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/jobs/${id}/status`, { status });
      setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
      alert(`Job marked as ${status} successfully!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update job status');
    }
  };

  const activeCount = jobs.filter(j => j.status !== 'COMPLETED' && j.status !== 'CANCELLED').length;

  const [reviewTarget, setReviewTarget] = useState<{ jobId: string; targetUserId: string; targetName: string } | null>(null);

  return (
    <div className="max-w-7xl mx-auto w-full pt-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Jobs & Contracts</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your active contracts, client communication, and statuses.</p>
        </div>
        <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-2 text-sm font-bold text-[#14B8A6]">
          Total active: {activeCount}
        </div>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500 font-medium">No jobs or contracts found.</p>
          </div>
        ) : (
          jobs.map((job) => {
            const clientObj = job.client || {};
            const clientName = clientObj.fullName || `${clientObj.firstName || ''} ${clientObj.lastName || ''}`.trim() || 'Client';
            const clientUserId = clientObj.id || clientObj.userId || job.clientId || '';
            const initials = clientName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
            const isCompleted = job.status === 'COMPLETED';
            const isInProgress = job.status === 'IN_PROGRESS' || job.status === 'ASSIGNED';
            
            return (
              <div 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-white border border-gray-200 rounded-xl transition-all duration-200 hover:border-[#14B8A6] hover:shadow-md hover:shadow-teal-50/20" 
                key={job.id}
              >
                {/* Client Avatar Initials */}
                <div className="w-12 h-12 rounded-full bg-teal-50 text-[#14B8A6] border border-teal-100 flex items-center justify-center font-bold text-base flex-shrink-0">
                  {initials || 'C'}
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider border ${
                      isCompleted 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : isInProgress 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                    }`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-800 truncate">{job.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">Client: <strong className="text-gray-600 font-semibold">{clientName}</strong></p>
                  <p className="text-xs text-gray-400 mt-0.5">Payout: <span className="text-[#14B8A6] font-bold">{job.budget ? `${job.budget.toLocaleString()} XAF` : 'Negotiable'}</span></p>
                </div>
                
                {/* Mid info & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-xs text-gray-400 font-medium">
                    📅 {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="px-4 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-55 text-gray-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                      onClick={() => {
                        setActiveTab('Messages');
                        setActiveChatUser(clientName);
                      }}
                    >
                      💬 Chat
                    </button>
                    {isInProgress && (
                      <button
                        onClick={() => handleUpdateStatus(job.id, 'COMPLETED')}
                        className="bg-[#14B8A6] hover:bg-[#0F9788] text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm"
                      >
                        ✓ Complete
                      </button>
                    )}
                    {isCompleted && clientUserId && (
                      <button
                        onClick={() => setReviewTarget({ jobId: job.id, targetUserId: clientUserId, targetName: clientName })}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition shadow-sm"
                      >
                        ⭐ Review
                      </button>
                    )}
                    {!isCompleted && job.status !== 'CANCELLED' && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this job?')) {
                            handleUpdateStatus(job.id, 'CANCELLED');
                          }
                        }}
                        className="text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 text-xs font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {reviewTarget && (
        <ReviewModal
          isOpen={Boolean(reviewTarget)}
          onClose={() => setReviewTarget(null)}
          jobId={reviewTarget.jobId}
          targetUserId={reviewTarget.targetUserId}
          targetName={reviewTarget.targetName}
        />
      )}
    </div>
  );
}
