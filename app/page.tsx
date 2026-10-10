"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020408] text-slate-200 font-sans flex flex-col items-center selection:bg-amber-500/30 overflow-x-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[10%] left-[20%] -translate-x-1/2 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] translate-x-1/2 w-[600px] h-[600px] bg-amber-700/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[200px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 z-50 flex items-center justify-between border-b border-white/5 bg-transparent relative">
        <div className="flex items-center gap-3">
          <span className="font-black tracking-tighter text-2xl uppercase block text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            VOZ<span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">EFECTIVA</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8 items-center text-xs font-bold uppercase tracking-widest text-slate-400">
          <a href="#dolores" className="hover:text-white transition-colors">El Problema</a>
          <a href="#metodo" className="hover:text-white transition-colors">El Método</a>
          <a href="#youtube" className="hover:text-amber-400 transition-colors flex items-center gap-2">
             <span className="material-symbols-outlined text-[18px]">play_circle</span>
             Comunidad
          </a>
          <Link 
            href="/onboarding" 
            className="px-5 py-2.5 rounded-full border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            Iniciar Diagnóstico
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-24 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="inline-block border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 mb-8"
        >
          Entrenamiento Vocal Impulsado por Inteligencia Artificial
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[1.05] max-w-4xl drop-shadow-2xl"
        >
          Tus ideas son brillantes. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
            Tu voz debe demostrarlo.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 mt-8 max-w-2xl leading-relaxed"
        >
          La oratoria no es un talento innato, es una habilidad que se entrena. Descubre qué limita tu comunicación y empieza a transmitir verdadera autoridad profesional en solo 3 días.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
        >
          <Link 
            href="/onboarding" 
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] flex items-center justify-center gap-3"
          >
            Evaluar Mi Voz Ahora
            <span className="material-symbols-outlined text-lg">mic</span>
          </Link>
          <a 
            href="https://www.youtube.com/@oratoria_efectiva" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-5 bg-transparent border border-white/10 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3"
          >
            Ver en YouTube
            <span className="material-symbols-outlined text-lg">smart_display</span>
          </a>
        </motion.div>
      </section>

      {/* Pain Points Section */}
      <section id="dolores" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            El mayor obstáculo en tu carrera<br className="hidden md:block"/> no es lo que sabes, es cómo lo dices.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            ¿Te identificas con alguna de estas situaciones en tu entorno laboral?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-red-500/10 hover:border-red-500/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-red-500">speed</span>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 mb-6">
              <span className="material-symbols-outlined">running_with_errors</span>
            </div>
            <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wide">Aceleración y Muletillas</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Los nervios te traicionan. Hablas demasiado rápido, tropiezas con las palabras y llenas los silencios con «ehhh», «este», restando claridad a tu mensaje.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/50 border border-blue-500/10 hover:border-blue-500/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-blue-500">equalizer</span>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
              <span className="material-symbols-outlined">graphic_eq</span>
            </div>
            <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wide">Voz Monótona y Aburrida</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Sientes que la gente desconecta cuando hablas. Falta energía, variación en el tono y entusiasmo, lo que hace imposible liderar o persuadir con eficacia.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/50 border border-amber-500/10 hover:border-amber-500/30 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-amber-500">gavel</span>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
              <span className="material-symbols-outlined">shield_person</span>
            </div>
            <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wide">Falta de Autoridad</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Aunque eres el experto, tu tono de voz proyecta duda. Pierdes presencia ejecutiva y te cuesta convencer a clientes o directivos de tus ideas.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition & Method */}
      <section id="metodo" className="relative z-10 w-full bg-slate-950 border-y border-white/5 py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 blur-[100px] -z-10 rounded-full" />
             <div className="bg-[#090C10] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-emerald-500" />
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Ejemplo de Diagnóstico IA</h4>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 w-[40%] h-full rounded-full" />
                    </div>
                    <span className="text-xs font-bold text-amber-500 uppercase w-20">Ritmo Rápido</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 w-[85%] h-full rounded-full" />
                    </div>
                    <span className="text-xs font-bold text-emerald-500 uppercase w-20">Buena Dicción</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div className="bg-red-500 w-[20%] h-full rounded-full" />
                    </div>
                    <span className="text-xs font-bold text-red-500 uppercase w-20">Pausas Nulas</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-sm text-amber-400 font-medium leading-relaxed italic">
                    «Hablas a un ritmo de 180 palabras por minuto y sin pausas. Tu prioridad ahora es dominar el silencio para transmitir más seguridad.»
                  </p>
                </div>
             </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
              No es magia.<br/> <span className="text-amber-500">Es entrenamiento.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Deja de intentar memorizar reglas complicadas. Voz Efectiva utiliza Inteligencia Artificial para medir la acústica real de tu voz y crear un mapa de entrenamiento hiper-personalizado.
            </p>
            
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-500 flex items-center justify-center font-black text-sm shrink-0">1</div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wide">Diagnóstico Objetivo</h4>
                  <p className="text-slate-400 text-sm mt-1">Graba 15 segundos y descubre exactamente qué métrica está saboteando tu comunicación.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-500 flex items-center justify-center font-black text-sm shrink-0">2</div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wide">Micro-Desafíos Inmediatos</h4>
                  <p className="text-slate-400 text-sm mt-1">Practica durante 2 minutos con un ejercicio diseñado específicamente para corregir tu debilidad principal.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-500 flex items-center justify-center font-black text-sm shrink-0">3</div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wide">Evolución Audible</h4>
                  <p className="text-slate-400 text-sm mt-1">Escucha el "antes y después" el mismo día. Siente la diferencia y gana la confianza que necesitas.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section id="youtube" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24">
        <div className="p-10 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-red-600/10 to-[#090C10] border border-red-500/20 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(220,38,38,0.5)]">
              <span className="material-symbols-outlined text-4xl text-white">play_arrow</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Únete a la Comunidad en YouTube
            </h2>
            <p className="text-red-200 text-lg mb-10 max-w-2xl">
              Cientos de profesionales ya están mejorando su autoridad vocal. Suscríbete al canal <strong className="text-white">@oratoria_efectiva</strong> para consejos prácticos, análisis de discursos y técnicas gratuitas todas las semanas.
            </p>
            
            <a 
              href="https://www.youtube.com/@oratoria_efectiva" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-4 bg-red-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-500 transition-colors flex items-center gap-3 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
              Suscribirse al Canal
              <span className="material-symbols-outlined">open_in_new</span>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 w-full bg-[#05070A] border-t border-white/5 py-32 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-8">
            Tu voz es tu tarjeta de presentación.
          </h2>
          <p className="text-slate-400 text-xl mb-12">
            No pierdas más oportunidades por no saber comunicar tus ideas. Inicia hoy mismo tu entrenamiento vocal impulsado por IA.
          </p>
          <Link 
            href="/onboarding" 
            className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3"
          >
            Realizar Diagnóstico Gratuito
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-6">
            Sin tarjeta de crédito. Primer análisis 100% libre.
          </p>
        </div>
      </section>

    </main>
  );
}
