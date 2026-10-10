import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/infrastructure/db/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const {
      objective,
      difficulty,
      profession,
      situation,
      interest,
      ageRange,
      gender
    } = body;

    const profile = await prisma.onboardingProfile.upsert({
      where: { userId },
      update: {
        objective,
        difficulty,
        profession,
        situation,
        interest,
        ageRange,
        gender,
        isCompleted: true
      },
      create: {
        userId,
        objective,
        difficulty,
        profession,
        situation,
        interest,
        ageRange,
        gender,
        isCompleted: true
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error guardando onboarding:", error);
    return NextResponse.json({ success: false, error: "Error del servidor" }, { status: 500 });
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
      where: { userId }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error obteniendo onboarding:", error);
    return NextResponse.json({ success: false, error: "Error del servidor" }, { status: 500 });
  }
}
