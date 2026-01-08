"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logEvent } from "@/lib/events/logEvent";
import { recordPractice } from "@/lib/streaks/streakSystem";
import CircularProgress from "@/components/voice/CircularProgress";

/**
 * Contrato único de salida del análisis
 */
type AnalysisResult = {
  transcription: string;
  transcriptionWithSilences?: string;
  authorityScore: {
    score: number;
    level?: "LOW" | "MEDIUM" | "HIGH";
  };
  metrics?: {
    wordsPerMinute: number;
    avgPauseDuration: number;
    pauseCount: number;
    fillerCount: number;
    pitchVariation: number;
    energyStability: number;
    repetitionCount: number;
    strategicPauses: number;
    awkwardSilences: number;
    paceVariability: number;
    avgSentenceLength: number;
    longSentences: number;
    rhythmConsistency: number;
    fallingIntonationScore?: number;
    pitchRange?: number;
  };
  postureMetrics?: {
    postureScore: number;
    shouldersLevel: "balanced" | "uneven";
    headPosition: "centered" | "tilted_left" | "tilted_right";
    eyeContactPercent: number;
    gesturesUsage: "low" | "optimal" | "excessive";
    nervousnessIndicators: {
      closedFists: number;
      handsHidden: number;
      excessiveMovement: boolean;
    };
  };
  rephrase_optimized?: string;
  score_estructura?: number;
  durationSeconds?: number;
  diagnosis: string;
  score_seguridad?: number;
  score_claridad?: number;
  score_postura?: number;
  strengths: string[];
  weaknesses: string[];
  decision: string;
  payoff: string;
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [streakUpdated, setStreakUpdated] = useState(false);

  useEffect(() => {
    const savedResult = localStorage.getItem("voiceAnalysisResult");
    if (!savedResult) {
      router.push("/practice");
      return;
    }
    
    try {
      const analysisResult = JSON.parse(savedResult);
      setResult(analysisResult);
      logEvent("analysis_viewed");
      
      if (!streakUpdated) {
        recordPractice();
        setStreakUpdated(true);
      }
    } catch (e) {
      router.push("/practice");
    }
  }, [router, streakUpdated]);

  if (!result) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-500">Cargando Coach...</div>;

  const claridad = result.score_claridad || 50;
  const autoridad = result.authorityScore.score || 0;
  const postura = result.postureMetrics?.postureScore || 0;
  const estructura = result.score_estructura || 60; // Default if missing

  return (
    <main className="min-h-[100dvh] bg-[#050505] text-white font-display overflow-x-hidden antialiased flex justify-center selection:bg-blue-500/30">
      
      {/* 🌌 DYNAMIC BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative z-10 mobile-container flex flex-col min-h-[100dvh] px-0">
        
        {/* Header (Glassmorphism) */}
        <div className="flex items-center p-4 justify-between sticky top-0 z-50 bg-[#050505]/40 backdrop-blur-xl border-b border-white/5">
          <button onClick={() => router.push("/practice")} className="flex size-10 items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-white active:scale-95">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Reporte de Análisis</h2>
            <p className="text-sm font-bold tracking-tight">Oratoria Efectiva</p>
          </div>
          <button className="flex size-10 items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-slate-500">
            <span className="material-symbols-outlined text-sm">more_vert</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-32 px-6 custom-scrollbar scroll-smooth">
          
          {/* 1. MOCKUP STYLE: HERO SCORE CIRCLES */}
          <div className="mt-10 mb-12 flex flex-col items-center">
             <div className="relative mb-12">
               <CircularProgress 
                  value={autoridad}
                  size={190}
                  strokeWidth={12}
                  color="#3b82f6"
                  label="Nivel de Autoridad"
                  subValue="Impacto y Seguridad"
                  icon="verified"
               />
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/40">
                  Verificado por IA
               </div>
             </div>

             <div className="grid grid-cols-3 gap-4 w-full max-w-[340px]">
                <CircularProgress 
                  value={claridad}
                  size={90}
                  strokeWidth={6}
                  color="#10b981"
                  label="Claridad"
                  icon="graphic_eq"
                />
                <CircularProgress 
                  value={estructura}
                  size={90}
                  strokeWidth={6}
                  color="#f59e0b"
                  label="Estructura"
                  icon="architecture"
                />
                <CircularProgress 
                  value={postura}
                  size={90}
                  strokeWidth={6}
                  color="#a855f7"
                  label="Corporal"
                  icon="accessibility_new"
                />
             </div>
          </div>

          {/* 2. Diagnosis (Premium Card) */}
          <div className="relative p-6 rounded-[32px] bg-white/[0.03] border border-white/5 backdrop-blur-md mb-8 overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <span className="material-symbols-outlined text-6xl text-blue-500">psychology</span>
            </div>
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Diagnóstico IA</h3>
            <p className="text-xl font-bold leading-tight text-white mb-4 relative z-10">
              {result.diagnosis}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Feedback Completo</span>
            </div>
          </div>

          {/* 3. ✨ NEW: MESSAGE RE-ENGINEERING (The WOW Moment) */}
          {result.rephrase_optimized && (
            <div className="mb-10 animate-fade-in-up">
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] px-2 mb-4 text-center">
                 Reformulación del Mensaje
              </h3>
              <div className="bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-[32px] p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-20">
                    <span className="material-symbols-outlined text-6xl text-amber-500">auto_fix_high</span>
                 </div>
                 
                 <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-2">Versión Optimizada (Nivel CEO)</p>
                 <p className="text-lg text-white font-medium italic leading-relaxed relative z-10">
                    "{result.rephrase_optimized}"
                 </p>
                 
                 <div className="mt-4 pt-4 border-t border-amber-500/20 flex gap-3 text-amber-200/50 text-xs">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">remove_circle</span> -40% Palabras</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bolt</span> +80% Impacto</span>
                 </div>
              </div>
            </div>
          )}

          {/* 3. Action Step (The Payoff) */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 rounded-[32px] p-0.5 shadow-2xl shadow-blue-500/20 mb-10 transform hover:scale-[1.02] transition-transform">
             <div className="bg-[#050505]/60 backdrop-blur-xl rounded-[30px] p-7 h-full">
                <div className="flex items-center gap-2 mb-4">
                   <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-yellow-400 text-lg">bolt</span>
                   </div>
                   <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Plan Estratégico</h4>
                </div>
                <p className="text-xl font-black text-white mb-4 leading-tight italic">
                   "{result.decision}"
                </p>
                <div className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/5">
                   <span className="material-symbols-outlined text-green-400">trending_up</span>
                   <div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Impacto Esperado</p>
                     <p className="text-sm text-blue-100 font-medium leading-relaxed">
                        {result.payoff}
                     </p>
                   </div>
                </div>
             </div>
          </div>

          {/* Technical Breakdown Title */}
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 mb-6 text-center">Desglose Técnico</h3>

          {/* 4. Detailed Metrics Section */}
          <div className="space-y-8 mb-12">
            
            {/* VOZ Y RITMO */}
            <section id="detailed-voice" className="space-y-4">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest pl-1">Voz & Ritmo</h3>
              <div className="bg-white/[0.02] rounded-[24px] border border-white/5 p-5 space-y-4 backdrop-blur-sm">
                <MetricRow 
                  label="Velocidad de habla" 
                  value={`${result.metrics?.wordsPerMinute || 0} ppm`} 
                  desc="Ideal: 140-160 palabras por minuto." 
                  status={ (result.metrics?.wordsPerMinute || 0) > 170 ? 'exceso' : (result.metrics?.wordsPerMinute || 0) < 110 ? 'bajo' : 'optimo' }
                />
                <MetricRow 
                  label="Pausas Estratégicas" 
                  value={String(result.metrics?.strategicPauses || 0)} 
                  desc="Silencios intencionados para enfatizar." 
                  status={ (result.metrics?.strategicPauses || 0) > 0 ? 'optimo' : 'bajo' }
                />
                <MetricRow 
                  label="Estabilidad de Energía" 
                  value={`${Math.round((result.metrics?.energyStability || 0) * 100)}%`} 
                  desc="Capacidad de mantener un volumen constante." 
                  status={ (result.metrics?.energyStability || 0) > 0.7 ? 'optimo' : 'bajo' }
                />
              </div>
            </section>

            {/* CUERPO Y PRESENCIA */}
            {result.postureMetrics ? (
              <section id="detailed-body" className="space-y-4">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest pl-1">Cuerpo & Presencia</h3>
                <div className="bg-white/[0.02] rounded-[24px] border border-white/5 p-5 space-y-4 backdrop-blur-sm">
                  <MetricRow 
                    label="Contacto Visual" 
                    value={`${Math.round(result.postureMetrics.eyeContactPercent)}%`} 
                    desc="Tiempo mirando directamente a la cámara." 
                    status={ result.postureMetrics.eyeContactPercent > 70 ? 'optimo' : 'bajo' }
                  />
                  <MetricRow 
                    label="Nivel de Gestos" 
                    value={result.postureMetrics.gesturesUsage === 'optimal' ? 'Dinámico' : result.postureMetrics.gesturesUsage === 'excessive' ? 'Exagerado' : 'Estático'} 
                    desc="Movimiento de manos para ilustrar ideas." 
                    status={ result.postureMetrics.gesturesUsage === 'optimal' ? 'optimo' : 'bajo' }
                  />
                </div>
              </section>
            ) : (
              <section id="detailed-body" className="space-y-4 animate-fade-in">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Cuerpo & Presencia</h3>
                <div className="bg-gradient-to-br from-white/[0.03] to-purple-500/[0.05] rounded-[24px] border border-white/5 p-8 flex flex-col items-center text-center gap-4 backdrop-blur-md relative overflow-hidden group">
                  {/* Decorative background circle */}
                  <div className="absolute -top-10 -right-10 size-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
                  
                  <div className="size-14 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mb-1 border border-purple-500/30">
                    <span className="material-symbols-outlined text-3xl">lock</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-black text-lg">Análisis de Postura Bloqueado</h4>
                    <p className="text-gray-400 text-xs leading-relaxed max-w-[240px] mx-auto">
                      Has realizado un <b>Test de Voz Flash</b>. Para analizar tu contacto visual y gestos, inicia una Sesión Completa.
                    </p>
                  </div>
                  
                  <Link href="/practice" className="w-full mt-2">
                    <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black rounded-2xl transition-all shadow-lg shadow-purple-600/20 tracking-widest uppercase">
                      PROBAR ANÁLISIS DE VIDEO
                    </button>
                  </Link>
                </div>
              </section>
            )}
          </div>

          <div className="h-8"></div>

          {/* Botones Finales */}
          <div className="space-y-4">
            <button 
              onClick={async () => {
                logEvent("result_shared", { score: result.authorityScore.score });
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: 'Mi Análisis de Oratoria',
                      text: `¡Mira mi nivel de autoridad en Oratoria Efectiva! Saqué un ${result.authorityScore.score}/100.`,
                      url: window.location.origin
                    });
                  } catch (err) {}
                } else {
                  navigator.clipboard.writeText(window.location.origin);
                  alert("Enlace copiado al portapapeles");
                }
              }}
              className="w-full py-5 rounded-[20px] bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">share</span>
              Compartir Resultado
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => router.push("/practice")}
                className="py-4 rounded-[20px] bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all active:scale-[0.98]"
              >
                Grabar otra vez
              </button>
              <button 
                 onClick={() => router.push("/listen")}
                 className="py-4 rounded-[20px] bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                 Volver al inicio
              </button>
            </div>
          </div>

          <div className="h-20"></div>
        </div>
      </div>
    </main>
  );
}

function MetricRow({ label, value, desc, status }: { label: string, value: string, desc: string, status?: 'optimo' | 'bajo' | 'exceso' }) {
  const getStatusColor = () => {
    if (status === 'optimo') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (status === 'bajo') return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    if (status === 'exceso') return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    return 'text-slate-500 bg-slate-800/10 border-white/5';
  }

  return (
    <div className="flex flex-col gap-1 border-b border-white/5 pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-center">
        <span className="font-bold text-sm text-slate-200">{label}</span>
        <div className="flex items-center gap-2">
           {status && (
             <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-tighter ${getStatusColor()}`}>
               {status === 'optimo' ? 'Perfect' : status === 'bajo' ? 'Low' : 'Too High'}
             </span>
           )}
           <span className="text-base font-black text-white">{value}</span>
        </div>
      </div>
      <p className="text-[10px] text-slate-500 leading-tight pr-10">{desc}</p>
    </div>
  );
}
