import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-xl
               transition-colors active:scale-95 min-h-touch flex items-center gap-2"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
};
