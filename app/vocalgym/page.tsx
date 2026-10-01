
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function VocalGymHome() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#05070A] text-white font-display overflow-x-hidden selection:bg-blue-500/30">
      
      {/* GLOBAL FLOATING HEADER */}
      <header className="absolute top-0 left-0 w-full p-6 md:px-40 md:py-12 z-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <span className="font-black tracking-tighter text-xs sm:text-sm md:text-xl uppercase block">
                Oratoria <span className="text-blue-500">Efectiva</span>
             </span>
          </div>
          
          <Link href="/vocalgym/listen" className="text-sm md:text-lg font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest animate-pulse">
             Ver App
          </Link>
      </header>
      
      {/* SECCIÓN 1: HERO IMPACTO */}
      <section className="relative min-h-[90dvh] flex flex-col items-center justify-center pt-20 px-6 pb-12 md:pb-0">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
          {/* Micrófono 3D Animado */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 rounded-full p-[2px] animate-spin-slow" 
                 style={{ background: 'conic-gradient(from 0deg, #fbbf24, #f97316, #ef4444, #f97316, #fbbf24)' }}>
              <div className="w-full h-full rounded-full bg-black"></div>
            </div>
            <div className="relative w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full bg-black overflow-hidden flex items-center justify-center p-3">
              <img 
                src="/microphone-3d.png?v=2" 
                alt="Micrófono Profesional" 
                className="w-full h-full object-contain mix-blend-lighten scale-110 rounded-full z-10"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium uppercase tracking-[0.3em] text-blue-400 mb-4">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
             </span>
             ENTRENADOR VOCAL v3.0
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white uppercase">
            Habla claro. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-400 to-slate-400">Habla con seguridad.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed text-center">
            Mejora tu voz en segundos. <br />
            <span className="text-slate-200">Sin teoría aburrida. Solo práctica.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <button 
              onClick={() => router.push("/vocalgym/listen")}
              className="group relative px-10 py-6 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl font-black text-lg uppercase tracking-widest hover:from-blue-600 hover:to-indigo-600 transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] active:scale-95 border border-white/10"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">mic</span>
                Analizar Señal
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: CÓMO FUNCIONA */}
      <section className="py-20 md:py-32 px-6 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
          <div className="space-y-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase leading-tight">
              Cómo funciona <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 animate-pulse">tu voz</span>.
            </h2>
            <div className="h-0.5 w-16 bg-blue-600/50 mx-auto" />
            <p className="text-base text-slate-400 leading-relaxed text-justify hyphens-auto">
              Si tu voz tiembla o se escucha bajo, nadie te prestará atención.
              <br/><br/>
              No es culpa de tus ideas. Es "ruido" en tu sonido.
              <br/><br/>
              No necesitas talento. Necesitas <strong className="text-slate-200">controlar tu aire</strong>.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
             <div className="p-8 bg-[#0F1419] border border-white/5 rounded-3xl space-y-3 group hover:border-blue-500/30 transition-colors shadow-2xl">
                <h4 className="font-bold text-lg text-slate-200 uppercase">Voz Insegura</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Cuando hablas monótono o dudas, la gente deja de escuchar. Te conviertes en ruido de fondo.</p>
             </div>
             <div className="p-8 bg-[#0F1419] border border-white/5 rounded-3xl space-y-3 group hover:border-blue-500/30 transition-colors shadow-2xl">
                <h4 className="font-bold text-lg text-slate-200 uppercase">Tensión Física</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Si te pones tenso, tu garganta se cierra. Tu voz sale fina y débil, aunque tú te sientas seguro.</p>
             </div>
             <div className="p-8 bg-[#0F1419] border border-white/5 rounded-3xl space-y-3 group hover:border-blue-500/30 transition-colors shadow-2xl">
                <h4 className="font-bold text-lg text-slate-200 uppercase">Poco Volumen</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Si no usas bien tu aire, tu voz no viaja. Nadie te escucha si hay ruido en la sala.</p>
             </div>
          </div>
        </div>
      </section>

      {/* FOOTER: CTA FINAL */}
      <section className="py-24 px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">
             Controla tu voz. <br /> <span className="text-blue-500">Cuando quieras.</span>
          </h2>
          <p className="text-slate-500 font-mono text-sm max-w-xl mx-auto uppercase mb-12">
             Prueba, mide y mejora antes de hablar.
          </p>
          <button 
            onClick={() => router.push("/vocalgym/listen")}
            className="px-12 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Empezar Ahora
          </button>
      </section>

    </main>
  );
}
