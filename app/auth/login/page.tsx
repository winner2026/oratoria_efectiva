"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Chrome, ArrowRight, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/listen";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError("Credenciales inválidas. Por favor intenta de nuevo.");
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

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
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-bold py-4 px-6 rounded-2xl transition-all mb-8 group"
        >
          <Chrome size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
          Continuar con Google
        </button>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative px-4 text-xs font-bold uppercase tracking-widest text-gray-500 bg-[#12181f] rounded-full">
            o usa tu correo
          </span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-white/5 border border-white/10 text-white py-4 pl-12 pr-6 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contraseña</label>
              <Link href="/auth/forgot-password" title="¿Olvidaste tu contraseña?" className="text-[10px] text-blue-500 font-bold hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white py-4 pl-12 pr-6 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Entrar ahora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-500 font-bold hover:underline">
            Comienza gratis
          </Link>
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
