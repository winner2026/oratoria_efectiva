"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Step = "hero" | "role" | "goal" | "voice-check" | "capture";

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("hero");
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("monthly");

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
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (key === "role") setStep("goal");
    if (key === "goal") setStep("voice-check");
  };

  const handleVoiceComplete = () => {
    setStep("capture");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        // Guardar sesión básica en cliente
        localStorage.setItem("user_email", formData.email);
        localStorage.setItem("user_id", data.user.id); // Guardar ID real
        localStorage.setItem("user_credits", data.user.credits.toString());
        
        // Redirigir al dashboard
        router.push("/listen");
      } else {
        alert("Hubo un problema al registrarte. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error de conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- COMPONENTES DE PASOS ---

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
        progress={33}
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
        progress={66}
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

  if (step === "voice-check") {
    return (
      <QuizLayout 
        title="Escuchemos tu voz" 
        subtitle="Analizaremos tu tono, ritmo y claridad en 10 segundos."
        progress={80}
        onBack={() => setStep("goal")}
      >
        <div className="w-full flex flex-col items-center">
            {/* Aquí integraremos un mini-grabador premium */}
            <div className="w-full bg-slate-900/50 border border-slate-700 rounded-[32px] p-10 flex flex-col items-center text-center gap-6 animate-fade-in relative overflow-hidden">
               {/* Background effect */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-30"></div>
               
               <div className="size-28 bg-blue-600/10 rounded-full flex items-center justify-center border-2 border-blue-500/20 shadow-[0_0_40px_-5px_rgba(59,130,246,0.3)] mb-2 relative group">
                 <div className="absolute inset-0 bg-blue-500/5 rounded-full animate-ping"></div>
                 <span className="material-symbols-outlined text-5xl text-blue-500 relative z-10 transition-transform group-hover:scale-110">mic</span>
               </div>
               
               <div className="space-y-3">
                  <h4 className="text-white font-black text-2xl tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Neural Voice Check</h4>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[240px] mx-auto">
                    Habla de forma natural. Nuestra IA identificará tus muletillas y patrones de seguridad.
                  </p>
               </div>
               
               <button 
                onClick={handleVoiceComplete}
                className="w-full mt-4 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
               >
                 INICIAR ANÁLISIS VOCAL
                 <span className="material-symbols-outlined text-sm">arrow_forward</span>
               </button>
               
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                 Solo Audio • Privacidad Protegida
               </p>
            </div>
        </div>
      </QuizLayout>
    );
  }

  // CAPTURE STEP
  return (
    <main className="min-h-screen bg-[#101922] font-display flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md bg-[#1a242d] border border-[#3b4754] rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in-up">
        <div className="flex justify-center mb-6">
           <div className="size-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
             <span className="material-symbols-outlined text-3xl">check_circle</span>
           </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">¡Tu plan está listo!</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Hemos diseñado un plan de entrenamiento para eliminar tus {formData.goal === 'fear' ? 'nervios' : formData.goal === 'fillers' ? 'muletillas' : 'bloqueos'} y potenciar tu perfil de {formData.role}.
        </p>

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
               <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <>
                 Desbloquear 3 Análisis Gratis
                 <span className="material-symbols-outlined text-lg">lock_open</span>
               </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-center text-gray-600 mt-4">
          Al registrarte aceptas nuestros términos y condiciones. Te enviaremos tips semanales.
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
