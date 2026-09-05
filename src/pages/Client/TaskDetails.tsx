import React, { useState, useEffect } from 'react';
import { Icon, getMediaUrl, DEFAULT_AVATAR } from '../../App';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import ReviewModal from '../../components/ReviewModal';

interface TaskDetailsProps {
  task: any;
  setActiveTab: (tab: string) => void;
  setSelectedTask?: (task: any) => void;
  setActiveChatUser?: (user: any) => void;
}

export default function TaskDetails({ task, setActiveTab, setSelectedTask, setActiveChatUser }: TaskDetailsProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [taskData, setTaskData] = useState<any>(task);
  const [hiringAssignmentId, setHiringAssignmentId] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<{ jobId: string; targetUserId: string; targetName: string } | null>(null);

  useEffect(() => {
    if (task && (task.id || task._id)) {
      const taskId = task.id || task._id;
      api.get(`/jobs/${taskId}`)
        .then((res) => {
          if (res.data?.data) {
            setTaskData(res.data.data);
          }
        })
        .catch((err) => console.warn('Could not fetch fresh task details:', err));
    }
  }, [task]);

  if (!taskData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <p className="text-gray-500 mb-4">{isFr ? 'Aucune tâche sélectionnée.' : 'No task selected.'}</p>
        <button 
          className="btn-primary-pill bg-[#14B8A6] text-white px-6 py-2.5 rounded-full font-bold shadow hover:bg-[#0D9488] transition" 
          onClick={() => {
            if (setSelectedTask) setSelectedTask(null);
            setActiveTab('My Tasks');
          }}
        >
          {isFr ? 'Retour à mes tâches' : 'Back to My Tasks'}
        </button>
      </div>
    );
  }

  const taskId = taskData.id || taskData._id;
  const status = String(taskData.status || 'PENDING').toUpperCase();

  // Format Duration / Period
  const getDurationLabel = () => {
    if (taskData.taskScope === 'SMALL') return isFr ? 'Moins d\'une journée' : 'Small (Less than a day)';
    if (taskData.taskScope === 'MEDIUM') return isFr ? '1 à 3 jours' : 'Medium (1 to 3 days)';
    if (taskData.taskScope === 'LARGE') return isFr ? 'Plus de 3 jours' : 'Large (More than 3 days)';
    if (taskData.duration) return taskData.duration;
    if (taskData.estimatedDuration) return taskData.estimatedDuration;
    return isFr ? 'Projet flexible' : 'Project-based / Flexible';
  };

  // Format Scheduled Start
  const formatScheduledDate = () => {
    if (!taskData.scheduledTime) return null;
    try {
      const d = new Date(taskData.scheduledTime);
      return d.toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return String(taskData.scheduledTime);
    }
  };

  const getStatusBadge = (st: string) => {
    if (st === 'COMPLETED') return { bg: '#DCFCE7', text: '#166534', label: isFr ? 'Terminé' : 'Completed' };
    if (st === 'IN_PROGRESS' || st === 'ASSIGNED') return { bg: '#DBEAFE', text: '#1E40AF', label: isFr ? 'En cours' : 'In Progress' };
    if (st === 'CANCELLED' || st === 'REJECTED') return { bg: '#FEE2E2', text: '#991B1B', label: isFr ? 'Annulé' : 'Cancelled' };
    return { bg: '#FEF9C3', text: '#854D0E', label: isFr ? 'En attente d\'offres' : 'Pending Proposals' };
  };

  const statusBadge = getStatusBadge(status);
  const scheduledStr = formatScheduledDate();
  const durationStr = getDurationLabel();
  const rawBudget = taskData.budget || taskData.budgetMax || taskData.budgetMin || 0;
  const budgetStr = rawBudget ? `${Number(rawBudget).toLocaleString()} XAF` : (isFr ? 'Sur devis' : 'Open for bids');

  // List of proposals/applications received
  const proposals = taskData.assignments || taskData.applications || taskData.applicants || [];

  const handleHireProvider = async (assignmentId: string, providerName: string) => {
    if (!confirm(isFr ? `Engager ${providerName} pour cette tâche ?` : `Hire ${providerName} for this task?`)) return;
    setHiringAssignmentId(assignmentId);
    try {
      await api.patch(`/jobs/${taskId}/assign/${assignmentId}`, { status: 'ACCEPTED' });
      alert(isFr ? 'Prestataire engagé avec succès !' : 'Specialist hired successfully!');
      // Refresh task
      const updated = await api.get(`/jobs/${taskId}`).catch(() => null);
      if (updated?.data?.data) {
        setTaskData(updated.data.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || (isFr ? 'Échec de l\'attribution.' : 'Failed to hire provider.'));
    } finally {
      setHiringAssignmentId(null);
    }
  };

  const handleCancelTask = async () => {
    if (!confirm(isFr ? 'Voulez-vous vraiment annuler cette mission ?' : 'Are you sure you want to cancel this task?')) return;
    try {
      await api.patch(`/jobs/${taskId}/status`, { status: 'CANCELLED' });
      alert(isFr ? 'Mission annulée avec succès.' : 'Task cancelled successfully.');
      if (setSelectedTask) setSelectedTask(null);
      setActiveTab('My Tasks');
    } catch (err: any) {
      alert(err.response?.data?.message || (isFr ? 'Échec de l\'annulation.' : 'Failed to cancel task.'));
    }
  };

  return (
    <div className="upwork-modal-overlay animate-fade-in" onClick={() => { if (setSelectedTask) setSelectedTask(null); setActiveTab('My Tasks'); }}>
      <div className="upwork-modal-drawer animate-slide-left" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Drawer Navigation Bar */}
        <div className="upwork-drawer-topbar">
          <button 
            className="btn-back-arrow-text flex items-center gap-2 text-slate-700 hover:text-teal-600 font-bold transition cursor-pointer" 
            onClick={() => {
              if (setSelectedTask) setSelectedTask(null);
              setActiveTab('My Tasks');
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            <span>{isFr ? 'Retour aux tâches' : 'Back to My Tasks'}</span>
          </button>
          <span 
            className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
            style={{ backgroundColor: statusBadge.bg, color: statusBadge.text }}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Modal Drawer 2-Column Body */}
        <div className="upwork-drawer-body overflow-y-auto">
          {/* LEFT MAIN COLUMN */}
          <div className="upwork-left-column">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-teal-600 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">
                {taskData.category || 'General Service'}
              </span>
              {taskData.isRemote && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  🌐 {isFr ? 'À distance' : 'Online / Remote'}
                </span>
              )}
            </div>

            <h1 className="upwork-job-title text-2xl font-black text-slate-900 mb-2">
              {taskData.title}
            </h1>

            <div className="upwork-meta-line flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
              <span>📅 {isFr ? 'Publié le' : 'Posted'}: {new Date(taskData.createdAt || Date.now()).toLocaleDateString()}</span>
              <span className="dot">•</span>
              <span>📍 {taskData.location || (taskData.isRemote ? (isFr ? 'En ligne' : 'Remote') : 'On-Site / Cameroon')}</span>
            </div>

            <div className="upwork-divider my-4 border-t border-slate-100" />

            {/* Price & Duration Metrics Grid */}
            <div className="upwork-metrics-row grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="upwork-metric-box bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <span className="metric-icon text-2xl">🏷️</span>
                <div>
                  <strong className="block text-slate-800 text-sm font-extrabold">{budgetStr}</strong>
                  <small className="text-slate-500 text-xs">{isFr ? 'Budget estimé' : 'Estimated Budget'}</small>
                </div>
              </div>

              <div className="upwork-metric-box bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <span className="metric-icon text-2xl">⏱️</span>
                <div>
                  <strong className="block text-slate-800 text-sm font-extrabold">{durationStr}</strong>
                  <small className="text-slate-500 text-xs">{isFr ? 'Période / Durée' : 'Time / Duration'}</small>
                </div>
              </div>

              <div className="upwork-metric-box bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <span className="metric-icon text-2xl">👥</span>
                <div>
                  <strong className="block text-slate-800 text-sm font-extrabold">
                    {taskData.providersNeeded || 1} {isFr ? 'Personne(s)' : 'Specialist(s)'}
                  </strong>
                  <small className="text-slate-500 text-xs">{isFr ? 'Effectif requis' : 'Workforce Needed'}</small>
                </div>
              </div>
            </div>

            {scheduledStr && (
              <div className="bg-teal-50/60 border border-teal-200/70 rounded-xl p-3 text-xs text-teal-900 flex items-center gap-2 mb-4">
                <span>🗓️</span>
                <span><strong>{isFr ? 'Début souhaité' : 'Preferred Start Date'} :</strong> {scheduledStr}</span>
              </div>
            )}

            {/* Description */}
            <div className="upwork-section mt-5">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isFr ? 'Description de la mission' : 'Task Description'}
              </h3>
              <p className="upwork-text-block text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                {taskData.description || (isFr ? 'Aucune description fournie.' : 'No description provided.')}
              </p>
            </div>

            {/* Deliverables / Scope */}
            {taskData.whatNeedsDone && (
              <div className="upwork-section mt-5">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isFr ? 'Ce qui doit être fait' : 'What Needs to Be Done'}
                </h3>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-sm text-slate-700">
                  {taskData.whatNeedsDone}
                </div>
              </div>
            )}

            {/* Important Details & Materials */}
            {(taskData.importantDetails || (taskData.materialsList && taskData.materialsList.length > 0) || taskData.requiresDiagnosis) && (
              <div className="upwork-section mt-5">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isFr ? 'Détails & Matériaux' : 'Important Details & Materials'}
                </h3>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-sm text-slate-700 space-y-3">
                  {taskData.importantDetails && (
                    <p className="text-xs text-slate-600">
                      <strong>{isFr ? 'Remarques importantes' : 'Important Notes'}:</strong> {taskData.importantDetails}
                    </p>
                  )}

                  {taskData.requiresDiagnosis && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-100/50 p-2 rounded-lg">
                      <span>🔍</span>
                      <span>{isFr ? 'Diagnostic préliminaire requis sur place.' : 'Preliminary diagnosis required on-site.'}</span>
                    </div>
                  )}

                  {taskData.materialsList && taskData.materialsList.length > 0 && (
                    <div>
                      <strong className="block text-xs text-slate-700 mb-1.5">{isFr ? 'Liste du matériel :' : 'Materials List:'}</strong>
                      <div className="space-y-1">
                        {taskData.materialsList.map((mat: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200">
                            <span className="font-medium text-slate-800">{mat.name} {mat.quantity ? `(${mat.quantity})` : ''}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                              {mat.suppliedBy === 'PROVIDER' ? (isFr ? 'Fourni par le prestataire' : 'Provider Supplies') : (isFr ? 'Fourni par le client' : 'Client Supplies')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="upwork-divider my-6 border-t border-slate-100" />

            {/* Proposals / Offers Received */}
            <div className="upwork-section">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {isFr ? 'Propositions reçues' : 'Proposals & Offers'} ({proposals.length})
                </h3>
              </div>

              {proposals.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <span className="text-3xl block mb-2">📬</span>
                  <p className="text-sm font-bold text-slate-700 mb-1">
                    {isFr ? 'Aucune proposition reçue pour le moment' : 'No proposals received yet'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {isFr
                      ? 'Les professionnels qualifiés dans votre région examinent actuellement votre demande.'
                      : 'Verified professionals in your area are reviewing your task and will submit proposals shortly.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {proposals.map((prop: any) => {
                    const propId = prop.id || prop._id;
                    const providerUser = prop.provider?.user || prop.provider || prop.user || {};
                    const pName = providerUser.fullName || `${providerUser.firstName || ''} ${providerUser.lastName || ''}`.trim() || 'Service Specialist';
                    const pAvatar = providerUser.avatar ? getMediaUrl(providerUser.avatar) : DEFAULT_AVATAR;
                    const propPrice = prop.proposedBudget || prop.budget || prop.bidAmount;
                    const isAccepted = prop.status === 'ACCEPTED' || prop.status === 'HIRED';

                    return (
                      <div 
                        key={propId} 
                        className={`p-4 rounded-xl border transition ${isAccepted ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200 hover:border-teal-300 shadow-sm'}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={pAvatar} 
                              alt={pName} 
                              className="w-12 h-12 rounded-full object-cover border border-teal-100"
                              onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }} 
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm">{pName}</h4>
                                {isAccepted && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                    {isFr ? 'Engagé' : 'Hired'}
                                  </span>
                                )}
                              </div>
                              {prop.coverLetter && (
                                <p className="text-xs text-slate-600 mt-1 line-clamp-2 italic">
                                  "{prop.coverLetter}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:self-center">
                            {propPrice && (
                              <div className="text-right">
                                <span className="block text-sm font-extrabold text-teal-600">
                                  {Number(propPrice).toLocaleString()} XAF
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {isFr ? 'Offre proposée' : 'Offered Price'}
                                </span>
                              </div>
                            )}

                            <div className="flex gap-2">
                              {setActiveChatUser && (
                                <button
                                  type="button"
                                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                  onClick={() => {
                                    setActiveChatUser({ id: providerUser.id || providerUser.userId, name: pName, avatar: pAvatar });
                                    if (setSelectedTask) setSelectedTask(null);
                                    setActiveTab('Messages');
                                  }}
                                >
                                  <Icon name="chat" />
                                  <span>{isFr ? 'Message' : 'Message'}</span>
                                </button>
                              )}

                              {!isAccepted && status !== 'COMPLETED' && status !== 'CANCELLED' && (
                                <button
                                  type="button"
                                  disabled={hiringAssignmentId === propId}
                                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                                  onClick={() => handleHireProvider(propId, pName)}
                                >
                                  {hiringAssignmentId === propId ? (isFr ? 'Attribution...' : 'Hiring...') : (isFr ? 'Engager' : 'Hire')}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <div className="upwork-right-column">
            <div className="upwork-notice-box bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="notice-icon text-xl block mb-1">⚡</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isFr 
                  ? 'Garantie Fixam : Paiement direct et sécurisé à la livraison de la tâche.'
                  : 'Fixam Guarantee: Direct, secure cash or digital release upon complete satisfaction.'}
              </p>
            </div>

            <div className="space-y-3 mt-4">
              {status === 'COMPLETED' && (
                <button 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                  onClick={() => {
                    const assignedPro = taskData.assignments?.[0]?.provider?.user || taskData.assignedTo || {};
                    const targetUserId = assignedPro.id || assignedPro.userId || taskData.assignedProviderId;
                    const targetName = assignedPro.fullName || 'Assigned Provider';
                    if (!targetUserId) {
                      alert(isFr ? 'Aucun prestataire trouvé pour cette tâche terminée.' : 'No provider found to review.');
                      return;
                    }
                    setReviewTarget({ jobId: taskId, targetUserId, targetName });
                  }}
                >
                  ⭐ {isFr ? 'Laisser un avis' : 'Write a Review'}
                </button>
              )}

              {status !== 'COMPLETED' && status !== 'CANCELLED' && (
                <button 
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
                  onClick={handleCancelTask}
                >
                  ✕ {isFr ? 'Annuler la mission' : 'Cancel Task'}
                </button>
              )}

              <button 
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
                onClick={() => {
                  if (setSelectedTask) setSelectedTask(null);
                  setActiveTab('My Tasks');
                }}
              >
                {isFr ? 'Fermer' : 'Close Details'}
              </button>
            </div>

            <div className="upwork-divider my-4 border-t border-slate-100" />

            <div className="upwork-client-section text-xs text-slate-600 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {isFr ? 'Sécurité & Garanties' : 'Task Protection'}
              </h3>
              <div className="client-check-item flex items-center gap-2">
                <span className="text-teal-600 font-bold">✔</span>
                <span>{isFr ? 'Prestataires vérifiés' : 'Verified Professionals'}</span>
              </div>
              <div className="client-check-item flex items-center gap-2">
                <span className="text-teal-600 font-bold">✔</span>
                <span>{isFr ? 'Assistance 7j/7 Fixam' : '24/7 Fixam Support'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {reviewTarget && (
        <ReviewModal
          isOpen={true}
          onClose={() => setReviewTarget(null)}
          jobId={reviewTarget.jobId}
          targetUserId={reviewTarget.targetUserId}
          targetName={reviewTarget.targetName}
        />
      )}
    </div>
  );
}
