"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function StructuredMinutePage() {
  const [phase, setPhase] = useState<"idle" | "running" | "paused" | "completed">("idle");
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const TOTAL_TIME = 60;

  // Sections definition
  // Intro: 0-10s (First 10s) -> timeLeft 60-50
  // Body: 10-50s (Next 40s) -> timeLeft 50-10
  // Outro: 50-60s (Last 10s) -> timeLeft 10-0
  const sections = [
      { id: 'intro', label: 'Introducción', range: [50, 60], color: 'text-blue-400', bg: 'bg-blue-500', tip: "Engancha. Di de qué hablarás." },
      { id: 'body', label: 'Desarrollo', range: [10, 50], color: 'text-amber-400', bg: 'bg-amber-500', tip: "Argumenta. Da 2 o 3 puntos clave." },
      { id: 'outro', label: 'Cierre', range: [0, 10], color: 'text-green-400', bg: 'bg-green-500', tip: "Aterriza. Conclusión y llamado a la acción." }
  ];

  const getCurrentSection = (secs: number) => {
      if (secs > 50) return sections[0];
      if (secs > 10) return sections[1];
      return sections[2];
  };

  const activeSection = getCurrentSection(timeLeft);

  const startTimer = () => {
      setPhase("running");
      timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
              if (prev <= 1) {
                  stopTimer();
                  setPhase("completed");
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
  };

  const stopTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePause = () => {
      if (phase === "running") {
          stopTimer();
          setPhase("paused");
      } else {
          startTimer();
      }
  };

  const reset = () => {
      stopTimer();
      setTimeLeft(60);
      setPhase("idle");
  };

  useEffect(() => {
      return () => stopTimer();
  }, []);

  // Calculate progress for the circular visualizer or bar
  const progress = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-display flex flex-col relative overflow-hidden transition-colors duration-1000">
        
       {/* Ambient Glow */}
       <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000">
          <div className={`absolute top-0 left-0 w-full h-full opacity-20 transition-colors duration-1000 ${
              activeSection.id === 'intro' ? 'bg-blue-900/40' :
              activeSection.id === 'body' ? 'bg-amber-900/40' :
              'bg-green-900/40'
          }`} />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4 flex justify-between items-center">
         <Link href="/gym" onClick={stopTimer} className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Gimnasio</span>
         </Link>
         <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="material-symbols-outlined text-sm text-slate-400">timer</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Estructura</span>
         </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-lg mx-auto text-center">
        
        <div className="w-full space-y-8 animate-fade-in">
            
            {/* CHECKLIST VISUALIZER */}
            <div className="flex flex-col gap-2">
                {sections.map((s) => {
                    // Determine state
                    const isPassed = timeLeft <= s.range[0]; 
                    const isActive = timeLeft > s.range[0] && timeLeft <= s.range[1];
                    // Special case for exact 60 start
                    
                    return (
                        <div 
                            key={s.id}
                            className={`relative border rounded-2xl p-4 flex items-center justify-between transition-all duration-500 overflow-hidden
                                ${isActive ? `border-${s.bg.split('-')[1]}-500 bg-slate-900 scale-105 shadow-xl` : 'border-white/5 bg-white/5 opacity-60'}
                            `}
                        >
                            <div className={`absolute left-0 top-0 h-full w-1 ${s.bg}`} />
                            
                            <div className="text-left pl-4">
                                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${isActive ? s.color : 'text-slate-500'}`}>
                                    {s.label}
                                </div>
                                <div className="text-sm text-slate-300">
                                    {s.tip}
                                </div>
                            </div>

                            <div className={`text-2xl font-black tabular-nums opacity-50 ${s.color}`}>
                                {s.id === 'intro' ? '10s' : s.id === 'body' ? '40s' : '10s'}
                            </div>

                            {/* Active Indicator */}
                            {isActive && phase !== 'idle' && (
                                <div className={`absolute right-4 size-3 rounded-full ${s.bg} animate-pulse`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* MAIN TIMER DISPLAY */}
            <div className="py-8">
                <div className={`text-8xl md:text-9xl font-black font-mono tracking-tighter tabular-nums transition-colors duration-300 ${activeSection.color}`}>
                    {timeLeft}
                </div>
                <div className="text-slate-500 text-sm uppercase tracking-[0.3em] mt-2 font-bold">Segundos Restantes</div>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center justify-center gap-6">
                {phase === 'idle' ? (
                    <button 
                        onClick={startTimer}
                        className="size-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform group"
                    >
                        <span className="material-symbols-outlined text-4xl text-black">play_arrow</span>
                    </button>
                ) : (
                    <>
                        {phase !== 'completed' && (
                            <button 
                                onClick={togglePause}
                                className="size-16 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-2xl text-white">
                                    {phase === 'running' ? 'pause' : 'play_arrow'}
                                </span>
                            </button>
                        )}
                        
                        <button 
                            onClick={reset}
                            className={`size-16 rounded-full flex items-center justify-center transition-all ${
                                phase === 'completed' 
                                    ? 'bg-white shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-110' 
                                    : 'bg-slate-800 border border-white/10 hover:bg-slate-700'
                            }`}
                        >
                             <span className={`material-symbols-outlined text-2xl ${phase === 'completed' ? 'text-black' : 'text-white'}`}>
                                replay
                            </span>
                        </button>
                    </>
                )}
            </div>

        </div>

      </main>
    </div>
  );
}
