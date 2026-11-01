import { calculateDynamicDimensions } from '../src/domain/archetype/ArchetypeScoring';

console.log("=== INICIANDO VERIFICACIÓN DE PUNTUACIONES ASIMÉTRICAS ===");

// 1. Verificar estado inicial sin respuestas (en reposo)
const emptyState = calculateDynamicDimensions({});
console.log("\n[TEST 1] Estado en reposo (sin respuestas):");
console.log(`- Consistencia: max ${emptyState.consistency.max} (actual: ${emptyState.consistency.currentVal})`);
console.log(`- Claridad: max ${emptyState.clarity.max} (actual: ${emptyState.clarity.currentVal})`);
console.log(`- Ritmo: max ${emptyState.rhythm.max} (actual: ${emptyState.rhythm.currentVal})`);
console.log(`- Autoridad: max ${emptyState.authority.max} (actual: ${emptyState.authority.currentVal})`);
console.log(`- Regulación: max ${emptyState.regulation.max} (actual: ${emptyState.regulation.currentVal})`);

const totalMax = emptyState.consistency.max + emptyState.clarity.max + emptyState.rhythm.max + emptyState.authority.max + emptyState.regulation.max;
if (totalMax !== 100) {
  throw new Error(`FAIL: La suma de máximos debe ser exactamente 100, pero dio ${totalMax}`);
}
console.log(`✓ Suma total de máximos: ${totalMax}/100 (CORRECTO)`);

// 2. Verificar caso con dificultades severas de ritmo y muletillas
const answersRhythmIssue = {
  objective: "ventas",
  profession: "ventas",
  fearSymptom: "aceleracion",
  speakingPace: "demasiado_rapido",
  fillerWords: "muy_frecuente",
  impromptuAbility: "rodeos_largos",
  vocalTone: "aceptable_sin_peso"
};

const resultRhythmIssue = calculateDynamicDimensions(answersRhythmIssue);
console.log("\n[TEST 2] Caso con dificultades en Ritmo y Claridad:");
console.log(`- Ritmo: ${resultRhythmIssue.rhythm.ratioText} (${resultRhythmIssue.rhythm.percent}%) -> Nota: ${resultRhythmIssue.rhythm.grade}`);
console.log(`- Claridad: ${resultRhythmIssue.clarity.ratioText} (${resultRhythmIssue.clarity.percent}%) -> Nota: ${resultRhythmIssue.clarity.grade}`);
console.log(`- Autoridad: ${resultRhythmIssue.authority.ratioText} (${resultRhythmIssue.authority.percent}%) -> Nota: ${resultRhythmIssue.authority.grade}`);
console.log(`- Total: ${resultRhythmIssue.totalScore}/100 -> Nota Global: ${resultRhythmIssue.overallGrade}`);

if (resultRhythmIssue.rhythm.grade === "A+" || resultRhythmIssue.clarity.grade === "A+") {
  throw new Error("FAIL: El perfil con problemas de ritmo/muletillas no debería tener A+ en ritmo o claridad");
}
console.log("✓ Las dimensiones reflejan áreas débiles reales con notas inferiores (no todo es A+)");

// 3. Verificar caso con liderazgo fuerte y calma
const answersLeader = {
  objective: "liderazgo",
  profession: "direccion",
  fearSymptom: "ninguno",
  speakingPace: "pausado_firme",
  fillerWords: "quiero_pulir",
  impromptuAbility: "excelente",
  vocalTone: "aspiracion_grave"
};

const resultLeader = calculateDynamicDimensions(answersLeader);
console.log("\n[TEST 3] Caso con fortalezas de Liderazgo:");
console.log(`- Consistencia: ${resultLeader.consistency.ratioText} (${resultLeader.consistency.percent}%) -> Nota: ${resultLeader.consistency.grade}`);
console.log(`- Claridad: ${resultLeader.clarity.ratioText} (${resultLeader.clarity.percent}%) -> Nota: ${resultLeader.clarity.grade}`);
console.log(`- Ritmo: ${resultLeader.rhythm.ratioText} (${resultLeader.rhythm.percent}%) -> Nota: ${resultLeader.rhythm.grade}`);
console.log(`- Autoridad: ${resultLeader.authority.ratioText} (${resultLeader.authority.percent}%) -> Nota: ${resultLeader.authority.grade}`);
console.log(`- Regulación: ${resultLeader.regulation.ratioText} (${resultLeader.regulation.percent}%) -> Nota: ${resultLeader.regulation.grade}`);
console.log(`- Total: ${resultLeader.totalScore}/100 -> Nota Global: ${resultLeader.overallGrade}`);

if (resultLeader.authority.currentVal > 20 || resultLeader.rhythm.currentVal > 25 || resultLeader.clarity.currentVal > 17 || resultLeader.consistency.currentVal > 20 || resultLeader.regulation.currentVal > 18) {
  throw new Error("FAIL: Ninguna dimensión puede superar su máximo específico");
}
console.log("✓ Todos los puntajes respetan estrictamente sus límites máximos asimétricos");

console.log("\n=== TODAS LAS PRUEBAS PASARON EXITOSAMENTE (3/3) ===");
