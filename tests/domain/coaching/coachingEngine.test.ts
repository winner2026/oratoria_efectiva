import { evaluateWeaknesses } from '../../../src/domain/coaching/Weakness';
import { buildCommunicationProfile } from '../../../src/domain/coaching/CommunicationProfile';
import { buildDiagnosticProfile } from '../../../src/domain/coaching/DiagnosticProfile';
import { prescribeTraining } from '../../../src/domain/coaching/TrainingPrescription';
import { createInitialCoachingState } from '../../../src/domain/coaching/TrainingPlan';
import { diagnoseAndPrescribeUseCase } from '../../../src/application/coaching/diagnoseAndPrescribeUseCase';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

export async function runCoachingEngineV2Tests() {
  console.log('🧪 Running Coaching Engine V2 Verification Tests...\n');

  // Test 1: Desacoplamiento de Velocidad (WPM) vs Pausas (Pause Control)
  console.log('Test 1: Verifying decoupled evaluation of WPM vs Pause Control...');
  const metricsFast = {
    wordsPerMinute: 178,
    avgPauseDuration: 0.2,
    pauseCount: 1,
    fillerCount: 7,
    pitchVariation: 0.12,
    energyStability: 0.61,
  };

  const weaknesses = evaluateWeaknesses(metricsFast);
  const rhythmWeakness = weaknesses.find((w) => w.type === 'RHYTHM');
  const pauseWeakness = weaknesses.find((w) => w.type === 'PAUSE_CONTROL');

  assert(Boolean(rhythmWeakness), 'Rhythm weakness evaluated independently');
  assert(Boolean(pauseWeakness), 'Pause Control weakness evaluated independently');
  console.log(`  ✓ RHYTHM Severity: ${rhythmWeakness?.severity.toFixed(2)} (${rhythmWeakness?.label})`);
  console.log(`  ✓ PAUSE_CONTROL Severity: ${pauseWeakness?.severity.toFixed(2)} (${pauseWeakness?.label})`);

  // Test 2: Perfil Multidimensional y Cálculo de Índice de Autoridad Explicable
  console.log('\nTest 2: Verifying Multi-Dimensional Communication Profile & Explicable Authority Index...');
  const commProfile = buildCommunicationProfile(metricsFast);
  assert(commProfile.overallIndex > 0 && commProfile.overallIndex <= 100, 'Overall Index calculated in 0-100 range');
  assert(Boolean(commProfile.bottleneck), 'Bottleneck detected correctly');

  console.log(`  ✓ Explicable Authority Score Index: ${commProfile.overallIndex}`);
  console.log(`  ✓ Voice Dimension Overall: ${commProfile.voice.overall}`);
  console.log(`  ✓ Fluency Dimension Overall: ${commProfile.fluency.overall}`);
  console.log(`  ✓ Primary Bottleneck Detected: ${commProfile.bottleneck?.label}`);

  // Test 3: Redacción No Juzgadora Basada en Comportamientos Observables
  console.log('\nTest 3: Verifying Non-Judgmental Behavioral Framing...');
  const authorityScore = { score: commProfile.overallIndex, strengths: ['Estructura'], weaknesses: ['Pausas'] };
  const diagProfile = buildDiagnosticProfile(metricsFast, authorityScore);
  assert(diagProfile.behavioralSummary.includes('En esta muestra, detectamos características asociadas'), 'Behavioral non-judgmental phrasing verified');
  console.log(`  ✓ Behavioral Summary: "${diagProfile.behavioralSummary}"`);

  // Test 4: Motor Adaptativo y Transición de Foco (Adaptive Training Engine)
  console.log('\nTest 4: Verifying Adaptive Engine & Multi-Session Focus Transition...');
  const initialState = createInitialCoachingState('user-101');
  initialState.authorityScore = 65;
  initialState.currentFocus = 'Escasez de Pausas Tácticas';
  initialState.curriculumDay = 3;

  const output = diagnoseAndPrescribeUseCase({
    userState: initialState,
    metrics: metricsFast,
    authorityScore,
  });

  assert(Boolean(output.session.id), 'CoachingSession entity created successfully');
  assert(output.adaptiveNextStep.newCurriculumDay >= 3, 'Curriculum Day progressed or maintained');
  console.log(`  ✓ CoachingSession ID: ${output.session.id}`);
  console.log(`  ✓ Adaptive Reasoning: ${output.adaptiveNextStep.reasoning}`);
  console.log(`  ✓ New Curriculum Day: Día ${output.adaptiveNextStep.newCurriculumDay}`);

  console.log('\n✅ ALL COACHING ENGINE V2 TESTS PASSED SUCCESSFULLY!');
}
