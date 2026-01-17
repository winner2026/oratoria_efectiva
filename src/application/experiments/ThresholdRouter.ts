export interface ExperimentConfig {
  id: string;
  variableName: string; // e.g. "WPM_UPPER_BOUND"
  targetCohort: string; // "all" or specific
  startDate: string;
  endDate?: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
}

export type ThresholdVersion = "A" | "B";

export interface ThresholdDecision {
  version: ThresholdVersion;
  configId?: string; // If part of active experiment
}

import crypto from 'crypto';

export class ThresholdRouter {
  
  private activeExperiments: ExperimentConfig[] = [];

  constructor(experiments: ExperimentConfig[] = []) {
    this.activeExperiments = experiments;
  }

  /**
   * Assigns user to A or B version deterministically (Sticky Assignment)
   */
  public route(userId: string, cohort: string): ThresholdDecision {
    const experiment = this.activeExperiments.find(
      ex => ex.status === 'ACTIVE' && (ex.targetCohort === 'all' || ex.targetCohort === cohort)
    );

    if (!experiment) {
      return { version: 'A' }; // Default / Control always
    }

    // Deterministic Hash: consistent assignment for same user in same experiment
    const hash = crypto.createHash('md5').update(`${userId}:${experiment.id}`).digest('hex');
    const numericHash = parseInt(hash.substring(0, 8), 16);
    
    // 50/50 split
    const version = numericHash % 2 === 0 ? 'A' : 'B';

    return {
      version,
      configId: experiment.id
    };
  }
}
