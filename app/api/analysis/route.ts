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
import { checkUsage } from '@/lib/usage/checkUsage';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Strict authentication check
    if (!userId || userId === 'guest-1') {
      return NextResponse.json({ error: 'Debes iniciar sesión para usar el analizador de voz.' }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    
    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: 'No se recibió audio' }, { status: 400 });
    }

    // Check plan usage limit
    const usageResult = await checkUsage(userId);
    if (!usageResult.allowed) {
      return NextResponse.json({ 
        error: usageResult.reason === 'FREE_LIMIT_REACHED' 
          ? 'Has alcanzado el límite de 2 análisis gratuitos. Suscríbete para continuar.'
          : 'Has alcanzado el límite mensual de tu plan.',
        code: usageResult.reason
      }, { status: 403 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call OpenAI Whisper API directly inside the route
    const openaiFormData = new FormData();
    const fileForOpenAI = new File([buffer], audioFile.name || 'audio.webm', { type: audioFile.type || 'audio/webm' });
    openaiFormData.append('file', fileForOpenAI);
    openaiFormData.append('model', 'whisper-1');
    openaiFormData.append('language', 'es');
    openaiFormData.append('response_format', 'verbose_json');
    openaiFormData.append('timestamp_granularities[]', 'segment');
    openaiFormData.append('timestamp_granularities[]', 'word');

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: openaiFormData
    });

    if (!whisperResponse.ok) {
      const errText = await whisperResponse.text();
      console.error("OpenAI Whisper Error:", errText);
      return NextResponse.json({ error: 'Error procesando el audio en OpenAI.' }, { status: 500 });
    }

    const whisperData = await whisperResponse.json();
    if (!whisperData.text) {
      return NextResponse.json({ error: 'No se detectó voz en la grabación. Intenta hablar más claro o acércate al micrófono.' }, { status: 400 });
    }

    // Analyze pitch locally
    const { pitchData } = await decodeAudio(buffer);

    // Advanced spectral metrics
    const spectralMetrics = analyzeSpectralCharacteristics(pitchData);

    // Compute metrics
    const words = whisperData.words || [];
    let pauseCount = 0;
    let totalPauseDuration = 0;

    for (let i = 1; i < words.length; i++) {
      const prevWord = words[i - 1];
      const currWord = words[i];
      const gap = currWord.start - prevWord.end;
      if (gap > 0.5) {
        pauseCount++;
        totalPauseDuration += gap;
      }
    }

    const duration = whisperData.duration || 15;
    const wpm = (words.length / duration) * 60;
    const avgPauseDuration = pauseCount > 0 ? totalPauseDuration / pauseCount : 0;

    // Filter valid pitches
    const validPitches = pitchData.filter((p: { frequency: number }) => p.frequency > 50 && p.frequency < 400);
    const frequencies = validPitches.map((p: { frequency: number }) => p.frequency);
    
    let pitchVariation = 0;
    if (frequencies.length > 0) {
      const minF0 = Math.min(...frequencies);
      const maxF0 = Math.max(...frequencies);
      pitchVariation = maxF0 - minF0;
    }

    // Calculate final score
    const result = analyzeVoiceUseCase({
      wordsPerMinute: wpm,
      avgPauseDuration,
      pauseCount,
      pitchVariation,
      energyConsistency: spectralMetrics.presenceIndex || 0.65, 
      spectralClarity: spectralMetrics.clarityIndex || 0,
    });

    // Coaching
    const diagnosis = diagnoseAndPrescribeUseCase(result.metrics);

    // Build the final response
    const finalResponseData = {
      authorityScore: result.authorityScore,
      metrics: result.metrics,
      coaching: diagnosis,
      transcript: whisperData.text
    };

    // Save session in background asynchronously to not block response
    const sessionStore = new VoiceSessionStore(prisma);
    sessionStore.saveSession(userId, {
      durationSeconds: duration,
      wpm: result.metrics.wordsPerMinute,
      pauseCount: result.metrics.pauseCount,
      pitchVariation: result.metrics.pitchVariation,
      authorityScore: result.authorityScore.score,
      transcript: whisperData.text
    }).catch(err => console.error("Error saving session in background:", err));

    return NextResponse.json(finalResponseData);

  } catch (error: any) {
    console.error("API Analysis Error:", error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor.' }, { status: 500 });
  }
}
