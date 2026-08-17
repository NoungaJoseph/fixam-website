import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ServiceAgreementSectionProps {
  agreement?: any;
  isClient?: boolean;
  isProvider?: boolean;
  onRefresh?: () => void;
}

export const ServiceAgreementSection: React.FC<ServiceAgreementSectionProps> = ({
  agreement
}) => {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const [isOpenModal, setIsOpenModal] = useState(false);

  if (!agreement) return null;

  const terms = agreement.terms || {};
  const pdfUrl = `https://api.usefixam.com/api/agreements/${agreement.id}/pdf?lang=${i18n.language || 'en'}`;

  return (
    <div className="my-4 bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/50 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header (NO ICONS) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isFr ? 'Contrat de Service Fixam' : 'Fixam Service Agreement'}
          </h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            {agreement.publicAgreementNumber} (v{agreement.version})
          </p>
        </div>

        <span className="inline-block px-3 py-1 font-bold text-xs rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          {isFr ? 'ACTIF (Contrat Officiel)' : 'ACTIVE (Official Contract)'}
        </span>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl text-xs">
        <div>
          <span className="text-slate-400 block font-semibold">{isFr ? 'Service :' : 'Service:'}</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{terms.title || 'Service'}</span>
        </div>
        <div>
          <span className="text-slate-400 block font-semibold">{isFr ? 'Montant convenu :' : 'Agreed Amount:'}</span>
          <span className="font-bold text-teal-600 dark:text-teal-400">
            {terms.price ? terms.price.toLocaleString() : '0'} {terms.currency || 'XAF'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block font-semibold">{isFr ? 'Parties :' : 'Parties:'}</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {terms.client?.name || 'Client'} & {terms.provider?.name || 'Provider'}
          </span>
        </div>
      </div>

      {/* Action Buttons (NO ICONS) */}
      <div className="flex flex-wrap gap-3 pt-1">
        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition"
        >
          {isFr ? 'Consulter le contrat' : 'View Agreement'}
        </button>

        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition"
        >
          {isFr ? 'Télécharger PDF' : 'Download PDF'}
        </a>
      </div>

      {/* Full Contract Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isFr ? 'Contrat de Service Fixam' : 'Fixam Service Agreement'}
              </h3>
              <button onClick={() => setIsOpenModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
            </div>

            <p className="text-xs font-mono text-slate-500">
              {agreement.publicAgreementNumber} (v{agreement.version})
            </p>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">{isFr ? '1. PARTIES' : '1. PARTIES'}</p>
                <p className="text-slate-700 dark:text-slate-300">Client: <strong>{terms.client?.name}</strong> ({terms.client?.phone || 'N/A'})</p>
                <p className="text-slate-700 dark:text-slate-300">{isFr ? 'Prestataire :' : 'Provider:'} <strong>{terms.provider?.name}</strong> ({terms.provider?.phone || 'N/A'})</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">{isFr ? '2. SERVICE ET DESCRIPTION' : '2. SERVICE & SCOPE'}</p>
                <p className="text-slate-700 dark:text-slate-300">{isFr ? 'Intitulé :' : 'Title:'} <strong>{terms.title}</strong></p>
                <p className="text-slate-700 dark:text-slate-300">{isFr ? 'Description :' : 'Scope:'} {terms.scopeOfWork}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">{isFr ? '3. CALENDRIER ET PRICING' : '3. SCHEDULE & LOCATION'}</p>
                <p className="text-slate-700 dark:text-slate-300">Date: {terms.schedule?.date} {terms.schedule?.time}</p>
                <p className="text-slate-700 dark:text-slate-300">{isFr ? 'Lieu :' : 'Location:'} {terms.location}</p>
                <p className="text-teal-600 font-bold pt-1">{isFr ? 'Montant convenu :' : 'Total Budget:'} {terms.price ? terms.price.toLocaleString() : '0'} {terms.currency || 'XAF'}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">{isFr ? '4. STATUT DU CONTRAT' : '4. CONTRACT STATUS'}</p>
                <p className="font-bold text-emerald-600">
                  {isFr ? '✓ Contrat actif et exécutoire via Fixam' : '✓ Official Active Contract via Fixam Confirmation'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition"
              >
                {isFr ? 'Télécharger PDF' : 'Download PDF'}
              </a>
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
              >
                {isFr ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
