import { RiskProfile, BoundBuffer } from './riskProfiles';
import { ADSThresholds } from '../thresholds/authority.v1.0.json'; // Adjust import path if needed

type Range = [number, number];

export class RiskRules {

    /**
     * Calculates the effective thresholds based on the Risk Profile's buffer.
     * 
     * CONSERVATIVE (WIDE) -> Shrinks the optimal range (harder to hit)
     * AGGRESSIVE (NARROW) -> Expands/Original range (easier to hit)
     */
    public static applyBoundaryBuffer(
        profile: RiskProfile, 
        baseThresholds: ADSThresholds
    ): ADSThresholds {
        
        let bufferMultiplier = 0;
        
        switch (profile.boundary_buffer) {
            case 'WIDE': bufferMultiplier = -0.05; break; // Shrinks range by 5%
            case 'STANDARD': bufferMultiplier = 0; break;
            case 'NARROW': bufferMultiplier = 0.05; break; // Expands range by 5%
            case 'CUSTOM': bufferMultiplier = 0; break; // Manual overrides usually
        }

        const adjustRange = (range: Range): Range => {
            const span = range[1] - range[0];
            const buffer = span * bufferMultiplier;
            return [
                range[0] - buffer, // If shrinking (negative), min increases? No.
                // Logic check:
                // If I want to be CONSERVATIVE, the "Optimal Zone" should be SMALLER.
                // So min should INCREASE, max should DECREASE.
                
                // If bufferMultiplier is negative (-0.05):
                // Min' = min - (span * -0.05) = min + (span * 0.05) -> Moves UP (Correct)
                // Max' = max + (span * -0.05) -> Moves DOWN (Correct)
                
                range[1] + buffer 
            ];
        };

        // Deep Copy to avoid mutation
        const effective: ADSThresholds = JSON.parse(JSON.stringify(baseThresholds));
        
        effective.wpm.optimal = adjustRange(baseThresholds.wpm.optimal);
        effective.pause_ratio.optimal = adjustRange(baseThresholds.pause_ratio.optimal);
        
        // Single value thresholds (min/max)
        // Filler Rate MAX: If conservative, MAX should be LOWER.
        // If narrow/aggressive, MAX could be HIGHER.
        if (profile.boundary_buffer === 'WIDE') {
             effective.filler_rate.max *= 0.8; // Stricter
        } else if (profile.boundary_buffer === 'NARROW') {
             effective.filler_rate.max *= 1.2; // Laxer
        }

        return effective;
    }

    /**
     * Validates if a HIGH score is allowed under current risk constrained confidence.
     */
    public static canAwardHighAuthority(
        profile: RiskProfile, 
        currentConfidence: 'LOW' | 'MEDIUM' | 'HIGH'
    ): boolean {
        const levels = ['LOW', 'MEDIUM', 'HIGH'];
        const currentIdx = levels.indexOf(currentConfidence);
        const requiredIdx = levels.indexOf(profile.min_confidence_for_high);
        
        return currentIdx >= requiredIdx;
    }
}
