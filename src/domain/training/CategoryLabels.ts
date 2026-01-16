export const CATEGORY_LABELS: Record<string, string> = {
  'ALL': 'Todo',
  'BREATHING': 'Aire',
  'ARTICULATION': 'Hablar Claro',
  'INTONATION': 'Tono',
  'MINDSET': 'Calma',
  'IMPROVISATION': 'Pensar Rápido',
  'PROJECTION': 'Volumen',
  'RELAXATION': 'Relajación',
  'VOCABULARY': 'Palabras'
};

export const getCategoryLabel = (cat: string) => CATEGORY_LABELS[cat] || cat;
