export type SituationId = 'EXPOSE' | 'RESPOND' | 'DEFEND' | 'SUMMARIZE';

export const SITUATIONS: Record<SituationId, { label: string; icon: string; color: string; structure: { title: string; desc: string }[]; prompts: string[]; placeholders: string[] }> = {
  EXPOSE: {
    label: 'EXPONER',
    icon: 'campaign',
    color: 'bg-blue-600',
    structure: [
      { title: 'PROBLEMA', desc: 'Capta la atención.' },
      { title: 'SOLUCIÓN', desc: 'Solución al problema.' },
      { title: 'BENEFICIOS', desc: 'Resultado final.' }
    ],
    prompts: [
      '¿Cuál es el problema real?',
      '¿Cómo lo solucionas (simple)?',
      '¿Qué ganan ellos con esto?'
    ],
    placeholders: [
      'Ej: Estamos perdiendo tiempo en...',
      'Ej: Con este nuevo sistema vamos a...',
      'Ej: Ahorraremos 20% anual.'
    ]
  },
  RESPOND: {
    label: 'RESPONDER',
    icon: 'chat',
    color: 'bg-amber-600',
    structure: [
      { title: 'PUNTO', desc: 'Respuesta directa.' },
      { title: 'RAZÓN', desc: 'Justificación lógica.' },
      { title: 'EVIDENCIA', desc: 'Dato o ejemplo.' }
    ],
    prompts: [
      'Tu respuesta en una frase',
      '¿Por qué crees esto?',
      'Dame un ejemplo o dato real'
    ],
    placeholders: [
      'Ej: Sí, es viable el proyecto.',
      'Ej: Porque tenemos el equipo listo.',
      'Ej: Como hicimos con Cliente X el año pasado.'
    ]
  },
  DEFEND: {
    label: 'DEFENDER',
    icon: 'shield',
    color: 'bg-red-600',
    structure: [
      { title: 'VALIDACIÓN NEUTRA', desc: 'Desarma sin ceder.' },
      { title: 'PUENTE DE SOBERANÍA', desc: 'Mueve de emoción a lógica.' },
      { title: 'DEVOLUCIÓN DE MARCO', desc: 'Recupera el control.' }
    ],
    prompts: [
      'Es un punto de vista interesante para poner sobre la mesa...',
      '...sin embargo, para decidir debemos mirar el dato estructural, que es [X].',
      '¿Cómo crees que ese factor altera el KPI principal que discutimos?'
    ],
    placeholders: [
      'No te defiendas. Valida la existencia de la pregunta.',
      'Mueve la conversación a tu terreno lógico.',
      'Termina con una pregunta. Tú controlas el tiempo.'
    ]
  },
  SUMMARIZE: {
    label: 'SINTETIZAR',
    icon: 'bolt',
    color: 'bg-emerald-600',
    structure: [
      { title: '¿QUÉ?', desc: 'La idea central.' },
      { title: '¿Y QUÉ?', desc: 'La importancia.' },
      { title: '¿AHORA QUÉ?', desc: 'Próximos pasos.' }
    ],
    prompts: [
      '¿De qué estamos hablando?',
      '¿Por qué esto es vital hoy?',
      '¿Qué acción debemos tomar?'
    ],
    placeholders: [
      'Ej: Hemos aprobado el presupuesto.',
      'Ej: Esto desbloquea las contrataciones.',
      'Ej: Abran las vacantes hoy.'
    ]
  }
};
