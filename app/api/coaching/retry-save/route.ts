import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateVisitorIdServer } from '@/lib/auth/visitorIdentity';
import { VoiceSessionStore } from '@/infrastructure/db/voiceSessionStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { analysisData } = body;
    const { visitorId } = await getOrCreateVisitorIdServer();

    if (!analysisData) {
      return NextResponse.json({ error: 'Datos de análisis ausentes' }, { status: 400 });
    }

    const metrics = analysisData.metrics || {};
    const authorityScore = analysisData.authorityScore || {};
    const coaching = analysisData.coaching || {};

    const saveResult = await VoiceSessionStore.createSession({
      userId: visitorId,
      transcription: analysisData.transcription || "Análisis bioacústico de señal",
      transcriptionWithSilences: analysisData.transcriptionWithSilences || "[Audio analizado]",
      wordsPerMinute: metrics.wordsPerMinute || 120,
      avgPauseDuration: metrics.avgPauseDuration || 0.8,
      pauseCount: metrics.pauseCount || 2,
      fillerCount: metrics.fillerCount || 1,
      pitchVariation: metrics.pitchVariation || 0.5,
      energyStability: metrics.energyStability || 0.8,
      durationSeconds: analysisData.durationSeconds || 15,
      authorityLevel: authorityScore.level || "MEDIUM",
      authorityScore: authorityScore.score || 64,
      strengths: authorityScore.strengths || [],
      weaknesses: authorityScore.weaknesses || [],
      priorityAdjustment: authorityScore.priorityAdjustment || "PAUSE_MORE",
      feedbackDiagnostico: coaching.diagnosticProfile?.behavioralSummary || "Análisis guardado correctamente.",
      feedbackLoQueSuma: analysisData.feedback?.lo_que_suma || ["Presión constante"],
      feedbackLoQueResta: analysisData.feedback?.lo_que_resta || [],
      feedbackDecision: analysisData.feedback?.decision || "Entrena tus pausas de autoridad.",
      feedbackPayoff: analysisData.feedback?.payoff || "Ganarás proyección de autoridad.",
    });

    return NextResponse.json({
      success: saveResult.persisted,
      persisted: saveResult.persisted,
      databaseSessionId: saveResult.databaseSessionId,
    });
  } catch (error: any) {
    console.error('Error reintentando guardar sesión:', error);
    return NextResponse.json({
      success: false,
      persisted: false,
      error: 'La base de datos no está disponible actualmente.',
    }, { status: 500 });
  }
}
