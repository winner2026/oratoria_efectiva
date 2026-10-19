"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const ArchetypeGraph = dynamic(() => import("@/components/ArchetypeGraph"), {
  ssr: false,
});

const ArchetypeDashboardPanel = dynamic(
  () => import("@/components/ArchetypeDashboardPanel"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-[500px] h-[540px] rounded-3xl bg-slate-900/60 border border-white/5 animate-pulse flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-4" />
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
          CARGANDO MATRIZ BIOMÉTRICA
        </span>
      </div>
    ),
  }
);

import { calculateVoiceArchetype } from "@/domain/archetype/ArchetypeEngine";


// 12 PREGUNTAS ESTRATÉGICAS DE PERFILAMIENTO FORENSE Y NEURO-VOCAL
export const STRATEGIC_QUESTIONS_12 = [
  {
    id: "objective",
    title: "¿Cuál es tu meta principal al comunicarte?",
    subtitle: "Define la dirección del arquetipo que construiremos para tu voz",
    options: [
      { id: "liderazgo", label: "Proyectar autoridad indiscutible y liderazgo natural", color: "#06b6d4" },
      { id: "ventas", label: "Vender, negociar y cerrar acuerdos de alto valor", color: "#06b6d4" },
      { id: "confianza", label: "Transmitir seguridad absoluta y cautivar en presentaciones", color: "#06b6d4" },
      { id: "claridad", label: "Expresar mis ideas con total claridad sin dudar ni trabarme", color: "#06b6d4" },
    ],
  },
  {
    id: "profession",
    title: "¿Cuál es tu rol o actividad principal?",
    subtitle: "Adaptaremos el registro acústico a tu ecosistema profesional",
    options: [
      { id: "direccion", label: "Director, CEO, Gerente o Líder de equipos", color: "#0ea5e9" },
      { id: "comercial", label: "Vendedor, Asesor Comercial o Emprendedor", color: "#0ea5e9" },
      { id: "consultoria", label: "Consultor, Docente, Abogado o Profesional técnico", color: "#0ea5e9" },
      { id: "creador", label: "Conferencista, Creador de contenido o Comunicador", color: "#0ea5e9" },
    ],
  },
  {
    id: "cost",
    title: "¿Qué impacto ha tenido la inseguridad al hablar en tu carrera?",
    subtitle: "Identificamos el costo real de oportunidad para priorizar tu avance",
    options: [
      { id: "ventas_perdidas", label: "Perder oportunidades comerciales o clientes valiosos", color: "#3b82f6" },
      { id: "freno_laboral", label: "Frenar ascensos o puestos de mayor reconocimiento", color: "#3b82f6" },
      { id: "baja_presencia", label: "Sentirme invisible o poco escuchado en reuniones", color: "#3b82f6" },
      { id: "ansiedad_previa", label: "Estrés y desgaste emocional antes de cada intervención", color: "#3b82f6" },
    ],
  },
  {
    id: "fearSymptom",
    title: "Bajo presión o tensión, ¿qué síntoma físico experimentas?",
    subtitle: "Diagnóstico bioacústico de la respuesta neuromuscular al miedo",
    options: [
      { id: "temblor", label: "Mi voz tiembla, se apaga o sale fina y sin fuerza", color: "#6366f1" },
      { id: "mente_blanco", label: "Me quedo en blanco y pierdo el hilo de mis ideas", color: "#6366f1" },
      { id: "nudo_garganta", label: "Tensión en el cuello, garganta seca y falta de aire", color: "#6366f1" },
      { id: "aceleracion", label: "Hablo a toda velocidad intentando terminar cuanto antes", color: "#6366f1" },
    ],
  },
  {
    id: "speakingPace",
    title: "¿Cómo describirías la velocidad de tu discurso habitual?",
    subtitle: "Calibración del tempo de procesamiento cognitivo y fonación",
    options: [
      { id: "demasiado_rapido", label: "Muy acelerado: las palabras se atropellan", color: "#8b5cf6" },
      { id: "monotono_plano", label: "Monótono y plano: me cuesta variar los matices", color: "#8b5cf6" },
      { id: "pausas_incomodas", label: "Irregular: pausas incómodas donde no sé cómo seguir", color: "#8b5cf6" },
      { id: "variable_ansioso", label: "Arranco pausado pero me acelero si siento presión", color: "#8b5cf6" },
    ],
  },
  {
    id: "fillerWords",
    title: "¿Qué tan frecuente es el uso de muletillas en tu habla?",
    subtitle: "Medición del ruido en la señal acústica ('ehhh', 'este', 'o sea')",
    options: [
      { id: "muy_frecuente", label: "Constante: lleno casi cada silencio con muletillas", color: "#a855f7" },
      { id: "ante_preguntas", label: "Aparecen cuando me hacen preguntas imprevistas", color: "#a855f7" },
      { id: "ocasional_rigido", label: "Poco frecuente, pero me pongo muy rígido al evitarlas", color: "#a855f7" },
      { id: "quiero_pulir", label: "Quiero erradicarlas por completo para sonar impecable", color: "#a855f7" },
    ],
  },
  {
    id: "highStakesScenario",
    title: "¿En qué escenario necesitas que tu voz tenga máximo peso?",
    subtitle: "Foco contextual del entrenamiento de proyección y presencia",
    options: [
      { id: "juntas_directivas", label: "Reuniones de directorio, comités o con socios clave", color: "#d946ef" },
      { id: "negociacion_1a1", label: "Reuniones 1 a 1 de venta, negociación y cierre", color: "#d946ef" },
      { id: "auditorios_eventos", label: "Discursos, conferencias o eventos frente al público", color: "#d946ef" },
      { id: "videos_camaras", label: "Cámaras, videos digitales, webinars o entrevistas", color: "#d946ef" },
    ],
  },
  {
    id: "impromptuAbility",
    title: "¿Cómo reaccionas cuando debes responder sin preparación?",
    subtitle: "Nivel de elasticidad neural e improvisación estructural",
    options: [
      { id: "bloqueo_total", label: "Me bloqueo si no tengo una estructura previamente escrita", color: "#ec4899" },
      { id: "rodeos_largos", label: "Doy rodeos interminables antes de llegar a la idea", color: "#ec4899" },
      { id: "correcto_sin_brillo", label: "Respondo bien pero siento que carece de fuerza o impacto", color: "#ec4899" },
      { id: "falta_precision", label: "Tengo la idea clara pero me faltan las palabras precisas", color: "#ec4899" },
    ],
  },
  {
    id: "vocalTone",
    title: "¿Cómo percibes el timbre y proyección de tu voz hoy?",
    subtitle: "Evaluación acústica de la resonancia pectoral y laríngea",
    options: [
      { id: "debil_apagada", label: "Voz baja o apagada: con frecuencia me piden repetir", color: "#f43f5e" },
      { id: "aguda_tensa", label: "Tono agudo o nasal que resta peso a mis argumentos", color: "#f43f5e" },
      { id: "aceptable_sin_peso", label: "Aceptable, pero le falta esa profundidad que impone respeto", color: "#f43f5e" },
      { id: "aspiracion_grave", label: "Busco una resonancia grave, firme y magnética", color: "#f43f5e" },
    ],
  },
  {
    id: "audienceSize",
    title: "¿A qué volumen de audiencia te enfrentas regularmente?",
    subtitle: "Calibración de la energía requerida para dominar el espacio",
    options: [
      { id: "pequeno_1_5", label: "Equipos pequeños o reuniones reducidas (1 a 5 personas)", color: "#ef4444" },
      { id: "mediano_10_50", label: "Grupos de trabajo o clientes medianos (10 a 50 personas)", color: "#ef4444" },
      { id: "masivo_50_mas", label: "Grandes auditorios o eventos masivos (más de 50 personas)", color: "#ef4444" },
      { id: "audiencias_digitales", label: "Audiencias virtuales en remoto y grabaciones digitales", color: "#ef4444" },
    ],
  },
  {
    id: "urgency",
    title: "¿Qué tan urgente es para ti transformar tu comunicación?",
    subtitle: "Medición del compromiso operativo para diseñar tu plan de práctica",
    options: [
      { id: "critica_inmediata", label: "Crítica: tengo presentaciones o retos decisivos este mes", color: "#f97316" },
      { id: "alta_trimestre", label: "Prioridad alta: quiero cambiar mi nivel profesional este año", color: "#f97316" },
      { id: "habilidad_vida", label: "Estratégica: considero la voz mi activo más importante", color: "#f97316" },
      { id: "diagnostico_inicial", label: "Exploratoria: quiero conocer mi auditoría bioacústica hoy", color: "#f97316" },
    ],
  },
  {
    id: "archetypeVector",
    title: "Al consolidar tu voz, ¿cuál es tu arquetipo aspiracional?",
    subtitle: "El destino final hacia el que se entrenará tu algoritmo de voz",
    options: [
      { id: "lider_magnetico", label: "Líder Magnético: autoridad serena que inspira respeto natural", color: "#10b981" },
      { id: "persuasor_estrategico", label: "Persuasor Estratégico: maestro de la convicción y el cierre", color: "#10b981" },
      { id: "comunicador_cristalino", label: "Comunicador Cristalino: articulación impecable y concisa", color: "#10b981" },
      { id: "orador_apasionado", label: "Orador Apasionado: energía vibrante que conmueve y moviliza", color: "#10b981" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [step, setStep] = useState(0); // 0 a 11 (preguntas), 12 (síntesis y guardado)
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sincronizar email de la sesión si está autenticado
  useEffect(() => {
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    }
    if (session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session]);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    // Avance fluido automático al seleccionar
    if (step < STRATEGIC_QUESTIONS_12.length - 1) {
      setTimeout(() => {
        setStep((s) => s + 1);
      }, 250);
    } else {
      setTimeout(() => {
        setStep(STRATEGIC_QUESTIONS_12.length);
      }, 300);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    setSaveError(null);

    const emailToSave = (userEmail || session?.user?.email || "").trim().toLowerCase();

    if (!emailToSave || !emailToSave.includes("@")) {
      setSaveError("Por favor ingresa un correo electrónico válido para registrar tu arquetipo.");
      setIsSaving(false);
      return;
    }

    try {
      const synthesizedArchetype = calculateVoiceArchetype(answers);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("user_archetype_target", JSON.stringify(synthesizedArchetype));
        } catch {}
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToSave,
          name: userName || session?.user?.name || "",
          answers,
          archetypeId: synthesizedArchetype.id,
          archetypeName: synthesizedArchetype.name,
          archetypeData: synthesizedArchetype,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "No se pudo guardar tu perfil. Inténtalo de nuevo.");
      }

      // Redirigir a la experiencia de voz
      router.push("/voz_efectiva");
    } catch (err) {
      console.error("Error guardando perfil:", err);
      setSaveError(err instanceof Error ? err.message : "Error al guardar el perfil.");
      setIsSaving(false);
    }
  };

  // PANTALLA FINAL: SÍNTESIS DEL ARQUETIPO Y REGISTRO CON CORREO
  if (step === STRATEGIC_QUESTIONS_12.length) {
    const synthesizedArchetype = calculateVoiceArchetype(answers);
    const objectiveChoice = STRATEGIC_QUESTIONS_12[0].options.find(
      (o) => o.id === answers.objective
    )?.label;

    return (
      <div suppressHydrationWarning className="min-h-screen bg-[#040608] text-white flex items-center justify-center p-4 sm:p-6 selection:bg-amber-500/30">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-8 lg:gap-12 items-center">
          {/* Lado Izquierdo: Resumen y Formulario de Correo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              12 Nodos Biométricos Calibrados
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Tu Arquetipo Vocal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400">
                Está Consolidado
              </span>
            </h1>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3 text-sm text-slate-300">
              <p>
                <strong className="text-white">Meta Primaria:</strong> {objectiveChoice || "Liderazgo y Autoridad"}
              </p>
              <div className="p-3.5 rounded-xl border border-white/10 bg-[#0d1527] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block font-bold">
                  ARQUETIPO VOCAL DETERMINADO:
                </span>
                <span className="text-base sm:text-lg text-emerald-400 font-black block">
                  {synthesizedArchetype.name} ({synthesizedArchetype.code})
                </span>
                <p className="text-xs text-amber-300/90 font-medium">
                  "{synthesizedArchetype.tagline}"
                </p>
              </div>
              <p className="text-xs text-slate-400 border-t border-white/5 pt-2">
                {synthesizedArchetype.description}
              </p>
              <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-500/20">
                🎯 Target Acústico: {synthesizedArchetype.acousticVector.wpmRange[0]}-{synthesizedArchetype.acousticVector.wpmRange[1]} WPM | Pausas: {synthesizedArchetype.acousticVector.pauseDurationSec}s | Resonancia: {Math.round(synthesizedArchetype.acousticVector.energyStability * 100)}%
              </div>
            </div>

            {/* Formulario de Correo para Asociar Respuestas */}
            <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/30 space-y-4 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-wider text-cyan-300">
                Guardar con tus datos de contacto
              </h3>
              <p className="text-xs text-slate-400">
                Tus 12 respuestas se guardarán vinculadas a tu correo para dar seguimiento a tu evolución en cada ejercicio.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white text-sm outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white text-sm outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {saveError && (
                <p role="alert" className="text-xs text-rose-300 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  ⚠️ {saveError}
                </p>
              )}

              <button
                onClick={handleFinish}
                disabled={isSaving}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.35)] disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Guardando Registro..." : "Guardar Arquetipo y Probar Mi Voz (15s)"}
              </button>
            </div>
          </motion.div>

          {/* Lado Derecho: Panel de Auditoría Consolidado */}
          <div className="flex justify-center">
            <ArchetypeDashboardPanel answers={answers} currentStepIndex={11} />
          </div>
        </div>
      </div>
    );
  }

  const currentQ = STRATEGIC_QUESTIONS_12[step];
  const hasAnsweredCurrent = !!answers[currentQ.id];

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#040608] text-slate-300 font-sans flex flex-col selection:bg-amber-500/30">
      {/* Header Progreso */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#040608]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-lg sm:text-xl tracking-tighter text-white">
            VOZ<span className="text-amber-500">EFECTIVA</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              NODO {step + 1} / {STRATEGIC_QUESTIONS_12.length}
            </div>

            {/* Píldoras de progreso de 12 pasos */}
            <div className="flex gap-1">
              {STRATEGIC_QUESTIONS_12.map((q, i) => {
                const isDone = !!answers[q.id];
                const isCurr = i === step;
                return (
                  <button
                    key={q.id}
                    onClick={() => setStep(i)}
                    aria-label={`Ir al paso ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isCurr
                        ? "w-5 sm:w-7 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                        : isDone
                        ? "w-2 sm:w-3.5 bg-cyan-400"
                        : "w-1.5 sm:w-2 bg-slate-800"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Contenedor Principal: Preguntas a la izquierda + Matriz Gráfica a la derecha */}
      <main suppressHydrationWarning className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-24 pb-20 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start mt-2">
        {/* Lado Izquierdo: Pregunta Activa */}
        <div className="flex-1 w-full relative min-h-[440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 w-full"
            >
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                  INSTANCIA BIOMÉTRICA {step + 1} DE 12
                </span>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-tight mt-1">
                  {currentQ.title}
                </h1>
                {currentQ.subtitle && (
                  <p className="text-slate-400 mt-2 text-sm leading-relaxed">{currentQ.subtitle}</p>
                )}
              </div>

              {/* Opciones de respuesta */}
              <div className="grid grid-cols-1 gap-3 mt-6" role="group" aria-label={currentQ.title}>
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(currentQ.id, opt.id)}
                      aria-pressed={isSelected}
                      className={`p-4 sm:p-5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 cursor-pointer ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.2)] scale-[1.01]"
                          : "bg-slate-900/60 border-white/10 hover:border-cyan-500/40 text-slate-300 hover:bg-slate-800/80 hover:scale-[1.005]"
                      }`}
                    >
                      <div
                        className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "border-amber-400 bg-amber-400/20" : "border-slate-600"
                        }`}
                      >
                        {isSelected && <div className="size-2 rounded-full bg-amber-400" />}
                      </div>
                      <span className={`font-semibold text-sm sm:text-base tracking-wide ${isSelected ? "text-white" : "text-slate-200"}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navegación Anterior / Siguiente */}
              <div className="pt-6 flex justify-between items-center border-t border-white/10 mt-8">
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider disabled:opacity-0 transition-opacity cursor-pointer"
                >
                  ← Anterior
                </button>

                <div className="flex gap-4 items-center">
                  <span className="text-xs font-mono text-slate-400">
                    {hasAnsweredCurrent ? "✓ Nodo Enlazado" : "Selecciona una opción"}
                  </span>
                  <button
                    onClick={() => {
                      if (step < STRATEGIC_QUESTIONS_12.length - 1) {
                        setStep(step + 1);
                      } else {
                        setStep(STRATEGIC_QUESTIONS_12.length);
                      }
                    }}
                    disabled={!hasAnsweredCurrent}
                    className="px-6 py-2.5 bg-white text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg cursor-pointer"
                  >
                    {step === STRATEGIC_QUESTIONS_12.length - 1 ? "Sintetizar" : "Siguiente →"}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Lado Derecho: Matriz Científica con Barras Gruesas de Neón y Radar de Arquetipo */}
        <aside className="w-full lg:w-[500px] xl:w-[560px] shrink-0 sticky top-20 flex justify-center">
          <ArchetypeDashboardPanel answers={answers} currentStepIndex={step} />
        </aside>
      </main>
    </div>
  );
}
