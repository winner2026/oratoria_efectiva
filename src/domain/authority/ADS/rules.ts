import { ADSInput, ADSOutput, ADSInputMetrics } from './types';

// 7️⃣ Umbrales de Autoridad (Defined in Domain)
export const AUTHORITY_THRESHOLDS = {
  wpm: { optimal: [110, 150] as [number, number] },
  pause_ratio: { optimal: [0.15, 0.30] as [number, number] },
  filler_rate: { max: 0.05 },
  pitch_variance: { min: 20 }, // Assuming Hertz or relative unit from VoiceMetrics
  energy_stability: { min: 0.7 }
};

export const DETERMINISTIC_RULES = {
  min_transcript_words: 20,
  min_audio_duration: 8,
};

/**
 * 5️⃣ Reglas deterministas (NO NEGOCIABLE)
 * Returns { allowed: true } or { allowed: false, reason: "..." }
 */
export function checkDecisionAllowed(input: ADSInput): { allowed: boolean; reason?: string } {
  // Check strict input existence
  if (input.metrics.wpm == null) return { allowed: false, reason: 'MISSING_METRIC_WPM' };
  if (input.metrics.pitch_variance == null) return { allowed: false, reason: 'MISSING_METRIC_PITCH' };
  
  // Check thresholds
  const wordCount = input.transcript.trim().split(/\s+/).length;
  if (wordCount < DETERMINISTIC_RULES.min_transcript_words) {
    return { allowed: false, reason: 'INSUFFICIENT_DATA_TRANSCRIPT_TOO_SHORT' };
  }
  
  if (input.duration_seconds < DETERMINISTIC_RULES.min_audio_duration) {
    return { allowed: false, reason: 'INSUFFICIENT_DATA_AUDIO_TOO_SHORT' };
  }

  return { allowed: true };
}

/**
 * Helper to normalize metrics against thresholds for the LLM context
 */
export function normalizeMetricsForAnalyst(metrics: ADSInputMetrics): Record<string, string> {
  const status: Record<string, string> = {};

  // WPM
  if (metrics.wpm < AUTHORITY_THRESHOLDS.wpm.optimal[0]) status.wpm = 'SLOW';
  else if (metrics.wpm > AUTHORITY_THRESHOLDS.wpm.optimal[1]) status.wpm = 'FAST';
  else status.wpm = 'OPTIMAL';

  // Pause Ratio
  if (metrics.pause_ratio < AUTHORITY_THRESHOLDS.pause_ratio.optimal[0]) status.pause_ratio = 'LOW_PAUSING (Rushed)';
  else if (metrics.pause_ratio > AUTHORITY_THRESHOLDS.pause_ratio.optimal[1]) status.pause_ratio = 'HIGH_PAUSING (Hesitant)';
  else status.pause_ratio = 'OPTIMAL';

  // Filler Rate
  if (metrics.filler_rate > AUTHORITY_THRESHOLDS.filler_rate.max) status.filler_rate = 'HIGH (Low Authority)';
  else status.filler_rate = 'OPTIMAL';

  // Pitch Variance
  if (metrics.pitch_variance < AUTHORITY_THRESHOLDS.pitch_variance.min) status.pitch_variance = 'MONOTONE (Low Charisma)';
  else status.pitch_variance = 'DYNAMIC (Good)';

  // Energy Stability
  if (metrics.energy_stability < AUTHORITY_THRESHOLDS.energy_stability.min) status.energy_stability = 'UNSTABLE';
  else status.energy_stability = 'STABLE (Authoritative)';

  return status;
}
