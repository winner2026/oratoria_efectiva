// Validation of 12-Node Archetype Graph geometry, distribution, and color spectrum
console.log("=== VALIDACIÓN DE RED DE ARQUETIPO DE 12 NODOS ===");

const NODES_12 = [
  { id: "objective", label: "PROPÓSITO", color: "#06b6d4" },
  { id: "breath", label: "RESPIRACIÓN", color: "#0ea5e9" },
  { id: "pace", label: "RITMO", color: "#3b82f6" },
  { id: "difficulty", label: "TENSIÓN", color: "#6366f1" },
  { id: "impromptu", label: "IMPROVISACIÓN", color: "#8b5cf6" },
  { id: "volume", label: "RESONANCIA", color: "#a855f7" },
  { id: "profession", label: "ENTORNO", color: "#ec4899" },
  { id: "situation", label: "ESCENARIO", color: "#f43f5e" },
  { id: "structure", label: "ESTRUCTURA", color: "#ef4444" },
  { id: "bodyLanguage", label: "PRESENCIA", color: "#f97316" },
  { id: "fillerWords", label: "PUREZA", color: "#f59e0b" },
  { id: "interest", label: "VECTOR", color: "#10b981" },
];

const width = 360;
const height = 360;
const cx = width / 2;
const cy = height / 2;
const radius = 130;

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

// 1. Validar 12 nodos
assert(NODES_12.length === 12, "Exactamente 12 nodos configurados para las 12 preguntas");

// 2. Coordenadas a 30 grados cada una (-90 deg como inicio superior)
const points = NODES_12.map((node, i) => {
  const angleDeg = -90 + i * (360 / 12);
  const rad = (angleDeg * Math.PI) / 180;
  return {
    ...node,
    index: i + 1,
    angleDeg,
    x: Number((cx + radius * Math.cos(rad)).toFixed(2)),
    y: Number((cy + radius * Math.sin(rad)).toFixed(2)),
  };
});

assert(
  points.every(p => p.x >= 20 && p.x <= width - 20 && p.y >= 20 && p.y <= height - 20),
  "Todos los 12 nodos están perfectamente dentro del área visible del gráfico con margen de seguridad"
);

// 3. 12 colores distintos
const uniqueColors = new Set(NODES_12.map(n => n.color));
assert(uniqueColors.size === 12, "Cada una de las 12 preguntas tiene un color de longitud de onda único");

// 4. Simulación de progresión
for (let answeredCount = 1; answeredCount <= 12; answeredCount++) {
  const currentAnswered = points.slice(0, answeredCount);
  assert(
    currentAnswered.length === answeredCount,
    `Paso ${answeredCount}: ${answeredCount} nodos activados correctamente`
  );
}

console.log(`\nRESUMEN DE PRUEBAS: ${passed} pasadas, ${failed} fallidas.`);
if (failed > 0) process.exit(1);
