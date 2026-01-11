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

  rephrase_optimized?: string;
  score_estructura?: number;
  durationSeconds?: number;
  diagnosis: string;
  score_seguridad?: number;
  score_claridad?: number;
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
      
      // 🏆 TRACKING DE PROGRESO (GA-MI-FI-CA-CIÓN)
      // Si venimos de un ejercicio y el score es bueno (>70), lo marcamos como completado
      // El ID del ejercicio se debió guardar al iniciar la práctica (lo haremos ahora).
      // Nota: Como no tengo estado global persistente en cliente más allá de localStorage para MVP:
      const currentExerciseId = localStorage.getItem('current_exercise_id'); // Guardado en PracticePage
      
      if (currentExerciseId && analysisResult.authorityScore.score >= 70) {
          const completed = JSON.parse(localStorage.getItem('completed_exercises') || '[]');
          if (!completed.includes(currentExerciseId)) {
              completed.push(currentExerciseId);
              localStorage.setItem('completed_exercises', JSON.stringify(completed));
              
              // 🎉 Efecto visual o log adicional podría ir aquí
              console.log(`[GAMIFICATION] Exercise ${currentExerciseId} UNLOCKED!`);
          }
          // Limpiar el contexto para no marcarlo de nuevo en refresh
          localStorage.removeItem('current_exercise_id');
      }

      if (!streakUpdated) {
        recordPractice();
        setStreakUpdated(true);
      }
    } catch (e) {
      router.push("/practice");
    }
  }, [router, streakUpdated]);

  if (!result) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-500">Cargando Coach...</div>;

  const claridad = result.score_claridad || 0;
  const autoridad = result.authorityScore.score || 0;
  const estructura = result.score_estructura || 0;

  // Calculate real reduction metrics
  const originalWords = result.transcription ? result.transcription.split(' ').length : 0;
  const optimizedWords = result.rephrase_optimized ? result.rephrase_optimized.split(' ').length : 0;
  const reductionPercent = originalWords > 0 ? Math.round(((originalWords - optimizedWords) / originalWords) * 100) : 0;

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

             <div className="grid grid-cols-2 gap-4 w-full max-w-[280px]">
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
                 
                 {reductionPercent > 5 && (
                    <div className="mt-4 pt-4 border-t border-amber-500/20 flex gap-3 text-amber-200/50 text-xs">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">remove_circle</span> -{reductionPercent}% Palabras ("Economía Verbal")</span>
                    </div>
                 )}
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

          {/* 🆕 GYM CTA */}
          <Link href="/gym">
             <div className="mb-12 group cursor-pointer">
                 <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-[28px] p-5 flex items-center justify-between hover:bg-white/5 transition-all shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                             <span className="material-symbols-outlined text-2xl font-bold">fitness_center</span>
                        </div>
                        <div>
                             <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Próximo paso</p>
                             <h4 className="text-lg font-bold text-white">Biblioteca Pro (365+)</h4>
                             <p className="text-xs text-slate-400">Ejercicios de dicción, aire y actitud.</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">arrow_forward</span>
                 </div>
             </div>
          </Link>

          {/* Technical Breakdown Title */}
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 mb-6 text-center">Desglose Técnico</h3>

          {/* 4. Detailed Metrics Section */}
          <div className="space-y-8 mb-12">
            
            {/* VOZ Y RITMO (Expandid0) */}
            <section id="detailed-voice" className="space-y-4">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest pl-1 mb-2">Dinámica Vocal</h3>
              <div className="bg-white/[0.02] rounded-[24px] border border-white/5 p-6 backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Columna 1: Velocidad */}
                <div className="space-y-4">
                    <MetricRow 
                      label="Velocidad (Cadencia)" 
                      value={`${result.metrics?.wordsPerMinute || 0} ppm`} 
                      desc="Rango ejecutivo: 130-150 ppm." 
                      status={ (result.metrics?.wordsPerMinute || 0) > 170 ? 'exceso' : (result.metrics?.wordsPerMinute || 0) < 110 ? 'bajo' : 'optimo' }
                    />
                    <MetricRow 
                      label="Pausas Totales" 
                      value={String(result.metrics?.pauseCount || 0)} 
                      desc="Silencios detectados." 
                      status='neutro'
                    />
                     <MetricRow 
                      label="Pausas Estratégicas" 
                      value={String(result.metrics?.strategicPauses || 0)} 
                      desc="Silencios poderosos (>1s)." 
                      status={ (result.metrics?.strategicPauses || 0) > 0 ? 'optimo' : 'bajo' }
                    />
                </div>

                {/* Columna 2: Calidad */}
                <div className="space-y-4">
                    <MetricRow 
                      label="Estabilidad de Volumen" 
                      value={`${Math.round((result.metrics?.energyStability || 0) * 100)}%`} 
                      desc="Control de proyección." 
                      status={ (result.metrics?.energyStability || 0) > 0.7 ? 'optimo' : 'bajo' }
                    />
                    <MetricRow 
                      label="Variación Tonal" 
                      value={`${Math.round((result.metrics?.pitchVariation || 0.2) * 100)}%`} 
                      desc="Evita la monotonía." 
                      status={ (result.metrics?.pitchVariation || 0) > 0.15 ? 'optimo' : 'bajo' }
                    />
                    <MetricRow 
                      label="Muletillas Detectadas" 
                      value={String(result.metrics?.fillerCount || 0)} 
                      desc='"Eh", "este", "bueno".' 
                      status={ (result.metrics?.fillerCount || 0) === 0 ? 'optimo' : 'bajo' }
                    />
                </div>
              </div>
            </section>

             {/* ANÁLISIS ESPECTRAL (ELITE / PREMIUM) */}
             {/* Si existen las métricas avanzadas (Premium), las mostramos. Si no, mostramos el Upsell. */}
             {(result.metrics as any)?.nasalityScore !== undefined ? (
                <section id="spectral-analysis" className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2 pl-1">
                      <span className="material-symbols-outlined text-amber-500 text-sm">workspace_premium</span>
                      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Análisis Espectral (Elite)</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-500/[0.03] to-transparent rounded-[24px] border border-amber-500/20 p-6 backdrop-blur-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Nasalidad */}
                      <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Resonancia Nasal</span>
                          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="absolute top-0 left-0 h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(result.metrics as any).nasalityScore || 30}%`}}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                             <span>Baja</span>
                             <span className="text-white">{(result.metrics as any).nasalityScore}%</span>
                             <span>Alta</span>
                          </div>
                      </div>

                      {/* Brillo */}
                      <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Brillo Vocal (Claridad)</span>
                          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(result.metrics as any).brightnessScore || 70}%`}}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                             <span>Opaco</span>
                             <span className="text-white">{(result.metrics as any).brightnessScore}%</span>
                             <span>Brillante</span>
                          </div>
                      </div>

                      {/* Profundidad */}
                      <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Profundidad (Pecho)</span>
                          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(result.metrics as any).depthScore || 60}%`}}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                             <span>Superficial</span>
                             <span className="text-white">{(result.metrics as any).depthScore}%</span>
                             <span>Profunda</span>
                          </div>
                      </div>

                  </div>
                  
                  <div className="bg-white/[0.02] rounded-[24px] border border-white/5 p-4 flex gap-4 items-center">
                      <span className="material-symbols-outlined text-gray-500">info</span>
                      <p className="text-xs text-gray-400 leading-relaxed">
                          La resonancia de pecho (Profundidad) &gt; 60% se correlaciona con mayor percepción de autoridad en roles de liderazgo.
                      </p>
                  </div>
                </section>
             ) : (
                /* UPSELL SI ES FREE Y NO VE LA DATA */
                <section id="spectral-locked" className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
                   <div className="flex items-center gap-2 mb-2 pl-1 text-slate-600">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <h3 className="text-xs font-bold uppercase tracking-widest">Análisis Espectral (Bloqueado)</h3>
                  </div>
                   <div className="relative bg-white/[0.01] rounded-[24px] border border-dashed border-white/10 p-6 flex flex-col items-center text-center gap-3 overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shimmer pointer-events-none"></div>
                       <p className="text-sm font-bold text-slate-300">Desbloquea la Bio-Métrica Avanzada</p>
                       <p className="text-xs text-slate-500 max-w-sm">
                           Obtén acceso a Nasalidad, Brillo Vocal, Profundidad y métricas de neuro-oratoria exclusivas del plan Elite.
                       </p>
                       <Link href="/upgrade" className="mt-2 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 border border-amber-500/30 px-4 py-2 rounded-full hover:bg-amber-500/10 transition-colors">
                           Ver Planes
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
                 className="py-4 rounded-[20px] bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-[0.98]"
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

function MetricRow({ label, value, desc, status }: { label: string, value: string, desc: string, status?: 'optimo' | 'bajo' | 'exceso' | 'neutro' }) {
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
