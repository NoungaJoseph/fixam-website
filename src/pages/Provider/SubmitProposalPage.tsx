import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './SubmitProposalPage.css';

interface SubmitProposalPageProps {
  job: any;
  onBack: () => void;
  onSuccess: (updatedJob: any) => void;
  walletBalance: number | null;
  refreshWallet: () => Promise<void>;
  isVerified: boolean;
  isAvailable: boolean;
  setActiveTab: (tab: string) => void;
}

export default function SubmitProposalPage({
  job,
  onBack,
  onSuccess,
  walletBalance,
  refreshWallet,
  isVerified,
  isAvailable,
  setActiveTab,
}: SubmitProposalPageProps) {
  const { t, i18n } = useTranslation();
  const { user, refreshUser } = useAuth();
  const isFr = i18n.language === 'fr';

  const [proposedBudget, setProposedBudget] = useState<string>(
    job.budget ? String(job.budget) : (job.budgetMin ? String(job.budgetMin) : '')
  );
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [boostCoins, setBoostCoins] = useState<number>(0);
  const [proposalAttachments, setProposalAttachments] = useState<Array<{ name: string; url: string; type?: string; size?: number }>>([]);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [redirectCount, setRedirectCount] = useState<number>(4);
  const [localAvailable, setLocalAvailable] = useState<boolean>(isAvailable);

  const totalProposalCoins = boostCoins; // Base proposal is 100% FREE
  const currentWalletBalance = walletBalance !== null ? walletBalance : ((user as any)?.wallet?.balance || 0);
  const hasEnoughCoins = currentWalletBalance >= totalProposalCoins;

  // Find top boosted bidder if available
  const topBidder = useMemo(() => {
    if (!job || !job.assignments || !Array.isArray(job.assignments) || job.assignments.length === 0) {
      return null;
    }
    const boosted = job.assignments
      .filter((a: any) => Number(a.boostCoins || 0) > 0)
      .sort((a: any, b: any) => Number(b.boostCoins || 0) - Number(a.boostCoins || 0));

    if (boosted.length === 0) return null;
    const top = boosted[0];
    const providerName = top.provider?.user?.fullName ||
      `${top.provider?.user?.firstName || ''} ${top.provider?.user?.lastName || ''}`.trim() ||
      'Verified Provider';
    return {
      name: providerName,
      boostCoins: Number(top.boostCoins || 0),
    };
  }, [job]);

  // Handle countdown after submission
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setInterval(() => {
      setRedirectCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSuccess({ ...job, hasApplied: true, myBoostCoins: boostCoins });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess, job, boostCoins, onSuccess]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(isFr ? 'Le fichier dépasse la taille maximale de 10 Mo.' : 'File exceeds maximum 10MB size limit.');
      return;
    }

    setIsUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = res.data.fileUrl || res.data.url;
      setProposalAttachments((prev) => [
        ...prev,
        {
          name: file.name,
          url: fileUrl,
          type: file.type,
          size: file.size,
        },
      ]);
    } catch (err: any) {
      alert(err.response?.data?.message || (isFr ? 'Échec du téléversement du fichier.' : 'Failed to upload attachment.'));
    } finally {
      setIsUploadingFile(false);
      e.target.value = '';
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setProposalAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      alert(isFr ? 'Vérification requise : Veuillez faire vérifier votre identité avant de postuler.' : 'Identity verification is required before submitting proposals.');
      setActiveTab('My Profile');
      return;
    }

    if (!localAvailable) {
      alert(isFr ? 'Votre badge de disponibilité est désactivé. Activez-le pour soumettre une proposition.' : 'Your availability badge is currently off. Please activate it.');
      return;
    }

    if (!hasEnoughCoins) {
      alert(isFr ? `Pièces Fixam insuffisantes : vous avez besoin de ${totalProposalCoins} pièces pour ce boost.` : `Insufficient Fixam Coins for boost: You need ${totalProposalCoins} coins.`);
      setActiveTab('Wallet');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/jobs/${job.id}/apply`, {
        boostCoins,
        coverLetter: coverLetter.trim() || undefined,
        proposedBudget: proposedBudget ? Number(proposedBudget) : undefined,
        proposalMedia: proposalAttachments.length > 0 ? proposalAttachments : undefined,
      });

      // Refresh wallet balance if boost coins were used
      if (totalProposalCoins > 0) {
        await refreshWallet();
      }

      setIsSuccess(true);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || (isFr ? 'Échec de la soumission de la proposition.' : 'Failed to submit proposal.');
      alert(errMsg);
      const errCode = err.response?.data?.code;
      if (errCode === 'VERIFICATION_REQUIRED' || err.response?.data?.requiresVerification) {
        setActiveTab('My Profile');
      } else if (errCode === 'INSUFFICIENT_COINS') {
        setActiveTab('Wallet');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="submit-proposal-container animate-fade-in">
        <div className="proposal-success-card">
          <div className="proposal-success-icon">✓</div>
          <h2>{isFr ? '🎉 Proposition soumise avec succès !' : '🎉 Proposal Submitted Successfully!'}</h2>
          <p>
            {isFr
              ? `Votre proposition pour « ${job.title} » a été transmise au client. Vous recevrez une notification dès qu'il la consultera ou vous répondra.`
              : `Your proposal for "${job.title}" has been delivered to the client. You will be notified the instant they view or respond to your proposal.`}
          </p>

          <div className="proposal-success-summary-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>{isFr ? 'Tarif proposé :' : 'Proposed Rate:'}</span>
              <strong style={{ color: '#0f172a' }}>{proposedBudget ? `${Number(proposedBudget).toLocaleString()} XAF` : 'Standard'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>{isFr ? 'Coût de la proposition :' : 'Proposal Cost:'}</span>
              <strong style={{ color: '#0d9488' }}>{isFr ? 'GRATUIT (0 Pièce)' : 'FREE (0 Coins)'}</strong>
            </div>
            {boostCoins > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>{isFr ? 'Pièces de boost utilisées :' : 'Boost Coins Applied:'}</span>
                <strong style={{ color: '#16a34a' }}>+{boostCoins} Coins</strong>
              </div>
            )}
          </div>

          <button
            type="button"
            className="proposal-success-return-btn"
            onClick={() => onSuccess({ ...job, hasApplied: true, myBoostCoins: boostCoins })}
          >
            {isFr ? `← Retour à la mission (${redirectCount}s)` : `← Return to Job Details (${redirectCount}s)`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-proposal-container animate-fade-in">
      <button type="button" className="submit-proposal-back-btn" onClick={onBack}>
        ← {isFr ? 'Retour aux détails de la mission' : 'Back to job details'}
      </button>

      <div className="submit-proposal-header">
        <h1>{isFr ? 'Soumettre une proposition' : 'Submit a Proposal'}</h1>
        <p>{isFr ? 'Personnalisez votre offre et démarquez-vous auprès du client.' : 'Customize your bid, highlight your skills, and stand out to the client.'}</p>
      </div>

      {/* Verification Warning Alert */}
      {!isVerified && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong style={{ color: '#92400e', display: 'block', fontSize: '0.9rem' }}>⚠️ {isFr ? 'Vérification d\'identité requise' : 'Identity Verification Required'}</strong>
            <span style={{ color: '#b45309', fontSize: '0.82rem' }}>
              {isFr ? 'Votre profil doit être vérifié avant de pouvoir envoyer des propositions.' : 'You must verify your provider profile before submitting proposals.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('My Profile')}
            style={{ background: '#d97706', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}
          >
            {isFr ? 'Vérifier mon profil →' : 'Verify Profile Now →'}
          </button>
        </div>
      )}

      {/* Availability Status Alert */}
      {!localAvailable && (
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong style={{ color: '#9f1239', display: 'block', fontSize: '0.9rem' }}>🔴 {isFr ? 'Statut de disponibilité désactivé' : 'Availability Status is Off'}</strong>
            <span style={{ color: '#be123c', fontSize: '0.82rem' }}>
              {isFr ? 'Activez votre badge de disponibilité pour que le client sache que vous êtes prêt à intervenir.' : 'Turn on your availability badge to show clients you are ready for work.'}
            </span>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await api.put('/providers/status', { isAvailable: true, isOnline: true });
                await refreshUser();
                setLocalAvailable(true);
              } catch (e) {}
            }}
            style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}
          >
            {isFr ? 'Activer la disponibilité' : 'Turn On Availability Badge'}
          </button>
        </div>
      )}

      {/* Job Overview Card */}
      <div className="proposal-job-card">
        <div className="proposal-job-card-top">
          <div style={{ flex: 1, minWidth: '260px' }}>
            <h2 className="proposal-job-title">{job.title}</h2>
            <div className="proposal-job-badges">
              <span className="proposal-badge proposal-badge-category">📂 {job.category || 'General'}</span>
              <span className="proposal-badge proposal-badge-location">📍 {job.location || job.country || 'Cameroon'}</span>
              {job.isRemote && <span className="proposal-badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>🌐 Remote</span>}
            </div>
          </div>
          <div className="proposal-job-budget-box">
            <div className="proposal-job-budget-label">{isFr ? 'Budget client' : 'Client Budget'}</div>
            <div className="proposal-job-budget-val">
              {job.budget ? `${Number(job.budget).toLocaleString()} XAF` : (job.budgetMin ? `${Number(job.budgetMin).toLocaleString()} - ${Number(job.budgetMax || job.budgetMin).toLocaleString()} XAF` : 'Negotiable')}
            </div>
          </div>
        </div>
        <p className="proposal-job-desc">{job.description}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Proposed Terms */}
        <div className="proposal-section-card">
          <h3 className="proposal-section-title">{isFr ? 'Conditions de la proposition' : 'Proposal Terms'}</h3>
          <p className="proposal-section-subtitle">
            {isFr ? 'Définissez le montant total proposé pour accomplir cette mission.' : 'Specify your proposed price to complete this project.'}
          </p>

          <div className="proposal-input-group">
            <label className="proposal-input-label">
              {isFr ? 'Votre prix proposé / Budget (XAF)' : 'Your Proposed Price / Budget (XAF)'}
            </label>
            <input
              type="number"
              className="proposal-input"
              placeholder="e.g. 25000"
              value={proposedBudget}
              onChange={(e) => setProposedBudget(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', display: 'block' }}>
              {isFr ? 'Vous pouvez proposer un montant supérieur ou inférieur selon les exigences des travaux.' : 'You may bid higher or lower than the client\'s budget based on project requirements.'}
            </span>
          </div>
        </div>

        {/* Section 2: Cover Letter / Pitch */}
        <div className="proposal-section-card">
          <h3 className="proposal-section-title">{isFr ? 'Lettre de présentation / Message d\'introduction' : 'Cover Letter / Proposal Pitch'}</h3>
          <p className="proposal-section-subtitle">
            {isFr ? 'Présentez votre expertise, vos disponibilités et votre approche pour résoudre le problème du client.' : 'Introduce yourself, highlight your past experience with similar tasks, and outline your approach.'}
          </p>

          <textarea
            className="proposal-textarea"
            rows={5}
            placeholder={
              isFr
                ? 'Bonjour, je suis disponible pour réaliser cette mission. J\'ai plus de 5 ans d\'expérience dans ce domaine et je dispose de tout le matériel nécessaire...'
                : 'Hello, I am ready to handle this task with high quality standards. I have extensive experience in this trade and carry professional equipment...'
            }
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>

        {/* Section 3: Attachments */}
        <div className="proposal-section-card">
          <h3 className="proposal-section-title">{isFr ? 'Pièces jointes & Exemples de réalisations' : 'Attachments & Work Samples'}</h3>
          <p className="proposal-section-subtitle">
            {isFr ? 'Joignez votre CV, attestations ou photos de vos réalisations passées (optionnel).' : 'Attach your photo CV, PDF resume, or photos of similar completed projects (optional, max 10MB).'}
          </p>

          <label className="proposal-upload-dropzone">
            <input
              type="file"
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={isUploadingFile}
            />
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
              {isUploadingFile ? (isFr ? 'Téléversement en cours...' : 'Uploading attachment...') : (isFr ? 'Cliquez pour joindre un document ou une photo' : 'Click to attach PDF document or photo')}
            </strong>
            <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
              PDF, JPG, PNG (Max 10MB)
            </span>
          </label>

          {proposalAttachments.length > 0 && (
            <div className="proposal-attachments-list">
              {proposalAttachments.map((att, idx) => (
                <div key={idx} className="proposal-attachment-item">
                  <span style={{ fontWeight: 600, color: '#334155' }}>📎 {att.name}</span>
                  <button
                    type="button"
                    className="proposal-attachment-remove"
                    onClick={() => removeAttachment(idx)}
                  >
                    ✕ {isFr ? 'Supprimer' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Boost Proposal Rank (Optional) */}
        <div className="proposal-section-card">
          <h3 className="proposal-section-title">{isFr ? 'Booster votre proposition (Optionnel)' : 'Boost Your Proposal Rank (Optional)'}</h3>
          <p className="proposal-section-subtitle">
            {isFr ? 'La candidature de base est 100% GRATUITE. Vous pouvez ajouter des pièces pour figurer tout en haut.' : 'Standard proposal submission is 100% FREE. You can optionally add boost coins to rank higher.'}
          </p>

          {topBidder && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔥</span>
                <span style={{ color: '#065f46' }}>
                  <strong>{isFr ? 'Meilleure enchère actuelle :' : 'Highest Boosted Bidder:'}</strong> {topBidder.name}
                </span>
              </div>
              <span style={{ background: '#059669', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.78rem' }}>
                {topBidder.boostCoins} Boost Coins
              </span>
            </div>
          )}

          <div className="proposal-boost-box">
            <div className="proposal-boost-info">
              <div className="proposal-boost-title">
                <span>🚀</span>
                <span>{isFr ? 'Enchère de visibilité' : 'Visibility Boost Coins'}</span>
              </div>
              <p className="proposal-boost-desc">
                {isFr
                  ? 'Si vous n\'êtes pas sélectionné par le client, vos pièces de boost vous sont intégralement recréditées.'
                  : 'If the client does not select you, your boost coins are 100% refunded to your wallet.'}
              </p>
            </div>

            <div className="proposal-boost-input-wrap">
              <input
                type="number"
                min="0"
                max="100"
                className="proposal-boost-input"
                placeholder="0"
                value={boostCoins === 0 ? '' : boostCoins}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value) || 0);
                  setBoostCoins(val);
                }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>
                {isFr ? 'Pièces' : 'Coins'}
              </span>
            </div>
          </div>
        </div>

        {/* Cost Summary & Submission Bar */}
        <div className="proposal-submit-bar">
          <div className="proposal-cost-summary">
            <div className="proposal-cost-item">
              <span className="proposal-cost-label">{isFr ? 'Coût de soumission' : 'Proposal Cost'}</span>
              <span className="proposal-cost-val free">{isFr ? 'GRATUIT (0 Pièce)' : 'FREE (0 Coins)'}</span>
            </div>
            {boostCoins > 0 && (
              <div className="proposal-cost-item">
                <span className="proposal-cost-label">{isFr ? 'Boost optionnel' : 'Optional Boost'}</span>
                <span className="proposal-cost-val" style={{ color: '#16a34a' }}>+{boostCoins} {isFr ? 'Pièces' : 'Coins'}</span>
              </div>
            )}
            <div className="proposal-cost-item" style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
              <span className="proposal-cost-label">{isFr ? 'Votre solde' : 'Wallet Balance'}</span>
              <span className="proposal-cost-val">{currentWalletBalance} {isFr ? 'Pièces' : 'Coins'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="button" className="submit-proposal-back-btn" style={{ margin: 0 }} onClick={onBack}>
              {isFr ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="proposal-submit-btn"
              disabled={isSubmitting || !isVerified || !localAvailable || !hasEnoughCoins}
            >
              {isSubmitting
                ? (isFr ? 'Envoi en cours...' : 'Submitting...')
                : (boostCoins > 0
                  ? (isFr ? `Envoyer avec Boost (${boostCoins} Pièces)` : `Submit Boosted Proposal (${boostCoins} Coins)`)
                  : (isFr ? 'Envoyer la proposition (GRATUIT)' : 'Submit Proposal (FREE)'))}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
