export interface ADSInputMetrics {
  wpm: number;
  pause_ratio: number;
  filler_rate: number;
  pitch_variance: number;
  energy_stability: number;
}

export interface ADSUserContext {
  experience_level: 'junior' | 'mid' | 'senior' | 'executive';
  language: 'es';
  use_case: 'presentation' | 'sales' | 'leadership' | 'interview';
}

export interface ADSInput {
  audio_sample_id: string;
  transcript: string;
  duration_seconds: number;
  metrics: ADSInputMetrics;
  user_context: ADSUserContext;
}

export type AuthorityLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type RiskFlag = 'UPWARD_INFLECTION' | 'MONOTONE' | 'RUSHING' | 'LOW_ENERGY';
export type RecommendedProtocol = 'BREATHING_SSSS' | 'POWER_STATEMENT' | 'PAUSE_CONTROL';

export interface ADSOutput {
  decision_allowed: boolean;
  confidence?: ConfidenceLevel;
  authority_score?: AuthorityLevel;
  signal_breakdown?: {
    strengths: string[];
    weaknesses: string[];
  };
  risk_flags?: RiskFlag[];
  recommended_protocol?: RecommendedProtocol[];
  hitl_required?: boolean;
  
  // Error handling if decision_allowed is false
  reason?: string;
  next_action?: 'RECORD_AGAIN' | 'CONTACT_SUPPORT';
}
