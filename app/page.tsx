"use client";

import React, { useState } from 'react';
import CtaButton from '@/components/CtaButton';

export default function HomePage() {
  const checkoutUrl = 'https://pay.hotmart.com/F99862019P?off=dlcepqmr&hotfeature=51';
  const [activeTab, setActiveTab] = useState(0);

  const useCases = [
    {
      role: "Ejecutivos & Líderes",
      icon: "⚡",
      title: "Oratoria de Alto Impacto",
      points: [
        "Lidera reuniones de alta dirección con presencia y templanza",
        "Elimina muletillas y titubeos bajo presión en tiempo real",
        "Proyecta una voz profunda con resonancia y tono de mando"
      ]
    },
    {
      role: "Emprendedores",
      icon: "🔥",
      title: "Pitch & Persuasión",
      points: [
        "Estructura propuestas de valor irresistibles para inversores",
        "Domina la entonación para transmitir convicción instantánea",
        "Cierra ventas estratégicas manteniendo el control escénico"
      ]
    },
    {
      role: "Profesionales",
      icon: "🎯",
      title: "Control de Miedo Escénico",
      points: [
        "Desactiva la respuesta de ansiedad antes de subir al escenario",
        "Usa la respiración diafragmática como ancla de seguridad",
        "Transforma los nervios en energía vocal magnética"
      ]
    },
    {
      role: "Speakers & Creadores",
      icon: "✨",
      title: "Voz & Proyección Vocal",
      points: [
        "Amplifica la modulación para cautivar audiencias multitudinarias",
        "Crea pausas estratégicas de alto impacto dramático",
        "Habla durante horas sin fatiga vocal ni carraspeo"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#090810] text-slate-200 font-sans selection:bg-brand-orange/30 overflow-x-hidden n8n-grid-bg relative">
      
      {/* Background Ambient Glow Lights */}
      <div className="n8n-glow-spot w-[600px] h-[600px] bg-brand-purple/20 top-[-150px] left-1/2 -translate-x-1/2 animate-glow-pulse" />
      <div className="n8n-glow-spot w-[450px] h-[450px] bg-brand-orange/15 top-[200px] right-[-100px] animate-glow-pulse" />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#090810]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-brand-purple p-[1px] flex items-center justify-center shadow-lg shadow-brand-orange/20">
              <div className="w-full h-full bg-[#0B0A13] rounded-[11px] flex items-center justify-center text-brand-orange font-black text-lg">
                🎤
              </div>
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              ORATORIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-purple">EFECTIVA</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#metodo" className="hover:text-white transition-colors">El Método</a>
            <a href="#casos" className="hover:text-white transition-colors">Para Quién Es</a>
            <a href="#creador" className="hover:text-white transition-colors">El Instructor</a>
            <a href="#faq" className="hover:text-white transition-colors">Preguntas</a>
          </div>

          <CtaButton
            href={checkoutUrl}
            className="n8n-btn-primary text-xs md:text-sm py-2.5 px-5"
            location="hero"
          >
            Acceder Ahora
          </CtaButton>
        </div>
      </header>

      {/* HERO SECTION (n8n Style) */}
      <section className="relative pt-16 md:pt-24 pb-20 px-6 max-w-6xl mx-auto text-center z-10">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs md:text-sm font-medium mb-8 backdrop-blur-md">
          <span className="text-brand-orange font-bold">⚡ ORATORIA DE ALTO IMPACTO</span>
          <span className="w-1 h-1 rounded-full bg-white/40"></span>
          <span className="text-slate-400">Transformación Vocal Profesional</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-8 leading-[1.1] max-w-5xl mx-auto">
          Dominio escénico y voz de autoridad{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-amber to-brand-purple">
            sin miedo a hablar
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
          Aprende a hablar con identidad, eliminar bloqueos internos y transmitir confianza inamovible en presentaciones, reuniones ejecutivas y discursos públicos.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <CtaButton
            href={checkoutUrl}
            className="n8n-btn-primary w-full sm:w-auto text-lg px-9 py-4 shadow-glow-orange"
            location="hero"
          >
            <span>Obtener Acceso Inmediato</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </CtaButton>

          <a 
            href="#vsl" 
            className="n8n-btn-secondary w-full sm:w-auto text-lg px-8 py-4"
          >
            <span>Ver Demostración</span>
            <svg className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </a>
        </div>

        {/* INTERACTIVE USE-CASE CARDS SHOWCASE (Exact Match to n8n Showcase in Image) */}
        <div className="mt-12 w-full bg-[#12101D]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 sm:p-8 shadow-card-glow text-left">
          
          {/* Tab Selector Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {useCases.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                  activeTab === idx
                    ? 'bg-[#1C1830] border-brand-orange/60 shadow-[0_4px_20px_rgba(255,85,0,0.2)] text-white'
                    : 'bg-[#161325]/50 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {item.role}
                  </span>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="font-bold text-sm md:text-base text-white">
                  {item.title}
                </div>
              </button>
            ))}
          </div>

          {/* Active Tab Showcase Content Box */}
          <div className="bg-[#0D0B16] border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange font-bold text-sm">
                ⚡
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {useCases[activeTab].title} para <span className="text-brand-orange">{useCases[activeTab].role}</span>
                </h3>
                <p className="text-xs text-slate-400">Transformación vocal acelerada basada en psicología vocal</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {useCases[activeTab].points.map((pt, i) => (
                <div key={i} className="bg-[#161325] border border-white/5 rounded-xl p-5 hover:border-white/15 transition-all">
                  <div className="flex items-start gap-3">
                    <span className="text-brand-orange font-bold text-lg">⚡</span>
                    <p className="text-slate-300 text-sm font-medium leading-relaxed">
                      {pt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VSL VIDEO SECTION */}
      <section id="vsl" className="py-16 px-6 relative z-10 max-w-5xl mx-auto text-center">
        <div className="mb-8">
          <span className="n8n-badge n8n-badge-highlight mb-3">CONOCE EL MÉTODO</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2">
            Descubre cómo desactivar el miedo vocal en minutos
          </h2>
        </div>

        <div className="w-full rounded-3xl p-2 bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden bg-[#07060D]">
            <iframe 
              src="https://www.youtube.com/embed/FQxA4yntAEY?si=XZlIadv_fLx5l-Lb" 
              title="Video de presentación" 
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* SOBRE EL CONTENIDO / FEATURES GRID */}
      <section id="metodo" className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="n8n-badge n8n-badge-highlight mb-4">PROGRAMA COMPLETO</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-2 mb-6">
            Lo que aprenderás en Sin Miedo a Hablar
          </h2>
          <p className="text-slate-400 text-lg">
            Un método paso a paso diseñado para transformar la forma en que proyectas tu voz y comunicas tus ideas ante cualquier audiencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="n8n-card p-8 n8n-card-hover">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center text-brand-orange text-2xl mb-6">
              🎙️
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Identidad Vocal Auténtica</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Descubre y libera tu tono de voz natural sin máscaras ni impostaciones forzadas, ganando autoridad inmediata al hablar.
            </p>
          </div>

          <div className="n8n-card p-8 n8n-card-hover">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/15 border border-brand-purple/30 flex items-center justify-center text-brand-purple text-2xl mb-6">
              🧠
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Desactivación del Miedo</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Aprende a neutralizar la respuesta biológica de ansiedad antes y durante tus exposiciones usando anclas respiratorias.
            </p>
          </div>

          <div className="n8n-card p-8 n8n-card-hover">
            <div className="w-12 h-12 rounded-2xl bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center text-brand-amber text-2xl mb-6">
              👑
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Presencia Escénica & Peso</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Estructura discursos que capturen la atención del público desde el primer segundo y dejen una huella imborrable.
            </p>
          </div>
        </div>

        {/* Highlight Quote Box */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-brand-orange/10 via-brand-purple/10 to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-xl font-bold text-white mb-2">
              "Al finalizar, no solo vas a hablar mejor. Vas a hablar con identidad y verdad."
            </h4>
            <p className="text-slate-400 text-sm">
              Garantía de transformación real desde las primeras lecciones prácticas.
            </p>
          </div>
          <CtaButton
            href={checkoutUrl}
            className="n8n-btn-primary shrink-0 whitespace-nowrap"
            location="mid_page"
          >
            Unirme al Curso
          </CtaButton>
        </div>
      </section>

      {/* CONOCE AL CREADOR */}
      <section id="creador" className="py-20 px-6 max-w-4xl mx-auto relative z-10">
        <div className="n8n-card p-8 md:p-12 relative overflow-hidden border border-white/15">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-brand-orange via-brand-amber to-brand-purple shadow-glow-orange">
                <img 
                  src="/profile.png" 
                  alt="Víctor Martínez" 
                  className="w-full h-full rounded-full object-cover bg-[#0D0B16]"
                />
              </div>
            </div>

            <div className="text-center md:text-left space-y-4">
              <span className="n8n-badge n8n-badge-highlight">INSTRUCTOR PRINCIPAL</span>
              <h3 className="text-3xl font-extrabold text-white">Víctor Martínez</h3>
              <p className="text-brand-orange font-semibold text-sm">Especialista en Oratoria & Comunicación de Alto Impacto</p>

              <p className="text-slate-300 text-sm leading-relaxed">
                Fundador de <strong className="text-white">Oratoria Efectiva</strong>. He dedicado años a entrenar a profesionales, emprendedores y ejecutivos para dominar el arte de hablar en público, liberar la fuerza de su voz y comunicarse con máxima convicción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GARANTÍA INCONDICIONAL */}
      <section className="py-16 px-6 max-w-4xl mx-auto relative z-10">
        <div className="n8n-card p-10 text-center bg-gradient-to-b from-[#1C1830] to-[#12101D] border border-brand-orange/30 shadow-glow-orange/20">
          <div className="text-6xl mb-4">🛡️</div>
          <span className="n8n-badge n8n-badge-highlight mb-4">100% SIN RIESGO</span>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Garantía Incondicional de 7 Días
          </h3>
          <p className="text-slate-300 max-w-xl mx-auto text-base leading-relaxed mb-6">
            Prueba el curso durante 7 días completos. Si sientes que no transforma la forma en que comunicas, solicitas la devolución y se te reembolsa el 100% de tu dinero sin preguntas.
          </p>
        </div>
      </section>

      {/* PRICING & CLOSING */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="n8n-card p-10 md:p-14 bg-gradient-to-b from-[#181528] to-[#0D0B16] border border-white/15 relative">
          
          <span className="n8n-badge n8n-badge-highlight mb-6">OFERTA ESPECIAL POR TIEMPO LIMITADO</span>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Acceso Completo a Sin Miedo a Hablar
          </h2>
          <p className="text-slate-400 text-base mb-8">
            Incluye lecciones en alta definición, ejercicios prácticos de modulación y acceso desde cualquier dispositivo.
          </p>

          <div className="mb-8">
            <p className="text-base md:text-lg text-slate-400 font-bold uppercase tracking-wider mb-2">PRECIO REGULAR: <span className="line-through text-slate-500">US$ 297.00</span></p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-brand-orange">US$</span>
              <span className="text-6xl md:text-7xl font-black text-white tracking-tight">170.00</span>
            </div>
            <p className="text-xs text-emerald-400 font-semibold mt-2">Acceso Inmediato e Ilimitado al Programa</p>
          </div>

          {/* Simplified Payment Options Callout */}
          <div className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/10 max-w-xl mx-auto text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center justify-center gap-2 text-center">
              <span>💳</span> Opciones de Pago Globales e Internacionales (Hotmart)
            </p>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-semibold text-white">💳 Tarjetas de Crédito / Débito (hasta 2 tarjetas)</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-semibold text-white">🌐 PayPal</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-semibold text-white">📱 Apple Pay / Google Pay</span>
              </div>

              <div className="pt-2 border-t border-white/5 text-center">
                <p className="text-[11px] font-semibold text-brand-orange mb-1.5">🇦🇷 🇨🇱 🇨🇴 🇲🇽 🇵🇪 🇧🇷 🇪🇸 🇺🇸 Pagos Locales, Cuotas y Efectivo:</p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">OXXO & SPEI (México)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Efecty, PSE, Nequi & Bancolombia (Colombia)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Mercado Pago (México / Argentina)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">PagoEfectivo & Yape (Perú)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Sencillito, MACH & Servipag (Chile)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Pix & Boleto (Brasil)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Multibanco & MB WAY (Portugal)</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Klarna & SEPA (Europa / EE.UU.)</span>
                </div>
              </div>
            </div>
          </div>

          <CtaButton 
            href={checkoutUrl}
            className="n8n-btn-primary text-xl py-5 px-12 shadow-glow-orange w-full sm:w-auto mb-6"
            location="pricing"
          >
            COMPRAR AHORA
          </CtaButton>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">🔒 Pago 100% Seguro</span>
            <span className="flex items-center gap-1.5">⚡ Acceso Inmediato</span>
            <span className="flex items-center gap-1.5">📱 Compatible con Celular y PC</span>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto relative z-10 border-t border-white/10">
        <div className="text-center mb-12">
          <span className="n8n-badge mb-3">DUDAS FRECUENTES</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "¿Para quién es este programa?",
              a: "Para profesionales, ejecutivos, emprendedores y estudiantes que deseen superar el miedo a hablar en público, ganar convicción vocal y liderar conversaciones de alto impacto."
            },
            {
              q: "¿Cómo funciona la garantía de 7 días?",
              a: "Tienes 7 días tras la compra para evaluar el contenido. Si consideras que no cumple con tus expectativas, solicitas el reembolso total con un clic desde Hotmart."
            },
            {
              q: "¿Obtengo certificado de conclusión?",
              a: "Sí. Al completar el 100% del programa, la plataforma genera automáticamente un certificado digital validando tu entrenamiento en Oratoria Efectiva."
            },
            {
              q: "¿Cuándo y cómo recibo mi acceso?",
              a: "Inmediatamente después de realizar tu pago recibirás un correo con las credenciales y el enlace directo a la plataforma de alumnos."
            }
          ].map((item, idx) => (
            <details key={idx} className="group n8n-card border border-white/10 rounded-2xl cursor-pointer overflow-hidden">
              <summary className="font-bold text-base md:text-lg text-white p-6 list-none flex justify-between items-center hover:bg-white/[0.02] transition-colors">
                {item.q}
                <span className="text-brand-orange font-bold text-xl group-open:rotate-180 transition-transform duration-300">
                  ↓
                </span>
              </summary>
              <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#07060D] border-t border-white/10 text-center relative z-10 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">ORATORIA EFECTIVA</span>
            <span>© {new Date().getFullYear()} Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
