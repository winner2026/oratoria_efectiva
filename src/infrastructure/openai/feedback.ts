import type { VoiceMetrics } from "@/domain/voice/VoiceMetrics";
import OpenAI from "openai";

export type DynamicFeedbackInput = {
  transcript: string;
  metrics: VoiceMetrics;
  exerciseContext?: {
    id: string;
    title: string;
    goal: string;
    metrics: string[];
  };
};

export type DynamicFeedbackOutput = {
  diagnostico: string;
  score_seguridad: number;
  score_claridad: number;
  score_estructura: number;
  rephrase_optimized: string;
  lo_que_suma: string[];
  lo_que_resta: string[];
  decision: string;
  payoff: string;
};

// 🧬 PROMPT HACKER DEFINITIVO: BLACK OPS EDITION V4.0
const SYSTEM_PROMPT = `
ROL DEL SISTEMA
Eres CORE Scan™, un sistema de auditoría objetiva del desempeño comunicativo basado en el framework C.O.R.E.™.
No eres un coach, no evalúas liderazgo ni personalidad. Analizas señales técnicas medibles en audio de voz humana y reportas hallazgos de forma descriptiva y defendible.

CAPAS ANALIZABLES (AUDIO ONLY):
1. RITMO (WPM, Variabilidad, Distribución de Silencios)
2. EJECUCIÓN VOCAL (Claridad Fonética, Estabilidad, Continuidad)
3. INTEGRACIÓN TÉCNICA (Consistencia Rítmica, Coherencia)

REGLAS DE COMPORTAMIENTO:
- Tono profesional, clínico, preciso y neutral.
- Cero motivación. Cero juicio moral.
- Audita "cómo funciona" el sistema de comunicación, no "cómo es" la persona.
- Usa lenguaje técnico de ingeniería de audio y fonética.

INSTRUCCIÓN DE SALIDA (JSON):
Genera un objeto JSON estricto con los siguientes campos, mapeando tu análisis forense a esta estructura:

1. 'diagnostico': RESUMEN EJECUTIVO. Descripción técnica global del desempeño. Sin adjetivos emocionales. Enfócate en la eficiencia de la transmisión de la señal. (Máx 40 palabras).
2. 'lo_que_resta': DESVIACIONES / HALLAZGOS NEGATIVOS. Lista de patrones que se alejan de rangos funcionales (ej. "Aceleración final no controlada", "Micro-temblores en vocales abiertas", "Pausas erráticas").
3. 'lo_que_suma': INDICADORES / HALLAZGOS POSITIVOS. Lista de patrones técnicos sólidos (ej. "Estabilidad de tono sostenida", "Articulación precisa en consonantes").
4. 'decision': OPORTUNIDADES DE OPTIMIZACIÓN. Prescripciones técnicas precisas (ej. "Reducir WPM en cierres de frase para mantener consistencia").
5. 'score_seguridad': Puntaje (0-100) basado en la estabilidad vocal y ausencia de vacilaciones.
6. 'score_claridad': Puntaje (0-100) basado en la dicción y limpieza de la señal (sin muletillas).
7. 'score_estructura': Puntaje (0-100) basado en el ritmo, pausas lógicas y cierre de ideas.
8. 'rephrase_optimized': Toma la frase con peor desempeño técnico y reescríbela/optimízala para máxima contundencia y economía de palabras (Voz Activa).
9. 'payoff': Texto fijo de cierre: "Reporte CORE Scan™ generado. Métricas registradas en base de datos."
`;

function buildUserPrompt(input: DynamicFeedbackInput): string {
  const context = input.exerciseContext 
    ? `CONTEXTO TÁCTICO: Ejercicio "${input.exerciseContext.title}" (Objetivo: ${input.exerciseContext.goal})`
    : `CONTEXTO: Habla Espontánea (Proxy Acústico)`;

  return `
DATOS DE ENTRADA PARA AUTOPSIA:
"""
${input.transcript}
"""

TELEMETRÍA DE SENSORES (SIMULADA):
- WPM (Velocidad): ${input.metrics.wordsPerMinute}.
- Pausas (Silencios): ${input.metrics.pauseCount}.
- Inflexión Descendente: ${input.metrics.fallingIntonationScore ?? 0}%.
- Ruido de Señal (Muletillas): ${input.metrics.fillerCount}.
- Complejidad: ${input.metrics.longSentences} oraciones largas.

${context}

INSTRUCCIÓN DE SALIDA:
Genera el JSON final basándote estrictamente en tus REGLAS DE COMPORTAMIENTO.
Calcula los scores (seguridad/claridad/estructura) penalizando duramente cualquier señal de sumisión (Up-Talking, dudas, apología).
`;
}

export async function generateDynamicFeedback(
  input: DynamicFeedbackInput
): Promise<DynamicFeedbackOutput> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000); // 25s para análisis profundo

  console.log('[FEEDBACK] Running Black Ops Forensic Analysis...');

  try {
    const response = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: buildUserPrompt(input),
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.5, // Frío y preciso
        max_tokens: 800,
      },
      {
        signal: controller.signal,
      }
    );

    const content = response.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as DynamicFeedbackOutput;

    return {
      diagnostico: parsed.diagnostico || "Notamos algunos detalles que puedes mejorar fácilmente con práctica.",
      score_seguridad: parsed.score_seguridad || 40,
      score_claridad: parsed.score_claridad || 40,
      score_estructura: parsed.score_estructura || 40,
      rephrase_optimized: parsed.rephrase_optimized || "Intenta hablar con oraciones más cortas.",
      lo_que_suma: parsed.lo_que_suma || ["Tienes un buen volumen de voz"],
      lo_que_resta: parsed.lo_que_resta || ["Faltan pausas entre ideas"],
      decision: parsed.decision || "Practica hacer una pausa después de cada punto.",
      payoff: parsed.payoff || "Este es tu punto de partida. La práctica hace la diferencia."
    };

  } catch (error) {
    console.error("[FEEDBACK] Forensic System Offline:", error);
    return {
      diagnostico: "SISTEMA OFFLINE. No se pudo procesar la señal.",
      score_seguridad: 0,
      score_claridad: 0,
      score_estructura: 0,
      rephrase_optimized: "Reintentar análisis.",
      lo_que_suma: [],
      lo_que_resta: [],
      decision: "Verificar conexión de red.",
      payoff: "Reporte cancelado."
    };
  } finally {
    clearTimeout(timeout);
  }
}
