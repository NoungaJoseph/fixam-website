import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon, getMediaUrl, DEFAULT_AVATAR } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './ProviderDashboard.css';

interface ProviderDashboardProps {
  setActiveTab: (tab: string) => void;
  onRoleChange?: (role: 'client' | 'pro') => void;
}

type JobLead = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  serviceCategory?: string;
  location?: string;
  budget?: number;
  budgetMin?: number;
  budgetMax?: number;
  createdAt?: string;
  isRemote?: boolean;
  country?: string;
  importantDetails?: string;
  whatNeedsDone?: string;
  taskScope?: string;
  preferences?: string[];
  priority?: string;
  client?: { fullName?: string; avatar?: string };
  clientVerified?: boolean;
  clientSpendingTier?: string;
  applications?: any[];
  assignments?: any[];
};

const formatBudget = (job: JobLead) => {
  const min = Number(job.budgetMin || 0);
  const max = Number(job.budgetMax || job.budget || 0);
  if (min && max && min !== max) return `${min.toLocaleString()} – ${max.toLocaleString()} XAF`;
  if (max) return `${max.toLocaleString()} XAF`;
  return 'Negotiable';
};

// Module-level persistent cache across tab navigation remounts
let cachedJobs: JobLead[] = [];

export default function ProviderDashboard({ setActiveTab, onRoleChange }: ProviderDashboardProps) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobLead[]>(cachedJobs);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(cachedJobs.length === 0);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobLead | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [dislikedJobIds, setDislikedJobIds] = useState<string[]>([]);

  // Proposal modal states
  const [proposalModalJob, setProposalModalJob] = useState<JobLead | null>(null);
  const [boostCoins, setBoostCoins] = useState<number>(0);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState<boolean>(false);

  const [activeFeedTab, setActiveFeedTab] = useState<'best_matches' | 'most_recent' | 'remote_only' | 'saved_jobs'>('best_matches');
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [isAvailable, setIsAvailable] = useState(user?.providerProfile?.isAvailable ?? true);

  const completionPercentage = useMemo(() => {
    let score = 0;
    if (user?.firstName || user?.fullName) score += 15;
    if (user?.avatar || user?.image) score += 15;
    if (user?.phone) score += 15;
    if (user?.location) score += 15;
    if (user?.providerProfile?.bio) score += 15;
    if (user?.providerProfile?.skills && user.providerProfile.skills.length > 0) score += 15;
    if ((user as any)?.verificationStatus === 'VERIFIED' || user?.providerProfile?.verificationStatus === 'VERIFIED') score += 10;
    return Math.min(100, score || 30);
  }, [user]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    api.get('/wallet/balance').then(res => {
      const bal = res.data?.data?.balance ?? res.data?.balance ?? 0;
      setWalletBalance(bal);
    }).catch(() => setWalletBalance(0));
  }, []);

  // Filter modal state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterModalRef = useRef<HTMLDivElement>(null);

  // Pending filter values inside modal
  const [pendingJobType, setPendingJobType] = useState<'all' | 'remote' | 'physical'>('all');
  const [pendingBudgetMin, setPendingBudgetMin] = useState('');
  const [pendingBudgetMax, setPendingBudgetMax] = useState('');
  const [pendingSort, setPendingSort] = useState<'newest' | 'oldest' | 'price_high' | 'price_low'>('newest');
  const [pendingVerifiedOnly, setPendingVerifiedOnly] = useState(false);

  // Applied filter values (triggers API request)
  const [appliedJobType, setAppliedJobType] = useState<'all' | 'remote' | 'physical'>('all');
  const [appliedBudgetMin, setAppliedBudgetMin] = useState('');
  const [appliedBudgetMax, setAppliedBudgetMax] = useState('');
  const [appliedSort, setAppliedSort] = useState<'newest' | 'oldest' | 'price_high' | 'price_low'>('newest');
  const [appliedVerifiedOnly, setAppliedVerifiedOnly] = useState(false);

  const hasActiveFilters = appliedJobType !== 'all' || appliedBudgetMin !== '' || appliedBudgetMax !== '' || appliedSort !== 'newest' || appliedVerifiedOnly;

  // Reset page number on filter/tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFeedTab, search, appliedJobType, appliedBudgetMin, appliedBudgetMax, appliedSort]);

  // Close filter modal on outside backdrop click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (filterModalRef.current && !filterModalRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isFilterOpen]);

  // Fetch jobs (silent background revalidation with module cache)
  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (cachedJobs.length === 0 && jobs.length === 0) {
        setIsLoading(true);
      }
      setError('');
      try {
        const params: Record<string, string> = {
          sortBy: appliedSort,
          limit: '50',
        };
        if (search.trim()) params.search = search.trim();
        if (appliedJobType !== 'all') params.jobType = appliedJobType;
        if (appliedBudgetMin) params.budgetMin = appliedBudgetMin;
        if (appliedBudgetMax) params.budgetMax = appliedBudgetMax;

        const response = await api.get('/jobs/available', { params });
        let payload = response.data?.data || response.data?.jobs || [];
        if (Array.isArray(payload)) {
          if (appliedVerifiedOnly) {
            payload = payload.filter((j: JobLead) => j.clientVerified);
          }
          cachedJobs = payload;
          setJobs(payload);
        } else {
          setJobs([]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load available jobs right now.');
      } finally {
        setIsLoading(false);
      }
    }, search || hasActiveFilters ? 350 : 0);
    return () => window.clearTimeout(timer);
  }, [search, appliedJobType, appliedBudgetMin, appliedBudgetMax, appliedSort, appliedVerifiedOnly]);

  const handleApplyFilters = () => {
    setAppliedJobType(pendingJobType);
    setAppliedBudgetMin(pendingBudgetMin);
    setAppliedBudgetMax(pendingBudgetMax);
    setAppliedSort(pendingSort);
    setAppliedVerifiedOnly(pendingVerifiedOnly);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setPendingJobType('all');
    setPendingBudgetMin('');
    setPendingBudgetMax('');
    setPendingSort('newest');
    setPendingVerifiedOnly(false);
    setAppliedJobType('all');
    setAppliedBudgetMin('');
    setAppliedBudgetMax('');
    setAppliedSort('newest');
    setAppliedVerifiedOnly(false);
    setIsFilterOpen(false);
  };

  const isVerified = (user as any)?.verificationStatus === 'VERIFIED' || user?.providerProfile?.verification === 'VERIFIED' || user?.providerProfile?.verificationStatus === 'VERIFIED';
  const totalProposalCoins = 1 + boostCoins;
  const currentWalletBalance = walletBalance !== null ? walletBalance : 0;
  const hasEnoughCoins = currentWalletBalance >= totalProposalCoins;

  const openProposalModal = (job: JobLead) => {
    setSelectedJob(null);
    setProposalModalJob(job);
    setBoostCoins(0);
    setCoverLetter('');
  };

  const topBidder = useMemo(() => {
    if (!proposalModalJob || !proposalModalJob.assignments || !Array.isArray(proposalModalJob.assignments) || proposalModalJob.assignments.length === 0) {
      return null;
    }
    const boosted = proposalModalJob.assignments
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
  }, [proposalModalJob]);

  const handleSubmitProposalForm = async () => {
    if (!proposalModalJob) return;

    if (!isVerified) {
      alert('Verification Required: Please verify your identity before applying to jobs.');
      setProposalModalJob(null);
      setSelectedJob(null);
      setActiveTab('My Profile');
      return;
    }

    if (!isAvailable) {
      alert('Availability Status Off: Please turn on your Availability Badge before submitting proposals.');
      return;
    }

    if (!hasEnoughCoins) {
      alert(`Insufficient Fixam Coins: You need at least ${totalProposalCoins} Fixam Coin${totalProposalCoins > 1 ? 's' : ''} to submit this proposal.`);
      setProposalModalJob(null);
      setSelectedJob(null);
      setActiveTab('Wallet');
      return;
    }

    setIsSubmittingProposal(true);
    try {
      const response = await api.post(`/jobs/${proposalModalJob.id}/apply`, {
        boostCoins,
        coverLetter: coverLetter.trim() || undefined,
      });

      // Update local wallet balance
      setWalletBalance((prev) => Math.max(0, (prev || 0) - totalProposalCoins));

      // Remove job from feed list
      setJobs((current) => current.filter((item) => item.id !== proposalModalJob.id));

      const successMsg = response.data?.message || (boostCoins > 0 ? `🚀 Boosted Proposal Sent Successfully! (${boostCoins} boost coins used)` : '🎉 Proposal Sent Successfully!');
      alert(successMsg);

      setProposalModalJob(null);
      setSelectedJob(null);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to submit proposal.';
      alert(errMsg);
      const errCode = err.response?.data?.code;
      if (errCode === 'VERIFICATION_REQUIRED' || err.response?.data?.requiresVerification) {
        setProposalModalJob(null);
        setSelectedJob(null);
        setActiveTab('My Profile');
      } else if (errCode === 'INSUFFICIENT_COINS') {
        setProposalModalJob(null);
        setSelectedJob(null);
        setActiveTab('Wallet');
      }
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  // Filtered jobs according to active feed tab
  const displayedJobs = useMemo(() => {
    let list = jobs.filter(j => !dislikedJobIds.includes(j.id));
    if (activeFeedTab === 'remote_only') {
      list = list.filter(j => j.isRemote);
    } else if (activeFeedTab === 'saved_jobs') {
      list = list.filter(j => savedJobIds.includes(j.id));
    } else if (activeFeedTab === 'most_recent') {
      list = [...list].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return list;
  }, [jobs, activeFeedTab, savedJobIds, dislikedJobIds]);

  // Paginated job subset
  const totalPages = Math.ceil(displayedJobs.length / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayedJobs.slice(start, start + itemsPerPage);
  }, [displayedJobs, currentPage, itemsPerPage]);

  return (
    <div className="upwork-dashboard-container animate-fade-in">
      {/* 2-COLUMN DASHBOARD GRID */}
      <div className="upwork-dashboard-grid">

        {/* LEFT MAIN WORKSPACE COLUMN (~75%) */}
        <div className="upwork-main-column">

          {/* DARK HERO BANNER */}
          <div className="upwork-hero-banner">
            <div className="upwork-hero-content">
              <span className="upwork-hero-tag">Direct Contracts</span>
              <h2>Maximize your earnings with a low 5% service fee when you bring new clients to Fixam.</h2>
              <button className="btn-hero-white" onClick={() => setActiveTab('Post a Project')}>
                Publish Project
              </button>
            </div>
            <div className="upwork-hero-graphic">
              <svg width="150" height="140" viewBox="0 0 200 180" fill="none">
                <rect x="50" y="20" width="100" height="140" rx="12" fill="#2A2A2A" stroke="#444" strokeWidth="3" />
                <rect x="65" y="40" width="70" height="75" rx="6" fill="#FFFFFF" />
                <line x1="75" y1="55" x2="115" y2="55" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
                <line x1="75" y1="70" x2="125" y2="70" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                <line x1="75" y1="83" x2="105" y2="83" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                <circle cx="125" cy="98" r="7" fill="#F59E0B" />
                <path d="M25 90 C35 70, 45 80, 55 60" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* LIGHT MINT ALERT BANNER */}
          {isAlertVisible && (
            <div className="upwork-alert-banner">
              <div className="alert-text-group">
                <span className="alert-icon">🎓</span>
                <p>Explore professional career pathways & skill certifications on Fixam Career Hub to boost your earnings and win high-paying client contracts in Cameroon.</p>
              </div>
              <div className="alert-actions">
                <button 
                  className="alert-link-btn" 
                  onClick={() => {
                    const url = window.location.origin + '/career-pathways';
                    window.open(url, '_blank');
                  }}
                >
                  Explore Career Pathways
                </button>
                <button className="alert-close-btn" onClick={() => setIsAlertVisible(false)} title="Close alert">
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* SEARCH BAR */}
          <div className="upwork-search-row">
            <div className="upwork-search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                placeholder="Search for jobs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* JOBS YOU MIGHT LIKE SECTION */}
          <div className="upwork-jobs-section">
            <div className="jobs-section-header">
              <h2>Jobs you might like</h2>
            </div>

            {/* TAB LINKS & FILTER BUTTON ROW */}
            <div className="upwork-feed-tabs-row">
              <div className="feed-tab-links">
                <button
                  className={`feed-tab-btn ${activeFeedTab === 'best_matches' ? 'active' : ''}`}
                  onClick={() => setActiveFeedTab('best_matches')}
                >
                  Best matches
                </button>
                <button
                  className={`feed-tab-btn ${activeFeedTab === 'most_recent' ? 'active' : ''}`}
                  onClick={() => setActiveFeedTab('most_recent')}
                >
                  Most recent
                </button>
                <button
                  className={`feed-tab-btn ${activeFeedTab === 'remote_only' ? 'active' : ''}`}
                  onClick={() => setActiveFeedTab('remote_only')}
                >
                  Remote only
                </button>
                <button
                  className={`feed-tab-btn ${activeFeedTab === 'saved_jobs' ? 'active' : ''}`}
                  onClick={() => setActiveFeedTab('saved_jobs')}
                >
                  Saved jobs {savedJobIds.length > 0 && `(${savedJobIds.length})`}
                </button>
              </div>

              {/* GREEN OUTLINED FILTER BUTTON */}
              <button
                className={`btn-upwork-filter ${hasActiveFilters ? 'has-active' : ''}`}
                onClick={() => setIsFilterOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                Filters
                {hasActiveFilters && <span className="filter-badge-dot" />}
              </button>
            </div>

            <p className="feed-subtext">
              Browse jobs that match your experience to a client's hiring preferences. Ordered by most relevant.
            </p>

            {/* JOB FEED CARDS */}
            <div className="upwork-job-cards-list">
              {isLoading ? (
                <div className="feed-status-message">Loading jobs...</div>
              ) : error ? (
                <div className="feed-status-message error">{error}</div>
              ) : paginatedJobs.length === 0 ? (
                <div className="feed-empty-state">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p>No jobs found for the selected tab or filters.</p>
                  {hasActiveFilters && (
                    <button className="btn-upwork-secondary" style={{ width: 'auto', margin: '0.5rem auto' }} onClick={handleResetFilters}>
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                paginatedJobs.map((job) => {
                  const isSaved = savedJobIds.includes(job.id);
                  return (
                    <article
                      className="upwork-job-card"
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                    >
                      {/* Topbar badge & actions */}
                      <div className="upwork-card-topbar">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="meta-time-badge">
                            Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'recently'} • {job.applications?.length || 0} proposals
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                            💰 {formatBudget(job)}
                          </span>
                        </div>

                        <div className="card-quick-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="icon-action-btn"
                            title="Dislike / Hide job"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDislikedJobIds([...dislikedJobIds, job.id]);
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4.33v6.34A2.31 2.31 0 0 1 19.67 13H17" />
                            </svg>
                          </button>
                          <button
                            className={`icon-action-btn ${isSaved ? 'saved' : ''}`}
                            title={isSaved ? 'Unsave job' : 'Save job'}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isSaved) {
                                setSavedJobIds(savedJobIds.filter(id => id !== job.id));
                              } else {
                                setSavedJobIds([...savedJobIds, job.id]);
                              }
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={isSaved ? '#10B981' : 'none'} stroke={isSaved ? '#10B981' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Clickable Job Title */}
                      <h3
                        className="upwork-card-title"
                        onClick={() => setSelectedJob(job)}
                      >
                        {job.title}
                      </h3>

                      {/* Sub-meta details line */}
                      <div className="upwork-card-submeta">
                        <span>Budget: <strong>{formatBudget(job)}</strong></span>
                        <span className="dot">•</span>
                        <span>{job.priority ? `${job.priority.toUpperCase()} Priority` : 'Standard'}</span>
                        <span className="dot">•</span>
                        <span>Est. Time: Short-term task</span>
                      </div>

                      {/* Job Description Excerpt */}
                      <p className="upwork-card-description">
                        {job.description || 'We are seeking a qualified provider for this task...'}
                        <span className="more-link" onClick={() => setSelectedJob(job)}> more</span>
                      </p>

                      {/* Skill Pills */}
                      <div className="upwork-card-skills">
                        <span className="skill-pill active-category">{job.category || job.serviceCategory || 'General'}</span>
                        {job.isRemote && <span className="skill-pill">Remote</span>}
                        {job.preferences && job.preferences.length > 0 && (
                          job.preferences.map((pref, i) => <span key={i} className="skill-pill">{pref}</span>)
                        )}
                      </div>

                      {/* Client Verification Footer & Quick Apply Action */}
                      <div className="upwork-card-client-footer flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                          <span className="check-verified flex items-center gap-1 text-emerald-600 font-bold">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Verified Client
                          </span>
                          <span>📍 {job.country || job.location || 'Cameroon'}</span>
                        </div>

                        <button 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                          onClick={() => setSelectedJob(job)}
                        >
                          View & Submit Proposal
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* PAGINATION CONTROLS (1 2 3 4 ...) */}
            {totalPages > 1 && (
              <div className="upwork-pagination-container">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                >
                  ‹ Prev
                </button>

                <div className="pagination-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination-num ${currentPage === page ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 100, behavior: 'smooth' });
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                >
                  Next ›
                </button>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT SIDEBAR COLUMN (~25%) */}
        <aside className="upwork-sidebar-column">

          {/* PROFILE SUMMARY & SWITCH PROFILE CARD */}
          <div className="upwork-sidebar-card profile-card">
            <div className="user-profile-row">
              <img
                src={user?.avatar ? getMediaUrl(user.avatar) : DEFAULT_AVATAR}
                alt={user?.fullName || 'Provider'}
                className="user-avatar-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="user-name truncate">{user?.fullName || 'Nounga Joseph'}</h4>
                <p className="user-tagline text-teal-600 font-bold">Provider & Specialist</p>
              </div>
            </div>

            {onRoleChange && (
              <div className="profile-switch-box pt-2 border-t border-slate-100">
                <button
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-xs font-bold text-slate-700 hover:text-teal-800 transition cursor-pointer"
                  onClick={() => onRoleChange('client')}
                  title="Switch to Client View"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Switch to Client Profile
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}

            <div className="profile-completion-box pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <button className="complete-profile-link" onClick={() => setActiveTab('My Profile')}>
                  Complete your profile
                </button>
                <strong className="text-slate-700 font-extrabold">{completionPercentage}%</strong>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* PROMOTE WITH ADS CARD */}
          <div className="upwork-sidebar-card">
            <div className="sidebar-card-header">
              <h4>Promote with ads</h4>
              <span className="chevron">^</span>
            </div>
            <div className="promote-option-row flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <span className="label block font-semibold text-slate-800 text-xs">Availability badge</span>
                <span className={`val text-xs font-bold ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isAvailable ? 'Available Now ●' : 'Off'}
                </span>
              </div>
              <button
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer border-none outline-none ${isAvailable ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                onClick={async () => {
                  const nextState = !isAvailable;
                  setIsAvailable(nextState);
                  try {
                    await api.put('/providers/status', { isAvailable: nextState });
                  } catch (e) {
                    console.error('Failed to update availability status', e);
                  }
                }}
                title={isAvailable ? 'Turn off availability' : 'Turn on availability'}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
            <div className="promote-option-row flex items-center justify-between py-2">
              <div>
                <span className="label block font-semibold text-slate-800 text-xs">Boost your profile</span>
                <span className="val text-xs font-bold text-slate-400">
                  {user?.providerProfile?.boostExpiresAt && new Date(user.providerProfile.boostExpiresAt) > new Date()
                    ? 'Active 🚀'
                    : 'Off'}
                </span>
              </div>
              <button
                className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-lg transition border border-teal-200 cursor-pointer"
                onClick={() => setActiveTab('Boost Profile')}
                title="Boost your profile"
              >
                Boost 🚀
              </button>
            </div>
          </div>

          {/* COINS & WALLET CARD */}
          <div className="upwork-sidebar-card">
            <div className="sidebar-card-header">
              <h4>Coins: {walletBalance !== null ? walletBalance : 0} XAF</h4>
              <span className="chevron">^</span>
            </div>
            <button
              className="btn-buy-connects"
              onClick={() => setActiveTab('Wallet')}
            >
              Buy Coins
            </button>
          </div>

          {/* QUICK LINKS CARD */}
          <div className="upwork-sidebar-card quick-links-card">
            <button className="quick-link-item" onClick={() => setActiveTab('Post a Project')}>
              Post a Project ↗
            </button>
            <button className="quick-link-item" onClick={() => setActiveTab('My Stats')}>
              My Stats & Earnings ↗
            </button>
            <button className="quick-link-item" onClick={() => setActiveTab('Support')}>
              Help Center & Support ↗
            </button>
          </div>

        </aside>

      </div>

      {/* UPWORK CENTERED FILTER MODAL DIALOG */}
      {isFilterOpen && (
        <div className="upwork-filter-modal-backdrop animate-fade-in">
          <div className="upwork-filter-modal-card animate-scale-in" ref={filterModalRef}>

            <div className="modal-header">
              <h2>Filters</h2>
              <button className="modal-close-btn" onClick={() => setIsFilterOpen(false)}>✕</button>
            </div>
            <p className="modal-note">
              Filters will only apply to "Best matches", "Most recent" and "Local only" searches.
            </p>

            <div className="modal-body-scroll">

              {/* Local / Physical Checkbox */}
              <div className="filter-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={pendingJobType === 'physical'}
                    onChange={(e) => setPendingJobType(e.target.checked ? 'physical' : 'all')}
                  />
                  <span>Physical / On-Site jobs only</span>
                </label>
              </div>

              {/* Client Info Section */}
              <div className="filter-section-block">
                <div className="section-title-row">
                  <h4>Client Verification</h4>
                  <span>^</span>
                </div>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={pendingVerifiedOnly}
                    onChange={(e) => setPendingVerifiedOnly(e.target.checked)}
                  />
                  <span>Verified clients only</span>
                </label>
              </div>

              {/* Job Type */}
              <div className="filter-section-block">
                <div className="section-title-row">
                  <h4>Job Location Type</h4>
                  <span>^</span>
                </div>
                <div className="radio-group-column">
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="jobTypeRadio"
                      checked={pendingJobType === 'all'}
                      onChange={() => setPendingJobType('all')}
                    />
                    <span>All Jobs (Remote & On-Site)</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="jobTypeRadio"
                      checked={pendingJobType === 'remote'}
                      onChange={() => setPendingJobType('remote')}
                    />
                    <span>Remote Jobs Only</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="jobTypeRadio"
                      checked={pendingJobType === 'physical'}
                      onChange={() => setPendingJobType('physical')}
                    />
                    <span>On-Site Jobs Only</span>
                  </label>
                </div>
              </div>

              {/* Budget Range */}
              <div className="filter-section-block">
                <div className="section-title-row">
                  <h4>Budget Range (XAF)</h4>
                  <span>^</span>
                </div>
                <div className="filter-budget-row">
                  <input
                    type="number"
                    placeholder="Min budget"
                    value={pendingBudgetMin}
                    onChange={(e) => setPendingBudgetMin(e.target.value)}
                    className="modal-input"
                  />
                  <span>–</span>
                  <input
                    type="number"
                    placeholder="Max budget"
                    value={pendingBudgetMax}
                    onChange={(e) => setPendingBudgetMax(e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="filter-section-block">
                <div className="section-title-row">
                  <h4>Sort Order</h4>
                  <span>^</span>
                </div>
                <select
                  className="modal-select"
                  value={pendingSort}
                  onChange={(e) => setPendingSort(e.target.value as any)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_high">Highest Budget</option>
                  <option value="price_low">Lowest Budget</option>
                </select>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="modal-footer-actions">
              <button className="btn-modal-clear" onClick={handleResetFilters}>
                Clear
              </button>
              <button className="btn-modal-apply-green" onClick={handleApplyFilters}>
                Apply
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Upwork-style Slide-over Job Detail Modal */}
      {selectedJob && (
        <div className="upwork-modal-overlay animate-fade-in" onClick={() => setSelectedJob(null)}>
          <div className="upwork-modal-drawer animate-slide-left" onClick={(e) => e.stopPropagation()}>

            {/* Top Navigation Row */}
            <div className="upwork-drawer-topbar">
              <button className="btn-back-arrow" onClick={() => setSelectedJob(null)} title="Back / Close">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            </div>

            {/* Modal Body Container with 2 Columns */}
            <div className="upwork-drawer-body">
              {/* LEFT MAIN COLUMN */}
              <div className="upwork-left-column">
                <h1 className="upwork-job-title">{selectedJob.title}</h1>
                <div className="upwork-meta-line">
                  <span>Posted {selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString() : 'recently'}</span>
                  <span className="dot">•</span>
                  <span>📍 {selectedJob.location || (selectedJob.isRemote ? 'Worldwide (Remote)' : 'On-Site')}</span>
                </div>

                <div className="upwork-divider" />

                {/* Summary */}
                <div className="upwork-section">
                  <h3>Summary</h3>
                  <p className="upwork-text-block">{selectedJob.description || 'Service task requested by client on Fixam.'}</p>
                </div>

                {/* Deliverables / Scope */}
                {(selectedJob.whatNeedsDone || selectedJob.taskScope) && (
                  <div className="upwork-section">
                    <h3>Deliverables</h3>
                    <div className="upwork-deliverables-list">
                      {selectedJob.whatNeedsDone && <p>{selectedJob.whatNeedsDone}</p>}
                      {selectedJob.taskScope && <p>{selectedJob.taskScope}</p>}
                    </div>
                  </div>
                )}

                {/* Special Requirements */}
                {selectedJob.importantDetails && (
                  <div className="upwork-section">
                    <h3>Special Requirements</h3>
                    <p className="upwork-text-block highlight">{selectedJob.importantDetails}</p>
                  </div>
                )}

                <div className="upwork-divider" />

                {/* Price & Level Metrics Grid */}
                <div className="upwork-metrics-row">
                  <div className="upwork-metric-box">
                    <span className="metric-icon">🏷️</span>
                    <div>
                      <strong>{formatBudget(selectedJob)}</strong>
                      <small>{selectedJob.budgetMin || selectedJob.budgetMax ? 'Fixed-price' : 'Budget'}</small>
                    </div>
                  </div>

                  <div className="upwork-metric-box">
                    <span className="metric-icon">⚙️</span>
                    <div>
                      <strong>{selectedJob.priority ? `${selectedJob.priority.toUpperCase()} Level` : 'Standard level'}</strong>
                      <small>Client requested quality service execution</small>
                    </div>
                  </div>
                </div>

                <div className="upwork-divider" />

                {/* Skills and Expertise */}
                <div className="upwork-section">
                  <h3>Skills and Expertise</h3>
                  <span className="sub-label">Required Category & Skills</span>
                  <div className="upwork-skills-pills">
                    <span className="skill-badge">{selectedJob.category || selectedJob.serviceCategory || 'General'}</span>
                    {selectedJob.isRemote && <span className="skill-badge">Virtual Service</span>}
                    {selectedJob.preferences && selectedJob.preferences.length > 0 && (
                      selectedJob.preferences.map((p, idx) => <span key={idx} className="skill-badge">{p}</span>)
                    )}
                  </div>
                </div>

                <div className="upwork-divider" />

                {/* Activity on this job */}
                <div className="upwork-section">
                  <h3>Activity on this job</h3>
                  <div className="upwork-activity-list">
                    <div>Proposals received: <span className="green-text font-bold">{selectedJob.applications?.length || 0}</span></div>
                    <div>Assigned / Interviewing: <span className="font-bold">{selectedJob.assignments?.length || 0}</span></div>
                  </div>
                </div>

              </div>

              {/* RIGHT SIDEBAR COLUMN */}
              <div className="upwork-right-column">
                <div className="upwork-notice-box">
                  <span className="notice-icon">⚡</span>
                  <p>Submitting a proposal for this task uses <strong>1 Fixam Coin</strong> from your wallet.</p>
                </div>

                <button
                  className="btn-upwork-primary"
                  onClick={() => openProposalModal(selectedJob)}
                >
                  Submit Proposal
                </button>

                <button
                  className={`btn-upwork-secondary ${savedJobIds.includes(selectedJob.id) ? 'saved' : ''}`}
                  onClick={() => {
                    if (savedJobIds.includes(selectedJob.id)) {
                      setSavedJobIds(savedJobIds.filter(id => id !== selectedJob.id));
                    } else {
                      setSavedJobIds([...savedJobIds, selectedJob.id]);
                    }
                  }}
                >
                  {savedJobIds.includes(selectedJob.id) ? '♥ Saved job' : '♡ Save job'}
                </button>

                <button className="upwork-flag-link" onClick={() => alert('Flagged as inappropriate.')}>
                  ⚑ Flag as inappropriate
                </button>

                <div className="upwork-connects-info">
                  <p>Proposal cost: <strong>1 Fixam Coin</strong></p>
                  <p>Available Balance: <strong>{walletBalance !== null ? walletBalance : 0} XAF</strong></p>
                </div>

                <div className="upwork-divider" />

                {/* About the Client */}
                <div className="upwork-client-section">
                  <h3>About the client</h3>
                  <div className="client-check-item">
                    <span className="check-mark">✔</span>
                    <span>Verified Client</span>
                  </div>
                  <div className="client-check-item">
                    <span className="check-mark">✔</span>
                    <span>Phone number verified</span>
                  </div>
                  <div className="client-meta-text">
                    <p>📍 {selectedJob.country || selectedJob.location || 'Cameroon'}</p>
                    {selectedJob.client?.fullName && <p>👤 {selectedJob.client.fullName}</p>}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* SEND PROPOSAL MODAL */}
      {proposalModalJob && (
        <div className="upwork-modal-overlay animate-fade-in" onClick={() => setProposalModalJob(null)} style={{ zIndex: 1100 }}>
          <div className="upwork-filter-modal-card animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', width: '92%' }}>
            
            <div className="modal-header">
              <h2>Submit Proposal</h2>
              <button className="modal-close-btn" onClick={() => setProposalModalJob(null)}>✕</button>
            </div>
            
            <p className="text-xs text-slate-500 font-medium mb-3 truncate">
              Task: <strong className="text-slate-800">{proposalModalJob.title}</strong>
            </p>

            <div className="modal-body-scroll space-y-4">
              {/* Verification Alert Banner */}
              {!isVerified && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>⚠️</span>
                    <span>Identity Verification Required</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    You must verify your provider profile before submitting proposals to clients on Fixam.
                  </p>
                  <button 
                    type="button"
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-lg text-xs cursor-pointer transition border-none outline-none"
                    onClick={() => {
                      setProposalModalJob(null);
                      setSelectedJob(null);
                      setActiveTab('My Profile');
                    }}
                  >
                    Verify Profile Now →
                  </button>
                </div>
              )}

              {/* Availability Alert Banner */}
              {!isAvailable && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>🔴</span>
                    <span>Availability Status is Off</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    You must turn on your Availability Badge before submitting proposals to clients.
                  </p>
                  <button 
                    type="button"
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer transition border-none outline-none"
                    onClick={async () => {
                      try {
                        await api.put('/providers/status', { isAvailable: true });
                        setIsAvailable(true);
                      } catch (e) {}
                    }}
                  >
                    Turn On Availability Badge Now
                  </button>
                </div>
              )}

              {/* Insufficient Coins Alert Banner */}
              {!hasEnoughCoins && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>🪙</span>
                    <span>Insufficient Fixam Coins</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    You need <strong>{totalProposalCoins} Fixam Coins</strong> for this proposal (Your balance: {currentWalletBalance} XAF).
                  </p>
                  <button 
                    type="button"
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs cursor-pointer transition border-none outline-none"
                    onClick={() => {
                      setProposalModalJob(null);
                      setSelectedJob(null);
                      setActiveTab('Wallet');
                    }}
                  >
                    Buy Fixam Coins →
                  </button>
                </div>
              )}

              {/* Highest Boosted Bidder Banner (Real Data) */}
              {topBidder && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔥</span>
                    <div>
                      <strong className="block font-bold">Highest Boosted Bidder:</strong>
                      <span>{topBidder.name}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold rounded-lg text-xs">
                    {topBidder.boostCoins} Boost Coins
                  </span>
                </div>
              )}

              {/* Pitch / Cover Note Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Proposal Pitch / Cover Note (Optional)
                </label>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition"
                  rows={3}
                  placeholder="Introduce yourself, explain your experience with this type of task, and state your estimated completion time..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              {/* Boost Proposal Section (Manual Input Field) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Boost Your Proposal Rank (Optional)
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Enter extra boost coins to outbid competitors and rank at the top of the client's applicant list.
                </p>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Extra Boost Coins</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 bg-white"
                      placeholder="0"
                      value={boostCoins === 0 ? '' : boostCoins}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        setBoostCoins(val);
                      }}
                    />
                  </div>
                  <div className="text-right text-xs text-slate-600 font-medium">
                    <div>Base Cost: <strong>1 Coin</strong></div>
                    {boostCoins > 0 && <div className="text-emerald-600 font-bold">+ {boostCoins} Boost Coins</div>}
                  </div>
                </div>
              </div>

              {/* Summary Cost Footer */}
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-600 font-medium">Total Cost:</span>
                <strong className="text-emerald-700 font-extrabold text-sm">{totalProposalCoins} Fixam Coin{totalProposalCoins > 1 ? 's' : ''}</strong>
              </div>

            </div>

            {/* Actions */}
            <div className="modal-footer-actions mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button 
                type="button" 
                className="btn-modal-clear" 
                onClick={() => setProposalModalJob(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-modal-apply-green flex-1 flex justify-center items-center gap-2"
                onClick={handleSubmitProposalForm}
                disabled={isSubmittingProposal || !isVerified || !isAvailable || !hasEnoughCoins}
              >
                {isSubmittingProposal ? 'Submitting...' : 'Submit Proposal Now'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
