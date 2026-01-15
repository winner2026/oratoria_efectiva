"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePitchDetector } from "@/hooks/usePitchDetector";

// --- Phrases to Practice (Affirmations of Power) ---
const PHRASES = [
    { text: "El proyecto es viable.", focus: "viable" },
    { text: "Yo soy el responsable.", focus: "responsable" },
    { text: "Vamos a cerrar el trato.", focus: "trato" },
    { text: "Esta es la mejor opción.", focus: "opción" },
    { text: "No acepto esa condición.", focus: "condición" },
    { text: "El equipo está listo.", focus: "listo" }
];

export default function InflectionPage() {
    const { isListening, startListening, stopListening, pitch } = usePitchDetector();
    const [phase, setPhase] = useState<"idle" | "recording" | "result">("idle");
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [pitchHistory, setPitchHistory] = useState<number[]>([]);
    const [recordingTime, setRecordingTime] = useState(0);
    const [feedback, setFeedback] = useState<{ status: "success" | "fail", msg: string, dropHz: number } | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const historyRef = useRef<number[]>([]); // To avoid stale closure issues

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
                // Auto-stop after 4 seconds (phrases are short)
                if (next >= 4) {
                    analyzeResult();
                    return 4;
                }
                return next;
            });
        }, 1000);
    };

    const handleStopEarly = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        analyzeResult();
    };

    const analyzeResult = () => {
        stopListening();
        setPhase("result");

        const data = historyRef.current;
        if (data.length < 10) {
            setFeedback({ status: "fail", msg: "Audio muy corto o no detectado.", dropHz: 0 });
            return;
        }

        // Logic: Compare Average of the first 70% vs Average of the last 20%
        // (Assuming the last part is the "drop")
        const splitIndex = Math.floor(data.length * 0.7);
        const bodyPart = data.slice(0, splitIndex);
        const tailPart = data.slice(splitIndex);

        const avgBody = bodyPart.reduce((a,b) => a+b, 0) / bodyPart.length;
        const avgTail = tailPart.reduce((a,b) => a+b, 0) / tailPart.length;

        const drop = avgBody - avgTail; // Positive means it dropped (Body > Tail)
        
        // Threshold: Needs to drop at least 15z to be clear authority
        // If drop is negative, it went UP (Question tone)
        
        if (drop > 15) {
            setFeedback({ 
                status: "success", 
                msg: "¡Excelente! Caída de autoridad confirmada.", 
                dropHz: Math.round(drop) 
            });
        } else if (drop < -5) {
            setFeedback({ 
                status: "fail", 
                msg: "Inseguridad detectada. Subiste el tono (¿Pregunta?).", 
                dropHz: Math.round(drop) 
            });
        } else {
             setFeedback({ 
                status: "fail", 
                msg: "Tono plano. Te faltó contundencia al cerrar.", 
                dropHz: Math.round(drop) 
            });
        }
    };

    const nextPhrase = () => {
        setPhase("idle");
        setCurrentPhraseIndex(prev => (prev + 1) % PHRASES.length);
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
                     <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Módulo: Inflexión</span>
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
                                    {feedback.status === 'success' ? 'AUTORIDAD CONFIRMADA' : 'FALLO DE ESTATUS'}
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
                                    Siguiente Frase
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
