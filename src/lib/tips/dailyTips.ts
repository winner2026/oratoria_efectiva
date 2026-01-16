/**
 * PROTOCOLO DE 30 DÍAS: BIO-CALIBRACIÓN MENSUAL ("SANTIAGO")
 * 
 * Sistema de gating por plan:
 * - FREE: 7 días (HARDWARE)
 * - STARTER: 21 días (HARDWARE + SOFTWARE + SYSTEM)
 * - PREMIUM: 30 días (Protocolo completo)
 */

import { PlanType, PLAN_CONFIGS, migrateLegacyPlan } from "@/types/Plan";

export interface DailyProtocol {
  day: number;
  phase: "HARDWARE" | "SOFTWARE" | "SYSTEM" | "COMBAT";
  title: string;
  action: string;
  science: string;
}

export interface ProtocolAccess {
  protocol: DailyProtocol;
  isLocked: boolean;
  unlockPlan?: PlanType;
  unlockPlanName?: string;
  daysUntilUnlock?: number;
  completionPercentage: number;
}

export const THIRTY_DAY_PROTOCOL: DailyProtocol[] = [
  // SEMANA 1: HARDWARE (Soporte Físico)
  {
    day: 1,
    phase: "HARDWARE",
    title: "Respirar Bien",
    action: "Inhala 4s, sostén 4s, exhala 8s con siseo 'Ssss'. Repite 3 veces.",
    science: "Activa el nervio vago para reducir cortisol inmediato."
  },
  {
    day: 2,
    phase: "HARDWARE",
    title: "Soltar Mandíbula",
    action: "Masajea la articulación temporomandibular (TMJ) mientras dices 'Maaa'.",
    science: "La tensión en la TMJ oprime la laringe, agudizando la voz."
  },
  {
    day: 3,
    phase: "HARDWARE",
    title: "Pies Firmes",
    action: "Habla parado, separando pies. Siente peso en talones.",
    science: "El cerebro asocia estabilidad física con seguridad psicológica."
  },
  {
    day: 4,
    phase: "HARDWARE",
    title: "Voz de Pecho",
    action: "Coloca mano en esternón. Di 'Mmmm' hasta sentir vibración allí.",
    science: "Baja el tono percibido sin forzar cuerdas vocales."
  },
  {
    day: 5,
    phase: "HARDWARE",
    title: "Cuello Suelto",
    action: "Gira cuello lentamente diciendo 'Uuuu'. Detecta cortes de voz.",
    science: "Libera tensión cervical que estrangula el flujo de aire."
  },
  {
    day: 6,
    phase: "HARDWARE",
    title: "Lanzar Aire",
    action: "Lanza aire con '¡PA!' al diafragma. Cero garganta.",
    science: "Entrena la proyección sin daño tisular."
  },
  {
    day: 7,
    phase: "HARDWARE",
    title: "Hacer Silencios",
    action: "Grábate. Haz pausa de 3s completos entre frases.",
    science: "El silencio demuestra estatus. La prisa demuestra sumisión."
  },

  // SEMANA 2: SOFTWARE (Dicción y Velocidad)
  {
    day: 8,
    phase: "SOFTWARE",
    title: "Mover la Boca",
    action: "Lee un mail exagerando 200% el movimiento de labios.",
    science: "Despierta la memoria muscular facial dormida."
  },
  {
    day: 9,
    phase: "SOFTWARE",
    title: "Hablar Lento",
    action: "Habla caminando lento. Una palabra por paso.",
    science: "Sincroniza el ritmo motor con el ritmo verbal."
  },
  {
    day: 10,
    phase: "SOFTWARE",
    title: "Eliminación de Relleno",
    action: "Graba 1 min. Cada 'ehhh' cuesta 10 sentadillas.",
    science: "Castigo físico leve recablea el circuito de hábito."
  },
  {
    day: 11,
    phase: "SOFTWARE",
    title: "Ataque Consonántico",
    action: "Enfatiza T, P, K al final de las palabras.",
    science: "Los finales claros se perciben como pensamiento terminado/seguro."
  },
  {
    day: 12,
    phase: "SOFTWARE",
    title: "Modulación Ondulatoria",
    action: "Di una frase subiendo y bajando tono exageradamente.",
    science: "Rompe la monotonía que duerme al córtex auditivo."
  },
  {
    day: 13,
    phase: "SOFTWARE",
    title: "Lectura Vertical",
    action: "Lee solo verbos y sustantivos de un texto.",
    science: "Entrena al cerebro a priorizar palabras de valor."
  },
  {
    day: 14,
    phase: "SOFTWARE",
    title: "Síntesis Ejecutiva",
    action: "Resume tu día en 3 frases de menos de 10 palabras.",
    science: "La brevedad es la métrica definitiva de autoridad."
  },

  // SEMANA 3: SYSTEM (Estructura y Persuasión)
  {
    day: 15,
    phase: "SYSTEM",
    title: "Estructura Tríada",
    action: "Responde todo hoy con 3 puntos: 'Primero, Segundo, Por tanto'.",
    science: "El cerebro procesa patrones de 3 con menor carga cognitiva."
  },
  {
    day: 16,
    phase: "SYSTEM",
    title: "Inicio Explosivo",
    action: "Empieza reuniones con un dato o conclusión, no con 'Hola'.",
    science: "Aprovecha el 'Efecto de Primacía' atencional."
  },
  {
    day: 17,
    phase: "SYSTEM",
    title: "Analogías Puente",
    action: "Explica un problema técnico usando 'Es como...'.",
    science: "Conecta nueva info con redes neuronales existentes."
  },
  {
    day: 18,
    phase: "SYSTEM",
    title: "Cierre de Broche",
    action: "Termina repitiendo tu primera frase con nueva entonación.",
    science: "Crea sensación de completitud y maestría."
  },
  {
    day: 19,
    phase: "SYSTEM",
    title: "Pregunta Retórica",
    action: "Inserta '¿Por qué importa esto?' antes de tu punto clave.",
    science: "Reactiva la atención del lóbulo frontal."
  },
  {
    day: 20,
    phase: "SYSTEM",
    title: "Pausa Táctica",
    action: "Pausa antes de responder una pregunta difícil. Cuenta a 2.",
    science: "Señala reflexión profunda en lugar de reacción defensiva."
  },
  {
    day: 21,
    phase: "SYSTEM",
    title: "Etiquetado Emocional",
    action: "Di 'Parece que esto te preocupa' ante una objeción.",
    science: "Desactiva la amígdala del interlocutor (Técnica FBI)."
  },

  // SEMANA 4: COMBAT (Situaciones Reales)
  {
    day: 22,
    phase: "COMBAT",
    title: "Interrupción Asertiva",
    action: "Usa 'Permíteme construir sobre eso...' para tomar la palabra.",
    science: "Validación + Redirección evita conflicto de estatus."
  },
  {
    day: 23,
    phase: "COMBAT",
    title: "Defensa de Espacio",
    action: "Expande tus brazos sobre la mesa al hablar.",
    science: "La territorialidad física aumenta testosterona (Power Posing)."
  },
  {
    day: 24,
    phase: "COMBAT",
    title: "Mirada de Poder",
    action: "Mira un ojo, luego el otro, luego la boca (Triángulo).",
    science: "Mantiene conexión sin intimidación agresiva."
  },
  {
    day: 25,
    phase: "COMBAT",
    title: "Gestión de 'No sé'",
    action: "Responde: 'No tengo el dato ahora, te lo envío a las 5pm'.",
    science: "Sustituye incertidumbre por compromiso de acción."
  },
  {
    day: 26,
    phase: "COMBAT",
    title: "Voz de Medianoche",
    action: "Baja volumen y tono para decir algo secreto/importante.",
    science: "Obliga al oyente a inclinarse (compromiso físico)."
  },
  {
    day: 27,
    phase: "COMBAT",
    title: "Recuperación de Error",
    action: "Si te trabas, pausa, sonríe y repite lento. No pidas perdón.",
    science: "El error no baja estatus; la disculpa excesiva sí."
  },
  {
    day: 28,
    phase: "COMBAT",
    title: "Anclaje Pre-Meeting",
    action: "Usa música alta 2 mins antes de entrar. Sube energía.",
    science: "Priming emocional cambia el estado base."
  },
  {
    day: 29,
    phase: "COMBAT",
    title: "Visualización Negativa",
    action: "Imagina lo peor que puede pasar. Aceptalo. Y habla.",
    science: "Inoculación contra el estrés (Stoicism tech)."
  },
  {
    day: 30,
    phase: "COMBAT",
    title: "Celebración de Identidad",
    action: "Graba tu presentación final. Compárala con el Día 1.",
    science: "Consolidación dopaminérgica del nuevo auto-concepto."
  }
];

/**
 * Obtiene el protocolo del día con lógica de gating por plan
 */
export function getDailyProtocol(
  userPlan: string = 'FREE',
  daysSinceStart?: number
): ProtocolAccess {
  // Migrar planes legacy
  const planType = migrateLegacyPlan(userPlan) as PlanType;
  const config = PLAN_CONFIGS[planType];
  
  // Si no se proporciona daysSinceStart, usar día del mes (MVP)
  const currentDay = daysSinceStart ?? new Date().getDate();
  
  // Calcular índice del protocolo (ciclo de 30 días)
  const protocolIndex = ((currentDay - 1) % THIRTY_DAY_PROTOCOL.length);
  const protocol = THIRTY_DAY_PROTOCOL[protocolIndex];
  
  // Verificar si el usuario tiene acceso a este día
  const maxDay = config.protocolDays;
  const isLocked = currentDay > maxDay;
  
  // Calcular plan sugerido para desbloquear
  let unlockPlan: PlanType | undefined;
  let unlockPlanName: string | undefined;
  
  if (isLocked) {
    if (planType === 'FREE') {
      unlockPlan = currentDay <= 21 ? 'STARTER' : 'PREMIUM';
      unlockPlanName = currentDay <= 21 ? 'Hábito de Alto Rendimiento' : 'Presencia Ejecutiva';
    } else if (planType === 'STARTER') {
      unlockPlan = 'PREMIUM';
      unlockPlanName = 'Presencia Ejecutiva';
    }
  }
  
  // Calcular días hasta desbloqueo
  const daysUntilUnlock = isLocked ? currentDay - maxDay : undefined;
  
  // Calcular porcentaje de completación
  const completionPercentage = Math.min(100, Math.round((currentDay / maxDay) * 100));
  
  return {
    protocol,
    isLocked,
    unlockPlan,
    unlockPlanName,
    daysUntilUnlock,
    completionPercentage
  };
}

/**
 * Obtiene estadísticas de progreso del usuario
 */
export function getProtocolStats(userPlan: string, currentDay: number) {
  const planType = migrateLegacyPlan(userPlan) as PlanType;
  const config = PLAN_CONFIGS[planType];
  const maxDay = config.protocolDays;
  
  const completed = Math.min(currentDay, maxDay);
  const remaining = Math.max(0, maxDay - currentDay);
  const isComplete = currentDay >= maxDay;
  
  return {
    completed,
    remaining,
    total: maxDay,
    isComplete,
    nextMilestone: isComplete ? null : maxDay
  };
}

// Mantener compatibilidad con llamadas legacy
export const DAILY_TIPS = THIRTY_DAY_PROTOCOL.map(p => `${p.title}: ${p.action}`);
