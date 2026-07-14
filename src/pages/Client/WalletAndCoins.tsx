import './WalletAndCoins.css';
import React, { useState } from 'react';
import { Icon } from '../../App';
import Referrals from './Referrals';

interface WalletAndCoinsProps {
  setActiveTab: (tab: string) => void;
}

export default function WalletAndCoins({ setActiveTab }: WalletAndCoinsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'wallet' | 'referrals'>('wallet');

  const coinPackages = [
    { name: 'Starter Pack', coins: 10, price: '5,000 XAF', popular: false },
    { name: 'Value Pack', coins: 50, price: '22,000 XAF', popular: true },
    { name: 'Pro Pack', coins: 100, price: '40,000 XAF', popular: false }
  ];

  return (
    <div className="wallet-referrals-tab-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Subtabs Header */}
      <div className="dash-subtabs-header">
        <button 
          className={`subtab-btn ${activeSubTab === 'wallet' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('wallet')}
        >
          My Wallet
        </button>
        <button 
          className={`subtab-btn ${activeSubTab === 'referrals' ? 'active' : ''}`} 
          onClick={() => setActiveSubTab('referrals')}
        >
          Refer & Earn
        </button>
      </div>

      {/* Reusable Dashboard Metrics Grid */}
      <div className="dash-metrics-grid" style={{ padding: '0 0.5rem' }}>
        <div className="metric-card-premium m-bookings" onClick={() => setActiveTab('My Bookings')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Bookings</span>
            <div className="metric-icon-box"><Icon name="calendar" /></div>
          </div>
          <strong className="metric-big-num">12</strong>
          <span className="metric-card-desc">Total Bookings</span>
          <span className="metric-trend trend-up">↑ 20% this month</span>
        </div>

        <div className="metric-card-premium m-active" onClick={() => setActiveTab('My Bookings')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Active Tasks</span>
            <div className="metric-icon-box"><Icon name="briefcase" /></div>
          </div>
          <strong className="metric-big-num">4</strong>
          <span className="metric-card-desc">In Progress</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>

        <div className="metric-card-premium m-completed">
          <div className="metric-card-header">
            <span>Completed</span>
            <div className="metric-icon-box"><Icon name="check" /></div>
          </div>
          <strong className="metric-big-num">8</strong>
          <span className="metric-card-desc">Jobs Completed</span>
          <span className="metric-trend trend-up">↑ 15% this month</span>
        </div>

        <div className="metric-card-premium m-coins" onClick={() => setActiveTab('Wallet')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Coins Balance</span>
            <div className="metric-icon-box"><Icon name="wallet" /></div>
          </div>
          <strong className="metric-big-num">1,250</strong>
          <span className="metric-card-desc">Available Coins</span>
          <button className="coins-plus-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet'); }}>+</button>
        </div>

        <div className="metric-card-premium m-saved" onClick={() => setActiveTab('Profile Settings')} style={{ cursor: 'pointer' }}>
          <div className="metric-card-header">
            <span>Saved Providers</span>
            <div className="metric-icon-box"><Icon name="star" /></div>
          </div>
          <strong className="metric-big-num">18</strong>
          <span className="metric-card-desc">Saved</span>
          <span className="metric-view-all">View all &gt;</span>
        </div>
      </div>

      {activeSubTab === 'wallet' ? (
        <div className="wallet-tab-grid">
          <div className="wallet-left-column">
            <div className="dash-panel-premium main-wallet-card-premium" style={{ display: 'none' }}>
              <div className="card-top-wallet">
                <div>
                  <span className="wallet-lbl">Available Coins</span>
                  <strong className="wallet-big-val">1,250</strong>
                </div>
                <div className="wallet-chip"><Icon name="wallet" /></div>
              </div>
              <div className="wallet-pills-row">
                <div className="wallet-pill-stat">
                  <span>Total Earned</span>
                  <strong>1,450</strong>
                </div>
                <div className="wallet-pill-stat">
                  <span>Total Spent</span>
                  <strong>200</strong>
                </div>
              </div>
            </div>

            {/* Spending Overview Chart */}
            <div className="dash-panel-premium spending-chart-panel">
              <div className="dash-panel-header-new">
                <h2>Spending Overview</h2>
                <select className="select-month">
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
              <div className="chart-content-dash">
                <div className="chart-svg-wrapper">
                  <svg width="140" height="140" viewBox="0 0 38 38" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="19" cy="19" r="15.915" fill="none" stroke="var(--line)" strokeWidth="3.5" />
                    <circle cx="19" cy="19" r="15.915" fill="none" stroke="#14B8A6" strokeWidth="3.5" strokeDasharray="48 52" strokeDashoffset="100" />
                    <circle cx="19" cy="19" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3.5" strokeDasharray="24 76" strokeDashoffset="52" />
                    <circle cx="19" cy="19" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeDasharray="16 84" strokeDashoffset="28" />
                    <circle cx="19" cy="19" r="15.915" fill="none" stroke="#A855F7" strokeWidth="3.5" strokeDasharray="12 88" strokeDashoffset="12" />
                  </svg>
                  <div className="chart-inner-text">
                    <span className="chart-num">25</span>
                    <span className="chart-lbl">Total Coins Used</span>
                  </div>
                </div>
                <div className="chart-legend-list">
                  <div className="legend-item-dash">
                    <span className="legend-color-dot" style={{ backgroundColor: '#14B8A6' }}></span>
                    <span>Booking Payments</span>
                    <span className="legend-val">12 coins (48%)</span>
                  </div>
                  <div className="legend-item-dash">
                    <span className="legend-color-dot" style={{ backgroundColor: '#3B82F6' }}></span>
                    <span>Urgent Bookings</span>
                    <span className="legend-val">6 coins (24%)</span>
                  </div>
                  <div className="legend-item-dash">
                    <span className="legend-color-dot" style={{ backgroundColor: '#F59E0B' }}></span>
                    <span>Service Add-ons</span>
                    <span className="legend-val">4 coins (16%)</span>
                  </div>
                  <div className="legend-item-dash">
                    <span className="legend-color-dot" style={{ backgroundColor: '#A855F7' }}></span>
                    <span>Other</span>
                    <span className="legend-val">3 coins (12%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dash-panel-premium transactions-panel">
              <h2>Transaction History</h2>
              <div className="transactions-table-wrapper">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>May 20, 2026</td>
                      <td>Booked Plumber Pro</td>
                      <td><span className="tx-type spend">Spend</span></td>
                      <td>-3 coins</td>
                    </tr>
                    <tr>
                      <td>May 18, 2026</td>
                      <td>Referral Bonus (Roman)</td>
                      <td><span className="tx-type earn">Earn</span></td>
                      <td>+1 coin</td>
                    </tr>
                    <tr>
                      <td>May 15, 2026</td>
                      <td>Coins Top Up (Starter Pack)</td>
                      <td><span className="tx-type topup">Top Up</span></td>
                      <td>+10 coins</td>
                    </tr>
                    <tr>
                      <td>May 10, 2026</td>
                      <td>Booked CleanMaster</td>
                      <td><span className="tx-type spend">Spend</span></td>
                      <td>-5 coins</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="wallet-right-column">
            <div className="dash-panel-premium purchase-packages-panel">
              <h2>Buy Coins Package</h2>
              <p>Top up your wallet with coins to book instant professional services.</p>
              <div className="coin-packages-list">
                {coinPackages.map((pkg, idx) => (
                  <div className={`package-card ${pkg.popular ? 'popular' : ''}`} key={idx}>
                    {pkg.popular && <span className="popular-badge">Most Popular</span>}
                    <h3>{pkg.name}</h3>
                    <div className="package-coins">
                      <strong>{pkg.coins}</strong> <span>Coins</span>
                    </div>
                    <span className="package-price">{pkg.price}</span>
                    <button className="btn-buy-package" onClick={() => alert(`Purchase flow for ${pkg.name} initiated!`)}>Buy Package</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Referrals />
      )}
    </div>
  );
}
