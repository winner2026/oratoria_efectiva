export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { getUserPlan } from '@/lib/usage/getUserPlan';
import { checkFreeUsage } from '@/lib/usage/checkFreeUsage';
import { incrementUsage } from '@/lib/usage/incrementUsage';
import { db } from '@/infrastructure/db/client';
import {
  generateFingerprint,
  getClientIP,
  normalizeUserAgent,
} from '@/lib/fingerprint/generateFingerprint';

// MODO MOCK: Para probar el flujo sin OpenAI
const USE_MOCK = !process.env.OPENAI_API_KEY;

// ⏱️ LÍMITE DE DURACIÓN (control de costos MVP)
const MAX_AUDIO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB máximo

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const userId = formData.get('userId') as string | null;

    console.log('[ANALYSIS] Received request');

    if (!audioFile) {
      console.log('[ANALYSIS] ❌ No audio file received');
      return NextResponse.json(
        { error: 'No se recibió audio' },
        { status: 400 }
      );
    }

    // 🔐 GENERAR FINGERPRINT ROBUSTO
    // Preferencia: userId de localStorage
    // Fallback: hash(IP + User-Agent) para modo incógnito
    const ip = getClientIP(req.headers, (req as { ip?: string }).ip);
    const userAgent = normalizeUserAgent(req.headers.get('user-agent'));
    const fingerprint = generateFingerprint(userId, ip, userAgent);

    console.log('[ANALYSIS] ✓ Audio file:', audioFile.name, audioFile.size, 'bytes');
    console.log('[ANALYSIS] ✓ User ID (client):', userId || 'null');
    console.log('[ANALYSIS] ✓ IP:', ip || 'unknown');
    console.log('[ANALYSIS] ✓ Fingerprint:', fingerprint);

    if (audioFile.size === 0) {
      console.log('[ANALYSIS] ❌ Audio file is empty');
      return NextResponse.json(
        { error: 'Audio vacío' },
        { status: 400 }
      );
    }

    // 🛡️ CONTROL DE TAMAÑO (evitar costos excesivos)
    if (audioFile.size > MAX_AUDIO_SIZE_BYTES) {
      console.log('[ANALYSIS] ❌ Audio file too large:', audioFile.size);
      return NextResponse.json(
        { error: 'El audio es demasiado grande. Máximo 5MB.' },
        { status: 400 }
      );
    }

    // 🔒 CONTROL DE USO FREE - CRÍTICO
    // Aquí es donde se bloquea el abuso, NUNCA en la UI
    const plan = await getUserPlan(fingerprint);
    console.log('[ANALYSIS] User plan:', plan);

    let totalAnalyses = 0;
    let usageCheck: Awaited<ReturnType<typeof checkFreeUsage>> | null = null;

    if (plan === "FREE") {
      usageCheck = await checkFreeUsage(fingerprint);
      totalAnalyses = usageCheck.currentUsage;
      console.log('[ANALYSIS] Free usage check:', usageCheck);
    } else {
      try {
        const usageResult = await db.query(
          `SELECT total_analyses FROM usage WHERE user_id = $1`,
          [fingerprint]
        );
        totalAnalyses = usageResult.rows[0]?.total_analyses || 0;
      } catch (error) {
        console.error('[ANALYSIS] Error fetching total_analyses:', error);
      }
    }

    console.log('[USAGE]', {
      ip,
      userAgent,
      fingerprint,
      planType: plan,
      totalAnalyses,
    });

    if (plan === "FREE" && usageCheck && !usageCheck.allowed) {
      console.log('[ANALYSIS] 🚫 FREE LIMIT REACHED for fingerprint:', fingerprint);
      return NextResponse.json(
        {
          error: 'FREE_LIMIT_REACHED',
          message: 'Ya realizaste tu análisis gratuito. Actualiza a Premium para continuar.',
          currentUsage: usageCheck.currentUsage,
          maxAllowed: usageCheck.maxAllowed,
        },
        { status: 403 }
      );
    }

    // Si no hay API key de OpenAI, usar respuesta mock
    if (USE_MOCK) {
      console.log('[ANALYSIS] ⚠️  Usando respuesta MOCK (no hay OPENAI_API_KEY)');

      // 📊 CRÍTICO: Incrementar uso ANTES de devolver respuesta MOCK
      // Sin esto, el usuario puede hacer análisis infinitos en modo MOCK
      await incrementUsage(fingerprint, plan);
      console.log('[ANALYSIS] ✓ Usage incremented for fingerprint (MOCK mode):', fingerprint);

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
    const { saveVoiceAnalysis } = await import('@/application/tracking/saveVoiceSession');

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    console.log('[ANALYSIS] Analyzing voice...');
    const result = await analyzeVoiceUseCase({
      audioBuffer,
      userId: undefined,
    });

    // Guardar sesión en DB
    const sessionId = await saveVoiceAnalysis(fingerprint, result);
    console.log('[ANALYSIS] ✓ Session saved:', sessionId);

    // 📊 INCREMENTAR USO (después de análisis exitoso)
    await incrementUsage(fingerprint, plan);
    console.log('[ANALYSIS] ✓ Usage incremented for fingerprint:', fingerprint);

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
