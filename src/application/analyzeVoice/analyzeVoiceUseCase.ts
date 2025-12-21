import { VoiceMetrics } from '../../domain/voice/VoiceMetrics';
import { extractMetrics } from '../../services/audio/extractMetrics';
import { transcribeAudio, TranscriptionSegment } from '../../infrastructure/openai/transcription';
import { generateDynamicFeedback, DynamicFeedbackOutput } from '../../infrastructure/openai/feedback';
import { AuthorityScore } from '../../domain/authority/AuthorityScore';
import { buildAuthorityScore } from '../../domain/authority/buildAuthorityScore';

export type AnalyzeVoiceInput = {
  audioBuffer: Buffer;
  userId?: string;
};

export type AnalyzeVoiceResult = {
  transcription: string;
  transcriptionWithSilences: string;
  metrics: VoiceMetrics;
  durationSeconds: number;
  authorityScore: AuthorityScore;
  feedback: DynamicFeedbackOutput;
};

function buildTranscriptionWithSilences(
  segments: TranscriptionSegment[]
): string {
  let result = '';

  for (let i = 0; i < segments.length; i++) {
    result += segments[i].text;

    // Si hay un siguiente segmento, verificar la pausa
    if (i < segments.length - 1) {
      const gap = segments[i + 1].start - segments[i].end;
      if (gap > 0.7) {  // Pausas mayores a 700ms se marcan como silencio
        result += ' [silencio] ';
      } else {
        result += ' ';
      }
    }
  }

  return result.trim();
}

export async function analyzeVoiceUseCase({
  audioBuffer,
}: AnalyzeVoiceInput): Promise<AnalyzeVoiceResult> {
  // 1. Transcribir con segmentos (incluye muletillas y pausas)
  console.log('[ANALYZE] Transcribing audio...');
  const transcriptionResult = await transcribeAudio(audioBuffer);

  // 2. Extraer métricas reales desde la transcripción
  console.log('[ANALYZE] Extracting metrics...');
  const metrics = extractMetrics(
    transcriptionResult.text,
    transcriptionResult.segments,
    transcriptionResult.duration
  );

  console.log('[ANALYZE] Metrics:', metrics);

  // 3. Construir transcripción con silencios visibles
  const transcriptionWithSilences = buildTranscriptionWithSilences(
    transcriptionResult.segments
  );

  // 4. Calcular score de autoridad basado en métricas reales
  console.log('[ANALYZE] Calculating authority score...');
  const authorityScore = buildAuthorityScore(metrics);

  // 5. Generar feedback dinámico con GPT-4o-mini
  console.log('[ANALYZE] Generating dynamic feedback with GPT-4o-mini...');
  const feedback = await generateDynamicFeedback({
    transcript: transcriptionResult.text,
    metrics,
  });

  console.log('[ANALYZE] Analysis complete!');

  return {
    transcription: transcriptionResult.text,
    transcriptionWithSilences,
    metrics,
    durationSeconds: transcriptionResult.duration,
    authorityScore,
    feedback,
  };
}
