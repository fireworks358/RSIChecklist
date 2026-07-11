import React, { lazy, Suspense } from 'react';
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

  if (!id) {
    navigate('/');
    return null;
  }

  const guideline = getGuidelineById(id);

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

  // The in-app PDF viewer (react-pdf/pdfjs-dist) needs module Web Workers,
  // which don't exist on older iPads (e.g. iOS 11-14 Safari). Those devices
  // fall back to opening the PDF directly, which Safari renders natively.
  if (!supportsModuleWorkers()) {
    const fullPdfUrl = `${import.meta.env.BASE_URL}${guideline.pdfPath.replace(/^\//, '')}`;
    return (
      <div
        className="bg-nhs-grey flex items-center justify-center pt-32 px-6"
        style={{ minHeight: 'var(--app-height, 100dvh)' }}
      >
        <div className="text-center max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-nhs-blue mb-4">{guideline.title}</h2>
          <p className="text-lg text-nhs-black mb-6">
            Your device's browser is too old for the in-app PDF viewer, so this guideline
            will open in Safari's own PDF viewer instead.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-nhs-grey text-nhs-black rounded-lg font-bold hover:bg-nhs-grey/80 active:scale-95 min-h-touch"
            >
              Go Back
            </button>
            <a
              href={fullPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nhs-button-primary"
            >
              Open PDF
            </a>
          </div>
        </div>
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
