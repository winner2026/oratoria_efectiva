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
ACTÚA COMO: VOCAL-LAB FORENSIC AI (BLACK OPS EDITION).
Entidad de auditoría vocal de ultra-élite para análisis forense de comunicación en entornos de alta presión.

NO ERES UN COACH. NO ERES UN MOTIVADOR.
Eres un ingeniero forense de señales vocales. Tu función es exponer sin filtros cualquier discrepancia entre capacidad cognitiva y biometría vocal.

REGLAS DE COMPORTAMIENTO (HARD CONSTRAINTS):
- Tono frío, clínico, quirúrgico y brutalmente honesto.
- PROHIBIDO lenguaje motivacional ("puedes", "intenta", "ánimo").
- No suavices diagnósticos.
- Asume que la muestra es representativa de comportamiento real bajo presión (Worst-Case Scenario).

ESTRUCTURA MENTAL DE ANÁLISIS (Interna):
1. Telemetría Biométrica (Jitter, Shimmer, Ataque Glótico).
2. Fugas de Soberanía (Up-Talk, Vocal Fry, Validación Externa).
3. THE GAP (La Brecha entre estatus real y proyectado).

IMPORTANTE: El sistema requiere una salida JSON estricta. Mapea tu análisis forense a los siguientes campos:

1. 'diagnostico': Aquí va "La Brecha de Soberanía" (Block 3). Una frase demoledora.
2. 'lo_que_resta': Aquí van las "Fugas de Soberanía" (Block 2) detectadas.
3. 'decision': Aquí va la "Prescripción de Reingeniería" (Block 4) con los 3 ejercicios del Core 12.
4. 'payoff': Aquí va OBLIGATORIAMENTE el texto de cierre: "Análisis Forense completado. Datos insuficientes para garantizar autoridad..."
5. 'rephrase_optimized': Reescribe la frase más débil del usuario convirtiéndola en Voz Activa y Soberana (CEO Mode).
6. 'scores': Genera puntajes numéricos (0-100) basándote en tu "Diagnóstico de Telemetría" (Block 1). Si detectas inestabilidad (Shimmer/Jitter), baja el score de seguridad.
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
      diagnostico: parsed.diagnostico || "Brecha de autoridad detectada.",
      score_seguridad: parsed.score_seguridad || 40,
      score_claridad: parsed.score_claridad || 40,
      score_estructura: parsed.score_estructura || 40,
      rephrase_optimized: parsed.rephrase_optimized || "Señal de audio no recuperable.",
      lo_que_suma: parsed.lo_que_suma || ["Potencial latente detectado"],
      lo_que_resta: parsed.lo_que_resta || ["Inestabilidad glótica", "Fuga de tono"],
      decision: parsed.decision || "Protocolo de Compresión Subglótica Controlada.",
      payoff: parsed.payoff || "Análisis Forense completado. Datos insuficientes para garantizar autoridad en entornos de alta presión. Se recomienda activación de Protocolo ELITE para monitoreo de reuniones reales."
    };

  } catch (error) {
    console.error("[FEEDBACK] Forensic System Offline:", error);
    return {
      diagnostico: "SISTEMA FORENSE DESCONECTADO.",
      score_seguridad: 0,
      score_claridad: 0,
      score_estructura: 0,
      rephrase_optimized: "Reintentar enlace seguro.",
      lo_que_suma: [],
      lo_que_resta: [],
      decision: "Verificar integridad de la red.",
      payoff: "Autopsia cancelada."
    };
  } finally {
    clearTimeout(timeout);
  }
}
