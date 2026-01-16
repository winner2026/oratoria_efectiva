"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { logEvent } from "@/lib/events/logEvent";
import Link from "next/link";
import Script from "next/script";
import AudioVisualizer from "@/components/AudioVisualizer";
import AudioLevelMeter from "@/components/AudioLevelMeter";
import { getRandomTip, VocalTip, getCategoryColor } from "@/lib/tips/vocalHygieneTips";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const SmartPiano = dynamic(() => import("@/components/warmup/SmartPiano"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center text-white">Cargando Piano...</div>
});

// 🎯 CONTROL DE ABANDONO TEMPRANO
const MIN_RECORDING_DURATION = 3; // segundos

// 💰 CONTROL DE COSTOS - Límite máximo de grabación
const MAX_RECORDING_DURATION = 30; // segundos (límite solicitado)

// 🏋 IMPORTACIONES PARA EL CONTEXTO DEL EJERCICIO
import { VOICE_EXERCISES, VoiceExercise } from "@/domain/training/VoiceExercises";

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isVoiceOnly = mode === "voice";
  const isVideoMode = mode === "video";
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const recordingStartTimeRef = useRef<number | null>(null);
  const autoStopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const finalMetricsRef = useRef<any>(null); // Placeholder to avoid errors if referenced

  // 📝 CONTEXTO DE EJERCICIO
  const exerciseId = searchParams.get("exercise");
  const currentExercise = exerciseId ? VOICE_EXERCISES.find(e => e.id === exerciseId) : null;

  // 💾 STATE PERSISTENCE PARA RESULTADOS
  useEffect(() => {
    if (exerciseId) {
        localStorage.setItem('current_exercise_id', exerciseId);
    } else {
        localStorage.removeItem('current_exercise_id');
    }
  }, [exerciseId]);

  // 🛡️ SECURITY GATING: PREVENT UNAUTHORIZED ACCESS
  useEffect(() => {
    if (!currentExercise) return; // Generic scanner has its own backend limit check

    const checkPlanAccess = () => {
        const userPlan = localStorage.getItem('user_plan') || 'FREE';
        
        // Define hierarchy
        const tiers = { 'FREE': 0, 'STARTER': 1, 'ELITE': 2, 'PREMIUM': 2 };
        const userLevel = tiers[userPlan as keyof typeof tiers] || 0;
        
        const exerciseTier = currentExercise.tier;
        const reqLevel = tiers[exerciseTier as keyof typeof tiers] || 0;

        if (userLevel < reqLevel) {
            // Access Denied
            router.replace('/upgrade'); 
        }
    };
    
    checkPlanAccess();
  }, [currentExercise, router]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showIncognitoWarning, setShowIncognitoWarning] = useState(false);
  const [isCheckingIncognito, setIsCheckingIncognito] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentTip, setCurrentTip] = useState<VocalTip | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [showPiano, setShowPiano] = useState(false);
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownVal, setCountdownVal] = useState(5);

  const { data: session, status } = useSession();

  // Detectar modo incógnito y generar userId
  useEffect(() => {
    if (status === "loading") return;

    const checkAccess = async () => {
      const { shouldBlockAccess } = await import("@/lib/detectIncognito");
      const shouldBlock = await shouldBlockAccess();

      if (shouldBlock) {
        setShowIncognitoWarning(true);
        setIsCheckingIncognito(false);
        return;
      }

      if (session?.user?.email) {
        setUserId(session.user.email);
      }
      setIsCheckingIncognito(false);
    };

    checkAccess();
  }, [session, status]);


  const [loadingMessage, setLoadingMessage] = useState("Analizando...");

  // 🎛️ MEDIA CONTROL TOGGLES
  const toggleMic = () => {
    if (recordingStream) {
      const audioTracks = recordingStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMicEnabled;
      });
      setIsMicEnabled(!isMicEnabled);
    }
  };

  // Inicializar audio cuando el componente carga
  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
        });
        
        // 🔒 APLICAR ESTADO INICIAL (MUTEADO POR DEFAULT)
        stream.getAudioTracks().forEach(track => track.enabled = false);

        setRecordingStream(stream);

      } catch (err: any) {
        console.error("Error initializing audio:", err);
        logEvent("camera_error", { 
          message: err.message, 
          name: err.name,
          context: "initAudio" 
        });
      }
    };

    if (!isCheckingIncognito && !showIncognitoWarning) {
      initAudio();
    }
  }, [isCheckingIncognito, showIncognitoWarning]);

  const startRecording = async () => {
    try {
      // 1. Obtener/Validar Stream
      let stream = recordingStream;
      if (!stream) {
         stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
         });
         setRecordingStream(stream);
      }
      
      // 2. Iniciar Cuenta Regresiva
      setIsCountingDown(true);
      setCountdownVal(5);
      
      let count = 5;
      const interval = setInterval(() => {
          count--;
          setCountdownVal(count);
          if (count <= 0) {
              clearInterval(interval);
              setIsCountingDown(false);
              beginRecording(stream as MediaStream); // Go!
          }
      }, 1000);

    } catch (error: any) {
      console.error("Error accessing media devices:", error);
      alert("No se pudo acceder al micrófono. Por favor, permite el acceso.");
    }
  };

  const beginRecording = (stream: MediaStream) => {
      // 🔒 SINCRONIZAR ESTADO DE BOTONES CON EL STREAM
      stream.getAudioTracks().forEach(track => track.enabled = true);
      // Ensure state matches reality
      setIsMicEnabled(true);

      // Configurar grabación de audio optimizada
      let options: MediaRecorderOptions = { 
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 64000 // 64kbps para subida rápida
      };
      
      if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        options = { mimeType: 'audio/webm' }; // Fallback estándar
        if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
           options = {}; // Fallback final (default del navegador)
        }
      }

      // Solo grabar pistas de audio
      const audioStream = new MediaStream(stream.getAudioTracks());
      const mediaRecorder = new MediaRecorder(audioStream, options);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();
      setRecordingTime(0);

      logEvent("voice_test_started");

      countdownIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Force stop at MAX_DURATION
      autoStopTimerRef.current = setTimeout(() => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        stopRecording();
        logEvent("recording_auto_stopped", { duration: MAX_RECORDING_DURATION });
      }, MAX_RECORDING_DURATION * 1000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const recordingDuration = recordingStartTimeRef.current ? (Date.now() - recordingStartTimeRef.current) / 1000 : 0;

        if (recordingDuration < MIN_RECORDING_DURATION) {
          alert("La grabación es muy corta. Habla al menos 3 segundos.");
          releaseMediaResources();
          setIsAnalyzing(false);
          setIsRecording(false);
          return;
        }

        // 🔍 PROCESAMIENTO LOCAL
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const buffer = await context.decodeAudioData(await blob.arrayBuffer());
            const data = buffer.getChannelData(0);
            let sumSq = 0;
            let lastVal = 0;
            let stabSum = 0;
            for(let i=0; i<data.length; i++) {
                sumSq += data[i]*data[i];
                stabSum += Math.abs(data[i]-lastVal);
                lastVal = data[i];
            }
            const rms = Math.sqrt(sumSq/data.length)*100;
            const stab = Math.max(0, 100 - (stabSum/data.length)*200);
            finalMetricsRef.current = { rms: Math.round(rms*2), stability: Math.round(stab) };
        } catch(e) {
            finalMetricsRef.current = { rms: 50, stability: 50 };
        }
        
        setAudioBlob(blob);
        setShowReview(true);
        releaseMediaResources();
      };

      mediaRecorder.start();
      setIsRecording(true);
  };

  // Helper para liberar recursos
  const releaseMediaResources = () => {
    if (recordingStream) {
      recordingStream.getTracks().forEach(track => {
        track.stop();
      });
      setRecordingStream(null); 
    }
  };



  const stopRecording = () => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    
    // Do NOT release resources immediately here, let onstop handle it or user reset.
    // If we release here, the 'onstop' event might fire with no stream tracks if needed (though we only need blob).
    // Better to let onstop callback handle the flow to Review.
  };

  const analyzeAudio = async (blob: Blob, uid: string | null) => {
    if (!blob || !uid) return;
    
    setIsAnalyzing(true);
    setLoadingMessage("Subiendo grabación...");
    setCurrentTip(getRandomTip());
    
    // Rotar mensajes para que la espera se sienta menor
    const messages = [
      "Transcribiendo tu voz...",
      "Analizando entonación y pausas...",
      "Calculando niveles de seguridad...",
      "Generando feedback personalizado..."
    ];
    let msgIndex = 0;
    const intervalId = setInterval(() => {
      if (msgIndex < messages.length) {
        setLoadingMessage(messages[msgIndex]);
        msgIndex++;
      }
    }, 4000); // Cambiar cada 4 segundos

    try {
      const formData = new FormData();
      const fileName = blob.type.includes("mp4") ? "voice.mp4" : "voice.webm";
      formData.append("audio", blob, fileName);
      formData.append("userId", uid);

      // Timeout de seguridad de 90s para el cliente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      // 🛡️ Context encoding: Base64 or URI encode to avoid header issues with accents
      const contextString = currentExercise ? JSON.stringify({
          id: currentExercise.id,
          title: currentExercise.title,
          goal: currentExercise.benefit,
          metrics: currentExercise.targetMetrics
      }) : '';

      // 🕵️ DEVICE FINGERPRINT (Hacker Defense)
      const deviceFp = await import("@/lib/fingerprint/clientFingerprint").then(m => m.getDeviceFingerprint());

      const response = await fetch("/api/analysis", {
        method: "POST",
        body: formData,
        headers: {
            'X-Exercise-Context': contextString ? encodeURIComponent(contextString) : '',
            'X-Device-Fingerprint': deviceFp
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

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
      
      const enhancedResult = {
        ...dataToSave,
        score_general: dataToSave.score_general || Math.round((dataToSave.score_transcripcion + dataToSave.score_audio) / 2) 
      };
      
      localStorage.setItem("voiceAnalysisResult", JSON.stringify(enhancedResult));
      clearInterval(intervalId);
      router.push("/results");
    } catch (error: any) {
      clearInterval(intervalId);
      alert(`Error: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartAnalysis = () => {
    if (audioBlob) {
      setShowReview(false);
      setIsAnalyzing(true);
      analyzeAudio(audioBlob, userId);
    }
  };

  const handleResetRecording = () => {
    setAudioBlob(null);
    setShowReview(false);
    setRecordingTime(0);
    // Reiniciar stream
    startRecording(); // O simplemente dejar que el usuario pulse Grabar de nuevo
  };



  if (isCheckingIncognito) {
    return (
      <main className="min-h-screen bg-[#101922] flex items-center justify-center text-white font-display">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3b4754] border-t-primary rounded-full animate-spin"></div>
          <p className="text-[#9dabb9]">Preparando entrenador...</p>
        </div>
      </main>
    );
  }

  // --- INCOGNITO WARNING ---
  if (showIncognitoWarning) {
    return (
      <main className="min-h-screen bg-[#101922] flex items-center justify-center p-4 text-white font-display">
        <div className="bg-[#1a242d] border border-[#3b4754] rounded-2xl p-6 max-w-sm text-center space-y-5">
          <div className="size-16 rounded-full bg-[#283039] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl text-[#9dabb9]">visibility_off</span>
          </div>
          <h2 className="text-xl font-bold">Modo incógnito detectado</h2>
          <p className="text-[#9dabb9] text-sm">
            Para guardar tu progreso y ofrecerte feedback personalizado, usa una ventana normal del navegador.
          </p>
          <Link href="/">
            <button className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors">
              Volver al inicio
            </button>
          </Link>
        </div>
      </main>
    );
  }

  // --- LIMIT MODAL ---
  if (showLimitModal) {
    return (
      <main className="min-h-[100dvh] bg-[#101922] flex items-center justify-center p-4 text-white font-display">
        <div className="bg-[#1a242d] border border-[#3b4754] rounded-2xl p-6 max-w-sm text-center space-y-5">
          <div className="size-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl text-yellow-500">lock</span>
          </div>
          <h2 className="text-xl font-bold">Límite gratuito alcanzado</h2>
          <p className="text-[#9dabb9] text-sm">
            Has usado tus análisis gratuitos. Únete a la lista de espera para acceso ilimitado.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/waitlist">
              <button className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/20">
                Unirse a waitlist
              </button>
            </Link>
            <Link href="/">
              <button className="w-full h-11 bg-[#283039] hover:bg-[#3b4754] text-white font-medium rounded-xl transition-colors border border-[#3b4754]">
                Volver al inicio
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- RECORDING VIEW (with video) ---


  // --- REVIEW VIEW ---
  if (showReview && audioBlob) {
    const localRms = finalMetricsRef.current?.rms || 0;
    const localStab = finalMetricsRef.current?.stability || 0;

    return (
      <main className="min-h-[100dvh] bg-[#05080a] flex flex-col items-center justify-center p-6 text-white text-center font-display">
        <div className="size-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-6 border border-blue-500/30">
          <span className="material-symbols-outlined text-3xl text-blue-400">biometrics</span>
        </div>
        
        <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Resultados Rápidos</h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm font-medium">
          Toca el botón blanco para ver todo.
        </p>

        {/* Local Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Fuerza</span>
                <div className="text-2xl font-black text-blue-400">%{localRms}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Calma</span>
                <div className="text-2xl font-black text-emerald-400">%{localStab}</div>
            </div>
        </div>

        {/* 🔒 DEEP AUDIT PREVIEW (FOMO) */}
        <div className="w-full max-w-xs mb-10 space-y-2">
            <div className="flex items-center justify-between px-4 py-3 bg-black/40 border border-white/5 rounded-xl opacity-60">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-slate-500 italic">lock</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detección de Muletillas</span>
                </div>
                <span className="text-[8px] font-black text-slate-600">REQ. IA</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-black/40 border border-white/5 rounded-xl opacity-60">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-slate-500 italic">lock</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Versión Nivel CEO</span>
                </div>
                <span className="text-[8px] font-black text-slate-600">REQ. IA</span>
            </div>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={handleStartAnalysis}
            className="group w-full h-16 bg-white text-black font-black rounded-2xl transition-all shadow-xl flex flex-col items-center justify-center gap-0 uppercase tracking-widest active:scale-95"
          >
            <span className="text-[11px]">Ver Resultados Completos</span>
            <span className="text-[8px] opacity-70">Cuesta 1 Moneda</span>
          </button>
          
          <button 
            onClick={handleResetRecording}
            className="w-full h-14 bg-transparent hover:bg-white/5 text-slate-400 font-bold rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Probar otra vez
          </button>
        </div>


      </main>
    );
  }

  // --- ANALYSIS / LOADING VIEW ---
  if (isAnalyzing) {
    return (
      <main className="min-h-[100dvh] bg-[#05080a] flex flex-col items-center justify-center p-6 text-white text-center font-display relative overflow-hidden">
        {/* Background Neural Network Aesthetic */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
          {/* Elite Loader */}
          <div className="relative size-32 mb-10">
            <div className="absolute inset-0 border-[6px] border-blue-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            {/* Inner Ring */}
            <div className="absolute inset-4 border-[4px] border-purple-500/10 rounded-full"></div>
            <div className="absolute inset-4 border-[4px] border-purple-500 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            {/* Core */}
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="material-symbols-outlined text-4xl text-blue-400 animate-pulse">neurology</span>
            </div>
          </div>

          <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Analizando tu Voz...
          </h2>
          <div className="space-y-1 mb-8">
            <p className="text-blue-100/60 text-xs font-bold uppercase tracking-[0.3em] font-mono">
              Escuchando grabación
            </p>
            <p className="text-white font-medium text-lg min-h-[1.5em] transition-all duration-300">
              {loadingMessage}
            </p>
          </div>
          
          {/* Oratory Tip Card (Premium Style) */}
          {currentTip && (
            <div className="w-full relative bg-white/[0.03] backdrop-blur-2xl rounded-[32px] p-8 border border-white/5 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                <span className="material-symbols-outlined text-9xl">{currentTip.icon}</span>
              </div>
              
              <div className="flex flex-col items-center relative z-10">
                <div className={`mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-white/5 border border-white/10 ${getCategoryColor(currentTip.category)}`}>
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  Pro Tip: {currentTip.category}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{currentTip.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                  "{currentTip.content}"
                </p>
              </div>
            </div>
          )}
          
          {/* Progress hint */}
          <p className="mt-12 text-[10px] text-slate-600 font-bold uppercase tracking-widest animate-pulse">
            System Online • Neural Link Active
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 bg-black font-display text-white overflow-hidden z-[999]">
      {/* COUNTDOWN OVERLAY */}
      {isCountingDown && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-[1000] flex items-center justify-center animate-bounce-in pointer-events-none">
              <div className="text-[15rem] md:text-[25rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-600 drop-shadow-[0_0_80px_rgba(245,158,11,0.5)]">
                  {countdownVal}
              </div>
          </div>
      )}
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
        
        {/* 🎙️ MEDIDOR DE VOLUMEN (Vertical Extenso) - SOLO EN VIDEO MODE */}
        {!isVoiceOnly && recordingStream && (
          <div className="absolute left-4 md:left-72 top-1/4 bottom-1/4 w-10 md:w-12 z-[60] animate-fade-in flex flex-col items-center gap-2">
             <div className="flex-1 w-full bg-black/60 backdrop-blur-xl rounded-full border border-white/20 p-2 flex flex-col items-center shadow-2xl relative overflow-hidden">
                {/* Visualizer Background */}
                {!isMicEnabled && (
                    <div className="absolute inset-0 z-10 bg-black/80 flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-500">mic_off</span>
                    </div>
                )}
                <AudioLevelMeter stream={recordingStream} isActive={true} />
             </div>
             

          </div>
        )}

        {/* PIANO MODAL */}
        {showPiano && (
            <SmartPiano onClose={() => setShowPiano(false)} />
        )}

        {/* 📋 TARJETA DE CONTEXTO DE EJERCICIO (Flotante) */}
        {currentExercise && (
            <div className={`absolute top-20 left-4 right-4 md:left-auto md:right-8 md:w-80 bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 p-4 rounded-2xl z-50 transition-all duration-500 ${isRecording ? 'opacity-50 hover:opacity-100 translate-y-0' : 'translate-y-0 shadow-2xl shadow-blue-900/20'}`}>
                <div className="flex items-start gap-3">
                    <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                        <span className="material-symbols-outlined">fitness_center</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm leading-tight">{currentExercise.title}</h3>
                        <p className="text-xs text-blue-200/60 font-medium mt-0.5">{currentExercise.category}</p>
                    </div>
                </div>
                
                {/* Pasos (Solo visibles si no se está grabando para no distraer, o colapsados) */}
                {!isRecording && (
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Tu Misión:</p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            {currentExercise.description}
                        </p>
                         <ul className="space-y-1.5 mt-2">
                            {currentExercise.steps.slice(0, 3).map((step, idx) => (
                                <li key={idx} className="flex gap-2 text-[11px] text-slate-400">
                                    <span className="text-blue-500">•</span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {isRecording && (
                     <div className="mt-2 text-xs text-center text-blue-300 font-medium animate-pulse">
                        🎯 Enfócate en: {currentExercise.targetMetrics.join(", ")}
                     </div>
                )}
            </div>
        )}

        {/* 🎧 AUDIO VISUALIZER CONTAINER */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 pl-0 md:p-6 text-center animate-fade-in overflow-hidden">

              {/* Background Glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
              <div className={`absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-1000 ${isRecording ? 'opacity-100' : 'opacity-0'}`} />

              <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
                {/* Status Indicator */}
                <div className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
                  <div className={`size-1.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-400 font-bold'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 italic">
                    {isRecording ? "Grabando..." : "Detector de Voz"}
                  </span>
                </div>

                {/* Central Orb / Mic Container */}
                <div className="relative mb-10">
                   {/* Decorative Rotating Border */}
                   <div className={`absolute inset-[-20px] border-2 border-dashed border-blue-500/20 rounded-full transition-all duration-[3000ms] ease-linear ${isRecording ? 'rotate-180 opacity-100' : 'opacity-0'}`}></div>
                   
                   <div className={`size-56 md:size-72 bg-gradient-to-br from-blue-900/40 via-black to-purple-900/40 rounded-full flex items-center justify-center border border-white/10 shadow-2xl transition-all duration-700 relative overflow-hidden group
                    ${isRecording ? 'scale-110 shadow-[0_0_80px_-20px_rgba(59,130,246,0.4)]' : 'shadow-[0_0_60px_-20px_rgba(0,0,0,0.8)]'}`}>
                    
                    {/* Scanning Overlay Effect */}
                    {isRecording && (
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/10 to-transparent w-full h-1/2 animate-scan z-[-1]"></div>
                    )}
                    
                    {isRecording ? (
                      <div className="scale-125 md:scale-150 transform transition-transform duration-700">
                        <AudioVisualizer stream={recordingStream} isActive={true} />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                        <span className="material-symbols-outlined text-[80px] drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">settings_voice</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 px-4">
                  <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white leading-none">
                    {isRecording ? (
                      <>Escuchando <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">tu voz</span></>
                    ) : "Prueba de Voz"}
                  </h2>
                  <p className="text-slate-400 text-sm md:text-xl max-w-[320px] md:max-w-md mx-auto leading-relaxed font-medium">
                    {isRecording 
                      ? "Habla normal. La IA está escuchando cómo suenas." 
                      : "Ve qué tan fuerte suenas en 15 segundos."}
                  </p>
                </div>

                {!isRecording && (
                  <div className="mt-12 flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-blue-400 text-xl">speed</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rapidez</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-purple-400 text-xl">equalizer</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Tono</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-emerald-400 text-xl">verified</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Fuerza</span>
                    </div>
                  </div>
                )}
              </div>
        </div>

      {/* 🔝 Top UI Overlay */}
      <div className="absolute top-0 w-full z-10 flex items-center justify-between p-4 pt-safe bg-gradient-to-b from-black/80 to-transparent">
        <Link href={exerciseId ? "/gym" : "/listen"}>
          <button className="flex size-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all text-white shadow-lg">
            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
          </button>
        </Link>
        
        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg ${isRecording ? 'bg-red-500/80 border-red-400' : 'bg-black/40 border-white/10'}`}>
          <div className={`size-2 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-green-400'}`}></div>
          <span className="text-xs font-bold font-mono tracking-wide text-white">
            {isRecording ? formatTime(recordingTime) : "LISTO"}
          </span>
        </div>

        {/* Piano Toggle (Solo visible si no graba) */}
        {!isRecording && (
            <button 
                onClick={() => setShowPiano(true)}
                className="ml-4 size-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all active:scale-95"
                title="Abrir Piano de Calentamiento"
            >
                <span className="material-symbols-outlined text-blue-400">piano</span>
            </button>
        )}

        <div className="size-10"></div>
      </div>

      {/* 🔻 Bottom UI Overlay (Controls) */}
      <div className="absolute bottom-0 w-full z-10 flex flex-col items-center pb-safe pt-24 bg-gradient-to-t from-black via-black/60 to-transparent">
        
        {/* Tips flotantes (solo si no graba) */}
        {!isRecording && currentTip && (
           <div className="mb-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 max-w-xs text-center animate-fade-in text-xs text-gray-200 hidden md:block">
              <span className="text-yellow-400 font-bold mr-1">Tip:</span> 
              {currentTip.content.length > 60 ? currentTip.content.substring(0, 60) + "..." : currentTip.content}
           </div>
        )}

        {/* Audio Meter (Removed from bottom, moved to left) */}

        {/* 🔴 Main Action Button */}
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="group relative size-20 flex items-center justify-center rounded-full transition-transform active:scale-95 touch-none"
          >
            <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse group-hover:opacity-40"></div>
            <div className="size-16 bg-white rounded-full border-4 border-gray-300 shadow-2xl flex items-center justify-center">
               <div className="size-12 bg-red-600 rounded-full transition-all group-hover:scale-110 shadow-inner"></div>
            </div>
            <span className="absolute -bottom-8 text-xs font-bold uppercase tracking-widest text-white/60">Grabar</span>
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="group relative size-20 flex items-center justify-center rounded-full transition-transform active:scale-95 touch-none"
          >
            <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-50"></div>
            <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white transform hover:scale-105 transition-transform">
               <div className="size-6 bg-red-600 rounded-lg shadow-sm"></div>
            </div>
             <span className="absolute -bottom-8 text-xs font-bold uppercase tracking-widest text-red-400">Parar</span>
          </button>
        )}
      </div>
      </div>
    </main>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-[#101922] flex items-center justify-center text-white font-display'>Cargando estudio...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
