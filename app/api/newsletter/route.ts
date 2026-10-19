import { NextRequest, NextResponse } from "next/server";
import { sendLeadToGoogleSheets } from "@/services/googleSheetsLeadService";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedName = typeof name === "string" && name.trim() ? name.trim() : "Suscriptor Newsletter";

    if (!emailPattern.test(normalizedEmail)) {
      return NextResponse.json({ success: false, error: "Correo electrónico inválido" }, { status: 400 });
    }

    const result = await sendLeadToGoogleSheets({
      name: normalizedName,
      email: normalizedEmail,
      source: "newsletter",
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: "No se pudo registrar la suscripción." }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: "¡Suscripción exitosa!" });
  } catch (error) {
    console.error("[API /api/newsletter] Error:", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}
