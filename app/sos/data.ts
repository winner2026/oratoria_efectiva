export type SituationId = 'EXPOSE' | 'RESPOND' | 'DEFEND' | 'SUMMARIZE';

export const SITUATIONS: Record<SituationId, { label: string; color: string; structure: { title: string; desc: string }[]; prompts: string[]; placeholders: string[] }> = {
  EXPOSE: {
    label: 'EXPONER',
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
    color: 'bg-amber-600',
    structure: [
      { title: 'PUNTO', desc: 'Respuesta directa.' },
      { title: 'RAZÓN', desc: 'Justificación lógica.' },
      { title: 'EVIDENCIA', desc: 'Dato o ejemplo.' },
      { title: 'REITERAR', desc: 'Vuelve al inicio.' }
    ],
    prompts: [
      'Tu respuesta en una frase',
      '¿Por qué crees esto?',
      'Dame un ejemplo o dato real',
      'Cierra repitiendo tu Punto'
    ],
    placeholders: [
      'Ej: Sí, es viable el proyecto.',
      'Ej: Porque tenemos el equipo listo.',
      'Ej: Como hicimos con Cliente X el año pasado.',
      'Ej: Por eso confirmo que sí es viable.'
    ]
  },
  DEFEND: {
    label: 'DEFENDER',
    color: 'bg-red-600',
    structure: [
      { title: 'VALIDAR', desc: 'Reconoce la emoción.' },
      { title: 'RE-ENFOCAR', desc: 'Cambia la perspectiva.' },
      { title: 'SOLUCIÓN', desc: 'Salida positiva.' }
    ],
    prompts: [
      'Entiendo que te preocupa...',
      'Sin embargo, el punto real es...',
      'Por eso sugiero avanzar así...'
    ],
    placeholders: [
      'Ej: Entiendo tu frustración con el plazo...',
      'Ej: Pero el bloqueo es técnico, no humano...',
      'Ej: Revisemos el sprint mañana mismo.'
    ]
  },
  SUMMARIZE: {
    label: 'SINTETIZAR',
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
