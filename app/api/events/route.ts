export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/infrastructure/db/client";

/**
 * Events API - MVP
 *
 * Guarda eventos verificables, no analytics.
 * Simple, rápido, sin procesamiento.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, event, metadata } = await req.json();

    if (!userId || !event) {
      return NextResponse.json(
        { error: "userId and event are required" },
        { status: 400 }
      );
    }

    // Guardar evento en DB
    await db.query(
      `INSERT INTO events (user_id, event, metadata, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [userId, event, JSON.stringify(metadata || {})]
    );

    console.log(`[EVENT] ${event} logged for user ${userId.substring(0, 8)}...`);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[EVENTS API] Error:", error);
    return NextResponse.json(
      { error: "Failed to log event" },
      { status: 500 }
    );
  }
}
