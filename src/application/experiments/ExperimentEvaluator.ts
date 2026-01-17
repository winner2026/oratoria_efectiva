export interface ExperimentResult {
    experimentId: string;
    metrics: {
        A: { false_negatives: number; false_positives: number; total: number };
        B: { false_negatives: number; false_positives: number; total: number };
    };
    recommendation: "KEEP_A" | "PROMOTE_B" | "INCONCLUSIVE";
}

export class ExperimentEvaluator {
    
    public evaluate(
        experimentId: string, 
        outcomesA: any[], 
        outcomesB: any[]
    ): ExperimentResult {
        
        const statsA = this.calculateStats(outcomesA);
        const statsB = this.calculateStats(outcomesB);

        // Simple heuristic: If B reduces False Negatives significantly without exploding False Positives
        const fnimprovement = (statsA.false_negatives - statsB.false_negatives) / (statsA.false_negatives || 1);
        const fpDegradation = (statsB.false_positives - statsA.false_positives) / (statsA.false_positives || 1);

        let recommendation: "KEEP_A" | "PROMOTE_B" | "INCONCLUSIVE" = "KEEP_A";

        if (fnimprovement > 0.10 && fpDegradation < 0.05) {
             recommendation = "PROMOTE_B";
        } else if (Math.abs(fnimprovement) < 0.02) {
             recommendation = "INCONCLUSIVE";
        }

        return {
            experimentId,
            metrics: { A: statsA, B: statsB },
            recommendation
        };
    }

    private calculateStats(outcomes: any[]) {
        // Mock logic - in real implementation, uses the same logic as ThresholdAnalyzer
        return {
            false_negatives: 10, // Mock
            false_positives: 2,
            total: outcomes.length
        }
    }
}
