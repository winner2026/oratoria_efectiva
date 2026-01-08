const crypto = require('crypto');

// 1. Esta es LA MISMA lógica que existe en src/lib/fingerprint/generateFingerprint.ts
function generateFingerprint(_userId, ip, userAgent) {
  const components = [
    ip || 'unknown-ip',
    userAgent || 'unknown-ua',
  ].join('|');

  const hash = crypto.createHash('sha256')
    .update(components)
    .digest('hex')
    .substring(0, 36);

  return `fp-${hash}`;
}

// 2. Configuramos el escenario del atacante
const ATACANTE_IP = "201.189.20.15"; // IP pública de su casa
const ATACANTE_BROWSER = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)";

console.log("\n🛡️  INICIANDO PRUEBA DE PENETRACIÓN (LOGIC CHECK) 🛡️\n");

// CASO 1: Primera visita (Gasta sus 3 créditos)
const fingerprint1 = generateFingerprint(null, ATACANTE_IP, ATACANTE_BROWSER);
console.log(`[Intento 1] Usuario Anónimo (Primera vez):`);
console.log(`>> HUELLA GENERADA: ${fingerprint1}`);
console.log(`>> ESTADO: Créditos consumidos.\n`);

// CASO 2: El usuario borra cookies y localStorage (Genera un nuevo ID falso en cliente)
const fakeNewUserId = "user_abc_123_random"; // ID generado por el JS del frontend al no encontrar cookies
const fingerprint2 = generateFingerprint(fakeNewUserId, ATACANTE_IP, ATACANTE_BROWSER);
console.log(`[Intento 2] Usuario borró cookies (Intenta engañar con nuevo ID):`);
console.log(`>> HUELLA GENERADA: ${fingerprint2}`);

if (fingerprint1 === fingerprint2) {
    console.log(`>> RESULTADO: 🔒 BLOQUEADO (El sistema sabe que eres tú)`);
} else {
    console.log(`>> RESULTADO: 🔓 VULNERABLE (Pasaste como nuevo usuario)`);
}
console.log("");

// CASO 3: Modo Incógnito (Sin ID, misma IP)
const fingerprint3 = generateFingerprint(null, ATACANTE_IP, ATACANTE_BROWSER);
console.log(`[Intento 3] Modo Incógnito:`);
console.log(`>> HUELLA GENERADA: ${fingerprint3}`);

if (fingerprint1 === fingerprint3) {
    console.log(`>> RESULTADO: 🔒 BLOQUEADO (La IP te delata)`);
} else {
    console.log(`>> RESULTADO: 🔓 VULNERABLE`);
}

console.log("\n---------------------------------------------------");
if (fingerprint1 === fingerprint2 && fingerprint2 === fingerprint3) {
    console.log("✅ CONCLUSIÓN FINAL: EL SISTEMA ES SEGURO.");
    console.log("   No importa qué haga el usuario en su navegador,");
    console.log("   mientras no cambie su IP real, se le contará como el mismo usuario.");
} else {
    console.log("❌ CONCLUSIÓN FINAL: EL SISTEMA TIENE BRECHAS.");
}
console.log("---------------------------------------------------\n");
