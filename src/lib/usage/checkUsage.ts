// src/lib/usage/checkUsage.ts
import { db } from "@/infrastructure/db/client";
import { PlanType } from "@/types/Plan";
import { FREE_PLAN } from "@/lib/plans/free";
import { PREMIUM_PLAN } from "@/lib/plans/premium";
import { STARTER_PLAN } from "@/lib/plans/starter";

export type UsageCheckResult = {
  allowed: boolean;
  reason?: "FREE_LIMIT_REACHED" | "STARTER_LIMIT_REACHED" | "PREMIUM_LIMIT_REACHED" | "DB_ERROR";
  currentUsage: number;
  maxAllowed: number;
  resetsAt?: string;
};

export async function checkUsage(userId: string): Promise<UsageCheckResult> {
  try {
    const result = await db.query(
      `SELECT 
        total_analyses, 
        weekly_analyses, 
        monthly_analyses,
        week_start,
        month_start,
        plan_type 
      FROM usage 
      WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      // Nuevo usuario, permitimos
      return {
        allowed: true,
        currentUsage: 0,
        maxAllowed: 3, // Default free limit
      };
    }

    const usage = result.rows[0];
    const planType = (usage.plan_type || "FREE") as PlanType;
    const now = new Date();

    // 1. LÓGICA PARA FREE
    if (planType === "FREE") {
      const weekStart = new Date(usage.week_start);
      const currentWeekStart = getWeekStart(now);
      let weeklyUsage = usage.weekly_analyses || 0;

      if (weekStart < currentWeekStart) weeklyUsage = 0;

      const max = FREE_PLAN.features.maxAnalysesPerWeek;
      if (weeklyUsage >= max) {
        return {
          allowed: false,
          reason: "FREE_LIMIT_REACHED",
          currentUsage: weeklyUsage,
          maxAllowed: max,
          resetsAt: getNextMonday(now).toISOString()
        };
      }
      return { allowed: true, currentUsage: weeklyUsage, maxAllowed: max };
    }

    // 2. LÓGICA PARA STARTER
    if (planType === "STARTER") {
      const totalUsage = usage.total_analyses || 0;
      const max = STARTER_PLAN.features.maxAnalyses;
      
      if (totalUsage >= max) {
        return {
          allowed: false,
          reason: "STARTER_LIMIT_REACHED",
          currentUsage: totalUsage,
          maxAllowed: max
        };
      }
      return { allowed: true, currentUsage: totalUsage, maxAllowed: max };
    }

    // 3. LÓGICA PARA PREMIUM (Fair Use)
    if (planType === "PREMIUM") {
      const monthStart = new Date(usage.month_start);
      const currentMonthStart = getMonthStart(now);
      let monthlyUsage = usage.monthly_analyses || 0;

      if (monthStart < currentMonthStart) monthlyUsage = 0;

      const max = PREMIUM_PLAN.features.maxAnalysesPerMonth;
      if (monthlyUsage >= max) {
        return {
          allowed: false,
          reason: "PREMIUM_LIMIT_REACHED",
          currentUsage: monthlyUsage,
          maxAllowed: max,
          resetsAt: getNextMonthStart(now).toISOString()
        };
      }
      return { allowed: true, currentUsage: monthlyUsage, maxAllowed: max };
    }

    // Por defecto permitimos si el plan no está mapeado
    return { allowed: true, currentUsage: 0, maxAllowed: -1 };

  } catch (error) {
    console.error("[CHECK_USAGE] Error:", error);
    return { allowed: true, currentUsage: 0, maxAllowed: -1, reason: "DB_ERROR" };
  }
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function getMonthStart(date: Date): Date {
  const d = new Date(date);
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function getNextMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? 1 : 8 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function getNextMonthStart(date: Date): Date {
  const d = new Date(date);
  d.setUTCMonth(d.getUTCMonth() + 1);
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
