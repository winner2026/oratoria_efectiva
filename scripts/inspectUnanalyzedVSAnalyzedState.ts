import { getCoachingDashboard } from '../src/application/coaching/getCoachingDashboard.js';
import { diagnoseAndPrescribeUseCase } from '../src/application/coaching/diagnoseAndPrescribeUseCase.js';
import { createInitialCoachingState } from '../src/domain/coaching/TrainingPlan.js';

async function runInspection() {
  console.log('================================================================');
  console.log('🔍 AUDITORÍA DE INCONSISTENCIA PERCIBIDA VS ESTADO DE DOMINIO');
  console.log('================================================================\n');

  // CASO A: ESTADO INICIAL SIN RECORDING (UNANALYZED FALLBACK STATE)
  console.log('--- 1. CASO A: ESTADO INICIAL ANTES DE CUALQUIER GRABACIÓN ---');
  const initialDashboard = await getCoachingDashboard('test-user-unanalyzed');
  console.log('ViewModel devuelto por /api/coaching/dashboard (Sin audio procesado):');
  console.log(JSON.stringify(initialDashboard, null, 2));

  console.log('\n----------------------------------------------------------------');

  // CASO B: ESTADO TRAS ANÁLISIS DE AUDIO REAL / MUESTRA CON MULETILLAS (EX. 7 FILLEARS, 185 WPM)
  console.log('--- 2. CASO B: ESTADO DESPUÉS DE ANÁLISIS BIOACÚSTICO REAL ---');
  const initialState = createInitialCoachingState('test-user-analyzed');

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
    userState: initialState,
    sessionHistory: [],
    metrics: realMetrics,
    authorityScore,
  });

  console.log('JSON devuelto por diagnoseAndPrescribeUseCase (Audio real procesado):');
  console.log(JSON.stringify({
    communicationProfile: output.communicationProfile,
    diagnosticProfile: output.diagnosticProfile,
    prescription: output.prescription,
    updatedUserStateSummary: {
      authorityScore: output.updatedUserState.authorityScore,
      currentFocus: output.updatedUserState.currentFocus,
      behavioralSummary: output.updatedUserState.lastDiagnostic?.behavioralSummary,
    }
  }, null, 2));

  console.log('\n================================================================');
}

runInspection().catch(console.error);
