import { useEffect, useState } from 'react'
import './App.css'

type Page = 'home' | 'services' | 'about' | 'login' | 'dashboard'

type IconName =
  | 'appliance'
  | 'bell'
  | 'briefcase'
  | 'calendar'
  | 'chat'
  | 'check'
  | 'cleaning'
  | 'delivery'
  | 'electrical'
  | 'filter'
  | 'home'
  | 'location'
  | 'menu'
  | 'message'
  | 'painting'
  | 'plumbing'
  | 'search'
  | 'shield'
  | 'star'
  | 'user'
  | 'wallet'
  | 'wrench'

const asset = (fileName: string) => `/assets/${fileName}`

const images = {
  landingHero: asset('landing-hero-composite.png'),
  heroProfessional: asset('hero-professional.png'),
  appHomeScreen: asset('app-home-screen.png'),
  servicePlumber: asset('service-plumber.jpg'),
  serviceCleaner: asset('service-cleaner.jpg'),
  serviceElectrician: asset('service-electrician.jpg'),
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
} as const

const navItems: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'How It Works', page: 'home' },
  { label: 'Services', page: 'services' },
  { label: 'For Providers', page: 'home' },
  { label: 'Pricing', page: 'home' },
  { label: 'Blog', page: 'home' },
  { label: 'Contact Us', page: 'home' },
]

const services = [
  { title: 'Plumbing', desc: 'Fix leaks, pipes, water heaters & more', count: 256, icon: 'plumbing' as IconName, color: 'blue' },
  { title: 'Electrical', desc: 'Wiring, lighting, outlets, fans & more', count: 198, icon: 'electrical' as IconName, color: 'green' },
  { title: 'Cleaning', desc: 'Home, office, deep cleaning & more', count: 342, icon: 'cleaning' as IconName, color: 'purple' },
  { title: 'Painting', desc: 'Walls, doors, rooms & custom paint', count: 158, icon: 'painting' as IconName, color: 'orange' },
  { title: 'Carpentry', desc: 'Furniture, doors, shelves & woodwork', count: 124, icon: 'wrench' as IconName, color: 'brown' },
  { title: 'Appliance Repair', desc: 'Washing machines, ACs, fridges & more', count: 110, icon: 'appliance' as IconName, color: 'blue' },
  { title: 'Home Care', desc: 'General home maintenance & repairs', count: 98, icon: 'home' as IconName, color: 'green' },
  { title: 'Delivery', desc: 'Parcel, food & document delivery', count: 210, icon: 'delivery' as IconName, color: 'pink' },
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

function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <div className={page === 'dashboard' ? 'app dashboard-shell' : 'app'}>
      {page === 'dashboard' ? (
        <Dashboard onNavigate={setPage} />
      ) : page === 'login' ? (
        <Login onNavigate={setPage} />
      ) : (
        <>
          <Header page={page} onNavigate={setPage} />
          <main>
            {page === 'services' && <Services />}
            {page === 'about' && <About onNavigate={setPage} />}
            {page === 'home' && <Home onNavigate={setPage} />}
          </main>
        </>
      )}
    </div>
  )
}

function Header({ page, onNavigate }: { page: Page; onNavigate: (page: Page) => void }) {
  return (
    <header className={page === 'home' ? 'site-header landing-header' : 'site-header'}>
      <button className="brand brand-button" onClick={() => onNavigate('home')} aria-label="Go to homepage">
        <Logo />
      </button>
      <nav>
        {navItems.map((item) => (
          <button
            className={(page === 'home' && item.label === 'Home') || (page === 'services' && item.label === 'Services') ? 'nav-link active' : 'nav-link'}
            key={item.label}
            onClick={() => onNavigate(item.page)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" aria-label="Theme toggle">
          <span />
        </button>
        <button className="outline-button" onClick={() => onNavigate('login')}>
          Log In
        </button>
        <button className="primary-button" onClick={() => onNavigate('login')}>
          Sign Up
        </button>
      </div>
    </header>
  )
}

function Home({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="landing-page">
      <section className="hero section-grid">
        <div className="hero-copy reveal">
          <span className="pill">Trusted Home Services Platform</span>
          <h1>
            Get Things Done. <span>The Right Way.</span>
          </h1>
          <p>Post tasks, connect with verified professionals, and get quality work done fast, safe, and hassle-free.</p>
          <div className="button-row">
            <button className="primary-button large">+ Post a Task</button>
            <button className="outline-button large" onClick={() => onNavigate('services')}>
              Find a Professional
            </button>
          </div>
          <div className="trust-row">
            <SmallTrust icon="shield" label="Verified Professionals" />
            <SmallTrust icon="wallet" label="Secure Payments" />
            <SmallTrust icon="check" label="Satisfaction Guaranteed" />
          </div>
        </div>
        <HeroSingleImage />
      </section>

      <section className="section">
        <SectionTitle title="Popular Services" caption="Find help for almost anything at home or office." />
        <div className="service-strip">
          {services.slice(0, 6).map((service) => (
            <ServiceMini key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionTitle title="How Fixam Works" caption="Simple steps to get your task done." />
        <div className="steps">
          {[
            ['Post a Task', 'Tell us what you need done in minutes.', 'home'],
            ['Get Proposals', 'Receive offers from verified professionals.', 'briefcase'],
            ['Choose & Book', 'Select the best pro and book with confidence.', 'location'],
            ['Get It Done', 'Relax while the job gets done right.', 'wrench'],
          ].map(([title, desc, icon]) => (
            <div className="step" key={title}>
              <Icon name={icon as IconName} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <StatsBand />

      <section className="section">
        <SectionTitle title="Top Rated Professionals" caption="Hire trusted experts in your area." />
        <div className="pro-grid">
          {pros.map((pro) => (
            <ProCard key={pro.name} pro={pro} />
          ))}
        </div>
        <div className="center-actions">
          <button className="outline-button">View All Professionals</button>
        </div>
      </section>

      <section className="section">
        <SectionTitle title="What Our Customers Say" caption="Real people. Real stories." />
        <div className="testimonial-grid">
          {['Fixam made it so easy to find a professional plumber. He came on time and did an excellent job!', 'I love how quick I get responses when I post a task. Very reliable and trustworthy platform.', 'The cleaner I hired did an amazing job. My house has never looked better!'].map((quote, index) => (
            <article className="testimonial" key={quote}>
              <span className="quote-mark">“</span>
              <p>{quote}</p>
              <strong>{['Maria Sanchez', 'David N.', 'Amina K.'][index]}</strong>
              <span className="stars">★★★★★</span>
            </article>
          ))}
        </div>
      </section>

      <CtaBand onNavigate={onNavigate} />

      <section className="section">
        <SectionTitle title="Tips & Resources" caption="Helpful tips to maintain your home and save more." />
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article className="blog-card" key={post.title}>
              <ImageSlot src={post.image} alt="" label={post.tag} />
              <div>
                <span>{post.tag}</span>
                <h3>{post.title}</h3>
                <p>May 10, 2026 • 5 min read</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AppTrust />
      <Footer />
    </div>
  )
}

function Services() {
  return (
    <>
      <section className="services-hero section-grid">
        <div className="hero-copy reveal">
          <span className="pill">All Services</span>
          <h1>
            Explore Services. <span>Hire Trusted Professionals.</span>
          </h1>
          <p>Find the right expert for your home, office, or business needs. Quality work, on time, every time.</p>
        </div>
        <HeroCollage compact />
      </section>
      <section className="service-browser">
        <div className="search-panel">
          <label>
            <Icon name="search" />
            <input placeholder="Search services (e.g. plumbing, cleaning, electrician)..." />
          </label>
          <button className="select-button">
            <Icon name="location" /> All Locations
          </button>
          <button className="select-button">
            <Icon name="filter" /> Sort by
          </button>
          <button className="select-button">
            <Icon name="menu" /> Filters
          </button>
        </div>
        <div className="browser-layout">
          <aside className="category-panel">
            <h2>Categories</h2>
            {services.map((service, index) => (
              <button className={index === 0 ? 'category active' : 'category'} key={service.title}>
                <Icon name={service.icon} />
                {service.title}
                <span>({index === 0 ? 48 : index + 3})</span>
              </button>
            ))}
            <div className="safety-box">
              <Icon name="shield" />
              <strong>All professionals are verified and trusted.</strong>
              <p>Your safety is our priority.</p>
            </div>
          </aside>
          <div className="service-results">
            <div className="results-head">
              <h2>48 Services Found</h2>
              <span>View as: ▦ ☰</span>
            </div>
            <div className="service-card-grid">
              {services.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>
            <FeatureRow />
          </div>
        </div>
        <CtaBand />
      </section>
    </>
  )
}

function About({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      <section className="about-hero section-grid">
        <div className="hero-copy reveal">
          <span className="pill">About Fixam</span>
          <h1>
            We’re on a mission to <span>make life easier.</span>
          </h1>
          <p>Fixam connects you with trusted, verified professionals who get the job done right the first time.</p>
          <div className="about-points">
            <SmallTrust icon="shield" label="Verified Professionals" text="All pros are carefully vetted for your safety and peace of mind." />
            <SmallTrust icon="check" label="Quality & Trust" text="We’re committed to delivering the best service experience." />
          </div>
        </div>
        <HeroCollage compact />
      </section>
      <section className="about-stats">
        {[
          ['10K+', 'Active Professionals', 'Verified experts in our network', 'user'],
          ['50K+', 'Tasks Completed', 'Successfully delivered', 'calendar'],
          ['25+', 'Cities Covered', 'Across Cameroon', 'location'],
          ['98%', 'Customer Satisfaction', 'Happy customers every day', 'shield'],
        ].map(([value, title, desc, icon]) => (
          <div key={title}>
            <Icon name={icon as IconName} />
            <strong>{value}</strong>
            <span>{title}</span>
            <p>{desc}</p>
          </div>
        ))}
      </section>
      <section className="about-cards">
        <article>
          <Icon name="briefcase" />
          <h2>Our Mission</h2>
          <p>To simplify everyday life by connecting people with reliable professionals through technology, trust, and exceptional service.</p>
        </article>
        <article className="story-card">
          <h2>Our Story</h2>
          <p>Fixam was founded with a simple idea: finding a reliable professional should be easy, fast, and stress-free.</p>
          <p>We saw the challenges people face daily trying to find trustworthy help for their homes, businesses, and personal needs. So, we built a platform that brings transparency, convenience, and quality to every service experience.</p>
          <p>Today, Fixam is proud to be the go-to platform for thousands of customers and professionals across the country.</p>
        </article>
        <article>
          <h2>Our Values</h2>
          {['Trust', 'Quality', 'Convenience', 'Community'].map((value) => (
            <SmallTrust key={value} icon="check" label={value} text="We grow together with our customers and professionals." />
          ))}
        </article>
      </section>
      <CtaBand onNavigate={onNavigate} />
      <Footer />
    </>
  )
}

function Login({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <main className="login-page">
      <section className="login-art">
        <Logo light />
        <div className="login-art-copy">
          <h1>
            Welcome Back! <span>Let’s get things done today.</span>
          </h1>
          <p>Login to your account and continue using Fixam to connect with trusted professionals.</p>
        </div>
        <div className="floating-benefits">
          <SmallTrust icon="shield" label="Verified Professionals" />
          <SmallTrust icon="wallet" label="Secure Payments" />
          <SmallTrust icon="check" label="Satisfaction Guaranteed" />
        </div>
        <div className="login-person">
          <ImageSlot src={images.heroProfessional} alt="" label="Fixam pro" />
        </div>
        <div className="login-stats">
          <span><strong>10K+</strong>Tasks Completed</span>
          <span><strong>5K+</strong>Verified Pros</span>
          <span><strong>98%</strong>Satisfaction</span>
          <span><strong>24/7</strong>Support</span>
        </div>
      </section>
      <section className="login-form-wrap">
        <div className="login-top">
          <span>Don’t have an account?</span>
          <button className="outline-button">Sign Up</button>
        </div>
        <form className="login-card">
          <h2>Welcome back</h2>
          <p>Login to your Fixam account</p>
          <label>
            Email Address
            <span><Icon name="message" /><input type="email" placeholder="Enter your email address" /></span>
          </label>
          <label>
            Password
            <span><Icon name="shield" /><input type="password" placeholder="Enter your password" /></span>
          </label>
          <button className="link-button" type="button">Forgot Password?</button>
          <button className="primary-button login-button" type="button" onClick={() => onNavigate('dashboard')}>Login →</button>
          <div className="divider">or continue with</div>
          <div className="social-row">
            <button type="button">Google</button>
            <button type="button">Apple</button>
            <button type="button">Facebook</button>
          </div>
          <p className="secure-note"><Icon name="shield" /> Your data is safe and secure with us.</p>
        </form>
        <AppTrust simple />
      </section>
    </main>
  )
}

function Dashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <button className="brand brand-button" onClick={() => onNavigate('home')}><Logo /></button>
        {['Dashboard', 'My Tasks', 'Messages', 'Saved Professionals', 'Payments', 'Wallet', 'Reviews', 'Profile Settings', 'Support', 'Log Out'].map((item, index) => (
          <button className={index === 0 ? 'side-link active' : 'side-link'} key={item}>
            <Icon name={['home', 'calendar', 'chat', 'star', 'briefcase', 'wallet', 'star', 'user', 'message', 'menu'][index] as IconName} />
            {item}
            {item === 'Messages' && <span>2</span>}
            {item === 'Wallet' && <span>48 Coins</span>}
          </button>
        ))}
        <div className="sidebar-cta">
          <h3>Post a Task</h3>
          <p>Get offers from verified professionals in minutes.</p>
          <button>Create Task →</button>
        </div>
      </aside>
      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <label>
            <Icon name="search" />
            <input placeholder="Search services, professionals, or tasks..." />
          </label>
          <div className="dash-icons">
            <Icon name="bell" />
            <Icon name="chat" />
          </div>
          <button className="profile-chip" onClick={() => onNavigate('home')}>
            <ImageSlot src={images.proJeff} alt="" label="NJ" />
            <span>Nounga Joseph<small>Client</small></span>
          </button>
        </header>
        <div className="dashboard-content">
          <div className="dashboard-left">
            <h1>Welcome back, Nounga! 👋</h1>
            <p>What would you like to do today?</p>
            <div className="quick-actions">
              {[
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
              ))}
            </div>
            <div className="metric-card">
              {[
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
              ))}
            </div>
            <section className="task-table">
              <div className="task-head">
                <h2>My Tasks</h2>
                <button>View All Tasks</button>
              </div>
              <div className="tabs"><span>All (12)</span><span>Pending (3)</span><span>In Progress (5)</span><span>Completed (6)</span><span>Cancelled (1)</span></div>
              {tasks.map((task) => (
                <article className="task-row" key={task.title}>
                  <ImageSlot src={task.image} alt="" label={task.tag} />
                  <div><span>{task.tag}</span><h3>{task.title}</h3><p>Douala, Cameroon</p></div>
                  <strong>{task.price}</strong>
                  <b>{task.status}</b>
                </article>
              ))}
              <button className="wide-button">View All Tasks →</button>
            </section>
            <div className="dashboard-alert"><Icon name="shield" /><span><strong>All professionals are verified and trusted.</strong>Your safety and satisfaction are our priority.</span><button>Learn More</button></div>
          </div>
          <aside className="dashboard-right">
            <div className="wallet-card">
              <span>Wallet Balance</span>
              <strong>48 Coins</strong>
              <p>≈ 960 FCFA</p>
              <button>Top Up Wallet →</button>
            </div>
            <ActivityCard />
            <section className="right-panel">
              <div className="panel-title"><h2>Top Rated Professionals</h2><button>View All</button></div>
              <div className="mini-pros">
                {pros.slice(0, 3).map((pro) => <ProCard key={pro.name} pro={pro} mini />)}
              </div>
            </section>
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
        ['10K+', 'Tasks Completed', 'calendar'],
        ['5K+', 'Verified Professionals', 'user'],
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

function Footer() {
  return (
    <footer className="footer">
      <div>
        <Logo light />
        <p>Fixam connects you with verified professionals to get things done quickly and reliably.</p>
        <div className="socials"><span>f</span><span>x</span><span>◎</span><span>in</span></div>
      </div>
      {[
        ['Company', 'About Us', 'How It Works', 'Careers', 'Press', 'Contact Us'],
        ['Services', 'Plumbing', 'Electrical', 'Cleaning', 'Painting', 'All Services'],
        ['Support', 'Help Center', 'Safety', 'Terms of Service', 'Privacy Policy', 'Refund Policy'],
        ['Contact Us', '+237 6XX XXX XXX', 'support@fixam.com', 'Douala, Cameroon'],
      ].map(([title, ...links]) => (
        <div key={title}>
          <h3>{title}</h3>
          {links.map((link) => <a href="/" onClick={(event) => event.preventDefault()} key={link}>{link}</a>)}
        </div>
      ))}
      <p className="copyright">© 2026 Fixam. All rights reserved.</p>
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

function ProCard({ pro, mini = false }: { pro: (typeof pros)[number]; mini?: boolean }) {
  return (
    <article className={mini ? 'pro-card mini' : 'pro-card'}>
      <ImageSlot src={pro.image} alt="" label={pro.name} />
      <div>
        <h3>{pro.name}</h3>
        <p>{pro.role}</p>
        <div><span className="stars">★ {pro.rating}</span><span>{pro.distance}</span></div>
        {!mini && <button className="primary-button">Book Now</button>}
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

function SectionTitle({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="section-title">
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
        <div className="brand-cloud">
          <strong className="mtn-logo">MTN</strong>
          <strong className="orange-logo">orange</strong>
        </div>
      </div>
      <div>
        <h2>Get the Fixam App</h2>
        <p>Manage tasks, chat with pros and more from your mobile device.</p>
        <div className="store-row">
          <button><span className="apple-mark">Apple</span> App Store</button>
          <button><span className="play-mark" /> Google Play</button>
        </div>
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

function Icon({ name }: { name: IconName }) {
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
