import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFLoadingState } from './PDFLoadingState';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';
import { Stopwatch } from '../ui/Stopwatch';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker - using local file with base path
pdfjs.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfPath: string;
  title: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfPath }) => {
  const navigate = useNavigate();
  // Construct full URL with base path for GitHub Pages compatibility
  const fullPdfUrl = `${import.meta.env.BASE_URL}${pdfPath.replace(/^\//, '')}`;

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
        console.log(`🔍 Checking cache for: ${fullPdfUrl}`);
        console.log(`📦 Available caches:`, cacheNames);

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const response = await cache.match(fullPdfUrl);
          if (response) {
            console.log(`✓ Found ${pdfPath} in ${cacheName}`);
            return;
          }
        }
        console.warn(`✗ ${pdfPath} NOT found in any cache while offline`);
      });
    }
  }, [pdfPath, fullPdfUrl, isOnline]);

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
    <div className="flex flex-col h-full bg-nhs-grey relative">
      {/* Floating Offline Status Badge */}
      {!isOnline && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-nhs-warm-yellow text-nhs-black
                       px-4 py-2 rounded-full shadow-lg font-bold text-sm animate-pulse">
          ⚠️ Offline Mode
        </div>
      )}

      {/* PDF Controls - Overlaying navigation area */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-nhs-blue/95 backdrop-blur-sm text-white shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side: Back, Home, and Page controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold
                       transition-colors active:scale-95 min-h-touch"
            >
              ← Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold
                       transition-colors active:scale-95 min-h-touch flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
            <div className="h-8 w-px bg-white/30 mx-2"></div>
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold disabled:opacity-30
                       disabled:cursor-not-allowed transition-colors active:scale-95 min-h-touch"
            >
              Previous
            </button>
            <span className="text-lg font-bold text-white">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold disabled:opacity-30
                       disabled:cursor-not-allowed transition-colors active:scale-95 min-h-touch"
            >
              Next
            </button>
          </div>

          {/* Right side: Zoom controls and Timer */}
          <div className="flex items-center gap-4">
            <button
              onClick={zoomOut}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold
                       transition-colors active:scale-95 min-h-touch"
            >
              Zoom Out
            </button>
            <span className="text-lg font-bold text-white">{Math.round(scale * 100)}%</span>
            <button
              onClick={zoomIn}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold
                       transition-colors active:scale-95 min-h-touch"
            >
              Zoom In
            </button>
            <div className="h-8 w-px bg-white/30 mx-2"></div>
            <Stopwatch />
          </div>
        </div>
      </div>

      {/* PDF Document */}
      <div className="flex-1 overflow-auto p-6 pt-24">
        <div className="flex justify-center">
          {loading && <PDFLoadingState />}
          <Document
            file={fullPdfUrl}
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
