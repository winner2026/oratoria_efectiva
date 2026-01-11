export const runtime = "nodejs";

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/infrastructure/db/client';

export async function GET(req: NextRequest) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    const secret = process.env.ADMIN_SECRET_KEY;

    if (!secret || adminKey !== secret) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        createdAt: true,
        usage: {
          select: {
            totalAnalyses: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const grouped = {
      FREE: users.filter(u => u.plan === "FREE"),
      STARTER: users.filter(u => u.plan === "STARTER"),
      PREMIUM: users.filter(u => u.plan === "PREMIUM"),
      OTHER: users.filter(u => !["FREE", "STARTER", "PREMIUM"].includes(u.plan))
    };

    return NextResponse.json(grouped);

  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    const secret = process.env.ADMIN_SECRET_KEY;

    if (!secret || adminKey !== secret) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, newPlan } = await req.json();

    if (!userId || !newPlan) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 1. Update User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan: newPlan }
    });

    // 2. Sync with Usage table (for consistency)
    await prisma.usage.upsert({
      where: { userId: userId },
      update: { planType: newPlan },
      create: { 
        userId: userId, 
        planType: newPlan,
        fingerprint: `usr-${userId}` 
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error('Error updating user plan:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
