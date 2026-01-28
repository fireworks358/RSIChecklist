import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFLoadingState } from './PDFLoadingState';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker - using local file
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFViewerProps {
  pdfPath: string;
  title: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfPath }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.5);
  const isOnline = useOfflineStatus();

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Debug: Check if PDF is in cache when offline
    if (!isOnline && 'caches' in window) {
      caches.keys().then(async (cacheNames) => {
        console.log(`🔍 Checking cache for: ${pdfPath}`);
        console.log(`📦 Available caches:`, cacheNames);

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const response = await cache.match(pdfPath);
          if (response) {
            console.log(`✓ Found ${pdfPath} in ${cacheName}`);
            return;
          }
        }
        console.warn(`✗ ${pdfPath} NOT found in any cache while offline`);
      });
    }
  }, [pdfPath, isOnline]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);

    // Provide context-aware error messages
    if (!isOnline) {
      setError('Cannot load PDF in offline mode. This PDF has not been cached yet. Please connect to the internet to download it for the first time.');
    } else {
      setError('Failed to load PDF. The file may be corrupted or the connection is unstable. Please try again.');
    }

    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-nhs-grey p-6">
        <div className="text-center max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-2xl font-bold text-red-600 mb-6">{error}</p>

          {!isOnline && (
            <div className="bg-nhs-warm-yellow/20 border-2 border-nhs-warm-yellow rounded-lg p-4 mb-6">
              <p className="text-lg text-nhs-black font-semibold">
                💡 Tip: Connect to the internet and reload the app to cache all PDFs for offline use.
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-nhs-grey text-nhs-black rounded-lg font-bold hover:bg-nhs-grey/80 active:scale-95 min-h-touch"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-nhs-blue text-white rounded-lg font-bold hover:bg-nhs-blue/90 active:scale-95 min-h-touch"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-nhs-grey">
      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-nhs-warm-yellow text-nhs-black px-6 py-3 text-center font-bold text-lg">
          ⚠️ Offline Mode - Viewing cached content only
        </div>
      )}

      {/* PDF Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="px-6 py-3 bg-nhs-blue text-white rounded-lg font-bold disabled:opacity-50
                     disabled:cursor-not-allowed hover:bg-nhs-blue/90 active:scale-95 min-h-touch"
          >
            Previous
          </button>
          <span className="text-xl font-bold text-nhs-black">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="px-6 py-3 bg-nhs-blue text-white rounded-lg font-bold disabled:opacity-50
                     disabled:cursor-not-allowed hover:bg-nhs-blue/90 active:scale-95 min-h-touch"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={zoomOut}
            className="px-6 py-3 bg-nhs-blue text-white rounded-lg font-bold hover:bg-nhs-blue/90
                     active:scale-95 min-h-touch"
          >
            Zoom Out
          </button>
          <span className="text-xl font-bold text-nhs-black">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="px-6 py-3 bg-nhs-blue text-white rounded-lg font-bold hover:bg-nhs-blue/90
                     active:scale-95 min-h-touch"
          >
            Zoom In
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-center">
          {loading && <PDFLoadingState />}
          <Document
            file={pdfPath}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<PDFLoadingState />}
            className="shadow-2xl"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="bg-white"
            />
          </Document>
        </div>
      </div>
    </div>
  );
};
