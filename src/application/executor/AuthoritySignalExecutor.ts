import OpenAI from 'openai';

// 1. Definition of Types based on USER_REQUEST

export interface ExecutorContext {
  experience_level: 'junior' | 'mid' | 'senior' | 'executive';
  use_case: 'presentation' | 'sales' | 'leadership' | 'interview';
  language: 'es';
}

export interface ExecutorMetrics {
  wpm: number;
  pause_ratio: number;
  filler_rate: number;
  pitch_variance: number;
  energy_stability: number;
}

export interface ExecutorThresholds {
  wpm_optimal: [number, number];
  pause_ratio_optimal: [number, number];
  filler_rate_max: number;
  pitch_variance_min: number;
  energy_stability_min: number;
}

export interface ExecutorInput {
  task: "INTERPRET_VOCAL_AUTHORITY_SIGNALS";
  context: ExecutorContext;
  metrics: ExecutorMetrics;
  thresholds: ExecutorThresholds;
}

export type RiskFlag = 
  | 'UPWARD_INFLECTION' 
  | 'RUSHING' 
  | 'MONOTONE' 
  | 'LOW_ENERGY' 
  | 'OVER_CONTROLLED';

export type RecommendedProtocol = 
  | 'BREATHING_SSSS' 
  | 'POWER_STATEMENT' 
  | 'PAUSE_CONTROL' 
  | 'PITCH_RANGE' 
  | 'ENERGY_ANCHOR';

export interface ExecutorOutput {
  interpretable: boolean;
  signal_breakdown: {
    strengths: string[];
    weaknesses: string[];
  };
  risk_flags: RiskFlag[];
  recommended_protocol: RecommendedProtocol[];
  notes: string;
}

// 2. The SYSTEM PROMPT (Strict)
const SYSTEM_PROMPT = `You are an Executive Vocal Performance Analyst.

Your role is strictly LIMITED.

You do NOT motivate.
You do NOT teach theory.
You do NOT invent causes.
You do NOT change thresholds.
You do NOT output free text.

You ONLY:
- Interpret objective vocal metrics
- Map them to known executive communication patterns
- Identify observable strengths and weaknesses
- Flag risks that impact perceived authority

If information is insufficient or inconsistent, you must explicitly state it.

You operate under audit conditions.
Every claim must be directly grounded in provided metrics.`;

// 3. User Prompt Builder
function buildUserPrompt(input: ExecutorInput): string {
  // We format strictly as JSON string inside the prompt as requested by "Inbox Prompt" structure,
  // or we pass the object. The user showed a JSON block. We'll stringify it.
  return JSON.stringify(input, null, 2);
}

// 4. The Executor Function
export async function executeAuthoritySignalAnalysis(
  input: ExecutorInput
): Promise<ExecutorOutput> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

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
        temperature: 0.0, // Zero temp for maximum determinism
      },
      {
        signal: controller.signal,
      }
    );

    const content = response.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as Partial<ExecutorOutput>;

    // 5. Validation / Sanitization of Output
    // Ensure strict adherence to allowed enums and structure
    const safeOutput: ExecutorOutput = {
      interpretable: parsed.interpretable ?? false,
      signal_breakdown: {
        strengths: Array.isArray(parsed.signal_breakdown?.strengths) 
          ? parsed.signal_breakdown!.strengths.map(s => String(s)) 
          : [],
        weaknesses: Array.isArray(parsed.signal_breakdown?.weaknesses) 
          ? parsed.signal_breakdown!.weaknesses.map(s => String(s)) 
          : [],
      },
      risk_flags: (Array.isArray(parsed.risk_flags) ? parsed.risk_flags : [])
        .filter((flag): flag is RiskFlag => [
          'UPWARD_INFLECTION', 'RUSHING', 'MONOTONE', 'LOW_ENERGY', 'OVER_CONTROLLED'
        ].includes(flag as any)),
      recommended_protocol: (Array.isArray(parsed.recommended_protocol) ? parsed.recommended_protocol : [])
        .filter((proto): proto is RecommendedProtocol => [
          'BREATHING_SSSS', 'POWER_STATEMENT', 'PAUSE_CONTROL', 'PITCH_RANGE', 'ENERGY_ANCHOR'
        ].includes(proto as any)),
      notes: parsed.notes || ""
    };

    return safeOutput;

  } catch (error) {
    console.error('[Executor] Error executing analysis:', error);
    return {
      interpretable: false,
      signal_breakdown: { strengths: [], weaknesses: [] },
      risk_flags: [],
      recommended_protocol: [],
      notes: "System Error: Execution failed."
    };
  } finally {
    clearTimeout(timeout);
  }
}
