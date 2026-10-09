export type WeaknessCategory = 'VOICE' | 'FLUENCY' | 'LANGUAGE' | 'PRESENCE' | 'BODY';

export type WeaknessType =
  | 'RHYTHM'               // Velocidad / WPM fuera de rango
  | 'PAUSE_CONTROL'        // Ausencia o mala calidad de pausas tácticas
  | 'PITCH_VARIATION'      // Monotonía melódica
  | 'FILLER_OVERUSE'       // Uso excesivo de muletillas (eh, este, o sea)
  | 'ENERGY_STABILITY'     // Caída de energía al final de frases / soporte diafragmático
  | 'ARTICULATION_CLARITY' // Dicción o imprecisión en pronunciación
  | 'BREVITY_SYNTHESIS'    // Falta de síntesis / extensión excesiva
  | 'ASCENDING_INFLECTION';// Inflexión interrogativa en afirmaciones ("preguntas fantasma")

export type WeaknessAssessment = {
  type: WeaknessType;
  category: WeaknessCategory;
  label: string;
  description: string;
  severity: number;  // 0.0 (excelente/mínima) a 1.0 (crítica)
  confidence: number;// 0.0 a 1.0 según tamaño de muestra y estabilidad
};

export function evaluateWeaknesses(metrics: {
  wordsPerMinute: number;
  avgPauseDuration: number;
  pauseCount: number;
  fillerCount: number;
  pitchVariation: number;
  energyStability: number;
}): WeaknessAssessment[] {
  const assessments: WeaknessAssessment[] = [];

  // 1. RHYTHM (Velocidad de habla pura - desacoplada de pausas)
  if (metrics.wordsPerMinute > 165) {
    const severity = Math.min(1.0, (metrics.wordsPerMinute - 165) / 45);
    assessments.push({
      type: 'RHYTHM',
      category: 'VOICE',
      label: 'Velocidad Elevada de Habla',
      description: `Ritmo de ${Math.round(metrics.wordsPerMinute)} WPM. Acelerar en pasajes clave puede reducir la nitidez del mensaje.`,
      severity,
      confidence: 0.92,
    });
  } else if (metrics.wordsPerMinute < 105 && metrics.wordsPerMinute > 0) {
    const severity = Math.min(1.0, (105 - metrics.wordsPerMinute) / 35);
    assessments.push({
      type: 'RHYTHM',
      category: 'VOICE',
      label: 'Ritmo Excesivamente Pausado',
      description: `Ritmo de ${Math.round(metrics.wordsPerMinute)} WPM. Un ritmo bajo sin dinamismo puede comprometer el engagement.`,
      severity,
      confidence: 0.88,
    });
  }

  // 2. PAUSE_CONTROL (Evaluación directa e independiente del control del silencio)
  if (metrics.avgPauseDuration < 0.45 || metrics.pauseCount < 2) {
    let severity = 0.5;
    if (metrics.pauseCount === 0) {
      severity = 0.95;
    } else if (metrics.avgPauseDuration < 0.45) {
      severity = Math.min(1.0, (0.45 - metrics.avgPauseDuration) / 0.3);
    }

    assessments.push({
      type: 'PAUSE_CONTROL',
      category: 'VOICE',
      label: 'Escasez de Pausas Tácticas',
      description: 'Muestra con pausas muy breves o poco frecuentes. El silencio sopesado otorga peso a las palabras.',
      severity,
      confidence: 0.90,
    });
  }

  // 3. FILLER_OVERUSE (Fluidez y muletillas)
  if (metrics.fillerCount > 2) {
    const severity = Math.min(1.0, metrics.fillerCount / 7);
    assessments.push({
      type: 'FILLER_OVERUSE',
      category: 'FLUENCY',
      label: 'Frecuencia de Muletillas',
      description: `Se registraron ${metrics.fillerCount} muletillas ("eh", "este", "o sea") que interrumpen la continuidad.`,
      severity,
      confidence: 0.95,
    });
  }

  // 4. PITCH_VARIATION (Variación tonal / Monotonía)
  if (metrics.pitchVariation < 0.28) {
    const severity = Math.min(1.0, (0.28 - metrics.pitchVariation) / 0.22);
    assessments.push({
      type: 'PITCH_VARIATION',
      category: 'VOICE',
      label: 'Rango de Variación Tonal Reducido',
      description: 'El espectro de frecuencia muestra poca modulación, lo que puede percibirse como tono plano.',
      severity: Math.max(0.35, severity),
      confidence: 0.85,
    });
  }

  // 5. ENERGY_STABILITY (Soporte físico y energía)
  if (metrics.energyStability < 0.65) {
    const severity = Math.min(1.0, (0.65 - metrics.energyStability) / 0.4);
    assessments.push({
      type: 'ENERGY_STABILITY',
      category: 'PRESENCE',
      label: 'Oscilación en la Estabilidad del Flujo de Aire',
      description: 'Se observan fluctuaciones de amplitud en la emisión, especialmente hacia los cierres.',
      severity,
      confidence: 0.82,
    });
  }

  // Ordenar debilidades por severidad descendente
  return assessments.sort((a, b) => b.severity - a.severity);
}
