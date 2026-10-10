"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const OBJECTIVES = [
  { id: "ventas", label: "Vender y negociar", icon: "sell" },
  { id: "liderazgo", label: "Liderar equipos", icon: "groups" },
  { id: "presentaciones", label: "Presentar ideas", icon: "present_to_all" },
  { id: "publico", label: "Hablar en público", icon: "campaign" },
  { id: "clientes", label: "Atención a clientes", icon: "support_agent" },
];

const DIFFICULTIES = [
  { id: "rapido", label: "Hablo muy rápido", icon: "speed" },
  { id: "muletillas", label: "Uso muchas muletillas", icon: "record_voice_over" },
  { id: "orden", label: "Me cuesta ordenar ideas", icon: "account_tree" },
  { id: "monotono", label: "Sueno monótono", icon: "graphic_eq" },
  { id: "seguridad", label: "Falta de seguridad", icon: "gpp_bad" },
  { id: "nervios", label: "Me ganan los nervios", icon: "sentiment_dissatisfied" },
];

const PROFESSIONS = [
  { id: "ventas", label: "Ventas / Comercial" },
  { id: "emprendedor", label: "Emprendimiento" },
  { id: "educacion", label: "Educación" },
  { id: "direccion", label: "Dirección / Gerencia" },
  { id: "estudiante", label: "Estudiante" },
  { id: "otro", label: "Otro" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  
  const [objective, setObjective] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [profession, setProfession] = useState<string | null>(null);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleFinish = () => {
    // Navigate to the scanner with context
    const params = new URLSearchParams();
    if (objective) params.set("obj", objective);
    if (difficulty.length > 0) params.set("diff", difficulty.join(","));
    if (profession) params.set("prof", profession);
    
    router.push(`/voz_efectiva?${params.toString()}`);
  };

  const toggleDifficulty = (id: string) => {
    if (difficulty.includes(id)) {
      setDifficulty(difficulty.filter(d => d !== id));
    } else if (difficulty.length < 2) {
      setDifficulty([...difficulty, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#040608] text-slate-300 font-sans selection:bg-amber-500/30 flex flex-col">
      {/* Header Progreso */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#040608]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tighter text-white">
            VOZ<span className="text-amber-500">EFECTIVA</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Paso {Math.min(step + 1, 4)} de 4
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${i <= step ? 'bg-amber-500' : 'bg-slate-800'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-32 pb-24 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Lado Izquierdo: Formulario */}
        <div className="flex-1 w-full relative min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                  Vamos a personalizar <br/><span className="text-amber-500">tu entrenamiento</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-md">
                  No todo el mundo necesita mejorar lo mismo. Cuéntanos qué quieres conseguir para preparar tus primeros desafíos de voz.
                </p>
                <button 
                  onClick={handleNext}
                  className="mt-8 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-colors"
                >
                  Comenzar
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 w-full">
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                  ¿En qué situación quieres comunicar mejor?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                  {OBJECTIVES.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => { setObjective(obj.id); setTimeout(handleNext, 300); }}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${objective === obj.id ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-900 border-white/10 hover:border-white/30 text-slate-300'}`}
                    >
                      <span className="material-symbols-outlined text-2xl">{obj.icon}</span>
                      <span className="font-bold text-sm uppercase tracking-wide">{obj.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 w-full">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                    ¿Qué te cuesta más al hablar?
                  </h2>
                  <p className="text-slate-400 mt-2 text-sm">Elige hasta 2 opciones.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => toggleDifficulty(diff.id)}
                      disabled={difficulty.length >= 2 && !difficulty.includes(diff.id)}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${difficulty.includes(diff.id) ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-900 border-white/10 hover:border-white/30 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed'}`}
                    >
                      <span className="material-symbols-outlined text-2xl">{diff.icon}</span>
                      <span className="font-bold text-sm uppercase tracking-wide">{diff.label}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <button onClick={() => setStep(step - 1)} className="text-sm font-bold text-slate-500 hover:text-white uppercase tracking-wider">Atrás</button>
                  <button 
                    onClick={handleNext}
                    disabled={difficulty.length === 0}
                    className="px-8 py-3 bg-white text-slate-950 rounded-xl font-black uppercase tracking-widest hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 w-full">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                    Tu perfil está tomando forma
                  </h2>
                  <p className="text-slate-400 mt-2 text-sm">Opcional: ¿A qué te dedicas?</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-8">
                  {PROFESSIONS.map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => { setProfession(prof.id); setTimeout(handleNext, 300); }}
                      className={`px-5 py-3 rounded-xl border font-bold text-sm uppercase tracking-wide transition-all ${profession === prof.id ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-900 border-white/10 hover:border-white/30 text-slate-300'}`}
                    >
                      {prof.label}
                    </button>
                  ))}
                </div>
                <div className="pt-8 flex justify-between items-center">
                  <button onClick={() => setStep(step - 1)} className="text-sm font-bold text-slate-500 hover:text-white uppercase tracking-wider">Atrás</button>
                  <button 
                    onClick={handleNext}
                    className="px-8 py-3 bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/20 transition-colors"
                  >
                    Omitir
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8 w-full">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Perfil Completo
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                    Vamos a entrenar tu comunicación
                  </h2>
                  <p className="text-slate-400 mt-4 text-base leading-relaxed">
                    Según tus respuestas, tu recorrido inicial se centrará en 
                    <span className="text-amber-400 font-bold"> {difficulty.length > 0 ? DIFFICULTIES.find(d=>d.id === difficulty[0])?.label.toLowerCase() : 'mejorar tu claridad'} </span> 
                    para situaciones de 
                    <span className="text-white font-bold"> {objective ? OBJECTIVES.find(o=>o.id === objective)?.label.toLowerCase() : 'comunicación profesional'}</span>.
                  </p>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-white/5 p-6 space-y-4">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Tu recorrido personalizado</h3>
                  
                  <div className="flex gap-4 items-start">
                    <div className="size-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">1</div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase">Descubre tu punto de partida</h4>
                      <p className="text-xs text-slate-400 mt-1">Una grabación inicial de 15 segundos para establecer tu base.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="size-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-black text-sm shrink-0">2</div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase">Practica tu primera habilidad</h4>
                      <p className="text-xs text-slate-400 mt-1">Un desafío local e inmediato en el navegador, diseñado para tu prioridad.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="size-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-black text-sm shrink-0">3</div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase">Comprueba tu evolución</h4>
                      <p className="text-xs text-slate-400 mt-1">Escucha tu antes y después, y mide tu progreso real.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleFinish}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 text-slate-950 rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)]"
                >
                  Empezar Diagnóstico
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Lado Derecho: Mapa de Entrenamiento Animado */}
        <div className="hidden lg:flex w-80 shrink-0 flex-col gap-4">
          <div className="bg-[#090C10] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <span className="material-symbols-outlined text-6xl">map</span>
            </div>
            <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6">Tu mapa de entrenamiento</h3>
            
            <div className="space-y-6 relative z-10">
              {/* Bloque Objetivo */}
              <div className={`transition-all duration-700 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4'}`}>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Objetivo</div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-sm">{objective ? OBJECTIVES.find(o=>o.id === objective)?.icon : 'flag'}</span>
                  {objective ? OBJECTIVES.find(o=>o.id === objective)?.label : 'Esperando respuesta...'}
                </div>
              </div>

              {/* Bloque Prioridad */}
              <div className={`transition-all duration-700 delay-100 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4'}`}>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Prioridad declarada</div>
                <div className="text-sm font-bold text-white flex flex-col gap-1">
                  {difficulty.length > 0 ? difficulty.map(d => (
                    <div key={d} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-sm">{DIFFICULTIES.find(x=>x.id === d)?.icon}</span>
                      {DIFFICULTIES.find(x=>x.id === d)?.label}
                    </div>
                  )) : (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-600 text-sm">tune</span>
                      Esperando respuesta...
                    </div>
                  )}
                </div>
              </div>

              {/* Bloque Perfil */}
              <div className={`transition-all duration-700 delay-200 ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4'}`}>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Escenario de práctica</div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-sm">{profession ? 'work' : 'pending'}</span>
                  {profession ? PROFESSIONS.find(p=>p.id === profession)?.label : 'Esperando respuesta...'}
                </div>
              </div>
            </div>
            
            {step < 4 && (
              <div className="mt-8 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="material-symbols-outlined text-sm animate-pulse">sync</span>
                  <span>Configurando entrenamiento...</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
