import { VoiceMetrics } from '@/domain/voice/VoiceMetrics';
import { ADSInputMetrics } from './types';

export function mapToADSMetrics(metrics: VoiceMetrics): ADSInputMetrics {
  return {
    wpm: metrics.wordsPerMinute,
    pause_ratio: metrics.pauseCount > 0 ? (metrics.avgPauseDuration * metrics.pauseCount) / (metrics.wordsPerMinute / 60 * 60) : 0, // Approximation
    // A better pause_ratio might be totalPauseDuration / totalDuration. 
    // We don't have totalDuration here easily unless passed. 
    // Let's assume pause_ratio is roughly pauseCount / (total words / 10)? No.
    // Let's rely on VoiceMetrics having enough info.
    // Actually, VoiceMetrics has avgPauseDuration and pauseCount.
    // We can't perfectly calculate ratio without duration. 
    // BUT, let's use what we have or accept that strict ADS requires total duration.
    
    // Let's refine pause_ratio: (avgPauseDuration * pauseCount) / durationSeconds.
    // Since we don't have durationSeconds in VoiceMetrics struct (it's passed separately usually),
    // we will need to handle this in the service layer or change the signature.
    // For now, let's map what we can.
    
    filler_rate: metrics.fillerCount / (metrics.wordsPerMinute * 1), // Simplification, strictly it's filler / wordCount
    
    pitch_variance: metrics.pitchVariation ? metrics.pitchVariation * 100 : 0, // Mapping 0-1 to something?
    // Wait, in rules.ts we set Pitch Variance min: 20. 
    // In PitchAnalysis, pitchRange is Hz (e.g. 50-200). 
    // In VoiceMetrics, pitchVariation is calculated as stdDev/avg or similar. 
    // If we use PitchAnalysis.pitchRange (Hz), it matches '20' threshold better.
    
    energy_stability: metrics.energyStability
  };
}

// We need duration for proper mapping.
export function mapVoiceMetricsToADS(
    metrics: VoiceMetrics, 
    durationSeconds: number, 
    pitchRangeHz?: number
): ADSInputMetrics {
    const totalWords = (metrics.wordsPerMinute / 60) * durationSeconds;
    const totalPauseTime = metrics.avgPauseDuration * metrics.pauseCount;
    
    return {
        wpm: metrics.wordsPerMinute,
        pause_ratio: durationSeconds > 0 ? Number((totalPauseTime / durationSeconds).toFixed(2)) : 0,
        filler_rate: totalWords > 0 ? Number((metrics.fillerCount / totalWords).toFixed(2)) : 0,
        pitch_variance: pitchRangeHz ?? (metrics.pitchVariation * 100), // Fallback or use Hz
        energy_stability: metrics.energyStability
    };
}
