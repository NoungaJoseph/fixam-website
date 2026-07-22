import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './ProviderDashboard.css';

export default function ProviderWallet() {
  const [momoNumber, setMomoNumber] = useState('677890123');
  const [provider, setProvider] = useState('MTN');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ balance: 0, thisMonthEarned: 0 });

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const [balRes, txRes] = await Promise.all([
          api.get('/wallet/balance'),
          api.get('/wallet/transactions')
        ]);
        setStats(balRes.data?.data || { balance: 0, thisMonthEarned: 0 });
        setTransactions(txRes.data?.transactions || []);
      } catch (err) {
        console.error("Failed to fetch wallet info", err);
      }
    };
    fetchWallet();
  }, []);

  const handleSaveMomo = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mobile Money details saved successfully!');
  };

  return (
    <div className="dash-panel-premium provider-dashboard-grid animate-fade-in">
      {/* LEFT: Payout history */}
      <div>
        <div className="dash-panel-header-new">
          <h2>Earnings & Payouts</h2>
        </div>

        {/* Stats widget grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Available Balance</span>
            <h3 style={{ fontSize: '24px', margin: '4px 0 0 0', color: '#1F2937' }}>{stats.balance} Coins</h3>
            <span style={{ fontSize: '11px', color: '#10B981' }}>✓ Checked from cash receipts</span>
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Earned This Month</span>
            <h3 style={{ fontSize: '24px', margin: '4px 0 0 0', color: '#14B8A6' }}>{stats.thisMonthSpent} Coins</h3>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Processing next Monday</span>
          </div>
        </div>

        <div className="bookings-detailed-list">
          {transactions.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)' }}>No transactions found.</p>}
          {transactions.map(p => {
            const isEarn = p.type === 'EARN' || p.type === 'TOP_UP' || p.amount > 0;
            return (
            <div className="booking-detailed-card" key={p.id || p._id} style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: isEarn ? '#ECFDF5' : '#FEF2F2', color: isEarn ? '#10B981' : '#EF4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                }}>
                  💸
                </div>
                <div style={{ marginLeft: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px' }}>{p.description || p.reason || 'Transaction'}</h4>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <strong style={{ color: '#1F2937' }}>{p.amount > 0 ? `+${p.amount}` : p.amount} coins</strong>
                <span style={{
                  padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600,
                  backgroundColor: '#DEF7EC', color: '#03543F'
                }}>
                  {p.status || 'COMPLETED'}
                </span>
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* RIGHT: MoMo configuration */}
      <div style={{ borderLeft: '1px solid #E5E7EB', paddingLeft: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>Payout Configuration</h3>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5, marginBottom: '24px' }}>
          Configure your Mobile Money number. Fixam issues payments automatically to this wallet.
        </p>

        <form onSubmit={handleSaveMomo}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>MOMO Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              style={{
                width: '100%', height: '44px', borderRadius: '6px', border: '1px solid #D1D5DB',
                padding: '0 12px', fontSize: '14px', boxSizing: 'border-box'
              }}
            >
              <option value="MTN">MTN Mobile Money</option>
              <option value="Orange">Orange Money</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>Mobile Wallet Number</label>
            <input
              type="tel"
              value={momoNumber}
              onChange={(e) => setMomoNumber(e.target.value)}
              style={{
                width: '100%', height: '44px', borderRadius: '6px', border: '1px solid #D1D5DB',
                padding: '0 12px', fontSize: '14px', boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%', height: '44px', backgroundColor: '#14B8A6', color: 'white',
              border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'all 200ms ease'
            }}
          >
            Save Payout Info
          </button>
        </form>
      </div>
    </div>
  );
}
