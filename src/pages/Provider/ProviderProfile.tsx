import './ProviderProfile.css';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getMediaUrl, DEFAULT_AVATAR } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  CAMEROON_CITIES,
  CAMEROON_QUARTERS,
  searchCameroonQuarters,
  getAllQuarterNames,
} from '../../data/cameroonQuarters';

// ── Precise SVG Icons (Replacing all child emojis) ──
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const LinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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

const TagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

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

type EmploymentItem = {
  title: string;
  company: string;
  period: string;
  description?: string;
};

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Availability toggle
  const [isProfileAvailable, setIsProfileAvailable] = useState(() =>
    Boolean(user?.providerProfile?.isAvailable ?? user?.isOnline ?? true)
  );

  // Edit profile form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  // Quick edit modal states
  const [quickEditSection, setQuickEditSection] = useState<'title' | 'rate' | 'bio' | null>(null);

  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editRate, setEditRate] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editExperience, setEditExperience] = useState('Intermediate');

  // Service Area Quarters (New Feature)
  const [isServiceAreaModalOpen, setIsServiceAreaModalOpen] = useState(false);
  const [selectedQuarters, setSelectedQuarters] = useState<string[]>([]);
  const [quarterCity, setQuarterCity] = useState<'Douala' | 'Yaoundé' | 'Buea' | 'Bamenda'>('Douala');
  const [quarterSearch, setQuarterSearch] = useState('');
  const [isSavingQuarters, setIsSavingQuarters] = useState(false);

  // Skills
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSavingSkills, setIsSavingSkills] = useState(false);
  const skillInputRef = useRef<HTMLInputElement>(null);

  // Portfolio
  const [portfolioTab, setPortfolioTab] = useState<'Published' | 'Drafts'>('Published');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [isSubmittingPortfolio, setIsSubmittingPortfolio] = useState(false);
  const [selectedModalProject, setSelectedModalProject] = useState<any | null>(null);

  // Certificates
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [isSubmittingCert, setIsSubmittingCert] = useState(false);

  // Employment History
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentItem[]>([]);
  const [isAddingEmployment, setIsAddingEmployment] = useState(false);
  const [empTitle, setEmpTitle] = useState('');
  const [empCompany, setEmpCompany] = useState('');
  const [empPeriod, setEmpPeriod] = useState('');
  const [empDesc, setEmpDesc] = useState('');
  const [isSubmittingEmployment, setIsSubmittingEmployment] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<any[]>([]);

  // Setup Bonus State
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isBoostDismissed, setIsBoostDismissed] = useState(false);

  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Provider';

  // Live local time
  const [localTime, setLocalTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase());
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sync user profile state
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
        setEditTitle(
          (user.providerProfile as any)?.title ||
          (user.providerProfile.skills && user.providerProfile.skills[0]) ||
          (i18n.language === 'fr' ? 'Spécialiste & Prestataire' : 'Virtual assistant and data entry specialist')
        );
        setEditExperience(user.providerProfile.experienceLevel || 'Intermediate');
        setSkills(Array.isArray(user.providerProfile.skills) ? user.providerProfile.skills : []);
        setCertificates(Array.isArray(user.providerProfile.certificates) ? user.providerProfile.certificates : []);
        setPortfolio(Array.isArray(user.providerProfile.portfolio) ? user.providerProfile.portfolio : []);
        setEmploymentHistory(Array.isArray((user.providerProfile as any).employmentHistory) ? (user.providerProfile as any).employmentHistory : []);

        const rawServiceArea = user.providerProfile.serviceArea || '';
        const parsedQuarters = rawServiceArea
          ? rawServiceArea.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [];
        setSelectedQuarters(parsedQuarters);
      }
    }
  }, [user, i18n.language]);

  // Fetch reviews on mount
  useEffect(() => {
    if (user?.id) {
      api.get(`/reviews/users/${user.id}`)
        .then((res: any) => setReviews(res.data?.data || []))
        .catch(() => setReviews([]));
    }
  }, [user?.id]);

  // Setup Progress Checklist (6-step parity with mobile app)
  const isServiceAreaCompleted = useMemo(() => {
    const raw = user?.providerProfile?.serviceArea?.trim();
    if (!raw) return false;
    const clientLoc = (user?.location || '').toLowerCase().trim();
    return raw.length > 0 && raw.toLowerCase() !== clientLoc;
  }, [user?.providerProfile?.serviceArea, user?.location]);

  const setupSteps = [
    {
      key: 'avatar',
      label: i18n.language === 'fr' ? 'Photo de profil' : 'Profile Picture',
      completed: Boolean(user?.avatar || user?.image),
      action: () => fileInputRef.current?.click(),
    },
    {
      key: 'bio',
      label: i18n.language === 'fr' ? 'Biographie professionnelle' : 'Professional Bio',
      completed: Boolean(user?.providerProfile?.bio && user.providerProfile.bio.trim().length > 0),
      action: () => setQuickEditSection('bio'),
    },
    {
      key: 'skills',
      label: i18n.language === 'fr' ? 'Compétences & Métiers' : 'Skills',
      completed: Boolean(skills.length > 0),
      action: () => setIsSkillsModalOpen(true),
    },
    {
      key: 'serviceArea',
      label: i18n.language === 'fr' ? 'Zone d\'intervention (Quartiers)' : 'Service Area (Quarters)',
      completed: isServiceAreaCompleted,
      action: () => setIsServiceAreaModalOpen(true),
    },
    {
      key: 'portfolio',
      label: i18n.language === 'fr' ? 'Projet de portfolio' : 'Portfolio Project',
      completed: Boolean(portfolio.length > 0),
      action: () => setIsAddingPortfolio(true),
    },
    {
      key: 'verification',
      label: i18n.language === 'fr' ? 'Vérification d\'identité' : 'Identity Verification',
      completed: user?.providerProfile?.verification === 'VERIFIED',
      action: () => setActiveTab?.('Verification'),
    },
  ];

  const completedStepsCount = setupSteps.filter(s => s.completed).length;
  const setupProgress = Math.round((completedStepsCount / setupSteps.length) * 100);
  const showSetupWidget = !user?.providerProfile?.setupBonusClaimed || setupProgress < 100;

  // Claim Setup Bonus (1 Coin)
  const handleClaimBonus = async () => {
    try {
      setIsClaimingBonus(true);
      const res = await api.post('/providers/claim-setup-bonus');
      if (res.data?.success) {
        alert(res.data?.message || '🎉 1 Fixam Coin bonus added to your wallet!');
        await refreshUser();
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'Requirement not met or bonus already claimed.');
    } finally {
      setIsClaimingBonus(false);
    }
  };

  // Avatar Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload/profile', formData);
      const newAvatarUrl = res.data?.url || res.data?.data?.url;
      if (newAvatarUrl) {
        await api.put('/users/profile', { avatar: newAvatarUrl });
        await refreshUser();
        alert(i18n.language === 'fr' ? 'Photo de profil mise à jour !' : 'Profile picture updated!');
      }
    } catch (err) {
      alert('Failed to upload photo');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Quarters Selection Helpers
  const matchingQuarters = useMemo(() => {
    if (!quarterSearch.trim()) return [];
    return searchCameroonQuarters(quarterSearch, quarterCity);
  }, [quarterSearch, quarterCity]);

  const handleToggleQuarter = (qName: string) => {
    setSelectedQuarters(prev =>
      prev.includes(qName) ? prev.filter(q => q !== qName) : [...prev, qName]
    );
  };

  const handleSelectAllInCity = () => {
    const cityQuarters = getAllQuarterNames(quarterCity);
    setSelectedQuarters(prev => Array.from(new Set([...prev, ...cityQuarters])));
  };

  const handleClearAllQuarters = () => {
    setSelectedQuarters([]);
  };

  const handleSaveServiceArea = async () => {
    setIsSavingQuarters(true);
    try {
      const serviceAreaStr = selectedQuarters.join(', ');
      await api.put('/users/profile', { serviceArea: serviceAreaStr });
      await refreshUser();
      setIsServiceAreaModalOpen(false);
      alert(i18n.language === 'fr' ? 'Zones d\'intervention mises à jour !' : 'Service area quarters updated!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save service area');
    } finally {
      setIsSavingQuarters(false);
    }
  };

  // Skills handlers
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
      setIsSkillsModalOpen(false);
      alert('Skills updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update skills');
    } finally {
      setIsSavingSkills(false);
    }
  };

  // Quick Save (Title, Rate, Bio)
  const handleQuickSave = async (field: 'title' | 'rate' | 'bio') => {
    setIsSaving(true);
    try {
      const updates: any = {};
      if (field === 'title') updates.title = editTitle;
      if (field === 'rate') updates.rate = Number(editRate) || 0;
      if (field === 'bio') updates.bio = editBio;
      await api.put('/users/profile', updates);
      await refreshUser();
      setQuickEditSection(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update field');
    } finally {
      setIsSaving(false);
    }
  };

  // Full Edit Profile Modal Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/users/profile', {
        firstName: editFirstName,
        lastName: editLastName,
        fullName: `${editFirstName} ${editLastName}`.trim(),
        phone: editPhone,
        location: editLocation,
        dob: editDob ? new Date(editDob).toISOString() : undefined,
        bio: editBio,
        title: editTitle,
        rate: Number(editRate) || 0,
        experienceLevel: editExperience,
      });
      await refreshUser();
      setIsEditModalOpen(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Portfolio Item Submit
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
      setPortfolioTitle('');
      setPortfolioDesc('');
      setPortfolioLink('');
      setPortfolioFile(null);
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

  // Certificate Submit
  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim() || !certYear.trim()) return;
    setIsSubmittingCert(true);
    try {
      let imageUrl = '';
      if (certFile) {
        const fd = new FormData();
        fd.append('file', certFile);
        const res = await api.post('/upload/document', fd);
        imageUrl = res.data?.url || res.data?.data?.url || '';
      }
      const newCert: Certificate = {
        title: certTitle.trim(),
        issuer: certIssuer.trim(),
        year: certYear.trim(),
        imageUrl: imageUrl || undefined,
      };
      const updated = [...certificates, newCert];
      await api.put('/users/profile', { certificates: updated });
      await refreshUser();
      setCertificates(updated);
      setCertTitle('');
      setCertIssuer('');
      setCertYear('');
      setCertFile(null);
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

  // Employment History Submit
  const handleAddEmployment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empTitle.trim() || !empCompany.trim()) return;
    setIsSubmittingEmployment(true);
    try {
      const newEmp: EmploymentItem = {
        title: empTitle.trim(),
        company: empCompany.trim(),
        period: empPeriod.trim() || 'Past experience',
        description: empDesc.trim() || undefined,
      };
      const updated = [...employmentHistory, newEmp];
      await api.put('/users/profile', { employmentHistory: updated });
      await refreshUser();
      setEmploymentHistory(updated);
      setEmpTitle('');
      setEmpCompany('');
      setEmpPeriod('');
      setEmpDesc('');
      setIsAddingEmployment(false);
      alert('Employment history added!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add employment');
    } finally {
      setIsSubmittingEmployment(false);
    }
  };

  const handleDeleteEmployment = async (idx: number) => {
    if (!confirm('Delete this employment item?')) return;
    try {
      const updated = employmentHistory.filter((_, i) => i !== idx);
      await api.put('/users/profile', { employmentHistory: updated });
      await refreshUser();
      setEmploymentHistory(updated);
    } catch (err: any) {
      alert('Failed to delete employment');
    }
  };

  // Share profile handler
  const handleShareProfile = async () => {
    try {
      const shareUrl = `https://usefixam.com/profile/${user?.id}`;
      if (navigator.share) {
        await navigator.share({
          title: `${fullName} on Fixam`,
          text: `Hire ${fullName} on Fixam!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert(i18n.language === 'fr' ? 'Lien de profil copié !' : 'Profile link copied to clipboard!');
      }
    } catch {
      /* dismissed */
    }
  };

  const isBoostActive = user?.providerProfile?.boostExpiresAt && new Date(user.providerProfile.boostExpiresAt) > new Date();

  return (
    <div className="upwork-mobile-page animate-fade-in">

      {/* ── TOP ANNOUNCEMENT / SETUP BANNER (DISMISSIBLE) ── */}
      {showSetupWidget && !isBannerDismissed && (
        <div className="upwork-announcement-card">
          <button
            className="upwork-banner-close-btn"
            onClick={() => setIsBannerDismissed(true)}
            title="Dismiss"
          >
            <CloseIcon />
          </button>

          <h3 className="upwork-announcement-title">
            {i18n.language === 'fr' ? 'Complétez votre profil (Bonus 1 Coin)' : 'Complete your profile setup'}
          </h3>

          <p className="upwork-announcement-desc">
            {i18n.language === 'fr'
              ? 'Remplissez les informations clés pour débloquer votre premier Fixam Coin gratuit et être recommandé auprès des clients à proximité.'
              : 'Increase your chances of getting hired by adding your operating quarters, skills, and past work! Reach 100% to claim 1 free Fixam Coin.'}
          </p>

          <div className="upwork-progress-line-wrap">
            <div className="upwork-progress-track">
              <div className="upwork-progress-bar" style={{ width: `${setupProgress}%` }} />
            </div>
            <span className="upwork-progress-text">{setupProgress}% completed</span>
          </div>

          <button
            className="upwork-btn-announcement"
            onClick={() => {
              if (setupProgress === 100) {
                handleClaimBonus();
              } else {
                const firstPending = setupSteps.find(s => !s.completed);
                if (firstPending) firstPending.action();
              }
            }}
          >
            {setupProgress === 100
              ? (isClaimingBonus ? 'Claiming...' : '🎉 Claim 1 Coin Bonus')
              : (i18n.language === 'fr' ? 'Continuer la configuration' : 'Continue setup')}
          </button>
        </div>
      )}

      {/* ── UNIFIED PROFILE PANEL (SEAMLESS SINGLE CONTAINER) ── */}
      <div className="upwork-unified-panel">

        {/* ── 1. HERO IDENTITY SECTION ── */}
        <section className="upwork-panel-section upwork-hero-section">
          <div className="upwork-hero-row">
            {/* Avatar on Left with green online dot and pencil button */}
            <div className="upwork-avatar-slot">
              <div className="upwork-avatar-frame">
                <img
                  src={user?.avatar || user?.image ? getMediaUrl(user.avatar || user.image) : DEFAULT_AVATAR}
                  alt={fullName}
                  className="upwork-avatar-image"
                />
                <span className={`upwork-avatar-online-dot ${isProfileAvailable ? 'online' : 'offline'}`} />
                {isUploadingAvatar && (
                  <div className="upwork-avatar-loader">
                    <span className="animate-spin">⏳</span>
                  </div>
                )}
              </div>

              {/* Circular pencil edit button on avatar */}
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

            {/* Identity Info on Right */}
            <div className="upwork-hero-details">
              <div className="upwork-hero-name-row">
                <h1 className="upwork-display-name">{fullName}</h1>
                {user?.providerProfile?.verification === 'VERIFIED' && (
                  <span className="upwork-verified-badge" title="Verified Pro">
                    <VerifiedBadge />
                  </span>
                )}
                <button
                  className="upwork-share-icon-btn"
                  onClick={handleShareProfile}
                  title="Share profile"
                >
                  <ShareIcon />
                </button>
              </div>

              <div className="upwork-location-line">
                <PinIcon />
                <span>{user?.location || 'Douala, Cameroon'}</span>
              </div>

              <div className="upwork-time-line">
                <span>{localTime} local time</span>
              </div>

              <div className="upwork-availability-line">
                <span className={`upwork-availability-text ${isProfileAvailable ? 'avail-on' : 'avail-off'}`}>
                  <BoltIcon />
                  {isProfileAvailable
                    ? (i18n.language === 'fr' ? 'Disponible maintenant' : 'Available now')
                    : (i18n.language === 'fr' ? 'Actuellement indisponible' : 'Currently unavailable')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. PROMO BANNER (BOOST PROFILE) ── */}
        {!isBoostDismissed && (
          <div className="upwork-sub-promo-bar">
            <div className="upwork-promo-inner">
              <div className="upwork-promo-tag-row">
                <div className="flex items-center gap-1.5 text-teal-700 font-bold text-xs">
                  <TagIcon />
                  <span>
                    {isBoostActive
                      ? (i18n.language === 'fr' ? 'Profil Boosté Actif' : 'Boosted Profile Active')
                      : (i18n.language === 'fr' ? 'Booster votre profil' : 'Upgrade to Boosted Profile')}
                  </span>
                </div>
                <button
                  className="text-slate-400 hover:text-slate-600"
                  onClick={() => setIsBoostDismissed(true)}
                  title="Dismiss"
                >
                  <CloseIcon />
                </button>
              </div>

              <p className="upwork-promo-copy">
                {isBoostActive
                  ? (i18n.language === 'fr' ? 'Votre profil est prioritaire dans les résultats de recherche de votre ville.' : 'Your profile is currently prioritized at the top of client search results.')
                  : (i18n.language === 'fr' ? 'Améliorez vos chances d\'être engagé avec la mise en avant du profil et les alertes prioritaires.' : 'Improve your chances of getting hired with proposal insights, profile customizations, and more perks.')}
              </p>

              <button
                className="upwork-promo-link-btn"
                onClick={() => setActiveTab?.('Boost Profile')}
              >
                {isBoostActive
                  ? (i18n.language === 'fr' ? 'Gérer le boost →' : 'Manage Boost →')
                  : (i18n.language === 'fr' ? 'Booster maintenant →' : 'Boost now →')}
              </button>
            </div>
          </div>
        )}

        {/* ── 3. TITLE, RATE & BIO SECTION ── */}
        <section className="upwork-panel-section">
          {/* Profession Title with green circular edit button & link button */}
          <div className="upwork-title-row">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h2 className="upwork-headline-text">
                {editTitle || 'Virtual assistant and data entry specialist'}
              </h2>
              <button
                className="upwork-action-circle"
                onClick={() => setQuickEditSection('title')}
                title="Edit title"
              >
                <EditIcon />
              </button>
            </div>

            <button
              className="upwork-action-circle"
              onClick={handleShareProfile}
              title="Copy Profile Link"
            >
              <LinkIcon />
            </button>
          </div>

          {/* Hourly Rate with green circular edit button */}
          <div className="upwork-rate-row">
            <span className="upwork-rate-amount">
              {user?.providerProfile?.rate
                ? `${Number(user.providerProfile.rate).toLocaleString()} XAF/hr`
                : '3,500 XAF/hr'}
            </span>
            <button
              className="upwork-action-circle"
              onClick={() => setQuickEditSection('rate')}
              title="Edit rate"
            >
              <EditIcon />
            </button>
          </div>

          {/* Overview Sub-headline with green circular edit button */}
          <div className="upwork-overview-header-row">
            <span className="upwork-overview-subheading">
              {editTitle} | Accurate, Reliable & Detail-Oriented
            </span>
            <button
              className="upwork-action-circle"
              onClick={() => setQuickEditSection('bio')}
              title="Edit overview"
            >
              <EditIcon />
            </button>
          </div>

          {/* Bio text with more toggle */}
          <div className="upwork-overview-body">
            <p className={`upwork-bio-paragraph ${isBioExpanded ? 'expanded' : 'collapsed'}`}>
              {user?.providerProfile?.bio ||
                'Need someone who can take care of your tasks accurately without constant supervision? You have found the right professional. I handle projects with diligence, care, and guaranteed quality.'}
            </p>
            {user?.providerProfile?.bio && user.providerProfile.bio.length > 180 && (
              <button
                className="upwork-toggle-more-btn"
                onClick={() => setIsBioExpanded(!isBioExpanded)}
              >
                {isBioExpanded ? 'less' : 'more'}
              </button>
            )}
          </div>
        </section>

        {/* ── 4. PORTFOLIO SECTION ── */}
        <section className="upwork-panel-section">
          <div className="upwork-section-header-row">
            <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Portfolio' : 'Portfolio'}</h3>
            <button
              className="upwork-action-circle"
              onClick={() => setIsAddingPortfolio(true)}
              title="Add portfolio project"
            >
              <PlusIcon />
            </button>
          </div>

          {/* Portfolio Sub-tabs (Published / Drafts) */}
          <div className="upwork-sub-tabs">
            <button
              className={`upwork-sub-tab ${portfolioTab === 'Published' ? 'active' : ''}`}
              onClick={() => setPortfolioTab('Published')}
            >
              {i18n.language === 'fr' ? 'Publiés' : 'Published'}
            </button>
            <button
              className={`upwork-sub-tab ${portfolioTab === 'Drafts' ? 'active' : ''}`}
              onClick={() => setPortfolioTab('Drafts')}
            >
              {i18n.language === 'fr' ? 'Brouillons' : 'Drafts'}
            </button>
          </div>

          {portfolio.length === 0 ? (
            <div className="upwork-illustration-state">
              {/* Upwork Briefcase Graphic */}
              <div className="upwork-briefcase-wrapper">
                <svg width="84" height="68" viewBox="0 0 72 60" fill="none">
                  <rect x="6" y="16" width="60" height="40" rx="6" fill="#C2410C" />
                  <path d="M26 16V10a4 4 0 014-4h12a4 4 0 014 4v6" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" />
                  <rect x="33" y="32" width="6" height="8" rx="2" fill="#FDE047" />
                  <path d="M6 26l30 8 30-8" stroke="#9A3412" strokeWidth="2" />
                </svg>
              </div>

              <p className="upwork-illustration-copy">
                <button
                  className="upwork-inline-link"
                  onClick={() => setIsAddingPortfolio(true)}
                >
                  {i18n.language === 'fr' ? 'Ajouter un projet.' : 'Add a project.'}
                </button>{' '}
                {i18n.language === 'fr'
                  ? 'Les prestataires avec portfolio sont engagés jusqu\'à 9x plus souvent.'
                  : 'Talent are hired 9x more often if they\'ve published a portfolio.'}
              </p>
            </div>
          ) : (
            <div className="upwork-portfolio-list">
              {portfolio.map((item, i) => {
                const coverImg = item.imageUrl || (Array.isArray(item.images) && item.images[0]) || '';
                return (
                  <div
                    key={item.id || i}
                    className="upwork-portfolio-card"
                    onClick={() => setSelectedModalProject(item)}
                  >
                    {coverImg ? (
                      <img src={getMediaUrl(coverImg)} alt={item.title} className="upwork-portfolio-image" />
                    ) : (
                      <div className="upwork-portfolio-fallback">Project Demo</div>
                    )}
                    <div className="upwork-portfolio-text-wrap">
                      <h4 className="upwork-portfolio-title">{item.title}</h4>
                      {item.description && <p className="upwork-portfolio-snippet">{item.description}</p>}
                    </div>
                    <button
                      className="upwork-item-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePortfolio(i);
                      }}
                      title="Delete"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── 5. SERVICE AREA (QUARTERS) SECTION (OUR NEW FEATURE) ── */}
        <section className="upwork-panel-section">
          <div className="upwork-section-header-row">
            <div>
              <h3 className="upwork-section-heading">
                {i18n.language === 'fr' ? 'Zone d\'intervention (Quartiers)' : 'Service Area (Quarters)'}
              </h3>
              <span className="upwork-section-caption">
                {i18n.language === 'fr'
                  ? 'Quartiers où vous vous déplacez pour vos interventions'
                  : 'Quarters where you travel and execute tasks'}
              </span>
            </div>
            <button
              className="upwork-action-circle"
              onClick={() => setIsServiceAreaModalOpen(true)}
              title="Edit service areas"
            >
              <EditIcon />
            </button>
          </div>

          {selectedQuarters.length === 0 ? (
            <div className="upwork-illustration-state py-3">
              <p className="upwork-illustration-copy">
                <button
                  className="upwork-inline-link"
                  onClick={() => setIsServiceAreaModalOpen(true)}
                >
                  {i18n.language === 'fr' ? 'Définir vos quartiers.' : 'Set your quarters.'}
                </button>{' '}
                {i18n.language === 'fr'
                  ? 'Permettez aux clients à Kotto, Bonamoussadi ou autres quartiers de vous trouver en priorité.'
                  : 'When clients in Kotto, Bonamoussadi, or nearby post jobs, handymen in their quarter rank #1.'}
              </p>
            </div>
          ) : (
            <div className="upwork-tags-container">
              {selectedQuarters.map((quarter) => (
                <span key={quarter} className="upwork-quarter-tag">
                  {quarter}
                  <button
                    className="upwork-tag-close-btn"
                    onClick={() => handleToggleQuarter(quarter)}
                    title="Remove"
                  >
                    <CloseIcon />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* ── 6. SKILLS SECTION ── */}
        <section className="upwork-panel-section">
          <div className="upwork-section-header-row">
            <div>
              <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Compétences' : 'Skills'}</h3>
              <span className="upwork-section-caption">{i18n.language === 'fr' ? 'Déclaré par vous-même' : 'Self-reported'}</span>
            </div>
            <button
              className="upwork-action-circle"
              onClick={() => setIsSkillsModalOpen(true)}
              title="Edit skills"
            >
              <EditIcon />
            </button>
          </div>

          {skills.length === 0 ? (
            <div className="upwork-illustration-state py-3">
              <p className="upwork-illustration-copy">
                <button
                  className="upwork-inline-link"
                  onClick={() => setIsSkillsModalOpen(true)}
                >
                  {i18n.language === 'fr' ? 'Ajouter des compétences.' : 'Add skills.'}
                </button>{' '}
                {i18n.language === 'fr'
                  ? 'Listez vos métiers pour apparaître dans les recherches des clients.'
                  : 'List your trade skills to be recommended to clients.'}
              </p>
            </div>
          ) : (
            <div className="upwork-tags-container">
              {skills.map((skill) => (
                <span key={skill} className="upwork-pill-tag">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* ── 7. CERTIFICATIONS SECTION ── */}
        <section className="upwork-panel-section">
          <div className="upwork-section-header-row">
            <div>
              <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Certifications' : 'Certifications'}</h3>
              <span className="upwork-section-caption">{certificates.length} {i18n.language === 'fr' ? 'attestations' : 'credentials'}</span>
            </div>
            <button
              className="upwork-action-circle"
              onClick={() => setIsAddingCert(true)}
              title="Add certification"
            >
              <PlusIcon />
            </button>
          </div>

          {certificates.length === 0 ? (
            <div className="upwork-illustration-state">
              {/* Upwork Trophy Graphic */}
              <div className="upwork-trophy-wrapper">
                <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
                  <path d="M18 14H46V28C46 35.73 39.73 42 32 42C24.27 42 18 35.73 18 28V14Z" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
                  <path d="M18 18H10C8.9 18 8 18.9 8 20V24C8 28.4 11.6 32 16 32H18" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
                  <path d="M46 18H54C55.1 18 56 18.9 56 20V24C56 28.4 52.4 32 48 32H46" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
                  <path d="M32 42V50" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
                  <path d="M22 54H42" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>

              <p className="upwork-illustration-copy">
                {i18n.language === 'fr'
                  ? 'Ajouter des certifications prouve vos compétences et augmente vos réservations (+10%).'
                  : 'Listing your certifications can help prove your specific knowledge or abilities. (+10%)'}
              </p>
              <button
                className="upwork-inline-link mt-1"
                onClick={() => setIsAddingCert(true)}
              >
                {i18n.language === 'fr' ? 'Ajouter une certification' : 'Add certification'}
              </button>
            </div>
          ) : (
            <div className="upwork-items-list">
              {certificates.map((cert, i) => (
                <div key={i} className="upwork-item-row">
                  <div className="flex-1 min-w-0">
                    <h4 className="upwork-item-name">{cert.title}</h4>
                    <p className="upwork-item-meta">{cert.issuer} • {cert.year}</p>
                    {cert.imageUrl && (
                      <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer" className="upwork-item-link">
                        View credential
                      </a>
                    )}
                  </div>
                  <button
                    className="upwork-item-remove-btn"
                    onClick={() => handleDeleteCertificate(i)}
                    title="Delete"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 8. EMPLOYMENT HISTORY SECTION ── */}
        <section className="upwork-panel-section">
          <div className="upwork-section-header-row">
            <div>
              <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Expérience professionnelle' : 'Employment History'}</h3>
              <span className="upwork-section-caption">{employmentHistory.length} {i18n.language === 'fr' ? 'postes enregistrés' : 'roles recorded'}</span>
            </div>
            <button
              className="upwork-action-circle"
              onClick={() => setIsAddingEmployment(true)}
              title="Add employment"
            >
              <PlusIcon />
            </button>
          </div>

          {employmentHistory.length === 0 ? (
            <div className="upwork-illustration-state py-3">
              <p className="upwork-illustration-copy">
                <button
                  className="upwork-inline-link"
                  onClick={() => setIsAddingEmployment(true)}
                >
                  {i18n.language === 'fr' ? 'Ajouter vos expériences passées.' : 'Add your past work.'}
                </button>{' '}
                {i18n.language === 'fr'
                  ? 'Décrivez les chantiers, entreprises ou postes que vous avez occupés.'
                  : 'Describe your previous jobs, companies, or freelance trade experience.'}
              </p>
            </div>
          ) : (
            <div className="upwork-items-list">
              {employmentHistory.map((item, i) => (
                <div key={i} className="upwork-item-row">
                  <div className="flex-1 min-w-0">
                    <h4 className="upwork-item-name">{item.title}</h4>
                    <p className="upwork-item-meta">{item.company} | {item.period}</p>
                    {item.description && <p className="upwork-item-desc">{item.description}</p>}
                  </div>
                  <button
                    className="upwork-item-remove-btn"
                    onClick={() => handleDeleteEmployment(i)}
                    title="Delete"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 9. AVAILABILITY & VERIFICATIONS ── */}
        <section className="upwork-panel-section">
          <div className="upwork-setting-item">
            <div>
              <h4 className="upwork-setting-label">{i18n.language === 'fr' ? 'Badge de disponibilité' : 'Availability badge'}</h4>
              <span className="upwork-setting-val">
                {isProfileAvailable ? (i18n.language === 'fr' ? 'Activé' : 'On') : (i18n.language === 'fr' ? 'Désactivé' : 'Off')}
              </span>
            </div>
            <button
              className="upwork-action-circle"
              onClick={async () => {
                const next = !isProfileAvailable;
                setIsProfileAvailable(next);
                updateUser({
                  isOnline: next,
                  providerProfile: { ...user?.providerProfile, isAvailable: next }
                });
                try {
                  await api.put('/providers/status', { isAvailable: next, isOnline: next });
                  await refreshUser();
                } catch (e) {
                  setIsProfileAvailable(!next);
                }
              }}
              title="Toggle availability"
            >
              <EditIcon />
            </button>
          </div>

          <div className="upwork-setting-item mt-3 pt-3 border-t border-slate-100">
            <div>
              <h4 className="upwork-setting-label">{i18n.language === 'fr' ? 'Vérification d\'identité' : 'ID Verification'}</h4>
              <span className="upwork-setting-val">
                {user?.providerProfile?.verification === 'VERIFIED'
                  ? (i18n.language === 'fr' ? 'Vérifié' : 'Verified')
                  : (i18n.language === 'fr' ? 'Non vérifié' : 'Not verified')}
              </span>
            </div>
            <button
              className="upwork-action-circle"
              onClick={() => setActiveTab?.('Verification')}
              title="Verification"
            >
              <EditIcon />
            </button>
          </div>
        </section>

        {/* ── 10. REVIEWS ── */}
        <section className="upwork-panel-section border-b-0">
          <div className="upwork-section-header-row">
            <div>
              <h3 className="upwork-section-heading">{i18n.language === 'fr' ? 'Avis clients' : 'Client Reviews'}</h3>
              <span className="upwork-section-caption">{reviews.length} {i18n.language === 'fr' ? 'évaluations' : 'reviews'}</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="upwork-illustration-state py-3">
              <p className="upwork-illustration-copy">
                {i18n.language === 'fr'
                  ? 'Pas encore d\'avis. Réalisez des prestations pour recevoir vos premières évaluations 5 étoiles.'
                  : 'No reviews yet. Complete your first client jobs on Fixam to collect 5-star ratings.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r: any) => (
                <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 text-sm">{r.reviewer?.fullName || r.serviceName || 'Client'}</span>
                    <span className="text-amber-500 text-xs font-bold">
                      {'★'.repeat(Math.round(r.rating || 5))}
                    </span>
                  </div>
                  {r.comment && <p className="text-xs text-slate-600 mb-1">{r.comment}</p>}
                  <span className="text-[11px] text-slate-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>


      {/* ══════════════════════════════════════════════
          MODALS
         ══════════════════════════════════════════════ */}

      {/* 1. DEDICATED SERVICE AREA (QUARTERS) MODAL */}
      {isServiceAreaModalOpen && (
        <div className="upwork-modal-backdrop">
          <div className="upwork-modal-sheet animate-scale-in">
            <div className="upwork-sheet-header">
              <h3>{i18n.language === 'fr' ? 'Zone d\'intervention (Quartiers)' : 'Service Area Quarters'}</h3>
              <button className="upwork-sheet-close-btn" onClick={() => setIsServiceAreaModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-xs text-slate-500">
                {i18n.language === 'fr'
                  ? 'Sélectionnez vos quartiers d\'intervention. Lorsqu\'un client à proximité poste une tâche, vous êtes classé #1.'
                  : 'Choose the quarters you service. Handymen in the client\'s exact quarter rank #1 in search.'}
              </p>

              {/* City Selection Tabs */}
              <div className="upwork-city-tabs">
                {CAMEROON_CITIES.map((c) => (
                  <button
                    key={c.id}
                    className={`upwork-city-tab ${quarterCity === c.id ? 'active' : ''}`}
                    onClick={() => {
                      setQuarterCity(c.id as any);
                      setQuarterSearch('');
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="upwork-btn-small-action"
                  onClick={handleSelectAllInCity}
                >
                  {i18n.language === 'fr' ? `Tout sélectionner (${quarterCity})` : `Select All in ${quarterCity}`}
                </button>
                <button
                  type="button"
                  className="upwork-btn-small-neutral"
                  onClick={handleClearAllQuarters}
                >
                  {i18n.language === 'fr' ? 'Tout effacer' : 'Clear All'}
                </button>
              </div>

              {/* Live Search Input */}
              <div className="relative">
                <input
                  type="text"
                  className="upwork-form-input"
                  placeholder={i18n.language === 'fr' ? `Rechercher un quartier à ${quarterCity}... (ex: Kotto)` : `Search quarter in ${quarterCity}... (e.g. Kotto)`}
                  value={quarterSearch}
                  onChange={(e) => setQuarterSearch(e.target.value)}
                />
                {matchingQuarters.length > 0 && (
                  <div className="upwork-popover-menu">
                    {matchingQuarters.map((q) => (
                      <button
                        key={`${q.city}-${q.name}`}
                        type="button"
                        className="upwork-popover-item"
                        onClick={() => {
                          handleToggleQuarter(q.name);
                          setQuarterSearch('');
                        }}
                      >
                        <span className="font-bold">{q.name}</span>
                        <span className="text-xs text-slate-400">({q.zone})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Chips */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  {i18n.language === 'fr' ? `Quartiers sélectionnés (${selectedQuarters.length}) :` : `Selected Quarters (${selectedQuarters.length}):`}
                </span>
                <div className="upwork-selected-tags-box">
                  {selectedQuarters.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">
                      {i18n.language === 'fr' ? 'Aucun quartier sélectionné pour l\'instant.' : 'No quarters selected yet.'}
                    </span>
                  ) : (
                    selectedQuarters.map((q) => (
                      <span key={q} className="upwork-quarter-tag">
                        {q}
                        <button
                          type="button"
                          className="upwork-tag-close-btn"
                          onClick={() => handleToggleQuarter(q)}
                        >
                          <CloseIcon />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Popular Quarters in Current City */}
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-2">
                  {i18n.language === 'fr' ? `Quartiers fréquents à ${quarterCity} :` : `Common quarters in ${quarterCity}:`}
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {(CAMEROON_QUARTERS[quarterCity] || []).slice(0, 24).map((q) => {
                    const isChecked = selectedQuarters.includes(q.name);
                    return (
                      <button
                        key={q.name}
                        type="button"
                        className={`upwork-quarter-chip-btn ${isChecked ? 'selected' : ''}`}
                        onClick={() => handleToggleQuarter(q.name)}
                      >
                        {isChecked ? '✓ ' : '+ '}
                        {q.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="upwork-sheet-footer">
              <button
                type="button"
                className="upwork-btn-sheet-cancel"
                onClick={() => setIsServiceAreaModalOpen(false)}
                disabled={isSavingQuarters}
              >
                Cancel
              </button>
              <button
                type="button"
                className="upwork-btn-sheet-save"
                onClick={handleSaveServiceArea}
                disabled={isSavingQuarters}
              >
                {isSavingQuarters ? 'Saving...' : 'Save Quarters'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SKILLS EDIT MODAL */}
      {isSkillsModalOpen && (
        <div className="upwork-modal-backdrop">
          <div className="upwork-modal-sheet animate-scale-in">
            <div className="upwork-sheet-header">
              <h3>{i18n.language === 'fr' ? 'Modifier les compétences' : 'Edit Skills'}</h3>
              <button className="upwork-sheet-close-btn" onClick={() => setIsSkillsModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-xs text-slate-500">
                {i18n.language === 'fr'
                  ? 'Tapez un métier ou une compétence pour l\'ajouter à votre profil.'
                  : 'Type a skill or trade to add to your public profile.'}
              </p>

              <div className="relative">
                <input
                  ref={skillInputRef}
                  type="text"
                  className="upwork-form-input"
                  placeholder="e.g. Plumbing, Electrician, Tiling..."
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
                  }}
                />
                {showSuggestions && skillSuggestions.length > 0 && (
                  <div className="upwork-popover-menu">
                    {skillSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="upwork-popover-item font-semibold"
                        onClick={() => handleAddSkill(sug)}
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="upwork-selected-tags-box">
                {skills.map((s) => (
                  <span key={s} className="upwork-pill-tag flex items-center gap-1.5">
                    {s}
                    <button
                      type="button"
                      className="text-slate-400 hover:text-red-500 font-bold ml-1"
                      onClick={() => handleRemoveSkill(s)}
                    >
                      <CloseIcon />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="upwork-sheet-footer">
              <button
                type="button"
                className="upwork-btn-sheet-cancel"
                onClick={() => setIsSkillsModalOpen(false)}
                disabled={isSavingSkills}
              >
                Cancel
              </button>
              <button
                type="button"
                className="upwork-btn-sheet-save"
                onClick={handleSaveSkills}
                disabled={isSavingSkills}
              >
                {isSavingSkills ? 'Saving...' : 'Save Skills'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. QUICK EDIT MODAL (Title, Rate, Bio) */}
      {quickEditSection && (
        <div className="upwork-modal-backdrop">
          <div className="upwork-modal-sheet animate-scale-in">
            <div className="upwork-sheet-header">
              <h3>
                {quickEditSection === 'title' && (i18n.language === 'fr' ? 'Modifier le titre du profil' : 'Edit Professional Title')}
                {quickEditSection === 'rate' && (i18n.language === 'fr' ? 'Modifier le tarif horaire' : 'Edit Hourly Rate')}
                {quickEditSection === 'bio' && (i18n.language === 'fr' ? 'Modifier la biographie' : 'Edit Overview / Bio')}
              </h3>
              <button className="upwork-sheet-close-btn" onClick={() => setQuickEditSection(null)}>
                <CloseIcon />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {quickEditSection === 'title' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Professional Title</label>
                  <input
                    type="text"
                    className="upwork-form-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Master Plumber & Piping Specialist"
                  />
                </div>
              )}
              {quickEditSection === 'rate' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Hourly Rate (XAF/hr)</label>
                  <input
                    type="number"
                    className="upwork-form-input"
                    value={editRate}
                    onChange={(e) => setEditRate(e.target.value)}
                    placeholder="3500"
                  />
                </div>
              )}
              {quickEditSection === 'bio' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Professional Bio</label>
                  <textarea
                    rows={6}
                    className="upwork-form-input"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Describe your background, specialties, and customer guarantees..."
                  />
                </div>
              )}
            </div>
            <div className="upwork-sheet-footer">
              <button
                type="button"
                className="upwork-btn-sheet-cancel"
                onClick={() => setQuickEditSection(null)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="upwork-btn-sheet-save"
                onClick={() => handleQuickSave(quickEditSection)}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD PORTFOLIO MODAL */}
      {isAddingPortfolio && (
        <div className="upwork-modal-backdrop">
          <div className="upwork-modal-sheet animate-scale-in">
            <div className="upwork-sheet-header">
              <h3>{i18n.language === 'fr' ? 'Ajouter un projet' : 'Add Portfolio Project'}</h3>
              <button className="upwork-sheet-close-btn" onClick={() => setIsAddingPortfolio(false)}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleAddPortfolio} className="p-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  className="upwork-form-input"
                  placeholder="e.g. Modern Bathroom Tiling & Piping"
                  value={portfolioTitle}
                  onChange={(e) => setPortfolioTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Description</label>
                <textarea
                  rows={3}
                  className="upwork-form-input"
                  placeholder="Describe what you repaired or built..."
                  value={portfolioDesc}
                  onChange={(e) => setPortfolioDesc(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">External Link (optional)</label>
                <input
                  type="url"
                  className="upwork-form-input"
                  placeholder="https://..."
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Media (Image)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => { if (e.target.files) setPortfolioFile(e.target.files[0]); }}
                />
              </div>
              <div className="upwork-sheet-footer">
                <button
                  type="button"
                  className="upwork-btn-sheet-cancel"
                  onClick={() => setIsAddingPortfolio(false)}
                  disabled={isSubmittingPortfolio}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="upwork-btn-sheet-save"
                  disabled={isSubmittingPortfolio}
                >
                  {isSubmittingPortfolio ? 'Saving...' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ADD CERTIFICATE MODAL */}
      {isAddingCert && (
        <div className="upwork-modal-backdrop">
          <div className="upwork-modal-sheet animate-scale-in">
            <div className="upwork-sheet-header">
              <h3>{i18n.language === 'fr' ? 'Ajouter une certification' : 'Add Certification'}</h3>
              <button className="upwork-sheet-close-btn" onClick={() => setIsAddingCert(false)}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleAddCertificate} className="p-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Certificate Title *</label>
                <input
                  type="text"
                  required
                  className="upwork-form-input"
                  placeholder="e.g. Vocational Electrical License"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Issuing Institution *</label>
                <input
                  type="text"
                  required
                  className="upwork-form-input"
                  placeholder="e.g. National Technical College"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Year Issued *</label>
                <input
                  type="number"
                  required
                  min="1960"
                  max={new Date().getFullYear()}
                  className="upwork-form-input"
                  value={certYear}
                  onChange={(e) => setCertYear(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Document Upload (optional)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => { if (e.target.files) setCertFile(e.target.files[0]); }}
                />
              </div>
              <div className="upwork-sheet-footer">
                <button
                  type="button"
                  className="upwork-btn-sheet-cancel"
                  onClick={() => setIsAddingCert(false)}
                  disabled={isSubmittingCert}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="upwork-btn-sheet-save"
                  disabled={isSubmittingCert}
                >
                  {isSubmittingCert ? 'Uploading...' : 'Add Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ADD EMPLOYMENT MODAL */}
      {isAddingEmployment && (
        <div className="upwork-modal-backdrop">
          <div className="upwork-modal-sheet animate-scale-in">
            <div className="upwork-sheet-header">
              <h3>{i18n.language === 'fr' ? 'Ajouter une expérience' : 'Add Employment History'}</h3>
              <button className="upwork-sheet-close-btn" onClick={() => setIsAddingEmployment(false)}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleAddEmployment} className="p-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role / Trade Title *</label>
                <input
                  type="text"
                  required
                  className="upwork-form-input"
                  placeholder="e.g. Senior Mason / Construction Supervisor"
                  value={empTitle}
                  onChange={(e) => setEmpTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company / Contractor *</label>
                <input
                  type="text"
                  required
                  className="upwork-form-input"
                  placeholder="e.g. BTP Cameroun or Freelance"
                  value={empCompany}
                  onChange={(e) => setEmpCompany(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Period (Years / Duration)</label>
                <input
                  type="text"
                  className="upwork-form-input"
                  placeholder="e.g. 2021 - 2024"
                  value={empPeriod}
                  onChange={(e) => setEmpPeriod(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description (optional)</label>
                <textarea
                  rows={3}
                  className="upwork-form-input"
                  placeholder="Responsibilities, projects delivered..."
                  value={empDesc}
                  onChange={(e) => setEmpDesc(e.target.value)}
                />
              </div>
              <div className="upwork-sheet-footer">
                <button
                  type="button"
                  className="upwork-btn-sheet-cancel"
                  onClick={() => setIsAddingEmployment(false)}
                  disabled={isSubmittingEmployment}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="upwork-btn-sheet-save"
                  disabled={isSubmittingEmployment}
                >
                  {isSubmittingEmployment ? 'Saving...' : 'Add Employment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. PROJECT PREVIEW MODAL */}
      {selectedModalProject && (
        <div className="upwork-modal-backdrop">
          <div className="upwork-modal-sheet animate-scale-in max-w-xl">
            <div className="upwork-sheet-header">
              <h3>{selectedModalProject.title}</h3>
              <button className="upwork-sheet-close-btn" onClick={() => setSelectedModalProject(null)}>
                <CloseIcon />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {selectedModalProject.imageUrl && (
                <img
                  src={getMediaUrl(selectedModalProject.imageUrl)}
                  alt={selectedModalProject.title}
                  className="w-full h-56 object-cover rounded-xl"
                />
              )}
              {selectedModalProject.description && (
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedModalProject.description}
                </p>
              )}
              {selectedModalProject.link && (
                <a
                  href={selectedModalProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-600 font-bold block"
                >
                  🔗 View External Link →
                </a>
              )}
            </div>
            <div className="upwork-sheet-footer">
              <button
                type="button"
                className="upwork-btn-sheet-save"
                onClick={() => setSelectedModalProject(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
