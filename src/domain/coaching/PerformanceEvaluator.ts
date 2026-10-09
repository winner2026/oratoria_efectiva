export type MetricDirection = 'HIGHER_BETTER' | 'LOWER_BETTER' | 'RANGE_BOUND';

export type PerformanceMetricConfig = {
  metricKey: string;
  label: string;
  direction: MetricDirection;
  idealMin?: number;
  idealMax?: number;
  targetValue?: number;
  tolerance?: number;
};

export type MetricPerformanceResult = {
  metricKey: string;
  actualValue: number;
  normalizedScore: number; // 0.0 (pésimo) a 1.0 (óptimo)
  bottleneckSeverity: number; // 0.0 (mínimo) a 1.0 (crítico)
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'DEVIATED';
  feedback: string;
};

export class PerformanceEvaluator {
  /**
   * Evalúa cualquier métrica bioacústica con direccionalidad matemática
   */
  static evaluateMetric(config: PerformanceMetricConfig, actualValue: number): MetricPerformanceResult {
    let normalizedScore = 1.0;
    let status: 'OPTIMAL' | 'ACCEPTABLE' | 'DEVIATED' = 'OPTIMAL';
    let feedback = '';

    if (config.direction === 'RANGE_BOUND') {
      const min = config.idealMin ?? 120;
      const max = config.idealMax ?? 155;

      if (actualValue >= min && actualValue <= max) {
        normalizedScore = 1.0;
        status = 'OPTIMAL';
        feedback = `${config.label} en rango óptimo (${actualValue}).`;
      } else if (actualValue > max) {
        const deviation = actualValue - max;
        normalizedScore = Math.max(0.0, 1.0 - deviation / 50);
        status = normalizedScore > 0.7 ? 'ACCEPTABLE' : 'DEVIATED';
        feedback = `${config.label} elevado (${actualValue}). Excede el límite óptimo de ${max}.`;
      } else {
        const deviation = min - actualValue;
        normalizedScore = Math.max(0.0, 1.0 - deviation / 40);
        status = normalizedScore > 0.7 ? 'ACCEPTABLE' : 'DEVIATED';
        feedback = `${config.label} por debajo del nivel óptimo (${actualValue}). Límite mínimo: ${min}.`;
      }
    } else if (config.direction === 'LOWER_BETTER') {
      const maxAllowed = config.targetValue ?? 2;
      if (actualValue <= maxAllowed) {
        normalizedScore = 1.0;
        status = 'OPTIMAL';
        feedback = `${config.label} excelente (${actualValue} dentro del máximo de ${maxAllowed}).`;
      } else {
        const excess = actualValue - maxAllowed;
        normalizedScore = Math.max(0.0, 1.0 - excess / 6);
        status = normalizedScore > 0.6 ? 'ACCEPTABLE' : 'DEVIATED';
        feedback = `Exceso en ${config.label} (${actualValue} detectadas). Límite sugerido: ${maxAllowed}.`;
      }
    } else if (config.direction === 'HIGHER_BETTER') {
      const target = config.targetValue ?? 0.8;
      if (actualValue >= target) {
        normalizedScore = 1.0;
        status = 'OPTIMAL';
        feedback = `${config.label} óptimo (${Math.round(actualValue * 100)}%).`;
      } else {
        normalizedScore = Math.max(0.0, actualValue / target);
        status = normalizedScore > 0.7 ? 'ACCEPTABLE' : 'DEVIATED';
        feedback = `${config.label} por debajo del objetivo (${Math.round(actualValue * 100)}%).`;
      }
    }

    const bottleneckSeverity = Number((1.0 - normalizedScore).toFixed(2));

    return {
      metricKey: config.metricKey,
      actualValue,
      normalizedScore: Number(normalizedScore.toFixed(2)),
      bottleneckSeverity,
      status,
      feedback,
    };
  }

  /**
   * SEPARACIÓN ARQUITECTÓNICA:
   * 1. Global Performance Index ("¿Cómo estoy?"): Índice compuesto ponderado.
   * 2. Primary Bottleneck Score ("¿Qué hago?"): Severidad aislada del mayor obstáculo.
   */
  static evaluateGlobalAndBottleneck(metrics: {
    wordsPerMinute: number;
    avgPauseDuration: number;
    pauseCount: number;
    fillerCount: number;
    energyStability: number;
  }) {
    const rWpm = this.evaluateMetric(
      { metricKey: 'wpm', label: 'Ritmo WPM', direction: 'RANGE_BOUND', idealMin: 120, idealMax: 155 },
      metrics.wordsPerMinute
    );

    const rFillers = this.evaluateMetric(
      { metricKey: 'fillers', label: 'Muletillas', direction: 'LOWER_BETTER', targetValue: 2 },
      metrics.fillerCount
    );

    const rEnergy = this.evaluateMetric(
      { metricKey: 'energy', label: 'Estabilidad de Energía', direction: 'HIGHER_BETTER', targetValue: 0.75 },
      metrics.energyStability
    );

    const rPause = this.evaluateMetric(
      { metricKey: 'pauses', label: 'Duración de Pausa', direction: 'RANGE_BOUND', idealMin: 0.5, idealMax: 2.5 },
      metrics.avgPauseDuration
    );

    const allMetrics = [rWpm, rFillers, rEnergy, rPause];

    // Global Index: Ponderación amplia de desempeño general
    const globalPerformanceIndex = Math.round(
      (rWpm.normalizedScore * 0.25 +
        rFillers.normalizedScore * 0.25 +
        rEnergy.normalizedScore * 0.25 +
        rPause.normalizedScore * 0.25) * 100
    );

    // Bottleneck Score: Selecciona la métrica con la severidad aislada más alta
    const primaryBottleneckMetric = [...allMetrics].sort((a, b) => b.bottleneckSeverity - a.bottleneckSeverity)[0];

    return {
      globalPerformanceIndex,
      primaryBottleneck: {
        metricKey: primaryBottleneckMetric.metricKey,
        label: primaryBottleneckMetric.feedback,
        severity: primaryBottleneckMetric.bottleneckSeverity,
      },
    };
  }
}
