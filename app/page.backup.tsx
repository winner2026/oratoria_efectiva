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
          <Link href="/sin_miedo_a_hablar" className="hover:text-white transition-colors">Curso Intensivo</Link>
          <a href="https://www.youtube.com/@oratoria_efectiva" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-xl">play_circle</span>
            YouTube
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 max-w-4xl mx-auto mt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          CANAL DE YOUTUBE OFICIAL
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight mb-6">
          Comunica con <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-500">Autoridad e Impacto</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 font-medium mb-12 leading-relaxed max-w-2xl">
          Nuestra misión es transformar tu voz en tu herramienta más poderosa. 
          Aprende a dominar el miedo escénico, proyectar seguridad y estructurar mensajes 
          que cautiven a cualquier audiencia.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <a 
            href="https://www.youtube.com/@oratoria_efectiva" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20"
          >
            <span className="material-symbols-outlined text-2xl">smart_display</span>
            Visitar Canal
          </a>
          <Link 
            href="/voz_efectiva" 
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-xl">mic</span>
            Prueba tu Voz
          </Link>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-colors">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
            <span className="material-symbols-outlined text-2xl">psychology</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Mindset</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Estrategias psicológicas para hackear el pánico escénico y transformar la ansiedad en energía magnética.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-colors">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
            <span className="material-symbols-outlined text-2xl">record_voice_over</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Técnica Vocal</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Aprende a usar pausas tácticas, proyectar tu voz desde el diafragma y eliminar la monotonía.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-colors">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Carisma</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Lenguaje corporal de liderazgo y estructuras persuasivas para mantener la atención total de tu público.
          </p>
        </div>
      </section>
    </main>
  );
}
