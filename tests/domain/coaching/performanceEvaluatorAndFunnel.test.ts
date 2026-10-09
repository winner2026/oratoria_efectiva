import { PerformanceEvaluator } from '../../../src/domain/coaching/PerformanceEvaluator';
import { FunnelTracker } from '../../../src/domain/coaching/FunnelTracker';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

export function runPerformanceAndFunnelTests() {
  console.log('🧪 Running PerformanceEvaluator & V6 Funnel Instrumentation Tests...\n');

  // Test 1: Evaluación direccional de WPM (RANGE_BOUND)
  console.log('Test 1: Verifying WPM directionality (185 WPM = RANGE_BOUND deviation)...');
  const wpmFast = PerformanceEvaluator.evaluateMetric(
    { metricKey: 'wpm', label: 'Ritmo WPM', direction: 'RANGE_BOUND', idealMin: 120, idealMax: 155 },
    185
  );

  assert(wpmFast.normalizedScore < 1.0, '185 WPM receives a penalized score (< 1.0)');
  assert(wpmFast.status === 'DEVIATED' || wpmFast.status === 'ACCEPTABLE', '185 WPM marked as DEVIATED or ACCEPTABLE');
  console.log(`  ✓ 185 WPM Normalized Score: ${wpmFast.normalizedScore} (Status: ${wpmFast.status})`);
  console.log(`  ✓ Feedback: "${wpmFast.feedback}"`);

  // Test 2: Evaluación direccional de Muletillas (LOWER_BETTER)
  console.log('\nTest 2: Verifying Fillers directionality (7 Fillers = LOWER_BETTER penalty)...');
  const fillers = PerformanceEvaluator.evaluateMetric(
    { metricKey: 'fillers', label: 'Muletillas', direction: 'LOWER_BETTER', targetValue: 2 },
    7
  );

  assert(fillers.normalizedScore < 0.5, '7 Fillers receives low score (< 0.5)');
  console.log(`  ✓ 7 Fillers Normalized Score: ${fillers.normalizedScore} (Status: ${fillers.status})`);

  // Test 3: Ratio de Rendimiento Global Ponderado vs Cuello de Botella
  console.log('\nTest 3: Calculating global index vs bottleneck severity...');
  const evaluation = PerformanceEvaluator.evaluateGlobalAndBottleneck({
    wordsPerMinute: 178,
    avgPauseDuration: 0.2,
    pauseCount: 1,
    fillerCount: 6,
    energyStability: 0.6,
  });

  assert(evaluation.globalPerformanceIndex >= 0 && evaluation.globalPerformanceIndex <= 100, 'Global index is bounded between 0 and 100');
  assert(Boolean(evaluation.primaryBottleneck), 'Primary bottleneck isolated');
  console.log(`  ✓ Global Performance Index: ${evaluation.globalPerformanceIndex} / 100`);
  console.log(`  ✓ Primary Bottleneck Isolated: ${evaluation.primaryBottleneck.metricKey}`);

  // Test 4: Instrumentación del Funnel V6 (FunnelTracker & Event Tracking)
  console.log('\nTest 4: Verifying V6 Funnel Event Instrumentation & Conversion Rate...');
  const userA = 'yt_lead_001';

  FunnelTracker.trackEvent({ userId: userA, eventType: 'diagnostic_started', source: 'youtube_cta' });
  FunnelTracker.trackEvent({ userId: userA, eventType: 'diagnostic_completed', source: 'youtube_cta' });
  FunnelTracker.trackEvent({ userId: userA, eventType: 'mission_started', source: 'youtube_cta' });
  FunnelTracker.trackEvent({ userId: userA, eventType: 'mission_completed', source: 'youtube_cta' });

  const analytics = FunnelTracker.getAnalyticsSummary();
  assert(analytics.totalDiagnosticCompletions >= 1, 'Diagnostic completion tracked');

  console.log(`  ✓ Diagnostic Starts: ${analytics.totalDiagnosticStarts}`);
  console.log(`  ✓ Diagnostic Completions: ${analytics.totalDiagnosticCompletions}`);
  console.log(`  ✓ First Missions Started: ${analytics.totalFirstMissionsStarted}`);

  console.log('\n✅ ALL PERFORMANCE EVALUATOR & V6 FUNNEL TESTS PASSED SUCCESSFULLY!');
}
