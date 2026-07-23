import { Icon, getMediaUrl, images } from '../../App';

interface BookingDetailsProps {
  booking: any;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function BookingDetails({ booking, setActiveTab, setActiveChatUser }: BookingDetailsProps) {
  if (!booking) return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full">
      <p className="text-gray-500 mb-4">No booking selected.</p>
      <button className="btn-primary-pill" onClick={() => setActiveTab('Dashboard')}>Back to Dashboard</button>
    </div>
  );

  const displayDate = booking.date || booking.scheduledDate || booking.createdAt || 'TBD';
  const displayTime = booking.time || booking.scheduledTime || '';
  const providerName = typeof booking.provider === 'string' ? booking.provider : (booking.provider?.fullName || booking.provider?.name || `${booking.provider?.firstName || ''} ${booking.provider?.lastName || ''}`.trim() || (booking.providerDetails ? `${booking.providerDetails.firstName || ''} ${booking.providerDetails.lastName || ''}`.trim() : 'Unassigned')) || 'Unassigned';
  const providerAvatar = booking.provider?.avatar || booking.providerDetails?.avatar;
  const avatarUrl = providerAvatar ? getMediaUrl(providerAvatar) : '';
  const serviceTitle = booking.service || booking.title || booking.task?.title || 'General Service';
  const budget = booking.budget || booking.price || 'Contact for price';

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition shadow-sm" onClick={() => setActiveTab('Dashboard')}>
          <Icon name="chevron-up" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Booking Details</h1>
          <p className="text-sm text-gray-500">View information about your scheduled service</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <span className={`inline-block text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md mb-2 ${booking.status === 'Confirmed' || booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : (booking.status === 'Pending' || booking.status === 'PENDING') ? 'bg-yellow-100 text-yellow-700' : booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
              {booking.status || 'PENDING'}
            </span>
            <h2 className="text-xl font-bold text-gray-900">{serviceTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">Booking ID: #{booking._id || booking.id || 'N/A'}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-2xl font-black text-[#14B8A6]">{budget} {budget.toString().includes('XAF') ? '' : 'XAF'}</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Schedule Info</h3>
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-teal-600">
                  <Icon name="calendar" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{displayDate}</p>
                  <p className="text-sm text-gray-500">{displayTime ? `Time: ${displayTime}` : 'Time to be determined'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Location</h3>
              <div className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5"><Icon name="location" /></span>
                <p className="text-sm text-gray-800 font-medium">{booking.location || booking.address || 'Address not provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Provider</h3>
            {providerName !== 'Unassigned' ? (
              <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={providerName} className="w-14 h-14 rounded-full object-cover shadow-sm" onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(providerName)}&background=14B8A6&color=fff&size=64&rounded=true`;
                  }} />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                    {providerName.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{providerName}</h4>
                  <p className="text-xs text-gray-500 mb-2">Service Professional</p>
                  <button className="text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition" onClick={() => {
                    setActiveTab('Messages');
                    setActiveChatUser(providerName);
                  }}>
                    <Icon name="chat" /> Message Provider
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-100 bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 italic">No provider assigned yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        {(booking.status === 'Pending' || booking.status === 'PENDING') && (
          <button className="w-full sm:w-auto px-6 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition" onClick={() => alert('Booking cancellation is restricted at this time.')}>
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}
