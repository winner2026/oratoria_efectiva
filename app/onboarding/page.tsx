"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const QUESTIONS = [
  {
    id: "objective",
    title: "¿Qué te gustaría conseguir al comunicarte?",
    subtitle: "Elegiremos tus primeros desafíos en función de tu objetivo principal",
    options: [
      { id: "claridad", label: "Expresar mis ideas con más claridad" },
      { id: "seguridad", label: "Hablar con más seguridad y confianza" },
      { id: "persuasion", label: "Persuadir, vender y convencer mejor" },
      { id: "liderazgo", label: "Liderar conversaciones y transmitir autoridad" }
    ],
  },
  {
    id: "difficulty",
    title: "¿Qué es lo que más te cuesta cuando hablas?",
    subtitle: "No existe una respuesta correcta. Queremos saber qué percibes tú",
    options: [
      { id: "rapido", label: "Hablo demasiado rápido o uso muchas muletillas" },
      { id: "nervios", label: "Me pongo nervioso y pierdo seguridad" },
      { id: "orden", label: "Me cuesta ordenar las ideas y explicarlas" },
      { id: "monotono", label: "Mi voz suena monótona o poco expresiva" }
    ],
  },
  {
    id: "profession",
    title: "¿En qué actividad utilizas más tu voz?",
    subtitle: "Adaptaremos los ejercicios a situaciones que tengan sentido para ti",
    options: [
      { id: "ventas", label: "Ventas, atención al cliente o emprendimiento" },
      { id: "direccion", label: "Dirección, liderazgo o gestión de equipos" },
      { id: "educacion", label: "Educación, formación o creación de contenido" },
      { id: "estudio", label: "Estudio, búsqueda de empleo u otras actividades" }
    ],
  },
  {
    id: "situation",
    title: "¿En qué situación necesitas comunicar mejor?",
    options: [
      { id: "producto", label: "Presentar un producto o responder a un cliente" },
      { id: "reuniones", label: "Hablar en reuniones y dirigir equipos" },
      { id: "discursos", label: "Hacer presentaciones, clases o discursos" },
      { id: "entrevistas", label: "Participar en entrevistas o grabar contenido" }
    ],
  },
  {
    id: "interest",
    title: "¿Qué habilidad te gustaría practicar primero?",
    options: [
      { id: "ritmo", label: "Controlar pausas, ritmo y muletillas" },
      { id: "confianza", label: "Transmitir confianza mediante la voz" },
      { id: "persuasion", label: "Hablar de forma persuasiva y convincente" },
      { id: "improvisacion", label: "Improvisar y responder con claridad" }
    ]
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [step, setStep] = useState(0); // 0 to 7. 7 is complete.
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && (session?.user as any)?.id === "guest-1")) {
      router.push('/auth/login?callbackUrl=/onboarding');
    } else if (status === "authenticated") {
      fetch('/api/onboarding')
        .then(res => res.json())
        .then(data => {
          if (data.profile?.isCompleted) {
            router.push('/voz_efectiva');
          }
        });
    }
  }, [status, router]);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      if (!response.ok) {
        throw new Error('No se pudo guardar tu perfil. Comprueba tu conexión e inténtalo de nuevo.');
      }
      router.push('/voz_efectiva');
    } catch (err) {
      console.error(err);
      setSaveError(err instanceof Error ? err.message : 'No se pudo guardar tu perfil. Inténtalo de nuevo.');
      setIsSaving(false);
    }
  };

  const objectiveLabel = QUESTIONS[0].options.find((option) => option.id === answers.objective)?.label;
  const difficultyLabel = QUESTIONS[1].options.find((option) => option.id === answers.difficulty)?.label;

  if (step === QUESTIONS.length) {
    return (
      <div className="min-h-screen bg-[#040608] text-white flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full text-center space-y-8">
           <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-emerald-400">Tu perfil inicial</h1>
           <p className="text-lg text-slate-300">
             Tu punto de partida será <strong className="text-white">{objectiveLabel?.toLowerCase()}</strong>{difficultyLabel ? <>. También quieres trabajar: <strong className="text-white">{difficultyLabel.toLowerCase()}</strong>.</> : "."} El análisis de voz te dará una referencia inicial para tu práctica.
           </p>
           
           <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 text-left space-y-4">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Tu recorrido personalizado</h3>
              
              <div className="flex gap-4 items-start">
                <div className="size-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">1</div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Descubre tu punto de partida</h4>
                  <p className="text-xs text-slate-400 mt-1">Una grabación inicial de 15 segundos.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="size-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-black text-sm shrink-0">2</div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Practica tu primera habilidad</h4>
                  <p className="text-xs text-slate-400 mt-1">Un desafío personalizado con repetición local.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="size-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-black text-sm shrink-0">3</div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Comprueba tu evolución</h4>
                  <p className="text-xs text-slate-400 mt-1">Una evaluación posterior para comparar resultados.</p>
                </div>
              </div>
           </div>

           <button 
             onClick={handleFinish}
             disabled={isSaving}
             className="w-full py-5 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 text-slate-950 rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] disabled:opacity-50"
           >
             {isSaving ? 'Guardando...' : 'Probar Mi Voz'}
           </button>
           {saveError && <p role="alert" className="text-sm text-rose-300">{saveError}</p>}
           <p className="text-xs text-slate-400">Grabaremos una muestra breve. Necesitarás permitir el acceso al micrófono y aceptar el aviso de uso del audio.</p>
        </motion.div>
      </div>
    );
  }

  const currentQ = QUESTIONS[step];
  const hasAnsweredCurrent = !!answers[currentQ.id];

  return (
    <div className="min-h-screen bg-[#040608] text-slate-300 font-sans flex flex-col">
      {/* Header Progreso */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#040608]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-black text-lg sm:text-xl tracking-tighter text-white">
            VOZ<span className="text-amber-500">EFECTIVA</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Paso {step + 1}/{QUESTIONS.length}
            </div>
            <div className="flex gap-1">
              {QUESTIONS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-2.5 sm:w-6 rounded-full transition-all duration-500 ${i <= step ? 'bg-amber-500' : 'bg-slate-800'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-24 pb-24 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center lg:items-start mt-8">
        
        {/* Lado Izquierdo: Preguntas */}
        <div className="flex-1 w-full relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }} 
              transition={{ duration: 0.3 }}
              className="space-y-6 w-full"
            >
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                  {currentQ.title}
                </h1>
                {currentQ.subtitle && (
                  <p className="text-slate-400 mt-2 text-sm">{currentQ.subtitle}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 mt-8" role="group" aria-label={currentQ.title}>
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(currentQ.id, opt.id)}
                      aria-pressed={isSelected}
                      className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${isSelected ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.01]' : 'bg-slate-900/50 border-white/10 hover:border-white/30 text-slate-300 hover:bg-slate-800'}`}
                    >
                      <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-amber-500' : 'border-slate-600'}`}>
                        {isSelected && <div className="size-2.5 rounded-full bg-amber-500" />}
                      </div>
                      <span className={`font-bold text-sm tracking-wide ${isSelected ? 'text-white' : 'text-slate-300'}`}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-8 flex justify-between items-center border-t border-white/5 mt-8">
                <button 
                  onClick={() => setStep(Math.max(0, step - 1))} 
                  disabled={step === 0}
                  className="text-sm font-bold text-slate-500 hover:text-white uppercase tracking-wider disabled:opacity-0"
                >
                  Anterior
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={handleNext}
                    disabled={!hasAnsweredCurrent}
                    className="px-8 py-3 bg-white text-slate-950 rounded-xl font-black uppercase tracking-widest hover:bg-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="w-full lg:w-72 shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-slate-300">
          <h2 className="font-bold text-white">Tu recorrido empieza aquí</h2>
          <p className="mt-2">Responde cinco preguntas breves. Usaremos tus respuestas para orientar los primeros ejercicios.</p>
          <p className="mt-3 text-slate-400">No pedimos edad ni género. Después podrás grabar una muestra de voz y revisar el resultado antes de decidir si quieres seguir practicando.</p>
        </aside>

      </main>
    </div>
  );
}
