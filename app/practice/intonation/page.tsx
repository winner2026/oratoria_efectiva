"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePitchDetector } from "@/hooks/usePitchDetector";

// --- CAPTIVATING INTONATION SCORING ALGORITHM ---
// Evaluates 4 key aspects of engaging speech intonation:
// 1. Variation (15-50 Hz stdDev is ideal)
// 2. Strategic Pauses (0.5-2s pauses add drama)
// 3. Emphasis Patterns (peaks and valleys well distributed)
// 4. Exaggeration Penalty (too much variation sounds theatrical)

const EXERCISE_DURATION = 30; // seconds
const MIN_PITCH_SAMPLES = 30; // minimum samples for valid scoring
const SAMPLE_RATE_MS = 50;    // 20 samples per second

interface IntonationStats {
    samples: number;
    avgPitch: number;
    stdDev: number;
    range: number;           // max - min pitch
    peakCount: number;       // emphasis moments
    valleyCount: number;     // soft moments  
    pauseCount: number;      // strategic pauses detected
    variationScore: number;  // 0-100
    pauseScore: number;      // 0-100
    emphasisScore: number;   // 0-100
    overallScore: number;    // 0-100
}

function analyzeIntonation(pitchHistory: number[]): IntonationStats {
    const validPitches = pitchHistory.filter(p => p > 0);
    
    // Default empty stats
    const emptyStats: IntonationStats = {
        samples: validPitches.length,
        avgPitch: 0,
        stdDev: 0,
        range: 0,
        peakCount: 0,
        valleyCount: 0,
        pauseCount: 0,
        variationScore: 0,
        pauseScore: 0,
        emphasisScore: 0,
        overallScore: 0,
    };
    
    if (validPitches.length < MIN_PITCH_SAMPLES) return emptyStats;

    // === 1. BASIC STATISTICS ===
    const avgPitch = validPitches.reduce((a, b) => a + b, 0) / validPitches.length;
    const squaredDiffs = validPitches.map(p => Math.pow(p - avgPitch, 2));
    const stdDev = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length);
    const minPitch = Math.min(...validPitches);
    const maxPitch = Math.max(...validPitches);
    const range = maxPitch - minPitch;

    // === 2. VARIATION SCORE (40% weight) ===
    // Ideal: 15-50 Hz stdDev for captivating speech
    // < 10 Hz = monotone, > 60 Hz = theatrical/singing
    let variationScore: number;
    if (stdDev < 10) {
        variationScore = (stdDev / 10) * 40; // 0-40 pts for monotone
    } else if (stdDev <= 50) {
        // Sweet spot: 10-50 Hz gets 40-100 points
        variationScore = 40 + ((stdDev - 10) / 40) * 60;
    } else if (stdDev <= 80) {
        // Mild penalty for theatrical (50-80 Hz)
        variationScore = 100 - ((stdDev - 50) / 30) * 20; // 100 -> 80
    } else {
        // Heavy penalty for singing/shouting (>80 Hz)
        variationScore = Math.max(50, 80 - ((stdDev - 80) / 20) * 30);
    }
    variationScore = Math.min(100, Math.max(0, variationScore));

    // === 3. PAUSE DETECTION (20% weight) ===
    // Count gaps in pitch data (zeros) that last 0.3-3 seconds
    let pauseCount = 0;
    let currentPauseLength = 0;
    const minPauseLength = 6;   // 0.3s at 20 samples/sec
    const maxPauseLength = 60;  // 3s at 20 samples/sec
    
    for (let i = 0; i < pitchHistory.length; i++) {
        if (pitchHistory[i] === 0) {
            currentPauseLength++;
        } else {
            if (currentPauseLength >= minPauseLength && currentPauseLength <= maxPauseLength) {
                pauseCount++;
            }
            currentPauseLength = 0;
        }
    }
    
    // Ideal: 2-6 strategic pauses in 30 seconds
    let pauseScore: number;
    if (pauseCount === 0) {
        pauseScore = 30; // Some points for continuous speech
    } else if (pauseCount <= 2) {
        pauseScore = 50 + pauseCount * 15;
    } else if (pauseCount <= 6) {
        pauseScore = 80 + (pauseCount - 2) * 5; // 80-100
    } else {
        // Too many pauses = hesitant
        pauseScore = Math.max(40, 100 - (pauseCount - 6) * 10);
    }
    pauseScore = Math.min(100, Math.max(0, pauseScore));

    // === 4. EMPHASIS PATTERNS (40% weight) ===
    // Detect peaks (emphasis) and valleys (soft moments)
    let peakCount = 0;
    let valleyCount = 0;
    const windowSize = 10; // 0.5s window
    
    for (let i = windowSize; i < validPitches.length - windowSize; i++) {
        const windowBefore = validPitches.slice(i - windowSize, i);
        const windowAfter = validPitches.slice(i + 1, i + windowSize + 1);
        const avgBefore = windowBefore.reduce((a, b) => a + b, 0) / windowBefore.length;
        const avgAfter = windowAfter.reduce((a, b) => a + b, 0) / windowAfter.length;
        const current = validPitches[i];
        
        // Peak: current is significantly higher than surrounding average
        if (current > avgBefore + stdDev * 0.5 && current > avgAfter + stdDev * 0.5) {
            peakCount++;
            i += windowSize; // Skip to avoid counting same peak
        }
        // Valley: current is significantly lower than surrounding average
        else if (current < avgBefore - stdDev * 0.5 && current < avgAfter - stdDev * 0.5) {
            valleyCount++;
            i += windowSize;
        }
    }
    
    // Ideal: 3-10 emphasis moments (peaks + valleys) in 30 seconds
    const emphasisMoments = peakCount + valleyCount;
    let emphasisScore: number;
    if (emphasisMoments < 2) {
        emphasisScore = emphasisMoments * 30; // 0-60 for flat speech
    } else if (emphasisMoments <= 10) {
        emphasisScore = 60 + ((emphasisMoments - 2) / 8) * 40; // 60-100
    } else {
        // Too erratic
        emphasisScore = Math.max(50, 100 - (emphasisMoments - 10) * 5);
    }
    emphasisScore = Math.min(100, Math.max(0, emphasisScore));

    // === OVERALL SCORE ===
    // Weighted: 40% variation, 20% pauses, 40% emphasis
    const overallScore = Math.round(
        variationScore * 0.4 +
        pauseScore * 0.2 +
        emphasisScore * 0.4
    );

    return {
        samples: validPitches.length,
        avgPitch: Math.round(avgPitch),
        stdDev: Math.round(stdDev),
        range: Math.round(range),
        peakCount,
        valleyCount,
        pauseCount,
        variationScore: Math.round(variationScore),
        pauseScore: Math.round(pauseScore),
        emphasisScore: Math.round(emphasisScore),
        overallScore,
    };
}

function getScoreLabel(score: number): { label: string; color: string; emoji: string } {
    if (score >= 80) return { label: "Entonación Atrapante", color: "text-green-400", emoji: "🎯" };
    if (score >= 65) return { label: "Expresivo Natural", color: "text-emerald-400", emoji: "✨" };
    if (score >= 50) return { label: "Conversacional", color: "text-cyan-400", emoji: "💬" };
    if (score >= 35) return { label: "Puede Mejorar", color: "text-amber-400", emoji: "📈" };
    if (score >= 20) return { label: "Algo Plano", color: "text-orange-400", emoji: "📊" };
    return { label: "Muy Monótono", color: "text-red-400", emoji: "🔇" };
}

function getNoteFromFreq(freq: number) {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const c0 = 16.35;
    if (freq === 0) return "";
    
    const halfStepsFromC0 = Math.round(12 * Math.log2(freq / c0));
    const octave = Math.floor(halfStepsFromC0 / 12);
    const noteIndex = halfStepsFromC0 % 12;
    
    return notes[noteIndex < 0 ? noteIndex + 12 : noteIndex] + octave;
}

/**
 * Exercise: El Afinador de Voz
 * Goal: Visualize pitch to avoid monotony.
 * NOW WITH SCORING!
 */
export default function IntonationPage() {
  const router = useRouter();
  const { isListening, startListening, stopListening, pitch, volume, clarity } = usePitchDetector();
  
  const [history, setHistory] = useState<number[]>([]);
  const [fullPitchHistory, setFullPitchHistory] = useState<number[]>([]);
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'active' | 'results'>('idle');
  const [countdownVal, setCountdownVal] = useState(5);
  const [timeLeft, setTimeLeft] = useState(EXERCISE_DURATION);
  const [finalStats, setFinalStats] = useState<IntonationStats | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pitchRef = useRef(0);     // Track current pitch for sampling
  const clarityRef = useRef(0);   // Track current clarity for sampling
  
  // Keep refs in sync with current values
  useEffect(() => {
      pitchRef.current = pitch;
      clarityRef.current = clarity;
  }, [pitch, clarity]);
  
  // Cleanup on unmount
  useEffect(() => {
      return () => {
          stopListening();
          if (timerRef.current) clearInterval(timerRef.current);
      };
  }, [stopListening]);
  
  // Start exercise (Countdown)
  const startExercise = useCallback(() => {
      setPhase('countdown');
      setCountdownVal(5);
      
      startListening(); // Init audio to get permissions

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
      setHistory([]);
      setFullPitchHistory([]);

      timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
              if (prev <= 1) {
                  // Time's up!
                  if (timerRef.current) clearInterval(timerRef.current);
                  stopListening();
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
  };
  
  // End exercise when timer hits 0
  useEffect(() => {
      if (timeLeft === 0 && phase === 'active') {
          const stats = analyzeIntonation(fullPitchHistory);
          setFinalStats(stats);
          setPhase('results');
          
          // Save to local storage for history
          const exerciseResult = {
              id: 'intonation-' + Date.now(),
              type: 'intonation',
              score: stats.overallScore,
              stats,
              date: new Date().toISOString(),
          };
          const history = JSON.parse(localStorage.getItem('exercise_history') || '[]');
          history.unshift(exerciseResult);
          localStorage.setItem('exercise_history', JSON.stringify(history.slice(0, 50)));
      }
  }, [timeLeft, phase, fullPitchHistory]);
  
  // Update History Loop - using refs for real-time values
  useEffect(() => {
    if (!isListening || phase !== 'active') return;
    
    const interval = setInterval(() => {
        // Use refs for real-time values (not stale closure values)
        const currentPitch = pitchRef.current;
        const currentClarity = clarityRef.current;
        
        // Lower clarity threshold (0.3) for natural speech detection on mobile
        // Speech has lower clarity than singing
        const val = (currentClarity > 0.3 && currentPitch > 0) ? currentPitch : 0;
        
        // For visualization (last 100 points)
        setHistory(prev => {
            const next = [...prev, val];
            if (next.length > 100) next.shift();
            return next;
        });
        
        // For scoring (all points with valid pitch)
        if (val > 0) {
            setFullPitchHistory(prev => [...prev, val]);
        }
        
    }, 50); // 20fps updates
    
    return () => clearInterval(interval);
  }, [isListening, phase]); // Removed pitch/clarity from deps - using refs now
  
  // Draw Loop
  useEffect(() => {
     const canvas = canvasRef.current;
     if (!canvas) return;
     const ctx = canvas.getContext("2d");
     if (!ctx) return;
     
     const width = canvas.width;
     const height = canvas.height;
     
     ctx.clearRect(0, 0, width, height);
     
     // Grid
     ctx.strokeStyle = "rgba(255,255,255,0.05)";
     ctx.lineWidth = 1;
     [100, 150, 200, 250, 300].forEach(hz => {
         const y = height - ((hz - 50) / 350) * height;
         ctx.beginPath();
         ctx.moveTo(0, y);
         ctx.lineTo(width, y);
         ctx.stroke();
         ctx.fillStyle = "rgba(255,255,255,0.2)";
         ctx.font = "10px monospace";
         ctx.fillText(hz + "Hz", 5, y - 2);
     });
     
     if (history.length < 2) return;
     
     ctx.beginPath();
     ctx.lineWidth = 4;
     ctx.strokeStyle = "#fbbf24"; // Amber-400
     ctx.lineCap = "round";
     ctx.lineJoin = "round";
     
     const stepX = width / 100;
     let started = false;
     
     for (let i = 0; i < history.length; i++) {
         const p = history[i];
         const x = i * stepX;
         const normalizedP = Math.max(0, Math.min(1, (p - 50) / 350));
         const y = height - (normalizedP * height);
         
         if (p === 0) {
             started = false;
             continue;
         }
         
         if (!started) {
             ctx.moveTo(x, y);
             started = true;
         } else {
             ctx.lineTo(x, y);
         }
     }
     ctx.stroke();
     
     // Glow effect
     ctx.shadowBlur = 10;
     ctx.shadowColor = "#f59e0b";
     ctx.stroke();
     ctx.shadowBlur = 0;
     
  }, [history]);

  // --- RESULTS VIEW ---
  if (phase === 'results' && finalStats) {
      const scoreData = getScoreLabel(finalStats.overallScore);
      return (
          <div className="min-h-screen bg-slate-950 font-display text-white p-6 flex flex-col items-center justify-center overflow-y-auto">
              <div className="max-w-md w-full space-y-6 animate-fade-in py-8">
                  
                  {/* Score Circle */}
                  <div className="relative mx-auto size-40">
                      <svg className="size-40 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                          <circle 
                              cx="50" cy="50" r="45" fill="none" 
                              stroke="url(#gradient-int)" strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={`${finalStats.overallScore * 2.83} 283`}
                              className="transition-all duration-1000"
                          />
                          <defs>
                              <linearGradient id="gradient-int" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#f59e0b" />
                                  <stop offset="100%" stopColor="#22c55e" />
                              </linearGradient>
                          </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black">{finalStats.overallScore}</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Puntos</span>
                      </div>
                  </div>
                  
                  {/* Label */}
                  <div className="text-center space-y-2">
                      <div className="text-2xl md:text-3xl">{scoreData.emoji}</div>
                      <h2 className={`text-lg md:text-xl font-black ${scoreData.color}`}>{scoreData.label}</h2>
                      <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed px-2">
                          {finalStats.overallScore >= 70 
                              ? "¡Tu entonación es atrapante! Varías el tono, usas pausas y enfatizas bien."
                              : finalStats.overallScore >= 50
                              ? "Buena base. Prueba añadir más énfasis en palabras clave y pausas estratégicas."
                              : "Tu voz suena algo plana. Imagina que cuentas algo emocionante a un amigo."}
                      </p>
                  </div>
                  
                  {/* 4 Criteria Breakdown */}
                  <div className="space-y-2">
                      <div className="text-xs text-slate-500 uppercase tracking-widest text-center mb-3">Desglose de Puntuación</div>
                      
                      {/* Variation */}
                      <div className="bg-slate-900 rounded-xl p-3 border border-white/5">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-semibold">🎵 Variación Tonal</span>
                              <span className="text-amber-400 font-bold">{finalStats.variationScore}/100</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500" style={{width: `${finalStats.variationScore}%`}} />
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">StdDev: {finalStats.stdDev} Hz | Rango: {finalStats.range} Hz</div>
                      </div>
                      
                      {/* Pauses */}
                      <div className="bg-slate-900 rounded-xl p-3 border border-white/5">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-semibold">⏸️ Pausas Estratégicas</span>
                              <span className="text-cyan-400 font-bold">{finalStats.pauseScore}/100</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500" style={{width: `${finalStats.pauseScore}%`}} />
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">{finalStats.pauseCount} pausas detectadas (ideal: 2-6)</div>
                      </div>
                      
                      {/* Emphasis */}
                      <div className="bg-slate-900 rounded-xl p-3 border border-white/5">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-semibold">📢 Patrones de Énfasis</span>
                              <span className="text-green-400 font-bold">{finalStats.emphasisScore}/100</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500" style={{width: `${finalStats.emphasisScore}%`}} />
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">↑ {finalStats.peakCount} picos | ↓ {finalStats.valleyCount} valles</div>
                      </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-900/50 rounded-xl p-3 text-center border border-white/5">
                          <div className="text-[10px] text-slate-500 uppercase">Promedio</div>
                          <div className="text-lg font-bold">{finalStats.avgPitch}<span className="text-xs text-slate-600">Hz</span></div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-3 text-center border border-white/5">
                          <div className="text-[10px] text-slate-500 uppercase">Muestras</div>
                          <div className="text-lg font-bold">{finalStats.samples}</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-3 text-center border border-white/5">
                          <div className="text-[10px] text-slate-500 uppercase">Duración</div>
                          <div className="text-lg font-bold">{EXERCISE_DURATION}s</div>
                      </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                      <button
                          onClick={() => {
                              setPhase('idle');
                              setHistory([]);
                              setFullPitchHistory([]);
                              setTimeLeft(EXERCISE_DURATION);
                              setFinalStats(null);
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
       
        {/* Header */}
        <div className="w-full max-w-lg mx-auto flex items-center justify-between px-6 py-6 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-30">
             <Link href="/gym" onClick={stopListening} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Salir</span>
             </Link>
             <div className="flex items-center gap-2">
                 {phase === 'active' && (
                     <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                         <span className="text-amber-400 font-mono font-bold">{timeLeft}s</span>
                     </div>
                 )}
                 <div className={`size-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
                 <span className="text-[10px] font-bold uppercase text-slate-500">Live</span>
             </div>
        </div>
        
        <div className="mobile-container pt-8 flex flex-col items-center">
            

            <div className="text-center space-y-4 mb-8">
                 <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
                    Afinador de Voz
                 </h1>
                 <div className="text-slate-400 text-xs md:text-sm max-w-md mx-auto space-y-2">
                    {phase === 'idle' ? (
                        <>
                            <p>Este ejercicio analiza tu <strong>melodía al hablar</strong> (entonación).</p>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-left text-[11px] md:text-xs space-y-2">
                                <p className="font-bold text-amber-400 uppercase tracking-wider mb-1">Cómo usarlo:</p>
                                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                    <li>Pulsa iniciar y habla durante 30s (cuenta una historia o lee algo).</li>
                                    <li><strong>Evita monólogos planos</strong> (línea recta).</li>
                                    <li>Busca picos (énfasis) y valles (bajar la voz).</li>
                                    <li>Intenta no sonar robótico. Sé expresivo.</li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p className="animate-pulse text-amber-400 font-bold">¡Habla con emoción! Sube y baja el tono para enfatizar.</p>
                    )}
                 </div>
            </div>


        {/* Visualizer Container */}
        <div className="relative w-full h-[250px] md:h-[400px] bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
             
             {/* Overlay Content */}
             {phase === 'countdown' && (
                 <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10 animate-bounce-in">
                      <div className="text-9xl font-black text-amber-500 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
                          {countdownVal}
                      </div>
                 </div>
             )}

             {phase === 'idle' && (
                 <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                      <button 
                        onClick={startExercise}
                        className="px-6 py-3 md:px-8 md:py-4 bg-white text-black font-black text-sm md:text-base rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-xl"
                      >
                         <span className="material-symbols-outlined">mic</span>
                         INICIAR ({EXERCISE_DURATION}s)
                      </button>
                 </div>
             )}
             
             {/* Canvas Layer */}
             <canvas 
                ref={canvasRef} 
                width={1000} 
                height={400} 
                className="w-full h-full block"
             />
        </div>
        
        {/* Live Stats */}
        {phase === 'active' && (
            <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
                <div className="bg-slate-900 rounded-2xl p-6 text-center border border-white/5">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Tono Actual</div>
                    <div className="text-3xl font-black text-white tabular-nums">
                        {pitch > 0 ? Math.round(pitch) : '--'} <span className="text-sm text-slate-600">Hz</span>
                    </div>
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 text-center border border-white/5">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Nota</div>
                    <div className="text-3xl font-black text-amber-400 tabular-nums">
                        {pitch > 0 ? getNoteFromFreq(pitch) : '--'}
                    </div>
                </div>
            </div>
        )}

        </div>
    </div>
  );
}
