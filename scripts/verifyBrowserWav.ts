import assert from 'node:assert/strict';
import { encodePcm16Wav } from '../src/lib/audio/browserWav';

const samples = new Float32Array([-1, -0.5, 0, 0.5, 1]);
const wav = encodePcm16Wav(samples, 16_000);
const view = new DataView(wav);

function readAscii(offset: number, length: number): string {
  return Array.from({ length }, (_, index) =>
    String.fromCharCode(view.getUint8(offset + index))
  ).join('');
}

assert.equal(readAscii(0, 4), 'RIFF');
assert.equal(view.getUint32(4, true), wav.byteLength - 8);
assert.equal(readAscii(8, 4), 'WAVE');
assert.equal(readAscii(12, 4), 'fmt ');
assert.equal(view.getUint16(20, true), 1, 'WAV debe ser PCM');
assert.equal(view.getUint16(22, true), 1, 'WAV debe ser mono');
assert.equal(view.getUint32(24, true), 16_000);
assert.equal(view.getUint16(34, true), 16);
assert.equal(readAscii(36, 4), 'data');
assert.equal(view.getUint32(40, true), samples.length * 2);
assert.deepEqual(
  Array.from({ length: samples.length }, (_, index) => view.getInt16(44 + index * 2, true)),
  [-32768, -16384, 0, 16384, 32767]
);

console.log('PASS: WAV PCM16 mono tiene cabecera, frecuencia y muestras correctas.');
