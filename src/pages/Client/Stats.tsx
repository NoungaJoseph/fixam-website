import './Stats.css';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, IconName } from '../../App';
import { api } from '../../services/api';

import { useAuth } from '../../context/AuthContext';

export default function Stats() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
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
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

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

  // Monthly stats PDF report generation function with complete activity details
  const handleDownloadMonthlyPDF = () => {
    const monthName = new Date().toLocaleString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' });
    const stmtRef = `FXM-STAT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    const userName = user?.fullName || (i18n.language === 'fr' ? 'Utilisateur Fixam' : 'Fixam User');
    const userEmail = user?.email || user?.phone || 'N/A';
    const userRoleStr = (user?.role === 'PROVIDER' || (user?.role as any) === 'pro') ? 'Service Provider' : 'Client Account';

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Fixam Monthly Activity Statement - ${monthName}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0F172A;
            margin: 0;
            padding: 20px;
            font-size: 13px;
            line-height: 1.5;
            background: #FFF;
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0D9488;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .logo {
            font-size: 26px;
            font-weight: 900;
            color: #0F172A;
            letter-spacing: -0.5px;
          }
          .logo span {
            color: #0D9488;
          }
          .doc-title {
            text-align: right;
          }
          .doc-title h1 {
            margin: 0;
            font-size: 17px;
            font-weight: 800;
            color: #0D9488;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .doc-title p {
            margin: 4px 0 0;
            color: #64748B;
            font-size: 12px;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
            background: #F8FAFC;
            padding: 14px;
            border-radius: 8px;
            border: 1px solid #E2E8F0;
          }
          .meta-col p {
            margin: 3px 0;
          }
          .meta-col strong {
            color: #334155;
          }
          .section-title {
            font-size: 13px;
            font-weight: 700;
            color: #0F172A;
            margin: 20px 0 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-left: 3px solid #0D9488;
            padding-left: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 9px 12px;
            border: 1px solid #E2E8F0;
            text-align: left;
          }
          th {
            background-color: #F1F5F9;
            font-weight: 700;
            color: #475569;
            font-size: 12px;
          }
          .text-right {
            text-align: right;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            background: #DCFCE7;
            color: #15803D;
          }
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .summary-card {
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
          }
          .summary-card .val {
            font-size: 17px;
            font-weight: 800;
            color: #0F172A;
            margin-top: 4px;
          }
          .summary-card .lbl {
            font-size: 10px;
            color: #64748B;
            text-transform: uppercase;
          }
          .footer {
            margin-top: 36px;
            padding-top: 14px;
            border-top: 1px solid #E2E8F0;
            text-align: center;
            font-size: 11px;
            color: #94A3B8;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header-row">
          <div>
            <div class="logo">fixam<span>.</span></div>
            <p style="margin: 4px 0 0; color: #64748B; font-size: 11px;">Fixam Platforms Ltd. • Verified Activity Statement</p>
          </div>
          <div class="doc-title">
            <h1>Activity & Performance Statement</h1>
            <p>Statement Ref: <strong>${stmtRef}</strong></p>
            <p>Period: <strong>${monthName}</strong></p>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-col">
            <p><strong>Account Name:</strong> ${userName}</p>
            <p><strong>Contact / Phone:</strong> ${userEmail}</p>
            <p><strong>Account Type:</strong> ${userRoleStr}</p>
          </div>
          <div class="meta-col">
            <p><strong>Date Issued:</strong> ${issueDate}</p>
            <p><strong>Account Status:</strong> <span class="badge">Verified Active</span></p>
            <p><strong>Location:</strong> Cameroon / Central Africa</p>
          </div>
        </div>

        <div class="section-title">Monthly Performance Summary</div>
        <div class="summary-cards">
          <div class="summary-card">
            <div class="lbl">Total Bookings</div>
            <div class="val">${statsData.totalBookings}</div>
          </div>
          <div class="summary-card">
            <div class="lbl">Active Missions</div>
            <div class="val" style="color: #2563EB;">${statsData.activeBookings}</div>
          </div>
          <div class="summary-card">
            <div class="lbl">Completed Tasks</div>
            <div class="val" style="color: #16A34A;">${statsData.doneBookings}</div>
          </div>
          <div class="summary-card">
            <div class="lbl">Total Budget / Coins</div>
            <div class="val" style="color: #0D9488;">${statsData.coinsUsed.toLocaleString()} XAF</div>
          </div>
        </div>

        <div class="section-title">Itemized Activity & Spending Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>Activity Category</th>
              <th>Description</th>
              <th class="text-right">Share (%)</th>
              <th class="text-right">Amount (XAF)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Direct Booking Payments</strong></td>
              <td>Service milestone compensation and contract execution</td>
              <td class="text-right">${pPayments}%</td>
              <td class="text-right">${breakdown.bookingPayments.toLocaleString()} XAF</td>
            </tr>
            <tr>
              <td><strong>Urgent Dispatch Requests</strong></td>
              <td>Express response & priority provider dispatches</td>
              <td class="text-right">${pUrgent}%</td>
              <td class="text-right">${breakdown.urgentBookings.toLocaleString()} XAF</td>
            </tr>
            <tr>
              <td><strong>Service Add-ons & Parts</strong></td>
              <td>Equipment, extra materials, and on-site additions</td>
              <td class="text-right">${pAddons}%</td>
              <td class="text-right">${breakdown.serviceAddons.toLocaleString()} XAF</td>
            </tr>
            <tr>
              <td><strong>Platform & Operations</strong></td>
              <td>Platform fees and connection guarantees</td>
              <td class="text-right">${pOther}%</td>
              <td class="text-right">${breakdown.other.toLocaleString()} XAF</td>
            </tr>
            <tr style="background-color: #F8FAFC; font-weight: 700;">
              <td colspan="3">Total Activity Expenditure</td>
              <td class="text-right" style="color: #0D9488; font-size: 14px;">${statsData.coinsUsed.toLocaleString()} XAF</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title">6-Month Activity Trajectory</div>
        <table>
          <thead>
            <tr>
              ${statsData.monthlyTrend.map(t => `<th style="text-align: center;">${t.month}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${statsData.monthlyTrend.map(t => `<td style="text-align: center; font-weight: 700;">${t.count} tasks</td>`).join('')}
            </tr>
          </tbody>
        </table>

        <div class="footer">
          This is an official computer-generated activity statement issued by Fixam Platforms Ltd.<br />
          For verification or support inquiries, contact support@fixam.cm or visit https://fixam.cm
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
    }
  };

  return (
    <div className="stats-page-layout animate-fade-in" style={{ padding: '1rem', maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Header with Title and Download Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title-dash" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
            {i18n.language === 'fr' ? 'Statistiques & Aperçu' : 'Stats & Overview'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
            {i18n.language === 'fr' ? 'Suivez vos performances, réservations et historique mensuel' : 'Track your monthly performance, bookings, and budget usage'}
          </p>
        </div>

        {/* Download Monthly Stats PDF Button */}
        <button
          onClick={handleDownloadMonthlyPDF}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#14B8A6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '999px',
            padding: '0.6rem 1.25rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(20, 184, 166, 0.3)',
            transition: 'background-color 0.15s'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <span>{i18n.language === 'fr' ? 'Télécharger le rapport (PDF)' : 'Download Monthly Report (PDF)'}</span>
        </button>
      </div>

      {/* SUMMARY MINI CARDS */}
      <div className="stats-summary-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: 'calendar' as IconName, val: statsData.totalBookings, label: i18n.language === 'fr' ? 'Réservations' : 'Bookings', color: '#14B8A6' },
          { icon: 'briefcase' as IconName, val: statsData.activeBookings, label: i18n.language === 'fr' ? 'Actives' : 'Active', color: '#3B82F6' },
          { icon: 'check' as IconName, val: statsData.doneBookings, label: i18n.language === 'fr' ? 'Terminées' : 'Done', color: '#22C55E' },
          { icon: 'wallet' as IconName, val: `${statsData.coinsUsed.toLocaleString()} XAF`, label: i18n.language === 'fr' ? 'Pièces utilisées' : 'Coins Used', color: '#A855F7' },
        ].map((s, i) => (
          <div className="stats-mini-card" key={i} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="stats-mini-icon" style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={s.icon} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{isLoading ? '...' : s.val}</strong>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SPENDING OVERVIEW PANEL (Properly styled & vertically contained) */}
      <div className="dash-panel-premium" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            {i18n.language === 'fr' ? 'Aperçu des dépenses' : 'Spending Overview'}
          </h2>
          <select
            className="select-month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, color: '#334155', background: '#F8FAFC' }}
          >
            <option value="This Month">{i18n.language === 'fr' ? 'Ce mois-ci' : 'This Month'}</option>
            <option value="All Time">{i18n.language === 'fr' ? 'Tout le temps' : 'All Time'}</option>
          </select>
        </div>

        {/* Chart + Legend Wrapper */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', padding: '0.5rem 0 1rem' }}>
          
          {/* Circular Donut Graph (Cleanly contained 160x160 with no overflow) */}
          <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="160" height="160" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
              {/* Background ring */}
              <circle cx="21" cy="21" r="15.91549430918954" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
              
              {/* Segment rings if coins spent */}
              {totalSpentCoins > 0 && (
                <>
                  <circle
                    cx="21" cy="21" r="15.91549430918954" fill="none" stroke="#14B8A6" strokeWidth="4.5"
                    strokeDasharray={`${pPayments} ${100 - pPayments}`} strokeDashoffset="25"
                  />
                  <circle
                    cx="21" cy="21" r="15.91549430918954" fill="none" stroke="#3B82F6" strokeWidth="4.5"
                    strokeDasharray={`${pUrgent} ${100 - pUrgent}`} strokeDashoffset={`${25 - pPayments}`}
                  />
                  <circle
                    cx="21" cy="21" r="15.91549430918954" fill="none" stroke="#F59E0B" strokeWidth="4.5"
                    strokeDasharray={`${pAddons} ${100 - pAddons}`} strokeDashoffset={`${25 - pPayments - pUrgent}`}
                  />
                  <circle
                    cx="21" cy="21" r="15.91549430918954" fill="none" stroke="#A855F7" strokeWidth="4.5"
                    strokeDasharray={`${pOther} ${100 - pOther}`} strokeDashoffset={`${25 - pPayments - pUrgent - pAddons}`}
                  />
                </>
              )}
            </svg>

            {/* Inner Center Content */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', textAlign: 'center' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {totalSpentCoins.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, marginTop: '4px', lineHeight: 1.2 }}>
                {i18n.language === 'fr' ? 'Total Pièces' : 'Total Coins'}<br/>{i18n.language === 'fr' ? 'Utilisées' : 'Used'}
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, minWidth: '240px' }}>
            {[
              { color: '#14B8A6', name: i18n.language === 'fr' ? 'Paiements de réservations' : 'Booking Payments', val: `${breakdown.bookingPayments} ${i18n.language === 'fr' ? 'pièces' : 'coins'} (${pPayments}%)` },
              { color: '#3B82F6', name: i18n.language === 'fr' ? 'Réservations urgentes' : 'Urgent Bookings', val: `${breakdown.urgentBookings} ${i18n.language === 'fr' ? 'pièces' : 'coins'} (${pUrgent}%)` },
              { color: '#F59E0B', name: i18n.language === 'fr' ? 'Options de service' : 'Service Add-ons', val: `${breakdown.serviceAddons} ${i18n.language === 'fr' ? 'pièces' : 'coins'} (${pAddons}%)` },
              { color: '#A855F7', name: i18n.language === 'fr' ? 'Autre' : 'Other', val: `${breakdown.other} ${i18n.language === 'fr' ? 'pièces' : 'coins'} (${pOther}%)` },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: l.color, flexShrink: 0 }} />
                  <span style={{ color: '#334155', fontWeight: 500 }}>{l.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{l.val}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* MONTHLY TREND */}
      <div className="dash-panel-premium" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
          {i18n.language === 'fr' ? 'Tendance mensuelle' : 'Monthly Trend'}
        </h2>
        <div className="stats-bars-wrapper" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', gap: '0.5rem', paddingTop: '1rem' }}>
          {statsData.monthlyTrend.map((item, i) => {
            const heightPercent = Math.max(15, Math.round((item.count / maxTrend) * 100));
            return (
              <div
                className={`stats-bar-col ${i === statsData.monthlyTrend.length - 1 ? 'active' : ''}`}
                key={item.month}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', gap: '6px' }}
              >
                <div style={{ flex: 1, width: '100%', maxWidth: '28px', backgroundColor: '#F1F5F9', borderRadius: '6px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: `${heightPercent}%`, backgroundColor: i === statsData.monthlyTrend.length - 1 ? '#14B8A6' : '#94A3B8', borderRadius: '6px', transition: 'height 0.3s ease' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
