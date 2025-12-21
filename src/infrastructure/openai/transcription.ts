import OpenAI from "openai";
import { toFile } from "openai/uploads";

export type TranscriptionSegment = {
  id: number;
  start: number;
  end: number;
  text: string;
};

export type TranscriptionResult = {
  text: string;
  segments: TranscriptionSegment[];
  duration: number;
};

export async function transcribeAudio(audio: Buffer): Promise<TranscriptionResult> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Convertir Buffer a File usando el helper de OpenAI
  const file = await toFile(audio, "audio-input.mp3");

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "verbose_json",
    language: "es",
  });

  if (!transcription.text) {
    throw new Error('Whisper returned an unexpected payload without text.');
  }

  return {
    text: transcription.text.trim(),
    segments: (transcription as any).segments || [],
    duration: (transcription as any).duration || 0
  };
}
