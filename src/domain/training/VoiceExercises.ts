


export type ExerciseMode = 'AUDIO' | 'VIDEO';
export type UserLevel = 'FREE' | 'STARTER' | 'ELITE';
export type BiometricDimension = 'SUPPORT' | 'RESONANCE' | 'AGILITY' | 'AUTHORITY' | 'MINDSET' | 'IMPROV';

export type VoiceExercise = {
  id: string;
  title: string;
  description: string;
  category: 'BREATHING' | 'PROJECTION' | 'ARTICULATION' | 'INTONATION' | 'RELAXATION' | 'MINDSET' | 'IMPROVISATION' | 'VOCABULARY';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  targetMetrics: string[]; 
  requiredMode: ExerciseMode;
  steps: string[];
  benefit: string;
  
  // 🧠 NUEVA ESTRUCTURA 3x3
  tier: UserLevel;
  dimension: BiometricDimension;
  isCore?: boolean; 
  customRoute?: string;
  intensity?: 'LOW' | 'MEDIUM' | 'HIGH';
};

export const VOICE_EXERCISES: VoiceExercise[] = [
  // =================================================================
  // 🟢 NIVEL FREE (CORE FUNDAMENTALS)
  // =================================================================
  {
    id: 'diaphragmatic-breathing',
    title: 'Respiración Diafragmática',
    description: 'La base absoluta de la voz. Aprende a respirar con el abdomen para ganar estabilidad.',
    category: 'BREATHING',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability', 'volume'],
    requiredMode: 'AUDIO',
    steps: [
      'Siéntate derecho o párate con los pies a la altura de los hombros.',
      'Coloca una mano en el abdomen y otra en el pecho.',
      'Inhala profundo intentando que SOLO se mueva la mano del abdomen.',
      'Exhala controlando que el pecho siga inmóvil.'
    ],
    benefit: 'Aumenta tu capacidad pulmonar y estabilidad (Soporte Vital).',
    tier: 'FREE',
    dimension: 'SUPPORT',
    isCore: true,
    customRoute: '/practice/breathing'
  },
  {
    id: 'instant-playback',
    title: 'Auditoría de Auto-Escucha',
    description: 'Grabadora de retorno inmediato. La herramienta #1 para corregir tu percepción vocal.',
    category: 'INTONATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['pitchRange'],
    requiredMode: 'AUDIO',
    steps: [
      'Graba una frase corta (5-10s).',
      'Escúchala inmediatamente por auriculares.',
      'Detecta muletillas y tono monótono al instante.'
    ],
    benefit: 'Entrena tu oído para escucharte como te escuchan los demás.',
    tier: 'FREE',
    dimension: 'AUTHORITY',
    isCore: true,
    customRoute: '/practice/instant-playback'
  },
  {
    id: 'timed-reading',
    title: 'Lectura Cronometrada',
    description: 'Entrena tu fluidez siguiendo un ritmo visual constante. Adiós a los titubeos.',
    category: 'ARTICULATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['wordsPerMinute', 'rhythmConsistency'],
    requiredMode: 'AUDIO',
    steps: [
        'Sigue el texto resaltado con tu voz.',
        'No te detengas ni te aceleres, mantén el ritmo.',
        'Respira en las pausas marcadas.'
    ],
    benefit: 'Sincroniza tu cerebro y tu lengua a una velocidad profesional.',
    tier: 'FREE',
    dimension: 'AGILITY',
    isCore: true,
    customRoute: '/practice/reading'
  },
  {
    id: 'tongue-twisters',
    title: 'Trabalenguas de Velocidad',
    description: 'El gimnasio de la lengua. Elimina el balbuceo y mejora la precisión bajo presión.',
    category: 'ARTICULATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['score_claridad', 'wordsPerMinute'],
    requiredMode: 'AUDIO',
    steps: [
      'Empieza lento: "Tres tristes tigres tragaban trigo en un trigal".',
      'Exagera la pronunciación de cada sílaba.',
      'Aumenta la velocidad poco a poco sin perder claridad.'
    ],
    benefit: 'Evita que se te "coman" las sílabas al hablar rápido.',
    tier: 'FREE',
    dimension: 'AGILITY',
    isCore: true,
    customRoute: '/practice/articulation'
  },
  {
    id: 'news-anchor',
    title: 'Entonación Dinámica', // Changed from 'El Locutor de Noticias' to match visualizer capabilities
    description: 'Combate la monotonía. Aprende a variar tu tono (picos y valles) para mantener la atención.',
    category: 'INTONATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['pitchRange', 'rhythmConsistency'],
    requiredMode: 'AUDIO',
    steps: [
      'Lee una frase evitando sonar plano (robot).',
      'Sube el tono en las palabras más importantes.',
      'Baja el tono en los conectores y cierres.'
    ],
    benefit: 'Una voz melódica retiene al cerebro de tu audiencia.',
    tier: 'FREE',
    dimension: 'AUTHORITY',
    isCore: true,
    customRoute: '/practice/intonation'
  },
  {
    id: 'anxiety-breathing',
    title: 'Protocolo Anti-Pánico (SOS)',
    description: 'Botón de emergencia. Usa el Biofeedback para estabilizar tu sistema nervioso.',
    category: 'MINDSET',
    difficulty: 'BEGINNER',
    targetMetrics: ['rhythmConsistency', 'energyStability'],
    requiredMode: 'AUDIO',
    steps: [
      'Sigue el círculo visualizador en pantalla.',
      'Inhala profundo y suelta el aire con un "Sssss" constante.',
      'Mantén la señal visual marcada como "ESTABLE".'
    ],
    benefit: 'Elimina el temblor de voz y la taquicardia al instante.',
    tier: 'FREE',
    dimension: 'MINDSET',
    isCore: true,
    customRoute: '/practice/breathing'
  },

  // =================================================================
  // 🔵 NIVEL STARTER (HABIT BUILDER)
  // =================================================================
  {
    id: 'vocal-projection',
    title: 'Proyección a la Pared',
    description: 'Haz que tu voz viaje sin gritar. Ideal para ganar presencia en salas grandes.',
    category: 'PROJECTION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['volume', 'energyStability'],
    requiredMode: 'AUDIO',
    steps: [
      'Siéntate contra una pared y mira un punto lejano.',
      'Di "Hola" intentando tocar ese punto con tu voz.',
      'Impulsa el aire desde el diafragma, no la garganta.'
    ],
    benefit: 'Tu voz llenará la sala sin esfuerzo físico.',
    tier: 'STARTER',
    dimension: 'RESONANCE',
    isCore: false,
    customRoute: '/practice/projection'
  },
  {
    id: 'emotional-reading',
    title: 'Lectura con Matices',
    description: 'Combate la voz monótona (robot). Aprende a "pintar" con tu voz.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['pitchRange', 'rhythmConsistency'],
    requiredMode: 'AUDIO',
    steps: [
      'Lee un párrafo con entusiasmo exagerado.',
      'Léelo ahora con seriedad absoluta.',
      'Varía la velocidad para enfatizar palabras clave.'
    ],
    benefit: 'Añade emoción y mantiene a la audiencia enganchada.',
    tier: 'STARTER',
    dimension: 'AUTHORITY',
    isCore: false
  },
  {
    id: 'pen-horizontal',
    title: 'El Bolígrafo Horizontal',
    description: 'El ejercicio clásico para una dicción perfecta. Entrena con resistencia, graba con libertad.',
    category: 'ARTICULATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['score_claridad'],
    requiredMode: 'AUDIO',
    steps: [
      'Paso 1: Lee el texto con un bolígrafo entre los dientes (Entrenamiento).',
      'Paso 2: Quita el bolígrafo y siente la liberación.',
      'Paso 3: ¡GRABA AHORA sin el bolígrafo para medir tu claridad!'
    ],
    benefit: 'Mejora radical e inmediata en la claridad.',
    tier: 'STARTER',
    dimension: 'AGILITY',
    isCore: false
  },
  {
    id: 'lip-trill-master',
    title: 'Vibración Labial (Lip Trill)',
    description: 'El calentamiento #1 de los profesionales. Despierta tu resonancia.',
    category: 'ARTICULATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability', 'pitchRange'],
    requiredMode: 'AUDIO',
    steps: [
      'Une tus labios relajados y sopla ("Prrrr").',
      'Haz variaciones de tono (sirenas) mientas vibras.',
      'Relaja toda la tensión facial.'
    ],
    benefit: 'Conecta respiración y sonido perfectamente.',
    tier: 'STARTER',
    dimension: 'RESONANCE',
    isCore: false
  },

  // =================================================================
  // 🟣 NIVEL ELITE (AUTHORITY LAB)
  // =================================================================
  {
    id: 'defend-the-indefensible',    // 🆕 NEW BLACK OPS EXERCISE
    title: 'Defensa de lo Indefendible',
    description: 'Entrenamiento de Stress-Test. Defiende una postura absurda sin que tu voz tiemble.',
    category: 'IMPROVISATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['volume', 'energyStability', 'score_seguridad'], // Volume activa el Dinamómetro
    requiredMode: 'AUDIO',
    steps: [
      'La App te dará una premisa absurda (ej: "Por qué dormir es malo").',
      'Tienes 60 segundos para defenderla con pasión.',
      'Si tu volumen o tono caen, pierdes estatus.'
    ],
    benefit: 'Desconecta el miedo al ridículo y entrena la soberanía bajo fuego.',
    tier: 'ELITE',
    dimension: 'IMPROV',
    isCore: false,
    customRoute: '/practice/improvisation'
  },
  {
    id: 'improvisation-connect',
    title: 'Asociación de Palabras (Neural Link)',
    description: 'Entrena tu cerebro para nunca quedarte en blanco ante una pregunta.',
    category: 'IMPROVISATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['awkwardSilences', 'fillerCount'],
    requiredMode: 'AUDIO',
    steps: [
      'Di una palabra al azar.',
      'Habla 30 segundos conectándola con tu tema principal.',
      'Salta a otro concepto sin dejar de hablar.'
    ],
    benefit: 'Agilidad mental suprema para Q&A y negociaciones.',
    tier: 'ELITE',
    dimension: 'IMPROV',
    isCore: false
  },
  {
    id: 'authority-resonance', // 🔄 RENAMED FROM PRIEST-VOICE
    title: 'Resonancia de Autoridad',
    description: 'Practica la profundidad sonora para proyectar mando y calma.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['energyStability', 'pitchRange'],
    requiredMode: 'AUDIO',
    steps: [
      'Usa tu tono más grave y pausado.',
      'Habla como si estuvieras en una cámara acústica perfecta.',
      'Alarga las vocales y mantén la calma.'
    ],
    benefit: 'Calma audiencias tensas y proyecta sabiduría (Gravitas).',
    tier: 'ELITE',
    dimension: 'AUTHORITY',
    isCore: false
  },
  {
    id: 'no-vowels-reading',
    title: 'Lectura sin Vocales (Hardcore)',
    description: 'El reto definitivo para tu precisión articulatoria.',
    category: 'ARTICULATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['score_claridad'],
    requiredMode: 'AUDIO',
    steps: [
      'Lee una frase pronunciando SOLO las consonantes.',
      'El esfuerzo debe estar en la lengua y labios.',
      'Léela normal y siente la facilidad extrema.'
    ],
    benefit: 'Precisión militar en cada palabra.',
    tier: 'ELITE',
    dimension: 'AGILITY',
    isCore: false
  },
  {
    id: 'vacuum-abdominal',
    title: 'Vacío Abdominal de Poder',
    description: 'Fortalece el núcleo del apoyo vocal para gritos controlados.',
    category: 'BREATHING',
    difficulty: 'ADVANCED',
    targetMetrics: ['energyStability'],
    requiredMode: 'AUDIO',
    steps: [
      'Exhala todo. Mete el ombligo hacia la columna.',
      'Sostén 5 segundos en apnea.',
      'Relaja e inhala suavemente.'
    ],
    benefit: 'Fuerza explosiva para proyectar la voz a voluntad.',
    tier: 'ELITE',
    dimension: 'SUPPORT',
    isCore: false
  }
];
