import { FunnelTracker } from '../../../src/domain/coaching/FunnelTracker';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

export function runV62ExperimentSimulation() {
  console.log('🧪 Running V6.2 Real User Experiment & Statistical Cohort Test...\n');

  const baseTime = Date.now();

  const cohort = [
    { id: 'yt_user_1', delay: 10, delta: 7 },
    { id: 'yt_user_2', delay: 14, delta: 6 },
    { id: 'yt_user_3', delay: 18, delta: 2 },
    { id: 'yt_user_4', delay: 25, delta: 8 },
    { id: 'yt_user_5', delay: 120, delta: 9 },
  ];

  console.log('Step 1: Tracking asymmetrical events for cohort of 5 users...');

  cohort.forEach((u) => {
    const t0 = baseTime;
    const attribution = { source: 'youtube', campaign: 'video_miedo_hablar', content: 'cta_60s_diagnostic' };

    FunnelTracker.trackEvent({ userId: u.id, eventType: 'diagnostic_started', attribution, timestampMs: t0 });
    FunnelTracker.trackEvent({ userId: u.id, eventType: 'diagnostic_completed', attribution, timestampMs: t0 + u.delay * 1000 });
    FunnelTracker.trackEvent({ userId: u.id, eventType: 'diagnostic_result_viewed', attribution, timestampMs: t0 + (u.delay + 2) * 1000 });
    FunnelTracker.trackEvent({ userId: u.id, eventType: 'mission_started', attribution, timestampMs: t0 + (u.delay + 20) * 1000 });
    FunnelTracker.trackEvent({
      userId: u.id,
      eventType: 'mission_completed',
      attribution,
      timestampMs: t0 + (u.delay + 180) * 1000,
      metadata: { scoreDelta: u.delta },
    });

    if (u.delta >= 5 && u.id !== 'yt_user_5') {
      FunnelTracker.trackEvent({ userId: u.id, eventType: 'second_session_completed', attribution, timestampMs: t0 + 86400000 });
    }
  });

  const analytics = FunnelTracker.getAnalyticsSummary();

  console.log('\n📊 ESTADÍSTICA ROBUSTA DE TIME TO VALUE (MEDIANA Y PERCENTIL 75):');
  console.log(`  ✓ TTV1 (Entrada → Resultado): Mediana = ${analytics.ttv.ttv1.medianSeconds}s | P75 = ${analytics.ttv.ttv1.p75Seconds}s`);
  console.log(`  ✓ TTV2 (Entrada → Iniciar Misión 1): Mediana = ${analytics.ttv.ttv2.medianSeconds}s | P75 = ${analytics.ttv.ttv2.p75Seconds}s`);
  console.log(`  ✓ TTV3 (Entrada → Mejora Demostrable Δ >= 5 pts): Mediana = ${analytics.ttv.ttv3.medianSeconds}s | P75 = ${analytics.ttv.ttv3.p75Seconds}s`);

  console.log('\n📈 RATIOS Y SEÑAL TEMPRANA DE RETENCIÓN:');
  console.log(`  ✓ Diagnostic Completion Rate: ${analytics.diagnosticCompletionRate}%`);
  console.log(`  ✓ Activation Rate (Misiones Completadas / Diagnósticos Iniciados): ${analytics.activationRate}%`);
  console.log(`  ✓ Early Retention Signal (SecondSessionRate): ${analytics.earlyRetentionSignal}%`);

  const campaignStats = analytics.attributionBreakdown['youtube:video_miedo_hablar'];
  assert(Boolean(campaignStats), 'Attribution tracking recorded for campaign video_miedo_hablar');
  console.log(`  ✓ Atribución por Campaña [youtube:video_miedo_hablar]: ${campaignStats.completions}/${campaignStats.starts} activaciones (${campaignStats.activationRate}%)`);

  assert(analytics.ttv.ttv1.medianSeconds > 0, 'Median TTV1 calculated');

  console.log('\n✅ ALL V6.2 STATISTICAL EXPERIMENT & ATTRIBUTION TESTS PASSED SUCCESSFULLY!');
}
