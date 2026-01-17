export interface ADSThresholds {
  version: string;
  effectiveDate: string;
  wpm: { optimal: [number, number] };
  pause_ratio: { optimal: [number, number] };
  filler_rate: { max: number };
  pitch_variance: { min: number };
  energy_stability: { min: number };
}

export const CURRENT_THRESHOLDS: ADSThresholds = {
  version: "v1.0.0",
  effectiveDate: "2026-01-16",
  wpm: { optimal: [110, 150] },
  pause_ratio: { optimal: [0.15, 0.30] },
  filler_rate: { max: 0.05 },
  pitch_variance: { min: 20 },
  energy_stability: { min: 0.7 }
};
