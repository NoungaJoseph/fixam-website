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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill user data and generate draft cover letter
  useEffect(() => {
    if (!isOpen || !job) return;

    setIsSuccess(false);
    setError(null);
    setCvFile(null);

    const name = (user as any)?.fullName || (user as any)?.name || '';
    const email = (user as any)?.email || '';
    const phone = (user as any)?.phone || '';
    const existingCvUrl = (user as any)?.cvUrl || '';
    const existingCvName = (user as any)?.cvName || '';

    setApplicantName(name);
    setApplicantEmail(email);
    setApplicantPhone(phone);
    setCvName(existingCvName || (existingCvUrl ? 'My_Profile_Resume' : ''));
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
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
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
          borderRadius: '1.25rem',
          maxWidth: '640px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              🌐 {isFr ? 'Opportunité Externe' : 'External Opportunity'}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              {job.title}
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              {job.companyName} {job.location ? `• 📍 ${job.location}` : ''}
            </p>
          </div>

          <button
            onClick={onClose}
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
              fontSize: '1rem',
              fontWeight: 700
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          /* Confirmation Success Screen */
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.25rem auto' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
              {isFr ? `Candidature envoyée à ${job.companyName} !` : `Application Sent to ${job.companyName}!`}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
              {isFr
                ? `Votre candidature et votre CV ont été directement transmis au recruteur. Lorsque l'entreprise répondra, son message arrivera directement dans votre boîte e-mail à `
                : `Your CV and application have been delivered directly to the company's recruitment team. When the recruiter replies, their response will go straight to your email at `}
              <strong style={{ color: '#0F172A' }}>{applicantEmail}</strong>.
            </p>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'inline-block', textAlign: 'left', fontSize: '0.8rem', color: '#64748B', maxWidth: '460px', margin: '0 auto 1.75rem auto' }}>
              <div>🏢 <strong>{isFr ? 'Entreprise :' : 'Company:'}</strong> {job.companyName}</div>
              <div>💼 <strong>{isFr ? 'Poste :' : 'Role:'}</strong> {job.title}</div>
              <div>📎 <strong>{isFr ? 'Pièce jointe :' : 'Attachment:'}</strong> {cvName || (isFr ? 'Profil candidat' : 'Candidate Profile')}</div>
            </div>
            <div>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                {isFr ? 'Terminer & Voir d\'autres offres' : 'Done & Browse More Jobs'}
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSendApplication} style={{ padding: '1.25rem 1.5rem', maxHeight: '72vh', overflowY: 'auto' }}>
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#166534', lineHeight: 1.5 }}>
              ⚡ <strong>{isFr ? 'Candidature en 1 Clic via Fixam' : 'One-Tap Apply via Fixam'}</strong>: {isFr
                ? 'Nous transmettons directement votre CV et votre lettre de motivation au recruteur en utilisant notre domaine d\'envoi certifié. L\'adresse de réponse (Reply-To) est configurée sur votre e-mail.'
                : 'We deliver your CV and cover letter directly to the recruiter using our verified sending infrastructure. The Reply-To address is set to your personal email.'}
            </div>

            {error && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Profile review fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  {isFr ? 'Votre Nom Complet' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', color: '#0F172A', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  {isFr ? 'Votre Adresse E-mail (Réponses directes)' : 'Your Email (Recruiter Replies)'}
                </label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', color: '#0F172A', outline: 'none' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  {isFr ? 'Numéro de téléphone' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+237 6..."
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1', fontSize: '0.85rem', color: '#0F172A', outline: 'none' }}
                />
              </div>
            </div>

            {/* CV Attachment & Link Box */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.85rem 1rem', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                  {isFr ? 'CV / Document de candidature' : 'CV / Resume or Portfolio'}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setCvMode('file')}
                    style={{
                      padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                      border: cvMode === 'file' ? '1px solid #0D9488' : '1px solid #CBD5E1',
                      background: cvMode === 'file' ? '#0D9488' : '#FFFFFF',
                      color: cvMode === 'file' ? '#FFFFFF' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {isFr ? 'Fichier (PDF / Photo)' : 'File (PDF / Photo)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCvMode('link')}
                    style={{
                      padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                      border: cvMode === 'link' ? '1px solid #0D9488' : '1px solid #CBD5E1',
                      background: cvMode === 'link' ? '#0D9488' : '#FFFFFF',
                      color: cvMode === 'link' ? '#FFFFFF' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Google Sheets / Drive
                  </button>
                </div>
              </div>

              {cvMode === 'file' ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.25rem' }}>📎</span>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: cvName ? '#059669' : '#64748B', fontWeight: 600 }}>
                        {cvName ? `✓ ${cvName}` : (isFr ? 'Aucun fichier joint (PDF, PNG, JPG)' : 'Attach file (PDF, PNG, JPG)')}
                      </span>
                    </div>
                  </div>

                  <label style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                    {cvName ? (isFr ? 'Changer de fichier' : 'Change File') : (isFr ? 'Parcourir...' : 'Browse File...')}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    value={cvLink}
                    onChange={(e) => setCvLink(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/... or Google Drive link"
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8rem',
                      color: '#0F172A',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    {isFr ? 'Assurez-vous que le lien est partagé en accès public ou avec les recruteurs.' : 'Ensure the Google Sheets/Drive link is set to "Anyone with the link can view".'}
                  </span>
                </div>
              )}
            </div>

            {/* Cover Letter */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                  {isFr ? 'Lettre de motivation (personnalisable)' : 'Cover Letter (Editable Draft)'}
                </label>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {isFr ? 'Rédigée à la première personne' : 'Written in first person'}
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
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '0.6rem',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 700,
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
                  borderRadius: '0.6rem',
                  border: 'none',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{ width: '12px', height: '12px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span>{isFr ? 'Envoi en cours...' : 'Sending Application...'}</span>
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    <span>{isFr ? 'Envoyer ma candidature' : 'Send Application'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
