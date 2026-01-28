import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BackButton } from './BackButton';
import { Stopwatch } from '../ui/Stopwatch';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-nhs-blue text-white shadow-lg z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-xl
                     transition-colors active:scale-95 min-h-touch flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
        </div>

        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-black">Emergency Airway Portal</h1>
          <Stopwatch />
        </div>
      </div>
    </nav>
  );
};
