export type TipCategory = "Higiene" | "Postura" | "Voz" | "Retórica" | "Mentalidad";

export interface OratoryTip {
  id: number;
  category: TipCategory;
  title: string;
  content: string;
  icon: string;
}

export const ORATORY_TIPS: OratoryTip[] = [
  // --- HIGIENE VOCAL ---
  { id: 1, category: "Higiene", title: "Hidratación Constante", content: "Bebe agua regularmente. Las cuerdas vocales necesitan estar bien lubricadas para vibrar sin esfuerzo.", icon: "water_drop" },
  { id: 2, category: "Higiene", title: "Evita el Carraspeo", content: "Carraspear golpea tus cuerdas vocales. Si sientes flema, mejor bebe agua o traga fuerte.", icon: "do_not_touch" },
  { id: 3, category: "Higiene", title: "Descanso Vocal", content: "Si hablaste mucho durante el día, regálale a tu voz periodos de silencio total.", icon: "bedtime" },
  { id: 4, category: "Higiene", title: "Manzana Verde", content: "La acidez de la manzana verde ayuda a limpiar la boca y estimula saliva fluida, ideal antes de hablar.", icon: "nutrition" },
  
  // --- POSTURA ---
  { id: 10, category: "Postura", title: "Posición de Poder", content: "Ocupar espacio con tu cuerpo aumenta tu testosterona y reduce el cortisol, haciéndote sentir más seguro.", icon: "accessibility_new" },
  { id: 11, category: "Postura", title: "Contacto Visual", content: "Mirar a los ojos (o a la cámara) genera confianza. Si te intimida, mira al entrecejo.", icon: "visibility" },
  { id: 12, category: "Postura", title: "Manos Visibles", content: "Mostrar las manos es un signo evolutivo de 'no tengo armas'. Genera confianza inmediata.", icon: "pan_tool" },
  { id: 13, category: "Postura", title: "Hombros Relajados", content: "La tensión en los hombros ahoga la voz. Déjalos caer hacia atrás y abajo.", icon: "self_improvement" },
  { id: 14, category: "Postura", title: "Pies a Tierra", content: "Mantén los pies separados al ancho de caderas para tener una base sólida y no balancearte.", icon: "directions_walk" },

  // --- VOZ Y RESPIRACIÓN ---
  { id: 20, category: "Voz", title: "Respiración Diafragmática", content: "Respira inflando la panza, no el pecho. Esto te da aire para frases largas y potentes.", icon: "air" },
  { id: 21, category: "Voz", title: "Evita el 'Fry' Vocal", content: "Ese sonido rasposo al final de las frases daña tu voz y resta autoridad. Mantén la energía hasta el final.", icon: "graphic_eq" },
  { id: 22, category: "Voz", title: "Sonrisa Telefónica", content: "Sonreír levemente al hablar ilumina el tono de tu voz y la hace más empática.", icon: "sentiment_satisfied" },
  { id: 23, category: "Voz", title: "El Silencio es Poder", content: "Callar antes de un punto importante genera expectativa. No temas al silencio.", icon: "volume_off" },
  { id: 24, category: "Voz", title: "Varía tu Ritmo", content: "La monotonía duerme a la audiencia. Alterna entre rápido (emoción) y lento (importancia).", icon: "speed" },

  // --- RETÓRICA ---
  { id: 30, category: "Retórica", title: "Regla de Tres", content: "El cerebro ama los tríos: 'Sangre, sudor y lágrimas'. Estructura tus ideas en tres puntos.", icon: "looks_3" },
  { id: 31, category: "Retórica", title: "Empieza con un Gancho", content: "tienes 7 segundos para captar la atención. Empieza con una pregunta o un dato impactante.", icon: "hook" },
  { id: 32, category: "Retórica", title: "Usa Metáforas", content: "Las metáforas convierten ideas abstractas en imágenes concretas que el cerebro recuerda.", icon: "lightbulb" },
  { id: 33, category: "Retórica", title: "Llamado a la Acción", content: "Nunca termines sin decirle a tu audiencia qué hacer con la información que les diste.", icon: "campaign" },
  
  // --- MENTALIDAD ---
  { id: 40, category: "Mentalidad", title: "No eres el Protagonista", content: "El protagonista es tu mensaje y cómo ayuda a la audiencia. Esto reduce la presión sobre ti.", icon: "groups" },
  { id: 41, category: "Mentalidad", title: "El Error es Humano", content: "Si te equivocas, sonríe y sigue. La audiencia perdona errores, pero no la incomodidad.", icon: "mood_bad" },
  { id: 42, category: "Mentalidad", title: "Visualiza el Éxito", content: "Imagina los aplausos antes de empezar. Tu cerebro se preparará para ganar.", icon: "psychology" }
];

// Alias para compatibilidad
export type VocalTip = OratoryTip;

export function getRandomTip(): OratoryTip {
  const randomIndex = Math.floor(Math.random() * ORATORY_TIPS.length);
  return ORATORY_TIPS[randomIndex];
}

// Helpers de UI
export function getCategoryColor(category: TipCategory): string {
  switch (category) {
    case "Higiene": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "Postura": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    case "Voz": return "text-green-400 bg-green-500/10 border-green-500/20";
    case "Retórica": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    case "Mentalidad": return "text-pink-400 bg-pink-500/10 border-pink-500/20";
    default: return "text-gray-400";
  }
}
