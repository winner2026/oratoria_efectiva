import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return NextResponse.json(
      { success: false, error: "El formulario todavía no está conectado. Inténtalo más tarde." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Solicitud inválida." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, error: "Solicitud inválida." }, { status: 400 });
  }

  const { name, email, consent, website } = body as Record<string, unknown>;
  if (typeof website === "string" && website.trim()) {
    return NextResponse.json({ success: true });
  }

  const normalizedName = typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (normalizedName.length < 2 || normalizedName.length > 120) {
    return NextResponse.json({ success: false, error: "Escribe un nombre de entre 2 y 120 caracteres." }, { status: 400 });
  }
  if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
    return NextResponse.json({ success: false, error: "Escribe un correo electrónico válido." }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json({ success: false, error: "Necesitas aceptar el aviso para continuar." }, { status: 400 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: webhookSecret,
        name: normalizedName,
        email: normalizedEmail,
        source: "regalos",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });

    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success !== true) {
      console.error(
        "Google Sheets lead registration failed",
        response.status,
        result?.error || "invalid response",
        result?.detail || ""
      );
      return NextResponse.json(
        { success: false, error: "No pudimos registrar tu solicitud. Inténtalo de nuevo más tarde." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Google Sheets webhook unavailable", error);
    return NextResponse.json(
      { success: false, error: "No pudimos conectar con el registro. Inténtalo de nuevo más tarde." },
      { status: 502 }
    );
  }
}
