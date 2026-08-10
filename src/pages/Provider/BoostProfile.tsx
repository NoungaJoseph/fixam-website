import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './BoostProfile.css';

export default function BoostProfile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [realStats, setRealStats] = useState<{
    profileViews: number;
    searchAppearances: number;
    monthlyStats: any[];
    monthlyTrend: any[];
  }>({
    profileViews: 0,
    searchAppearances: 0,
    monthlyStats: [],
    monthlyTrend: [],
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/providers/stats/summary').catch(() => null);
      if (res?.data?.success && res.data.data) {
        setRealStats({
          profileViews: res.data.data.profileViews || 0,
          searchAppearances: res.data.data.searchAppearances || 0,
          monthlyStats: res.data.data.monthlyStats || [],
          monthlyTrend: res.data.data.monthlyTrend || [],
        });
      }
    } catch (error) {
      console.error('Failed to load stats', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoostSelect = async (duration: '1_WEEK' | '1_MONTH', coins: number) => {
    if (!window.confirm(`Boost Profile?\n${coins} coins will be deducted from your wallet balance.`)) {
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/providers/boost', { duration });
      if (res.data?.success) {
        alert('Profile boosted successfully! Your profile will rank at the top of client search results.');
        if (refreshUser) await refreshUser();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to boost profile. Please ensure you have sufficient coins in your wallet.');
    } finally {
      setLoading(false);
    }
  };

  const boostExpiresAt = user?.providerProfile?.boostExpiresAt;
  const isBoostActive = boostExpiresAt && new Date(boostExpiresAt) > new Date();

  // Process historical monthly trend / stats
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  
  const historicalStats = Array.from({ length: 6 }, (_, idx) => {
    const i = 5 - idx;
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mYear = d.getFullYear();
    const mMonth = d.getMonth() + 1;
    const label = monthNames[d.getMonth()];
    
    const found = realStats.monthlyStats.find((s: any) => s.year === mYear && s.month === mMonth);
    const trendFound = realStats.monthlyTrend.find((t: any) => t.month === label);
    
    return {
      label,
      fullLabel: `${label} ${mYear}`,
      views: found?.profileViews || 0,
      searches: found?.searchAppearances || (trendFound?.count ? trendFound.count * 2 : 0),
    };
  });

  const maxSearches = Math.max(...historicalStats.map(h => h.searches), 1);
  const maxViews = Math.max(...historicalStats.map(h => h.views), 1);

  return (
    <div className="boost-dashboard-container animate-fade-in max-w-6xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.1-1.63 1.1-2.6 0-1.8-1.5-3.3-3.3-3.3-.97 0-1.89.39-2.6 1.1z" />
                <path d="M12 15l-3-3 3-3" />
                <path d="M15 12l3 3-3 3" />
                <path d="M21 3l-8.5 8.5" />
              </svg>
            </span>
            Profile Boost Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Increase your profile visibility and get up to 5x more client direct bookings.
          </p>
        </div>
      </div>

      {/* Performance Stats Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <strong className="text-3xl font-black text-slate-900 tracking-tight">{realStats.profileViews}</strong>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Real Profile Views</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div>
            <strong className="text-3xl font-black text-slate-900 tracking-tight">{realStats.searchAppearances}</strong>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Search Appearances</p>
          </div>
        </div>
      </div>

      {/* Boost Action Purchase Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-full text-xs font-extrabold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            FEATURED PROMOTION
          </span>
          <h2 className="text-2xl font-black mb-2">Get Featured at the Top of Client Search Results</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Boosted profiles receive priority ranking in search results, custom badge highlighting, and get contacted 5x faster by clients looking for service providers in Cameroon.
          </p>

          {isBoostActive ? (
            <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <strong className="text-emerald-300 font-bold block">Profile Boost is Currently Active</strong>
                <span className="text-xs text-slate-300">
                  Expires on: {new Date(boostExpiresAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <button 
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50 cursor-pointer border-none"
                onClick={() => handleBoostSelect('1_WEEK', 3)}
                disabled={loading}
              >
                Boost 1 Week (3 Coins)
              </button>
              <button 
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50 cursor-pointer border-none"
                onClick={() => handleBoostSelect('1_MONTH', 10)}
                disabled={loading}
              >
                Boost 1 Month (10 Coins)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visual Analytics Trends */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Search Appearances Trend Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-6">Search Appearances Trend</h3>
          <div className="h-48 flex items-end gap-3 pt-4 border-b border-slate-100 pb-2">
            {historicalStats.map((item) => {
              const barHeight = Math.round((item.searches / maxSearches) * 100);
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-500">{item.searches}</span>
                  <div className="w-full bg-slate-100 rounded-t-lg h-36 flex items-end overflow-hidden">
                    <div 
                      className="w-full bg-emerald-500 group-hover:bg-emerald-600 transition-all rounded-t-lg"
                      style={{ height: `${Math.max(barHeight, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profile Views Trend Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-6">Profile Views Trend</h3>
          <div className="h-48 flex items-end gap-3 pt-4 border-b border-slate-100 pb-2">
            {historicalStats.map((item) => {
              const stemHeight = Math.round((item.views / maxViews) * 100);
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-500">{item.views}</span>
                  <div className="w-full h-36 flex flex-col items-center justify-end relative">
                    <div className="w-3 h-3 rounded-full bg-purple-600 shadow-sm z-10" />
                    <div 
                      className="w-1 bg-purple-200 transition-all rounded-full"
                      style={{ height: `${Math.max(stemHeight, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4">Monthly Performance History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-extrabold uppercase">
                <th className="p-3 rounded-l-lg">Month</th>
                <th className="p-3 text-center">Profile Views</th>
                <th className="p-3 text-center rounded-r-lg">Search Appearances</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {historicalStats.map((row) => (
                <tr key={row.label} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-bold text-slate-900">{row.fullLabel}</td>
                  <td className="p-3 text-center">{row.views}</td>
                  <td className="p-3 text-center">{row.searches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
