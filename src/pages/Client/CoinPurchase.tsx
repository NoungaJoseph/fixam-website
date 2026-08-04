import './CoinPurchase.css';
import { useState } from 'react';
import { Icon, IconName } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import MobileMoneyCheckoutModal from '../../components/MobileMoneyCheckoutModal';

interface CoinPurchaseProps {
  setActiveTab: (tab: string) => void;
}

export default function CoinPurchase({ setActiveTab }: CoinPurchaseProps) {
  const { refreshUser } = useAuth();
  const { i18n } = useTranslation();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>({ name: '', coins: 0, price: '' });

  const pkgs = [
    { name: 'Starter Pack', coins: 10, price: '5,000 XAF', popular: false },
    { name: 'Value Pack', coins: 50, price: '22,000 XAF', popular: true },
    { name: 'Pro Pack', coins: 100, price: '40,000 XAF', popular: false },
    { name: 'Enterprise Pack', coins: 250, price: '90,000 XAF', popular: false },
  ];

  const handleBuyInitiate = (p: typeof pkgs[0]) => {
    setSelectedPkg({
      name: p.name,
      coins: p.coins,
      price: p.price
    });
    setIsCheckoutOpen(true);
  };

  return (
    <div className="coin-purchase-layout animate-fade-in">
      <div className="coin-purchase-top">
        <div className="coin-bal-card">
          <div className="coin-bal-icon"><Icon name="wallet" /></div>
          <div>
            <span>{i18n.language === 'fr' ? 'Votre Solde de Pièces' : 'Your Coin Balance'}</span>
            <strong>1,250</strong>
          </div>
        </div>
      </div>

      <div className="dash-panel-premium" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {i18n.language === 'fr' ? 'Acheter des Pièces' : 'Buy Coins'}
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {i18n.language === 'fr' ? 'Rechargez votre portefeuille pour réserver instantanément des professionnels.' : 'Top up your wallet to book instant professional services.'}
        </p>
        <div className="coin-pkgs-grid">
          {pkgs.map((p, i) => (
            <div className={`coin-pkg-card ${p.popular ? 'popular' : ''}`} key={i}>
              {p.popular && <span className="pkg-pop-badge">Most Popular</span>}
              <h3>{p.name}</h3>
              <div className="pkg-coins">
                <strong>{p.coins}</strong> <span>Coins</span>
              </div>
              <span className="pkg-price">{p.price}</span>
              <button className="btn-buy-package" onClick={() => handleBuyInitiate(p)}>
                {i18n.language === 'fr' ? 'Acheter' : 'Buy Package'}
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

      <div className="dash-panel-premium">
        <div className="dash-panel-header-new">
          <h2>Recent Activity</h2>
          <button className="panel-link" onClick={() => setActiveTab('Notifications')}>View All</button>
        </div>
        <div className="activity-items-list">
          {[
            { cls: 'a-confirmed', icon: 'calendar' as IconName, title: 'You booked Plumber Pro', sub: 'Booking confirmed', time: '2 min ago' },
            { cls: 'a-accepted', icon: 'check' as IconName, title: 'John Doe accepted your request', sub: 'Electrical Installation', time: '15 min ago' },
            { cls: 'a-payment', icon: 'wallet' as IconName, title: 'Payment with coins completed', sub: '3 coins used', time: '1 hour ago' },
            { cls: 'a-message', icon: 'chat' as IconName, title: 'New message from CleanMaster', sub: 'Regarding your booking', time: '2 hours ago' },
            { cls: 'a-referral', icon: 'star' as IconName, title: 'You earned 1 coin from referral', sub: 'Your friend Roman joined Fixam', time: '1 day ago' },
          ].map((a, i) => (
            <div className={`activity-item-row ${a.cls}`} key={i}>
              <div className="activity-icon-container"><Icon name={a.icon} /></div>
              <div className="activity-details">
                <h4 className="activity-title">{a.title}</h4>
                <p className="activity-subtitle">{a.sub}</p>
              </div>
              <span className="activity-time">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
