import { useEffect, useState } from 'react';
import { Page, Footer } from '../App';
import './LegalPages.css';

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalLayoutProps {
  pageTitle: string;
  effectiveDate: string;
  sections: Section[];
  onNavigate: (page: Page) => void;
  brandText: string;
  downloadLabel: string;
}

export default function LegalLayout({ 
  pageTitle, 
  effectiveDate, 
  sections, 
  onNavigate,
  brandText,
  downloadLabel
}: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="legal-page-wrapper">
      <header className="legal-header-bar">
        <button className="legal-brand" onClick={() => onNavigate('home')}>
          <span className="legal-brand-name">Fixam</span>
          <span className="legal-brand-suffix">legal</span>
        </button>
      </header>

      <div className="legal-layout-container">
        <aside className="legal-sidebar">
          <div className="legal-nav-label">{brandText}</div>
          <nav className="legal-nav-items">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`legal-nav-link ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        <main className="legal-content-wrapper">
          <div className="legal-content-inner" id="legal-content">
            <div className="legal-doc-header">
              <h1 className="legal-doc-title">{pageTitle}</h1>
              <div className="legal-doc-date">{effectiveDate}</div>
              <button 
                className="legal-download-btn" 
                onClick={handleDownload}
                id="download-btn"
              >
                {downloadLabel}
              </button>
            </div>
            
            <hr className="legal-divider" />

            <div className="legal-sections">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="legal-section">
                  <h2 className="legal-section-title">{section.title}</h2>
                  {section.content}
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
