import { VoiceMetrics } from "../voice/VoiceMetrics";

export type AuthorityLevel = "LOW" | "MEDIUM" | "HIGH";
export type PriorityAdjustment =
  | "SLOW_DOWN"
  | "PAUSE_MORE"
  | "INCREASE_ENERGY"
  | "STABILIZE_PITCH"
  | "REDUCE_REPETITIONS"
  | "SIMPLIFY_SENTENCES"
  | "VARY_PACE";

export interface AuthorityScore {
  level: AuthorityLevel;
  strengths: string[];
  weaknesses: string[];
  priorityAdjustment: PriorityAdjustment;
  score: number;
  // 🆕 Mejoras contextuales
  confidence: number; // 0-1, confianza del score según duración
  detailedInsights: string[]; // insights específicos basados en nuevas métricas
}

const MAX_AUTHORITY_POINTS = 12; // 🔥 Aumentado para incluir nuevas métricas

// 🆕 Calcular confianza del score según duración
function calculateConfidence(durationSeconds: number, metrics: VoiceMetrics): number {
  // Menos de 10 segundos = baja confianza
  if (durationSeconds < 10) return 0.3;
  // 10-20 segundos = confianza media
  if (durationSeconds < 20) return 0.6;
  // 20-40 segundos = buena confianza
  if (durationSeconds < 40) return 0.85;
  // 40+ segundos = alta confianza
  return 1.0;
}

// 🆕 Generar insights detallados basados en nuevas métricas
function generateDetailedInsights(metrics: VoiceMetrics): string[] {
  const insights: string[] = [];

  // Análisis de repeticiones
  if (metrics.repetitionCount > 3) {
    insights.push(`Detectadas ${metrics.repetitionCount} repeticiones innecesarias. Evita repetir las mismas palabras.`);
  } else if (metrics.repetitionCount === 0) {
    insights.push("Excelente variedad de vocabulario sin repeticiones.");
  }

  // Análisis de pausas estratégicas
  if (metrics.strategicPauses >= 3) {
    insights.push(`${metrics.strategicPauses} pausas estratégicas bien ubicadas. Esto genera autoridad.`);
  }
  if (metrics.awkwardSilences > 0) {
    insights.push(`${metrics.awkwardSilences} silencio(s) incómodo(s) detectado(s). Mantén pausas entre 0.5-1.5s.`);
  }

  // Análisis de consistencia del ritmo
  if (metrics.rhythmConsistency >= 0.8) {
    insights.push("Ritmo muy consistente. Mantienes un buen control del tempo.");
  } else if (metrics.rhythmConsistency < 0.5) {
    insights.push("Tu ritmo varía mucho. Intenta mantener velocidad más constante.");
  }

  // Análisis de longitud de frases
  if (metrics.longSentences > 2) {
    insights.push(`${metrics.longSentences} frases demasiado largas (>25 palabras). Simplifícalas para mayor claridad.`);
  } else if (metrics.avgSentenceLength >= 10 && metrics.avgSentenceLength <= 20) {
    insights.push("Longitud de frases ideal. Facilita la comprensión.");
  }

  // Análisis de variabilidad del ritmo
  if (metrics.paceVariability >= 0.2 && metrics.paceVariability <= 0.4) {
    insights.push("Buena variación de ritmo. Mantiene el interés de la audiencia.");
  } else if (metrics.paceVariability > 0.5) {
    insights.push("Tu ritmo cambia demasiado abruptamente. Busca transiciones más suaves.");
  }

  return insights;
}

// Calcula nivel y puntos de autoridad (MEJORADO)
export function calculateAuthorityLevel(metrics: VoiceMetrics): {
  level: AuthorityLevel;
  points: number;
} {
  let score = 0;

  // Ritmo (base)
  if (metrics.wordsPerMinute >= 110 && metrics.wordsPerMinute <= 150) {
    score += 2;
  } else if (metrics.wordsPerMinute >= 90 && metrics.wordsPerMinute <= 170) {
    score += 1;
  }

  // 🔥 BONUS: Consistencia del ritmo
  if (metrics.rhythmConsistency >= 0.75) {
    score += 1;
  }

  // Pausas (base)
  if (metrics.avgPauseDuration >= 0.4 && metrics.avgPauseDuration <= 0.8) {
    score += 2;
  } else if (metrics.avgPauseDuration >= 0.2) {
    score += 1;
  }

  // 🔥 BONUS: Pausas estratégicas
  if (metrics.strategicPauses >= 3) {
    score += 1;
  }
  // 🔥 PENALIZACIÓN: Silencios incómodos
  if (metrics.awkwardSilences > 0) {
    score -= 1;
  }

  // Variación de tono
  if (metrics.pitchVariation !== null) {
    if (metrics.pitchVariation >= 30 && metrics.pitchVariation <= 120) {
      score += 2;
    } else if (metrics.pitchVariation >= 15) {
      score += 1;
    }
  }

  // Estabilidad de energía
  if (metrics.energyStability !== null) {
    if (metrics.energyStability >= 0.7) {
      score += 2;
    } else if (metrics.energyStability >= 0.5) {
      score += 1;
    }
  }

  // 🔥 NUEVAS MÉTRICAS
  // Penalización por repeticiones excesivas
  if (metrics.repetitionCount > 5) {
    score -= 2;
  } else if (metrics.repetitionCount > 2) {
    score -= 1;
  }

  // Penalización por frases muy largas
  if (metrics.longSentences > 2) {
    score -= 1;
  }

  // Bonus por estructura de frases ideal
  if (metrics.avgSentenceLength >= 10 && metrics.avgSentenceLength <= 20) {
    score += 1;
  }

  // Asegurar que el score no sea negativo
  score = Math.max(0, score);

  const level: AuthorityLevel =
    score >= 9 ? "HIGH" : score >= 5 ? "MEDIUM" : "LOW";

  return { level, points: score };
}

// Calcula detalles de fortalezas, debilidades y prioridad (MEJORADO)
export function calculateAuthorityDetails(metrics: VoiceMetrics): {
  strengths: string[];
  weaknesses: string[];
  priorityAdjustment: PriorityAdjustment;
} {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Claridad por ritmo
  if (metrics.wordsPerMinute >= 110 && metrics.wordsPerMinute <= 150) {
    strengths.push("claridad");
  } else {
    weaknesses.push("ritmo");
  }

  // 🔥 NUEVO: Consistencia del ritmo
  if (metrics.rhythmConsistency >= 0.75) {
    strengths.push("consistencia");
  } else if (metrics.rhythmConsistency < 0.5) {
    weaknesses.push("variabilidad del ritmo");
  }

  // Uso de pausas
  if (metrics.avgPauseDuration >= 0.4) {
    strengths.push("uso de pausas");
  } else {
    weaknesses.push("pausas");
  }

  // 🔥 NUEVO: Pausas estratégicas
  if (metrics.strategicPauses >= 3) {
    strengths.push("pausas estratégicas");
  }
  if (metrics.awkwardSilences > 0) {
    weaknesses.push("silencios incómodos");
  }

  // Energía
  if (metrics.energyStability !== null) {
    if (metrics.energyStability >= 0.7) {
      strengths.push("energía estable");
    } else {
      weaknesses.push("energía");
    }
  }

  // 🔥 NUEVO: Estructura de frases
  if (metrics.avgSentenceLength >= 10 && metrics.avgSentenceLength <= 20) {
    strengths.push("estructura clara");
  } else if (metrics.longSentences > 2) {
    weaknesses.push("frases muy largas");
  }

  // 🔥 NUEVO: Repeticiones
  if (metrics.repetitionCount > 3) {
    weaknesses.push("repeticiones");
  } else if (metrics.repetitionCount === 0) {
    strengths.push("vocabulario variado");
  }

  // 🔥 PRIORIDAD MEJORADA (detecta el problema más urgente)
  let priorityAdjustment: PriorityAdjustment = "SLOW_DOWN";

  // Sistema de prioridad por severidad
  if (metrics.repetitionCount > 5) {
    priorityAdjustment = "REDUCE_REPETITIONS";
  } else if (metrics.longSentences > 2) {
    priorityAdjustment = "SIMPLIFY_SENTENCES";
  } else if (metrics.wordsPerMinute > 160) {
    priorityAdjustment = "SLOW_DOWN";
  } else if (metrics.awkwardSilences > 1) {
    priorityAdjustment = "PAUSE_MORE";
  } else if (metrics.avgPauseDuration < 0.3) {
    priorityAdjustment = "PAUSE_MORE";
  } else if (metrics.rhythmConsistency < 0.4) {
    priorityAdjustment = "VARY_PACE";
  } else if (metrics.energyStability !== null && metrics.energyStability < 0.5) {
    priorityAdjustment = "INCREASE_ENERGY";
  } else if (metrics.pitchVariation !== null && metrics.pitchVariation < 30) {
    priorityAdjustment = "STABILIZE_PITCH";
  }

  return {
    strengths,
    weaknesses,
    priorityAdjustment,
  };
}

// Construye el score completo (MEJORADO con contexto)
export function buildAuthorityScore(
  metrics: VoiceMetrics,
  durationSeconds?: number
): AuthorityScore {
  const { level, points } = calculateAuthorityLevel(metrics);
  const score = Math.min(100, Math.round((points / MAX_AUTHORITY_POINTS) * 100));
  const { strengths, weaknesses, priorityAdjustment } =
    calculateAuthorityDetails(metrics);

  // 🔥 MEJORA #5: Calcular confianza contextual
  const confidence = durationSeconds
    ? calculateConfidence(durationSeconds, metrics)
    : 1.0;

  // 🔥 MEJORA #5: Generar insights detallados
  const detailedInsights = generateDetailedInsights(metrics);

  return {
    level,
    strengths,
    weaknesses,
    priorityAdjustment,
    score,
    confidence,
    detailedInsights,
  };
}
