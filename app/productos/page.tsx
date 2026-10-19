import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos y Entrenamiento | Oratoria Efectiva",
  description:
    "Descubre los manuales, cursos y herramientas de entrenamiento vocal y oratoria estratégica de Oratoria Efectiva.",
};

export default function ProductosPage() {
  return (
    <main className="min-h-screen bg-[#020408] text-slate-100 font-sans selection:bg-amber-500/30 overflow-x-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[5%] left-[20%] -translate-x-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[200px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 relative z-20">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-black tracking-tight text-2xl uppercase text-white">
            ORATORIA<span className="text-amber-500">EFECTIVA</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <Link href="/onboarding" className="px-4 py-2 rounded-full border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all">
            Diagnóstico Gratis
          </Link>
        </div>
      </header>

      {/* Hero Header of Catalog */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-16 pb-12 text-center space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
          <span className="material-symbols-outlined text-[16px]">menu_book</span>
          Ecosistema de Formación & Manuales
        </span>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
          Productos de <span className="text-amber-500">Oratoria Estratégica</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Herramientas tácticas, cursos intensivos y manuales de implementación inmediata diseñados para profesionales que necesitan comunicar con estatus, claridad y autoridad.
        </p>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 sm:space-y-12">
        
        {/* PRODUCT 1: Protocolo de Respuestas Inteligentes (FEATURED FLAGSHIP BOOK) */}
        <div className="p-5 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-neutral-950 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            
            {/* Left Cover Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(245,158,11,0.25)] border border-amber-500/30 group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/libro-protocolo-respuestas-inteligentes.jpg"
                  alt="Libro Protocolo de Respuestas Inteligentes"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  Nuevo Libro
                </div>
              </div>
            </div>

            {/* Right Information */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">shield</span>
                Manual Táctico de Intervención Inmediata
              </div>

              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white leading-tight">
                Protocolo de Respuestas Inteligentes
              </h2>

              <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider">
                Los secretos de las personas que siempre saben qué responder bajo presión
              </p>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                ¿Alguna vez te quedaste en blanco en una reunión crucial? Este no es un libro teórico con consejos abstractos. Es tu escudo definitivo contra la improvisación: aprende el <strong>«Protocolo de los 3 Segundos»</strong>, las <strong>3 Estructuras Mentales</strong> y un recetario letal de <strong>25 situaciones reales</strong> para responder con frialdad y autoridad quirúrgica.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span>Hackea la respuesta biológica al estrés.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span>Elimina muletillas y gana estatus con la pausa.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span>Admite desconocimiento sin perder prestigio.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
                  <span>Neutraliza preguntas trampa y ataques sutiles.</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Link
                  href="/protocolo-de-respuestas-inteligentes"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-widest text-center transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Ver Landing del Libro y Adquirir</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
                <span className="text-xs text-slate-400 text-center sm:text-left">
                  Edición Digital en PDF de alta resolución &bull; Entrega Inmediata
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* PRODUCT 2: Curso Sin Miedo a Hablar */}
        <div className="p-5 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] bg-slate-900/40 border border-white/10 hover:border-amber-500/30 transition-all shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/course-mockup.jpg"
                  alt="Curso Sin Miedo a Hablar"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-neutral-900/90 text-amber-400 border border-amber-500/40 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  Curso Grabado
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Curso Online de 21 Días
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                Sin Miedo a Hablar: Recupera tu voz y hazla sonar
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                Aprende a desactivar el miedo escénico desde la raíz biológica, utiliza la respiración diafragmática como ancla de serenidad y proyecta una voz firme y auténtica ante cualquier audiencia.
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">29 USD</span>
                <span className="text-xs text-slate-400">Pago único &bull; Acceso de por vida</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/sin_miedo_a_hablar"
                  className="inline-flex items-center justify-center min-h-[48px] w-full sm:w-auto gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest transition-all"
                >
                  <span>Conocer el Curso Sin Miedo</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* PRODUCT 3: Diagnóstico Vocal Gratuito & VocalGym */}
        <div className="p-5 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] bg-slate-900/20 border border-white/5 hover:border-white/15 transition-all shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Herramienta Inteligente Gratuita
              </span>
              <h2 className="text-2xl font-black uppercase text-white">
                Diagnóstico Vocal con Inteligencia Artificial
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Mide tu velocidad en palabras por minuto, consistencia de pausas y nivel de autoridad vocal mediante un test interactivo guiado por la metodología de Víctor Martínez.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-6 py-4 rounded-xl border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-black text-xs uppercase tracking-widest text-center transition-all"
              >
                Hacer Diagnóstico Gratis
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-12 px-6 bg-slate-950 text-slate-500 text-xs mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm tracking-tight">ORATORIA EFECTIVA</span>
            <span>&copy; {new Date().getFullYear()} Oratoria Efectiva. Todos los derechos reservados.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/protocolo-de-respuestas-inteligentes" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
              Libro Protocolo
            </Link>
            <Link href="/sin_miedo_a_hablar" className="hover:text-white transition-colors">Curso Sin Miedo</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
