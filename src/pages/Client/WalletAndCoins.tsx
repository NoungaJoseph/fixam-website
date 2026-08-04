import './WalletAndCoins.css';
import React, { useState } from 'react';
import { Icon } from '../../App';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import MobileMoneyCheckoutModal from '../../components/MobileMoneyCheckoutModal';

interface WalletAndCoinsProps {
  setActiveTab: (tab: string) => void;
  walletBalance?: number;
  clientBookings?: any[];
  clientTasks?: any[];
}

export default function WalletAndCoins({ setActiveTab, walletBalance = 0, clientBookings = [], clientTasks = [] }: WalletAndCoinsProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const { refreshUser } = useAuth();
  const { i18n } = useTranslation();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>({ name: '', coins: 0, price: '' });

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
  }, [walletBalance]);

  const coinPackages = [
    { name: 'Starter Pack', coins: 10, bonus: 0, price: '5,000 XAF', popular: false },
    { name: 'Standard Pack', coins: 20, bonus: 2, price: '10,000 XAF', popular: true },
    { name: 'Popular Pack', coins: 30, bonus: 3, price: '15,000 XAF', popular: false },
    { name: 'Growth Pack', coins: 40, bonus: 4, price: '20,000 XAF', popular: false },
    { name: 'Premium Pack', coins: 50, bonus: 5, price: '25,000 XAF', popular: false }
  ];

  const handleBuyInitiate = (pkg: typeof coinPackages[0]) => {
    setSelectedPkg({
      name: pkg.name,
      coins: pkg.coins + pkg.bonus,
      price: pkg.price
    });
    setIsCheckoutOpen(true);
  };

  return (
    <div className="wallet-referrals-tab-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1.5rem' }}>
      
      {/* Reusable Dashboard Metrics Grid */}
      <div className="dash-metrics-grid" style={{ padding: '0 0.5rem', display: 'flex' }}>
        <div className="metric-card-premium m-coins" onClick={() => setActiveTab('Wallet & Coins')} style={{ cursor: 'pointer', maxWidth: '300px' }}>
          <div className="metric-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Coins Balance</span>
            <div className="metric-icon-box"><Icon name="wallet" /></div>
          </div>
          <strong className="metric-big-num">{walletBalance.toLocaleString()}</strong>
          <span className="metric-card-desc">Available Coins</span>
        </div>
      </div>

      <div className="wallet-layout-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 0.5rem' }}>
        
        {/* Coin Packages Carousel */}
        <div className="coin-packages-carousel-container" style={{ width: '100%' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
              {i18n.language === 'fr' ? 'Acheter un forfait de pièces' : 'Buy Coins Package'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              {i18n.language === 'fr' 
                ? 'Rechargez votre portefeuille pour réserver instantanément des professionnels.'
                : 'Top up your wallet with coins to book instant professional services.'}
            </p>
          </div>
          <div className="coin-packages-carousel" style={{ display: 'flex', overflowX: 'auto', gap: '1rem', paddingBottom: '1rem', paddingTop: '1rem', scrollbarWidth: 'thin' }}>
            {coinPackages.map((pkg, idx) => (
              <div className={`package-card ${pkg.popular ? 'popular' : ''}`} key={idx} style={{ minWidth: '240px', flex: '0 0 auto' }}>
                {pkg.popular && <span className="popular-badge">Most Popular</span>}
                <h3>{pkg.name}</h3>
                <div className="package-coins">
                  <strong>{pkg.coins}</strong> <span>Coins</span>
                </div>
                {pkg.bonus > 0 && <span className="text-green-500 font-bold text-sm block mb-1">+{pkg.bonus} Bonus Coins</span>}
                <span className="package-price">{pkg.price}</span>
                <button className="btn-buy-package" onClick={() => handleBuyInitiate(pkg)}>
                  {i18n.language === 'fr' ? 'Acheter le pack' : 'Buy Package'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <MobileMoneyCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          pkg={selectedPkg}
          onSuccess={async () => {
            await refreshUser();
          }}
        />

        <div className="wallet-left-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="transactions-panel-transparent" style={{ marginTop: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Transaction History</h2>
              <div className="transactions-table-wrapper" style={{ overflowX: 'auto' }}>
                <table className="transactions-table" style={{ width: '100%', minWidth: '500px', backgroundColor: 'transparent' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                      <th style={{ padding: '1rem 0.5rem', color: '#64748B', fontWeight: 600 }}>Date</th>
                      <th style={{ padding: '1rem 0.5rem', color: '#64748B', fontWeight: 600 }}>Description</th>
                      <th style={{ padding: '1rem 0.5rem', color: '#64748B', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '1rem 0.5rem', color: '#64748B', fontWeight: 600 }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <tr key={tx.id || tx._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '1rem 0.5rem', color: '#334155' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '1rem 0.5rem', color: '#334155', fontWeight: 500 }}>{tx.description || tx.reason || 'Transaction'}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <span className={`tx-type ${(tx.type === 'EARN' || tx.type === 'TOP_UP' || tx.amount > 0) ? 'earn' : 'spend'}`}>
                              {(tx.type === 'EARN' || tx.type === 'TOP_UP' || tx.amount > 0) ? 'Earn' : 'Spend'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 0.5rem', color: '#0F172A', fontWeight: 700 }}>
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} coins
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>No recent transactions.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

    </div>
  );
}
