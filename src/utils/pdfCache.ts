export const cachePDFs = async (pdfPaths: string[]): Promise<void> => {
  if ('caches' in window) {
    const cache = await caches.open('pdf-cache-v1');
    await Promise.all(
      pdfPaths.map(async (path) => {
        try {
          const response = await fetch(path);
          if (response.ok) {
            await cache.put(path, response);
          }
        } catch (error) {
          console.error(`Failed to cache ${path}:`, error);
        }
      })
    );
  }
};

export const getCachedPDF = async (pdfPath: string): Promise<Response | undefined> => {
  if ('caches' in window) {
    const cache = await caches.open('pdf-cache-v1');
    return await cache.match(pdfPath);
  }
  return undefined;
};

export const clearPDFCache = async (): Promise<void> => {
  if ('caches' in window) {
    await caches.delete('pdf-cache-v1');
  }
};
