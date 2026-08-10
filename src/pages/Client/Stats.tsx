import './Stats.css';
import { useState, useEffect } from 'react';
import { Icon, IconName } from '../../App';
import { api } from '../../services/api';

export default function Stats() {
  const [statsData, setStatsData] = useState({
    totalBookings: 0,
    activeBookings: 0,
    doneBookings: 0,
    coinsUsed: 0,
    spendingBreakdown: {
      bookingPayments: 0,
      urgentBookings: 0,
      serviceAddons: 0,
      other: 0,
    },
    monthlyTrend: [
      { month: 'Jan', count: 0 },
      { month: 'Feb', count: 0 },
      { month: 'Mar', count: 0 },
      { month: 'Apr', count: 0 },
      { month: 'May', count: 0 },
      { month: 'Jun', count: 0 },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await api.get('/providers/stats/summary');
        if (isMounted && res.data?.data) {
          setStatsData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  const totalSpentCoins = statsData.coinsUsed || 0;
  const breakdown = statsData.spendingBreakdown;

  // Calculate percentages for donut SVG chart
  const pPayments = totalSpentCoins > 0 ? Math.round((breakdown.bookingPayments / totalSpentCoins) * 100) : 0;
  const pUrgent = totalSpentCoins > 0 ? Math.round((breakdown.urgentBookings / totalSpentCoins) * 100) : 0;
  const pAddons = totalSpentCoins > 0 ? Math.round((breakdown.serviceAddons / totalSpentCoins) * 100) : 0;
  const pOther = totalSpentCoins > 0 ? Math.round((breakdown.other / totalSpentCoins) * 100) : 0;

  const maxTrend = Math.max(1, ...statsData.monthlyTrend.map(t => t.count));

  return (
    <div className="stats-page-layout animate-fade-in">
      <h1 className="page-title-dash">Stats & Overview</h1>

      {/* SUMMARY MINI CARDS */}
      <div className="stats-summary-row">
        {[
          { icon: 'calendar' as IconName, val: statsData.totalBookings, label: 'Bookings', color: '#14B8A6' },
          { icon: 'briefcase' as IconName, val: statsData.activeBookings, label: 'Active', color: '#3B82F6' },
          { icon: 'check' as IconName, val: statsData.doneBookings, label: 'Done', color: '#22C55E' },
          { icon: 'wallet' as IconName, val: `${statsData.coinsUsed} XAF`, label: 'Coins Used', color: '#A855F7' },
        ].map((s, i) => (
          <div className="stats-mini-card" key={i}>
            <div className="stats-mini-icon" style={{ background: `${s.color}18`, color: s.color }}>
              <Icon name={s.icon} />
            </div>
            <div>
              <strong>{isLoading ? '...' : s.val}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SPENDING OVERVIEW PANEL */}
      <div className="dash-panel-premium" style={{ marginTop: '1.5rem' }}>
        <div className="dash-panel-header-new">
          <h2>Spending Overview</h2>
          <select className="select-month">
            <option>This Month</option>
            <option>All Time</option>
          </select>
        </div>

        <div className="chart-content-dash">
          <div className="chart-svg-wrapper" style={{ overflow: 'visible', padding: '10px' }}>
            <svg width="180" height="180" viewBox="-4 -4 44 44" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="3" />
              {totalSpentCoins > 0 && (
                <>
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#14B8A6" strokeWidth="3" strokeDasharray={`${pPayments} ${100 - pPayments}`} strokeDashoffset="100" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray={`${pUrgent} ${100 - pUrgent}`} strokeDashoffset={`${100 - pPayments}`} />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray={`${pAddons} ${100 - pAddons}`} strokeDashoffset={`${100 - pPayments - pUrgent}`} />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#A855F7" strokeWidth="3" strokeDasharray={`${pOther} ${100 - pOther}`} strokeDashoffset={`${100 - pPayments - pUrgent - pAddons}`} />
                </>
              )}
            </svg>
            <div className="chart-inner-text">
              <span className="chart-num">{totalSpentCoins}</span>
              <span className="chart-lbl">Total Coins<br/>Used</span>
            </div>
          </div>

          <div className="chart-legend-list">
            {[
              { color: '#14B8A6', name: 'Booking Payments', val: `${breakdown.bookingPayments} coins (${pPayments}%)` },
              { color: '#3B82F6', name: 'Urgent Bookings', val: `${breakdown.urgentBookings} coins (${pUrgent}%)` },
              { color: '#F59E0B', name: 'Service Add-ons', val: `${breakdown.serviceAddons} coins (${pAddons}%)` },
              { color: '#A855F7', name: 'Other', val: `${breakdown.other} coins (${pOther}%)` },
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

      {/* MONTHLY TREND */}
      <div className="dash-panel-premium" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Monthly Trend</h2>
        <div className="stats-bars-wrapper">
          {statsData.monthlyTrend.map((item, i) => {
            const heightPercent = Math.max(12, Math.round((item.count / maxTrend) * 100));
            return (
              <div className={`stats-bar-col ${i === statsData.monthlyTrend.length - 1 ? 'active' : ''}`} key={item.month}>
                <div className="stats-bar-track">
                  <div className="stats-bar-fill" style={{ height: `${heightPercent}%` }}></div>
                </div>
                <span>{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

