import { createHash } from 'crypto';

/**
 * Test del sistema de fingerprint.
 *
 * Verifica que el fingerprint solo dependa de IP + User-Agent
 * y que el userId enviado por el cliente se ignore.
 */

function generateFingerprint(userId, ip, userAgent) {
  const components = [
    ip || 'unknown-ip',
    userAgent || 'unknown-ua',
  ].join('|');

  const hash = createHash('sha256')
    .update(components)
    .digest('hex')
    .substring(0, 36);

  return `fp-${hash}`;
}

console.log('🧪 Testing Fingerprint Generation\n');

const ip = '192.168.1.1';
const ua = 'Mozilla/5.0 (Windows)';

const userId = 'abc123-def456-ghi789';
const fingerprintWithUserId = generateFingerprint(userId, ip, ua);
const fingerprintWithoutUserId = generateFingerprint(null, ip, ua);

console.log('1️⃣ Ignorar userId del cliente');
console.log('   fingerprint (con userId):', fingerprintWithUserId);
console.log('   fingerprint (sin userId):', fingerprintWithoutUserId);
console.log(
  '   Match:',
  fingerprintWithUserId === fingerprintWithoutUserId ? '✅ Sí' : '❌ No'
);

const fingerprintChrome = generateFingerprint(null, ip, 'Chrome/120.0');
console.log('\n2️⃣ Cambiar navegador, misma IP');
console.log('   fingerprint (Chrome):', fingerprintChrome);
console.log(
  '   Match con valor anterior:',
  fingerprintWithUserId === fingerprintChrome ? '⚠️ Sí' : '⚠️ No, diferente'
);

const fingerprintIphone = generateFingerprint(null, ip, 'iPhone Safari/17.0');
console.log('\n3️⃣ Cambiar dispositivo, misma IP');
console.log('   fingerprint (iPhone):', fingerprintIphone);
console.log(
  '   Match con valor anterior:',
  fingerprintWithUserId === fingerprintIphone ? '⚠️ Sí' : '⚠️ No, diferente'
);
