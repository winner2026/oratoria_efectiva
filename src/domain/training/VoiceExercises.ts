
export type ExerciseMode = 'AUDIO' | 'VIDEO';
export type UserLevel = 'FREE' | 'STARTER' | 'ELITE';
export type BiometricDimension = 'SUPPORT' | 'RESONANCE' | 'AGILITY' | 'AUTHORITY' | 'MINDSET' | 'IMPROV';

export type VoiceExercise = {
  id: string;
  title: string;
  description: string;
  category: 'BREATHING' | 'PROJECTION' | 'INTONATION' | 'MINDSET' | 'ARTICULATION' | 'IMPROVISATION'; // Simplified categories
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  targetMetrics: string[]; 
  requiredMode: ExerciseMode;
  steps: string[];
  benefit: string;
  
  tier: UserLevel;
  dimension: BiometricDimension;
  isCore?: boolean; 
  customRoute?: string;
  intensity?: 'LOW' | 'MEDIUM' | 'HIGH';
  aiEnhanced?: boolean;
};

export const VOICE_EXERCISES: VoiceExercise[] = [
  // =================================================================
  // 1️⃣ AJUSTE DE ESTABILIDAD (SSSS Controlado) - CORE
  // =================================================================
  {
    id: 'stability-check',
    title: 'Respirar con la Panza',
    description: 'Sopla suave y mantén la línea recta. Si tiembla, estás nervioso.',
    category: 'BREATHING',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability'],
    requiredMode: 'AUDIO',
    steps: [
      'Inhala profundo por la nariz.',
      'Sopla una "S" suave y constante (SSSS...).',
      'Mantén la línea verde lo más recta posible.',
      'Si tiembla, estás nervioso. Repite hasta estabilizar.'
    ],
    benefit: 'Reduce la ansiedad en segundos y te da control total.',
    tier: 'FREE',
    dimension: 'SUPPORT',
    isCore: true,
    customRoute: '/practice/breathing'
  },

  // =================================================================
  // 2️⃣ MONITOR DE RETORNO (Auto-escucha)
  // =================================================================
  {
    id: 'instant-feedback',
    title: 'Escúchate al Instante',
    description: 'Di una frase y escúchate al momento. ¡Así es como suenas!',
    category: 'INTONATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['pitchRange'],
    requiredMode: 'AUDIO',
    steps: [
      'Graba tu "Intro" de reunión (5 seg).',
      'Escucha el retorno inmediato.',
      'Ajusta lo que no te guste y repite.'
    ],
    benefit: 'Te revela cómo suenas realmente. Insight inmediato.',
    tier: 'FREE',
    dimension: 'AUTHORITY',
    isCore: true,
    customRoute: '/practice/instant-playback'
  },

  // =================================================================
  // 3️⃣ MEDIDOR DE VOLUMEN FUNCIONAL
  // =================================================================
  {
    id: 'functional-volume',
    title: 'Hablar Fuerte sin Gritar',
    description: 'Mantén la barra en la ZONA VERDE. No dejes que se ponga roja.',
    category: 'PROJECTION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['volume'],
    requiredMode: 'AUDIO',
    steps: [
      'Habla a la pantalla como si fuera una persona.',
      'Mantén la barra en la ZONA VERDE.',
      'Evita el Azul (débil) y el Rojo (agresivo).'
    ],
    benefit: 'Proyección perfecta sin gritar. Presencia física.',
    tier: 'STARTER',
    dimension: 'RESONANCE',
    isCore: false,
    customRoute: '/practice/projection'
  },

  // =================================================================
  // 4️⃣ CIERRE DE FRASE (Descendente)
  // =================================================================
  {
    id: 'sentence-closure',
    title: 'Terminar Frases Seguro',
    description: 'No preguntes al final. Termina tus frases bajando el tono.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['pitchRange'],
    requiredMode: 'AUDIO',
    steps: [
      'Di la frase propuesta.',
      'Baja el tono al final (como poniendo un punto final firme).',
      'Si subes el tono (pregunta), inténtalo de nuevo.'
    ],
    benefit: 'Sensación de autoridad inmediata. Menos interrupciones.',
    tier: 'ELITE',
    dimension: 'AUTHORITY',
    isCore: false,
    customRoute: '/practice/inflection',
    aiEnhanced: true
  },

  // =================================================================
  // 5️⃣ PAUSA CONTROLADA (El Silencio)
  // =================================================================
  {
    id: 'controlled-pause',
    title: 'Hacer Pausas',
    description: 'Habla, espera 1 segundo, y sigue. El silencio te da poder.',
    category: 'MINDSET',
    difficulty: 'ADVANCED',
    targetMetrics: ['rhythmConsistency'],
    requiredMode: 'AUDIO',
    steps: [
      'Di la primera parte de la frase.',
      'ESPERA 1 segundo completo (respira).',
      'Di la segunda parte con firmeza.'
    ],
    benefit: 'Aumenta tu impacto y reduce la prisa nerviosa.',
    tier: 'ELITE',
    dimension: 'MINDSET',
    isCore: false,
    customRoute: '/practice/breathing?mode=pauses',
    aiEnhanced: true
  },

  // =================================================================
  // 6️⃣ MINUTO DE ORO (Improvisación)
  // =================================================================
  {
    id: 'improvisation-challenge',
    title: 'Minuto de Oro',
    description: 'Habla 60s sin parar sobre un tema aleatorio. Prohibido callarse.',
    category: 'IMPROVISATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['flow', 'silence'],
    requiredMode: 'AUDIO',
    steps: [
        'Recibe un tema sorpresa.',
        'Habla sin parar durante 60 segundos.',
        'Si te callas más de 3s, pierdes.'
    ],
    benefit: 'Elimina el miedo al vacío y mejora tu agilidad mental.',
    tier: 'FREE', // Visible para todos
    dimension: 'IMPROV',
    isCore: false,
    customRoute: '/practice/improvisation',
    aiEnhanced: true
  },

  // =================================================================
  // 7️⃣ SINCRONIZACIÓN MENTAL (Lectura)
  // =================================================================
  {
    id: 'mental-sync',
    title: 'Sincronización Mental',
    description: 'Lee al ritmo exacto del marcador. Ni antes, ni después.',
    category: 'MINDSET',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['wpm', 'rhythm'],
    requiredMode: 'AUDIO',
    steps: [
        'Sigue la palabra iluminada.',
        'Respeta la velocidad impuesta.',
        'Mantén el flujo constante.'
    ],
    benefit: 'Calibra tu velocidad interna y reduce la prisa.',
    tier: 'FREE',
    dimension: 'AGILITY',
    isCore: false,
    customRoute: '/practice/reading',
    aiEnhanced: true
  },

  // =================================================================
  // 8️⃣ TRABALENGUAS (Articulación)
  // =================================================================
  {
    id: 'articulation-drill',
    title: 'Trabalenguas Pro',
    description: 'Repite frases complejas con dicción perfecta. La IA te evaluará.',
    category: 'ARTICULATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['clarity', 'accuracy'],
    requiredMode: 'AUDIO',
    steps: [
        'Escucha/Lee la frase compleja.',
        'Repítela con máxima claridad.',
        'Supera el 85% de precisión para avanzar.'
    ],
    benefit: 'Limpia tu dicción y agiliza tu lengua.',
    tier: 'FREE',
    dimension: 'AGILITY',
    isCore: false,
    customRoute: '/practice/articulation',
    aiEnhanced: true
  }
];
