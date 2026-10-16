import fs from 'fs';
import path from 'path';

console.log("=== INICIANDO VERIFICACIÓN DE CAMBIOS ===");

const homePagePath = path.resolve('app/page.tsx');
const landingPagePath = path.resolve('app/sin_miedo_a_hablar/page.tsx');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASSED: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAILED: ${message}`);
    failed++;
  }
}

// 1. Verificar home page app/page.tsx
const homeContent = fs.readFileSync(homePagePath, 'utf8');

assert(
  homeContent.includes('/sin_miedo_a_hablar'),
  'app/page.tsx contiene enlace a /sin_miedo_a_hablar'
);
assert(
  homeContent.includes('Curso Sin Miedo'),
  'app/page.tsx incluye acceso al curso en navegación'
);
assert(
  homeContent.includes('id="curso-sin-miedo"'),
  'app/page.tsx incluye sección dedicada al curso Sin Miedo a Hablar'
);
assert(
  homeContent.includes('29 USD') && homeContent.includes('PAGO AL CONTADO'),
  'app/page.tsx muestra precio 29 USD y modalidad al contado'
);

// 2. Verificar landing page app/sin_miedo_a_hablar/page.tsx
const landingContent = fs.readFileSync(landingPagePath, 'utf8');

assert(
  landingContent.includes('29 USD'),
  'app/sin_miedo_a_hablar/page.tsx muestra el precio 29 USD'
);
assert(
  landingContent.includes('PAGO ÚNICO AL CONTADO'),
  'app/sin_miedo_a_hablar/page.tsx especifica PAGO ÚNICO AL CONTADO'
);
assert(
  landingContent.includes('Pago al contado') && landingContent.includes('Sin cuotas'),
  'app/sin_miedo_a_hablar/page.tsx elimina cuotas y confirma pago al contado'
);
assert(
  !landingContent.includes('170.00'),
  'app/sin_miedo_a_hablar/page.tsx NO contiene el precio anterior de 170.00'
);

console.log(`\nRESUMEN DE PRUEBAS: ${passed} pasadas, ${failed} fallidas.`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
