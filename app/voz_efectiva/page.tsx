"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        customRoute: string;
      };
    };
    adaptiveNextStep: {
      stepTitle: string;
      stepDescription: string;
      recommendedRoute: string;
    };
  };
}

export default function DiagnosticoGratuitoPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetryingSave, setIsRetryingSave] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // WebAudio Aureal Meter States
  const [volumeLevel, setVolumeLevel] = useState<number>(0.15);
  const [bassLevel, setBassLevel] = useState<number>(45);
  const [midsLevel, setMidsLevel] = useState<number>(75);
  const [highsLevel, setHighsLevel] = useState<number>(60);
  const [frequencyBars, setFrequencyBars] = useState<number[]>([30, 45, 60, 80, 65, 50, 70, 90, 85, 60, 40, 55, 75, 50, 35, 20]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const startFreeDiagnostic = async () => {
    setErrorMessage(null);
    setAnalysisResult(null);
    audioChunksRef.current = [];

    // Tracking event
    fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({ eventType: 'diagnostic_started', source: 'youtube_cta' }),
    }).catch(() => {});

    let microphoneStream: MediaStream | null = null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStream = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // WebAudio Analyser for Aureal Meter & 3 Frequency Bands
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtxClass();
        audioCtxRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateMeter = () => {
          analyser.getByteFrequencyData(dataArray);
          
          let sum = 0;
          let bassSum = 0;
          let midsSum = 0;
          let highsSum = 0;

          // Band 1: Graves (0 to 3 bins ~ 60 - 250 Hz)
          for (let i = 0; i < 4 && i < dataArray.length; i++) {
            bassSum += dataArray[i];
            sum += dataArray[i];
          }
          // Band 2: Medios (4 to 10 bins ~ 250 - 2000 Hz)
          for (let i = 4; i < 11 && i < dataArray.length; i++) {
            midsSum += dataArray[i];
            sum += dataArray[i];
          }
          // Band 3: Agudos (11 to 20 bins ~ 2000 - 8000 Hz)
          for (let i = 11; i < 20 && i < dataArray.length; i++) {
            highsSum += dataArray[i];
            sum += dataArray[i];
          }

          const avg = sum / (dataArray.length || 1);
          const normVol = Math.min(1, Math.max(0.05, avg / 128));
          setVolumeLevel(normVol);

          setBassLevel(Math.min(100, Math.round(((bassSum / 4) / 255) * 100)));
          setMidsLevel(Math.min(100, Math.round(((midsSum / 7) / 255) * 100)));
          setHighsLevel(Math.min(100, Math.round(((highsSum / 9) / 255) * 100)));

          const bars = Array.from(dataArray.slice(0, 16)).map(val => Math.round((val / 255) * 100));
          setFrequencyBars(bars);

          animFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      } catch (audioErr) {
        console.warn("WebAudio Analyser error:", audioErr);
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 15) {
            stopRecordingAndAnalyze();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn("Microphone access unavailable or blocked.", err);
      microphoneStream?.getTracks().forEach((track) => track.stop());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
      setIsRecording(false);
      setIsAnalyzing(false);
      setErrorMessage("No se pudo acceder al micrófono. Habilita el permiso del navegador y vuelve a intentarlo.");
    }
  };

  const stopRecordingAndAnalyze = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
    }

    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    setIsAnalyzing(true);

    // Wait short moment for last data chunk
    setTimeout(async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      await sendAudioToApi(audioBlob);
    }, 400);
  };

  const sendAudioToApi = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      const audioExtension = audioBlob.type.includes('wav') ? 'wav'
        : audioBlob.type.includes('mp4') ? 'mp4'
        : audioBlob.type.includes('mp3') ? 'mp3'
        : 'webm';
      formData.append('audio', audioBlob, `grabacion-oratoria.${audioExtension}`);

      const res = await fetch('/api/analysis', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisResult(json.data);
      } else {
        setErrorMessage(json.error || 'No se pudo procesar el análisis de voz.');
      }
    } catch (err) {
      console.error("Error enviando audio a /api/analysis:", err);
      setErrorMessage("Error de conexión al servidor durante el análisis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070A] text-white font-display flex flex-col items-center justify-center px-6 py-12 selection:bg-amber-500/30 relative overflow-hidden">
      
      {/* Studio Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-96 h-96 bg-blue-900/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10 w-full">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          DIAGNÓSTICO VOCAL DE 15 SEGUNDOS
        </div>

        {/* Headlines */}
        {!analysisResult && (
          <>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
              ¿Quieres saber cuál es el principal problema <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                que limita tu forma de hablar?
              </span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base font-medium max-w-lg mx-auto leading-relaxed">
              Sin registros ni contraseñas. Habla durante 15 segundos y la IA analizará tus pausas, ritmo y algunas características vocales.
            </p>
          </>
        )}

        {/* Record Trigger & Status */}
        <div className="pt-2 space-y-4 w-full">
          {!isRecording && !isAnalyzing && !analysisResult && (
            <button
              onClick={startFreeDiagnostic}
              className="px-10 py-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-2xl font-black text-lg text-slate-950 uppercase tracking-widest shadow-[0_0_50px_-10px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto border border-amber-300/40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-3xl">mic</span>
              Iniciar Escáner Gratuito
            </button>
          )}

          {/* 🌟 MEDIDOR MODERNO TIPO AUREAL MULTICOLOR (GRAVES, MEDIOS Y AGUDOS) 🌟 */}
          {isRecording && (
            <div className="p-8 bg-[#090C10]/95 border border-amber-500/40 rounded-[36px] space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col items-center">
              
              {/* Outer Aureal Multicolor Glow Rings */}
              <div className="relative size-48 md:size-56 flex items-center justify-center my-2">
                
                {/* 1. Dynamic Conic Rainbow Halo Ring (Pulsing with sound volume) */}
                <div 
                  className="absolute inset-0 rounded-full opacity-70 blur-xl transition-transform duration-75 pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg, #F59E0B, #EC4899, #8B5CF6, #3B82F6, #10B981, #F59E0B)',
                    transform: `scale(${1 + volumeLevel * 0.45}) rotate(${recordingSeconds * 20}deg)`,
                  }}
                />

                {/* 2. Concentric Neon Ring */}
                <div 
                  className="absolute inset-2 rounded-full border-2 border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-pulse"
                  style={{
                    transform: `scale(${1 + volumeLevel * 0.25})`,
                  }}
                />

                {/* 3. Center Obsidian Microphone Orb */}
                <div className="relative size-32 md:size-36 rounded-full bg-[#05070A] border border-amber-400/40 flex flex-col items-center justify-center shadow-2xl z-10 space-y-1">
                  <span 
                    className="material-symbols-outlined text-4xl md:text-5xl text-amber-400 transition-transform duration-75"
                    style={{ transform: `scale(${1 + volumeLevel * 0.3})` }}
                  >
                    mic
                  </span>
                  <span className="text-[10px] font-mono font-black text-amber-300 tracking-widest uppercase">
                    {Math.round(volumeLevel * 100)}% SEÑAL
                  </span>
                </div>
              </div>

              {/* 🎚️ 3-BAND FREQUENCY MONITOR: GRAVES, MEDIOS & AGUDOS 🎚️ */}
              <div className="w-full max-w-md grid grid-cols-3 gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                
                {/* 1. GRAVES (BASS: 60 - 250 Hz) */}
                <div className="flex flex-col items-center space-y-1.5 text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <span>🎸</span> GRAVES
                  </span>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-amber-500/30">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-75"
                      style={{ width: `${bassLevel}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-300">{bassLevel}%</span>
                  <span className="text-[9px] text-slate-400 font-medium">60-250 Hz</span>
                </div>

                {/* 2. MEDIOS (MIDS: 250 - 2000 Hz) */}
                <div className="flex flex-col items-center space-y-1.5 text-center border-x border-white/10 px-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
                    <span>🎙️</span> MEDIOS
                  </span>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-rose-500/30">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-400 transition-all duration-75"
                      style={{ width: `${midsLevel}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-rose-300">{midsLevel}%</span>
                  <span className="text-[9px] text-slate-400 font-medium">250-2k Hz</span>
                </div>

                {/* 3. AGUDOS (HIGHS: 2000 - 8000 Hz) */}
                <div className="flex flex-col items-center space-y-1.5 text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1">
                    <span>⚡</span> AGUDOS
                  </span>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-blue-500/30">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 transition-all duration-75"
                      style={{ width: `${highsLevel}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-blue-300">{highsLevel}%</span>
                  <span className="text-[9px] text-slate-400 font-medium">2k-8k Hz</span>
                </div>

              </div>

              {/* 16-Bar Iridescent Radial Equalizer Waveform */}
              <div className="w-full max-w-sm flex items-end justify-center gap-1.5 h-14 pt-1">
                {frequencyBars.map((height, idx) => (
                  <div 
                    key={idx}
                    className="w-2.5 rounded-full transition-all duration-75 bg-gradient-to-t from-amber-500 via-rose-500 to-cyan-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                    style={{ 
                      height: `${Math.max(15, height)}%`,
                      opacity: 0.4 + (height / 100) * 0.6
                    }}
                  />
                ))}
              </div>

              {/* Audio Signal Status & Clock */}
              <div className="space-y-1 text-center">
                <span className="text-amber-400 font-mono text-lg md:text-xl font-black uppercase tracking-widest block">
                  🔴 GRABANDO SEÑAL BIOACÚSTICA: {recordingSeconds}s / 15s
                </span>
                <p className="text-slate-300 text-xs font-medium max-w-md mx-auto leading-relaxed">
                  Habla normalmente respondiendo: <br />
                  <span className="text-amber-200 italic font-semibold">"¿A qué te dedicas y cuál es tu mayor reto al hablar?"</span>
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={stopRecordingAndAnalyze}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-amber-300/40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">square</span>
                Finalizar Grabación y Ver Auditoría
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="p-8 bg-[#090C10] border border-amber-500/20 rounded-3xl space-y-3">
              <span className="material-symbols-outlined text-4xl text-amber-400 animate-spin">sync</span>
              <h3 className="text-lg font-bold uppercase tracking-wider">Procesando Bioacústica y Cuello de Botella...</h3>
              <p className="text-slate-400 text-xs font-mono">Decodificando PCM Float32, analizando varianza espectral y consultando motor adaptativo...</p>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-mono">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* --- AUDITORÍA DE TU DIAGNÓSTICO (ESTRUCTURA DE 3 NIVELES - ENTRENADOR PERSONAL) --- */}
          {analysisResult && (
            <div className="bg-[#090C10]/95 border border-amber-500/30 rounded-[36px] p-6 md:p-8 text-left space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              
              {/* Encabezado y Estado de Persistencia */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-3">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white">Tu Diagnóstico Vocal</h2>
                  <p className="text-xs text-slate-400 font-medium">Análisis de tu grabación de 15 segundos</p>
                </div>

                <div className="flex items-center gap-2">
                  {analysisResult.persistence.persisted ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                      <span>✓</span> Sesión guardada
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <span>⚠️</span> Sesión pendiente de guardar
                      </span>
                      <button
                        onClick={async () => {
                          setIsRetryingSave(true);
                          try {
                            const res = await fetch('/api/coaching/retry-save', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ analysisData: analysisResult }),
                            });
                            const json = await res.json();
                            if (json.success && json.persisted) {
                              setAnalysisResult(prev => prev ? {
                                ...prev,
                                persistence: { ...prev.persistence, persisted: true }
                              } : null);
                            }
                          } catch (err) {
                            console.error("Error reintentando guardado:", err);
                          } finally {
                            setIsRetryingSave(false);
                          }
                        }}
                        disabled={isRetryingSave}
                        className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
                      >
                        {isRetryingSave ? 'Guardando...' : 'Reintentar Guardar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* NIVEL 1 — RESULTADO: ÍNDICE GLOBAL DE AUTORIDAD */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-500/10 px-3 py-1 rounded-bl-2xl border-l border-b border-amber-500/30">
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">{analysisResult.authorityScore.level}</span>
                </div>

                <span className="text-[10px] font-black tracking-[0.25em] text-amber-400 uppercase block">
                  TU ÍNDICE DE AUTORIDAD
                </span>
                <div className="flex items-baseline justify-center gap-2 my-1">
                  <span className="text-6xl font-black text-white tracking-tighter">
                    {analysisResult.authorityScore.score}
                  </span>
                  <span className="text-xl font-bold text-slate-400">/ 100</span>
                </div>
                <p className="text-xs text-slate-400 font-medium max-w-md mx-auto pt-1 leading-relaxed">
                  Una referencia global para seguir tu evolución, no una medida absoluta de tu capacidad para comunicar.
                </p>
              </div>

              {/* NIVEL 2 — TUS HABILIDADES AL HABLAR */}
              <div className="space-y-4 pt-1">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">graphic_eq</span>
                  Tus habilidades al hablar
                </h3>

                <div className="space-y-3">
                  
                  {/* 1. Consistencia vocal */}
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-white uppercase">Consistencia vocal</span>
                      <span className="text-amber-400 font-mono font-black">{analysisResult.metricExplanations.fuerzaVocal.valueFormatted}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-amber-500/20">
                      {analysisResult.metrics.energyStability !== null ? (
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                          style={{ width: `${Math.max(0, Math.min(100, analysisResult.metrics.energyStability * 100))}%` }}
                        />
                      ) : (
                        <span className="block text-[10px] text-slate-400 px-2">Medición no disponible</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{analysisResult.metricExplanations.fuerzaVocal.explanation}</p>
                  </div>

                  {/* 3. Variación de entonación */}
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-white uppercase">Variación de entonación</span>
                      <span className="text-amber-400 font-mono font-black">{analysisResult.metricExplanations.dinamicaEntonacion.valueFormatted}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{analysisResult.metricExplanations.dinamicaEntonacion.explanation}</p>
                  </div>

                  {/* 4. Claridad espectral */}
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-white uppercase">Claridad espectral</span>
                      <span className="text-amber-400 font-mono font-black">{analysisResult.metricExplanations.estabilidadEspectral.valueFormatted}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-amber-500/20">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500" 
                        style={{ width: `${analysisResult.metrics.spectralBand3Score !== null ? Math.max(0, Math.min(100, analysisResult.metrics.spectralBand3Score)) : 0}%` }} 
                      />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{analysisResult.metricExplanations.estabilidadEspectral.explanation}</p>
                  </div>

                  {/* 5. Ritmo al hablar (Estimación bioacústica) */}
                  {analysisResult.metricExplanations.ritmoHabla && (
                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-white uppercase">Ritmo al hablar</span>
                        <span className="text-amber-400 font-mono font-black">{analysisResult.metricExplanations.ritmoHabla.valueFormatted}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">{analysisResult.metricExplanations.ritmoHabla.explanation}</p>
                    </div>
                  )}

                </div>
              </div>

              {/* NIVEL 3 — DETALLES TÉCNICOS ("¿CÓMO LO MEDIMOS?") */}
              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="flex items-center justify-between w-full text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors uppercase tracking-wider py-2 px-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-amber-400">tune</span>
                    ¿Cómo lo medimos? (Detalles técnicos y limitaciones)
                  </span>
                  <span className="material-symbols-outlined">{showTechnicalDetails ? 'expand_less' : 'expand_more'}</span>
                </button>

                {showTechnicalDetails && (
                  <div className="mt-3 p-5 bg-slate-950 rounded-2xl border border-white/10 space-y-3 text-xs text-slate-300 animate-fade-in">
                    <div>
                      <strong className="text-amber-400 uppercase tracking-wide block mb-0.5">Consistencia Vocal (RMS):</strong>
                      <p className="text-[11px] leading-relaxed">{analysisResult.metricExplanations.fuerzaVocal.explanation}</p>
                      <p className="text-[10px] text-slate-500 italic border-l border-amber-500/40 pl-2 mt-1">{analysisResult.metricExplanations.fuerzaVocal.limitations}</p>
                    </div>

                    <div className="border-t border-white/5 pt-2">
                      <strong className="text-amber-400 uppercase tracking-wide block mb-0.5">Variación de Entonación (ΔF0 - YIN):</strong>
                      <p className="text-[11px] leading-relaxed">{analysisResult.metricExplanations.dinamicaEntonacion.explanation}</p>
                      <p className="text-[10px] text-slate-500 italic border-l border-amber-500/40 pl-2 mt-1">{analysisResult.metricExplanations.dinamicaEntonacion.limitations}</p>
                    </div>

                    <div className="border-t border-white/5 pt-2">
                      <strong className="text-amber-400 uppercase tracking-wide block mb-0.5">Claridad Espectral (FFT 1024):</strong>
                      <p className="text-[11px] leading-relaxed">{analysisResult.metricExplanations.estabilidadEspectral.explanation}</p>
                      <p className="text-[10px] text-slate-500 italic border-l border-amber-500/40 pl-2 mt-1">{analysisResult.metricExplanations.estabilidadEspectral.limitations}</p>
                    </div>

                    {analysisResult.metricExplanations.ritmoHabla && (
                      <div className="border-t border-white/5 pt-2">
                        <strong className="text-amber-400 uppercase tracking-wide block mb-0.5">Ritmo al Hablar (Sílabas / Minuto):</strong>
                        <p className="text-[11px] leading-relaxed">{analysisResult.metricExplanations.ritmoHabla.explanation}</p>
                        <p className="text-[10px] text-slate-500 italic border-l border-amber-500/40 pl-2 mt-1">{analysisResult.metricExplanations.ritmoHabla.limitations}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* TU FOCO DE MEJORA Y MISIÓN DE HOY */}
              <div className="bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 text-slate-950 p-6 md:p-7 rounded-3xl space-y-5 border border-amber-300/40 shadow-[0_0_50px_-10px_rgba(245,158,11,0.3)]">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-950 block">
                    🎯 TU FOCO DE MEJORA
                  </span>
                  <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-950 leading-tight">
                    {analysisResult.coaching.prescription.primaryExercise.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-900/90 leading-relaxed">
                    {analysisResult.coaching.prescription.primaryExercise.explanation}
                  </p>
                </div>

                <div className="bg-slate-950/25 p-4 rounded-2xl border border-slate-950/20 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-950 block">
                    Tu misión de hoy · 3 minutos
                  </span>
                  <p className="text-xs font-semibold text-slate-950 leading-relaxed">
                    Lee un párrafo en voz alta. Antes de la idea más importante, haz una pausa breve de 2 segundos y continúa con firmeza.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 pt-1">
                  <button
                    onClick={() => router.push(analysisResult.coaching.prescription.primaryExercise.customRoute || '/listen')}
                    className="flex-1 py-4 bg-slate-950 text-amber-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 shadow-xl border border-amber-400/30 cursor-pointer"
                  >
                    <span>Entrenar esta habilidad</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>

                  <button
                    onClick={startFreeDiagnostic}
                    className="py-4 px-6 bg-slate-900/20 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900/30 transition-colors border border-slate-950/20 cursor-pointer"
                  >
                    Volver a Grabar
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Value Proposition */}
        {!analysisResult && (
          <div className="grid grid-cols-3 gap-4 pt-8 text-center text-slate-500 text-[10px] font-mono uppercase tracking-widest border-t border-white/5">
            <div>⚡ Sin Registro</div>
            <div>🎯 Diagnóstico Inmediato</div>
            <div>🏋️ Misión Adaptativa</div>
          </div>
        )}

      </div>
    </main>
  );
}
