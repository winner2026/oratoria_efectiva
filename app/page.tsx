"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Step = "hero" | "role" | "goal" | "capture";

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("hero");
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
    if (key === "goal") setStep("capture");
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
      <main className="min-h-screen bg-[#101922] font-display flex flex-col relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        </div>

        {/* Navbar */}
        <nav className="relative z-10 px-6 py-6 flex justify-between items-center">
          <div className="text-xl font-bold text-white tracking-tight">
            Oratoria<span className="text-blue-500">Efectiva</span>
          </div>
          <button onClick={() => router.push("/auth/login")} className="text-sm text-gray-400 hover:text-white transition-colors">
            Ya tengo cuenta
          </button>
        </nav>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            IA-Powered Coaching
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl">
            Domina el arte de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">hablar en público</span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
            Recibe feedback instantáneo sobre tu tono, ritmo y muletillas con nuestra Inteligencia Artificial. Sin presiones, a tu ritmo.
          </p>

          <button 
            onClick={() => setStep("role")}
            className="group relative px-8 py-4 bg-white text-[#101922] font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Comenzar Evaluación Gratuita
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
          </button>
          
          <p className="mt-4 text-xs text-gray-500">No requiere tarjeta de crédito • 3 análisis gratis</p>
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
