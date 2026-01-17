import { ADSInput, ADSOutput, ADSInputMetrics, AuthorityLevel } from '@/domain/authority/ADS/types';
import { checkDecisionAllowed, AUTHORITY_THRESHOLDS } from '@/domain/authority/ADS/rules';
import { runAuthorityAnalyst } from '@/infrastructure/openai/authorityAnalyst';

export class AuthoritySignalCalibrationService {
  
  /**
   * Main entry point for the Skill
   */
  async execute(input: ADSInput): Promise<ADSOutput> {
    console.log('[ADS] Starting calibration for sample:', input.audio_sample_id);

    // 1. PLANNER
    // Decide si el audio califica para análisis
    const preCheck = checkDecisionAllowed(input);
    if (!preCheck.allowed) {
      console.log('[ADS] Pre-check rejected:', preCheck.reason);
      return {
        decision_allowed: false,
        reason: preCheck.reason,
        next_action: 'RECORD_AGAIN'
      };
    }

    // 2. EXECUTOR
    // Llama al LLM (Analyst)
    const rawResult = await runAuthorityAnalyst(input);

    if (!rawResult.decision_allowed) {
      return rawResult; // LLM decided it couldn't decide
    }

    // 3. CRITIC / AUDITOR
    // Valida coherencia y degrada confidence si es necesario
    const finalResult = this.auditResult(input, rawResult);

    // 4. MEMORY
    // (In a real implementation, this would save to a specific repository)
    // await this.repository.save(input, finalResult);
    console.log('[ADS] Calibration complete. Score:', finalResult.authority_score);

    return finalResult;
  }

  /**
   * Auditor: Validates consistency between metrics and LLM score
   */
  private auditResult(input: ADSInput, result: ADSOutput): ADSOutput {
    const audited = { ...result };
    const messages: string[] = [];

    // Rule: IF WPM is extreme (<100 or >180), Authority CANNOT be HIGH
    if (input.metrics.wpm < 100 || input.metrics.wpm > 180) {
      if (audited.authority_score === 'HIGH') {
        audited.authority_score = 'MEDIUM'; // Downgrade
        audited.confidence = 'low';
        messages.push('Auditor: Downgraded HIGH to MEDIUM due to extreme WPM.');
      }
    }

    // Rule: IF Filler Rate > 8%, Authority CANNOT be HIGH
    if (input.metrics.filler_rate > 0.08) {
      if (audited.authority_score === 'HIGH') {
        audited.authority_score = 'MEDIUM';
        audited.confidence = 'low';
        messages.push('Auditor: Downgraded HIGH to MEDIUM due to excessive fillers.');
      }
    }

    // Rule: IF Pitch Variance < 10 (Monotone), Authority CANNOT be HIGH
    if (input.metrics.pitch_variance < 10) {
       if (audited.authority_score === 'HIGH') {
         audited.authority_score = 'MEDIUM';
         messages.push('Auditor: Downgraded due to monotone pitch.');
       }
    }

    if (messages.length > 0) {
      console.warn('[ADS] Auditor interventions:', messages);
      // Ensure hitl_required is true if confidence dropped to low
      if (audited.confidence === 'low') {
        audited.hitl_required = true;
      }
    }

    return audited;
  }
}
