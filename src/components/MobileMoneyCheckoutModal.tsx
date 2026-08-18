import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const CAMEROON_CONFIG = {
  name: 'Cameroon',
  nameFr: 'Cameroun',
  code: 'CM',
  dialCode: '+237',
  currency: 'XAF',
  phoneLength: 9,
  regex: /^6\d{8}$/,
  placeholder: '6XX XXX XXX',
  paymentMethods: [
    { id: 'mtn', name: 'MTN Mobile Money', shortName: 'MTN MoMo', methodKey: 'MTN_MOMO', providerKey: 'MTN', accentColor: '#EAB308' },
    { id: 'orange', name: 'Orange Money', shortName: 'Orange Money', methodKey: 'ORANGE_MONEY', providerKey: 'ORANGE', accentColor: '#F97316' }
  ]
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
  const isFr = i18n.language === 'fr';

  const [selectedMethodId, setSelectedMethodId] = useState<string>('mtn');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setPhone('');
    setErrorMessage('');
    setSelectedMethodId('mtn');
  }, [isOpen]);

  useEffect(() => {
    if (user?.phone && user.phone.startsWith(CAMEROON_CONFIG.dialCode)) {
      setPhone(user.phone.slice(CAMEROON_CONFIG.dialCode.length));
    } else if (user?.phone && /^6\d{8}$/.test(user.phone)) {
      setPhone(user.phone);
    }
  }, [user?.phone]);

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanPhone) {
      setErrorMessage(isFr ? 'Veuillez saisir votre numéro de téléphone.' : 'Please enter your phone number.');
      return;
    }

    if (!CAMEROON_CONFIG.regex.test(cleanPhone)) {
      setErrorMessage(isFr
        ? `Numéro invalide. Format attendu: 9 chiffres (ex: ${CAMEROON_CONFIG.placeholder})`
        : `Invalid number. Expected 9 digits format (e.g. ${CAMEROON_CONFIG.placeholder})`
      );
      return;
    }

    setLoading(true);

    const method = CAMEROON_CONFIG.paymentMethods.find(m => m.id === selectedMethodId);
    const fullPhone = `${CAMEROON_CONFIG.dialCode}${cleanPhone}`;

    try {
      await api.post('/wallet/payment-request', {
        coins: pkg.coins,
        price: pkg.price,
        phone: fullPhone,
        method: method?.name || selectedMethodId,
        packageName: pkg.name,
        lang: i18n.language
      });
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Payment request error:', err);
      setErrorMessage(err.response?.data?.message || err.message || (isFr ? 'Erreur lors de la soumission de la demande.' : 'Failed to submit payment request.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in text-slate-800">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col transition-all">
        
        {/* Header (NO ICONS) */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base tracking-wide uppercase text-white">
              {isFr ? 'Achat de Pièces Fixam' : 'Fixam Coin Top Up'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFr ? 'Paiement sécurisé Mobile Money (Cameroun)' : 'Secure Mobile Money Checkout (Cameroon)'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg w-8 h-8 flex items-center justify-center transition text-sm font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {submitted ? (
          /* Confirmation / Next Steps Screen */
          <div className="p-6 text-center flex flex-col items-center justify-center space-y-5">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl font-black">
              ✓
            </div>

            <div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                {isFr ? 'Demande transmise avec succès' : 'Payment Request Submitted'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed max-w-sm mx-auto">
                {isFr
                  ? `Votre demande pour le forfait ${pkg.name} (${pkg.coins} pièces - ${pkg.price}) a été enregistrée.`
                  : `Your request for ${pkg.name} (${pkg.coins} coins - ${pkg.price}) has been recorded.`}
              </p>
            </div>

            <div className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-left space-y-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isFr ? 'Prochaines étapes :' : 'Next Steps:'}
              </p>
              <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                {isFr ? (
                  <>
                    <li>Consultez la section <strong>Messages</strong> dans votre compte.</li>
                    <li>Un administrateur vous transmettra le numéro de compte de dépôt.</li>
                    <li>Validez le transfert MTN ou Orange Money.</li>
                    <li>Vos pièces seront créditées immédiatement après confirmation.</li>
                  </>
                ) : (
                  <>
                    <li>Check the <strong>Messages</strong> section in your account.</li>
                    <li>An admin will send you the designated transfer account number.</li>
                    <li>Complete your MTN or Orange Money transfer.</li>
                    <li>Your coin balance will be credited upon verification.</li>
                  </>
                )}
              </ol>
            </div>

            <button
              type="button"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-md"
              onClick={onClose}
            >
              {isFr ? 'Fermer' : 'Close'}
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5 flex-1 text-slate-700 dark:text-slate-200">
            
            {/* Purchase Package Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isFr ? 'FORFAIT SÉLECTIONNÉ' : 'SELECTED PACKAGE'}
                </span>
                <strong className="text-slate-900 dark:text-white font-bold text-sm block mt-0.5">
                  {pkg.name} ({pkg.coins} Coins)
                </strong>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isFr ? 'MONTANT' : 'TOTAL COST'}
                </span>
                <strong className="text-teal-600 dark:text-teal-400 font-extrabold text-base block mt-0.5">
                  {pkg.price}
                </strong>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs px-4 py-2.5 rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {/* Payment Method Selector (NO ICONS / NO EMOJIS) */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isFr ? 'Mode de paiement (Cameroun)' : 'Payment Method (Cameroon)'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CAMEROON_CONFIG.paymentMethods.map((method) => {
                  const isActive = selectedMethodId === method.id;
                  const isMtn = method.id === 'mtn';

                  return (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setSelectedMethodId(method.id)}
                      className={`relative p-3.5 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                        isActive
                          ? isMtn
                            ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40'
                            : 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/30 text-orange-900 dark:text-orange-200 ring-2 ring-orange-500/40'
                          : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-black tracking-wide uppercase">
                          {method.shortName}
                        </span>
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isActive
                            ? isMtn
                              ? 'border-amber-500 bg-amber-500'
                              : 'border-orange-500 bg-orange-500'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-400 mt-1">
                        {isMtn ? 'MTN Mobile Money' : 'Orange Money CM'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Number Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isFr ? 'Numéro Mobile Money' : 'Mobile Money Number'}
              </label>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 focus-within:border-teal-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition overflow-hidden">
                <span className="px-3.5 py-2.5 text-slate-500 dark:text-slate-400 text-xs font-bold border-r border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800">
                  {CAMEROON_CONFIG.dialCode}
                </span>
                <input
                  type="text"
                  placeholder={CAMEROON_CONFIG.placeholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, CAMEROON_CONFIG.phoneLength))}
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-xs font-bold outline-none text-slate-900 dark:text-white tracking-widest placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                {isFr ? 'Entrez votre numéro à 9 chiffres enregistré chez MTN ou Orange.' : 'Enter your 9-digit registered MTN or Orange phone number.'}
              </p>
            </div>

            {/* Submit Button (NO ICONS) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isFr ? 'Envoi en cours...' : 'Processing...'}</span>
                </span>
              ) : (
                <span>{isFr ? 'Soumettre la demande de paiement' : 'Submit Payment Request'}</span>
              )}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
