"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// Definición de contenidos por Plan
const PLAN_CONTENT: Record<string, {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  features: string[];
  cta: string;
  ctaLink: string;
}> = {
  "starter": {
    title: "¡Pase STARTER Activado!",
    subtitle: "Tu hardware vocal está ahora bajo monitoreo de élite.",
    icon: "bolt",
    color: "blue",
    features: [
      "100 Auditorías IA / mes",
      "Protocolo Elite de 21 Días",
      "Arsenal de Tácticas Ilimitado",
      "Historial de evolución biometríca"
    ],
    cta: "Activar mi Centro de Mando",
    ctaLink: "/listen"
  },
  "premium": {
    title: "¡Rango PREMIUM Desbloqueado!",
    subtitle: "Has alcanzado el nivel máximo de inteligencia vocal.",
    icon: "diamond",
    color: "amber",
    features: [
      "Auditorías IA Ilimitadas",
      "Análisis Espectral Elite (Brillo, Resonancia)",
      "Métricas de Status Inconsciente",
      "Protocolo de Mando de 30 Días",
      "Soporte Prioritario"
    ],
    cta: "Entrar al Centro de Control",
    ctaLink: "/listen"
  },
  "voice-weekly": {
    title: "¡Pase de Entrenamiento Listo!",
    subtitle: "Prepárate para dominar cada conversación.",
    icon: "mic",
    color: "blue",
    features: [
      "Análisis de voz activado",
      "Detector de muletillas",
      "Feedback ejecutivo"
    ],
    cta: "Ir al Dashboard",
    ctaLink: "/listen"
  }
};

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.planId as string;
  const content = PLAN_CONTENT[planId] || PLAN_CONTENT["voice-weekly"]; // Fallback
  
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    // Aquí podríamos disparar una llamada al backend para confirmar la activación si no se hizo por webhook
  }, []);

  return (
    <main className="min-h-screen bg-[#0B1120] text-white font-display flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] 
        ${content.color === 'purple' ? 'bg-purple-600/20' : 
          content.color === 'amber' ? 'bg-amber-600/20' : 'bg-blue-600/20'} 
        rounded-full blur-[120px] pointer-events-none`} />
      
      <div className="z-10 max-w-lg w-full text-center">
        
        {/* Animated Icon */}
        <div className={`mx-auto w-24 h-24 rounded-full 
          ${content.color === 'purple' ? 'bg-purple-500/20' : 
            content.color === 'amber' ? 'bg-amber-500/20' : 'bg-blue-500/20'} 
          flex items-center justify-center mb-8 animate-bounce-slow`}>
           <span className={`material-symbols-outlined text-5xl 
             ${content.color === 'purple' ? 'text-purple-400' : 
               content.color === 'amber' ? 'text-amber-400' : 'text-blue-400'}`}>
             {content.icon}
           </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 animate-fade-in-up">
          {content.title}
        </h1>
        <p className="text-xl text-slate-400 mb-10 animate-fade-in-up delay-100">
          {content.subtitle}
        </p>

        {/* Features Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-10 text-left animate-fade-in-up delay-200">
          <p className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-wider">Tu nuevo arsenal incluye:</p>
          <ul className="space-y-3">
            {content.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${content.color === 'purple' ? 'text-purple-400' : 'text-blue-400'} text-sm`}>check_circle</span>
                <span className="text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={() => router.push(content.ctaLink)}
          className={`w-full py-5 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-all animate-pulse-soft
            ${content.color === 'purple' 
              ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/30 text-white' 
              : content.color === 'amber'
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30 text-white'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30 text-white'
            }`}
        >
          {content.cta}
        </button>

        <p className="mt-6 text-sm text-slate-600">
          ¿Dudas? Escríbenos a soporte@oratoriaefectiva.com
        </p>

      </div>
    </main>
  );
}
