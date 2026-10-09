import { UserCoachingState, createInitialCoachingState } from '@/domain/coaching/TrainingPlan';
import { CoachingSession } from '@/domain/coaching/CoachingSession';
import { prisma } from '@/infrastructure/db/client';

const memoryCoachingStates = new Map<string, UserCoachingState>();
const memoryCoachingSessions = new Map<string, CoachingSession[]>();

function toJsonValue(value: unknown): any {
  return JSON.parse(JSON.stringify(value));
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export class CoachingRepository {
  /** Lee el estado durable del visitante; memoria solo es fallback local de desarrollo. */
  static async getUserCoachingState(userId: string): Promise<UserCoachingState> {
    try {
      const existing = await prisma.visitorCoachingState.findUnique({
        where: { visitorId: userId },
      });

      if (existing) {
        const state = existing.state as unknown as UserCoachingState;
        memoryCoachingStates.set(userId, state);
        return state;
      }

      const initialState = createInitialCoachingState(userId);
      const stored = await prisma.visitorCoachingState.upsert({
        where: { visitorId: userId },
        create: { visitorId: userId, state: toJsonValue(initialState) },
        update: { visitorId: userId },
      });
      const state = stored.state as unknown as UserCoachingState;
      memoryCoachingStates.set(userId, state);
      return state;
    } catch (error) {
      console.error('[CoachingRepository] Failed to load visitor state from PostgreSQL.', error);
      if (isProduction()) throw new Error('COACHING_STATE_LOAD_FAILED');

      const cached = memoryCoachingStates.get(userId);
      if (cached) return cached;
      const initialState = createInitialCoachingState(userId);
      memoryCoachingStates.set(userId, initialState);
      return initialState;
    }
  }

  /** Guarda el estado; en producción un fallo no se disfraza como persistencia correcta. */
  static async saveUserCoachingState(state: UserCoachingState): Promise<UserCoachingState> {
    try {
      const stored = await prisma.visitorCoachingState.upsert({
        where: { visitorId: state.userId },
        create: { visitorId: state.userId, state: toJsonValue(state) },
        update: { state: toJsonValue(state) },
      });
      const persistedState = stored.state as unknown as UserCoachingState;
      memoryCoachingStates.set(state.userId, persistedState);
      return persistedState;
    } catch (error) {
      console.error('[CoachingRepository] Failed to persist visitor state.', error);
      if (isProduction()) throw new Error('COACHING_STATE_PERSISTENCE_FAILED');
      memoryCoachingStates.set(state.userId, state);
      return state;
    }
  }

  /** Persiste cada sesión adaptativa para que el historial sobreviva a reinicios/serverless. */
  static async saveCoachingSession(session: CoachingSession): Promise<CoachingSession> {
    try {
      await prisma.coachingRecord.upsert({
        where: { id: session.id },
        create: {
          id: session.id,
          visitorId: session.userId,
          createdAt: new Date(session.createdAt),
          payload: toJsonValue(session),
        },
        update: { payload: toJsonValue(session) },
      });

      const userSessions = memoryCoachingSessions.get(session.userId) || [];
      const existingIndex = userSessions.findIndex((item) => item.id === session.id);
      if (existingIndex >= 0) userSessions[existingIndex] = session;
      else userSessions.push(session);
      memoryCoachingSessions.set(session.userId, userSessions);
      return session;
    } catch (error) {
      console.error('[CoachingRepository] Failed to persist coaching session.', error);
      if (isProduction()) throw new Error('COACHING_SESSION_PERSISTENCE_FAILED');
      const userSessions = memoryCoachingSessions.get(session.userId) || [];
      userSessions.push(session);
      memoryCoachingSessions.set(session.userId, userSessions);
      return session;
    }
  }

  /** Devuelve hasta 15 sesiones en orden cronológico para que el motor adaptativo lea el historial. */
  static async getUserSessionHistory(userId: string): Promise<CoachingSession[]> {
    try {
      const records = await prisma.coachingRecord.findMany({
        where: { visitorId: userId },
        orderBy: { createdAt: 'desc' },
        take: 15,
      });
      const sessions = records
        .map((record) => record.payload as unknown as CoachingSession)
        .reverse();
      memoryCoachingSessions.set(userId, sessions);
      return sessions;
    } catch (error) {
      console.error('[CoachingRepository] Failed to load coaching history.', error);
      if (isProduction()) throw new Error('COACHING_HISTORY_LOAD_FAILED');
      return memoryCoachingSessions.get(userId) || [];
    }
  }
}
