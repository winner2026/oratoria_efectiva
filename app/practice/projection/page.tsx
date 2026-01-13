"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePitchDetector } from "@/hooks/usePitchDetector";

// --- SCORING ALGORITHM FOR PROJECTION ---
// Goal: Reward CONSISTENT volume in the "optimal" zone (Conversación-Proyección).
// Penalize: Too quiet (Susurro), Too loud (Saturación), or erratic volume.

const EXERCISE_DURATION = 30; // seconds

// Volume zones (0-100 scale after our *400 multiplier)
const ZONES = {
    SILENCE: { min: 0, max: 10 },
    WHISPER: { min: 10, max: 40 },
    CONVERSATION: { min: 40, max: 70 },  // Good
    PROJECTION: { min: 70, max: 90 },    // Excellent
    SATURATION: { min: 90, max: 100 },   // Too loud
};

interface VolumeStats {
    samples: number;
    avgVolume: number;
    timeInOptimal: number; // % time in Conversation or Projection zones
    consistency: number;   // Low std dev = high consistency
    peakVolume: number;
}

function calculateProjectionScore(volumeHistory: number[]): { score: number; stats: VolumeStats } {
    if (volumeHistory.length < 20) {
        return { score: 0, stats: { samples: 0, avgVolume: 0, timeInOptimal: 0, consistency: 0, peakVolume: 0 }};
    }

    // Filter out complete silence (mic not picking up anything)
    const validVolumes = volumeHistory.filter(v => v > 3);
    if (validVolumes.length < 20) {
        return { score: 0, stats: { samples: validVolumes.length, avgVolume: 0, timeInOptimal: 0, consistency: 0, peakVolume: 0 }};
    }

    // Calculate stats
    const avgVolume = validVolumes.reduce((a, b) => a + b, 0) / validVolumes.length;
    const peakVolume = Math.max(...validVolumes);
    
    // Time in optimal zones
    const optimalSamples = validVolumes.filter(v => v >= ZONES.CONVERSATION.min && v <= ZONES.PROJECTION.max);
    const timeInOptimal = (optimalSamples.length / validVolumes.length) * 100;
    
    // Consistency (inverse of std dev, normalized)
    const squaredDiffs = validVolumes.map(v => Math.pow(v - avgVolume, 2));
    const stdDev = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / validVolumes.length);
    // Lower stdDev = better consistency. 0-20 stdDev is good.
    const consistency = Math.max(0, 100 - (stdDev * 2.5));
    
    // Composite score:
    // 50% weight on time in optimal zone
    // 30% weight on consistency
    // 20% penalty for saturation or whisper
    
    const saturatedSamples = validVolumes.filter(v => v >= ZONES.SATURATION.min);
    const whisperSamples = validVolumes.filter(v => v >= ZONES.WHISPER.min && v < ZONES.CONVERSATION.min);
    const saturationPenalty = (saturatedSamples.length / validVolumes.length) * 20;
    const whisperPenalty = (whisperSamples.length / validVolumes.length) * 10;
    
    let score = (timeInOptimal * 0.5) + (consistency * 0.3) + 20; // Base 20 points
    score = score - saturationPenalty - whisperPenalty;
    score = Math.min(100, Math.max(0, Math.round(score)));

    return {
        score,
        stats: {
            samples: validVolumes.length,
            avgVolume: Math.round(avgVolume),
            timeInOptimal: Math.round(timeInOptimal),
            consistency: Math.round(consistency),
            peakVolume: Math.round(peakVolume),
        }
    };
}

function getScoreLabel(score: number): { label: string; color: string; emoji: string } {
    if (score >= 80) return { label: "Control Profesional", color: "text-green-400", emoji: "🎯" };
    if (score >= 60) return { label: "Buena Proyección", color: "text-emerald-400", emoji: "📢" };
    if (score >= 40) return { label: "Necesita Práctica", color: "text-amber-400", emoji: "📊" };
    if (score >= 20) return { label: "Inconsistente", color: "text-orange-400", emoji: "📉" };
    return { label: "Muy Bajo", color: "text-red-400", emoji: "🔇" };
}

function getZoneInfo(level: number) {
    if (level < ZONES.SILENCE.max) return { label: "Silencio", color: "text-slate-500", bgColor: "bg-slate-500" };
    if (level < ZONES.WHISPER.max) return { label: "Susurro", color: "text-blue-400", bgColor: "bg-blue-500" };
    if (level < ZONES.CONVERSATION.max) return { label: "Conversación", color: "text-green-400", bgColor: "bg-green-500" };
    if (level < ZONES.PROJECTION.max) return { label: "Proyección", color: "text-amber-400", bgColor: "bg-amber-500" };
    return { label: "Saturación", color: "text-red-500", bgColor: "bg-red-500" };
}

/**
 * Exercise: El Dinamómetro (Volume Control)
 * Goal: Visualize volume and SCORE control.
 */
export default function ProjectionPage() {
  const router = useRouter();
  const { isListening, startListening, stopListening, volume } = usePitchDetector();
  
  const [maxVolume, setMaxVolume] = useState(0);
  const [volumeHistory, setVolumeHistory] = useState<number[]>([]);
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'active' | 'results'>('idle');
  const [countdownVal, setCountdownVal] = useState(5);
  const [timeLeft, setTimeLeft] = useState(EXERCISE_DURATION);
  const [finalScore, setFinalScore] = useState(0);
  const [finalStats, setFinalStats] = useState<VolumeStats | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sampleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const volumeRef = useRef(0); // Track current volume for sampling
  
  // Volume is roughly 0.0 to 1.0 RMS from Analyser
  const currentLevel = Math.min(100, volume * 400);
  
  // Keep volumeRef in sync with current volume
  useEffect(() => {
      volumeRef.current = currentLevel;
  }, [currentLevel]);
  
  // Track max volume during recording
  useEffect(() => {
      if (phase === 'active' && currentLevel > maxVolume) {
          setMaxVolume(currentLevel);
      }
  }, [currentLevel, maxVolume, phase]);

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          stopListening();
          if (timerRef.current) clearInterval(timerRef.current);
          if (sampleIntervalRef.current) clearInterval(sampleIntervalRef.current);
      };
  }, [stopListening]);
  
  // Start exercise (Countdown)
  const startExercise = useCallback(() => {
      setPhase('countdown');
      setCountdownVal(5);
      
      // Intentar iniciar audio para pedir permisos
      startListening(); 

      let count = 5;
      const interval = setInterval(() => {
          count--;
          setCountdownVal(count);
          if (count <= 0) {
              clearInterval(interval);
              beginSession();
          }
      }, 1000);
  }, [startListening]);

  const beginSession = () => {
      setPhase('active');
      setTimeLeft(EXERCISE_DURATION);
      setVolumeHistory([]);
      setMaxVolume(0);
      
      // Timer
      timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
              if (prev <= 1) {
                  if (timerRef.current) clearInterval(timerRef.current);
                  if (sampleIntervalRef.current) clearInterval(sampleIntervalRef.current);
                  stopListening();
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
      
      // Sample volume every 100ms for scoring (using ref for real-time value)
      sampleIntervalRef.current = setInterval(() => {
          setVolumeHistory(prev => [...prev, volumeRef.current]);
      }, 100);
  };
  
  // Continuously update volume history while active
  useEffect(() => {
      if (phase === 'active' && isListening) {
          const level = Math.min(100, volume * 400);
          // This runs on every render when volume changes
      }
  }, [volume, phase, isListening]);
  
  // End exercise when timer hits 0
  useEffect(() => {
      if (timeLeft === 0 && phase === 'active') {
          const { score, stats } = calculateProjectionScore(volumeHistory);
          setFinalScore(score);
          setFinalStats(stats);
          setPhase('results');
          
          // Save to local storage
          const exerciseResult = {
              id: 'projection-' + Date.now(),
              type: 'projection',
              score,
              stats,
              date: new Date().toISOString(),
          };
          const history = JSON.parse(localStorage.getItem('exercise_history') || '[]');
          history.unshift(exerciseResult);
          localStorage.setItem('exercise_history', JSON.stringify(history.slice(0, 50)));
      }
  }, [timeLeft, phase, volumeHistory]);
  
  const zone = getZoneInfo(currentLevel);

   // --- RESULTS VIEW ---
   if (phase === 'results' && finalStats) {
       const scoreData = getScoreLabel(finalScore);
       return (
           <div className="min-h-screen bg-slate-950 font-display text-white p-6 flex flex-col items-center justify-center overflow-y-auto pt-12 pb-24">
               <div className="mobile-container space-y-8 animate-fade-in">
                  
                  {/* Score Circle */}
                  <div className="relative mx-auto size-48">
                      <svg className="size-48 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                          <circle 
                              cx="50" cy="50" r="45" fill="none" 
                              stroke="url(#gradient-proj)" strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={`${finalScore * 2.83} 283`}
                              className="transition-all duration-1000"
                          />
                          <defs>
                              <linearGradient id="gradient-proj" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#ef4444" />
                                  <stop offset="50%" stopColor="#f59e0b" />
                                  <stop offset="100%" stopColor="#22c55e" />
                              </linearGradient>
                          </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black">{finalScore}</span>
                          <span className="text-xs text-slate-500 uppercase tracking-widest">Puntos</span>
                      </div>
                  </div>
                  
                  {/* Label */}
                  <div className="text-center space-y-2">
                      <div className="text-4xl">{scoreData.emoji}</div>
                      <h2 className={`text-2xl font-black ${scoreData.color}`}>{scoreData.label}</h2>
                      <p className="text-slate-400 text-sm">
                          {finalScore >= 60 
                              ? "¡Excelente control de volumen! Proyectas con consistencia."
                              : finalScore >= 40
                              ? "Buen intento. Intenta mantener un volumen más estable en la zona de proyección."
                              : "Tu volumen fue muy inconsistente. Practica mantener una intensidad constante."}
                      </p>
                  </div>
                  
                  {/* Detailed Stats */}
                  <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900 rounded-2xl p-4 text-center border border-white/5">
                          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Volumen Promedio</div>
                          <div className="text-2xl font-bold text-white">{finalStats.avgVolume}%</div>
                      </div>
                      <div className="bg-slate-900 rounded-2xl p-4 text-center border border-white/5">
                          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Pico Máximo</div>
                          <div className="text-2xl font-bold text-amber-400">{finalStats.peakVolume}%</div>
                      </div>
                      <div className="bg-slate-900 rounded-2xl p-4 text-center border border-white/5">
                          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Tiempo Óptimo</div>
                          <div className="text-2xl font-bold text-green-400">{finalStats.timeInOptimal}%</div>
                      </div>
                      <div className="bg-slate-900 rounded-2xl p-4 text-center border border-white/5">
                          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Consistencia</div>
                          <div className="text-2xl font-bold text-blue-400">{finalStats.consistency}%</div>
                      </div>
                  </div>
                  
                  {/* Zone Legend */}
                  <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5">
                      <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 text-center">Zonas de Volumen</div>
                      <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-blue-400">Susurro</span>
                          <span className="text-green-400">Conversación ✓</span>
                          <span className="text-amber-400">Proyección ✓</span>
                          <span className="text-red-400">Saturación</span>
                      </div>
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-amber-500 to-red-500 mt-2" />
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-3 pt-4">
                      <button
                          onClick={() => {
                              setPhase('idle');
                              setVolumeHistory([]);
                              setMaxVolume(0);
                              setTimeLeft(EXERCISE_DURATION);
                          }}
                          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl transition-all"
                      >
                          Intentar de Nuevo
                      </button>
                      <Link href="/gym" className="block">
                          <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-white/10">
                              Volver al Gimnasio
                          </button>
                      </Link>
                  </div>
              </div>
          </div>
      );
  }

   // --- MAIN VIEW ---
   return (
    <div className="min-h-screen bg-slate-950 font-display text-white relative overflow-x-hidden pb-12">
       
        {/* Ambient Bg - Reacts to volume */}
        <div 
            className="absolute inset-0 bg-amber-500/5 transition-opacity duration-75 pointer-events-none blur-3xl"
            style={{ opacity: Math.min(0.5, volume * 2) }}
        />

        {/* Header */}
        <div className="w-full flex items-center justify-between px-6 py-6 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-30">
             <Link href="/gym" onClick={stopListening} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Salir</span>
             </Link>
             
             {phase === 'active' && (
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                    <span className="material-symbols-outlined text-amber-400 text-sm">timer</span>
                    <span className="text-amber-400 font-mono font-bold">{timeLeft}s</span>
                </div>
            )}
            
            <div className={`size-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
        </div>
        
        <div className="mobile-container pt-8 text-center space-y-4 mb-12 relative z-10 animate-fade-in px-6">
             <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                Dinamómetro Vocal
             </h1>
             <p className="text-slate-400 text-xs md:text-sm max-w-sm mx-auto">
                {phase === 'idle' 
                    ? "Controla tu potencia. Tu objetivo es mantener la barra en la zona verde-amarilla sin llegar al rojo."
                    : "¡Proyecta tu voz! Mantén un volumen constante y evita los extremos."}
             </p>
        </div>

        {/* Meter UI */}
        <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-8">
            
            {/* Main Bar */}
            <div className={`w-20 md:w-24 h-[300px] md:h-96 bg-slate-900 rounded-full p-2 border border-white/10 relative overflow-hidden shadow-2xl ${phase !== 'active' ? 'grayscale opacity-50' : ''}`}>
                {/* Zone Markers */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none z-20">
                    <div className="w-full h-[1px] bg-red-500/50" /> {/* 90% */}
                    <div className="w-full h-[1px] bg-amber-500/50" /> {/* 70% */}
                    <div className="w-full h-[1px] bg-green-500/50" /> {/* 40% */}
                    <div className="w-full h-[1px] bg-blue-500/50" /> {/* 10% */}
                </div>
                
                {/* Fill */}
                <div 
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-green-500 via-amber-400 to-red-500 transition-all duration-75 ease-out rounded-b-full"
                    style={{ height: `${phase === 'active' ? currentLevel : 0}%` }}
                />
                
                 {/* Max Marker */}
                 {maxVolume > 0 && phase === 'active' && (
                    <div 
                        className="absolute left-0 w-full h-[2px] bg-white z-20 transition-all duration-300"
                        style={{ bottom: `${maxVolume}%` }}
                    />
                 )}
            </div>

            {/* Current Value Display */}
            <div className="text-center space-y-2 h-24">
                {phase === 'countdown' ? (
                     <div className="text-8xl font-black text-amber-500 animate-bounce-in">{countdownVal}</div>
                ) : phase === 'active' ? (
                    <>
                        <div className={`text-2xl font-black uppercase tracking-wider ${zone.color} animate-bounce-in`}>
                            {zone.label}
                        </div>
                        <div className="text-slate-500 font-mono text-xs">
                            INTENSIDAD: {Math.round(currentLevel)}%
                        </div>
                    </>
                ) : (
                    <button 
                        onClick={startExercise}
                        className="px-8 py-4 bg-amber-500 text-black font-black rounded-xl hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                        <span className="material-symbols-outlined">mic</span>
                         INICIAR TEST ({EXERCISE_DURATION}s)
                    </button>
                )}
            </div>

        </div>

    </div>
  );
}
