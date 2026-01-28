export const debugCaches = async () => {
  if (!('caches' in window)) {
    console.error('Cache API not available');
    return;
  }

  try {
    const cacheNames = await caches.keys();
    console.log('📦 Available caches:', cacheNames);

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      console.log(`\n📦 Cache: ${cacheName} (${requests.length} entries)`);

      requests.forEach((request) => {
        console.log(`  - ${request.url}`);
      });
    }
  } catch (error) {
    console.error('Error checking caches:', error);
  }
};

export const checkPDFInCache = async (pdfPath: string): Promise<boolean> => {
  if (!('caches' in window)) {
    return false;
  }

  try {
    // Construct full URL with base path for GitHub Pages compatibility
    const baseUrl = import.meta.env.BASE_URL || '/';
    const fullUrl = `${window.location.origin}${baseUrl}${pdfPath.replace(/^\//, '')}`;

    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const response = await cache.match(fullUrl);

      if (response) {
        console.log(`✓ Found ${pdfPath} in cache: ${cacheName}`);
        return true;
      }
    }

    console.warn(`✗ ${pdfPath} not found in any cache (checked: ${fullUrl})`);
    return false;
  } catch (error) {
    console.error('Error checking PDF in cache:', error);
    return false;
  }
};
