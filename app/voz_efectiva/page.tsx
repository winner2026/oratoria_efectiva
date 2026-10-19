"use client";

import { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import AudioVisualizer from "@/components/AudioVisualizer";


interface MetricExplanation {
  title: string;
  valueFormatted: string;
  explanation: string;
  limitations?: string;
  origin?: string;
}

interface AnalysisResultData {
  authorityScore: {
    score: number;
    level: string;
    strengths: string[];
    weaknesses: string[];
  };
  metrics: {
    wordsPerMinute: number;
    avgPauseDuration: number;
    pauseCount: number;
    pitchVariation: number | null;
    energyStability: number | null;
    spectralBand3Score: number | null;
  };
  feedback: {
    diagnostico: string;
    decision: string;
    payoff: string;
  };
  persistence: {
    persisted: boolean;
    visitorId: string;
    databaseSessionId: string | null;
  };
  metricExplanations: {
    fuerzaVocal: MetricExplanation;
    dinamicaEntonacion: MetricExplanation;
    estabilidadEspectral: MetricExplanation;
    ritmoHabla?: MetricExplanation;
  };
  coaching: {
    sessionId: string;
    prescription: {
      primaryExercise: {
        title: string;
        explanation: string;
        instruction: string;
        customRoute: string;
      };
    };
    adaptiveNextStep: {
      stepTitle: string;
      stepDescription: string;
      recommendedRoute: string;
    };
  };
  archetypeComparison?: {
    targetArchetype: {
      id: string;
      name: string;
      code: string;
      tagline: string;
      themeColor: string;
      recommendedTrainingFocus: string;
      actionablePrescription: string;
    };
    distancePercent: number;
    matchScore: number;
    bottleneckDimension: string;
    wpmDelta: number;
    pauseDelta: number;
    pitchDelta: number;
    energyDelta: number;
  };
}

export default function VozEfectivaPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && (session?.user as any)?.id !== "guest-1";

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null);

  // Countdown State
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownVal, setCountdownVal] = useState(3);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Iniciar diagnóstico vocal de 15 segundos
  const handleStartDiagnostic = async () => {
    if (!isAuthenticated) {
      signIn("google", { callbackUrl: "/voz_efectiva" });
      return;
    }

    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setRecordingStream(stream);

      // Iniciar cuenta regresiva 3, 2, 1
      setIsCountingDown(true);
      setCountdownVal(3);

      let count = 3;
      const countInterval = setInterval(() => {
        count--;
        setCountdownVal(count);
        if (count <= 0) {
          clearInterval(countInterval);
          setIsCountingDown(false);
          startActualRecording(stream);
        }
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMessage("No se pudo acceder al micrófono. Por favor permite el acceso en el navegador.");
    }
  };

  const startActualRecording = (stream: MediaStream) => {
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm",
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.start(250);
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 15) {
          stopRecordingAndAnalyze();
          return 15;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecordingAndAnalyze = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (recordingStream) {
      recordingStream.getTracks().forEach((track) => track.stop());
      setRecordingStream(null);
    }

    setIsAnalyzing(true);

    setTimeout(async () => {
      const recordedType = mediaRecorderRef.current?.mimeType || "audio/webm";
      const audioBlob = new Blob(audioChunksRef.current, { type: recordedType });
      await sendAudioToApi(audioBlob);
    }, 400);
  };

  const sendAudioToApi = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      const audioExtension = audioBlob.type.includes("wav") ? "wav" : "webm";
      formData.append("audio", audioBlob, `diagnostico-15s.${audioExtension}`);

      const res = await fetch("/api/analysis", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setAnalysisResult(json.data);
      } else {
        setErrorMessage(json.error || "No se pudo procesar el análisis de voz.");
      }
    } catch (err) {
      console.error("Error enviando audio a /api/analysis:", err);
      setErrorMessage("Error de conexión al servidor durante el análisis bioacústico.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
    setRecordingSeconds(0);
    setIsRecording(false);
    setIsAnalyzing(false);
  };

  return (
    <main className="bg-space text-white min-h-screen flex flex-col justify-between p-4 font-sans selection:bg-amber-500/30 overflow-x-hidden" suppressHydrationWarning>
      {/* COUNTDOWN OVERLAY */}
      {isCountingDown && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[1000] flex items-center justify-center animate-bounce-in pointer-events-none">
          <div className="text-[35vw] md:text-[20rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 drop-shadow-[0_0_80px_rgba(245,158,11,0.6)]">
            {countdownVal}
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between p-4 max-w-2xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" suppressHydrationWarning>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span>Inicio</span>
        </Link>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <div className={`size-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-emerald-400"}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 font-mono">
            {isRecording ? `0:${recordingSeconds.toString().padStart(2, "0")} / 0:15` : "DIAGNÓSTICO 15S"}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto flex flex-col items-center text-center space-y-7 py-4 flex-1 justify-center">
        {/* VISTA 1: ANTES DE GRABAR */}
        {!isRecording && !isAnalyzing && !analysisResult && (
          <>
            {/* === SECCIÓN DE MICRÓFONO CON LLAMA ANIMADA === */}
            <div className="fire-orb-container my-1">
              <div className="fire-ambient"></div>
              <div className="fire-ring-1"></div>
              <div className="fire-ring-2"></div>
              <div className="fire-ring-core"></div>

              <button
                onClick={handleStartDiagnostic}
                aria-label="Iniciar grabación de diagnóstico de voz"
                className="relative z-10 w-44 h-44 rounded-full bg-gradient-to-b from-[#131b2e] to-[#1a131c] border border-amber-300/30 shadow-[inset_0_0_25px_rgba(0,0,0,0.85)] flex items-center justify-center group focus:outline-none transition-transform duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <div className="absolute inset-2.5 rounded-full border border-amber-400/20 pointer-events-none"></div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.6"
                  stroke="currentColor"
                  className="w-14 h-14 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)] group-hover:scale-110 transition-transform duration-300"
                  suppressHydrationWarning
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 0 3-3V4.5a3 3 0 1 0-6 0v8.25a3 3 0 0 0 3 3Z"
                  />
                </svg>
              </button>
            </div>

            {/* Título y Descripción */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide uppercase">
                <span className="text-white">HABLA </span>
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  15 SEGUNDOS
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-300/90 font-light max-w-sm px-2">
                Nuestra Inteligencia Artificial medirá tus pausas, ritmo y consistencia en tiempo real.
              </p>
            </div>

            {/* Tarjeta del Tema a Responder (Glassmorphism) */}
            <div className="w-full bg-slate-800/35 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-left relative overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

              <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase block mb-1.5">
                Tema para responder:
              </span>
              <p className="text-sm md:text-base text-slate-100 italic leading-relaxed">
                “¿A qué te dedicas y cuál es tu mayor reto al hablar en reuniones o presentaciones?”
              </p>
            </div>

            {/* Indicadores / Métricas */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs pt-1">
              {/* Ritmo WPM */}
              <button
                type="button"
                className="group flex flex-col items-center space-y-2 transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                aria-label="Indicador Ritmo WPM"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] group-hover:border-cyan-400">
                  <svg className="w-6 h-6 text-cyan-400 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" suppressHydrationWarning>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-300 group-hover:text-cyan-300 uppercase transition-colors duration-300">
                  Ritmo WPM
                </span>
              </button>

              {/* Pausas */}
              <button
                type="button"
                className="group flex flex-col items-center space-y-2 transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                aria-label="Indicador Pausas"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] group-hover:border-amber-400">
                  <svg className="w-6 h-6 text-amber-400 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" suppressHydrationWarning>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-300 group-hover:text-amber-300 uppercase transition-colors duration-300">
                  Pausas
                </span>
              </button>

              {/* Autoridad */}
              <button
                type="button"
                className="group flex flex-col items-center space-y-2 transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                aria-label="Indicador Autoridad"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] group-hover:border-emerald-400">
                  <svg className="w-6 h-6 text-emerald-400 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" suppressHydrationWarning>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-300 group-hover:text-emerald-300 uppercase transition-colors duration-300">
                  Autoridad
                </span>
              </button>
            </div>

            {/* Botón de texto alternativo */}
            <div className="pt-2 w-full max-w-xs">
              <button
                onClick={handleStartDiagnostic}
                className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider glow-button hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                {isAuthenticated ? "Tocar para Iniciar (15s)" : "Conectar y Probar Gratis"}
              </button>
            </div>
          </>
        )}

        {/* VISTA 2: GRABANDO (ORBE EN VIVO CON AUDIOVISUALIZER) */}
        {isRecording && (
          <div className="space-y-7 animate-fade-in w-full max-w-sm">
            <div className="fire-orb-container my-2">
              <div className="fire-ambient"></div>
              <div className="fire-ring-1"></div>
              <div className="fire-ring-2"></div>
              <div className="fire-ring-core"></div>

              {/* Centro de la llama con el visualizador en tiempo real */}
              <div className="relative z-10 w-44 h-44 rounded-full bg-[#05070a] border border-amber-300/40 shadow-[inset_0_0_25px_rgba(0,0,0,0.85)] flex items-center justify-center overflow-hidden">
                <AudioVisualizer stream={recordingStream} isActive={true} />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xl md:text-2xl font-mono font-black text-amber-400 tracking-wider block">
                🔴 GRABANDO: {recordingSeconds}s / 15s
              </span>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${(recordingSeconds / 15) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-300">
                Responde con naturalidad. Se detendrá automáticamente a los 15s.
              </p>
            </div>

            <button
              onClick={stopRecordingAndAnalyze}
              className="px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" suppressHydrationWarning>
                <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
              </svg>
              Finalizar y Ver Auditoría
            </button>
          </div>
        )}

        {/* VISTA 3: PROCESANDO AUDITORÍA */}
        {isAnalyzing && (
          <div className="p-8 bg-[#090C10]/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl space-y-4 max-w-md w-full animate-fade-in shadow-2xl">
            <div className="fire-orb-container mx-auto my-2 !w-32 !h-32">
              <div className="fire-ambient"></div>
              <div className="fire-ring-1"></div>
              <div className="fire-ring-core"></div>
              <div className="relative z-10 w-24 h-24 rounded-full bg-[#05070a] flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" suppressHydrationWarning>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-base font-black uppercase tracking-wider text-white">
              Decodificando Señal Bioacústica...
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed font-mono">
              Calculando ritmo, pausas y nivel de autoridad con IA...
            </p>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-mono max-w-md w-full">
            ⚠️ {errorMessage}
            <div className="mt-3">
              <button
                onClick={handleReset}
                className="px-4 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg text-xs font-bold uppercase transition cursor-pointer"
              >
                Volver a intentar
              </button>
            </div>
          </div>
        )}

        {/* VISTA 4: RESULTADO Y AUDITORÍA DE VÍCTOR MARTÍNEZ */}
        {analysisResult && (
          <div className="bg-[#090C10]/95 border border-amber-500/30 rounded-3xl p-6 md:p-8 text-left space-y-6 shadow-2xl backdrop-blur-xl w-full max-w-xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white">Tu Diagnóstico Vocal</h2>
                <p className="text-xs text-slate-400">Auditoría real de tu grabación de 15 segundos</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                ✓ Completado
              </span>
            </div>

            {/* Score Global */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
              <span className="text-[10px] font-black tracking-[0.25em] text-amber-400 uppercase block">
                Índice de Autoridad Vocal
              </span>
              <div className="flex items-baseline justify-center gap-2 my-1">
                <span className="text-6xl font-black text-white tracking-tighter">
                  {analysisResult.authorityScore.score}
                </span>
                <span className="text-xl font-bold text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Nivel diagnosticado:{" "}
                <strong className="text-amber-400 uppercase">
                  {analysisResult.authorityScore.level}
                </strong>
              </p>
            </div>

            {/* Comparativa Bioacústica con el Arquetipo Objetivo */}
            {analysisResult.archetypeComparison && (
              <div className="p-5 rounded-2xl bg-[#0c1424] border border-cyan-500/30 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                      DISTANCIA A TU ARQUETIPO DESTINO
                    </span>
                    <h3 className="text-base font-black text-white">
                      {analysisResult.archetypeComparison.targetArchetype.name} ({analysisResult.archetypeComparison.targetArchetype.code})
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {analysisResult.archetypeComparison.matchScore}% AFINIDAD
                    </span>
                    <span className="block text-[9px] font-mono text-slate-400">
                      BRECHA: {analysisResult.archetypeComparison.distancePercent}%
                    </span>
                  </div>
                </div>

                {/* Barra de Afinidad / Distancia */}
                <div className="space-y-1">
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-1000"
                      style={{ width: `${analysisResult.archetypeComparison.matchScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Voz Actual</span>
                    <span>Cuello de Botella: <strong className="text-rose-400">{analysisResult.archetypeComparison.bottleneckDimension}</strong></span>
                    <span>Arquetipo 100%</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 space-y-1">
                  <p>
                    <strong className="text-amber-300">Prescripción de Calibración:</strong>{" "}
                    {analysisResult.archetypeComparison.targetArchetype.actionablePrescription}
                  </p>
                  <p className="text-[11px] text-cyan-300 font-mono pt-1 border-t border-white/5">
                    🎯 Foco: {analysisResult.archetypeComparison.targetArchetype.recommendedTrainingFocus}
                  </p>
                </div>
              </div>
            )}

            {/* Métricas clave */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Ritmo WPM
                </span>
                <span className="text-base font-black text-white">
                  {analysisResult.metrics.wordsPerMinute}
                </span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Pausas
                </span>
                <span className="text-base font-black text-amber-400">
                  {analysisResult.metrics.pauseCount}
                </span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Duración
                </span>
                <span className="text-base font-black text-cyan-400">
                  {analysisResult.metrics.avgPauseDuration.toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Diagnóstico pedagógico */}
            {analysisResult.feedback && (
              <div className="space-y-2 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-xs leading-relaxed text-slate-300">
                <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Diagnóstico del Entrenador
                </h4>
                <p><strong>Observación:</strong> {analysisResult.feedback.diagnostico}</p>
                <p><strong>Decisión Táctica:</strong> {analysisResult.feedback.decision}</p>
                <p><strong>Impacto:</strong> {analysisResult.feedback.payoff}</p>
              </div>
            )}

            {/* Prescripción */}
            {analysisResult.coaching?.prescription?.primaryExercise && (
              <div className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-400/30 rounded-2xl space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                  🎯 Tu entrenamiento correctivo recomendado
                </span>
                <h3 className="text-sm font-bold text-white">
                  {analysisResult.coaching.prescription.primaryExercise.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.coaching.prescription.primaryExercise.instruction}
                </p>
              </div>
            )}

            {/* Botones finales */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition text-center cursor-pointer"
              >
                Probar otra vez
              </button>
              <Link
                href="/gym"
                className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition text-center shadow-lg shadow-amber-400/20"
              >
                Gimnasio Vocal →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-slate-500 border-t border-white/5">
        © {new Date().getFullYear()} Oratoria Efectiva · Diagnóstico Vocal de 15 Segundos
      </footer>
    </main>
  );
}
