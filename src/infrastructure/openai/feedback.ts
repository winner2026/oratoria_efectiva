import type { VoiceMetrics } from "@/domain/voice/VoiceMetrics";
import OpenAI from "openai";

export type DynamicFeedbackInput = {
  transcript: string;
  metrics: VoiceMetrics;
};

export type DynamicFeedbackOutput = {
  diagnostico: string;
  score_seguridad: number;
  score_claridad: number;
  score_estructura: number; // Nuevo KPI
  rephrase_optimized: string; // La "Versión Dorada" del discurso
  lo_que_suma: string[];
  lo_que_resta: string[];
  decision: string;
  payoff: string;
};

// 💰 CONTROL DE COSTOS MVP (Optimized)
const SYSTEM_PROMPT = `Eres un "Arquitecto de Mensajes" de elite y entrenador de oratoria estilo TED.
Tu trabajo tiene dos partes:
1. AUDITORÍA DE EJECUCIÓN: Analiza cómo lo dijo (voz, seguridad, vicios).
2. REINGENIERÍA DEL DISCURSO: Toma lo que intentó decir y reescríbelo para que sea IMPACTANTE, LÓGICO y PERSUASIVO.

TU MENTALIDAD:
- No seas amable, sé ÚTIL.
- Busca la "Verdad Incómoda".
- Si su estructura es caótica, destrúyela y constrúyela de nuevo.

FORMATO JSON EN ESPAÑOL NEUTRO.`;

function buildUserPrompt(input: DynamicFeedbackInput): string {
  return `TRANSCRIPCIÓN DEL USUARIO:
"""
${input.transcript}
"""

DATOS DUROS (MÉTRICAS):
- Velocidad: ${input.metrics.wordsPerMinute} PPM.
- Pausas Totales: ${input.metrics.pauseCount}.
- Entonación Descendente: ${input.metrics.fallingIntonationScore ?? 'N/A'}% (Alto=Autoridad).
- Muletillas: ${input.metrics.fillerCount}.
- Frases Largas: ${input.metrics.longSentences}.

TAREA 1: DIAGNÓSTICO DE ENTREGA
- Evalúa seguridad y claridad basándote en las métricas.
- Si hay muchas muletillas y tono ascendente -> Baja Seguridad.
- Si hay frases kilométricas -> Baja Claridad.

TAREA 2: REINGENIERÍA (EL VALOR ORO)
- Analiza la transcripción. ¿Tiene un punto central claro? ¿O divaga?
- Genera "rephrase_optimized": Reescribe su discurso en MÁXIMO 3 FRASES usando una estructura de poder (Gancho -> Razón -> Cierre o PREP).
- Debe sonar como el mismo usuario, pero en su mejor día posible (sin muletillas, con verbos fuertes).

OUTPUT JSON ESPERADO:
{
  "diagnostico": "Frase sentencia a la yugular (máx 10 palabras).",
  "score_seguridad": 1-100,
  "score_claridad": 1-100,
  "score_estructura": 1-100 (¿Su mensaje original tenía sentido lógico?),
  "rephrase_optimized": "Aquí pon la versión perfecta de su discurso. Corta, potente, memorable.",
  "lo_que_suma": ["Punto fuerte 1", "Punto fuerte 2"],
  "lo_que_resta": ["Errores críticos de ejecución o contenido"],
  "decision": "La acción técnica #1 para mejorar.",
  "payoff": "El beneficio de hacerlo."
}`;
}

export async function generateDynamicFeedback(
  input: DynamicFeedbackInput
): Promise<DynamicFeedbackOutput> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // 20s para dar tiempo a la creatividad

  console.log('[FEEDBACK] Generating dynamic feedback (Architect Mode) with GPT-4o-mini...');

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
        temperature: 0.7,
        max_tokens: 600, // Un poco más de margen para la reescritura
      },
      {
        signal: controller.signal,
      }
    );

    console.log('[FEEDBACK] ✓ Tokens used:', response.usage?.total_tokens || 'unknown');

    const content = response.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as DynamicFeedbackOutput;

    // Validación laxa para evitar errores en producción si la IA alucina un campo
    return {
      diagnostico: parsed.diagnostico || "Análisis completado",
      score_seguridad: parsed.score_seguridad || 50,
      score_claridad: parsed.score_claridad || 50,
      score_estructura: parsed.score_estructura || 50,
      rephrase_optimized: parsed.rephrase_optimized || "No pudimos optimizar tu texto esta vez.",
      lo_que_suma: parsed.lo_que_suma || [],
      lo_que_resta: parsed.lo_que_resta || [],
      decision: parsed.decision || "Sigue practicando",
      payoff: parsed.payoff || "Mejorarás con el tiempo"
    };

  } catch (error) {
    console.error("[FEEDBACK] Error generando feedback dinámico:", error);
    return {
      diagnostico: "Error de conexión con el coach.",
      score_seguridad: 0,
      score_claridad: 0,
      score_estructura: 0,
      rephrase_optimized: "Intenta de nuevo más tarde.",
      lo_que_suma: [],
      lo_que_resta: [],
      decision: "Verifica tu internet",
      payoff: "Para recibir tu análisis"
    };
  } finally {
    clearTimeout(timeout);
  }
}
