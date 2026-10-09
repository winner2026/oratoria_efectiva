export type FunnelEventType =
  | 'diagnostic_started'
  | 'diagnostic_completed'
  | 'diagnostic_result_viewed'
  | 'mission_started'
  | 'mission_completed'
  | 'second_session_completed'
  | 'third_session_completed'
  | 'conversion_to_paid';

export type CohortAttribution = {
  source: string;     // e.g. "youtube"
  campaign?: string;  // e.g. "video_7"
  content?: string;   // e.g. "miedo_hablar_publico"
  device?: string;    // e.g. "mobile" | "desktop"
};

export type FunnelEvent = {
  id: string;
  userId: string;
  eventType: FunnelEventType;
  timestampMs: number;
  attribution: CohortAttribution;
  metadata?: Record<string, any>;
};

export type PercentileMetric = {
  medianSeconds: number; // P50 (Mediana)
  p75Seconds: number;    // P75 (Percentil 75)
};

export type TtvMetrics = {
  ttv1: PercentileMetric; // Entrada -> Ver Resultado Inicial
  ttv2: PercentileMetric; // Entrada -> Iniciar Primera Misión
  ttv3: PercentileMetric; // Entrada -> Primera Mejora Demostrable (Δ >= 5 pts)
};

export type FunnelAnalyticsSummary = {
  totalDiagnosticStarts: number;
  totalDiagnosticCompletions: number;
  totalFirstMissionsStarted: number;
  totalFirstMissionsCompleted: number;
  totalSecondSessionsCompleted: number;
  
  // Ratios de Conversión
  diagnosticCompletionRate: number;
  firstMissionStartRate: number;
  firstMissionCompletionRate: number;
  activationRate: number;
  earlyRetentionSignal: number;

  ttv: TtvMetrics;
  attributionBreakdown: Record<string, { starts: number; completions: number; activationRate: number }>;
};

export const MINIMUM_MEANINGFUL_CHANGE = 5;

const memoryEvents: FunnelEvent[] = [];

function calculatePercentiles(valuesInSeconds: number[]): PercentileMetric {
  if (valuesInSeconds.length === 0) {
    return { medianSeconds: 0, p75Seconds: 0 };
  }

  const sorted = [...valuesInSeconds].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const medianSeconds = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const p75Index = Math.floor(sorted.length * 0.75);
  const p75Seconds = sorted[Math.min(p75Index, sorted.length - 1)];

  return {
    medianSeconds: Number(medianSeconds.toFixed(1)),
    p75Seconds: Number(p75Seconds.toFixed(1)),
  };
}

export class FunnelTracker {
  static trackEvent(params: {
    userId: string;
    eventType: FunnelEventType;
    source?: string;
    attribution?: CohortAttribution | string;
    timestampMs?: number;
    metadata?: Record<string, any>;
  }): FunnelEvent {
    let finalAttribution: CohortAttribution = { source: 'youtube', campaign: 'default_cta' };

    if (typeof params.attribution === 'string') {
      finalAttribution = { source: params.attribution };
    } else if (params.attribution && typeof params.attribution === 'object') {
      finalAttribution = params.attribution;
    } else if (params.source) {
      finalAttribution = { source: params.source };
    }

    const event: FunnelEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: params.userId,
      eventType: params.eventType,
      timestampMs: params.timestampMs || Date.now(),
      attribution: finalAttribution,
      metadata: params.metadata,
    };

    memoryEvents.push(event);
    return event;
  }

  static isMeaningfulImprovement(scoreBefore: number, scoreAfter: number): boolean {
    return (scoreAfter - scoreBefore) >= MINIMUM_MEANINGFUL_CHANGE;
  }

  static getAnalyticsSummary(): FunnelAnalyticsSummary {
    const starts = memoryEvents.filter((e) => e.eventType === 'diagnostic_started').length;
    const comps = memoryEvents.filter((e) => e.eventType === 'diagnostic_completed').length;
    const mStarts = memoryEvents.filter((e) => e.eventType === 'mission_started').length;
    const mComps = memoryEvents.filter((e) => e.eventType === 'mission_completed').length;
    const secondSessions = memoryEvents.filter((e) => e.eventType === 'second_session_completed').length;

    const diagnosticCompletionRate = starts > 0 ? Number(((comps / starts) * 100).toFixed(1)) : 0;
    const firstMissionStartRate = comps > 0 ? Number(((mStarts / comps) * 100).toFixed(1)) : 0;
    const firstMissionCompletionRate = mStarts > 0 ? Number(((mComps / mStarts) * 100).toFixed(1)) : 0;
    const activationRate = starts > 0 ? Number(((mComps / starts) * 100).toFixed(1)) : 0;
    const earlyRetentionSignal = mComps > 0 ? Number(((secondSessions / mComps) * 100).toFixed(1)) : 0;

    const ttv1Values: number[] = [];
    const ttv2Values: number[] = [];
    const ttv3Values: number[] = [];

    const userIds = Array.from(new Set(memoryEvents.map((e) => e.userId)));

    userIds.forEach((uId) => {
      const uEvents = memoryEvents.filter((e) => e.userId === uId).sort((a, b) => a.timestampMs - b.timestampMs);
      const startEvt = uEvents.find((e) => e.eventType === 'diagnostic_started');
      const resViewEvt = uEvents.find((e) => e.eventType === 'diagnostic_result_viewed');
      const mStartEvt = uEvents.find((e) => e.eventType === 'mission_started');
      const mCompEvt = uEvents.find((e) => e.eventType === 'mission_completed');

      if (startEvt && resViewEvt) {
        ttv1Values.push((resViewEvt.timestampMs - startEvt.timestampMs) / 1000);
      }
      if (startEvt && mStartEvt) {
        ttv2Values.push((mStartEvt.timestampMs - startEvt.timestampMs) / 1000);
      }
      if (startEvt && mCompEvt) {
        const delta = mCompEvt.metadata?.scoreDelta || 0;
        if (delta >= MINIMUM_MEANINGFUL_CHANGE) {
          ttv3Values.push((mCompEvt.timestampMs - startEvt.timestampMs) / 1000);
        }
      }
    });

    const attributionBreakdown: Record<string, { starts: number; completions: number; activationRate: number }> = {};
    memoryEvents.forEach((e) => {
      const campKey = `${e.attribution.source}:${e.attribution.campaign || 'direct'}`;
      if (!attributionBreakdown[campKey]) {
        attributionBreakdown[campKey] = { starts: 0, completions: 0, activationRate: 0 };
      }
      if (e.eventType === 'diagnostic_started') attributionBreakdown[campKey].starts++;
      if (e.eventType === 'mission_completed') attributionBreakdown[campKey].completions++;
    });

    Object.keys(attributionBreakdown).forEach((k) => {
      const item = attributionBreakdown[k];
      item.activationRate = item.starts > 0 ? Number(((item.completions / item.starts) * 100).toFixed(1)) : 0;
    });

    return {
      totalDiagnosticStarts: starts,
      totalDiagnosticCompletions: comps,
      totalFirstMissionsStarted: mStarts,
      totalFirstMissionsCompleted: mComps,
      totalSecondSessionsCompleted: secondSessions,
      diagnosticCompletionRate,
      firstMissionStartRate,
      firstMissionCompletionRate,
      activationRate,
      earlyRetentionSignal,
      ttv: {
        ttv1: calculatePercentiles(ttv1Values),
        ttv2: calculatePercentiles(ttv2Values),
        ttv3: calculatePercentiles(ttv3Values),
      },
      attributionBreakdown,
    };
  }
}
