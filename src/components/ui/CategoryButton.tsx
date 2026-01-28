import React from 'react';
import type { Guideline } from '../../data/types';

interface CategoryButtonProps {
  guideline: Guideline;
  onClick: (guideline: Guideline) => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({ guideline, onClick }) => {
  return (
    <button
      onClick={() => onClick(guideline)}
      className="nhs-button-secondary w-full h-touch-xl flex flex-col items-center justify-center gap-2 group"
    >
      <span className="text-touch-2xl font-black text-nhs-blue group-active:scale-95 transition-transform">
        {guideline.title}
      </span>
      {guideline.description && (
        <span className="text-lg text-nhs-dark-grey">
          {guideline.description}
        </span>
      )}
    </button>
  );
};
