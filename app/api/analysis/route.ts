export const runtime = "nodejs";
export const maxDuration = 60; // 60 segundos de timeout (máximo en plan Hobby/Pro)

import { NextRequest, NextResponse } from 'next/server';
import { getUserPlan } from '@/lib/usage/getUserPlan';
import { checkFreeUsage } from '@/lib/usage/checkFreeUsage';
import { incrementUsage } from '@/lib/usage/incrementUsage';
import { prisma } from '@/infrastructure/db/client';
import { PlanType } from "@/types/Plan";
import {
  generateFingerprint,
  getClientIP,
  normalizeUserAgent,
} from '@/lib/fingerprint/generateFingerprint';

// MODO MOCK: Para probar el flujo sin OpenAI
const USE_MOCK = !process.env.OPENAI_API_KEY;

// ⏱️ LÍMITE DE DURACIÓN (control de costos MVP)
const MAX_AUDIO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB máximo

// 💰 LÍMITE INTELIGENTE: Rechazar audios que probablemente excedan 60 segundos
// WebM audio típico: 12-16 KB/segundo (Opus)
// 60 segundos × 16 KB = 960 KB máximo conservador
const MAX_AUDIO_SIZE_FOR_60_SECONDS = 960 * 1024; // ~960 KB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const userId = formData.get('userId') as string | null;

    console.log('[ANALYSIS] 📥 Request received [Clean Endpoint]');

    if (!audioFile) {
      console.log('[ANALYSIS] ❌ No audio file received');
      return NextResponse.json(
        { error: 'No se recibió audio' },
        { status: 400 }
      );
    }

    // 🔐 GENERAR FINGERPRINT ROBUSTO
    const ip = getClientIP(req.headers, (req as { ip?: string }).ip);
    const userAgent = normalizeUserAgent(req.headers.get('user-agent'));
    const fingerprint = generateFingerprint(userId, ip, userAgent);

    console.log('[ANALYSIS] ✓ Audio file:', audioFile.name, audioFile.size, 'bytes');

    if (audioFile.size === 0) {
      return NextResponse.json({ error: 'Audio vacío' }, { status: 400 });
    }

    if (audioFile.size > MAX_AUDIO_SIZE_BYTES) {
      return NextResponse.json({ error: 'El audio es demasiado grande. Máximo 5MB.' }, { status: 400 });
    }

    // 🛡️ CONTROL DE USO FREE - CON TOLERANCIA A FALLOS (Fail-Open)
    let plan: PlanType = "FREE";
    let usageCheck: Awaited<ReturnType<typeof checkFreeUsage>> | null = null;
    let dbError = false;

    try {
      // Intentar obtener plan real
      plan = await getUserPlan(fingerprint);
      
      if (plan === "FREE") {
        usageCheck = await checkFreeUsage(fingerprint);
        
        if (!usageCheck.allowed) {
          console.log('[ANALYSIS] 🚫 FREE LIMIT REACHED:', fingerprint);
          return NextResponse.json(
            {
              error: 'FREE_LIMIT_REACHED',
              message: 'Ya realizaste tu análisis gratuito. Actualiza a Premium.',
              currentUsage: usageCheck.currentUsage,
              maxAllowed: usageCheck.maxAllowed,
            },
            { status: 403 }
          );
        }
      }
    } catch (error) {
      console.error('[ANALYSIS] ⚠️ DB Error (Checking Usage):', error);
      dbError = true;
      // Si falla la DB, asumimos FREE y permitimos pasar (Fail-Open)
      console.log('[ANALYSIS] Proceeding despite DB error (Fail-Open Policy)');
    }

    // Helper seguro para incrementar uso sin romper el flujo principal
    const safeIncrementUsage = async () => {
      try {
        await incrementUsage(fingerprint, plan);
        console.log('[ANALYSIS] ✅ Usage incremented');
      } catch (err) {
        console.error('[ANALYSIS] ⚠️ Failed to increment usage (Non-critical):', err);
      }
    };

    // Si no hay API key de OpenAI, usar respuesta mock
    if (USE_MOCK) {
      console.log('[ANALYSIS] ⚠️  Usando respuesta MOCK (no hay OPENAI_API_KEY)');
      await safeIncrementUsage();

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
          diagnosis: "Tu voz transmite autoridad media (Mock).",
          score_seguridad: 65,
          score_claridad: 78,
          strengths: ["Ritmo estable", "Claridad"],
          weaknesses: ["Cierre débil"],
          decision: "Prueba con API Key real.",
          payoff: "Tendrás análisis real.",
          metrics: {
            wordsPerMinute: 120,
            avgPauseDuration: 0.5,
            pauseCount: 8,
            pitchVariation: 0.2,
            energyStability: 0.6
          },
          durationBytes: audioFile.size,
          durationSeconds: 10
        }
      });
    }

    // Análisis real con OpenAI
    console.log('[ANALYSIS] 🔄 Starting real analysis...');

    // Importar dinámicamente para no cargar dependencias pesadas si falló validación previa
    const { analyzeVoiceUseCase } = await import('@/application/analyzeVoice/analyzeVoiceUseCase');
    const { saveVoiceAnalysis } = await import('@/application/tracking/saveVoiceSession');

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    const result = await analyzeVoiceUseCase({
      audioBuffer,
      userId: undefined,
    });

    // 📊 INCREMENTAR USO (Safe)
    console.log('[ANALYSIS] 🔄 Incrementing usage...');
    await safeIncrementUsage();

    // Guardar sesión en DB (opcional)
    try {
      const sessionId = await saveVoiceAnalysis(fingerprint, result);
      console.log('[ANALYSIS] ✓ Session saved:', sessionId);
    } catch (saveError) {
      console.error('[ANALYSIS] ⚠️ Failed to save session (non-critical):', saveError);
    }

    console.log('[ANALYSIS] ✓ Analysis complete!');
    return NextResponse.json({
      success: true,
      data: {
        transcription: result.transcription,
        transcriptionWithSilences: result.transcriptionWithSilences,
        authorityScore: result.authorityScore,
        metrics: result.metrics,
        durationSeconds: result.durationSeconds,
        diagnosis: result.feedback.diagnostico,
        score_seguridad: result.feedback.score_seguridad,
        score_claridad: result.feedback.score_claridad,
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
