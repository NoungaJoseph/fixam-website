import './MyBookings.css';
import { Icon, images } from '../../App';

interface MyBookingsProps {
  clientBookings: any[];
  setClientBookings: (bookings: any[]) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
}

export default function MyBookings({ clientBookings, setClientBookings, setActiveTab, setActiveChatUser }: MyBookingsProps) {
  return (
    <div className="dash-panel-premium full-width-panel animate-fade-in">
      <div className="dash-panel-header-new">
        <h2>My Bookings</h2>
        <button className="btn-tab-action" onClick={() => {
          const dateStr = prompt("Enter booking date (e.g. May 25):", "May 25");
          if (dateStr) {
            const newBk = {
              id: Date.now(),
              service: 'General Maintenance',
              provider: 'Jeff Thomson',
              date: dateStr,
              time: '12:00 PM',
              status: 'Pending',
              price: '25,000 XAF',
              image: images.proJeff
            };
            setClientBookings([newBk, ...clientBookings]);
          }
        }}>+ New Booking</button>
      </div>
      <div className="bookings-detailed-list">
        {clientBookings.map((bk) => (
          <div className="booking-detailed-card" key={bk.id}>
            <div className="booking-card-left">
              <img src={bk.image} alt={bk.provider} />
              <div className="booking-info-details">
                <h3>{bk.service}</h3>
                <p className="provider-name">Provider: <strong>{bk.provider}</strong></p>
                <p className="price-lbl-detail">Price: <span>{bk.price}</span></p>
              </div>
            </div>
            <div className="booking-card-mid">
              <div className="schedule-badge">
                <Icon name="calendar" />
                <span>{bk.date} • {bk.time}</span>
              </div>
              <span className={`booking-status-badge ${bk.status.toLowerCase()}`}>
                {bk.status}
              </span>
            </div>
            <div className="booking-card-actions">
              <button className="btn-chat-booking" onClick={() => {
                setActiveTab('Messages');
                setActiveChatUser(bk.provider);
              }}>
                <Icon name="chat" /> Chat
              </button>
              {bk.status !== 'Completed' && (
                <>
                  <button className="btn-reschedule-booking" onClick={() => {
                    const newD = prompt("Enter new date:", bk.date);
                    if (newD) {
                      setClientBookings(clientBookings.map(b => b.id === bk.id ? {...b, date: newD} : b));
                    }
                  }}>Reschedule</button>
                  <button className="btn-cancel-booking" onClick={() => {
                    if (confirm("Cancel this booking?")) {
                      setClientBookings(clientBookings.filter(b => b.id !== bk.id));
                    }
                  }}>Cancel</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
