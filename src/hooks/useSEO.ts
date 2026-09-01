import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  isFr?: boolean;
}

export function useSEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = 'https://usefixam.com/assets/fixam-white-bg.png',
  isFr = false
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    const siteName = 'Fixam';
    if (title) {
      document.title = title.includes(siteName) ? title : `${title} | ${siteName}`;
    }

    // Helper to create or update meta tags
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Update Meta Description
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    // 3. Update OG / Twitter Titles
    if (title) {
      setMetaTag('property', 'og:title', document.title);
      setMetaTag('name', 'twitter:title', document.title);
    }

    // 4. Update OpenGraph Image & Type
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('property', 'og:type', ogType);

    // 5. Update Canonical Tag
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonical);
      setMetaTag('property', 'og:url', canonical);
    }

    // 6. Update HTML Lang attribute
    document.documentElement.lang = isFr ? 'fr' : 'en';

  }, [title, description, canonical, ogType, ogImage, isFr]);
}

export default useSEO;
