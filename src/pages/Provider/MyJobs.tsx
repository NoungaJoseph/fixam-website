import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { getMediaUrl } from '../../App';
import { useAuth } from '../../context/AuthContext';
import ReviewModal from '../../components/ReviewModal';

interface MyJobsProps {
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
  setSelectedBooking?: (booking: any) => void;
}

export default function MyJobs({ setActiveTab, setActiveChatUser, setSelectedBooking }: MyJobsProps) {
  const { user } = useAuth();
  const cacheKeyJobs = `fixam_cache_provider_jobs_${user?.id || 'default'}`;
  const cacheKeyBookings = `fixam_cache_provider_bookings_${user?.id || 'default'}`;

  const [jobs, setJobs] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem(`fixam_cache_provider_jobs_${user?.id || 'default'}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem(`fixam_cache_provider_bookings_${user?.id || 'default'}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(() => {
    try {
      const cached = localStorage.getItem(`fixam_cache_provider_jobs_${user?.id || 'default'}`);
      return !cached || JSON.parse(cached).length === 0;
    } catch {
      return true;
    }
  });

  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(() => {
    try {
      const cached = localStorage.getItem(`fixam_cache_provider_bookings_${user?.id || 'default'}`);
      return !cached || JSON.parse(cached).length === 0;
    } catch {
      return true;
    }
  });

  const [btnLoadingId, setBtnLoadingId] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState<'jobs' | 'bookings'>(() => {
    const saved = sessionStorage.getItem('fixam_provider_jobs_tab');
    return saved === 'bookings' ? 'bookings' : 'jobs';
  });

  const handleSectionChange = (section: 'jobs' | 'bookings') => {
    setActiveSection(section);
    sessionStorage.setItem('fixam_provider_jobs_tab', section);
  };

  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get('/jobs/my-jobs');
        const data = res.data.data || [];
        setJobs(data);
        localStorage.setItem(cacheKeyJobs, JSON.stringify(data));
      } catch (err) {
        console.error("Failed to fetch my jobs", err);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/bookings/mine');
        const data = res.data.data || [];
        setBookings(data);
        localStorage.setItem(cacheKeyBookings, JSON.stringify(data));
      } catch (err) {
        console.error("Failed to fetch my bookings", err);
      } finally {
        setIsLoadingBookings(false);
      }
    };
    fetchMyJobs();
    fetchMyBookings();
  }, [cacheKeyJobs, cacheKeyBookings]);

  const handleUpdateStatus = async (id: string, status: string) => {
    if (btnLoadingId) return;
    setBtnLoadingId(`${id}_${status}`);
    try {
      await api.patch(`/jobs/${id}/status`, { status });
      const updated = jobs.map(j => j.id === id ? { ...j, status } : j);
      setJobs(updated);
      localStorage.setItem(cacheKeyJobs, JSON.stringify(updated));
      alert(`Job marked as ${status} successfully!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update job status');
    } finally {
      setBtnLoadingId(null);
    }
  };

  const handleBookingAction = async (bookingId: string, action: string) => {
    if (btnLoadingId) return;
    setBtnLoadingId(`${bookingId}_${action}`);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: action });
      const updated = bookings.map(b => b.id === bookingId ? { ...b, status: action } : b);
      setBookings(updated);
      localStorage.setItem(cacheKeyBookings, JSON.stringify(updated));
      alert(`Booking ${action.toLowerCase().replace('_', ' ')} successfully!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update booking');
    } finally {
      setBtnLoadingId(null);
    }
  };

  const activeJobCount = jobs.filter(j => j.status !== 'COMPLETED' && j.status !== 'CANCELLED').length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'PENDING' || b.status === 'COUNTER_PROPOSED').length;

  const [reviewTarget, setReviewTarget] = useState<{ jobId: string; targetUserId: string; targetName: string } | null>(null);

  const statusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200';
      case 'IN_PROGRESS': case 'ASSIGNED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ACCEPTED': case 'CONFIRMED': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'PENDING': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'COUNTER_PROPOSED': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'CANCELLED': case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full pt-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {i18n.language === 'fr' ? 'Mes missions & réservations' : 'My Jobs & Bookings'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {i18n.language === 'fr'
              ? 'Gérez vos contrats actifs, réservations et communications clients.'
              : 'Manage your active contracts, bookings, and client communication.'}
          </p>
        </div>
      </div>

      {/* Section Toggle Tabs */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-0">
        <button
          onClick={() => handleSectionChange('jobs')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSection === 'jobs'
              ? 'text-[#14B8A6] border-[#14B8A6]'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}
        >
          {i18n.language === 'fr' ? 'Missions' : 'Jobs'}
          {activeJobCount > 0 && (
            <span className="ml-2 text-[10px] bg-teal-50 text-[#14B8A6] border border-teal-100 px-2 py-0.5 rounded-full font-extrabold">
              {activeJobCount}
            </span>
          )}
        </button>
        <button
          onClick={() => handleSectionChange('bookings')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSection === 'bookings'
              ? 'text-[#14B8A6] border-[#14B8A6]'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}
        >
          {i18n.language === 'fr' ? 'Réservations' : 'Bookings'}
          {pendingBookingsCount > 0 && (
            <span className="ml-2 text-[10px] bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full font-extrabold animate-pulse">
              {pendingBookingsCount}
            </span>
          )}
        </button>
      </div>

      {/* Jobs Section */}
      {activeSection === 'jobs' && (
        <div className="space-y-4">
          {isLoadingJobs && jobs.length === 0 ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-5 bg-white border border-gray-200 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                  <div className="h-8 w-24 bg-slate-200 rounded-lg" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 font-medium">
                {i18n.language === 'fr' ? 'Aucune mission ni contrat trouvé.' : 'No jobs or contracts found.'}
              </p>
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
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider border ${statusColor(job.status)}`}>
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
                          disabled={Boolean(btnLoadingId)}
                          onClick={() => handleUpdateStatus(job.id, 'COMPLETED')}
                          className={`bg-[#14B8A6] hover:bg-[#0F9788] text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm flex items-center gap-1.5 ${btnLoadingId ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {btnLoadingId === `${job.id}_COMPLETED` ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>{i18n.language === 'fr' ? 'Finalisation...' : 'Completing...'}</span>
                            </>
                          ) : (
                            <span>{i18n.language === 'fr' ? '✓ Terminer' : '✓ Complete'}</span>
                          )}
                        </button>
                      )}
                      {isCompleted && clientUserId && (
                        <button
                          onClick={() => setReviewTarget({ jobId: job.id, targetUserId: clientUserId, targetName: clientName })}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition shadow-sm cursor-pointer"
                        >
                          ⭐ Review
                        </button>
                      )}
                      {!isCompleted && job.status !== 'CANCELLED' && (
                        <button
                          disabled={Boolean(btnLoadingId)}
                          onClick={() => {
                            if (confirm('Are you sure you want to cancel this job?')) {
                              handleUpdateStatus(job.id, 'CANCELLED');
                            }
                          }}
                          className={`text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${btnLoadingId ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {btnLoadingId === `${job.id}_CANCELLED` ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              <span>{i18n.language === 'fr' ? 'Annulation...' : 'Cancelling...'}</span>
                            </>
                          ) : (
                            <span>Cancel</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Bookings Section */}
      {activeSection === 'bookings' && (
        <div className="space-y-4">
          {isLoadingBookings && bookings.length === 0 ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-5 bg-white border border-gray-200 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                  <div className="h-8 w-24 bg-slate-200 rounded-lg" />
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-500 font-medium">
                {i18n.language === 'fr' ? 'Aucune réservation trouvée.' : 'No bookings yet.'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {i18n.language === 'fr'
                  ? 'Lorsque les clients vous réservent, leurs demandes apparaîtront ici.'
                  : 'When clients book you, their requests will appear here.'}
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const clientObj = booking.client || {};
              const providerObj = booking.provider || {};
              const otherParty = clientObj.fullName || providerObj.fullName || 'User';
              const otherAvatar = clientObj.avatar || providerObj.avatar || '';
              const initials = otherParty.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
              const isPending = booking.status === 'PENDING';
              const isCountered = booking.status === 'COUNTER_PROPOSED';

              return (
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-white border border-gray-200 rounded-xl transition-all duration-200 hover:border-[#14B8A6] hover:shadow-md hover:shadow-teal-50/20 cursor-pointer"
                  key={booking.id}
                  onClick={() => {
                    sessionStorage.setItem('fixam_provider_jobs_tab', 'bookings');
                    if (setSelectedBooking) {
                      setSelectedBooking(booking);
                      setActiveTab('Booking Details');
                    }
                  }}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {otherAvatar ? (
                      <img
                        src={getMediaUrl(otherAvatar)}
                        alt={otherParty}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParty)}&background=14B8A6&color=fff&size=48&rounded=true`;
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-teal-50 text-[#14B8A6] border border-teal-100 flex items-center justify-center font-bold text-base">
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider border ${statusColor(booking.status)}`}>
                        {booking.status.replace(/_/g, ' ')}
                      </span>
                      {booking.urgencyLevel && booking.urgencyLevel !== 'NORMAL' && (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200">
                          ⚡ High Priority
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-800 truncate">
                      {i18n.language === 'fr' ? 'Réservation de' : 'Booking from'} {otherParty}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                      <p className="text-xs text-gray-400">
                        📅 {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
                        {booking.bookingTime && ` at ${booking.bookingTime}`}
                      </p>
                      {booking.location && (
                        <p className="text-xs text-gray-400">📍 {booking.location}</p>
                      )}
                      {(booking.budget > 0) && (
                        <p className="text-xs text-gray-400">
                          💰 <span className="text-[#14B8A6] font-bold">{Number(booking.budget).toLocaleString()} XAF</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                    {isPending && (
                      <>
                        <button
                          disabled={Boolean(btnLoadingId)}
                          onClick={() => {
                            if (confirm('Accepting this booking will deduct 1 coin from your wallet. Do you want to proceed?')) {
                              handleBookingAction(booking.id, 'ACCEPTED');
                            }
                          }}
                          className={`bg-[#14B8A6] hover:bg-[#0F9788] text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm flex items-center gap-1.5 ${btnLoadingId ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {btnLoadingId === `${booking.id}_ACCEPTED` ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>{i18n.language === 'fr' ? 'Acceptation...' : 'Accepting...'}</span>
                            </>
                          ) : (
                            <span>✓ Accept (1 Coin)</span>
                          )}
                        </button>
                        <button
                          disabled={Boolean(btnLoadingId)}
                          onClick={() => handleBookingAction(booking.id, 'REJECTED')}
                          className={`text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${btnLoadingId ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {btnLoadingId === `${booking.id}_REJECTED` ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              <span>{i18n.language === 'fr' ? 'Refus...' : 'Rejecting...'}</span>
                            </>
                          ) : (
                            <span>Reject</span>
                          )}
                        </button>
                      </>
                    )}
                    {isCountered && (
                      <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
                        Counter sent - awaiting response
                      </span>
                    )}
                    {!isPending && !isCountered && (
                      <button
                        onClick={() => {
                          sessionStorage.setItem('fixam_provider_jobs_tab', 'bookings');
                          if (setSelectedBooking) {
                            setSelectedBooking(booking);
                            setActiveTab('Booking Details');
                          }
                        }}
                        className="px-4 py-2 border border-gray-200 hover:border-teal-300 hover:bg-teal-50 text-gray-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                      >
                        View Details →
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
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
