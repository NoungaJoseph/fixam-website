import './Referrals.css';
import { useState, useEffect } from 'react';
import { Icon, images } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function Referrals() {
  const { user } = useAuth();
  const [referralStats, setReferralStats] = useState({
    referralCode: (user as any)?.referralCode || 'NO-CODE-YET',
    friendsInvited: 0,
    coinsEarned: 0,
    referredUsers: [] as any[]
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/users/referral-stats');
        if (res.data && res.data.success) {
          setReferralStats(res.data);
        }
      } catch (error) {
        console.error('Referral stats failed:', error);
      }
    };
    loadStats();
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralStats.referralCode);
      alert('Referral code copied to clipboard!');
    } catch (err) {
      alert('Failed to copy code.');
    }
  };

  const handleShare = async () => {
    const shareText = `Use my referral code ${referralStats.referralCode} to join Fixam!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Fixam',
          text: shareText,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Share message copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in w-full pb-20">
      
      {/* Promo Image */}
      <div className="flex justify-center mb-8">
        <img src={images.onboardingPayment} alt="Refer & Earn" className="w-full max-w-sm rounded-2xl shadow-sm object-cover" />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Invite Friends, Earn Coins</h2>
        <p className="text-gray-500 text-lg">Share your code with friends. When they join and complete a booking, you both earn coins!</p>
      </div>

      {/* Code Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 flex flex-col">
        <span className="text-sm font-semibold text-gray-500 mb-2">YOUR REFERRAL CODE</span>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
          <span className="text-2xl font-bold tracking-widest text-gray-900">{referralStats.referralCode}</span>
          <button 
            onClick={handleCopyCode}
            className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition"
          >
            <Icon name="check" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <span className="block text-3xl font-bold text-gray-900 mb-1">{referralStats.friendsInvited}</span>
          <span className="text-sm text-gray-500 font-medium">Friends Invited</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <span className="block text-3xl font-bold text-green-500 mb-1">{referralStats.coinsEarned}</span>
          <span className="text-sm text-gray-500 font-medium">Coins Earned</span>
        </div>
      </div>

      <button 
        onClick={handleShare}
        className="w-full bg-[#14B8A6] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#0F9788] transition shadow-md mb-10"
      >
        <Icon name="message" /> Invite Friends Now
      </button>

      {/* How it works */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6">How it works</h3>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#14B8A6] text-white flex items-center justify-center font-bold shrink-0">1</div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Share your code</h4>
              <p className="text-sm text-gray-500">Send your unique code to friends who need services or want to offer them.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#14B8A6] text-white flex items-center justify-center font-bold shrink-0">2</div>
            <div>
              <h4 className="text-base font-bold text-gray-900">They join Fixam</h4>
              <p className="text-sm text-gray-500">Your friends sign up and enter your code during registration.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#14B8A6] text-white flex items-center justify-center font-bold shrink-0">3</div>
            <div>
              <h4 className="text-base font-bold text-gray-900">You both earn!</h4>
              <p className="text-sm text-gray-500">Once they complete their first booking, you both receive bonus coins.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referred Users List */}
      {referralStats.referredUsers.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Friends You Invited</h3>
          <div className="space-y-3">
            {referralStats.referredUsers.map((rUser: any) => (
              <div key={rUser.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  {rUser.avatar ? (
                    <img src={rUser.avatar} alt={rUser.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                      <Icon name="user" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{rUser.name}</h4>
                    <span className="text-xs text-gray-500">Joined {new Date(rUser.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
                  +1 Coin
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
