import { UserCoachingState, createInitialCoachingState } from '@/domain/coaching/TrainingPlan';
import { CoachingSession } from '@/domain/coaching/CoachingSession';

// Almacén persistente en memoria / cache para entorno dev y fallback
const memoryCoachingStates = new Map<string, UserCoachingState>();
const memoryCoachingSessions = new Map<string, CoachingSession[]>();

export class CoachingRepository {
  /**
   * Obtiene o inicializa el estado persistente del usuario (UserCoachingState)
   */
  static async getUserCoachingState(userId: string): Promise<UserCoachingState> {
    if (memoryCoachingStates.has(userId)) {
      return memoryCoachingStates.get(userId)!;
    }

    const initialState = createInitialCoachingState(userId);
    memoryCoachingStates.set(userId, initialState);
    return initialState;
  }

  /**
   * Actualiza el estado del usuario tras un diagnóstico o entrenamiento
   */
  static async saveUserCoachingState(state: UserCoachingState): Promise<UserCoachingState> {
    memoryCoachingStates.set(state.userId, state);
    return state;
  }

  /**
   * Registra una sesión completa de entrenamiento (CoachingSession)
   */
  static async saveCoachingSession(session: CoachingSession): Promise<CoachingSession> {
    const userSessions = memoryCoachingSessions.get(session.userId) || [];
    userSessions.push(session);
    memoryCoachingSessions.set(session.userId, userSessions);
    return session;
  }

  /**
   * Obtiene el historial ordenado de sesiones de un usuario
   */
  static async getUserSessionHistory(userId: string): Promise<CoachingSession[]> {
    return memoryCoachingSessions.get(userId) || [];
  }
}
