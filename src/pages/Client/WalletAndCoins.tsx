import './WalletAndCoins.css';
import React, { useState } from 'react';
import { Icon } from '../../App';
import Referrals from './Referrals';
import { api } from '../../services/api';

interface WalletAndCoinsProps {
  setActiveTab: (tab: string) => void;
  walletBalance?: number;
  clientBookings?: any[];
  clientTasks?: any[];
}

export default function WalletAndCoins({ setActiveTab, walletBalance = 0, clientBookings = [], clientTasks = [] }: WalletAndCoinsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'wallet' | 'referrals'>('wallet');
  const [transactions, setTransactions] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchTx = async () => {
      try {
        const res = await api.get('/wallet/transactions');
        setTransactions(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    fetchTx();
  }, []);

  const coinPackages = [
    { name: 'Starter Pack', coins: 10, bonus: 0, price: '5,000 XAF', popular: false },
    { name: 'Standard Pack', coins: 20, bonus: 2, price: '10,000 XAF', popular: true },
    { name: 'Popular Pack', coins: 30, bonus: 3, price: '15,000 XAF', popular: false },
    { name: 'Growth Pack', coins: 40, bonus: 4, price: '20,000 XAF', popular: false },
    { name: 'Premium Pack', coins: 50, bonus: 5, price: '25,000 XAF', popular: false }
  ];

  const [selectedMonth, setSelectedMonth] = useState('This Month');
  
  // Calculate spending based on real transactions
  const getFilteredTransactions = () => {
    const now = new Date();
    return transactions.filter(tx => {
      const txDate = new Date(tx.createdAt);
      if (selectedMonth === 'This Month') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      } else {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return txDate.getMonth() === lastMonth.getMonth() && txDate.getFullYear() === lastMonth.getFullYear();
      }
    });
  };

  const filteredTx = getFilteredTransactions();
  const spentTx = filteredTx.filter(tx => tx.amount < 0 || tx.type === 'SPEND');
  const totalSpent = Math.abs(spentTx.reduce((sum, tx) => sum + (tx.amount < 0 ? tx.amount : -tx.amount), 0));
  
  // Categories (mocking categorization since backend just has 'SPEND')
  const categories = [
    { name: 'Booking Payments', color: '#14B8A6', percent: totalSpent > 0 ? 60 : 0, amount: totalSpent * 0.6 },
    { name: 'Urgent Bookings', color: '#3B82F6', percent: totalSpent > 0 ? 25 : 0, amount: totalSpent * 0.25 },
    { name: 'Service Add-ons', color: '#F59E0B', percent: totalSpent > 0 ? 10 : 0, amount: totalSpent * 0.1 },
    { name: 'Other', color: '#A855F7', percent: totalSpent > 0 ? 5 : 0, amount: totalSpent * 0.05 }
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
      {activeSubTab === 'wallet' && (
        <div className="dash-metrics-grid" style={{ padding: '0 0.5rem', display: 'flex' }}>
          <div className="metric-card-premium m-coins" onClick={() => setActiveTab('Wallet & Coins')} style={{ cursor: 'pointer', maxWidth: '300px' }}>
            <div className="metric-card-header">
              <span>Coins Balance</span>
              <div className="metric-icon-box"><Icon name="wallet" /></div>
            </div>
            <strong className="metric-big-num">{walletBalance.toLocaleString()}</strong>
            <span className="metric-card-desc">Available Coins</span>
            <button className="coins-plus-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet & Coins'); }}>+</button>
          </div>
        </div>
      )}

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
                <select className="select-month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
              {totalSpent === 0 ? (
                <div className="chart-content-dash flex items-center justify-center py-8">
                  <p className="text-gray-500">No spending data for {selectedMonth.toLowerCase()}.</p>
                </div>
              ) : (
                <div className="chart-content-dash">
                  <div className="chart-svg-wrapper">
                    <svg width="140" height="140" viewBox="0 0 38 38" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="19" cy="19" r="15.915" fill="none" stroke="var(--line)" strokeWidth="3.5" />
                      <circle cx="19" cy="19" r="15.915" fill="none" stroke="#14B8A6" strokeWidth="3.5" strokeDasharray={`${categories[0].percent} ${100 - categories[0].percent}`} strokeDashoffset="100" />
                      <circle cx="19" cy="19" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3.5" strokeDasharray={`${categories[1].percent} ${100 - categories[1].percent}`} strokeDashoffset={`${100 - categories[0].percent}`} />
                      <circle cx="19" cy="19" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeDasharray={`${categories[2].percent} ${100 - categories[2].percent}`} strokeDashoffset={`${100 - categories[0].percent - categories[1].percent}`} />
                      <circle cx="19" cy="19" r="15.915" fill="none" stroke="#A855F7" strokeWidth="3.5" strokeDasharray={`${categories[3].percent} ${100 - categories[3].percent}`} strokeDashoffset={`${100 - categories[0].percent - categories[1].percent - categories[2].percent}`} />
                    </svg>
                    <div className="chart-inner-text">
                      <span className="chart-num">{totalSpent}</span>
                      <span className="chart-lbl">Total Coins Used</span>
                    </div>
                  </div>
                  <div className="chart-legend-list">
                    {categories.map((cat, idx) => (
                      <div className="legend-item-dash" key={idx}>
                        <span className="legend-color-dot" style={{ backgroundColor: cat.color }}></span>
                        <span>{cat.name}</span>
                        <span className="legend-val">{Math.round(cat.amount)} coins ({cat.percent}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <tr key={tx.id || tx._id}>
                          <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                          <td>{tx.description || tx.reason || 'Transaction'}</td>
                          <td>
                            <span className={`tx-type ${(tx.type === 'EARN' || tx.type === 'TOP_UP' || tx.amount > 0) ? 'earn' : 'spend'}`}>
                              {(tx.type === 'EARN' || tx.type === 'TOP_UP' || tx.amount > 0) ? 'Earn' : 'Spend'}
                            </span>
                          </td>
                          <td>{tx.amount > 0 ? `+${tx.amount}` : tx.amount} coins</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>No recent transactions.</td></tr>
                    )}
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
                    {pkg.bonus > 0 && <span className="text-green-500 font-bold text-sm block mb-1">+{pkg.bonus} Bonus Coins</span>}
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
