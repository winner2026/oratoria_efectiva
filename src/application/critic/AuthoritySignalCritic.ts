import { ExecutorMetrics, ExecutorOutput, ExecutorThresholds } from '../executor/AuthoritySignalExecutor';
import { AuthorityLevel } from '@/domain/authority/ADS/types';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CriticInput {
  metrics: ExecutorMetrics;
  thresholds: ExecutorThresholds;
  executor_output: ExecutorOutput;
  initial_authority_score: AuthorityLevel; // Passed from service/executor derived score
}

export interface CriticOutput {
  decision_allowed: boolean;
  confidence: ConfidenceLevel;
  authority_score: AuthorityLevel;
  validated_output: {
    signal_breakdown: {
      strengths: string[];
      weaknesses: string[];
    };
    risk_flags: string[];
    recommended_protocol: string[];
  };
  critic_flags: string[];
  hitl_required: boolean;
  reason?: string;
}

export class AuthoritySignalCritic {
  
  public validate(input: CriticInput): CriticOutput {
    const { metrics, executor_output, thresholds, initial_authority_score } = input;
    const criticFlags: string[] = [];
    let confidence: ConfidenceLevel = 'HIGH';
    let contradictions = 0;
    
    // --- 1. REGLAS DE CONTRADICCIÓN LÓGICA ---

    // 1️⃣ Contradicción básica: WPM alto y "ritmo controlado"
    const hasControlledPaceStrength = executor_output.signal_breakdown.strengths.some(s => 
      s.toLowerCase().includes('ritmo') || s.toLowerCase().includes('controlado')
    );
    if (metrics.wpm > 160 && hasControlledPaceStrength) {
      criticFlags.push('INVALID_STRENGTH_PACE_CONTROL');
      contradictions++;
    }

    // 2️⃣ Riesgo sin causa: LOW_ENERGY pero métrica estable
    if (executor_output.risk_flags.includes('LOW_ENERGY') && metrics.energy_stability >= 0.7) {
      criticFlags.push('INVALID_RISK_LOW_ENERGY');
      contradictions++;
    }

    // 3️⃣ Protocolo mal asignado: Poca pausa pero sin recomendación
    if (metrics.pause_ratio < 0.1 && 
        !executor_output.recommended_protocol.includes('PAUSE_CONTROL')) {
      criticFlags.push('MISSING_PROTOCOL_PAUSE');
      contradictions++; // This is a logical gap
    }

    // --- 2. VALIDACIÓN DE COHERENCIA DEL SCORE ---

    // 4️⃣ Exceso de confianza: Debilidades vs Score Alto
    // IF number_of_weaknesses >= 2 AND authority_score == "HIGH" → DEGRADE_CONFIDENCE
    let validatedScore = initial_authority_score;
    if (executor_output.signal_breakdown.weaknesses.length >= 2 && validatedScore === 'HIGH') {
      criticFlags.push('OVERCONFIDENT_SCORE');
      confidence = this.degradeConfidence(confidence);
    }

    // --- 3. CÁLCULO DE CONFIDENCE ---
    
    // -1 level if any metric near boundary (±5%)
    if (this.isNearBoundary(metrics.wpm, thresholds.wpm_optimal)) {
        confidence = this.degradeConfidence(confidence);
        criticFlags.push('NEAR_BOUNDARY_WPM');
    }
    
    // -1 level if >= 1 contradiction resolved (Assuming we strip the invalid parts)
    if (contradictions >= 1) {
       confidence = this.degradeConfidence(confidence);
    }

    // -1 level if interpretable is false (Immediate fail usually, but degradation logic holds)
    if (!executor_output.interpretable) {
       confidence = this.degradeConfidence(confidence);
       criticFlags.push('EXECUTOR_NOT_INTERPRETABLE');
    }

    // --- 4. SANITIZACIÓN DE OUTPUT ---
    
    // Remove invalid flags/strengths detected by rules
    const validatedOutput = {
        signal_breakdown: {
            strengths: executor_output.signal_breakdown.strengths.filter(s => 
                 !(s.toLowerCase().includes('ritmo') && metrics.wpm > 160) // Remove contradictory strength
            ),
            weaknesses: executor_output.signal_breakdown.weaknesses
        },
        risk_flags: executor_output.risk_flags.filter(f => 
            !(f === 'LOW_ENERGY' && metrics.energy_stability >= 0.7) // Remove contradictory risk
        ),
        // Add required protocol if missing and critical
        recommended_protocol: [...executor_output.recommended_protocol]
    };

    if (metrics.pause_ratio < 0.1 && !validatedOutput.recommended_protocol.includes('PAUSE_CONTROL')) {
        // En typescript strict, necesitamos castear o asegurar que 'PAUSE_CONTROL' es valido, 
        // pero RecommendedProtocol es string type-alias aqui.
        validatedOutput.recommended_protocol.push('PAUSE_CONTROL');
    }


    // --- 5. REGLAS DE ESCALACIÓN HITL (Human-in-the-Loop) ---
    
    // IF contradictions >= 2
    // OR metrics out_of_range >= 3 (Calculated below)
    // OR executor_output.interpretable == false
    
    let outOfRangeCount = 0;
    if (metrics.wpm < thresholds.wpm_optimal[0] || metrics.wpm > thresholds.wpm_optimal[1]) outOfRangeCount++;
    if (metrics.pause_ratio < thresholds.pause_ratio_optimal[0] || metrics.pause_ratio > thresholds.pause_ratio_optimal[1]) outOfRangeCount++;
    if (metrics.filler_rate > thresholds.filler_rate_max) outOfRangeCount++;
    if (metrics.pitch_variance < thresholds.pitch_variance_min) outOfRangeCount++;
    if (metrics.energy_stability < thresholds.energy_stability_min) outOfRangeCount++;

    let hitlRequired = false;
    let decisionAllowed = true;
    let failureReason: string | undefined = undefined;

    if (contradictions >= 2 || outOfRangeCount >= 3 || !executor_output.interpretable) {
        hitlRequired = true;
        // If it's too chaotic, we might even disallow autonomous decision
        if (!executor_output.interpretable) {
             decisionAllowed = false;
             failureReason = "EXECUTOR_FAILED_INTERPRETATION";
        } else if (contradictions >= 2) {
             // We allow the decision but mark it for human review if confident enough, 
             // OR disallow if we want strict safety.
             // The requirement says: "validates... decides if scalar to human".
             // "If contradictions >= 2 -> hitl_required = true". It doesn't explicitly say "decision_allowed = false".
             // EXCEPT: The prompt fallback says: "O, si falla: decision_allowed: false"
             // usually implies total failure.
             // But let's assume if it's interpretable, we permit output but flag HITL.
             // Unless confidence drops to LOW?
             if (confidence === 'LOW') {
               // Usually LOW confidence + HITL means we show result but warn? Or hide?
               // Let's keep allowed=true unless strictly failed.
             }
        }
    }

    // Safety Override: If contradiction logic invalidated essential parts, maybe we should just fail?
    // Requirement says: "O, si falla: { decision_allowed: false, reason: 'INCONSISTENT_INTERPRETATION' }"
    // Let's trigger this if we have unresolved major contradictions or confidence is too low.
    
    if (contradictions >= 2 && confidence === 'LOW') {
        return {
            decision_allowed: false,
            confidence: 'LOW',
            authority_score: validatedScore,
            validated_output: validatedOutput,
            critic_flags: criticFlags,
            hitl_required: true,
            reason: 'INCONSISTENT_INTERPRETATION'
        };
    }

    return {
        decision_allowed: decisionAllowed,
        confidence,
        authority_score: validatedScore, // Critic could theoretically modify score, but here passes validated one
        validated_output: validatedOutput,
        critic_flags: criticFlags,
        hitl_required: hitlRequired,
        reason: failureReason
    };
  }

  private degradeConfidence(current: ConfidenceLevel): ConfidenceLevel {
      if (current === 'HIGH') return 'MEDIUM';
      if (current === 'MEDIUM') return 'LOW';
      return 'LOW';
  }

  private isNearBoundary(value: number, range: [number, number], tolerancePercent: number = 0.05): boolean {
      const min = range[0];
      const max = range[1];
      const span = max - min;
      const tolerance = span * tolerancePercent;

      // Check near min
      if (Math.abs(value - min) <= tolerance) return true;
      // Check near max
      if (Math.abs(value - max) <= tolerance) return true;
      
      return false;
  }
}
