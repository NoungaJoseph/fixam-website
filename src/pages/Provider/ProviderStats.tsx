import { useEffect, useState } from 'react';
import { Icon, IconName } from '../../App';
import { getProviderStats, ProviderStats as ProviderStatsData } from '../../services/api';
import './ProviderDashboard.css';

const statItems = (stats: ProviderStatsData) => [
  { icon: 'wallet' as IconName, label: 'Total earnings', value: `${Number(stats.totalEarnings || 0).toLocaleString()} XAF`, tone: 'teal' },
  { icon: 'check' as IconName, label: 'Completed jobs', value: Number(stats.completedJobs || 0).toLocaleString(), tone: 'green' },
  { icon: 'briefcase' as IconName, label: 'Active jobs', value: Number(stats.activeJobs || 0).toLocaleString(), tone: 'blue' },
  { icon: 'calendar' as IconName, label: 'Ongoing contracts', value: Number(stats.ongoingContracts || 0).toLocaleString(), tone: 'amber' },
  { icon: 'star' as IconName, label: 'Average rating', value: Number(stats.averageRating || 0).toFixed(1), tone: 'purple' },
  { icon: 'wallet' as IconName, label: 'Cash received', value: `${Number(stats.cashReceived || 0).toLocaleString()} XAF`, tone: 'slate' },
];

export default function ProviderStats() {
  const [stats, setStats] = useState<ProviderStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        setStats(await getProviderStats());
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load provider stats.');
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="provider-stats-page animate-fade-in">
      <div className="provider-feed-header">
        <div>
          <h1>Provider Stats</h1>
          <p>Your earnings, jobs, contracts, and service performance.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="provider-feed-message">Loading stats...</div>
      ) : error ? (
        <div className="provider-feed-message error">{error}</div>
      ) : stats ? (
        <>
          <div className="provider-stats-grid">
            {statItems(stats).map((item) => (
              <article className={`provider-stat-card ${item.tone}`} key={item.label}>
                <span><Icon name={item.icon} /></span>
                <div>
                  <strong>{item.value}</strong>
                  <p>{item.label}</p>
                </div>
              </article>
            ))}
          </div>

          <section className="provider-performance-panel">
            <div>
              <h2>Performance Snapshot</h2>
              <p>Keep your availability on, respond quickly, and complete accepted work to improve these numbers.</p>
            </div>
            <div className="provider-rating-meter" aria-label="Average rating meter">
              <span style={{ width: `${Math.min(100, (Number(stats.averageRating || 0) / 5) * 100)}%` }} />
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
