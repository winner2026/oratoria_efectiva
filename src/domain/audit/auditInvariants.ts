export interface AuditRecord {
    header: {
        decision_id: string;
        timestamp: string;
        user_cohort: string;
        threshold_version: string;
        experiment_arm?: "A" | "B";
        model_version: string;
    };
    inputs: {
        metrics: Record<string, number>;
    };
    decision_path: {
        rule_evaluations: {
            rule: string;
            threshold: any;
            value: any;
            result: "PASS" | "FAIL" | "OUT_OF_RANGE" | "WARN";
        }[];
    };
    executor_contribution: {
        executor_used: boolean;
        executor_role: string;
        llm_output_hash: string;
        interpretable: boolean;
    };
    critic_verdict: {
        contradictions: number;
        confidence_degraded: boolean;
        final_confidence: string;
        hitl_required: boolean;
        flags: string[];
    };
    final_decision: {
        authority_score: string;
        recommended_protocols: string[];
    };
}

// 5️⃣ Audit invariants (chequeos automáticos)
export function validateAuditInvariants(record: AuditRecord): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 1. Mandatory Header Fields
    if (!record.header.decision_id) errors.push('MISSING_DECISION_ID');
    if (!record.header.threshold_version) errors.push('MISSING_THRESHOLD_VERSION');

    // 2. Metrics Existence
    if (!record.inputs.metrics || Object.keys(record.inputs.metrics).length === 0) {
        errors.push('MISSING_INPUT_METRICS');
    }

    // 3. Executor Hash
    if (record.executor_contribution.executor_used && !record.executor_contribution.llm_output_hash) {
        errors.push('MISSING_EXECUTOR_HASH');
    }

    // 4. Critic Application (Presence of verdict)
    if (!record.critic_verdict) {
         errors.push('MISSING_CRITIC_VERDICT');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
