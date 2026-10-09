import assert from 'node:assert/strict';
import { analyzePitch, decodeAudio } from '../src/infrastructure/audio/PitchAnalysis';
import {
  analyzeSpectralCharacteristics,
  calculateRMSStability,
} from '../src/infrastructure/audio/SpectralAnalysis';
import { extractMetrics } from '../src/domain/voice/VoiceMetrics';
import { buildDiagnosticProfile } from '../src/domain/coaching/DiagnosticProfile';

const SAMPLE_RATE = 44_100;

function makeWav(samples: Float32Array, sampleRate = SAMPLE_RATE): Buffer {
  const pcmBytes = samples.length * 2;
  const wav = Buffer.alloc(44 + pcmBytes);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + pcmBytes, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); // PCM
  wav.writeUInt16LE(1, 22); // mono
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(pcmBytes, 40);

  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    wav.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }
  return wav;
}

function makeVoicedSignal(seconds: number, expressive = false): Float32Array {
  const samples = new Float32Array(Math.floor(seconds * SAMPLE_RATE));
  let phase = 0;

  for (let i = 0; i < samples.length; i++) {
    const time = i / SAMPLE_RATE;
    const progress = time / seconds;
    const f0 = expressive
      ? 115 + 125 * progress + 12 * Math.sin(2 * Math.PI * 1.2 * time)
      : 155 + 8 * Math.sin(2 * Math.PI * 0.6 * time);
    phase += (2 * Math.PI * f0) / SAMPLE_RATE;

    const envelope = expressive
      ? 0.08 + 0.30 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 1.1 * time))
      : 0.18 + 0.07 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.8 * time));

    // Señal periódica sintética con armónicos. Es un proxy de voz, no una grabación humana.
    samples[i] =
      envelope *
      (Math.sin(phase) + 0.25 * Math.sin(2 * phase) + 0.08 * Math.sin(3 * phase));
  }
  return samples;
}

function makeNoise(seconds: number): Float32Array {
  const samples = new Float32Array(Math.floor(seconds * SAMPLE_RATE));
  let state = 0x12345678;
  for (let i = 0; i < samples.length; i++) {
    state = (1664525 * state + 1013904223) >>> 0;
    samples[i] = ((state / 0xffffffff) * 2 - 1) * 0.25;
  }
  return samples;
}

async function runCase(name: string, test: () => Promise<void> | void): Promise<void> {
  await test();
  console.log(`PASS: ${name}`);
}

async function main(): Promise<void> {
  const speechLike = makeVoicedSignal(3, false);
  const expressive = makeVoicedSignal(4, true);
  const silence = new Float32Array(3 * SAMPLE_RATE);
  const noise = makeNoise(3);
  const speechSegment = [{ start: 0.05, end: 2.95, text: 'Esta es una frase de prueba.' }];

  await runCase('1. Señal vocal sintética: RMS/F0 produce valores finitos', async () => {
    const rms = calculateRMSStability(speechLike, SAMPLE_RATE, speechSegment);
    const pitch = await analyzePitch(makeWav(speechLike), speechSegment);
    assert.equal(typeof rms, 'number');
    assert.ok(Number.isFinite(rms));
    assert.ok(rms! >= 0 && rms! <= 1);
    assert.ok(typeof pitch.meanPitch === 'number' && Number.isFinite(pitch.meanPitch));
    assert.ok(pitch.meanPitch! >= 50 && pitch.meanPitch! <= 500);
  });

  await runCase('2. Silencio absoluto: RMS, F0 y bandas no se puntúan', async () => {
    const rms = calculateRMSStability(silence, SAMPLE_RATE, [{ start: 0, end: 3 }]);
    const pitch = await analyzePitch(makeWav(silence), [{ start: 0, end: 3, text: ' ' }]);
    const spectral = analyzeSpectralCharacteristics(silence, SAMPLE_RATE);
    assert.equal(rms, null);
    assert.equal(pitch.meanPitch, null);
    assert.equal(pitch.pitchRange, null);
    assert.equal(spectral.spectralBand1Score, null);
    assert.equal(spectral.spectralBand2Score, null);
    assert.equal(spectral.spectralBand3Score, null);
  });

  await runCase('3. Ruido sin segmentos reconocidos: no se atribuye a voz', async () => {
    const rms = calculateRMSStability(noise, SAMPLE_RATE, []);
    const pitch = await analyzePitch(makeWav(noise), []);
    assert.equal(rms, null);
    assert.equal(pitch.meanPitch, null);
    assert.equal(pitch.pitchRange, null);
  });

  await runCase('4. Señal expresiva: el analizador admite variación de F0/intensidad', async () => {
    const segments = [{ start: 0, end: 4, text: 'Esta es una señal expresiva sintética.' }];
    const rms = calculateRMSStability(expressive, SAMPLE_RATE, segments);
    const pitch = await analyzePitch(makeWav(expressive), segments);
    assert.ok(typeof rms === 'number' && Number.isFinite(rms));
    assert.ok(rms >= 0 && rms <= 1);
    assert.ok(typeof pitch.pitchRange === 'number' && Number.isFinite(pitch.pitchRange));
    assert.ok(pitch.pitchRange! >= 0);
  });

  await runCase('5. Marcas temporales inválidas: el sistema se abstiene', async () => {
    const invalidSegments = [
      { start: Number.NaN, end: 1, text: 'naN' },
      { start: -1, end: 1, text: 'negativo' },
      { start: 2, end: 1, text: 'invertido' },
    ];
    assert.equal(calculateRMSStability(speechLike, SAMPLE_RATE, invalidSegments), null);
    const pitch = await analyzePitch(makeWav(speechLike), invalidSegments);
    assert.equal(pitch.meanPitch, null);
    assert.equal(pitch.pitchRange, null);
  });

  await runCase('6. Audio corrupto y duración inválida: error explícito sin métricas mágicas', async () => {
    await assert.rejects(() => decodeAudio(Buffer.from('esto no es un archivo de audio válido')));
    const emptyMetrics = extractMetrics('', [], 0);
    assert.equal(emptyMetrics.wordsPerMinute, 0);
    assert.equal(emptyMetrics.energyStability, null);
    assert.equal(emptyMetrics.pitchVariation, null);
    assert.ok(Number.isFinite(emptyMetrics.wordsPerMinute));

    const unknownSignalDiagnostic = buildDiagnosticProfile(
      {
        wordsPerMinute: 120,
        avgPauseDuration: 0.6,
        pauseCount: 3,
        fillerCount: 0,
        pitchVariation: null,
        energyStability: null,
      },
      { score: 50, strengths: [], weaknesses: [] },
    );
    assert.match(unknownSignalDiagnostic.behavioralSummary, /No puede confirmarse una evaluación vocal completa/);
    assert.doesNotMatch(unknownSignalDiagnostic.behavioralSummary, /excelente estabilidad energética/i);
  });

  console.log('6/6 casos sintéticos superados. Las pruebas unitarias no sustituyen la validación con grabaciones humanas reales.');
}

main().catch((error) => {
  console.error('Falló la validación de métricas de audio:', error);
  process.exitCode = 1;
});
