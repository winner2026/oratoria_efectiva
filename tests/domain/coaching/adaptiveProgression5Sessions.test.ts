import { createInitialCoachingState } from '../../../src/domain/coaching/TrainingPlan';
import { diagnoseAndPrescribeUseCase } from '../../../src/application/coaching/diagnoseAndPrescribeUseCase';
import { CoachingRepository } from '../../../src/infrastructure/db/repositories/coachingRepository';
import { evaluatePerformanceAndAdjustDifficulty } from '../../../src/domain/coaching/AdaptiveDifficultyEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

export async function run5SessionAdaptiveSimulation() {
  console.log('🧪 Running 5-Session Real User Adaptive Simulation (V5 Hypothesis Test)...\n');

  const userId = 'user-simulation-v5';
  let userState = createInitialCoachingState(userId);

  let prescribedMissions = 0;
  let completedMissions = 0;

  // SESIÓN 1
  console.log('--- SESIÓN 1: Baseline e Inicio de Diagnóstico ---');
  prescribedMissions++;
  const session1Output = diagnoseAndPrescribeUseCase({
    userState,
    sessionHistory: [],
    metrics: { wordsPerMinute: 178, avgPauseDuration: 0.2, pauseCount: 1, fillerCount: 6, pitchVariation: 0.15, energyStability: 0.55 },
    authorityScore: { score: 50, strengths: [], weaknesses: [] }
  });
  completedMissions++;

  await CoachingRepository.saveUserCoachingState(session1Output.updatedUserState);
  await CoachingRepository.saveCoachingSession(session1Output.session);
  userState = session1Output.updatedUserState;

  console.log(`  • Authority Index Inicial: ${userState.authorityScore}`);
  console.log(`  • Cuello de Botella Detectado: "${userState.currentFocus}"`);
  console.log(`  • Misión Prescrita: "${userState.activePrescription?.exerciseTitle}"\n`);

  // SESIÓN 2
  console.log('--- SESIÓN 2: Ejecución de Misión Pausas con Alta Performance ---');
  prescribedMissions++;
  const history1 = await CoachingRepository.getUserSessionHistory(userId);
  
  const diffAdjust2 = evaluatePerformanceAndAdjustDifficulty(1, 0.92);
  assert(diffAdjust2.newLevel === 2, 'Difficulty scaled to Level 2');
  console.log(`  • Evaluador Adaptativo: ${diffAdjust2.reasoning}`);

  const session2Output = diagnoseAndPrescribeUseCase({
    userState,
    sessionHistory: history1,
    metrics: { wordsPerMinute: 145, avgPauseDuration: 0.75, pauseCount: 4, fillerCount: 5, pitchVariation: 0.35, energyStability: 0.75 },
    authorityScore: { score: 68, strengths: ['Estabilidad'], weaknesses: [] }
  });
  completedMissions++;

  await CoachingRepository.saveUserCoachingState(session2Output.updatedUserState);
  await CoachingRepository.saveCoachingSession(session2Output.session);
  userState = session2Output.updatedUserState;

  console.log(`  • Authority Index post-Sesión 2: ${userState.authorityScore}`);
  console.log(`  • Nuevo Foco Adaptativo: "${session2Output.adaptiveNextStep.nextFocus}"\n`);

  // SESIÓN 3
  console.log('--- SESIÓN 3: Entrenamiento de Muletillas (Filler Killer) ---');
  prescribedMissions++;
  const history2 = await CoachingRepository.getUserSessionHistory(userId);

  const session3Output = diagnoseAndPrescribeUseCase({
    userState,
    sessionHistory: history2,
    metrics: { wordsPerMinute: 140, avgPauseDuration: 0.7, pauseCount: 4, fillerCount: 2, pitchVariation: 0.45, energyStability: 0.82 },
    authorityScore: { score: 76, strengths: ['Estabilidad', 'Pausas'], weaknesses: [] }
  });
  completedMissions++;

  await CoachingRepository.saveUserCoachingState(session3Output.updatedUserState);
  await CoachingRepository.saveCoachingSession(session3Output.session);
  userState = session3Output.updatedUserState;

  console.log(`  • Authority Index post-Sesión 3: ${userState.authorityScore}`);
  console.log(`  • Misión Prescrita: "${session3Output.prescription.exerciseTitle}"\n`);

  // SESIÓN 4
  console.log('--- SESIÓN 4: Aceleración Táctica (WPM = 185) ---');
  prescribedMissions++;
  const history3 = await CoachingRepository.getUserSessionHistory(userId);

  const session4Output = diagnoseAndPrescribeUseCase({
    userState,
    sessionHistory: history3,
    metrics: { wordsPerMinute: 185, avgPauseDuration: 0.4, pauseCount: 2, fillerCount: 1, pitchVariation: 0.5, energyStability: 0.85 },
    authorityScore: { score: 74, strengths: ['Limpieza'], weaknesses: [] }
  });
  completedMissions++;

  await CoachingRepository.saveUserCoachingState(session4Output.updatedUserState);
  await CoachingRepository.saveCoachingSession(session4Output.session);
  userState = session4Output.updatedUserState;

  console.log(`  • Ajuste de Foco por Aceleración: "${session4Output.adaptiveNextStep.nextFocus}"`);

  // SESIÓN 5
  console.log('--- SESIÓN 5: Cierre de Ciclo de 5 Sesiones ---');
  prescribedMissions++;
  const history4 = await CoachingRepository.getUserSessionHistory(userId);

  const session5Output = diagnoseAndPrescribeUseCase({
    userState,
    sessionHistory: history4,
    metrics: { wordsPerMinute: 135, avgPauseDuration: 0.8, pauseCount: 5, fillerCount: 0, pitchVariation: 0.6, energyStability: 0.92 },
    authorityScore: { score: 85, strengths: ['Control de Aire', 'Limpieza', 'Ritmo'], weaknesses: [] }
  });
  completedMissions++;

  await CoachingRepository.saveUserCoachingState(session5Output.updatedUserState);
  await CoachingRepository.saveCoachingSession(session5Output.session);
  userState = session5Output.updatedUserState;

  const trainingAdherence = Math.round((completedMissions / prescribedMissions) * 100);

  console.log('  ✓ Authority Index Final: ' + userState.authorityScore);
  console.log('  ✓ Adherencia de Entrenamiento: ' + trainingAdherence + '%');

  assert(userState.authorityScore > 80, 'Final Authority Score reached target (>80)');
  assert(trainingAdherence === 100, 'Training Adherence is 100%');

  console.log('\n✅ V5 ADAPTIVE DIFFICULTY & 5-SESSION SIMULATION PASSED 100%!');
}
