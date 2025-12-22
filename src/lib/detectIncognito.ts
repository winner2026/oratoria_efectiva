/**
 * Detecta si el navegador está en modo incógnito/privado
 *
 * Métodos de detección:
 * 1. localStorage bloqueado o no persistente
 * 2. IndexedDB no disponible
 * 3. Storage quota reducido
 */
export async function isIncognitoMode(): Promise<boolean> {
  // MÉTODO 1: FileSystem API (más confiable en Chrome/Edge)
  // En incógnito, requestFileSystem no está disponible o falla
  try {
    // @ts-ignore - webkitRequestFileSystem existe en Chrome/Edge
    if ((window as any).webkitRequestFileSystem) {
      return await new Promise<boolean>((resolve) => {
        // @ts-ignore
        (window as any).webkitRequestFileSystem(
          0, // TEMPORARY = 0
          1,
          () => {
            console.log('[INCOGNITO CHECK] NORMAL mode (FileSystem available)');
            resolve(false); // FileSystem disponible = modo normal
          },
          () => {
            console.log('[INCOGNITO CHECK] INCOGNITO detected (FileSystem blocked)');
            resolve(true); // FileSystem bloqueado = incógnito
          }
        );
      });
    }
  } catch (error) {
    console.log('[INCOGNITO CHECK] FileSystem check failed');
  }

  // MÉTODO 2: Storage quota (Firefox, Safari)
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      console.log('[INCOGNITO CHECK] Storage quota:', estimate.quota);

      // Firefox incógnito: quota muy pequeña
      // Safari incógnito: quota = 0 o muy pequeña
      if (estimate.quota && estimate.quota < 120000000) {
        console.log('[INCOGNITO CHECK] INCOGNITO detected via quota');
        return true;
      }
    }
  } catch (error) {
    console.log('[INCOGNITO CHECK] Storage estimate failed');
  }

  // MÉTODO 3: Verificar si ya existe un userId antiguo
  // En incógnito, NUNCA habrá un userId de sesiones previas
  const hasOldUserId = !!localStorage.getItem('oratoria_user_id');

  if (!hasOldUserId) {
    // Primera visita O modo incógnito
    // Crear un ID temporal para verificar
    const testKey = '__incognito_test_' + Date.now();
    localStorage.setItem(testKey, '1');

    // Esperar 100ms y verificar si persiste
    await new Promise(resolve => setTimeout(resolve, 100));

    const stillThere = localStorage.getItem(testKey) === '1';
    localStorage.removeItem(testKey);

    if (!stillThere) {
      console.log('[INCOGNITO CHECK] INCOGNITO detected (storage not persistent)');
      return true;
    }

    // Si llegó aquí, es primera visita en modo normal
    console.log('[INCOGNITO CHECK] First visit in NORMAL mode');
    return false;
  }

  console.log('[INCOGNITO CHECK] NORMAL mode (has old userId)');
  return false;
}

/**
 * Detecta modo incógnito de forma sincrónica (menos preciso)
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
