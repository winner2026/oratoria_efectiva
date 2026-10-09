import { runCoachingEngineV2Tests } from '../tests/domain/coaching/coachingEngine.test';
import { run5SessionAdaptiveSimulation } from '../tests/domain/coaching/adaptiveProgression5Sessions.test';
import { runPerformanceAndFunnelTests } from '../tests/domain/coaching/performanceEvaluatorAndFunnel.test';
import { runV62ExperimentSimulation } from '../tests/domain/coaching/v62RealUserExperiment.test';
import { runV6FunnelAndTtvTest } from '../tests/domain/coaching/v6FunnelAndTtvAnalytics.test';
import { runDashboardIntegrationTest } from '../tests/application/coachingDashboard.test';
import { getCoachingDashboard } from '../src/application/coaching/getCoachingDashboard';

async function verifyAllSystems() {
  console.log('================================================================');
  console.log('🔍 INICIANDO AUDITORÍA REAL DE VERIFICACIÓN TOTAL DEL SISTEMA');
  console.log('================================================================\n');

  let passedSuites = 0;
  let totalSuites = 7;

  try {
    // Suite 1: Motor de Coaching v2 (Desacoplamiento)
    console.log('--- SUITE 1: Coaching Engine v2 ---');
    await runCoachingEngineV2Tests();
    passedSuites++;
    console.log('✓ Suite 1 completada con éxito.\n');

    // Suite 2: Simulación Adaptativa de 5 Sesiones (Dificultad N1-N5)
    console.log('--- SUITE 2: 5-Session Adaptive Simulation ---');
    await run5SessionAdaptiveSimulation();
    passedSuites++;
    console.log('✓ Suite 2 completada con éxito.\n');

    // Suite 3: Evaluador Direccional & Funnel
    console.log('--- SUITE 3: PerformanceEvaluator & Funnel ---');
    runPerformanceAndFunnelTests();
    passedSuites++;
    console.log('✓ Suite 3 completada con éxito.\n');

    // Suite 4: Experimento V6.2 & Atribución
    console.log('--- SUITE 4: V6.2 Statistical Experiment ---');
    runV62ExperimentSimulation();
    passedSuites++;
    console.log('✓ Suite 4 completada con éxito.\n');

    // Suite 5: Analítica V6 & TTV1/TTV2/TTV3
    console.log('--- SUITE 5: V6 Funnel & TTV Analytics ---');
    runV6FunnelAndTtvTest();
    passedSuites++;
    console.log('✓ Suite 5 completada con éxito.\n');

    // Suite 6: Coach Home Dashboard (/listen integration)
    console.log('--- SUITE 6: V4 Coach Home Dashboard Integration ---');
    await runDashboardIntegrationTest();
    passedSuites++;
    console.log('✓ Suite 6 completada con éxito.\n');

    // Suite 7: Verificación Directa del Caso de Uso del Dashboard
    console.log('--- SUITE 7: Direct ViewModel Verification ---');
    const vm = await getCoachingDashboard('system-verification-user');
    if (typeof vm.authorityIndex !== 'number' || !vm.todayMission.title || !vm.currentFocus.title) {
      throw new Error('ViewModel output invalid');
    }
    console.log(`  ✓ Authority Index: ${vm.authorityIndex}`);
    console.log(`  ✓ Current Focus: "${vm.currentFocus.title}"`);
    console.log(`  ✓ Today Mission: "${vm.todayMission.title}" (${vm.todayMission.customRoute})`);
    passedSuites++;
    console.log('✓ Suite 7 completada con éxito.\n');

    console.log('================================================================');
    console.log(`🏆 VERIFICACIÓN TOTAL EXITOSA: ${passedSuites}/${totalSuites} SUITES APROBADAS (100%)`);
    console.log('================================================================');

  } catch (error: any) {
    console.error('❌ ERROR DURANTE LA AUDITORÍA DEL SISTEMA:', error);
    process.exit(1);
  }
}

verifyAllSystems();
