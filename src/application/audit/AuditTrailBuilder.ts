import crypto from 'crypto';
import { AuditRecord, validateAuditInvariants } from '@/domain/audit/auditInvariants';
import { ADSThresholds } from '@/domain/thresholds/authority.v1.0.json';
import { ExecutorOutput } from '@/application/executor/AuthoritySignalExecutor';
import { CriticOutput } from '@/application/critic/AuthoritySignalCritic';
import { AuthorityLevel } from '@/domain/authority/ADS/types';

export class AuditTrailBuilder {
    private record: Partial<AuditRecord> = {};

    constructor(
        decisionId: string,
        cohort: string,
        thresholdVersion: string,
        arm: "A" | "B" = "A"
    ) {
        this.record.header = {
            decision_id: decisionId,
            timestamp: new Date().toISOString(),
            user_cohort: cohort,
            threshold_version: thresholdVersion,
            experiment_arm: arm,
            model_version: 'gpt-4o-mini' // Should be injected strictly
        };
    }

    public addInputs(metrics: Record<string, number>) {
        this.record.inputs = { metrics };
        return this;
    }

    public addEvaluations(thresholds: ADSThresholds, metrics: any) {
        // Reconstruct rule evaluations deterministically
        const evaluations = [
            {
                rule: 'WPM_OPTIMAL',
                threshold: thresholds.wpm.optimal,
                value: metrics.wpm,
                result: (metrics.wpm >= thresholds.wpm.optimal[0] && metrics.wpm <= thresholds.wpm.optimal[1]) ? 'PASS' : 'OUT_OF_RANGE'
            },
            {
                rule: 'ENERGY_STABILITY_MIN',
                threshold: thresholds.energy_stability.min,
                value: metrics.energy_stability,
                result: metrics.energy_stability >= thresholds.energy_stability.min ? 'PASS' : 'FAIL'
            }
            // Add other evaluations similarly...
        ];
        
        this.record.decision_path = { rule_evaluations: evaluations as any[] };
        return this;
    }

    public addExecutorContribution(output: ExecutorOutput) {
        // Hash the full output for immutability proof
        const outputString = JSON.stringify(output);
        const hash = crypto.createHash('sha256').update(outputString).digest('hex');

        this.record.executor_contribution = {
            executor_used: true,
            executor_role: 'INTERPRETATION_ONLY',
            llm_output_hash: `sha256:${hash}`,
            interpretable: output.interpretable
        };
        return this;
    }

    public addCriticVerdict(criticOutput: CriticOutput) {
        this.record.critic_verdict = {
            contradictions: 0, // Should be passed from critic output details if available
            confidence_degraded: criticOutput.confidence !== 'HIGH',
            final_confidence: criticOutput.confidence,
            hitl_required: criticOutput.hitl_required,
            flags: criticOutput.critic_flags
        };
        this.record.final_decision = {
            authority_score: criticOutput.authority_score,
            recommended_protocols: criticOutput.validated_output.recommended_protocol
        };
        return this;
    }

    public build(): AuditRecord {
        const fullRecord = this.record as AuditRecord;
        const validation = validateAuditInvariants(fullRecord);
        
        if (!validation.valid) {
            console.error('[AUDIT] Invalid Record:', validation.errors);
            throw new Error(`Audit Invariant Violation: ${validation.errors.join(', ')}`);
        }
        
        return fullRecord;
    }
}
