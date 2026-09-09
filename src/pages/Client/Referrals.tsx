import './Referrals.css';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, images } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function Referrals() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const defaultCode = (user as any)?.referralCode || `FIXAM-${user?.id?.slice(-5)?.toUpperCase() || 'VIP'}`;
  const [referralStats, setReferralStats] = useState({
    referralCode: defaultCode,
    friendsInvited: 0,
    coinsEarned: 0,
    referredUsers: [] as any[]
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/users/referral-stats');
        if (res.data && res.data.success) {
          setReferralStats(prev => ({
            ...prev,
            ...res.data.data,
            referralCode: res.data.data?.referralCode || prev.referralCode
          }));
        }
      } catch (error) {
        // Graceful fallback to user profile referral code
        if ((user as any)?.referralCode) {
          setReferralStats(prev => ({ ...prev, referralCode: (user as any).referralCode }));
        }
      }
    };
    loadStats();
  }, [user]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralStats.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    const shareText = isFr 
      ? `Rejoignez Fixam avec mon code de parrainage ${referralStats.referralCode} et gagnez des pièces bonus pour vos services ! https://usefixam.com`
      : `Use my referral code ${referralStats.referralCode} to join Fixam and earn bonus coins for services! https://usefixam.com`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Fixam',
          text: shareText,
          url: 'https://usefixam.com',
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in w-full pb-20">
      
      {/* Promo Image */}
      <div className="flex justify-center mb-6">
        <img 
          src={images.onboardingPayment || '/assets/payment.png'} 
          alt="Refer & Earn" 
          className="w-full max-w-sm rounded-2xl shadow-sm object-cover" 
        />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          {isFr ? 'Invitez des Amis, Gagnez des Pièces' : 'Invite Friends, Earn Coins'}
        </h2>
        <p className="text-gray-600 text-base max-w-lg mx-auto">
          {isFr 
            ? 'Partagez votre code exclusif. Dès qu\'un ami s\'inscrit et effectue une réservation, vous recevez tous les deux des pièces Fixam !'
            : 'Share your code with friends. When they join and book or complete a service, you both earn Fixam Coins!'}
        </p>
      </div>

      {/* Code Box */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6 flex flex-col">
        <span className="text-xs font-extrabold tracking-wider text-gray-500 uppercase mb-3">
          {isFr ? 'VOTRE CODE DE PARRAINAGE EXCLUSIF' : 'YOUR EXCLUSIVE REFERRAL CODE'}
        </span>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
          <span className="text-2xl font-black tracking-widest text-teal-700 select-all">
            {referralStats.referralCode}
          </span>
          <button 
            onClick={handleCopyCode}
            className={`px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition ${
              copied ? 'bg-green-600 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            <Icon name="check" />
            <span>{copied ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier' : 'Copy Code')}</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
          <span className="block text-3xl font-extrabold text-gray-900 mb-1">
            {referralStats.friendsInvited}
          </span>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            {isFr ? 'Amis Parrainés' : 'Friends Invited'}
          </span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
          <span className="block text-3xl font-extrabold text-teal-600 mb-1">
            {referralStats.coinsEarned}
          </span>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            {isFr ? 'Pièces Gagnées' : 'Coins Earned'}
          </span>
        </div>
      </div>

      {/* Share CTA Button */}
      <button 
        onClick={handleShare}
        className="w-full bg-[#14B8A6] text-white font-extrabold text-base py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#0F9788] transition shadow-md mb-10"
      >
        <Icon name="message" /> 
        <span>{isFr ? 'Partager mon Code dès Maintenant' : 'Invite Friends Now'}</span>
      </button>

      {/* How it works */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-gray-900 mb-6">
          {isFr ? 'Comment ça fonctionne' : 'How It Works'}
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-black shrink-0">1</div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                {isFr ? 'Partagez votre code' : 'Share your unique code'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isFr 
                  ? 'Envoyez votre code par WhatsApp, SMS ou réseaux sociaux à vos contacts ayant besoin d\'un service.'
                  : 'Send your code via WhatsApp, SMS, or social media to anyone looking for trusted trade services.'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-black shrink-0">2</div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                {isFr ? 'Vos amis s\'inscrivent' : 'Friends sign up on Fixam'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isFr 
                  ? 'Ils saisissent votre code de parrainage lors de leur inscription sur l\'application ou le site web.'
                  : 'They enter your referral code when creating their Fixam account.'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-black shrink-0">3</div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                {isFr ? 'Recevez des récompenses' : 'Unlock bonus coins'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isFr 
                  ? 'Dès leur premier service validé, vous recevez automatiquement vos pièces de fidélité gratuites.'
                  : 'Once they complete their first service booking, you automatically receive reward coins directly in your wallet.'}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
