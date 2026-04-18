import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to top on route changes, or to a section when the URL includes a hash (e.g. /about#news-updates).
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      if (!id) {
        window.scrollTo(0, 0);
        return;
      }
      const run = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      requestAnimationFrame(() => requestAnimationFrame(run));
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
