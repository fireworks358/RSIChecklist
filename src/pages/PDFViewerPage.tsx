import React, { lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuidelineById } from '../data/guidelines';

// Lazy so that pdfjs-dist (imported at PDFViewer's module scope) is only
// fetched and evaluated when a guideline is actually opened.
const PDFViewer = lazy(() =>
  import('../components/pdf/PDFViewer').then((m) => ({ default: m.PDFViewer }))
);

export const PDFViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const guideline = id ? getGuidelineById(id) : undefined;

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
