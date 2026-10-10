"use client";

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05070A] text-slate-200 font-sans flex flex-col items-center selection:bg-amber-500/30 overflow-x-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <header className="w-full p-6 md:px-20 py-8 z-50 flex items-center justify-between border-b border-white/5 bg-[#05070A]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-black tracking-tighter text-xl uppercase block">
            Oratoria <span className="text-amber-400">Efectiva</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-6 items-center text-sm font-semibold uppercase tracking-wider text-slate-400">
          <Link href="/voz_efectiva" className="hover:text-white transition-colors">Diagnóstico Gratuito</Link>
          <a href="#planes" className="hover:text-white transition-colors">Planes</a>
          <a href="https://www.youtube.com/@oratoria_efectiva" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-xl">play_circle</span>
            YouTube
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 max-w-4xl mx-auto mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          TUS IDEAS VALEN, PERO TU VOZ LAS ESTÁ FRENANDO
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight mb-6">
          Descubre qué limita tu forma de hablar <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-500">(y corrígelo con IA)</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 font-medium mb-12 leading-relaxed max-w-2xl mx-auto">
          No es magia, es entrenamiento. Graba 15 segundos, descubre tu principal debilidad y supera el miedo escénico con desafíos personalizados guiados por Inteligencia Artificial.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            href="/voz_efectiva" 
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 border border-green-400/50 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_0_40px_rgba(16,185,129,0.5)] animate-[pulse_2s_ease-in-out_infinite]"
          >
            <span className="material-symbols-outlined text-2xl animate-bounce">mic</span>
            Descubrí tu potencial vocal
          </Link>
        </div>
      </section>

      {/* The System */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">Un sistema de entrenamiento <br/> basado en resultados</h2>
          <p className="text-slate-400">Desde tu primer diagnóstico hasta conversaciones que cierran ventas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
              <span className="material-symbols-outlined text-2xl">troubleshoot</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">1. Diagnóstico Inicial</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Graba 15 segundos. Recibe tus resultados y descubre qué hábito está saboteando tu comunicación hoy mismo.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
              <span className="material-symbols-outlined text-2xl">fitness_center</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">2. Desafíos Diarios</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              No hacemos ejercicios genéricos. La IA selecciona 3 retos específicos de 2 minutos para corregir tu debilidad principal.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
              <span className="material-symbols-outlined text-2xl">trending_up</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">3. Progreso Medible</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Vuelve a grabar al final de tu rutina. Observa el "antes y después" de tu velocidad, pausas e impacto con datos reales.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planes" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-4">Elige tu Plan de Entrenamiento</h2>
          <p className="text-slate-400 text-lg">Practica tu voz para situaciones que realmente importan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* GRATIS */}
          <div className="p-8 rounded-3xl bg-[#090C10] border border-white/10 flex flex-col relative">
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Gratis</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Descubrí tu potencial vocal</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">US$0</span>
              <span className="text-slate-500 text-sm ml-2">una vez</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                1 diagnóstico vocal inicial con IA.
              </li>
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                3 desafíos personalizados durante 3 días.
              </li>
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                1 evaluación final para comparar resultados.
              </li>
            </ul>
            <p className="text-[10px] text-slate-500 mb-6 font-mono leading-relaxed">
              Límite: 2 análisis completos de IA por cuenta. Repetir un ejercicio guiado no consume otro análisis.
            </p>
            <Link href="/voz_efectiva" className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-center text-sm font-bold uppercase tracking-wider text-white">
              Empezar Gratis
            </Link>
          </div>

          {/* ESENCIAL */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111827] to-[#090C10] border border-amber-500/50 flex flex-col relative shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)] md:-mt-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full">
              Recomendado
            </div>
            <h3 className="text-2xl font-black text-amber-400 mb-2 uppercase tracking-wide">Esencial</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Construí una rutina de entrenamiento</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">US$4,99</span>
              <span className="text-slate-500 text-sm ml-2">por mes</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-amber-400 text-lg">check_circle</span>
                30 análisis completos de IA al mes.
              </li>
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-amber-400 text-lg">check_circle</span>
                Ejercicios recomendados según las debilidades.
              </li>
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-amber-400 text-lg">check_circle</span>
                Historial de sesiones y comparación.
              </li>
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-amber-400 text-lg">check_circle</span>
                Rutina para trabajar una prioridad vocal.
              </li>
            </ul>
            <p className="text-[10px] text-slate-500 mb-6 font-mono leading-relaxed">
              Precio anual sugerido: US$49,99. Cancelación en cualquier momento.
            </p>
            <button className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors text-center text-sm font-black uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Próximamente
            </button>
          </div>

          {/* PRO */}
          <div className="p-8 rounded-3xl bg-[#090C10] border border-white/10 flex flex-col relative">
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Pro</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Para quienes usan su voz profesionalmente</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">US$9,99</span>
              <span className="text-slate-500 text-sm ml-2">por mes</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-white text-lg">check_circle</span>
                100 análisis completos de IA al mes.
              </li>
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-white text-lg">check_circle</span>
                Seguimiento de varias prioridades.
              </li>
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-white text-lg">check_circle</span>
                Comparaciones periódicas de progreso.
              </li>
              <li className="flex gap-3 text-sm text-slate-300">
                <span className="material-symbols-outlined text-white text-lg">check_circle</span>
                Desafíos orientados a situaciones profesionales (ventas, atención, etc).
              </li>
            </ul>
            <p className="text-[10px] text-slate-500 mb-6 font-mono leading-relaxed">
              Precio anual sugerido: US$99,99. Cancelación en cualquier momento.
            </p>
            <button className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-center text-sm font-bold uppercase tracking-wider text-white opacity-50 cursor-not-allowed">
              En desarrollo
            </button>
          </div>

        </div>
      </section>

    </main>
  );
}
