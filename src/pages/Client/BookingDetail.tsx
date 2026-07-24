import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Icon, getMediaUrl } from '../../App';

interface BookingDetailProps {
  selectedBooking: any;
  setSelectedBooking: (bk: any) => void;
  setActiveTab: (tab: string) => void;
}

export default function BookingDetail({ selectedBooking, setSelectedBooking, setActiveTab }: BookingDetailProps) {
  const [bookingData, setBookingData] = useState<any>(selectedBooking);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (selectedBooking && (selectedBooking.id || selectedBooking._id)) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const id = selectedBooking.id || selectedBooking._id;
          const res = await api.get(`/bookings/${id}`);
          if (res.data && res.data.data) {
            setBookingData(res.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch fresh booking data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [selectedBooking]);

  if (!bookingData) {
    return (
      <div className="max-w-4xl mx-auto pt-6 flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 mb-4">No booking selected.</p>
        <button 
          className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600"
          onClick={() => { setSelectedBooking(null); setActiveTab('Dashboard'); }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const displayDate = bookingData.date || 'TBD';
  const status = bookingData.status || 'PENDING';
  
  const getStatusColor = (st: string) => {
    const s = st.toUpperCase();
    if (s === 'CONFIRMED' || s === 'ACCEPTED') return { bg: '#DCFCE7', text: '#166534' };
    if (s === 'COMPLETED') return { bg: '#DBEAFE', text: '#1E40AF' };
    if (s === 'CANCELLED' || s === 'REJECTED') return { bg: '#FEE2E2', text: '#991B1B' };
    return { bg: '#FEF9C3', text: '#854D0E' };
  };

  const statusColors = getStatusColor(status);

  // Parse provider details safely
  const pName = typeof bookingData.provider === 'string' ? bookingData.provider : 
    (bookingData.provider?.fullName || bookingData.provider?.name || `${bookingData.provider?.firstName || ''} ${bookingData.provider?.lastName || ''}`.trim() || 
    (bookingData.providerDetails ? `${bookingData.providerDetails.firstName || ''} ${bookingData.providerDetails.lastName || ''}`.trim() : 'Unassigned')) || 'Unassigned';
  const pAvatar = bookingData.provider?.avatar || bookingData.providerDetails?.avatar;

  return (
    <div className="max-w-4xl mx-auto w-full pt-6 pb-20 px-4 animate-fade-in">
      <button 
        onClick={() => { setSelectedBooking(null); setActiveTab('Dashboard'); }}
        className="flex items-center gap-2 text-gray-500 hover:text-teal-600 font-semibold mb-6 transition-colors"
      >
        <span>&larr;</span> Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{bookingData.service || bookingData.title || 'Service Booking'}</h1>
            <p className="text-slate-500 flex items-center gap-2">
              <Icon name="calendar" /> 
              {(() => {
                if (!displayDate || displayDate === 'TBD') return 'Date TBD';
                const d = new Date(displayDate);
                if (isNaN(d.getTime())) return displayDate;
                return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              })()}
              {bookingData.time ? ` at ${bookingData.time}` : ''}
            </p>
          </div>
          <div 
            style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
            className="px-4 py-2 rounded-lg font-bold text-sm tracking-wide self-start sm:self-center uppercase"
          >
            {status}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Service Details</h3>
              <p className="text-slate-700 leading-relaxed">
                {bookingData.description || 'No additional description provided for this booking.'}
              </p>
            </div>

            {bookingData.address && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Location</h3>
                <div className="flex items-start gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-400 mt-0.5"><Icon name="location" /></span>
                  <p>{bookingData.address}</p>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Budget / Price</h3>
              <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
                <Icon name="wallet" />
                {bookingData.budget ? `${bookingData.budget} ${bookingData.budget.toString().includes('XAF') ? '' : 'XAF'}` : 'To be determined'}
              </div>
            </div>
          </div>

          {/* Right Column: Provider & Actions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Assigned Professional</h3>
              
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {pName === 'Unassigned' ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      ?
                    </div>
                    <div>
                      <p className="font-semibold text-slate-500 italic">Finding a professional...</p>
                      <p className="text-xs text-slate-400 mt-1">We will notify you once assigned.</p>
                    </div>
                  </>
                ) : (
                  <>
                    {pAvatar ? (
                      <img 
                        src={pAvatar.startsWith('http') ? pAvatar : getMediaUrl(pAvatar)} 
                        alt={pName} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-xl border-2 border-white shadow-sm">
                        {pName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-800">{pName}</p>
                      <button className="text-teal-600 text-sm font-semibold hover:underline mt-0.5">
                        View Profile
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              {pName !== 'Unassigned' && (
                <button className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold transition-colors">
                  <Icon name="chat" /> Message Provider
                </button>
              )}
              {status.toUpperCase() !== 'CANCELLED' && status.toUpperCase() !== 'COMPLETED' && (
                <button className="w-full bg-white hover:bg-red-50 text-red-500 border border-red-200 py-3.5 rounded-xl font-bold transition-colors">
                  Cancel Booking
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
