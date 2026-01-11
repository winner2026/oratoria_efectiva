"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OfferPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const benefits = [
    {
      title: "Dominancia Ejecutiva",
      desc: "Elimina los micro-temblores de ansiedad que el oído humano detecta inconscientemente. Suena seguro, incluso cuando no lo estás.",
      icon: "military_tech",
      color: "amber"
    },
    {
      title: "Análisis Biométrico",
      desc: "24 métricas en tiempo real. Desde tu ritmo de WPM hasta la profundidad espectral de tu timbre. Hardware vocal optimizado.",
      icon: "biometrics",
      color: "blue"
    },
    {
      title: "Inteligencia Estratégica",
      desc: "No solo te decimos cómo sonaste. Nuestra IA analiza tu intención y te da el guion exacto para ganar la siguiente reunión.",
      icon: "psychology",
      color: "purple"
    }
  ];

  return (
    <main className="min-h-screen bg-[#05070A] text-white font-display overflow-x-hidden selection:bg-blue-500/30">
      
      {/* SECCIÓN 1: HERO IMPACTO */}
      <section className="relative min-h-[90dvh] flex flex-col items-center justify-center pt-20 px-6">
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
             Vocal Intelligence Protocol v2.5
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] text-white uppercase italic">
            Tu voz es tu <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-400 to-amber-500">Mayor Activo</span> <br /> o tu mayor traición.
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            En reuniones de alto impacto, el 90% de tu autoridad no viene de lo que dices, sino de cómo lo procesa el sistema límbico de tu audiencia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button 
              onClick={() => router.push("/auth/login?callbackUrl=/listen")}
              className="group relative px-10 py-6 bg-blue-600 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-blue-500 transition-all hover:scale-105 hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.5)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                ACTIVAR CENTRO DE MANDO
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </button>
            <p className="text-[10px] font-mono text-slate-500 max-w-[200px] text-left">
              * Acceso restringido. <br /> Requiere cuenta de Google para autenticación biométrica.
            </p>
          </div>
        </div>

        {/* Hero Image / Interface Mockup */}
        <div className="mt-20 relative max-w-5xl mx-auto w-full group">
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

      {/* SECCIÓN 2: AGITACIÓN DEL PROBLEMA */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              ¿Por qué algunos <br /> <span className="text-red-500">dominan</span> y otros <br /> pasan desapercibidos?
            </h2>
            <div className="h-1 w-20 bg-red-500" />
            <p className="text-lg text-slate-400 leading-relaxed font-medium">
              No es "talento natural". Es control de hardware. El miedo escénico y la inseguridad se manifiestan como frecuencias inestables, pausas de duda y falta de resonancia. 
              <br /><br />
              El instinto humano huele la duda. Y la duda es la muerte de cualquier acuerdo.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
             <div className="p-6 bg-[#0F1419] border border-white/5 rounded-2xl space-y-2 group hover:border-red-500/30 transition-colors">
                <span className="text-red-500 font-black text-xs uppercase tracking-widest">ERROR #1</span>
                <h4 className="font-bold text-xl uppercase">El Temblor de Ansiedad</h4>
                <p className="text-sm text-slate-500">Micro-oscilaciones que te hacen sonar como alguien pidiendo permiso en lugar de dar órdenes.</p>
             </div>
             <div className="p-6 bg-[#0F1419] border border-white/5 rounded-2xl space-y-2 group hover:border-red-500/30 transition-colors">
                <span className="text-red-500 font-black text-xs uppercase tracking-widest">ERROR #2</span>
                <h4 className="font-bold text-xl uppercase">Muletillas de Relleno</h4>
                <p className="text-sm text-slate-500">Cada "eh", "bueno", o "este" drena tu autoridad y regala tu poder al que está escuchando.</p>
             </div>
             <div className="p-6 bg-[#0F1419] border border-white/5 rounded-2xl space-y-2 group hover:border-red-500/30 transition-colors">
                <span className="text-red-500 font-black text-xs uppercase tracking-widest">ERROR #3</span>
                <h4 className="font-bold text-xl uppercase">Falta de Resonancia</h4>
                <p className="text-sm text-slate-500">Una voz plana y de garganta que indica que no estás ocupando el espacio que te corresponde.</p>
             </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: LA SOLUCIÓN (BENEFICIOS) */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-24 space-y-4">
           <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Tecnología de <span className="text-blue-500">Grado Militar</span></h2>
           <p className="text-slate-500 uppercase tracking-widest font-black text-xs">Para comunicación civil de alto nivel</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
             <div key={i} className="group p-8 rounded-[40px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 relative">
                <div className={`size-16 rounded-2xl bg-${b.color}-500/10 flex items-center justify-center text-${b.color}-400 mb-8`}>
                   <span className="material-symbols-outlined text-4xl">{b.icon}</span>
                </div>
                <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">{b.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
                <div className={`absolute bottom-8 right-8 size-2 rounded-full bg-${b.color}-500 blur-sm opacity-0 group-hover:opacity-100 transition-opacity`} />
             </div>
          ))}
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

      {/* SECCIÓN 5: PRICING (PLANES) */}
      <section className="py-40 px-6 bg-[#07090C]">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <header className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight">Selecciona tu <span className="italic text-slate-500">Rango</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">No es una mensualidad, es una inversión en tu capacidad de negociación.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
            {/* STARTER */}
            <div className="bg-[#0D131A] border-2 border-slate-800 p-10 rounded-[40px] flex flex-col h-full hover:border-blue-500/50 transition-all group">
               <div className="flex justify-between items-start mb-10">
                  <div className="space-y-1">
                     <h4 className="text-xl font-black uppercase tracking-widest text-blue-400">STARTER</h4>
                     <p className="text-[10px] text-slate-500 font-bold uppercase">Plan de Desempeño</p>
                  </div>
                  <div className="text-right">
                     <p className="text-4xl font-black">$12</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase">/ MES</p>
                  </div>
               </div>
               <ul className="space-y-4 mb-12 flex-1">
                  <li className="flex gap-3 text-sm font-bold text-slate-300">
                     <span className="material-symbols-outlined text-blue-500 text-sm">check</span>
                     100 Auditorías IA / mes
                  </li>
                  <li className="flex gap-3 text-sm font-bold text-slate-300">
                     <span className="material-symbols-outlined text-blue-500 text-sm">check</span>
                     Protocolo Elite 21 Días
                  </li>
                  <li className="flex gap-3 text-sm font-bold text-slate-300">
                     <span className="material-symbols-outlined text-blue-500 text-sm">check</span>
                     Arsenal de Tácticas Ilimitado
                  </li>
               </ul>
               <button 
                  onClick={() => router.push("/auth/login?callbackUrl=/upgrade")}
                  className="w-full py-5 rounded-2xl bg-blue-600 font-black text-xs uppercase tracking-[0.2em] group-hover:scale-[1.02] transition-transform"
               >
                  Activar Licencia
               </button>
            </div>

            {/* PREMIUM */}
            <div className="bg-[#111] border-2 border-amber-600/30 p-10 rounded-[40px] flex flex-col h-full relative overflow-hidden group shadow-[0_0_100px_-20px_rgba(217,119,6,0.15)]">
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
               <div className="flex justify-between items-start mb-10">
                  <div className="space-y-1">
                     <h4 className="text-xl font-black uppercase tracking-widest text-amber-500">PREMIUM</h4>
                     <p className="text-[10px] text-slate-500 font-bold uppercase">Elite Ejecutiva</p>
                  </div>
                  <div className="text-right">
                     <p className="text-4xl font-black">$29</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase">/ MES</p>
                  </div>
               </div>
               <ul className="space-y-4 mb-12 flex-1">
                  <li className="flex gap-3 text-sm font-black text-white">
                     <span className="material-symbols-outlined text-amber-500 text-sm">grade</span>
                     Auditorías IA Ilimitadas
                  </li>
                  <li className="flex gap-3 text-sm font-black text-white">
                     <span className="material-symbols-outlined text-amber-500 text-sm">grade</span>
                     Análisis Espectral Elite
                  </li>
                  <li className="flex gap-3 text-sm font-black text-white">
                     <span className="material-symbols-outlined text-amber-500 text-sm">grade</span>
                     Métricas de Status Inconsciente
                  </li>
                  <li className="flex gap-3 text-sm font-black text-slate-300">
                     <span className="material-symbols-outlined text-amber-500 text-sm">check</span>
                     Protocolo 30 Días de Mando
                  </li>
               </ul>
               <button 
                  onClick={() => router.push("/auth/login?callbackUrl=/upgrade")}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 font-black text-xs uppercase tracking-[0.2em] group-hover:scale-[1.02] transition-transform"
               >
                  Obtener Pase Elite
               </button>
            </div>
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
               REGISTRARSE CON GOOGLE
            </button>
            <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em] pt-12">
               Oratoria Efectiva Pro • 2026 • © Todos los derechos reservados
            </p>
         </div>
      </section>

    </main>
  );
}
