"use client";

import React, { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/listen";
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google sign-in failed", error);
      setError("No se pudo iniciar sesión. Inténtalo de nuevo.");
      setIsSigningIn(false);
    }
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

      <div className="relative z-10 w-full max-w-sm">
        
        {/* LOGO & IDENTITY */}
        <div className="text-center mb-12 space-y-4">
            <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-1">
                VÍCTOR MARTÍNEZ PRO
            </h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] bg-blue-900/10 inline-block px-3 py-1 rounded-full border border-blue-500/20">
                Sistema de Control Vocal
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
                     <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Bienvenido</h2>
                     <p className="text-xs text-slate-500 leading-relaxed">
                         Continúa con Google para crear o usar tu cuenta y guardar el progreso. El diagnóstico es gratuito y no requiere tarjeta.
                     </p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <button
                    onClick={handleGoogleLogin}
                    disabled={isSigningIn}
                    className="w-full relative group/btn overflow-hidden rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black py-4 transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] disabled:cursor-wait disabled:opacity-60"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1s_infinite]"></div>
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-lg" aria-hidden="true">login</span>
                        <span className="uppercase tracking-widest text-xs">{isSigningIn ? "Conectando..." : "Continuar con Google"}</span>
                    </div>
                </button>
                {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
            </div>
        </div>

        {/* FOOTER */}
        <p className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-widest font-medium">
             &copy; {new Date().getFullYear()} Víctor Martínez Pro
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
