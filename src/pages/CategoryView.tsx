import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGuidelinesByCategory } from '../data/guidelines';
import { CategoryButton } from '../components/ui/CategoryButton';
import type { Guideline, CategoryType } from '../data/types';

export const CategoryView: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: CategoryType }>();

  if (!category || (category !== 'adult' && category !== 'paediatric')) {
    navigate('/');
    return null;
  }

  const guidelines = getGuidelinesByCategory(category);
  const title = category === 'adult' ? 'Adult Guidelines' : 'Paediatric Guidelines';

  const handleGuidelineClick = (guideline: Guideline) => {
    navigate(`/pdf/${guideline.id}`);
  };

  // Group guidelines by subcategory
  const sortedGuidelines = guidelines.sort((a, b) => a.order - b.order);
  const guidelinesWithoutSubcategory = sortedGuidelines.filter(g => !g.subcategory);
  const guidelinesBySubcategory = sortedGuidelines.reduce((acc, guideline) => {
    if (guideline.subcategory) {
      if (!acc[guideline.subcategory]) {
        acc[guideline.subcategory] = [];
      }
      acc[guideline.subcategory].push(guideline);
    }
    return acc;
  }, {} as Record<string, Guideline[]>);

  return (
    <div className="min-h-screen bg-nhs-grey pt-32 pb-12">
      <div className="container mx-auto px-6">
        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-nhs-blue mb-4">{title}</h1>
          <p className="text-2xl text-nhs-dark-grey">
            Select a guideline to view
          </p>
        </div>

        {/* Guidelines without subcategory */}
        {guidelinesWithoutSubcategory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {guidelinesWithoutSubcategory.map((guideline) => (
              <CategoryButton
                key={guideline.id}
                guideline={guideline}
                onClick={handleGuidelineClick}
              />
            ))}
          </div>
        )}

        {/* Subcategorized Guidelines */}
        {Object.entries(guidelinesBySubcategory).map(([subcategory, subcategoryGuidelines]) => (
          <div key={subcategory} className="mb-12">
            <h2 className="text-4xl font-black text-nhs-blue mb-6">{subcategory}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subcategoryGuidelines.map((guideline) => (
                <CategoryButton
                  key={guideline.id}
                  guideline={guideline}
                  onClick={handleGuidelineClick}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {guidelines.length === 0 && (
          <div className="text-center py-20">
            <p className="text-3xl font-bold text-nhs-mid-grey">
              No guidelines available in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
