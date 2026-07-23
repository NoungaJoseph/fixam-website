import { Icon, getMediaUrl } from '../../App';

interface TaskDetailsProps {
  task: any;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function TaskDetails({ task, setActiveTab, setActiveChatUser }: TaskDetailsProps) {
  if (!task) return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full">
      <p className="text-gray-500 mb-4">No task selected.</p>
      <button className="btn-primary-pill" onClick={() => setActiveTab('Dashboard')}>Back to Dashboard</button>
    </div>
  );

  const displayDate = new Date(task.createdAt || Date.now()).toLocaleDateString();
  const serviceTitle = task.title || 'General Task';
  const budget = task.budget || 'Open for bids';
  const description = task.description || 'No description provided.';
  const applicants = task.applicants || [];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition shadow-sm" onClick={() => setActiveTab('Dashboard')}>
          <Icon name="chevron-up" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Task Details</h1>
          <p className="text-sm text-gray-500">View information and applicants for your posted task</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <span className={`inline-block text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md mb-2 ${task.status === 'Completed' || task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : (task.status === 'Pending' || task.status === 'PENDING') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
              {task.status || 'OPEN'}
            </span>
            <h2 className="text-xl font-bold text-gray-900">{serviceTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">Posted on: {displayDate}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-gray-500 mb-1">Estimated Budget</p>
            <p className="text-2xl font-black text-[#14B8A6]">{budget} {budget.toString().includes('XAF') ? '' : 'XAF'}</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Task Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Location</h3>
              <div className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5"><Icon name="location" /></span>
                <p className="text-sm text-gray-800 font-medium">{task.location?.address || task.location || 'Address not provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Applicants ({applicants.length})</h3>
            {applicants.length > 0 ? (
              <div className="space-y-4">
                {applicants.map((applicant: any, idx: number) => {
                  const applicantName = typeof applicant === 'string' ? applicant : (applicant.fullName || `${applicant.firstName || ''} ${applicant.lastName || ''}`.trim() || 'Unknown Applicant');
                  const applicantAvatarUrl = applicant.avatar ? getMediaUrl(applicant.avatar) : '';
                  
                  return (
                    <div key={idx} className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 bg-white hover:border-teal-100 hover:shadow-sm transition">
                      {applicantAvatarUrl ? (
                        <img src={applicantAvatarUrl} alt={applicantName} className="w-12 h-12 rounded-full object-cover shadow-sm" onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(applicantName)}&background=14B8A6&color=fff&size=64&rounded=true`;
                        }} />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {applicantName.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">{applicantName}</h4>
                        <div className="flex gap-2 mt-2">
                          <button className="text-[10px] font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded transition" onClick={() => {
                            setActiveTab('Messages');
                            setActiveChatUser(applicantName);
                          }}>
                            Message
                          </button>
                          <button className="text-[10px] font-bold text-white bg-teal-600 hover:bg-teal-700 px-2 py-1 rounded transition">
                            Hire
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-gray-100 bg-gray-50 rounded-xl p-4 text-center py-8">
                <span className="text-2xl mb-2 block">🔍</span>
                <p className="text-sm text-gray-500 font-medium">No applicants yet.</p>
                <p className="text-xs text-gray-400 mt-1">Providers will show up here once they apply to your task.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
