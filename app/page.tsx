
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#05070A] text-white font-display overflow-x-hidden selection:bg-blue-500/30">
      
      {/* GLOBAL FLOATING HEADER */}
      <header className="absolute top-0 left-0 w-full p-6 z-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* <div className="relative size-10 md:size-12 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 p-2 shadow-2xl">
                <Image 
                   src="/logo-new.png" 
                   alt="Oratoria Efectiva Logo" 
                   fill 
                   className="object-contain p-1"
                />
             </div> */}
             <span className="font-black tracking-tighter text-sm md:text-base uppercase hidden md:block">
                Oratoria <span className="text-blue-500">Efectiva</span>
             </span>
          </div>
          
          <Link href="/auth/login" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
             Iniciar Sesión
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium uppercase tracking-[0.3em] text-blue-400 mb-4 animate-fade-in">
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
              onClick={() => router.push("/listen")}
              className="group relative px-10 py-6 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl font-black text-lg uppercase tracking-widest hover:from-blue-600 hover:to-indigo-600 transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] active:scale-95 border border-white/10"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">mic</span>
                Analizar Señal (Gratis)
              </span>
            </button>
            <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    100% Privado & Encriptado
                 </div>
                 <p className="text-[10px] text-slate-500 font-mono">
                    Sin tarjeta de crédito requerida.
                 </p>
            </div>
          </div>
        </div>

        {/* Hero Image / Interface Mockup */}
        <div className="mt-12 md:mt-20 relative max-w-5xl mx-auto w-full group">
           <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-amber-600 rounded-[40px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
           <div className="relative bg-[#0A0F14] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="/vocal_command_center_hero_1768166681157.png" 
                alt="Vocal Command Center"
                className="w-full h-auto object-cover opacity-90 brightness-75 group-hover:brightness-100 transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0F14] to-transparent pointer-events-none" />
           </div>
        </div>
      </section>

      {/* SECCIÓN 2: LA VERDAD INCÓMODA (DOLORES PROFUNDOS) */}
      <section className="py-20 md:py-32 px-6 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase leading-tight">
              Cómo funciona <br/> <span className="text-blue-500">tu voz</span>.
            </h2>
            <div className="h-0.5 w-16 bg-blue-600/50" />
            <p className="text-base text-slate-400 leading-relaxed text-justify hyphens-auto">
              Si tu voz tiembla o se escucha bajo, nadie te prestará atención.
              <br/><br/>
              No es culpa de tus ideas. Es "ruido" en tu sonido.
              <br/><br/>
              No necesitas talento. Necesitas <strong className="text-slate-200">controlar tu aire</strong>.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
             <div className="p-8 bg-[#0F1419] border border-white/5 rounded-3xl space-y-3 group hover:border-blue-500/30 transition-colors shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="material-symbols-outlined text-6xl text-slate-500">visibility_off</span>
                </div>
                <h4 className="font-bold text-lg text-slate-200 uppercase">Voz Insegura</h4>
                <p className="text-sm text-slate-500 leading-relaxed text-justify">
                   Cuando hablas monótono o dudas, la gente deja de escuchar. Te conviertes en ruido de fondo.
                </p>
             </div>
             
             <div className="p-8 bg-[#0F1419] border border-white/5 rounded-3xl space-y-3 group hover:border-blue-500/30 transition-colors shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="material-symbols-outlined text-6xl text-slate-500">theater_comedy</span>
                </div>
                <h4 className="font-bold text-lg text-slate-200 uppercase">Tensión Física</h4>
                <p className="text-sm text-slate-500 leading-relaxed text-justify">
                   Si te pones tenso, tu garganta se cierra. Tu voz sale fina y débil, aunque tú te sientas seguro.
                </p>
             </div>
             
             <div className="p-8 bg-[#0F1419] border border-white/5 rounded-3xl space-y-3 group hover:border-blue-500/30 transition-colors shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="material-symbols-outlined text-6xl text-slate-500">trending_flat</span>
                </div>
                <h4 className="font-bold text-lg text-slate-200 uppercase">Poco Volumen</h4>
                <p className="text-sm text-slate-500 leading-relaxed text-justify">
                   Si no usas bien tu aire, tu voz no viaja. Nadie te escucha si hay ruido en la sala.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: LA SOLUCIÓN (INGENIERÍA VOCAL) */}
      <section className="py-20 md:py-40 px-6 relative overflow-hidden bg-[#05070A]">
        <div className="max-w-6xl mx-auto text-center mb-16 md:mb-24 space-y-6">
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase leading-tight">Resultados reales. <br /><span className="text-blue-500">Sin mentiras.</span></h2>
           <p className="text-slate-400 uppercase tracking-widest font-medium text-xs max-w-xl mx-auto leading-loose">
             Dejamos las opiniones. Usamos <span className="text-slate-200 border-b border-blue-500/50">datos simples</span>.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
           <div className="p-10 bg-[#0F1419] border border-white/5 rounded-[40px] hover:bg-[#13181E] transition-all group hover:-translate-y-2 relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
               <div className="size-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl">monitor_heart</span>
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 tracking-tight text-white">Detector de Errores</h3>
               <p className="text-slate-400 text-sm leading-relaxed font-medium">
                 Analizamos tu voz al instante. Te decimos si tiemblas o si hablas muy bajo.
               </p>
           </div>

           <div className="p-10 bg-[#0F1419] border border-amber-500/10 rounded-[40px] hover:bg-[#13181E] transition-all group hover:-translate-y-2 relative shadow-[0_0_50px_rgba(245,158,11,0.05)]">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
               <div className="size-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl">psychology_alt</span>
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 tracking-tight text-white">Escucha tu Tono</h3>
               <p className="text-slate-400 text-sm leading-relaxed font-medium">
                 ¿Suenas seguro o con dudas? Te mostramos cómo te escuchan los demás realmente.
               </p>
           </div>

           <div className="p-10 bg-[#0F1419] border border-white/5 rounded-[40px] hover:bg-[#13181E] transition-all group hover:-translate-y-2 relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
               <div className="size-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl">prescriptions</span>
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 tracking-tight text-white">Ejercicios Rápidos</h3>
               <p className="text-slate-400 text-sm leading-relaxed font-medium">
                 Nada de charlas largas. Solo ejercicios de 2 minutos para arreglar lo que falla.
               </p>
           </div>
        </div>
      </section>

      {/* SECCIÓN 4: CÓMO FUNCIONA (PASOS) */}
      <section className="py-20 md:py-32 px-6 border-t border-white/5">
         <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex-1 space-y-12">
                  <div className="space-y-4">
                     <span className="text-4xl font-black text-blue-500">01</span>
                     <h5 className="font-bold uppercase tracking-widest text-xs text-slate-300">Ajustar</h5>
                     <p className="text-[11px] text-slate-500 font-medium">Prepara tu garganta con un sonido guía.</p>
                  </div>
                  <div className="space-y-4">
                     <span className="text-4xl font-light text-slate-600">02</span>
                     <h5 className="font-bold uppercase tracking-widest text-xs text-slate-300">Medir</h5>
                     <p className="text-[11px] text-slate-500 font-medium">Mira en la pantalla cómo suena tu voz.</p>
                  </div>
                  <div className="space-y-4">
                     <span className="text-4xl font-light text-slate-600">03</span>
                     <h5 className="font-bold uppercase tracking-widest text-xs text-slate-300">Corregir</h5>
                     <p className="text-[11px] text-slate-500 font-medium">Haz pequeños cambios para sonar firme.</p>
                  </div>
            </div>
            {/* Image removed as per user request to remove real-time calibration preview */}
         </div>
      </section>

      {/* SECCIÓN 5: PRICING (SISTEMA DE ACCESO) */}
      <section className="py-20 md:py-32 px-6 relative bg-gradient-to-b from-[#05070A] to-[#0B0F15]">
           <header className="text-center mb-16 space-y-6">
             <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">Elige tu <span className="text-blue-500">Plan</span></h2>
             <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Empieza con lo básico o ve por todo. Tú decides.
             </p>
           </header>

           <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* PLAN STARTER - TACTICAL ENTRY */}
              <div className="p-8 md:p-12 rounded-[40px] border border-white/5 bg-[#0F1419] flex flex-col relative group hover:border-blue-500/20 transition-all">
                 <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-blue-500">bolt</span>
                        <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">Starter</span>
                    </div>
                    <div className="flex items-baseline gap-2 text-white">
                        <span className="text-5xl font-black tracking-tighter">$12</span>
                        <span className="text-slate-500 font-medium">/ mes</span>
                    </div>
                 </div>
                 
                 <p className="text-base text-slate-300 mb-10 font-medium italic leading-relaxed">
                   "Perfecto para empezar a mejorar tu voz hoy mismo."
                 </p>

                 <ul className="space-y-5 mb-12 flex-1 text-sm font-bold text-slate-400">
                    <li className="flex items-center gap-4">
                       <span className="material-symbols-outlined text-blue-500">verified</span>
                       100 Pruebas al mes
                    </li>
                    <li className="flex items-center gap-4">
                       <span className="material-symbols-outlined text-blue-500">library_books</span>
                       Todos los ejercicios
                    </li>
                    <li className="flex items-center gap-4">
                       <span className="material-symbols-outlined text-slate-600">lock</span>
                       <span className="text-slate-600 line-through decoration-slate-600/50">Medición Ilimitada</span>
                    </li>
                 </ul>
                 <button 
                  onClick={() => router.push("/upgrade")}
                  className="w-full py-4 rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all font-black uppercase tracking-widest text-xs"
                 >
                    Empezar
                 </button>
              </div>

              {/* PLAN ELITE - FULL CONTROL */}
              <div className="p-8 md:p-12 rounded-[40px] border border-amber-500/30 bg-[#0F1419] flex flex-col relative shadow-[0_0_50px_rgba(245,158,11,0.05)] transform md:scale-105 z-10">
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] py-2 px-6 rounded-full shadow-lg text-white">
                    Recomendado para Iniciar
                 </div>

                 <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-amber-500">military_tech</span>
                        <span className="text-xs font-black text-amber-500 uppercase tracking-[0.2em]">Elite</span>
                    </div>
                    <div className="flex items-baseline gap-2 text-white">
                        <span className="text-5xl font-black tracking-tighter">$24</span>
                        <span className="text-slate-500 font-medium">/ mes</span>
                    </div>
                 </div>
                 
                 <p className="text-base text-slate-400 mb-10 font-medium leading-relaxed">
                   "Herramientas completas para cuando hablar es lo más importante."
                 </p>

                 <ul className="space-y-5 mb-12 flex-1 text-sm font-bold text-white">
                    <li className="flex items-center gap-4">
                       <div className="mt-0.5 text-amber-500">
                           <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S21.31,6,18,6z M18,16c-2.21,0-4-1.79-4-4s1.79-4,4-4s4,1.79,4,4S20.21,16,18,16z M6,12c0-3.31,2.69-6,6-6v2c-2.21,0-4,1.79-4,4s1.79-4,4,4v2C8.69,18,6,15.31,6,12z"/></svg>
                       </div>
                       <span>Pruebas Ilimitadas</span>
                    </li>
                   <li className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-amber-500">psychology</span>
                      <span>Detector de Confianza</span>
                   </li>
                   <li className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-amber-500">medical_services</span>
                      <span>Guías de Ajuste Rápido</span>
                   </li>
                 </ul>
                 <button 
                  onClick={() => router.push("/upgrade")}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20"
                 >
                    Obtener Acceso Total
                 </button>
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
            onClick={() => router.push("/listen")}
            className="px-12 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Empezar Gratis
          </button>
      </section>

    </main>
  );
}
