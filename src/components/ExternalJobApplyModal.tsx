import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import i18n from '../i18n';

export interface ExternalJobData {
  id: string;
  title: string;
  companyName: string;
  description: string;
  requirements?: string;
  location?: string;
  isRemote?: boolean;
  category?: string;
  salary?: string;
  expiryDate?: string;
  destinationEmail?: string;
  source?: string;
  isExternal?: boolean;
}

interface ExternalJobApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: ExternalJobData | null;
  onSuccess?: (jobId: string) => void;
}

export default function ExternalJobApplyModal({
  isOpen,
  onClose,
  job,
  onSuccess
}: ExternalJobApplyModalProps) {
  const { user } = useAuth();
  const isFr = i18n.language === 'fr';

  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvName, setCvName] = useState<string>('');
  const [cvLink, setCvLink] = useState<string>('');
  const [cvMode, setCvMode] = useState<'file' | 'link'>('file');
  const [isPriority, setIsPriority] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill user data and generate draft cover letter
  useEffect(() => {
    if (!isOpen || !job) return;

    setIsSuccess(false);
    setError(null);
    setCvFile(null);
    setIsPriority(false);

    const name = (user as any)?.fullName || (user as any)?.name || '';
    const email = (user as any)?.email || '';
    const phone = (user as any)?.phone || '';
    const existingCvUrl = (user as any)?.cvUrl || '';
    const existingCvName = (user as any)?.cvName || '';

    setApplicantName(name);
    setApplicantEmail(email);
    setApplicantPhone(phone);
    setCvName(existingCvName || (existingCvUrl ? 'Attached_Resume' : ''));
    if (existingCvUrl && (existingCvUrl.includes('google.com') || existingCvUrl.includes('sheet') || !existingCvUrl.match(/\.(pdf|png|jpg|jpeg)$/i))) {
      setCvLink(existingCvUrl);
      setCvMode('link');
    } else {
      setCvLink(existingCvUrl);
    }

    // Auto-generate professional first-person draft
    const skills = (user as any)?.providerProfile?.skills?.join(', ') || (user as any)?.skills?.join(', ') || job.category || 'this field';
    const draft = isFr
      ? `Madame, Monsieur l'équipe de recrutement chez ${job.companyName},\n\nJe vous adresse ma candidature pour le poste de ${job.title}.\n\nFort de mon expérience professionnelle dans le domaine de ${skills}, je suis convaincu(e) de pouvoir apporter une réelle valeur ajoutée à votre équipe.\n\nVous trouverez ci-joint mes coordonnées détaillées ainsi que mon CV pour étude de mon profil. Je reste à votre entière disposition pour tout échange complémentaire.\n\nJe vous remercie pour l'attention portée à ma candidature.\n\nCordialement,\n${name}`
      : `Dear Hiring Team at ${job.companyName},\n\nI am writing to express my strong interest in the ${job.title} position.\n\nWith proven professional experience in ${skills}, I am confident in my ability to deliver quality results and make an immediate positive contribution to your organization.\n\nPlease find my contact details and attached CV for your review. I would welcome the opportunity to discuss how my background aligns with your requirements.\n\nThank you for your time and consideration.\n\nBest regards,\n${name}`;

    setCoverLetter(draft);
  }, [isOpen, job, user, isFr]);

  if (!isOpen || !job) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCvFile(file);
      setCvName(file.name);
    }
  };

  const handleClearFile = () => {
    setCvFile(null);
    setCvName('');
  };

  const handleSendApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantEmail) {
      setError(isFr ? 'Veuillez saisir votre adresse e-mail pour recevoir les réponses des recruteurs.' : 'Please enter your email address so recruiters can reply to you.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('applicantName', applicantName.trim());
      formData.append('applicantEmail', applicantEmail.trim());
      if (applicantPhone) formData.append('applicantPhone', applicantPhone.trim());
      if (coverLetter) formData.append('coverLetter', coverLetter.trim());
      if (cvFile) formData.append('cv', cvFile);
      if (cvLink) formData.append('cvLink', cvLink.trim());
      if (isPriority) formData.append('isPriority', 'true');

      const response = await api.post(`/external-jobs/${job.id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setIsSuccess(true);
        if (onSuccess) {
          onSuccess(job.id);
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || (isFr ? "Échec de l'envoi de la candidature" : "Failed to send application");
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000020,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '1rem',
          maxWidth: '620px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #E2E8F0',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', backgroundColor: '#F8FAFC' }}>
          <div>
            <div style={{ display: 'inline-block', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              {isFr ? 'Offre Externe' : 'External Listing'}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
              {job.title}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
              {job.companyName} {job.location ? `• ${job.location}` : ''}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
              transition: 'background 0.15s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          /* Confirmation Success Screen */
          <div style={{ padding: '2.5rem 1.75rem', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
              {isFr ? 'Candidature transmise avec succès' : 'Application Sent Successfully'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
              {isFr
                ? `Votre candidature a été directement délivrée au recruteur de ${job.companyName}. Les réponses éventuelles vous seront adressées à `
                : `Your application has been delivered directly to the recruitment team at ${job.companyName}. Recruiter replies will be delivered to `}
              <strong style={{ color: '#0F172A' }}>{applicantEmail}</strong>.
            </p>

            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'block', textAlign: 'left', fontSize: '0.82rem', color: '#475569', maxWidth: '440px', margin: '0 auto 1.75rem auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #EDF2F7' }}>
                <span style={{ color: '#64748B' }}>{isFr ? 'Entreprise' : 'Company'}</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{job.companyName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #EDF2F7' }}>
                <span style={{ color: '#64748B' }}>{isFr ? 'Poste' : 'Role'}</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{job.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ color: '#64748B' }}>{isFr ? 'Document' : 'Document'}</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{cvName || (isFr ? 'Profil candidat' : 'Candidate Profile')}</span>
              </div>
            </div>

            <div>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.6rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {isFr ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSendApplication} style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.75rem 1rem', borderRadius: '0.6rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
              <strong style={{ color: '#0F172A' }}>{isFr ? 'Transmission directe' : 'Direct Employer Delivery'}</strong>: {isFr
                ? 'Votre candidature et CV sont expédiés directement sur la boîte mail du recruteur. L\'adresse de réponse est définie sur votre e-mail personnel.'
                : 'Your CV and application are delivered straight to the employer\'s hiring inbox. Replies are sent directly to your personal email.'}
            </div>

            {error && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: '0.6rem', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            {/* Profile fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {isFr ? 'Nom complet' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {isFr ? 'Adresse e-mail' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {isFr ? 'Numéro de téléphone' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+237 6..."
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* CV Attachment Box */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.85rem 1rem', borderRadius: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {isFr ? 'Curriculum Vitae (CV)' : 'Resume / CV Document'}
                </span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#E2E8F0', padding: '2px', borderRadius: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setCvMode('file')}
                    style={{
                      padding: '3px 9px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: 'none',
                      background: cvMode === 'file' ? '#FFFFFF' : 'transparent',
                      color: cvMode === 'file' ? '#0F172A' : '#64748B',
                      boxShadow: cvMode === 'file' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {isFr ? 'Fichier' : 'File'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCvMode('link')}
                    style={{
                      padding: '3px 9px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: 'none',
                      background: cvMode === 'link' ? '#FFFFFF' : 'transparent',
                      color: cvMode === 'link' ? '#0F172A' : '#64748B',
                      boxShadow: cvMode === 'link' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {isFr ? 'Lien Drive' : 'Drive Link'}
                  </button>
                </div>
              </div>

              {cvMode === 'file' ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: cvName ? '#0F172A' : '#64748B', fontWeight: cvName ? 700 : 500 }}>
                      {cvName ? cvName : (isFr ? 'Aucun document sélectionné (PDF, DOCX, PNG)' : 'No file attached (PDF, DOCX, PNG)')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {cvName && (
                      <button
                        type="button"
                        onClick={handleClearFile}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#64748B',
                          cursor: 'pointer'
                        }}
                      >
                        {isFr ? 'Supprimer' : 'Clear'}
                      </button>
                    )}
                    <label style={{ backgroundColor: '#0F172A', border: 'none', padding: '5px 12px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', cursor: 'pointer' }}>
                      {cvName ? (isFr ? 'Changer' : 'Change') : (isFr ? 'Sélectionner' : 'Browse File')}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    value={cvLink}
                    onChange={(e) => setCvLink(e.target.value)}
                    placeholder="https://drive.google.com/... or Google Sheets link"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.82rem',
                      color: '#0F172A',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    {isFr ? 'Vérifiez que le lien est accessible aux personnes disposant de l\'URL.' : 'Make sure link sharing is set to anyone with the link can view.'}
                  </span>
                </div>
              )}
            </div>

            {/* Cover Letter */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {isFr ? 'Message au recruteur' : 'Message to Recruiter'}
                </label>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {isFr ? 'Modifiable' : 'Editable draft'}
                </span>
              </div>
              <textarea
                rows={6}
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  color: '#0F172A',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Priority Application Boost Option */}
            <div
              onClick={() => setIsPriority(!isPriority)}
              style={{
                marginBottom: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                border: isPriority ? '1.5px solid #EAB308' : '1px solid #E2E8F0',
                backgroundColor: isPriority ? '#FEFCE8' : '#F8FAFC',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: isPriority ? '2px solid #CA8A04' : '2px solid #94A3B8',
                    backgroundColor: isPriority ? '#EAB308' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  {isPriority ? '✓' : ''}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 750, color: '#1E293B' }}>
                      {isFr ? 'Candidature Prioritaire' : 'Priority Application'}
                    </span>
                    <span style={{ backgroundColor: '#FEF08A', color: '#854D0E', fontSize: '0.68rem', fontWeight: 800, padding: '2px 7px', borderRadius: '4px' }}>
                      2 {isFr ? 'Pièces' : 'Coins'}
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.73rem', color: '#64748B', lineHeight: 1.4 }}>
                    {isFr
                      ? "Mention prioritaire et mise en avant de votre dossier dans la boîte e-mail du recruteur."
                      : "Priority header and featured placement in the recruiter's inbox."}
                  </p>
                </div>
              </div>
            </div>

            {/* Live CV Tracking Info */}
            <div style={{ marginBottom: '1rem', padding: '9px 14px', backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '8px', fontSize: '0.74rem', color: '#1E40AF', lineHeight: 1.45 }}>
              <span style={{ fontWeight: 700 }}>{isFr ? 'Suivi en direct : ' : 'Live tracking: '}</span>
              <span>
                {isFr
                  ? "Vous recevrez une notification push et un e-mail dès que le recruteur ouvrira votre CV."
                  : "You will receive a push notification & email the instant the recruiter opens your CV."}
              </span>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#0D9488',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{ width: '12px', height: '12px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span>{isFr ? 'Envoi en cours...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <span>{isFr ? 'Envoyer la candidature' : 'Send Application'}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
