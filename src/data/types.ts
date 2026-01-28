export interface Guideline {
  id: string;
  title: string;
  category: 'adult' | 'paediatric';
  pdfPath: string;
  description?: string;
  order: number;
}

export interface GuidelineCategory {
  id: 'adult' | 'paediatric';
  title: string;
  guidelines: Guideline[];
}

export type CategoryType = 'adult' | 'paediatric';
