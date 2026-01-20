
"use client";

import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import Link from 'next/link';
import Script from 'next/script';

// NOTES DATA: A1 to A3 (Deep Male Range)
// NOTES DATA: C1 to C8 (Full 7 Octaves for Classical Vocal Ranges)
const generateNotes = () => {
    const notes = [];
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    // A4 = 440Hz reference
    const getFreq = (stepsFromA4: number) => 440 * Math.pow(2, stepsFromA4 / 12);

    for (let octave = 1; octave <= 7; octave++) {
        for (let i = 0; i < 12; i++) {
            const note = noteNames[i];
            const noteWithOctave = `${note}${octave}`;
            
            // Calculate steps from A4 (which is in octave 4, index 9)
            // A4 is 440. 
            // C4 is -9 steps from A4. 
            // C1 is C4 - 3 octaves = -9 - 36 = -45 steps?
            // Let's use Tone.js logic or simple offset.
            // A4 index absolute = 4 * 12 + 9 = 57 (if C0 is 0)
            // current index = octave * 12 + i
            const semitonesFromA4 = (octave * 12 + i) - 57;
            const freq = getFreq(semitonesFromA4);
            
            notes.push({
                note: noteWithOctave,
                freq: Number(freq.toFixed(2)),
                color: note.includes("#") ? "black" : "white"
            });
        }
    }
    // Add C8
    notes.push({ note: "C8", freq: 4186.01, color: "white" });
    return notes;
};
const NOTES = generateNotes();

export default function SmartPiano({ onClose, isStandalone = false }: { onClose?: () => void, isStandalone?: boolean }) {
    const [isToneReady, setIsToneReady] = useState(false);
    const [calibrating, setCalibrating] = useState(false);
    
    // Calibration State
    const [instantPitch, setInstantPitch] = useState<number | null>(null);
    const [instantNoteName, setInstantNoteName] = useState<string>("--");
    const [debugInfo, setDebugInfo] = useState<{ rms: number, clarity: number } | null>(null);
    
    // Final results
    const [userFundamental, setUserFundamental] = useState<number | null>(null); // Hz
    const [detectedNoteIndex, setDetectedNoteIndex] = useState<number | null>(null);
    const [safeRange, setSafeRange] = useState<[number, number] | null>(null); // [minIndex, maxIndex]
    
    const [activeNote, setActiveNote] = useState<string | null>(null);
    const [suggestion, setSuggestion] = useState("Activa una frecuencia y haz 'Mmm'...");
    
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const pitchEstimatorRef = useRef<any>(null);

    // State Ref for Loop Condition (Fixes Stale Closure)
    const isCalibratingRef = useRef(false);

    // Audio Refs
    const pianoRef = useRef<Tone.PolySynth | null>(null);
    const reverbRef = useRef<Tone.Reverb | null>(null);
    
    // Analysis Refs
    const analyserRef = useRef<AnalyserNode | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null); 
    const animationFrameRef = useRef<number>(0);
    const keyRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    // Direct DOM State Tracking (Stale closure fix)
    const lastDetectedIndexRef = useRef<number | null>(null);
    // Smoothing Buffer
    const pitchBufferRef = useRef<number[]>([]);

    const SUGGESTIONS = [
        "Haz un 'Lip Trill' (Brrr) con la frecuencia.",
        "Usa una 'M' resonante: Mmmmmm...",
        "Di 'NG' como en 'Sing' manteniendo el tono.",
        "Sube 3 frecuencias y baja: Do-Re-Mi-Re-Do.",
        "Haz 'Uuu' suavemente como un búho.",
        "Di 'Ga-Ga-Ga' para relajar la mandíbula."
    ];

    const nextSuggestion = () => {
        const idx = Math.floor(Math.random() * SUGGESTIONS.length);
        setSuggestion(SUGGESTIONS[idx]);
    };

    useEffect(() => {
        // Initial Center on Middle C (C4)
        const timer = setTimeout(() => {
             const midKey = keyRefs.current[36];
             if (midKey) {
                 midKey.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
             }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Initialize Tone.js
    useEffect(() => {
        const initTone = async () => {
             // Create Reverb
            const reverb = new Tone.Reverb({
                decay: 2.5,
                preDelay: 0.1,
                wet: 0.3
            }).toDestination();
            await reverb.generate();
            reverbRef.current = reverb;

            // Create EQ: Natural Grand Piano (Subtle adjustments)
            const eq = new Tone.EQ3({
                low: 3, 
                mid: 0,
                high: 5, // Clarity without harshness
                lowFrequency: 200, 
                highFrequency: 2500
            }).connect(reverb);

            // REAL SAMPLES: Salamander Grand Piano (closest to "Steinway/Straviauss")
            // This replaces synthesis with actual recorded piano strings
            const piano = new Tone.Sampler({
                urls: {
                    "A0": "A0.mp3", "C1": "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
                    "A1": "A1.mp3", "C2": "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
                    "A2": "A2.mp3", "C3": "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
                    "A3": "A3.mp3", "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
                    "A4": "A4.mp3", "C5": "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
                    "A5": "A5.mp3", "C6": "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
                    "A6": "A6.mp3", "C7": "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
                    "A7": "A7.mp3", "C8": "C8.mp3"
                },
                release: 1,
                volume: 12, // Volumen significativamente más alto
                baseUrl: "https://tonejs.github.io/audio/salamander/"
            }).connect(eq);
            
            // Wait for samples to load before enabling
            await Tone.loaded(); 
            pianoRef.current = piano as any; // Cast to fix TS mismatch with old PolySynth ref
            setIsToneReady(true);
        };
        
        // Start on interaction
        const handleStart = async () => {
            await Tone.start();
            if (!pianoRef.current) initTone();
        };
        
        window.addEventListener('mousedown', handleStart);
        window.addEventListener('keydown', handleStart);
        return () => {
            window.removeEventListener('mousedown', handleStart);
            window.removeEventListener('keydown', handleStart);
        };
    }, []);

    // Play Tone
    const playTone = (freq: number, note: string) => {
        if (!isToneReady || !pianoRef.current) return;
        
        setActiveNote(note);
        if (Math.random() > 0.7) nextSuggestion();
        
        // Trigger Tone.js
        pianoRef.current.triggerAttackRelease(note, "8n");
        
        setTimeout(() => setActiveNote(null), 300);
    };

    // 🎤 CALIBRATION
    // ML5 Pitch Detection Loop
    const startPitchLoop = () => {
        if (!pitchEstimatorRef.current) return;

        pitchEstimatorRef.current.getPitch((err: any, frequency: number) => {
            // RESTRICTED RANGE: A1 (55Hz) to A3 (220Hz)
            if (frequency && frequency > 50 && frequency < 230) {
                 // Update Debug
                 setDebugInfo({ rms: 0, clarity: 1 }); // Mock values for UI compatibility

                 // Smooth & Process Logic (Reused from before but simpler)
                 setInstantPitch(frequency);
                 
                 // Visualize
                 const buff = pitchBufferRef.current;
                 buff.push(frequency);
                 if (buff.length > 5) buff.shift();
                 const sorted = [...buff].sort((a,b)=>a-b);
                 const smoothed = sorted[Math.floor(sorted.length/2)];

                 let closestDist = Infinity;
                 let closestIndex = -1;
                 NOTES.forEach((n, idx) => {
                    const dist = Math.abs(n.freq - smoothed);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestIndex = idx;
                    }
                 });

                 if (closestIndex !== -1 && closestDist < 8) { // Tolerance in Hz
                     const noteName = NOTES[closestIndex].note;
                     setDetectedNoteIndex(closestIndex);
                     setInstantNoteName(noteName);
                     lastDetectedIndexRef.current = closestIndex; // For calibration end
                     
                     // Declarative UI handles highlighting now based on 'detectedNoteIndex'
                     
                     // Auto-scroll to detected note (Restored per user request "arreglar calibración")
                     const keyElement = keyRefs.current[closestIndex];
                     if (keyElement) {
                        keyElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                     }
                 }
            } else {
                setInstantPitch(0);
                setInstantNoteName("-");
                // Clear UI
                keyRefs.current.forEach((el, idx) => {
                     if (el) {
                          el.style.backgroundColor = NOTES[idx].color === 'black' ? 'black' : 'white';
                          el.style.transform = 'none';
                     }
                });
            }

            // Loop if still calibrating
            if (isCalibratingRef.current) {
                startPitchLoop();
            }
        });
    };

    const startCalibration = async () => {
         try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micStreamRef.current = stream;
            
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioCtx;
            
            // Init ML5 Pitch Detection
            const modelUrl = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
            
            setCalibrating(true); 
            
            // Check if ml5 is loaded
            if (!(window as any).ml5) {
                alert("AI Model Loading... Please wait a moment and try again.");
                return;
            }

            (window as any).ml5.pitchDetection(modelUrl, audioCtx, stream, (err: any, model: any) => {
                if (err) {
                    console.error("ML5 Error", err);
                    alert("Error loading AI Model");
                    return;
                }
                pitchEstimatorRef.current = model;
                setIsModelLoaded(true);
                
                // Start Loop
                isCalibratingRef.current = true;
                setCalibrating(true);
                
                // Reset State
                setUserFundamental(null);
                setDetectedNoteIndex(null); 
                pitchBufferRef.current = [];
                
                // Center Piano for exercise start (Middle C - C4 is roughly index 36 in C1-start array)
                // C1=0, C2=12, C3=24, C4=36
                const midKey = keyRefs.current[36];
                if (midKey) {
                    midKey.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                }

                startPitchLoop();

                // Auto-stop after 5 seconds (Exact user request)
                setTimeout(stopCalibration, 5000);
            });

        } catch (err) {
            console.error(err);
            alert("No se pudo acceder al micrófono.");
        }
    };


    
    const stopCalibration = () => {
        setCalibrating(false);
        isCalibratingRef.current = false;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
        if (audioContextRef.current) audioContextRef.current.close();
        
        // Finalize Range based on the LAST DETECTED stable note (Ref)
        const finalIndex = lastDetectedIndexRef.current;
        
        if (finalIndex !== null) {
             // Ensure it's saved in State
             setDetectedNoteIndex(finalIndex);
             
             // Calculate Range
            const min = Math.max(0, finalIndex - 3);
            const max = Math.min(NOTES.length - 1, finalIndex + 5);
            setSafeRange([min, max]);

            // Final Center Force - TWICE to handle potential layout shifts
            setTimeout(() => {
                const keyElement = keyRefs.current[finalIndex];
                if (keyElement) {
                    keyElement.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }); // Auto for instant/snap
                }
            }, 50);
            
            setTimeout(() => {
                const keyElement = keyRefs.current[finalIndex];
                if (keyElement) {
                    keyElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                }
            }, 300);
        }
    };
    



    return (
        <div className={isStandalone ? "w-full min-h-[100dvh] flex flex-col items-center justify-center bg-black" : "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md sm:p-4 animate-fade-in"}>
            
            {/* FORCE TAILWIND CLASSES (Hidden) */}
            <div className="hidden ring-4 ring-green-500 z-50 bg-green-500 text-black"></div>
            
            
            <div className={`bg-[#1a242d] border border-slate-700 w-full ${isStandalone ? 'max-w-5xl h-[100dvh] sm:h-[85vh]' : 'max-w-4xl h-full sm:h-auto'} sm:rounded-3xl overflow-y-auto shadow-2xl flex flex-col landscape:h-[100dvh] landscape:rounded-none landscape:border-0 landscape:overflow-hidden`}>
                
                {/* Header - Compact in Landscape */}
                <div className="bg-[#283039] p-3 sm:p-4 flex justify-between items-center border-b border-slate-700 landscape:py-2">
                    <div className="flex items-center gap-3">
                        <div className="size-8 sm:size-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 landscape:hidden">
                             <span className="material-symbols-outlined text-sm sm:text-base">graphic_eq</span>
                        </div>
                        <div>
                             <h2 className="text-white font-bold text-sm sm:text-lg leading-tight">Afinador de Voz</h2>
                             <p className="text-slate-400 text-[10px] sm:text-xs">Encuentra tu tono ideal.</p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    )}
                </div>

                <div className="flex-1 flex flex-col h-auto">
                    
                    {/* Controls & Feedback - Collapsible in Landscape */}
                    <div className="w-full p-4 sm:p-6 border-b border-slate-700 bg-[#161b22] flex flex-col gap-4 sm:gap-6 landscape:flex-row landscape:py-2 landscape:gap-2">
                        
                        {!safeRange ? (
                            <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-4 sm:p-5 text-center flex-1 flex flex-col justify-center landscape:flex-row landscape:items-center landscape:gap-4 landscape:p-2 landscape:text-left">
                                <span className="material-symbols-outlined text-4xl sm:text-5xl text-blue-400 mb-2 sm:mb-4 mx-auto landscape:mx-0 landscape:mb-0">neurology</span>
                                <div className="landscape:flex-1">
                                    <h3 className="text-white font-bold mb-0 text-sm sm:text-xl landscape:text-xs">Tu Tono Base</h3>
                                    <p className="text-slate-400 text-[10px] sm:text-sm mb-2 sm:mb-6 leading-relaxed landscape:hidden">
                                        Escuchando...
                                    </p>
                                </div>
                                
                                {calibrating ? (
                                    <div className="flex flex-col items-center gap-2 sm:gap-4 animate-fade-in landscape:flex-row landscape:gap-3">
                                        <div className="size-12 sm:size-20 rounded-full border-2 sm:border-4 border-blue-500/30 flex items-center justify-center relative">
                                            <div className="absolute inset-0 bg-blue-500/10 animate-ping rounded-full"></div>
                                            <span className="text-sm sm:text-2xl font-bold text-white font-mono">
                                                {instantNoteName}
                                            </span>
                                        </div>
                                        <div className="landscape:text-left">
                                            <p className="text-blue-400 text-[10px] sm:text-sm font-bold animate-pulse uppercase tracking-widest">
                                                Escuchando...
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                        <button 
                                        onClick={startCalibration}
                                        className="w-full landscape:w-auto py-2 sm:py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-base uppercase tracking-widest"
                                    >
                                        <span className="material-symbols-outlined text-sm sm:text-base">biometrics</span>
                                        Sincronizar
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col sm:h-full gap-4 landscape:flex-row landscape:w-full landscape:items-center">
                                <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-4 sm:p-5 text-center animate-fade-in relative overflow-hidden landscape:p-2 landscape:flex landscape:items-center landscape:gap-3">
                                    <span className="material-symbols-outlined text-2xl sm:text-4xl text-green-400 mb-1 sm:mb-2 landscape:mb-0">verified_user</span>
                                    <div className="landscape:text-left">
                                        <h3 className="text-white font-bold text-xs sm:text-sm mb-0">Voz Estable</h3>
                                        <p className="text-green-200 text-[10px] sm:text-xs font-mono">
                                            Base: <span className="font-bold text-white tracking-widest">{NOTES[detectedNoteIndex!].note}</span>
                                        </p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => { 
                                            setSafeRange(null); 
                                            setDetectedNoteIndex(null); 
                                            lastDetectedIndexRef.current = null;
                                        }}
                                        className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] text-slate-500 hover:text-white underline uppercase tracking-wider landscape:ml-2 landscape:mt-0"
                                    >
                                        Reiniciar
                                    </button>
                                </div>
 
                                <div className="flex-1 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-2 sm:p-4 flex flex-col items-center justify-center text-center landscape:p-2 landscape:flex-row landscape:gap-3">
                                    <h4 className="text-[8px] sm:text-xs font-black text-indigo-400 uppercase tracking-widest mb-0.5 landscape:mb-0 landscape:rotate-[-90deg] landscape:text-[7px]">Tip</h4>
                                    <p className="text-white font-medium text-[10px] sm:text-lg leading-tight italic max-w-[200px] landscape:max-w-none">
                                        "{suggestion}"
                                    </p>
                                    <button onClick={nextSuggestion} className="mt-1 sm:mt-4 text-[8px] sm:text-xs bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full text-indigo-200 transition-colors landscape:mt-0">
                                        Cambiar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
 
                                {isStandalone && onClose && (
                                    <button 
                                        onClick={onClose}
                                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
                                    >
                                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">logout</span>
                                        SALIR DE MISIÓN
                                    </button>
                                )}
                    {/* Piano Keys Container */}
                     <div className="flex-1 bg-[#101418] relative overflow-x-auto custom-scrollbar scroll-smooth flex items-start sm:items-center py-4 snap-x snap-mandatory touch-pan-x">
                          <div className="flex relative h-48 sm:h-40 select-none min-w-max px-[20vw] sm:px-0 landscape:h-[calc(100vh-140px)] sm:landscape:h-40">
                              {NOTES.map((n, i) => {
                                  const isSafe = safeRange && i >= safeRange[0] && i <= safeRange[1];
                                  const isActive = activeNote === n.note;
                                  const isDetected = detectedNoteIndex === i;

                                  // Declarative Scale Logic
                                  let isScaleMember = false;
                                  if (detectedNoteIndex !== null) {
                                      const dist = Math.abs(i - detectedNoteIndex);
                                      isScaleMember = [0, 2, 4, 5, 7, 9, 11].includes(dist % 12);
                                  }

                                  if (n.color === "white") {
                                      return (
                                          <div 
                                              key={n.note}
                                              ref={el => { keyRefs.current[i] = el }}
                                               onPointerDown={(e) => {
                                                   playTone(n.freq, n.note);
                                               }}
                                              style={{
                                                  backgroundColor: isDetected ? '#15803d' : isScaleMember ? '#d1fae5' : isActive ? '#bfdbfe' : 'white',
                                                  transform: isDetected ? 'scale(0.95)' : 'none',
                                                  boxShadow: isDetected ? '0 0 15px #15803d' : 'none',
                                                  borderColor: isDetected ? '#166534' : undefined
                                              }}
                                                className={`
                                                   relative w-14 sm:w-16 h-48 sm:h-40 border border-slate-900 rounded-b-lg active:scale-[0.98] transition-all duration-100 flex items-end justify-center pb-4 cursor-pointer snap-center landscape:h-full landscape:w-20
                                                   ${isSafe ? 'shadow-[inset_0_-20px_40px_rgba(34,197,94,0.3)]' : ''}
                                                   ${isDetected ? 'z-50 text-white' : ''}
                                               `}
                                          >
                                             <span className={`font-bold text-xs pointer-events-none ${isDetected ? "text-white" : "text-slate-400"}`}>{n.note}</span>
                                             {isDetected && (
                                                 <div className="absolute top-4 text-white text-[12px] font-black uppercase tracking-widest pointer-events-none whitespace-nowrap animate-fade-in [text-shadow:0px_1px_2px_rgba(0,0,0,0.5)]">
                                                     TONO
                                                 </div>
                                             )}
                                          </div>
                                      );
                                  } else {
                                      return (
                                          <div 
                                              key={n.note}
                                              ref={el => { keyRefs.current[i] = el }}
                                              onPointerDown={(e) => {
                                                playTone(n.freq, n.note);
                                              }}
                                              style={{
                                                  backgroundColor: isDetected ? '#15803d' : isScaleMember ? '#065f46' : isActive ? '#334155' : 'black',
                                                  transform: isDetected ? 'scale(0.95)' : 'none',
                                                  boxShadow: isDetected ? '0 0 15px #15803d' : 'none',
                                                  borderColor: isDetected ? '#166534' : undefined
                                              }}
                                                className={`
                                                   w-10 sm:w-12 h-28 sm:h-28 -mx-5 sm:-mx-6 z-20 rounded-b-lg border border-slate-800 active:scale-[0.98] transition-all duration-100 cursor-pointer flex items-end justify-center pb-2 snap-center landscape:h-[60%] landscape:w-12
                                                   ${isSafe ? 'shadow-[inset_0_-20px_40px_rgba(34,197,94,0.5)]' : ''}
                                                   ${isDetected ? 'z-50' : ''}
                                               `}
                                          >
                                            <span className={`text-[10px] font-bold pointer-events-none ${isDetected ? "text-white" : "text-slate-600"}`}>{n.note}</span>
                                            {isDetected && (
                                                 <div className="absolute top-2 text-white text-[9px] font-black uppercase tracking-widest pointer-events-none whitespace-nowrap animate-fade-in [text-shadow:0px_1px_2px_rgba(0,0,0,0.5)] -rotate-90 origin-center translate-y-8">
                                                     TONO
                                                 </div>
                                             )}
                                         </div>
                                      );
                                  }
                              })}
                          </div>
                     </div>

                </div>
            </div>
            {/* ML5 Library - Force v0.12.2 for CREPE/PitchDetection support */}
            <Script src="https://unpkg.com/ml5@0.12.2/dist/ml5.min.js" strategy="lazyOnload" />
        </div>
    );
}
