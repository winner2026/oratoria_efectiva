"use client";

import React, { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Chrome, Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/listen";

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <main className="min-h-[100dvh] bg-[#0A0F14] flex flex-col items-center justify-center p-6 relative overflow-hidden font-display">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo / Title */}
      <div className="mb-10 text-center relative z-10 animate-fade-in">
        <Link href="/" className="text-2xl font-black text-white tracking-tighter mb-2 inline-block">
          ORATORIA<span className="text-blue-500">EFECTIVA</span>
        </Link>
        <p className="text-gray-400 text-sm font-medium">Inicia sesión para continuar tu entrenamiento</p>
      </div>

      {/* Login Card */}
      <div className="mobile-container !px-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 animate-slide-up">
        
        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-bold py-4 px-6 rounded-2xl transition-all mb-4 group"
        >
          <Chrome size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
          Continuar con Google
        </button>

        <p className="mt-6 text-center text-gray-500 text-xs">
           Al continuar, aceptas nuestros <Link href="/terms" className="underline hover:text-white">términos</Link>.
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-600 text-xs font-medium tracking-tight relative z-10">
        &copy; 2026 Oratoria Efectiva. Todos los derechos reservados.
      </footer>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
