import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/analytics/stats');
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Global Website Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Website Traffic</h2>
            <div className="text-4xl font-bold text-primary">{stats?.totalViews || 0}</div>
            <p className="text-sm text-gray-500 mt-2">Total Page Views</p>
          </div>

          {/* Careerpath Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Careerpath Hub</h2>
            <div className="text-4xl font-bold text-primary">{stats?.enrollments || 0}</div>
            <p className="text-sm text-gray-500 mt-2">Total Active Enrollments</p>
          </div>
        </div>

        {/* Heatmap / Top Pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Top Performing Pages (Heatmap)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="pb-3 font-medium">Page Path</th>
                  <th className="pb-3 font-medium text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats?.topPages?.map((page: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-gray-800 font-medium">{page.path}</td>
                    <td className="py-4 text-gray-600 text-right">{page._count.path}</td>
                  </tr>
                ))}
                {!stats?.topPages?.length && (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-gray-500">No analytics data gathered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
