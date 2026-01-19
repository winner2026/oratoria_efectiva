"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- CONFIG ---
const GAME_DURATION = 60; // seconds
const MAX_FILLERS = 3; // Game Over limit

// Lista Negra de Muletillas Comunes (Normalizadas)
const FILLER_WORDS = [
    "eh", "ehh", "ehhh",
    "este", "estee",
    "o sea", "osea",
    "tipo", 
    "digamos", 
    "básicamente",
    "literal",
    "bueno", "bueno pues",
    "mmm", "umm",
    "sabes", "¿sabes?"
];

export default function FillerKillerPage() {
  const router = useRouter();

  // Game State
  const [phase, setPhase] = useState<"intro" | "countdown" | "playing" | "result">("intro");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [fillerCount, setFillerCount] = useState(0);
  const [detectedFillers, setDetectedFillers] = useState<string[]>([]);
  const [lastDetected, setLastDetected] = useState<string | null>(null);
  
  // Audio / Speech
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const processedRef = useRef<number>(0); // To track word index processed

  useEffect(() => {
    // Cleanup
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const initSpeech = () => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "es-ES";
        
        recognition.onresult = (event: any) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
             interimTranscript += event.results[i][0].transcript;
          }
          analyzeSpeech(interimTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech Error", event.error);
        };
        
        recognitionRef.current = recognition;
      }
    }
  };

  const analyzeSpeech = (text: string) => {
      // Logic: 
      // We look for filler words in the NEW text.
      // Since 'interim' upgrades to 'final', detecting duplicates is tricky.
      // Strategy: Just check the LAST few words for immediate feedback.
      // Actually, let's use a simpler "sliding window" or "ends with" check for real-time trigger
      
      const normalized = text.toLowerCase();
      const words = normalized.split(/\s+/);
      const lastWord = words[words.length - 1]?.replace(/[.,?!]/g, "");
      
      if (!lastWord) return;

      // Check current word against blacklist
      if (FILLER_WORDS.includes(lastWord)) {
          // Debounce: Don't trigger if we just triggered for this same instance
          // We can't easily distinguish "eh... eh" from "eh" with just string matching on last word
          // without more complex index tracking.
          // For MVP: If 'lastDetected' is this word, ignore until word changes? 
          // Better: Require a clear buffer. 
          
          /*
            Enhanced Logic:
            We need a robust way to count. 
            Ideally, we process 'final' results for counting, and 'interim' for warning.
            But 'final' is slow.
            Let's rely on a primitive "Lock" mechanism.
          */
          
          const now = Date.now();
          if (lastDetected !== lastWord) {
             triggerFiller(lastWord);
          }
      } else {
          // If word changed to something valid, clear lastDetected so we can detect again
          setLastDetected(null);
      }
  };

  const triggerFiller = (word: string) => {
      setLastDetected(word);
      setFillerCount(prev => {
          const newCount = prev + 1;
          if (newCount >= MAX_FILLERS) {
              gameOver("¡Demasiadas Muletillas!");
          }
          return newCount;
      });
      setDetectedFillers(prev => [...prev, word]);
      
      // Haptic/Audio Feedback
      if (navigator.vibrate) navigator.vibrate(200);
      playErrorSound();
  };

  const playErrorSound = () => {
      const oscillator = new AudioContext().createOscillator();
      const context = new AudioContext();
      const o = context.createOscillator();
      const g = context.createGain();
      o.connect(g);
      g.connect(context.destination);
      o.type = "sawtooth";
      o.frequency.setValueAtTime(150, context.currentTime);
      g.gain.setValueAtTime(0.5, context.currentTime);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.3);
      o.stop(context.currentTime + 0.3);
  };

  const startGame = () => {
    initSpeech();
    setPhase("countdown");
    // Simple 3s countdown
    setTimeout(() => {
        setPhase("playing");
        startSession();
    }, 3000);
  };

  const startSession = () => {
      setFillerCount(0);
      setDetectedFillers([]);
      setTimeLeft(GAME_DURATION);
      setIsListening(true);
      
      if (recognitionRef.current) recognitionRef.current.start();

      timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
              if (prev <= 1) {
                  finishSuccess();
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
  };

  const gameOver = (reason: string) => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setPhase("result");
  };

  const finishSuccess = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setPhase("result");
  };

  const isSuccess = timeLeft === 0 && fillerCount < MAX_FILLERS;

  return (
    <div className={`min-h-screen font-display flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-200 ${
        lastDetected ? 'bg-red-900' : 'bg-slate-950'
    }`}>
        {/* FLASH EFFECT */}
        <div className={`absolute inset-0 bg-red-500 transition-opacity duration-100 pointer-events-none ${lastDetected ? 'opacity-20' : 'opacity-0'}`} />

        {/* HEADER */}
        <div className="absolute top-6 left-6 z-20">
             <Link href="/gym" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Salir</span>
             </Link>
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
            
            {phase === 'intro' && (
                <div className="space-y-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center size-24 rounded-full bg-red-500/10 text-red-500 mb-2 border border-red-500/20">
                        <span className="material-symbols-outlined text-5xl">cleaning_services</span>
                    </div>
                    <h1 className="text-4xl font-black text-white">Misión: Limpieza</h1>
                    <div className="space-y-4 text-slate-400">
                        <p>
                            Habla durante <strong className="text-white">60 segundos</strong> sobre cualquier tema.
                        </p>
                        <p>
                            El sistema detectará tus muletillas en tiempo real ("eh", "este", "o sea").
                        </p>
                        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-red-200 text-sm font-bold">
                            ⚠️ Límite: {MAX_FILLERS} errores
                        </div>
                    </div>
                    
                    <button 
                        onClick={startGame}
                        className="px-10 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        INICIAR DETECCIÓN
                    </button>
                    <p className="text-[10px] text-slate-600 font-mono mt-4 uppercase">Microphone Access Required</p>
                </div>
            )}

            {phase === 'countdown' && (
                <div className="animate-bounce">
                    <span className="text-9xl font-black text-white">PREAPARA...</span>
                </div>
            )}

            {phase === 'playing' && (
                <div className="space-y-12">
                     {/* LIVES / HEALTH */}
                     <div className="flex justify-center gap-2 mb-8">
                         {Array.from({ length: MAX_FILLERS }).map((_, i) => (
                             <div key={i} className={`size-4 rounded-full transition-all duration-300 ${
                                 i < (MAX_FILLERS - fillerCount) ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-900/50'
                             }`} />
                         ))}
                     </div>
                    
                     {/* MAIN FEEDBACK */}
                     <div>
                         <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Tema Libre</div>
                         <h2 className={`text-6xl font-black transition-all duration-100 ${lastDetected ? 'text-red-500 scale-110' : 'text-white'}`}>
                             {lastDetected ? `¡"${lastDetected.toUpperCase()}"!` : "..."}
                         </h2>
                         <p className="text-slate-500 mt-4 h-6">
                             {lastDetected ? "Muletilla Detectada" : "Escuchando..."}
                         </p>
                     </div>

                     {/* TIMER */}
                     <div className="relative size-32 mx-auto flex items-center justify-center border-4 border-slate-800 rounded-full">
                         <span className="text-4xl font-black text-white tabular-nums">{timeLeft}</span>
                         <svg className="absolute inset-0 size-full -rotate-90">
                             <circle 
                                cx="64" cy="64" r="62" stroke="currentColor" strokeWidth="4" 
                                className="text-blue-500 transition-all duration-1000 ease-linear"
                                strokeDasharray={389}
                                strokeDashoffset={389 * (1 - timeLeft/GAME_DURATION)}
                                fill="transparent"
                             />
                         </svg>
                     </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className={`size-32 rounded-full flex items-center justify-center mx-auto text-6xl shadow-2xl ${
                        isSuccess ? 'bg-green-500 text-black shadow-green-500/50' : 'bg-red-500 text-black shadow-red-500/50'
                    }`}>
                        <span className="material-symbols-outlined">
                            {isSuccess ? 'verified' : 'phonelink_erase'}
                        </span>
                    </div>

                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">
                            {isSuccess ? "ORATORIA LIMPIA" : "MISIÓN FALLIDA"}
                        </h2>
                        <p className={`text-lg font-medium ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                            {isSuccess 
                                ? "Has demostrado un control mental superior." 
                                : `El vicio "${detectedFillers[detectedFillers.length-1]}" te ha eliminado.`}
                        </p>
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10">
                        <div className="grid grid-cols-2 gap-8 text-center">
                            <div>
                                <span className="block text-3xl font-black text-white">{fillerCount}</span>
                                <span className="text-[10px] uppercase text-slate-500 font-bold">Muletillas</span>
                            </div>
                            <div>
                                <span className="block text-3xl font-black text-white">{GAME_DURATION - timeLeft}s</span>
                                <span className="text-[10px] uppercase text-slate-500 font-bold">Sobrevivido</span>
                            </div>
                        </div>
                        {detectedFillers.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <p className="text-xs text-slate-500 mb-2">HISTORIAL DE CRIMEN</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {detectedFillers.map((w, i) => (
                                        <span key={i} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-md">
                                            {w}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                         onClick={() => window.location.reload()}
                         className="w-full py-4 bg-white text-black font-black rounded-xl hover:scale-[1.02] transition-transform"
                    >
                        INTENTAR DE NUEVO
                    </button>
                </div>
            )}

        </div>
    </div>
  );
}
