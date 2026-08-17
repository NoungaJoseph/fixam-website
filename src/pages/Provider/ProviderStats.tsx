import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, IconName } from '../../App';
import { getProviderStats, ProviderStats as ProviderStatsData } from '../../services/api';
import './ProviderDashboard.css';

export default function ProviderStats() {
  const [stats, setStats] = useState<ProviderStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { i18n } = useTranslation();

  const statItems = (statsData: ProviderStatsData) => [
    { icon: 'wallet' as IconName, label: i18n.language === 'fr' ? 'Gains totaux' : 'Total earnings', value: `${Number(statsData.totalEarnings || 0).toLocaleString()} XAF`, tone: 'teal' },
    { icon: 'check' as IconName, label: i18n.language === 'fr' ? 'Missions terminées' : 'Completed jobs', value: Number(statsData.completedJobs || 0).toLocaleString(), tone: 'green' },
    { icon: 'briefcase' as IconName, label: i18n.language === 'fr' ? 'Missions actives' : 'Active jobs', value: Number(statsData.activeJobs || 0).toLocaleString(), tone: 'blue' },
    { icon: 'calendar' as IconName, label: i18n.language === 'fr' ? 'Contrats en cours' : 'Ongoing contracts', value: Number(statsData.ongoingContracts || 0).toLocaleString(), tone: 'amber' },
    { icon: 'star' as IconName, label: i18n.language === 'fr' ? 'Note moyenne' : 'Average rating', value: Number(statsData.averageRating || 0).toFixed(1), tone: 'purple' },
    { icon: 'wallet' as IconName, label: i18n.language === 'fr' ? 'Espèces reçues' : 'Cash received', value: `${Number(statsData.cashReceived || 0).toLocaleString()} XAF`, tone: 'slate' },
  ];

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
          <h1>{i18n.language === 'fr' ? 'Statistiques du prestataire' : 'Provider Stats'}</h1>
          <p>{i18n.language === 'fr' ? 'Vos revenus, missions, contrats et performances de service.' : 'Your earnings, jobs, contracts, and service performance.'}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="provider-feed-message">{i18n.language === 'fr' ? 'Chargement...' : 'Loading stats...'}</div>
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
              <h2>{i18n.language === 'fr' ? 'Aperçu des performances' : 'Performance Snapshot'}</h2>
              <p>{i18n.language === 'fr' ? 'Restez disponible, répondez rapidement et réalisez vos prestations pour améliorer ces chiffres.' : 'Keep your availability on, respond quickly, and complete accepted work to improve these numbers.'}</p>
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
