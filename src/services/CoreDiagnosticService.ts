
import { CoreLayer, CoreMetric, CoreProfile } from './CoreSystem';

const METRIC_STORAGE_KEY = 'core_metrics_log';

export class CoreDiagnosticService {
  
  private static instance: CoreDiagnosticService;

  private constructor() {}

  public static getInstance(): CoreDiagnosticService {
    if (!CoreDiagnosticService.instance) {
      CoreDiagnosticService.instance = new CoreDiagnosticService();
    }
    return CoreDiagnosticService.instance;
  }

  // --- Ingestion ---

  public ingest(metric: Omit<CoreMetric, 'id' | 'timestamp'>): void {
    const fullMetric: CoreMetric = {
      ...metric,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    console.log(`[CORE Scan] Ingesting metric: ${metric.metricType} from ${metric.sourceExerciseId} -> Value: ${metric.value}`);
    this.saveMetric(fullMetric);
  }

  private saveMetric(metric: CoreMetric): void {
    if (typeof window === 'undefined') return;

    try {
        const raw = localStorage.getItem(METRIC_STORAGE_KEY);
        const history: CoreMetric[] = raw ? JSON.parse(raw) : [];
        history.push(metric);
        
        // Keep last 50 metrics to prevent bloat
        if (history.length > 50) history.shift();
        
        localStorage.setItem(METRIC_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save CORE metric", e);
    }
  }

  // --- Diagnostic Generation ---

  public generateProfile(): CoreProfile {
    // Default Empty Profile
    const profile: CoreProfile = {
      lastScan: Date.now(),
      layers: {
        'RITMO': { score: 0, status: 'STABLE', metrics: [] },
        'EJECUCION': { score: 0, status: 'STABLE', metrics: [] },
        'INTEGRACION': { score: 0, status: 'STABLE', metrics: [] }
      },
      diagnostics: []
    };

    if (typeof window === 'undefined') return profile;

    const raw = localStorage.getItem(METRIC_STORAGE_KEY);
    if (!raw) return profile;

    const history: CoreMetric[] = JSON.parse(raw);
    if (history.length === 0) return profile;

    // Aggregate by Layer
    const recentHistory = history.filter(m => Date.now() - m.timestamp < 1000 * 60 * 60 * 24 * 7); // Last 7 days

    profile.layers.RITMO = this.calculateLayerScore(recentHistory, 'RITMO');
    profile.layers.EJECUCION = this.calculateLayerScore(recentHistory, 'EJECUCION');
    profile.layers.INTEGRACION = this.calculateLayerScore(recentHistory, 'INTEGRACION');

    profile.diagnostics = this.generateDiagnostics(profile);

    console.log("[CORE Scan] Profile Generated:", profile);
    return profile;
  }

  private calculateLayerScore(metrics: CoreMetric[], layer: CoreLayer) {
    const layerMetrics = metrics.filter(m => m.layer === layer);
    
    if (layerMetrics.length === 0) {
        return { score: 50, status: 'STABLE' as const, metrics: [] };
    }

    // Normalized Score Calculation (simplified for MVP)
    let totalScore = 0;
    layerMetrics.forEach(m => {
        let normalized = 50;
        
        // --- RITMO ---
        if (m.metricType === 'WPM') {
             // Ace: 130-160 is good (100), <100 or >190 is bad (0)
             if (m.value >= 130 && m.value <= 170) normalized = 100;
             else if (m.value > 90 && m.value < 130) normalized = 70;
             else normalized = 40;
        }

        // --- FLOW / STABILITY ---
        if (m.metricType === 'FLOW' || m.metricType === 'STABILITY') {
             // Assuming value is 0-100 or time based.
             // If Flow (Seconds survived in improv): 60s = 100pts
             if (m.rawUnit === 'seconds' && m.value >= 60) normalized = 100;
             else if (m.rawUnit === 'seconds') normalized = (m.value / 60) * 100;
             else normalized = m.value; // Assume direct score
        }

        // --- CLARITY / ACCURACY ---
        if (m.metricType === 'ACCURACY') {
             normalized = m.value;
        }

        totalScore += normalized;
    });

    const avg = Math.round(totalScore / layerMetrics.length);
    
    let status: 'CRITICAL' | 'STABLE' | 'OPTIMAL' = 'STABLE';
    if (avg < 50) status = 'CRITICAL';
    if (avg >= 80) status = 'OPTIMAL';

    return {
        score: avg,
        status,
        metrics: layerMetrics
    };
  }

  private generateDiagnostics(profile: CoreProfile): string[] {
      const diags: string[] = [];

      if (profile.layers.RITMO.status === 'CRITICAL') diags.push("Inconsistencia en Velocidad (Ritmo).");
      if (profile.layers.EJECUCION.status === 'CRITICAL') diags.push("Falla en Articulación/Claridad.");
      if (profile.layers.INTEGRACION.status === 'CRITICAL') diags.push("Baja resistencia bajo presión (Integración).");

      if (diags.length === 0) diags.push("Sistema nominal. Sin desviaciones críticas.");

      return diags;
  }

  public clearHistory() {
      if (typeof window !== 'undefined') localStorage.removeItem(METRIC_STORAGE_KEY);
  }
}
