export interface OutcomeData {
  session_id: string;
  authority_score: "LOW" | "MEDIUM" | "HIGH";
  confidence: "LOW" | "MEDIUM" | "HIGH";
  context: "presentation" | "sales" | "leadership" | "interview" | "practice";
  outcome: {
    self_reported_confidence?: number; // 1-5
    presentation_completed?: boolean;
    perceived_authority_delta?: string;
    external_validation?: boolean;
  };
  metrics_snapshot: {
      wpm: number;
      pause_ratio: number;
      filler_rate: number;
      pitch_variance: number;
      energy_stability: number;
  };
  timestamp: string;
}

export class OutcomeCollector {
  
  // In a real implementation this would write to a DB (e.g. Neon 'outcomes' table)
  public async capture(data: OutcomeData): Promise<void> {
    console.log('[LEARNING] Capturing outcome:', JSON.stringify(data, null, 2));
    // Simulate DB save
    return Promise.resolve();
  }
}
