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
             <div className="relative size-10 md:size-12 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 p-2 shadow-2xl">
                <Image 
                   src="/logo-app.png" 
                   alt="Oratoria Pro Logo" 
                   fill 
                   className="object-contain p-1"
                />
             </div>
             <span className="font-black tracking-tighter text-sm md:text-base uppercase hidden md:block">
                Oratoria <span className="text-blue-500">Pro</span>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 animate-fade-in">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
             </span>
             INTELIGENCIA DE COMANDO v3.0
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1] md:leading-[0.9] text-white uppercase italic">
            Tu voz te está costando <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-orange-500 to-amber-500">Más de lo que crees.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            La inseguridad vocal es el "impuesto invisible" que pagas en cada negociación. <br />
            <span className="text-white font-bold">Deja de pedir permiso. Empieza a dar órdenes biológicas.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <button 
              onClick={() => router.push("/listen")}
              className="group relative px-10 py-6 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl font-black text-lg uppercase tracking-widest hover:from-blue-600 hover:to-indigo-600 transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] active:scale-95 border border-white/10"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">mic</span>
                Analizar mi Autoridad (Gratis)
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
        {/* Adorno de fondo */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[1.2] md:leading-[1.1]">
              ¿Por qué sientes que <br/> tienes un <span className="text-blue-500">techo invisible</span>?
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-transparent" />
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              Tienes la experiencia. Tienes la estrategia. Eres, objetivamente, el más capaz de la sala.
              <br/><br/>
              Sin embargo, ves cómo otros con la mitad de tu talento se llevan el crédito, el ascenso o el cliente. 
              <br/><br/>
              No es injusticia. Es <strong className="text-white">Física Acústica</strong>. El mundo no escucha tu "currículum", escucha tu frecuencia.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
             {/* DOLOR 1: IRRELEVANCIA / SER IGNORADO */}
             <div className="p-8 bg-[#0F1419] border border-white/5 rounded-3xl space-y-3 group hover:border-blue-500/30 transition-colors shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="material-symbols-outlined text-6xl text-slate-500">visibility_off</span>
                </div>
                <h4 className="font-bold text-xl text-white uppercase">La "Desconexión" Sutil</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                   Ese momento en la reunión donde notas que miran el celular o te interrumpen "sin querer". No es mala educación; es que tu voz no reclamó biológicamente el espacio auditivo. Te volviste ruido de fondo.
                </p>
             </div>
             
             {/* DOLOR 2: LA DISONANCIA (IMPOSTOR) */}
             <div className="p-8 bg-[#0F1419] border border-white/5 rounded-3xl space-y-3 group hover:border-blue-500/30 transition-colors shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="material-symbols-outlined text-6xl text-slate-500">theater_comedy</span>
                </div>
                <h4 className="font-bold text-xl text-white uppercase">La Traición del Hardware</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                   Por dentro estás 100% seguro de tu idea. Pero tu laringe se tensa y emite un micro-temblor que grita "duda". Tu cuerpo está contradiciendo a tu intelecto, y la audiencia siempre le cree al cuerpo.
                </p>
             </div>
             
             {/* DOLOR 3: EL COSTO DE OPORTUNIDAD */}
             <div className="p-8 bg-[#0F1419] border border-white/5 rounded-3xl space-y-3 group hover:border-blue-500/30 transition-colors shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="material-symbols-outlined text-6xl text-slate-500">trending_flat</span>
                </div>
                <h4 className="font-bold text-xl text-white uppercase">El Estancamiento Silencioso</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                   Ser el "experto técnico" confiable, pero nunca el "líder" inspirador. Quedar atrapado en la ejecución porque nadie visualiza tu voz dirigiendo la estrategia.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: LA SOLUCIÓN (INGENIERÍA VOCAL) */}
      <section className="py-20 md:py-40 px-6 relative overflow-hidden bg-[#05070A]">
        <div className="max-w-6xl mx-auto text-center mb-16 md:mb-24 space-y-6">
           <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[1.1] md:leading-tight">Deja de Adivinar. <br /><span className="text-blue-500">Empieza a Medir.</span></h2>
           <p className="text-slate-400 uppercase tracking-widest font-black text-xs max-w-xl mx-auto leading-loose">
             La oratoria tradicional te da "consejos". Nosotros te damos <span className="text-white border-b border-blue-500">datos forenses</span> de tu performance.
           </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Benefit 1 */}
           <div className="group p-10 rounded-[40px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl text-slate-700 select-none group-hover:opacity-10 transition-opacity">1</div>
               <div className="size-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl">monitor_heart</span>
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 tracking-tight text-white">Telemetría Emocional</h3>
               <p className="text-slate-400 text-sm leading-relaxed font-medium">
                 Nuestro motor IA rastrea 24 puntos de datos por segundo. Detectamos la ansiedad antes de que tu audiencia la note.
               </p>
           </div>

           {/* Benefit 2 */}
           <div className="group p-10 rounded-[40px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl text-slate-700 select-none group-hover:opacity-10 transition-opacity">2</div>
               <div className="size-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl">psychology_alt</span>
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 tracking-tight text-white">Subtexto Psicológico</h3>
               <p className="text-slate-400 text-sm leading-relaxed font-medium">
                 No solo analizamos CÓMO suenas, sino QUÉ proyectas. ¿Suenas autoritario o arrogante? ¿Seguro o defensivo?
               </p>
           </div>

           {/* Benefit 3 */}
           <div className="group p-10 rounded-[40px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl text-slate-700 select-none group-hover:opacity-10 transition-opacity">3</div>
               <div className="size-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl">prescriptions</span>
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 tracking-tight text-white">Corrección Quirúrgica</h3>
               <p className="text-slate-400 text-sm leading-relaxed font-medium">
                 Diagnóstico sin cura es inútil. Recibe "recetas" de ejercicios de 2 minutos diseñados para eliminar tus fallos específicos.
               </p>
           </div>
        </div>
      </section>

      {/* SECCIÓN 4: EL PROTOCOLO (LOGÍSTICA) */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/40 to-black p-[1px] rounded-[48px] overflow-hidden">
           <div className="bg-[#05070A] p-8 md:p-20 rounded-[47px] space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                 <div className="space-y-4">
                    <span className="text-4xl font-black text-blue-500">01</span>
                    <h5 className="font-black uppercase tracking-widest text-xs">Bio-Calibras</h5>
                    <p className="text-[11px] text-slate-500 font-medium">Ajustas tu hardware vocal con el piano inteligente antes de cada acción.</p>
                 </div>
                 <div className="space-y-4">
                    <span className="text-4xl font-black text-amber-500">02</span>
                    <h5 className="font-black uppercase tracking-widest text-xs">Auditas</h5>
                    <p className="text-[11px] text-slate-500 font-medium">Grabas tu intención. El motor IA descompone 24 métricas en microsegundos.</p>
                 </div>
                 <div className="space-y-4">
                    <span className="text-4xl font-black text-purple-500">03</span>
                    <h5 className="font-black uppercase tracking-widest text-xs">Dominas</h5>
                    <p className="text-[11px] text-slate-500 font-medium">Recibes el feedback estratégico y tu plan de entrenamiento personalizado.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* SECCIÓN 5: PRICING (PLANES DE MANDO) */}
      <section className="py-24 px-6 bg-[#07090C] border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <header className="text-center mb-16 space-y-6">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight">Elige tu <span className="text-blue-500">Nivel de Dominio</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
               La mayoría invierte en trajes caros. Los líderes invierten en la única herramienta que usan el 100% del tiempo: <strong className="text-white">Su Voz.</strong>
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
             {/* 1. PLAN STARTER */}
             <div className="bg-[#0D131A] border-2 border-blue-600 rounded-[32px] p-8 md:p-10 flex flex-col h-full relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                <div className="absolute top-6 right-8 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                   RECOMENDADO PARA INICIAR
                </div>
                
                <div className="space-y-2 mb-8 mt-4">
                   <h3 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
                     <span className="material-symbols-outlined text-blue-500 text-3xl">bolt</span>
                     STARTER
                   </h3>
                   <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">$12</span>
                      <span className="text-slate-500 text-xs uppercase font-bold">/ Mes</span>
                   </div>
                </div>
                <p className="text-base text-slate-300 mb-10 font-medium italic leading-relaxed">
                  "Para quien ya no quiere pasar desapercibido y necesita construir una base sólida de seguridad."
                </p>
                <ul className="space-y-5 mb-12 flex-1 text-sm font-bold text-white">
                    <li className="flex items-center gap-4">
                       <span className="material-symbols-outlined text-blue-500">verified</span>
                       100 Auditorías IA / mes
                    </li>
                   <li className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-blue-500">fitness_center</span>
                      Protocolo Completo (Fases 1-3)
                   </li>
                   <li className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-blue-500">library_books</span>
                      Arsenal de Tácticas Total
                   </li>
                </ul>
                <button 
                   onClick={() => router.push("/auth/login?callbackUrl=/upgrade")}
                   className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black transition-all text-xs uppercase tracking-[0.25em] shadow-[0_10px_20px_rgba(37,99,235,0.3)] active:scale-95"
                >
                   ACTIVAR LICENCIA STARTER
                </button>
             </div>

             {/* 2. PLAN PREMIUM */}
             <div className="bg-gradient-to-b from-[#111] to-black border border-amber-500/30 rounded-[32px] p-8 md:p-10 flex flex-col h-full relative overflow-hidden group hover:border-amber-500/60 transition-all duration-500 shadow-2xl ring-1 ring-white/5">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                
                <div className="space-y-2 mb-8 mt-4">
                   <h3 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
                     <span className="material-symbols-outlined text-amber-500 text-3xl">military_tech</span>
                     PREMIUM
                   </h3>
                   <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">$29</span>
                      <span className="text-slate-500 text-xs uppercase font-bold">/ Mes</span>
                   </div>
                </div>
                <p className="text-base text-slate-400 mb-10 font-medium leading-relaxed">
                  "Para el ejecutivo que negocia contratos de alto valor. Tu voz será tu ventaja injusta."
                </p>
                <ul className="space-y-5 mb-12 flex-1 text-sm font-bold text-slate-200">
                    <li className="flex items-start gap-4">
                       <div className="mt-0.5 text-amber-500">
                           <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S21.31,6,18,6z M18,16c-2.21,0-4-1.79-4-4s1.79-4,4-4s4,1.79,4,4S20.21,16,18,16z M6,12c0-3.31,2.69-6,6-6v2c-2.21,0-4,1.79-4,4s1.79-4,4,4v2C8.69,18,6,15.31,6,12z"/></svg>
                       </div>
                       <span>Auditorías IA Ilimitadas</span>
                    </li>
                   <li className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-amber-500">psychology</span>
                      <span>Análisis de Persuasión</span>
                   </li>
                   <li className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-amber-500">medical_services</span>
                      <span>Prescripción (Recetas) de Ejercicios</span>
                   </li>
                </ul>
                <button 
                   onClick={() => router.push("/auth/login?callbackUrl=/upgrade")}
                   className="w-full py-6 rounded-2xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-white font-black transition-all text-xs uppercase tracking-[0.25em] shadow-[0_10px_20px_rgba(217,119,6,0.2)] active:scale-95 border border-white/5"
                >
                   OBTENER PASE ELITE
                </button>
             </div>
          </div>
          
          {/* FREE TRIAL DOWNSELL */}
          <div className="mt-16 text-center">
              <Link href="/listen" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-all text-xs font-bold uppercase tracking-widest group">
                  <span className="material-symbols-outlined text-xl text-emerald-500">biotech</span>
                  <span>No estoy listo • Iniciar Diagnóstico Gratuito</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
          </div>
        </div>
      </section>

      {/* FOOTER FINAL CTA */}
      <section className="py-40 px-6 text-center">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
               No nazcas líder. <br /> <span className="text-blue-500">Constrúyelo.</span>
            </h2>
            <p className="text-slate-500 font-mono text-sm max-w-xl mx-auto uppercase">
               Mañana vas a hablar. <br /> Asegúrate de que el mundo quiera escuchar.
            </p>
            <button 
               onClick={() => router.push("/auth/login?callbackUrl=/listen")}
               className="px-12 py-8 bg-white text-black rounded-[32px] font-black text-xl uppercase tracking-widest hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
               REGÍSTRATE GRATIS
            </button>
            <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em] pt-12">
               Oratoria Efectiva Pro • 2026 • © Todos los derechos reservados
            </p>
         </div>
      </section>

    </main>
  );
}
