"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#020408] text-slate-200 font-sans flex flex-col items-center selection:bg-amber-500/30 overflow-x-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[10%] left-[20%] -translate-x-1/2 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] translate-x-1/2 w-[600px] h-[600px] bg-amber-700/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[200px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 z-50 flex flex-wrap items-center justify-between border-b border-white/5 bg-transparent relative">
        <div className="flex items-center gap-3">
          <span className="font-black tracking-tighter text-2xl uppercase block text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            VOZ<span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">EFECTIVA</span>
          </span>
        </div>
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center size-11 rounded-xl border border-white/10 text-slate-200 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">{mobileMenuOpen ? "close" : "menu"}</span>
        </button>
        <nav className="hidden md:flex gap-8 items-center text-xs font-bold uppercase tracking-widest text-slate-400" aria-label="Navegación principal">
          <a href="#dolores" className="hover:text-white transition-colors">El Problema</a>
          <a href="#metodo" className="hover:text-white transition-colors">El Método</a>
          <a href="#productos" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            Productos
          </a>
          <Link href="/sin_miedo_a_hablar" className="hover:text-white transition-colors">
            Curso Sin Miedo
          </Link>
          <Link href="/regalos" className="hover:text-amber-300 transition-colors">Regalos</Link>
          <a href="#youtube" className="hover:text-amber-400 transition-colors flex items-center gap-2">
             <span className="material-symbols-outlined text-[18px]">play_circle</span>
             Comunidad
          </a>
          <Link 
            href="/onboarding" 
            className="px-5 py-2.5 rounded-full border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            Diagnóstico gratis
          </Link>
        </nav>
        {mobileMenuOpen && (
          <nav id="mobile-navigation" className="order-3 mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl md:hidden" aria-label="Navegación móvil">
            <div className="flex flex-col gap-1 text-sm font-semibold text-slate-300">
              <a href="#dolores" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 hover:bg-white/5">El problema</a>
              <a href="#metodo" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 hover:bg-white/5">Cómo funciona</a>
              <a href="#productos" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-amber-400 hover:bg-white/5 font-bold">Catálogo de Productos</a>
              <Link href="/protocolo-de-respuestas-inteligentes" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-amber-300 hover:bg-white/5 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">auto_stories</span>
                Nuevo Libro: Protocolo de Respuestas
              </Link>
              <Link href="/sin_miedo_a_hablar" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-slate-300 hover:bg-white/5">Curso Sin Miedo a Hablar · 29 USD</Link>
              <Link href="/regalos" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 hover:bg-white/5">Regalos · guía gratuita</Link>
              <a href="#youtube" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 hover:bg-white/5">Comunidad</a>
              <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)} className="mt-2 rounded-xl bg-amber-500 px-4 py-3 text-center font-black text-slate-950">Comenzar diagnóstico gratuito</Link>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
        <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-20 md:pb-24 text-center flex flex-col items-center">
        <Link
          href="/sin_miedo_a_hablar"
          className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 mb-6 transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>Curso Sin Miedo a Hablar · pago único de 29 USD</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="inline-block border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-slate-300 mb-8"
        >
          Entrenamiento Vocal Impulsado por Inteligencia Artificial
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-[1.08] max-w-4xl drop-shadow-2xl"
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
          La oratoria es una habilidad que se entrena. Identifica un aspecto de tu voz para mejorar y recibe una primera recomendación práctica.
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
            Comenzar diagnóstico gratuito
            <span className="material-symbols-outlined text-lg">mic</span>
          </Link>
          <a 
            href="https://www.youtube.com/@victormartinezpro"
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-5 bg-transparent border border-white/10 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3"
          >
            Ver en YouTube
            <span className="material-symbols-outlined text-lg">smart_display</span>
          </a>
        </motion.div>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-400">
          El diagnóstico inicial es gratuito. Para guardar tus respuestas y el resultado, tendrás que iniciar sesión con Google; no necesitas tarjeta.
        </p>
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
              A veces, al hablar con nervios, aceleramos, tropezamos con las palabras o llenamos las pausas con «ehhh» y «este».
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
              Una voz con poca variación de tono puede hacer más difícil mantener la atención al presentar una idea o dirigir una conversación.
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
              Si tu voz no refleja la seguridad que sientes, puede costar más transmitir tus ideas con claridad a clientes o colegas.
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
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">Ejemplo ilustrativo de diagnóstico</h4>
                <p className="text-xs text-slate-500 mb-6">Los valores son una muestra visual, no un resultado real.</p>
                
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
              Practica con ejercicios breves y usa el análisis de voz como una referencia para elegir qué trabajar. Las mediciones pueden variar según el micrófono y las condiciones de grabación.
            </p>
            
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-500 flex items-center justify-center font-black text-sm shrink-0">1</div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wide">Diagnóstico Objetivo</h4>
                  <p className="text-slate-400 text-sm mt-1">Graba una muestra breve y recibe indicaciones sobre aspectos como el ritmo y las pausas.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-500 flex items-center justify-center font-black text-sm shrink-0">2</div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wide">Micro-Desafíos Inmediatos</h4>
                  <p className="text-slate-400 text-sm mt-1">Prueba un ejercicio breve relacionado con el área que quieras trabajar.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-500 flex items-center justify-center font-black text-sm shrink-0">3</div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wide">Evolución Audible</h4>
                  <p className="text-slate-400 text-sm mt-1">Compara tus grabaciones para notar cambios; los resultados dependen de cada práctica.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 md:py-20" aria-labelledby="profesor-title">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-8 md:gap-14 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-white/10">
            <img
              src="/victor-martinez.png"
              alt="El profesor Víctor Martínez"
              className="w-full h-full object-cover object-[center_25%]"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-400">Tu profesor</p>
            <h2 id="profesor-title" className="mt-3 text-3xl md:text-4xl font-black text-white">Víctor Martínez</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              Docente uruguayo de Educación Secundaria y Educación Técnico Profesional, con más de 20 años de experiencia en Lengua y Comunicación.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Esa trayectoria en el aula inspira un enfoque práctico para ayudarte a expresarte con claridad y confianza.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            Catálogo de Productos y Formación
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Herramientas Tácticas para <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
              Hablar con Verdadera Autoridad
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            No vendemos teoría abstracta. Diseñamos manuales y cursos de aplicación inmediata para defender tus ideas bajo presión.
          </p>
        </div>

        {/* PRODUCT 1: NUEVO LIBRO PROTOCOLO DE RESPUESTAS INTELIGENTES (FEATURED) */}
        <div className="mb-12 p-8 md:p-14 rounded-[2.5rem] bg-gradient-to-br from-amber-950/40 via-slate-900/95 to-neutral-950 border-2 border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Book Mockup */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-xs aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.3)] border border-amber-500/30 group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/libro-protocolo-respuestas-inteligentes.jpg"
                  alt="Libro Protocolo de Respuestas Inteligentes - Víctor Martínez"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  Nuevo Libro
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400 text-center font-medium">
                Por Víctor Martínez &bull; Manual Táctico de Intervención Inmediata
              </p>
            </div>

            {/* Right Column: Copy targeting Avatar's pain points */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">psychology_alt</span>
                Tu Escudo Definitivo Contra la Improvisación
              </div>

              <h3 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">
                Protocolo de Respuestas Inteligentes
              </h3>

              <p className="text-slate-300 text-base leading-relaxed font-light">
                ¿Alguna vez te quedaste en blanco en una reunión crucial? Sueltas muletillas (<em className="text-amber-400">«ehhh...», «bueno...»</em>) que fulminan tu autoridad en segundos. No importa cuánto sepas: si titubeas ante una pregunta difícil, tu entorno percibe incompetencia.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span><strong>Protocolo 3 Segundos:</strong> Pausa de estatus.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span><strong>3 Estructuras Mentales:</strong> Sin rodeos.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span><strong>Recetario 25 Casos:</strong> Neutraliza ataques.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span><strong>Biohackeo del Estrés:</strong> Cero bloqueo mental.</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Link
                  href="/protocolo-de-respuestas-inteligentes"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-widest text-center transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Ver Landing del Libro y Adquirir</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
                <Link
                  href="/productos"
                  className="text-xs text-slate-400 hover:text-white transition-colors text-center sm:text-left font-bold uppercase tracking-wider"
                >
                  Ver en catálogo general →
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* PRODUCT 2: CURSO SIN MIEDO A HABLAR */}
        <div className="p-10 md:p-14 rounded-[2.5rem] bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-neutral-950 border border-white/10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
                <span className="material-symbols-outlined text-[16px]">school</span>
                Curso Grabado de 21 Días
              </div>

              <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                Sin Miedo a Hablar: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
                  Recupera tu voz y hazla sonar
                </span>
              </h3>

              <p className="text-slate-300 text-base leading-relaxed font-light">
                Explora herramientas de respiración para desactivar los nervios desde el origen y practica cómo proyectar una voz firme y natural ante cualquier público.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span>Trabaja el miedo escénico desde su raíz</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span>Técnicas de respiración diafragmática</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span>Proyección y presencia auténtica</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span>Acceso de por vida desde cualquier dispositivo</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full max-w-sm bg-neutral-950/90 border border-amber-500/30 rounded-3xl p-7 text-center shadow-2xl backdrop-blur-xl relative">
                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">
                  Modalidad Única
                </p>
                <div className="text-amber-400 font-black text-xs uppercase tracking-widest mb-3">
                  PAGO AL CONTADO
                </div>

                <div className="mb-5">
                  <span className="text-4xl sm:text-5xl font-black text-white">29 USD</span>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Pago único al contado &bull; Sin cuotas</p>
                </div>

                <Link
                  href="/sin_miedo_a_hablar"
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 mb-3"
                >
                  <span>Ver Curso Sin Miedo</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>

                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400">verified_user</span>
                  Garantía de 7 días · Hotmart
                </p>
              </div>
            </div>

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
              Visita el canal <strong className="text-white">@victormartinezpro</strong> para encontrar consejos prácticos, análisis de discursos y técnicas gratuitas.
            </p>
            
            <a 
              href="https://www.youtube.com/@victormartinezpro"
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
            Empieza con una evaluación breve y decide qué habilidad quieres practicar primero.
          </p>
          <Link 
            href="/onboarding" 
            className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3"
          >
            Comenzar diagnóstico gratuito
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-6">
            Sin costo ni tarjeta. Se requiere iniciar sesión con Google para guardar tu resultado.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-12 px-6 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm tracking-tight">VÍCTOR MARTÍNEZ PRO</span>
            <span>&copy; {new Date().getFullYear()} Todos los derechos reservados.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/productos" className="hover:text-white transition-colors">
              Productos
            </Link>
            <Link href="/protocolo-de-respuestas-inteligentes" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
              Libro Protocolo de Respuestas
            </Link>
            <Link href="/sin_miedo_a_hablar" className="hover:text-white transition-colors">
              Curso Sin Miedo a Hablar (29 USD)
            </Link>
            <Link href="/onboarding" className="hover:text-white transition-colors">
              Diagnóstico Vocal
            </Link>
            <a href="https://www.youtube.com/@victormartinezpro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
