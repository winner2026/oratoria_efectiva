
/**
 * Análisis Espectral para Detección de Cualidades Vocales
 * 
 * Implementación ligera de FFT (Fast Fourier Transform) para detectar:
 * 1. Brillo (Spectral Centroid) -> Claridad vs Opacidad
 * 2. Nasalidad (Band Energy Ratio) -> Energía atrapada en bajas freqs
 */

// Simple implementación de FFT para arrays de potencia de 2 (Cooley-Tukey)
// No necesitamos una librería externa si solo queremos info espectral básica
function fft(input: Float32Array): Float32Array {
  const n = input.length;
  if (n <= 1) return input;
  
  if ((n & (n - 1)) !== 0) {
    throw new Error("FFT size must be power of 2");
  }

  const even = new Float32Array(n / 2);
  const odd = new Float32Array(n / 2);
  
  for (let i = 0; i < n / 2; i++) {
    even[i] = input[2 * i];
    odd[i] = input[2 * i + 1];
  }

  const evenResult = fft(even);
  const oddResult = fft(odd);
  
  const result = new Float32Array(n * 2); // Real + Imaginary interleaved
  
  // Nota: Esta es una simplificación extrema para magnitud. 
  // Para producción real usaríamos una lib optimizada, pero para MVP de nasalidad
  // nos interesa la distribución de magnitud aproximada.
  // 
  // Mejor enfoque sin deps: Usar Goertzel para frecuencias específicas de interés
  // o simplemente calcular "Zero Crossing Rate" para brillo.
  // 
  // PERO, para hacerlo BIEN sin deps, implementaremos Energía por Bandas
  // usando filtros digitales simples (IIR) que es mucho más rápido y estable para JS puro.
  return input; 
}

// Enfoque robusto: Filtros Simples.
// Nasalidad = Mucha energía en ~250-400Hz (Murmullo nasal) y poca en >2000Hz

// Enfoque robusto: Filtros Simples.
type SpectralMetrics = {
  spectralBand1Score: number | null; // Índice heurístico de energía en banda baja; null si no medible
  spectralBand2Score: number | null; // Índice heurístico de energía en banda media; null si no medible
  spectralBand3Score: number | null; // Índice heurístico de energía en banda alta; null si no medible
};

export function calculateRMSStability(
  float32Audio: Float32Array, 
  sampleRate: number = 44100,
  segments: { start: number, end: number }[] = []
): number | null {
  // Ventana dinámica de 100ms según sampleRate real
  const windowSize = Math.floor(sampleRate * 0.1);
  const rmsWindows: { startTime: number, endTime: number, rms: number }[] = [];
  
  let peakRms = 0.001; 
  
  for (let i = 0; i < float32Audio.length; i += windowSize) {
    const currentWindowSize = Math.min(windowSize, float32Audio.length - i);
    let sumSq = 0;
    for (let j = 0; j < currentWindowSize; j++) {
      sumSq += float32Audio[i + j] * float32Audio[i + j];
    }
    const rms = Math.sqrt(sumSq / currentWindowSize);
    if (rms > peakRms) peakRms = rms;
    
    // Calcular tiempo exacto de la ventana, incluso la última parcial
    const startTime = i / sampleRate;
    const endTime = (i + currentWindowSize) / sampleRate;
    
    rmsWindows.push({ startTime, endTime, rms });
  }

  // Filtrar (VAD Híbrido)
  const noiseThreshold = peakRms * 0.05; 
  
  const validSegments = segments.filter(seg => 
    Number.isFinite(seg.start) && 
    Number.isFinite(seg.end) && 
    seg.start >= 0 &&
    seg.end > seg.start
  );
  
  // Sin evidencia temporal válida (Whisper no detectó habla o falló), no calcular la consistencia
  if (validSegments.length === 0) {
    return null;
  }
  
  const voiceRms = rmsWindows.filter(w => {
    if (w.rms <= noiseThreshold) return false;
    
    // Cruce real de intervalos (Ventana exacta vs Segmento ampliado por 100ms)
    // Solapamiento: w.startTime <= seg.end && w.endTime >= seg.start
    return validSegments.some(seg => 
      w.startTime <= (seg.end + 0.1) && 
      w.endTime >= (seg.start - 0.1)
    );
  });
  
  if (voiceRms.length < 3) return null; // Insuficiente evidencia de voz continua

  const meanRms = voiceRms.reduce((sum, w) => sum + w.rms, 0) / voiceRms.length;
  const variance = voiceRms.reduce((sum, w) => sum + Math.pow(w.rms - meanRms, 2), 0) / voiceRms.length;
  
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / meanRms;
  
  const stability = Math.max(0, 1 - (cv * 0.5)); 
  
  return Number(stability.toFixed(2));
}

export function analyzeSpectralCharacteristics(float32Audio: Float32Array, sampleRate: number = 44100): SpectralMetrics {
  const windowSize = 2048;
  const numWindows = 30;

  // Rechazar silencio digital/entrada esencialmente vacía en vez de puntuarlo.
  let peakAbs = 0;
  for (const sample of float32Audio) {
    if (!Number.isFinite(sample)) {
      return { spectralBand1Score: null, spectralBand2Score: null, spectralBand3Score: null };
    }
    const absSample = Math.abs(sample);
    if (absSample > peakAbs) peakAbs = absSample;
  }
  if (float32Audio.length < windowSize || peakAbs < 1e-4) {
    return { spectralBand1Score: null, spectralBand2Score: null, spectralBand3Score: null };
  }
  const step = Math.floor(float32Audio.length / numWindows);
  
  let totalChestEnergy = 0;
  let totalNasalEnergy = 0;
  let totalPresenceEnergy = 0;

  let windowsProcessed = 0;

  for (let i = 0; i < Math.min(float32Audio.length - windowSize, numWindows * step); i += step) {
    const window = float32Audio.slice(i, i + windowSize);
    const windowed = window.map((v, idx) => v * (0.5 * (1 - Math.cos(2 * Math.PI * idx / (windowSize - 1)))));
    
    const chestMag = calculateMagnitudeAtFreq(windowed, 150, sampleRate);
    const nasalMag = calculateMagnitudeAtFreq(windowed, 500, sampleRate);
    const presenceMag = calculateMagnitudeAtFreq(windowed, 3000, sampleRate);
    
    totalChestEnergy += chestMag;
    totalNasalEnergy += nasalMag;
    totalPresenceEnergy += presenceMag;
    windowsProcessed++;
  }

  if (windowsProcessed === 0) return { spectralBand1Score: null, spectralBand2Score: null, spectralBand3Score: null };

  const avgChest = totalChestEnergy / windowsProcessed;
  const avgNasal = totalNasalEnergy / windowsProcessed;
  const avgPresence = totalPresenceEnergy / windowsProcessed;

  const epsilon = 0.0001;
  const totalSpecEnergy = avgChest + avgNasal + avgPresence + epsilon;

  const chestRatio = avgChest / totalSpecEnergy;
  const nasalRatio = avgNasal / totalSpecEnergy;
  const presenceRatio = avgPresence / totalSpecEnergy;

  let depth = (chestRatio - 0.2) * 200; 
  depth = Math.max(10, Math.min(95, depth));

  let nasality = (nasalRatio - 0.3) * 200;
  nasality = Math.max(5, Math.min(90, nasality));

  let brightness = (presenceRatio - 0.05) * 300;
  brightness = Math.max(10, Math.min(95, brightness));

  return {
    spectralBand1Score: Math.round(depth),
    spectralBand2Score: Math.round(nasality),
    spectralBand3Score: Math.round(brightness)
  };
}

function calculateMagnitudeAtFreq(buffer: Float32Array | number[], freq: number, sampleRate: number): number {
  const k = Math.round(0.5 + (buffer.length * freq) / sampleRate);
  const w = (2 * Math.PI * k) / buffer.length;
  const cosine = Math.cos(w);
  const coeff = 2 * cosine;
  
  let q1 = 0;
  let q2 = 0;
  
  for (let i = 0; i < buffer.length; i++) {
    const q0 = coeff * q1 - q2 + buffer[i];
    q2 = q1;
    q1 = q0;
  }
  
  return Math.sqrt(q1 * q1 + q2 * q2 - q1 * q2 * coeff);
}
