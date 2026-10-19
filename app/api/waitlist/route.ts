import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/db/client';
import { sendLeadToGoogleSheets } from '@/services/googleSheetsLeadService';

export const runtime = 'nodejs';

/**
 * POST /api/waitlist
 * 
 * Registra un nuevo usuario en la lista de espera.
 * Guarda email, nombre, referido y posición.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, referredBy } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Verificar si ya existe
    const existing = await prisma.$queryRaw<{ email: string }[]>`
      SELECT email FROM waitlist WHERE email = ${email.toLowerCase()}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 }
      );
    }

    // Obtener la posición actual (siguiente en la lista)
    const countResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM waitlist
    `;
    const position = Number(countResult[0]?.count || 0) + 1;

    // Insertar nuevo registro
    await prisma.$executeRawUnsafe(`
      INSERT INTO waitlist (email, name, referred_by, position, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, email.toLowerCase(), name, referredBy || null, position);

    // Si fue referido, actualizar posición del que refirió
    if (referredBy) {
      await prisma.$executeRawUnsafe(`
        UPDATE waitlist 
        SET referral_count = COALESCE(referral_count, 0) + 1,
            position = GREATEST(1, position - 5)
        WHERE email = $1
      `, referredBy.toLowerCase());
    }

    console.log('[WAITLIST] New signup:', { email, name, position, referredBy });

    // Sincronizar lead con Google Sheets
    sendLeadToGoogleSheets({
      name,
      email,
      source: referredBy ? `waitlist (ref: ${referredBy})` : 'waitlist',
    }).catch(err => {
      console.error('[WAITLIST] Error syncing lead to Google Sheets:', err);
    });

    return NextResponse.json({
      success: true,
      position,
      message: '¡Te has registrado exitosamente!',
    });

  } catch (error) {
    console.error('[WAITLIST] Error:', error);
    return NextResponse.json(
      { error: 'Error al registrar. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/waitlist
 * 
 * Obtiene la posición actual de un email en la lista.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      );
    }

    const result = await prisma.$queryRaw<{ position: number; referral_count: number }[]>`
      SELECT position, COALESCE(referral_count, 0) as referral_count 
      FROM waitlist 
      WHERE email = ${email.toLowerCase()}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Email no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      position: result[0].position,
      referralCount: result[0].referral_count,
    });

  } catch (error) {
    console.error('[WAITLIST] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener posición' },
      { status: 500 }
    );
  }
}
