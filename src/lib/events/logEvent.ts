/**
 * Event logging - MVP
 *
 * No es analytics. Es una afirmación verificable:
 * "El usuario hizo X durante Y segundos en Z contexto"
 *
 * Eventos mínimos:
 * - recording_started
 * - recording_completed
 * - recording_abandoned
 * - playback_started
 * - playback_completed
 * - analysis_viewed
 * - analysis_section_engaged
 * - cta_retake_clicked
 * - free_limit_reached
 */

export type EventName =
  | "recording_started"
  | "recording_completed"
  | "recording_abandoned"
  | "early_abandonment"
  | "playback_started"
  | "playback_completed"
  | "proceeded_to_analysis"
  | "analysis_viewed"
  | "analysis_section_viewed"
  | "analysis_section_engaged"
  | "decision_revisited"
  | "cta_retake_clicked"
  | "cta_analyze_clicked"
  | "free_limit_reached";

export type EventMetadata = {
  duration?: number;
  section?: string;
  time?: number;
  [key: string]: any;
};

/**
 * Log an event (client-side)
 *
 * Sends event to API for server-side persistence
 */
export async function logEvent(
  event: EventName,
  metadata: EventMetadata = {}
): Promise<void> {
  try {
    // Get userId from localStorage
    const userId = localStorage.getItem("oratoria_user_id");
    if (!userId) {
      console.warn("[EVENT] No userId found, skipping event:", event);
      return;
    }

    // Log locally for debugging
    console.log(`[EVENT] ${event}`, metadata);

    // Send to API (fire and forget, non-blocking)
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        event,
        metadata,
      }),
    }).catch((error) => {
      console.error("[EVENT] Failed to log event:", error);
    });
  } catch (error) {
    console.error("[EVENT] Error logging event:", error);
  }
}
