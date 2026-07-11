import React, { lazy, Suspense, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuidelineById } from '../data/guidelines';
import { supportsModuleWorkers } from '../utils/browserSupport';

// Lazy so that react-pdf/pdfjs-dist (imported at PDFViewer's module scope)
// is only fetched and evaluated when we actually render it below — the
// unsupported-browser branch returns before that ever happens.
const PDFViewer = lazy(() =>
  import('../components/pdf/PDFViewer').then((m) => ({ default: m.PDFViewer }))
);

export const PDFViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const guideline = id ? getGuidelineById(id) : undefined;

  // The in-app PDF viewer (react-pdf/pdfjs-dist) needs module Web Workers,
  // which don't exist on older iPads (e.g. iOS 11-14 Safari). Those devices
  // get Safari's native PDF renderer instead, via an iframe rather than a
  // full-page navigation — as an installed home-screen app there's no
  // Safari chrome (no back button, no address bar) to return with, so
  // navigating away would strand the user on the raw PDF with no way back.
  const canUsePdfViewer = supportsModuleWorkers();
  const fullPdfUrl = guideline
    ? `${import.meta.env.BASE_URL}${guideline.pdfPath.replace(/^\//, '')}`
    : null;

  // Pinch-zoom is a single viewport-wide transform, so a gesture that starts
  // over the PDF would otherwise scale the header/back-button chrome too.
  // Locking the page's own scale here stops that. In the native-iframe
  // fallback, Safari's built-in PDF renderer still handles pinch-zoom of the
  // PDF content itself internally, unaffected by this meta tag. In the
  // in-app viewer, pinch-zoom is instead handled entirely by the component's
  // own touch handlers adjusting render scale, so native page zoom is never
  // needed there either.
  useEffect(() => {
    if (!guideline) return;
    const viewport = document.querySelector('meta[name="viewport"]');
    const previousContent = viewport?.getAttribute('content') ?? null;
    viewport?.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1, user-scalable=no'
    );
    return () => {
      if (previousContent !== null) viewport?.setAttribute('content', previousContent);
    };
  }, [guideline]);

  if (!id) {
    navigate('/');
    return null;
  }

  if (!guideline) {
    return (
      <div className="min-h-screen bg-nhs-grey flex items-center justify-center pt-32">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-nhs-blue mb-6">Guideline not found</h2>
          <button
            onClick={() => navigate('/')}
            className="nhs-button-primary"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!canUsePdfViewer) {
    return (
      <div className="flex flex-col bg-nhs-grey" style={{ height: 'var(--app-height, 100dvh)' }}>
        <div className="bg-nhs-blue text-white shadow-lg z-40 shrink-0 flex items-center gap-2 px-4 py-3 touch-none">
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
                     transition-colors active:scale-95 min-h-touch"
          >
            Home
          </button>
        </div>
        <iframe src={fullPdfUrl ?? undefined} title={guideline.title} className="flex-1 w-full border-0 touch-auto" />
      </div>
    );
  }

  return (
    <div className="bg-nhs-grey" style={{ minHeight: 'var(--app-height, 100dvh)' }}>
      <div style={{ height: 'var(--app-height, 100dvh)' }}>
        <Suspense fallback={null}>
          <PDFViewer pdfPath={guideline.pdfPath} title={guideline.title} />
        </Suspense>
      </div>
    </div>
  );
};
