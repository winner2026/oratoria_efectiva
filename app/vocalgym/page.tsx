"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExperimentalConversionLanding() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleStartDiagnostic = () => {
    router.push("/voz_efectiva");
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <main className="min-h-screen bg-[#05070A] text-white font-display overflow-x-hidden selection:bg-amber-500/30">
      
      {/* GLOBAL FLOATING HEADER */}
      <header className="absolute top-0 left-0 w-full p-6 md:px-20 py-8 z-50 flex items-center justify-between border-b border-white/5 bg-[#05070A]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-black tracking-tighter text-sm md:text-xl uppercase block">
            Oratoria <span className="text-amber-400">Efectiva</span>
          </span>
        </div>
        
        <button 
          onClick={handleStartDiagnostic}
          className="text-xs md:text-sm font-black text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest border border-amber-500/30 px-5 py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20"
        >
          Diagnóstico Gratis
        </button>
      </header>

      {/* 1. HERO — ARRIBA DE TODO */}
      <section className="relative min-h-[90dvh] flex flex-col items-center justify-center pt-28 px-6 pb-16">
        {/* Background glow orbs matching Victor's studio lighting (Warm Amber left + Navy Slate right) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            DIAGNÓSTICO VOCAL GRATUITO DE 60 SEGUNDOS
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white uppercase">
            Descubre qué está debilitando <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-100">
              tu forma de hablar en solo 60 segundos.
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Analiza tu voz con IA y descubre si tu principal problema está en el <strong className="text-amber-400 font-semibold">ritmo, las pausas, las muletillas, la energía o la variación vocal</strong>.
          </p>

          <div className="pt-4 space-y-4">
            <button 
              onClick={handleStartDiagnostic}
              className="group relative px-10 py-6 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-2xl font-black text-base md:text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_-10px_rgba(245,158,11,0.5)] border border-amber-400/30 flex items-center justify-center gap-3 mx-auto text-black"
            >
              <span className="material-symbols-outlined text-3xl">mic</span>
              Analizar mi voz gratis →
            </button>

            <div className="flex items-center justify-center gap-4 md:gap-6 text-slate-400 text-[11px] font-mono uppercase tracking-widest pt-2">
              <span>🎙️ 60 segundos</span>
              <span>·</span>
              <span>⚡ Resultado inmediato</span>
              <span>·</span>
              <span>🆓 Gratis</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MOSTRAR EL PROBLEMA (CONEXIÓN YOUTUBE) */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
              Tal vez no necesitas hablar más. <br />
              <span className="text-amber-400">Necesitas saber qué corregir.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 bg-[#0A0D14] border border-white/10 rounded-3xl space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="text-3xl">⚡</div>
              <h3 className="font-black text-base text-white uppercase tracking-wide">Hablas demasiado rápido</h3>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">→ Tu mensaje pierde claridad.</p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">Aceleras el ritmo por ansiedad o hábito, impidiendo que la audiencia procese tus ideas clave.</p>
            </div>

            <div className="p-7 bg-[#0A0D14] border border-white/10 rounded-3xl space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="text-3xl">🗣️</div>
              <h3 className="font-black text-base text-white uppercase tracking-wide">Usas demasiadas muletillas</h3>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">→ Tu discurso pierde fluidez.</p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">Los muletillas constantes ("eh", "este", "o sea") fragmentan tu oración y proyectan duda.</p>
            </div>

            <div className="p-7 bg-[#0A0D14] border border-white/10 rounded-3xl space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="text-3xl">🎵</div>
              <h3 className="font-black text-base text-white uppercase tracking-wide">Tu voz tiene poca variación</h3>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">→ Tu mensaje puede sonar plano.</p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">La falta de inflexión tonal aburre a tu oyente, independientemente de lo valioso de tu contenido.</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-slate-300 font-mono text-sm md:text-base border border-amber-500/20 bg-amber-500/5 py-4 px-6 rounded-2xl inline-block">
              💡 El problema es que normalmente <strong className="text-white">no sabes cuál de estos es el tuyo</strong>.
            </p>
          </div>

        </div>
      </section>

      {/* 3. PRESENTAR EL MECANISMO */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">EL MECANISMO DIAGNÓSTICO</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Escucha. Mide. Detecta. Entrena.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl space-y-3 relative">
              <span className="text-amber-400 font-mono font-black text-sm">01</span>
              <h4 className="font-bold text-sm text-white uppercase">Hablas</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Graba aproximadamente 60 segundos respondiendo una pregunta guiada.</p>
            </div>

            <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl space-y-3 relative">
              <span className="text-amber-400 font-mono font-black text-sm">02</span>
              <h4 className="font-bold text-sm text-white uppercase">Analizamos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">El sistema analiza diferentes características de tu comunicación vocal en tiempo real.</p>
            </div>

            <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl space-y-3 relative">
              <span className="text-amber-400 font-mono font-black text-sm">03</span>
              <h4 className="font-bold text-sm text-white uppercase">Descubres tu foco</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Obtienes tu principal área de mejora sin métricas irrelevantes ni distracciones.</p>
            </div>

            <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl space-y-3 relative">
              <span className="text-amber-400 font-mono font-black text-sm">04</span>
              <h4 className="font-bold text-sm text-white uppercase">Recibes una misión</h4>
              <p className="text-xs text-slate-400 leading-relaxed">En lugar de darte 10 cosas para corregir, te indica exactamente qué entrenar primero (Focus Lock).</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. MUESTRA DEL RESULTADO (CARD MOCKUP TANGIBLE) */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">VISTA PREVIA DE TU DIAGNÓSTICO</span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
              Tu diagnóstico podría verse así:
            </h2>
          </div>

          <div className="bg-[#0A0D14] border border-amber-500/30 rounded-[32px] p-8 text-left space-y-6 max-w-md mx-auto shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Índice de Autoridad</span>
                <span className="text-xs text-slate-500">Evaluación Bioacústica</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white">67</span>
                <span className="text-xs text-slate-500 font-bold"> / 100</span>
              </div>
            </div>

            <div className="space-y-3 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full inline-block">🎯 Tu foco actual</span>
              <h4 className="text-base font-black text-white uppercase">Control de muletillas</h4>
              <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-amber-500 pl-3">
                Detectamos 6 muletillas durante tu muestra. Esto interrumpe la continuidad de tu discurso.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 space-y-2 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">🎙️ Tu misión prescrita</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Nivel 2</span>
              </div>
              <h5 className="text-sm font-black text-white uppercase">Filler Killer</h5>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span>⏱️ 60 segundos</span>
                <span>·</span>
                <span>🎯 Enfoque único</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartDiagnostic}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs md:text-sm uppercase tracking-widest rounded-full hover:bg-amber-300 transition-all inline-block shadow-lg hover:scale-105"
            >
              Quiero descubrir mi resultado →
            </button>
          </div>

        </div>
      </section>

      {/* 5. ¿POR QUÉ CONFIAR? (AUTORIDAD VÍCTOR YOUTUBE) */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">RESPALDO Y CREDIBILIDAD</span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
              Creado para personas que quieren hablar con más seguridad
            </h2>
          </div>

          <div className="p-8 bg-slate-900/50 border border-white/10 rounded-3xl space-y-6 max-w-xl mx-auto backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-blue-600 flex items-center justify-center text-black font-black text-xl shadow-lg border border-white/20">
                V
              </div>
              <div className="text-left">
                <h4 className="font-bold text-base text-white">Víctor — Oratoria Efectiva</h4>
                <p className="text-xs text-amber-400 font-medium">Contenido y entrenamiento sobre comunicación y oratoria</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-center space-y-1">
              <span className="text-3xl font-black text-white tracking-tight">+9.000 personas</span>
              <p className="text-xs text-slate-400">siguen la comunidad y metodología de Oratoria Efectiva.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. REDUCIR FRICCIÓN */}
      <section className="py-16 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">¿Qué necesitas?</h3>
            <p className="text-slate-400 text-xs">Tres requisitos mínimos para iniciar tu diagnóstico ahora mismo:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-[#0A0D14] border border-white/10 rounded-2xl space-y-3">
              <span className="text-3xl block">🎙️</span>
              <h4 className="font-bold text-sm text-white uppercase">Un micrófono</h4>
              <p className="text-xs text-slate-400 leading-relaxed">El de tu celular o computadora sirve perfectamente.</p>
            </div>

            <div className="p-6 bg-[#0A0D14] border border-white/10 rounded-2xl space-y-3">
              <span className="text-3xl block">⏱️</span>
              <h4 className="font-bold text-sm text-white uppercase">60 segundos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">No necesitas preparar un discurso extenso.</p>
            </div>

            <div className="p-6 bg-[#0A0D14] border border-white/10 rounded-2xl space-y-3">
              <span className="text-3xl block">🧠</span>
              <h4 className="font-bold text-sm text-white uppercase">Una respuesta espontánea</h4>
              <p className="text-xs text-slate-400 leading-relaxed">El objetivo es analizar cómo hablas naturalmente.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">RESOLVIENDO DUDAS</span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Preguntas Frecuentes</h2>
          </div>

          <div className="space-y-4">
            {[
              { 
                q: "¿Es gratis?", 
                a: "Sí, el diagnóstico inicial de 60 segundos es totalmente gratuito." 
              },
              { 
                q: "¿Necesito registrarme?", 
                a: "No antes de obtener tu primer valor. Obtienes tu diagnóstico inicial de inmediato sin barreras de entrada." 
              },
              { 
                q: "¿Cuánto demora?", 
                a: "El objetivo es que llegues a tu resultado en menos de 65 segundos en total. El procesamiento bioacústico tarda menos de 5 segundos tras finalizar de hablar." 
              },
              { 
                q: "¿Qué analiza?", 
                a: "Ritmo (WPM), pausas tácticas, muletillas, fluidez, energía y variación vocal, entre otras métricas." 
              },
              { 
                q: "¿La IA decide si soy buen orador?", 
                a: "No. El sistema analiza características observables de una muestra de voz y propone un foco de entrenamiento práctico." 
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 bg-slate-900/50 border border-white/10 rounded-2xl cursor-pointer hover:border-amber-500/40 transition-all"
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex items-center justify-between font-bold text-sm text-white">
                  <span>{item.q}</span>
                  <span className="material-symbols-outlined text-sm text-amber-400">{openFaq === idx ? 'expand_less' : 'expand_more'}</span>
                </div>
                {openFaq === idx && (
                  <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-transparent via-amber-950/20 to-blue-950/40 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            ¿Quieres saber qué está frenando tu voz?
          </h2>
          <p className="text-slate-300 text-sm md:text-base">
            Haz tu diagnóstico gratuito de 60 segundos.
          </p>
          <button 
            onClick={handleStartDiagnostic}
            className="px-10 py-6 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-2xl font-black text-base uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_-10px_rgba(245,158,11,0.5)] border border-amber-400/30 inline-flex items-center gap-3 text-black"
          >
            <span className="material-symbols-outlined text-2xl">mic</span>
            Analizar mi voz gratis →
          </button>
        </div>
      </section>

    </main>
  );
}
