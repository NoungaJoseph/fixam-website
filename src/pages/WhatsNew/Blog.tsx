import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Footer } from '../../App';
import { articlesData, ArticleItem } from '../../data/ArticlesData';
import '../Resources/Subpages.css';

interface BlogProps {
  onNavigate: (page: Page) => void;
  selectedArticleId?: string | null;
}

export default function Blog({ onNavigate, selectedArticleId }: BlogProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (selectedArticleId) {
      const found = articlesData.find(a => a.id === selectedArticleId || a.slug === selectedArticleId);
      if (found) {
        setActiveArticle(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    // Check URL search or hash
    const hash = window.location.hash.replace('#article-', '');
    if (hash) {
      const found = articlesData.find(a => a.id === hash || a.slug === hash);
      if (found) {
        setActiveArticle(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [selectedArticleId]);

  const categories = [
    { key: 'All', labelEn: 'All Topics', labelFr: 'Tous les Sujets' },
    { key: 'Industry Reports', labelEn: 'Industry Reports', labelFr: 'Rapports Sectoriels' },
    { key: 'Hiring Guides', labelEn: 'Hiring Guides', labelFr: 'Guides Pratiques' },
    { key: 'Artisan Success', labelEn: 'Artisan Stories', labelFr: 'Témoignages' },
    { key: 'Platform Updates', labelEn: 'Platform Updates', labelFr: 'Actualités' }
  ];

  const filteredArticles = articlesData.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.categoryEn === selectedCategory;
    const title = isFr ? item.titleFr : item.titleEn;
    const desc = isFr ? item.descFr : item.descEn;
    const matchesSearch = !searchQuery.trim() || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectArticle = (article: ArticleItem) => {
    setActiveArticle(article);
    window.location.hash = `article-${article.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setActiveArticle(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="subpage-premium" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* ── If An Article is Active, Render Full Article Reader ── */}
      {activeArticle ? (
        <article className="article-reader-container" style={{ maxWidth: '880px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
          {/* Back Button */}
          <button 
            onClick={handleBackToList}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              padding: '0.6rem 1.25rem',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#071936',
              cursor: 'pointer',
              marginBottom: '2rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <span>←</span> {isFr ? 'Retour aux Articles' : 'Back to All Articles'}
          </button>

          {/* Category & Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <span style={{ backgroundColor: '#0D9488', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 800, padding: '0.3rem 0.75rem', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isFr ? activeArticle.categoryFr : activeArticle.categoryEn}
            </span>
            <span style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>•</span>
            <span style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>{activeArticle.readTime}</span>
            <span style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>•</span>
            <span style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>{activeArticle.date}</span>
          </div>

          {/* Article Title */}
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.9rem)', fontWeight: 900, color: '#071936', lineHeight: 1.25, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            {isFr ? activeArticle.titleFr : activeArticle.titleEn}
          </h1>

          {/* Subtitle / Excerpt */}
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#475569', fontWeight: 500, marginBottom: '2.5rem', borderLeft: '4px solid #0D9488', paddingLeft: '1.25rem', fontStyle: 'italic' }}>
            {isFr ? activeArticle.descFr : activeArticle.descEn}
          </p>

          {/* Author Badge Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '1rem 1.25rem', borderRadius: '14px', marginBottom: '3rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <img 
              src={activeArticle.author.avatar} 
              alt={activeArticle.author.name} 
              style={{ width: '52px', height: '52px', borderRadius: '26px', objectFit: 'cover', border: '2px solid #0D9488' }} 
            />
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#071936' }}>{activeArticle.author.name}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                {isFr ? activeArticle.author.roleFr : activeArticle.author.roleEn}
              </p>
            </div>
          </div>

          {/* Main Hero Photo */}
          <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '3rem', border: '1px solid #E2E8F0', maxHeight: '420px', backgroundColor: '#000' }}>
            <img 
              src={activeArticle.heroImage} 
              alt={isFr ? activeArticle.titleFr : activeArticle.titleEn} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
            />
          </div>

          {/* Article Sections (with mid-sentence images, key takeaways, and checklists) */}
          <div className="article-body-content" style={{ color: '#1E293B', fontSize: '1.1rem', lineHeight: 1.8 }}>
            {activeArticle.sections.map((section, sIdx) => (
              <section key={sIdx} style={{ marginBottom: '3.5rem' }}>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#071936', marginBottom: '1.25rem', lineHeight: 1.3 }}>
                  {isFr ? section.headingFr : section.headingEn}
                </h2>

                {(isFr ? section.paragraphsFr : section.paragraphsEn).map((para, pIdx) => (
                  <p key={pIdx} style={{ marginBottom: '1.5rem', color: '#334155' }}>
                    {para}
                  </p>
                ))}

                {/* Inline Mid-Sentence Research Image */}
                {section.image && (
                  <figure style={{ margin: '2.5rem 0', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <img 
                      src={section.image.url} 
                      alt={section.image.alt} 
                      style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }} 
                    />
                    <figcaption style={{ padding: '0.85rem 1.25rem', fontSize: '0.9rem', color: '#64748B', fontWeight: 600, background: '#F8FAFC', borderTop: '1px solid #E2E8F0', fontStyle: 'italic' }}>
                      {isFr ? section.image.captionFr : section.image.captionEn}
                    </figcaption>
                  </figure>
                )}

                {/* Key Takeaway Callout Box */}
                {(section.keyTakeawayEn || section.keyTakeawayFr) && (
                  <div style={{ background: '#F0FDFA', border: '1.5px solid #0D9488', borderRadius: '14px', padding: '1.5rem', margin: '2rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0D9488', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <span>💡</span> {isFr ? 'Point Clé à Retenir' : 'Key Industry Takeaway'}
                    </div>
                    <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0F766E', lineHeight: 1.5 }}>
                      {isFr ? section.keyTakeawayFr : section.keyTakeawayEn}
                    </p>
                  </div>
                )}

                {/* Practical Checklist */}
                {(section.checklistEn || section.checklistFr) && (
                  <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '14px', padding: '1.5rem', margin: '2rem 0' }}>
                    <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#071936', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📋</span> {isFr ? 'Recommandations Pratiques' : 'Actionable Inspection Checklist'}
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {(isFr ? section.checklistFr : section.checklistEn)?.map((item, cIdx) => (
                        <li key={cIdx} style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600, lineHeight: 1.5 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Article Footer & Next Actions */}
          <div style={{ background: '#071936', borderRadius: '20px', padding: '2.5rem', textAlign: 'center', color: '#FFFFFF', marginTop: '4rem', boxShadow: '0 8px 24px rgba(7,25,54,0.15)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.75rem' }}>
              {isFr ? 'Prêt à trouver un professionnel certifié ?' : 'Ready to Connect with Verified Professionals?'}
            </h3>
            <p style={{ maxWidth: '540px', margin: '0 auto 1.75rem', color: '#94A3B8', fontSize: '1rem', lineHeight: 1.6 }}>
              {isFr ? 'Publiez votre demande gratuitement ou explorez les artisans qualifiés près de chez vous sans frais d\'intermédiation.' : 'Post your task for free or explore vetted technicians across Cameroon with zero booking commissions.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onNavigate('services')}
                style={{ background: '#0D9488', color: '#FFFFFF', border: 'none', padding: '0.85rem 1.75rem', borderRadius: '999px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
              >
                {isFr ? 'Explorer les Services' : 'Browse Services'}
              </button>
              <button 
                onClick={handleBackToList}
                style={{ background: 'transparent', color: '#FFFFFF', border: '1.5px solid rgba(255,255,255,0.3)', padding: '0.85rem 1.75rem', borderRadius: '999px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
              >
                {isFr ? 'Lire d\'autres Articles' : 'More Articles'}
              </button>
            </div>
          </div>
        </article>
      ) : (
        /* ── All Articles Directory ── */
        <div>
          <div className="subpage-hero" style={{ background: '#071936', color: '#FFFFFF', padding: '4rem 1.5rem 3.5rem', textAlign: 'center' }}>
            <div className="subpage-container" style={{ maxWidth: '840px', margin: '0 auto' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#14B8A6', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-block', marginBottom: '0.75rem' }}>
                {isFr ? 'CENTRE DE RESSOURCES & ARTICLES' : 'FIXAM INSIGHTS & RESEARCH'}
              </span>
              <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.2, margin: '0 0 1rem' }}>
                {isFr ? 'Analyses, Guides & Témoignages' : 'Research, Guides & Case Studies'}
              </h1>
              <p style={{ fontSize: '1.15rem', color: '#94A3B8', maxWidth: '640px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                {isFr 
                  ? 'Des analyses approfondies sur le secteur des services, les normes de sécurité et les meilleures pratiques pour propriétaires et artisans au Cameroun.'
                  : 'In-depth research on trade formalization, home safety standards, and practical guides curated by Fixam industry specialists.'}
              </p>

              {/* Search Box */}
              <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder={isFr ? 'Rechercher un article ou un guide...' : 'Search articles, topics or guides...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem 1.25rem', borderRadius: '999px', border: 'none', fontSize: '0.95rem', color: '#071936', outline: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
              </div>
            </div>
          </div>

          <div className="subpage-content" style={{ padding: '3rem 1.5rem 6rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {/* Category Filter Pills */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    style={{
                      background: selectedCategory === cat.key ? '#071936' : '#FFFFFF',
                      color: selectedCategory === cat.key ? '#FFFFFF' : '#334155',
                      border: '1.5px solid ' + (selectedCategory === cat.key ? '#071936' : '#E2E8F0'),
                      padding: '0.55rem 1.25rem',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {isFr ? cat.labelFr : cat.labelEn}
                  </button>
                ))}
              </div>

              {/* Articles Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleSelectArticle(art)}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                    }}
                  >
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
                      <img 
                        src={art.heroImage} 
                        alt={isFr ? art.titleFr : art.titleEn} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ background: '#F0FDFA', color: '#0D9488', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                            {isFr ? art.categoryFr : art.categoryEn}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>{art.readTime}</span>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#071936', lineHeight: 1.35, marginBottom: '0.75rem' }}>
                          {isFr ? art.titleFr : art.titleEn}
                        </h3>
                        <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                          {isFr ? art.descFr : art.descEn}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '1rem', marginTop: '1.5rem' }}>
                        <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600 }}>{art.date}</span>
                        <span style={{ color: '#0D9488', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          {isFr ? 'Lire l\'article →' : 'Read Article →'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
