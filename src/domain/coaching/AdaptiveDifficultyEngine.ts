import { WeaknessType } from './Weakness';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type PerformanceTier = 'SCALE_UP' | 'MAINTAIN' | 'SCALE_DOWN';

export type ExerciseDifficultySpec = {
  level: DifficultyLevel;
  durationSeconds: number;
  maxAllowedFillers: number;
  minPauseCount: number;
  targetWpmMin: number;
  targetWpmMax: number;
  hasUnexpectedPrompt: boolean;
  hasTimePressure: boolean;
  description: string;
};

export type DifficultyAdjustmentResult = {
  previousLevel: DifficultyLevel;
  newLevel: DifficultyLevel;
  tier: PerformanceTier;
  performanceScore: number; // 0.0 a 1.0 (0% a 100%)
  reasoning: string;
  spec: ExerciseDifficultySpec;
};

// Generador de especificación técnica de dificultad por nivel 1..5
export function getExerciseDifficultySpec(exerciseId: string, level: DifficultyLevel): ExerciseDifficultySpec {
  const baseDuration = 30 + (level - 1) * 15; // 30s, 45s, 60s, 75s, 90s

  switch (exerciseId) {
    case 'filler-killer':
      return {
        level,
        durationSeconds: Math.min(90, baseDuration),
        maxAllowedFillers: Math.max(1, 4 - level), // N1: 3, N2: 2, N3: 1, N4: 1, N5: 0
        minPauseCount: 2,
        targetWpmMin: 110,
        targetWpmMax: 160,
        hasUnexpectedPrompt: level >= 4,
        hasTimePressure: level === 5,
        description: `Duración ${Math.min(90, baseDuration)}s · Máx. ${Math.max(1, 4 - level)} muletilla(s)${level >= 4 ? ' · Pregunta inesperada' : ''}${level === 5 ? ' + Presión temporal' : ''}`,
      };

    case 'authority-pause':
    default:
      return {
        level,
        durationSeconds: Math.min(90, baseDuration),
        maxAllowedFillers: 2,
        minPauseCount: level + 1, // N1: 2, N2: 3, N3: 4, N4: 5, N5: 6
        targetWpmMin: 120,
        targetWpmMax: 150,
        hasUnexpectedPrompt: level >= 4,
        hasTimePressure: level === 5,
        description: `Duración ${Math.min(90, baseDuration)}s · ${level + 1} pausas tácticas de 3s${level >= 4 ? ' · Durante improvisación' : ''}${level === 5 ? ' bajo presión' : ''}`,
      };
  }
}

export function evaluatePerformanceAndAdjustDifficulty(
  currentLevel: DifficultyLevel,
  performanceRatio: number // 0.0 a 1.0 (ej. 0.95 = 95% de éxito en misión)
): DifficultyAdjustmentResult {
  let tier: PerformanceTier = 'MAINTAIN';
  let newLevel: DifficultyLevel = currentLevel;
  let reasoning = '';

  if (performanceRatio > 0.88 && currentLevel < 5) {
    tier = 'SCALE_UP';
    newLevel = (currentLevel + 1) as DifficultyLevel;
    reasoning = `🔥 ¡Excelente desempeño (${Math.round(performanceRatio * 100)}%)! Escalamos la dificultad al Nivel ${newLevel}.`;
  } else if (performanceRatio < 0.65 && currentLevel > 1) {
    tier = 'SCALE_DOWN';
    newLevel = (currentLevel - 1) as DifficultyLevel;
    reasoning = `💡 Rendimiento por debajo del objetivo (${Math.round(performanceRatio * 100)}%). Reducimos la dificultad a Nivel ${newLevel} para consolidar la base.`;
  } else {
    tier = 'MAINTAIN';
    newLevel = currentLevel;
    reasoning = `👍 Rendimiento sólido (${Math.round(performanceRatio * 100)}%). Mantenemos Nivel ${currentLevel} para afianzar el hábito.`;
  }

  return {
    previousLevel: currentLevel,
    newLevel,
    tier,
    performanceScore: Math.round(performanceRatio * 100),
    reasoning,
    spec: getExerciseDifficultySpec('authority-pause', newLevel),
  };
}
