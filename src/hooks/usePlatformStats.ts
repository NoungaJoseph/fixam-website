import { useState, useEffect } from 'react';
import { getApiUrl } from '../App';

export interface PlatformStats {
  completedTasks: number;
  completedJobs: number;
  completedBookings: number;
  totalTasksPosted: number;
  verifiedPros: number;
  averageRating: number;
  totalReviews: number;
  activeCities: string[];
  citiesCount: number;
  categoriesCount: number;
  bookingFee: string;
}

const INITIAL_STATS: PlatformStats = {
  completedTasks: 1,
  completedJobs: 0,
  completedBookings: 1,
  totalTasksPosted: 2,
  verifiedPros: 5,
  averageRating: 5.0,
  totalReviews: 1,
  activeCities: ['Douala', 'Yaoundé', 'Bafoussam', 'Buea', 'Limbe', 'Bamenda'],
  citiesCount: 6,
  categoriesCount: 13,
  bookingFee: '100% Free'
};

let cachedStats: PlatformStats | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats>(cachedStats || INITIAL_STATS);
  const [loading, setLoading] = useState<boolean>(!cachedStats);

  useEffect(() => {
    let isMounted = true;
    const now = Date.now();

    if (cachedStats && now - lastFetchTime < CACHE_TTL_MS) {
      setStats(cachedStats);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/system/public-stats`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data && data.success && data.stats) {
          const raw = data.stats;
          const merged: PlatformStats = {
            completedTasks: typeof raw.completedTasks === 'number' ? raw.completedTasks : (typeof raw.completedJobs === 'number' && typeof raw.completedBookings === 'number' ? raw.completedJobs + raw.completedBookings : 0),
            completedJobs: typeof raw.completedJobs === 'number' ? raw.completedJobs : 0,
            completedBookings: typeof raw.completedBookings === 'number' ? raw.completedBookings : 0,
            totalTasksPosted: typeof raw.totalTasksPosted === 'number' ? raw.totalTasksPosted : 0,
            verifiedPros: typeof raw.verifiedPros === 'number' ? raw.verifiedPros : 0,
            averageRating: typeof raw.averageRating === 'number' && raw.averageRating > 0 ? raw.averageRating : 5.0,
            totalReviews: typeof raw.totalReviews === 'number' ? raw.totalReviews : 0,
            activeCities: Array.isArray(raw.activeCities) && raw.activeCities.length > 0 ? raw.activeCities : INITIAL_STATS.activeCities,
            citiesCount: raw.citiesCount || (Array.isArray(raw.activeCities) ? raw.activeCities.length : INITIAL_STATS.citiesCount),
            categoriesCount: raw.categoriesCount || INITIAL_STATS.categoriesCount,
            bookingFee: raw.bookingFee || '100% Free'
          };

          cachedStats = merged;
          lastFetchTime = Date.now();
          if (isMounted) {
            setStats(merged);
            setLoading(false);
          }
        }
      } catch (err) {
        console.warn('Could not fetch public stats, attempting direct fallback...', err);
        // Fallback fetch directly to localhost if port was different
        try {
          const fallbackRes = await fetch(`http://localhost:5000/api/system/public-stats`);
          const fallbackData = await fallbackRes.json();
          if (fallbackData && fallbackData.success && fallbackData.stats && isMounted) {
            const raw = fallbackData.stats;
            const merged: PlatformStats = {
              completedTasks: typeof raw.completedTasks === 'number' ? raw.completedTasks : 0,
              completedJobs: typeof raw.completedJobs === 'number' ? raw.completedJobs : 0,
              completedBookings: typeof raw.completedBookings === 'number' ? raw.completedBookings : 0,
              totalTasksPosted: typeof raw.totalTasksPosted === 'number' ? raw.totalTasksPosted : 0,
              verifiedPros: typeof raw.verifiedPros === 'number' ? raw.verifiedPros : 0,
              averageRating: typeof raw.averageRating === 'number' ? raw.averageRating : 5.0,
              totalReviews: typeof raw.totalReviews === 'number' ? raw.totalReviews : 0,
              activeCities: raw.activeCities || INITIAL_STATS.activeCities,
              citiesCount: raw.citiesCount || INITIAL_STATS.citiesCount,
              categoriesCount: raw.categoriesCount || INITIAL_STATS.categoriesCount,
              bookingFee: raw.bookingFee || '100% Free'
            };
            cachedStats = merged;
            lastFetchTime = Date.now();
            setStats(merged);
            setLoading(false);
            return;
          }
        } catch (e2) {
          // ignore
        }

        if (isMounted) {
          setStats(cachedStats || INITIAL_STATS);
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCompletedTasks = (isFr = false) => {
    const num = stats.completedTasks;
    const formatted = isFr ? num.toLocaleString('fr-FR') : num.toLocaleString('en-US');
    return num >= 100 ? `${formatted}+` : `${formatted}`;
  };

  const formatVerifiedPros = () => {
    const num = stats.verifiedPros;
    return num >= 100 ? `${num.toLocaleString()}+` : `${num.toLocaleString()}`;
  };

  const formatTasksPosted = () => {
    const num = stats.totalTasksPosted;
    return num >= 100 ? `${num.toLocaleString()}+` : `${num.toLocaleString()}`;
  };

  const formatReviewsCount = () => {
    const num = stats.totalReviews;
    return num >= 100 ? `${num.toLocaleString()}+` : `${num.toLocaleString()}`;
  };

  const formatRating = () => {
    return `${stats.averageRating.toFixed(1)}★`;
  };

  const formatCitiesList = (isFr = false) => {
    if (isFr) {
      return 'À Douala, Yaoundé, Bafoussam, Buéa et Limbé';
    }
    return 'Across Douala, Yaoundé, Bafoussam, Buea, and Limbe';
  };

  return {
    stats,
    loading,
    formatCompletedTasks,
    formatVerifiedPros,
    formatTasksPosted,
    formatReviewsCount,
    formatRating,
    formatCitiesList
  };
}
