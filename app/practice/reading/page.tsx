"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AudioLevelMeter from "@/components/AudioLevelMeter";

const SPEECH_TEXT = `La oratoria no es solo hablar. Es el arte de influir. Cuando abres la boca, estás compitiendo por el recurso más valioso del mundo: la atención de los demás.
La mayoría de la gente habla para llenar el silencio. Los líderes hablan para crear un cambio.
Tu voz tiene textura, ritmo y melodía. Úsala con consciencia.
No corras. Saborea cada palabra. Deja que los silencios trabajen para ti.
Si logras que tu mensaje resuene, no solo serás escuchado. Serás recordado.`;

const WORDS = SPEECH_TEXT.replace(/\n/g, " ").split(" ").filter(w => w.length > 0);

export default function ReadingExercisePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(140);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);

  // Audio for visual feedback (optional)
  const [stream, setStream] = useState<MediaStream | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Request mic access for visualizer (Zero Cost)
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(s => setStream(s))
      .catch(err => console.error("Mic error", err));

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  const startReading = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setCurrentWordIndex(0);

    const intervalMs = (60 / wpm) * 1000;

    timerRef.current = setInterval(() => {
      setCurrentWordIndex(prev => {
        if (prev >= WORDS.length - 1) {
            stopReading(true);
            return prev;
        }
        return prev + 1;
      });
    }, intervalMs);
  };

  const stopReading = (finished = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setIsPlaying(false);
    if (finished) setIsFinished(true);
  };

  const reset = () => {
    stopReading();
    setCurrentWordIndex(-1);
    setIsFinished(false);
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
        
        {!isPlaying && !isFinished && (
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
                         Lee en voz alta siguiendo la palabra iluminada. <br/>
                         No te adelantes ni te atrases.
                     </p>
                 </div>

                 <button 
                   onClick={startReading}
                   className="w-full py-4 bg-white text-black font-black text-lg rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                 >
                     <span className="material-symbols-outlined">play_arrow</span>
                     COMENZAR LECTURA
                 </button>
            </div>
        )}

        {/* READING AREA */}
        {(isPlaying || isFinished) && (
            <div className="space-y-8 w-full">
                
                {/* Visualizer (Top) */}
                <div className="h-16 flex items-center justify-center opacity-50">
                    {stream && <AudioLevelMeter stream={stream} isActive={true} />}
                </div>

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

                {isFinished && (
                     <div className="text-center animate-fade-in-up mt-8">
                        <h3 className="text-2xl font-black text-green-400 mb-2">¡Sincronización Completa!</h3>
                        <p className="text-slate-400 mb-6">Has mantenido un ritmo de {wpm} palabras por minuto.</p>
                        
                        {/* [CORE Scan] Ingest on Render/Mount of result implies it happened. Better to do in effect or here once. */}
                        {(() => {
                           import("@/services/CoreDiagnosticService").then(({ CoreDiagnosticService }) => {
                              CoreDiagnosticService.getInstance().ingest({
                                  sourceExerciseId: 'sincronizacion-mental',
                                  layer: 'RITMO',
                                  metricType: 'WPM',
                                  value: wpm,
                                  rawUnit: 'wpm' // User followed this target
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
