import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { getMediaUrl } from '../../App';
import ReviewModal from '../../components/ReviewModal';

interface MyJobsProps {
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
  setSelectedBooking?: (booking: any) => void;
}

export default function MyJobs({ setActiveTab, setActiveChatUser, setSelectedBooking }: MyJobsProps) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<'jobs' | 'bookings'>('jobs');
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get('/jobs/my-jobs');
        setJobs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch my jobs", err);
      }
    };
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/bookings/mine');
        setBookings(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch my bookings", err);
      }
    };
    fetchMyJobs();
    fetchMyBookings();
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

  const handleBookingAction = async (bookingId: string, action: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: action });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: action } : b));
      alert(`Booking ${action.toLowerCase().replace('_', ' ')} successfully!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update booking');
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
          onClick={() => setActiveSection('jobs')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all ${
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
          onClick={() => setActiveSection('bookings')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all ${
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
          {jobs.length === 0 ? (
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
      )}

      {/* Bookings Section */}
      {activeSection === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
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
                          onClick={() => {
                            if (confirm('Accepting this booking will deduct 1 coin from your wallet. Do you want to proceed?')) {
                              handleBookingAction(booking.id, 'ACCEPTED');
                            }
                          }}
                          className="bg-[#14B8A6] hover:bg-[#0F9788] text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm"
                        >
                          ✓ Accept (1 Coin)
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'REJECTED')}
                          className="text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 text-xs font-semibold px-4 py-2 rounded-lg transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {isCountered && (
                      <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
                        Counter sent — awaiting response
                      </span>
                    )}
                    {!isPending && !isCountered && (
                      <button
                        onClick={() => {
                          if (setSelectedBooking) {
                            setSelectedBooking(booking);
                            setActiveTab('Booking Details');
                          }
                        }}
                        className="px-4 py-2 border border-gray-200 hover:border-teal-300 hover:bg-teal-50 text-gray-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
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
