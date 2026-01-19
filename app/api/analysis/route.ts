export const runtime = "nodejs";
export const maxDuration = 60; 

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/db/client';
import { decodeAudio } from '@/infrastructure/audio/PitchAnalysis';
import { analyzeSpectralCharacteristics } from '@/infrastructure/audio/SpectralAnalysis';

// 🛑 PURE SIGNAL ANALYSIS (NO AI)
async function performTechnicalAnalysis(audioBuffer: Buffer) {
    try {
        const float32Audio = await decodeAudio(audioBuffer);
        const spectral = analyzeSpectralCharacteristics(float32Audio);
        
        // 1. Duración
        const durationSeconds = float32Audio.length / 44100;

        // 2. Energía y Estabilidad
        let totalEnergy = 0;
        const windowSize = 4410; // 100ms
        const energies: number[] = [];
        
        for (let i = 0; i < float32Audio.length; i += windowSize) {
            let winE = 0;
            const limit = Math.min(i + windowSize, float32Audio.length);
            for (let j = i; j < limit; j++) {
                winE += float32Audio[j] * float32Audio[j];
            }
            const rms = Math.sqrt(winE / (limit - i));
            energies.push(rms);
            totalEnergy += rms;
        }
        
        const avgEnergy = totalEnergy / energies.length;
        const variance = energies.reduce((a, b) => a + Math.pow(b - avgEnergy, 2), 0) / energies.length;
        const stabilityScore = Math.max(0, Math.min(100, Math.round(100 - (Math.sqrt(variance) / avgEnergy) * 100)));

        // 3. Estimación de WPM (Picos de sílabas por envolvente)
        // Buscamos picos de energía que bajen y suban (sílabas/palabras)
        let peaks = 0;
        let isPeak = false;
        const threshold = avgEnergy * 0.8;
        for (const e of energies) {
            if (e > threshold && !isPeak) {
                peaks++;
                isPeak = true;
            } else if (e < threshold * 0.5) {
                isPeak = false;
            }
        }
        // Ajustamos picos a WPM aproximado (factor empírico: 1 peak ~ 0.8 palabras)
        const estimatedWpm = Math.round((peaks * 0.85 / (durationSeconds || 1)) * 60);

        // 4. Pausas de autoridad (> 600ms de bajo nivel)
        let pauseCount = 0;
        let silentWindows = 0;
        const silenceThreshold = avgEnergy * 0.15;
        for (const e of energies) {
            if (e < silenceThreshold) {
                silentWindows++;
            } else {
                if (silentWindows > 6) pauseCount++; // > 600ms
                silentWindows = 0;
            }
        }

        // 5. Feedback Lógico (Reglas de negocio reales, no IA)
        let diagnostico = "Tu voz ha sido procesada mediante análisis de señal pura.";
        let decision = "Mantén el ritmo actual.";
        let payoff = "Tu audiencia percibirá mayor claridad.";
        
        if (stabilityScore > 80) diagnostico = "Tu proyección es excepcionalmente estable. Transmites control absoluto.";
        else if (stabilityScore < 40) diagnostico = "Detectamos temblor en la señal. Necesitas mayor apoyo diafragmático.";
        
        if (estimatedWpm > 160) {
            decision = "Reduce la velocidad.";
            payoff = "Ganarás autoridad y tiempo para pensar.";
        } else if (estimatedWpm < 100 && durationSeconds > 5) {
            decision = "Aumenta la energía.";
            payoff = "Evitarás que tu audiencia pierda el interés.";
        }

        return {
            transcription: "Análisis técnico de señal (Voz detectada).",
            transcriptionWithSilences: `[Audio de ${durationSeconds.toFixed(1)}s analizado]`,
            metrics: {
                wordsPerMinute: estimatedWpm,
                avgPauseDuration: 0.8,
                pauseCount: pauseCount,
                pitchVariation: 0.5,
                energyStability: stabilityScore / 100,
                nasalityScore: spectral.nasalityScore,
                brightnessScore: spectral.brightnessScore,
                depthScore: spectral.depthScore,
            },
            authorityScore: {
                level: stabilityScore > 70 ? "HIGH" : stabilityScore > 40 ? "MEDIUM" : "LOW",
                score: Math.round((stabilityScore + (estimatedWpm > 110 && estimatedWpm < 150 ? 100 : 50)) / 2),
                strengths: stabilityScore > 70 ? ["Estabilidad de aire", "Claridad espectral"] : ["Potencia base"],
                weaknesses: stabilityScore < 70 ? ["Tensión laríngea", "Fluctuación de energía"] : [],
                priorityAdjustment: estimatedWpm > 160 ? "SLOW_DOWN" : "PAUSE_MORE"
            },
            feedback: {
                diagnostico,
                score_seguridad: stabilityScore,
                score_claridad: spectral.brightnessScore,
                score_estructura: 100 - (pauseCount > 5 ? 20 : 0),
                rephrase_optimized: "Análisis basado en métricas físicas de frecuencia y amplitud.",
                lo_que_suma: ["Presión constante", "Tono audible"],
                lo_que_resta: estimatedWpm > 170 ? ["Velocidad excesiva"] : [],
                decision,
                payoff
            },
            durationSeconds: Math.round(durationSeconds)
        };
    } catch (err) {
        console.error("Error in technical analysis:", err);
        throw err;
    }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const userId = formData.get('userId') as string | null;

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: 'No se recibió audio' }, { status: 400 });
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    
    // ANALISIS REAL (SIN IA)
    const result = await performTechnicalAnalysis(audioBuffer);

    // Guardar sesión (Habilitado para todos siempre)
    try {
      if (userId) {
          await prisma.voiceSession.create({
            data: {
              userId: userId,
              transcription: result.transcription,
              transcriptionWithSilences: result.transcriptionWithSilences,
              wordsPerMinute: result.metrics.wordsPerMinute,
              avgPauseDuration: result.metrics.avgPauseDuration,
              pauseCount: result.metrics.pauseCount,
              fillerCount: 0,
              pitchVariation: result.metrics.pitchVariation,
              energyStability: result.metrics.energyStability,
              durationSeconds: result.durationSeconds,
              authorityLevel: result.authorityScore.level,
              authorityScore: result.authorityScore.score,
              strengths: result.authorityScore.strengths,
              weaknesses: result.authorityScore.weaknesses,
              priorityAdjustment: result.authorityScore.priorityAdjustment,
              feedbackDiagnostico: result.feedback.diagnostico,
              feedbackLoQueSuma: result.feedback.lo_que_suma,
              feedbackLoQueResta: result.feedback.lo_que_resta,
              feedbackDecision: result.feedback.decision,
              feedbackPayoff: result.feedback.payoff,
            }
          });
      }
    } catch (saveError) {
      console.error('Failed to save session:', saveError);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
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

  } catch (error: any) {
    console.error('[ANALYSIS] Error:', error);
    return NextResponse.json({ error: 'Error procesando el audio.' }, { status: 500 });
  }
}
