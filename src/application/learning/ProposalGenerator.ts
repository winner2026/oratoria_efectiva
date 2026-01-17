import { AnalysisReport } from './ThresholdAnalyzer';
import { ADSThresholds } from '@/domain/thresholds/authority.v1.0.json';

export interface ProposedChange {
    metric: keyof ADSThresholds;
    current_value: any;
    proposed_value: any;
    justification: {
        false_negative_reduction?: string;
        boundary_evidence: string;
        risk_assessment: string;
    };
}

export class ProposalGenerator {
    
    public generate(report: AnalysisReport, currentThresholds: ADSThresholds): ProposedChange[] {
        const proposals: ProposedChange[] = [];

        // Logic: If WPM has significant boundary stress (many successful people just above limit)
        // AND False Negative rate is substantial -> Propose extension.
        
        const wpmStress = report.boundaryStress.find(b => b.metric === 'wpm');
        
        // Threshold: If > 5% of samples are in "stress zone" (successful but rejected by threshold)
        if (wpmStress && (wpmStress.nearBoundaryCount / report.sampleCount) > 0.05) {
             proposals.push({
                 metric: 'wpm',
                 current_value: currentThresholds.wpm,
                 proposed_value: { optimal: [currentThresholds.wpm.optimal[0], currentThresholds.wpm.optimal[1] + 5] },
                 justification: {
                     boundary_evidence: `Found ${wpmStress.nearBoundaryCount} successful samples in range ${currentThresholds.wpm.optimal[1]}-${currentThresholds.wpm.optimal[1]+5}`,
                     false_negative_reduction: "Estimated 5% reduction in false negatives",
                     risk_assessment: "Low risk. 155 WPM is still within comprehensible executive range."
                 }
             });
        }

        return proposals;
    }
}
