import { getCoachingDashboard } from '../../src/application/coaching/getCoachingDashboard';
import { diagnoseAndPrescribeUseCase } from '../../src/application/coaching/diagnoseAndPrescribeUseCase';
import { CoachingRepository } from '../../src/infrastructure/db/repositories/coachingRepository';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

export async function runDashboardIntegrationTest() {
  console.log('🧪 Running V4 Coach Home Dashboard Integration Test...\n');

  const userId = 'user-v4-test';

  console.log('Step 1: Fetching initial Coach Home Dashboard...');
  const initialDashboard = await getCoachingDashboard(userId);
  assert(initialDashboard.authorityIndex === 50, 'Initial Authority Index is 50');
  assert(Boolean(initialDashboard.todayMission.title), 'Today mission title exists');
  console.log(`  ✓ Initial Authority Index: ${initialDashboard.authorityIndex}`);
  console.log(`  ✓ Today Mission: "${initialDashboard.todayMission.title}" (${initialDashboard.todayMission.durationMinutes} min, Nivel ${initialDashboard.todayMission.level})`);

  console.log('\nStep 2: Simulating Session 1 (Fast WPM = 178, Fillers = 7)...');
  const userState1 = await CoachingRepository.getUserCoachingState(userId);
  const output1 = diagnoseAndPrescribeUseCase({
    userState: userState1,
    sessionHistory: [],
    metrics: {
      wordsPerMinute: 178,
      avgPauseDuration: 0.2,
      pauseCount: 1,
      fillerCount: 7,
      pitchVariation: 0.12,
      energyStability: 0.61,
    },
    authorityScore: { score: 50, strengths: [], weaknesses: [] },
  });

  await CoachingRepository.saveUserCoachingState(output1.updatedUserState);
  await CoachingRepository.saveCoachingSession(output1.session);

  console.log('\nStep 3: Fetching updated Coach Home Dashboard post-Session 1...');
  const dashboard1 = await getCoachingDashboard(userId);
  assert(dashboard1.currentFocus.title.length > 0, 'Current focus populated');
  console.log(`  ✓ Authority Index: ${dashboard1.authorityIndex}`);
  console.log(`  ✓ Current Focus (Focus Lock): "${dashboard1.currentFocus.title}"`);
  console.log(`  ✓ Recommended Mission: "${dashboard1.todayMission.title}" (${dashboard1.todayMission.customRoute})`);

  console.log('\nStep 4: Simulating Session 2 (Improved stability & pauses)...');
  const userState2 = await CoachingRepository.getUserCoachingState(userId);
  const sessionHistory2 = await CoachingRepository.getUserSessionHistory(userId);

  const output2 = diagnoseAndPrescribeUseCase({
    userState: userState2,
    sessionHistory: sessionHistory2,
    metrics: {
      wordsPerMinute: 140,
      avgPauseDuration: 0.7,
      pauseCount: 4,
      fillerCount: 1,
      pitchVariation: 0.45,
      energyStability: 0.85,
    },
    authorityScore: { score: 72, strengths: ['Estabilidad'], weaknesses: [] },
  });

  await CoachingRepository.saveUserCoachingState(output2.updatedUserState);
  await CoachingRepository.saveCoachingSession(output2.session);

  console.log('\nStep 5: Fetching final Coach Home Dashboard post-Session 2...');
  const finalDashboard = await getCoachingDashboard(userId);
  assert(finalDashboard.authorityIndex > dashboard1.authorityIndex, 'Authority Index increased after successful session');

  console.log(`  ✓ Final Authority Index: ${finalDashboard.authorityIndex} (↑ +${finalDashboard.scoreDelta} esta semana)`);
  console.log(`  ✓ Active Focus: "${finalDashboard.currentFocus.title}"`);
  console.log(`  ✓ Today Mission: "${finalDashboard.todayMission.title}" (${finalDashboard.todayMission.durationMinutes} min)`);
  console.log(`  ✓ Curriculum Progression: Día ${finalDashboard.progress.currentDay} / ${finalDashboard.progress.totalDays}`);

  console.log('\n✅ ALL V4 COACH HOME DASHBOARD INTEGRATION TESTS PASSED SUCCESSFULLY!');
}
