"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthoritativePausePage() {
  const router = useRouter();
  
  // States: idle, recording, won, lost
  const [phase, setPhase] = useState<"idle" | "recording" | "won" | "lost">("idle");
  const [timeLeft, setTimeLeft] = useState(15);
  const [silenceDuration, setSilenceDuration] = useState(0); // in ms
  const [maxSilenceAchieved, setMaxSilenceAchieved] = useState(0);
  const [volume, setVolume] = useState(0);
  
  // Refs for Audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const silenceStartRef = useRef<number | null>(null);
  const hasSpokenRef = useRef(false);

  const RECORD_TIME = 15;
  const TARGET_PAUSE_MS = 3000;
  const SILENCE_THRESHOLD = 0.02; // Volume threshold below which is considered silence

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;

        setPhase("recording");
        setTimeLeft(RECORD_TIME);
        setSilenceDuration(0);
        setMaxSilenceAchieved(0);
        hasSpokenRef.current = false;
        startTimeRef.current = Date.now();
        
        analyzeAudio();

    } catch (err) {
        console.error("Mic Error:", err);
        alert("Necesitamos acceso al micrófono para medir tus pausas.");
    }
  };

  const analyzeAudio = () => {
      if (!analyserRef.current) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calc Volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
      }
      const average = sum / bufferLength; // 0-255
      const normalizedVol = average / 255;
      setVolume(normalizedVol);

      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, RECORD_TIME - elapsed);
      setTimeLeft(remaining);

      // Check Game Over (Time Out)
      if (remaining <= 0) {
          stopAudio();
          setPhase("lost");
          return;
      }

      // Logic: Silence Detection
      if (normalizedVol < SILENCE_THRESHOLD) {
          // It is silent
          if (silenceStartRef.current === null) {
              silenceStartRef.current = now;
          }
          const currentSilence = now - silenceStartRef.current;
          setSilenceDuration(currentSilence);
          if (currentSilence > maxSilenceAchieved) setMaxSilenceAchieved(currentSilence);

          // Win Condition: 3s Silence AND User has spoken previously (to avoid just staying silent from start)
          // Actually, let's enforce speaking first? Or just allow starting with silence? 
          // Usually better to enforce 'hasSpoken'.
          if (currentSilence >= TARGET_PAUSE_MS && hasSpokenRef.current) {
              stopAudio();
              setPhase("won");
              return;
          }

      } else {
          // It is loud (Speaking)
          silenceStartRef.current = null;
          setSilenceDuration(0);
          hasSpokenRef.current = true;
      }

      requestRef.current = requestAnimationFrame(analyzeAudio);
  };

  const stopAudio = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
  };

  useEffect(() => {
      return () => stopAudio();
  }, []);

  const progressPct = Math.min(100, (silenceDuration / TARGET_PAUSE_MS) * 100);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-display flex flex-col relative overflow-hidden transition-colors duration-500">
        
       {/* Ambient */}
       <div className={`absolute inset-0 pointer-events-none transition-colors duration-1000 ${
           phase === 'won' ? 'bg-green-900/20' : 
           phase === 'lost' ? 'bg-red-900/20' : 
           'bg-indigo-900/10'
       }`} />

      {/* Header */}
      <div className="relative z-10 px-6 py-4 flex justify-between items-center">
         <Link href="/gym" onClick={stopAudio} className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
         </Link>
         <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="material-symbols-outlined text-sm text-indigo-400">timelapse</span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Ritmo</span>
         </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-lg mx-auto text-center">
        
        {phase === 'idle' && (
            <div className="space-y-8 animate-fade-in">
                <div className="size-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
                    <span className="material-symbols-outlined text-5xl text-indigo-400">graphic_eq</span>
                </div>
                <h1 className="text-4xl font-black text-white">Desafío de Pausa</h1>
                <p className="text-slate-400 text-lg max-w-xs mx-auto">
                    Tienes <strong>15 segundos</strong> para hablar.
                    <br/>
                    Debes meter una pausa de <strong>3 segundos</strong> en algún momento.
                </p>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 text-sm text-slate-500">
                    💡 Tip: Habla fuerte, luego... calla y sostén la mirada.
                </div>
                <button 
                    onClick={startRecording}
                    className="px-12 py-5 bg-white text-black font-black text-xl rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    EMPEZAR
                </button>
            </div>
        )}

        {phase === 'recording' && (
            <div className="w-full space-y-12">
                
                {/* Timer */}
                <div className="text-slate-500 font-mono text-sm uppercase tracking-widest font-bold">
                    Tiempo Restante
                </div>
                <div className="text-7xl font-black tabular-nums transition-colors duration-300 ${timeLeft < 5 ? 'text-red-500' : 'text-white'}">
                    {timeLeft.toFixed(1)}s
                </div>

                {/* VISUAL FEEDBACK */}
                <div className="relative h-64 flex items-center justify-center">
                    {/* Speaking Indicator */}
                    <div className={`absolute top-0 right-0 p-2 rounded-full ${volume > SILENCE_THRESHOLD ? 'bg-green-500 animate-pulse' : 'bg-slate-800'}`}>
                        <span className="material-symbols-outlined text-black text-xs">mic</span>
                    </div>

                    {/* Silence Progress Bar (Main Mechanic) */}
                    <div className="w-full max-w-xs space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-indigo-300">
                             <span>Silencio Actual</span>
                             <span>{silenceDuration > 0 ? (silenceDuration/1000).toFixed(1) + 's' : '-'}</span>
                        </div>
                        <div className="h-6 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10 relative">
                             {/* Target Marker at 3s */}
                             <div className="absolute top-0 bottom-0 left-[100%] w-0.5 bg-white z-10" /> 
                             
                             <div 
                                className="h-full bg-indigo-500 transition-all duration-100 ease-linear"
                                style={{ width: `${progressPct}%` }}
                             />
                        </div>
                        <p className="text-xs text-slate-500 pt-2">
                            {volume > SILENCE_THRESHOLD ? "🔊 Hablando (Calla para llenar la barra)" : "🤫 Silencio detectado..."}
                        </p>
                    </div>
                </div>
            </div>
        )}

        {phase === 'won' && (
            <div className="space-y-8 animate-fade-in-up">
                <div className="size-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                    <span className="material-symbols-outlined text-6xl text-black">check</span>
                </div>
                <h1 className="text-4xl font-black text-white">¡Pausa Maestra!</h1>
                <p className="text-slate-400 text-lg">
                    Dominaste el silencio por 3 segundos.
                    <br/>
                    Eso es autoridad.
                </p>
                 <button 
                    onClick={() => setPhase('idle')}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-full transition-all uppercase tracking-widest text-sm"
                >
                    Jugar de Nuevo
                </button>
            </div>
        )}

        {phase === 'lost' && (
             <div className="space-y-8 animate-fade-in-up">
                <div className="size-32 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(239,68,68,0.4)]">
                    <span className="material-symbols-outlined text-6xl text-black">close</span>
                </div>
                <h1 className="text-4xl font-black text-white">Tiempo Agotado</h1>
                <p className="text-slate-400 text-lg">
                    Hablaste demasiado o no te atreviste a pausas lo suficiente.
                    <br/>
                    El silencio se siente largo, pero es necesario.
                </p>
                 <button 
                    onClick={() => setPhase('idle')}
                    className="px-8 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform uppercase tracking-widest text-sm"
                >
                    Intentar de Nuevo
                </button>
            </div>
        )}

      </main>
    </div>
  );
}
