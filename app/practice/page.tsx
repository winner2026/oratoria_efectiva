"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { getOrCreateAnonymousUserId } from "@/lib/anonymousUser";
import { logEvent } from "@/lib/events/logEvent";

// 🎯 CONTROL DE ABANDONO TEMPRANO
const MIN_RECORDING_DURATION = 3; // segundos
const EARLY_ABANDONMENT_THRESHOLD = 5; // segundos

// 💰 CONTROL DE COSTOS - Límite máximo de grabación
const MAX_RECORDING_DURATION = 60; // segundos (límite de Whisper)

export default function PracticePage() {
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number | null>(null);
  const autoStopTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showIncognitoWarning, setShowIncognitoWarning] = useState(false);
  const [isCheckingIncognito, setIsCheckingIncognito] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);

  // Detectar modo incógnito y generar userId
  useEffect(() => {
    const checkAccess = async () => {
      const { shouldBlockAccess } = await import("@/lib/detectIncognito");
      const shouldBlock = await shouldBlockAccess();

      if (shouldBlock) {
        setShowIncognitoWarning(true);
        setIsCheckingIncognito(false);
        return;
      }

      const id = getOrCreateAnonymousUserId();
      setUserId(id);
      setIsCheckingIncognito(false);
    };

    checkAccess();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      let options = { mimeType: "audio/webm" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "audio/mp4" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = {} as any;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();
      setRecordingTime(0);

      logEvent("recording_started");

      const countdownInterval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      autoStopTimerRef.current = setTimeout(() => {
        clearInterval(countdownInterval);
        stopRecording();
        logEvent("recording_auto_stopped", { duration: MAX_RECORDING_DURATION });
      }, MAX_RECORDING_DURATION * 1000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        clearInterval(countdownInterval);
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const recordingDuration = recordingStartTimeRef.current ? (Date.now() - recordingStartTimeRef.current) / 1000 : 0;

        if (recordingDuration < MIN_RECORDING_DURATION) {
          logEvent("recording_abandoned", { duration: recordingDuration, reason: "too_short" });
          alert("La grabación es muy corta. Habla al menos 3 segundos.");
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        // Auto-analyze after stop to match flow
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        analyzeAudio(blob, userId); // Auto trigger analysis or show preview? UIUX implies direct analysis or stop
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("No se pudo acceder al micrófono. Por favor, permite el acceso.");
    }
  };

  const stopRecording = () => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const analyzeAudio = async (blob: Blob, uid: string | null) => {
    if (!blob || !uid) return;
    
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      const fileName = blob.type.includes("mp4") ? "voice.mp4" : "voice.webm";
      formData.append("audio", blob, fileName);
      formData.append("userId", uid);

      const response = await fetch("/api/analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403 && errorData.error === "FREE_LIMIT_REACHED") {
          setShowLimitModal(true);
          return;
        }
        throw new Error(errorData.error || "Error en el análisis");
      }

      const result = await response.json();
      const dataToSave = result.data || result;
      localStorage.setItem("voiceAnalysisResult", JSON.stringify(dataToSave));
      router.push("/results");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Wrapper for analyzeAudio to use state
  const handleAnalysis = () => {
      if(audioBlob && userId) analyzeAudio(audioBlob, userId);
  }

  // Helper to format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCheckingIncognito) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Cargando...</div>;

  // --- RECORDING VIEW ---
  if (isRecording) {
      return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark text-[#111418] dark:text-white font-display overflow-x-hidden antialiased flex flex-col">
            {/* Header */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light dark:bg-background-dark">
                <button 
                  onClick={() => stopRecording()}
                  className="text-[#111418] dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <div className="flex flex-col items-center flex-1 pr-12">
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Nueva Grabación</h2>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">En curso</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto px-4 pb-32">
                {/* Timer */}
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="flex items-baseline gap-1 text-6xl font-bold tracking-tighter text-[#111418] dark:text-white tabular-nums">
                        <span>{formatTime(recordingTime)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                        <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-xs font-medium uppercase tracking-wide">Grabando</span>
                    </div>
                </div>

                {/* Simulated Waveform */}
                <div className="w-full h-32 flex items-center justify-center gap-[3px] px-4 my-4 overflow-hidden">
                    {[4,8,6,10,14,20,24,16,28,20,12,16,8,12,6,4,3,2,4,2].map((h, i) => (
                        <div key={i} className={`w-1.5 rounded-full ${i > 3 && i < 15 ? 'bg-primary animate-pulse' : 'bg-gray-300 dark:bg-gray-700'}`} style={{ height: `${h * 4}%` }}></div>
                    ))}
                </div>

                {/* Stats Grid (Mocked for visual) */}
                <div className="w-full grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-32">
                        <div className="flex items-start justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ritmo</span>
                            <span className="material-symbols-outlined text-green-500 text-xl">speed</span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#111418] dark:text-white tabular-nums">--</p>
                            <p className="text-xs font-medium text-green-500 mt-1">Calculando...</p>
                        </div>
                    </div>
                    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-32">
                        <div className="flex items-start justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Muletillas</span>
                            <span className="material-symbols-outlined text-yellow-500 text-xl">warning</span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[#111418] dark:text-white tabular-nums">--</p>
                            <p className="text-xs font-medium text-yellow-500 mt-1">Detectando...</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Dock */}
            <div className="fixed bottom-0 left-0 w-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-8 pt-4 px-6 z-50">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <button className="flex flex-col items-center gap-1 group opacity-50 cursor-not-allowed">
                        <div className="size-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[#111418] dark:text-white">
                            <span className="material-symbols-outlined text-3xl">pause</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Pausar</span>
                    </button>

                    <button 
                        onClick={stopRecording}
                        className="flex flex-col items-center gap-1 -mt-8 relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl transform group-hover:scale-110 transition-transform"></div>
                        <div className="relative size-20 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-transform active:scale-95 hover:bg-blue-600 border-4 border-background-light dark:border-background-dark">
                            <div className="size-8 bg-white rounded-md"></div>
                        </div>
                        <span className="text-xs font-medium text-primary mt-1">Detener</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 group opacity-50 cursor-not-allowed">
                        <div className="size-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[#111418] dark:text-white">
                            <span className="material-symbols-outlined text-3xl">flag</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Marcar</span>
                    </button>
                </div>
            </div>
        </main>
      )
  }

  // --- ANALYSIS / LOADING VIEW ---
  if (isAnalyzing || audioBlob) {
      return (
        <main className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="relative size-24 mb-6">
                 <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Analizando grabación...</h2>
            <p className="text-gray-400">Esto tomará unos segundos.</p>
        </main>
      )
  }

  // --- SETUP VIEW (Default) ---
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white overflow-x-hidden antialiased">
        <div className="relative flex h-full min-h-screen w-full flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
                <button 
                    onClick={() => router.push("/listen")}
                    className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Nueva Sesión</h2>
                <div className="size-10"></div> 
            </div>

            <div className="flex-1 flex flex-col p-4 gap-6 pb-24">
                {/* Topic Selection */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">¿De qué quieres hablar?</h3>
                    <label className="flex flex-col h-12 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
                            <div className="text-gray-500 dark:text-[#9dabb9] flex border-none bg-white dark:bg-[#283039] items-center justify-center pl-4 rounded-l-xl border-r-0">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-white dark:bg-[#283039] h-full placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] px-4 rounded-l-none pl-2 text-base font-normal leading-normal transition-all" placeholder="Escribe un tema para practicar..." />
                        </div>
                    </label>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary pl-4 pr-4 transition-transform active:scale-95 shadow-md shadow-primary/20">
                            <p className="text-white text-sm font-medium leading-normal">Improvisado</p>
                        </button>
                        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-[#283039] border border-gray-200 dark:border-transparent pl-4 pr-4 transition-transform active:scale-95 hover:bg-gray-50 dark:hover:bg-[#323b46]">
                            <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal">Entrevista</p>
                        </button>
                        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-[#283039] border border-gray-200 dark:border-transparent pl-4 pr-4 transition-transform active:scale-95 hover:bg-gray-50 dark:hover:bg-[#323b46]">
                            <p className="text-slate-700 dark:text-white text-sm font-medium leading-normal">Presentación</p>
                        </button>
                    </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-800 w-full"></div>

                {/* Duration */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Duración límite</h3>
                        <span className="text-primary text-xl font-bold font-display">1:00 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">min</span></span>
                    </div>
                    <div className="bg-white dark:bg-[#283039] rounded-xl p-6 shadow-sm">
                        <div className="relative w-full h-8 flex items-center">
                            <div className="absolute w-full h-2 bg-gray-200 dark:bg-[#3b4754] rounded-full"></div>
                            <div className="absolute h-2 bg-primary rounded-full" style={{width: '100%'}}></div>
                            <div className="absolute size-6 bg-white border-2 border-primary rounded-full shadow-lg" style={{right: '0%', transform: 'translateX(50%)'}}></div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-800 w-full"></div>

                {/* Feedback Metrics */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Métricas activas</h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between bg-white dark:bg-[#283039] p-4 rounded-xl shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">speed</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-900 dark:text-white font-medium text-base">Velocidad</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">Palabras por minuto</span>
                                </div>
                            </div>
                            <div className="w-11 h-6 bg-primary rounded-full relative">
                                <div className="absolute top-[2px] right-[2px] h-5 w-5 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-white dark:bg-[#283039] p-4 rounded-xl shadow-sm">
                             <div className="flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <span className="material-symbols-outlined">graphic_eq</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-900 dark:text-white font-medium text-base">Pausas</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">Silencios prolongados</span>
                                </div>
                            </div>
                            <div className="w-11 h-6 bg-primary rounded-full relative">
                                <div className="absolute top-[2px] right-[2px] h-5 w-5 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             {/* Floating Action Button */}
            <div className="fixed bottom-0 left-0 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-8 border-t border-gray-200 dark:border-gray-800">
                <button 
                    onClick={startRecording}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-lg h-14 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined">mic</span>
                    Comenzar Práctica
                </button>
            </div>
        </div>

        {/* Modal - Logout/Menu (Optional, simplified for now) */}
        <div className="fixed top-4 right-4 z-50">
             <button 
               onClick={() => {
                  const { signOut } = require("next-auth/react");
                  signOut({ callbackUrl: "/" });
               }}
               className="text-gray-400 hover:text-white text-xs border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 bg-background-dark/50 backdrop-blur-md"
             >
               Cerrar Sesión
             </button>
        </div>
    </main>
  );
}
