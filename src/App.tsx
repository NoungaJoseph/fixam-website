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
        <Dashboard onNavigate={setPage} livePros={livePros} userRole={userRole} />
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
          <Header page={page} onNavigate={setPage} />
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

function Header({ page, onNavigate }: { page: Page; onNavigate: (page: Page) => void }) {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (newPage: Page) => {
    setIsMobileMenuOpen(false);
    onNavigate(newPage);
  };

  return (
    <div className="header-wrapper">
      <header className="site-header">
        <div className="header-left">
          <button className="brand brand-button" onClick={() => handleNavigate('home')} aria-label="Go to homepage">
            <img src={asset('fixam-white-bg.png')} alt="Fixam Logo" style={{ height: '32px', transform: 'scale(5)', transformOrigin: 'left center' }} />
          </button>
        </div>
        
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Icon name={isMobileMenuOpen ? "x" : "menu"} />
        </button>

        <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button className="nav-link" onClick={() => handleNavigate('services')}>{t('nav.explore')}</button>
          <button className="nav-link" onClick={() => handleNavigate('guide')}>{t('nav.guide')}</button>
          <button className="nav-link" onClick={() => handleNavigate('about')}>{t('nav.about')}</button>
          <div className="language-dropdown">
            <select 
              value={i18n.language} 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="nav-link"
              style={{ background: 'transparent', border: 'none', fontWeight: 800, cursor: 'pointer' }}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <button className="nav-link" onClick={() => handleNavigate('login')}>{t('nav.signin')}</button>
          <button className="primary-button" onClick={() => handleNavigate('login')}>{t('nav.join')}</button>
        </nav>
      </header>
    </div>
  )
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
            { title: t('how_it_works.step1'), desc: t('how_it_works.desc1'), image: images.onboardingExperts, color: '#0E2629' },
            { title: t('how_it_works.step2'), desc: t('how_it_works.desc2'), image: images.onboardingVerified, color: '#0E182B' },
            { title: t('how_it_works.step3'), desc: t('how_it_works.desc3'), image: images.onboardingBook, color: '#17122B' },
            { title: t('how_it_works.step4'), desc: t('how_it_works.desc4'), image: images.onboardingPayment, color: '#211714' },
          ].map((card, index) => (
            <div className="sticky-card" key={index} style={{ top: `calc(100px + ${index * 20}px)`, backgroundColor: card.color }}>
              <div className="sticky-card-content">
                <div className="sticky-card-text">
                  <span className="step-number">0{index + 1}</span>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
                <div className="sticky-card-image">
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

function Dashboard({ onNavigate, livePros, userRole, onRoleChange }: { onNavigate: (page: Page) => void; livePros: any[]; userRole: 'client' | 'pro'; onRoleChange?: (role: 'client' | 'pro') => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const displayedPros = livePros && livePros.length > 0 ? livePros : pros;

  const clientLinks = ['Dashboard', 'My Tasks', 'Messages', 'Saved Professionals', 'Payments', 'Wallet', 'Reviews', 'Profile Settings', 'Support', 'Log Out'];
  const clientIcons: IconName[] = ['home', 'calendar', 'chat', 'star', 'briefcase', 'wallet', 'star', 'user', 'message', 'menu'];

  const proLinks = ['Dashboard', 'My Jobs', 'Messages', 'Job Leads', 'Payments', 'Wallet', 'Reviews', 'Profile Settings', 'Support', 'Log Out'];
  const proIcons: IconName[] = ['home', 'briefcase', 'chat', 'search', 'briefcase', 'wallet', 'star', 'user', 'message', 'menu'];

  const sidebarLinks = userRole === 'client' ? clientLinks : proLinks;
  const sidebarIcons = userRole === 'client' ? clientIcons : proIcons;

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
          {sidebarLinks.map((item, index) => (
            <button className={index === 0 ? 'side-link active' : 'side-link'} key={item}>
              <Icon name={sidebarIcons[index]} />
              <span>{item}</span>
              {item === 'Messages' && <span className="badge">2</span>}
              {item === 'Wallet' && <span className="badge-text">{userRole === 'client' ? '48 Coins' : '85K XAF'}</span>}
            </button>
          ))}
        </div>
        
        {userRole === 'client' ? (
          <div className="sidebar-cta">
            <h3>Post a Task</h3>
            <p>Get offers from verified professionals in minutes.</p>
            <button onClick={() => alert('Post Task flow coming soon!')}>Create Task →</button>
          </div>
        ) : (
          <div className="sidebar-cta">
            <h3>Find Job Leads</h3>
            <p>Browse recent client requests and make offers.</p>
            <button onClick={() => alert('Find Leads flow coming soon!')}>Browse Leads →</button>
          </div>
        )}
      </aside>
      
      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <label className="search-bar">
            <Icon name="search" />
            <input placeholder={userRole === 'client' ? "Search services, professionals..." : "Search leads, contracts..."} />
          </label>
          <div className="dash-icons">
            <Icon name="bell" />
            <Icon name="chat" />
          </div>
          <button className="profile-chip" onClick={() => onNavigate('home')}>
            <ImageSlot src={userRole === 'client' ? images.proJeff : images.proSamuel} alt="" label="NJ" />
            <span>Nounga Joseph<small>{userRole === 'client' ? 'Client' : 'Professional'}</small></span>
          </button>
        </header>
        
        <div className="dashboard-content">
          <div className="dashboard-left">
            <div className="welcome-header">
              <div>
                <h1>{userRole === 'client' ? 'Welcome back, Nounga! 👋' : 'Welcome back, Pro Nounga! 🚀'}</h1>
                <p>What would you like to do today?</p>
              </div>
              {onRoleChange && (
                <button 
                  className="outline-button role-switch-btn"
                  onClick={() => onRoleChange(userRole === 'client' ? 'pro' : 'client')}
                >
                  Switch to {userRole === 'client' ? 'Provider View' : 'Client View'}
                </button>
              )}
            </div>
            
            <div className="quick-actions">
              {userRole === 'client' ? (
                [
                  ['Create a Task', 'Post a new task', 'briefcase'],
                  ['Find Professional', 'Browse experts', 'user'],
                  ['Messages', 'View your chats', 'chat'],
                  ['My Wallet', 'View balance', 'wallet'],
                ].map(([title, desc, icon]) => (
                  <button key={title}>
                    <Icon name={icon as IconName} />
                    <strong>{title}</strong>
                    <span>{desc}</span>
                    <b>→</b>
                  </button>
                ))
              ) : (
                [
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
                ))
              )}
            </div>
            
            <div className="metric-card">
              {userRole === 'client' ? (
                [
                  ['12', 'Total Tasks', 'calendar'],
                  ['5', 'In Progress', 'bell'],
                  ['6', 'Completed', 'check'],
                  ['4.8', 'Average Rating', 'star'],
                ].map(([value, label, icon]) => (
                  <div key={label}>
                    <Icon name={icon as IconName} />
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))
              ) : (
                [
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
                ))
              )}
            </div>
            
            {userRole === 'client' ? (
              <section className="task-table">
                <div className="task-head">
                  <h2>My Tasks</h2>
                  <button>View All Tasks</button>
                </div>
                <div className="tabs">
                  <span className="active">All (12)</span>
                  <span>Pending (3)</span>
                  <span>In Progress (5)</span>
                  <span>Completed (6)</span>
                  <span>Cancelled (1)</span>
                </div>
                {tasks.map((task) => (
                  <article className="task-row" key={task.title}>
                    <ImageSlot src={task.image} alt="" label={task.tag} />
                    <div className="task-info">
                      <span>{task.tag}</span>
                      <h3>{task.title}</h3>
                      <p>Douala, Cameroon</p>
                    </div>
                    <strong>{task.price}</strong>
                    <b className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</b>
                  </article>
                ))}
                <button className="wide-button">View All Tasks →</button>
              </section>
            ) : (
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
            )}
            
            <div className="dashboard-alert">
              <Icon name="shield" />
              <span><strong>{userRole === 'client' ? 'All professionals are verified and trusted.' : 'Safety guidelines for service delivery.'}</strong> {userRole === 'client' ? 'Your safety and satisfaction are our priority.' : 'Please follow community rules and verify locations.'}</span>
              <button>Learn More</button>
            </div>
          </div>
          
          <aside className="dashboard-right">
            <div className="wallet-card">
              <span>{userRole === 'client' ? 'Wallet Balance' : 'Total Earnings'}</span>
              <strong>{userRole === 'client' ? '48 Coins' : '85,000 XAF'}</strong>
              <p>{userRole === 'client' ? '≈ 960 FCFA' : 'Payout pending: 15,000 XAF'}</p>
              <button>{userRole === 'client' ? 'Top Up Wallet →' : 'Request Payout →'}</button>
            </div>
            
            <ActivityCard />
            
            {userRole === 'client' ? (
              <section className="right-panel">
                <div className="panel-title">
                  <h2>Top Rated Professionals</h2>
                  <button onClick={() => onNavigate('services')}>View All</button>
                </div>
                <div className="mini-pros">
                  {displayedPros.slice(0, 3).map((pro) => (
                    <ProCard key={pro.name} pro={pro} mini />
                  ))}
                </div>
              </section>
            ) : (
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
            )}
          </aside>
        </div>
      </section>
    </main>
  )
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
    <footer className="hero-footer">
      <div className="hero-footer-cta">
        <h2>{t('footer.ready')}</h2>
        <p>{t('footer.join')}</p>
        <button className="primary-button large" onClick={() => onNavigate?.('login')}>{t('footer.start_now')}</button>
      </div>
      <div className="footer-links-grid">
        <div className="footer-brand">
          <img src={asset('fixam-white-bg.png')} alt="Fixam Logo" style={{ height: '32px', transform: 'scale(5)', transformOrigin: 'left center' }} />
          <p>{t('footer.description')}</p>
          <div className="socials"><span>f</span><span>x</span><span>◎</span><span>in</span></div>
        </div>
        <div>
          <h3>{t('footer.company')}</h3>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('about') }}>{t('footer.about')}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('home') }}>{t('footer.how_it_works')}</a>
          <a href="#" onClick={(e) => e.preventDefault()}>{t('footer.careers')}</a>
          <a href="#" onClick={(e) => e.preventDefault()}>{t('footer.press')}</a>
          <a href="#" onClick={(e) => e.preventDefault()}>{t('footer.contact')}</a>
        </div>
        <div>
          <h3>{t('footer.services')}</h3>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('services') }}>{t('categories.plumbing')}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('services') }}>{t('categories.electrical')}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('services') }}>{t('categories.cleaning')}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('services') }}>{t('categories.painting')}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('services') }}>{t('footer.all_services')}</a>
        </div>
        <div>
          <h3>{t('footer.support')}</h3>
          <a href="#" onClick={(e) => e.preventDefault()}>{t('footer.help')}</a>
          <a href="#" onClick={(e) => e.preventDefault()}>{t('footer.safety')}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('terms') }}>{t('footer.terms')}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('privacy') }}>{t('footer.privacy')}</a>
          <a href="#" onClick={(e) => e.preventDefault()}>{t('footer.refund')}</a>
        </div>
        <div>
          <h3>{t('footer.contact')}</h3>
          <a href="#" onClick={(e) => e.preventDefault()}>+237 6XX XXX XXX</a>
          <a href="#" onClick={(e) => e.preventDefault()}>support@fixam.com</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Douala, Cameroon</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">© 2026 Fixam. All rights reserved.</p>
      </div>
    </footer>
  )
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
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d={paths[name]} />
    </svg>
  )
}

export default App
