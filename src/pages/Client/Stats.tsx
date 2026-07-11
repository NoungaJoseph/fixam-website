import './Stats.css';
import { Icon, IconName } from '../../App';

export default function Stats() {
  return (
    <div className="stats-page-layout animate-fade-in">
      <h1 className="page-title-dash">Stats & Overview</h1>
      <div className="stats-summary-row">
        {[
          { icon: 'calendar' as IconName, val: '12', label: 'Bookings', color: '#14B8A6' },
          { icon: 'briefcase' as IconName, val: '4', label: 'Active', color: '#3B82F6' },
          { icon: 'check' as IconName, val: '8', label: 'Done', color: '#22C55E' },
          { icon: 'wallet' as IconName, val: '25', label: 'Coins Used', color: '#A855F7' },
        ].map((s, i) => (
          <div className="stats-mini-card" key={i}>
            <div className="stats-mini-icon" style={{ background: `${s.color}18`, color: s.color }}><Icon name={s.icon} /></div>
            <div>
              <strong>{s.val}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-panel-premium" style={{ marginTop: '1.5rem' }}>
        <div className="dash-panel-header-new">
          <h2>Spending Overview</h2>
          <select className="select-month">
            <option>This Month</option>
            <option>Last Month</option>
          </select>
        </div>
        <div className="chart-content-dash">
          <div className="chart-svg-wrapper">
            <svg width="180" height="180" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--line)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#14B8A6" strokeWidth="3" strokeDasharray="48 52" strokeDashoffset="100" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="24 76" strokeDashoffset="52" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="16 84" strokeDashoffset="28" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#A855F7" strokeWidth="3" strokeDasharray="12 88" strokeDashoffset="12" />
            </svg>
            <div className="chart-inner-text">
              <span className="chart-num">25</span>
              <span className="chart-lbl">Total Coins<br/>Used</span>
            </div>
          </div>
          <div className="chart-legend-list">
            {[
              { color: '#14B8A6', name: 'Booking Payments', val: '12 coins (48%)' },
              { color: '#3B82F6', name: 'Urgent Bookings', val: '6 coins (24%)' },
              { color: '#F59E0B', name: 'Service Add-ons', val: '4 coins (16%)' },
              { color: '#A855F7', name: 'Other', val: '3 coins (12%)' },
            ].map((l, i) => (
              <div className="legend-item-dash" key={i}>
                <span className="legend-color-dot" style={{ backgroundColor: l.color }}></span>
                <span>{l.name}</span>
                <span className="legend-val">{l.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-panel-premium" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Monthly Trend</h2>
        <div className="stats-bars-wrapper">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => (
            <div className={`stats-bar-col ${i === 5 ? 'active' : ''}`} key={m}>
              <div className="stats-bar-track">
                <div className="stats-bar-fill" style={{ height: `${[40, 55, 35, 70, 85, 65][i]}%` }}></div>
              </div>
              <span>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
