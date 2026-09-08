import './MyTasks.css';
import React, { useState } from 'react';
import { Icon, getMediaUrl } from '../../App';
import CreateTaskModal from './CreateTaskModal';
import ReviewModal from '../../components/ReviewModal';
import { api } from '../../services/api';

interface MyTasksProps {
  clientTasks: any[];
  setClientTasks: (tasks: any[]) => void;
  setActiveTab: (tab: string) => void;
  walletBalance?: number;
  clientBookings?: any[];
  savedProsState?: any[];
  setSelectedTask?: (task: any) => void;
  setSelectedBooking?: (bk: any) => void;
  setSelectedProvider?: (pro: any) => void;
  setActiveChatUser?: (user: any) => void;
}

export default function MyTasks({ clientTasks, setClientTasks, setActiveTab, walletBalance = 0, clientBookings = [], savedProsState = [], setSelectedTask, setSelectedBooking, setSelectedProvider, setActiveChatUser }: MyTasksProps) {
  const [isPostTaskOpen, setIsPostTaskOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{ jobId: string; targetUserId: string; targetName: string } | null>(null);
  const [viewOffersTask, setViewOffersTask] = useState<any | null>(null);
  const [hiringId, setHiringId] = useState<string | null>(null);

  const handleJobCreated = (newJob: any) => {
    setClientTasks([newJob, ...clientTasks]);
  };

  const openOffersProviderProfile = (assignment: any) => {
    if (!setSelectedProvider) return;
    const pro = assignment.provider || {};
    const proUser = pro.user || {};
    const pName = proUser.fullName || `${proUser.firstName || ''} ${proUser.lastName || ''}`.trim() || 'Service Specialist';
    const pAvatar = proUser.avatar ? getMediaUrl(proUser.avatar) : '';
    const providerData = {
      id: pro.id || assignment.providerId,
      userId: proUser.id || pro.userId || assignment.providerId,
      name: pName,
      avatar: pAvatar,
      image: pAvatar,
      role: pro.skills?.[0] || pro.role || 'Service Provider',
      skills: pro.skills || [],
      bio: pro.bio,
      rate: pro.rate || assignment.proposedBudget,
      rating: pro.rating || '5.0',
      isVerified: pro.verification === 'VERIFIED',
      originalData: {
        ...pro,
        user: proUser,
        id: pro.id || assignment.providerId,
        userId: proUser.id || pro.userId
      }
    };
    setViewOffersTask(null);
    setSelectedProvider(providerData);
    setActiveTab('Provider Profile');
  };

  const activeTasksCount = clientTasks.filter((t: any) => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
  const completedCount = clientTasks.filter((t: any) => t.status === 'COMPLETED').length;

  return (
    <div className="my-tasks-tab-wrapper animate-fade-in">
      {/* Stats Cards Section - 3 up, 2 down with space */}
      <div className="dash-metrics-grid">
        <div className="metric-card-premium m-bookings" onClick={() => setActiveTab('My Bookings')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Bookings</span>
            <div className="metric-icon-box"><Icon name="calendar" /></div>
          </div>
          <strong className="metric-big-num">{clientBookings.length}</strong>
          <span className="metric-card-desc">Total Bookings</span>
        </div>

        <div className="metric-card-premium m-active" onClick={() => setActiveTab('My Tasks')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Active Tasks</span>
            <div className="metric-icon-box"><Icon name="briefcase" /></div>
          </div>
          <strong className="metric-big-num">{activeTasksCount}</strong>
          <span className="metric-card-desc">In Progress/Pending</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>

        <div className="metric-card-premium m-completed">
          <div className="metric-card-header">
            <span>Completed</span>
            <div className="metric-icon-box"><Icon name="check" /></div>
          </div>
          <strong className="metric-big-num">{completedCount}</strong>
          <span className="metric-card-desc">Jobs Completed</span>
        </div>

        <div className="metric-card-premium m-coins" onClick={() => setActiveTab('Wallet & Coins')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Coins Balance</span>
            <div className="metric-icon-box"><Icon name="wallet" /></div>
          </div>
          <strong className="metric-big-num">{walletBalance.toLocaleString()}</strong>
          <span className="metric-card-desc">Available Coins</span>
          <button className="coins-plus-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet & Coins'); }}>+</button>
        </div>

        <div className="metric-card-premium m-saved" onClick={() => setActiveTab('Saved Providers')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Saved Providers</span>
            <div className="metric-icon-box"><Icon name="star" /></div>
          </div>
          <strong className="metric-big-num">{savedProsState.length}</strong>
          <span className="metric-card-desc">Saved</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-transparent border-0 p-0 w-full task-list-panel">
          <div className="dash-panel-header-new">
            <h2>My Posted Tasks</h2>
          </div>
          <div className="posted-tasks-list max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {clientTasks.map((tk) => {
              const tkId = tk.id || tk._id;
              const tag = tk.category?.name || tk.categoryId || 'General';
              const price = tk.budget ? `${tk.budget} XAF` : '';
              const bids = tk.applicationCount ?? tk.assignments?.length ?? tk.applications?.length ?? tk._count?.assignments ?? 0;
              const rawStatus = tk.status || 'PENDING';
              const isRejected = tk.approvalStatus === 'REJECTED' || rawStatus === 'REJECTED';
              const isPendingApproval = tk.approvalStatus === 'PENDING_APPROVAL';
              const isLive = (tk.approvalStatus === 'APPROVED' || !tk.approvalStatus) && (rawStatus === 'PENDING' || rawStatus === 'OPEN');
              const isAssigned = rawStatus === 'ASSIGNED' || rawStatus === 'IN_PROGRESS';
              const isCompleted = rawStatus === 'COMPLETED';
              const isCancelled = rawStatus === 'CANCELLED';

              let statusLabel = rawStatus;
              let statusClass = rawStatus.toLowerCase().replace(' ', '-');
              if (isRejected) {
                statusLabel = 'REJECTED';
                statusClass = 'rejected';
              } else if (isLive) {
                statusLabel = 'LIVE';
                statusClass = 'live';
              } else if (isPendingApproval) {
                statusLabel = 'PENDING APPROVAL';
                statusClass = 'pending-approval';
              }

              return (
              <div 
                className="task-detailed-card cursor-pointer hover:border-teal-300 transition-colors" 
                key={tkId}
                onClick={() => {
                  if (setSelectedTask) {
                    setSelectedTask(tk);
                    setActiveTab('Task Details');
                  } else if (setSelectedBooking) {
                    setSelectedBooking(tk);
                    setActiveTab('Booking Details');
                  }
                }}
              >
                <div className="task-card-header">
                  <span className="task-tag">{tag}</span>
                  {price && <strong className="task-price">{price}</strong>}
                </div>
                <h3>{tk.title}</h3>
                <div className="task-card-footer">
                  <span className={`task-status-pill ${statusClass}`}>
                    {statusClass === 'live' && <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', marginRight: '4px' }}></span>}
                    {statusLabel}
                  </span>
                  <span className="task-bids-count">
                    <Icon name="user" /> {bids} offers received
                  </span>
                </div>
                <div className="task-actions-row">
                  {bids > 0 && (
                    <button className="btn-view-offers" onClick={(e) => {
                      e.stopPropagation();
                      setViewOffersTask(tk);
                    }}>
                      View Offers ({bids})
                    </button>
                  )}
                  {isCompleted && (
                    <button className="btn-view-offers" style={{ backgroundColor: '#F59E0B', color: '#FFFFFF' }} onClick={(e) => {
                      e.stopPropagation();
                      const assignedPro = tk.assignments?.[0]?.provider?.user || tk.assignedTo || {};
                      const targetUserId = assignedPro.id || assignedPro.userId || tk.assignedProviderId;
                      const targetName = assignedPro.fullName || `${assignedPro.firstName || ''} ${assignedPro.lastName || ''}`.trim() || 'Assigned Provider';
                      if (!targetUserId) {
                        alert("No assigned provider record found for this completed task to review.");
                        return;
                      }
                      setReviewTarget({ jobId: tkId, targetUserId, targetName });
                    }}>
                      ⭐ Review
                    </button>
                  )}
                  {isRejected && (
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md" title={tk.rejectionReason || 'Task was rejected by administrator'}>
                      ❌ {tk.rejectionReason ? `Rejected: ${tk.rejectionReason}` : 'Rejected by Admin'}
                    </span>
                  )}
                  {isLive && (
                    <button 
                      className="btn-delete-task" 
                      style={{ backgroundColor: '#FFF1F2', color: '#E11D48', borderColor: '#FFE4E6' }}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to end this live task? It will stop showing on the provider dashboard.")) {
                          try {
                            await api.patch(`/jobs/${tkId}/status`, { status: 'CANCELLED' });
                            setClientTasks(clientTasks.map(t => (t.id || t._id) === tkId ? {...t, status: 'CANCELLED'} : t));
                          } catch (err) {
                            alert("Failed to end task");
                          }
                        }
                      }}
                    >
                      End Task
                    </button>
                  )}
                  {isPendingApproval && (
                    <button className="btn-delete-task" onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to cancel this pending task?")) {
                        try {
                          await api.patch(`/jobs/${tkId}/status`, { status: 'CANCELLED' });
                          setClientTasks(clientTasks.map(t => (t.id || t._id) === tkId ? {...t, status: 'CANCELLED'} : t));
                        } catch (err) {
                          alert("Failed to cancel task");
                        }
                      }
                    }}>Cancel Task</button>
                  )}
                </div>
              </div>
            )})}
          </div>
        </div>

        <div className="bg-transparent border-0 p-0 w-full flex flex-col">
          <div className="dash-panel-premium w-full h-full p-6 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
              <Icon name="briefcase" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Post a New Task</h3>
            <p className="text-gray-500 mb-6 max-w-sm">Need help with something? Create a new task to start receiving offers from verified professionals in your area.</p>
            <button className="bg-[#14B8A6] text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-[#0F9788] transition-colors" onClick={() => setIsPostTaskOpen(true)}>
              + Create Task
            </button>
          </div>
        </div>
      </div>
      
      <CreateTaskModal
        isOpen={isPostTaskOpen}
        onClose={() => setIsPostTaskOpen(false)}
        onSuccess={handleJobCreated}
      />

      {/* View Offers Modal */}
      {viewOffersTask && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewOffersTask(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Task Proposals / Offers</h3>
                <p className="text-xs text-gray-500 truncate max-w-md">{viewOffersTask.title}</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold" onClick={() => setViewOffersTask(null)}>✕</button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {(!viewOffersTask.assignments || viewOffersTask.assignments.length === 0) ? (
                <div className="text-center py-10 text-gray-500 text-sm">No proposals received yet.</div>
              ) : (
                viewOffersTask.assignments.map((assignment: any) => {
                  const proUser = assignment.provider?.user || {};
                  const proName = proUser.fullName || `${proUser.firstName || ''} ${proUser.lastName || ''}`.trim() || 'Professional';
                  
                  let mediaList = [];
                  if (Array.isArray(assignment.proposalMedia)) {
                    mediaList = assignment.proposalMedia;
                  } else if (typeof assignment.proposalMedia === 'string') {
                    try { mediaList = JSON.parse(assignment.proposalMedia); } catch (_) {}
                  }

                  return (
                    <div key={assignment.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div 
                          className={`flex items-center gap-3 ${setSelectedProvider ? 'cursor-pointer group' : ''}`}
                          onClick={() => openOffersProviderProfile(assignment)}
                          title={setSelectedProvider ? "View Profile" : undefined}
                        >
                          <img
                            src={getMediaUrl(proUser.avatar) || 'https://via.placeholder.com/48'}
                            alt={proName}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200 group-hover:ring-2 ring-teal-400 transition"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm group-hover:text-teal-600 transition">{proName}</h4>
                            <p className="text-xs text-gray-500">{assignment.provider?.serviceCategory || 'Service Professional'}</p>
                          </div>
                        </div>
                        {assignment.proposedBudget ? (
                          <div className="text-right">
                            <span className="text-[11px] text-gray-500 block">Proposed Price</span>
                            <span className="text-sm font-extrabold text-[#0D9488]">{Number(assignment.proposedBudget).toLocaleString()} XAF</span>
                          </div>
                        ) : null}
                      </div>

                      {assignment.coverLetter && (
                        <div className="p-3 bg-white rounded-lg border border-gray-100 text-xs text-gray-700 leading-relaxed">
                          <span className="block font-bold text-gray-900 mb-1">Cover Note:</span>
                          {assignment.coverLetter}
                        </div>
                      )}

                      {mediaList.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-gray-700 block">Attached CV / Portfolio Documents:</span>
                          <div className="flex flex-wrap gap-2">
                            {mediaList.map((media: any, mIdx: number) => {
                              const rawUrl = media?.url || (typeof media === 'string' ? media : '');
                              const mediaUrl = getMediaUrl(rawUrl);
                              const isPdf = media?.type?.includes('pdf') || media?.name?.toLowerCase().endsWith('.pdf') || rawUrl.toLowerCase().endsWith('.pdf');
                              const fileName = media?.name || (isPdf ? 'PDF Resume / CV' : `Document ${mIdx + 1}`);

                              return (
                                <a
                                  key={mIdx}
                                  href={mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-xs font-bold text-emerald-700 border border-emerald-300 rounded-lg transition"
                                >
                                  <span>{isPdf ? '📄' : '🖼️'}</span>
                                  <span className="truncate max-w-[200px]">{fileName}</span>
                                  <span className="text-[10px]">↗</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-end gap-2 flex-wrap">
                        {setSelectedProvider && (
                          <button
                            type="button"
                            className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                            onClick={() => openOffersProviderProfile(assignment)}
                          >
                            <Icon name="user" />
                            <span>View Profile</span>
                          </button>
                        )}
                        {setActiveChatUser && (
                          <button
                            type="button"
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                            onClick={() => {
                              setViewOffersTask(null);
                              setActiveChatUser({ id: proUser.id, name: proName, avatar: getMediaUrl(proUser.avatar) });
                              setActiveTab('Messages');
                            }}
                          >
                            <Icon name="chat" />
                            <span>Message</span>
                          </button>
                        )}
                        <button
                          className="px-4 py-2 bg-[#14B8A6] hover:bg-[#0F9788] text-white font-bold text-xs rounded-lg transition shadow-sm cursor-pointer disabled:opacity-50"
                          disabled={hiringId === assignment.id}
                          onClick={async () => {
                            if (confirm(`Hire ${proName} for this task?`)) {
                              setHiringId(assignment.id);
                              try {
                                await api.post(`/jobs/${viewOffersTask.id}/choose-provider`, { assignmentId: assignment.id });
                                alert(`🎉 ${proName} has been hired for this task!`);
                                setViewOffersTask(null);
                              } catch (err: any) {
                                alert(err.response?.data?.message || "Failed to hire provider");
                              } finally {
                                setHiringId(null);
                              }
                            }
                          }}
                        >
                          {hiringId === assignment.id ? 'Processing...' : 'Hire Professional'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

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
