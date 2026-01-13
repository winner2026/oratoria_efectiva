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

  // 🧬 PERFIL SANTIAGO
  const claridad = result.score_claridad || 85; 
  const autoridad = result.authorityScore.score || 35; 
  const estructura = result.score_estructura || 60;
  
  const metrics = {
      articulation: claridad, 
      authority: autoridad,   
      improv: 40,             
      stability: 25,          
      projection: 45,         
      support: 30             
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
            <span className="material-symbols-outlined">arrow_back</span>
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

             {/* 🎯 VEREDICTO CLÍNICO (Nuevo Copy) */}
             <div className="mt-8 p-6 bg-slate-900/50 border-l-2 border-amber-500 rounded-r-2xl backdrop-blur-sm shadow-xl">
                 <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-4">Veredicto Forense</h3>
                 
                 <p className="text-sm leading-relaxed text-slate-300 font-medium mb-4">
                     Tu precisión léxica es de élite, pero tu biometría revela una <strong className="text-white">"Voz de Supervivencia"</strong>.
                 </p>
                 
                 <p className="text-sm leading-relaxed text-slate-400 mb-6">
                     Cuando la presión aumenta, tus cuerdas vocales se tensan y pierdes la resonancia de pecho. El resultado: <span className="text-amber-200 italic">tu equipo escucha tus datos, pero no siente tu autoridad.</span> Estás proyectando competencia técnica, pero no dominancia estratégica.
                 </p>

                 <div className="bg-amber-900/20 border border-amber-500/20 p-3 rounded-lg flex items-center justify-between">
                     <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Brecha Detectada</span>
                     <span className="text-xs font-black text-white">65 Puntos de Diferencia</span>
                 </div>
             </div>

          </div>

          {/* 2. SOLUCIÓN: PROTOCOLOS DE REINGENIERÍA (ELITE) */}
          <div className="space-y-4 mb-12">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 text-center">Protocolos de Reingeniería Requeridos</h3>
              
              {/* Card 1: Autoridad */}
              <div className="bg-[#0A0F14] border border-white/5 rounded-2xl p-4 flex items-center gap-4 opacity-70 group hover:opacity-100 transition-opacity">
                 <div className="size-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors">
                    <span className="material-symbols-outlined">church</span>
                 </div>
                 <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-300 uppercase group-hover:text-white">Corrección Tonal</h4>
                    <p className="text-[10px] text-slate-500">Resonancia Tóraco-Abdominal</p>
                 </div>
                 <span className="material-symbols-outlined text-amber-500 text-sm animate-pulse">lock</span>
              </div>

              {/* Card 2: Neural Link */}
              <div className="bg-[#0A0F14] border border-white/5 rounded-2xl p-4 flex items-center gap-4 opacity-70 group hover:opacity-100 transition-opacity">
                 <div className="size-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors">
                    <span className="material-symbols-outlined">psychology</span>
                 </div>
                 <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-300 uppercase group-hover:text-white">Conexión Neural</h4>
                    <p className="text-[10px] text-slate-500">Improvisación Black Ops</p>
                 </div>
                 <span className="material-symbols-outlined text-amber-500 text-sm animate-pulse">lock</span>
              </div>

              {/* Card 3: Soporte */}
              <div className="bg-[#0A0F14] border border-white/5 rounded-2xl p-4 flex items-center gap-4 opacity-70 group hover:opacity-100 transition-opacity">
                 <div className="size-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors">
                    <span className="material-symbols-outlined">medical_services</span>
                 </div>
                 <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-300 uppercase group-hover:text-white">Bio-Hacking</h4>
                    <p className="text-[10px] text-slate-500">Respiración de Combate (Core Lock)</p>
                 </div>
                 <span className="material-symbols-outlined text-amber-500 text-sm animate-pulse">lock</span>
              </div>
          </div>


          {/* 3. CTA FINAL */}
          <div className="bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-[32px] p-8 text-center space-y-6 mb-12">
              <h3 className="text-2xl font-black text-white uppercase italic leading-none">
                  No viniste a aprender.<br/>Viniste a dominar.
              </h3>
              <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto mt-4">
                  El hardware vocal no se arregla leyendo libros. Se arregla entrenando bajo presión.
              </p>
              <Link href="/upgrade" className="mt-8 group relative inline-flex w-full items-center justify-center py-4 bg-gradient-to-r from-amber-600 to-orange-700 text-white font-black rounded-xl uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-transform overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                     <span className="material-symbols-outlined">lock_open</span>
                     Equilibrar mi Perfil Soberano
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
