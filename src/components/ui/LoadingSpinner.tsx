import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-nhs-grey">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-8 border-nhs-blue/20 rounded-full"></div>
          <div className="absolute inset-0 border-8 border-nhs-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-2xl font-bold text-nhs-blue">Loading...</p>
      </div>
    </div>
  );
};
