"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function SilencePage() {
  const [phase, setPhase] = useState<"setup" | "active" | "completed">("setup");
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSession = (secs: number) => {
      setDuration(secs);
      setTimeLeft(secs);
      setPhase("active");
  };

  useEffect(() => {
      if (phase === "active") {
          timerRef.current = setInterval(() => {
              setTimeLeft(prev => {
                  if (prev <= 1) {
                      clearInterval(timerRef.current!);
                      setPhase("completed");
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
      }
      return () => {
          if (timerRef.current) clearInterval(timerRef.current);
      };
  }, [phase]);

  const reset = () => {
      setPhase("setup");
      if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="min-h-screen bg-black text-white font-display flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000">
        
        {/* Header (Hidden when active for total immersion) */}
        <div className={`absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center transition-opacity duration-500 ${phase === 'active' ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
             <Link href="/gym" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Salir</span>
             </Link>
        </div>

        {/* SETUP PHASE */}
        {phase === 'setup' && (
            <div className="w-full max-w-md space-y-12 text-center animate-fade-in z-10">
                <div className="space-y-4">
                    <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                         <span className="material-symbols-outlined text-4xl text-slate-400">visibility</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Silencio Obligatorio</h1>
                    <p className="text-slate-400 text-lg">
                        El poder no está en hablar, está en callar sin incomodidad.
                        <br/><span className="text-white font-bold opacity-80">Selecciona tu nivel:</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { s: 10, label: "PRINCIPIANTE (10s)", desc: "Supera la urgencia de rellenar." },
                        { s: 30, label: "INTERMEDIO (30s)", desc: "Sostén la mirada. Respira." },
                        { s: 60, label: "MAESTRO (60s)", desc: "Comodidad total en el vacío." }
                    ].map(opt => (
                        <button 
                            key={opt.s}
                            onClick={() => startSession(opt.s)}
                            className="group relative overflow-hidden bg-slate-900 border border-white/10 p-6 rounded-2xl hover:border-white/30 hover:bg-slate-800 transition-all text-left"
                        >
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <div className="text-lg font-black text-white mb-1 group-hover:text-amber-400 transition-colors uppercase tracking-widest">{opt.label}</div>
                                    <div className="text-sm text-slate-500 font-medium">{opt.desc}</div>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-white transition-colors">arrow_forward</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* ACTIVE PHASE */}
        {phase === 'active' && (
            <div className="fixed inset-0 bg-black z-30 flex flex-col items-center justify-center animate-fade-in cursur-none">
                
                {/* The Anchor Point */}
                <div className="relative">
                    <div className="size-4 md:size-6 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.8)] animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-32 md:size-64 bg-white/5 rounded-full blur-[50px] animate-pulse" />
                </div>

                <p className="fixed bottom-20 text-slate-600 font-bold uppercase tracking-[0.5em] text-xs md:text-sm animate-pulse">
                    Mántén la mirada
                </p>

                {/* Subtle Timer */}
                <div className="fixed bottom-10 text-white/20 font-mono font-black text-6xl select-none">
                    {timeLeft}
                </div>
            </div>
        )}

        {/* COMPLETED PHASE */}
        {phase === 'completed' && (
            <div className="w-full max-w-lg text-center animate-fade-in-up z-10 space-y-8">
                 <div className="text-8xl mb-4">👁️</div>
                 <h2 className="text-4xl font-black text-white">Dominio del Silencio</h2>
                 <p className="text-slate-400 text-lg">
                     Has sostenido {duration} segundos de silencio puro.
                     <br/>
                     Esa calma es tu verdadera autoridad.
                 </p>

                 <div className="flex gap-4 justify-center pt-8">
                    <button 
                        onClick={reset}
                        className="px-8 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform"
                    >
                        REPETIR
                    </button>
                    <Link href="/gym">
                        <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors">
                            VOLVER
                        </button>
                    </Link>
                 </div>
            </div>
        )}

    </div>
  );
}
