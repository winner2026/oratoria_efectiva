export const runtime = "nodejs";
export const maxDuration = 60; 

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/infrastructure/db/client';
import { decodeAudio } from '@/infrastructure/audio/PitchAnalysis';
import { analyzeSpectralCharacteristics } from '@/infrastructure/audio/SpectralAnalysis';
import { CoachingRepository } from '@/infrastructure/db/repositories/coachingRepository';
import { diagnoseAndPrescribeUseCase } from '@/application/coaching/diagnoseAndPrescribeUseCase';
import { VoiceSessionStore } from '@/infrastructure/db/voiceSessionStore';
import { analyzeVoiceUseCase } from '@/application/analyzeVoice/analyzeVoiceUseCase';
import { getOrCreateVisitorIdServer } from '@/lib/auth/visitorIdentity';

export async function POST(req: NextRequest) {
  let usageReserved = false;
  let limitIdentifier = '';
  let ipIdentifier = '';

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    
    const { visitorId } = await getOrCreateVisitorIdServer();

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: 'No se recibió audio' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    limitIdentifier = userId ? `user_${userId}` : `anon_${visitorId}`;
    ipIdentifier = `ip_${ip}`;
    
    let isPaidUser = false;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
      if (user && user.plan !== "FREE") {
        isPaidUser = true;
      }
    }

    // RESERVA ATÓMICA DE USO (Solo para FREE o Anónimos)
    if (!isPaidUser) {
      try {
        await prisma.$transaction(async (tx) => {
          const usage = await tx.usage.upsert({
            where: { fingerprint: limitIdentifier },
            update: {},
            create: {
              fingerprint: limitIdentifier,
              planType: "FREE",
              totalAnalyses: 0,
              userId: userId || null
            }
          });

          // Extra capa: si es anónimo, también limitamos por IP
          if (!userId) {
             const ipUsage = await tx.usage.findUnique({
                where: { fingerprint: ipIdentifier }
             });
             if (ipUsage && ipUsage.totalAnalyses >= 1) {
                throw new Error("FREE_LIMIT_REACHED");
             }
          }

          if (usage.totalAnalyses >= 1) {
            throw new Error("FREE_LIMIT_REACHED");
          }

          await tx.usage.update({
            where: { fingerprint: limitIdentifier },
            data: { totalAnalyses: { increment: 1 } }
          });
          
          if (!userId) {
             await tx.usage.upsert({
                where: { fingerprint: ipIdentifier },
                update: { totalAnalyses: { increment: 1 } },
                create: { fingerprint: ipIdentifier, planType: "FREE", totalAnalyses: 1 }
             });
          }
        }, { isolationLevel: 'Serializable' });
        usageReserved = true;
      } catch (error) {
        if (error instanceof Error && error.message === "FREE_LIMIT_REACHED") {
          return NextResponse.json({ 
            error: 'Has alcanzado el límite de análisis gratuitos. Regístrate o suscríbete para continuar.',
            code: 'FREE_LIMIT_REACHED'
          }, { status: 403 });
        }
        throw error;
      }
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    
    const result = await analyzeVoiceUseCase({
      audioBuffer,
      audioFileName: audioFile.name,
      exerciseContext: {
        id: 'diagnostico',
        title: 'Diagnóstico Inicial',
        goal: 'Establecer línea base',
        metrics: ['energyStability', 'wordsPerMinute']
      }
    });

    const userState = await CoachingRepository.getUserCoachingState(limitIdentifier);
    const sessionHistory = await CoachingRepository.getUserSessionHistory(limitIdentifier);

    const coachingOutput = diagnoseAndPrescribeUseCase({
      userState,
      sessionHistory,
      metrics: result.metrics,
      authorityScore: result.authorityScore,
    });

    await CoachingRepository.saveUserCoachingState(coachingOutput.updatedUserState);
    await CoachingRepository.saveCoachingSession(coachingOutput.session);

    const finalScore = coachingOutput.communicationProfile.overallIndex;
    const finalLevel = finalScore >= 75 ? "HIGH" : finalScore >= 50 ? "MEDIUM" : "LOW";

    const simulateDbFailure = req.headers.get('x-simulate-db-failure') === 'true';

    const saveResult = await VoiceSessionStore.createSession({
      userId: userId || visitorId,
      transcription: result.transcription,
      transcriptionWithSilences: result.transcriptionWithSilences,
      wordsPerMinute: result.metrics.wordsPerMinute,
      avgPauseDuration: result.metrics.avgPauseDuration,
      pauseCount: result.metrics.pauseCount,
      fillerCount: result.metrics.fillerCount,
      pitchVariation: result.metrics.pitchVariation,
      energyStability: result.metrics.energyStability,
      durationSeconds: result.durationSeconds,
      authorityLevel: finalLevel,
      authorityScore: finalScore,
      strengths: result.authorityScore.strengths,
      weaknesses: result.authorityScore.weaknesses,
      priorityAdjustment: result.authorityScore.priorityAdjustment,
      feedbackDiagnostico: coachingOutput.diagnosticProfile.behavioralSummary,
      feedbackLoQueSuma: result.feedback.lo_que_suma,
      feedbackLoQueResta: result.feedback.lo_que_resta,
      feedbackDecision: result.feedback.decision,
      feedbackPayoff: result.feedback.payoff,
      simulateDbFailure,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        authorityScore: {
          ...result.authorityScore,
          score: finalScore,
          level: finalLevel,
        },
        persistence: {
          persisted: saveResult.persisted,
          visitorId,
          databaseSessionId: saveResult.databaseSessionId,
        },
        metricExplanations: {
          fuerzaVocal: {
            title: "Consistencia de Intensidad",
            valueFormatted: result.metrics.energyStability !== null ? `${Math.round(result.metrics.energyStability * 100)}%` : "N/A",
            explanation: "Indicador de consistencia RMS en intervalos de habla válidos.",
            limitations: "No distingue intención expresiva; valores altos no siempre implican monotonía ni valores bajos mala técnica."
          },
          dinamicaEntonacion: {
            title: "Rango Fundamental",
            valueFormatted: result.metrics.pitchVariation !== null ? `${Math.round(result.metrics.pitchVariation)} Hz` : "N/A",
            explanation: "Rango de variación de la frecuencia fundamental (F0).",
            limitations: "Requiere detección de pitch fiable. Valores ausentes indican imposibilidad técnica de medición."
          },
          estabilidadEspectral: {
            title: "Índice espectral experimental",
            valueFormatted: result.metrics.spectralBand3Score != null ? `${result.metrics.spectralBand3Score}/100` : "N/A",
            explanation: "Índice heurístico de energía alrededor de 3 kHz en relación con otras bandas analizadas.",
            limitations: "No es una medida validada de claridad vocal; depende del micrófono, el entorno y la calidad de grabación."
          },
          ritmoHabla: {
            title: "Ritmo (WPM)",
            valueFormatted: `${result.metrics.wordsPerMinute} WPM`,
            explanation: "Velocidad de habla basada en la transcripción temporal.",
            limitations: "Se ve afectado por la calidad de la transcripción y el idioma."
          }
        },
        coaching: {
          sessionId: coachingOutput.session.id,
          communicationProfile: coachingOutput.communicationProfile,
          diagnosticProfile: coachingOutput.diagnosticProfile,
          prescription: {
            ...coachingOutput.prescription,
            primaryExercise: {
              title: coachingOutput.prescription.exerciseTitle,
              explanation: coachingOutput.prescription.rationale,
              instruction: coachingOutput.prescription.instruction,
              customRoute: coachingOutput.prescription.customRoute,
            }
          },
          progressEvaluation: coachingOutput.progressEvaluation,
          adaptiveNextStep: coachingOutput.adaptiveNextStep,
        },
      },
    });

  } catch (error: unknown) {
    console.error('[ANALYSIS] Error:', error);
    
    // ROLLBACK USAGE ON ERROR
    if (usageReserved) {
      try {
        const identifiers = [limitIdentifier];
        if (ipIdentifier) identifiers.push(ipIdentifier);
        
        await prisma.usage.updateMany({
          where: { fingerprint: { in: identifiers } },
          data: { totalAnalyses: { decrement: 1 } }
        });
      } catch (rollbackError) {
        console.error("[ANALYSIS] Failed to rollback usage:", rollbackError);
      }
    }

    const message = error instanceof Error ? error.message : '';
    const noSpeechDetected = message.includes('No se detectó habla en la grabación')
      || message.includes('Whisper no detectó ningún contenido de audio');

    if (noSpeechDetected) {
      return NextResponse.json(
        { error: 'No se detectó habla en la grabación. Asegúrate de hablar claramente y revisa tu micrófono.', code: 'NO_SPEECH_DETECTED' },
        { status: 422 }
      );
    }

    return NextResponse.json({ error: 'Error procesando el audio. Inténtalo nuevamente.' }, { status: 500 });
  }
}
