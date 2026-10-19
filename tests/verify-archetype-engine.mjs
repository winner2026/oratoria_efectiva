import { calculateVoiceArchetype, calculateAcousticDistance, VOICE_ARCHETYPES } from '../src/domain/archetype/ArchetypeEngine.ts';

console.log("=== INICIANDO AUDITORÍA DEL MOTOR DE ARQUETIPOS DE VOZ (ArchetypeEngine) ===");

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

// 1. Probar que existen los 8 arquetipos con vectores acústicos completos
const archetypeKeys = Object.keys(VOICE_ARCHETYPES);
assert(archetypeKeys.length === 8, `Se definieron exactamente 8 arquetipos distintos (encontrados: ${archetypeKeys.length})`);

archetypeKeys.forEach(k => {
  const arc = VOICE_ARCHETYPES[k];
  const hasAcoustic = arc.acousticVector && 
    Array.isArray(arc.acousticVector.wpmRange) &&
    arc.acousticVector.pauseDurationSec > 0 &&
    arc.acousticVector.pitchVariationHz > 0 &&
    arc.acousticVector.energyStability > 0;
  assert(hasAcoustic, `Arquetipo [${arc.name}] tiene vector acústico medible`);
});

// 2. Probar que DIFERENTES GRUPOS DE ELECCIONES generen DIFERENTES ARQUETIPOS

// Grupo A: CEO / Directivo en Juntas
const profileCEO = {
  objective: "liderazgo",
  profession: "direccion",
  highStakesScenario: "juntas_directivas",
  speakingPace: "monotono_plano",
  vocalTone: "aspiracion_grave",
  archetypeVector: "lider_magnetico"
};
const arcCEO = calculateVoiceArchetype(profileCEO);
assert(arcCEO.id === "COMANDANTE_ESTRATEGICO", `Perfil Directivo genera: ${arcCEO.name} (Esperado: Comandante Estratégico)`);

// Grupo B: Vendedor Comercial de Cierre 1 a 1
const profileSales = {
  objective: "ventas",
  profession: "comercial",
  highStakesScenario: "negociacion_1a1",
  fearSymptom: "aceleracion",
  vocalTone: "aceptable_sin_peso",
  archetypeVector: "persuasor_estrategico"
};
const arcSales = calculateVoiceArchetype(profileSales);
assert(arcSales.id === "PERSUASOR_ALTO_CIERRE", `Perfil Comercial genera: ${arcSales.name} (Esperado: Persuasor de Alto Cierre)`);

// Grupo C: Persona con bloqueo / temblor por ansiedad física (Prioridad Neuro-Vocal)
const profileAnxious = {
  objective: "confianza",
  profession: "creador",
  fearSymptom: "temblor",
  vocalTone: "aguda_tensa",
  speakingPace: "variable_ansioso",
  archetypeVector: "lider_magnetico"
};
const arcAnxious = calculateVoiceArchetype(profileAnxious);
assert(arcAnxious.id === "ANCLA_NEUROVOCAL", `Perfil con ansiedad física genera: ${arcAnxious.name} (Esperado: Ancla de Calma Neuro-Vocal)`);

// Grupo D: Consultor Analítico / Técnico
const profileConsultant = {
  objective: "claridad",
  profession: "consultoria",
  highStakesScenario: "juntas_directivas",
  impromptuAbility: "falta_precision",
  vocalTone: "aceptable_sin_peso",
  archetypeVector: "comunicador_cristalino"
};
const arcConsultant = calculateVoiceArchetype(profileConsultant);
assert(arcConsultant.id === "AUTORIDAD_ANALITICA", `Perfil Consultor genera: ${arcConsultant.name} (Esperado: Autoridad Analítica)`);

// Grupo E: Conferencista / Creador de gran auditorio
const profileKeynote = {
  objective: "confianza",
  profession: "creador",
  highStakesScenario: "auditorios_eventos",
  audienceSize: "masivo_50_mas",
  archetypeVector: "orador_apasionado"
};
const arcKeynote = calculateVoiceArchetype(profileKeynote);
assert(arcKeynote.id === "ORADOR_VISIONARIO", `Perfil Keynote genera: ${arcKeynote.name} (Esperado: Orador Visionario)`);

// 3. Probar cálculo de Distancia Bioacústica Real (Delta)
const measuredAudioFast = {
  wordsPerMinute: 175,       // Muy rápido (vs 120-134 de Comandante Estratégico)
  avgPauseDuration: 0.35,    // Pausas cortas
  pitchVariation: 22,
  energyStability: 0.65,
};
const distFast = calculateAcousticDistance(arcCEO, measuredAudioFast);
console.log(`\nDistancia Acústica (Audio Acelerado vs Comandante Estratégico):`);
console.log(`- Distancia (Brecha): ${distFast.distancePercent}%`);
console.log(`- Afinidad: ${distFast.matchScore}%`);
console.log(`- Cuello de botella detectado: ${distFast.bottleneckDimension}`);

assert(distFast.distancePercent >= 40, `La distancia acústica es alta (${distFast.distancePercent}%) por ritmo acelerado y falta de pausas`);
assert(distFast.bottleneckDimension.includes("Ritmo") || distFast.bottleneckDimension.includes("Pausas"), "Detecta correctamente el cuello de botella del habla");

// Audio calibrado
const measuredAudioOptimal = {
  wordsPerMinute: 128,
  avgPauseDuration: 1.25,
  pitchVariation: 30,
  energyStability: 0.85,
};
const distOpt = calculateAcousticDistance(arcCEO, measuredAudioOptimal);
console.log(`\nDistancia Acústica (Audio Calibrado vs Comandante Estratégico):`);
console.log(`- Distancia (Brecha): ${distOpt.distancePercent}%`);
console.log(`- Afinidad: ${distOpt.matchScore}%`);
assert(distOpt.matchScore >= 80, `Voz calibrada tiene alta afinidad (${distOpt.matchScore}%)`);

console.log(`\nRESUMEN DE AUDITORÍA: ${passed} pasadas, ${failed} fallidas.`);
if (failed > 0) process.exit(1);
