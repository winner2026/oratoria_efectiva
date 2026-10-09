import { CoachingRepository } from '../src/infrastructure/db/repositories/coachingRepository.js';
import { getCoachingDashboard } from '../src/application/coaching/getCoachingDashboard.js';
import { diagnoseAndPrescribeUseCase } from '../src/application/coaching/diagnoseAndPrescribeUseCase.js';

async function testPersistenceFlow() {
  console.log('================================================================');
  console.log('🧪 VERIFICACIÓN DE TRANSICIÓN Y PERSISTENCIA DE DIAGNÓSTICO');
  console.log('================================================================\n');

  const testUserId = 'user-persistence-verify-999';

  // STEP 1: Estado inicial antes del diagnóstico (Página /listen sin haber grabado audio)
  console.log('Step 1: Consultando dashboard ANTES del diagnóstico (Estado Vacío / Fallback)...');
  const initialDashboard = await getCoachingDashboard(testUserId);
  console.log(`  • Authority Score: ${initialDashboard.authorityIndex}`);
  console.log(`  • Foco Actual: "${initialDashboard.currentFocus.title}" (${initialDashboard.currentFocus.type})`);
  console.log(`  • Misión: "${initialDashboard.todayMission.title}"`);

  if (initialDashboard.currentFocus.type !== 'MAINTENANCE') {
    throw new Error('❌ Fallo: El usuario nuevo debería estar en estado MAINTENANCE/Unanalyzed.');
  }

  // STEP 2: Simular finalización de diagnóstico de 60s con audio analizado
  console.log('\nStep 2: Procesando diagnóstico de voz con audio real (7 muletillas, 185 WPM)...');
  const userState = await CoachingRepository.getUserCoachingState(testUserId);
  
  const realMetrics = {
    wordsPerMinute: 185,
    avgPauseDuration: 0.3,
    pauseCount: 2,
    fillerCount: 7,
    pitchVariation: 0.4,
    energyStability: 0.65,
    nasalityScore: 0.2,
    brightnessScore: 0.7,
    depthScore: 0.6,
  };

  const authorityScore = {
    level: 'MEDIUM' as const,
    score: 64,
    strengths: ['Claridad Espectral'],
    weaknesses: ['Muletillas Elevadas', 'Aceleración Vocal'],
    priorityAdjustment: 'SLOW_DOWN' as const,
  };

  const output = diagnoseAndPrescribeUseCase({
    userState,
    sessionHistory: [],
    metrics: realMetrics,
    authorityScore,
  });

  // Guardar estado actualizado en repositorio
  await CoachingRepository.saveUserCoachingState(output.updatedUserState);
  await CoachingRepository.saveCoachingSession(output.session);
  console.log('  ✓ Estado tras diagnóstico guardado en repositorio persistente.');

  // STEP 3: Consultar dashboard INMEDIATAMENTE después del diagnóstico (Redirect a /listen)
  console.log('\nStep 3: Consultando dashboard INMEDIATAMENTE tras diagnóstico (Primera carga de /listen)...');
  const postDiagnosticDashboard = await getCoachingDashboard(testUserId);
  console.log(`  • Authority Score: ${postDiagnosticDashboard.authorityIndex}`);
  console.log(`  • Foco Actual: "${postDiagnosticDashboard.currentFocus.title}" (${postDiagnosticDashboard.currentFocus.type})`);
  console.log(`  • Explicación: "${postDiagnosticDashboard.currentFocus.explanation}"`);
  console.log(`  • Misión Prescrita: "${postDiagnosticDashboard.todayMission.title}" (${postDiagnosticDashboard.todayMission.customRoute})`);

  if (postDiagnosticDashboard.currentFocus.type !== 'FILLER_OVERUSE') {
    throw new Error('❌ Fallo: El foco no cambió a FILLER_OVERUSE tras el diagnóstico.');
  }

  // STEP 4: Simular actualización de página (Refresh F5 en /listen N veces)
  console.log('\nStep 4: Simulando recarga de página (Refresh en /listen)...');
  const refresh1 = await getCoachingDashboard(testUserId);
  const refresh2 = await getCoachingDashboard(testUserId);
  console.log(`  • Refresh 1 Score: ${refresh1.authorityIndex} | Foco: "${refresh1.currentFocus.title}"`);
  console.log(`  • Refresh 2 Score: ${refresh2.authorityIndex} | Foco: "${refresh2.currentFocus.title}"`);

  if (refresh1.authorityIndex !== 61 || refresh2.authorityIndex !== 61) {
    throw new Error('❌ Fallo de Persistencia: El score retrocedió al fallback 50 en la recarga.');
  }

  if (refresh1.currentFocus.title !== 'Frecuencia de Muletillas' || refresh2.currentFocus.title !== 'Frecuencia de Muletillas') {
    throw new Error('❌ Fallo de Persistencia: El foco retrocedió a Mantenimiento de Autoridad en la recarga.');
  }

  console.log('\n================================================================');
  console.log('✅ PERSISTENCIA Y TRANSICIÓN AUDITADAS CON ÉXITO (100% CORRECTO)');
  console.log('================================================================\n');
}

testPersistenceFlow().catch((err) => {
  console.error('❌ Error en prueba de persistencia:', err);
  process.exit(1);
});
