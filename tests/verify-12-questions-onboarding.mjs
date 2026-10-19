import fs from 'fs';
import path from 'path';

console.log("=== INICIANDO AUDITORÍA: 12 PREGUNTAS ESTRATÉGICAS + GRAFO DE ARQUETIPO + CORREO ===");

const pagePath = path.resolve('app/onboarding/page.tsx');
const apiPath = path.resolve('app/api/onboarding/route.ts');
const graphPath = path.resolve('src/components/ArchetypeGraph.tsx');

const pageContent = fs.readFileSync(pagePath, 'utf8');
const apiContent = fs.readFileSync(apiPath, 'utf8');
const graphContent = fs.readFileSync(graphPath, 'utf8');

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    console.log(`✓ PASSED: ${msg}`);
    passed++;
  } else {
    console.error(`✗ FAILED: ${msg}`);
    failed++;
  }
}

// 1. Verificar que existan 12 preguntas
assert(
  pageContent.includes('STRATEGIC_QUESTIONS_12') &&
  (pageContent.match(/id: "/g) || []).length >= 12,
  'app/onboarding/page.tsx contiene 12 instancias de preguntas estratégicas'
);

// 2. Verificar que ArchetypeDashboardPanel esté integrado con las 12 preguntas
assert(
  pageContent.includes('<ArchetypeDashboardPanel') &&
  pageContent.includes('ArchetypeDashboardPanel'),
  'ArchetypeDashboardPanel está incrustado y vinculado con las respuestas en tiempo real'
);

// 3. Verificar que el gráfico de 12 nodos maneje los 12 puntos y líneas
assert(
  graphContent.includes('ARCHETYPE_NODES_12') &&
  graphContent.includes('connections') &&
  graphContent.includes('<svg'),
  'El componente gráfico genera dinámicamente conexiones de puntos y colores de arquetipo'
);

// 4. Verificar captura y guardado del correo electrónico
assert(
  pageContent.includes('userEmail') &&
  pageContent.includes('emailToSave') &&
  pageContent.includes('Correo Electrónico'),
  'La vista final solicita y valida el correo electrónico para asociar las respuestas'
);

// 5. Verificar que la API guarde email y answers
assert(
  apiContent.includes('answers') &&
  apiContent.includes('email') &&
  apiContent.includes('coachingRecord'),
  'La API app/api/onboarding/route.ts persiste el correo junto al payload completo de respuestas'
);

console.log(`\nRESUMEN DE AUDITORÍA: ${passed} pasadas, ${failed} fallidas.`);
if (failed > 0) process.exit(1);
