"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Step = "hero" | "role" | "goal" | "voice-check" | "analyzing" | "capture";

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("hero");
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("monthly");
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Analysis Simulation State
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisMessage, setAnalysisMessage] = useState("");

  // Redirigir si ya está logueado
  useEffect(() => {
    const userEmail = localStorage.getItem("user_email");
    if (userEmail) {
      router.push("/listen");
    }
  }, [router]);

  const [formData, setFormData] = useState({
    role: "",
    goal: "",
    name: "",
    email: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (key === "role") setStep("goal");
    if (key === "goal") setStep("voice-check");
  };

  // --- RECORDING LOGIC ---
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
        setAudioBlob(blob);
        startAnalysisSimulation();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 10) { // Max 10s for landing demo
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Necesitamos acceso al micrófono para el diagnóstico.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const startAnalysisSimulation = () => {
    setStep("analyzing");
    const messages = [
      "Extrayendo tono de voz...",
      "Identificando patrones de ritmo...",
      "Detectando muletillas...",
      "Calculando Índice de Autoridad..."
    ];
    let msgIndex = 0;

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const next = prev + 5; // Finish in ~4 seconds
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep("capture"), 500);
          return 100;
        }
        
        // Change message every 25%
        if (next % 25 === 0 && msgIndex < messages.length) {
           setAnalysisMessage(messages[msgIndex]);
           msgIndex++;
        }
        return next;
      });
    }, 100);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // 1. REGISTER USER
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // 2. SAVE SESSION LOCALLY
        localStorage.setItem("user_email", formData.email);
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("user_credits", data.user.credits.toString());

        // 3. UPLOAD AUDIO (If exists)
        if (audioBlob) {
           const formDataUpload = new FormData();
           formDataUpload.append("audio", audioBlob);
           formDataUpload.append("userId", data.user.id); // Associate with new user

           // Fire and forget upload (or await if critical)
           // We await to ensure they see the result immediately
           await fetch("/api/analysis", {
              method: "POST",
              body: formDataUpload
           });
        }
        
        // 4. REDIRECT
        router.push("/listen");
      } else {
        if (data.error === "EMAIL_EXISTS") {
            setErrorMsg("Este correo ya está registrado. ¿Querías iniciar sesión?");
        } else {
            alert("Hubo un problema al registrarte. Intenta de nuevo.");
        }
      }
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error de conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER STEPS ---

  if (step === "hero") {
    return (
      <main className="min-h-[100dvh] bg-[#101922] font-display flex flex-col relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        </div>

        {/* Navbar */}
        <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="text-xl font-bold text-white tracking-tight">
            Oratoria<span className="text-blue-500">Efectiva</span>
          </div>
          <button onClick={() => router.push("/auth/login")} className="text-base text-gray-300 hover:text-white transition-colors font-bold tracking-wide">
            Iniciar Sesión
          </button>
        </nav>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in shadow-lg shadow-blue-500/5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            IA-Powered Coaching
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] max-w-4xl tracking-tight">
            Domina el arte de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">hablar en público</span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
            Recibe feedback instantáneo sobre tu tono, ritmo y muletillas con nuestra Inteligencia Artificial. Sin presiones, a tu ritmo.
          </p>

          <button 
            onClick={() => setStep("role")}
            className="group relative px-10 py-5 bg-white text-[#101922] font-black text-xl rounded-full hover:scale-110 transition-all duration-300 shadow-[0_0_50px_-10px_rgba(255,255,255,0.6)] hover:shadow-[0_0_80px_-10px_rgba(255,255,255,0.8)] z-20"
          >
            Iniciar Diagnóstico Inteligente
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1 text-blue-600">→</span>
          </button>

        {/* FLOATING TACTICAL SOS BAR */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => router.push("/sos")}
            className="group relative flex items-center gap-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-red-500/30 pl-3 pr-6 py-3 rounded-2xl shadow-[0_10px_40px_-10px_rgba(220,38,38,0.5)] transition-all hover:scale-105 active:scale-95 hover:border-red-500/60 overflow-hidden"
          >
            {/* Ambient Scan Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
            
            {/* Icon Container */}
            <div className="relative size-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg border border-white/10 group-hover:animate-pulse">
               <span className="material-symbols-outlined text-white text-xl">e911_emergency</span>
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-start gap-0.5">
               <span className="text-[10px] text-red-400 font-bold uppercase tracking-[0.2em] leading-none">Modo Emergencia</span>
               <span className="text-sm font-black text-white tracking-wide leading-none">PREPARACIÓN FLASH</span>
            </div>
          </button>
        </div>
        </div>
      </main>
    );
  }

  if (step === "role") {
    return (
      <QuizLayout 
        title="¿Cuál es tu perfil actual?" 
        subtitle="Esto nos ayuda a personalizar tu feedback."
        progress={20}
      >
        <div className="grid gap-4 w-full max-w-md">
          <OptionButton icon="school" label="Estudiante" active={formData.role === "student"} onClick={() => handleNext("role", "student")} />
          <OptionButton icon="work" label="Profesional" active={formData.role === "professional"} onClick={() => handleNext("role", "professional")} />
          <OptionButton icon="diamond" label="Ejecutivo / Líder" active={formData.role === "executive"} onClick={() => handleNext("role", "executive")} />
          <OptionButton icon="interests" label="Emprendedor" active={formData.role === "entrepreneur"} onClick={() => handleNext("role", "entrepreneur")} />
        </div>
      </QuizLayout>
    );
  }

  if (step === "goal") {
    return (
      <QuizLayout 
        title="¿Qué te impide brillar?" 
        subtitle="Selecciona tu principal obstáculo."
        progress={40}
        onBack={() => setStep("role")}
      >
        <div className="grid gap-4 w-full max-w-md">
          <OptionButton icon="sentiment_worried" label="Miedo escénico / Nervios" active={formData.goal === "fear"} onClick={() => handleNext("goal", "fear")} />
          <OptionButton icon="record_voice_over" label="Muletillas (eh, estem...)" active={formData.goal === "fillers"} onClick={() => handleNext("goal", "fillers")} />
          <OptionButton icon="speed" label="Hablo muy rápido" active={formData.goal === "speed"} onClick={() => handleNext("goal", "speed")} />
          <OptionButton icon="psychology" label="No sé estructurar mis ideas" active={formData.goal === "structure"} onClick={() => handleNext("goal", "structure")} />
        </div>
      </QuizLayout>
    );
  }

  // --- NEW REAL RECORDING STEP ---
  if (step === "voice-check") {
    return (
      <QuizLayout 
        title="Diagnóstico de Voz" 
        subtitle="Graba 10 segundos presentándote. Nuestra IA analizará tu autoridad."
        progress={60}
        onBack={() => setStep("goal")}
      >
        <div className="w-full flex flex-col items-center">
            
            {!isRecording ? (
               <button 
                onClick={startRecording}
                className="size-32 rounded-full bg-red-500 hover:bg-red-600 transition-all shadow-[0_0_50px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center group"
               >
                 <span className="material-symbols-outlined text-5xl text-white group-hover:scale-110 transition-transform">mic</span>
               </button>
            ) : (
                <div className="flex flex-col items-center gap-6">
                   {/* Recording Animation */}
                   <div className="flex items-center gap-1 h-12">
                      {[1,2,3,4,5,6,7].map(i => (
                        <div key={i} className="w-2 bg-red-500 rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                   </div>
                   
                   <div className="text-4xl font-black text-white font-mono">
                     00:0{recordingTime}
                   </div>
                   
                   <button 
                    onClick={stopRecording}
                    className="px-8 py-3 bg-slate-800 rounded-xl text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-colors"
                   >
                     DETENER
                   </button>
                </div>
            )}

            <p className="mt-8 text-sm text-slate-500">
               {!isRecording ? "Toca el micrófono para empezar" : "Habla natural, como si fuera una reunión..."}
            </p>

        </div>
      </QuizLayout>
    );
  }

  // --- NEW FAKE ANALYSIS STEP ---
  if (step === "analyzing") {
    return (
      <main className="min-h-screen bg-[#101922] font-display flex flex-col items-center justify-center p-6 text-white text-center">
         <div className="relative size-32 mb-8">
            <svg className="size-full rotate-[-90deg]">
               <circle cx="64" cy="64" r="60" fill="none" stroke="#1e293b" strokeWidth="8" />
               <circle cx="64" cy="64" r="60" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="377" strokeDashoffset={377 - (377 * analysisProgress / 100)} className="transition-all duration-300 ease-linear" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
               {analysisProgress}%
            </div>
         </div>
         
         <h2 className="text-2xl font-bold animate-pulse mb-2">Analizando tu voz...</h2>
         <p className="text-blue-400 text-sm">{analysisMessage || "Iniciando motor de IA..."}</p>
      </main>
    );
  }

  // CAPTURE STEP (Modified)
  return (
    <main className="min-h-screen bg-[#101922] font-display flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md bg-[#1a242d] border border-[#3b4754] rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in-up">
        <div className="flex justify-center mb-6">
           <div className="size-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 animate-bounce">
             <span className="material-symbols-outlined text-3xl">lock</span>
           </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">¡Tu diagnóstico está listo!</h2>
        <p className="text-gray-400 text-center mb-8 text-sm px-4">
          Hemos detectado <strong className="text-white">patrones clave</strong> en tu tono. Ingresa tu correo para ver el reporte completo y escuchar tu versión mejorada.
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 animate-shake">
            <span className="material-symbols-outlined text-red-500 shrink-0">error</span>
            <div className="text-left">
              <p className="text-sm font-bold text-red-400 leading-tight mb-1">Cuenta Existente</p>
              <p className="text-xs text-red-300/80 leading-relaxed">
                {errorMsg} 
                <button onClick={() => router.push("/auth/login")} className="underline hover:text-white ml-1">
                  Click aquí para entrar.
                </button>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Tu Nombre</label>
            <input 
              required
              type="text" 
              placeholder="Ej. Juan Pérez"
              className="w-full bg-[#101922] border border-[#3b4754] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Correo Electrónico</label>
            <input 
              required
              type="email" 
              placeholder="hola@ejemplo.com"
              className="w-full bg-[#101922] border border-[#3b4754] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
               <div className="flex items-center gap-2">
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando Audio...</span>
               </div>
            ) : (
               <>
                 Ver Mis Resultados
                 <span className="material-symbols-outlined text-lg">arrow_forward</span>
               </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-center text-gray-600 mt-4">
          Al registrarte aceptas nuestros términos. Tus 3 créditos gratis incluyen este análisis.
        </p>
      </div>
    </main>
  );
}

// --- HELPER COMPONENTS ---

function QuizLayout({ title, subtitle, progress, children, onBack }: { title: string, subtitle: string, progress: number, children: React.ReactNode, onBack?: () => void }) {
  return (
    <main className="min-h-screen bg-[#101922] font-display flex flex-col items-center p-6 text-white">
      {/* Progress Bar */}
      <div className="w-full max-w-md h-1 bg-[#283039] rounded-full mb-8 relative">
        <div className="absolute h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        {onBack && (
          <button onClick={onBack} className="text-gray-500 hover:text-white mb-6 flex items-center gap-1 text-sm transition-colors self-start">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Atrás
          </button>
        )}

        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-gray-400 mb-8">{subtitle}</p>

        {children}
      </div>
    </main>
  );
}

function OptionButton({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left group
        ${active 
          ? 'bg-primary/10 border-primary text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]' 
          : 'bg-[#1a242d] border-[#3b4754] text-gray-300 hover:border-gray-500 hover:bg-[#202b36]'
        }`}
    >
      <div className={`size-10 rounded-full flex items-center justify-center transition-colors
        ${active ? 'bg-primary text-white' : 'bg-[#283039] text-gray-500 group-hover:text-gray-300'}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="font-medium text-lg">{label}</span>
      {active && <span className="material-symbols-outlined ml-auto text-primary">check_circle</span>}
    </button>
  );
}
