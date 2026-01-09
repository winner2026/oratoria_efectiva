
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Chrome } from "lucide-react";
import { signIn } from "next-auth/react";

type Step = "baseline-record" | "bio-hack" | "calibration-record" | "comparison" | "capture";

export default function CalibrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Leemos el step de la URL, o usamos baseline por defecto
  const currentStep = (searchParams.get("step") as Step) || "baseline-record";
  
  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlobBaseline, setAudioBlobBaseline] = useState<Blob | null>(null);
  const [audioBlobCalibration, setAudioBlobCalibration] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Intervention State
  const [interventionTime, setInterventionTime] = useState(30);

  // Auth State
  const [isLoading, setIsLoading] = useState(false);

  // Función helper para cambiar de paso y actualizar URL
  const navigateToStep = (nextStep: Step) => {
      // Usamos replace para no ensuciar tanto el historial, o push si queremos back button.
      // Push es mejor para analytics: cuenta como nueva navegación.
      router.push(`/calibration?step=${nextStep}`);
  };

  // --- AUDIO LOGIC (Reusable) ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (currentStep === "baseline-record") {
           setAudioBlobBaseline(blob);
           navigateToStep("bio-hack");
        } else if (currentStep === "calibration-record") {
           setAudioBlobCalibration(blob);
           navigateToStep("comparison");
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 10) { // Max 10s per clip
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Necesitamos acceso al micrófono para el análisis biométrico.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // --- INTERVENTION LOGIC ---
  useEffect(() => {
    if (currentStep === "bio-hack") {
      const interval = setInterval(() => {
        setInterventionTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0; // Ready to move on
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // --- SAVE LOGIC ---
  const handleSaveWithGoogle = async () => {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/listen" });
  };


  if (currentStep === "baseline-record") {
    return (
      <main className="min-h-screen bg-[#0A0F14] font-display flex flex-col items-center justify-center p-6 text-white text-center">
         <div className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2">Paso 1: Línea Base</h2>
            <p className="text-gray-400 mb-8">Graba 10 segundos de tu presentación habitual. Sé natural.</p>
            
            <div className="flex flex-col items-center gap-6">
                {!isRecording ? (
                    <button onClick={startRecording} className="size-32 rounded-full bg-[#161B22] border-2 border-[#30363d] hover:border-white transition-all flex items-center justify-center group active:scale-95">
                        <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-white">mic</span>
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-5xl font-mono font-bold text-white tracking-widest">
                            00:0{recordingTime}
                        </div>
                        <div className="flex gap-1 h-8 items-end">
                             {[...Array(5)].map((_,i) => <div key={i} className="w-1.5 bg-blue-500 animate-pulse rounded-full" style={{height: `${Math.random()*100}%`}}/>)}
                        </div>
                        <button onClick={stopRecording} className="mt-4 px-6 py-2 bg-gray-800 rounded-lg text-sm font-bold text-gray-300">Detener</button>
                    </div>
                )}
            </div>
            
            <p className="mt-8 text-xs text-gray-600 font-mono uppercase">
               Grabación Privada • Procesamiento Local
            </p>
         </div>
      </main>
    );
  }

  if (currentStep === "bio-hack") {
    return (
      <main className="min-h-screen bg-[#05080a] font-display flex flex-col items-center justify-center p-6 text-white text-center">
         <div className="max-w-lg w-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[80px] animate-pulse"></div>
            
            <div className="relative z-10">
               <span className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-4 block">
                  Intervención Biológica
               </span>
               <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Hemos detectado tensión en tu resonancia.
               </h2>
               
               <div className="bg-[#111] border border-gray-800 p-8 rounded-2xl mb-8">
                  <p className="text-xl text-gray-200 font-medium mb-4">
                     "Baja los hombros, separa los dientes traseros y habla desde el pecho, no desde la garganta."
                  </p>
                  <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-blue-500 h-full transition-all duration-1000 ease-linear" style={{ width: `${(interventionTime / 30) * 100}%` }}></div>
                  </div>
                  <p className="mt-2 text-right text-xs text-gray-500 font-mono">Calibrando: {interventionTime}s</p>
               </div>
               
               {interventionTime === 0 && (
                 <button 
                  onClick={() => navigateToStep("calibration-record")}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-lg animate-fade-in-up"
                 >
                   Continuar a Calibración
                 </button>
               )}
            </div>
         </div>
      </main>
    );
  }

  if (currentStep === "calibration-record") {
    return (
      <main className="min-h-screen bg-[#0A0F14] font-display flex flex-col items-center justify-center p-6 text-white text-center">
         <div className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2 text-blue-400">Paso 2: Calibración</h2>
            <p className="text-gray-300 mb-8">
               Ahora, <strong className="text-white">manteniendo la nueva postura</strong>, repite tu presentación.
            </p>
            
            <div className="flex flex-col items-center gap-6">
                {!isRecording ? (
                    <button onClick={startRecording} className="size-32 rounded-full bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center group active:scale-95">
                        <span className="material-symbols-outlined text-4xl text-white">mic</span>
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-5xl font-mono font-bold text-white tracking-widest">
                            00:0{recordingTime}
                        </div>
                        <button onClick={stopRecording} className="mt-4 px-6 py-2 bg-gray-800 rounded-lg text-sm font-bold text-gray-300">Terminar</button>
                    </div>
                )}
            </div>
         </div>
      </main>
    );
  }

  if (currentStep === "comparison") {
    return (
      <main className="min-h-screen bg-[#0A0F14] font-display flex flex-col items-center justify-center p-6 text-white">
         <div className="max-w-2xl w-full">
            <h2 className="text-3xl font-bold mb-2 text-center">Resultados de la Calibración</h2>
            <p className="text-gray-400 text-center mb-10">Escucha la diferencia en tu proyección.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               {/* BEFORE CARD */}
               <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl opacity-60">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 block">Antes (Línea Base)</span>
                  <div className="h-12 flex items-center justify-center bg-gray-900 rounded-lg">
                     {audioBlobBaseline && (
                       <audio controls src={URL.createObjectURL(audioBlobBaseline)} className="w-full h-8 opacity-50" />
                     )}
                  </div>
                  <p className="mt-4 text-xs text-gray-500">Tensión detectable. Frecuencia aguda.</p>
               </div>

               {/* AFTER CARD */}
               <div className="bg-blue-900/10 border border-blue-500/30 p-6 rounded-2xl relative shadow-xl">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">OPTIMIZADO</div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">Después (Calibrado)</span>
                  <div className="h-12 flex items-center justify-center bg-blue-900/20 rounded-lg">
                     {audioBlobCalibration && (
                       <audio controls src={URL.createObjectURL(audioBlobCalibration)} className="w-full h-8" />
                     )}
                  </div>
                  <p className="mt-4 text-xs text-gray-300">
                     <span className="text-green-400 font-bold">+20% Estabilidad.</span> Mayor resonancia de pecho.
                  </p>
               </div>
            </div>

            <div className="flex flex-col items-center text-center">
               <h3 className="text-xl font-bold mb-4">¿Notas el "Efecto Presencia"?</h3>
               <p className="text-gray-400 max-w-lg mb-8 text-sm">
                  Formaliza tu acceso para guardar este progreso y desbloquear el analizador completo.
               </p>
               <button 
                 onClick={() => navigateToStep("capture")}
                 className="px-10 py-4 bg-white text-black font-black text-lg rounded-xl hover:scale-105 transition-all w-full md:w-auto"
               >
                 Guardar Progreso
               </button>
            </div>
         </div>
      </main>
    );
  }

  if (currentStep === "capture") {
    // PANTALLA DE CIERRE (Solo Google)
    return (
      <main className="min-h-screen bg-[#0A0F14] font-display flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-[#161B22] border border-gray-800 p-8 rounded-2xl shadow-2xl text-center">
           <h2 className="text-2xl font-bold mb-2">Acceso al Dashboard</h2>
           <p className="text-gray-400 text-sm mb-8">
              Tu calibración ha sido un éxito. Continúa con tu cuenta segura para empezar el Hábito Diario.
           </p>

           <button
            onClick={handleSaveWithGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-bold py-4 px-6 rounded-2xl transition-all mb-4 group"
           >
            {isLoading ? (
               <div className="size-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : (
                <Chrome size={20} className="text-blue-600" />
            )}
            <span>Guardar y Continuar con Google</span>
           </button>
           
           <p className="mt-4 text-[10px] text-gray-600">
              Plan Gratuito Permanente activado.
           </p>
        </div>
      </main>
    );
  }

  return null;
}
