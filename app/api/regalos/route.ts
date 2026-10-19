import { NextRequest, NextResponse } from "next/server";
import { sendLeadToGoogleSheets } from "@/services/googleSheetsLeadService";

export const runtime = "nodejs";
export const maxDuration = 15;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
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
  
  // Honeypot anti-spam
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

  const result = await sendLeadToGoogleSheets({
    name: normalizedName,
    email: normalizedEmail,
    source: "regalos",
  });

  if (!result.success) {
    console.error("[API /api/regalos] Failed to save lead to Google Sheets:", result.error, result.detail);
    return NextResponse.json(
      { success: false, error: "No pudimos registrar tu solicitud. Inténtalo de nuevo más tarde." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
