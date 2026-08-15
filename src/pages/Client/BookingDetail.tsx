import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Icon, getMediaUrl, DEFAULT_AVATAR } from '../../App';
import ReviewModal from '../../components/ReviewModal';
import '../Provider/ProviderDashboard.css';

interface BookingDetailProps {
  selectedBooking: any;
  setSelectedBooking: (bk: any) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser?: (user: any) => void;
}

export default function BookingDetail({ selectedBooking, setSelectedBooking, setActiveTab, setActiveChatUser }: BookingDetailProps) {
  const [bookingData, setBookingData] = useState<any>(selectedBooking);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (selectedBooking && (selectedBooking.id || selectedBooking._id)) {
      const fetchDetails = async () => {
        try {
          const id = selectedBooking.id || selectedBooking._id;
          const res = await api.get(`/bookings/${id}`).catch(() => null) || await api.get(`/jobs/${id}`).catch(() => null);
          if (res?.data?.data) {
            setBookingData(res.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch fresh booking data:", err);
        }
      };
      fetchDetails();
    }
  }, [selectedBooking]);

  if (!bookingData) return null;

  const bkId = bookingData.id || bookingData._id;
  const displayDate = bookingData.bookingDate || bookingData.date || bookingData.createdAt || 'TBD';
  const status = (bookingData.status || 'PENDING').toUpperCase();

  const handleStatusChange = async (newStatus: string) => {
    try {
      const isJob = Boolean(bookingData.clientId && !bookingData.providerId && bookingData.title);
      const endpoint = isJob ? `/jobs/${bkId}/status` : `/bookings/${bkId}/status`;
      await api.patch(endpoint, { status: newStatus });
      setBookingData({ ...bookingData, status: newStatus });
      alert(`Status updated to ${newStatus} successfully!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };
  
  const getStatusColor = (st: string) => {
    const s = st.toUpperCase();
    if (s === 'CONFIRMED' || s === 'ACCEPTED') return { bg: '#DCFCE7', text: '#166534' };
    if (s === 'COMPLETED') return { bg: '#DBEAFE', text: '#1E40AF' };
    if (s === 'CANCELLED' || s === 'REJECTED') return { bg: '#FEE2E2', text: '#991B1B' };
    return { bg: '#FEF9C3', text: '#854D0E' };
  };

  const statusColors = getStatusColor(status);
  const provider = bookingData.providerDetails || bookingData.provider;
  const pName = typeof provider === 'string' ? provider : (provider?.fullName || provider?.name || `${provider?.firstName || ''} ${provider?.lastName || ''}`.trim() || 'Service Specialist');
  const pAvatar = provider?.avatar ? getMediaUrl(provider.avatar) : DEFAULT_AVATAR;

  const client = bookingData.clientDetails || bookingData.client || bookingData.user;
  const cName = typeof client === 'string' ? client : (client?.fullName || client?.name || `${client?.firstName || ''} ${client?.lastName || ''}`.trim() || 'Client');
  const cAvatar = client?.avatar ? getMediaUrl(client.avatar) : DEFAULT_AVATAR;

  // Determine review recipient ID (User ID)
  const targetUserIdForReview = provider?.id || provider?.userId || client?.id || client?.userId || '';
  const targetNameForReview = pName !== 'Service Specialist' ? pName : cName;

  return (
    <div className="upwork-modal-overlay animate-fade-in" onClick={() => setSelectedBooking(null)}>
      <div className="upwork-modal-drawer animate-slide-left" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Drawer Navigation */}
        <div className="upwork-drawer-topbar">
          <button className="btn-back-arrow-text" onClick={() => setSelectedBooking(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back</span>
          </button>
          <span 
            className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
            style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
          >
            {status}
          </span>
        </div>

        {/* Modal Drawer 2-Column Body */}
        <div className="upwork-drawer-body">
          {/* LEFT MAIN COLUMN */}
          <div className="upwork-left-column">
            <h1 className="upwork-job-title">{bookingData.service || bookingData.title || 'Service Contract'}</h1>
            <div className="upwork-meta-line">
              <span>Date: {displayDate ? new Date(displayDate).toLocaleDateString() : 'recently'}</span>
              <span className="dot">•</span>
              <span>📍 {bookingData.location || bookingData.address || 'On-Site / Cameroon'}</span>
            </div>

            <div className="upwork-divider" />

            {/* Description */}
            <div className="upwork-section">
              <h3>Task & Service Details</h3>
              <p className="upwork-text-block">{bookingData.description || bookingData.notes || 'Service booking request placed on Fixam platform.'}</p>
            </div>

            {/* Deliverables / Scope */}
            {bookingData.whatNeedsDone && (
              <div className="upwork-section">
                <h3>Required Deliverables</h3>
                <div className="upwork-deliverables-list">
                  <p>{bookingData.whatNeedsDone}</p>
                </div>
              </div>
            )}

            <div className="upwork-divider" />

            {/* Budget & Price Metrics Grid */}
            <div className="upwork-metrics-row">
              <div className="upwork-metric-box">
                <span className="metric-icon">🏷️</span>
                <div>
                  <strong>{bookingData.budget || bookingData.amount || bookingData.price ? `${(bookingData.budget || bookingData.amount || bookingData.price).toLocaleString()} XAF` : 'Agreed Rate'}</strong>
                  <small>Budget / Rate</small>
                </div>
              </div>

              <div className="upwork-metric-box">
                <span className="metric-icon">⏱️</span>
                <div>
                  <strong>{bookingData.bookingDuration || '1 Hour'}</strong>
                  <small>Service Duration</small>
                </div>
              </div>

              <div className="upwork-metric-box">
                <span className="metric-icon">⚡</span>
                <div>
                  <strong>{bookingData.urgencyLevel || 'NORMAL'}</strong>
                  <small>Urgency Level</small>
                </div>
              </div>
            </div>

            <div className="upwork-divider" />

            {/* Parties Info */}
            <div className="upwork-section">
              <h3>Contract Parties</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {/* Client */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <img src={cAvatar} alt={cName} className="w-12 h-12 rounded-full object-cover border border-teal-200" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-0.5">{cName}</h4>
                    <p className="text-xs text-teal-600 font-bold">Client</p>
                  </div>
                </div>
                {/* Provider */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <img src={pAvatar} alt={pName} className="w-12 h-12 rounded-full object-cover border border-teal-200" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-0.5">{pName}</h4>
                    <p className="text-xs text-teal-600 font-bold">Service Professional</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <div className="upwork-right-column">
            <div className="upwork-notice-box">
              <span className="notice-icon">⚡</span>
              <p>Fixam Guarantee: Direct cash or digital payment upon job completion.</p>
            </div>

            {/* Dynamic Actions Grid */}
            <div className="space-y-3 mt-4">
              {(status === 'ACCEPTED' || status === 'IN_PROGRESS') && (
                <button 
                  className="w-full bg-[#14B8A6] hover:bg-[#0F9788] text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
                  onClick={() => handleStatusChange('COMPLETED')}
                >
                  ✓ Mark Contract Completed
                </button>
              )}

              {status === 'COMPLETED' && (
                <button 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  ⭐ Write a Review
                </button>
              )}

              {pName !== 'Service Specialist' && setActiveChatUser && (
                <button 
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                  onClick={() => {
                    setActiveChatUser({ id: provider?.userId || provider?.id, name: pName, avatar: pAvatar });
                    setSelectedBooking(null);
                    setActiveTab('Messages');
                  }}
                >
                  <Icon name="chat" />
                  <span>Message Specialist</span>
                </button>
              )}

              <button 
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 px-4 rounded-xl text-sm transition"
                onClick={() => setSelectedBooking(null)}
              >
                Close Drawer
              </button>
            </div>

            <div className="upwork-divider" />

            <div className="upwork-client-section">
              <h3>Contract Summary</h3>
              <div className="client-check-item">
                <span className="check-mark">✔</span>
                <span>Verified Direct Booking</span>
              </div>
              <div className="client-check-item">
                <span className="check-mark">✔</span>
                <span>Fixam Platform Safety</span>
              </div>
              <div className="client-meta-text mt-3">
                <p>⏰ Time: {bookingData.bookingTime || bookingData.time || '09:00 AM'}</p>
                <p>📍 Location: {bookingData.location || 'On-Site'}</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        jobId={bkId}
        targetUserId={targetUserIdForReview}
        targetName={targetNameForReview}
      />
    </div>
  );
}
