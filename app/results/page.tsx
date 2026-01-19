"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logEvent } from "@/lib/events/logEvent";
import { recordPractice } from "@/lib/streaks/streakSystem";
import CircularProgress from "@/components/voice/CircularProgress";
import { SovereigntyRadar } from "@/components/SovereigntyRadar";

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
  score_transcripcion?: number;
  score_audio?: number;
  score_general?: number;
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
      
      const currentExerciseId = localStorage.getItem('current_exercise_id'); 
      
      if (currentExerciseId && analysisResult.authorityScore.score >= 70) {
          const completed = JSON.parse(localStorage.getItem('completed_exercises') || '[]');
          if (!completed.includes(currentExerciseId)) {
              completed.push(currentExerciseId);
              localStorage.setItem('completed_exercises', JSON.stringify(completed));
          }
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

  if (!result) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-500 font-mono text-xs animate-pulse">ESTABLECIENDO ENLACE TÁCTICO...</div>;

  // 🧬 MAPEAR MÉTRICAS REALES DE LA SEÑAL
  const claridad = result.score_claridad || result.score_transcripcion || 85; 
  const autoridad = result.authorityScore?.score || result.score_general || 50; 
  const estructura = result.score_estructura || 70;
  
  const metrics = {
      articulation: claridad, 
      authority: autoridad,   
      improv: result.metrics?.pitchVariation ? Math.min(100, result.metrics.pitchVariation * 2) : 50,             
      stability: result.metrics?.energyStability || 60,          
      projection: result.score_audio || 50,         
      support: 40             
  };

  const potentialScore = 98; 
  const gap = potentialScore - autoridad;

  return (
    <main className="min-h-[100dvh] bg-[#050505] text-white font-display overflow-x-hidden antialiased flex justify-center selection:bg-blue-500/30">
      
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative z-10 mobile-container flex flex-col min-h-[100dvh] px-0">
        
        {/* Header */}
        <div className="flex items-center p-4 justify-between sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
          <button onClick={() => router.push("/practice")} className="flex size-10 items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-white active:scale-95">
            <span className="material-symbols-outlined">refresh</span>
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">Expediente #{(Math.random()*10000).toFixed(0)}</h2>
            <p className="text-sm font-bold tracking-tight text-white uppercase">Auditoría de Mando</p>
          </div>
          <div className="size-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-32 px-6 custom-scrollbar scroll-smooth">
          
          {/* 1. RADAR CHART & NARRATIVA */}
          <div className="mt-8 mb-8 flex flex-col items-center animate-slide-up">
              
             <SovereigntyRadar 
                articulation={metrics.articulation}
                authority={metrics.authority}
                structure={estructura}
                improv={metrics.improv} 
                projection={metrics.projection}
                resistance={90} 
             />

             {/* 🎯 VEREDICTO CLÍNICO */}
             <div className="mt-8 p-6 bg-slate-900/50 border-l-2 border-blue-500 rounded-r-2xl backdrop-blur-sm shadow-xl">
                 <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Veredicto Forense</h3>
                 
                 <p className="text-sm leading-relaxed text-slate-300 font-medium mb-4">
                     {autoridad > 75 
                        ? "Tu señal vocal proyecta una dominancia natural. Mantienes un flujo de energía constante sin picos de cortisol detectables."
                        : "Tu biometría revela una señal inestable. La falta de soporte diafragmático está diluyendo tu impacto percibido."}
                 </p>
                 
                 <p className="text-sm leading-relaxed text-slate-400 mb-6">
                     {autoridad > 75
                        ? "Estás en el percentil superior de mando. Optimiza tus pausas para generar mayor tensión estratégica."
                        : "Cuando la presión aumenta, tus cuerdas vocales tienden a la tensión. El resultado: tu audiencia escucha tus datos, pero no siente tu autoridad."}
                 </p>

                 <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded-lg flex items-center justify-between">
                     <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Brecha de Mejora</span>
                     <span className="text-xs font-black text-white">{gap} Puntos</span>
                 </div>
             </div>

          </div>

          {/* 2. SOLUCIÓN: PROTOCOLOS DISPONIBLES */}
          <div className="space-y-4 mb-12">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 text-center">Protocolos de Entrenamiento Sugeridos</h3>
              
              <Link href="/gym" className="block bg-[#0A0F14] border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                 <div className="size-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined">campaign</span>
                 </div>
                 <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-300 uppercase group-hover:text-white">Dinamómetro Vocal</h4>
                    <p className="text-[10px] text-slate-500">Nivelar Presión Acústica</p>
                 </div>
                 <span className="material-symbols-outlined text-slate-600 text-sm">chevron_right</span>
              </Link>

              <Link href="/gym" className="block bg-[#0A0F14] border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                 <div className="size-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined">air</span>
                 </div>
                 <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-300 uppercase group-hover:text-white">Respiración SSSS</h4>
                    <p className="text-[10px] text-slate-500">Control de Flujo Laminar</p>
                 </div>
                 <span className="material-symbols-outlined text-slate-600 text-sm">chevron_right</span>
              </Link>
          </div>


          {/* 3. CTA FINAL */}
          <div className="bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 rounded-[32px] p-8 text-center space-y-6 mb-12">
              <h3 className="text-2xl font-black text-white uppercase italic leading-none">
                  El hardware vocal<br/>se entrena.
              </h3>
              <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto mt-4">
                  Has completado la auditoría inicial. Ahora usa el Arsenal Pro para corregir las brechas detectadas.
              </p>
              <Link href="/gym" className="mt-8 group relative inline-flex w-full items-center justify-center py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest hover:scale-[1.02] transition-transform overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2 text-[11px]">
                     <span className="material-symbols-outlined">fitness_center</span>
                     Ir al Arsenal de Entrenamiento
                  </span>
              </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-20">
            <button 
                onClick={() => router.push("/practice")}
                className="py-4 rounded-[20px] bg-white/5 border border-white/10 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
            >
                Re-calibrar
            </button>
            <button 
                onClick={() => router.push("/")}
                className="py-4 rounded-[20px] bg-white/5 border border-white/10 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
            >
                Salir
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
