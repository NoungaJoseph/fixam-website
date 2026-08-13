import React, { useEffect, useState } from 'react';
import './SavedProviders.css';
import { api } from '../../services/api';
import { Icon, getMediaUrl } from '../../App';

interface SavedProvidersProps {
  savedProsState: any[];
  setSavedProsState: (pros: any[]) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
  setSelectedProvider?: (pro: any) => void;
}

export default function SavedProviders({ 
  savedProsState, 
  setSavedProsState, 
  setActiveTab, 
  setActiveChatUser,
  setSelectedProvider
}: SavedProvidersProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const res = await api.get('/providers/favorites');
        if (res.data?.data) {
          const formatted = res.data.data.map((item: any) => {
            const fullName = item.user?.fullName || item.name || 'Provider';
            const role = item.skills && item.skills.length > 0 ? item.skills.join(', ') : (item.role || 'Service Provider');
            const rating = item.rating ? Number(item.rating).toFixed(1) : '5.0';
            const rawAvatar = item.user?.avatar || item.avatar || item.image || '';
            const image = rawAvatar ? getMediaUrl(rawAvatar) : '';

            return {
              id: item.id,
              userId: item.user?.id || item.userId,
              name: fullName,
              role,
              rating,
              image,
              originalData: item
            };
          });
          setSavedProsState(formatted);
        }
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemove = async (pro: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/providers/${pro.id}/favorite`);
      setSavedProsState(savedProsState.filter(p => p.id !== pro.id && p.userId !== pro.userId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      // Fallback local remove
      setSavedProsState(savedProsState.filter(p => p.id !== pro.id && p.userId !== pro.userId));
    }
  };

  return (
    <div className="dash-panel-premium full-width-panel animate-fade-in">
      <div className="dash-panel-header-new">
        <h2>Saved Providers</h2>
        <button className="panel-link" onClick={() => setActiveTab('Find Services')}>Browse More</button>
      </div>

      {loading && savedProsState.length === 0 ? (
        <p style={{ color: '#64748B' }}>Loading saved providers...</p>
      ) : savedProsState.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⭐</span>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>No saved providers yet</p>
          <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>Explore service providers and click the heart or star icon to save them for quick access.</p>
          <button className="btn-card-primary" onClick={() => setActiveTab('Find Services')}>Explore Providers</button>
        </div>
      ) : (
        <div className="saved-providers-grid">
          {savedProsState.map((pro, index) => {
            const displayImage = pro.image ? getMediaUrl(pro.image) : '';
            return (
              <div 
                className="recommended-card-premium saved-card" 
                key={pro.id || index}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (setSelectedProvider) {
                    setSelectedProvider(pro);
                    setActiveTab('Provider Profile');
                  }
                }}
              >
                <div className="avatar-wrapper">
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt={pro.name} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=14B8A6&color=fff&size=64&rounded=true`;
                      }}
                    />
                  ) : (
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#14B8A6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {pro.name ? pro.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'PRO'}
                    </div>
                  )}
                </div>
                <h4>{pro.name}</h4>
                <span className="provider-cat-badge">{pro.role}</span>
                <div className="rating-row-premium">
                  <Icon name="star" />
                  <span>{pro.rating}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '1rem' }}>
                  <button 
                    className="btn-card-primary" 
                    style={{ flex: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('Messages');
                      setActiveChatUser(pro.name);
                    }}
                  >
                    Chat
                  </button>
                  <button 
                    className="outline-button"
                    style={{ padding: '0.4rem 0.6rem', border: '1px solid #CBD5E1', color: '#EF4444', borderRadius: '6px', fontSize: '0.8rem' }}
                    onClick={(e) => handleRemove(pro, e)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
