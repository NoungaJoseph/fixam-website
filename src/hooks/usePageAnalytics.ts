import { useEffect, useRef } from 'react';

/**
 * usePageAnalytics Hook
 * Automatically tracks page views and stay duration.
 * 
 * Privacy Rule Compliance:
 * - If the user is logged in (has fixam_token / account session): DO NOT track stay duration (duration = null).
 * - If the user is a guest / non-logged in visitor: measures stay duration and sends on page leave / unmount.
 */
export function usePageAnalytics(pathname: string) {
  const enterTimeRef = useRef<number>(Date.now());
  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.usefixam.com/api';
  const trackEndpoint = `${apiUrl.replace(/\/$/, '')}/analytics/track`;

  useEffect(() => {
    enterTimeRef.current = Date.now();
    const token = localStorage.getItem('fixam_token');
    const isGuest = !token;

    // Send initial page view ping
    try {
      fetch(trackEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname || '/',
          domain: window.location.hostname || 'usefixam.com',
          isGuest,
          duration: null
        })
      }).catch(() => {});
    } catch (_) {}

    // Track stay duration ONLY for non-logged in guests when leaving the page
    const handleLeave = () => {
      if (!isGuest) return; // Do NOT monitor stay duration for logged-in users
      const durationSeconds = Math.round((Date.now() - enterTimeRef.current) / 1000);
      if (durationSeconds <= 0) return;

      const payload = JSON.stringify({
        path: pathname || '/',
        domain: window.location.hostname || 'usefixam.com',
        isGuest: true,
        duration: durationSeconds
      });

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(trackEndpoint, blob);
      } else {
        fetch(trackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleLeave);

    return () => {
      window.removeEventListener('beforeunload', handleLeave);
      handleLeave();
    };
  }, [pathname, trackEndpoint]);
}
