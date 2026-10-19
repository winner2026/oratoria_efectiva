/**
 * Sistema de Referidos - Oratoria Efectiva
 * 
 * Permite a usuarios invitar a amigos y ganar beneficios.
 * Costo: $0 (todo client-side + DB simple)
 */

const REFERRAL_KEY = 'oratoria_referral_code';
const REFERRED_BY_KEY = 'oratoria_referred_by';

export interface ReferralData {
  code: string;
  referralCount: number;
  rewards: ReferralReward[];
}

export interface ReferralReward {
  id: string;
  threshold: number; // Número de referidos necesarios
  name: string;
  description: string;
  claimed: boolean;
}

// Recompensas por número de referidos
export const REFERRAL_REWARDS: Omit<ReferralReward, 'claimed'>[] = [
  {
    id: 'extra_analysis',
    threshold: 1,
    name: '+1 Análisis Semanal',
    description: 'Tu límite semanal sube a 4 análisis',
  },
  {
    id: 'unlock_exercises',
    threshold: 3,
    name: 'Gimnasio Completo',
    description: 'Desbloquea todos los ejercicios por 1 mes',
  },
  {
    id: 'premium_week',
    threshold: 5,
    name: '1 Semana Premium',
    description: 'Prueba Premium gratis por 7 días',
  },
  {
    id: 'premium_month',
    threshold: 10,
    name: '1 Mes Premium',
    description: 'Premium completo por 30 días',
  },
  {
    id: 'lifetime_discount',
    threshold: 25,
    name: '50% OFF de por vida',
    description: 'Descuento permanente en tu suscripción',
  },
];

/**
 * Genera o recupera el código de referido del usuario
 */
export function getOrCreateReferralCode(): string {
  if (typeof window === 'undefined') return '';
  
  let code = localStorage.getItem(REFERRAL_KEY);
  
  if (!code) {
    // Generar código único basado en timestamp + random
    code = 'OE' + Date.now().toString(36).toUpperCase() + 
           Math.random().toString(36).substring(2, 6).toUpperCase();
    localStorage.setItem(REFERRAL_KEY, code);
  }
  
  return code;
}

/**
 * Registra quién refirió a este usuario (si aplica)
 */
export function setReferredBy(code: string): void {
  if (typeof window === 'undefined') return;
  
  // No sobrescribir si ya existe
  if (!localStorage.getItem(REFERRED_BY_KEY)) {
    localStorage.setItem(REFERRED_BY_KEY, code);
  }
}

/**
 * Obtiene el código de quien refirió a este usuario
 */
export function getReferredBy(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFERRED_BY_KEY);
}

/**
 * Genera el link de referido completo
 */
export function getReferralLink(): string {
  if (typeof window === 'undefined') return '';
  const code = getOrCreateReferralCode();
  return `${window.location.origin}?ref=${code}`;
}

/**
 * Verifica si llegó con un código de referido en la URL
 */
export function checkAndSaveReferralFromUrl(): void {
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  if (refCode && refCode !== getOrCreateReferralCode()) {
    setReferredBy(refCode);
  }
}

/**
 * Calcula las recompensas disponibles basado en el número de referidos
 */
export function calculateRewards(referralCount: number): ReferralReward[] {
  return REFERRAL_REWARDS.map(reward => ({
    ...reward,
    claimed: referralCount >= reward.threshold,
  }));
}

/**
 * Comparte el link de referido usando la Web Share API (o clipboard)
 */
export async function shareReferralLink(): Promise<boolean> {
  const link = getReferralLink();
  const text = '¡Mejora tu forma de hablar con Oratoria Efectiva! Usa mi link para acceso anticipado:';
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Oratoria Efectiva - Invitación',
        text,
        url: link,
      });
      return true;
    } catch (err) {
      // User cancelled or error
      console.log('Share cancelled');
    }
  }
  
  // Fallback: copiar al clipboard
  try {
    await navigator.clipboard.writeText(`${text} ${link}`);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}
