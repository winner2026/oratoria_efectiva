export type ToleranceLevel = "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "CUSTOM";
export type BoundBuffer = "WIDE" | "STANDARD" | "NARROW" | "CUSTOM";
export type MinConfidence = "LOW" | "MEDIUM" | "HIGH";
export type AuditLevel = "STANDARD" | "MAX";

export interface RiskProfile {
  profile_id: "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE" | "ENTERPRISE_CUSTOM";
  fp_tolerance: ToleranceLevel;
  fn_tolerance: ToleranceLevel;
  min_confidence_for_high: MinConfidence;
  hitl_threshold: ToleranceLevel;
  boundary_buffer: BoundBuffer;
  audit_level?: AuditLevel;
  threshold_lock?: boolean;
}

export const RISK_PROFILES: Record<RiskProfile["profile_id"], RiskProfile> = {
  CONSERVATIVE: {
    profile_id: "CONSERVATIVE",
    fp_tolerance: "VERY_LOW",
    fn_tolerance: "MEDIUM",
    min_confidence_for_high: "HIGH",
    hitl_threshold: "LOW", // Low threshold triggers HITL easily
    boundary_buffer: "WIDE"
  },
  BALANCED: {
    profile_id: "BALANCED",
    fp_tolerance: "LOW",
    fn_tolerance: "LOW",
    min_confidence_for_high: "MEDIUM",
    hitl_threshold: "MEDIUM",
    boundary_buffer: "STANDARD"
  },
  AGGRESSIVE: {
    profile_id: "AGGRESSIVE",
    fp_tolerance: "MEDIUM",
    fn_tolerance: "VERY_LOW",
    min_confidence_for_high: "LOW",
    hitl_threshold: "HIGH", // High threshold means HITL rarely triggered
    boundary_buffer: "NARROW"
  },
  ENTERPRISE_CUSTOM: {
      profile_id: "ENTERPRISE_CUSTOM",
      fp_tolerance: "CUSTOM",
      fn_tolerance: "CUSTOM",
      min_confidence_for_high: "HIGH",
      hitl_threshold: "LOW",
      boundary_buffer: "CUSTOM",
      audit_level: "MAX",
      threshold_lock: true
  }
};
