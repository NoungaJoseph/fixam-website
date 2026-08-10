import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Icon, getMediaUrl, DEFAULT_AVATAR } from '../../App';
import '../Client/Reviews.css';

export default function ProviderReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ average: 0, breakdown: [0,0,0,0,0] });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (user?.id) {
          const res = await api.get(`/reviews/users/${user.id}`);
          let data = res.data?.data || res.data?.reviews || [];
          
          if (!Array.isArray(data) || data.length === 0) {
            const allRes = await api.get('/reviews');
            const allData = allRes.data?.data || allRes.data?.reviews || [];
            if (Array.isArray(allData)) {
              data = allData.filter((r: any) => r.targetUserId === user.id || r.providerId === user.id);
            }
          }

          setReviews(data);
          if (data.length > 0) {
            const sum = data.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
            const breakdown = [0, 0, 0, 0, 0];
            data.forEach((r: any) => {
              const star = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
              breakdown[star - 1]++;
            });
            setStats({ average: sum / data.length, breakdown });
          }
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchReviews();
  }, [user?.id]);

  const totalReviews = reviews.length || 1; // avoid division by zero

  return (
    <div className="max-w-7xl mx-auto w-full pt-6 animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Client Reviews Received</h2>
        <p className="text-sm text-gray-500 mt-1">Feedback and ratings left for your completed services by clients.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* LEFT Column: Rating Overview (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-6">Rating Overview</h3>
            
            <div className="flex items-baseline gap-2 mb-8">
              <strong className="text-5xl font-black text-gray-900 tracking-tight">{stats.average.toFixed(1)}</strong>
              <span className="text-sm font-bold text-gray-400">/ 5.0</span>
            </div>

            {/* Rating Bars */}
            <div className="space-y-3.5">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = stats.breakdown[stars - 1] || 0;
                const pct = Math.round((count / totalReviews) * 100);
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                    <span className="w-12 text-left">{stars} Stars</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#14B8A6] rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="w-8 text-right font-bold text-gray-400">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-5 mt-6 text-center text-xs font-semibold text-gray-400">
            Based on {reviews.length} total client reviews
          </div>
        </div>

        {/* RIGHT Column: Feedback List (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg">💬</span>
            <h3 className="text-lg font-bold text-gray-800">Received Client Feedback</h3>
          </div>

          <div className="reviews-list-premium space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center py-12 text-gray-400 font-medium bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                No client reviews received yet. Completed jobs will show your ratings and comments here.
              </p>
            ) : (
              reviews.map(r => {
                const reviewerName = r.reviewer?.fullName || `${r.reviewer?.firstName || ''} ${r.reviewer?.lastName || ''}`.trim() || 'Client';
                const rating = r.rating || 5;
                const stars = Array(rating).fill(0);
                const jobTitle = r.job?.title || r.job?.category || 'Service Order';
                
                return (
                  <div className="review-item-premium p-4 border border-gray-100 rounded-xl bg-gray-50/50" key={r.id || r._id}>
                    <div className="review-header flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={r.reviewer?.avatar ? getMediaUrl(r.reviewer.avatar) : DEFAULT_AVATAR} 
                          alt={reviewerName} 
                          className="w-10 h-10 rounded-full object-cover border border-teal-200"
                        />
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-snug">{reviewerName}</h4>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#14B8A6] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 mt-0.5 inline-block">
                            {jobTitle}
                          </span>
                        </div>
                      </div>
                      <div className="review-stars-premium flex items-center gap-0.5 text-amber-500">
                        {stars.map((_, i) => <Icon key={i} name="star" />)}
                        <strong className="text-slate-800 font-bold text-xs ml-1.5">{rating}.0</strong>
                      </div>
                    </div>
                    <p className="review-comment text-slate-600 text-sm italic font-medium leading-relaxed mb-2.5">
                      "{r.comment || 'No comment provided.'}"
                    </p>
                    <span className="review-date text-[10px] font-semibold text-slate-400">
                      📅 {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
