import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/db/client';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  // Fix Next.js 15 breaking change: params is now a Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        usage: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      credits: user.credits,
      plan: user.plan,
      totalUsage: user.usage?.totalAnalyses || 0,
      subscriptionStatus: user.subscriptionStatus
    });
  } catch (error) {
    console.error('[API USER] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
