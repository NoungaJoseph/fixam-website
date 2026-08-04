import React, { useState, useEffect } from 'react';
import { Icon } from '../App';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const COUNTRY_DATA = {
  Cameroon: {
    name: 'Cameroon',
    nameFr: 'Cameroun',
    code: 'CM',
    dialCode: '+237',
    flag: '🇨🇲',
    currency: 'XAF',
    phoneLength: 9,
    regex: /^6\d{8}$/,
    placeholder: '6XX XXX XXX',
    paymentMethods: [
      { id: 'mtn', name: 'MTN Mobile Money', icon: '⚡', type: 'momo', methodKey: 'MTN_MOMO', providerKey: 'MTN' },
      { id: 'orange', name: 'Orange Money', icon: '🍊', type: 'momo', methodKey: 'ORANGE_MONEY', providerKey: 'ORANGE' }
    ]
  },
  Kenya: {
    name: 'Kenya',
    nameFr: 'Kenya',
    code: 'KE',
    dialCode: '+254',
    flag: '🇰🇪',
    currency: 'KES',
    phoneLength: 9,
    regex: /^(7|1)\d{8}$/,
    placeholder: '7XX XXX XXX',
    paymentMethods: [
      { id: 'mpesa', name: 'M-Pesa', icon: '🟢', type: 'momo', methodKey: 'M_PESA', providerKey: 'MPESA' }
    ]
  },
  Ghana: {
    name: 'Ghana',
    nameFr: 'Ghana',
    code: 'GH',
    dialCode: '+233',
    flag: '🇬🇭',
    currency: 'GHS',
    phoneLength: 9,
    regex: /^(2|5)\d{8}$/,
    placeholder: '2XX XXX XXX',
    paymentMethods: [
      { id: 'mtn', name: 'MTN MoMo', icon: '⚡', type: 'momo', methodKey: 'MTN_MOMO', providerKey: 'MTN' },
      { id: 'vodafone', name: 'Vodafone Cash', icon: '🔴', type: 'momo', methodKey: 'VODAFONE_CASH', providerKey: 'VODAFONE' }
    ]
  },
  "Ivory Coast": {
    name: 'Ivory Coast',
    nameFr: 'Côte d\'Ivoire',
    code: 'CI',
    dialCode: '+225',
    flag: '🇨🇮',
    currency: 'XOF',
    phoneLength: 10,
    regex: /^(01|05|07)\d{8}$/,
    placeholder: '07XX XX XX XX',
    paymentMethods: [
      { id: 'mtn', name: 'MTN Mobile Money', icon: '⚡', type: 'momo', methodKey: 'MTN_MOMO', providerKey: 'MTN' },
      { id: 'orange', name: 'Orange Money', icon: '🍊', type: 'momo', methodKey: 'ORANGE_MONEY', providerKey: 'ORANGE' },
      { id: 'wave', name: 'Wave', icon: '🌊', type: 'momo', methodKey: 'WAVE', providerKey: 'WAVE' }
    ]
  }
} as const;

interface MobileMoneyCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: {
    name: string;
    coins: number;
    price: string;
    rawPrice?: number;
  };
  onSuccess: () => void;
}

export default function MobileMoneyCheckoutModal({ isOpen, onClose, pkg, onSuccess }: MobileMoneyCheckoutModalProps) {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const [selectedCountryKey, setSelectedCountryKey] = useState<keyof typeof COUNTRY_DATA>('Cameroon');
  const countryConfig = COUNTRY_DATA[selectedCountryKey];
  const [selectedMethodId, setSelectedMethodId] = useState<string>(countryConfig.paymentMethods[0]?.id || 'mtn');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);

  // Sync operator method if country changes
  useEffect(() => {
    setSelectedMethodId(COUNTRY_DATA[selectedCountryKey].paymentMethods[0]?.id || '');
    setPhone('');
    setErrorMessage('');
  }, [selectedCountryKey]);

  // Clean prefilled phone if applicable
  useEffect(() => {
    if (user?.phone && user.phone.startsWith(countryConfig.dialCode)) {
      setPhone(user.phone.slice(countryConfig.dialCode.length));
    }
  }, [selectedCountryKey, user?.phone]);

  // Active polling every 3 seconds for payment success
  useEffect(() => {
    let intervalId: any;
    if (paymentStatus === 'PROCESSING' && activePaymentId) {
      const checkStatus = async () => {
        try {
          const res = await api.get(`/wallet/mobile-money/${activePaymentId}/status`);
          if (res.data.status === 'SUCCESS') {
            setPaymentStatus('SUCCESS');
            setLoading(false);
            clearInterval(intervalId);
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 2500);
          } else if (res.data.status === 'FAILED') {
            setPaymentStatus('FAILED');
            setLoading(false);
            setErrorMessage(res.data.data?.failureReason || 'Payment failed or timed out.');
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error('Polling status check failed', err);
        }
      };
      
      intervalId = setInterval(checkStatus, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentStatus, activePaymentId]);

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanPhone) {
      setErrorMessage(i18n.language === 'fr' ? 'Numéro de téléphone requis.' : 'Phone number is required.');
      return;
    }

    if (!countryConfig.regex.test(cleanPhone)) {
      setErrorMessage(i18n.language === 'fr' 
        ? `Numéro invalide. Format attendu: ${countryConfig.placeholder}`
        : `Invalid number. Expected format: ${countryConfig.placeholder}`
      );
      return;
    }

    setLoading(true);
    setPaymentStatus('PROCESSING');

    const method = countryConfig.paymentMethods.find(m => m.id === selectedMethodId);
    
    // Parse raw amount
    const cleanPrice = pkg.price.replace(/[^\d]/g, '');
    const amountVal = cleanPrice ? parseInt(cleanPrice, 10) : (pkg.rawPrice || 5000);

    try {
      const payload = {
        coins: pkg.coins,
        price: pkg.price,
        amount: amountVal,
        provider: method?.providerKey || 'MTN',
        phone: `${countryConfig.dialCode}${cleanPhone}`,
        fullName: user?.fullName || `${user?.firstName} ${user?.lastName}`.trim() || 'Client',
        email: user?.email || 'user@fixam.com'
      };

      const res = await api.post('/wallet/mobile-money/initiate', payload);
      if (res.data.success && res.data.data?.id) {
        setActivePaymentId(res.data.data.id);
      } else {
        // Fallback to topup request
        const topupRes = await api.post('/wallet/topup', {
          coins: pkg.coins,
          reference: `FIX-${Date.now()}`,
          paymentMethod: method?.methodKey,
          phone: `${countryConfig.dialCode}${cleanPhone}`
        });
        if (topupRes.data.success) {
          setPaymentStatus('SUCCESS');
          setLoading(false);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error(err);
      setPaymentStatus('FAILED');
      setLoading(false);
      setErrorMessage(err.response?.data?.message || 'Could not initiate payment.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-fade-in text-slate-800">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span>🪙</span> {i18n.language === 'fr' ? 'Recharger le Portefeuille' : 'Wallet Coin Purchase'}
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition font-bold"
          >
            ✕
          </button>
        </div>

        {paymentStatus === 'PROCESSING' ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h4 className="font-bold text-lg text-slate-800 mb-2">
              {i18n.language === 'fr' ? 'Demande de Paiement Soumise' : 'Payment Request Sent'}
            </h4>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-4">
              {i18n.language === 'fr' 
                ? 'Un message push a été envoyé sur votre téléphone. Veuillez entrer votre code PIN pour valider la transaction.'
                : 'A payment prompt has been sent to your phone. Please enter your PIN to approve the transaction.'
              }
            </p>
            <div className="bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-full font-bold animate-pulse">
              {i18n.language === 'fr' ? 'En attente de validation...' : 'Waiting for approval...'}
            </div>
          </div>
        ) : paymentStatus === 'SUCCESS' ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">
              ✓
            </div>
            <h4 className="font-bold text-lg text-slate-800 mb-2">
              {i18n.language === 'fr' ? 'Paiement Confirmé !' : 'Payment Confirmed!'}
            </h4>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              {i18n.language === 'fr'
                ? 'Les pièces ont été ajoutées avec succès à votre portefeuille Fixam.'
                : 'Coins have been successfully added to your Fixam wallet.'
              }
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5 flex-1 text-slate-700">
            {/* Purchase Summary */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {i18n.language === 'fr' ? 'PAQUET COINS' : 'COINS PACKAGE'}
                </span>
                <strong className="text-slate-800 font-bold text-sm">{pkg.name} ({pkg.coins} Coins)</strong>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {i18n.language === 'fr' ? 'PRIX TOTAL' : 'TOTAL PRICE'}
                </span>
                <strong className="text-teal-600 font-black text-lg">{pkg.price}</strong>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
                <span>⚠️</span> <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Country Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                {i18n.language === 'fr' ? '1. SÉLECTIONNER LE PAYS' : '1. SELECT COUNTRY'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(COUNTRY_DATA) as Array<keyof typeof COUNTRY_DATA>).map((cKey) => {
                  const isActive = selectedCountryKey === cKey;
                  return (
                    <button
                      type="button"
                      key={cKey}
                      onClick={() => setSelectedCountryKey(cKey)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-semibold transition ${isActive ? 'border-teal-500 bg-teal-50/20 text-teal-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span>{COUNTRY_DATA[cKey].flag}</span>
                      <span>{i18n.language === 'fr' ? COUNTRY_DATA[cKey].nameFr : COUNTRY_DATA[cKey].name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Operator selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                {i18n.language === 'fr' ? '2. OPÉRATEUR MOBILE' : '2. MOBILE OPERATOR'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {countryConfig.paymentMethods.map((method) => {
                  const isActive = selectedMethodId === method.id;
                  return (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setSelectedMethodId(method.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border text-xs font-bold transition ${isActive ? 'border-teal-500 bg-teal-50/20 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{method.icon}</span>
                        <span>{method.name}</span>
                      </span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isActive ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}`}>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Money Phone Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                {i18n.language === 'fr' ? '3. NUMÉRO MOBILE MONEY' : '3. MOBILE MONEY NUMBER'}
              </label>
              <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50 focus-within:border-teal-500 focus-within:bg-white transition">
                <span className="px-3 text-slate-500 text-sm font-bold border-r border-slate-200">{countryConfig.dialCode}</span>
                <input
                  type="text"
                  placeholder={countryConfig.placeholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, countryConfig.phoneLength))}
                  className="flex-1 bg-transparent px-3 py-2 text-sm font-bold outline-none text-slate-800 tracking-wider"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {i18n.language === 'fr' ? 'Traitement...' : 'Processing...'}
                </>
              ) : (
                <>
                  🔒 {i18n.language === 'fr' ? `Payer ${pkg.price}` : `Pay ${pkg.price}`}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
