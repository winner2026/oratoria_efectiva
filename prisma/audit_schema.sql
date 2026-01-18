-- Create Audit Trail table designed for WORM (Write Once Read Many) compliance
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_cohort VARCHAR(50) NOT NULL,
  threshold_version VARCHAR(20) NOT NULL,
  experiment_arm VARCHAR(10),
  model_version VARCHAR(50),
  inputs JSONB NOT NULL,
  decision_path JSONB NOT NULL,
  executor_hash VARCHAR(64) NOT NULL,
  executor_output JSONB, -- Optional: Store full output if not strictly compliant to hash-only
  critic_verdict JSONB NOT NULL,
  final_decision JSONB NOT NULL,
  integrity_hash VARCHAR(64) NOT NULL, -- Hash of the entire row content for tamper-evidence
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by decision_id or user
CREATE INDEX idx_audit_decision_id ON audit_logs(decision_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);

-- Policy Table for Threshold Changes (Learning Loop)
CREATE TABLE IF NOT EXISTS threshold_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric VARCHAR(50) NOT NULL,
  current_value JSONB NOT NULL,
  proposed_value JSONB NOT NULL,
  justification JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewer_id VARCHAR(50), -- Only authorized human IDs
  rejection_reason TEXT
);
