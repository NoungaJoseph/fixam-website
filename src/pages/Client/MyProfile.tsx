import './MyProfile.css';
import '../Provider/ProviderProfile.css';
import { useState, useRef, useEffect } from 'react';
import { getMediaUrl, DEFAULT_AVATAR } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useTranslation } from 'react-i18next';

// Precise SVG icons
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const VerifiedBadge = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#2563EB">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface MyProfileProps {
  setActiveTab: (tab: string) => void;
  onRoleChange?: (role: 'client' | 'pro') => void;
  userRole?: string;
}

export default function MyProfile({ setActiveTab, onRoleChange, userRole }: MyProfileProps) {
  const { user, refreshUser } = useAuth();
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preferences, setPreferences] = useState({ providerType: 'all' });
  const [reviews, setReviews] = useState<any[]>([]);
  const [tasksCount, setTasksCount] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditFormData({
        firstName: user.firstName || user.fullName?.split(' ')[0] || '',
        lastName: user.lastName || user.fullName?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
      });
    }
  }, [user]);

  // Load reviews and tasks
  useEffect(() => {
    if (user?.id) {
      api.get(`/reviews/users/${user.id}`)
        .then((res: any) => setReviews(res.data?.data || []))
        .catch(() => setReviews([]));

      api.get('/jobs/client')
        .then((res: any) => {
          const list = res.data?.data || res.data || [];
          setTasksCount(Array.isArray(list) ? list.length : 0);
        })
        .catch(() => setTasksCount(0));
    }
    const savedPrefs = localStorage.getItem('fixam_preferences');
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
  }, [user?.id]);

  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || (i18n.language === 'fr' ? 'Client Fixam' : 'Fixam Client');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploadingAvatar(true);
    try {
      const response = await api.post('/upload/profile', formData);
      const avatarUrl = response.data?.url || response.data?.data?.url;
      if (avatarUrl) {
        await api.put('/users/profile', { avatar: avatarUrl });
        await refreshUser();
        alert(i18n.language === 'fr' ? 'Photo de profil mise à jour !' : 'Profile picture updated successfully!');
      }
    } catch (error) {
      alert('Failed to upload profile picture.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/users/profile', {
        ...editFormData,
        fullName: `${editFormData.firstName} ${editFormData.lastName}`.trim(),
      });
      await refreshUser();
      setIsEditModalOpen(false);
      alert(i18n.language === 'fr' ? 'Profil mis à jour !' : 'Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('fixam_preferences', JSON.stringify(preferences));
    alert(i18n.language === 'fr' ? 'Préférences enregistrées !' : 'Preferences saved!');
  };

  const toggleRole = () => {
    if (onRoleChange) {
      onRoleChange(userRole === 'client' ? 'pro' : 'client');
    }
  };

  return (
    <div className="upwork-mobile-page animate-fade-in">

      {/* ── UNIFIED CONTINUOUS CLIENT PANEL ── */}
      <div className="upwork-unified-panel">

        {/* ── 1. CLIENT HERO / IDENTITY SECTION ── */}
        <section className="upwork-panel-section upwork-hero-section">
          <div className="upwork-hero-row">
            {/* Avatar on Left with edit button */}
            <div className="upwork-avatar-slot">
              <div className="upwork-avatar-frame">
                <img
                  src={user?.avatar || user?.image ? getMediaUrl(user.avatar || user.image) : DEFAULT_AVATAR}
                  alt={fullName}
                  className="upwork-avatar-image"
                />
                <span className="upwork-avatar-online-dot online" />
                {isUploadingAvatar && (
                  <div className="upwork-avatar-loader">
                    <span className="animate-spin">⏳</span>
                  </div>
                )}
              </div>

              <button
                className="upwork-action-circle upwork-avatar-edit"
                onClick={() => fileInputRef.current?.click()}
                title="Change photo"
              >
                <EditIcon />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* Details on Right */}
            <div className="upwork-hero-details">
              <div className="upwork-hero-name-row">
                <h1 className="upwork-display-name">{fullName}</h1>
                {((user as any)?.isVerified || user?.providerProfile?.verification === 'VERIFIED') && (
                  <span className="upwork-verified-badge" title="Verified Account">
                    <VerifiedBadge />
                  </span>
                )}
              </div>

              <div className="upwork-location-line">
                <PinIcon />
                <span>{user?.location || 'Douala, Cameroon'}</span>
              </div>

              <div className="upwork-time-line">
                <span>
                  {i18n.language === 'fr' ? 'Membre depuis' : 'Member since'}{' '}
                  {new Date((user as any)?.createdAt || Date.now()).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                {onRoleChange && (
                  <button
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
                    onClick={toggleRole}
                  >
                    {i18n.language === 'fr' ? 'Basculer en mode Prestataire →' : 'Switch to Provider View →'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. PERSONAL CONTACT & LOCATION ── */}
        <section className="upwork-panel-section">
          <div className="upwork-section-header-row">
            <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Coordonnées personnelles' : 'Personal Contact Details'}</h3>
            <button
              className="upwork-action-circle"
              onClick={() => setIsEditModalOpen(true)}
              title="Edit details"
            >
              <EditIcon />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                {i18n.language === 'fr' ? 'Nom complet' : 'Full Name'}
              </span>
              <strong className="text-sm text-slate-800">{fullName}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                {i18n.language === 'fr' ? 'Adresse email' : 'Email Address'}
              </span>
              <strong className="text-sm text-slate-800">{user?.email || (i18n.language === 'fr' ? 'Non renseigné' : 'Not set')}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                {i18n.language === 'fr' ? 'Numéro de téléphone' : 'Phone Number'}
              </span>
              <strong className="text-sm text-slate-800">{user?.phone || (i18n.language === 'fr' ? 'Non renseigné' : 'Not set')}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                {i18n.language === 'fr' ? 'Ville & Localisation' : 'City & Location'}
              </span>
              <strong className="text-sm text-slate-800">{user?.location || 'Douala, Cameroon'}</strong>
            </div>
          </div>
        </section>

        {/* ── 3. CLIENT ACTIVITY & TASKS ── */}
        <section className="upwork-panel-section">
          <div className="upwork-section-header-row">
            <div>
              <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Vos missions & réservations' : 'Your Tasks & Activity'}</h3>
              <span className="upwork-section-caption">{tasksCount} {i18n.language === 'fr' ? 'missions publiées' : 'tasks created'}</span>
            </div>
            <button
              className="upwork-btn-small-action"
              onClick={() => setActiveTab('Dashboard')}
            >
              + {i18n.language === 'fr' ? 'Poster une mission' : 'Post a Task'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
            <div className="p-3 text-center rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xl font-extrabold text-teal-600 block">{tasksCount}</span>
              <span className="text-xs text-slate-600 font-semibold">{i18n.language === 'fr' ? 'Missions créées' : 'Tasks Posted'}</span>
            </div>

            <div className="p-3 text-center rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xl font-extrabold text-teal-600 block">{reviews.length}</span>
              <span className="text-xs text-slate-600 font-semibold">{i18n.language === 'fr' ? 'Avis rédigés' : 'Reviews Given'}</span>
            </div>

            <div className="p-3 text-center rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-xl font-extrabold text-emerald-600 block">100%</span>
              <span className="text-xs text-slate-600 font-semibold">{i18n.language === 'fr' ? 'Fiabilité' : 'Reliability'}</span>
            </div>
          </div>
        </section>

        {/* ── 4. TRUST & SECURITY ── */}
        <section className="upwork-panel-section">
          <h3 className="upwork-section-heading mb-3">{i18n.language === 'fr' ? 'Sécurité & Vérifications' : 'Trust & Verifications'}</h3>

          <div className="upwork-setting-item">
            <div>
              <h4 className="upwork-setting-label">{i18n.language === 'fr' ? 'Numéro de téléphone' : 'Phone Verification'}</h4>
              <span className="upwork-setting-val">
                {user?.phone ? (i18n.language === 'fr' ? 'Vérifié' : 'Verified') : (i18n.language === 'fr' ? 'Non vérifié' : 'Not verified')}
              </span>
            </div>
            <span className="text-emerald-500 font-bold text-sm">✓</span>
          </div>

          <div className="upwork-setting-item mt-3 pt-3 border-t border-slate-100">
            <div>
              <h4 className="upwork-setting-label">{i18n.language === 'fr' ? 'Adresse email' : 'Email Verification'}</h4>
              <span className="upwork-setting-val">
                {user?.email ? (i18n.language === 'fr' ? 'Vérifié' : 'Verified') : (i18n.language === 'fr' ? 'Non vérifié' : 'Not verified')}
              </span>
            </div>
            <span className="text-emerald-500 font-bold text-sm">✓</span>
          </div>

          <div className="upwork-setting-item mt-3 pt-3 border-t border-slate-100">
            <div>
              <h4 className="upwork-setting-label">{i18n.language === 'fr' ? 'Pièce d\'identité' : 'National ID / Passport'}</h4>
              <span className="upwork-setting-val">
                {(user as any)?.isVerified || user?.providerProfile?.verification === 'VERIFIED'
                  ? (i18n.language === 'fr' ? 'Vérifié' : 'Verified')
                  : (i18n.language === 'fr' ? 'Non vérifié' : 'Not verified')}
              </span>
            </div>
            <button
              className="upwork-btn-small-action"
              onClick={() => setActiveTab('Verification')}
            >
              {i18n.language === 'fr' ? 'Vérifier' : 'Verify'}
            </button>
          </div>
        </section>

        {/* ── 5. CLIENT PREFERENCES ── */}
        <section className="upwork-panel-section border-b-0">
          <h3 className="upwork-section-heading mb-1">{i18n.language === 'fr' ? 'Préférences de recherche' : 'Provider Discovery Preferences'}</h3>
          <p className="text-xs text-slate-500 mb-3">
            {i18n.language === 'fr'
              ? 'Personnalisez les types de prestataires que vous préférez voir dans votre fil d\'actualité.'
              : 'Customize the type of service providers you see first on Fixam.'}
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {i18n.language === 'fr' ? 'Filtre prestataire' : 'Provider Filter'}
              </label>
              <select
                className="upwork-form-input"
                value={preferences.providerType}
                onChange={(e) => setPreferences({ ...preferences, providerType: e.target.value })}
              >
                <option value="all">{i18n.language === 'fr' ? 'Afficher tous les prestataires' : 'Show all available providers'}</option>
                <option value="local">{i18n.language === 'fr' ? 'Afficher uniquement les prestataires de mon quartier/ville' : 'Show only local providers in my quarter/city'}</option>
                <option value="verified">{i18n.language === 'fr' ? 'Afficher uniquement les prestataires vérifiés' : 'Show only verified providers'}</option>
              </select>
            </div>

            <div className="flex justify-end pt-1">
              <button
                className="upwork-btn-sheet-save"
                onClick={handleSavePreferences}
              >
                {i18n.language === 'fr' ? 'Enregistrer les préférences' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {isEditModalOpen && (
        <div className="upwork-modal-backdrop">
          <div className="upwork-modal-sheet animate-scale-in">
            <div className="upwork-sheet-header">
              <h3>{i18n.language === 'fr' ? 'Modifier le profil client' : 'Edit Client Profile'}</h3>
              <button className="upwork-sheet-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    className="upwork-form-input"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    className="upwork-form-input"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="upwork-form-input"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location (City, Quarter)</label>
                <input
                  type="text"
                  className="upwork-form-input"
                  placeholder="e.g. Douala, Kotto"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                />
              </div>

              <div className="upwork-sheet-footer">
                <button
                  type="button"
                  className="upwork-btn-sheet-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="upwork-btn-sheet-save"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
