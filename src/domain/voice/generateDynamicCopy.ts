import { VoiceMetrics } from "./VoiceMetrics";

/**
 * Genera copy dinámico comparando sesión actual con anterior.
 *
 * Devuelve frases específicas sobre QUÉ cambió, no cuánto.
 * Ejemplos:
 * - "Hoy cerraste las frases con más intención que en tu grabación anterior."
 * - "Redujiste las muletillas respecto a la sesión pasada."
 * - "Tu voz se percibe más estable que hace 2 días."
 */
export function generateDynamicCopy(
  currentMetrics: VoiceMetrics,
  previousMetrics: VoiceMetrics | null
): string[] {
  // Si no hay sesión previa, no hay comparación
  if (!previousMetrics) {
    return [];
  }

  const improvements: string[] = [];

  // Comparación de muletillas
  if (currentMetrics.fillerCount < previousMetrics.fillerCount) {
    improvements.push(
      "Redujiste las muletillas respecto a la sesión pasada."
    );
  }

  // Comparación de estabilidad de energía (proxy para "cerrar frases con intención")
  if (currentMetrics.energyStability > previousMetrics.energyStability + 0.05) {
    improvements.push(
      "Hoy cerraste las frases con más intención que en tu grabación anterior."
    );
  }

  // Comparación de variación de tono (estabilidad de voz)
  const currentIsStable = currentMetrics.pitchVariation >= 0.15 && currentMetrics.pitchVariation <= 0.35;
  const previousIsStable = previousMetrics.pitchVariation >= 0.15 && previousMetrics.pitchVariation <= 0.35;

  if (currentIsStable && !previousIsStable) {
    improvements.push(
      "Tu voz se percibe más estable que en la sesión anterior."
    );
  }

  // Comparación de pausas (mejor uso del silencio)
  if (
    currentMetrics.avgPauseDuration >= 0.4 &&
    currentMetrics.avgPauseDuration > previousMetrics.avgPauseDuration
  ) {
    improvements.push(
      "Mejoraste el uso de pausas para dar énfasis."
    );
  }

  // Comparación de ritmo (acercamiento al rango ideal)
  const currentInIdealRange = currentMetrics.wordsPerMinute >= 110 && currentMetrics.wordsPerMinute <= 150;
  const previousInIdealRange = previousMetrics.wordsPerMinute >= 110 && previousMetrics.wordsPerMinute <= 150;

  if (currentInIdealRange && !previousInIdealRange) {
    improvements.push(
      "Encontraste un ritmo más natural que antes."
    );
  }

  // Si el usuario empeoró en algo importante, también podemos mencionarlo
  const regressions: string[] = [];

  if (currentMetrics.fillerCount > previousMetrics.fillerCount + 2) {
    regressions.push(
      "Aparecieron más muletillas que en la sesión anterior."
    );
  }

  if (currentMetrics.energyStability < previousMetrics.energyStability - 0.1) {
    regressions.push(
      "La energía fue menos constante que antes."
    );
  }

  // Devolver mejoras primero, luego regresiones (máximo 2 frases)
  return [...improvements, ...regressions].slice(0, 2);
}
