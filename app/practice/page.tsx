"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { getOrCreateAnonymousUserId } from "@/lib/anonymousUser";
import { logEvent } from "@/lib/events/logEvent";
import Link from "next/link";
import Script from "next/script";
import { usePostureAnalysis, PostureMetrics } from "@/lib/posture/usePostureAnalysis";
import AudioVisualizer from "@/components/AudioVisualizer";
import AudioLevelMeter from "@/components/AudioLevelMeter";
import { getRandomTip, VocalTip, getCategoryColor } from "@/lib/tips/vocalHygieneTips";

// 🎯 CONTROL DE ABANDONO TEMPRANO
const MIN_RECORDING_DURATION = 3; // segundos

// 💰 CONTROL DE COSTOS - Límite máximo de grabación
const MAX_RECORDING_DURATION = 60; // segundos (límite de Whisper)

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVoiceOnly = searchParams.get("mode") === "voice";
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number | null>(null);
  const autoStopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showIncognitoWarning, setShowIncognitoWarning] = useState(false);
  const [isCheckingIncognito, setIsCheckingIncognito] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showPosturePreview, setShowPosturePreview] = useState(true);
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Procesando audio...");
  const [currentTip, setCurrentTip] = useState<VocalTip | null>(null);
  const [mediapipeReady, setMediapipeReady] = useState(false);
  const mediapipeLoadedRef = useRef(0);
  const [showReview, setShowReview] = useState(false);
  const [capturedMetrics, setCapturedMetrics] = useState<PostureMetrics | null>(null);

  // 🆕 Hook de análisis de postura
  const {
    currentMetrics,
    error: postureError,
    initialize: initPosture,
    startAnalysis: startPostureAnalysis,
    stopAnalysis: stopPostureAnalysis,
    isInitialized: isPostureReady,
  } = usePostureAnalysis({ videoRef, canvasRef });

  const handleMediapipeLoad = () => {
    mediapipeLoadedRef.current += 1;
    if (mediapipeLoadedRef.current >= 3) {
      setMediapipeReady(true);
    }
  };


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

  // 🆕 Sincronizar el video con el stream de forma segura
  useEffect(() => {
    let isMounted = true;
    
    const playVideo = async () => {
      if (videoRef.current && recordingStream && isMounted) {
        // Solo actualizar si es diferente para evitar interrupciones
        if (videoRef.current.srcObject !== recordingStream) {
          videoRef.current.srcObject = recordingStream;
          try {
            await videoRef.current.play();
          } catch (e) {
            // Ignorar errores de interrupción si el componente se desmontó
            if (isMounted && (e as Error).name !== 'AbortError') {
              console.error("Error al reproducir video:", e);
            }
          }
        }
      }
    };

    playVideo();

    return () => {
      isMounted = false;
    };
  }, [recordingStream, isRecording, videoRef]);

  // Inicializar cámara cuando el componente carga
  useEffect(() => {
    const initCamera = async () => {
      try {
        if (!isVoiceOnly) {
          await initPosture();
        }
        
        // Intentar obtener el stream que MediaPipe está usando para previsualización
        if (!isVoiceOnly && videoRef.current?.srcObject) {
          setRecordingStream(videoRef.current.srcObject as MediaStream);
        } else {
           const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true, // Esto ayuda a normalizar el volumen
            },
            video: isVoiceOnly ? false : { 
              facingMode: "user" 
            }
          });
          setRecordingStream(stream);
        }
      } catch (err: any) {
        console.error("Error initializing camera:", err);
        setCameraError("No se pudo acceder a la cámara o micrófono");
        logEvent("camera_error", { 
          message: err.message, 
          name: err.name,
          context: "initCamera" 
        });
      }
    };

    if (!isCheckingIncognito && !showIncognitoWarning) {
      initCamera();
    }
  }, [isCheckingIncognito, showIncognitoWarning, initPosture]);

  const startRecording = async () => {
    try {
      // Solicitar audio y video con alta calidad inicial
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: isVoiceOnly ? false : { 
          facingMode: "user"
        }
      });

      setRecordingStream(stream);

      // Configurar video preview de forma segura
      if (!isVoiceOnly && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.error("Error start video:", e));
      }

      // Iniciar análisis de postura
      if (!isVoiceOnly) {
        await startPostureAnalysis();
      }

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

      // Solo grabar pistas de audio para reducir tamaño (el video no se sube)
      const audioStream = new MediaStream(stream.getAudioTracks());
      const mediaRecorder = new MediaRecorder(audioStream, options);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();
      setRecordingTime(0);

      logEvent(isVoiceOnly ? "voice_test_started" : "recording_started_with_video");

      countdownIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      const currentMaxDuration = isVoiceOnly ? 15 : MAX_RECORDING_DURATION;

      autoStopTimerRef.current = setTimeout(() => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        stopRecording();
        logEvent("recording_auto_stopped", { duration: currentMaxDuration });
      }, currentMaxDuration * 1000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const recordingDuration = recordingStartTimeRef.current ? (Date.now() - recordingStartTimeRef.current) / 1000 : 0;

        // Recuperar métricas capturadas antes del cierre
        const finalPostureMetrics = finalMetricsRef.current || stopPostureAnalysis();

        if (recordingDuration < MIN_RECORDING_DURATION) {
          logEvent("recording_abandoned", { duration: recordingDuration, reason: "too_short" });
          alert("La grabación es muy corta. Habla al menos 3 segundos.");
          releaseMediaResources();
          setIsAnalyzing(false);
          return;
        }
        
        setAudioBlob(blob);
        setCapturedMetrics(finalPostureMetrics);
        setShowReview(true);
        // releaseMediaResources() ya fue llamado en stopRecording, pero aquí asegura limpieza si el stop fue por otra razón
        releaseMediaResources();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error: any) {
      console.error("Error accessing media devices:", error);
      logEvent("camera_error", { 
        message: error.message, 
        name: error.name,
        context: "startRecording" 
      });
      alert("No se pudo acceder al micrófono o cámara. Por favor, permite el acceso.");
    }
  };

  // Helper para liberar recursos
  const releaseMediaResources = () => {
    if (recordingStream) {
      recordingStream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      setRecordingStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const finalMetricsRef = useRef<PostureMetrics | null>(null);

  // ... (otros refs)

  // ... dentro de stopRecording
  const stopRecording = () => {
    // 1. CAPTURAR PRIMERO LAS MÉTRICAS DE POSTURA (mientras todo sigue vivo)
    try {
        finalMetricsRef.current = stopPostureAnalysis();
    } catch (e) {
        console.error("Error capturing posture metrics:", e);
    }

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
    
    releaseMediaResources();
  };

  const analyzeAudio = async (blob: Blob, uid: string | null, postureMetrics: PostureMetrics) => {
    if (!blob || !uid) return;
    
    setIsAnalyzing(true);
    setLoadingMessage("Subiendo grabación...");
    setCurrentTip(getRandomTip());
    
    // Rotar mensajes para que la espera se sienta menor
    const messages = [
      "Transcribiendo tu voz...",
      "Analizando entonación y pausas...",
      "Evaluando lenguaje corporal...",
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

      const response = await fetch("/api/analysis", {
        method: "POST",
        body: formData,
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
      
      // 🆕 Agregar métricas de postura al resultado (con fallback seguro)
      const safePostureMetrics = postureMetrics || {
          postureScore: 0,
          shouldersLevel: "balanced",
          headPosition: "centered",
          eyeContactPercent: 0,
          gesturesUsage: "none",
          nervousnessIndicators: { closedFists: 0, handsHidden: 0, excessiveMovement: false }
      };

      const enhancedResult = {
        ...dataToSave,
        postureMetrics: {
          postureScore: safePostureMetrics.postureScore,
          shouldersLevel: safePostureMetrics.shouldersLevel,
          headPosition: safePostureMetrics.headPosition,
          eyeContactPercent: safePostureMetrics.eyeContactPercent,
          gesturesUsage: safePostureMetrics.gesturesUsage,
          nervousnessIndicators: safePostureMetrics.nervousnessIndicators,
        },
        score_postura: safePostureMetrics.postureScore,
        // Forzar score si no viene del backend
        score_general: dataToSave.score_general || Math.round((dataToSave.score_transcripcion + dataToSave.score_audio + (safePostureMetrics.postureScore || 50)) / 3) 
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
    if (audioBlob && capturedMetrics) {
      setShowReview(false);
      setIsAnalyzing(true);
      analyzeAudio(audioBlob, userId, capturedMetrics);
    }
  };

  const handleResetRecording = () => {
    setAudioBlob(null);
    setShowReview(false);
    setCapturedMetrics(null);
    setRecordingTime(0);
    // Reiniciar preview de cámara
    const initCamera = async () => {
        try {
          await initPosture();
          if (videoRef.current?.srcObject) {
            setRecordingStream(videoRef.current.srcObject as MediaStream);
          } else {
             const stream = await navigator.mediaDevices.getUserMedia({ 
              audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
              video: { facingMode: "user" }
            });
            setRecordingStream(stream);
          }
        } catch (err) {
          console.error("Error re-initializing camera:", err);
        }
    };
    initCamera();
  };

  // 🔊 Audio Alert for bad posture
  const lastAlertTimeRef = useRef<number>(0);
  const badPostureCountRef = useRef<number>(0);
  
  useEffect(() => {
    if (isRecording && currentMetrics.isPersonDetected && currentMetrics.shouldersLevel !== 'balanced') {
      badPostureCountRef.current += 1;
      // Aproximadamente 5 segundos (asumiendo ~30fps -> 150 frames, o si el hook emite menos, ajustamos)
      // Como currentMetrics viene de usePostureAnalysis que usa requestAnimationFrame, es rápido.
      // Pongamos un umbral de frames o usemos un intervalo.
      // usePostureAnalysis actualiza el estado, así que este effect corre frecuentemente.
      if (badPostureCountRef.current > 100) { // ~3-4 segundos de mala postura continua
        const now = Date.now();
        if (now - lastAlertTimeRef.current > 10000) { // No repetir más de cada 10s
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
            lastAlertTimeRef.current = now;
          } catch (e) {
            console.warn("Audio alert failed", e);
          }
        }
      }
    } else {
      badPostureCountRef.current = 0;
    }
  }, [isRecording, currentMetrics.shouldersLevel, currentMetrics.isPersonDetected]);

  if (isCheckingIncognito) {
    return (
      <main className="min-h-screen bg-[#101922] flex items-center justify-center text-white font-display">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3b4754] border-t-primary rounded-full animate-spin"></div>
          <p className="text-[#9dabb9]">Preparando...</p>
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
    return (
      <main className="min-h-[100dvh] bg-[#101922] flex flex-col items-center justify-center p-6 text-white text-center font-display">
        <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Grabación completada!</h2>
        <p className="text-[#9dabb9] mb-8 max-w-xs mx-auto">
          Tu video está listo para ser analizado por la Inteligencia Artificial.
        </p>

        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={handleStartAnalysis}
            className="w-full h-14 bg-primary hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">analytics</span>
            Solicitar análisis
          </button>
          
          <button 
            onClick={handleResetRecording}
            className="w-full h-14 bg-[#283039] hover:bg-[#3b4754] text-white font-medium rounded-2xl transition-all border border-[#3b4754] flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">refresh</span>
            Volver a grabar
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
            AI Neural Processing
          </h2>
          <div className="space-y-1 mb-8">
            <p className="text-blue-100/60 text-xs font-bold uppercase tracking-[0.3em] font-mono">
              Analyzing vocal patterns
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
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
        
        {/* 🎙️ MEDIDOR DE VOLUMEN (Vertical Extenso) */}
        {recordingStream && (
          <div className="absolute left-4 md:left-72 top-1/4 bottom-1/4 w-10 md:w-12 z-[60] animate-fade-in flex flex-col items-center gap-2">
             <div className="flex-1 w-full bg-black/60 backdrop-blur-xl rounded-full border border-white/20 p-2 flex flex-col items-center shadow-2xl">
                <AudioLevelMeter stream={recordingStream} isActive={true} />
             </div>
             <div className="size-8 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                <span className={`material-symbols-outlined text-sm ${isRecording ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                  mic
                </span>
             </div>
          </div>
        )}

        {/* PANEL LATERAL / SUPERIOR (Feedback en Vivo) */}
        {!isVoiceOnly && isPostureReady && (
          <div className={`absolute z-40 transition-all duration-700 ease-in-out no-scrollbar
            ${isRecording 
              ? 'top-20 left-4 right-4 flex flex-row justify-center gap-2 md:top-1/2 md:-translate-y-1/2 md:left-6 md:right-auto md:flex-col md:w-64' 
              : 'top-20 left-4 right-4 flex flex-row overflow-x-auto gap-2 md:top-1/2 md:-translate-y-1/2 md:left-6 md:right-auto md:flex-col md:w-64 md:overflow-visible'
            }`}
          >

            <div className="hidden md:flex items-center gap-2 mb-2 pl-1">
              <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest shadow-black drop-shadow-md">
                {isRecording ? "Análisis en Tiempo Real" : "Verificación de Postura"}
              </h3>
              {isRecording && (
                <div className="size-1.5 rounded-full bg-red-500 animate-pulse"></div>
              )}
            </div>

            
            {/* 1. Mirada/Cabeza */}
            <div className={`p-2.5 md:p-4 rounded-xl md:rounded-2xl border backdrop-blur-md transition-all duration-500 ease-out flex-shrink-0 w-[105px] md:w-full ${
              currentMetrics.isPersonDetected && currentMetrics.headPosition === 'centered' 
                ? 'bg-green-500/20 border-green-500/50 shadow-[0_4px_15px_rgba(34,197,94,0.3)]' 
                : 'bg-gray-900/60 border-gray-700/50 opacity-80'
            }`}>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-1.5 md:gap-3 text-center md:text-left">
                <div className={`size-8 md:size-9 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
                  currentMetrics.isPersonDetected && currentMetrics.headPosition === 'centered' ? 'bg-green-500 text-black scale-105' : 'bg-gray-800 text-gray-500'
                }`}>
                  <span className="material-symbols-outlined text-base md:text-lg">visibility</span>
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider truncate transition-colors duration-500 ${currentMetrics.isPersonDetected && currentMetrics.headPosition === 'centered' ? 'text-green-400' : 'text-gray-400'}`}>
                    Mirada
                  </p>
                  <p className={`text-[8px] md:text-[10px] leading-tight transition-colors duration-500 ${currentMetrics.isPersonDetected && currentMetrics.headPosition === 'centered' ? 'text-green-200/70' : 'text-gray-500'}`}>
                    {currentMetrics.isPersonDetected && currentMetrics.headPosition === 'centered' ? 'Centrada' : 'Centra'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Manos */}
            <div className={`p-2.5 md:p-4 rounded-xl md:rounded-2xl border backdrop-blur-md transition-all duration-500 ease-out flex-shrink-0 w-[105px] md:w-full ${
               currentMetrics.isPersonDetected && currentMetrics.gesturesUsage !== 'low'
                ? currentMetrics.gesturesUsage === 'excessive' ? 'bg-orange-500/20 border-orange-500/50 shadow-[0_4px_15px_rgba(249,115,22,0.3)]' 
                : 'bg-blue-500/20 border-blue-500/50 shadow-[0_4px_15px_rgba(59,130,246,0.3)]'
                : 'bg-gray-900/60 border-gray-700/50 opacity-80'
            }`}>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-1.5 md:gap-3 text-center md:text-left">
                <div className={`size-8 md:size-9 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
                   currentMetrics.isPersonDetected && currentMetrics.gesturesUsage !== 'low' 
                   ? currentMetrics.gesturesUsage === 'excessive' ? 'bg-orange-500 text-white scale-105' : 'bg-blue-500 text-white scale-105' 
                   : 'bg-gray-800 text-gray-500'
                }`}>
                  <span className="material-symbols-outlined text-base md:text-lg">sign_language</span>
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider truncate transition-colors duration-500 ${ 
                    currentMetrics.isPersonDetected && currentMetrics.gesturesUsage !== 'low' 
                    ? currentMetrics.gesturesUsage === 'excessive' ? 'text-orange-400' : 'text-blue-400' 
                    : 'text-gray-400'
                  }`}>
                    Gestos
                  </p>
                  <p className={`text-[8px] md:text-[10px] leading-tight transition-colors duration-500 ${ 
                    currentMetrics.isPersonDetected && currentMetrics.gesturesUsage !== 'low' 
                    ? currentMetrics.gesturesUsage === 'excessive' ? 'text-orange-200/70' : 'text-blue-200/70' 
                    : 'text-gray-500'
                  }`}>
                    {currentMetrics.isPersonDetected 
                        ? (currentMetrics.gesturesUsage === 'optimal' ? 'Dinámicos' : currentMetrics.gesturesUsage === 'excessive' ? 'Muchos' : 'Usa manos')
                        : 'Usa manos'}
                  </p>
                </div>
              </div>
            </div>

             {/* 3. Postura/Hombros */}
             <div className={`p-2.5 md:p-4 rounded-xl md:rounded-2xl border backdrop-blur-md transition-all duration-500 ease-out flex-shrink-0 w-[105px] md:w-full ${
               currentMetrics.isPersonDetected && currentMetrics.shouldersLevel === 'balanced' 
                ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_4px_15px_rgba(168,85,247,0.3)]' 
                : 'bg-gray-900/60 border-gray-700/50 opacity-80'
            }`}>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-1.5 md:gap-3 text-center md:text-left">
                <div className={`size-8 md:size-9 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
                   currentMetrics.isPersonDetected && currentMetrics.shouldersLevel === 'balanced' ? 'bg-purple-500 text-white scale-105' : 'bg-gray-800 text-gray-500'
                }`}>
                  <span className="material-symbols-outlined text-base md:text-lg">accessibility_new</span>
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider truncate transition-colors duration-500 ${ currentMetrics.isPersonDetected && currentMetrics.shouldersLevel === 'balanced' ? 'text-purple-400' : 'text-gray-400'}`}>
                    Postura
                  </p>
                  <p className={`text-[8px] md:text-[10px] leading-tight transition-colors duration-500 ${ currentMetrics.isPersonDetected && currentMetrics.shouldersLevel === 'balanced' ? 'text-purple-200/70' : 'text-gray-500'}`}>
                    {currentMetrics.isPersonDetected && currentMetrics.shouldersLevel === 'balanced' ? 'Erguida' : 'Saca pecho'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {isVoiceOnly && (
           <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 pl-20 md:p-6 text-center animate-fade-in overflow-hidden">
              {/* Background Glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
              <div className={`absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-1000 ${isRecording ? 'opacity-100' : 'opacity-0'}`} />

              <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
                {/* Status Indicator */}
                <div className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
                  <div className={`size-1.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-400 font-bold'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 italic">
                    {isRecording ? "Neural Audio Analysis Live" : "Elite Voice Diagnostics"}
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
                    ) : "Test de Autoridad"}
                  </h2>
                  <p className="text-slate-400 text-sm md:text-xl max-w-[320px] md:max-w-md mx-auto leading-relaxed font-medium">
                    {isRecording 
                      ? "Habla con naturalidad. La IA está procesando tu tono, cadencia y micro-oscilaciones vocales." 
                      : "Descubre el impacto real de tu comunicación en solo 15 segundos."}
                  </p>
                </div>

                {!isRecording && (
                  <div className="mt-12 flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-blue-400 text-xl">speed</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Fluidez</span>
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
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Impacto</span>
                    </div>
                  </div>
                )}
              </div>
           </div>
        )}

        {showPosturePreview && !isVoiceOnly && (
          // Contenedor Pantalla Completa en Mobile, 16:9 en Desktop
          <div className="absolute inset-0 z-0 md:relative md:w-full md:max-w-6xl md:h-auto md:aspect-video shadow-2xl bg-black overflow-hidden md:rounded-xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover md:object-contain transform -scale-x-100 bg-black" 
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover md:object-contain transform -scale-x-100 pointer-events-none opacity-60 z-10"
                />
                
                {/* Guía Visual */}
                {!isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none border border-white/10 m-6 rounded-2xl">
                        <div className="absolute top-[20%] w-32 h-32 border-2 border-white/20 rounded-full border-dashed"></div>
                        <p className="absolute bottom-[15%] text-white/60 text-xs font-medium text-center px-4 w-full bg-black/20 backdrop-blur-sm py-2">
                           Alinea tu cuerpo en el centro <br/>
                           <span className="text-yellow-400 text-[10px]">Distancia óptima: ~1 metro</span>
                        </p>
                    </div>
                )}

                {/* Loading State en el centro */}
                {!isPostureReady && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                    <p className="text-white font-medium">Cargando cámara...</p>
                  </div>
                )}

                {/* Error State */}
                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-30 p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-red-500 mb-2">videocam_off</span>
                    <p className="text-white font-medium">{cameraError}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20">
                      Reintentar
                    </button>
                  </div>
                )}

                {/* Posture Error State */}
                {postureError && !cameraError && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-full text-xs text-red-200 backdrop-blur-md">
                    {postureError}
                  </div>
                )}
                

          </div>
        )}
      </div>

      {/* 🔝 Top UI Overlay */}
      <div className="absolute top-0 w-full z-10 flex items-center justify-between p-4 pt-safe bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/listen">
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
      {/* Carga robusta de librerías MediaPipe con Next.js Script */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" 
        strategy="afterInteractive" 
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js" 
        strategy="afterInteractive" 
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" 
        strategy="afterInteractive" 
      />
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
