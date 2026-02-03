import React from 'react';

interface RotateButtonProps {
  isRotated: boolean;
  onToggle: () => void;
}

export const RotateButton: React.FC<RotateButtonProps> = ({ isRotated, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-nhs-blue text-white
                 rounded-full shadow-2xl hover:bg-nhs-blue/90 active:scale-95
                 transition-transform duration-150 flex items-center justify-center
                 focus:outline-none focus:ring-4 focus:ring-nhs-blue/50"
      aria-label={isRotated ? 'Reset to portrait view' : 'Rotate to landscape view'}
      title={isRotated ? 'Reset to portrait' : 'Rotate to landscape'}
    >
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m0 0a8.001 8.001 0 0115.356 2M4.582 9H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  );
};
