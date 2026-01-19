"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AudioLevelMeter from "@/components/AudioLevelMeter";
import { usePitchDetector } from "@/hooks/usePitchDetector";

const SPEECH_TEXT = `La oratoria no es solo hablar. Es el arte de influir. Cuando abres la boca, estás compitiendo por el recurso más valioso del mundo: la atención de los demás.
La mayoría de la gente habla para llenar el silencio. Los líderes hablan para crear un cambio.
Tu voz tiene textura, ritmo y melodía. Úsala con consciencia.
No corras. Saborea cada palabra. Deja que los silencios trabajen para ti.
Si logras que tu mensaje resuene, no solo serás escuchado. Serás recordado.`;

const WORDS = SPEECH_TEXT.replace(/\n/g, " ").split(" ").filter(w => w.length > 0);

export default function ReadingExercisePage() {
  const { isListening, startListening, stopListening, volume } = usePitchDetector(); // Use consistent hook
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(140);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);
  const [failReason, setFailReason] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceCounterRef = useRef(0);
  const volumeRef = useRef(0);

  // Auto-stop on component unmount
  useEffect(() => {
    return () => {
        stopReading();
    };
  }, []);
  
  // Volume ref sync
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  // Main Logic Loop
  useEffect(() => {
      if (isPlaying) {
          const intervalMs = (60 / wpm) * 1000;
          timerRef.current = setInterval(() => {
              
              setCurrentWordIndex(prev => {
                  if (prev >= WORDS.length - 1) {
                      stopReading(true);
                      return prev;
                  }
                  return prev + 1;
              });

              if (currentWordIndex > 3) {
                  // Volume Threshold: 5 (processed 0-100 scale from hook)
                  if (volumeRef.current < 5) {
                       silenceCounterRef.current += 1;
                  } else {
                       silenceCounterRef.current = 0; 
                  }

                  // 6 ticks * (60/140)s = 6 * 0.42s = 2.5s of silence roughly
                  if (silenceCounterRef.current > 6) {
                      setFailReason("lost_flow");
                      stopReading(false); 
                  }
              }

          }, intervalMs);

          return () => clearInterval(timerRef.current!);
      }
  }, [isPlaying, wpm, currentWordIndex]); 

  const startReading = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setFailReason(null);
    setCurrentWordIndex(0);
    silenceCounterRef.current = 0;
    startListening();
  };

  const stopReading = (finished = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setIsPlaying(false);
    stopListening();
    if (finished) setIsFinished(true);
  };

  const reset = () => {
    stopReading();
    setCurrentWordIndex(-1);
    setIsFinished(false);
    setFailReason(null);
  };

  const getWpmLabel = (val: number) => {
    if (val < 130) return "Lento (Didáctico)";
    if (val < 160) return "Normal (Conversacional)";
    return "Rápido (Energético)";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-display flex flex-col relative overflow-hidden">
        
       {/* Background Aesthetics */}
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-1/2 bg-blue-900/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-purple-900/10 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4 flex justify-between items-center">
         <Link href="/gym" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Salir</span>
         </Link>
         <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="material-symbols-outlined text-sm text-blue-400">speed</span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Lectura Cronometrada</span>
         </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 max-w-3xl mx-auto w-full">
        
        {!isPlaying && !isFinished && !failReason && (
            <div className="w-full mb-8 animate-fade-in">
                 <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl mb-8 text-center">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                        Velocidad Objetivo
                    </label>
                    <div className="flex items-center justify-center gap-4">
                        <input 
                            type="range" 
                            min="100" 
                            max="200" 
                            step="10" 
                            value={wpm} 
                            onChange={(e) => setWpm(Number(e.target.value))}
                            className="w-full max-w-xs accent-blue-500"
                        />
                        <span className="text-2xl font-black tabular-nums text-white w-20">{wpm}</span>
                    </div>
                    <p className="text-xs text-blue-400 font-bold mt-2 uppercase tracking-wide">
                        {getWpmLabel(wpm)}
                    </p>
                 </div>

                 <div className="text-center space-y-2 mb-8">
                     <h1 className="text-3xl font-black text-white">Sincronización Mental</h1>
                     <p className="text-slate-400 text-sm">
                         Lee en voz alta sin detenerte. <br/>
                         Si haces silencio por más de 1.5s, perderás.
                     </p>
                 </div>

                 <button 
                   onClick={startReading}
                   className="w-full py-4 bg-white text-black font-black text-lg rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                 >
                     <span className="material-symbols-outlined">play_arrow</span>
                     COMENZAR DESAFÍO
                 </button>
            </div>
        )}

        {/* READING AREA */}
        {(isPlaying || isFinished || failReason) && (
            <div className="space-y-8 w-full">
                
                {/* Volume Bar (Visualizer Replacement) */}
                <div className="h-2 w-48 mx-auto bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-75 ${volume > 5 ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${Math.min(100, volume * 3)}%` }} // Visual scaling
                    />
                </div>

                {!failReason && (
                    <div 
                        className="text-2xl md:text-4xl font-serif leading-relaxed text-center px-4"
                        style={{ lineHeight: '1.6' }}
                    >
                        {WORDS.map((word, idx) => {
                            const isCurrent = idx === currentWordIndex;
                            const isPast = idx < currentWordIndex;
                            
                            return (
                                <span 
                                    key={idx} 
                                    className={`inline-block mr-2 transition-colors duration-200 ${
                                        isCurrent ? 'text-white scale-110 font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transform' : 
                                        isPast ? 'text-slate-600' : 
                                        'text-slate-500 blur-[0.5px]'
                                    }`}
                                >
                                    {word}
                                </span>
                            );
                        })}
                    </div>
                )}

                {failReason && (
                    <div className="text-center animate-bounce-in">
                        <div className="text-6xl mb-4">🔇</div>
                        <h2 className="text-3xl font-black text-red-500 mb-2">¡FLUJO PERDIDO!</h2>
                        <p className="text-slate-400 mb-6">Te quedaste en silencio. Debes mantener el ritmo.</p>
                        <button 
                           onClick={reset}
                           className="px-8 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-xl transition-colors border border-red-500/30"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {isFinished && (
                     <div className="text-center animate-fade-in-up mt-8">
                        <h3 className="text-2xl font-black text-green-400 mb-2">¡Sincronización Completa!</h3>
                        <p className="text-slate-400 mb-6">Has mantenido el flujo a {wpm} palabras por minuto.</p>
                        
                        {(() => {
                           import("@/services/CoreDiagnosticService").then(({ CoreDiagnosticService }) => {
                               CoreDiagnosticService.getInstance().ingest({
                                   sourceExerciseId: 'sincronizacion-mental',
                                   layer: 'RITMO',
                                   metricType: 'WPM',
                                   value: wpm,
                                   rawUnit: 'wpm'
                               });
                           });
                           return null;
                        })()}

                        <button 
                           onClick={reset}
                           className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                        >
                            Volver a Intentar
                        </button>
                     </div>
                )}

                 {isPlaying && (
                     <div className="flex justify-center mt-12">
                         <button 
                           onClick={() => stopReading(false)}
                           className="size-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        >
                             <span className="material-symbols-outlined text-3xl">stop</span>
                         </button>
                     </div>
                 )}
            </div>
        )}

      </main>
    </div>
  );
}
