import { useState, useEffect } from 'react';
import { getAllGuidelines } from '../data/guidelines';
import { checkPDFInCache, debugCaches } from '../utils/cacheDebug';

export const usePDFPreloader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const preloadPDFs = async () => {
      const guidelines = getAllGuidelines();
      let loaded = 0;

      console.log(`📥 Starting PDF preload for ${guidelines.length} files...`);

      for (const guideline of guidelines) {
        try {
          // Construct full URL with base path for GitHub Pages compatibility
          const pdfUrl = `${import.meta.env.BASE_URL}${guideline.pdfPath.replace(/^\//, '')}`;

          // Fetch PDF and consume response to ensure service worker caches it
          const response = await fetch(pdfUrl, {
            cache: 'reload' // Force fresh fetch to ensure caching
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          // Consume the response body to trigger proper caching
          const blob = await response.blob();
          console.log(`✓ Fetched: ${guideline.pdfPath} (${(blob.size / 1024).toFixed(2)} KB)`);

          // Verify it's in cache
          setTimeout(async () => {
            await checkPDFInCache(guideline.pdfPath);
          }, 100);

          loaded++;
          setLoadingProgress((loaded / guidelines.length) * 100);
        } catch (error) {
          console.error(`✗ Failed to preload ${guideline.pdfPath}:`, error);
          loaded++;
          setLoadingProgress((loaded / guidelines.length) * 100);
        }
      }

      setIsComplete(true);
      console.log('✓ All PDFs preload complete');

      // Debug: Show all caches after 2 seconds
      setTimeout(() => {
        debugCaches();
      }, 2000);
    };

    // Wait for service worker to be ready
    const timer = setTimeout(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
          console.log('✓ Service Worker ready, starting PDF preload');
          preloadPDFs();
        });
      } else {
        console.warn('Service Worker not supported');
        preloadPDFs();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { loadingProgress, isComplete };
};
