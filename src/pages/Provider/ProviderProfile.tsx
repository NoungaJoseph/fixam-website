import './ProviderProfile.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, getMediaUrl, DEFAULT_AVATAR } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface ProviderProfileProps {
  setActiveTab?: (tab: string) => void;
  setSelectedProject?: (proj: any) => void;
}

type Certificate = {
  title: string;
  issuer: string;
  year: string;
  imageUrl?: string;
};

type PortfolioItem = {
  id?: string;
  title: string;
  description: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  images?: string[];
  video?: string;
  videoUrl?: string;
  videos?: string[];
  link?: string;
};

// Predefined skills list (can also be fetched from backend categories)
const SKILL_SUGGESTIONS = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Tiling', 'Masonry',
  'Air Conditioning', 'Refrigeration', 'Welding', 'Fabrication', 'Auto Repair',
  'Cleaning', 'Gardening', 'Landscaping', 'Moving & Packing', 'Security Installation',
  'Web Development', 'Mobile App Development', 'Graphic Design', 'Logo Design',
  'UI/UX Design', 'Content Writing', 'Copywriting', 'SEO', 'Social Media Marketing',
  'Digital Marketing', 'Video Editing', 'Photography', 'Animation', 'Accounting',
  'Bookkeeping', 'Data Entry', 'Virtual Assistant', 'Translation', 'Tutoring',
  'Event Planning', 'Interior Design', 'Architecture', 'CCTV Installation',
  'Networking', 'IT Support', 'Solar Installation', 'Generator Repair',
  'Roofing', 'Waterproofing', 'Drilling', 'Pest Control', 'Fumigation',
  'Catering', 'Cooking', 'Tailoring', 'Fashion Design', 'Hair Styling',
  'Make-up Artist', 'Barbing', 'Nail Technician', 'Massage Therapy',
];

export default function ProviderProfile({ setActiveTab, setSelectedProject }: ProviderProfileProps) {
  const { user, refreshUser, updateUser } = useAuth();
  const { t, i18n } = useTranslation();
  const [selectedModalProject, setSelectedModalProject] = useState<any | null>(null);
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form fields
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editRate, setEditRate] = useState('');
  const [editServiceArea, setEditServiceArea] = useState('');
  const [editExperience, setEditExperience] = useState('Intermediate');

  // Skills with autocomplete
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSavingSkills, setIsSavingSkills] = useState(false);
  const skillInputRef = useRef<HTMLInputElement>(null);

  // Certificates
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [isSubmittingCert, setIsSubmittingCert] = useState(false);

  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [isSubmittingPortfolio, setIsSubmittingPortfolio] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<any[]>([]);

  // Availability toggle (for mobile and desktop)
  const [isProfileAvailable, setIsProfileAvailable] = useState(() => Boolean(user?.providerProfile?.isAvailable ?? user?.isOnline ?? true));

  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Provider';

  // Populate form and sync availability when user loads
  useEffect(() => {
    if (user) {
      setIsProfileAvailable(Boolean(user.providerProfile?.isAvailable ?? user.isOnline ?? true));
      setEditFirstName(user.firstName || user.fullName?.split(' ')[0] || '');
      setEditLastName(user.lastName || user.fullName?.split(' ')[1] || '');
      setEditPhone(user.phone || '');
      setEditLocation(user.location || '');
      setEditDob(user.dob ? new Date(user.dob).toISOString().split('T')[0] : '');
      if (user.providerProfile) {
        setEditBio(user.providerProfile.bio || '');
        setEditRate(user.providerProfile.rate ? String(user.providerProfile.rate) : '');
        setEditServiceArea(user.providerProfile.serviceArea || '');
        setEditExperience(user.providerProfile.experienceLevel || 'Intermediate');
        setSkills(Array.isArray(user.providerProfile.skills) ? user.providerProfile.skills : []);
        setCertificates(Array.isArray(user.providerProfile.certificates) ? user.providerProfile.certificates : []);
        setPortfolio(Array.isArray(user.providerProfile.portfolio) ? user.providerProfile.portfolio : []);
      }
    }
  }, [user]);

  // Fetch reviews when Reviews tab is active
  useEffect(() => {
    if (activeSubTab === 'Reviews' && user?.id) {
      api.get(`/reviews/users/${user.id}`)
        .then((res: any) => setReviews(res.data?.data || []))
        .catch(console.error);
    }
  }, [activeSubTab, user?.id]);

  // Skills autocomplete filter
  const handleSkillInputChange = (val: string) => {
    setSkillInput(val);
    if (val.trim().length > 0) {
      const filtered = SKILL_SUGGESTIONS.filter(
        s => s.toLowerCase().includes(val.toLowerCase()) && !skills.includes(s)
      );
      setSkillSuggestions(filtered.slice(0, 8));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddSkill = (skill: string) => {
    const clean = skill.trim();
    if (!clean || skills.includes(clean)) return;
    setSkills(prev => [...prev, clean]);
    setSkillInput('');
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSaveSkills = async () => {
    setIsSavingSkills(true);
    try {
      await api.put('/users/profile', { skills });
      await refreshUser();
      alert('Skills updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update skills');
    } finally {
      setIsSavingSkills(false);
    }
  };

  // Avatar upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload/profile', formData);
      if (res.data?.url) {
        await api.put('/users/profile', { avatar: res.data.url });
        await refreshUser();
        alert('Profile picture updated!');
      }
    } catch (err) {
      alert('Failed to upload photo');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Save profile from modal
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/users/profile', {
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        phone: editPhone.trim(),
        location: editLocation.trim(),
        dob: editDob ? new Date(editDob).toISOString() : null,
        bio: editBio.trim(),
        rate: editRate ? parseFloat(editRate) : null,
        serviceArea: editServiceArea.trim(),
        experienceLevel: editExperience,
      });
      await refreshUser();
      alert('Profile updated!');
      setIsEditModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Add certificate
  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim() || !certYear.trim()) return;
    setIsSubmittingCert(true);
    try {
      let documentUrl = '';
      if (certFile) {
        const fd = new FormData();
        fd.append('file', certFile);
        const res = await api.post('/upload/portfolio', fd);
        documentUrl = res.data?.url || res.data?.data?.url || '';
      }
      const newCert: Certificate = {
        title: certTitle.trim(),
        issuer: certIssuer.trim(),
        year: certYear.trim(),
        imageUrl: documentUrl || undefined
      };
      const updated = [...certificates, newCert];
      await api.put('/users/profile', { certificates: updated });
      await refreshUser();
      setCertificates(updated);
      setCertTitle(''); setCertIssuer(''); setCertYear(''); setCertFile(null);
      const fi = document.getElementById('pp-cert-file') as HTMLInputElement;
      if (fi) fi.value = '';
      setIsAddingCert(false);
      alert('Certificate added!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add certificate');
    } finally {
      setIsSubmittingCert(false);
    }
  };

  const handleDeleteCertificate = async (idx: number) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      const updated = certificates.filter((_, i) => i !== idx);
      await api.put('/users/profile', { certificates: updated });
      await refreshUser();
      setCertificates(updated);
    } catch (err: any) {
      alert('Failed to delete certificate');
    }
  };

  // Add portfolio item
  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioTitle.trim()) return;
    setIsSubmittingPortfolio(true);
    try {
      let imageUrl = '';
      if (portfolioFile) {
        const fd = new FormData();
        fd.append('file', portfolioFile);
        const res = await api.post('/upload/portfolio', fd);
        imageUrl = res.data?.url || res.data?.data?.url || '';
      }
      const newItem: PortfolioItem = {
        title: portfolioTitle.trim(),
        description: portfolioDesc.trim(),
        imageUrl: imageUrl || undefined,
        link: portfolioLink.trim() || undefined,
      };
      const updated = [...portfolio, newItem];
      await api.put('/users/profile', { portfolio: updated });
      await refreshUser();
      setPortfolio(updated);
      setPortfolioTitle(''); setPortfolioDesc(''); setPortfolioLink(''); setPortfolioFile(null);
      const fi = document.getElementById('pp-portfolio-file') as HTMLInputElement;
      if (fi) fi.value = '';
      setIsAddingPortfolio(false);
      alert('Portfolio item added!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add portfolio item');
    } finally {
      setIsSubmittingPortfolio(false);
    }
  };

  const handleDeletePortfolio = async (idx: number) => {
    if (!confirm('Delete this portfolio item?')) return;
    try {
      const updated = portfolio.filter((_, i) => i !== idx);
      await api.put('/users/profile', { portfolio: updated });
      await refreshUser();
      setPortfolio(updated);
    } catch (err: any) {
      alert('Failed to delete portfolio item');
    }
  };

  const rawSubTabs = ['Overview', 'Skills', 'Portfolio', 'Certificates', 'Reviews'];
  const getSubTabLabel = (tab: string) => {
    if (i18n.language !== 'fr') return tab;
    switch (tab) {
      case 'Overview': return 'Aperçu';
      case 'Skills': return 'Compétences';
      case 'Portfolio': return 'Portfolio';
      case 'Certificates': return 'Certificats';
      case 'Reviews': return 'Avis';
      default: return tab;
    }
  };

  return (
    <div className="pp-root animate-fade-in">
      {/* Profile Header */}
      <div className="pp-header-card">
        <div className="pp-header-inner">
          {/* Avatar */}
          <div className="pp-avatar-wrap">
            <div className="pp-avatar-ring">
              <img
                src={user?.image ? getMediaUrl(user.image) : DEFAULT_AVATAR}
                alt={fullName}
                className="pp-avatar-img"
              />
              {isUploadingAvatar && (
                <div className="pp-avatar-loading">
                  <svg className="pp-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="pp-spin-bg" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="pp-spin-fg" />
                  </svg>
                </div>
              )}
            </div>
            <button
              className="pp-avatar-edit-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Change photo"
            >
              <Icon name="user" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {/* Name & Info */}
          <div className="pp-user-info">
            <div className="pp-name-row">
              <h2 className="pp-fullname">{fullName}</h2>
              {(user?.providerProfile?.verification === 'VERIFIED' || (user as any)?.isVerified) && (
                <span className="pp-badge pp-verified">
                  <Icon name="shield" /> {i18n.language === 'fr' ? 'Vérifié' : 'Verified'}
                </span>
              )}
              {user?.providerProfile?.verification === 'PENDING' && (
                <span className="pp-badge pp-pending">⏰ {i18n.language === 'fr' ? 'Vérification en attente' : 'Pending Review'}</span>
              )}
            </div>
            {user?.providerProfile?.experienceLevel && (
              <p className="pp-experience-label">{user.providerProfile.experienceLevel} {i18n.language === 'fr' ? 'Professionnel' : 'Professional'}</p>
            )}
            <div className="pp-contact-row">
              <span><Icon name="message" /> {user?.email || (i18n.language === 'fr' ? 'Pas d\'e-mail' : 'No email')}</span>
              <span><Icon name="phone" /> {user?.phone || (i18n.language === 'fr' ? 'Pas de téléphone' : 'No phone')}</span>
              <span><Icon name="location" /> {user?.location || (i18n.language === 'fr' ? 'Lieu non défini' : 'No location')}</span>
            </div>
            {user?.providerProfile?.rate && (
              <div className="pp-rate-badge">
                💰 {Number(user.providerProfile.rate).toLocaleString()} XAF / {i18n.language === 'fr' ? 'h' : 'hr'}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pp-action-btns">
            {/* Availability Toggle - visible especially on mobile */}
            <div className="pp-availability-toggle" style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: isProfileAvailable ? '#ecfdf5' : '#f1f5f9',
              border: `1px solid ${isProfileAvailable ? '#6ee7b7' : '#cbd5e1'}`,
              borderRadius: '12px', padding: '0.6rem 1rem', width: '100%', marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isProfileAvailable ? '#059669' : '#64748b', flex: 1 }}>
                {isProfileAvailable
                  ? (i18n.language === 'fr' ? '🟢 En ligne — Disponible' : '🟢 Online — Available')
                  : (i18n.language === 'fr' ? '⚪ Hors ligne — Indisponible' : '⚪ Offline — Unavailable')}
              </span>
              <button
                className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer border-none outline-none ${isProfileAvailable ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                onClick={async () => {
                  const nextState = !isProfileAvailable;
                  setIsProfileAvailable(nextState);
                  updateUser({
                    isOnline: nextState,
                    providerProfile: { ...user?.providerProfile, isAvailable: nextState }
                  });
                  try {
                    await api.put('/providers/status', { isAvailable: nextState, isOnline: nextState });
                    await refreshUser();
                  } catch (e) {
                    console.error('Failed to update availability status', e);
                    setIsProfileAvailable(!nextState);
                    updateUser({
                      isOnline: !nextState,
                      providerProfile: { ...user?.providerProfile, isAvailable: !nextState }
                    });
                  }
                }}
                title={isProfileAvailable ? (i18n.language === 'fr' ? 'Désactiver la disponibilité' : 'Turn off availability') : (i18n.language === 'fr' ? 'Activer la disponibilité' : 'Turn on availability')}
              >
                <span className="w-5 h-5 bg-white rounded-full shadow-md" />
              </button>
            </div>
            <button className="pp-btn-edit" onClick={() => setIsEditModalOpen(true)}>
              <Icon name="wrench" /> {i18n.language === 'fr' ? 'Modifier le profil' : 'Edit Profile'}
            </button>
            {!(user?.providerProfile?.verification === 'VERIFIED' || user?.providerProfile?.verification === 'PENDING') && (
              <button className="pp-btn-verify" onClick={() => setActiveTab?.('Verification')}>
                <Icon name="shield" /> {i18n.language === 'fr' ? 'Se faire vérifier' : 'Get Verified'}
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="pp-stats-row">
          <div className="pp-stat">
            <span className="pp-stat-label">{i18n.language === 'fr' ? 'Membre depuis' : 'Member Since'}</span>
            <strong className="pp-stat-val">
              <Icon name="calendar" /> {new Date((user as any)?.createdAt || Date.now()).toLocaleDateString()}
            </strong>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-label">{i18n.language === 'fr' ? 'Date de naissance' : 'Date of Birth'}</span>
            <strong className="pp-stat-val">
              {user?.dob ? new Date(user.dob).toLocaleDateString() : (i18n.language === 'fr' ? 'Non définie' : 'Not set')}
            </strong>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-label">{i18n.language === 'fr' ? 'Compétences' : 'Skills'}</span>
            <strong className="pp-stat-val">{skills.length} {i18n.language === 'fr' ? 'Ajoutées' : 'Added'}</strong>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-label">{i18n.language === 'fr' ? 'Certifications' : 'Certifications'}</span>
            <strong className="pp-stat-val">{certificates.length} {i18n.language === 'fr' ? 'Téléchargées' : 'Uploaded'}</strong>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="pp-tabs-scroll">
        {rawSubTabs.map(tab => (
          <button
            key={tab}
            className={`pp-tab-btn ${activeSubTab === tab ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab)}
          >
            {getSubTabLabel(tab)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pp-tab-content">

        {/* OVERVIEW */}
        {activeSubTab === 'Overview' && (
          <div className="pp-panel-group animate-fade-in">
            <div className="pp-panel">
              <h3 className="pp-panel-title">{i18n.language === 'fr' ? 'À propos de moi' : 'About Me'}</h3>
              <p className="pp-bio-text">
                {user?.providerProfile?.bio || (i18n.language === 'fr' ? 'Aucune biographie pour le moment. Cliquez sur Modifier le profil pour ajouter un résumé professionnel.' : 'No bio yet. Click Edit Profile to add a professional summary.')}
              </p>
            </div>

            <div className="pp-panel">
              <h3 className="pp-panel-title">{i18n.language === 'fr' ? 'Informations personnelles' : 'Personal Information'}</h3>
              <div className="pp-info-grid">
                <div className="pp-info-item">
                  <span className="pp-info-label"><Icon name="user" /> {i18n.language === 'fr' ? 'Nom complet' : 'Full Name'}</span>
                  <strong>{fullName}</strong>
                </div>
                <div className="pp-info-item">
                  <span className="pp-info-label"><Icon name="message" /> Email</span>
                  <strong>{user?.email}</strong>
                </div>
                <div className="pp-info-item">
                  <span className="pp-info-label"><Icon name="phone" /> {i18n.language === 'fr' ? 'Téléphone' : 'Phone'}</span>
                  <strong>{user?.phone || (i18n.language === 'fr' ? 'Non défini' : 'Not set')}</strong>
                </div>
                <div className="pp-info-item">
                  <span className="pp-info-label"><Icon name="location" /> {i18n.language === 'fr' ? 'Lieu' : 'Location'}</span>
                  <strong>{user?.location || (i18n.language === 'fr' ? 'Non défini' : 'Not set')}</strong>
                </div>
                <div className="pp-info-item">
                  <span className="pp-info-label">📅 {i18n.language === 'fr' ? 'Date de naissance' : 'Date of Birth'}</span>
                  <strong>{user?.dob ? new Date(user.dob).toLocaleDateString() : (i18n.language === 'fr' ? 'Non définie' : 'Not set')}</strong>
                </div>
                <div className="pp-info-item">
                  <span className="pp-info-label">💰 {i18n.language === 'fr' ? 'Tarif horaire' : 'Hourly Rate'}</span>
                  <strong>{user?.providerProfile?.rate ? `${Number(user.providerProfile.rate).toLocaleString()} XAF/hr` : (i18n.language === 'fr' ? 'Non défini' : 'Not set')}</strong>
                </div>
                <div className="pp-info-item">
                  <span className="pp-info-label">🎯 {i18n.language === 'fr' ? 'Niveau d\'expérience' : 'Experience Level'}</span>
                  <strong>{user?.providerProfile?.experienceLevel || (i18n.language === 'fr' ? 'Non défini' : 'Not set')}</strong>
                </div>
                <div className="pp-info-item">
                  <span className="pp-info-label">📍 {i18n.language === 'fr' ? 'Zone d\'intervention' : 'Service Area'}</span>
                  <strong>{user?.providerProfile?.serviceArea || (i18n.language === 'fr' ? 'Non définie' : 'Not set')}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SKILLS */}
        {activeSubTab === 'Skills' && (
          <div className="pp-panel animate-fade-in">
            <div className="pp-panel-header-row">
              <h3 className="pp-panel-title">My Skills</h3>
              <p className="pp-panel-sub">Add skills to help clients discover you in search results.</p>
            </div>

            {/* Current skills */}
            <div className="pp-skills-cloud">
              {skills.length === 0 ? (
                <p className="pp-empty-msg">No skills added yet. Start typing below to add your first skill.</p>
              ) : (
                skills.map((s, i) => (
                  <span className="pp-skill-pill" key={i}>
                    {s}
                    <button
                      className="pp-skill-remove"
                      onClick={() => handleRemoveSkill(s)}
                      title="Remove skill"
                    >✕</button>
                  </span>
                ))
              )}
            </div>

            {/* Skill input with autocomplete */}
            <div className="pp-skill-input-wrap">
              <div className="pp-skill-autocomplete-container" style={{ position: 'relative' }}>
                <input
                  ref={skillInputRef}
                  className="pp-skill-input"
                  type="text"
                  placeholder="e.g. Plumbing, Web Development, Photography..."
                  value={skillInput}
                  onChange={(e) => handleSkillInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (skillSuggestions.length > 0 && skillInput.trim()) {
                        handleAddSkill(skillSuggestions[0]);
                      } else {
                        handleAddSkill(skillInput);
                      }
                    }
                    if (e.key === 'Escape') setShowSuggestions(false);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onFocus={() => { if (skillInput.trim()) handleSkillInputChange(skillInput); }}
                />
                {showSuggestions && skillSuggestions.length > 0 && (
                  <div className="pp-skill-dropdown">
                    {skillSuggestions.map((sug, i) => (
                      <div
                        key={i}
                        className="pp-skill-suggestion"
                        onMouseDown={() => handleAddSkill(sug)}
                      >
                        {sug}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="pp-btn-add-skill"
                onClick={() => handleAddSkill(skillInput)}
              >
                + Add
              </button>
            </div>

            <div className="pp-skills-save-row">
              <button
                className="pp-btn-save"
                onClick={handleSaveSkills}
                disabled={isSavingSkills}
              >
                {isSavingSkills ? 'Saving...' : 'Save Skills'}
              </button>
            </div>
          </div>
        )}

        {/* PORTFOLIO */}
        {activeSubTab === 'Portfolio' && (
          <div className="pp-panel animate-fade-in">
            <div className="pp-panel-header-row">
              <h3 className="pp-panel-title">Portfolio Projects</h3>
              <button className="pp-btn-add-item" onClick={() => setIsAddingPortfolio(!isAddingPortfolio)}>
                {isAddingPortfolio ? '✕ Cancel' : '+ Add Project'}
              </button>
            </div>

            {isAddingPortfolio && (
              <form onSubmit={handleAddPortfolio} className="pp-add-form animate-fade-in">
                <div className="pp-form-row">
                  <div className="pp-form-field">
                    <label>Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Office Electrical Rewiring"
                      value={portfolioTitle}
                      onChange={e => setPortfolioTitle(e.target.value)}
                    />
                  </div>
                  <div className="pp-form-field">
                    <label>Project Link (optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={portfolioLink}
                      onChange={e => setPortfolioLink(e.target.value)}
                    />
                  </div>
                </div>
                <div className="pp-form-field">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the project, technologies used, outcomes..."
                    value={portfolioDesc}
                    onChange={e => setPortfolioDesc(e.target.value)}
                  />
                </div>
                <div className="pp-form-field">
                  <label>Upload Project Image (optional)</label>
                  <input
                    id="pp-portfolio-file"
                    type="file"
                    accept="image/*"
                    onChange={e => { if (e.target.files) setPortfolioFile(e.target.files[0]); }}
                  />
                </div>
                <button type="submit" className="pp-btn-save" disabled={isSubmittingPortfolio}>
                  {isSubmittingPortfolio ? 'Adding...' : 'Add Portfolio Item'}
                </button>
              </form>
            )}

            {portfolio.length === 0 ? (
              <div className="pp-empty-state">
                <span className="pp-empty-icon">🖼️</span>
                <p>No portfolio items yet. Showcase your past work to impress clients.</p>
              </div>
            ) : (
              <div className="pp-portfolio-grid">
                {portfolio.map((item, i) => {
                  const coverImg = item.imageUrl || (Array.isArray(item.images) && item.images[0]) || '';
                  const rawImgs = Array.isArray(item.images) && item.images.length > 0 ? item.images : (coverImg ? [coverImg] : []);
                  const rawVids = Array.isArray(item.videos) ? item.videos : (item.video ? (Array.isArray(item.video) ? item.video : [item.video]) : []);

                  const handleCardClick = () => {
                    const fullProj = {
                      ...item,
                      imageUrl: coverImg,
                      images: rawImgs,
                      videos: rawVids,
                      provider: {
                        id: user?.id,
                        userId: user?.id,
                        name: fullName,
                        avatar: user?.avatar || '',
                        rating: (user as any)?.rating || 5.0,
                        reviewCount: (user as any)?.reviewCount || 0
                      }
                    };
                    setSelectedModalProject(fullProj);
                  };

                  return (
                    <div
                      key={item.id || i}
                      className="pp-portfolio-card"
                      style={{ cursor: 'pointer', position: 'relative' }}
                      onClick={handleCardClick}
                    >
                      {coverImg ? (
                        <img src={getMediaUrl(coverImg)} alt={item.title} className="pp-portfolio-img" />
                      ) : (
                        <div style={{ width: '100%', height: '140px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                          🎬 Demo Video ({rawVids.length})
                        </div>
                      )}
                      <div className="pp-portfolio-body">
                        <h4 className="pp-portfolio-title">{item.title}</h4>
                        {item.description && <p className="pp-portfolio-desc">{item.description}</p>}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pp-portfolio-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            🔗 External Link
                          </a>
                        )}
                        <span style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: 700, marginTop: '8px', display: 'inline-block' }}>
                          View Full Details →
                        </span>
                      </div>
                      <button
                        className="pp-btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePortfolio(i);
                        }}
                        title="Delete"
                      >✕</button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Preview Modal for Provider Portfolio */}
            {selectedModalProject && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
                <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
                  <button
                    onClick={() => setSelectedModalProject(null)}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    ✕
                  </button>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{selectedModalProject.title}</h3>
                  {selectedModalProject.category && (
                    <span style={{ fontSize: '0.75rem', background: '#ccfbf1', color: '#0d9488', padding: '4px 10px', borderRadius: '12px', fontWeight: 700, display: 'inline-block', marginBottom: '16px' }}>
                      {selectedModalProject.category}
                    </span>
                  )}

                  {/* Images Showcase */}
                  {selectedModalProject.images && selectedModalProject.images.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                      {selectedModalProject.images.map((img: string, idx: number) => (
                        <img key={idx} src={getMediaUrl(img)} alt={`Project media ${idx}`} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} />
                      ))}
                    </div>
                  )}

                  {/* Videos Showcase */}
                  {selectedModalProject.videos && selectedModalProject.videos.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {selectedModalProject.videos.map((vid: string, idx: number) => (
                        <video key={idx} src={getMediaUrl(vid, 'video')} controls style={{ width: '100%', maxHeight: '300px', borderRadius: '10px', background: '#000' }} />
                      ))}
                    </div>
                  )}

                  <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {selectedModalProject.description}
                  </p>

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setSelectedModalProject(null)}
                      style={{ background: '#0d9488', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATES */}
        {activeSubTab === 'Certificates' && (
          <div className="pp-panel animate-fade-in">
            <div className="pp-panel-header-row">
              <h3 className="pp-panel-title">Certificates & Credentials</h3>
              <button className="pp-btn-add-item" onClick={() => setIsAddingCert(!isAddingCert)}>
                {isAddingCert ? '✕ Cancel' : '+ Add Certificate'}
              </button>
            </div>

            {isAddingCert && (
              <form onSubmit={handleAddCertificate} className="pp-add-form animate-fade-in">
                <div className="pp-form-field">
                  <label>Certificate Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Electrician Certificate"
                    value={certTitle}
                    onChange={e => setCertTitle(e.target.value)}
                  />
                </div>
                <div className="pp-form-row">
                  <div className="pp-form-field">
                    <label>Issuing Institution *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Technical Institute"
                      value={certIssuer}
                      onChange={e => setCertIssuer(e.target.value)}
                    />
                  </div>
                  <div className="pp-form-field">
                    <label>Year Issued *</label>
                    <input
                      type="number"
                      required
                      placeholder="2024"
                      min="1950"
                      max={new Date().getFullYear()}
                      value={certYear}
                      onChange={e => setCertYear(e.target.value)}
                    />
                  </div>
                </div>
                <div className="pp-form-field">
                  <label>Upload Certificate Document (optional)</label>
                  <input
                    id="pp-cert-file"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => { if (e.target.files) setCertFile(e.target.files[0]); }}
                  />
                </div>
                <button type="submit" className="pp-btn-save" disabled={isSubmittingCert}>
                  {isSubmittingCert ? 'Uploading...' : '+ Add Certificate'}
                </button>
              </form>
            )}

            {certificates.length === 0 ? (
              <div className="pp-empty-state">
                <span className="pp-empty-icon">📜</span>
                <p>No certificates yet. Adding credentials can boost bookings by up to 40%.</p>
              </div>
            ) : (
              <div className="pp-cert-list">
                {certificates.map((cert, i) => (
                  <div key={i} className="pp-cert-card">
                    <div className="pp-cert-icon">🎓</div>
                    <div className="pp-cert-body">
                      <h4>{cert.title}</h4>
                      <p>{cert.issuer} &bull; {cert.year}</p>
                      {cert.imageUrl && (
                        <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer" className="pp-portfolio-link">
                          👁️ View Document
                        </a>
                      )}
                    </div>
                    <button className="pp-btn-delete" onClick={() => handleDeleteCertificate(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS */}
        {activeSubTab === 'Reviews' && (
          <div className="pp-panel animate-fade-in">
            <h3 className="pp-panel-title">Client Reviews</h3>
            {reviews.length === 0 ? (
              <div className="pp-empty-state">
                <span className="pp-empty-icon">⭐</span>
                <p>No reviews yet. Complete your first job to start receiving reviews.</p>
              </div>
            ) : (
              <div className="pp-reviews-list">
                {reviews.map((r: any) => (
                  <div key={r.id} className="pp-review-card">
                    <div className="pp-review-header">
                      <span className="pp-review-service">{r.serviceName || r.jobTitle || 'Review'}</span>
                      <span className="pp-review-stars">
                        {'★'.repeat(Math.round(r.rating))}{'☆'.repeat(5 - Math.round(r.rating))}
                        <span className="pp-review-rating-num"> {r.rating}</span>
                      </span>
                    </div>
                    {r.comment && <p className="pp-review-text">{r.comment}</p>}
                    <p className="pp-review-date">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="pp-modal-overlay">
          <div className="pp-modal animate-scale-in">
            <div className="pp-modal-header">
              <h3>Edit Profile</h3>
              <button className="pp-modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="pp-modal-form">
              <div className="pp-form-row">
                <div className="pp-form-field">
                  <label>First Name</label>
                  <input type="text" value={editFirstName} onChange={e => setEditFirstName(e.target.value)} required />
                </div>
                <div className="pp-form-field">
                  <label>Last Name</label>
                  <input type="text" value={editLastName} onChange={e => setEditLastName(e.target.value)} required />
                </div>
              </div>
              <div className="pp-form-row">
                <div className="pp-form-field">
                  <label>Phone Number</label>
                  <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
                </div>
                <div className="pp-form-field">
                  <label>Date of Birth</label>
                  <input type="date" value={editDob} onChange={e => setEditDob(e.target.value)} />
                </div>
              </div>
              <div className="pp-form-field">
                <label>Location / City</label>
                <input type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)} />
              </div>
              <div className="pp-form-row">
                <div className="pp-form-field">
                  <label>Hourly Rate (XAF)</label>
                  <input type="number" placeholder="3500" value={editRate} onChange={e => setEditRate(e.target.value)} />
                </div>
                <div className="pp-form-field">
                  <label>Experience Level</label>
                  <select value={editExperience} onChange={e => setEditExperience(e.target.value)}>
                    <option value="Beginner">Beginner (1–2 years)</option>
                    <option value="Intermediate">Intermediate (3–5 years)</option>
                    <option value="Expert">Expert (5+ years)</option>
                  </select>
                </div>
              </div>
              <div className="pp-form-field">
                <label>Service Area (e.g. Douala V, Akwa)</label>
                <input type="text" value={editServiceArea} onChange={e => setEditServiceArea(e.target.value)} />
              </div>
              <div className="pp-form-field">
                <label>Professional Bio</label>
                <textarea
                  rows={4}
                  placeholder="Describe your background, tools, expertise..."
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                />
              </div>
              <div className="pp-modal-actions">
                <button
                  type="button"
                  className="pp-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="pp-btn-save" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
