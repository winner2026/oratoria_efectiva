
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  // Redirigir si ya está logueado
  useEffect(() => {
    // Si viene de una sesión activa (check rápido, auth real lo hace el middleware o la siguiente página)
    fetch("/api/auth/session").then(res => res.json()).then(data => {
        if (data?.user) router.push("/listen");
    });
  }, [router]);

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
              onClick={() => router.push("/calibration")}
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
