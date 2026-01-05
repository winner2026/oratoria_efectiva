import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/db/client";
import { generateFingerprint, getClientIP, normalizeUserAgent } from "@/lib/fingerprint/generateFingerprint";

export async function POST(req: NextRequest) {
  try {
    const { email, name, role, goal } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 });
    }

    console.log("[REGISTER] Intentando registrar/login:", email);

    // 1. Verificar si ya existe
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      console.log("[REGISTER] Usuario existente encontrado:", user.id);
      // Usuario existente: Podríamos actualizar datos si es un re-engagement
      // Por ahora solo devolvemos éxito
    } else {
      console.log("[REGISTER] Creando nuevo usuario...");
      // 2. Crear nuevo usuario con 3 créditos GRATIS
      user = await prisma.user.create({
        data: {
          email,
          name,
          role,
          goal,
          credits: 3, // 🎁 REGALO DE BIENVENIDA
          plan: "FREE"
        }
      });
      console.log("[REGISTER] Usuario creado:", user.id);
    }

    // 3. Vincular con Fingerprint (Opcional pero útil para tracking)
    // Intentaremos asociar el fingerprint actual a este usuario si tenemos la lógica lista
    // (Por ahora simplificamos la respuesta)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        role: user.role
      },
      message: user.credits > 0 ? "¡Tienes 3 análisis grauitos!" : "Has agotado tus créditos gratuitos."
    });

  } catch (error) {
    console.error("[REGISTER] Error:", error);
    return NextResponse.json(
      { error: "Error interno al registrar usuario" },
      { status: 500 }
    );
  }
}
