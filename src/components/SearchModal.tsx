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
}

export default function SearchModal({
  isOpen,
  onClose,
  userRole,
  onExecuteSearch,
  onSelectJob,
}: SearchModalProps) {
  const { i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'jobs' | 'talent' | 'projects'>('jobs');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Suggestions tailored to Fixam marketplace
  const suggestions = [
    'website',
    'virtual assistant',
    'graphic designer',
    'video editor',
    'electrician',
    'plumber',
    'air conditioning',
    'house painting',
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('fixam_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches(['website', 'virtual assistant']);
      }
    } catch {
      setRecentSearches(['website', 'virtual assistant']);
    }
  }, []);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
      setLiveResults([]);
    }
  }, [isOpen]);

  // Live search query matching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLiveResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        if (searchType === 'jobs') {
          const res = await api.get(`/jobs/available?q=${encodeURIComponent(searchQuery.trim())}`);
          const jobs = res.data?.jobs || res.data?.data || [];
          setLiveResults(Array.isArray(jobs) ? jobs.slice(0, 5) : []);
        } else {
          const res = await api.get(`/providers?q=${encodeURIComponent(searchQuery.trim())}`);
          const pros = res.data?.data || [];
          setLiveResults(Array.isArray(pros) ? pros.slice(0, 5) : []);
        }
      } catch {
        setLiveResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, searchType]);

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
    saveRecentSearch(searchQuery || item.title || item.name);
    if (onSelectJob && searchType === 'jobs') {
      onSelectJob(item);
    } else {
      onExecuteSearch(item.title || item.name || searchQuery, searchType);
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="upwork-search-backdrop" onClick={onClose}>
      <div className="upwork-search-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Input Row matching screenshot */}
        <form onSubmit={handleSubmit} className="upwork-search-input-row">
          <span className="upwork-search-icon-left">
            <SearchIcon />
          </span>

          <input
            ref={inputRef}
            type="text"
            className="upwork-search-field"
            placeholder={i18n.language === 'fr' ? 'Décrivez vos compétences ou un métier...' : 'Describe your skills'}
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

          {/* Type dropdown (Jobs ⌄ / Talent ⌄ / Projects ⌄) */}
          <select
            className="upwork-search-type-select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
          >
            <option value="jobs">Jobs ▾</option>
            <option value="talent">Talent ▾</option>
            <option value="projects">Projects ▾</option>
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
                      <h4 className="upwork-search-result-title">
                        {item.title || item.name || item.fullName || 'Job Opportunity'}
                      </h4>
                      <div className="upwork-search-result-meta">
                        {item.budget ? (
                          <span className="upwork-search-result-price">{Number(item.budget).toLocaleString()} XAF</span>
                        ) : item.rate ? (
                          <span className="upwork-search-result-price">{Number(item.rate).toLocaleString()} XAF/hr</span>
                        ) : null}
                        <span>📍 {item.location || item.quarter || 'Douala'}</span>
                        {item.category && <span>• {item.category}</span>}
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
                  <p>{i18n.language === 'fr' ? 'Aucun résultat direct. Appuyez sur Entrée pour rechercher dans toutes les catégories.' : 'No direct matches. Press Enter to search across all jobs.'}</p>
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    style={{
                      marginTop: '6px',
                      background: '#14B8A6',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '6px 16px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Search Now
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
