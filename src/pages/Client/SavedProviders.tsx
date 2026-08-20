import React, { useEffect, useState, useMemo } from 'react';
import './SavedProviders.css';
import { api } from '../../services/api';
import { Icon, getMediaUrl } from '../../App';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../../components/UserAvatar';

interface SavedProvidersProps {
  savedProsState: any[];
  setSavedProsState: (pros: any[]) => void;
  setActiveTab: (tab: string) => void;
  setActiveChatUser: (user: string) => void;
  setSelectedProvider?: (pro: any) => void;
  setSelectedProject?: (proj: any) => void;
  favoriteProjectIds: string[];
  toggleFavoriteProject: (projectId: string) => void;
  displayedPros: any[];
}

export default function SavedProviders({ 
  savedProsState, 
  setSavedProsState, 
  setActiveTab, 
  setActiveChatUser,
  setSelectedProvider,
  setSelectedProject,
  favoriteProjectIds,
  toggleFavoriteProject,
  displayedPros
}: SavedProvidersProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'providers' | 'projects'>('providers');

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

  // Derive favorite projects from displayedPros & favoriteProjectIds
  const favoriteProjects = useMemo(() => {
    const currentUserId = user?.id || '';
    const projects: any[] = [];
    
    displayedPros.forEach((pro) => {
      const raw = pro.originalData;
      if (!raw || !Array.isArray(raw.portfolio)) return;
      raw.portfolio.forEach((item: any) => {
        if (!item) return;

        let parsedPackages = item.packages;
        if (typeof parsedPackages === 'string') {
          try { parsedPackages = JSON.parse(parsedPackages); } catch (_) {}
        }

        const rawImages = Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : (item.imageUrl ? [item.imageUrl] : (item.url ? [item.url] : (item.image ? [item.image] : [])));
        const itemImages = rawImages.map((u: string) => getMediaUrl(u, 'image')).filter(Boolean);

        const rawVideos = Array.isArray(item.videos) && item.videos.length > 0
          ? item.videos
          : (item.video ? (Array.isArray(item.video) ? item.video : [item.video]) : (item.videoUrl ? [item.videoUrl] : []));
        const itemVideos = rawVideos.map((u: string) => getMediaUrl(u, 'video')).filter(Boolean);

        const projectId = item.id || `${raw.id}_${item.title || 'proj'}`;

        projects.push({
          id: projectId,
          title: item.title || 'Untitled Project',
          description: item.description || '',
          imageUrl: itemImages[0] || getMediaUrl(item.imageUrl || item.url || item.image, 'image') || '',
          images: itemImages,
          videos: itemVideos,
          video: itemVideos[0] || null,
          packages: parsedPackages || null,
          price: item.price || (parsedPackages?.basic?.price || parsedPackages?.standard?.price || null),
          category: item.category || '',
          provider: {
            id: raw.id,
            userId: raw.user?.id || '',
            name: raw.user?.fullName || pro.name || 'Provider',
            avatar: raw.user?.avatar || '',
            rating: raw.rating || 5.0,
            reviewCount: raw.reviewsCount || raw.reviewCount || 0,
            country: raw.user?.country || 'Cameroon',
          },
        });
      });
    });
    
    return projects.filter(p => favoriteProjectIds.includes(p.id) && p.provider.userId !== currentUserId);
  }, [displayedPros, favoriteProjectIds, user?.id]);

  return (
    <div className="dash-panel-premium full-width-panel animate-fade-in">
      <div className="dash-panel-header-new">
        <h2>Favorites</h2>
        <button className="panel-link" onClick={() => setActiveTab('Find Services')}>Browse More</button>
      </div>

      {/* Styled Tabs */}
      <div className="favorites-tabs-container" style={{
        display: 'flex',
        gap: '1.5rem',
        borderBottom: '1px solid var(--line, #E2E8F0)',
        marginBottom: '1.5rem',
        paddingBottom: '0.1rem'
      }}>
        <button
          className={`fav-tab-btn ${activeSubTab === 'providers' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('providers')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            position: 'relative',
            color: activeSubTab === 'providers' ? '#0F766E' : '#64748B',
            transition: 'color 0.2s'
          }}
        >
          Providers
          {activeSubTab === 'providers' && (
            <div style={{
              position: 'absolute',
              bottom: '-3px',
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: '#0F766E',
              borderRadius: '3px 3px 0 0'
            }} />
          )}
        </button>
        <button
          className={`fav-tab-btn ${activeSubTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('projects')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            position: 'relative',
            color: activeSubTab === 'projects' ? '#0F766E' : '#64748B',
            transition: 'color 0.2s'
          }}
        >
          Projects
          {activeSubTab === 'projects' && (
            <div style={{
              position: 'absolute',
              bottom: '-3px',
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: '#0F766E',
              borderRadius: '3px 3px 0 0'
            }} />
          )}
        </button>
      </div>

      {activeSubTab === 'providers' ? (
        loading && savedProsState.length === 0 ? (
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
                  className="recommended-card-premium saved-card animate-fade-in" 
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
                    <UserAvatar 
                      uri={pro.image || pro.avatar || pro.user?.avatar || pro.originalData?.user?.avatar || (typeof pro.originalData?.portfolio?.[0] === 'string' ? pro.originalData.portfolio[0] : (pro.originalData?.portfolio?.[0]?.imageUrl || pro.originalData?.portfolio?.[0]?.url || pro.originalData?.portfolio?.[0]?.image))} 
                      name={pro.name} 
                      size={64} 
                    />
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
        )
      ) : (
        favoriteProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>💼</span>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>No saved projects yet</p>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>Explore projects and click the heart icon on any project to save it here.</p>
            <button className="btn-card-primary" onClick={() => setActiveTab('Dashboard')}>Explore Projects</button>
          </div>
        ) : (
          <div className="saved-providers-grid">
            {favoriteProjects.map((project, index) => {
              const displayImage = project.imageUrl ? getMediaUrl(project.imageUrl) : '';
              return (
                <div 
                  className="recommended-card-premium saved-card animate-fade-in" 
                  key={project.id || index}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (setSelectedProject) {
                      setSelectedProject(project);
                    }
                  }}
                >
                  <div className="avatar-wrapper" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                    {displayImage ? (
                      <img 
                        src={displayImage} 
                        alt={project.title} 
                        style={{ objectFit: 'cover', borderRadius: '8px', width: '100%', height: '100%' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/150?text=Project`;
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#0F766E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', borderRadius: '8px' }}>
                        PROJ
                      </div>
                    )}
                  </div>
                  <h4 style={{ marginTop: '0.8rem', fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{project.title}</h4>
                  <span className="provider-cat-badge">{project.category || 'Gig/Project'}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#64748B', margin: '0.2rem 0' }}>
                    <span>By {project.provider.name}</span>
                  </div>
                  <div className="rating-row-premium">
                    <Icon name="star" />
                    <span>{Number(project.provider.rating || 5.0).toFixed(1)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '1rem' }}>
                    <button 
                      className="btn-card-primary" 
                      style={{ flex: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('Messages');
                        setActiveChatUser(project.provider.name);
                      }}
                    >
                      Chat
                    </button>
                    <button 
                      className="outline-button"
                      style={{ padding: '0.4rem 0.6rem', border: '1px solid #CBD5E1', color: '#EF4444', borderRadius: '6px', fontSize: '0.8rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteProject(project.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
