import React from 'react';

export const PDFLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-nhs-grey">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-nhs-blue/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-nhs-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-xl font-bold text-nhs-blue">Loading PDF...</p>
      </div>
    </div>
  );
};
