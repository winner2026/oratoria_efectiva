import { ADSThresholds } from '@/domain/thresholds/authority.v1.0.json';
import { OutcomeData } from './OutcomeCollector';

export interface AnalysisReport {
  cohort: string;
  sampleCount: number;
  falseNegatives: number; // Low score but High outcome
  falsePositives: number; // High score but Low outcome
  boundaryStress: {
      metric: string;
      nearBoundaryCount: number;
  }[];
}

export class ThresholdAnalyzer {
    
    /**
     * Analyzes a batch of outcomes to detect threshold inefficiencies.
     * STRICTLY DETERMINISTIC. NO AI.
     */
    public analyzeBatch(
        outcomes: OutcomeData[], 
        currentThresholds: ADSThresholds
    ): AnalysisReport {
        
        if (outcomes.length < 100) {
            throw new Error("INSUFFICIENT_DATA: Minimum 100 samples required for analysis.");
        }

        let falseNegatives = 0;
        let falsePositives = 0;
        const wpmNearMaxBoundaryMatches = outcomes.filter(o => {
            const max = currentThresholds.wpm.optimal[1];
            // Check if WPM is slightly above max (e.g. 150-160) BUT outcome was good
            return o.metrics_snapshot.wpm > max && 
                   o.metrics_snapshot.wpm <= max + 10 && 
                   this.isGoodOutcome(o);
        });

        outcomes.forEach(o => {
            const isGood = this.isGoodOutcome(o);
            const isHighAuth = o.authority_score === 'HIGH';

            if (isHighAuth && !isGood) falsePositives++;
            if (!isHighAuth && isGood) falseNegatives++;
        });

        return {
            cohort: "mixed_v1", // Simplified
            sampleCount: outcomes.length,
            falseNegatives,
            falsePositives,
            boundaryStress: [
                { metric: 'wpm', nearBoundaryCount: wpmNearMaxBoundaryMatches.length }
            ]
        };
    }

    private isGoodOutcome(o: OutcomeData): boolean {
        // Define what "success" means strictly
        return (o.outcome.self_reported_confidence ?? 0) >= 4 || 
               (o.outcome.external_validation === true);
    }
}
