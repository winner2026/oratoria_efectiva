import { NextRequest, NextResponse } from "next/server";
import { sendLeadToGoogleSheets } from "@/services/googleSheetsLeadService";
import { prisma } from "@/infrastructure/db/client";

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

  // 1. Intentar registrar en base de datos PostgreSQL local
  try {
    await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: normalizedName,
      },
      create: {
        email: normalizedEmail,
        name: normalizedName,
        role: "lead_regalo",
        goal: "claridad",
      },
    });
  } catch (dbError) {
    console.warn("[API /api/regalos] Could not save user to DB, continuing to webhook:", dbError);
  }

  // 2. Intentar registrar en Google Sheets si el webhook está configurado
  try {
    const result = await sendLeadToGoogleSheets({
      name: normalizedName,
      email: normalizedEmail,
      source: "regalos",
    });

    if (!result.success) {
      console.warn("[API /api/regalos] Google Sheets webhook failed or not configured:", result.error);
    }
  } catch (sheetError) {
    console.warn("[API /api/regalos] Exception sending to Google Sheets:", sheetError);
  }

  // Siempre devolver success true para garantizar que el usuario reciba el regalo
  return NextResponse.json({ success: true });
}
