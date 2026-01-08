export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/db/client';

export async function GET() {
  try {
    // 1. Basic Counts
    const totalUsers = await prisma.user.count();
    const totalSessions = await prisma.voiceSession.count();

    // 2. Active Users (Users with >= 1 session linked)
    const activeUsersResult = await prisma.voiceSession.groupBy({
      by: ['userId'],
      where: { user: { isNot: null } },
      _count: { id: true }
    });
    const activeUsersCount = activeUsersResult.length;

    // 3. Premium Users
    const premiumUsers = await prisma.user.count({
      where: { plan: { not: 'FREE' } }
    });

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

    // Calculate Computed Rates
    const activationRate = totalUsers > 0 
      ? ((activeUsersCount / totalUsers) * 100).toFixed(1) + "%"
      : "0%";
    
    const conversionRate = activeUsersCount > 0
      ? ((premiumUsers / activeUsersCount) * 100).toFixed(1) + "%"
      : "0%";

    return NextResponse.json({
      totalUsers,
      activeUsers: activeUsersCount,
      premiumUsers,
      conversionRate,
      activationRate,
      // Mocks for data we don't track yet but UI needs
      technicalErrors: 0, 
      exerciseStarts: 0, // Need to track gym clicks
      resultsShared: 0, // Need to track share clicks
      avgUsageByPlan
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
