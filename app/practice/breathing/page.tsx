"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AudioVisualizer from "@/components/AudioVisualizer";

function BreathingContent() {
  const router = useRouter();
  
  // Estados del ejercicio
  const [phase, setPhase] = useState<"intro" | "countdown" | "recording" | "results">("intro");
  const [countdownVal, setCountdownVal] = useState(5);
  const [seconds, setSeconds] = useState(0);

  // SOS LOGIC
  const searchParams = useSearchParams();
  const isSOS = searchParams.get('mode') === 'sos';
  const [sosPhase, setSosPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [sosCount, setSosCount] = useState(4);

  useEffect(() => {
    if (!isSOS) return;
    const interval = setInterval(() => {
        setSosCount(prev => {
            if (prev > 1) return prev - 1;
            setSosPhase(p => p === 'inhale' ? 'hold' : p === 'hold' ? 'exhale' : 'inhale');
            return 4; 
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSOS]);
  const [isActive, setIsActive] = useState(false);
  const [stabilityScore, setStabilityScore] = useState(100);
  const [volume, setVolume] = useState(0);
  const [feedback, setFeedback] = useState<"stable" | "shaky" | "quiet">("quiet");
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Refs para Audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Refs para Algoritmo
  const volumeHistoryRef = useRef<number[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Constantes
  const MIN_VOLUME_THRESHOLD = 2; // Bajar umbral para detectar exhalaciones suaves
  const GOAL_TIME = 20;     // Meta de segundos
  const GOAL_STABILITY = 80; // Meta de estabilidad

  useEffect(() => {
    // Cleanup al desmontar
    return () => {
      stopExerciseCleanup();
    };
  }, []);

  const startExercise = async () => {
    // Asegurar limpieza previa
     stopExerciseCleanup();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setStream(stream);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // START COUNTDOWN
      setPhase("countdown");
      setCountdownVal(5);
      
      let count = 5;
      const interval = setInterval(() => {
          count--;
          setCountdownVal(count);
          if (count <= 0) {
              clearInterval(interval);
              setPhase("recording");
              setIsActive(false);
              setSeconds(0);
              setStabilityScore(100);
              volumeHistoryRef.current = [];
              audioChunksRef.current = [];
              startTimeRef.current = null;

              // 🎙️ INICIAR GRABACIÓN REAL
              if (mediaStreamRef.current) {
                  try {
                      const recorder = new MediaRecorder(mediaStreamRef.current);
                      recorder.ondataavailable = (e) => {
                          if (e.data.size > 0) audioChunksRef.current.push(e.data);
                      };
                      recorder.onstop = () => {
                          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                          setAudioBlob(blob);
                      };
                      recorder.start();
                      mediaRecorderRef.current = recorder;
                  } catch (e) {
                      console.error("No se pudo iniciar grabadora:", e);
                  }
              }

              analyzeLoop();
          }
      }, 1000);
      
    } catch (err) {
      console.error("Error micrófono:", err);
      alert("Error al acceder al micrófono. Por favor recarga la página.");
    }
  };

  const stopExerciseCleanup = () => {
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
    }
    setStream(null);
    if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  const stopExercise = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
    }
    stopExerciseCleanup();
    setPhase("results");
  };

  const analyzeLoop = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const avgVolume = sum / dataArray.length;
    setVolume(avgVolume);
    
    if (avgVolume > MIN_VOLUME_THRESHOLD) {
        if (!startTimeRef.current) {
            startTimeRef.current = Date.now();
            setIsActive(true);
        }
        
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setSeconds(Number(elapsed.toFixed(1)));
        
        const history = volumeHistoryRef.current;
        history.push(avgVolume);
        if (history.length > 30) history.shift();

        if (history.length > 5) {
            const localMean = history.reduce((a,b) => a+b, 0) / history.length;
            const variance = history.reduce((a,b) => a + Math.pow(b - localMean, 2), 0) / history.length;
            const stdDev = Math.sqrt(variance);

            if (stdDev < 3) {
                 setFeedback("stable");
                 setStabilityScore(prev => Math.min(100, prev + 0.05));
            } else if (stdDev < 8) {
                 setFeedback("shaky");
                 setStabilityScore(prev => Math.max(0, prev - 0.1));
            } else {
                 setFeedback("shaky");
                 setStabilityScore(prev => Math.max(0, prev - 0.3));
            }
        }
        
    } else {
        if (startTimeRef.current && (Date.now() - startTimeRef.current) > 500) {
             stopExercise();
             return; 
        }
    }
    
    animationFrameRef.current = requestAnimationFrame(analyzeLoop);
  };

  const isSuccess = seconds >= GOAL_TIME && stabilityScore >= GOAL_STABILITY;

  const getLevel = (secs: number) => {
      if (secs >= 30) return { name: "LEGENDARIO (MASTER)", color: "text-purple-400", bg: "bg-purple-500" };
      if (secs >= 20) return { name: "ORADOR SÓLIDO", color: "text-green-400", bg: "bg-green-500" };
      if (secs >= 15) return { name: "ACEPTABLE", color: "text-yellow-400", bg: "bg-yellow-500" };
      return { name: "INSUFICIENTE", color: "text-red-400", bg: "bg-red-500" };
  };

  // 🚑 RENDER SOS MODE (BOX BREATHING)
  if (isSOS) {
     return (
        <div className="min-h-[100dvh] bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-display">
            <div className="absolute inset-0 pointer-events-none">
                 <div className={`absolute inset-0 bg-blue-500/10 transition-transform duration-[4000ms] ease-linear ${sosPhase === 'inhale' ? 'scale-110' : 'scale-100'}`} />
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-blue-500/20 blur-[100px] transition-all duration-[4000ms] ${sosPhase === 'inhale' ? 'scale-150 opacity-100' : sosPhase === 'exhale' ? 'scale-50 opacity-50' : 'scale-100 opacity-80'}`} />
            </div>

            <div className="relative z-10 text-center space-y-12 animate-fade-in p-6">
                <div className="space-y-4">
                    <p className="text-sm text-blue-400 font-bold uppercase tracking-[0.3em] font-mono">Protocolo Anti-Pánico</p>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter transition-all duration-500">
                        {sosPhase === 'inhale' ? 'INHALE' : sosPhase === 'hold' ? 'HOLD' : 'EXHALE'}
                    </h1>
                </div>

                <div className="text-[8rem] md:text-[12rem] font-black leading-none tabular-nums opacity-90 select-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 font-sans">
                    {sosCount}
                </div>

                <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
                    {sosPhase === 'inhale' ? 'Llena tus pulmones lentamente.' : sosPhase === 'hold' ? 'Mantén el aire y la calma.' : 'Suelta todo el estrés.'}
                </p>

                <button 
                  onClick={() => router.push('/gym')}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold transition-all text-slate-300 hover:text-white uppercase tracking-widest mt-8"
                >
                    Salir del Modo Pánico
                </button>
            </div>
        </div>
     );
  }

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white font-display flex flex-col relative">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-900/10 blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-purple-900/10 blur-[100px]" />
      </div>

      <div className="relative z-10 px-6 py-4 flex justify-between items-center">
         <Link href="/gym" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Salir</span>
         </Link>
         <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="material-symbols-outlined text-sm text-blue-400">air</span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Soporte SSSS</span>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center mobile-container py-6 text-center relative z-10">
         
         {phase === "intro" && (
             <div className="max-w-md animate-fade-in space-y-8">
                 <div className="text-center space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full bg-blue-500/10">
                        Objetivo del Día
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
                        Control de Aire
                    </h1>
                 </div>

                 {/* GOAL CARD */}
                 <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6 rounded-3xl flex items-center justify-center gap-8 shadow-2xl">
                    <div className="text-center">
                        <span className="block text-3xl font-black text-white">{GOAL_TIME}s</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest">Duración Mín</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                     <div className="text-center">
                        <span className="block text-3xl font-black text-white">{GOAL_STABILITY}%</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest">Estabilidad Mín</span>
                    </div>
                 </div>

                 <p className="text-slate-400 text-sm leading-relaxed px-4">
                     Inhala profundo y emite un "Sssss" constante. <br/>
                     <span className="text-white font-bold">Si tiemblas o cortas antes, fallarás.</span>
                 </p>

                 <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-left space-y-2 mx-2">
                     <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
                         <span className="material-symbols-outlined text-sm">mic</span>
                         ¿Para qué usamos el micrófono?
                     </div>
                     <p className="text-[11px] text-slate-400 leading-relaxed">
                         Para darte <strong>feedback visual</strong> de tu exhalación ("Sssss"). El sistema detecta si tu aire es estable o tembloroso en tiempo real.
                         <span className="block mt-1.5 text-blue-400/60 font-medium">🔒 No se graba ni se sube tu voz. Análisis 100% local.</span>
                     </p>
                 </div>

                 <button 
                   onClick={startExercise}
                   className="w-full py-4 bg-white text-black font-black text-lg rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                 >
                     COMENZAR EJERCICIO
                 </button>
             </div>
         )}

          {phase === "countdown" && (
             <div className="flex flex-col items-center justify-center min-h-[50vh] animate-bounce-in">
                 <div className="text-xl text-blue-400 font-bold uppercase tracking-widest mb-4">Prepárate</div>
                 <div className="text-9xl font-black text-white drop-shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                     {countdownVal}
                 </div>
                 <p className="text-slate-400 mt-4">Inhala profundo...</p>
             </div>
          )}

          {phase === "recording" && (
             <div className="w-full max-w-lg flex-1 flex flex-col items-center justify-evenly py-4 min-h-[400px]">
                 
                 <div className="relative size-40 sm:size-56 md:size-64 flex items-center justify-center shrink-0 my-4">
                     <div 
                        className={`absolute inset-0 rounded-full transition-all duration-100 ${isActive ? 'opacity-100' : 'opacity-20'}`}
                        style={{
                            transform: `scale(${1 + (volume / 100)})`,
                            background: isActive 
                                ? (feedback === 'shaky' ? 'radial-gradient(circle, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0) 70%)' : 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(59,130,246,0) 70%)')
                                : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)'
                        }}
                     />
                     <div className="relative z-10 text-center">
                         <span className="text-4xl sm:text-6xl md:text-7xl font-black font-mono tracking-tighter tabular-nums text-white drop-shadow-2xl">
                             {seconds.toFixed(1)}
                         </span>
                         <span className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 mt-1 sm:mt-2">
                             Segundos
                         </span>
                     </div>
                 </div>

                 <div className="text-center space-y-2 h-12 sm:h-16 shrink-0 flex flex-col justify-center">
                     {!isActive ? (
                         <p className="text-base sm:text-xl text-slate-400 animate-pulse px-4">
                             Estoy escuchando... Haz "Sssss"
                         </p>
                     ) : (
                         <div className="space-y-1">
                             <div className={`text-xl sm:text-2xl font-bold transition-colors ${
                                 feedback === "stable" ? "text-green-400" : "text-orange-400 animate-pulse"
                             }`}>
                                 {feedback === "stable" ? "ESTABLE ✨" : "INESTABLE ⚠️"}
                             </div>
                             <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest">
                                 {sensitivityFeedback(feedback)}
                             </p>
                         </div>
                     )}
                 </div>

                 <div className="w-full max-w-[200px] sm:max-w-xs h-12 sm:h-20 flex items-center justify-center shrink-0">
                    {stream && <AudioVisualizer stream={stream} isActive={true} />}
                 </div>

                 {volume > 1 && volume < MIN_VOLUME_THRESHOLD && !isActive && (
                    <p className="text-[10px] text-orange-400 animate-pulse absolute bottom-20">¡Acerca el micrófono!</p>
                 )}

                 <button 
                    onClick={stopExercise}
                    className="px-8 py-3 rounded-full bg-white/10 border border-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-all text-xs sm:text-sm font-bold uppercase tracking-widest shrink-0 mt-2"
                 >
                     Terminar
                 </button>
             </div>
         )}

         {phase === "results" && (
             <div className="max-w-md w-full animate-fade-in-up">
                 
                 <div className="flex justify-center mb-6">
                     <div className={`size-20 rounded-full flex items-center justify-center text-4xl shadow-xl ${isSuccess ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-red-500 text-white shadow-red-500/30'}`}>
                         <span className="material-symbols-outlined text-5xl">
                             {isSuccess ? 'check' : 'close'}
                         </span>
                     </div>
                 </div>

                  <div className="text-center mb-8">
                      <div className={`text-xl font-black mb-2 ${getLevel(seconds).color}`}>
                          {getLevel(seconds).name}
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">
                          {isSuccess ? "OBJETIVO SUPERADO" : "INTENTO FINALIZADO"} 
                      </h2>
                      <p className="text-slate-400 text-sm">
                          {seconds >= 30 
                             ? "¡Increíble! Tienes pulmones de cantante de ópera."
                             : seconds >= 20
                             ? "¡Muy bien! Tienes el aire suficiente para oratoria."
                             : seconds >= 15
                             ? "Casi. Un poco más de práctica y llegarás al nivel ideal."
                             : "Te falta aire. Necesitas practicar respiración diafragmática."
                          }
                      </p>
                  </div>

                 <div className="grid grid-cols-2 gap-4 mb-8">
                     {/* Tiempo Card */}
                     <div className={`border p-4 rounded-2xl text-center relative overflow-hidden ${seconds >= GOAL_TIME ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                         <span className={`block text-2xl font-bold mb-1 ${seconds >= GOAL_TIME ? 'text-green-400' : 'text-red-400'}`}>
                             {seconds.toFixed(1)}s
                         </span>
                         <span className="text-[10px] text-slate-400 uppercase tracking-wider">Duración</span>
                         <span className="block text-[9px] mt-1 opacity-50">Meta: {GOAL_TIME}s</span>
                     </div>
                     
                     {/* Estabilidad Card */}
                     <div className={`border p-4 rounded-2xl text-center relative overflow-hidden ${stabilityScore >= GOAL_STABILITY ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                         <span className={`block text-2xl font-bold mb-1 ${stabilityScore >= GOAL_STABILITY ? 'text-green-400' : 'text-red-400'}`}>
                             {Math.round(stabilityScore)}%
                         </span>
                         <span className="text-[10px] text-slate-400 uppercase tracking-wider">Estabilidad</span>
                         <span className="block text-[9px] mt-1 opacity-50">Meta: {GOAL_STABILITY}%</span>
                     </div>
                 </div>

                 {/* 🎧 REPRODUCCIÓN DE PRUEBA */}
                 {audioBlob && (
                     <div className="mb-6 bg-slate-900/50 p-4 rounded-2xl border border-white/5 animate-fade-in">
                         <div className="flex items-center gap-2 mb-2">
                             <span className="material-symbols-outlined text-blue-400 text-sm">headphones</span>
                             <span className="text-xs text-slate-400 uppercase tracking-widest">Escucha tu Estabilidad</span>
                         </div>
                         <audio controls src={URL.createObjectURL(audioBlob)} className="w-full h-8 opacity-80 hover:opacity-100 transition-opacity" />
                     </div>
                 )}

                 <div className="space-y-4">
                    <button 
                       onClick={() => setPhase("intro")}
                       className={`w-full py-4 text-black font-black text-lg rounded-2xl hover:scale-[1.02] transition-transform shadow-lg flex items-center justify-center gap-2 ${
                           isSuccess ? 'bg-white shadow-white/20' : 'bg-white shadow-white/10'
                       }`}
                     >
                         <span className="material-symbols-outlined">replay</span>
                         INTENTAR DE NUEVO
                     </button>
                     
                     <Link href="/gym" className="block w-full py-4 bg-transparent border border-white/10 text-slate-300 font-bold rounded-2xl hover:bg-white/5 transition-all">
                         VOLVER AL GIMNASIO
                     </Link>
                 </div>
             </div>
         )}
         
      </div>
    </div>
  );
}

function sensitivityFeedback(feedback: string) {
    if (feedback === 'quiet') return "Sopla un poco más fuerte";
    if (feedback === 'shaky') return "¡Controla el temblor!";
    return "Mantén esa presión";
}

export default function BreathingPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }>
      <BreathingContent />
    </Suspense>
  );
}
