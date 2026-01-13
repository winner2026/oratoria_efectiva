"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- DATA: TRABALENGUAS (5 Niveles x 5 Ejercicios) ---
const LEVELS = [
  {
    id: 1,
    title: "Calentamiento Rítmico",
    difficulty: "Fácil",
    exercises: [
        { id: "A", title: "La Rr", text: "R con R cigarro, R con R barril. Rápido corren los carros, cargados de azúcar del ferrocarril." },
        { id: "B", title: "El Perro", text: "El perro de San Roque no tiene rabo, porque Ramón Ramírez se lo ha cortado." },
        { id: "C", title: "Pepe Pecas", text: "Pepe Pecas pica papas con un pico. Con un pico pica papas Pepe Pecas." },
        { id: "D", title: "Pancha Plancha", text: "Pancha plancha con cuatro planchas. ¿Con cuántas planchas plancha Pancha?" },
        { id: "E", title: "El Hipopótamo", text: "El hipopótamo Hipo está con hipo. ¿Quién le quita el hipo al hipopótamo Hipo?" }
    ]
  },
  {
    id: 2,
    title: "Velocidad Media",
    difficulty: "Medio",
    exercises: [
        { id: "A", title: "El Clavito", text: "Pablito clavó un clavito en la calva de un calvito. En la calva de un calvito, un clavito clavó Pablito." },
        { id: "B", title: "Tres Tristes Tigres", text: "Tres tristes tigres tragaban trigo en un trigal. En tres tristes trastos, tragaban trigo tres tristes tigres." },
        { id: "C", title: "Me Han Dicho", text: "Me han dicho que has dicho un dicho que han dicho que he dicho yo." },
        { id: "D", title: "Perejil", text: "Perejil comí, perejil cené. ¿Cómo me desenperejilaré?" },
        { id: "E", title: "El Cuento", text: "Cuando cuentes cuentos, cuenta cuántos cuentos cuentas; porque si no cuentas cuántos cuentos cuentas, nunca sabrás cuántos cuentos cuentas tú." }
    ]
  },
  {
    id: 3,
    title: "Articulación Compleja",
    difficulty: "Difícil",
    exercises: [
        { id: "A", title: "El Arzobispo", text: "El arzobispo de Constantinopla se quiere desarzobispoconstantinopolizar." },
        { id: "B", title: "Guerra de Parra", text: "Guerra tenía una parra y Parra tenía una perra. La perra de Parra subió a la parra de Guerra." },
        { id: "C", title: "El Volcán", text: "El volcán de Parangaricutirimícuaro se quiere desparangaricutirimicuarizar." },
        { id: "D", title: "Cojines", text: "El rey de Constantinopla está constantinoplizado. Consta que constancia no tiene, pero constantinoplizado está." },
        { id: "E", title: "Lenguas", text: "Si la lengua se te lengua, trabada la lengua tendrás. Deslengua la lengua para que no se te trabe más." }
    ]
  },
  {
    id: 4,
    title: "Caos Fonético",
    difficulty: "Experto",
    exercises: [
        { id: "A", title: "Enladrillado", text: "El cielo está enladrillado, ¿quién lo desenladrillará? El desenladrillador que lo desenladrille, buen desenladrillador será." },
        { id: "B", title: "Camarón", text: "Camarón, caramelo, camarón, caramelo, camarón, caramelo... Camarón, caramelo, camarón." },
        { id: "C", title: "El Otorrino", text: "El otorrinolaringólogo de Parangaricutirimícuaro se quiere desotorrinolaringologoparangaricutirimicuarizar." },
        { id: "D", title: "Gallina Pellizcada", text: "Tengo una gallina pinta, perlinta, pelizanca, repitiganca. Si la gallina no fuera pinta, perlinta, pelizanca, repitiganca..." },
        { id: "E", title: "Doña Diriga", text: "Doña Díriga, Dáriga, Dóriga, trompa pitáriga, tiene unos guantes de pellejo de zírriga, zárriga, zórriga." }
    ]
  },
  {
    id: 5,
    title: "Velocidad Luz",
    difficulty: "Leyenda",
    exercises: [
        { id: "A", title: "Compadre Coco", text: "Compadre, cómprame un coco. Compadre, no compro coco. Porque como poco coco como, poco coco compro." },
        { id: "B", title: "Los Cojines", text: "Cojines de la reina, cajones del sultán. ¡Qué cojines!, ¡qué cajones!, ¿en qué cajonera van?" },
        { id: "C", title: "El Tubo", text: "Juan tuvo un tubo, y el tubo que tuvo se le rompió. Y para recuperar el tubo que tuvo, tuvo que comprar un tubo igual al tubo que tuvo." },
        { id: "D", title: "Salas Slas", text: "Salas sala su salsa con sal de sales. Si salas la salsa de Salas, Salas saldrá salado." },
        { id: "E", title: "Desatascador", text: "El desatascador que desatascó el buen desatascador, buen desatascador será, porque desatascó el atasco que nadie pudo desatascar." }
    ]
  }
];

export default function ArticulationPage() {
  const router = useRouter();

  // Estados Globales
  const [levelIndex, setLevelIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0); 
  
  const currentLevel = LEVELS[levelIndex];
  const currentExercise = currentLevel.exercises[exerciseIndex];
  
  // WPM Formula: 107 + (GlobalIndex * 2)
  const globalIndex = (levelIndex * 5) + exerciseIndex;
  const targetWpm = 107 + (globalIndex * 2);

  const [phase, setPhase] = useState<"intro" | "countdown" | "reading" | "result">("intro");
  
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Presiona Micrófono");
  
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "es-ES";
        
        recognition.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
             finalTranscript += event.results[i][0].transcript;
          }
          const current = Array.from(event.results).map((r: any) => r[0].transcript).join(" ");
          setTranscript(current);
          checkCompletion(current);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech Error:", event.error);
          setStatusMessage("Error: " + event.error);
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      } else {
        setStatusMessage("Tu navegador no soporta Reconocimiento de Voz.");
      }
    }
  }, [levelIndex, exerciseIndex]);

  const normalize = (str: string) => {
      return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,¿?¡!]/g, "")
        .trim();
  };

  const getLevenshteinDistance = (a: string, b: string) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
  };

  const checkCompletion = (currentText: string) => {
      const targetWords = normalize(currentExercise.text).split(/\s+/);
      const inputWords = normalize(currentText).split(/\s+/);

      const newMatched = new Set<number>();
      let inputCursor = 0;
      let hits = 0;

      for (let i = 0; i < targetWords.length; i++) {
        const targetWord = targetWords[i];
        
        // Search window: Look ahead in input (limit to 20 words for performance/context)
        const searchWindow = inputWords.slice(inputCursor, inputCursor + 20);
        
        let foundIndex = -1;
        
        // Fuzzy Search in Window
        for (let j = 0; j < searchWindow.length; j++) {
            const inputWord = searchWindow[j];
            const dist = getLevenshteinDistance(targetWord, inputWord);
            
            // Tolerance: More permissible for short repeated words like "Pepe"
            let threshold = 0;
            if (targetWord.length >= 3) threshold = 1;
            if (targetWord.length >= 4) threshold = 2; // "Pepe" (4) now gets 2 edits
            if (targetWord.length >= 8) threshold = 3;

            if (dist <= threshold) {
                foundIndex = j;
                break; // Take first close match
            }
        }

        if (foundIndex !== -1) {
             const realIndex = inputCursor + foundIndex;
             newMatched.add(i);
             inputCursor = realIndex + 1; // Advance cursor past this match
             hits++;
        }
      }
      
      setMatchedIndices(newMatched);

      const acc = Math.round((hits / targetWords.length) * 100);
      setAccuracy(acc);

      if (acc === 100) {
          finishLevel(true, acc);
      }
  };

  const startLevel = () => {
      setPhase("countdown");
      let count = 5;
      setStatusMessage("5");
      setMatchedIndices(new Set());
      
      const interval = setInterval(() => {
          count--;
          if (count > 0) setStatusMessage(count.toString());
          else {
              clearInterval(interval);
              beginRecording();
          }
      }, 1000);
  };

  const beginRecording = () => {
      setPhase("reading");
      setTranscript("");
      setElapsedTime(0);
      setWpm(0);
      setAccuracy(0);
      setStatusMessage("¡LEE AHORA!");
      
      startTimeRef.current = Date.now();
      setIsListening(true);
      
      if (recognitionRef.current) {
          try { recognitionRef.current.start(); } catch(e) {}
      }

      timerRef.current = setInterval(() => {
          setElapsedTime(prev => prev + 0.1);
      }, 100);
  };

  const finishLevel = (success: boolean, finalAcc: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);

      const endTime = Date.now();
      const start = startTimeRef.current || endTime;
      const totalTime = Math.max(0.1, (endTime - start) / 1000);
      
      const wordCount = currentExercise.text.split(" ").length;
      const finalWpm = Math.round((wordCount / totalTime) * 60);
      
      setWpm(finalWpm);
      setAccuracy(finalAcc);

      // Determine final success based on BOTH Accuracy and Speed
      const passedSpeed = finalWpm >= targetWpm;
      const passedAccuracy = finalAcc > 85;
      
      // If manually stopped (success=false), use calculated metrics
      // If auto-stopped (success=true from accuracy check), verify speed
      const finalSuccess = passedAccuracy && passedSpeed;

      setPhase("result");
  };

  const nextExercise = () => {
      setMatchedIndices(new Set());
      if (exerciseIndex < currentLevel.exercises.length - 1) {
          setExerciseIndex(prev => prev + 1);
          setPhase("intro");
      } 
      else if (levelIndex < LEVELS.length - 1) {
          setLevelIndex(prev => prev + 1);
          setExerciseIndex(0);
          setPhase("intro");
      }
  };

  const retryLevel = () => {
      setMatchedIndices(new Set());
      setPhase("intro");
  };

  const isLastGame = levelIndex === LEVELS.length - 1 && exerciseIndex === currentLevel.exercises.length - 1;
  const getSubLevelLetter = (idx: number) => String.fromCharCode(65 + idx);

  const renderTextWithHighlights = () => {
      const words = currentExercise.text.split(" ");
      return (
          <p className="text-3xl md:text-4xl font-medium leading-snug font-serif text-white">
              {words.map((word, i) => {
                  const isMatch = matchedIndices.has(i);
                  return (
                      <span key={i} className={`transition-colors duration-200 ${isMatch ? 'text-green-400' : 'text-slate-500'}`}>
                          {word}{" "}
                      </span>
                  );
              })}
          </p>
      );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-display relative overflow-x-hidden pb-12">
        
        <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute top-0 right-0 w-full h-full bg-blue-900/10 transition-opacity duration-700 ${isListening ? 'opacity-50' : 'opacity-20'}`} />
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-purple-900/10 blur-[100px]" />
        </div>

        <div className="relative z-20 flex justify-between items-center px-6 py-6 max-w-lg mx-auto">
             <Link href="/gym" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Salir</span>
             </Link>
             
             <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      Nivel {currentLevel.id}
                  </span>
                  <div className="flex gap-1 mt-1">
                      {currentLevel.exercises.map((ex, i) => (
                          <div 
                             key={i} 
                             className={`size-5 rounded-md flex items-center justify-center text-[10px] font-black transition-all ${
                                 i === exerciseIndex ? 'bg-blue-500 text-white scale-110' : 
                                 i < exerciseIndex ? 'bg-green-500/20 text-green-400' : 
                                 'bg-slate-800 text-slate-600'
                             }`}
                          >
                              {ex.id}
                          </div>
                      ))}
                  </div>
             </div>
        </div>

        <div className="relative z-10 w-full mobile-container pt-4">
            
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        {currentExercise.title}
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        MODULO {currentExercise.id} — {currentLevel.difficulty}
                    </p>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl min-h-[350px] flex flex-col justify-center relative overflow-hidden">
                
                {isListening && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <div className="size-64 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
                    </div>
                )}

                {phase === 'intro' && (
                    <div className="text-center space-y-8 animate-fade-in">
                        <div className="space-y-4">
                            <p className="text-sm text-slate-400 uppercase tracking-widest">Lee la frase:</p>
                            <h2 className="text-2xl md:text-3xl font-medium leading-relaxed font-serif italic text-white/90">
                                "{currentExercise.text}"
                            </h2>
                            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest bg-blue-500/10 inline-block px-3 py-1 rounded-full">
                                Objetivo: {targetWpm} WPM
                            </p>
                        </div>
                        
                        <div className="pt-4">
                            <button 
                                onClick={startLevel}
                                className="px-12 py-4 bg-white text-black font-black text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                            >
                                START 🎙️
                            </button>
                        </div>
                    </div>
                )}

                {phase === 'countdown' && (
                    <div className="text-center animate-bounce-in">
                         <span className="text-8xl md:text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                             {statusMessage}
                         </span>
                    </div>
                )}

                {phase === 'reading' && (
                    <div className="space-y-8 text-center relative z-10">
                        <div className="animate-fade-in-up">
                            {renderTextWithHighlights()}
                        </div>

                        <div className="flex justify-center gap-8 text-sm font-mono text-slate-400">
                            <div>
                                <span className="block text-2xl font-bold text-white">{elapsedTime.toFixed(1)}s</span>
                                <span>TIEMPO</span>
                            </div>
                            <div>
                                <span className={`block text-2xl font-bold ${accuracy > 80 ? 'text-green-400' : 'text-slate-200'}`}>
                                    {accuracy}%
                                </span>
                                <span>PRECISIÓN</span>
                            </div>
                        </div>

                        <button onClick={() => finishLevel(false, accuracy)} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
                            Terminar Manualmente
                        </button>
                        
                        <div className="h-12 flex items-center justify-center">
                            <p className="text-xs text-slate-600 italic max-w-md truncate px-4">
                                "{transcript}"
                            </p>
                        </div>
                    </div>
                )}

                {phase === 'result' && (
                    <div className="text-center space-y-8 animate-fade-in-up">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Tu Velocidad</span>
                            <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                                {wpm} <span className="text-2xl text-slate-500 font-normal">WPM</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                                <span className="block text-xl font-bold text-green-400">{accuracy}%</span>
                                <span className="text-[10px] text-slate-400 uppercase">Precisión</span>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                                <span className="block text-xl font-bold text-blue-400">{targetWpm}</span>
                                <span className="text-[10px] text-slate-400 uppercase">Meta WPM</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            {accuracy > 85 && wpm >= targetWpm ? (
                                <>
                                    <div className="text-green-400 font-bold text-lg animate-pulse">
                                        ¡MÓDULO {currentExercise.id} COMPLETADO! 🎉
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        {exerciseIndex < 4 ? `Siguiente: Desafío ${getSubLevelLetter(exerciseIndex + 1)}` : `¡NIVEL ${currentLevel.id} COMPLETADO!`}
                                    </p>
                                    <button 
                                        onClick={nextExercise}
                                        disabled={isLastGame}
                                        className="w-full py-4 bg-white text-black font-black rounded-2xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLastGame ? "Juego Terminado" : "SIGUIENTE RETO"}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="text-red-400 font-bold text-lg">
                                        {accuracy <= 85 ? "Mejora tu Dicción (Precisión Baja)" : "¡Muy Lento! Acelera el ritmo"}
                                    </div>
                                    <button 
                                        onClick={retryLevel}
                                        className="w-full py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-colors"
                                    >
                                        REINTENTAR
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </div>
            
            <div className="flex justify-center gap-2 mt-8">
                {LEVELS.map((lvl, idx) => (
                    <div 
                        key={lvl.id}
                        className={`h-2 rounded-full transition-all duration-500 cursor-help ${
                            idx === levelIndex ? 'w-12 bg-blue-500' : 
                            idx < levelIndex ? 'w-2 bg-green-500' : 'w-2 bg-slate-800'
                        }`}
                        title={lvl.title}
                    />
                ))}
            </div>

        </div>
    </div>
  );
}
