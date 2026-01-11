import { createHash } from 'crypto';

/**
 * Genera un fingerprint único basándose en IP + User-Agent.
 * Ya no se confía en el userId del cliente porque puede resetearse.
 *
 * Esto previene bypass por:
 * - Borrar localStorage
 * - Modo incógnito
 * - Cambiar navegador en el mismo dispositivo/red
 */
export function generateFingerprint(
  _userId: string | null,
  ip: string | null,
  userAgent: string | null
): string {
  // Si hay un userId (ej. email ya autenticado), lo usamos como componente principal
  // para que la historia sea persistente entre dispositivos. 
  // Si no hay userId, usamos IP+UA como fallback.
  const components = [
    _userId || 'no-id',
    ip || 'unknown-ip',
    userAgent || 'unknown-ua',
  ].join('|');

  const hash = createHash('sha256')
    .update(components)
    .digest('hex')
    .substring(0, 36);

  // Si hay un userId real, el prefijo cambia para distinguir
  const prefix = _userId ? 'usr' : 'fp';
  return `${prefix}-${hash}`;
}

export function normalizeUserAgent(userAgent: string | null): string {
  return (userAgent ?? 'unknown').slice(0, 120);
}

/**
 * Extrae la IP real del request, considerando proxies
 */
export function getClientIP(
  headers: Headers,
  fallbackIp?: string | null
): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const ip =
    fallbackIp ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    headers.get('x-vercel-forwarded-for');

  return ip || 'unknown';
}
