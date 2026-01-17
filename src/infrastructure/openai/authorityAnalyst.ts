import OpenAI from 'openai';
import { ADSInput, ADSOutput, ADSInputMetrics } from '@/domain/authority/ADS/types';
import { normalizeMetricsForAnalyst } from '@/domain/authority/ADS/rules';

const SYSTEM_PROMPT = `
Eres un analista de performance vocal ejecutiva.
No motivas.
No das consejos genéricos.
Solo interpretas métricas dentro de rangos definidos.

ESTÁS INTEGRADO EN UN SISTEMA HÍBRIDO.
Tu salida se validará contra métricas duras. Si contradices la data, el sistema rechazará tu juicio.

FUNCIONES:
1. Mapear métricas -> patrones conocidos.
2. Explicar impacto ejecutivo (Estatus, Credibilidad, Dominio).
3. Detectar 'Risk Flags' si los valores son extremos.

NO HAGAS ESTO:
- No inventes causas no observables en la transcripción o métricas.
- No cambies los umbrales numéricos dados.
- No uses lenguaje de "coaching" ("tú puedes", "ánimo"). Usa lenguaje técnico/descriptivo.

FORMATO DE SALIDA (JSON Obligatorio):
{
  "decision_allowed": true,
  "confidence": "high" | "medium" | "low",
  "authority_score": "LOW" | "MEDIUM" | "HIGH",
  "signal_breakdown": {
    "strengths": ["string"],
    "weaknesses": ["string"]
  },
  "risk_flags": [
    "UPWARD_INFLECTION",
    "MONOTONE",
    "RUSHING",
    "LOW_ENERGY"
  ],
  "recommended_protocol": [
    "BREATHING_SSSS",
    "POWER_STATEMENT",
    "PAUSE_CONTROL"
  ],
  "hitl_required": false
}

SI LA DATA ES INSUFICIENTE O DE MALA CALIDAD:
Set "decision_allowed": false, "reason": "...", "next_action": "RECORD_AGAIN".
`;

function buildUserPrompt(input: ADSInput): string {
    const normalized = normalizeMetricsForAnalyst(input.metrics);
    const context = input.user_context;

    return `
CONTEXTO DE USUARIO:
Perfil: ${context.experience_level}
Caso de Uso: ${context.use_case}
Idioma: ${context.language}

METRICAS (NORMALIZADAS):
- WPM: ${input.metrics.wpm} (${normalized.wpm})
- Pausas: Ratio ${input.metrics.pause_ratio} (${normalized.pause_ratio})
- Muletillas: ${input.metrics.filler_rate} (${normalized.filler_rate})
- Pitch Variance: ${input.metrics.pitch_variance} (${normalized.pitch_variance})
- Energía: ${input.metrics.energy_stability} (${normalized.energy_stability})

TRANSCRIPCIÓN:
"${input.transcript}"

TAREA:
Analiza si este audio proyecta AUTORIDAD EJECUTIVA.
Asigna Score (LOW/MEDIUM/HIGH) basándote estrictamente en si las métricas caen en rangos óptimos.
Identifica banderas rojas (Risk Flags).
Recomienda 1 protocolo de corrección si es necesario.
`;
}

export async function runAuthorityAnalyst(input: ADSInput): Promise<ADSOutput> {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout, fast decision

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: buildUserPrompt(input) }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1, // Low temperature for deterministic behavior
            max_tokens: 500,
        }, { signal: controller.signal });

        const content = response.choices[0]?.message?.content ?? "{}";
        const result = JSON.parse(content) as ADSOutput;
        
        // Ensure default values if LLM omits them
        return {
            decision_allowed: result.decision_allowed ?? true,
            confidence: result.confidence ?? 'medium',
            authority_score: result.authority_score ?? 'LOW',
            signal_breakdown: {
                strengths: result.signal_breakdown?.strengths ?? [],
                weaknesses: result.signal_breakdown?.weaknesses ?? []
            },
            risk_flags: result.risk_flags ?? [],
            recommended_protocol: result.recommended_protocol ?? [],
            hitl_required: result.hitl_required ?? false
        };

    } catch (error) {
        console.error('[ADS] Analyst Error:', error);
        return {
            decision_allowed: false,
            reason: 'LLM_SERVICE_ERROR',
            next_action: 'CONTACT_SUPPORT'
        };
    } finally {
        clearTimeout(timeout);
    }
}
