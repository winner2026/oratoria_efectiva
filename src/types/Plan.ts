/**
 * Plan types - SIMPLIFIED TO 3 TIERS
 * Migrated from 6 plans to 3 for clarity and better conversion
 */

export type PlanType = "FREE" | "STARTER" | "PREMIUM";

export type PlanFeatures = {
  // Analysis limits
  maxAnalysesTotal: number;      // Total lifetime limit (-1 = no limit)
  maxAnalysesPerMonth: number;   // Monthly limit (-1 = no limit)
  
  // Protocol access
  protocolDays: number;          // 7, 21, or 30 days
  
  // Features
  hasVideoAnalysis: boolean;     // Video + posture analysis
  hasSpectralAnalysis: boolean;  // Elite metrics (nasality, brightness, depth)
  hasPostureMetrics: boolean;    // Executive status metrics (turtle neck, arms crossed, etc)
  hasCourses: boolean;           // Access to training courses
  hasHistory: boolean;           // Access to session history
  hasReRecord: boolean;          // Can re-record and compare
};

export const PLAN_CONFIGS: Record<PlanType, PlanFeatures> = {
  FREE: {
    maxAnalysesTotal: 1,
    maxAnalysesPerMonth: -1,
    protocolDays: 30,
    hasVideoAnalysis: false,
    hasSpectralAnalysis: false,
    hasPostureMetrics: false,
    hasCourses: true,
    hasHistory: true,
    hasReRecord: true
  },
  STARTER: {
    maxAnalysesTotal: -1,
    maxAnalysesPerMonth: 100,
    protocolDays: 21,
    hasVideoAnalysis: false,
    hasSpectralAnalysis: false,
    hasPostureMetrics: false,
    hasCourses: true,
    hasHistory: true,
    hasReRecord: true
  },
  PREMIUM: {
    maxAnalysesTotal: -1,
    maxAnalysesPerMonth: 250,
    protocolDays: 30,
    hasVideoAnalysis: false,
    hasSpectralAnalysis: true,
    hasPostureMetrics: false,
    hasCourses: true,
    hasHistory: true,
    hasReRecord: true
  }
};

export type Plan = {
  type: PlanType;
  features: PlanFeatures;
};

// Legacy plan migration mapping
export const LEGACY_PLAN_MIGRATION: Record<string, PlanType> = {
  'VOICE_WEEKLY': 'STARTER',
  'VOICE_MONTHLY': 'STARTER',
  'COACHING': 'PREMIUM'
};

// Helper to migrate legacy plans
export function migrateLegacyPlan(plan: string): PlanType {
  return LEGACY_PLAN_MIGRATION[plan] || (plan as PlanType);
}
