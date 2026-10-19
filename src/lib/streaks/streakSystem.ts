/**
 * Sistema de Streaks - Oratoria Efectiva
 * 
 * Rastrea días consecutivos de práctica usando localStorage.
 * Costo: $0 (todo client-side)
 */

const STREAK_KEY = 'oratoria_streak';
const LAST_PRACTICE_KEY = 'oratoria_last_practice';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  totalDays: number;
}

/**
 * Obtiene los datos actuales del streak
 */
export function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastPracticeDate: null, totalDays: 0 };
  }

  const stored = localStorage.getItem(STREAK_KEY);
  if (!stored) {
    return { currentStreak: 0, longestStreak: 0, lastPracticeDate: null, totalDays: 0 };
  }

  try {
    const data = JSON.parse(stored) as StreakData;
    
    // Verificar si el streak sigue activo (última práctica fue ayer o hoy)
    if (data.lastPracticeDate) {
      const lastDate = new Date(data.lastPracticeDate);
      const today = new Date();
      const diffDays = getDaysDifference(lastDate, today);
      
      // Si pasaron más de 1 día, el streak se reinicia
      if (diffDays > 1) {
        return {
          currentStreak: 0,
          longestStreak: data.longestStreak,
          lastPracticeDate: data.lastPracticeDate,
          totalDays: data.totalDays,
        };
      }
    }
    
    return data;
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastPracticeDate: null, totalDays: 0 };
  }
}

/**
 * Registra una práctica de hoy
 */
export function recordPractice(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastPracticeDate: null, totalDays: 0 };
  }

  const current = getStreakData();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Si ya practicó hoy, no aumentar streak
  if (current.lastPracticeDate === today) {
    return current;
  }
  
  let newStreak = 1;
  
  // Si practicó ayer, aumentar streak
  if (current.lastPracticeDate) {
    const lastDate = new Date(current.lastPracticeDate);
    const todayDate = new Date(today);
    const diffDays = getDaysDifference(lastDate, todayDate);
    
    if (diffDays === 1) {
      newStreak = current.currentStreak + 1;
    }
  }
  
  const newData: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, current.longestStreak),
    lastPracticeDate: today,
    totalDays: current.totalDays + 1,
  };
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
  
  return newData;
}

/**
 * Calcula la diferencia en días entre dos fechas
 */
function getDaysDifference(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round(Math.abs((d2.getTime() - d1.getTime()) / oneDay));
}

/**
 * Verifica si hoy ya practicó
 */
export function hasPracticedToday(): boolean {
  const data = getStreakData();
  const today = new Date().toISOString().split('T')[0];
  return data.lastPracticeDate === today;
}

/**
 * Obtiene el badge basado en el streak actual
 */
export function getStreakBadge(streak: number): { emoji: string; label: string; color: string } | null {
  if (streak >= 365) return { emoji: '👑', label: 'Leyenda', color: 'text-yellow-400' };
  if (streak >= 100) return { emoji: '💎', label: 'Diamante', color: 'text-cyan-400' };
  if (streak >= 30) return { emoji: '🏆', label: 'Campeón', color: 'text-amber-400' };
  if (streak >= 14) return { emoji: '⭐', label: 'Estrella', color: 'text-purple-400' };
  if (streak >= 7) return { emoji: '🔥', label: 'En llamas', color: 'text-orange-400' };
  if (streak >= 3) return { emoji: '✨', label: 'Constante', color: 'text-blue-400' };
  return null;
}

/**
 * Mensaje motivacional basado en el streak
 */
export function getStreakMessage(streak: number, practicedToday: boolean): string {
  if (practicedToday) {
    const messages = [
      "Tu voz es tu poder. Gran trabajo hoy.",
      "Cada palabra que perfeccionas hoy, resonará mañana.",
      "Has dado un paso más hacia tu mejor versión. ¡Felicidades!",
      "La constancia es la llave de la autoridad. Vuelve mañana.",
      "Has dominado tu miedo una vez más. Que tu impacto siga creciendo."
    ];
    // Usar el streak como semilla para variar mensajes o devolver uno fijo
    if (streak >= 30) return "Eres una leyenda en formación. Tu impacto es imparable.";
    if (streak >= 7) return `¡${streak} días de maestría! Tu transformación es real.`;
    
    return messages[streak % messages.length];
  } else {
    if (streak > 0) {
      return `Tienes una luz que el mundo necesita oír. Mantén viva tu racha de ${streak} días.`;
    }
    return "Hoy es el día perfecto para que tu voz sea escuchada. ¿Empezamos?";
  }
}
