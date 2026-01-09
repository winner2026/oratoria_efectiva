export const runtime = "nodejs";
export const maxDuration = 60; // 60 segundos de timeout (máximo en plan Hobby/Pro)

import { NextRequest, NextResponse } from 'next/server';
import { getUserPlan } from '@/lib/usage/getUserPlan';
import { checkUsage } from '@/lib/usage/checkUsage';
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
    // 🔐 GENERAR FINGERPRINT ROBUSTO
    const ip = getClientIP(req.headers, (req as { ip?: string }).ip);
    const userAgent = normalizeUserAgent(req.headers.get('user-agent'));
    const fingerprint = generateFingerprint(userId, ip, userAgent);

    // 🛡️ RATE LIMITING (VELOCITY CHECK) - Escudo Financiero para Usuarios Registrados
    // Anónimos ya están limitados a 3 totales por el checkUsage posterior.
    if (userId) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        const recentSessions = await prisma.voiceSession.count({
          where: {
            userId: userId,
            createdAt: { gte: oneHourAgo }
          }
        });

        if (recentSessions >= 15) { // Damos un poco más de margen a registrados (15/hora)
          console.warn(`[SECURITY] Rate Limit Exceeded for User ${userId}`);
          return NextResponse.json(
            { error: 'Estás analizando muy rápido. Tómate un respiro.' },
            { status: 429 }
          );
        }
    }
    
    // 🔒 SECURTY CHECK: FILE SIZE LIMIT (ANTIHACKER)
    // 60s of WebM Opus audio usually < 1MB. We set 3MB limit as safety buffer.
    const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB
    if (audioFile.size > MAX_SIZE_BYTES) {
        console.error(`[SECURITY] Archivo rechazado por exceso de tamaño: ${(audioFile.size / 1024 / 1024).toFixed(2)}MB`);
        return NextResponse.json(
            { error: 'El audio excede el límite de 60 segundos permitido.' },
            { status: 413 } // HTTP 413 Payload Too Large
        );
    }

    if (audioFile.size === 0) {
      return NextResponse.json({ error: 'Audio vacío' }, { status: 400 });
    }

    if (audioFile.size > MAX_AUDIO_SIZE_BYTES) {
      return NextResponse.json({ error: 'El audio es demasiado grande. Máximo 5MB.' }, { status: 400 });
    }

    // 🛡️ CONTROL DE USO MULTI-PLAN (Fail-Open)
    let plan: PlanType = "FREE";
    let dbError = false;

    try {
      const usageCheck = await checkUsage(fingerprint);
      plan = await getUserPlan(fingerprint); // Seguimos necesitando el plan para el incremento
      
      if (!usageCheck.allowed) {
        console.log(`[ANALYSIS] 🚫 LIMIT REACHED (${usageCheck.reason}):`, fingerprint);
        
        const messages = {
          FREE_LIMIT_REACHED: 'Has alcanzado tu límite gratuito (3 análisis). ¡Pásate a Premium para seguir practicando!',
          STARTER_LIMIT_REACHED: 'Has agotado tus 10 análisis del plan Starter. Es hora de subir a Premium.',
          PREMIUM_LIMIT_REACHED: 'Has alcanzado el límite de uso justo de 100 análisis este mes. El acceso se reseteará el día 1.',
          DB_ERROR: 'Error de servidor'
        };

        return NextResponse.json(
          {
            error: usageCheck.reason,
            message: messages[usageCheck.reason as keyof typeof messages] || 'Límite alcanzado',
            currentUsage: usageCheck.currentUsage,
            maxAllowed: usageCheck.maxAllowed,
            resetsAt: usageCheck.resetsAt
          },
          { status: 403 }
        );
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
    const startTime = Date.now(); // ⏱️ Inicio del cronómetro

    // Importar dinámicamente para no cargar dependencias pesadas si falló validación previa
    const { analyzeVoiceUseCase } = await import('@/application/analyzeVoice/analyzeVoiceUseCase');
    const { saveVoiceAnalysis } = await import('@/application/tracking/saveVoiceSession');

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    const result = await analyzeVoiceUseCase({
      audioBuffer,
      userId: undefined,
    });

    const duration = (Date.now() - startTime) / 1000; // Duración en segundos
    console.log(`[PERFORMANCE] Analysis took ${duration.toFixed(2)}s`);

    // ⚠️ ALERTA DE RENDIMIENTO
    if (duration > 8) {
      console.warn(`[WARNING] Slow analysis detected (${duration.toFixed(2)}s). Close to Vercel Hobby limit (10s). Consider upgrading to Pro if this persists.`);
      // Aquí podrías guardar este evento en una tabla 'events' para verlo en el dashboard
    }

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

    // 🔐 GATING: Bloquear métricas de "Estatus" si no es PREMIUM (Elite)
    const isElite = plan === "PREMIUM";
    let safeMetrics = { ...result.metrics };

    if (!isElite) {
       console.log(`[GATING] User plan is ${plan}. Hiding Elite metrics.`);
       delete safeMetrics.nasalityScore;
       delete safeMetrics.brightnessScore;
       delete safeMetrics.depthScore;
    }

    console.log('[ANALYSIS] ✓ Analysis complete!');
    return NextResponse.json({
      success: true,
      performance: {
        durationSeconds: duration,
        isSlow: duration > 8
      },
      data: {
        userPlan: plan, // 📢 Informamos al frontend del plan actual para UI Gating
        transcription: result.transcription,
        transcriptionWithSilences: result.transcriptionWithSilences,
        authorityScore: result.authorityScore,
        metrics: safeMetrics, // Métricas filtradas
        durationSeconds: result.durationSeconds,
        diagnosis: result.feedback.diagnostico,
        score_seguridad: result.feedback.score_seguridad,
        score_claridad: result.feedback.score_claridad,
        score_estructura: result.feedback.score_estructura,
        rephrase_optimized: result.feedback.rephrase_optimized,
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
