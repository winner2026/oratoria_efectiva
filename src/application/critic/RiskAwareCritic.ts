import { AuthoritySignalCritic, CriticInput, CriticOutput } from '@/application/critic/AuthoritySignalCritic';
import { RiskProfile } from '@/domain/risk/riskProfiles';
import { RiskRules } from '@/domain/risk/riskRules';

export interface RiskAwareCriticInput extends CriticInput {
    riskProfile: RiskProfile;
}

export class RiskAwareCritic extends AuthoritySignalCritic {

    // Override the validate method to inject risk awareness
    public validate(input: RiskAwareCriticInput): CriticOutput {
        
        // 1. First, run the base semantic validation
        let output = super.validate(input);
        
        const { riskProfile } = input;

        // 2. Apply Confidence Gating (Rule 6.2)
        // IF profile == CONSERVATIVE AND confidence != HIGH → authority_score CANNOT be HIGH
        if (!RiskRules.canAwardHighAuthority(riskProfile, output.confidence)) {
            if (output.authority_score === 'HIGH') {
                output.authority_score = 'MEDIUM'; // Cap the score
                output.critic_flags.push('RISK_GATED_SCORE_CAP');
                // Note: We don't degrade confidence, we just cap the outcome score.
            }
        }

        // 3. Apply HITL Escalation Sensitivity (Rule 6.3)
        // If FP Tolerance is VERY_LOW, we are paranoid about any boundary stress.
        if (riskProfile.fp_tolerance === 'VERY_LOW') {
             if (output.critic_flags.some(f => f.includes('NEAR_BOUNDARY'))) {
                 output.hitl_required = true;
                 output.critic_flags.push('RISK_ESCALATION_STRICT_BOUNDARY');
             }
        }
        
        // 4. Record Applied constraints (for Audit)
        // We technically need to inject this into the audit record later. 
        // For now, we append it to flags or a custom field if we extended Output.
        output.critic_flags.push(`RISK_PROFILE:${riskProfile.profile_id}`);

        return output;
    }
}
