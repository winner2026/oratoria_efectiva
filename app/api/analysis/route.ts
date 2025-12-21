export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';

// MODO MOCK: Para probar el flujo sin OpenAI
const USE_MOCK = !process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;

    console.log('[ANALYSIS] Received request');

    if (!audioFile) {
      console.log('[ANALYSIS] ❌ No audio file received');
      return NextResponse.json(
        { error: 'No se recibió audio' },
        { status: 400 }
      );
    }

    console.log('[ANALYSIS] ✓ Audio file:', audioFile.name, audioFile.size, 'bytes');

    if (audioFile.size === 0) {
      console.log('[ANALYSIS] ❌ Audio file is empty');
      return NextResponse.json(
        { error: 'Audio vacío' },
        { status: 400 }
      );
    }

    // Si no hay API key de OpenAI, usar respuesta mock
    if (USE_MOCK) {
      console.log('[ANALYSIS] ⚠️  Usando respuesta MOCK (no hay OPENAI_API_KEY)');

      return NextResponse.json({
        success: true,
        data: {
          transcription: "Este es un análisis de prueba. Configura OPENAI_API_KEY en .env.local para obtener análisis reales.",
          authorityScore: {
            level: "MEDIUM",
            score: 65,
            strengths: ["Ritmo estable", "Buena claridad"],
            weaknesses: ["Cierre débil de frases"],
            priorityAdjustment: "PAUSE_MORE"
          },
          diagnosis: "Tu voz transmite autoridad media, pero genera dudas en momentos clave.",
          strengths: ["Ritmo estable y no suenas apurado", "Se te entiende con claridad"],
          weaknesses: ["El cierre de tus frases no transmite decisión"],
          decision: "En tu próxima intervención, marca el final con un tono descendente.",
          payoff: "Si corriges esto, tu voz se va a percibir más firme en reuniones.",
          metrics: {
            wordsPerMinute: 120,
            avgPauseDuration: 0.5,
            pauseCount: 8,
            pitchVariation: 0.2,
            energyStability: 0.6
          },
          durationBytes: audioFile.size
        }
      });
    }

    // Análisis real con OpenAI (solo si hay API key)
    console.log('[ANALYSIS] 🔄 Starting real analysis...');

    const { analyzeVoiceUseCase } = await import('@/application/analyzeVoice/analyzeVoiceUseCase');
    const { getOrCreateAnonymousUser } = await import('@/application/users/getOrCreateAnonymousUser');
    const { saveVoiceSession } = await import('@/application/tracking/saveVoiceSession');

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    console.log('[ANALYSIS] Analyzing voice...');
    const result = await analyzeVoiceUseCase({
      audioBuffer,
      userId: undefined,
    });

    console.log('[ANALYSIS] Getting user...');
    const userId = await getOrCreateAnonymousUser();

    console.log('[ANALYSIS] Saving session...');
    await saveVoiceSession(userId, result.authorityScore.level);

    console.log('[ANALYSIS] ✓ Analysis complete!');
    return NextResponse.json({
      success: true,
      data: {
        transcription: result.transcription,
        transcriptionWithSilences: result.transcriptionWithSilences,
        authorityScore: result.authorityScore,
        metrics: result.metrics,
        durationSeconds: result.durationSeconds,
        // Mapear el feedback dinámico al formato esperado por el frontend
        diagnosis: result.feedback.diagnostico,
        strengths: result.feedback.lo_que_suma,
        weaknesses: result.feedback.lo_que_resta,
        decision: result.feedback.decision,
        payoff: result.feedback.payoff,
      },
    });
  } catch (error) {
    console.error('[ANALYSIS] ❌ Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
