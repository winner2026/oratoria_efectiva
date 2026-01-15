"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AudioVisualizer from "@/components/AudioVisualizer";

export default function InstantPlaybackPage() {
  const [phase, setPhase] = useState<"IDLE" | "RECORDING" | "REVIEW">("IDLE");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const MAX_DURATION = 10;

  const startRecording = async () => {
    try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(audioStream);
        
        const mediaRecorder = new MediaRecorder(audioStream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            setPhase("REVIEW");
            if (timerRef.current) clearInterval(timerRef.current);
        };

        mediaRecorder.start();
        setPhase("RECORDING");
        setRecordingTime(0);

        // Timer for UI and Auto-Stop
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => {
                const nextTime = prev + 1;
                if (nextTime >= MAX_DURATION) {
                    stopRecording(); // Auto-stop limit exceeded
                    return MAX_DURATION;
                }
                return nextTime;
            });
        }, 1000);

    } catch (err) {
        console.error("Mic Error", err);
        alert("Necesitamos acceso al micrófono para que te escuches.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (stream) { 
        stream.getTracks().forEach(t => t.stop());
        setStream(null);
    }
  };

  const reset = () => {
    setPhase("IDLE");
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-display flex flex-col relative overflow-hidden">
        
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 px-6 py-4 flex justify-between items-center">
         <Link href="/gym" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Salir</span>
         </Link>
         <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="material-symbols-outlined text-sm text-emerald-400">hearing</span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Monitor de Retorno</span>
         </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-lg mx-auto text-center">
        
        {phase === "IDLE" && (
            <div className="animate-fade-in space-y-8">
                <div className="size-32 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-2xl">
                    <span className="material-symbols-outlined text-6xl text-slate-600">mic_none</span>
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white">Escúchate Realmente</h1>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                        La voz que oyes en tu cabeza NO es la que oyen los demás. Rompe la ilusión.
                    </p>
                </div>
                
                <button 
                   onClick={startRecording}
                   className="px-8 py-4 bg-white text-black font-black text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2 mx-auto"
                >
                    <span className="material-symbols-outlined text-red-500">fiber_manual_record</span>
                    GRABAR (5-10s)
                </button>
            </div>
        )}

        {phase === "RECORDING" && (
            <div className="animate-fade-in w-full flex flex-col items-center gap-8">
                
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                    <div className="size-40 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.4)] relative z-10">
                         {stream && <AudioVisualizer stream={stream} isActive={true} />} 
                    </div>
                </div>

                <div className="text-center">
                     <div className="text-6xl font-black font-mono tracking-tighter tabular-nums mb-2">
                         00:{recordingTime.toString().padStart(2, '0')}
                     </div>
                     <p className="text-red-400 font-bold uppercase tracking-widest text-xs animate-pulse">Grabando...</p>
                </div>

                <button 
                   onClick={stopRecording}
                   className="px-8 py-4 bg-slate-800 text-white font-black text-lg rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700 w-full"
                >
                    DETENER
                </button>
            </div>
        )}

        {phase === "REVIEW" && audioUrl && (
             <div className="animate-fade-in-up w-full space-y-8 bg-slate-900/50 p-8 rounded-3xl border border-white/5">
                
                <div className="flex items-center gap-2 mb-2 justify-center">
                    <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                        Audio Capturado
                    </h2>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                    <audio src={audioUrl} controls className="w-full custom-audio-player opacity-80 hover:opacity-100 transition-opacity" />
                </div>

                <div className="text-left space-y-4">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Checklist de Auditoría:</p>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex gap-2">
                            <span className="text-red-400">✖</span> ¿Sena nasal o de garganta? (Tensión)
                        </li>
                        <li className="flex gap-2">
                            <span className="text-yellow-400">✖</span> ¿Monótono/Aburrido? (Falta de Matices)
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-400">✖</span> ¿Demasiado rápido? (Ansiedad)
                        </li>
                    </ul>
                </div>

                <div className="flex gap-3 pt-4">
                    <button 
                       onClick={reset}
                       className="flex-1 py-4 bg-transparent border border-white/10 text-slate-400 font-bold rounded-xl hover:bg-white/5 hover:text-white transition-all text-sm uppercase tracking-wider"
                    >
                        Borrar
                    </button>
                    <button 
                        onClick={startRecording} // Re-record immediately
                        className="flex-1 py-4 bg-white text-black font-black rounded-xl hover:scale-[1.02] transition-transform text-sm uppercase tracking-wider shadow-lg"
                    >
                        Grabar de Nuevo
                    </button>
                </div>

             </div>
        )}

      </main>
    </div>
  );
}
