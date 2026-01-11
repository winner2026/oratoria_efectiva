export const CATEGORY_LABELS: Record<string, string> = {
  'ALL': 'Arsenal Completo',
  'BREATHING': 'Soporte de Aire',
  'ARTICULATION': 'Dicción Ejecutiva',
  'INTONATION': 'Rango de Dominancia',
  'MINDSET': 'Control de Estrés',
  'IMPROVISATION': 'Agilidad Mental',
  'PROJECTION': 'Proyección de Poder',
  'RELAXATION': 'Calibración Rápida',
  'VOCABULARY': 'Léxico de Mando'
};

export const getCategoryLabel = (cat: string) => CATEGORY_LABELS[cat] || cat;
