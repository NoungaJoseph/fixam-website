import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Icon } from '../../App';

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
    <div className="max-w-7xl mx-auto w-full pt-6 animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Earnings & Payouts</h2>
        <p className="text-sm text-gray-500 mt-1">Track your income, view transaction history, and configure Mobile Money payouts.</p>
      </div>

      {/* Metrics Row */}
      <div className="dash-metrics-grid">
        <div className="metric-card-premium m-coins">
          <div className="metric-card-header">
            <span>Available Balance</span>
            <div className="metric-icon-box"><Icon name="wallet" /></div>
          </div>
          <strong className="metric-big-num">{stats.balance?.toLocaleString() || 0} Coins</strong>
          <span className="metric-card-desc">✓ Checked from cash receipts</span>
        </div>

        <div className="metric-card-premium m-active">
          <div className="metric-card-header">
            <span>Earned This Month</span>
            <div className="metric-icon-box"><Icon name="briefcase" /></div>
          </div>
          <strong className="metric-big-num">{stats.thisMonthSpent?.toLocaleString() || 0} Coins</strong>
          <span className="metric-card-desc">Processing next Monday</span>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* LEFT Column: Transactions (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg">📜</span>
            <h3 className="text-lg font-bold text-gray-800">Transaction History</h3>
          </div>

          <div className="transactions-table-wrapper">
            <table className="transactions-table w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-55">
                {transactions.length > 0 ? (
                  transactions.map((tx) => {
                    const isEarn = tx.type === 'EARN' || tx.type === 'TOP_UP' || tx.amount > 0;
                    return (
                      <tr key={tx.id || tx._id}>
                        <td className="py-4 text-sm text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-sm font-semibold text-gray-800">
                          {tx.description || tx.reason || 'Transaction'}
                        </td>
                        <td className="py-4">
                          <span className={`tx-type ${isEarn ? 'earn' : 'spend'}`}>
                            {isEarn ? 'Earn' : 'Spend'}
                          </span>
                        </td>
                        <td className={`py-4 text-sm font-black text-right ${isEarn ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount} coins
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400 font-medium">
                      No recent transactions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT Column: MoMo Payout Setup (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⚙️</span>
            <h3 className="text-lg font-bold text-gray-800">Payout Configuration</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            Configure your Mobile Money account details to enable automated weekly earnings payouts.
          </p>

          <form onSubmit={handleSaveMomo} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-550 uppercase tracking-wider mb-2">MOMO Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition bg-white"
              >
                <option value="MTN">MTN Mobile Money</option>
                <option value="Orange">Orange Money</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-550 uppercase tracking-wider mb-2">Mobile Wallet Number</label>
              <input
                type="tel"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition"
                placeholder="6xxxxxxxx"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#14B8A6] hover:bg-[#0F9788] text-white font-bold rounded-xl transition shadow-sm mt-2"
            >
              Save Payout Info
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
