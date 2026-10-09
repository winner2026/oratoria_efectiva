import { prisma } from '@/infrastructure/db/client';
import { PGlite } from '@electric-sql/pglite';
import path from 'path';
import fs from 'fs';

let pgliteInstance: PGlite | null = null;

async function getPglite(): Promise<PGlite> {
  if (!pgliteInstance) {
    const dataDir = path.join(process.cwd(), '.pglite_data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    pgliteInstance = new PGlite(dataDir);
    
    // Ensure table structure exists
    await pgliteInstance.exec(`
      CREATE TABLE IF NOT EXISTS voice_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        transcription TEXT NOT NULL,
        transcription_with_silences TEXT NOT NULL,
        words_per_minute INT NOT NULL,
        avg_pause_duration NUMERIC(5, 2) NOT NULL,
        pause_count INT NOT NULL,
        filler_count INT NOT NULL,
        pitch_variation NUMERIC(5, 2),
        energy_stability NUMERIC(5, 2),
        duration_seconds NUMERIC(6, 2) NOT NULL,
        authority_level TEXT NOT NULL,
        authority_score INT NOT NULL,
        strengths JSONB NOT NULL,
        weaknesses JSONB NOT NULL,
        priority_adjustment TEXT NOT NULL,
        feedback_diagnostico TEXT NOT NULL,
        feedback_lo_que_suma JSONB NOT NULL,
        feedback_lo_que_resta JSONB NOT NULL,
        feedback_decision TEXT NOT NULL,
        feedback_payoff TEXT NOT NULL
      );
    `);
  }
  return pgliteInstance;
}

export interface CreateVoiceSessionInput {
  userId: string;
  transcription: string;
  transcriptionWithSilences: string;
  wordsPerMinute: number;
  avgPauseDuration: number;
  pauseCount: number;
  fillerCount: number;
  pitchVariation: number | null;
  energyStability: number | null;
  durationSeconds: number;
  authorityLevel: string;
  authorityScore: number;
  strengths: string[];
  weaknesses: string[];
  priorityAdjustment: string;
  feedbackDiagnostico: string;
  feedbackLoQueSuma: string[];
  feedbackLoQueResta: string[];
  feedbackDecision: string;
  feedbackPayoff: string;
  // Simulated failure flag for retry verification testing
  simulateDbFailure?: boolean;
}

export class VoiceSessionStore {
  /**
   * Persiste una sesión en PostgreSQL (vía Prisma o PGLite fallback)
   */
  static async createSession(input: CreateVoiceSessionInput): Promise<{
    persisted: boolean;
    databaseSessionId: string | null;
    engine: 'prisma' | 'pglite' | 'none';
  }> {
    if (input.simulateDbFailure) {
      console.warn('[VoiceSessionStore] Simulated DB failure triggered for retry testing.');
      return { persisted: false, databaseSessionId: null, engine: 'none' };
    }

    // 1. Intentar con Prisma PostgreSQL
    try {
      const dbSession = await prisma.voiceSession.create({
        data: {
          userId: input.userId,
          transcription: input.transcription,
          transcriptionWithSilences: input.transcriptionWithSilences,
          wordsPerMinute: input.wordsPerMinute,
          avgPauseDuration: input.avgPauseDuration,
          pauseCount: input.pauseCount,
          fillerCount: input.fillerCount,
          pitchVariation: input.pitchVariation,
          energyStability: input.energyStability,
          durationSeconds: input.durationSeconds,
          authorityLevel: input.authorityLevel,
          authorityScore: input.authorityScore,
          strengths: input.strengths,
          weaknesses: input.weaknesses,
          priorityAdjustment: input.priorityAdjustment,
          feedbackDiagnostico: input.feedbackDiagnostico,
          feedbackLoQueSuma: input.feedbackLoQueSuma,
          feedbackLoQueResta: input.feedbackLoQueResta,
          feedbackDecision: input.feedbackDecision,
          feedbackPayoff: input.feedbackPayoff,
        }
      });
      return { persisted: true, databaseSessionId: dbSession.id, engine: 'prisma' };
    } catch (prismaErr) {
      console.warn('[VoiceSessionStore] Prisma PostgreSQL unavailable. Falling back to PGLite persistent store...');
    }

    // 2. Fallback a PGLite en disco (.pglite_data)
    try {
      const pglite = await getPglite();
      const res = await pglite.query<{ id: string }>(`
        INSERT INTO voice_sessions (
          user_id, transcription, transcription_with_silences, words_per_minute,
          avg_pause_duration, pause_count, filler_count, pitch_variation, energy_stability,
          duration_seconds, authority_level, authority_score, strengths, weaknesses,
          priority_adjustment, feedback_diagnostico, feedback_lo_que_suma, feedback_lo_que_resta,
          feedback_decision, feedback_payoff
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        ) RETURNING id;
      `, [
        input.userId,
        input.transcription,
        input.transcriptionWithSilences,
        input.wordsPerMinute,
        input.avgPauseDuration,
        input.pauseCount,
        input.fillerCount,
        input.pitchVariation,
        input.energyStability,
        input.durationSeconds,
        input.authorityLevel,
        input.authorityScore,
        JSON.stringify(input.strengths),
        JSON.stringify(input.weaknesses),
        input.priorityAdjustment,
        input.feedbackDiagnostico,
        JSON.stringify(input.feedbackLoQueSuma),
        JSON.stringify(input.feedbackLoQueResta),
        input.feedbackDecision,
        input.feedbackPayoff
      ]);

      const id = res.rows[0]?.id || 'pglite-' + Date.now();
      return { persisted: true, databaseSessionId: id, engine: 'pglite' };
    } catch (pgliteErr) {
      console.error('[VoiceSessionStore] PGLite error:', pgliteErr);
      return { persisted: false, databaseSessionId: null, engine: 'none' };
    }
  }

  /**
   * Obtiene el historial de sesiones aisladas por visitorId
   */
  static async getSessionsByVisitor(visitorId: string): Promise<any[]> {
    // 1. Intentar consultar Prisma
    try {
      const sessions = await prisma.voiceSession.findMany({
        where: { userId: visitorId },
        orderBy: { createdAt: 'desc' },
        take: 15
      });
      if (sessions.length > 0) {
        return sessions.map(s => ({
          ...s,
          avgPauseDuration: Number(s.avgPauseDuration),
          pitchVariation: Number(s.pitchVariation),
          energyStability: Number(s.energyStability),
          durationSeconds: Number(s.durationSeconds),
          createdAt: s.createdAt.toISOString()
        }));
      }
    } catch (err) {
      // Prisma error fallback to PGLite
    }

    // 2. Consultar PGLite
    try {
      const pglite = await getPglite();
      const res = await pglite.query<any>(`
        SELECT * FROM voice_sessions 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT 15;
      `, [visitorId]);

      return res.rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        createdAt: new Date(r.created_at).toISOString(),
        transcription: r.transcription,
        transcriptionWithSilences: r.transcription_with_silences,
        wordsPerMinute: r.words_per_minute,
        avgPauseDuration: Number(r.avg_pause_duration),
        pauseCount: r.pause_count,
        fillerCount: r.filler_count,
        pitchVariation: Number(r.pitch_variation),
        energyStability: Number(r.energy_stability),
        durationSeconds: Number(r.duration_seconds),
        authorityLevel: r.authority_level,
        authorityScore: r.authority_score,
        strengths: typeof r.strengths === 'string' ? JSON.parse(r.strengths) : r.strengths,
        weaknesses: typeof r.weaknesses === 'string' ? JSON.parse(r.weaknesses) : r.weaknesses,
        priorityAdjustment: r.priority_adjustment,
        feedbackDiagnostico: r.feedback_diagnostico,
        feedbackLoQueSuma: typeof r.feedback_lo_que_suma === 'string' ? JSON.parse(r.feedback_lo_que_suma) : r.feedback_lo_que_suma,
        feedbackLoQueResta: typeof r.feedback_lo_que_resta === 'string' ? JSON.parse(r.feedback_lo_que_resta) : r.feedback_lo_que_resta,
        feedbackDecision: r.feedback_decision,
        feedbackPayoff: r.feedback_payoff
      }));
    } catch (err) {
      console.error('[VoiceSessionStore] Error querying PGLite sessions:', err);
      return [];
    }
  }

  /**
   * Obtiene la sesión más reciente de un usuario
   */
  static async getLatestSession(visitorId: string): Promise<any | null> {
    const sessions = await this.getSessionsByVisitor(visitorId);
    return sessions.length > 0 ? sessions[0] : null;
  }
}
