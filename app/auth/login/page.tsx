"use client";

import React, { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/listen";

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <main className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-display selection:bg-blue-500/30">
      
      {/* 🕶️ TACTICAL BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      {/* GLOW FX */}
      <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 🛡️ SECURITY HEADER */}
      <div className="absolute top-8 left-0 w-full flex justify-between px-8 opacity-30 pointer-events-none">
          <span className="text-[10px] font-mono tracking-widest text-white">SECURE CONNECTION // TLS 1.3</span>
          <span className="text-[10px] font-mono tracking-widest text-white animate-pulse">SYSTEM ONLINE</span>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        
        {/* LOGO & IDENTITY */}
        <div className="text-center mb-12 space-y-4">
            <div className="flex justify-center mb-6">
                <div className="size-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)]">
                    <span className="material-symbols-outlined text-3xl text-white">graphic_eq</span>
                </div>
            </div>
            
            <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-1">
                SOBERANA
            </h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] bg-blue-900/10 inline-block px-3 py-1 rounded-full border border-blue-500/20">
                Reserva Federal de Autoridad
            </p>
        </div>

        {/* ACCESS TERMINAL */}
        <div className="bg-[#0A0F14]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 size-4 border-l-2 border-t-2 border-blue-500/50 rounded-tl-lg" />
            <div className="absolute top-0 right-0 size-4 border-r-2 border-t-2 border-blue-500/50 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 size-4 border-l-2 border-b-2 border-blue-500/50 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 size-4 border-r-2 border-b-2 border-blue-500/50 rounded-br-lg" />

            <div className="text-center space-y-6">
                <div>
                     <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Identificación Requerida</h2>
                     <p className="text-xs text-slate-500 leading-relaxed">
                         Acceso restringido a operadores de Nivel 1.
                         <br/>Por favor, verifique su credencial biométrica.
                     </p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <button
                    onClick={handleGoogleLogin}
                    className="w-full relative group/btn overflow-hidden rounded-xl bg-white text-black font-black py-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                        <span className="uppercase tracking-widest text-xs">Acceder con Google</span>
                    </div>
                </button>
            </div>
        </div>

        {/* FOOTER */}
        <p className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-widest font-medium">
             Proto-Arquitectura por Soberana Labs &copy; 2026
        </p>

      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
