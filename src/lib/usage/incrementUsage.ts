import { db } from "@/infrastructure/db/client";
import { PlanType } from "@/types/Plan";

/**
 * Increment usage count for a user
 *
 * Tracks both total and weekly usage.
 * Weekly usage resets when week_start is older than current week.
 */
export async function incrementUsage(
  userId: string,
  planType: PlanType = "FREE"
): Promise<void> {
  console.log('[INCREMENT_USAGE] Starting for user:', userId);

  try {
    const now = new Date();
    const weekStart = getWeekStart(now);
    const monthStart = getMonthStart(now);

    // Upsert with weekly and monthly reset logic
    const result = await db.query(
      `INSERT INTO usage (
        user_id, 
        total_analyses, 
        weekly_analyses, 
        week_start, 
        monthly_analyses,
        month_start,
        plan_type, 
        created_at, 
        updated_at
      )
       VALUES ($1, 1, 1, $2, 1, $3, $4, NOW(), NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET
         total_analyses = usage.total_analyses + 1,
         weekly_analyses = CASE 
           WHEN usage.week_start < $2 THEN 1  -- New week, reset counter
           ELSE usage.weekly_analyses + 1     -- Same week, increment
         END,
         week_start = CASE 
           WHEN usage.week_start < $2 THEN $2  -- Update to current week
           ELSE usage.week_start               -- Keep existing
         END,
         monthly_analyses = CASE
           WHEN usage.month_start < $3 THEN 1  -- New month, reset counter
           ELSE usage.monthly_analyses + 1     -- Same month, increment
         END,
         month_start = CASE
           WHEN usage.month_start < $3 THEN $3  -- Update to current month
           ELSE usage.month_start               -- Keep existing
         END,
         plan_type = $4,
         updated_at = NOW()
       RETURNING user_id, total_analyses, weekly_analyses, monthly_analyses`,
      [userId, weekStart.toISOString(), monthStart.toISOString(), planType]
    );

    console.log('[INCREMENT_USAGE] Result:', result.rows[0]);
  } catch (error) {
    console.error("[INCREMENT_USAGE] Error:", error);
    throw error;
  }
}

/**
 * Get the start of the current month (1st of month 00:00:00 UTC)
 */
function getMonthStart(date: Date): Date {
  const d = new Date(date);
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the start of the current week (Monday 00:00:00 UTC)
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
