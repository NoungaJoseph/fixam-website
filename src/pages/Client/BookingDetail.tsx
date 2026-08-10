import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Icon, getMediaUrl, DEFAULT_AVATAR } from '../../App';
import '../Provider/ProviderDashboard.css';

interface BookingDetailProps {
  selectedBooking: any;
  setSelectedBooking: (bk: any) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser?: (user: any) => void;
}

export default function BookingDetail({ selectedBooking, setSelectedBooking, setActiveTab, setActiveChatUser }: BookingDetailProps) {
  const [bookingData, setBookingData] = useState<any>(selectedBooking);

  useEffect(() => {
    if (selectedBooking && (selectedBooking.id || selectedBooking._id)) {
      const fetchDetails = async () => {
        try {
          const id = selectedBooking.id || selectedBooking._id;
          const res = await api.get(`/bookings/${id}`);
          if (res.data && res.data.data) {
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

  const displayDate = bookingData.date || bookingData.createdAt || 'TBD';
  const status = bookingData.status || 'PENDING';
  
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

  return (
    <div className="upwork-modal-overlay animate-fade-in" onClick={() => setSelectedBooking(null)}>
      <div className="upwork-modal-drawer animate-slide-left" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Drawer Navigation */}
        <div className="upwork-drawer-topbar">
          <button className="btn-back-arrow flex items-center gap-2 text-slate-700 font-bold text-sm" onClick={() => setSelectedBooking(null)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Dashboard</span>
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
            <h1 className="upwork-job-title">{bookingData.service || bookingData.title || 'Service Booking'}</h1>
            <div className="upwork-meta-line">
              <span>Booked on {displayDate ? new Date(displayDate).toLocaleDateString() : 'recently'}</span>
              <span className="dot">•</span>
              <span>📍 {bookingData.location || bookingData.address || 'On-Site / Cameroon'}</span>
            </div>

            <div className="upwork-divider" />

            {/* Description */}
            <div className="upwork-section">
              <h3>Task Description</h3>
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
                  <strong>{bookingData.amount || bookingData.price || bookingData.budget ? `${(bookingData.amount || bookingData.price || bookingData.budget).toLocaleString()} XAF` : 'Agreed Rate'}</strong>
                  <small>Agreed Job Price</small>
                </div>
              </div>

              <div className="upwork-metric-box">
                <span className="metric-icon">⚙️</span>
                <div>
                  <strong>{bookingData.category || bookingData.serviceCategory || 'Standard'}</strong>
                  <small>Service Category</small>
                </div>
              </div>
            </div>

            <div className="upwork-divider" />

            {/* Assigned Provider Details */}
            <div className="upwork-section">
              <h3>Assigned Professional</h3>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                <img src={pAvatar} alt={pName} className="w-14 h-14 rounded-full object-cover border border-teal-300" />
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{pName}</h4>
                  <p className="text-xs text-teal-600 font-bold">Fixam Service Provider</p>
                  <span className="text-[11px] text-slate-500 font-medium">Rating: 5.0 ⭐ (Verified)</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <div className="upwork-right-column">
            <div className="upwork-notice-box">
              <span className="notice-icon">⚡</span>
              <p>Fixam Direct Booking: Payment is made directly to the provider in cash upon job completion.</p>
            </div>

            {provider?.userId && setActiveChatUser && (
              <button 
                className="btn-upwork-primary flex items-center justify-center gap-2"
                onClick={() => {
                  setActiveChatUser({ id: provider.userId, name: pName, avatar: pAvatar });
                  setSelectedBooking(null);
                  setActiveTab('Messages');
                }}
              >
                <Icon name="chat" />
                <span>Message Provider</span>
              </button>
            )}

            <button 
              className="btn-upwork-secondary"
              onClick={() => {
                setSelectedBooking(null);
                setActiveTab('My Bookings');
              }}
            >
              View All Bookings
            </button>

            <div className="upwork-divider" />

            {/* Booking Details */}
            <div className="upwork-client-section">
              <h3>Booking Info</h3>
              <div className="client-check-item">
                <span className="check-mark">✔</span>
                <span>Direct Payment Cash</span>
              </div>
              <div className="client-check-item">
                <span className="check-mark">✔</span>
                <span>Fixam Safety Protected</span>
              </div>
              <div className="client-meta-text mt-3">
                <p>📅 Schedule: {bookingData.time ? `${bookingData.time}` : 'Flexible'}</p>
                <p>📍 Location: {bookingData.location || 'Client Site'}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
