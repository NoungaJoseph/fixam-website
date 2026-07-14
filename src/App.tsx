import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import OTPVerification from './pages/Auth/OTPVerification'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'

// Client Subpages
import FindServices from './pages/Client/FindServices'
import MyBookings from './pages/Client/MyBookings'
import MyTasks from './pages/Client/MyTasks'
import Stats from './pages/Client/Stats'
import WalletAndCoins from './pages/Client/WalletAndCoins'
import CoinPurchase from './pages/Client/CoinPurchase'
import Notifications from './pages/Client/Notifications'
import Messages from './pages/Client/Messages'
import SavedProviders from './pages/Client/SavedProviders'
import Settings from './pages/Client/Settings'
import Referrals from './pages/Client/Referrals'
import Reviews from './pages/Client/Reviews'
import MyProfile from './pages/Client/MyProfile'
import ProviderProfileDetail from './pages/Client/ProviderProfileDetail'

// Provider Subpages
import MyJobs from './pages/Provider/MyJobs'
import JobLeads from './pages/Provider/JobLeads'
import ProviderWallet from './pages/Provider/ProviderWallet'
import ProviderReviews from './pages/Provider/ProviderReviews'
import ProfileSettings from './pages/Provider/ProfileSettings'
import ProviderSupport from './pages/Provider/ProviderSupport'

// Public landing pages
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Guide from './pages/Guide'

// Resources & What's New
import SuccessStories from './pages/Resources/SuccessStories'
import ReviewsPage from './pages/Resources/Reviews'
import Updates from './pages/WhatsNew/Updates'
import Research from './pages/WhatsNew/Research'
import Blog from './pages/WhatsNew/Blog'
import ReleaseNotes from './pages/WhatsNew/ReleaseNotes'
import SkillDetail from './pages/Resources/SkillDetail'

import './App.css'
import './marketplace.css'
import './components/Megamenu.css'

export type Page = 'home' | 'services' | 'about' | 'login' | 'register' | 'forgot_password' | 'otp' | 'dashboard' | 'guide' | 'terms' | 'privacy' | 'success_stories' | 'reviews' | 'updates' | 'research' | 'blog' | 'release_notes' | 'skill_detail'

export type IconName =
  | 'appliance' | 'bell' | 'briefcase' | 'calendar' | 'chat' | 'check' | 'cleaning'
  | 'delivery' | 'electrical' | 'filter' | 'home' | 'location' | 'menu' | 'message'
  | 'painting' | 'plumbing' | 'search' | 'shield' | 'star' | 'user' | 'wallet' | 'wrench' | 'x'
  | 'sun' | 'moon' | 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'chart'

export const asset = (fileName: string) => `/assets/${fileName}`

export const getApiUrl = () => {
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

export const services: Array<{ id: string; title: string; icon: IconName; color: string; image: string; desc?: string; count?: string }> = [
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

export const pros = [
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
  const [selectedSkill, setSelectedSkill] = useState<string>('')
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

  // Synchronize initial hash on load and on hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      const validPages: Page[] = ['home', 'services', 'about', 'login', 'register', 'forgot_password', 'otp', 'dashboard', 'guide', 'terms', 'privacy', 'success_stories', 'reviews', 'updates', 'research', 'blog', 'release_notes', 'skill_detail'];
      const pathPage = window.location.pathname.replace(/^\/+/, '').replace(/\/$/, '').replace(/-/g, '_').toLowerCase();
      if (validPages.includes(hash as Page)) {
        setPage(hash as Page);
      } else if (validPages.includes(pathPage as Page)) {
        setPage(pathPage as Page);
      } else if (!hash) {
        setPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when page changes
  useEffect(() => {
    const currentHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const currentPathPage = window.location.pathname.replace(/^\/+/, '').replace(/\/$/, '').replace(/-/g, '_').toLowerCase();
    if (page === 'home') {
      if (currentHash && currentHash !== 'home') {
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    } else {
      if (currentHash !== page && currentPathPage !== page) {
        window.location.hash = page;
      }
    }
  }, [page]);


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
            {page === 'success_stories' && <SuccessStories onNavigate={setPage} />}
            {page === 'reviews' && <ReviewsPage onNavigate={setPage} onSelectSkill={setSelectedSkill} />}
            {page === 'skill_detail' && <SkillDetail onNavigate={setPage} skillName={selectedSkill} onSelectSkill={setSelectedSkill} livePros={livePros} />}
            {page === 'updates' && <Updates onNavigate={setPage} />}
            {page === 'research' && <Research onNavigate={setPage} />}
            {page === 'blog' && <Blog onNavigate={setPage} />}
            {page === 'release_notes' && <ReleaseNotes onNavigate={setPage} />}
            {page === 'home' && <Home onNavigate={setPage} livePros={livePros} onSelectSkill={setSelectedSkill} />}
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



function Header({ page, onNavigate, theme, setTheme }: { page: Page; onNavigate: (page: Page) => void; theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void }) {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'guide' | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Home Services');
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileHowOpen, setMobileHowOpen] = useState(false);

  const serviceCategories: Record<string, Array<{ name: string; desc: string; icon: string }>> = {
    'Home Services': [
      { name: 'House Cleaning', desc: 'Clean your home professionally', icon: '🧹' },
      { name: 'Garden & Outdoor', desc: 'Lawn mowing and outdoor maintenance', icon: '🌱' },
      { name: 'Interior Decoration', desc: 'Transform your living space', icon: '🎨' },
      { name: 'Pest Control', desc: 'Eliminate insects and rodents', icon: '🐜' },
      { name: 'Pool Maintenance', desc: 'Keep your pool clean and safe', icon: '🏊' }
    ],
    'Electrical & Plumbing': [
      { name: 'Pipe Leakage', desc: 'Fix water leaks instantly', icon: '💧' },
      { name: 'Rewiring', desc: 'Full house electrical wiring', icon: '⚡' },
      { name: 'Appliance Setup', desc: 'Install major electronics', icon: '🔌' },
      { name: 'Water Heater', desc: 'Installation and repair', icon: '🔥' },
      { name: 'Lighting Setup', desc: 'Indoor and outdoor fixtures', icon: '💡' }
    ],
    'Cleaning & Hygiene': [
      { name: 'Deep Cleaning', desc: 'Intensive sanitization', icon: '🧼' },
      { name: 'Office Cleaning', desc: 'Professional commercial cleaning', icon: '🏢' },
      { name: 'Disinfection', desc: 'Virus and pest control', icon: '🦠' },
      { name: 'Carpet Cleaning', desc: 'Stain and odor removal', icon: '🧶' },
      { name: 'Window Cleaning', desc: 'Streak-free exterior washing', icon: '🪟' }
    ],
    'Moving & Delivery': [
      { name: 'Home Moving', desc: 'Safely pack and move furniture', icon: '📦' },
      { name: 'Express Delivery', desc: 'Fast local courier service', icon: '🛵' },
      { name: 'Cargo Transport', desc: 'Large vehicle hauling', icon: '🚚' },
      { name: 'Furniture Assembly', desc: 'Build flat-pack items', icon: '🪑' },
      { name: 'Heavy Lifting', desc: 'Labor for loading/unloading', icon: '💪' }
    ],
    'Beauty & Wellness': [
      { name: 'Hair Styling', desc: 'Modern haircuts at home', icon: '💇' },
      { name: 'Massage Therapy', desc: 'Professional relaxation', icon: '💆' },
      { name: 'Nail Care', desc: 'Manicure and pedicure services', icon: '💅' },
      { name: 'Makeup Artist', desc: 'Event and bridal makeup', icon: '💄' },
      { name: 'Personal Trainer', desc: 'Custom fitness sessions', icon: '🏋️' }
    ],
    'Repairs & Maintenance': [
      { name: 'AC Repair', desc: 'Air conditioner fixing', icon: '❄️' },
      { name: 'Wood Repair', desc: 'Carpenter and cabinet maintenance', icon: '🪓' },
      { name: 'Masonry Work', desc: 'Tile and brick repair', icon: '🧱' },
      { name: 'Roof Repair', desc: 'Fix leaks and shingles', icon: '🏠' },
      { name: 'Generator Service', desc: 'Maintenance and repair', icon: '🔋' }
    ],
    'Security & Safety': [
      { name: 'CCTV Setup', desc: 'Camera installation & configuration', icon: '🛡️' },
      { name: 'Smart Lock', desc: 'Digital security lock installation', icon: '🔒' },
      { name: 'Fire Alarm', desc: 'Smoke detector setups', icon: '🚨' },
      { name: 'Security Guard', desc: 'Personal or event security', icon: '👮' },
      { name: 'Electric Fence', desc: 'Perimeter protection setup', icon: '⚡' }
    ],
    'Education & Tutoring': [
      { name: 'School Support', desc: 'Homework help for kids', icon: '📚' },
      { name: 'Language Class', desc: 'Learn English/French', icon: '🗣️' },
      { name: 'IT Basics', desc: 'Essential computer training', icon: '💻' },
      { name: 'Music Lessons', desc: 'Piano, guitar, and vocal', icon: '🎵' },
      { name: 'Math Tutoring', desc: 'Advanced mathematics prep', icon: '📐' }
    ]
  };

  const translateCat = (cat: string) => {
    if (i18n.language === 'fr') {
      switch (cat) {
        case 'Home Services': return 'Services Ménagers';
        case 'Electrical & Plumbing': return 'Électricité & Plomberie';
        case 'Cleaning & Hygiene': return 'Nettoyage & Hygiène';
        case 'Moving & Delivery': return 'Déménagement & Livraison';
        case 'Beauty & Wellness': return 'Beauté & Bien-être';
        case 'Repairs & Maintenance': return 'Réparations & Entretien';
        case 'Security & Safety': return 'Sécurité & Sûreté';
        case 'Education & Tutoring': return 'Éducation & Tutorat';
        default: return cat;
      }
    }
    return cat;
  };

  const translateService = (name: string, desc: string) => {
    if (i18n.language === 'fr') {
      switch (name) {
        case 'House Cleaning': return { name: 'Nettoyage de Maison', desc: 'Nettoyez votre maison de manière professionnelle' };
        case 'Garden & Outdoor': return { name: 'Jardin & Extérieur', desc: 'Tonte de pelouse et entretien extérieur' };
        case 'Interior Decoration': return { name: 'Décoration Intérieure', desc: 'Transformez votre espace de vie' };
        case 'Pest Control': return { name: 'Lutte Antiparasitaire', desc: 'Éliminez les insectes et rongeurs' };
        case 'Pool Maintenance': return { name: 'Entretien de Piscine', desc: 'Gardez votre piscine propre et sûre' };
        case 'Pipe Leakage': return { name: 'Fuite de Tuyau', desc: 'Réparez les fuites d\'eau instantanément' };
        case 'Rewiring': return { name: 'Recâblage', desc: 'Câblage électrique complet de la maison' };
        case 'Appliance Setup': return { name: 'Installation d\'Appareils', desc: 'Installez vos appareils électroniques majeurs' };
        case 'Water Heater': return { name: 'Chauffe-eau', desc: 'Installation et réparation' };
        case 'Lighting Setup': return { name: 'Éclairage', desc: 'Luminaires intérieurs et extérieurs' };
        case 'Deep Cleaning': return { name: 'Nettoyage en Profondeur', desc: 'Désinfection intensive' };
        case 'Office Cleaning': return { name: 'Nettoyage de Bureau', desc: 'Nettoyage commercial professionnel' };
        case 'Disinfection': return { name: 'Désinfection', desc: 'Contrôle des virus et des nuisibles' };
        case 'Carpet Cleaning': return { name: 'Nettoyage de Tapis', desc: 'Élimination des taches et odeurs' };
        case 'Window Cleaning': return { name: 'Nettoyage de Vitres', desc: 'Lavage extérieur sans traces' };
        case 'Home Moving': return { name: 'Déménagement de Maison', desc: 'Emballez et déplacez vos meubles en toute sécurité' };
        case 'Express Delivery': return { name: 'Livraison Express', desc: 'Service de messagerie local rapide' };
        case 'Cargo Transport': return { name: 'Transport de Fret', desc: 'Transport par grand véhicule' };
        case 'Furniture Assembly': return { name: 'Montage de Meubles', desc: 'Assemblez des articles en kit' };
        case 'Heavy Lifting': return { name: 'Manutention Lourde', desc: 'Main-d\'œuvre pour chargement/déchargement' };
        case 'Hair Styling': return { name: 'Coiffure', desc: 'Coupes de cheveux modernes à domicile' };
        case 'Massage Therapy': return { name: 'Massage', desc: 'Relaxation professionnelle' };
        case 'Nail Care': return { name: 'Soin des Ongles', desc: 'Services de manucure et pédicure' };
        case 'Makeup Artist': return { name: 'Maquilleur(se)', desc: 'Maquillage d\'événement et de mariage' };
        case 'Personal Trainer': return { name: 'Entraîneur Personnel', desc: 'Séances de fitness personnalisées' };
        case 'AC Repair': return { name: 'Réparation de Clim', desc: 'Réparation de climatiseur' };
        case 'Wood Repair': return { name: 'Réparation de Bois', desc: 'Entretien des armoires et menuiserie' };
        case 'Masonry Work': return { name: 'Maçonnerie', desc: 'Réparation de carreaux et de briques' };
        case 'Roof Repair': return { name: 'Réparation de Toiture', desc: 'Réparation de fuites et bardeaux' };
        case 'Generator Service': return { name: 'Service de Groupe Électrogène', desc: 'Entretien et réparation' };
        case 'CCTV Setup': return { name: 'Installation de Vidéosurveillance', desc: 'Installation et configuration de caméras' };
        case 'Smart Lock': return { name: 'Serrure Intelligente', desc: 'Installation de serrure numérique' };
        case 'Fire Alarm': return { name: 'Alarme Incendie', desc: 'Installation de détecteurs de fumée' };
        case 'Security Guard': return { name: 'Agent de Sécurité', desc: 'Sécurité personnelle ou événementielle' };
        case 'Electric Fence': return { name: 'Clôture Électrique', desc: 'Installation de protection périmétrique' };
        case 'School Support': return { name: 'Soutien Scolaire', desc: 'Aide aux devoirs pour enfants' };
        case 'Language Class': return { name: 'Cours de Langue', desc: 'Apprenez l\'anglais/le français' };
        case 'IT Basics': return { name: 'Bases de l\'Informatique', desc: 'Formation informatique essentielle' };
        case 'Music Lessons': return { name: 'Cours de Musique', desc: 'Piano, guitare et chant' };
        case 'Math Tutoring': return { name: 'Tutorat en Mathématiques', desc: 'Préparation avancée en mathématiques' };
        default: return { name, desc };
      }
    }
    return { name, desc };
  };

  const handleNavigate = (newPage: Page) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
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
            
            {/* Explore Services Dropdown */}
            <div 
              className="nav-item-with-dropdown"
              onMouseEnter={() => { setActiveDropdown('services'); setActiveCategory('Home Services'); }}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`nav-link-new ${page === 'services' ? 'active' : ''}`} onClick={() => handleNavigate('services')}>
                {i18n.language === 'fr' ? 'Explorer les services' : 'Explore Services'}
              </button>
              
              {activeDropdown === 'services' && (
                <div className="megamenu-overlay">
                  <div className="megamenu-body">
                    {/* Left side categories */}
                    <div className="megamenu-left-col">
                      {Object.keys(serviceCategories).map((cat) => (
                        <button 
                          key={cat} 
                          className={`megamenu-cat-item ${activeCategory === cat ? 'active' : ''}`}
                          onMouseEnter={() => setActiveCategory(cat)}
                          onClick={() => handleNavigate('services')}
                        >
                          {translateCat(cat)}
                          <span className="arrow-icon">→</span>
                        </button>
                      ))}
                    </div>
                    
                    {/* Right side services grid */}
                    <div className="megamenu-right-col">
                      <div className="megamenu-grid-2col">
                        {serviceCategories[activeCategory].map((svc) => {
                          const translated = translateService(svc.name, svc.desc);
                          return (
                            <div key={svc.name} className="megamenu-item-card" onClick={() => handleNavigate('services')}>
                              <span className="megamenu-item-icon">{svc.icon}</span>
                              <div className="megamenu-item-info">
                                <span className="megamenu-item-title">{translated.name}</span>
                                <span className="megamenu-item-desc">{translated.desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="megamenu-bottom-strip">
                    <button className="megamenu-bottom-btn" onClick={() => handleNavigate('services')}>
                      {i18n.language === 'fr' ? 'Voir tous les services →' : 'See all services →'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <span className="nav-divider">|</span>
            
            {/* How It Works Dropdown */}
            <div 
              className="nav-item-with-dropdown"
              onMouseEnter={() => setActiveDropdown('guide')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`nav-link-new ${page === 'guide' ? 'active' : ''}`} onClick={() => handleNavigate('guide')}>
                How it works
              </button>
              
              {activeDropdown === 'guide' && (
                <div className="megamenu-overlay" style={{ width: '800px' }}>
                  <div className="megamenu-body">
                    <div className="megamenu-how-left">
                      <h3>{i18n.language === 'fr' ? 'RESSOURCES' : 'RESOURCES'}</h3>
                      <div className="megamenu-how-col" style={{ marginTop: '1.5rem', width: '100%' }}>
                        <button className="megamenu-how-link" onClick={() => handleNavigate('success_stories')}>
                          <span className="megamenu-how-link-title">{i18n.language === 'fr' ? 'Histoires de succès' : 'Success stories'}</span>
                          <span className="megamenu-how-link-subtitle">{i18n.language === 'fr' ? 'Découvrez comment les équipes travaillent pour croître' : 'Discover how teams work strategically to grow'}</span>
                        </button>
                        <button className="megamenu-how-link" onClick={() => handleNavigate('reviews')}>
                          <span className="megamenu-how-link-title">{i18n.language === 'fr' ? 'Avis' : 'Reviews'}</span>
                          <span className="megamenu-how-link-subtitle">{i18n.language === 'fr' ? 'Voyez ce que c\'est de collaborer sur Fixam' : 'See what it\'s like to collaborate on Fixam'}</span>
                        </button>
                        <button className="megamenu-how-link" onClick={() => handleNavigate('services')}>
                          <span className="megamenu-how-link-title">{i18n.language === 'fr' ? 'Comment engager' : 'How to hire'}</span>
                          <span className="megamenu-how-link-subtitle">{i18n.language === 'fr' ? 'Apprenez les différentes façons d\'accomplir le travail' : 'Learn the different ways you can get work done'}</span>
                        </button>
                        <button className="megamenu-how-link" onClick={() => handleNavigate('guide')}>
                          <span className="megamenu-how-link-title">{i18n.language === 'fr' ? 'Comment trouver du travail' : 'How to find work'}</span>
                          <span className="megamenu-how-link-subtitle">{i18n.language === 'fr' ? 'Découvrez comment évoluer selon vos conditions' : 'Learn about how to grow on your terms'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="megamenu-how-right">
                      <div className="megamenu-how-col" style={{ width: '100%' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{i18n.language === 'fr' ? 'QUOI DE NEUF' : 'WHAT\'S NEW'}</h4>
                        <button className="megamenu-how-link" onClick={() => handleNavigate('updates')}>
                          <span className="megamenu-how-link-title">{i18n.language === 'fr' ? 'Mises à jour Fixam' : 'Fixam Updates'}</span>
                          <span className="megamenu-how-link-subtitle">{i18n.language === 'fr' ? 'Nos derniers produits, fonctionnalités et partenaires' : 'Our latest products, features, and partners'}</span>
                        </button>
                        <button className="megamenu-how-link" onClick={() => handleNavigate('research')}>
                          <span className="megamenu-how-link-title">{i18n.language === 'fr' ? 'Institut de Recherche' : 'Research Institute'}</span>
                          <span className="megamenu-how-link-subtitle">{i18n.language === 'fr' ? 'Outils et insights pour les chefs d\'entreprise' : 'Insights and tools for business leaders'}</span>
                        </button>
                        <button className="megamenu-how-link" onClick={() => handleNavigate('blog')}>
                          <span className="megamenu-how-link-title">{i18n.language === 'fr' ? 'Blog' : 'Blog'}</span>
                          <span className="megamenu-how-link-subtitle">{i18n.language === 'fr' ? 'Actualités de notre plateforme de services' : 'News and stories from the world\'s work marketplace'}</span>
                        </button>
                        <button className="megamenu-how-link" onClick={() => handleNavigate('release_notes')}>
                          <span className="megamenu-how-link-title">{i18n.language === 'fr' ? 'Notes de mise à jour' : 'Release notes'}</span>
                          <span className="megamenu-how-link-subtitle">{i18n.language === 'fr' ? 'Nos dernières nouveautés et améliorations' : 'Our latest product news and improvements'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
          
          {/* Mobile Accordion for Explore Services */}
          <div>
            <button className="mobile-nav-accordion-btn" onClick={() => setMobileServicesOpen(!mobileServicesOpen)}>
              {i18n.language === 'fr' ? 'EXPLORER LES SERVICES' : 'EXPLORE SERVICES'}
              <span>{mobileServicesOpen ? '−' : '+'}</span>
            </button>
            <div className={`mobile-nav-accordion-content ${mobileServicesOpen ? 'open' : ''}`}>
              {Object.keys(serviceCategories).map((cat) => (
                <div key={cat} className="mobile-cat-group">
                  <div className="mobile-cat-title">{translateCat(cat)}</div>
                  {serviceCategories[cat].map((svc) => {
                    const translated = translateService(svc.name, svc.desc);
                    return (
                      <button key={svc.name} className="mobile-service-item" onClick={() => handleNavigate('services')}>
                        {svc.icon} {translated.name}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Accordion for How It Works */}
          <div>
            <button className="mobile-nav-accordion-btn" onClick={() => setMobileHowOpen(!mobileHowOpen)}>
              How it works
              <span>{mobileHowOpen ? '−' : '+'}</span>
            </button>
            <div className={`mobile-nav-accordion-content ${mobileHowOpen ? 'open' : ''}`}>
              <div className="mobile-how-section">
                <div className="mobile-cat-title">{i18n.language === 'fr' ? 'RESSOURCES' : 'RESOURCES'}</div>
                <button className="mobile-service-item" onClick={() => handleNavigate('success_stories')}>
                  🌟 {i18n.language === 'fr' ? 'Histoires de succès' : 'Success stories'}
                </button>
                <button className="mobile-service-item" onClick={() => handleNavigate('reviews')}>
                  ⭐ {i18n.language === 'fr' ? 'Avis' : 'Reviews'}
                </button>
                <button className="mobile-service-item" onClick={() => handleNavigate('services')}>
                  🤝 {i18n.language === 'fr' ? 'Comment engager' : 'How to hire'}
                </button>
                <button className="mobile-service-item" onClick={() => handleNavigate('guide')}>
                  💼 {i18n.language === 'fr' ? 'Comment trouver du travail' : 'How to find work'}
                </button>
                
                <div className="mobile-cat-title" style={{ marginTop: '1rem' }}>{i18n.language === 'fr' ? 'QUOI DE NEUF' : 'WHAT\'S NEW'}</div>
                <button className="mobile-service-item" onClick={() => handleNavigate('updates')}>
                  🚀 {i18n.language === 'fr' ? 'Mises à jour Fixam' : 'Fixam Updates'}
                </button>
                <button className="mobile-service-item" onClick={() => handleNavigate('research')}>
                  📊 {i18n.language === 'fr' ? 'Institut de Recherche' : 'Research Institute'}
                </button>
                <button className="mobile-service-item" onClick={() => handleNavigate('blog')}>
                  📰 {i18n.language === 'fr' ? 'Blog' : 'Blog'}
                </button>
                <button className="mobile-service-item" onClick={() => handleNavigate('release_notes')}>
                  📝 {i18n.language === 'fr' ? 'Notes de mise à jour' : 'Release notes'}
                </button>
              </div>
            </div>
          </div>

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





// Removed Login and Register to src/pages/Auth/

function Dashboard({ onNavigate, livePros, userRole, onRoleChange, theme, setTheme }: { onNavigate: (page: Page) => void; livePros: any[]; userRole: 'client' | 'pro'; onRoleChange?: (role: 'client' | 'pro') => void; theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void }) {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchVal, setSearchVal] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  
  useEffect(() => {
    setActiveTab('Dashboard');
    setSelectedProvider(null);
  }, [userRole]);

  const [tickerItems, setTickerItems] = useState<Array<{ isNews: boolean; badgeText: string; text: string }>>([
    { isNews: false, badgeText: 'SPORTS', text: '⚽ Cameroon 2 - 0 Egypt (LIVE)' },
    { isNews: false, badgeText: 'SPORTS', text: '📅 Upcoming: Nigeria vs Ghana (19:00)' },
    { isNews: true, badgeText: 'NEWS', text: '📰 50+ New Verified Plumbers joined Fixam in Douala this week!' },
    { isNews: false, badgeText: 'SPORTS', text: '⚽ Real Madrid 3 - 1 Barcelona (FINISHED)' },
    { isNews: true, badgeText: 'NEWS', text: '⚡ Wallet top-up via Mobile Money now processed 2x faster!' },
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchTickerData = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/sports/ticker?lang=en&country=Cameroon`);
        const result = await response.json();
        if (isMounted && result?.data?.items) {
          const items = result.data.items;
          if (items.length > 0) {
            const processed = items.map((item: any) => {
              if (item.type === 'MATCH') {
                const liveStatus = item.status === 'LIVE' ? ' (LIVE)' : '';
                return {
                  isNews: false,
                  badgeText: 'SPORTS',
                  text: `⚽ ${item.home} ${item.homeScore} - ${item.awayScore} ${item.away}${liveStatus}`
                };
              } else if (item.type === 'UPCOMING') {
                const time = new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                return {
                  isNews: false,
                  badgeText: 'SPORTS',
                  text: `📅 Upcoming: ${item.home} vs ${item.away} (${time})`
                };
              } else if (item.type === 'NEWS') {
                return {
                  isNews: true,
                  badgeText: 'NEWS',
                  text: `${item.prefix || '📰'} ${item.title}`
                };
              }
              return null;
            }).filter(Boolean);
            if (processed.length > 0) {
              setTickerItems(processed);
            }
          }
        }
      } catch (err) {
        console.warn('Error loading live ticker:', err);
      }
    };
    
    fetchTickerData();
    const interval = setInterval(fetchTickerData, 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const catScrollRef = useRef<HTMLDivElement>(null);
  const displayedPros = livePros && livePros.length > 0 ? livePros : pros;

  // Client-specific interactive state hooks
  const [clientTasks, setClientTasks] = useState([
    { id: 1, title: 'Fix leaking pipe in kitchen', tag: 'Plumbing', price: '25,000 XAF', status: 'In Progress', bids: 3 },
    { id: 2, title: 'Installing ceiling fan in bedroom', tag: 'Electrical', price: '15,000 XAF', status: 'Pending Offers', bids: 5 },
    { id: 3, title: 'House deep cleaning', tag: 'Cleaning', price: '20,000 XAF', status: 'Completed', bids: 0 }
  ]);
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
  const [activeChatUser, setActiveChatUser] = useState('Jeff Thomson');
  
  const [savedProsState, setSavedProsState] = useState([
    { id: 1, name: 'Jeff Thomson', role: 'Plumbing Specialist', rating: '4.8', distance: '4.2 km away', image: images.proJeff },
    { id: 2, name: 'Samuel Bright', role: 'Electrician', rating: '4.7', distance: '3.6 km away', image: images.proSamuel },
    { id: 3, name: 'Mary Clean', role: 'Cleaning Expert', rating: '4.9', distance: '2.1 km away', image: images.proMary }
  ]);

  if (userRole === 'client') {
    const clientNavItems = [
      { name: 'Dashboard', icon: 'home' as IconName },
      { name: 'Find Services', icon: 'search' as IconName },
      { name: 'My Bookings', icon: 'calendar' as IconName },
      { name: 'Messages', icon: 'chat' as IconName, badge: 3 },
      { name: 'Saved Providers', icon: 'star' as IconName },
      { name: 'My Tasks', icon: 'briefcase' as IconName },
      { name: 'Stats', icon: 'chart' as IconName },
      { name: 'Reviews', icon: 'check' as IconName },
      { name: 'Wallet & Coins', icon: 'wallet' as IconName, walletBadge: '1,250' },
      { name: 'Coin Purchase', icon: 'wallet' as IconName },
      { name: 'My Referrals', icon: 'user' as IconName },
      { name: 'Notifications', icon: 'bell' as IconName, badge: 8 },
      { name: 'Settings', icon: 'wrench' as IconName },
      { name: 'Help Center', icon: 'message' as IconName }
    ];

    const handleNavClick = (itemName: string) => {
      setIsSidebarOpen(false);
      setSelectedProvider(null);
      if (itemName === 'Help Center') {
        alert('Support flow coming soon!');
      } else {
        setActiveTab(itemName);
      }
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
            {/* Live Ticker instead of Search bar */}
            <div className="header-news-ticker">
              <span className="ticker-static-badge">Live Scores</span>
              <div className="ticker-scroll-container">
                <div className="ticker-marquee-track">
                  {tickerItems.map((item, index) => (
                    <span className="ticker-track-item" key={index}>
                      <span className={`ticker-item-badge ${item.isNews ? 'news' : ''}`}>{item.badgeText}</span>
                      <span>{item.text}</span>
                    </span>
                  ))}
                  {/* Duplicate track items to make the marquee transition seamless */}
                  {tickerItems.map((item, index) => (
                    <span className="ticker-track-item" key={`dup-${index}`}>
                      <span className={`ticker-item-badge ${item.isNews ? 'news' : ''}`}>{item.badgeText}</span>
                      <span>{item.text}</span>
                    </span>
                  ))}
                </div>
              </div>
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
          <div className={`dash-content-premium ${(activeTab === 'Dashboard' && !selectedProvider) ? 'dashboard-tab-active' : ''}`}>
            {selectedProvider ? (
              <ProviderProfileDetail
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                clientBookings={clientBookings}
                setClientBookings={setClientBookings}
                setActiveTab={setActiveTab}
                setActiveChatUser={setActiveChatUser}
              />
            ) : (
              <>
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

                      {/* Post Task Hero Section */}
                      <div className="dash-post-task-hero">
                        <div className="post-task-top-bar">
                          <div className="post-task-text">
                            <h2>What do you need help with?</h2>
                            <p>Post a task and get offers from verified professionals near you.</p>
                          </div>
                          <div className="post-task-quick-icons">
                            <button className="quick-icon-btn" onClick={() => setActiveTab('Find Services')} title="Browse Services">
                              <Icon name="search" />
                            </button>
                            <button className="quick-icon-btn" onClick={() => setActiveTab('Messages')} title="Messages">
                              <Icon name="chat" />
                              <span className="badge-indicator">3</span>
                            </button>
                            <button className="quick-icon-btn" onClick={() => setActiveTab('Wallet & Coins')} title="Wallet">
                              <Icon name="wallet" />
                            </button>
                            <button className="quick-icon-btn" onClick={() => setActiveTab('My Bookings')} title="Bookings">
                              <Icon name="calendar" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="post-task-bottom-bar">
                          <button className="btn-post-task-hero" onClick={() => setActiveTab('My Tasks')}>
                            <Icon name="briefcase" /> Post a Task
                          </button>
                          
                          <div className="hero-coin-balance-widget" onClick={() => setActiveTab('Wallet & Coins')} style={{ cursor: 'pointer' }}>
                            <span className="hero-coin-icon"><Icon name="wallet" /></span>
                            <div className="hero-coin-info-text">
                              <span className="hero-coin-lbl">Available Coins</span>
                              <strong className="hero-coin-num">1,250</strong>
                            </div>
                            <button className="hero-coin-add-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('Wallet & Coins'); }} title="Top up Coins">+</button>
                          </div>
                        </div>
                      </div>


                      {/* 1. Top Categories - No Background */}
                      <div className="top-categories-section" style={{ marginBottom: '2rem' }}>
                        <div className="dash-panel-header-new">
                          <h2>Top Categories</h2>
                          <button className="panel-link" onClick={() => setActiveTab('Find Services')}>View All</button>
                        </div>
                        <div className="categories-carousel-wrapper">
                          <button className="cat-arrow cat-arrow-left" onClick={() => { if (catScrollRef.current) catScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' }); }} aria-label="Scroll left">‹</button>
                          <div className="popular-scroll-dash popular-scroll-lg" ref={catScrollRef}>
                            {services.slice(0, 15).map(service => (
                              <div key={service.id} className="popular-service-card-dash card-lg" onClick={() => setActiveTab('Find Services')}>
                                <img src={service.image} alt={service.title} />
                                <div className="overlay">
                                  <span className="title">{service.title}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button className="cat-arrow cat-arrow-right" onClick={() => { if (catScrollRef.current) catScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' }); }} aria-label="Scroll right">›</button>
                        </div>
                      </div>

                      {/* 2. Recommended For You Panel - Backgroundless */}
                      <div className="recommended-section-dash" style={{ marginBottom: '2rem' }}>
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
                              <button className="btn-view-profile-dash" onClick={() => setSelectedProvider(pro)}>View Profile</button>
                            </div>
                          ))}
                          <button className="carousel-arrow" onClick={() => setActiveTab('Find Services')} aria-label="View more">&gt;</button>
                        </div>
                      </div>
                    </div>

                    {/* Right-hand Column */}
                    <div className="dash-body-right">
                      {/* Upcoming Bookings Section - Backgroundless */}
                      <div className="bookings-section-dash-new">
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

                    </div>
                  </>
                )}

                {activeTab === 'My Bookings' && (
                  <MyBookings 
                    clientBookings={clientBookings} 
                    setClientBookings={setClientBookings} 
                    setActiveTab={setActiveTab} 
                    setActiveChatUser={setActiveChatUser} 
                  />
                )}
                {activeTab === 'My Tasks' && (
                  <MyTasks 
                    clientTasks={clientTasks} 
                    setClientTasks={setClientTasks} 
                    setActiveTab={setActiveTab} 
                  />
                )}
                {activeTab === 'Saved Providers' && (
                  <SavedProviders 
                    savedProsState={savedProsState} 
                    setSavedProsState={setSavedProsState} 
                    setActiveTab={setActiveTab} 
                    setActiveChatUser={setActiveChatUser} 
                  />
                )}
                {activeTab === 'Stats' && <Stats />}
                {activeTab === 'Wallet & Coins' && <WalletAndCoins />}
                {activeTab === 'Coin Purchase' && (
                  <CoinPurchase 
                    setActiveTab={setActiveTab} 
                  />
                )}
                {activeTab === 'Notifications' && <Notifications />}
                {activeTab === 'Messages' && (
                  <Messages 
                    chatMessages={chatMessages} 
                    setChatMessages={setChatMessages} 
                    activeChatUser={activeChatUser} 
                    setActiveChatUser={setActiveChatUser} 
                  />
                )}
                {activeTab === 'Reviews' && <Reviews />}
                {activeTab === 'My Referrals' && <Referrals />}
                {activeTab === 'Settings' && <Settings />}
                {activeTab === 'My Profile' && (
                  <MyProfile 
                    setActiveTab={setActiveTab} 
                  />
                )}
                {activeTab === 'Find Services' && (
                  <FindServices 
                    setSelectedProvider={setSelectedProvider} 
                    setActiveTab={setActiveTab} 
                    clientBookings={clientBookings} 
                    setClientBookings={setClientBookings} 
                    setActiveChatUser={setActiveChatUser}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </main>
    );
  }

  // Fallback / Pro Dashboard (integrated with the premium responsive shell)
  const providerNavItems = [
    { name: 'Dashboard', icon: 'home' as IconName },
    { name: 'My Jobs', icon: 'briefcase' as IconName },
    { name: 'Messages', icon: 'chat' as IconName, badge: 2 },
    { name: 'Job Leads', icon: 'search' as IconName },
    { name: 'Wallet', icon: 'wallet' as IconName, walletBadge: '85K XAF' },
    { name: 'Reviews', icon: 'star' as IconName },
    { name: 'Profile Settings', icon: 'user' as IconName },
    { name: 'Support', icon: 'message' as IconName }
  ];

  const handleNavClick = (itemName: string) => {
    setIsSidebarOpen(false);
    if (itemName === 'Log Out') {
      onNavigate('home');
    } else {
      setActiveTab(itemName);
    }
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

        <div className="user-card-new" style={{ cursor: 'pointer' }}>
          <img src={images.proSamuel} alt="User Avatar" />
          <div className="user-info-new">
            <h3>Pro Nounga</h3>
            <div className="role-row">
              <span className="role-text" style={{ background: '#E0F2FE', color: '#0369A1' }}>Provider</span>
              <span className="verified-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '0.7rem', height: '0.7rem' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                Verified
              </span>
            </div>
          </div>
        </div>

        <nav className="sidebar-links-new">
          {providerNavItems.map((item) => (
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
            <button className="side-link-new" onClick={() => onRoleChange('client')}>
              <Icon name="user" />
              <span>Client View</span>
            </button>
          )}

          <button className="side-link-new" onClick={() => onNavigate('home')}>
            <Icon name="x" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Dashboard Area */}
      <section className="dash-main-new">
        <header className="dash-header-premium">
          <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu" style={{ display: 'none' }}>
            <Icon name="menu" />
          </button>
          <div className="mobile-logo-dash" style={{ display: 'none', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.2rem', color: 'var(--ink)' }}>
            <span className="logo-mark-dash" style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#14B8A6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>F</span>
            Fixam
          </div>
          
          {/* Live Ticker */}
          <div className="header-news-ticker">
            <span className="ticker-static-badge">Live Scores</span>
            <div className="ticker-scroll-container">
              <div className="ticker-marquee-track">
                {tickerItems.map((item, index) => (
                  <span className="ticker-track-item" key={index}>
                    <span className={`ticker-item-badge ${item.isNews ? 'news' : ''}`}>{item.badgeText}</span>
                    <span>{item.text}</span>
                  </span>
                ))}
                {tickerItems.map((item, index) => (
                  <span className="ticker-track-item" key={`dup-${index}`}>
                    <span className={`ticker-item-badge ${item.isNews ? 'news' : ''}`}>{item.badgeText}</span>
                    <span>{item.text}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="actions-right-dash">
            <button className="icon-btn-dash" onClick={() => setActiveTab('Messages')} aria-label="Messages">
              <Icon name="chat" />
              <span className="badge-indicator">2</span>
            </button>
            <button className="icon-btn-dash" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle Theme">
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>

            <button className="profile-chip-dash">
              <img src={images.proSamuel} alt="Nounga profile" />
              <div className="profile-details-dash">
                <span className="profile-name-dash">
                  Pro Nounga
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '0.8rem', height: '0.8rem', marginLeft: '0.3rem' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
                <span className="profile-role-dash">Provider</span>
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className={`dash-content-premium ${activeTab === 'Dashboard' ? 'dashboard-tab-active' : ''}`}>
          {activeTab === 'Dashboard' && (
            <>
              {/* Left/Middle Column */}
              <div className="dash-body-left">
                <div className="dash-greeting-row">
                  <div>
                    <h1>Welcome back, Pro Nounga! 🚀</h1>
                    <p>What would you like to do today?</p>
                  </div>
                  {onRoleChange && (
                    <button 
                      className="btn-browse-services"
                      onClick={() => onRoleChange('client')}
                      style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
                    >
                      <Icon name="user" />
                      Switch to Client View
                    </button>
                  )}
                </div>

                {/* Quick Action Buttons */}
                <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  {[
                    ['Browse Leads', 'Find matching tasks', 'search', 'Job Leads'],
                    ['Active Contracts', 'Manage ongoing work', 'briefcase', 'My Jobs'],
                    ['Messages', 'Chat with clients', 'chat', 'Messages'],
                    ['Earnings', 'View payouts & rewards', 'wallet', 'Wallet'],
                  ].map(([title, desc, icon, tabName]) => (
                    <button key={title} onClick={() => setActiveTab(tabName)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', background: '#FFFFFF', cursor: 'pointer', transition: 'all 200ms ease', textAlign: 'left' }}>
                      <span style={{ color: '#14B8A6', marginBottom: '8px', display: 'inline-flex' }}><Icon name={icon as IconName} /></span>
                      <strong style={{ fontSize: '15px', color: '#1F2937' }}>{title}</strong>
                      <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{desc}</span>
                    </button>
                  ))}
                </div>

                {/* Metric Panel Grid */}
                <div className="metric-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  {[
                    ['85,000 XAF', 'Total Earnings', 'wallet'],
                    ['3', 'Active Jobs', 'briefcase'],
                    ['28', 'Completed Jobs', 'check'],
                    ['4.9', 'Average Rating', 'star'],
                  ].map(([value, label, icon]) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                      <span style={{ color: '#14B8A6', marginBottom: '6px', display: 'inline-flex' }}><Icon name={icon as IconName} /></span>
                      <strong style={{ fontSize: '18px', color: '#1F2937' }}>{value}</strong>
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Leads List table */}
                <section className="task-table">
                  <div className="task-head">
                    <h2>Job Leads Near You</h2>
                    <button className="panel-link" onClick={() => setActiveTab('Job Leads')}>Filter Leads</button>
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
                  <button className="wide-button" onClick={() => setActiveTab('Job Leads')}>View All Leads →</button>
                </section>
              </div>

              {/* Right/Sidebar Column */}
              <div className="dash-body-right">
                <div className="wallet-card" style={{ padding: '24px', background: 'linear-gradient(135deg, #14B8A6, #0D9488)', color: '#FFFFFF', borderRadius: '16px', marginBottom: '24px' }}>
                  <span style={{ opacity: 0.9, fontSize: '13px' }}>Total Earnings Tracked</span>
                  <strong style={{ fontSize: '28px', display: 'block', margin: '4px 0' }}>85,000 XAF</strong>
                  <p style={{ opacity: 0.8, fontSize: '12px', margin: '0 0 16px 0' }}>Cash received from 28 jobs</p>
                  <button onClick={() => setActiveTab('Wallet')} style={{ backgroundColor: '#FFFFFF', color: '#14B8A6', border: 'none', borderRadius: '24px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>View Job History →</button>
                </div>

                <ActivityCard />

                <section className="right-panel" style={{ marginTop: '24px' }}>
                  <div className="panel-title">
                    <h2>New Client Proposals</h2>
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
              </div>
            </>
          )}

          {activeTab === 'My Jobs' && (
            <MyJobs 
              setActiveTab={setActiveTab} 
              setActiveChatUser={setActiveChatUser} 
            />
          )}
          {activeTab === 'Job Leads' && <JobLeads />}
          {activeTab === 'Wallet' && <ProviderWallet />}
          {activeTab === 'Reviews' && <ProviderReviews />}
          {activeTab === 'Profile Settings' && <ProfileSettings />}
          {activeTab === 'Support' && <ProviderSupport />}
          {activeTab === 'Messages' && (
            <Messages 
              chatMessages={chatMessages} 
              setChatMessages={setChatMessages} 
              activeChatUser={activeChatUser} 
              setActiveChatUser={setActiveChatUser} 
            />
          )}
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

export function Footer({ onNavigate }: { onNavigate?: (page: Page) => void }) {
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
          <button onClick={() => onNavigate?.('terms')}>{t('footer.terms') || 'Terms of Service'}</button>
          <button onClick={() => onNavigate?.('privacy')}>{t('footer.privacy') || 'Privacy Policy'}</button>
          <button onClick={() => { 
            onNavigate?.('privacy'); 
            setTimeout(() => document.getElementById('cookies')?.scrollIntoView({ behavior: 'smooth' }), 300); 
          }}>Cookie Policy</button>
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

export function ProCard({ pro, mini = false, onNavigate }: { pro: (typeof pros)[number]; mini?: boolean; onNavigate?: (page: Page) => void }) {
  const { t } = useTranslation();

  return (
    <article className={mini ? 'top-rated-card mini' : 'top-rated-card'}>
      <div className="top-rated-cover">
        <img src={pro.image} alt={pro.name} className="top-rated-img" />
        <div className="top-rated-verified"><Icon name="shield" /> Verified</div>
      </div>
      <div className="top-rated-content">
        <div className="top-rated-avatar">
          {pro.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="top-rated-header">
          <h3>{pro.name}</h3>
          <span className="pro-rating-row"><Icon name="star" /> {pro.rating} <span className="pro-reviews">(120+ reviews)</span></span>
        </div>
        <p className="top-rated-role">{pro.role}</p>
        <div className="top-rated-tags">
          <span className="tag-pill">Premium</span>
          <span className="tag-pill">Reliable</span>
        </div>
        <div className="top-rated-stats">
          <div className="stat-pill"><Icon name="check" /> 100+ Jobs</div>
          <div className="stat-pill"><Icon name="location" /> {pro.distance}</div>
        </div>
        {!mini && <button className="btn-primary-pill full-width" onClick={() => onNavigate && onNavigate('login')}>Hire {pro.name.split(' ')[0]}</button>}
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
        ['Direct Payment', 'Pay your provider directly in cash after the job is done.', 'wallet'],
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
        ['Booking Confirmed', 'Booking fee: 1 coin', '2 days ago', 'wallet'],
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

export function SectionTitle({ title, caption, className }: { title: string; caption: string; className?: string }) {
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
        <div className="brand-cloud"><strong>MTN</strong><strong>orange</strong><strong>MoMo</strong></div>
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
    chart: 'M4 20h16 M4 20V10 M9 20V6 M14 20V12 M19 20V8',
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d={paths[name]} />
    </svg>
  )
}

export default App
