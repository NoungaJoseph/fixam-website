import React, { useState } from 'react';
import './UpworkSidebar.css';
import { getMediaUrl, DEFAULT_AVATAR } from '../App';
import { useTranslation } from 'react-i18next';

// Precise Vector SVG Icons matching Upwork screenshot
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const OpportunitiesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ContractsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const FinancesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const MessagesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="13" x2="14" y2="13" />
  </svg>
);

const UmaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg className={`upwork-sidebar-chevron ${open ? 'open' : ''}`} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="upwork-sidebar-user-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const SwitchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

export interface UpworkSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  user: any;
  userRole: 'client' | 'pro';
  onRoleChange?: (role: 'client' | 'pro') => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch?: () => void;
  unreadMessagesCount?: number;
  unreadNotificationsCount?: number;
  walletBalance?: number;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export default function UpworkSidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  user,
  userRole,
  onRoleChange,
  activeTab,
  onSelectTab,
  onOpenSearch,
  unreadMessagesCount = 0,
  unreadNotificationsCount = 0,
  walletBalance = 0,
  onLogout,
  onNavigateHome,
}: UpworkSidebarProps) {
  const { i18n } = useTranslation();

  // Accordion open states
  const [opportunitiesOpen, setOpportunitiesOpen] = useState(false);
  const [contractsOpen, setContractsOpen] = useState(false);
  const [financesOpen, setFinancesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || (userRole === 'pro' ? 'Edwin Nkwain' : 'Fixam User');
  const userAvatar = user?.avatar || user?.image ? getMediaUrl(user.avatar || user.image) : DEFAULT_AVATAR;

  const roleSubtitle = userRole === 'pro'
    ? (user?.providerProfile?.verification === 'VERIFIED' ? 'Freelancer Plus' : 'Freelancer Basic')
    : (i18n.language === 'fr' ? 'Client Vérifié' : 'Client Account');

  const handleItemClick = (tabName: string) => {
    onSelectTab(tabName);
    onClose();
  };

  return (
    <>
      {/* ── 1. Mobile Backdrop ── */}
      <div
        className={`upwork-drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* ── 2. Floating Circular Close Button on mobile (as in screenshot) ── */}
      {isOpen && (
        <button
          className="upwork-drawer-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
      )}

      {/* ── 3. Sidebar Drawer Container ── */}
      <aside className={`upwork-sidebar-drawer ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>

        {/* ── Top Brand Header ── */}
        <div className="upwork-sidebar-brand">
          <button
            className="upwork-sidebar-brand-text bg-transparent border-0 p-0 cursor-pointer text-left"
            onClick={() => {
              onClose();
              onNavigateHome();
            }}
          >
            fixam<span className="upwork-sidebar-brand-dot">.</span>
          </button>
          {onToggleCollapse && (
            <button
              className="desktop-only p-1 text-slate-400 hover:text-slate-700 bg-transparent border-0 cursor-pointer rounded"
              onClick={onToggleCollapse}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isCollapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
              </svg>
            </button>
          )}
        </div>

        {/* ── User Profile Identity Row (Avatar + Name + Subtitle + Chevron >) ── */}
        <button
          className="upwork-sidebar-user-card"
          onClick={() => handleItemClick('My Profile')}
          title="View profile"
        >
          <img src={userAvatar} alt={fullName} className="upwork-sidebar-user-avatar" />
          <div className="upwork-sidebar-user-info">
            <h3 className="upwork-sidebar-user-name">{fullName}</h3>
            <p className="upwork-sidebar-user-tier">{roleSubtitle}</p>
          </div>
          <ChevronRightIcon />
        </button>

        {/* ── Main Navigation Items (Search, Home, Notifications, etc.) ── */}
        <nav className="upwork-sidebar-nav-list">

          {/* 1. Search */}
          <button
            className={`upwork-sidebar-item ${(activeTab === 'Find Services' || activeTab === 'Search') ? 'active' : ''}`}
            onClick={() => {
              onClose();
              if (onOpenSearch) {
                onOpenSearch();
              } else {
                handleItemClick(userRole === 'pro' ? 'Dashboard' : 'Find Services');
              }
            }}
          >
            <span className="upwork-sidebar-icon"><SearchIcon /></span>
            <span className="upwork-sidebar-label">{i18n.language === 'fr' ? 'Rechercher' : 'Search'}</span>
          </button>

          {/* 2. Home */}
          <button
            className={`upwork-sidebar-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
            onClick={() => handleItemClick('Dashboard')}
          >
            <span className="upwork-sidebar-icon"><HomeIcon /></span>
            <span className="upwork-sidebar-label">{i18n.language === 'fr' ? 'Accueil' : 'Home'}</span>
          </button>

          {/* 3. Notifications */}
          <button
            className={`upwork-sidebar-item ${activeTab === 'Notifications' ? 'active' : ''}`}
            onClick={() => handleItemClick('Notifications')}
          >
            <span className="upwork-sidebar-icon"><BellIcon /></span>
            <span className="upwork-sidebar-label">{i18n.language === 'fr' ? 'Notifications' : 'Notifications'}</span>
            {unreadNotificationsCount > 0 && (
              <span className="upwork-sidebar-badge">{unreadNotificationsCount}</span>
            )}
          </button>

          {/* 4. Opportunities (Dropdown group) */}
          <button
            className="upwork-sidebar-item"
            onClick={() => setOpportunitiesOpen(!opportunitiesOpen)}
          >
            <span className="upwork-sidebar-icon"><OpportunitiesIcon /></span>
            <span className="upwork-sidebar-label">{i18n.language === 'fr' ? 'Opportunités' : 'Opportunities'}</span>
            <ChevronDownIcon open={opportunitiesOpen} />
          </button>
          {opportunitiesOpen && (
            <div className="upwork-sidebar-submenu">
              {userRole === 'pro' ? (
                <>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Dashboard')}>
                    {i18n.language === 'fr' ? 'Missions disponibles (Leads)' : 'Job Leads'}
                  </button>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('My Jobs')}>
                    {i18n.language === 'fr' ? 'Mes missions & candidatures' : 'My Jobs'}
                  </button>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Post a Project')}>
                    {i18n.language === 'fr' ? 'Publier un projet' : 'Post a Project'}
                  </button>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('My Stats')}>
                    {i18n.language === 'fr' ? 'Mes statistiques' : 'Proposals & Stats'}
                  </button>
                </>
              ) : (
                <>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Dashboard')}>
                    {i18n.language === 'fr' ? 'Poster une mission' : 'Post a Task'}
                  </button>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Find Services')}>
                    {i18n.language === 'fr' ? 'Trouver un prestataire' : 'Find Providers'}
                  </button>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Saved Providers')}>
                    {i18n.language === 'fr' ? 'Prestataires favoris' : 'Saved Providers'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* 5. Contracts (Dropdown group) */}
          <button
            className="upwork-sidebar-item"
            onClick={() => setContractsOpen(!contractsOpen)}
          >
            <span className="upwork-sidebar-icon"><ContractsIcon /></span>
            <span className="upwork-sidebar-label">{i18n.language === 'fr' ? 'Contrats & Missions' : 'Contracts'}</span>
            <ChevronDownIcon open={contractsOpen} />
          </button>
          {contractsOpen && (
            <div className="upwork-sidebar-submenu">
              {userRole === 'pro' ? (
                <>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('My Jobs')}>
                    {i18n.language === 'fr' ? 'Tous les contrats' : 'All Contracts'}
                  </button>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Reviews')}>
                    {i18n.language === 'fr' ? 'Avis et évaluations' : 'Client Reviews'}
                  </button>
                </>
              ) : (
                <>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('My Bookings')}>
                    {i18n.language === 'fr' ? 'Mes réservations' : 'My Bookings'}
                  </button>
                  <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Reviews')}>
                    {i18n.language === 'fr' ? 'Avis rédigés' : 'Reviews & Feedback'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* 6. Finances (Dropdown group) */}
          <button
            className="upwork-sidebar-item"
            onClick={() => setFinancesOpen(!financesOpen)}
          >
            <span className="upwork-sidebar-icon"><FinancesIcon /></span>
            <span className="upwork-sidebar-label">{i18n.language === 'fr' ? 'Finances' : 'Finances'}</span>
            {walletBalance > 0 && (
              <span className="upwork-sidebar-badge-wallet mr-2">
                {walletBalance.toLocaleString()} XAF
              </span>
            )}
            <ChevronDownIcon open={financesOpen} />
          </button>
          {financesOpen && (
            <div className="upwork-sidebar-submenu">
              <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Wallet')}>
                {i18n.language === 'fr' ? 'Portefeuille & Solde' : 'Wallet Overview'}
              </button>
              <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Transaction History')}>
                {i18n.language === 'fr' ? 'Historique des transactions' : 'Transaction History'}
              </button>
            </div>
          )}

          {/* 7. Messages */}
          <button
            className={`upwork-sidebar-item ${activeTab === 'Messages' ? 'active' : ''}`}
            onClick={() => handleItemClick('Messages')}
          >
            <span className="upwork-sidebar-icon"><MessagesIcon /></span>
            <span className="upwork-sidebar-label">{i18n.language === 'fr' ? 'Messages' : 'Messages'}</span>
            {unreadMessagesCount > 0 && (
              <span className="upwork-sidebar-badge">{unreadMessagesCount}</span>
            )}
          </button>

          {/* 8. Uma / Settings */}
          <button
            className={`upwork-sidebar-item ${activeTab === 'Settings' ? 'active' : ''}`}
            onClick={() => handleItemClick('Settings')}
          >
            <span className="upwork-sidebar-icon"><UmaIcon /></span>
            <span className="upwork-sidebar-label">{i18n.language === 'fr' ? 'Paramètres' : 'Settings'}</span>
          </button>

        </nav>

        {/* ── Bottom Fixed Group (Help, Role Switcher, Logout) ── */}
        <div className="upwork-sidebar-bottom-group">

          {/* Help dropdown */}
          <button
            className="upwork-sidebar-item"
            onClick={() => setHelpOpen(!helpOpen)}
          >
            <span className="upwork-sidebar-icon"><HelpIcon /></span>
            <span className="upwork-sidebar-label">{i18n.language === 'fr' ? 'Aide & Support' : 'Help'}</span>
            <ChevronDownIcon open={helpOpen} />
          </button>
          {helpOpen && (
            <div className="upwork-sidebar-submenu">
              <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Support')}>
                {i18n.language === 'fr' ? 'Centre d\'aide & Contact' : 'Help Center & Support'}
              </button>
              <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Verification')}>
                {i18n.language === 'fr' ? 'Vérification d\'identité' : 'Trust & Verification'}
              </button>
              <button className="upwork-sidebar-subitem" onClick={() => handleItemClick('Refer & Earn')}>
                {i18n.language === 'fr' ? 'Parrainer & Gagner' : 'Refer & Earn'}
              </button>
            </div>
          )}

          {/* Role switcher button */}
          {onRoleChange && (
            <button
              className="upwork-sidebar-role-btn"
              onClick={() => {
                onClose();
                onRoleChange(userRole === 'pro' ? 'client' : 'pro');
              }}
            >
              <SwitchIcon />
              <span>
                {userRole === 'pro'
                  ? (i18n.language === 'fr' ? 'Basculer en mode Client' : 'Switch to Client View')
                  : (i18n.language === 'fr' ? 'Basculer en mode Prestataire' : 'Switch to Provider View')}
              </span>
            </button>
          )}

          {/* Logout */}
          <button
            className="upwork-sidebar-logout-btn"
            onClick={() => {
              onClose();
              onLogout();
            }}
          >
            <span className="upwork-sidebar-icon text-red-500"><LogoutIcon /></span>
            <span>{i18n.language === 'fr' ? 'Déconnexion' : 'Log out'}</span>
          </button>

        </div>

      </aside>
    </>
  );
}
