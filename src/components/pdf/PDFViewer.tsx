import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// The legacy build ships ES5 + a classic (non-module) worker, which is what
// lets this single viewer run on iOS 11-14 iPads as well as modern browsers.
// pdfjs-dist is pinned to 2.x for that reason — later majors drop old Safari.
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { PDFLoadingState } from './PDFLoadingState';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';
import { Stopwatch } from '../ui/Stopwatch';

pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.min.js`;

interface PDFViewerProps {
  pdfPath: string;
  title: string;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
// Old iPads refuse to paint canvases past roughly this edge length.
const MAX_CANVAS_DIM = 4096;

const clampScale = (s: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfPath }) => {
  const navigate = useNavigate();
  // Construct full URL with base path for GitHub Pages compatibility
  const fullPdfUrl = `${import.meta.env.BASE_URL}${pdfPath.replace(/^\//, '')}`;

  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [isSideBySide, setIsSideBySide] = useState<boolean>(false);
  const isOnline = useOfflineStatus();

  const containerRef = useRef<HTMLDivElement>(null);
  const pagesWrapRef = useRef<HTMLDivElement>(null);
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const renderTasksRef = useRef<RenderTask[]>([]);
  // Unscaled (scale=1) size of page 1, used for fit-to-width calculations.
  const baseSizeRef = useRef<{ width: number; height: number } | null>(null);
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  const fitScale = useCallback((sideBySide: boolean): number => {
    const container = containerRef.current;
    const base = baseSizeRef.current;
    if (!container || !base) return 1;
    const padding = 48; // p-6 either side
    const gap = sideBySide ? 16 : 0;
    const available = container.clientWidth - padding - gap;
    const pages = sideBySide ? 2 : 1;
    return clampScale(available / (base.width * pages));
  }, []);

  // Load the document
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPdf(null);
    setPageNumber(1);

    const task = pdfjsLib.getDocument(fullPdfUrl);
    task.promise
      .then(async (doc) => {
        if (cancelled) return;
        const page1 = await doc.getPage(1);
        if (cancelled) return;
        const vp = page1.getViewport({ scale: 1 });
        baseSizeRef.current = { width: vp.width, height: vp.height };
        setNumPages(doc.numPages);
        setScale(fitScale(false));
        setPdf(doc);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.error('Error loading PDF:', err);
        if (!navigator.onLine) {
          setError('Cannot load PDF in offline mode. This PDF has not been cached yet. Please connect to the internet to download it for the first time.');
        } else {
          setError('Failed to load PDF. The file may be corrupted or the connection is unstable. Please try again.');
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
      task.promise.then((doc) => doc.destroy()).catch(() => {});
    };
  }, [fullPdfUrl, fitScale]);

  // Render the visible page(s) to canvas
  useEffect(() => {
    if (!pdf) return;
    let cancelled = false;

    renderTasksRef.current.forEach((t) => t.cancel());
    renderTasksRef.current = [];

    const renderPage = async (num: number, canvas: HTMLCanvasElement | null) => {
      if (!canvas || num < 1 || num > pdf.numPages) return;
      const page = await pdf.getPage(num);
      if (cancelled) return;

      const base = page.getViewport({ scale: 1 });
      // Render at device resolution for sharpness, capped to what old-iOS
      // canvas memory limits allow; CSS size stays at the logical scale.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let renderScale = scale * dpr;
      const largestSide = Math.max(base.width, base.height);
      if (largestSide * renderScale > MAX_CANVAS_DIM) {
        renderScale = MAX_CANVAS_DIM / largestSide;
      }
      const viewport = page.getViewport({ scale: renderScale });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(base.width * scale)}px`;
      canvas.style.height = `${Math.floor(base.height * scale)}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const task = page.render({ canvasContext: ctx, viewport });
      renderTasksRef.current.push(task);
      // Cancellation surfaces as a rejected promise; nothing to do about it.
      await task.promise.catch(() => {});
    };

    renderPage(pageNumber, canvas1Ref.current);
    if (isSideBySide) {
      renderPage(pageNumber + 1, canvas2Ref.current);
    }

    return () => {
      cancelled = true;
    };
  }, [pdf, pageNumber, scale, isSideBySide]);

  // Pinch-to-zoom. Native touch listeners (not React's) because they must be
  // non-passive: preventDefault() on two-finger gestures is the only way to
  // stop iOS < 13 (no touch-action support) from zooming the whole page —
  // chrome included. During the gesture the rendered canvas is scaled with a
  // CSS transform (instant, no re-render); the real re-render at the final
  // scale happens once, on release.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startDist = 0;
    let startScale = 1;
    let pendingScale: number | null = null;

    const touchDistance = (touches: TouchList): number => {
      const dx = touches[1].clientX - touches[0].clientX;
      const dy = touches[1].clientY - touches[0].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      startDist = touchDistance(e.touches);
      startScale = scaleRef.current;
      const wrap = pagesWrapRef.current;
      if (wrap) {
        const rect = wrap.getBoundingClientRect();
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        wrap.style.transformOrigin = `${midX - rect.left}px ${midY - rect.top}px`;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || startDist === 0) return;
      e.preventDefault();
      const next = clampScale(startScale * (touchDistance(e.touches) / startDist));
      pendingScale = next;
      const wrap = pagesWrapRef.current;
      if (wrap) wrap.style.transform = `scale(${next / startScale})`;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (startDist === 0 || e.touches.length >= 2) return;
      startDist = 0;
      const wrap = pagesWrapRef.current;
      if (wrap) {
        wrap.style.transform = '';
        wrap.style.transformOrigin = '';
      }
      if (pendingScale !== null) {
        setScale(pendingScale);
        pendingScale = null;
      }
    };

    // iOS-only gesture events; preventing them suppresses native page zoom
    // for pinches that start anywhere in the viewer (toolbar included).
    const onGesture = (e: Event) => e.preventDefault();

    const root = container.closest('[data-pdf-viewer]') ?? container;
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);
    root.addEventListener('gesturestart', onGesture);
    root.addEventListener('gesturechange', onGesture);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
      root.removeEventListener('gesturestart', onGesture);
      root.removeEventListener('gesturechange', onGesture);
    };
  }, []);

  const goToPrevPage = () => {
    const step = isSideBySide ? 2 : 1;
    setPageNumber(prev => Math.max(prev - step, 1));
  };

  const goToNextPage = () => {
    const step = isSideBySide ? 2 : 1;
    setPageNumber(prev => Math.min(prev + step, numPages));
  };

  const skipOnePage = (direction: 'forward' | 'back') => {
    if (direction === 'forward') {
      setPageNumber(prev => Math.min(prev + 1, numPages));
    } else {
      setPageNumber(prev => Math.max(prev - 1, 1));
    }
  };

  const toggleSideBySide = () => {
    setIsSideBySide(prev => {
      const next = !prev;
      setScale(fitScale(next));
      return next;
    });
    // Adjust page number to odd page when switching to side-by-side
    if (!isSideBySide && pageNumber % 2 === 0) {
      setPageNumber(prev => Math.max(prev - 1, 1));
    }
  };

  const zoomIn = () => setScale(prev => clampScale(prev + 0.25));
  const zoomOut = () => setScale(prev => clampScale(prev - 0.25));

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
    <div className="flex flex-col h-full bg-nhs-grey relative" data-pdf-viewer>
      {/* Floating Offline Status Badge */}
      {!isOnline && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-nhs-warm-yellow text-nhs-black
                       px-4 py-2 rounded-full shadow-lg font-bold text-sm animate-pulse">
          ⚠️ Offline Mode
        </div>
      )}

      {/* PDF Controls */}
      <div className="bg-nhs-blue/95 backdrop-blur-sm text-white shadow-lg z-40 shrink-0">
        <div className="flex items-center flex-wrap gap-2 px-4 py-3">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold
                       transition-colors active:scale-95 min-h-touch"
            >
              ← Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold
                       transition-colors active:scale-95 min-h-touch flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
          </div>
          <div className="h-8 w-px bg-white/30"></div>
          {/* Page controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold disabled:opacity-30
                       disabled:cursor-not-allowed transition-colors active:scale-95 min-h-touch"
            >
              Previous
            </button>
            {isSideBySide && (
              <>
                <button
                  onClick={() => skipOnePage('back')}
                  disabled={pageNumber <= 1}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold disabled:opacity-30
                           disabled:cursor-not-allowed transition-colors active:scale-95 min-h-touch"
                  title="Skip back one page"
                >
                  ◄
                </button>
                <button
                  onClick={() => skipOnePage('forward')}
                  disabled={pageNumber >= numPages}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold disabled:opacity-30
                           disabled:cursor-not-allowed transition-colors active:scale-95 min-h-touch"
                  title="Skip forward one page"
                >
                  ►
                </button>
              </>
            )}
            <span className="text-lg font-bold text-white whitespace-nowrap">
              {isSideBySide && pageNumber < numPages
                ? `Pages ${pageNumber}-${Math.min(pageNumber + 1, numPages)} of ${numPages}`
                : `Page ${pageNumber} of ${numPages}`
              }
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold disabled:opacity-30
                       disabled:cursor-not-allowed transition-colors active:scale-95 min-h-touch"
            >
              Next
            </button>
          </div>
          <div className="h-8 w-px bg-white/30"></div>
          {/* View and zoom controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSideBySide}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold
                       transition-colors active:scale-95 min-h-touch"
              title={isSideBySide ? "Switch to single page" : "Switch to side-by-side"}
            >
              {isSideBySide ? "Single" : "Side-by-Side"}
            </button>
            <div className="h-8 w-px bg-white/30"></div>
            <button
              onClick={zoomOut}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold
                       transition-colors active:scale-95 min-h-touch"
            >
              −
            </button>
            <span className="text-lg font-bold text-white">{Math.round(scale * 100)}%</span>
            <button
              onClick={zoomIn}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold
                       transition-colors active:scale-95 min-h-touch"
            >
              +
            </button>
            <a
              href={fullPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold
                       transition-colors active:scale-95 min-h-touch"
              title="Open original PDF"
            >
              PDF
            </a>
          </div>
          <div className="h-8 w-px bg-white/30"></div>
          <Stopwatch />
        </div>
      </div>

      {/* PDF Document */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-6"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {loading && <PDFLoadingState />}
        <div
          ref={pagesWrapRef}
          className="flex flex-row flex-nowrap justify-center items-start gap-4 min-w-full"
        >
          <canvas ref={canvas1Ref} className="bg-white shadow-2xl" />
          {isSideBySide && pageNumber < numPages && (
            <canvas ref={canvas2Ref} className="bg-white shadow-2xl" />
          )}
        </div>
      </div>
    </div>
  );
};
