"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- TOPICS DATABASE ---
const TOPICS = [
    "Elefantes", "La Pizza con Piña", "El Futuro de la IA", "Mis Zapatos", 
    "Un Viaje a Marte", "Por qué el Café es Vida", "Si fuera millonario...",
    "Los Gatos vs Perros", "La Playa Perfecta", "Mi Superpoder Oculto",
    "El Tráfico en la Ciudad", "Comida Picante", "Zombies", "La Lluvia",
    "Aliens", "Redes Sociales", "El Lunes por la Mañana", "Dinosaurios",
    "Helado de Vainilla", "Películas de Terror", "Volar", "Submarinos",
    "El Silencio", "La Música", "Bicicletas", "Videojuegos",
    "Libros", "Mentiras Piadosas", "Fantasmas", "El Universo"
];

export default function ImprovisationPage() {
  const router = useRouter();
  
  // Game State
  const [phase, setPhase] = useState<"intro" | "countdown" | "speaking" | "result">("intro");
  const [topic, setTopic] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [silencePanic, setSilencePanic] = useState(0); // 0 to 100%
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Logic Refs
  const silenceTimeRef = useRef(0); // ms of current silence
  const maxSilenceAllowed = 3000; // 3 seconds max silence
  
  useEffect(() => {
     return () => stopAudio();
  }, []);

  const getRandomTopic = () => {
      const idx = Math.floor(Math.random() * TOPICS.length);
      setTopic(TOPICS[idx]);
  };

  const startAudio = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const microphone = audioContext.createMediaStreamSource(stream);
        microphoneRef.current = microphone;
        microphone.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;

        setIsListening(true);
        analyzeLoop();

    } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Necesitamos acceso al micrófono para detectar si te quedas callado.");
    }
  };

  const stopAudio = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (microphoneRef.current) microphoneRef.current.disconnect();
    if (analyserRef.current) analyserRef.current.disconnect();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsListening(false);
  };

  const analyzeLoop = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
      
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
      }
      const avg = sum / dataArrayRef.current.length;
      setVolume(avg);

      // Silence Logic
      // Threshold: 8 (adjust based on sensitivity, usually ~5-10 is background noise)
      if (avg < 8) {
          silenceTimeRef.current += 16; // approx 60fps frame time
      } else {
          silenceTimeRef.current = Math.max(0, silenceTimeRef.current - 50); // Recover quickly if speaking
      }

      const panic = Math.min(100, (silenceTimeRef.current / maxSilenceAllowed) * 100);
      setSilencePanic(panic);

      if (silenceTimeRef.current >= maxSilenceAllowed) {
          gameOver("¡Silencio Incómodo Detectado!");
          return; // Stop loop
      }

      animationFrameRef.current = requestAnimationFrame(analyzeLoop);
  };

  const startGame = () => {
      getRandomTopic();
      setPhase("countdown");
      // Countdown animation handled visually, logic simpler
      let count = 5;
      setFeedback("5");
      
      startAudio().then(() => {
          const interval = setInterval(() => {
              count--;
              if (count > 0) setFeedback(count.toString());
              else {
                  clearInterval(interval);
                  beginSession();
              }
          }, 1000);
      });
  };

  const beginSession = () => {
      setPhase("speaking");
      setTimeLeft(60);
      setScore(0);
      silenceTimeRef.current = 0;
      setFeedback("");
      
      const timer = setInterval(() => {
          setTimeLeft(prev => {
              if (prev <= 1) {
                  clearInterval(timer);
                  finishSuccess();
                  return 0;
              }
              setScore(s => s + 1); // Score = seconds survived
              return prev - 1;
          });
      }, 1000);
      
      // Store timer ID if we need to clear it on fail? 
      // Simplified: We rely on phase check in useEffect or fail function
      // Actually, better to use a ref for the interval to clear it on fail.
      (window as any).gameTimer = timer;
  };

  const gameOver = (reason: string) => {
      clearInterval((window as any).gameTimer);
      stopAudio();
      setIsSuccess(false);
      setFeedback(reason);
      setPhase("result");
  };

  const finishSuccess = () => {
      clearInterval((window as any).gameTimer);
      stopAudio();
      setIsSuccess(true);
      setScore(60);
      setFeedback("¡Misión Cumplida!");
      setPhase("result");
  };

  return (
    <div className={`min-h-screen font-display flex flex-col items-center justify-center p-6 relative overflow-x-hidden transition-colors duration-500 ${
        phase === 'speaking' && silencePanic > 50 ? 'bg-red-950' : 'bg-slate-950'
    }`}>
        
        {/* Background Ambient */}
        <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950 to-slate-950 opacity-40" />
        </div>

        {/* Header UI */}
        <div className="absolute top-6 left-6 z-20">
             <Link href="/gym" onClick={stopAudio} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Salir</span>
             </Link>
        </div>

        <div className="relative z-10 w-full mobile-container text-center">
            
            {phase === 'intro' && (
                <div className="space-y-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center size-20 rounded-3xl bg-amber-500/20 text-amber-500 mb-4 ring-1 ring-amber-500/50">
                        <span className="material-symbols-outlined text-4xl">timer</span>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2">Minuto de Oro</h1>
                    <p className="text-slate-400 max-w-xs mx-auto">
                        Te daré un tema aleatorio. Tienes que hablar 60 segundos sobre él. 
                        <br/><br/>
                        <strong className="text-red-400">Regla:</strong> Si te callas más de 3 segundos, pierdes.
                    </p>
                    <button 
                        onClick={startGame}
                        className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
                    >
                        DESAFÍO ALEATORIO
                    </button>
                    <div className="text-xs text-slate-600 font-mono mt-4">Microphone Access Required</div>
                </div>
            )}

            {phase === 'countdown' && (
                <div className="animate-bounce-in">
                    <p className="text-sm text-slate-400 uppercase tracking-widest mb-4">El tema es...</p>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight px-4">{topic}</h2>
                    <div className="text-7xl md:text-9xl font-black text-amber-500">{feedback}</div>
                </div>
            )}

            {phase === 'speaking' && (
                <div className="space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                        {/* Panic Bar Background */}
                        <div 
                            className="absolute bottom-0 left-0 w-full bg-red-500/20 transition-all duration-100 ease-linear pointer-events-none"
                            style={{ height: `${silencePanic}%` }}
                        />
                        
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 relative z-10">Tu Tema</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-8 relative z-10 leading-tight">
                            "{topic}"
                        </h2>

                        <div className="relative z-10 flex flex-col items-center">
                            <span className="text-6xl font-black font-mono text-white tabular-nums tracking-tighter">
                                {timeLeft}<span className="text-2xl text-slate-500">s</span>
                            </span>
                            <span className="text-xs font-bold uppercase text-slate-500 mt-2 tracking-widest">
                                Tiempo Restante
                            </span>
                        </div>
                    </div>

                    <div className="h-16 flex items-center justify-center gap-1">
                        {/* Simple Visualizer */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div 
                                key={i}
                                className={`w-3 rounded-full transition-all duration-75 ${
                                    volume > (i * 10) + 10 ? 'bg-amber-400 h-10' : 'bg-slate-800 h-4'
                                }`}
                            />
                        ))}
                    </div>

                    <p className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                        silencePanic > 50 ? 'text-red-500 animate-pulse' : 'text-slate-600'
                    }`}>
                        {silencePanic > 0 ? "¡NO TE CALLES!" : "Escuchando..."}
                    </p>
                </div>
            )}

            {phase === 'result' && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className={`text-6xl ${isSuccess ? 'animate-bounce' : ''}`}>
                        {isSuccess ? '🏆' : '💀'}
                    </div>
                    
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2">
                            {isSuccess ? "¡OBJETIVO COMPLETADO!" : "GAME OVER"}
                        </h2>
                        <p className={`text-lg font-medium ${isSuccess ? 'text-amber-400' : 'text-red-400'}`}>
                            {feedback}
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 max-w-xs mx-auto">
                        <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Sobreviviste</div>
                        <div className="text-4xl font-black text-white">{score} <span className="text-lg text-slate-500">segundos</span></div>
                    </div>

                    <button 
                        onClick={startGame}
                        className="w-full py-4 bg-white text-black font-black rounded-xl hover:scale-[1.02] transition-transform"
                    >
                        INTENTAR OTRO TEMA
                    </button>
                    
                    <button 
                        onClick={() => setPhase('intro')}
                        className="block w-full text-sm text-slate-500 hover:text-white mt-4 font-bold"
                    >
                        VOLVER AL MENÚ
                    </button>
                </div>
            )}

        </div>
    </div>
  );
}
