import { NextRequest, NextResponse } from "next/server";
import { getPreviousSession } from "@/application/tracking/getPreviousSession";
import { generateDynamicCopy } from "@/domain/voice/generateDynamicCopy";
import { VoiceMetrics } from "@/domain/voice/VoiceMetrics";

/**
 * POST /api/session-comparison
 *
 * Recibe las métricas de la sesión actual y devuelve:
 * - Copy dinámico comparando con la sesión anterior
 * - Score de la sesión anterior (para mostrar cambio visual)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, currentMetrics, currentScore } = body;

    if (!userId || !currentMetrics || currentScore === undefined) {
      return NextResponse.json(
        { error: "userId, currentMetrics y currentScore son requeridos" },
        { status: 400 }
      );
    }

    // Obtener sesión anterior
    const previousSession = await getPreviousSession(userId);

    // Generar copy dinámico
    const dynamicCopy = previousSession
      ? generateDynamicCopy(
          currentMetrics as VoiceMetrics,
          previousSession.metrics
        )
      : [];

    return NextResponse.json({
      hasPreviousSession: !!previousSession,
      previousScore: previousSession?.authorityScore ?? null,
      currentScore,
      dynamicCopy,
    });
  } catch (error) {
    console.error("Error en session-comparison:", error);
    return NextResponse.json(
      { error: "Error al comparar sesiones" },
      { status: 500 }
    );
  }
}
