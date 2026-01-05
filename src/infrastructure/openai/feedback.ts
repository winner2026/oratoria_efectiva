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
  lo_que_suma: string[];
  lo_que_resta: string[];
  decision: string;
  payoff: string;
};

// 💰 CONTROL DE COSTOS MVP (Optimized)
const SYSTEM_PROMPT = `Eres un entrenador de oratoria de clase mundial (estilo TED Talk coach). Tu trabajo no es ser amable, es ser RADICALMENTE ÚTIL. 
Analizas la psicología detrás de la voz.

TU MISIÓN:
Encontrar la "Verdad Incómoda". ¿Suenal real o falso? ¿Seguro o aterrorizado? ¿Líder o seguidor?

INSTRUCCIONES DE ESTILO:
1. DIAGNÓSTICO: Debe ser un golpe a la mandíbula. Corto, profundo y memorable. (Ej: "Tu voz pide permiso antes de hablar" o "Tienes el ritmo de un metrónomo roto").
2. SIN RELLENO: No uses palabras corporativas vacías. Sé humano, directo y visceral.
3. CITA EVIDENCIA: Si dices que es repetitivo, dime QUÉ palabra repitió. Si dices que duda, dime DÓNDE.

FORMATO JSON EN ESPAÑOL NEUTRO.`;

function buildUserPrompt(input: DynamicFeedbackInput): string {
  return `TRANSCRIPCIÓN DEL USUARIO:
"""
${input.transcript}
"""

DATOS DUROS (MÉTRICAS):
- Velocidad: ${input.metrics.wordsPerMinute} PPM (Ideal: 130-150. <100 es aburrido, >160 es atropellado).
- Pausas Totales: ${input.metrics.pauseCount}.
- Pausas Estratégicas (>0.5s): ${input.metrics.strategicPauses} (El silencio es poder).
- Silencios Incómodos (>2s): ${input.metrics.awkwardSilences} (Mata la credibilidad).
- Entonación Descendente (Sentencias Finales): ${input.metrics.fallingIntonationScore ?? 'N/A'}% (Alto=Autoridad, Bajo=Pregunta/Duda).
- Variedad Tonal (Pitch Range): ${input.metrics.pitchRange ?? 'N/A'} Hz (Bajo=Monótono/Robot).
- Consistencia Rítmica: ${Math.round(input.metrics.rhythmConsistency * 100)}%.

VICIOS DETECTADOS:
- Muletillas (eh, este, mmm): ${input.metrics.fillerCount}.
- Repeticiones: ${input.metrics.repetitionCount}.
- Frases Kilométricas: ${input.metrics.longSentences} (Dificultan la comprensión).

TAREA DE ANÁLISIS PROFUNDO:
1. Cruza la "Entonación Descendente" con las "Muletillas". Si ambos fallan, el diagnóstico es INSEGURIDAD SEVERA.
2. Si la velocidad es alta y hay pocas pausas, el diagnóstico es ANSIEDAD/PRISA.
3. Si el rango tonal es bajo, el diagnóstico es ABURRIMIENTO/MONOTONÍA.

OUTPUT JSON ESPERADO:
{
  "diagnostico": "Una frase sentencia (máx 10 palabras) que defina su proyección actual.",
  "score_seguridad": 1-100 (Castiga severamente la duda y el tono ascendente final),
  "score_claridad": 1-100 (Castiga frases largas y muletillas),
  "lo_que_suma": ["Punto fuerte 1 (Cita algo específico)", "Punto fuerte 2"],
  "lo_que_resta": ["Punto débil 1 (Sé duro)", "Punto débil 2"],
  "decision": "La ÚNICA acción técnica más importante para corregir esto AHORA MISMO.",
  "payoff": "El beneficio emocional/social inmediato de corregirlo."
}`;
}

export async function generateDynamicFeedback(
  input: DynamicFeedbackInput
): Promise<DynamicFeedbackOutput> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15 segundos

  console.log('[FEEDBACK] Generating dynamic feedback with GPT-4o-mini...');

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
        max_tokens: 400, // 🛡️ Limitar output para control de costos
      },
      {
        signal: controller.signal,
      }
    );

    console.log('[FEEDBACK] ✓ Tokens used:', response.usage?.total_tokens || 'unknown');
    console.log('[FEEDBACK] ✓ Cost estimate: $', ((response.usage?.total_tokens || 0) / 1000000 * 0.20).toFixed(6));

    const content = response.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as DynamicFeedbackOutput;

    // Validar que tenga los campos requeridos
    if (
      !parsed.diagnostico ||
      typeof parsed.score_seguridad !== 'number' ||
      typeof parsed.score_claridad !== 'number' ||
      !parsed.lo_que_suma ||
      !parsed.lo_que_resta ||
      !parsed.decision ||
      !parsed.payoff
    ) {
      throw new Error("Respuesta incompleta del modelo");
    }

    return parsed;
  } catch (error) {
    console.error("[FEEDBACK] Error generando feedback dinámico:", error);

    // Fallback en caso de error
    return {
      diagnostico:
        "No pudimos generar un análisis personalizado en este momento.",
      score_seguridad: 50,
      score_claridad: 50,
      lo_que_suma: ["Completaste la grabación correctamente"],
      lo_que_resta: ["Intenta hablar con más naturalidad"],
      decision:
        "Intenta grabar de nuevo hablando como lo harías en una conversación real.",
      payoff: "Así podremos darte un feedback más preciso.",
    };
  } finally {
    clearTimeout(timeout);
  }
}
