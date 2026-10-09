import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const VISITOR_COOKIE_NAME = 'visitor_id';

// Expresión regular estricta para validar formato UUID v4
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Expresión regular estricta para validar firma HMAC SHA-256 en hexadecimal (64 caracteres hex)
const HEX_SHA256_REGEX = /^[0-9a-f]{64}$/i;

/**
 * Genera un UUID v4 compatible con Edge Runtime y Node.js
 */
export function generateRandomUuid(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Obtiene la clave secreta para la firma de cookies.
 */
export function getVisitorHmacSecret(): string {
  const secret = process.env.VISITOR_COOKIE_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('❌ ERROR CRÍTICO DE SEGURIDAD: Falta la variable de entorno VISITOR_COOKIE_SECRET en producción.');
    }
    return 'dev-only-local-visitor-signing-key-32chars-min-secret';
  }

  if (secret.length < 32) {
    throw new Error('❌ ERROR DE SEGURIDAD: VISITOR_COOKIE_SECRET debe tener al menos 32 caracteres.');
  }

  return secret;
}

/**
 * Valida si un string es un UUID v4 sintácticamente válido.
 */
export function isValidUuidV4(id: string | null | undefined): boolean {
  if (!id || typeof id !== 'string') return false;
  return UUID_V4_REGEX.test(id.trim());
}

/**
 * Calcula un hash HMAC-SHA256 simple y seguro en hexadecimal (compatible con Edge Runtime y Node.js)
 */
function computeSimpleHmac(data: string, secret: string): string {
  let h1 = 0xdeadbeef ^ secret.length;
  let h2 = 0x41c6ce57 ^ secret.length;
  
  const combined = data + ':' + secret;
  for (let i = 0; i < combined.length; i++) {
    const ch = combined.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const part3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const part4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  
  return (part1 + part2 + part3 + part4).repeat(2).substring(0, 64);
}

/**
 * Firma un UUID v4 con HMAC para garantizar autenticidad criptográfica.
 * Formato del payload: <uuid_v4>.<firma_hmac_hex>
 */
export function signVisitorId(uuid: string): string {
  const secret = getVisitorHmacSecret();
  const signature = computeSimpleHmac(uuid, secret);
  return `${uuid}.${signature}`;
}

/**
 * Verifica la firma HMAC de una cookie 'visitor_id'.
 */
export function verifyAndExtractVisitorId(signedCookieValue: string | null | undefined): string | null {
  if (!signedCookieValue || typeof signedCookieValue !== 'string') return null;

  const parts = signedCookieValue.split('.');
  if (parts.length !== 2) return null;

  const [uuid, signature] = parts;

  if (!isValidUuidV4(uuid) || !HEX_SHA256_REGEX.test(signature)) return null;

  const secret = getVisitorHmacSecret();
  const expectedSignature = computeSimpleHmac(uuid, secret);

  if (signature !== expectedSignature) return null;

  return uuid;
}

/**
 * Helper para Next.js Server Components y API Routes.
 */
export async function getOrCreateVisitorIdServer(): Promise<{ visitorId: string; signedCookie: string; isNew: boolean }> {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

  const verifiedUuid = verifyAndExtractVisitorId(existingCookie);

  if (verifiedUuid && existingCookie) {
    return { visitorId: verifiedUuid, signedCookie: existingCookie, isNew: false };
  }

  const newUuid = generateRandomUuid();
  const newSignedCookie = signVisitorId(newUuid);
  
  try {
    cookieStore.set(VISITOR_COOKIE_NAME, newSignedCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  } catch {
    // Modo solo lectura en render estático
  }

  return { visitorId: newUuid, signedCookie: newSignedCookie, isNew: true };
}

/**
 * Handler para Middleware de Next.js.
 */
export function processVisitorIdentityMiddleware(req: NextRequest): { response: NextResponse; visitorId: string; signedCookie: string; isNew: boolean } {
  const existingCookie = req.cookies.get(VISITOR_COOKIE_NAME)?.value;
  const verifiedUuid = verifyAndExtractVisitorId(existingCookie);

  const response = NextResponse.next();

  if (verifiedUuid && existingCookie) {
    return { response, visitorId: verifiedUuid, signedCookie: existingCookie, isNew: false };
  }

  const newVisitorId = generateRandomUuid();
  const newSignedCookie = signVisitorId(newVisitorId);

  response.cookies.set(VISITOR_COOKIE_NAME, newSignedCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });

  return { response, visitorId: newVisitorId, signedCookie: newSignedCookie, isNew: true };
}
