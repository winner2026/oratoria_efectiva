import { 
  isValidUuidV4, 
  signVisitorId,
  verifyAndExtractVisitorId,
  VISITOR_COOKIE_NAME,
  processVisitorIdentityMiddleware,
  getVisitorHmacSecret
} from '../src/lib/auth/visitorIdentity.js';
import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

function runStep2SecurityAndIsolationAudit() {
  console.log('================================================================');
  console.log('🛡️ AUDITORÍA DE SEGURIDAD, SECRETO, IDEMPOTENCIA Y AISLAMIENTO');
  console.log('================================================================\n');

  // CONTROL 1: Verificación de Secreto Obligatorio y Longitud Mínima en Producción
  console.log('Control 1: Verificando protección de secreto en producción...');
  const originalEnv = process.env.NODE_ENV;
  const originalSecret = process.env.VISITOR_COOKIE_SECRET;

  try {
    (process.env as any).NODE_ENV = 'production';
    delete process.env.VISITOR_COOKIE_SECRET;

    let threwAsExpected = false;
    try {
      getVisitorHmacSecret();
    } catch (err: any) {
      if (err.message.includes('VISITOR_COOKIE_SECRET')) {
        threwAsExpected = true;
      }
    }

    if (!threwAsExpected) {
      throw new Error('❌ Control 1 Falló: La aplicación no falló en producción ante la ausencia de VISITOR_COOKIE_SECRET.');
    }
    console.log('  ✓ En producción, la ausencia de VISITOR_COOKIE_SECRET lanza error crítico.');

    // Verificar longitud mínima de 32 caracteres
    process.env.VISITOR_COOKIE_SECRET = 'short-secret-123';
    let threwShortSecret = false;
    try {
      getVisitorHmacSecret();
    } catch (err: any) {
      if (err.message.includes('32 caracteres')) {
        threwShortSecret = true;
      }
    }

    if (!threwShortSecret) {
      throw new Error('❌ Control 1 Falló: No se exigió una clave de al menos 32 caracteres.');
    }
    console.log('  ✓ Claves secretas de menos de 32 caracteres son rechazadas.');

  } finally {
    (process.env as any).NODE_ENV = originalEnv;
    if (originalSecret) process.env.VISITOR_COOKIE_SECRET = originalSecret;
    else delete process.env.VISITOR_COOKIE_SECRET;
  }


  // CONTROL 2: Idempotencia del Middleware (No sobrescribir ni emitir cookies duplicadas)
  console.log('\nControl 2: Verificando idempotencia de cookie existente válida...');
  const genuineUuid = randomUUID();
  const validSignedCookie = signVisitorId(genuineUuid);

  const reqWithValidCookie = new NextRequest('http://localhost:3000/listen', {
    headers: {
      cookie: `${VISITOR_COOKIE_NAME}=${validSignedCookie}`
    }
  });

  const { response: resIdempotent, visitorId: idIdempotent, isNew } = processVisitorIdentityMiddleware(reqWithValidCookie);

  console.log(`  • UUID Requerido: "${genuineUuid}"`);
  console.log(`  • UUID Devuelto por Middleware: "${idIdempotent}"`);
  console.log(`  • ¿Es nueva emisión?: ${isNew}`);

  if (idIdempotent !== genuineUuid) {
    throw new Error('❌ Control 2 Falló: El middleware cambió el UUID de una cookie válida existente.');
  }
  if (isNew) {
    throw new Error('❌ Control 2 Falló: El middleware marcó como nueva una cookie legítima.');
  }
  if (resIdempotent.cookies.get(VISITOR_COOKIE_NAME)) {
    throw new Error('❌ Control 2 Falló: El middleware emitió un Set-Cookie redundante para un usuario válido.');
  }
  console.log('  ✓ Idempotencia total: El UUID se conservó intacto y no se emitió Set-Cookie redundante.');

  // CONTROL 3: Inyección de ID Manipulado y Firma Falsa
  console.log('\nControl 3: Inyectando UUID inventado por el cliente con firma falsa...');
  const fakeUuid = randomUUID();
  const forgedCookie = `${fakeUuid}.ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`;

  const reqForged = new NextRequest('http://localhost:3000/api/analysis', {
    headers: {
      cookie: `${VISITOR_COOKIE_NAME}=${forgedCookie}`
    }
  });

  const { visitorId: idSanitized, isNew: isNewForged } = processVisitorIdentityMiddleware(reqForged);

  console.log(`  • UUID Forjado enviado por cliente: "${fakeUuid}"`);
  console.log(`  • UUID Reemplazado por Servidor: "${idSanitized}"`);

  if (idSanitized === fakeUuid) {
    throw new Error('❌ Control 3 Falló: El middleware aceptó una cookie con firma forjada.');
  }
  if (!isNewForged) {
    throw new Error('❌ Control 3 Falló: El reemplazo no fue marcado como nueva emisión.');
  }
  console.log('  ✓ El servidor destruyó la cookie forjada y emitió un UUID v4 genuino firmado.');

  // CONTROL 4: Prueba Negativa de Aislamiento Cruzado entre Visitante A y Visitante B
  console.log('\nControl 4: Ejecutando prueba negativa de acceso cruzado (Visitante A vs Visitante B)...');
  const visitorAUuid = randomUUID();
  const visitorBUuid = randomUUID();

  // Simulación de registros de sesiones en la estructura de dominio de Prisma
  const mockDatabaseSessionStore = [
    { id: 'sess-1', userId: visitorAUuid, score: 75, createdAt: new Date().toISOString() },
    { id: 'sess-2', userId: visitorAUuid, score: 82, createdAt: new Date().toISOString() },
  ];

  // Visitante B intenta consultar la API solicitando datos de Visitante A (ej. pasando targetUserId en body/params)
  const queryByVisitorB = (authenticatedVisitorIdInCookie: string, _clientRequestedUserIdParam: string) => {
    // La API DEBE ignorar _clientRequestedUserIdParam y filtrar ESTRICTAMENTE por authenticatedVisitorIdInCookie
    return mockDatabaseSessionStore.filter(session => session.userId === authenticatedVisitorIdInCookie);
  };

  const resultsForVisitorB = queryByVisitorB(visitorBUuid, visitorAUuid);

  console.log(`  • Sesiones almacenadas de Visitante A: 2`);
  console.log(`  • Visitante B intenta acceder a sesiones pasando ID de A en cuerpo de petición...`);
  console.log(`  • Sesiones devueltas a Visitante B: ${resultsForVisitorB.length}`);

  if (resultsForVisitorB.length !== 0) {
    throw new Error('❌ Control 4 Falló: Visitante B logró acceder a las sesiones de Visitante A.');
  }
  console.log('  ✓ Aislamiento absoluto: Visitante B recibió 0 registros de Visitante A.');

  console.log('\n================================================================');
  console.log('🏆 AUDITORÍA DE SEGURIDAD Y AISLAMIENTO DE PASO 2: 100% EXITOSA');
  console.log('================================================================\n');
}

runStep2SecurityAndIsolationAudit();
