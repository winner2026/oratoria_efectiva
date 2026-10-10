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
    optional: false,
    options: [
      { id: "claridad", label: "Expresar mis ideas con más claridad" },
      { id: "seguridad", label: "Hablar con más seguridad y confianza" },
      { id: "persuasion", label: "Persuadir, vender y convencer mejor" },
      { id: "liderazgo", label: "Liderar conversaciones y transmitir autoridad" }
    ],
    messageAfter: "Ya conocemos tu principal objetivo. Ahora vamos a identificar qué tipo de práctica podría ayudarte a avanzar."
  },
  {
    id: "difficulty",
    title: "¿Qué es lo que más te cuesta cuando hablas?",
    subtitle: "No existe una respuesta correcta. Queremos saber qué percibes tú",
    optional: false,
    options: [
      { id: "rapido", label: "Hablo demasiado rápido o uso muchas muletillas" },
      { id: "nervios", label: "Me pongo nervioso y pierdo seguridad" },
      { id: "orden", label: "Me cuesta ordenar las ideas y explicarlas" },
      { id: "monotono", label: "Mi voz suena monótona o poco expresiva" }
    ],
    messageAfter: "Estamos combinando tu objetivo con la dificultad que percibes para orientar tu primer entrenamiento."
  },
  {
    id: "profession",
    title: "¿En qué actividad utilizas más tu voz?",
    subtitle: "Adaptaremos los ejercicios a situaciones que tengan sentido para ti",
    optional: false,
    options: [
      { id: "ventas", label: "Ventas, atención al cliente o emprendimiento" },
      { id: "direccion", label: "Dirección, liderazgo o gestión de equipos" },
      { id: "educacion", label: "Educación, formación o creación de contenido" },
      { id: "estudio", label: "Estudio, búsqueda de empleo u otras actividades" }
    ],
    messageAfter: "Tu actividad nos ayuda a elegir ejemplos de comunicación más relevantes para tu día a día."
  },
  {
    id: "situation",
    title: "¿En qué situación necesitas comunicar mejor?",
    optional: false,
    options: [
      { id: "producto", label: "Presentar un producto o responder a un cliente" },
      { id: "reuniones", label: "Hablar en reuniones y dirigir equipos" },
      { id: "discursos", label: "Hacer presentaciones, clases o discursos" },
      { id: "entrevistas", label: "Participar en entrevistas o grabar contenido" }
    ],
    messageAfter: "Ya tenemos un contexto concreto para convertir tu objetivo en una práctica útil."
  },
  {
    id: "interest",
    title: "¿Qué habilidad te gustaría practicar primero?",
    optional: false,
    options: [
      { id: "ritmo", label: "Controlar pausas, ritmo y muletillas" },
      { id: "confianza", label: "Transmitir confianza mediante la voz" },
      { id: "persuasion", label: "Hablar de forma persuasiva y convincente" },
      { id: "improvisacion", label: "Improvisar y responder con claridad" }
    ]
  },
  {
    id: "ageRange",
    title: "¿En qué rango de edad te encuentras?",
    optional: true,
    options: [
      { id: "menos_18", label: "Menos de 18 años" },
      { id: "18_24", label: "Entre 18 y 24 años" },
      { id: "25_39", label: "Entre 25 y 39 años" },
      { id: "40_mas", label: "40 años o más" }
    ]
  },
  {
    id: "gender",
    title: "¿Cómo te identificas?",
    optional: true,
    options: [
      { id: "mujer", label: "Mujer" },
      { id: "hombre", label: "Hombre" },
      { id: "no_binario", label: "No binario u otra identidad" },
      { id: "prefiero_no", label: "Prefiero no responder" }
    ]
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [step, setStep] = useState(0); // 0 to 7. 7 is complete.
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if already completed
    if (status === "authenticated") {
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
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      router.push('/voz_efectiva');
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  // Derived values for the chart
  const completedCount = Object.keys(answers).length;
  const progress = Math.round((step / QUESTIONS.length) * 100);

  // Calculate radar chart values based on answers
  const chartData = {
    claridad: answers.objective === 'claridad' ? 100 : answers.difficulty === 'orden' ? 80 : 40,
    seguridad: answers.objective === 'seguridad' ? 100 : answers.difficulty === 'nervios' ? 80 : 40,
    energia: answers.objective === 'liderazgo' ? 100 : answers.interest === 'confianza' ? 90 : 50,
    ritmo: answers.difficulty === 'rapido' ? 100 : answers.interest === 'ritmo' ? 90 : 40,
    expresividad: answers.difficulty === 'monotono' ? 100 : answers.interest === 'persuasion' ? 90 : 50,
  };

  const points = `
    50,${100 - chartData.claridad * 0.4} 
    ${50 + chartData.seguridad * 0.4},${50 - chartData.seguridad * 0.15} 
    ${50 + chartData.energia * 0.25},${50 + chartData.energia * 0.35} 
    ${50 - chartData.ritmo * 0.25},${50 + chartData.ritmo * 0.35} 
    ${50 - chartData.expresividad * 0.4},${50 - chartData.expresividad * 0.15}
  `;

  if (step === QUESTIONS.length) {
    return (
      <div className="min-h-screen bg-[#040608] text-white flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full text-center space-y-8">
           <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-emerald-400">Tu perfil inicial</h1>
           <p className="text-lg text-slate-300">
             Vamos a entrenar tu comunicación. Según tus respuestas, tu recorrido inicial se centrará en estructurar mejor tus ideas, utilizar pausas intencionales y comunicar con seguridad.
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
           <p className="text-xs text-slate-500">Grabaremos una muestra breve para conocer tu punto de partida.</p>
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
          <Link href="/" className="font-black text-xl tracking-tighter text-white">
            VOZ<span className="text-amber-500">EFECTIVA</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
              Progreso: {progress}%
            </div>
            <div className="flex gap-1">
              {QUESTIONS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i <= step ? 'bg-amber-500' : 'bg-slate-800'}`} 
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

              <div className="grid grid-cols-1 gap-3 mt-8">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(currentQ.id, opt.id)}
                      className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300 ${isSelected ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.01]' : 'bg-slate-900/50 border-white/10 hover:border-white/30 text-slate-300 hover:bg-slate-800'}`}
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
                  {currentQ.optional && (
                    <button 
                      onClick={handleSkip}
                      className="px-6 py-3 bg-transparent text-slate-400 rounded-xl font-bold uppercase tracking-widest hover:text-white transition-colors text-sm"
                    >
                      Omitir
                    </button>
                  )}
                  <button 
                    onClick={handleNext}
                    disabled={!hasAnsweredCurrent && !currentQ.optional}
                    className="px-8 py-3 bg-white text-slate-950 rounded-xl font-black uppercase tracking-widest hover:bg-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Lado Derecho: Gráficos Dinámicos y Estado */}
        <div className="w-full lg:w-96 shrink-0 flex-col gap-6 flex">
          <div className="bg-[#090C10] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
            <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6 w-full text-left">
              Tu perfil en tiempo real
            </h3>
            
            {/* Gráfico Radar Animado */}
            <div className="relative size-64 mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {/* Background grids */}
                <polygon points="50,10 90,35 75,85 25,85 10,35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                <polygon points="50,25 75,45 65,70 35,70 25,45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                
                {/* Axes */}
                <line x1="50" y1="50" x2="50" y2="10" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="50" y1="50" x2="90" y2="35" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="50" y1="50" x2="75" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="50" y1="50" x2="25" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="50" y1="50" x2="10" y2="35" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                {/* Dynamic Data Polygon */}
                {completedCount > 0 && (
                  <motion.polygon 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, points }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    fill="rgba(245, 158, 11, 0.2)" 
                    stroke="rgba(245, 158, 11, 0.8)" 
                    strokeWidth="2"
                  />
                )}
                
                {/* Labels */}
                <text x="50" y="5" fontSize="4" fill="#64748b" textAnchor="middle">Claridad</text>
                <text x="95" y="35" fontSize="4" fill="#64748b" textAnchor="start">Seguridad</text>
                <text x="80" y="90" fontSize="4" fill="#64748b" textAnchor="start">Energía</text>
                <text x="20" y="90" fontSize="4" fill="#64748b" textAnchor="end">Ritmo</text>
                <text x="5" y="35" fontSize="4" fill="#64748b" textAnchor="end">Expresión</text>
              </svg>
            </div>

            {/* Resumen de Selecciones */}
            <div className="w-full space-y-3">
               <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                 <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Objetivo</span>
                 <span className="text-xs text-white font-bold">{answers.objective ? 'Configurado' : 'Pendiente'}</span>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                 <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Dificultad</span>
                 <span className="text-xs text-white font-bold">{answers.difficulty ? 'Configurado' : 'Pendiente'}</span>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                 <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Contexto</span>
                 <span className="text-xs text-white font-bold">{(answers.profession || answers.situation) ? 'Configurado' : 'Pendiente'}</span>
               </div>
            </div>

            <div className="mt-6 w-full p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
               <p className="text-xs text-amber-400 font-medium italic">
                 {step > 0 && QUESTIONS[step-1].messageAfter ? QUESTIONS[step-1].messageAfter : "Adaptando la experiencia..."}
               </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
