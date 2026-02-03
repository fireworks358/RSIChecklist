import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFViewer } from '../components/pdf/PDFViewer';
import { getGuidelineById } from '../data/guidelines';

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

  return (
    <div className="bg-nhs-grey" style={{ minHeight: 'var(--app-height, 100dvh)' }}>
      <div style={{ height: 'var(--app-height, 100dvh)' }}>
        <PDFViewer pdfPath={guideline.pdfPath} title={guideline.title} />
      </div>
    </div>
  );
};
