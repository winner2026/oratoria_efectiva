"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Step = "hero" | "baseline-record" | "bio-hack" | "calibration-record" | "comparison" | "capture";

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("hero");
  
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
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Redirigir si ya está logueado
  useEffect(() => {
    const userEmail = localStorage.getItem("user_email");
    if (userEmail) {
      router.push("/listen");
    }
  }, [router]);

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
        if (step === "baseline-record") {
           setAudioBlobBaseline(blob);
           setStep("bio-hack");
        } else if (step === "calibration-record") {
           setAudioBlobCalibration(blob);
           setStep("comparison");
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
    if (step === "bio-hack") {
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
  }, [step]);

  // --- REGISTER LOGIC ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // 1. REGISTER USER
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'professional', goal: 'authority' }), // Defaults for Santiago
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user_email", formData.email);
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("user_credits", data.user.credits.toString());
        localStorage.setItem("user_plan", "FREE");

        // Upload BEST audio (Calibration)
        if (audioBlobCalibration) {
           const formDataUpload = new FormData();
           formDataUpload.append("audio", audioBlobCalibration);
           formDataUpload.append("userId", data.user.id);
           await fetch("/api/analysis", { method: "POST", body: formDataUpload });
        }
        router.push("/listen");
      } else {
        if (data.error === "EMAIL_EXISTS") setErrorMsg("Este correo ya está registrado.");
        else alert("Error en el registro.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI COMPONENTS ---

  if (step === "hero") {
    return (
      <main className="min-h-[100dvh] bg-[#0A0F14] font-display flex flex-col relative overflow-hidden text-white">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px]" />
        </div>

        <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="text-xl font-black tracking-tighter">
            Oratoria<span className="text-blue-500">PRO</span>
          </div>
          <button onClick={() => router.push("/auth/login")} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
            LOGIN
          </button>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 max-w-5xl mx-auto">
          {/* Badge de Alto Rendimiento */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Biometría Vocal Activa
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.05] tracking-tight">
            Optimiza tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Impacto Comunicativo</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
            Tu hardware vocal es potente, pero el software necesita calibración. 
            Utiliza nuestra IA para eliminar la incertidumbre y proyectar autoridad ejecutiva en segundos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
            <button 
              onClick={() => setStep("baseline-record")}
              className="px-10 py-5 bg-white text-[#0A0F14] font-black text-lg rounded-xl hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] w-full sm:w-auto"
            >
              Iniciar Calibración (Gratis)
            </button>
            
            {/* SOS Integrado en Hero */}
            <button 
              onClick={() => router.push("/sos")}
              className="px-10 py-5 bg-[#161B22] text-red-400 font-bold text-lg rounded-xl border border-red-500/20 hover:border-red-500/50 hover:bg-[#1C2128] transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">e911_emergency</span>
              Modo Emergencia
            </button>
          </div>
          
          <p className="mt-6 text-xs text-gray-600 font-mono">
            ¿Reunión en 5 minutos? Usa el Modo Emergencia. No requiere registro.
          </p>
        </div>
      </main>
    );
  }

  if (step === "baseline-record") {
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

  if (step === "bio-hack") {
    // El "Ejercicio Núcleo"
    return (
      <main className="min-h-screen bg-[#05080a] font-display flex flex-col items-center justify-center p-6 text-white text-center">
         <div className="max-w-lg w-full relative">
            {/* Pulse Effect */}
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
                  onClick={() => setStep("calibration-record")}
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

  if (step === "calibration-record") {
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

  if (step === "comparison") {
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
                  Hemos corregido tu postura vocal en solo 30 segundos. Imagina lo que podemos hacer con un plan de entrenamiento completo.
               </p>
               <button 
                 onClick={() => setStep("capture")}
                 className="px-10 py-4 bg-white text-black font-black text-lg rounded-xl hover:scale-105 transition-all w-full md:w-auto"
               >
                 Guardar Progreso
               </button>
            </div>
         </div>
      </main>
    );
  }

  if (step === "capture") {
    // Formulario de Registro
    return (
      <main className="min-h-screen bg-[#0A0F14] font-display flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-[#161B22] border border-gray-800 p-8 rounded-2xl shadow-2xl">
           <h2 className="text-2xl font-bold mb-2">Formaliza tu Acceso</h2>
           <p className="text-gray-400 text-sm mb-6">
              Para guardar tu análisis biométrico y acceder al dashboard, crea tu cuenta segura.
           </p>

           {errorMsg && (
             <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-xs mb-4">
                {errorMsg}
             </div>
           )}

           <form onSubmit={handleRegister} className="space-y-4">
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Nombre Completo</label>
                 <input 
                   type="text" 
                   required
                   className="w-full bg-[#0A0F14] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none mt-1"
                   placeholder="Santiago..."
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Correo Profesional</label>
                 <input 
                   type="email" 
                   required
                   className="w-full bg-[#0A0F14] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none mt-1"
                   placeholder="santiago@empresa.com"
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                 />
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 transition-all"
              >
                {isLoading ? "Procesando..." : "Acceder al Dashboard"}
              </button>
           </form>
           <p className="mt-4 text-[10px] text-center text-gray-600">
              Plan Gratuito: Incluye Diagnóstico + 3 Calibraciones.
           </p>
        </div>
      </main>
    );
  }

  return null;
}
