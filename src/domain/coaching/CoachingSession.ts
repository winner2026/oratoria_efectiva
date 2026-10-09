import { CommunicationProfile } from './CommunicationProfile';
import { DiagnosticProfile } from './DiagnosticProfile';
import { TrainingPrescription } from './TrainingPrescription';
import { ProgressEvaluation } from './ProgressEvaluation';

export type CoachingSession = {
  id: string;
  userId: string;
  createdAt: string;

  // Datos brutos de análisis
  metrics: {
    wordsPerMinute: number;
    avgPauseDuration: number;
    pauseCount: number;
    fillerCount: number;
    pitchVariation: number;
    energyStability: number;
  };

  // Perfil multidimensional y diagnóstico
  communicationProfile: CommunicationProfile;
  diagnosticProfile: DiagnosticProfile;

  // Prescripción y ejercicio asociado
  prescription: TrainingPrescription;
  exerciseId: string;

  // Evolución y score comparativo
  previousScore?: number;
  currentScore: number;
  progress?: ProgressEvaluation;
};

export function createCoachingSession(params: {
  id?: string;
  userId: string;
  metrics: {
    wordsPerMinute: number;
    avgPauseDuration: number;
    pauseCount: number;
    fillerCount: number;
    pitchVariation: number;
    energyStability: number;
  };
  communicationProfile: CommunicationProfile;
  diagnosticProfile: DiagnosticProfile;
  prescription: TrainingPrescription;
  previousScore?: number;
  currentScore: number;
  progress?: ProgressEvaluation;
}): CoachingSession {
  return {
    id: params.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    userId: params.userId,
    createdAt: new Date().toISOString(),
    metrics: params.metrics,
    communicationProfile: params.communicationProfile,
    diagnosticProfile: params.diagnosticProfile,
    prescription: params.prescription,
    exerciseId: params.prescription.targetExerciseId,
    previousScore: params.previousScore,
    currentScore: params.currentScore,
    progress: params.progress,
  };
}
