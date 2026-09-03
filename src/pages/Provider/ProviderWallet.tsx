import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { Icon } from '../../App';
import MobileMoneyCheckoutModal from '../../components/MobileMoneyCheckoutModal';
import { useAuth } from '../../context/AuthContext';

export default function ProviderWallet({ setActiveTab }: { setActiveTab?: (tab: string) => void } = {}) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const { refreshUser } = useAuth();
  const { i18n } = useTranslation();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>({ name: '', coins: 0, price: '' });

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const [balRes, txRes] = await Promise.all([
          api.get('/wallet/balance'),
          api.get('/wallet/transactions')
        ]);
        const bal = balRes.data?.data?.balance ?? balRes.data?.balance ?? 0;
        setWalletBalance(bal);
        setTransactions(txRes.data?.data || txRes.data?.transactions || []);
      } catch (err) {
        console.error('Failed to fetch wallet info', err);
      }
    };
    fetchWallet();
  }, []);

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

      {/* Balance Card */}
      <div className="dash-metrics-grid" style={{ padding: '0 0.5rem', display: 'flex' }}>
        <div className="metric-card-premium m-coins" style={{ maxWidth: '300px' }}>
          <div className="metric-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{i18n.language === 'fr' ? 'Solde de pièces' : 'Coins Balance'}</span>
            <div className="metric-icon-box"><Icon name="wallet" /></div>
          </div>
          <strong className="metric-big-num">{walletBalance.toLocaleString()}</strong>
          <span className="metric-card-desc">{i18n.language === 'fr' ? 'Pièces disponibles' : 'Available Coins'}</span>
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
                ? 'Rechargez votre portefeuille en pièces pour débloquer des opportunités de travail premium et booster votre profil.'
                : 'Top up your wallet with coins to unlock premium job leads and boost your profile visibility.'}
            </p>
          </div>
          <div className="coin-packages-carousel" style={{ display: 'flex', overflowX: 'auto', gap: '1rem', paddingBottom: '1rem', paddingTop: '1rem', scrollbarWidth: 'thin' }}>
            {coinPackages.map((pkg, idx) => (
              <div className={`package-card ${pkg.popular ? 'popular' : ''}`} key={idx} style={{ minWidth: '240px', flex: '0 0 auto' }}>
                {pkg.popular && <span className="popular-badge">{i18n.language === 'fr' ? 'Le plus populaire' : 'Most Popular'}</span>}
                <h3>{pkg.name}</h3>
                <div className="package-coins">
                  <strong>{pkg.coins}</strong> <span>{i18n.language === 'fr' ? 'Pièces' : 'Coins'}</span>
                </div>
                {pkg.bonus > 0 && <span className="text-green-500 font-bold text-sm block mb-1">+{pkg.bonus} {i18n.language === 'fr' ? 'Pièces bonus' : 'Bonus Coins'}</span>}
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
            const balRes = await api.get('/wallet/balance');
            const bal = balRes.data?.data?.balance ?? balRes.data?.balance ?? 0;
            setWalletBalance(bal);
          }}
        />

        {/* Quick link to dedicated Transaction History */}
        <div style={{ marginTop: '0.5rem', padding: '1.25rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {i18n.language === 'fr' ? 'Historique des transactions' : 'Transaction History'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '2px 0 0' }}>
              {i18n.language === 'fr'
                ? 'Accédez à vos relevés complets et exportations CSV sur la page dédiée'
                : 'Access your full statement, receipts, and CSV downloads on the dedicated page'}
            </p>
          </div>
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('Transaction History')}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0D9488',
                border: '1.5px solid #14B8A6',
                borderRadius: '999px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {i18n.language === 'fr' ? 'Voir toutes les transactions →' : 'View Full History →'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
