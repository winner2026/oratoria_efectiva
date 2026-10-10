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
import { checkUsage } from '@/lib/usage/checkUsage';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId || userId === 'guest-1') {
      return NextResponse.json({ error: 'Debes iniciar sesión para usar el analizador de voz.' }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    
    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: 'No se recibió audio' }, { status: 400 });
    }

    const usageResult = await checkUsage(userId);
    if (!usageResult.allowed) {
      return NextResponse.json({ 
        error: usageResult.reason === 'FREE_LIMIT_REACHED' 
          ? 'Has alcanzado el límite de 2 análisis gratuitos. Suscríbete para continuar.'
          : 'Has alcanzado el límite mensual de tu plan.',
        code: usageResult.reason
      }, { status: 403 });
    }

    const visitorId = "authenticated"; // mock for compatibility with old code that expects it

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

    const userState = await CoachingRepository.getUserCoachingState(userId);
    const sessionHistory = await CoachingRepository.getUserSessionHistory(userId);

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
      userId: userId,
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
            title: "Volumen y Energía",
            valueFormatted: result.metrics.energyStability !== null ? `${Math.round(result.metrics.energyStability * 100)}%` : "N/A",
            explanation: "Mide si mantienes un buen volumen al hablar o si tu voz se apaga al final de las frases.",
            limitations: "Ocasionalmente, bajar la voz a propósito puede ser un recurso, pero por defecto buscamos que te escuchen bien."
          },
          dinamicaEntonacion: {
            title: "Expresividad y Tono",
            valueFormatted: result.metrics.pitchVariation !== null ? `${Math.round(result.metrics.pitchVariation)} Hz` : "N/A",
            explanation: "Mide si tu voz tiene melodía y cambios de tono para mantener la atención, o si suenas muy monótono.",
            limitations: "Si hay mucho ruido de fondo, a veces el escáner no logra medir bien tu tono exacto."
          },
          estabilidadEspectral: {
            title: "Claridad de la Voz",
            valueFormatted: result.metrics.spectralBand3Score != null ? `${result.metrics.spectralBand3Score}/100` : "N/A",
            explanation: "Mide si tu voz suena clara y nítida o si se percibe oscura o ahogada.",
            limitations: "Esta medición puede verse afectada por la calidad de tu micrófono o si estabas muy lejos de él."
          },
          ritmoHabla: {
            title: "Velocidad al Hablar",
            valueFormatted: `${result.metrics.wordsPerMinute} WPM`,
            explanation: "Calcula qué tan rápido hablas. Si vas muy rápido, la gente se pierde; si vas muy lento, se aburren.",
            limitations: "Depende de lo bien que el sistema de IA entienda todas tus palabras."
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
