import { DiagnosticProfile } from './DiagnosticProfile';
import { TrainingPrescription, prescribeTraining } from './TrainingPrescription';
import { ProgressEvaluation } from './ProgressEvaluation';

export type UserCoachingState = {
  userId: string;
  authorityScore: number;
  scoreHistory: { score: number; timestamp: string }[];
  currentFocus: string | null;
  curriculumDay: number; // 1 a 21 (Metodología "Sin Miedo a Hablar")
  lastDiagnostic: DiagnosticProfile | null;
  activePrescription: TrainingPrescription | null;
  lastProgressEvaluation: ProgressEvaluation | null;
  updatedAt: string;
};

export function createInitialCoachingState(userId: string): UserCoachingState {
  return {
    userId,
    authorityScore: 50, // Base neutra inicial
    scoreHistory: [{ score: 50, timestamp: new Date().toISOString() }],
    currentFocus: null,
    curriculumDay: 1,
    lastDiagnostic: null,
    activePrescription: null,
    lastProgressEvaluation: null,
    updatedAt: new Date().toISOString(),
  };
}

export function updateCoachingStateWithDiagnostic(
  currentState: UserCoachingState,
  diagnostic: DiagnosticProfile,
  evaluation: ProgressEvaluation
): UserCoachingState {
  const prescription = prescribeTraining(diagnostic);
  const newFocus = diagnostic.primaryWeakness ? diagnostic.primaryWeakness.label : currentState.currentFocus;

  return {
    ...currentState,
    authorityScore: diagnostic.overallHealthScore,
    scoreHistory: [
      ...currentState.scoreHistory,
      { score: diagnostic.overallHealthScore, timestamp: new Date().toISOString() },
    ],
    currentFocus: newFocus,
    lastDiagnostic: diagnostic,
    activePrescription: prescription,
    lastProgressEvaluation: evaluation,
    updatedAt: new Date().toISOString(),
  };
}
