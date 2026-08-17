import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';

const CATEGORIES = [
  { key: 'WORK_INCOMPLETE', en: 'Work Incomplete', fr: 'Travail incomplet' },
  { key: 'POOR_QUALITY', en: 'Poor Quality / Work Not Properly Completed', fr: 'Mauvaise qualité / Travail non conforme' },
  { key: 'WRONG_SERVICE', en: 'Wrong Service Provided', fr: 'Mauvais service fourni' },
  { key: 'PROPERTY_DAMAGE', en: 'Property Damage', fr: 'Dommage matériel' },
  { key: 'MISSING_MATERIAL', en: 'Missing Item / Material', fr: 'Matériel manquant' },
  { key: 'BREACH_OF_AGREEMENT', en: 'Provider Did Not Follow Service Agreement', fr: 'Non-respect du contrat par le prestataire' },
  { key: 'PRICE_DISAGREEMENT', en: 'Price Disagreement', fr: 'Désaccord sur le prix' },
  { key: 'NO_SHOW', en: 'Provider Did Not Show Up', fr: 'Absence du prestataire' },
  { key: 'OTHER', en: 'Other Issue', fr: 'Autre problème' }
];

interface DisputeSectionProps {
  bookingId: string;
  disputeData?: any;
  isClient?: boolean;
  isProvider?: boolean;
  onRefresh?: () => void;
}

export const DisputeSection: React.FC<DisputeSectionProps> = ({
  bookingId,
  disputeData,
  isClient = false,
  isProvider = false,
  onRefresh
}) => {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [category, setCategory] = useState('WORK_INCOMPLETE');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const handleAddEvidence = () => {
    if (!evidenceUrl.trim()) return;
    setEvidenceList(prev => [...prev, { id: String(Date.now()), url: evidenceUrl.trim(), type: 'image' }]);
    setEvidenceUrl('');
  };

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert(isFr ? 'Veuillez décrire le problème' : 'Please describe the problem');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/disputes', {
        bookingId,
        category,
        description: description.trim(),
        clientEvidence: evidenceList
      });

      if (res.data?.success) {
        alert(isFr ? 'Rapport de litige soumis au Support Fixam' : 'Problem report submitted to Fixam Support.');
        setIsOpenModal(false);
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Error submitting dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResponse = async () => {
    if (!responseText.trim() || !disputeData?.id) return;
    setIsSubmitting(true);
    try {
      const res = await api.post(`/disputes/${disputeData.id}/respond`, { response: responseText.trim() });
      if (res.data?.success) {
        alert(isFr ? 'Réponse envoyée' : 'Response submitted.');
        setResponseText('');
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to submit response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteCorrection = async () => {
    if (!disputeData?.id) return;
    setIsSubmitting(true);
    try {
      const res = await api.post(`/disputes/${disputeData.id}/complete-correction`);
      if (res.data?.success) {
        alert(isFr ? 'Correction marquée comme terminée' : 'Correction marked as completed.');
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const events = Array.isArray(disputeData?.events) ? disputeData.events : [];
  const clientEvidence = Array.isArray(disputeData?.clientEvidence) ? disputeData.clientEvidence : [];

  return (
    <div className="my-4">
      {/* If No Active Dispute & User is Client -> Show Report Problem Button */}
      {!disputeData && isClient && (
        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl text-xs font-bold transition flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>{isFr ? 'Signaler un problème' : 'Report a Problem'}</span>
        </button>
      )}

      {/* Active Dispute Box */}
      {disputeData && (
        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">⚠️</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isFr ? 'Litige en cours' : 'Active Dispute'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ID: DSP-{disputeData.id?.substring(0, 8).toUpperCase()}
              </p>
            </div>

            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-xs rounded-full">
              {disputeData.status}
            </span>
          </div>

          {/* Details */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 space-y-2 text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {isFr ? 'Catégorie :' : 'Category:'} {CATEGORIES.find(c => c.key === disputeData.category)?.[isFr ? 'fr' : 'en'] || disputeData.category}
            </p>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {disputeData.description}
            </p>
          </div>

          {/* Evidence */}
          {clientEvidence.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isFr ? 'Preuves jointes :' : 'Attached Evidence:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {clientEvidence.map((item: any, idx: number) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 text-[11px] font-semibold rounded-lg hover:underline"
                  >
                    📎 {item.name || `Evidence #${idx + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Provider Response */}
          {disputeData.providerResponse && (
            <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl p-3 text-xs space-y-1">
              <p className="font-bold text-sky-900 dark:text-sky-200">
                {isFr ? 'Réponse du prestataire :' : 'Provider Response:'}
              </p>
              <p className="text-sky-800 dark:text-sky-300">{disputeData.providerResponse}</p>
            </div>
          )}

          {/* Resolution Outcome */}
          {disputeData.resolution && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-xs space-y-1">
              <p className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <span>✅</span>
                <span>{isFr ? 'Résolution officielle :' : 'Official Resolution:'} {disputeData.resolution}</span>
              </p>
              <p className="text-emerald-800 dark:text-emerald-300">{disputeData.resolutionReason}</p>
            </div>
          )}

          {/* Response Input */}
          {disputeData.status !== 'RESOLVED' && disputeData.status !== 'CLOSED' && (
            <div className="space-y-2">
              {((isProvider && disputeData.status === 'AWAITING_PROVIDER_RESPONSE') ||
                (isClient && disputeData.status === 'AWAITING_CLIENT_RESPONSE')) && (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={3}
                    placeholder={isFr ? 'Saisissez votre réponse ici...' : 'Type your response here...'}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={handleSendResponse}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    {isFr ? 'Envoyer la réponse' : 'Submit Response'}
                  </button>
                </div>
              )}

              {isProvider && disputeData.status === 'CORRECTION_REQUESTED' && (
                <button
                  onClick={handleCompleteCorrection}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
                >
                  {isFr ? 'Marquer la correction comme effectuée' : 'Mark Correction Completed'}
                </button>
              )}
            </div>
          )}

          {/* Timeline Audit Trail */}
          {events.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>{showTimeline ? '▼' : '▶'}</span>
                <span>{isFr ? 'Chronologie du litige' : 'Dispute Event Timeline'} ({events.length})</span>
              </button>

              {showTimeline && (
                <div className="mt-3 space-y-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 text-[11px]">
                  {events.map((evt: any) => (
                    <div key={evt.id} className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{evt.description}</p>
                        <p className="text-slate-400">{new Date(evt.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CREATE DISPUTE MODAL */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                <span>{isFr ? 'Signaler un problème / Litige' : 'Report a Problem / Open Dispute'}</span>
              </h3>
              <button onClick={() => setIsOpenModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
            </div>

            <form onSubmit={handleCreateDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isFr ? 'Sélectionner la catégorie du problème *' : 'Select Problem Category *'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.key} value={cat.key}>
                      {cat[isFr ? 'fr' : 'en']}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isFr ? 'Description du problème *' : 'Problem Description *'}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={isFr ? 'Expliquez clairement ce qui s\'est mal passé ou ce qui manque...' : 'Explain clearly what went wrong or what is missing...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isFr ? 'URL de la preuve / Image (optionnel)' : 'Evidence Image / File URL (optional)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    className="flex-1 p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddEvidence}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {evidenceList.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {evidenceList.map((item) => (
                    <span key={item.id} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[11px]">
                      📎 {item.url}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition"
                >
                  {isSubmitting ? (isFr ? 'Envoi...' : 'Submitting...') : (isFr ? 'Soumettre le litige' : 'Submit Dispute')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
