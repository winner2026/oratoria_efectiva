import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateVisitorIdServer } from '@/lib/auth/visitorIdentity';
import { VoiceSessionStore } from '@/infrastructure/db/voiceSessionStore';

export async function GET(req: NextRequest) {
  try {
    const { visitorId } = await getOrCreateVisitorIdServer();
    const latestSession = await VoiceSessionStore.getLatestSession(visitorId);

    if (!latestSession) {
      return NextResponse.json({
        success: true,
        session: null,
        message: 'No hay sesiones registradas para este visitante.'
      });
    }

    return NextResponse.json({
      success: true,
      visitorId,
      session: latestSession,
    });
  } catch (error: any) {
    console.error('Error fetching latest session:', error);
    return NextResponse.json({ error: 'Error obteniendo la sesión más reciente' }, { status: 500 });
  }
}
