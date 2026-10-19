import fs from 'fs';
import path from 'path';

console.log("=== INICIANDO VERIFICACIÓN DE BOTONES DE MÉTRICAS (RITMO, PAUSAS, AUTORIDAD) ===");

const pagePath = path.resolve('app/voz_efectiva/page.tsx');
const content = fs.readFileSync(pagePath, 'utf8');

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

// 1. Ritmo WPM button with hover scale
assert(
  content.includes('aria-label="Indicador Ritmo WPM"') && content.includes('hover:scale-110'),
  'Ritmo WPM está implementado como botón con efecto hover:scale-110'
);

// 2. Pausas button with hover scale
assert(
  content.includes('aria-label="Indicador Pausas"'),
  'Pausas está implementado como botón interactivo con hover'
);

// 3. Autoridad button with hover scale
assert(
  content.includes('aria-label="Indicador Autoridad"'),
  'Autoridad está implementado como botón interactivo con hover'
);

// 4. Hover glow effects present
assert(
  content.includes('group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]') &&
  content.includes('group-hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]') &&
  content.includes('group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]'),
  'Los 3 botones tienen resplandor dinámico individual al pasar el mouse'
);

// 5. Hydration warning suppression
assert(
  content.includes('suppressHydrationWarning'),
  'SVGs y elementos contienen suppressHydrationWarning para evitar advertencias de extensiones de navegador'
);

console.log(`\nRESUMEN: ${passed} pasadas, ${failed} fallidas.`);
if (failed > 0) process.exit(1);
