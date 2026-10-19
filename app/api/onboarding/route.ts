import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/infrastructure/db/client";
import { calculateVoiceArchetype } from "@/domain/archetype/ArchetypeEngine";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { answers, email: bodyEmail, name: bodyName } = body;

    // Obtener email del usuario (desde sesión o desde el cuerpo de la solicitud)
    const email = (session?.user?.email || bodyEmail || "").trim().toLowerCase();

    if (!email && !session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Se requiere un correo electrónico para guardar tu arquetipo." },
        { status: 400 }
      );
    }

    // Identificar o crear usuario en la base de datos
    let targetUserId = session?.user?.id;

    if (!targetUserId && email) {
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          name: bodyName || undefined,
        },
        create: {
          email,
          name: bodyName || null,
        },
      });
      targetUserId = user.id;
    } else if (targetUserId && email) {
      // Asegurar que el usuario tenga su email actualizado
      await prisma.user.update({
        where: { id: targetUserId },
        data: { email },
      }).catch(() => null);
    }

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: "No se pudo vincular el usuario." },
        { status: 400 }
      );
    }

    // Extraer respuestas individuales
    const answersData = answers || body;

    const objective = answersData.objective || null;
    const difficulty = answersData.difficulty || answersData.fearSymptom || null;
    const profession = answersData.profession || null;
    const situation = answersData.situation || answersData.highStakesScenario || null;

    // Calcular arquetipo bioacústico exacto a partir del conjunto de elecciones
    const synthesizedArchetype = calculateVoiceArchetype(answersData);
    const archetypeId = body.archetypeId || synthesizedArchetype.id;
    const archetypeName = body.archetypeName || synthesizedArchetype.name;

    // 1. Guardar en OnboardingProfile
    const profile = await prisma.onboardingProfile.upsert({
      where: { userId: targetUserId },
      update: {
        objective,
        difficulty,
        profession,
        situation,
        interest: archetypeId,
        isCompleted: true,
      },
      create: {
        userId: targetUserId,
        objective,
        difficulty,
        profession,
        situation,
        interest: archetypeId,
        isCompleted: true,
      },
    });

    // 2. Guardar registro completo de las 12 respuestas asociadas al email y al arquetipo
    const recordPayload = {
      email,
      userId: targetUserId,
      answers: answersData,
      archetypeId,
      archetypeName,
      archetypeData: synthesizedArchetype,
      timestamp: new Date().toISOString(),
      type: "onboarding-arquetipo-12",
    };

    await prisma.coachingRecord.create({
      data: {
        id: crypto.randomUUID(),
        visitorId: email || targetUserId,
        payload: recordPayload as any,
      },
    }).catch((err) => console.error("Error guardando CoachingRecord:", err));

    // 3. Opcional: sincronizar con Google Sheets si existe webhook configurado
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

    if (webhookUrl && webhookSecret && email) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: webhookSecret,
          name: bodyName || session?.user?.name || "Usuario Onboarding",
          email,
          source: "onboarding-arquetipo-12",
          detail: JSON.stringify(answersData),
        }),
      }).catch((webhookErr) => console.error("Error webhook Google Sheets:", webhookErr));
    }

    return NextResponse.json({
      success: true,
      email,
      profile,
    });
  } catch (error) {
    console.error("Error guardando respuestas de onboarding:", error);
    return NextResponse.json(
      { success: false, error: "Error del servidor al registrar respuestas." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const profile = await prisma.onboardingProfile.findUnique({
      where: { userId },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error obteniendo onboarding:", error);
    return NextResponse.json({ success: false, error: "Error del servidor" }, { status: 500 });
  }
}
