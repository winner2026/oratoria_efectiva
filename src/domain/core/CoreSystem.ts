
export type CoreLayer = 'RITMO' | 'EJECUCION' | 'INTEGRACION';

export interface CoreMetric {
  id: string;
  sourceExerciseId: string;
  layer: CoreLayer;
  metricType: 'WPM' | 'ACCURACY' | 'STABILITY' | 'FLOW' | 'CLARITY';
  value: number;     // Normalized 0-100 or raw value depending on context, we should stick to raw and normalize in service
  rawUnit: string;   // 'wpm', 'percent', 'seconds', 'points'
  timestamp: number;
}

export interface CoreProfile {
  lastScan: number;
  layers: {
    [key in CoreLayer]: {
      score: number; // 0-100
      status: 'CRITICAL' | 'STABLE' | 'OPTIMAL';
      metrics: CoreMetric[];
    }
  };
  diagnostics: string[]; // "Brecha de autoridad en Ritmo", etc.
}
