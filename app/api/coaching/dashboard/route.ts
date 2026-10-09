import { NextRequest, NextResponse } from 'next/server';
import { getCoachingDashboard } from '@/application/coaching/getCoachingDashboard';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'guest-user';

    const dashboardData = await getCoachingDashboard(userId);

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error: any) {
    console.error('[COACHING_DASHBOARD_API] Error:', error);
    return NextResponse.json({ error: 'Error cargando el dashboard del entrenador.' }, { status: 500 });
  }
}
