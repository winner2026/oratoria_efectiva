import { UsageCheckResult } from "@/types/Usage";
import { FREE_PLAN } from "@/lib/plans/free";
import { db } from "@/infrastructure/db/client";

/**
 * Check if a Free user can perform another analysis
 *
 * Free plan allows 3 total analyses.
 * After that, user must upgrade to Premium.
 */
export async function checkFreeUsage(
  userId: string
): Promise<UsageCheckResult> {
  try {
    const result = await db.query(
      `SELECT total_analyses FROM usage WHERE user_id = $1`,
      [userId]
    );

    const currentUsage = result.rows[0]?.total_analyses || 0;
    const maxAllowed = FREE_PLAN.features.maxAnalyses!;

    if (currentUsage >= maxAllowed) {
      return {
        allowed: false,
        reason: "FREE_LIMIT_REACHED",
        currentUsage,
        maxAllowed,
      };
    }

    return {
      allowed: true,
      currentUsage,
      maxAllowed,
    };
  } catch (error) {
    console.error("[CHECK_FREE_USAGE] Error:", error);
    // In case of DB error, allow the request (fail open)
    // But log it for monitoring
    return {
      allowed: true,
      currentUsage: 0,
      maxAllowed: FREE_PLAN.features.maxAnalyses!,
    };
  }
}
