"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logEvent } from "@/lib/events/logEvent";
import { recordPractice } from "@/lib/streaks/streakSystem";

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
  // 🆕 Métricas de postura
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
  durationSeconds?: number;
  diagnosis: string;
  score_seguridad?: number;
  score_claridad?: number;
  score_postura?: number; // 🆕
  strengths: string[];
  weaknesses: string[];
  decision: string;
  payoff: string;
};


export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null); // 'seguridad' | 'claridad' | null
  const [streakUpdated, setStreakUpdated] = useState(false);

  useEffect(() => {
    const savedResult = localStorage.getItem("voiceAnalysisResult");
    if (!savedResult) {
      router.push("/practice");
      return;
    }
    
    try {
      const analysisResult = JSON.parse(savedResult);
      console.log("📊 Loaded Result:", analysisResult);
      setResult(analysisResult);
      logEvent("analysis_viewed");
      
      // 🔥 Registrar práctica para el streak
      if (!streakUpdated) {
        const newStreak = recordPractice();
        setStreakUpdated(true);
      }
    } catch (e) {
      console.error("Error parsing analysis result:", e);
      alert("Hubo un error al leer los resultados. Intenta grabar de nuevo.");
      router.push("/practice");
    }
  }, [router, streakUpdated]);

  if (!result) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-gray-500">Cargando...</div>;

  const seguridad = result.score_seguridad || 50;
  const claridad = result.score_claridad || 50;
  const postura = result.score_postura || result.postureMetrics?.postureScore || 0;

  return (
    <main className="min-h-screen bg-background-dark text-white font-display overflow-x-hidden antialiased flex justify-center">
      <div className="relative w-full max-w-md bg-background-dark flex flex-col min-h-screen shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center p-4 justify-between sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-[#283039]">
          <button onClick={() => router.push("/practice")} className="flex size-10 items-center justify-center rounded-full hover:bg-[#283039] transition-colors text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold tracking-tight">Tu Análisis</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto pb-24 px-4 custom-scrollbar">
          
          {/* 1. Diagnosis Principal (Humanizado) */}
          <div className="mt-6 mb-6">
             <h1 className="text-2xl font-bold leading-tight mb-2">
               {result.diagnosis}
             </h1>
             <p className="text-gray-400 text-sm">
               Aquí tienes tu desglose personalizado:
             </p>
          </div>

          {/* 2. Pillars Cards (Visualización Amigable) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
             
             {/* Card Seguridad */}
             <div 
               onClick={() => setShowDetails(showDetails === 'seguridad' ? null : 'seguridad')}
               className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${showDetails === 'seguridad' ? 'bg-[#1a2632] border-primary ring-1 ring-primary' : 'bg-surface-dark border-[#3b4754] hover:border-gray-500'}`}
             >
                <div className="flex justify-between items-start mb-2">
                   <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <span className="material-symbols-outlined">shield</span>
                   </div>
                   <span className="text-2xl font-bold">{seguridad}</span>
                </div>
                <h3 className="font-bold text-sm text-gray-200">Seguridad</h3>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                   Firmeza, tono y control de muletillas.
                </p>
                
                {/* Expandable Details */}
                <div className={`grid transition-all duration-300 ${showDetails === 'seguridad' ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-gray-700' : 'grid-rows-[0fr] opacity-0'}`}>
                   <div className="overflow-hidden text-xs space-y-2">
                      <div className="flex justify-between">
                         <span className="text-gray-400">Entonación:</span>
                         <span className={(result.metrics?.fallingIntonationScore || 0) > 60 ? "text-green-400" : "text-yellow-400"}>
                            {(result.metrics?.fallingIntonationScore || 0) > 60 ? "Firme 📉" : "Dubitativa 📈"}
                         </span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-400">Muletillas:</span>
                         <span className="text-white">{result.metrics?.fillerCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-400">Silencios Incómodos:</span>
                         <span className={(result.metrics?.awkwardSilences || 0) > 0 ? "text-red-400" : "text-green-400"}>
                            {result.metrics?.awkwardSilences || 0}
                         </span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Card Claridad */}
             <div 
               onClick={() => setShowDetails(showDetails === 'claridad' ? null : 'claridad')}
               className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${showDetails === 'claridad' ? 'bg-[#1a2632] border-green-500 ring-1 ring-green-500' : 'bg-surface-dark border-[#3b4754] hover:border-gray-500'}`}
             >
                <div className="flex justify-between items-start mb-2">
                   <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                      <span className="material-symbols-outlined">auto_awesome</span>
                   </div>
                   <span className="text-2xl font-bold">{claridad}</span>
                </div>
                <h3 className="font-bold text-sm text-gray-200">Claridad</h3>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                   Estructura directa y vocabulario limpio.
                </p>

                {/* Expandable Details */}
                <div className={`grid transition-all duration-300 ${showDetails === 'claridad' ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-gray-700' : 'grid-rows-[0fr] opacity-0'}`}>
                   <div className="overflow-hidden text-xs space-y-2">
                      <div className="flex justify-between">
                         <span className="text-gray-400">Frases Largas:</span>
                         <span className={(result.metrics?.longSentences || 0) > 2 ? "text-yellow-400" : "text-green-400"}>
                            {result.metrics?.longSentences || 0}
                         </span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-400">Repeticiones:</span>
                         <span className="text-white">{result.metrics?.repetitionCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-400">Velocidad:</span>
                         <span className="text-white">{result.metrics?.wordsPerMinute || 0} ppm</span>
                       </div>
                    </div>
                 </div>
              </div>

           </div>

           {/* 2.5 Pilar de Postura (Fila Completa para destacar lo nuevo) */}
           {/* Mostrar siempre si hay métricas, aunque el score sea 0 */}
           {result.postureMetrics && (
             <div 
               onClick={() => setShowDetails(showDetails === 'postura' ? null : 'postura')}
               className={`relative p-4 mb-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${showDetails === 'postura' ? 'bg-[#1a2632] border-purple-500 ring-1 ring-purple-500' : 'bg-surface-dark border-[#3b4754] hover:border-gray-500'}`}
             >
                <div className="flex justify-between items-start mb-2">
                   <div className="size-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <span className="material-symbols-outlined">accessibility_new</span>
                   </div>
                   <div className="flex flex-col items-end">
                     <span className="text-2xl font-bold">{postura}</span>
                     <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Nuevo</span>
                   </div>
                </div>
                <h3 className="font-bold text-sm text-gray-200">Lenguaje Corporal</h3>
                <p className="text-[10px] text-gray-500 mt-1">
                   Postura, contacto visual y uso de gestos.
                </p>

                {/* Expandable Details Postura */}
                <div className={`grid transition-all duration-300 ${showDetails === 'postura' ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-gray-700' : 'grid-rows-[0fr] opacity-0'}`}>
                   <div className="overflow-hidden text-xs space-y-2">
                      <div className="flex justify-between">
                         <span className="text-gray-400">Contacto Visual:</span>
                         <span className={(result.postureMetrics?.eyeContactPercent || 0) > 60 ? "text-green-400" : "text-yellow-400"}>
                            {Math.round(result.postureMetrics?.eyeContactPercent || 0)}%
                         </span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-400">Hombros:</span>
                         <span className={result.postureMetrics?.shouldersLevel === "balanced" ? "text-green-400" : "text-yellow-400"}>
                            {result.postureMetrics?.shouldersLevel === "balanced" ? "Nivelados ✅" : "Inclinados ⚠️"}
                         </span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-400">Gestos:</span>
                         <span className="text-white">
                            {result.postureMetrics?.gesturesUsage === "optimal" ? "Expresivos ✨" : result.postureMetrics?.gesturesUsage === "excessive" ? "Exagerados ⚠️" : "Escasos"}
                         </span>
                      </div>
                      {result.postureMetrics?.nervousnessIndicators && (
                        <div className="flex justify-between">
                           <span className="text-gray-400">Nerviosismo (Manos):</span>
                           <span className={result.postureMetrics.nervousnessIndicators.closedFists > 30 ? "text-red-400" : "text-green-400"}>
                              {result.postureMetrics.nervousnessIndicators.closedFists > 30 ? "Puños cerrados ⚠️" : "Relajadas ✅"}
                           </span>
                        </div>
                      )}
                   </div>
                </div>
             </div>
           )}

          {/* 3. Action Plan (Lo más importante) */}
          <div className="bg-gradient-to-br from-primary via-primary to-blue-600 rounded-2xl p-1 shadow-lg shadow-primary/20 mb-6">
             <div className="bg-background-dark/40 backdrop-blur-sm rounded-xl p-5 h-full">
                <div className="flex items-center gap-2 mb-3 text-white font-bold text-sm uppercase tracking-wider">
                   <span className="material-symbols-outlined text-yellow-300">lightbulb</span>
                   Tu Próximo Paso
                </div>
                <p className="text-lg font-bold text-white mb-2 leading-snug">
                   "{result.decision}"
                </p>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                   <span className="material-symbols-outlined text-green-300 text-sm">trending_up</span>
                   <p className="text-xs text-blue-100 font-medium">
                      Beneficio: {result.payoff}
                   </p>
                </div>
             </div>
          </div>

          {/* 4. Transcripción (Colapsada por defecto o secundaria) */}
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Transcripción Detallada</h3>
          <div className="bg-surface-dark border border-[#3b4754] rounded-xl p-5 shadow-sm text-sm text-gray-300 leading-relaxed font-light">
             {result.transcription}
          </div>

          <div className="h-8"></div>

          {/* Botones Finales */}
          <button 
            onClick={() => router.push("/practice")}
            className="w-full py-4 rounded-xl bg-white text-background-dark font-bold hover:bg-gray-200 transition-colors shadow-lg"
          >
            Nueva Grabación
          </button>
          <button 
             onClick={() => router.push("/")}
             className="w-full py-4 mt-3 rounded-xl border border-gray-700 text-gray-400 font-bold hover:text-white transition-colors"
          >
             Volver al Inicio
          </button>

        </div>
      </div>
    </main>
  );
}
