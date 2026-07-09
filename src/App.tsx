import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import OTPVerification from './pages/Auth/OTPVerification'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import './App.css'
import './marketplace.css'

export type Page = 'home' | 'services' | 'about' | 'login' | 'register' | 'forgot_password' | 'otp' | 'dashboard' | 'guide' | 'terms' | 'privacy'

export type IconName =
  | 'appliance' | 'bell' | 'briefcase' | 'calendar' | 'chat' | 'check' | 'cleaning'
  | 'delivery' | 'electrical' | 'filter' | 'home' | 'location' | 'menu' | 'message'
  | 'painting' | 'plumbing' | 'search' | 'shield' | 'star' | 'user' | 'wallet' | 'wrench' | 'x'
  | 'sun' | 'moon' | 'facebook' | 'twitter' | 'instagram' | 'linkedin'

export const asset = (fileName: string) => `/assets/${fileName}`

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://fixam-backend-production.up.railway.app/api';
};

const getMediaUrl = (path?: string) => {
  if (!path) return 'https://via.placeholder.com/150';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const API_URL = getApiUrl();
  const origin = API_URL.replace(/\/api\/?$/, '');
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
};

const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

export const images = {
  landingHero: asset('landing-hero-composite.png'),
  heroProfessional: asset('hero-professional.png'),
  appHomeScreen: asset('app-home-screen.png'),
  servicePlumber: asset('plumbing.jpg'),
  serviceCleaner: asset('cleaning.jpg'),
  serviceElectrician: asset('electrical.jpg'),
  proJeff: asset('pro-jeff-thomson.jpg'),
  proSamuel: asset('pro-samuel-bright.jpg'),
  proMary: asset('pro-mary-clean.jpg'),
  proPeter: asset('pro-peter-wood.jpg'),
  blogPlumbing: asset('blog-plumbing.jpg'),
  blogHomeCare: asset('blog-home-care.jpg'),
  blogElectrical: asset('blog-electrical.jpg'),
  taskPlumbing: asset('task-plumbing.jpg'),
  taskElectrical: asset('task-electrical.jpg'),
  taskCleaning: asset('task-cleaning.jpg'),
  heroBg: asset('cleaning.jpg'),
  onboardingExperts: asset('experts.png'),
  onboardingVerified: asset('verified.png'),
  onboardingPayment: asset('payment.png'),
  onboardingBook: asset('book.png'),
  onboardingAgree: asset('agree.png'),
} as const

const services: Array<{ id: string; title: string; icon: IconName; color: string; image: string; desc?: string; count?: string }> = [
  { id: 'plumbing', title: 'Plumbing', icon: 'plumbing' as IconName, color: 'blue', image: asset('plumbing.jpg') },
  { id: 'electrical', title: 'Electrical', icon: 'electrical' as IconName, color: 'green', image: asset('electrical.jpg') },
  { id: 'cleaning', title: 'Cleaning', icon: 'cleaning' as IconName, color: 'purple', image: asset('cleaning.jpg') },
  { id: 'painting', title: 'Painting', icon: 'painting' as IconName, color: 'orange', image: asset('painting.jpg') },
  { id: 'carpentry', title: 'Carpentry', icon: 'wrench' as IconName, color: 'brown', image: asset('carpentry.jpg') },
  { id: 'appliance', title: 'Appliance Repair', icon: 'appliance' as IconName, color: 'blue', image: asset('appliance-repair.jpg') },
  { id: 'delivery', title: 'Delivery', icon: 'delivery' as IconName, color: 'pink', image: asset('delivery-service.jpg') },
  { id: 'barber', title: 'Barber', icon: 'user' as IconName, color: 'green', image: asset('barber.jpg') },
  { id: 'beauty', title: 'Beauty', icon: 'star' as IconName, color: 'purple', image: asset('beauty.jpg') },
  { id: 'makeup', title: 'Makeup Artist', icon: 'star' as IconName, color: 'pink', image: asset('makeup-artist.jpg') },
  { id: 'tailoring', title: 'Tailoring', icon: 'wrench' as IconName, color: 'brown', image: asset('tailoring.jpg') },
  { id: 'tiling', title: 'Tiling', icon: 'home' as IconName, color: 'blue', image: asset('tiling.jpg') },
  { id: 'cctv', title: 'CCTV Installation', icon: 'shield' as IconName, color: 'orange', image: asset('cctv-installation.jpg') },
]

const pros = [
  { name: 'Jeff Thomson', role: 'Plumbing Specialist', rating: '4.8', distance: '4.2 km away', image: images.proJeff },
  { name: 'Samuel Bright', role: 'Electrician', rating: '4.7', distance: '3.6 km away', image: images.proSamuel },
  { name: 'Mary Clean', role: 'Cleaning Expert', rating: '4.9', distance: '2.1 km away', image: images.proMary },
  { name: 'Peter Wood', role: 'Carpenter', rating: '4.6', distance: '5.3 km away', image: images.proPeter },
]

const blogPosts = [
  { tag: 'Plumbing', title: '5 Signs You Need to Call a Professional Plumber', image: images.blogPlumbing },
  { tag: 'Home Care', title: 'How to Keep Your Home Clean and Fresh', image: images.blogHomeCare },
  { tag: 'Electrical', title: 'Electrical Safety Tips Every Homeowner Should Know', image: images.blogElectrical },
]

const tasks = [
  { title: 'Fix leaking pipe in kitchen', tag: 'Plumbing', price: '25,000 XAF', status: 'Pending', image: images.taskPlumbing },
  { title: 'Fixing faulty wiring', tag: 'Electrical', price: '15,000 XAF', status: 'In Progress', image: images.taskElectrical },
  { title: 'House deep cleaning', tag: 'Cleaning', price: '20,000 XAF', status: 'Completed', image: images.taskCleaning },
]

const leads = [
  { title: 'Emergency kitchen plumbing fix', tag: 'Plumbing', price: '35,000 XAF', status: 'Active', image: images.taskPlumbing },
  { title: 'Install ceiling fans & rewiring', tag: 'Electrical', price: '20,000 XAF', status: 'Active', image: images.taskElectrical },
  { title: 'Move out deep cleaning service', tag: 'Cleaning', price: '25,000 XAF', status: 'Active', image: images.taskCleaning },
]

const activeProposals = [
  { name: 'Theresa May', role: 'Plumbing Request', rating: '5.0', distance: '1.2 km away', image: images.proMary },
  { name: 'John Doe', role: 'Electrical Repair', rating: '4.9', distance: '3.4 km away', image: images.proJeff },
]

const useMaintenanceCheck = () => {
  const [appReady, setAppReady] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState('');

  const checkStatus = async () => {
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/system/status`);
      const data = await response.json();

      if (data.webMaintenanceEnabled) {
        setMaintenance(true);
        setMaintenanceMsg(data.message || 'We are currently undergoing maintenance. Please check back later.');
      } else {
        setMaintenance(false);
      }
    } catch (error) {
      setMaintenance(false);
    } finally {
      setAppReady(true);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { appReady, maintenance, maintenanceMsg };
};

function MaintenanceScreen({ message }: { message: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#F8FAFC', padding: '2rem', textAlign: 'center' }}>
      <img src={asset('fixam-white-bg.png')} alt="Fixam Logo" style={{ height: '60px', transform: 'scale(1.5)', transformOrigin: 'center', filter: 'invert(1)' }} />
      <h1 style={{ marginTop: '3rem', fontSize: '2rem', color: '#0F172A' }}>Under Maintenance</h1>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#64748B', maxWidth: '500px' }}>{message}</p>
    </div>
  );
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const { appReady, maintenance, maintenanceMsg } = useMaintenanceCheck();
  const [livePros, setLivePros] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<'client' | 'pro'>('client');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [theme]);

  useEffect(() => {
    if (maintenance || !appReady) return;
    const fetchPros = async () => {
      try {
        const API_URL = getApiUrl();
        const res = await fetch(`${API_URL}/providers`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map((item: any) => {
            const name = item.user?.fullName || 'Anonymous Provider';
            const role = item.skills && item.skills.length > 0 ? item.skills.join(', ') : 'Service Provider';
            const rating = item.rating ? Number(item.rating).toFixed(1) : '5.0';
            const distance = item.serviceArea || 'Douala';
            
            let image = images.proJeff;
            if (item.user?.avatar) {
              image = getMediaUrl(item.user.avatar);
            } else {
              const placeholders = [images.proJeff, images.proSamuel, images.proMary, images.proPeter];
              const idx = Math.abs(hashCode(item.id || name)) % placeholders.length;
              image = placeholders[idx];
            }

            return {
              name,
              role,
              rating,
              distance,
              image
            };
          });
          setLivePros(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch providers:', err);
      }
    };
    fetchPros();
  }, [appReady, maintenance]);

  if (!appReady) {
    return <div style={{ height: '100vh', backgroundColor: '#F8FAFC' }} />;
  }

  if (maintenance) {
    return <MaintenanceScreen message={maintenanceMsg} />;
  }

  return (
    <div className={page === 'dashboard' ? 'app dashboard-shell' : 'app'}>
      {page === 'dashboard' ? (
        <Dashboard onNavigate={setPage} livePros={livePros} userRole={userRole} theme={theme} setTheme={setTheme} />
      ) : page === 'login' ? (
        <Login onNavigate={setPage} onLogin={(role) => setUserRole(role)} />
      ) : page === 'register' ? (
        <Register onNavigate={setPage} onRegister={(role) => setUserRole(role)} />
      ) : page === 'forgot_password' ? (
        <ForgotPassword onNavigate={setPage} />
      ) : page === 'otp' ? (
        <OTPVerification onNavigate={setPage} />
      ) : (
        <>
          <Header page={page} onNavigate={setPage} theme={theme} setTheme={setTheme} />
          <main>
            {page === 'services' && <Services onNavigate={setPage} />}
            {page === 'guide' && <Guide onNavigate={setPage} />}
            {page === 'about' && <About onNavigate={setPage} />}
            {page === 'terms' && <TermsOfService onNavigate={setPage} />}
            {page === 'privacy' && <PrivacyPolicy onNavigate={setPage} />}
            {page === 'home' && <Home onNavigate={setPage} livePros={livePros} />}
          </main>
        </>
      )}

      {/* Floating WhatsApp Support Button */}
      <a 
        href="https://wa.me/237600000000" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
        aria-label="Contact Support on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="whatsapp-icon">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.518 0 10.011-4.493 10.014-10.011.002-2.673-1.028-5.186-2.9-7.06C16.56 1.66 14.07 .63 11.4 0.63 5.922 0.63 1.453 5.1 1.45 10.58c-.001 1.636.43 3.226 1.25 4.63l-1.013 3.697 3.793-.995.176.104z" fill="currentColor"/>
          <path d="M17.472 14.382c-.3-.149-1.777-.878-2.046-.975-.269-.099-.465-.148-.659.15-.195.297-.752.943-.918 1.14-.166.195-.331.22-.63.072-.3-.149-1.27-.469-2.42-1.496-.893-.798-1.495-1.784-1.67-2.083-.176-.3-.018-.462.13-.61.137-.133.303-.35.454-.524.152-.174.202-.298.303-.497.102-.199.05-.373-.025-.523-.075-.15-.659-1.591-.902-2.175-.237-.569-.479-.492-.66-.502-.174-.01-.373-.011-.572-.011-.199 0-.523.074-.797.373-.274.298-1.047 1.023-1.047 2.497 0 1.475 1.075 2.897 1.226 3.094.15.199 2.115 3.228 5.127 4.527.717.311 1.276.497 1.712.636.722.23 1.378.197 1.9.119.58-.088 1.777-.726 2.025-1.43.248-.704.248-1.306.173-1.43-.075-.124-.274-.199-.572-.349z" fill="currentColor"/>
        </svg>
      </a>
    </div>
  )
}

function Services({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useTranslation();

  return (
    <div className="services-page">
      <div className="services-hero">
        <h1>{t('nav.explore') || 'Explore Professional Services'}</h1>
        <p>Find the perfect professional for your next project, right when you need them.</p>
      </div>
      <section className="section services-grid-section">
        <div className="categories-grid">
          {services.map((service) => (
            <button className="category-card-large" key={service.id} onClick={() => onNavigate('login')}>
              <img src={service.image} alt={t(`categories.${service.id}`, service.title)} />
              <div className="category-card-overlay">
                <h3>{t(`categories.${service.id}`, service.title)}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}

function Header({ page, onNavigate, theme, setTheme }: { page: Page; onNavigate: (page: Page) => void; theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void }) {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleNavigate = (newPage: Page) => {
    setIsMobileMenuOpen(false);
    onNavigate(newPage);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      alert(`Searching for: ${searchVal}`);
    }
  };

  return (
    <div className="header-wrapper">
      <header className="site-header-new">
        {/* Upper Row */}
        <div className="header-upper-row">
          <div className="header-left">
            <button className="brand brand-button" onClick={() => handleNavigate('home')} aria-label="Go to homepage">
              <img src={asset('fixam-white-bg.png')} alt="Fixam Logo" style={{ height: '32px', transform: 'scale(5)', transformOrigin: 'left center' }} />
            </button>
          </div>

          <form className="header-search-bar desktop-only" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder={t('search.placeholder') || 'Enter Keywords...'} 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button type="submit" className="search-btn">{t('search.btn') || 'Search'}</button>
          </form>

          <div className="header-right-actions">
            <div className="header-socials-desktop desktop-only">
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook"><Icon name="facebook" /></a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Twitter"><Icon name="twitter" /></a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram"><Icon name="instagram" /></a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn"><Icon name="linkedin" /></a>
            </div>

            <div className="language-dropdown-new desktop-only">
              <select 
                value={i18n.language} 
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                style={{ background: 'transparent', border: 'none', fontWeight: 800, cursor: 'pointer' }}
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
              </select>
            </div>

            <button 
              className="theme-toggle-btn-new desktop-only" 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle Theme"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 'auto', border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>

            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon name={isMobileMenuOpen ? "x" : "menu"} />
            </button>
          </div>
        </div>

        <div className="header-lower-row" style={{ justifyContent: 'center', position: 'relative' }}>
          <nav className="desktop-nav">
            <button className={`nav-link-new ${page === 'home' ? 'active' : ''}`} onClick={() => handleNavigate('home')}>{t('nav.home') || 'HOME'}</button>
            <span className="nav-divider">|</span>
            <button className={`nav-link-new ${page === 'services' ? 'active' : ''}`} onClick={() => handleNavigate('services')}>{t('nav.explore') || 'EXPLORE SERVICES'}</button>
            <span className="nav-divider">|</span>
            <button className={`nav-link-new ${page === 'guide' ? 'active' : ''}`} onClick={() => handleNavigate('guide')}>{t('nav.guide') || 'GUIDE'}</button>
            <span className="nav-divider">|</span>
            <button className={`nav-link-new ${page === 'about' ? 'active' : ''}`} onClick={() => handleNavigate('about')}>{t('nav.about') || 'ABOUT US'}</button>
          </nav>
          
          <div className="auth-buttons-desktop" style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'absolute', right: 0 }}>
             <button className="nav-link-new" onClick={() => handleNavigate('login')} style={{ fontWeight: '600' }}>{t('nav.signin') || 'SIGN IN'}</button>
             <button onClick={() => handleNavigate('register')} style={{ backgroundColor: '#14B8A6', color: '#FFF', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>GET STARTED</button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <nav className={`main-nav-mobile ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="mobile-search-wrapper">
            <input 
              type="text" 
              placeholder={t('search.placeholder') || 'Enter Keywords...'} 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button onClick={handleSearchSubmit} className="search-btn">{t('search.btn') || 'Search'}</button>
          </div>
          <button className="nav-link" onClick={() => handleNavigate('home')}>{t('nav.home') || 'HOME'}</button>
          <button className="nav-link" onClick={() => handleNavigate('services')}>{t('nav.explore') || 'EXPLORE SERVICES'}</button>
          <button className="nav-link" onClick={() => handleNavigate('guide')}>{t('nav.guide') || 'GUIDE'}</button>
          <button className="nav-link" onClick={() => handleNavigate('about')}>{t('nav.about') || 'ABOUT US'}</button>
          <button className="nav-link" onClick={() => handleNavigate('login')}>{t('nav.signin') || 'SIGN IN'}</button>
          <button className="nav-link" onClick={() => handleNavigate('register')} style={{ color: '#14B8A6' }}>GET STARTED</button>

          <div className="mobile-menu-settings" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', borderTop: '1px solid var(--line)', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon name="user" />
              <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} style={{ background: 'transparent', border: 'none', fontWeight: 800, color: 'var(--ink)' }}>
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
              </select>
            </div>
            <button className="theme-toggle-btn-new" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ background: 'transparent', border: 'none', color: 'var(--ink)' }}>
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
}

function Home({ onNavigate, livePros }: { onNavigate: (page: Page) => void; livePros: any[] }) {
  const { t } = useTranslation()
  const proGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only auto-scroll on mobile where scrollWidth > clientWidth
    const interval = setInterval(() => {
      if (proGridRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = proGridRef.current;
        if (scrollWidth > clientWidth) {
          const maxScroll = scrollWidth - clientWidth;
          const nextScroll = scrollLeft + clientWidth * 0.85; // scroll by ~85vw
          if (nextScroll >= maxScroll) {
            proGridRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            proGridRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
          }
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const displayedPros = livePros && livePros.length > 0 ? livePros : pros;

  return (
    <div className="landing-page">
      <section className="hero-video-section">
        <div className="hero-video-container">
          <img src={images.heroBg} alt="" className="hero-bg-image" />
          <div className="hero-video-overlay"></div>
          <div className="hero-copy video-copy reveal">
            <h1 className="hero-title">
              {t('hero.title1')} <span>{t('hero.title2')}</span> {t('hero.title3')}
            </h1>
          </div>
        </div>
      </section>

      {/* Quick Action Tools Section */}
      <section className="quick-actions-homepage">
        <SectionTitle title="Quick Action Tools" caption="Access platform features instantly to get things done." />
        <div className="quick-actions-homepage-grid">
          {[
            { title: t('quick_actions.post_task') || 'Post a Task', desc: t('quick_actions.post_task_desc') || 'Need something done? Create a task and get offers in minutes.', icon: 'briefcase' as IconName },
            { title: t('quick_actions.join_pro') || 'Join as Professional', desc: t('quick_actions.join_pro_desc') || 'Create a provider profile, upload certificates, and find work.', icon: 'wrench' as IconName },
            { title: t('quick_actions.explore') || 'Explore Services', desc: t('quick_actions.explore_desc') || 'Browse all professional services and check reviews.', icon: 'search' as IconName },
            { title: t('quick_actions.safety') || 'Trust & Safety', desc: t('quick_actions.safety_desc') || 'Learn how we verify users and keep transactions secure.', icon: 'shield' as IconName },
            { title: t('quick_actions.wallet') || 'Top Up Wallet', desc: t('quick_actions.wallet_desc') || 'Manage coins, purchase packages, and view transaction history.', icon: 'wallet' as IconName },
            { title: t('quick_actions.support') || 'Help & Support', desc: t('quick_actions.support_desc') || 'Get in touch with our 24/7 dedicated support team.', icon: 'message' as IconName }
          ].map((action, index) => (
            <div className="homepage-action-card" key={index} onClick={() => onNavigate('login')}>
              <h3>{action.title}</h3>
              <div className="action-card-icon">
                <Icon name={action.icon} />
              </div>
              <p>{action.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section full-width-section">
        <SectionTitle title={t('categories.title')} caption={t('categories.subtitle')} />
        <div className="category-scroll-wrapper">
          <div className="category-scroll-container marquee">
            {[...services, ...services].map((service, index) => (
              <button className="category-card-large" key={`${service.id}-${index}`} onClick={() => onNavigate('login')}>
                <img src={service.image} alt={t(`categories.${service.id}`, service.title)} />
                <div className="category-card-overlay">
                  <h3>{t(`categories.${service.id}`, service.title)}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="sticky-cards-section">
        <div className="sticky-cards-header">
          <SectionTitle title={t('how_it_works.title')} caption={t('how_it_works.subtitle')} />
        </div>
        <div className="sticky-cards-container">
          {[
            { title: t('how_it_works.step1'), desc: t('how_it_works.desc1'), image: images.onboardingExperts, textBg: 'var(--card-bg-1)', imageBg: 'var(--card-img-bg-1)' },
            { title: t('how_it_works.step2'), desc: t('how_it_works.desc2'), image: images.onboardingVerified, textBg: 'var(--card-bg-2)', imageBg: 'var(--card-img-bg-2)' },
            { title: t('how_it_works.step3'), desc: t('how_it_works.desc3'), image: images.onboardingBook, textBg: 'var(--card-bg-3)', imageBg: 'var(--card-img-bg-3)' },
            { title: t('how_it_works.step4'), desc: t('how_it_works.desc4'), image: images.onboardingPayment, textBg: 'var(--card-bg-4)', imageBg: 'var(--card-img-bg-4)' },
          ].map((card, index) => (
            <div className="sticky-card" key={index} style={{ top: `calc(120px + ${index * 24}px)`, zIndex: index + 1 }}>
              <div className="sticky-card-content">
                <div className="sticky-card-text" style={{ backgroundColor: card.textBg }}>
                  <span className="step-number">0{index + 1}</span>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <button className="card-cta-btn">
                    {index === 0 ? t('how_it_works.cta1') || 'Find Experts' : index === 1 ? t('how_it_works.cta2') || 'Verify Profile' : index === 2 ? t('how_it_works.cta3') || 'Book Now' : t('how_it_works.cta4') || 'Pay Securely'}
                  </button>
                </div>
                <div className="sticky-card-image" style={{ backgroundColor: card.imageBg }}>
                  <img src={card.image} alt={card.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionTitle title={t('pros.title')} caption={t('pros.subtitle')} className="pros-title" />
        <div className="pro-grid" ref={proGridRef}>
          {displayedPros.map((pro) => (
            <ProCard key={pro.name} pro={pro} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="center-actions">
          <button className="outline-button" onClick={() => onNavigate('login')}>{t('pros.view_all')}</button>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}

function About({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useTranslation();
  
  return (
    <div className="about-page">
      <div className="services-hero">
        <h1>{t('nav.about') || 'About Us'}</h1>
        <p>Fixam connects you with trusted, verified professionals who get the job done right the first time.</p>
      </div>
      <section className="section about-points" style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Our Mission</h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--muted)', lineHeight: '1.8' }}>
          We are on a mission to make life easier by bridging the gap between individuals who need services and verified professionals who provide them. We believe in quality, trust, and reliability above all else.
        </p>
      </section>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}

function Guide({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useTranslation();

  return (
    <div className="guide-page">
      <div className="services-hero">
        <h1>{t('guide.hero_title')}</h1>
        <p>{t('guide.hero_desc')}</p>
      </div>
      
      <section className="section guide-content" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        
        <div className="faq-item" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--ink)', marginBottom: '1rem' }}>{t('guide.register_title')}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            {t('guide.register_desc')}
          </p>
        </div>

        <div className="faq-item" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--ink)', marginBottom: '1rem' }}>{t('guide.find_provider_title')}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            {t('guide.find_provider_desc')}
            <br/><br/>
            1. {t('guide.find_provider_step1')}
            <br/>
            2. {t('guide.find_provider_step2')}
          </p>
        </div>

        <div className="faq-item" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--ink)', marginBottom: '1rem' }}>{t('guide.safety_title')}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            {t('guide.safety_desc')}
          </p>
        </div>

        <div className="center-actions" style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="primary-button" onClick={() => onNavigate('login')}>{t('guide.get_started_btn')}</button>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}

// Removed Login and Register to src/pages/Auth/

function Dashboard({ onNavigate, livePros, userRole, onRoleChange, theme, setTheme }: { onNavigate: (page: Page) => void; livePros: any[]; userRole: 'client' | 'pro'; onRoleChange?: (role: 'client' | 'pro') => void; theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void }) {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchVal, setSearchVal] = useState('');
  const displayedPros = livePros && livePros.length > 0 ? livePros : pros;

  // Client-specific interactive state hooks
  const [clientTasks, setClientTasks] = useState([
    { id: 1, title: 'Fix leaking pipe in kitchen', tag: 'Plumbing', price: '25,000 XAF', status: 'In Progress', bids: 3 },
    { id: 2, title: 'Installing ceiling fan in bedroom', tag: 'Electrical', price: '15,000 XAF', status: 'Pending Offers', bids: 5 },
    { id: 3, title: 'House deep cleaning', tag: 'Cleaning', price: '20,000 XAF', status: 'Completed', bids: 0 }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Plumbing');
  const [newTaskBudget, setNewTaskBudget] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const [clientBookings, setClientBookings] = useState([
    { id: 1, service: 'Plumbing Service', provider: 'Jeff Thomson', date: 'May 21', time: '9:00 AM', status: 'Confirmed', price: '25,000 XAF', image: images.proJeff },
    { id: 2, service: 'Electrical Installation', provider: 'Samuel Bright', date: 'May 22', time: '2:30 PM', status: 'Pending', price: '15,000 XAF', image: images.proSamuel },
    { id: 3, service: 'House deep cleaning', provider: 'Mary Clean', date: 'May 24', time: '11:00 AM', status: 'Confirmed', price: '20,000 XAF', image: images.proMary }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'pro', text: 'Hello Nounga, I can come over tomorrow at 9:00 AM. Does that work?', time: 'Yesterday' },
    { id: 2, sender: 'client', text: 'Yes, that works perfectly. Please bring your tools for piping.', time: 'Yesterday' },
    { id: 3, sender: 'pro', text: 'Great, see you then!', time: 'Yesterday' }
  ]);
  const [newMsgText, setNewMsgText] = useState('');
  const [activeChatUser, setActiveChatUser] = useState('Jeff Thomson');
  
  const [savedProsState, setSavedProsState] = useState([
    { id: 1, name: 'Jeff Thomson', role: 'Plumbing Specialist', rating: '4.8', distance: '4.2 km away', image: images.proJeff },
    { id: 2, name: 'Samuel Bright', role: 'Electrician', rating: '4.7', distance: '3.6 km away', image: images.proSamuel },
    { id: 3, name: 'Mary Clean', role: 'Cleaning Expert', rating: '4.9', distance: '2.1 km away', image: images.proMary }
  ]);

  // Find Services interactive states
  const [findServicesSearch, setFindServicesSearch] = useState('');
  const [findServicesLoc, setFindServicesLoc] = useState('Douala, Cameroon');
  const [findServicesRating, setFindServicesRating] = useState('All');
  const [findServicesCat, setFindServicesCat] = useState('All Categories');
  const [findServicesPrice, setFindServicesPrice] = useState(5);
  const [availNow, setAvailNow] = useState(false);
  const [availToday, setAvailToday] = useState(false);
  const [serviceTypeInPerson, setServiceTypeInPerson] = useState(true);
  const [serviceTypeRemote, setServiceTypeRemote] = useState(false);

  const [profileActiveSubTab, setProfileActiveSubTab] = useState('Overview');

  if (userRole === 'client') {
    const clientNavItems = [
      { name: 'Dashboard', icon: 'home' as IconName },
      { name: 'Find Services', icon: 'search' as IconName },
      { name: 'My Bookings', icon: 'calendar' as IconName },
      { name: 'Messages', icon: 'chat' as IconName, badge: 3 },
      { name: 'Saved Providers', icon: 'star' as IconName },
      { name: 'My Tasks', icon: 'briefcase' as IconName },
      { name: 'Reviews', icon: 'check' as IconName },
      { name: 'Wallet & Coins', icon: 'wallet' as IconName, walletBadge: '1,250' },
      { name: 'My Referrals', icon: 'user' as IconName },
      { name: 'Notifications', icon: 'bell' as IconName, badge: 8 },
      { name: 'Settings', icon: 'wrench' as IconName },
      { name: 'Help Center', icon: 'message' as IconName }
    ];

    const handleNavClick = (itemName: string) => {
      setIsSidebarOpen(false);
      if (itemName === 'Help Center') {
        alert('Support flow coming soon!');
      } else {
        setActiveTab(itemName);
      }
    };

    // Sub-view rendering methods
    const renderRecommendedProviders = () => {
      return (
        <div className="dash-panel-premium recommend-panel-premium">
          <div className="dash-panel-header-new">
            <h2>Recommended Professionals</h2>
            <button className="panel-link" onClick={() => setActiveTab('Find Services')}>View All</button>
          </div>
          <div className="recommended-grid-premium">
            {displayedPros.slice(0, 3).map((pro, index) => (
              <div className="recommended-card-premium" key={index}>
                <div className="card-top-header">
                  <span className="verify-badge"><Icon name="shield" /> Verified</span>
                  <button className="btn-heart-save" onClick={() => alert(`${pro.name} saved!`)}>
                    <Icon name="star" />
                  </button>
                </div>
                <div className="avatar-wrapper">
                  <img src={pro.image} alt={pro.name} />
                  <span className="status-indicator online"></span>
                </div>
                <h4>{pro.name}</h4>
                <span className="provider-cat-badge">{pro.role}</span>
                <div className="rating-row-premium">
                  <Icon name="star" />
                  <span className="rating-num">{pro.rating}</span>
                  <span className="rating-count">(100+ jobs)</span>
                </div>
                <div className="price-tag-row">
                  <span className="price-val">1 coin <small>/ hr</small></span>
                  <span className="distance-val"><Icon name="location" /> {pro.distance}</span>
                </div>
                <div className="card-actions-row">
                  <button className="btn-card-primary" onClick={() => {
                    setActiveTab('Messages');
                    setActiveChatUser(pro.name);
                  }}>Chat Now</button>
                  <button className="btn-card-secondary" onClick={() => {
                    const newBk = {
                      id: Date.now(),
                      service: pro.role,
                      provider: pro.name,
                      date: 'May 26',
                      time: '10:00 AM',
                      status: 'Pending',
                      price: '1 coin',
                      image: pro.image
                    };
                    setClientBookings([newBk, ...clientBookings]);
                    alert(`Booking requested with ${pro.name}! Check 'My Bookings' tab.`);
                  }}>Book</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderMyBookings = () => {
      return (
        <div className="dash-panel-premium full-width-panel animate-fade-in">
          <div className="dash-panel-header-new">
            <h2>My Bookings</h2>
            <button className="btn-tab-action" onClick={() => {
              const dateStr = prompt("Enter booking date (e.g. May 25):", "May 25");
              if (dateStr) {
                const newBk = {
                  id: Date.now(),
                  service: 'General Maintenance',
                  provider: 'Jeff Thomson',
                  date: dateStr,
                  time: '12:00 PM',
                  status: 'Pending',
                  price: '25,000 XAF',
                  image: images.proJeff
                };
                setClientBookings([newBk, ...clientBookings]);
              }
            }}>+ New Booking</button>
          </div>
          <div className="bookings-detailed-list">
            {clientBookings.map((bk) => (
              <div className="booking-detailed-card" key={bk.id}>
                <div className="booking-card-left">
                  <img src={bk.image} alt={bk.provider} />
                  <div className="booking-info-details">
                    <h3>{bk.service}</h3>
                    <p className="provider-name">Provider: <strong>{bk.provider}</strong></p>
                    <p className="price-lbl-detail">Price: <span>{bk.price}</span></p>
                  </div>
                </div>
                <div className="booking-card-mid">
                  <div className="schedule-badge">
                    <Icon name="calendar" />
                    <span>{bk.date} • {bk.time}</span>
                  </div>
                  <span className={`booking-status-badge ${bk.status.toLowerCase()}`}>
                    {bk.status}
                  </span>
                </div>
                <div className="booking-card-actions">
                  <button className="btn-chat-booking" onClick={() => {
                    setActiveTab('Messages');
                    setActiveChatUser(bk.provider);
                  }}>
                    <Icon name="chat" /> Chat
                  </button>
                  {bk.status !== 'Completed' && (
                    <>
                      <button className="btn-reschedule-booking" onClick={() => {
                        const newD = prompt("Enter new date:", bk.date);
                        if (newD) {
                          setClientBookings(clientBookings.map(b => b.id === bk.id ? {...b, date: newD} : b));
                        }
                      }}>Reschedule</button>
                      <button className="btn-cancel-booking" onClick={() => {
                        if (confirm("Cancel this booking?")) {
                          setClientBookings(clientBookings.filter(b => b.id !== bk.id));
                        }
                      }}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const handlePostTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTaskTitle || !newTaskBudget) {
        alert("Please fill in the title and budget");
        return;
      }
      const newT = {
        id: Date.now(),
        title: newTaskTitle,
        tag: newTaskCategory,
        price: Number(newTaskBudget).toLocaleString() + " XAF",
        status: 'Pending Offers',
        bids: 2
      };
      setClientTasks([newT, ...clientTasks]);
      setNewTaskTitle('');
      setNewTaskBudget('');
      setNewTaskDesc('');
      alert("Task published successfully!");
    };

    const renderMyTasks = () => {
      return (
        <div className="tasks-container-grid animate-fade-in">
          <div className="dash-panel-premium task-list-panel">
            <div className="dash-panel-header-new">
              <h2>My Posted Tasks</h2>
            </div>
            <div className="posted-tasks-list">
              {clientTasks.map((tk) => (
                <div className="task-detailed-card" key={tk.id}>
                  <div className="task-card-header">
                    <span className="task-tag">{tk.tag}</span>
                    <strong className="task-price">{tk.price}</strong>
                  </div>
                  <h3>{tk.title}</h3>
                  <div className="task-card-footer">
                    <span className={`task-status-pill ${tk.status.toLowerCase().replace(' ', '-')}`}>
                      {tk.status}
                    </span>
                    <span className="task-bids-count">
                      <Icon name="user" /> {tk.bids} offers received
                    </span>
                  </div>
                  <div className="task-actions-row">
                    {tk.bids > 0 && (
                      <button className="btn-view-offers" onClick={() => alert(`Viewing ${tk.bids} offers from local professionals.`)}>
                        View Offers
                      </button>
                    )}
                    <button className="btn-delete-task" onClick={() => {
                      if (confirm("Are you sure you want to remove this task?")) {
                        setClientTasks(clientTasks.filter(t => t.id !== tk.id));
                      }
                    }}>Cancel Task</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-panel-premium post-task-form-panel">
            <h2>Post a New Task</h2>
            <p>Describe what you need and local service providers will send you proposals.</p>
            <form onSubmit={handlePostTask} className="quick-post-task-form">
              <label>
                <span>Task Title</span>
                <input 
                  type="text" 
                  placeholder="e.g. Fix kitchen faucet leak" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </label>
              <div className="form-row-2">
                <label>
                  <span>Category</span>
                  <select value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)}>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Painting">Painting</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="AC Repair">AC Repair</option>
                  </select>
                </label>
                <label>
                  <span>Budget (XAF)</span>
                  <input 
                    type="number" 
                    placeholder="e.g. 20000" 
                    value={newTaskBudget}
                    onChange={(e) => setNewTaskBudget(e.target.value)}
                    required
                  />
                </label>
              </div>
              <label>
                <span>Description Details</span>
                <textarea 
                  rows={4}
                  placeholder="Provide details about the job..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                />
              </label>
              <button type="submit" className="btn-post-submit">Publish Task</button>
            </form>
          </div>
        </div>
      );
    };

    const renderWalletAndCoins = () => {
      const coinPackages = [
        { name: 'Starter Pack', coins: 10, price: '5,000 XAF', popular: false },
        { name: 'Value Pack', coins: 50, price: '22,000 XAF', popular: true },
        { name: 'Pro Pack', coins: 100, price: '40,000 XAF', popular: false }
      ];

      return (
        <div className="wallet-tab-grid animate-fade-in">
          <div className="wallet-left-column">
            <div className="dash-panel-premium main-wallet-card-premium">
              <div className="card-top-wallet">
                <div>
                  <span className="wallet-lbl">Available Coins</span>
                  <strong className="wallet-big-val">1,250</strong>
                </div>
                <div className="wallet-chip"><Icon name="wallet" /></div>
              </div>
              <div className="wallet-pills-row">
                <div className="wallet-pill-stat">
                  <span>Total Earned</span>
                  <strong>1,450</strong>
                </div>
                <div className="wallet-pill-stat">
                  <span>Total Spent</span>
                  <strong>200</strong>
                </div>
              </div>
            </div>

            {/* Spending Overview Chart */}
            <div className="dash-panel-premium spending-chart-panel">
              <div className="dash-panel-header-new">
                <h2>Spending Overview</h2>
                <select className="select-month">
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
              <div className="chart-content-dash">
                <div className="chart-svg-wrapper">
                  <svg width="140" height="140" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--line)" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#14B8A6" strokeWidth="3.5" strokeDasharray="48 52" strokeDashoffset="100" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3.5" strokeDasharray="24 76" strokeDashoffset="52" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeDasharray="16 84" strokeDashoffset="28" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#A855F7" strokeWidth="3.5" strokeDasharray="12 88" strokeDashoffset="12" />
                  </svg>
                  <div className="chart-inner-text">
                    <span className="chart-num">25</span>
                    <span className="chart-lbl">Total Coins Used</span>
                  </div>
                </div>
                <div className="chart-legend-list">
                  <div className="legend-item-dash">
                    <span className="legend-color-dot" style={{ backgroundColor: '#14B8A6' }}></span>
                    <span>Booking Payments</span>
                    <span className="legend-val">12 coins (48%)</span>
                  </div>
                  <div className="legend-item-dash">
                    <span className="legend-color-dot" style={{ backgroundColor: '#3B82F6' }}></span>
                    <span>Urgent Bookings</span>
                    <span className="legend-val">6 coins (24%)</span>
                  </div>
                  <div className="legend-item-dash">
                    <span className="legend-color-dot" style={{ backgroundColor: '#F59E0B' }}></span>
                    <span>Service Add-ons</span>
                    <span className="legend-val">4 coins (16%)</span>
                  </div>
                  <div className="legend-item-dash">
                    <span className="legend-color-dot" style={{ backgroundColor: '#A855F7' }}></span>
                    <span>Other</span>
                    <span className="legend-val">3 coins (12%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dash-panel-premium transactions-panel">
              <h2>Transaction History</h2>
              <div className="transactions-table-wrapper">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>May 20, 2026</td>
                      <td>Booked Plumber Pro</td>
                      <td><span className="tx-type spend">Spend</span></td>
                      <td>-3 coins</td>
                    </tr>
                    <tr>
                      <td>May 18, 2026</td>
                      <td>Referral Bonus (Roman)</td>
                      <td><span className="tx-type earn">Earn</span></td>
                      <td>+1 coin</td>
                    </tr>
                    <tr>
                      <td>May 15, 2026</td>
                      <td>Coins Top Up (Starter Pack)</td>
                      <td><span className="tx-type topup">Top Up</span></td>
                      <td>+10 coins</td>
                    </tr>
                    <tr>
                      <td>May 10, 2026</td>
                      <td>Booked CleanMaster</td>
                      <td><span className="tx-type spend">Spend</span></td>
                      <td>-5 coins</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="wallet-right-column">
            <div className="dash-panel-premium purchase-packages-panel">
              <h2>Buy Coins Package</h2>
              <p>Top up your wallet with coins to book instant professional services.</p>
              <div className="coin-packages-list">
                {coinPackages.map((pkg, idx) => (
                  <div className={`package-card ${pkg.popular ? 'popular' : ''}`} key={idx}>
                    {pkg.popular && <span className="popular-badge">Most Popular</span>}
                    <h3>{pkg.name}</h3>
                    <div className="package-coins">
                      <strong>{pkg.coins}</strong> <span>Coins</span>
                    </div>
                    <span className="package-price">{pkg.price}</span>
                    <button className="btn-buy-package" onClick={() => alert(`Purchase flow for ${pkg.name} initiated!`)}>Buy Package</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderNotifications = () => {
      return (
        <div className="dash-panel-premium full-width-panel animate-fade-in">
          <div className="dash-panel-header-new">
            <h2>Notifications Log</h2>
            <button className="panel-link" onClick={() => alert('All notifications marked as read')}>Mark all as read</button>
          </div>
          <div className="activity-items-list large-list">
            <div className="activity-item-row a-confirmed">
              <div className="activity-icon-container"><Icon name="calendar" /></div>
              <div className="activity-details">
                <h4 className="activity-title">You booked Plumber Pro</h4>
                <p className="activity-subtitle">Booking confirmed for tomorrow at 9:00 AM</p>
              </div>
              <span className="activity-time">2 min ago</span>
            </div>

            <div className="activity-item-row a-accepted">
              <div className="activity-icon-container"><Icon name="check" /></div>
              <div className="activity-details">
                <h4 className="activity-title">John Doe accepted your request</h4>
                <p className="activity-subtitle">Electrical Installation proposal accepted</p>
              </div>
              <span className="activity-time">15 min ago</span>
            </div>

            <div className="activity-item-row a-payment">
              <div className="activity-icon-container"><Icon name="wallet" /></div>
              <div className="activity-details">
                <h4 className="activity-title">Payment with coins completed</h4>
                <p className="activity-subtitle">3 coins successfully deducted for Plumbing booking</p>
              </div>
              <span className="activity-time">1 hour ago</span>
            </div>

            <div className="activity-item-row a-message">
              <div className="activity-icon-container"><Icon name="chat" /></div>
              <div className="activity-details">
                <h4 className="activity-title">New message from CleanMaster</h4>
                <p className="activity-subtitle">"Hey Nounga, let me know if we need extra cleaning agents..."</p>
              </div>
              <span className="activity-time">2 hours ago</span>
            </div>

            <div className="activity-item-row a-referral">
              <div className="activity-icon-container"><Icon name="star" /></div>
              <div className="activity-details">
                <h4 className="activity-title">You earned 1 coin from referral</h4>
                <p className="activity-subtitle">Your friend Roman joined Fixam</p>
              </div>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      );
    };

    const handleSendMsg = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMsgText.trim()) return;
      const newM = {
        id: Date.now(),
        sender: 'client',
        text: newMsgText,
        time: 'Just now'
      };
      setChatMessages([...chatMessages, newM]);
      setNewMsgText('');
      
      // Auto-reply simulation
      setTimeout(() => {
        const reply = {
          id: Date.now() + 1,
          sender: 'pro',
          text: `Thanks for the message! I will get back to you shortly regarding the job request.`,
          time: 'Just now'
        };
        setChatMessages(prev => [...prev, reply]);
      }, 1500);
    };

    const renderMessagesView = () => {
      const chatUsers = [
        { name: 'Jeff Thomson', role: 'Plumbing Specialist', active: activeChatUser === 'Jeff Thomson', unread: 0, image: images.proJeff },
        { name: 'Samuel Bright', role: 'Electrician', active: activeChatUser === 'Samuel Bright', unread: 1, image: images.proSamuel },
        { name: 'Mary Clean', role: 'Cleaning Expert', active: activeChatUser === 'Mary Clean', unread: 0, image: images.proMary }
      ];

      return (
        <div className="messages-grid-layout animate-fade-in">
          <div className="dash-panel-premium chat-sidebar-panel">
            <h2>Inbox Chats</h2>
            <div className="chats-users-list">
              {chatUsers.map((cu, idx) => (
                <button 
                  className={`chat-user-row ${cu.name === activeChatUser ? 'active' : ''}`}
                  key={idx}
                  onClick={() => setActiveChatUser(cu.name)}
                >
                  <img src={cu.image} alt={cu.name} />
                  <div className="chat-user-info">
                    <h4>{cu.name}</h4>
                    <span>{cu.role}</span>
                  </div>
                  {cu.unread > 0 && <span className="chat-unread-dot">{cu.unread}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="dash-panel-premium chat-viewport-panel">
            <div className="chat-header-row">
              <img src={chatUsers.find(u => u.name === activeChatUser)?.image || images.proJeff} alt={activeChatUser} />
              <div>
                <h3>{activeChatUser}</h3>
                <span className="online-badge">• Online</span>
              </div>
            </div>

            <div className="chat-messages-scroll">
              {chatMessages.map((msg) => (
                <div className={`msg-bubble-row ${msg.sender}`} key={msg.id}>
                  <div className="bubble-content">
                    <p>{msg.text}</p>
                    <span className="bubble-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMsg} className="chat-input-bar">
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newMsgText}
                onChange={(e) => setNewMsgText(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      );
    };

    const renderSavedProviders = () => {
      return (
        <div className="dash-panel-premium full-width-panel animate-fade-in">
          <div className="dash-panel-header-new">
            <h2>Saved Providers</h2>
            <button className="panel-link" onClick={() => setActiveTab('Find Services')}>Browse More</button>
          </div>
          {savedProsState.length === 0 ? (
            <p>No saved providers yet.</p>
          ) : (
            <div className="saved-providers-grid">
              {savedProsState.map((pro, index) => (
                <div className="recommended-card-premium saved-card" key={index}>
                  <div className="avatar-wrapper">
                    <img src={pro.image} alt={pro.name} />
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
                      onClick={() => {
                        setActiveTab('Messages');
                        setActiveChatUser(pro.name);
                      }}
                    >
                      Chat
                    </button>
                    <button 
                      className="outline-button"
                      style={{ padding: '0.4rem', border: '1px solid var(--line)', minHeight: 'auto', borderRadius: '6px' }}
                      onClick={() => {
                        setSavedProsState(savedProsState.filter(p => p.id !== pro.id));
                        alert(`${pro.name} removed from saved.`);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    const renderSettingsView = () => {
      return (
        <div className="dash-panel-premium settings-panel-premium animate-fade-in">
          <h2>Client Settings</h2>
          <form className="settings-form-premium" onSubmit={(e) => { e.preventDefault(); alert('Settings saved successfully!'); }}>
            <div className="form-grid-2">
              <label>
                <span>Full Name</span>
                <input type="text" defaultValue="Nounga Joseph" />
              </label>
              <label>
                <span>Email Address</span>
                <input type="email" defaultValue="joseph.nounga@gmail.com" />
              </label>
            </div>
            <div className="form-grid-2">
              <label>
                <span>Phone Number</span>
                <input type="text" defaultValue="+237 677 88 99 00" />
              </label>
              <label>
                <span>Language preference</span>
                <select defaultValue="English">
                  <option value="English">English</option>
                  <option value="French">French</option>
                </select>
              </label>
            </div>
            <label>
              <span>Address / Location Area</span>
              <input type="text" defaultValue="Douala, Cameroon" />
            </label>
            
            <div className="settings-checkbox-row">
              <input type="checkbox" id="email-notifs" defaultChecked />
              <label htmlFor="email-notifs">Receive email notifications for booking updates</label>
            </div>
            <div className="settings-checkbox-row">
              <input type="checkbox" id="sms-notifs" defaultChecked />
              <label htmlFor="sms-notifs">Receive SMS text notifications for urgent offers</label>
            </div>

            <button type="submit" className="btn-settings-submit">Save Preferences</button>
          </form>
        </div>
      );
    };

    const renderReferralsView = () => {
      return (
        <div className="referrals-grid-layout animate-fade-in">
          <div className="dash-panel-premium invite-friends-panel">
            <h2>Invite Friends, Earn Coins!</h2>
            <p>Give your friends 1 coin to try Fixam, and you will receive 1 coin when they complete their first booking.</p>
            <div className="referral-link-box">
              <input type="text" readOnly value="https://fixam.com/invite/nounga_joseph_77" />
              <button type="button" onClick={() => {
                navigator.clipboard.writeText("https://fixam.com/invite/nounga_joseph_77");
                alert("Referral link copied to clipboard!");
              }}>Copy</button>
            </div>
            <div className="referral-stats-grid">
              <div className="ref-stat-card">
                <span>Total Invites</span>
                <strong>5</strong>
              </div>
              <div className="ref-stat-card">
                <span>Active Referrals</span>
                <strong>3</strong>
              </div>
              <div className="ref-stat-card">
                <span>Coins Earned</span>
                <strong>3</strong>
              </div>
            </div>
          </div>

          <div className="dash-panel-premium referrals-list-panel">
            <h2>Referred Friends</h2>
            <div className="referred-friends-list">
              <div className="referred-friend-row">
                <div>
                  <h4>Roman S.</h4>
                  <span>Joined May 19, 2026</span>
                </div>
                <span className="ref-status completed">Coins Earned</span>
              </div>
              <div className="referred-friend-row">
                <div>
                  <h4>Carine M.</h4>
                  <span>Joined May 15, 2026</span>
                </div>
                <span className="ref-status completed">Coins Earned</span>
              </div>
              <div className="referred-friend-row">
                <div>
                  <h4>David N.</h4>
                  <span>Joined May 10, 2026</span>
                </div>
                <span className="ref-status pending">Booking Pending</span>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderReviewsView = () => {
      return (
        <div className="dash-panel-premium reviews-panel-premium animate-fade-in">
          <h2>My Service Reviews</h2>
          <div className="reviews-list-premium">
            <div className="review-item-premium">
              <div className="review-header">
                <div>
                  <h4>Jeff Thomson</h4>
                  <span>Plumbing Service</span>
                </div>
                <div className="review-stars-premium">
                  <Icon name="star" />
                  <Icon name="star" />
                  <Icon name="star" />
                  <Icon name="star" />
                  <Icon name="star" />
                  <strong>5.0</strong>
                </div>
              </div>
              <p className="review-comment">"Excellent work! Jeff was very professional and fixed the leak in my kitchen pipe quickly. Highly recommended!"</p>
              <span className="review-date">May 10, 2026</span>
            </div>

            <div className="review-item-premium">
              <div className="review-header">
                <div>
                  <h4>Mary Clean</h4>
                  <span>Cleaning Expert</span>
                </div>
                <div className="review-stars-premium">
                  <Icon name="star" />
                  <Icon name="star" />
                  <Icon name="star" />
                  <Icon name="star" />
                  <Icon name="star" />
                  <strong>4.8</strong>
                </div>
              </div>
              <p className="review-comment">"Mary and her team did a fantastic job deep cleaning my house. It was spotless. Only small issue was they arrived 10 mins late, but overall great."</p>
              <span className="review-date">April 28, 2026</span>
            </div>
          </div>
        </div>
      );
    };

    const renderMyProfile = () => {
      return (
        <div className="profile-tab-container animate-fade-in">
          <div className="profile-header-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar-big">
                <img src={images.proJeff} alt="Nounga" />
                <button className="btn-change-avatar" aria-label="Change Avatar" onClick={() => alert('Change avatar flow coming soon!')}>
                  <Icon name="user" />
                </button>
              </div>
              <div className="profile-user-headline">
                <div className="profile-name-row">
                  <h2>Nounga</h2>
                  <span className="badge-verified"><Icon name="shield" /> Verified</span>
                </div>
                <p className="profile-email-lbl"><Icon name="message" /> nounga@gmail.com</p>
                <p className="profile-phone-lbl"><Icon name="bell" /> +237 6 98 76 54 32</p>
                <p className="profile-loc-lbl"><Icon name="location" /> Douala, Cameroon</p>
                <span className="profile-role-tag">Client Account</span>
              </div>
            </div>
            
            <div className="profile-header-stats-row">
              <div className="profile-header-stat-box">
                <span className="stat-lbl">Member Since</span>
                <strong className="stat-val"><Icon name="calendar" /> May 15, 2024</strong>
              </div>
              <div className="profile-header-stat-box">
                <span className="stat-lbl">Account Status</span>
                <strong className="stat-val status-active"><span className="dot-indicator"></span> Active</strong>
              </div>
              <div className="profile-header-stat-box">
                <span className="stat-lbl">Account Security</span>
                <strong className="stat-val security-strong"><Icon name="shield" /> Strong</strong>
              </div>
            </div>

            <button className="btn-edit-profile-header" onClick={() => alert('Edit Profile modal coming soon!')}>
              <Icon name="wrench" /> Edit Profile
            </button>
          </div>

          <div className="profile-sub-tabs">
            {['Overview', 'Bookings', 'Reviews', 'Payments', 'Saved Providers', 'Preferences', 'Settings'].map((subTab) => (
              <button 
                key={subTab} 
                className={`profile-sub-tab-btn ${profileActiveSubTab === subTab ? 'active' : ''}`}
                onClick={() => setProfileActiveSubTab(subTab)}
              >
                {subTab}
              </button>
            ))}
          </div>

          {profileActiveSubTab === 'Overview' && (
            <div className="profile-overview-layout">
              <div className="profile-overview-left">
                <div className="dash-panel-premium p-about-panel">
                  <h3>About Me</h3>
                  <p>I'm a business owner based in Douala. I use Fixam to find reliable and verified professionals for all my home and office needs. Quality service and trust are my top priorities.</p>
                </div>

                <div className="dash-panel-premium p-info-panel">
                  <h3>Personal Information</h3>
                  <div className="info-list-grid">
                    <div className="info-list-row">
                      <span className="info-lbl"><Icon name="user" /> Full Name</span>
                      <strong className="info-val">Nounga</strong>
                    </div>
                    <div className="info-list-row">
                      <span className="info-lbl"><Icon name="message" /> Email Address</span>
                      <strong className="info-val">nounga@gmail.com <span className="verified-text"><Icon name="check" /> Verified</span></strong>
                    </div>
                    <div className="info-list-row">
                      <span className="info-lbl"><Icon name="bell" /> Phone Number</span>
                      <strong className="info-val">+237 6 98 76 54 32 <span className="verified-text"><Icon name="check" /> Verified</span></strong>
                    </div>
                    <div className="info-list-row">
                      <span className="info-lbl"><Icon name="location" /> Location</span>
                      <strong className="info-val">Douala, Littoral, Cameroon</strong>
                    </div>
                    <div className="info-list-row">
                      <span className="info-lbl"><Icon name="wrench" /> Language</span>
                      <strong className="info-val">English, Français</strong>
                    </div>
                    <div className="info-list-row">
                      <span className="info-lbl"><Icon name="calendar" /> Timezone</span>
                      <strong className="info-val">GMT+1 (West Africa Time)</strong>
                    </div>
                  </div>
                </div>

                <div className="dash-panel-premium p-activity-panel">
                  <div className="panel-title-row">
                    <h3>Recent Activity</h3>
                    <button className="link-view-all" onClick={() => setActiveTab('Notifications')}>View All</button>
                  </div>
                  <div className="activity-items-list-p">
                    <div className="activity-item-row-p">
                      <div className="activity-icon-p a-confirmed"><Icon name="calendar" /></div>
                      <div className="activity-details-p">
                        <h4>You booked Plumber Pro</h4>
                        <span>Booking confirmed</span>
                      </div>
                      <span className="activity-time-p">2 min ago</span>
                    </div>

                    <div className="activity-item-row-p">
                      <div className="activity-icon-p a-accepted"><Icon name="check" /></div>
                      <div className="activity-details-p">
                        <h4>John Doe accepted your request</h4>
                        <span>Electrical Installation</span>
                      </div>
                      <span className="activity-time-p">15 min ago</span>
                    </div>

                    <div className="activity-item-row-p">
                      <div className="activity-icon-p a-payment"><Icon name="wallet" /></div>
                      <div className="activity-details-p">
                        <h4>Payment with coins completed</h4>
                        <span>3 coins used</span>
                      </div>
                      <span className="activity-time-p">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-overview-right">
                <div className="dash-panel-premium p-summary-panel">
                  <h3>Account Summary</h3>
                  <div className="summary-widgets-grid">
                    <div className="summary-widget-box s-bookings">
                      <div className="widget-icon"><Icon name="calendar" /></div>
                      <div className="widget-content">
                        <strong>12</strong>
                        <span>Total Bookings</span>
                      </div>
                    </div>
                    <div className="summary-widget-box s-active">
                      <div className="widget-icon"><Icon name="briefcase" /></div>
                      <div className="widget-content">
                        <strong>4</strong>
                        <span>Active Bookings</span>
                      </div>
                    </div>
                    <div className="summary-widget-box s-completed">
                      <div className="widget-icon"><Icon name="check" /></div>
                      <div className="widget-content">
                        <strong>8</strong>
                        <span>Completed Jobs</span>
                      </div>
                    </div>
                    <div className="summary-widget-box s-rating">
                      <div className="widget-icon"><Icon name="star" /></div>
                      <div className="widget-content">
                        <strong>4.8</strong>
                        <span>Average Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {profileActiveSubTab !== 'Overview' && (
            <div className="dash-panel-premium" style={{marginTop: '2rem'}}>
              <h3>{profileActiveSubTab}</h3>
              <p>Content for {profileActiveSubTab} will be displayed here.</p>
            </div>
          )}
        </div>
      );
    };

    const renderFindServices = () => {
      // Mock providers list matching screenshot 2
      const providersList = [
        {
          name: 'CleanMaster',
          role: 'Cleaning Service',
          rating: '4.8',
          reviews: 124,
          location: 'Douala, Cameroon',
          badge: 'Top Rated',
          desc: 'Professional cleaning services for homes, offices and commercial spaces.',
          tags: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning'],
          price: '1 coin',
          image: images.proMary,
          verified: true
        },
        {
          name: 'ElectroFix',
          role: 'Electrical Service',
          rating: '4.9',
          reviews: 98,
          location: 'Douala, Cameroon',
          badge: 'Top Rated',
          desc: 'All electrical installation, repair and maintenance services.',
          tags: ['Installation', 'Wiring', 'Repair'],
          price: '1 coin',
          image: images.proSamuel,
          verified: true
        },
        {
          name: 'Plumber Pro',
          role: 'Plumbing Service',
          rating: '4.7',
          reviews: 86,
          location: 'Douala, Cameroon',
          badge: 'Popular',
          desc: 'Expert plumbing services for residential and commercial needs.',
          tags: ['Pipe Repair', 'Installation', 'Leak Fix'],
          price: '1 coin',
          image: images.proJeff,
          verified: true
        },
        {
          name: 'PaintPro',
          role: 'Painting Service',
          rating: '4.6',
          reviews: 72,
          location: 'Douala, Cameroon',
          badge: 'Rising Star',
          desc: 'Professional painting services with quality finishing.',
          tags: ['Interior Painting', 'Exterior Painting', 'Wall Painting'],
          price: '1 coin',
          image: images.proPeter,
          verified: true
        }
      ];

      // Filter logic simulation
      const filteredProviders = providersList.filter(p => {
        if (findServicesSearch && !p.name.toLowerCase().includes(findServicesSearch.toLowerCase()) && !p.role.toLowerCase().includes(findServicesSearch.toLowerCase())) {
          return false;
        }
        if (findServicesCat !== 'All Categories' && p.role.toLowerCase() !== findServicesCat.toLowerCase()) {
          return false;
        }
        if (findServicesRating === '4.5 & up' && Number(p.rating) < 4.5) return false;
        if (findServicesRating === '4.0 & up' && Number(p.rating) < 4.0) return false;
        
        return true;
      });

      return (
        <div className="find-services-page animate-fade-in">
          <div className="find-services-header">
            <h2>Find Services</h2>
            <p>Find verified professionals for any service you need.</p>
          </div>

          <div className="search-bar-row-fs">
            <div className="input-wrapper-fs query-input">
              <Icon name="search" />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                value={findServicesSearch}
                onChange={(e) => setFindServicesSearch(e.target.value)}
              />
            </div>
            <div className="input-wrapper-fs location-input">
              <Icon name="location" />
              <input 
                type="text" 
                placeholder="Location" 
                value={findServicesLoc}
                onChange={(e) => setFindServicesLoc(e.target.value)}
              />
            </div>
            <button className="btn-search-fs" onClick={() => alert('Search initiated!')}>Search</button>
          </div>

          <div className="popular-searches-row-fs">
            <span>Popular Searches:</span>
            {['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'AC Repair', 'Carpentry'].map(keyword => (
              <button 
                type="button" 
                key={keyword}
                onClick={() => setFindServicesSearch(keyword)}
                className="popular-search-tag-fs"
              >
                {keyword}
              </button>
            ))}
          </div>

          <div className="categories-scroll-row-fs">
            <div className="categories-scroll-wrapper-fs">
              {[
                { name: 'Cleaning', count: 128, icon: 'cleaning' as IconName },
                { name: 'Plumbing', count: 95, icon: 'plumbing' as IconName },
                { name: 'Electrical', count: 112, icon: 'electrical' as IconName },
                { name: 'Painting', count: 78, icon: 'painting' as IconName },
                { name: 'Carpentry', count: 63, icon: 'wrench' as IconName },
                { name: 'AC Repair', count: 54, icon: 'appliance' as IconName },
                { name: 'Pest Control', count: 42, icon: 'shield' as IconName }
              ].map((c) => (
                <button 
                  type="button" 
                  key={c.name}
                  onClick={() => setFindServicesCat(c.name + ' Service')}
                  className={`category-scroll-item-fs ${findServicesCat === c.name + ' Service' ? 'active' : ''}`}
                >
                  <div className="cat-icon-fs"><Icon name={c.icon} /></div>
                  <div className="cat-details-fs">
                    <strong>{c.name}</strong>
                    <span>{c.count} providers</span>
                  </div>
                </button>
              ))}
              <button type="button" className="category-scroll-item-fs more-btn" onClick={() => setFindServicesCat('All Categories')}>
                <div className="cat-icon-fs"><Icon name="menu" /></div>
                <div className="cat-details-fs">
                  <strong>More</strong>
                </div>
              </button>
            </div>
          </div>

          <div className="fs-directory-layout">
            <div className="fs-directory-left">
              <div className="fs-results-header">
                <span>Showing {filteredProviders.length} providers</span>
                <div className="fs-sort-dropdown">
                  <span>Sort by: </span>
                  <select>
                    <option>Recommended</option>
                    <option>Rating: High to Low</option>
                    <option>Price: Low to High</option>
                  </select>
                </div>
              </div>

              <div className="fs-providers-list">
                {filteredProviders.map((p, idx) => (
                  <div className="fs-provider-card" key={idx}>
                    <img src={p.image} alt={p.name} className="prov-avatar" />
                    
                    <div className="prov-card-middle">
                      <div className="prov-header-row">
                        <h3>{p.name}</h3>
                        {p.verified && <span className="verified-check-fs"><Icon name="shield" /></span>}
                        {p.badge && <span className={`badge-prov ${p.badge.toLowerCase().replace(' ', '-')}`}>{p.badge}</span>}
                      </div>
                      <p className="prov-role-desc">{p.role}</p>
                      
                      <div className="prov-rating-row">
                        <Icon name="star" />
                        <strong>{p.rating}</strong>
                        <span>({p.reviews} reviews)</span>
                        <span className="dot-sep">•</span>
                        <span className="loc-text"><Icon name="location" /> {p.location}</span>
                      </div>
                      
                      <p className="prov-summary-desc">{p.desc}</p>
                      
                      <div className="prov-tags-row">
                        {p.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="prov-tag-badge">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="prov-card-right">
                      <div className="prov-price-box">
                        <span>From</span>
                        <strong>{p.price} <small>/ hour</small></strong>
                      </div>
                      <button className="btn-view-prov" onClick={() => {
                        setActiveTab('Messages');
                        setActiveChatUser(p.name);
                      }}>View Profile</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="fs-pagination-row">
                <button className="page-arrow" disabled>&lt;</button>
                <button className="page-num active">1</button>
                <button className="page-num" onClick={() => alert('Go to page 2')}>2</button>
                <button className="page-num" onClick={() => alert('Go to page 3')}>3</button>
                <button className="page-num" onClick={() => alert('Go to page 4')}>4</button>
                <button className="page-num" onClick={() => alert('Go to page 5')}>5</button>
                <span className="page-dots">...</span>
                <button className="page-num" onClick={() => alert('Go to last page')}>27</button>
                <button className="page-arrow" onClick={() => alert('Next page')}>&gt;</button>
              </div>
            </div>

            <div className="fs-directory-right">
              <div className="dash-panel-premium filters-sidebar-panel">
                <div className="filters-header-row">
                  <h3>Filters</h3>
                  <button className="btn-clear-filters" onClick={() => {
                    setFindServicesSearch('');
                    setFindServicesCat('All Categories');
                    setFindServicesRating('All');
                    setFindServicesPrice(5);
                    setAvailNow(false);
                    setAvailToday(false);
                    setServiceTypeInPerson(true);
                    setServiceTypeRemote(false);
                  }}>Clear all</button>
                </div>

                <div className="filter-group">
                  <label className="filter-lbl-name">Location</label>
                  <select className="filter-select-input" value={findServicesLoc} onChange={(e) => setFindServicesLoc(e.target.value)}>
                    <option value="Douala, Cameroon">Douala, Cameroon</option>
                    <option value="Yaoundé, Cameroon">Yaoundé, Cameroon</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-lbl-name">Category</label>
                  <select className="filter-select-input" value={findServicesCat} onChange={(e) => setFindServicesCat(e.target.value)}>
                    <option value="All Categories">All Categories</option>
                    <option value="Cleaning Service">Cleaning Service</option>
                    <option value="Plumbing Service">Plumbing Service</option>
                    <option value="Electrical Service">Electrical Service</option>
                    <option value="Painting Service">Painting Service</option>
                    <option value="Carpentry Service">Carpentry Service</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-lbl-name">Price (per hour)</label>
                  <div className="price-slider-box">
                    <input 
                      type="range" 
                      min="0" 
                      max="5" 
                      value={findServicesPrice}
                      onChange={(e) => setFindServicesPrice(Number(e.target.value))}
                      className="price-slider-range"
                    />
                    <div className="price-slider-labels">
                      <span>0 coin</span>
                      <span>{findServicesPrice === 5 ? '5+ coins' : `${findServicesPrice} coins`}</span>
                    </div>
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-lbl-name">Provider Rating</label>
                  <div className="filter-rating-options">
                    <button 
                      type="button" 
                      className={`rating-pill-btn ${findServicesRating === 'All' ? 'active' : ''}`}
                      onClick={() => setFindServicesRating('All')}
                    >
                      All
                    </button>
                    <button 
                      type="button" 
                      className={`rating-pill-btn ${findServicesRating === '4.0 & up' ? 'active' : ''}`}
                      onClick={() => setFindServicesRating('4.0 & up')}
                    >
                      4★ & up
                    </button>
                    <button 
                      type="button" 
                      className={`rating-pill-btn ${findServicesRating === '4.5 & up' ? 'active' : ''}`}
                      onClick={() => setFindServicesRating('4.5 & up')}
                    >
                      4.5★ & up
                    </button>
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-lbl-name">Availability</label>
                  <label className="checkbox-filter-row">
                    <input type="checkbox" checked={availNow} onChange={(e) => setAvailNow(e.target.checked)} />
                    <span>Available Now</span>
                  </label>
                  <label className="checkbox-filter-row">
                    <input type="checkbox" checked={availToday} onChange={(e) => setAvailToday(e.target.checked)} />
                    <span>Available Today</span>
                  </label>
                </div>

                <div className="filter-group">
                  <label className="filter-lbl-name">Service Type</label>
                  <label className="checkbox-filter-row">
                    <input type="checkbox" checked={serviceTypeInPerson} onChange={(e) => setServiceTypeInPerson(e.target.checked)} />
                    <span>In Person</span>
                  </label>
                  <label className="checkbox-filter-row">
                    <input type="checkbox" checked={serviceTypeRemote} onChange={(e) => setServiceTypeRemote(e.target.checked)} />
                    <span>Remote</span>
                  </label>
                </div>

                <button type="button" className="btn-apply-filters-fs" onClick={() => alert('Filters applied!')}>
                  Apply Filters
                </button>
              </div>

              <div className="dash-panel-premium promo-card-fs">
                <div className="promo-text-fs">
                  <h4>Get the best experience</h4>
                  <p>Book your favorite providers faster and manage all your bookings in one place.</p>
                </div>
                <button type="button" className="btn-promo-action-fs" onClick={() => setActiveTab('Dashboard')}>Book a Service</button>
                <div className="promo-clipboard-svg">📋</div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <main className={`dashboard-shell-new ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {isSidebarOpen && (
          <div 
            className="sidebar-backdrop" 
            onClick={() => setIsSidebarOpen(false)} 
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 }}
          ></div>
        )}
        {/* Left Sidebar */}
        <aside className={`dash-sidebar-new ${isSidebarOpen ? 'open' : ''}`}>
          <div className="brand-header">
            <button className="brand brand-button dash-brand-compact" onClick={() => onNavigate('home')}>
              <span className="logo-mark-dash">F</span>
              <span className="logo-text-dash">Fixam</span>
            </button>
            <button className="sidebar-toggle-btn" style={{display: 'flex'}} onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} title="Toggle Sidebar">
              {isSidebarCollapsed ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              )}
            </button>
            <button className="hamburger-toggle" onClick={() => setIsSidebarOpen(false)}>
              <Icon name="x" />
            </button>
          </div>

          <div className="user-card-new" onClick={() => setActiveTab('My Profile')} style={{ cursor: 'pointer' }}>
            <img src={images.proJeff} alt="User Avatar" />
            <div className="user-info-new">
              <h3>Nounga</h3>
              <div className="role-row">
                <span className="role-text">Client</span>
                <span className="verified-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '0.7rem', height: '0.7rem' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Verified
                </span>
              </div>
            </div>
          </div>

          <nav className="sidebar-links-new">
            {clientNavItems.map((item) => (
              <button 
                key={item.name} 
                className={`side-link-new ${activeTab === item.name ? 'active' : ''}`}
                onClick={() => handleNavClick(item.name)}
              >
                <Icon name={item.icon} />
                <span>{item.name}</span>
                {item.badge && <span className="badge-count">{item.badge}</span>}
                {item.walletBadge && <span className="badge-wallet">{item.walletBadge}</span>}
              </button>
            ))}
            
            {onRoleChange && (
              <button className="side-link-new" onClick={() => onRoleChange('pro')}>
                <Icon name="user" />
                <span>Provider View</span>
              </button>
            )}

            <button className="side-link-new" onClick={() => onNavigate('login')}>
              <Icon name="x" />
              <span>Logout</span>
            </button>
          </nav>

        </aside>

        {/* Main Dashboard Area */}
        <section className="dash-main-new">
          {/* Top Bar Header */}
          <header className="dash-header-premium">
            <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu" style={{ display: 'none' }}>
              <Icon name="menu" />
            </button>
            <div className="mobile-logo-dash" style={{ display: 'none', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.2rem', color: 'var(--ink)' }}>
              <span className="logo-mark-dash" style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#14B8A6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>F</span>
              Fixam
            </div>
            <div className="search-wrapper-dash">
              <Icon name="search" />
              <input 
                type="text" 
                placeholder="Search services, providers, tasks..." 
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              <span className="shortcut-badge">⌘ K</span>
            </div>

            <div className="actions-right-dash">
              <button className="icon-btn-dash" onClick={() => setActiveTab('Messages')} aria-label="Messages">
                <Icon name="chat" />
                <span className="badge-indicator">3</span>
              </button>
              <button className="icon-btn-dash" onClick={() => setActiveTab('Notifications')} aria-label="Notifications">
                <Icon name="bell" />
                <span className="badge-indicator">8</span>
              </button>
              <button className="icon-btn-dash" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle Theme">
                <Icon name={theme === 'light' ? 'moon' : 'sun'} />
              </button>

              <button className="profile-chip-dash" onClick={() => setActiveTab('My Profile')}>
                <img src={images.proJeff} alt="Nounga profile" />
                <div className="profile-details-dash">
                  <span className="profile-name-dash">
                    Nounga
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '0.8rem', height: '0.8rem', marginLeft: '0.3rem' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                  <span className="profile-role-dash">Client</span>
                </div>
              </button>
            </div>
          </header>

          {/* Main Content Columns */}
          <div className="dash-content-premium">
            {activeTab === 'Dashboard' && (
              <>
                {/* Left/Middle Column */}
                <div className="dash-body-left">
                  {/* Greeting row */}
                  <div className="dash-greeting-row">
                    <div>
                      <h1>Good evening, Nounga! 👋</h1>
                      <p>Here's what's happening with your account today.</p>
                    </div>
                    <button className="btn-browse-services" onClick={() => setActiveTab('Find Services')}>
                      <Icon name="search" />
                      Browse Services
                    </button>
                  </div>

                  {/* 5 Stats Cards Row */}
                  <div className="dash-metrics-grid-3">
                    <div className="metric-card-premium m-bookings" onClick={() => setActiveTab('My Bookings')} style={{ cursor: 'pointer' }}>
                      <div className="metric-card-header">
                        <span>Bookings</span>
                        <div className="metric-icon-box"><Icon name="calendar" /></div>
                      </div>
                      <strong className="metric-big-num">12</strong>
                      <span className="metric-card-desc">Total Bookings</span>
                      <span className="metric-trend trend-up">↑ 20% this month</span>
                    </div>

                    <div className="metric-card-premium m-active" onClick={() => setActiveTab('My Tasks')} style={{ cursor: 'pointer' }}>
                      <div className="metric-card-header">
                        <span>Active Tasks</span>
                        <div className="metric-icon-box"><Icon name="briefcase" /></div>
                      </div>
                      <strong className="metric-big-num">4</strong>
                      <span className="metric-card-desc">In Progress</span>
                      <span className="metric-view-all">View all &gt;</span>
                    </div>

                    <div className="metric-card-premium m-completed">
                      <div className="metric-card-header">
                        <span>Completed</span>
                        <div className="metric-icon-box"><Icon name="check" /></div>
                      </div>
                      <strong className="metric-big-num">8</strong>
                      <span className="metric-card-desc">Jobs Completed</span>
                      <span className="metric-trend trend-up">↑ 15% this month</span>
                    </div>

                  </div>
                  <div className="dash-metrics-grid-2">
                    <div className="metric-card-premium m-coins" onClick={() => setActiveTab('Wallet & Coins')} style={{ cursor: 'pointer' }}>
                      <div className="metric-card-header">
                        <span>Coins Balance</span>
                        <div className="metric-icon-box"><Icon name="wallet" /></div>
                      </div>
                      <strong className="metric-big-num">1,250</strong>
                      <span className="metric-card-desc">Available Coins</span>
                      <button className="coins-plus-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet & Coins'); }}>+</button>
                    </div>

                    <div className="metric-card-premium m-saved" onClick={() => setActiveTab('Saved Providers')} style={{ cursor: 'pointer' }}>
                      <div className="metric-card-header">
                        <span>Saved Providers</span>
                        <div className="metric-icon-box"><Icon name="star" /></div>
                      </div>
                      <strong className="metric-big-num">18</strong>
                      <span className="metric-card-desc">Saved</span>
                      <span className="metric-view-all">View all &gt;</span>
                    </div>
                  </div>

                  {/* Phase 3 Layout: Stacked Panels */}
                  {/* 1. Top Categories Panel */}
                  <div className="dash-panel-premium top-categories-panel" style={{ marginBottom: '2rem' }}>
                    <div className="dash-panel-header-new">
                      <h2>Top Categories</h2>
                      <button className="panel-link" onClick={() => setActiveTab('Find Services')}>View All</button>
                    </div>
                    <div className="popular-scroll-dash">
                      {services.slice(0, 15).map(service => (
                        <div key={service.id} className="popular-service-card-dash" onClick={() => setActiveTab('Find Services')}>
                          <img src={service.image} alt={service.title} />
                          <div className="overlay">
                            <span className="title">{service.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Recommended For You Panel */}
                  <div className="dash-panel-premium recommended-panel-dash" style={{ marginBottom: '2rem' }}>
                    <div className="dash-panel-header-new">
                      <h2>Recommended for You</h2>
                      <button className="panel-link" onClick={() => setActiveTab('Marketplace')}>View All</button>
                    </div>
                    <div className="recommended-carousel-dash">
                      {displayedPros.slice(0, 5).map((pro, idx) => (
                        <div className="recommended-card-dash" key={idx}>
                          <button className="btn-heart-save" onClick={() => alert(`${pro.name} saved!`)}>
                            <Icon name="star" />
                          </button>
                          <img src={pro.image} alt={pro.name} />
                          <h4>{pro.name}</h4>
                          <div className="rating-row">
                            <Icon name="star" />
                            <span>{pro.rating}</span>
                            <span className="review-count">({Math.floor(Math.random() * 100 + 50)})</span>
                          </div>
                          <span className="provider-cat">{pro.role}</span>
                          <span className="price-lbl">From <strong>1 coin</strong></span>
                        </div>
                      ))}
                      <button className="carousel-arrow" onClick={() => setActiveTab('Find Services')} aria-label="View more">&gt;</button>
                    </div>
                  </div>

                  {/* 3. Spending Overview */}
                  <div className="dash-panel-premium spending-overview-panel" style={{ marginBottom: '2rem' }}>
                    <div className="dash-panel-header-new">
                      <h2>Spending Overview</h2>
                      <select className="select-month">
                        <option>This Month</option>
                        <option>Last Month</option>
                      </select>
                    </div>
                    <div className="chart-content-dash">
                      <div className="chart-svg-wrapper">
                        <svg width="160" height="160" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--line)" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#14B8A6" strokeWidth="3" strokeDasharray="48 52" strokeDashoffset="100" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="24 76" strokeDashoffset="52" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="16 84" strokeDashoffset="28" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#A855F7" strokeWidth="3" strokeDasharray="12 88" strokeDashoffset="12" />
                        </svg>
                        <div className="chart-inner-text">
                          <span className="chart-num">25</span>
                          <span className="chart-lbl">Total Coins<br/>Used</span>
                        </div>
                      </div>
                      <div className="chart-legend-list">
                        <div className="legend-item-dash">
                          <span className="legend-color-dot" style={{ backgroundColor: '#14B8A6' }}></span>
                          <span>Booking Payments</span>
                          <span className="legend-val">12 coins (48%)</span>
                        </div>
                        <div className="legend-item-dash">
                          <span className="legend-color-dot" style={{ backgroundColor: '#3B82F6' }}></span>
                          <span>Urgent Bookings</span>
                          <span className="legend-val">6 coins (24%)</span>
                        </div>
                        <div className="legend-item-dash">
                          <span className="legend-color-dot" style={{ backgroundColor: '#F59E0B' }}></span>
                          <span>Service Add-ons</span>
                          <span className="legend-val">4 coins (16%)</span>
                        </div>
                        <div className="legend-item-dash">
                          <span className="legend-color-dot" style={{ backgroundColor: '#A855F7' }}></span>
                          <span>Other</span>
                          <span className="legend-val">3 coins (12%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Recent Activity (Bottom) */}
                  <div className="dash-panel-premium recent-activity-panel">
                    <div className="dash-panel-header-new">
                      <h2>Recent Activity</h2>
                      <button className="panel-link" onClick={() => setActiveTab('Notifications')}>View All</button>
                    </div>
                    <div className="activity-items-list">
                      <div className="activity-item-row a-confirmed">
                        <div className="activity-icon-container"><Icon name="calendar" /></div>
                        <div className="activity-details">
                          <h4 className="activity-title">You booked Plumber Pro</h4>
                          <p className="activity-subtitle">Booking confirmed</p>
                        </div>
                        <span className="activity-time">2 min ago</span>
                      </div>
                      <div className="activity-item-row a-accepted">
                        <div className="activity-icon-container"><Icon name="check" /></div>
                        <div className="activity-details">
                          <h4 className="activity-title">John Doe accepted your request</h4>
                          <p className="activity-subtitle">Electrical Installation</p>
                        </div>
                        <span className="activity-time">15 min ago</span>
                      </div>
                      <div className="activity-item-row a-payment">
                        <div className="activity-icon-container"><Icon name="wallet" /></div>
                        <div className="activity-details">
                          <h4 className="activity-title">Payment with coins completed</h4>
                          <p className="activity-subtitle">3 coins used</p>
                        </div>
                        <span className="activity-time">1 hour ago</span>
                      </div>
                      <div className="activity-item-row a-message">
                        <div className="activity-icon-container"><Icon name="chat" /></div>
                        <div className="activity-details">
                          <h4 className="activity-title">New message from CleanMaster</h4>
                          <p className="activity-subtitle">Regarding your booking</p>
                        </div>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                      <div className="activity-item-row a-referral">
                        <div className="activity-icon-container"><Icon name="star" /></div>
                        <div className="activity-details">
                          <h4 className="activity-title">You earned 1 coin from referral</h4>
                          <p className="activity-subtitle">Your friend Roman joined Fixam</p>
                        </div>
                        <span className="activity-time">1 day ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Banner CTA */}
                  <div className="dash-cta-banner-new">
                    <div className="banner-left">
                      <div className="banner-svg-box">
                        <Icon name="briefcase" />
                      </div>
                      <div>
                        <h2>Need something done?</h2>
                        <p>Post a task and get offers from verified professionals.</p>
                      </div>
                    </div>
                    <button className="btn-post-task" onClick={() => setActiveTab('My Tasks')}>Post a Task</button>
                  </div>
                </div>

                {/* Right-hand Column */}
                <div className="dash-body-right">
                  {/* Wallet & Coins Card */}
                  <div className="dash-panel-premium wallet-card-dash-new" onClick={() => setActiveTab('Wallet & Coins')} style={{ cursor: 'pointer' }}>
                    <div className="dash-panel-header-new">
                      <h2>Wallet & Coins</h2>
                      <button className="panel-link" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet & Coins'); }}>View All</button>
                    </div>
                    <div className="wallet-main-row">
                      <div className="wallet-main-left">
                        <span className="coins-big-lbl">Available Coins</span>
                        <div className="wallet-coins-row">
                          <span className="coins-icon-circle"><Icon name="wallet" /></span>
                          <strong className="coins-big-num">1,250</strong>
                        </div>
                      </div>
                      <button className="btn-buy-coins" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet & Coins'); }}>Buy Coins</button>
                    </div>
                    <div className="wallet-stats-row">
                      <div className="wallet-stat-item">
                        <span>Total Coins Earned</span>
                        <strong>1,450</strong>
                      </div>
                      <div className="wallet-stat-item">
                        <span>Total Coins Used</span>
                        <strong>200</strong>
                      </div>
                    </div>
                    <button className="wallet-tx-link" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet & Coins'); }}>
                      Transaction History <span>&rarr;</span>
                    </button>
                  </div>

                  {/* Upcoming Bookings */}
                  <div className="dash-panel-premium bookings-card-dash-new">
                    <div className="dash-panel-header-new">
                      <h2>Upcoming Bookings</h2>
                      <button className="panel-link" onClick={() => setActiveTab('My Bookings')}>View Calendar</button>
                    </div>
                    <div className="bookings-list-dash">
                      {clientBookings.map((bk) => (
                        <div className="booking-item-row-dash" key={bk.id}>
                          <div className="date-badge-dash">
                            <span className="date-month">{bk.date.split(' ')[0]}</span>
                            <span className="date-day">{bk.date.split(' ')[1]}</span>
                          </div>
                          <div className="booking-item-details">
                            <h4>{bk.service}</h4>
                            <div className="booking-time">{bk.date} • {bk.time}</div>
                            <div className="booking-customer">Provider: {bk.provider}</div>
                          </div>
                          <span className={`booking-status-badge ${bk.status.toLowerCase()}`}>{bk.status}</span>
                        </div>
                      ))}
                    </div>
                    <button className="btn-view-all-bookings" onClick={() => setActiveTab('My Bookings')}>
                      View All Bookings &rarr;
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="dash-panel-premium quick-actions-card-dash">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions-buttons-row">
                      <button className="quick-action-btn-dash qa-post" onClick={() => setActiveTab('My Tasks')}>
                        <div className="btn-icon-wrapper">
                          <Icon name="briefcase" />
                        </div>
                        <span>Post a Task</span>
                      </button>

                      <button className="quick-action-btn-dash qa-browse" onClick={() => setActiveTab('Find Services')}>
                        <div className="btn-icon-wrapper">
                          <Icon name="search" />
                        </div>
                        <span>Browse</span>
                      </button>

                      <button className="quick-action-btn-dash qa-messages" onClick={() => setActiveTab('Messages')}>
                        <div className="btn-icon-wrapper">
                          <Icon name="chat" />
                          <span className="badge-indicator">3</span>
                        </div>
                        <span>Messages</span>
                      </button>

                      <button className="quick-action-btn-dash qa-buy" onClick={() => setActiveTab('Wallet & Coins')}>
                        <div className="btn-icon-wrapper">
                          <Icon name="wallet" />
                        </div>
                        <span>Buy Coins</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'My Bookings' && renderMyBookings()}
            {activeTab === 'My Tasks' && renderMyTasks()}
            {activeTab === 'Saved Providers' && renderSavedProviders()}
            {activeTab === 'Wallet & Coins' && renderWalletAndCoins()}
            {activeTab === 'Notifications' && renderNotifications()}
            {activeTab === 'Messages' && renderMessagesView()}
            {activeTab === 'Reviews' && renderReviewsView()}
            {activeTab === 'My Referrals' && renderReferralsView()}
            {activeTab === 'Settings' && renderSettingsView()}
            {activeTab === 'My Profile' && renderMyProfile()}
            {activeTab === 'Find Services' && renderFindServices()}
          </div>
        </section>
      </main>
    );
  }

  // Fallback / Pro Dashboard (keep the original one)
  const proLinks = ['Dashboard', 'My Jobs', 'Messages', 'Job Leads', 'Payments', 'Wallet', 'Reviews', 'Profile Settings', 'Support', 'Log Out'];
  const proIcons: IconName[] = ['home', 'briefcase', 'chat', 'search', 'briefcase', 'wallet', 'star', 'user', 'message', 'menu'];

  return (
    <main className="dashboard-page">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="brand brand-button" onClick={() => onNavigate('home')}><Logo /></button>
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
            <Icon name="x" />
          </button>
        </div>
        
        <div className="sidebar-links-container">
          {proLinks.map((item, index) => (
            <button className={index === 0 ? 'side-link active' : 'side-link'} key={item}>
              <Icon name={proIcons[index]} />
              <span>{item}</span>
              {item === 'Messages' && <span className="badge">2</span>}
              {item === 'Wallet' && <span className="badge-text">85K XAF</span>}
            </button>
          ))}
        </div>
        
        <div className="sidebar-cta">
          <h3>Find Job Leads</h3>
          <p>Browse recent client requests and make offers.</p>
          <button onClick={() => alert('Find Leads flow coming soon!')}>Browse Leads →</button>
        </div>
      </aside>
      
      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <label className="search-bar">
            <Icon name="search" />
            <input placeholder="Search leads, contracts..." />
          </label>
          <div className="dash-icons">
            <button 
              className="dash-theme-btn" 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Toggle Theme"
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
            <Icon name="bell" />
            <Icon name="chat" />
          </div>
          <button className="profile-chip" onClick={() => onNavigate('home')}>
            <ImageSlot src={images.proSamuel} alt="" label="NJ" />
            <span>Nounga Joseph<small>Professional</small></span>
          </button>
        </header>
        
        <div className="dashboard-content">
          <div className="dashboard-left">
            <div className="welcome-header">
              <div>
                <h1>Welcome back, Pro Nounga! 🚀</h1>
                <p>What would you like to do today?</p>
              </div>
              {onRoleChange && (
                <button 
                  className="outline-button role-switch-btn"
                  onClick={() => onRoleChange('client')}
                >
                  Switch to Client View
                </button>
              )}
            </div>
            
            <div className="quick-actions">
              {[
                ['Browse Leads', 'Find matching tasks', 'search'],
                ['Active Contracts', 'Manage ongoing work', 'briefcase'],
                ['Messages', 'Chat with clients', 'chat'],
                ['Earnings', 'View payouts & rewards', 'wallet'],
              ].map(([title, desc, icon]) => (
                <button key={title}>
                  <Icon name={icon as IconName} />
                  <strong>{title}</strong>
                  <span>{desc}</span>
                  <b>→</b>
                </button>
              ))}
            </div>
            
            <div className="metric-card">
              {[
                ['85,000 XAF', 'Total Earnings', 'wallet'],
                ['3', 'Active Jobs', 'briefcase'],
                ['28', 'Completed Jobs', 'check'],
                ['4.9', 'Average Rating', 'star'],
              ].map(([value, label, icon]) => (
                <div key={label}>
                  <Icon name={icon as IconName} />
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            
            <section className="task-table">
              <div className="task-head">
                <h2>Job Leads Near You</h2>
                <button>Filter Leads</button>
              </div>
              <div className="tabs">
                <span className="active">All Leads (3)</span>
                <span>Plumbing (1)</span>
                <span>Electrical (1)</span>
                <span>Cleaning (1)</span>
              </div>
              {leads.map((lead) => (
                <article className="task-row pro-lead-row" key={lead.title}>
                  <ImageSlot src={lead.image} alt="" label={lead.tag} />
                  <div className="task-info">
                    <span>{lead.tag}</span>
                    <h3>{lead.title}</h3>
                    <p>Douala, Cameroon • 2.4 km away</p>
                  </div>
                  <strong>{lead.price}</strong>
                  <button 
                    className="primary-button send-proposal-btn"
                    onClick={() => alert(`Proposal submitted for: ${lead.title}`)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', minHeight: 'auto', borderRadius: '6px' }}
                  >
                    Send Proposal
                  </button>
                </article>
              ))}
              <button className="wide-button">View All Leads →</button>
            </section>
            
            <div className="dashboard-alert">
              <Icon name="shield" />
              <span><strong>Safety guidelines for service delivery.</strong> Please follow community rules and verify locations.</span>
              <button>Learn More</button>
            </div>
          </div>
          
          <aside className="dashboard-right">
            <div className="wallet-card">
              <span>Total Earnings</span>
              <strong>85,000 XAF</strong>
              <p>Payout pending: 15,000 XAF</p>
              <button>Request Payout →</button>
            </div>
            
            <ActivityCard />
            
            <section className="right-panel">
              <div className="panel-title">
                <h2>New Client Proposals</h2>
                <button>View All</button>
              </div>
              <div className="mini-pros">
                {activeProposals.map((proposal) => (
                  <article className="premium-pro-card mini" key={proposal.name}>
                    <div className="pro-card-cover" style={{ height: '75px' }}>
                      <img src={proposal.image} alt={proposal.name} className="pro-cover-img" />
                    </div>
                    <div className="pro-card-content" style={{ padding: '0.8rem' }}>
                      <div className="pro-header">
                        <h3 style={{ fontSize: '0.95rem' }}>{proposal.name}</h3>
                        <span className="pro-rating" style={{ fontSize: '0.8rem' }}>
                          <Icon name="star" /> {proposal.rating}
                        </span>
                      </div>
                      <p className="pro-role" style={{ fontSize: '0.8rem', margin: '0.2rem 0' }}>{proposal.role}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                        <button 
                          className="primary-button" 
                          style={{ flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.75rem', minHeight: 'auto', borderRadius: '4px' }}
                          onClick={() => alert(`Accepted proposal from ${proposal.name}`)}
                        >
                          Accept
                        </button>
                        <button 
                          className="outline-button" 
                          style={{ flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.75rem', minHeight: 'auto', borderRadius: '4px', border: '1px solid var(--line)', color: 'var(--ink)' }}
                          onClick={() => alert(`Declined proposal from ${proposal.name}`)}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function HeroCollage({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'hero-collage compact' : 'hero-collage'}>
      <div className="phone-card float-slow">
        <ImageSlot src={images.appHomeScreen} alt="" label="Fixam app" />
      </div>
      <div className="worker-card float-fast">
        <ImageSlot src={images.heroProfessional} alt="" label="Professional" />
      </div>
      <ImageSlot className="collage-thumb thumb-one" src={images.servicePlumber} alt="" label="Plumber" />
      <ImageSlot className="collage-thumb thumb-two" src={images.serviceCleaner} alt="" label="Cleaner" />
      <ImageSlot className="collage-thumb thumb-three" src={images.serviceElectrician} alt="" label="Electrician" />
      <span className="orbit orbit-one"><Icon name="wrench" /></span>
      <span className="orbit orbit-two"><Icon name="painting" /></span>
    </div>
  )
}

function HeroSingleImage() {
  return (
    <div className="hero-single reveal">
      <ImageSlot src={images.landingHero} alt="Fixam app and professional hero" label="Landing hero image" />
    </div>
  )
}

function StatsBand() {
  return (
    <section className="stats-band">
      {[
        ['800+', 'Tasks Completed', 'calendar'],
        ['150+', 'Verified Professionals', 'user'],
        ['98%', 'Customer Satisfaction', 'shield'],
        ['24/7', 'Support Available', 'bell'],
      ].map(([value, label, icon]) => (
        <div key={label}>
          <Icon name={icon as IconName} />
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  )
}

function CtaBand({ onNavigate }: { onNavigate?: (page: Page) => void }) {
  return (
    <section className="cta-band">
      <div>
        <h2>Ready to Get Things Done?</h2>
        <p>Join thousands of happy customers and professionals today.</p>
      </div>
      <div className="button-row">
        <button className="light-button">Post a Task</button>
        <button className="ghost-light-button" onClick={() => onNavigate?.('services')}>Become a Professional</button>
      </div>
    </section>
  )
}

function Footer({ onNavigate }: { onNavigate?: (page: Page) => void }) {
  const { t } = useTranslation();

  return (
    <footer className="simple-footer">
      <div className="footer-top-links">
        <button onClick={() => onNavigate?.('home')}>{t('nav.home') || 'Home'}</button>
        <span className="separator">|</span>
        <button onClick={() => onNavigate?.('services')}>{t('nav.explore') || 'Explore Services'}</button>
        <span className="separator">|</span>
        <button onClick={() => onNavigate?.('guide')}>{t('nav.guide') || 'Guide'}</button>
        <span className="separator">|</span>
        <button onClick={() => onNavigate?.('about')}>{t('nav.about') || 'About Us'}</button>
        <span className="separator">|</span>
        <button onClick={() => onNavigate?.('login')}>{t('nav.signin') || 'Sign In'}</button>
      </div>
      
      <p className="footer-subtext">Fixam — Trusted Professional Services Platform</p>

      <div className="footer-bottom-bar">
        <p className="copyright">© 2026 Fixam. All rights reserved.</p>
        
        <div className="footer-socials">
          <a href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook"><Icon name="facebook" /></a>
          <a href="#" onClick={(e) => e.preventDefault()} aria-label="Twitter"><Icon name="twitter" /></a>
          <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram"><Icon name="instagram" /></a>
          <a href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn"><Icon name="linkedin" /></a>
        </div>

        <div className="footer-legal-links">
          <button onClick={() => onNavigate?.('privacy')}>{t('footer.privacy') || 'Privacy Policy'}</button>
          <button onClick={() => onNavigate?.('terms')}>{t('footer.terms') || 'Terms of Service'}</button>
          <button onClick={() => alert('Support flow coming soon!')}>{t('footer.help') || 'Support'}</button>
        </div>
      </div>
    </footer>
  );
}

function ServiceMini(service: (typeof services)[number]) {
  return (
    <article className="service-mini">
      <Icon name={service.icon} />
      <h3>{service.title}</h3>
      <p>{service.desc}</p>
    </article>
  )
}

function ServiceCard(service: (typeof services)[number]) {
  return (
    <article className="service-card">
      <span className={`icon-tile ${service.color}`}><Icon name={service.icon} /></span>
      <div>
        <h3>{service.title}</h3>
        <p>{service.desc}</p>
        <span>{service.count} Professionals</span>
        <button>View Professionals →</button>
      </div>
    </article>
  )
}

function ProCard({ pro, mini = false, onNavigate }: { pro: (typeof pros)[number]; mini?: boolean; onNavigate?: (page: Page) => void }) {
  return (
    <article className={mini ? 'premium-pro-card mini' : 'premium-pro-card'}>
      <div className="pro-card-cover">
        <img src={pro.image} alt={pro.name} className="pro-cover-img" />
        <div className="pro-badge"><Icon name="shield" /> Verified</div>
      </div>
      <div className="pro-card-content">
        <div className="pro-header">
          <h3>{pro.name}</h3>
          <span className="pro-rating"><Icon name="star" /> {pro.rating}</span>
        </div>
        <p className="pro-role">{pro.role}</p>
        <div className="pro-stats">
          <div className="stat-pill"><Icon name="check" /> 100+ Jobs</div>
          <div className="stat-pill"><Icon name="location" /> {pro.distance}</div>
        </div>
        {!mini && <button className="primary-button full-width" onClick={() => onNavigate && onNavigate('login')}>Hire {pro.name.split(' ')[0]}</button>}
      </div>
    </article>
  )
}

function FeatureRow() {
  return (
    <div className="feature-row">
      {[
        ['Verified Professionals', 'Every professional is background checked and verified.', 'shield'],
        ['Quality Guaranteed', 'We ensure top-quality service on every job.', 'star'],
        ['Secure Payments', 'Pay safely through our secure payment system.', 'wallet'],
        ['24/7 Support', 'We’re here to help you anytime, any day.', 'bell'],
      ].map(([title, desc, icon]) => (
        <div key={title}>
          <Icon name={icon as IconName} />
          <strong>{title}</strong>
          <p>{desc}</p>
        </div>
      ))}
    </div>
  )
}

function ActivityCard() {
  return (
    <section className="right-panel">
      <div className="panel-title"><h2>Recent Activity</h2><button>View All</button></div>
      {[
        ['Task Completed', 'House deep cleaning', '2 hours ago', 'check'],
        ['New Proposal Received', 'Fix leaking pipe in kitchen', '5 hours ago', 'chat'],
        ['Task In Progress', 'Fixing faulty wiring', '1 day ago', 'bell'],
        ['Payment Successful', 'Paid 25,000 XAF', '2 days ago', 'wallet'],
      ].map(([title, desc, time, icon]) => (
        <div className="activity" key={title}>
          <Icon name={icon as IconName} />
          <span><strong>{title}</strong>{desc}</span>
          <small>{time}</small>
        </div>
      ))}
    </section>
  )
}

function SectionTitle({ title, caption, className }: { title: string; caption: string; className?: string }) {
  return (
    <div className={`section-title ${className || ''}`}>
      <h2>{title}</h2>
      <p>{caption}</p>
    </div>
  )
}

function SmallTrust({ icon, label, text }: { icon: IconName; label: string; text?: string }) {
  return (
    <span className="small-trust">
      <Icon name={icon} />
      <span><strong>{label}</strong>{text && <small>{text}</small>}</span>
    </span>
  )
}

function AppTrust({ simple = false }: { simple?: boolean }) {
  return (
    <section className={simple ? 'app-trust simple' : 'app-trust'}>
      <div>
        <h2>Trusted by Thousands</h2>
        <div className="brand-cloud"><strong>MTN</strong><strong>VISA</strong><strong>orange</strong><strong>MoMo</strong><strong>PayPal</strong></div>
      </div>
      <div>
        <h2>Get the Fixam App</h2>
        <p>Manage tasks, chat with pros and more from your mobile device.</p>
        <div className="store-row"><button>App Store</button><button>Google Play</button></div>
      </div>
      {!simple && <ImageSlot className="app-phone-preview" src={images.appHomeScreen} alt="Fixam app preview" label="Fixam app" />}
    </section>
  )
}

function ImageSlot({ src, alt, label, className = '' }: { src: string; alt: string; label: string; className?: string }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <div className={`image-slot ${className}`}>
      {!failed && <img src={src} alt={alt || label} loading="lazy" decoding="async" onError={() => setFailed(true)} />}
      {failed && <span>{label}</span>}
    </div>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={light ? 'logo light' : 'logo'}>
      <span className="logo-mark">F</span>
      <span>Fixam</span>
    </span>
  )
}

export function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    appliance: 'M7 4h10v16H7z M10 7h4 M10 17h4 M10 11a2 2 0 1 0 4 0a2 2 0 0 0-4 0z',
    bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z M10 21h4',
    briefcase: 'M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1 M3 7h18v12H3z M3 12h18',
    calendar: 'M7 3v4 M17 3v4 M4 8h16 M5 5h14v16H5z M8 12h3 M13 12h3 M8 16h3',
    chat: 'M4 5h16v11H8l-4 4z M8 9h8 M8 13h5',
    check: 'M20 6 9 17l-5-5',
    cleaning: 'M6 20l12-12 M14 4l6 6 M5 19l4 1 10-10-5-5L4 15z',
    delivery: 'M3 7h11v9H3z M14 10h4l3 3v3h-7z M7 19a2 2 0 1 0 0-4a2 2 0 0 0 0 4z M18 19a2 2 0 1 0 0-4a2 2 0 0 0 0 4z',
    electrical: 'M13 2 4 14h7l-1 8 10-13h-7z',
    filter: 'M4 6h16 M7 12h10 M10 18h4',
    home: 'M3 11 12 3l9 8v10h-6v-6H9v6H3z',
    location: 'M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z M12 10a2 2 0 1 0 0 .1z',
    menu: 'M4 7h16 M4 12h16 M4 17h16',
    message: 'M4 6h16v12H4z M4 7l8 6 8-6',
    painting: 'M4 7h13v5H4z M17 9h3v4h-6v8h-4v-8',
    plumbing: 'M6 21l6-6 M9 18l-3-3 9-9a4 4 0 0 1 5 0l-4 4-2-2-6 6 3 3z',
    search: 'M11 19a8 8 0 1 1 0-16a8 8 0 0 1 0 16z M21 21l-4.3-4.3',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
    x: 'M18 6L6 18 M6 6l12 12',
    star: 'M12 2l3 6 6 .9-4.5 4.3 1 6.2L12 16.5 6.5 19.4l1-6.2L3 8.9 9 8z',
    user: 'M12 12a5 5 0 1 0 0-10a5 5 0 0 0 0 10z M4 22a8 8 0 0 1 16 0',
    wallet: 'M3 7h18v12H3z M16 12h5 M6 7V5h12v2',
    wrench: 'M14 7a5 5 0 0 0 6 6L10 23l-4-4 10-10a5 5 0 0 0-2-2z',
    sun: 'M12 7a5 5 0 1 1-4.995 5.217l-.005-.217l.005-.217A5 5 0 0 1 12 7z M12 2a1 1 0 0 1 .993.883l.007.117v1a1 1 0 0 1-1.993.117l-.007-.117v-1A1 1 0 0 1 12 2z M12 19a1 1 0 0 1 .993.883l.007.117v1a1 1 0 0 1-1.993.117l-.007-.117v-1a1 1 0 0 1 1-1z M4 11a1 1 0 0 1 .117 1.993l-.117.007h-1a1 1 0 0 1-.117-1.993l.117-.007h1z M21 11a1 1 0 0 1 .117 1.993l-.117.007h-1a1 1 0 0 1-.117-1.993l.117-.007h1z M6.213 4.81l.094.083.7.7a1 1 0 0 1-1.32 1.497l-.094-.083-.7-.7a1 1 0 0 1 1.217-1.567l.102.07z M19.107 4.893a1 1 0 0 1 .083 1.32l-.083.094-.7.7a1 1 0 0 1-1.497-1.32l.083-.094.7-.7a1 1 0 0 1 1.414 0z M7.007 16.993a1 1 0 0 1 .083 1.32l-.083.094-.7.7a1 1 0 0 1-1.497-1.32l.083-.094.7-.7a1 1 0 0 1 1.414 0z M18.313 16.91l.094.083.7.7a1 1 0 0 1-1.32 1.497l-.094-.083-.7-.7a1 1 0 0 1 1.218-1.567l.102.07z',
    moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
    facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    twitter: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
    instagram: 'M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5z M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10z M17.5 6.51a.12.12 0 0 1 0-.24.12.12 0 0 1 0 .24',
    linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d={paths[name]} />
    </svg>
  )
}

export default App
