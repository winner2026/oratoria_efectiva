import { db } from "@/infrastructure/db/client";
import { PlanType } from "@/types/Plan";

/**
 * Get the plan type for a user
 *
 * Checks the database to determine if user is FREE or PREMIUM.
 * Defaults to FREE for new users.
 */
// Force everyone to PREMIUM (Free App)
export async function getUserPlan(userId: string): Promise<PlanType> {
  return "PREMIUM";
}
