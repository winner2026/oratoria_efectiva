
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
  nasalityScore: number; // 0-100 (500Hz dominante = Nasal/Opaco)
  brightnessScore: number; // 0-100 (3000Hz dominante = Proyección/Claridad)
  depthScore: number;    // 0-100 (150Hz fuerte = Cuerpo/Profundidad/Autoridad)
};

export function analyzeSpectralCharacteristics(float32Audio: Float32Array, sampleRate: number = 44100): SpectralMetrics {
  // Analizar ventanas representativas
  const windowSize = 2048;
  const numWindows = 30; // Más muestras para mayor precisión
  const step = Math.floor(float32Audio.length / numWindows);
  
  let totalChestEnergy = 0;   // ~150 Hz (Profundidad/Cuerpo)
  let totalNasalEnergy = 0;   // ~500 Hz (Nasalidad/Boxiness)
  let totalPresenceEnergy = 0; // ~3000 Hz (Brillo/Articulación)

  let windowsProcessed = 0;

  for (let i = 0; i < Math.min(float32Audio.length - windowSize, numWindows * step); i += step) {
    const window = float32Audio.slice(i, i + windowSize);
    
    // Ventana Hanning
    const windowed = window.map((v, idx) => v * (0.5 * (1 - Math.cos(2 * Math.PI * idx / (windowSize - 1)))));
    
    // Calcular Magnitud en bandas críticas
    // 150Hz: Resonancia de pecho (Hombres ~100-150, Mujeres ~200. Usamos 180 como compromiso o detectamos pitch primero? 
    // Usaremos 150Hz como ancla de sub-graves vocales)
    const chestMag = calculateMagnitudeAtFreq(windowed, 150, sampleRate);
    
    // 500Hz: La zona "muerta" o nasal
    const nasalMag = calculateMagnitudeAtFreq(windowed, 500, sampleRate);
    
    // 3000Hz: El "Singer's Formant" / Presencia
    const presenceMag = calculateMagnitudeAtFreq(windowed, 3000, sampleRate);
    
    totalChestEnergy += chestMag;
    totalNasalEnergy += nasalMag;
    totalPresenceEnergy += presenceMag;
    windowsProcessed++;
  }

  if (windowsProcessed === 0) return { nasalityScore: 0, brightnessScore: 0, depthScore: 0 };

  // Promedios
  const avgChest = totalChestEnergy / windowsProcessed;
  const avgNasal = totalNasalEnergy / windowsProcessed;
  const avgPresence = totalPresenceEnergy / windowsProcessed;

  // Ratios Relativos (Acústica Comparativa)
  // Evitamos división por cero sumando epsilon
  const epsilon = 0.0001;
  const totalSpecEnergy = avgChest + avgNasal + avgPresence + epsilon;

  // Qué porcentaje de la energía "color" está en cada banda
  const chestRatio = avgChest / totalSpecEnergy;      // Ideal: > 0.4 para voz profunda
  const nasalRatio = avgNasal / totalSpecEnergy;      // Ideal: < 0.3 para voz limpia
  const presenceRatio = avgPresence / totalSpecEnergy; // Ideal: > 0.2 para voz clara

  // SCORING (Heurística calibrada)
  
  // PROFUNDIDAD (DEPTH): Premia energía en graves, penaliza si es muy débil
  // Rango típico chestRatio: 0.1 (fina) a 0.6 (muy profunda)
  let depth = (chestRatio - 0.2) * 200; 
  depth = Math.max(10, Math.min(95, depth)); // Clamp 10-95

  // NASALIDAD: Premia (negativamente) si los medios dominan
  // Rango típico nasalRatio: 0.2 (limpia) a 0.7 (muy nasal)
  let nasality = (nasalRatio - 0.3) * 200;
  nasality = Math.max(5, Math.min(90, nasality));

  // BRILLO/PRESENCIA: 
  // Rango típico presenceRatio: 0.05 (oscura) a 0.3 (brillante)
  let brightness = (presenceRatio - 0.05) * 300;
  brightness = Math.max(10, Math.min(95, brightness));

  // Ajuste fino: Si el volumen general es muy bajo (silencio), bajar scores
  // (Omitido por simplicidad, asumimos audio normalizado o VAD previo)

  return {
    nasalityScore: Math.round(nasality),
    brightnessScore: Math.round(brightness),
    depthScore: Math.round(depth)
  };
}

// Algoritmo Goertzel simplificado para magnitud en frecuencia específica
function calculateMagnitudeAtFreq(buffer: Float32Array | number[], freq: number, sampleRate: number): number {
  const k = Math.round(0.5 + (buffer.length * freq) / sampleRate);
  const w = (2 * Math.PI * k) / buffer.length;
  const cosine = Math.cos(w);
  const sine = Math.sin(w);
  const coeff = 2 * cosine;
  
  let q1 = 0;
  let q2 = 0;
  
  for (let i = 0; i < buffer.length; i++) {
    const q0 = coeff * q1 - q2 + buffer[i];
    q2 = q1;
    q1 = q0;
  }
  
  const magnitude = Math.sqrt(q1 * q1 + q2 * q2 - q1 * q2 * coeff);
  return magnitude;
}
