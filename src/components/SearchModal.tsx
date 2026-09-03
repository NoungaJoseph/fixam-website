import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './SearchModal.css';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';

// Precise SVG Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'client' | 'pro';
  onExecuteSearch: (query: string, searchType: 'jobs' | 'talent' | 'projects') => void;
  onSelectJob?: (job: any) => void;
  onSelectProvider?: (provider: any) => void;
  onSelectProject?: (project: any) => void;
  displayedPros?: any[];
}

export default function SearchModal({
  isOpen,
  onClose,
  userRole,
  onExecuteSearch,
  onSelectJob,
  onSelectProvider,
  onSelectProject,
  displayedPros = [],
}: SearchModalProps) {
  const { i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'jobs' | 'talent' | 'projects'>(
    userRole === 'client' ? 'talent' : 'jobs'
  );
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Suggestions tailored to Fixam marketplace
  const suggestions = [
    'plumber',
    'electrician',
    'house cleaning',
    'air conditioning',
    'house painting',
    'carpenter',
    'website design',
    'app development',
    'graphic designer',
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('fixam_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches(['plumbing', 'electrician', 'cleaning']);
      }
    } catch {
      setRecentSearches(['plumbing', 'electrician', 'cleaning']);
    }
  }, []);

  // Auto focus input when modal opens & reset default searchType according to userRole
  useEffect(() => {
    if (isOpen) {
      setSearchType(userRole === 'client' ? 'talent' : 'jobs');
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
      setLiveResults([]);
    }
  }, [isOpen, userRole]);

  // Live search query matching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLiveResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const q = searchQuery.trim().toLowerCase();
      try {
        if (searchType === 'jobs') {
          const res = await api.get(`/jobs/available?q=${encodeURIComponent(searchQuery.trim())}`);
          const jobs = res.data?.jobs || res.data?.data || [];
          setLiveResults(Array.isArray(jobs) ? jobs.slice(0, 6) : []);
        } else if (searchType === 'talent') {
          // Fast matching from displayedPros if available
          if (Array.isArray(displayedPros) && displayedPros.length > 0) {
            const localMatches = displayedPros.filter(p => {
              const name = `${p.firstName || ''} ${p.lastName || ''} ${p.fullName || ''}`.toLowerCase();
              const services = (p.services ? p.services.join(' ') : (p.role || '')).toLowerCase();
              const cat = (p.category || '').toLowerCase();
              const loc = `${p.location || ''} ${p.city || ''}`.toLowerCase();
              return name.includes(q) || services.includes(q) || cat.includes(q) || loc.includes(q);
            });
            if (localMatches.length > 0) {
              setLiveResults(localMatches.slice(0, 6));
              setIsSearching(false);
              return;
            }
          }
          const res = await api.get(`/providers?search=${encodeURIComponent(searchQuery.trim())}`);
          const pros = res.data?.data || res.data?.providers || [];
          setLiveResults(Array.isArray(pros) ? pros.slice(0, 6) : []);
        } else {
          const res = await api.get(`/projects?q=${encodeURIComponent(searchQuery.trim())}`);
          const projs = res.data?.data || res.data?.projects || [];
          setLiveResults(Array.isArray(projs) ? projs.slice(0, 6) : []);
        }
      } catch {
        setLiveResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, searchType, displayedPros]);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('fixam_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, termToRemove: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((t) => t !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem('fixam_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    saveRecentSearch(searchQuery);
    onExecuteSearch(searchQuery.trim(), searchType);
    onClose();
  };

  const handleSelectKeyword = (term: string) => {
    setSearchQuery(term);
    saveRecentSearch(term);
    onExecuteSearch(term, searchType);
    onClose();
  };

  const handleSelectResult = (item: any) => {
    const itemName = item.title || item.fullName || item.name || searchQuery;
    saveRecentSearch(itemName);
    if (searchType === 'jobs') {
      if (onSelectJob) {
        onSelectJob(item);
      } else {
        onExecuteSearch(itemName, searchType);
      }
    } else if (searchType === 'talent') {
      if (onSelectProvider) {
        onSelectProvider(item);
      } else {
        onExecuteSearch(itemName, searchType);
      }
    } else if (searchType === 'projects') {
      if (onSelectProject) {
        onSelectProject(item);
      } else {
        onExecuteSearch(itemName, searchType);
      }
    } else {
      onExecuteSearch(itemName, searchType);
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="upwork-search-backdrop" onClick={onClose}>
      <div className="upwork-search-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Input Row */}
        <form onSubmit={handleSubmit} className="upwork-search-input-row">
          <span className="upwork-search-icon-left">
            <SearchIcon />
          </span>

          <input
            ref={inputRef}
            type="text"
            className="upwork-search-field"
            placeholder={
              searchType === 'talent'
                ? (i18n.language === 'fr' ? 'Rechercher un prestataire, métier, compétence...' : 'Search for a provider, trade, skill...')
                : searchType === 'projects'
                ? (i18n.language === 'fr' ? 'Rechercher un service clé en main...' : 'Search pre-packaged project services...')
                : (i18n.language === 'fr' ? 'Rechercher des missions publiées...' : 'Search posted jobs & tasks...')
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (
            <button
              type="button"
              className="upwork-search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear"
            >
              <CloseIcon />
            </button>
          )}

          {/* Type dropdown (Talent ⌄ / Projects ⌄ / Jobs ⌄) */}
          <select
            className="upwork-search-type-select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
          >
            <option value="talent">{i18n.language === 'fr' ? 'Prestataires' : 'Talent / Pros'} ▾</option>
            <option value="projects">{i18n.language === 'fr' ? 'Services' : 'Services & Projects'} ▾</option>
            <option value="jobs">{i18n.language === 'fr' ? 'Missions' : 'Jobs / Tasks'} ▾</option>
          </select>
        </form>

        {/* Modal Body */}
        <div className="upwork-search-body">
          
          {/* Live Search Results (when typing) */}
          {searchQuery.trim() ? (
            <div>
              <div className="upwork-search-section-header">
                <span>
                  {isSearching
                    ? (i18n.language === 'fr' ? 'Recherche en cours...' : 'Searching...')
                    : (i18n.language === 'fr' ? `Résultats pour "${searchQuery}"` : `Matches for "${searchQuery}"`)}
                </span>
              </div>

              {liveResults.length > 0 ? (
                <div className="upwork-search-live-results">
                  {liveResults.map((item, idx) => (
                    <div
                      key={item.id || item._id || idx}
                      className="upwork-search-result-card"
                      onClick={() => handleSelectResult(item)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <h4 className="upwork-search-result-title" style={{ margin: 0, color: '#0F172A', fontWeight: 700 }}>
                          {item.fullName || item.title || item.name || 'Fixam Match'}
                        </h4>
                        {item.isVerified || item.verification === 'VERIFIED' ? (
                          <span style={{ fontSize: '0.75rem', background: '#DCFCE7', color: '#16A34A', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            ✓ {i18n.language === 'fr' ? 'Vérifié' : 'Verified'}
                          </span>
                        ) : null}
                      </div>

                      <div className="upwork-search-result-meta" style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem', color: '#64748B' }}>
                        {item.budget ? (
                          <span className="upwork-search-result-price" style={{ color: '#0D9488', fontWeight: 700 }}>{Number(item.budget).toLocaleString()} XAF</span>
                        ) : item.rate || item.hourlyRate ? (
                          <span className="upwork-search-result-price" style={{ color: '#0D9488', fontWeight: 700 }}>{Number(item.rate || item.hourlyRate).toLocaleString()} XAF/hr</span>
                        ) : item.price ? (
                          <span className="upwork-search-result-price" style={{ color: '#0D9488', fontWeight: 700 }}>{Number(item.price).toLocaleString()} XAF</span>
                        ) : null}
                        <span>📍 {item.location || item.city || item.quarter || 'Cameroon'}</span>
                        {(item.category || item.role) && <span>• {item.category || item.role}</span>}
                        {item.rating ? <span>⭐ {Number(item.rating).toFixed(1)}</span> : null}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    style={{
                      marginTop: '8px',
                      padding: '8px',
                      background: '#F0FDFA',
                      color: '#0D9488',
                      border: '1px solid #99F6E4',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'center'
                    }}
                  >
                    {i18n.language === 'fr' ? `Voir tous les résultats pour "${searchQuery}" →` : `See all results for "${searchQuery}" →`}
                  </button>
                </div>
              ) : !isSearching ? (
                <div className="upwork-search-empty">
                  <p>{i18n.language === 'fr' ? `Aucun résultat direct. Appuyez sur Entrée pour filtrer dans tous les services.` : `No direct preview matches. Press Enter to search across all services.`}</p>
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    style={{
                      marginTop: '8px',
                      background: '#14B8A6',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '8px 20px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {i18n.language === 'fr' ? 'Rechercher maintenant' : 'Search Now'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              {/* Recent Searches Section (matches screenshot) */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="upwork-search-section-header">
                    <span className="upwork-search-section-icon">
                      <ClockIcon />
                    </span>
                    <span>{i18n.language === 'fr' ? 'Récent' : 'Recent'}</span>
                  </div>

                  <div className="upwork-search-tags-list">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        className="upwork-search-item-btn"
                        onClick={() => handleSelectKeyword(term)}
                      >
                        <span>{term}</span>
                        <span
                          className="upwork-search-item-delete"
                          onClick={(e) => removeRecentSearch(e, term)}
                          title="Remove"
                        >
                          ✕
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions Section (matches screenshot) */}
              <div>
                <div className="upwork-search-section-header">
                  <span className="upwork-search-section-icon">
                    <LightbulbIcon />
                  </span>
                  <span>{i18n.language === 'fr' ? 'Suggestions' : 'Suggestions'}</span>
                </div>

                <div className="upwork-search-tags-list">
                  {suggestions.map((term) => (
                    <button
                      key={term}
                      className="upwork-search-item-btn"
                      onClick={() => handleSelectKeyword(term)}
                    >
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>,
    document.body
  );
}
