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

      {/* Action Button (Download PDF) */}
      <div className="flex flex-wrap gap-3 pt-1">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition inline-flex items-center gap-2"
        >
          {isFr ? 'Télécharger le contrat (PDF)' : 'Download Contract (PDF)'}
        </a>
      </div>
    </div>
  );
};
