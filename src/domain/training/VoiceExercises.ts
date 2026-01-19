
export type ExerciseMode = 'AUDIO' | 'VIDEO' | 'TEXT';
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
  // 🧠 NIVEL 1: MINDSET E IDENTIDAD (Base Mental)
  // =================================================================
  {
    id: 'key-phrase',
    title: 'Misión: Identidad',
    description: 'Define tu norte magnético en menos de 120 caracteres. Si dudas, borra.',
    category: 'MINDSET',
    difficulty: 'BEGINNER',
    targetMetrics: ['clarity', 'brevity'],
    requiredMode: 'TEXT',
    steps: [
        'Piensa: ¿Cómo quieres que la gente te recuerde?',
        'Tienes 120 caracteres.',
        'Grábalo en piedra.'
    ],
    benefit: 'Claridad absoluta.',
    tier: 'FREE',
    dimension: 'MINDSET',
    isCore: true,
    customRoute: '/practice/key-phrase',
    aiEnhanced: false 
  },
  {
    id: 'obligatory-silence',
    title: 'Misión: El Vacío',
    description: 'Sobrevive 30 segundos de silencio absoluto mirando a los ojos.',
    category: 'MINDSET',
    difficulty: 'ADVANCED',
    targetMetrics: ['presence', 'calm'],
    requiredMode: 'TEXT',
    steps: [
        'Elige tu nivel de dificultad.',
        'Sostén la mirada en el ancla.',
        'Si te mueves o hablas, pierdes.'
    ],
    benefit: 'Elimina el miedo al silencio.',
    tier: 'FREE',
    dimension: 'AUTHORITY',
    isCore: true,
    customRoute: '/practice/silence',
    aiEnhanced: false 
  },
  {
    id: 'less-is-more',
    title: 'Misión: Síntesis',
    description: 'Destila una idea compleja hasta que solo queden 12 palabras.',
    category: 'MINDSET',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['brevity', 'impact'],
    requiredMode: 'TEXT',
    steps: [
        'Vuelca todo sin filtro.',
        'Corta a 3 oraciones.',
        'Destila a 12 palabras.'
    ],
    benefit: 'Potencia de impacto máxima.',
    tier: 'FREE',
    dimension: 'MINDSET',
    isCore: true,
    customRoute: '/practice/synthesis',
    aiEnhanced: false 
  },

  // =================================================================
  // 🗣️ NIVEL 2: SOPORTE FÍSICO (El Motor)
  // =================================================================
  {
    id: 'stability-check',
    title: 'Misión: Estabilidad',
    description: 'Mantén una exhalación SSSS perfecta por 20 segundos. Sin temblores.',
    category: 'BREATHING',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability'],
    requiredMode: 'AUDIO',
    steps: [
        'Inhala profundo.',
        'Emite una "S" constante.',
        'Si la línea tiembla o baja, reinicias.'
    ],
    benefit: 'Control total de los nervios.',
    tier: 'FREE',
    dimension: 'SUPPORT',
    isCore: true,
    customRoute: '/practice/breathing'
  },
  {
    id: 'functional-volume',
    title: 'Misión: Proyección',
    description: 'Llena la barra de energía hablando fuerte 15s sin tocar la zona roja.',
    category: 'PROJECTION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['volume'],
    requiredMode: 'AUDIO',
    steps: [
        'Proyecta tu voz para llenar la barra.',
        'No grites (Zona Roja = Pierdes).',
        'No susurres (Zona Azul = No carga).'
    ],
    benefit: 'Presencia física dominante.',
    tier: 'FREE',
    dimension: 'RESONANCE',
    isCore: false,
    customRoute: '/practice/projection'
  },

  // =================================================================
  // ⚡ NIVEL 3: RITMO Y TIEMPO (Dominio)
  // =================================================================
  {
    id: 'authority-pause',
    title: 'Misión: Pausa',
    description: 'Habla 15s y atrévete a meter una pausa de 3s. Si no, pierdes.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['timing', 'silence_detection'],
    requiredMode: 'AUDIO',
    steps: [
        'Habla continuo sobre cualquier tema.',
        'Detente en seco por 3 segundos.',
        'Si el tiempo acaba sin pausa, pierdes.'
    ],
    benefit: 'Autoridad a través del silencio.',
    tier: 'FREE',
    dimension: 'AGILITY',
    isCore: true,
    customRoute: '/practice/pause',
    aiEnhanced: false 
  },
  {
    id: 'mental-sync',
    title: 'Misión: Sincronización',
    description: 'Lee al ritmo exacto del marcador. Ni antes, ni después.',
    category: 'MINDSET',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['wpm', 'rhythm'],
    requiredMode: 'AUDIO',
    steps: [
        'Sigue la palabra iluminada.',
        'Mantén el ritmo exacto.',
        'Termina junto con el marcador.'
    ],
    benefit: 'Control de velocidad interno.',
    tier: 'FREE',
    dimension: 'AGILITY',
    isCore: false,
    customRoute: '/practice/reading',
    aiEnhanced: true
  },

  // =================================================================
  // 🎤 NIVEL 4: TÉCNICA Y DICCIÓN (El Instrumento)
  // =================================================================
  {
    id: 'articulation-drill',
    title: 'Misión: Dicción',
    description: 'Logra >90% de precisión en un trabalenguas difícil. La IA no perdona.',
    category: 'ARTICULATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['clarity', 'accuracy'],
    requiredMode: 'AUDIO',
    steps: [
        'Lee la frase compleja.',
        'Articula exageradamente.',
        'Supera el 90% para aprobar.'
    ],
    benefit: 'Claridad cristalina.',
    tier: 'FREE',
    dimension: 'AGILITY',
    isCore: false,
    customRoute: '/practice/articulation',
    aiEnhanced: true
  },
  {
    id: 'sentence-closure',
    title: 'Misión: Cierre Seguro',
    description: 'Detecta y corrige 3 "preguntas fantasma" consecutivas.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['pitchRange'],
    requiredMode: 'AUDIO',
    steps: [
        'Di la frase con certeza.',
        'Baja el tono al final.',
        'Acumula 3 aciertos seguidos para ganar.'
    ],
    benefit: 'Seguridad percibida.',
    tier: 'FREE',
    dimension: 'AUTHORITY',
    isCore: false,
    customRoute: '/practice/inflection',
    aiEnhanced: true
  },

  {
    id: 'filler-killer',
    title: 'Misión: Limpieza',
    description: 'Sobrevive 60s sin decir "eh", "este", "o sea". Cada muletilla te resta vida.',
    category: 'ARTICULATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['clarity', 'filler_words'],
    requiredMode: 'AUDIO',
    steps: [
        'Habla improvisando.',
        'Evita las palabras prohibidas.',
        'Si acumulas 3 muletillas, pierdes.'
    ],
    benefit: 'Oratoria limpia y profesional.',
    tier: 'FREE',
    dimension: 'AUTHORITY',
    isCore: false,
    customRoute: '/practice/filler-killer',
    aiEnhanced: true
  },

  // =================================================================
  // ⚔️ NIVEL 5: AGILIDAD MENTAL (La Arena)
  // =================================================================
  {
    id: 'structured-minute',
    title: 'Misión: Estructura',
    description: 'Clava los tiempos: 10s Intro, 40s Cuerpo, 10s Cierre. Exactos.',
    category: 'IMPROVISATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['structure', 'timing'],
    requiredMode: 'TEXT',
    steps: [
        'Empieza con el reloj.',
        'Cambia de sección cuando cambie el color.',
        'Termina en el segundo 60.'
    ],
    benefit: 'Orden mental bajo presión.',
    tier: 'FREE',
    dimension: 'AGILITY',
    isCore: true,
    customRoute: '/practice/structured-minute',
    aiEnhanced: false 
  },
  {
    id: 'improvisation-challenge',
    title: 'Misión: Flow',
    description: 'Habla 60s sin parar. Si callas más de 3s, pierdes.',
    category: 'IMPROVISATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['flow', 'silence'],
    requiredMode: 'AUDIO',
    steps: [
        'Recibe tema sorpresa.',
        'Habla sin parar.',
        'Sobrevive al minuto.'
    ],
    benefit: 'Agilidad mental pura.',
    tier: 'FREE',
    dimension: 'IMPROV',
    isCore: false,
    customRoute: '/practice/improvisation',
    aiEnhanced: true
  },
  {
    id: 'instant-feedback',
    title: 'Misión: Auditoría',
    description: 'Grábate y encuentra 3 errores en tu propia voz.',
    category: 'INTONATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['pitchRange'],
    requiredMode: 'AUDIO',
    steps: [
        'Graba una intro.',
        'Escucha el retorno.',
        'Marca si cumpliste los 3 criterios.'
    ],
    benefit: 'Conciencia real de tu sonido.',
    tier: 'FREE',
    dimension: 'AUTHORITY',
    isCore: true,
    customRoute: '/practice/instant-playback'
  }
];
