/**
 * REALIDAD: No podemos detectar incógnito de forma confiable en Chrome moderno.
 * Chrome incógnito 2024+ tiene:
 * - >1GB storage quota
 * - localStorage funcional durante la sesión
 * - Todos los APIs funcionan normalmente
 *
 * NUEVA ESTRATEGIA PRAGMÁTICA:
 * Permitir UNA prueba gratis SIN verificación de incógnito.
 * El límite lo controla el backend con fingerprint (IP + User-Agent).
 * Si el usuario está en incógnito, su fingerprint cambiará cada sesión,
 * pero eso no nos importa - ya tuvo su prueba gratis.
 *
 * BLOQUEAR solo si:
 * 1. localStorage no funciona en absoluto (navegadores antiguos)
 * 2. Navegación en ambientes sin JavaScript
 */

/**
 * Verifica si debe bloquear acceso por razones técnicas
 * Retorna true si debe BLOQUEAR
 */
export async function shouldBlockAccess(): Promise<boolean> {
  console.log('[ACCESS CHECK] 🔍 Verificando capacidades del navegador...');

  // ÚNICO CHECK: ¿localStorage funciona?
  try {
    if (!window.localStorage) {
      console.log('[ACCESS CHECK] ❌ BLOQUEAR: localStorage no disponible');
      return true;
    }

    // Test de escritura/lectura
    const testKey = '__test_' + Date.now();
    localStorage.setItem(testKey, 'test');
    const canRead = localStorage.getItem(testKey) === 'test';
    localStorage.removeItem(testKey);

    if (!canRead) {
      console.log('[ACCESS CHECK] ❌ BLOQUEAR: localStorage no funciona');
      return true;
    }

    console.log('[ACCESS CHECK] ✅ PERMITIR: navegador compatible');
    return false; // PERMITIR

  } catch (error) {
    console.log('[ACCESS CHECK] ❌ BLOQUEAR: Error en localStorage:', error);
    return true; // BLOQUEAR
  }
}

/**
 * DEPRECADO: Detección de incógnito es poco confiable
 * Usar shouldBlockAccess() en su lugar
 */
export async function isIncognitoMode(): Promise<boolean> {
  console.warn('[DEPRECATED] isIncognitoMode() está deprecado. Usar shouldBlockAccess()');
  return shouldBlockAccess();
}

/**
 * DEPRECADO: Versión sincrónica poco confiable
 */
export function isIncognitoModeSync(): boolean {
  try {
    const testKey = '__incognito_test__';
    localStorage.setItem(testKey, '1');
    const canStore = localStorage.getItem(testKey) === '1';
    localStorage.removeItem(testKey);
    return !canStore;
  } catch {
    return true;
  }
}
