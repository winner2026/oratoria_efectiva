export type VoiceExercise = {
  id: string;
  title: string;
  description: string;
  category: 'BREATHING' | 'PROJECTION' | 'ARTICULATION' | 'INTONATION' | 'RELAXATION' | 'MINDSET' | 'STAGE_PRESENCE' | 'IMPROVISATION';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  targetMetrics: string[]; // Qué métricas mejora (ej: 'score_claridad', 'fallingIntonationScore')
  steps: string[];
  benefit: string;
};

export const VOICE_EXERCISES: VoiceExercise[] = [
  // ... (Ejercicios anteriores se mantienen)
  {
    id: 'diaphragmatic-breathing',
    title: 'Respiración Diafragmática',
    description: 'La base de una voz potente. Aprende a respirar con el abdomen, no con el pecho.',
    category: 'BREATHING',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability', 'volume'],
    steps: [
      'Siéntate derecho o párate con los pies a la altura de los hombros.',
      'Coloca una mano en el abdomen y otra en el pecho.',
      'Inhala profundo intentando que SOLO se mueva la mano del abdomen.',
      'Exhala controlando que el pecho siga inmóvil.',
      'Repite para ganar estabilidad y volumen.'
    ],
    benefit: 'Aumenta tu capacidad pulmonar y estabilidad vocal.'
  },
  {
    id: 'vocal-projection',
    title: 'Proyección a la Pared',
    description: 'Haz que tu voz viaje sin gritar. Ideal para ganar presencia.',
    category: 'PROJECTION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['volume', 'energyStability'],
    steps: [
      'Siéntate contra una pared y mira un punto en la pared opuesta.',
      'Di "Hola, ¿cómo estás?" imaginando que tu voz debe golpear ese punto.',
      'Aumenta el volumen gradualmente sin tensar la garganta.',
      'Impulsa el aire desde el diafragma.'
    ],
    benefit: 'Tu voz se escuchará clara en toda la sala sin esfuerzo.'
  },
  {
    id: 'tongue-twisters',
    title: 'Trabalenguas Progresivos',
    description: 'El gimnasio de la lengua. Elimina el balbuceo y mejora la precisión.',
    category: 'ARTICULATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['score_claridad', 'wordsPerMinute'],
    steps: [
      'Empieza lento: "Tres tristes tigres tragaban trigo en un trigal".',
      'Exagera la pronunciación de cada sílaba.',
      'Aumenta la velocidad poco a poco sin perder claridad.'
    ],
    benefit: 'Evita que se te "coman" las sílabas al hablar rápido.'
  },
  {
    id: 'emotional-reading',
    title: 'Lectura con Matices',
    description: 'Combate la voz monótona (robot). Aprende a "pintar" con tu voz.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['pitchRange', 'rhythmConsistency', 'fallingIntonationScore'],
    steps: [
      'Toma un párrafo de un libro cualquiera.',
      'Léelo primero con entusiasmo exagerado.',
      'Léelo ahora con seriedad absoluta.',
      'Léelo finalmente con suavidad/cariño.',
      'Varía la velocidad para enfatizar palabras clave.'
    ],
    benefit: 'Añade emoción y mantiene a la audiencia enganchada.'
  },
  {
    id: 'vocal-relaxation',
    title: 'Relajación de Cuerdas',
    description: 'Previene la fatiga y la voz rasposa antes de hablar.',
    category: 'RELAXATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability'],
    steps: [
      'Realiza un bostezo amplio para abrir la garganta.',
      'Haz un zumbido suave ("Mmmm") sintiendo vibrar tus labios.',
      'Sube y baja el tono (agudo-grave) suavemente.'
    ],
    benefit: 'Voz más limpia y resistente durante charlas largas.'
  },
  {
    id: 'pen-horizontal',
    title: 'El Bolígrafo Horizontal',
    description: 'El ejercicio clásico de los locutores para una dicción perfecta.',
    category: 'ARTICULATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['score_claridad', 'repetitionCount'],
    steps: [
      'Coloca un bolígrafo horizontalmente entre tus dientes (sin morder fuerte).',
      'Lee un texto en voz alta esforzándote por vocalizar a pesar del obstáculo.',
      'Retira el bolígrafo y lee lo mismo de nuevo.',
      '¡Siente la liberación inmediata!'
    ],
    benefit: 'Mejora radical e inmediata en la claridad de pronunciación.'
  },
  {
    id: 'pen-tip',
    title: 'Bolígrafo de Punta',
    description: 'Variante para precisión quirúrgica en sonidos difíciles.',
    category: 'ARTICULATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['score_claridad'],
    steps: [
      'Sujeta la punta del bolígrafo con los dientes frontales.',
      'Lee esforzándote en pronunciar cada letra.',
      'Libera y nota la diferencia en la precisión.'
    ],
    benefit: 'Ideal si tienes problemas pronunciando ciertas letras (R, S, T).'
  },
  // 🆕 Módulo: Superando el Miedo Escénico
  {
    id: 'positive-visualization',
    title: 'Hackeo Mental Positivo',
    description: 'Reprograma tu cerebro para esperar el éxito, no el fracaso.',
    category: 'MINDSET',
    difficulty: 'BEGINNER',
    targetMetrics: ['score_seguridad', 'energyStability'],
    steps: [
      'Cierra los ojos antes de tu presentación.',
      'Visualiza a la audiencia aplaudiendo y asintiendo.',
      'Siente la emoción de haber terminado con éxito.',
      'Tu cerebro no distingue imaginación de realidad: úsalo a tu favor.'
    ],
    benefit: 'Reduce drásticamente la ansiedad anticipatoria.'
  },
  {
    id: 'audience-scanning',
    title: 'Escaneo en Tres Bloques',
    description: 'La técnica para mirar a todos sin abrumarte.',
    category: 'STAGE_PRESENCE',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['score_seguridad'],
    steps: [
      'Divide mentalmente a tu audiencia en 3 grupos: Izquierda, Centro, Derecha.',
      'No mires al vacío ni a una sola persona.',
      'Rota tu mirada: 3 seg a la Izquierda, 3 seg al Centro, 3 seg a la Derecha.',
      'Haz que parezca que hablas con todos.'
    ],
    benefit: 'Proyectas control total del escenario y conectas mejor.'
  },
  {
    id: 'anxiety-breathing',
    title: 'Respiración Anti-Pánico',
    description: 'Botón de emergencia para bajar pulsaciones antes de subir.',
    category: 'MINDSET',
    difficulty: 'BEGINNER',
    targetMetrics: ['rhythmConsistency', 'energyStability'],
    steps: [
      'Inhala profundamente contando hasta 4.',
      'Retén el aire contando hasta 4.',
      'Exhala lentamente contando hasta 4.',
      'Repite 3 veces. Tu sistema nervioso entenderá que "no hay peligro".'
    ],
    benefit: 'Elimina el temblor de voz y la taquicardia al instante.'
  },
  // 🆕 Improv & Daily Life
  {
    id: 'improvisation-connect',
    title: 'Asociación de Palabras',
    description: 'Entrena tu cerebro para nunca quedarte en blanco.',
    category: 'IMPROVISATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['awkwardSilences', 'fillerCount'],
    steps: [
      'Mira un objeto a tu alrededor (ej: "Silla").',
      'Habla 30 segundos sobre eso.',
      'Salta a otro objeto ("Ventana") sin dejar de hablar.',
      'Conecta ambos conceptos aunque sea absurdo.'
    ],
    benefit: 'Elimina el pánico al silencio y mejora tu fluidez mental.'
  },
  {
    id: 'articulation-pacing',
    title: 'El Método de la Cámara Lenta',
    description: 'Para cuando te piden repetir las cosas ("¿Cómo?").',
    category: 'ARTICULATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['wordsPerMinute', 'score_claridad'],
    steps: [
      'Lee un texto a la MITAD de tu velocidad normal.',
      'Separa ex-age-ra-da-men-te cada sílaba.',
      'Siente cómo tu lengua y labios tocan cada diente.',
      'Vuelve a velocidad normal manteniendo esa precisión.'
    ],
    benefit: 'Te entenderán a la primera en cualquier trámite o reunión.'
  },
  // 🆕 RESPIRACIÓN (BREATHING)
  {
    id: 'seseo-control',
    title: 'Seseo de Control',
    description: 'Mide y domina tu flujo de aire con una exhalación constante.',
    category: 'BREATHING',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability'],
    steps: [
      'Inhala profundo con el diafragma.',
      'Suelta el aire haciendo un sonido de "S" largo y fino.',
      'Mantén la intensidad constante, que no suba ni baje.',
      'Cronometra cuánto aguantas sin esfuerzo.'
    ],
    benefit: 'Evita que te quedes sin aire a mitad de una frase.'
  },
  {
    id: 'fire-breath',
    title: 'Respiración de Fuego',
    description: 'Despierta tu diafragma y energía vital en segundos.',
    category: 'BREATHING',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['volume', 'energyStability'],
    steps: [
      'Inhala y exhala por la nariz de forma rítmica y corta.',
      'Siente cómo tu abdomen entra y sale como un fuelle.',
      'Empieza lento y sube la velocidad gradualmente.',
      'Detente si te mareas.'
    ],
    benefit: 'Activa tu voz y elimina la pereza vocal antes de empezar.'
  },
  {
    id: 'golden-pause-478',
    title: 'La Pausa de Oro (4-7-8)',
    description: 'La técnica maestra para resetear tu sistema nervioso.',
    category: 'BREATHING',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability', 'rhythmConsistency'],
    steps: [
      'Inhala por la nariz silenciosamente en 4 segundos.',
      'Mantén el aire en tus pulmones 7 segundos.',
      'Exhala ruidosamente por la boca en 8 segundos.',
      'Repite el ciclo 4 veces.'
    ],
    benefit: 'Control total sobre los nervios químicos del cuerpo.'
  },
  {
    id: 'imaginary-candle',
    title: 'La Vela Imaginaria',
    description: 'Entrena la precisión milimétrica de tu exhalación.',
    category: 'BREATHING',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['energyStability'],
    steps: [
      'Imagina una vela encendida a 10 cm de tu boca.',
      'Sopla de forma que la llama se incline pero NO se apague.',
      'Mantén esa inclinación el mayor tiempo posible.',
      'Aleja la "vela" imaginaria y repite.'
    ],
    benefit: 'Te da un control absoluto sobre el aire que gastas al hablar.'
  },
  {
    id: 'surprise-inhale',
    title: 'Inspiración de Sorpresa',
    description: 'Abre tus vías respiratorias al máximo instantáneamente.',
    category: 'BREATHING',
    difficulty: 'BEGINNER',
    targetMetrics: ['volume'],
    steps: [
      'Abre la boca como si te acabaran de dar una noticia increíble.',
      'Inhala rápido y profundo sintiendo cómo se ensancha tu garganta.',
      'Siente el aire frío llegando al fondo de tus pulmones.',
      'Exhala con un suspiro de alivio.'
    ],
    benefit: 'Prepara tu laringe para una resonancia mucho más rica.'
  },
  {
    id: 'abdominal-kick',
    title: 'El Contrapunteo Abdominal',
    description: 'Fortalece los músculos que impulsan tu voz.',
    category: 'BREATHING',
    difficulty: 'ADVANCED',
    targetMetrics: ['volume', 'energyStability'],
    steps: [
      'Coloca tus manos en la cintura, sintiendo los músculos laterales.',
      'Di "¡JA! ¡JA! ¡JA!" con fuerza explosiva.',
      'Asegúrate de que tus manos sienten el empujón hacia afuera al hablar.',
      'No tenses el cuello, solo el abdomen.'
    ],
    benefit: 'Voz con autoridad que no se quiebra bajo presión.'
  },

  // 🆕 ARTICULACIÓN (ARTICULATION)
  {
    id: 'jaw-massage',
    title: 'Liberador de Mandíbula',
    description: 'Elimina la tensión muscular que te impide abrir la boca.',
    category: 'ARTICULATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['score_claridad'],
    steps: [
      'Ubica los músculos donde se unen las mandíbulas superior e inferior.',
      'Masajea en círculos con las yemas de los dedos durante 30 segundos.',
      'Deja que la boca caiga por su propio peso (boca entreabierta).',
      'Di "Aaa-Ooo" exagerando la apertura.'
    ],
    benefit: 'Mayor resonancia y menos esfuerzo al proyectar.'
  },
  {
    id: 'tongue-gym',
    title: 'Gimnasia Lingual 360',
    description: 'Entrena el músculo más importante de tu dicción.',
    category: 'ARTICULATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['score_claridad'],
    steps: [
      'Toca con la punta de la lengua cada diente por la parte exterior.',
      'Recorre tus labios con la lengua en sentido de las agujas del reloj.',
      'Hazlo ahora en sentido contrario.',
      'Chasquea la lengua contra el paladar con fuerza.'
    ],
    benefit: 'Agilidad inmediata para palabras complejas.'
  },
  {
    id: 'chewing-words',
    title: 'Masticar Palabras',
    description: 'Exagera la gesticulación para una claridad cristalina.',
    category: 'ARTICULATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['repetitionCount', 'score_claridad'],
    steps: [
      'Toma un texto y léelo simulando que masticas un chicle gigante.',
      'Cada sílaba debe requerir que muevas toda la cara.',
      'Involucra labios, lengua y mandíbula.',
      'Lee ahora el mismo texto de forma normal.'
    ],
    benefit: 'Te quita la "pereza labial" que hace que parezca que balbuceas.'
  },
  {
    id: 'explosive-enunciation',
    title: 'Oclusivas Explosivas',
    description: 'Haz que tus palabras tengan un inicio limpio y potente.',
    category: 'ARTICULATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['volume', 'score_claridad'],
    steps: [
      'Repite la secuencia: P-T-K, P-T-K, P-T-K.',
      'Siente el aire salir con fuerza en cada letra.',
      'Hazlo ahora con palabras: "Papá, Taco, Queso".',
      'Exagera el golpe de aire inicial.'
    ],
    benefit: 'Evita que tus frases suenen flojas o sin energía.'
  },
  {
    id: 'clean-diphthongs',
    title: 'Diptongos Limpios',
    description: 'Evita que las vocales se mezclen en un solo sonido.',
    category: 'ARTICULATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['score_claridad'],
    steps: [
      'Pronuncia lentamente: IA, IE, IO, IU.',
      'Asegúrate de escuchar las DOS vocales por separado.',
      'Ahora con palabras: "Ciudad, Hielo, Cuatro, Peine".',
      'No permitas que se vuelvan un solo sonido borroso.'
    ],
    benefit: 'Mejora la elegancia de tu habla cotidiana.'
  },
  {
    id: 'no-vowels-reading',
    title: 'Lectura sin Vocales',
    description: 'El reto definitivo para tu precisión articulatoria.',
    category: 'ARTICULATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['score_claridad'],
    steps: [
      'Mira una frase (ej: "Hola mundo").',
      'Intenta decirla pronunciando SOLO las consonantes (H-l-m-n-d).',
      'El esfuerzo debe estar en la posición de la lengua.',
      'Léela ahora normal y siente la facilidad.'
    ],
    benefit: 'Forza a tus articuladores a trabajar con precisión máxima.'
  },

  // 🆕 ENTONACIÓN (INTONATION)
  {
    id: 'news-anchor',
    title: 'El Locutor de Noticias',
    description: 'Practica la autoridad y el énfasis descendente.',
    category: 'INTONATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['fallingIntonationScore', 'pitchRange'],
    steps: [
      'Lee una noticia cualquiera con tono serio y pausado.',
      'Termina cada frase con un tono claramente hacia abajo.',
      'Proyecta seguridad en cada afirmación.',
      'Evita subir el tono al final de las frases (sonido de duda).'
    ],
    benefit: 'Proyecta convicción y liderazgo de inmediato.'
  },
  {
    id: 'extreme-drama',
    title: 'Dramatismo Absurdo',
    description: 'Explora tus límites emocionales con un texto plano.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['pitchRange'],
    steps: [
      'Lee una receta de cocina como si fuera la tragedia más grande de la historia.',
      'Ponle lágrimas a los ingredientes y agonía a los pasos.',
      'Ahora léelo como si fuera la noticia más feliz de tu vida.',
      'Siente cómo tu voz sube y baja de tono.'
    ],
    benefit: 'Elimina la voz monótona y aburrida.'
  },
  {
    id: 'constant-question',
    title: 'El Mundo como Pregunta',
    description: 'Entrena la flexibilidad de tus finales de frases.',
    category: 'INTONATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['pitchRange'],
    steps: [
      'Toma un texto descriptivo.',
      'Léelo terminando todas las frases hacia arriba (?).',
      'Incluso los puntos finales deben sonar como preguntas.',
      'Nota cómo cambia la percepción de lo que dices.'
    ],
    benefit: 'Te da un control consciente de para qué sirve subir o bajar el tono.'
  },
  {
    id: 'priest-voice',
    title: 'La Voz de Autoridad Calma',
    description: 'Practica la paz y la profundidad sonora.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['energyStability', 'pitchRange'],
    steps: [
      'Usa tu tono más grave y pausado.',
      'Habla como si estuvieras en una catedral inmensa.',
      'Alarga ligeramente las vocales.',
      'Mantén un ritmo lento y deliberado.'
    ],
    benefit: 'Ideal para calmar audiencias tensas o dar noticias serias.'
  },
  {
    id: 'word-emphasis',
    title: 'Énfasis Variable',
    description: 'Aprende a controlar qué idea resalta en tu discurso.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['rhythmConsistency'],
    steps: [
      'Usa la frase: "Yo no dije que él robó el dinero".',
      'Repítela enfatizando "YO".',
      'Repítela enfatizando "ROBÓ".',
      'Repítela enfatizando "DINERO".',
      'Nota cómo el significado cambia totalmente.'
    ],
    benefit: 'Garantiza que tu audiencia entienda exactamente lo importante.'
  },
  {
    id: 'fairy-tale',
    title: 'Cuentacuentos Mágico',
    description: 'Añade misterio y curiosidad a tu oratoria.',
    category: 'INTONATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['pitchRange', 'rhythmConsistency'],
    steps: [
      'Susurra algunas partes de tu texto.',
      'Habla con entusiasmo repentino en otras.',
      'Usa pausas largas después de palabras clave.',
      'Crea un ambiente de intriga con tu voz.'
    ],
    benefit: 'Mantiene la atención de la audiencia en niveles máximos.'
  },

  // 🆕 MENTALIDAD (MINDSET)
  {
    id: 'power-posing',
    title: 'Postura de Poder (Supergirl/Superman)',
    description: 'Hackeo químico para bajar el cortisol inmediatamente.',
    category: 'MINDSET',
    difficulty: 'BEGINNER',
    targetMetrics: ['score_seguridad'],
    steps: [
      'Ponte de pie con los pies separados y manos en la cintura.',
      'Mantén la barbilla ligeramente hacia arriba y pecho fuera.',
      'Sostén la postura durante 60 segundos antes de hablar.',
      'Siente la oleada de confianza en tu cuerpo.'
    ],
    benefit: 'Baja los niveles de estrés y sube la testosterona.'
  },
  {
    id: 'authority-affirmation',
    title: 'Afirmación de Autoridad',
    description: 'Convéncete a ti mismo para poder convencer a otros.',
    category: 'MINDSET',
    difficulty: 'BEGINNER',
    targetMetrics: ['score_seguridad'],
    steps: [
      'Mírate al espejo directamente a los ojos.',
      'Di en voz alta: "Mi mensaje tiene valor y merezco ser escuchado".',
      'Repítelo 3 veces, bajando el tono al final de la frase.',
      'Sonríe con sinceridad al terminar.'
    ],
    benefit: 'Elimina el síndrome del impostor antes de una sesión.'
  },
  {
    id: 'imaginary-friend',
    title: 'El Amigo Invisible',
    description: 'Convierte el miedo al juicio en apoyo incondicional.',
    category: 'MINDSET',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['score_seguridad'],
    steps: [
      'Imagina que en la audiencia (o frente a la cámara) está tu mejor amigo.',
      'Esa persona te apoya pase lo que pase.',
      'Háblale directamente a él, olvida al resto por un momento.',
      'Relaja tu rostro mientras lo haces.'
    ],
    benefit: 'Humaniza la oratoria y quita la presión de la perfección.'
  },
  {
    id: 'celebrated-error',
    title: 'Celebración del Error',
    description: 'Entrena la resiliencia mental ante equivocaciones.',
    category: 'MINDSET',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['score_seguridad'],
    steps: [
      'Practica un discurso difícil.',
      'Si te trabas o te equivocas, SONRÍE y sigue como si fuera parte del plan.',
      'No pidas perdón ni pongas cara de frustración.',
      'Sigue con más energía que antes.'
    ],
    benefit: 'Te vuelve un orador "antifrágil" al que nada detiene.'
  },
  {
    id: 'calm-bubble',
    title: 'El Escudo de Calma',
    description: 'Protégete de la energía negativa externa.',
    category: 'MINDSET',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability'],
    steps: [
      'Visualiza una burbuja de luz azul a tu alrededor.',
      'Toda crítica o juicio rebota en esa burbuja.',
      'Dentro de la burbuja, tu voz es perfecta y tu mente está clara.',
      'Respira dentro de ese espacio seguro.'
    ],
    benefit: 'Ideal para hablar en ambientes hostiles o críticos.'
  },
  {
    id: 'focus-on-giving',
    title: 'Enfoque en el Servicio',
    description: 'Quita el foco de ti y ponlo en ayudar a otros.',
    category: 'MINDSET',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['score_seguridad'],
    steps: [
      'Antes de empezar, pregúntate: "¿Cómo puedo ayudar hoy?".',
      'Olvida cómo te ves o qué piensan de ti.',
      'Concéntrate al 100% en transmitir tu mensaje con claridad.',
      'Entregar valor es tu única misión.'
    ],
    benefit: 'La ansiedad desaparece cuando dejas de ser el protagonista y te vuelves el mensajero.'
  },

  // 🆕 IMPROVISACIÓN (IMPROVISATION)
  {
    id: 'forbidden-letter',
    title: 'La Letra Prohibida',
    description: 'Forza a tu cerebro a buscar caminos lingüísticos nuevos.',
    category: 'IMPROVISATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['awkwardSilences', 'fillerCount'],
    steps: [
      'Habla un minuto sobre el clima o tu día.',
      'Reto: No puedes usar ninguna palabra que contenga la letra "A" (o "O").',
      'Si te detienes más de 3 segundos, pierde.',
      'Intenta ser fluido aunque sea difícil.'
    ],
    benefit: 'Te vuelve extremadamente rápido para encontrar sinónimos.'
  },
  {
    id: 'air-seller',
    title: 'El Vendedor de Aire',
    description: 'Practica la persuasión pura sobre lo absurdo.',
    category: 'IMPROVISATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['volume', 'pitchRange'],
    steps: [
      'Toma un objeto inservible (un clip roto, un pañuelo sucio).',
      'Intenta vendérnoslo durante 1 minuto.',
      'Usa argumentos emocionales, de autoridad y de escasez.',
      'Cree en tu propio discurso mientras lo dices.'
    ],
    benefit: 'Desarrolla el carisma y la capacidad de convencer sin guion.'
  },
  {
    id: 'absurd-expert',
    title: 'El Experto Absurdo',
    description: 'Entrena la confianza ciega en tu propia palabra.',
    category: 'IMPROVISATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['fillerCount', 'score_seguridad'],
    steps: [
      'Elige un tema del que no sepas nada (ej: "La cría de pingüinos en Marte").',
      'Explícalo ante la cámara con total autoridad durante 45 segundos.',
      'Inventa datos, fechas y nombres con seguridad absoluta.',
      'No Uses muletillas (ehh, mmm).'
    ],
    benefit: 'Elimina el miedo a "no saber qué decir" y entrena la elocuencia.'
  },
  {
    id: 'logical-connector',
    title: 'Puentes Imposibles',
    description: 'Une conceptos totalmente opuestos de forma lógica.',
    category: 'IMPROVISATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['awkwardSilences', 'fillerCount'],
    steps: [
      'Elige dos palabras al azar (ej: "Pizza" y "Justicia").',
      'Explica en 30 segundos cómo una pizza puede salvar el sistema judicial.',
      'Busca una conexión coherente, por loca que sea.',
      'Termina con una conclusión potente.'
    ],
    benefit: 'Te da agilidad mental para responder preguntas difíciles en vivo.'
  },
  {
    id: 'story-chain',
    title: 'La Cadena de Conectores',
    description: 'Estructura tus historias de forma dinámica e imparable.',
    category: 'IMPROVISATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['rhythmConsistency'],
    steps: [
      'Empieza una historia con una frase al azar.',
      'La siguiente frase DEBE empezar con "Y por eso...".',
      'La siguiente DEBE empezar con "Sin embargo...".',
      'La siguiente DEBE empezar con "Y finalmente...".',
      'Repite el ciclo.'
    ],
    benefit: 'Elimina la monotonía narrativa y hace tus historias más interesantes.'
  },
  {
    id: 'color-description',
    title: 'Describiendo lo Invisible',
    description: 'Mejora tu capacidad de crear imágenes en la mente del otro.',
    category: 'IMPROVISATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['score_claridad'],
    steps: [
      'Imagina que hablas con alguien ciego de nacimiento.',
      'Describe el color "Rojo" sin usar la palabra rojo ni nombres de objetos rojos.',
      'Describe sensaciones, texturas y emociones.',
      'Habla durante 45 segundos.'
    ],
    benefit: 'Te vuelve un maestro del storytelling visual y sensorial.'
  },
  // 🆕 RESPIRACIÓN (EXTRA PROFESSIONAL)
  {
    id: 'segmented-inhale',
    title: 'Inhalación Fragmentada',
    description: 'Entrena la capacidad de recarga rápida y controlada.',
    category: 'BREATHING',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['energyStability'],
    steps: [
      'Inhala en 4 pequeños sorbos cortos, como si snifaras.',
      'Mantén 2 segundos.',
      'Exhala en un solo flujo largo y suave.',
      'Siente cómo tus pulmones se llenan por secciones.'
    ],
    benefit: 'Ideal para oradores que hablan rápido y necesitan micro-recargas de aire.'
  },
  {
    id: 'intercostal-expansion',
    title: 'Expansión Intercostal',
    description: 'Abre el "acordeón" de tus costillas para máxima capacidad.',
    category: 'BREATHING',
    difficulty: 'BEGINNER',
    targetMetrics: ['volume'],
    steps: [
      'Coloca las manos en tus costillas laterales.',
      'Inhala intentando empujar tus manos hacia los lados, NO hacia adelante.',
      'Siente cómo tu caja torácica se ensancha.',
      'Exhala manteniendo la expansión el mayor tiempo posible.'
    ],
    benefit: 'Libera la presión del pecho y da una voz más profunda y rica.'
  },
  {
    id: 'vacuum-abdominal',
    title: 'Vacío Abdominal (Control)',
    description: 'Fortalece el núcleo del apoyo vocal.',
    category: 'BREATHING',
    difficulty: 'ADVANCED',
    targetMetrics: ['energyStability', 'volume'],
    steps: [
      'Exhala todo el aire de tus pulmones.',
      'Sin inhalar, intenta "meter" el ombligo hacia la columna.',
      'Sujeta la contracción 5 segundos.',
      'Relaja e inhala suavemente con el diafragma.'
    ],
    benefit: 'Desarrolla una fuerza abdominal increíble para sostener notas largas o gritos controlados.'
  },
  {
    id: 'humming-breath',
    title: 'Respiración con Resonancia (Hum)',
    description: 'Mezcla aire y sonido para un inicio suave.',
    category: 'BREATHING',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability', 'pitchRange'],
    steps: [
      'Inhala y empieza a soltar el aire con una "M" suave.',
      'Siente la vibración en tus labios y nariz.',
      'Abre la boca hacia una "O" sin dejar de vibrar.',
      'Mantén the flujo constante.'
    ],
    benefit: 'Calienta las cuerdas vocales mientras entrenas el aire.'
  },
  {
    id: 'balloon-blowing',
    title: 'El Globo Imaginario',
    description: 'Resistencia contra el flujo de aire.',
    category: 'BREATHING',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['energyStability'],
    steps: [
      'Junta los labios dejando solo un pequeño orificio.',
      'Exhala con fuerza como si inflaras un globo muy rígido.',
      'Siente la resistencia en tus mejillas y abdomen.',
      'Descansa e incrementa la duración.'
    ],
    benefit: 'Aumenta la potencia de tu exhalación sin dañar la garganta.'
  },
  {
    id: 'staccato-breathing',
    title: 'Respiración en Staccato',
    description: 'Agilidad diafragmática para ritmos rápidos.',
    category: 'BREATHING',
    difficulty: 'ADVANCED',
    targetMetrics: ['rhythmConsistency', 'volume'],
    steps: [
      'Inhala poco aire.',
      'Suelta el aire en golpes cortos y secos haciendo "S! S! S!".',
      'Cada golpe debe venir de un salto del abdomen.',
      'Mantén el ritmo como un metrónomo.'
    ],
    benefit: 'Te da una agilidad verbal asombrosa para discursos dinámicos.'
  },

  // 🆕 ARTICULACIÓN (EXTRA PROFESSIONAL)
  {
    id: 'lip-trill-master',
    title: 'Vibración Labial (Lip Trill)',
    description: 'El calentamiento #1 de los profesionales del mundo.',
    category: 'ARTICULATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['energyStability', 'pitchRange'],
    steps: [
      'Une tus labios relajados.',
      'Suelta aire para que vibren como un motor: "Prrrr".',
      'Haz variaciones de tono: sube a agudos y baja a graves.',
      'Si te cuesta, apoya tus dedos en las comisuras de los labios.'
    ],
    benefit: 'Relaja la cara y conecta la respiración con el sonido perfectamente.'
  },
  {
    id: 'soft-palate-lift',
    title: 'Apertura de Paladar Blando',
    description: 'Elimina la voz nasal y gana espacio sonoro.',
    category: 'ARTICULATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['volume', 'pitchRange'],
    steps: [
      'Imagina que vas a empezar a bostezar.',
      'Siente cómo la parte trasera de tu paladar sube.',
      'Di "GUA-GUA-GUA" manteniendo ese espacio abierto.',
      'Siente tu voz más "oscura" y redonda.'
    ],
    benefit: 'Añade un tono aterciopelado y profesional a tu voz.'
  },
  {
    id: 'tongue-stretch-max',
    title: 'Estiramiento Lingual Extremo',
    description: 'Libera la raíz de la lengua para una dicción libre.',
    category: 'ARTICULATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['score_claridad'],
    steps: [
      'Saca la lengua lo máximo posible intentando tocar tu barbilla.',
      'Mantén 5 segundos.',
      'Ahora intenta tocar tu nariz con la punta.',
      'Muévela de lado a lado rápidamente dentro de la boca.'
    ],
    benefit: 'Elimina la tensión que causa el balbuceo.'
  },
  {
    id: 'silent-speech',
    title: 'Articulación Silenciosa',
    description: 'Foco puro en el movimiento muscular.',
    category: 'ARTICULATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['score_claridad'],
    steps: [
      'Lee un texto en voz alta pero SIN SONIDO.',
      'Exagera los movimientos para que alguien que te lea los labios te entienda.',
      'Pon mucha energía en las consonantes.',
      'Ahora léelo normal y siente la facilidad.'
    ],
    benefit: 'Entrena la memoria muscular para una claridad automática.'
  },
  {
    id: 'phoneme-speed-drill',
    title: 'Taladro de Fonemas Rápidos',
    description: 'Alternancia de zonas de contacto.',
    category: 'ARTICULATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['score_claridad', 'wordsPerMinute'],
    steps: [
      'Repite: "LA-TA-DA-RA" lo más rápido posible.',
      'Ahora: "PA-BA-MA"',
      'Ahora: "KA-GA-JA"',
      'Combina: "LA-PA-KA-DA" sin trabarte.'
    ],
    benefit: 'Coordina diferentes partes de la boca para hablar a alta velocidad.'
  },
  {
    id: 'accent-marathon',
    title: 'El Maratón de Acentos',
    description: 'Control de sílabas tónicas.',
    category: 'ARTICULATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['rhythmConsistency'],
    steps: [
      'Toma una palabra larga (ej: "Constantinopla").',
      'Repítela poniendo el acento fuerte en la 1ra sílaba.',
      'Ahora en la 2da, luego en la 3ra, y así hasta el final.',
      'Ej: CÓNS-tan-ti-no-pla, cons-TÁN-ti-no-pla...'
    ],
    benefit: 'Te da un oído rítmico increíble para no sonar monótono.'
  },

  // 🆕 ENTONACIÓN (EXTRA PROFESSIONAL)
  {
    id: 'whispered-authority',
    title: 'Autoridad Susurrada',
    description: 'Gana intensidad sin necesidad de volumen.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['energyStability', 'score_seguridad'],
    steps: [
      'Susurra algo importante poniendo mucha presión en el aire.',
      'No dejes que el susurro sea flojo; debe ser "intenso".',
      'Imagina que hablas en secreto pero quieres que te oigan a 5 metros.',
      'Siente la tensión en tu abdomen.'
    ],
    benefit: 'Aprenderás que la autoridad viene de la intención, no del grito.'
  },
  {
    id: 'staircase-pitch',
    title: 'La Escalera de Tonos',
    description: 'Controla el ascenso y descenso melódico.',
    category: 'INTONATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['pitchRange'],
    steps: [
      'Di una frase breve.',
      'Repítela subiendo un escalón de tono en cada palabra.',
      'Repítela bajando un escalón en cada palabra.',
      'Hazlo de forma fluida, como si subieras una escalera real.'
    ],
    benefit: 'Evita terminar todas las frases en el mismo tono cansino.'
  },
  {
    id: 'subtext-sarcasm',
    title: 'Juego de Subtextos',
    description: 'Aprende a decir "A" significando "B".',
    category: 'INTONATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['pitchRange', 'rhythmConsistency'],
    steps: [
      'Di la frase "Qué buen trabajo hiciste".',
      'Dila con sinceridad total.',
      'Dila con sarcasmo evidente.',
      'Dila con envidia oculta.',
      'Dila como una pregunta de duda.'
    ],
    benefit: 'Te da herramientas para el humor, la ironía y la persuasión sutil.'
  },
  {
    id: 'crescendo-master',
    title: 'Crescendo y Diminuendo',
    description: 'Controla la dinámica de volumen de tu charla.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['volume', 'energyStability'],
    steps: [
      'Empieza un párrafo en un susurro casi inaudible.',
      'Sube el volumen palabra a palabra hasta terminar gritando con poder.',
      'Hazlo a la inversa: de grito a susurro.',
      'Mantén la claridad en ambos extremos.'
    ],
    benefit: 'Crucial para discursos de motivación o ventas con clímax.'
  },
  {
    id: 'echo-imitation',
    title: 'Eco e Imitación de Intención',
    description: 'Expande tu registro imitando otros estilos.',
    category: 'INTONATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['pitchRange'],
    steps: [
      'Lee una frase como un sargento militar.',
      'Repítela como un abuelo contando una historia.',
      'Repítela como una azafata de vuelo.',
      'Busca los matices que hacen diferente a cada uno.'
    ],
    benefit: 'Rompe tus patrones habituales y te hace más versátil.'
  },
  {
    id: 'punctuation-shift',
    title: 'El Peso del Silencio (Puntuación)',
    description: 'Control de pausas gramaticales.',
    category: 'INTONATION',
    difficulty: 'BEGINNER',
    targetMetrics: ['awkwardSilences', 'rhythmConsistency'],
    steps: [
      'Lee un texto respetando rigurosamente las comas (1 seg) y puntos (2 seg).',
      'Ahora ignora las pausas y lee todo seguido.',
      'Nota la falta de sentido.',
      'Vuelve a las pausas pero dándoles mirada intensa.'
    ],
    benefit: 'Le da tiempo a tu audiencia para procesar la información.'
  },

  // 🆕 MENTALIDAD (EXTRA PROFESSIONAL)
  {
    id: 'worst-case-logic',
    title: 'Desmontando el Peor Escenario',
    description: 'Racionaliza el miedo para que deje de ser una amenaza.',
    category: 'MINDSET',
    difficulty: 'BEGINNER',
    targetMetrics: ['score_seguridad'],
    steps: [
      'Pregúntate: "¿Qué es lo peor que puede pasar Realmente?".',
      '¿Que se rían? ¿Que me equivoque? ¿Seguiré vivo mañana? Sí.',
      'Visualiza ese error y visualízate a ti mismo manejándolo con humor.',
      'Acepta la imperfección.'
    ],
    benefit: 'Quita el peso de la "vida o muerte" a tus presentaciones.'
  },
  {
    id: 'gratitude-shift',
    title: 'Gratitud por la Audiencia',
    description: 'Cambia el miedo por el deseo de ayudar.',
    category: 'MINDSET',
    difficulty: 'BEGINNER',
    targetMetrics: ['score_seguridad'],
    steps: [
      'No veas a la audiencia como jueces, sino como personas con problemas.',
      'Siéntete agradecido de que dediquen su tiempo a escucharte.',
      'Internamente diles: "Gracias por estar aquí, voy a intentar serviros".',
      'Siente cómo tu pecho se relaja.'
    ],
    benefit: 'Cambia la energía de "defensa" a "ofrenda", lo cual es carismático.'
  },
  {
    id: 'flow-state-anchor',
    title: 'Ancla del Estado de Flujo',
    description: 'Crea un disparador físico para tu confianza.',
    category: 'MINDSET',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['score_seguridad', 'energyStability'],
    steps: [
      'Recuerda un momento en que te sentiste increíblemente elocuente.',
      'Cuando sientas esa sensación, presiona tu pulgar con tu dedo índice.',
      'Repite esto varios días.',
      'Antes de hablar, haz el gesto de los dedos para invocar la sensación.'
    ],
    benefit: 'Condicionamiento clásico para entrar en modo "alfa" al instante.'
  },
  {
    id: 'master-mirror-work',
    title: 'Auto-Observación sin Juicio',
    description: 'Acepta tu imagen y voz tal como son.',
    category: 'MINDSET',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['score_seguridad'],
    steps: [
      'Graba un video tuyo de 1 minuto hablando.',
      'Míralo 3 veces.',
      '1ra vez: SOLO busca lo que NO te gusta.',
      '2da vez: SOLO busca lo que SÍ haces bien.',
      '3ra vez: Míralo como si fuera un extraño al que quieres ayudar.'
    ],
    benefit: 'Reduce el impacto negativo de la autocrítica destructiva.'
  },
  {
    id: 'pre-success-review',
    title: 'Visualización Retrospectiva',
    description: 'La técnica de los atletas olímpicos aplicada al habla.',
    category: 'MINDSET',
    difficulty: 'BEGINNER',
    targetMetrics: ['score_seguridad'],
    steps: [
      'Cierra los ojos e imagínate YA terminado el discurso.',
      'Siente el alivio, el éxito y las felicitaciones.',
      'Repasa mentalmente lo bien que fluyó todo "en pasado".',
      'Tu cerebro ahora sentirá que "ya lo ha hecho".'
    ],
    benefit: 'Gana la batalla antes de empezar.'
  },
  {
    id: 'identity-shift',
    title: 'Cambio de Identidad Temporal',
    description: 'Conviértete en el orador que admiras.',
    category: 'MINDSET',
    difficulty: 'ADVANCED',
    targetMetrics: ['score_seguridad', 'pitchRange'],
    steps: [
      'Elige un orador que admires profundamente (ej: Steve Jobs, Obama).',
      'Pregúntate: "¿Cómo respiraría él ahora mismo?".',
      'Adopta sus micro-gestos y su seguridad por 2 minutos.',
      'Nota cómo tu voz cambia sola al "tomar prestada" su confianza.'
    ],
    benefit: 'Te permite salir de tu zona de confort y explorar nuevos niveles de autoridad.'
  },

  // 🆕 IMPROVISACIÓN (EXTRA PROFESSIONAL)
  {
    id: 'defend-the-indefensible',
    title: 'Defensa de lo Indefendible',
    description: 'Entrena la argumentación bajo presión creativa.',
    category: 'IMPROVISATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['awkwardSilences', 'score_seguridad'],
    steps: [
      'Reto: Argumenta por qué "Llegar tarde es mejor que llegar puntual".',
      'Tienes 1 minuto para convencer a la audiencia.',
      'Busca beneficios creativos: "Muestra importancia", "Crea expectativa".',
      'No te rías, mantén la seriedad.'
    ],
    benefit: 'Vuelve tu mente ágil para defenderte en debates o críticas.'
  },
  {
    id: 'gibberish-translation',
    title: 'Traductor de Idioma Inventado',
    description: 'Desconecta el juicio racional del discurso.',
    category: 'IMPROVISATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['pitchRange', 'rhythmConsistency'],
    steps: [
      'Habla 20 segundos en un idioma que no exista ("Blah-gah zoo raba...").',
      'Ponle mucha emoción e intención.',
      'De repente, di: "Lo que quise decir con eso es..." y explica la idea en español.',
      'Sigue fluyendo.'
    ],
    benefit: 'Libera tu expresividad natural de las "palabras correctas".'
  },
  {
    id: 'future-news-flash',
    title: 'Noticia del Futuro',
    description: 'Storytelling proyectivo instantáneo.',
    category: 'IMPROVISATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['fillerCount', 'awkwardSilences'],
    steps: [
      'Mira un objeto cotidiano (ej: este bolígrafo).',
      'Imagina que estamos en el año 2150.',
      'Cuéntanos durante 45 segundos cómo ese objeto cambió la historia de la humanidad.',
      'Ponle fechas y nombres de científicos inventados.'
    ],
    benefit: 'Entrena la capacidad de crear narrativas coherentes de la nada.'
  },
  {
    id: 'why-game-creative',
    title: 'El Juego del Por Qué Infinito',
    description: 'Profundiza en tus argumentos de forma espontánea.',
    category: 'IMPROVISATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['rhythmConsistency'],
    steps: [
      'Haz una afirmación simple: "El café es bueno".',
      'Auto-pregúntate: "¿Por qué?". Respóndelo.',
      'Vuelve a preguntar: "¿Y por qué eso es así?".',
      'Llega hasta 5 niveles de profundidad sin detenerte.'
    ],
    benefit: 'Ideal para oratoria corporativa donde debes justificar ideas.'
  },
  {
    id: 'character-spin',
    title: 'Salto de Personajes',
    description: 'Versatilidad emocional aplicada a un mismo tema.',
    category: 'IMPROVISATION',
    difficulty: 'ADVANCED',
    targetMetrics: ['pitchRange', 'score_seguridad'],
    steps: [
      'Elige un tema serio: "La importancia del ahorro".',
      'Empieza a hablar de ello.',
      'Cada 15 segundos, cambia el "personaje": Sacerdote, Rockstar, Detective, Niño.',
      'No dejes de hablar del tema original.'
    ],
    benefit: 'Te vuelve un comunicador magnético capaz de adaptarse a cualquier público.'
  },
  {
    id: 'metaphor-machine',
    title: 'La Máquina de Metáforas',
    description: 'Explica lo complejo de forma sencilla y visual.',
    category: 'IMPROVISATION',
    difficulty: 'INTERMEDIATE',
    targetMetrics: ['score_claridad', 'rhythmConsistency'],
    steps: [
      'Toma un concepto difícil (ej: "La inflación", "El software").',
      'Explícalo usando una metáfora de pesca, de cocina o de fútbol.',
      'Tienes 45 segundos.',
      'Asegúrate de que la comparación sea visual.'
    ],
    benefit: 'Es la herramienta #1 de los mejores comunicadores: simplificar lo complejo.'
  }
];
