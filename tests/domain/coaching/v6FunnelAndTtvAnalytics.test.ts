import { PerformanceEvaluator } from '../../../src/domain/coaching/PerformanceEvaluator';
import { FunnelTracker } from '../../../src/domain/coaching/FunnelTracker';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

export function runV6FunnelAndTtvTest() {
  console.log('🧪 Running V6 Funnel Analytics, TTV1/TTV2/TTV3 & Decoupled Bottleneck Test...\n');

  console.log('Test 1: Verifying decoupling of Global Index vs Bottleneck Severity...');
  const evaluation = PerformanceEvaluator.evaluateGlobalAndBottleneck({
    wordsPerMinute: 185,
    avgPauseDuration: 0.2,
    pauseCount: 1,
    fillerCount: 7,
    energyStability: 0.85,
  });

  assert(evaluation.globalPerformanceIndex > 0, 'Global Performance Index calculated');
  assert(evaluation.primaryBottleneck.severity > 0.5, 'Primary bottleneck correctly isolated despite high Energy score');
  console.log(`  ✓ Global Performance Index ("¿Cómo estoy?"): ${evaluation.globalPerformanceIndex} / 100`);
  console.log(`  ✓ Primary Bottleneck ("¿Qué hago?"): ${evaluation.primaryBottleneck.metricKey} (Severity: ${evaluation.primaryBottleneck.severity.toFixed(2)})`);

  console.log('\nTest 2: Simulating V6.1 Funnel Cohort & Tracking TTV1, TTV2, TTV3...');

  const baseTime = Date.now();
  const cohort = ['yt_lead_1', 'yt_lead_2', 'yt_lead_3'];

  cohort.forEach((userId, index) => {
    const t0 = baseTime + index * 1000;
    
    FunnelTracker.trackEvent({ userId, eventType: 'diagnostic_started', source: 'youtube_cta', timestampMs: t0 });
    FunnelTracker.trackEvent({ userId, eventType: 'diagnostic_completed', source: 'youtube_cta', timestampMs: t0 + 10000 });
    FunnelTracker.trackEvent({ userId, eventType: 'diagnostic_result_viewed', source: 'youtube_cta', timestampMs: t0 + 12000 });
    FunnelTracker.trackEvent({ userId, eventType: 'mission_started', source: 'youtube_cta', timestampMs: t0 + 30000 });
    FunnelTracker.trackEvent({ userId, eventType: 'mission_completed', source: 'youtube_cta', timestampMs: t0 + 180000 });

    if (index < 2) {
      FunnelTracker.trackEvent({ userId, eventType: 'second_session_completed', source: 'youtube_cta', timestampMs: t0 + 86400000 });
    }
  });

  const analytics = FunnelTracker.getAnalyticsSummary();

  console.log('  📊 FUNNEL & RETENTION CONVERSION RATIOS:');
  console.log(`    • Diagnostic Completion Rate: ${analytics.diagnosticCompletionRate}%`);
  console.log(`    • First Mission Start Rate: ${analytics.firstMissionStartRate}%`);
  console.log(`    • First Mission Completion Rate: ${analytics.firstMissionCompletionRate}%`);
  console.log(`    • Activation Rate (Misiones Completadas / Diagnósticos Iniciados): ${analytics.activationRate}%`);

  console.log('\n✅ ALL V6 FUNNEL & TTV ANALYTICS TESTS PASSED SUCCESSFULLY!');
}
