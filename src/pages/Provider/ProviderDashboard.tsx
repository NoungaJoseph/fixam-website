import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../App';
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
  client?: {
    fullName?: string;
  };
  clientVerified?: boolean;
  clientSpendingTier?: string;
};

const categoryOptions = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Repairs', 'Carpentry', 'Painting'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_high', label: 'Highest budget' },
  { value: 'price_low', label: 'Lowest budget' },
];

const formatBudget = (job: JobLead) => {
  const min = Number(job.budgetMin || 0);
  const max = Number(job.budgetMax || job.budget || 0);
  if (min && max && min !== max) return `${min.toLocaleString()} - ${max.toLocaleString()} XAF`;
  if (max) return `${max.toLocaleString()} XAF`;
  return 'Negotiable';
};

export default function ProviderDashboard({ setActiveTab, onRoleChange }: ProviderDashboardProps) {
  const [jobs, setJobs] = useState<JobLead[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const activeCategory = category === 'All' ? '' : category;

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get('/jobs/available', {
          params: {
            search: search.trim(),
            sortBy,
            limit: 30,
          },
        });
        const payload = response.data?.data || response.data?.jobs || [];
        setJobs(Array.isArray(payload) ? payload : []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load available jobs right now.');
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search, sortBy]);

  const filteredJobs = useMemo(() => {
    if (!activeCategory) return jobs;
    return jobs.filter((job) => {
      const label = String(job.category || job.serviceCategory || '').toLowerCase();
      return label.includes(activeCategory.toLowerCase());
    });
  }, [jobs, activeCategory]);

  const handleApply = async (job: JobLead) => {
    setApplyingId(job.id);
    try {
      await api.post(`/jobs/${job.id}/apply`);
      setJobs((current) => current.filter((item) => item.id !== job.id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send proposal.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="provider-job-feed animate-fade-in">
      <div className="provider-feed-header">
        <div>
          <h1>Available Jobs</h1>
          <p>Search approved client jobs and send proposals from one clean workspace.</p>
        </div>
        <div className="provider-feed-actions">
          <button className="provider-secondary-btn" onClick={() => setActiveTab('My Stats')}>
            <Icon name="chart" />
            Stats
          </button>
          {onRoleChange && (
            <button className="provider-secondary-btn" onClick={() => onRoleChange('client')}>
              <Icon name="user" />
              Client view
            </button>
          )}
        </div>
      </div>

      <div className="provider-job-toolbar">
        <label className="provider-search-field">
          <Icon name="search" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, description, or service"
            type="search"
          />
        </label>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort jobs">
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="provider-filter-row" aria-label="Job category filters">
        {categoryOptions.map((option) => (
          <button
            key={option}
            className={category === option ? 'active' : ''}
            onClick={() => setCategory(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {error && <div className="provider-feed-message error">{error}</div>}

      <div className="provider-job-list">
        {isLoading ? (
          <div className="provider-feed-message">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="provider-feed-message">No jobs match your current search.</div>
        ) : (
          filteredJobs.map((job) => {
            const categoryLabel = job.category || job.serviceCategory || 'General';
            return (
              <article className="provider-job-row" key={job.id}>
                <div className="provider-job-main">
                  <div className="provider-job-meta">
                    <span>{categoryLabel}</span>
                    {job.clientVerified && <span className="verified">Verified client</span>}
                    {job.clientSpendingTier && <span>{job.clientSpendingTier}</span>}
                  </div>
                  <h2>{job.title}</h2>
                  {job.description && <p>{job.description}</p>}
                  <div className="provider-job-details">
                    <span><Icon name="location" /> {job.location || 'Remote or nearby'}</span>
                    <span><Icon name="calendar" /> {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'New'}</span>
                    <span><Icon name="user" /> {job.client?.fullName || 'Client'}</span>
                  </div>
                </div>
                <div className="provider-job-side">
                  <strong>{formatBudget(job)}</strong>
                  <button onClick={() => handleApply(job)} disabled={applyingId === job.id}>
                    {applyingId === job.id ? 'Sending...' : 'Send Proposal'}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
