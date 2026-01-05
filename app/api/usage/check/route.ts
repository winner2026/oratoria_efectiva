export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getUserPlan } from "@/lib/usage/getUserPlan";
import { checkUsage } from "@/lib/usage/checkUsage";
import {
  generateFingerprint,
  getClientIP,
  normalizeUserAgent,
} from "@/lib/fingerprint/generateFingerprint";

/**
 * Check if user has reached their usage limit
 *
 * Used by frontend to determine if user can perform another analysis
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    // 🔐 GENERAR FINGERPRINT ROBUSTO
    // Preferencia: userId de localStorage
    // Fallback: hash(IP + User-Agent) para modo incógnito
    const ip = getClientIP(req.headers, (req as { ip?: string }).ip);
    const userAgent = normalizeUserAgent(req.headers.get('user-agent'));
    const fingerprint = generateFingerprint(userId, ip, userAgent);

    console.log('[USAGE CHECK] Fingerprint:', fingerprint);

    const usageCheck = await checkUsage(fingerprint);
    const plan = await getUserPlan(fingerprint);

    return NextResponse.json({
      limitReached: !usageCheck.allowed,
      reason: usageCheck.reason,
      currentUsage: usageCheck.currentUsage,
      maxAllowed: usageCheck.maxAllowed,
      resetsAt: usageCheck.resetsAt,
      plan: plan,
    });
  } catch (error) {
    console.error("[USAGE CHECK API] Error:", error);
    return NextResponse.json(
      { error: "Failed to check usage" },
      { status: 500 }
    );
  }
}
