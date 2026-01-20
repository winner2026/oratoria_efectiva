"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePitchDetector } from "@/hooks/usePitchDetector";

// --- Phrases to Practice (Affirmations of Power) ---
// --- Phrases to Practice (Affirmations of Power) ---
const PHRASES = [
    { text: "El proyecto es viable.", focus: "viable" },
    { text: "Yo soy el responsable.", focus: "responsable" },
    { text: "Vamos a cerrar el trato.", focus: "trato" },
    { text: "Esta es la mejor opción.", focus: "opción" },
    { text: "No acepto esa condición.", focus: "condición" },
    { text: "El equipo está listo.", focus: "listo" },
    { text: "Confío en mi decisión.", focus: "decisión" },
    { text: "Hablemos de los resultados.", focus: "resultados" },
    { text: "Esa es mi propuesta final.", focus: "final" },
    { text: "Tengo la solución exacta.", focus: "exacta" },
    { text: "Sé lo que estoy haciendo.", focus: "haciendo" },
    { text: "El precio es justo.", focus: "justo" },
    { text: "No hay vuelta atrás.", focus: "atrás" },
    { text: "La estrategia es sólida.", focus: "sólida" },
    { text: "Asumo el control total.", focus: "total" },
    { text: "Esto no es negociable.", focus: "negociable" },
    { text: "Vamos a ganar esto.", focus: "ganar" },
    { text: "Soy la autoridad aquí.", focus: "autoridad" },
    { text: "El plan está aprobado.", focus: "aprobado" },
    { text: "No tengo ninguna duda.", focus: "duda" },
    { text: "El riesgo es mínimo.", focus: "mínimo" },
    { text: "Quiero una respuesta ahora.", focus: "ahora" },
    { text: "Esto se hace así.", focus: "así" },
    { text: "Conozco el camino correcto.", focus: "correcto" },
    { text: "La meta está clara.", focus: "clara" },
    { text: "Nadie lo hace mejor.", focus: "mejor" },
    { text: "Es una oportunidad única.", focus: "única" },
    { text: "Lo haré a mi manera.", focus: "manera" },
    { text: "El éxito es inevitable.", focus: "inevitable" },
    { text: "Yo defino los términos.", focus: "términos" }
];

export default function InflectionPage() {
    const { isListening, startListening, stopListening, pitch } = usePitchDetector();
    const [phase, setPhase] = useState<"idle" | "recording" | "result">("idle");
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0); // Default 0, updated on mount
    const [pitchHistory, setPitchHistory] = useState<number[]>([]);
    const [recordingTime, setRecordingTime] = useState(0);
    const [feedback, setFeedback] = useState<{ status: "success" | "fail", msg: string, dropHz: number } | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const historyRef = useRef<number[]>([]); // To avoid stale closure issues

    // Load unique phrase for this session
    useEffect(() => {
        // Simple rotation logic based on usage history
        const used = JSON.parse(localStorage.getItem('inflection_used_phrases') || '[]');
        
        // Find first unused index
        let nextIndex = PHRASES.findIndex((_, i) => !used.includes(i));
        
        // If all used, reset history
        if (nextIndex === -1) {
            localStorage.setItem('inflection_used_phrases', '[]');
            nextIndex = 0;
        }

        setCurrentPhraseIndex(nextIndex);
        
        // Mark as seen immediately (so refresh gives next one? No, mark as seen when COMPLETED? 
        // Or just mark as seen now so next session is new. Let's mark as seen now.)
        const newUsed = [...used, nextIndex];
        localStorage.setItem('inflection_used_phrases', JSON.stringify(newUsed));

    }, []);

    const currentPhrase = PHRASES[currentPhraseIndex];

    // Cleanup
    useEffect(() => {
        return () => {
            stopListening();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Track pitch when recording
    useEffect(() => {
        if (phase === "recording" && isListening) {
             // Avoid 0 or extremely low false positives
             if (pitch > 50 && pitch < 500) {
                 historyRef.current.push(pitch);
             }
        }
    }, [pitch, phase, isListening]);

    const handleStart = () => {
        historyRef.current = [];
        setPitchHistory([]);
        setFeedback(null);
        setPhase("recording");
        setRecordingTime(0);
        startListening();

        timerRef.current = setInterval(() => {
            setRecordingTime(prev => {
                const next = prev + 1;
                // Extended to 6 seconds to allow reading without interruption
                if (next >= 6) {
                    analyzeResult();
                    return 6;
                }
                return next;
            });
        }, 1000);
    };

    const handleStopEarly = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        analyzeResult();
    };

    const [streak, setStreak] = useState(0);
    const [missionComplete, setMissionComplete] = useState(false);

    // ... existing refs

    const analyzeResult = () => {
        stopListening();
        setPhase("result");

        const data = historyRef.current;
        if (data.length < 10) {
            setFeedback({ status: "fail", msg: "Audio muy corto. Habla más fuerte.", dropHz: 0 });
            return;
        }

        const splitIndex = Math.floor(data.length * 0.7);
        const bodyPart = data.slice(0, splitIndex);
        const tailPart = data.slice(splitIndex);

        const avgBody = bodyPart.reduce((a,b) => a+b, 0) / bodyPart.length;
        const avgTail = tailPart.reduce((a,b) => a+b, 0) / tailPart.length;

        const drop = avgBody - avgTail; 
        
        // Strict threshold: > 10Hz drop to count as "Authority"
        if (drop > 10) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            
            if (newStreak >= 3) {
                 setMissionComplete(true);
                 setFeedback({ 
                    status: "success", 
                    msg: "¡MISIÓN CUMPLIDA! 3 DE 3.", 
                    dropHz: Math.round(drop) 
                });
            } else {
                setFeedback({ 
                    status: "success", 
                    msg: `¡Bien! Llevas ${newStreak} de 3 seguidas.`, 
                    dropHz: Math.round(drop) 
                });
            }

        } else {
            setStreak(0); // RESET STREAK ON FAILURE
            
            let failureMsg = "El tono se mantuvo plano (monótono).";
            if (drop < -5) {
                failureMsg = "Detectamos una inflexión ascendente (pregunta).";
            }

            setFeedback({ 
                status: "fail", 
                msg: failureMsg, 
                dropHz: Math.round(drop) 
            });
        }

        // [CORE Scan] Ingest
        import("@/services/CoreDiagnosticService").then(({ CoreDiagnosticService }) => {
             CoreDiagnosticService.getInstance().ingest({
                 sourceExerciseId: 'sentence-closure',
                 layer: 'EJECUCION',
                 metricType: 'STABILITY', // Tonal Control
                 value: Math.max(0, Math.min(100, 50 + drop)), 
                 rawUnit: 'hz_diff'
             });
        });
    };

    const nextPhrase = () => {
        if (missionComplete) {
            // Pick next unused phrase directly
            const used = JSON.parse(localStorage.getItem('inflection_used_phrases') || '[]');
            let nextIndex = PHRASES.findIndex((_, i) => !used.includes(i));
            
            if (nextIndex === -1) {
                localStorage.setItem('inflection_used_phrases', '[]');
                nextIndex = 0;
            }
            
            const newUsed = [...used, nextIndex];
            localStorage.setItem('inflection_used_phrases', JSON.stringify(newUsed));
            
            setCurrentPhraseIndex(nextIndex);
            
            // Reset state
            setStreak(0);
            setMissionComplete(false);
            setPhase("idle");
        } else {
             // Just retry same phrase if not complete? 
             // "No repitas las misma frase" - This implies sequential NON-repeating.
             // But if I failed, I should retry the SAME phrase? Or move on?
             // "Una para cada practica" -> Stick to 1 until done.
             // The previous logic for nextPhrase allowed skipping.
             // If mission NOT complete, we should probably just reset to IDLE to try again.
             setPhase("idle");
        }
        setFeedback(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-display flex flex-col relative overflow-hidden">
             
             {/* Background Effects */}
             <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] transition-colors duration-700
                    ${phase === 'idle' ? 'bg-blue-900/10' : 
                      feedback?.status === 'success' ? 'bg-green-500/20' : 
                      feedback?.status === 'fail' ? 'bg-red-500/20' : 'bg-amber-500/20'}`} 
                />
             </div>

             {/* Header */}
             <div className="relative z-10 px-6 py-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-md border-b border-white/5">
                <Link href="/gym" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Gimnasio</span>
                </Link>
                <div className="flex items-center gap-2">
                     <div className={`px-3 py-1 rounded-full text-xs font-bold border ${streak > 0 ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
                        RACHA: {streak}/3
                     </div>
                </div>
             </div>

             <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10 w-full max-w-lg mx-auto">
                
                <h1 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
                    Cierre de Poder 📉
                </h1>

                {/* Card */}
                <div className="w-full bg-slate-900/80 border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    
                    {/* Visualizer Bar (Simulated or Real) */}
                    {phase === 'recording' && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                            <div 
                                className="h-full bg-amber-500 transition-all duration-100" 
                                style={{ width: `${Math.min(100, (pitch / 300) * 100)}%` }} // Rough visualization
                            />
                        </div>
                    )}

                    {/* Phrase Display */}
                    <div className="mb-10 space-y-4">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Lee en voz alta</p>
                        <p className="text-3xl md:text-4xl font-serif font-medium leading-snug">
                            {currentPhrase.text.split(" ").map((word, i) => {
                                // Highlight the last word (focus)
                                const isFocus = word.toLowerCase().includes(currentPhrase.focus);
                                return (
                                    <span key={i} className={isFocus ? "text-amber-400 font-bold" : "text-white"}>
                                        {word}{" "}
                                    </span>
                                )
                            })} 📉
                        </p>
                    </div>

                    {/* Interaction Area */}
                    <div className="min-h-[120px] flex flex-col items-center justify-center">
                        
                        {phase === 'idle' && (
                             <button 
                                onClick={handleStart}
                                className="size-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform group"
                             >
                                <span className="material-symbols-outlined text-4xl text-slate-900 group-hover:text-black">mic</span>
                             </button>
                        )}

                        {phase === 'recording' && (
                            <div className="space-y-4">
                                <div className="text-amber-400 font-bold text-lg animate-pulse">Escuchando... {recordingTime}s</div>
                                <button 
                                    onClick={handleStopEarly}
                                    className="px-6 py-2 bg-slate-800 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors"
                                >
                                    Detener
                                </button>
                            </div>
                        )}

                        {phase === 'result' && feedback && (
                            <div className="animate-fade-in-up w-full">
                                <div className={`text-5xl mb-4 ${feedback.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {feedback.status === 'success' ? '✓' : '✗'}
                                </div>
                                <h3 className={`text-xl font-black mb-2 ${feedback.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {feedback.status === 'success' ? 'AUTORIDAD CONFIRMADA' : 'AUTORIDAD NO CONFIRMADA'}
                                </h3>
                                <p className="text-slate-300 mb-6 text-sm">{feedback.msg}</p>
                                
                                {feedback.dropHz !== 0 && (
                                     <div className="inline-block px-4 py-2 bg-slate-800 rounded-lg text-xs font-mono text-slate-400 mb-6 border border-white/5">
                                        Variación Tonal: <span className={feedback.dropHz > 0 ? "text-green-400" : "text-red-400"}>
                                            {feedback.dropHz > 0 ? `-${feedback.dropHz}Hz (Bajada)` : `+${Math.abs(feedback.dropHz)}Hz (Subida)`}
                                        </span>
                                     </div>
                                )}

                                <button 
                                    onClick={nextPhrase}
                                    className="w-full py-4 bg-white text-black font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg"
                                >
                                    {feedback.status === 'success' && !missionComplete ? 'Continuar Racha' : missionComplete ? 'Nueva Frase' : 'Intentar de Nuevo'}
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                <div className="mt-8 text-xs text-slate-500 max-w-xs leading-relaxed">
                    💡 <strong>Tip Pro:</strong> Imagina que pones un punto final pesado, golpeando la mesa, al decir la última palabra.
                </div>

             </main>
        </div>
    );
}
