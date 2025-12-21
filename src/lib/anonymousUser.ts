/**
 * Sistema de identificación anónima por navegador.
 *
 * Responsabilidad: Generar y persistir un userId único por navegador
 * sin pedir datos al usuario.
 *
 * Caso de uso:
 * - Limitar Free a 1 análisis
 * - Permitir migración a Premium sin perder datos
 * - Zero fricción en primer uso
 */

const STORAGE_KEY = 'oratoria_user_id';

/**
 * Genera un UUID v4 simple
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Obtiene o crea el userId anónimo del navegador.
 *
 * Si no existe, genera uno nuevo y lo guarda en localStorage.
 * Si existe, lo devuelve.
 *
 * @returns userId único del navegador
 */
export function getOrCreateAnonymousUserId(): string {
  // Verificar si estamos en el navegador
  if (typeof window === 'undefined') {
    throw new Error('getOrCreateAnonymousUserId solo funciona en el navegador');
  }

  // Intentar obtener userId existente
  let userId = localStorage.getItem(STORAGE_KEY);

  // Si no existe, crear uno nuevo
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}

/**
 * Obtiene el userId sin crearlo (solo lectura).
 * Útil para verificar si el usuario ya existe.
 *
 * @returns userId o null si no existe
 */
export function getAnonymousUserId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(STORAGE_KEY);
}
