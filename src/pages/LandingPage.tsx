import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePDFPreloader } from '../hooks/usePDFPreloader';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadingProgress, isComplete } = usePDFPreloader();
  const isOnline = useOfflineStatus();

  return (
    <div className="min-h-screen bg-nhs-grey flex flex-col">
      {/* Header */}
      <header className="bg-nhs-blue text-white py-8 px-6 shadow-lg">
        <h1 className="text-5xl font-black text-center">Emergency Airway Portal</h1>
        <p className="text-2xl text-center mt-4">Clinical Guidelines</p>

        {/* Offline Status Banner */}
        {!isOnline && (
          <div className="mt-4 bg-nhs-warm-yellow text-nhs-black px-6 py-3 rounded-lg text-center font-bold text-xl">
            ⚠️ Offline Mode - Using cached content
          </div>
        )}

        {/* PDF Caching Progress */}
        {!isComplete && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">Caching PDFs for offline use...</span>
              <span className="text-lg font-bold">{Math.round(loadingProgress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-nhs-warm-yellow h-full transition-all duration-300 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cache Complete Indicator */}
        {isComplete && isOnline && (
          <div className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg text-center font-bold text-xl">
            ✓ All PDFs cached - Ready for offline use
          </div>
        )}
      </header>

      {/* Main Content - Split Screen */}
      <main className="flex-1 flex items-stretch p-6 gap-6">
        {/* Adult Guidelines Section */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => navigate('/category/adult')}
            className="w-full h-full min-h-[600px] bg-nhs-blue text-white rounded-2xl
                     hover:bg-nhs-blue/90 active:bg-nhs-blue/80 active:scale-[0.98]
                     transition-all duration-150 shadow-2xl
                     flex flex-col items-center justify-center gap-6"
          >
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-6xl font-black uppercase tracking-wide">
              Adult<br />Guidelines
            </span>
          </button>
        </div>

        {/* Paediatric Guidelines Section */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => navigate('/category/paediatric')}
            className="w-full h-full min-h-[600px] bg-nhs-blue text-white rounded-2xl
                     hover:bg-nhs-blue/90 active:bg-nhs-blue/80 active:scale-[0.98]
                     transition-all duration-150 shadow-2xl
                     flex flex-col items-center justify-center gap-6"
          >
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className="text-6xl font-black uppercase tracking-wide">
              Paediatric<br />Guidelines
            </span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 px-6 text-center border-t-4 border-nhs-blue">
        <p className="text-lg text-nhs-dark-grey">
          © {new Date().getFullYear()} T Simons - All rights reserved. v0.1 alpha
        </p>
      </footer>
    </div>
  );
};
