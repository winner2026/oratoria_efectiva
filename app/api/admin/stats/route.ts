export const runtime = "nodejs";

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/infrastructure/db/client';

export async function GET(req: NextRequest) {
  try {
    // 🔒 ADMIN SECURITY GATE
    const adminKey = req.headers.get("x-admin-key");
    const secret = process.env.ADMIN_SECRET_KEY;

    if (!secret || adminKey !== secret) {
       console.error("[ADMIN] Intento de acceso no autorizado");
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Breakdown by Plan
    const freeUsers = await prisma.user.count({ where: { plan: 'FREE' } });
    const starterUsers = await prisma.user.count({ where: { plan: 'STARTER' } });
    const premiumUsers = await prisma.user.count({ where: { plan: 'PREMIUM' } });

    // Active Users (Users with >= 1 session linked)
    const activeUsersResult = await prisma.voiceSession.groupBy({
      by: ['userId'],
      where: { user: { isNot: null } },
      _count: { id: true }
    });
    const activeUsersCount = activeUsersResult.length;

    // 4. Usage by Plan (Rentabilidad)
    // We need to join Usage with Plan info which is in Usage table or User table.
    // Assuming Usage table has 'planType' and 'totalAnalyses'.
    const usageByPlan = await prisma.usage.groupBy({
      by: ['planType'],
      _avg: {
        totalAnalyses: true
      },
      _count: {
        id: true // Count users in this plan bucket
      }
    });

    const avgUsageByPlan = usageByPlan.map(g => ({
       plan: g.planType,
       avg_usage: g._avg.totalAnalyses ? g._avg.totalAnalyses.toFixed(1) : 0,
       count: g._count.id
    }));

    const totalUsers = freeUsers + starterUsers + premiumUsers;

    // Calculate Computed Rates
    const activationRate = totalUsers > 0 
      ? ((activeUsersCount / totalUsers) * 100).toFixed(1) + "%"
      : "0%";
    
    const conversionRate = activeUsersCount > 0
      ? (((starterUsers + premiumUsers) / activeUsersCount) * 100).toFixed(1) + "%"
      : "0%";

    return NextResponse.json({
      totalUsers,
      freeUsers,
      starterUsers,
      premiumUsers,
      activeUsers: activeUsersCount,
      conversionRate,
      activationRate,
      // Mocks for data we don't track yet but UI needs
      technicalErrors: 0, 
      exerciseStarts: 0, 
      resultsShared: 0, 
      avgUsageByPlan
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
