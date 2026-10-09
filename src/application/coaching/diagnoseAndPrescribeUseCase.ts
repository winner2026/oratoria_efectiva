import { buildDiagnosticProfile, DiagnosticProfile } from '@/domain/coaching/DiagnosticProfile';
import { buildCommunicationProfile, CommunicationProfile } from '@/domain/coaching/CommunicationProfile';
import { prescribeTraining, TrainingPrescription } from '@/domain/coaching/TrainingPrescription';
import { evaluateProgress, ProgressEvaluation } from '@/domain/coaching/ProgressEvaluation';
import { UserCoachingState, updateCoachingStateWithDiagnostic } from '@/domain/coaching/TrainingPlan';
import { createCoachingSession, CoachingSession } from '@/domain/coaching/CoachingSession';
import { determineAdaptiveNextStep, AdaptiveNextStep } from '@/domain/coaching/AdaptiveTrainingEngine';

export type DiagnoseAndPrescribeInput = {
  userState: UserCoachingState;
  sessionHistory?: CoachingSession[];
  metrics: {
    wordsPerMinute: number;
    avgPauseDuration: number;
    pauseCount: number;
    fillerCount: number;
    pitchVariation: number | null;
    energyStability: number | null;
  };
  authorityScore: {
    score: number;
    strengths: string[];
    weaknesses: string[];
  };
};

export type DiagnoseAndPrescribeOutput = {
  session: CoachingSession;
  updatedUserState: UserCoachingState;
  communicationProfile: CommunicationProfile;
  diagnosticProfile: DiagnosticProfile;
  prescription: TrainingPrescription;
  progressEvaluation: ProgressEvaluation;
  adaptiveNextStep: AdaptiveNextStep;
};

export function diagnoseAndPrescribeUseCase(input: DiagnoseAndPrescribeInput): DiagnoseAndPrescribeOutput {
  // 1. Perfil multidimensional de comunicación y detección de cuello de botella
  const communicationProfile = buildCommunicationProfile(input.metrics);

  // 2. Decoupled Diagnostic Engine (Perfil de diagnóstico con explicabilidad conductual)
  const diagnosticProfile = buildDiagnosticProfile(input.metrics, input.authorityScore);

  // 3. Evaluar el progreso relativo con respecto al estado previo del usuario
  const progressEvaluation = evaluateProgress(
    {
      authorityScore: input.userState.authorityScore,
      currentFocus: input.userState.currentFocus || undefined,
    },
    {
      score: communicationProfile.overallIndex,
      primaryWeaknessType: diagnosticProfile.primaryWeakness?.type,
    }
  );

  // 4. Prescripción personalizada guiada por el cuello de botella
  const prescription = prescribeTraining(diagnosticProfile);

  // 5. Crear la entidad CoachingSession completa
  const session = createCoachingSession({
    userId: input.userState.userId,
    metrics: input.metrics,
    communicationProfile,
    diagnosticProfile,
    prescription,
    previousScore: input.userState.authorityScore,
    currentScore: communicationProfile.overallIndex,
    progress: progressEvaluation,
  });

  // 6. Motor Adaptativo (AdaptiveTrainingEngine): Evaluar el siguiente paso en la ruta de 21 días
  const history = input.sessionHistory || [];
  const fullHistory = [...history, session];
  const adaptiveNextStep = determineAdaptiveNextStep(
    input.userState,
    fullHistory,
    communicationProfile,
    diagnosticProfile
  );

  // 7. Actualizar el estado persistente del usuario (UserCoachingState)
  const updatedUserState = updateCoachingStateWithDiagnostic(
    input.userState,
    diagnosticProfile,
    progressEvaluation
  );
  updatedUserState.curriculumDay = adaptiveNextStep.newCurriculumDay;
  if (adaptiveNextStep.nextFocus) {
    updatedUserState.currentFocus = adaptiveNextStep.nextFocus;
  }

  return {
    session,
    updatedUserState,
    communicationProfile,
    diagnosticProfile,
    prescription,
    progressEvaluation,
    adaptiveNextStep,
  };
}
