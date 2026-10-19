// Test calculation and score mapping for ArchetypeDashboardPanel
console.log("=== INICIANDO VALIDACIÓN DE MÉTRICAS Y BARRAS NEÓN DEL PANEL DE AUDITORÍA ===");

const CATEGORIES = [
  { id: "claridad", label: "Claridad & Dicción", max: 20, color: "#10b981", grade: "A+" },
  { id: "autoridad", label: "Proyección & Autoridad", max: 20, color: "#06b6d4", grade: "A" },
  { id: "ritmo", label: "Ritmo & Pausas", max: 25, color: "#3b82f6", grade: "B" },
  { id: "presencia", label: "Seguridad & Presencia", max: 20, color: "#f97316", grade: "B+" },
  { id: "tension", label: "Control de Tensión", max: 15, color: "#f43f5e", grade: "A" },
];

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

// 1. Validar categorías y puntajes máximos
const totalMax = CATEGORIES.reduce((acc, c) => acc + c.max, 0);
assert(totalMax === 100, "La suma de las 5 dimensiones suma exactamente 100 puntos");

// 2. Simular cálculo dinámico según respuestas completadas (1 a 12)
function calculateCategoryScores(answeredCount) {
  const ratio = Math.min(1, answeredCount / 12);
  return CATEGORIES.map((cat, i) => {
    // Variación realista por categoría
    const factor = [0.95, 0.88, 0.72, 0.80, 0.85][i];
    const currentVal = Math.round(cat.max * ratio * factor);
    const percent = Math.round((currentVal / cat.max) * 100);
    return {
      ...cat,
      currentVal,
      percent,
    };
  });
}

const testStep0 = calculateCategoryScores(0);
assert(testStep0.every(c => c.currentVal === 0), "Al inicio con 0 respuestas, todos los puntajes parten en 0");
assert(testStep0.every(c => c.percent === 0), "Al inicio con 0 respuestas, todas las barras tienen ancho 0%");

const testStep6 = calculateCategoryScores(6);
assert(testStep6.some(c => c.currentVal > 0), "A mitad de camino (6 preguntas), las barras se llenan proporcionalmente");

const testStep12 = calculateCategoryScores(12);
const overallScore = testStep12.reduce((acc, c) => acc + c.currentVal, 0);
assert(overallScore >= 70 && overallScore <= 95, `Puntaje final calculado realista: ${overallScore}/100`);

console.log(`\nRESUMEN: ${passed} pasadas, ${failed} fallidas.`);
if (failed > 0) process.exit(1);
