"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductViewTracker from "@/components/ProductViewTracker";
import CtaButton from "@/components/CtaButton";

export default function ProtocoloRespuestasPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Hotmart checkout link for Protocolo de Respuestas Inteligentes
  const defaultCheckoutUrl = "https://pay.hotmart.com/Q108091621U";

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past hero (approx 450px)
      if (window.scrollY > 450) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Exit Intent: Detect cursor moving to top of window to close tab
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15) {
        const alreadyShown = sessionStorage.getItem("exit_modal_shown");
        if (!alreadyShown) {
          setShowExitModal(true);
          sessionStorage.setItem("exit_modal_shown", "true");
        }
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const situationDemos = [
    {
      category: "Admitir Desconocimiento",
      title: "Cuando te preguntan un dato o métrica que no dominas",
      loserReaction: "«Ehhhh... bueno, la verdad es que... creo que eran unos 40k, pero tendría que revisar... discúlpame, no estoy seguro.»",
      strategicResponse: "«Ese desglose exacto está en la auditoría de cierre. Te doy la cifra consolidada ahora y en 20 minutos tienes el anexo detallado en tu correo. El punto clave aquí es...»",
      takeaway: "No pides perdón ni dudas. Separas la cifra del concepto y asumes el control operativo con una acción precisa."
    },
    {
      category: "Preguntas Capciosas",
      title: "Cuando buscan arrinconarte con una premisa tramposa",
      loserReaction: "«¡No, no es así! Estás malinterpretando todo, nosotros jamás quisimos retrasar la entrega...»",
      strategicResponse: "«Tu pregunta asume que el cambio de cronograma fue un retraso, cuando en realidad fue una reasignación estratégica para proteger el margen. Veamos los datos de retorno...»",
      takeaway: "Desarmas la premisa falsa antes de contestar. Quien define el marco de la pregunta, gana la conversación."
    },
    {
      category: "Frenar Interrupciones",
      title: "Cuando alguien te corta la palabra a mitad de tu idea",
      loserReaction: "(Bajas la voz, te quedas callado con cara de frustración o intentas hablar más rápido compitiendo por volumen).",
      strategicResponse: "«Permíteme redondear este punto clave en 10 segundos para que todos tengamos el panorama completo, y de inmediato abrimos tu propuesta.»",
      takeaway: "Pones un límite temporal explícito (10 segundos) con tono calmado y mirada firme. Tu autoridad se multiplica."
    },
    {
      category: "Ataques Personales Sutiles",
      title: "Cuando cuestionan tu experiencia o juventud ante el grupo",
      loserReaction: "«Llevo años capacitándome, no entiendo por qué dudas de mi trabajo...» (Tono defensivo que delata inseguridad).",
      strategicResponse: "«Más allá de los años en el cargo, lo que está sobre la mesa son los resultados auditados del último trimestre. Concentrémonos en resolver la desviación del proyecto.»",
      takeaway: "Desvías el ataque personal hacia el problema objetivo con frialdad ejecutiva. Neutralizas el golpe en seco."
    }
  ];

  const faqs = [
    {
      q: "¿Es un libro digital (Ebook) o físico?",
      a: "Es un manual táctico digital en formato PDF de alta resolución optimizado para lectura rápida en móvil, tablet y computadora. Recibes acceso inmediato tras la compra para que puedas consultarlo antes de tu próxima reunión."
    },
    {
      q: "¿Qué diferencia hay entre este libro y los libros tradicionales de oratoria?",
      a: "La inmensa mayoría de libros de oratoria te dan consejos motivacionales abstractos («sé auténtico», «ten confianza») o técnicas para conferencias ante 500 personas. Este es un manual quirúrgico para juntas de 5 personas, reuniones de directorio, entrevistas y negociaciones donde te hacen preguntas agresivas bajo presión."
    },
    {
      q: "¿Cuánto tiempo toma implementarlo?",
      a: "El «Protocolo de los 3 Segundos» y las «3 Estructuras Mentales» se aprenden en menos de 30 minutos y los puedes aplicar literalmente hoy mismo en tu siguiente llamada o junta de trabajo."
    },
    {
      q: "¿Me servirá si suelo ponerme muy nervioso y mi mente se queda en blanco?",
      a: "Exactamente para eso fue creado. El libro explica el hackeo biológico del estrés: por qué tu cuerpo desactiva la corteza prefrontal bajo presión y cómo revertirlo con micropausas tácticas y lenguaje corporal sin que nadie note tu tensión."
    },
    {
      q: "¿Qué garantía tengo?",
      a: "Cuentas con 7 días de garantía incondicional respaldada por la plataforma de pagos. Si lees el libro y consideras que no transformó tu capacidad de respuesta bajo presión, solicitas el reembolso total con un solo clic."
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden relative">
      <ProductViewTracker itemId="protocolo-de-respuestas-inteligentes" itemName="Protocolo de Respuestas Inteligentes" price={9.99} category="Libro Digital" />
      {/* Background ambient lighting - strictly Red, Gold & Obsidian Black */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-red-600/20 via-amber-600/15 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[35%] right-0 w-[550px] h-[550px] bg-red-900/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[65%] left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Top Notification Bar */}
      <div className="w-full bg-gradient-to-r from-black via-red-950/80 to-black border-b border-amber-500/30 py-2 sm:py-2.5 px-3 sm:px-4 text-center">
        <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide text-amber-200 flex items-center justify-center gap-1.5 sm:gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span>MANUAL TÁCTICO: Para profesionales que no pueden permitirse dudar en público</span>
        </p>
      </div>

      {/* Navbar (Zero Leaks: foco exclusivo en la compra) */}
      <nav className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-white/10 relative z-20">
        <div className="flex items-center gap-2 select-none">
          <span className="font-black tracking-tight text-lg sm:text-xl text-white">
            ORATORIA<span className="text-amber-400">EFECTIVA</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-red-600/20 border border-red-500/30 text-red-300">
            Libro
          </span>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <CtaButton
            href={defaultCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            location="navbar"
            productId="protocolo-de-respuestas-inteligentes"
            productName="Protocolo de Respuestas Inteligentes"
            price={9.99}
            category="Libro Digital"
            className="px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:scale-105 min-h-[40px] flex items-center justify-center"
          >
            Adquirir Libro
          </CtaButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Column: Painful Hook & Value Proposition */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-widest">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              El fin de la improvisación y los bloqueos mentales
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.12] sm:leading-[1.08]">
              ¿Te quedas en blanco <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400">
                ante una pregunta difícil?
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-200 font-light leading-relaxed">
              Tu mente se acelera, el pulso se dispara y sueltas un <span className="text-amber-400 font-semibold">«ehhh... bueno...»</span> que destruye tu estatus en segundos. No importa cuánto sepas: <strong>si titubeas bajo presión, tu entorno percibe incompetencia.</strong>
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-black/80 border-l-4 border-amber-500 border-white/10 space-y-2 shadow-xl">
              <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                El Escudo Definitivo Para Pensar Rápido y Responder Con Autoridad
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                El <strong>Protocolo de Respuestas Inteligentes</strong> es un manual táctico de intervención inmediata. Cero teoría motivacional. Puros sistemas ejecutivos para desarmar preguntas capciosas, frenar interrupciones y hablar con frialdad de cirujano.
              </p>
            </div>

            {/* Quick Benefits Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">verified</span>
                <span className="text-xs sm:text-sm text-slate-200"><strong>Protocolo de los 3 Segundos:</strong> Gana tiempo proyectando estatus.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">verified</span>
                <span className="text-xs sm:text-sm text-slate-200"><strong>3 Estructuras Mentales:</strong> Respuestas sin una sola gota de relleno.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">verified</span>
                <span className="text-xs sm:text-sm text-slate-200"><strong>Recetario de 25 Escenarios:</strong> Neutraliza ataques y trampas.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">verified</span>
                <span className="text-xs sm:text-sm text-slate-200"><strong>Biohackeo del Estrés:</strong> Desactiva el pánico en tiempo real.</span>
              </div>
            </div>

            {/* Primary CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <CtaButton
                href={defaultCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                location="hero"
                productId="protocolo-de-respuestas-inteligentes"
                productName="Protocolo de Respuestas Inteligentes"
                price={9.99}
                category="Libro Digital"
                className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 min-h-[48px] rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs sm:text-sm uppercase tracking-widest text-center transition-all shadow-[0_0_35px_rgba(245,158,11,0.45)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                <span>Obtener Mi Copia Ahora</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </CtaButton>
              <a
                href="#recetario"
                className="w-full sm:w-auto px-5 sm:px-6 py-4 sm:py-5 min-h-[48px] rounded-2xl bg-red-600/15 border border-red-500/30 hover:bg-red-600/25 text-white font-bold text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
              >
                <span>Ver los 25 Casos</span>
                <span className="material-symbols-outlined text-sm">visibility</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
              <span className="material-symbols-outlined text-amber-400 text-sm">lock</span>
              Descarga digital inmediata &bull; Acceso de por vida &bull; Garantía 7 días
            </p>
          </div>

          {/* Right Column: 3D Hardcover Book Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full">
            <div className="relative group max-w-[340px] sm:max-w-[420px] w-full flex flex-col items-center">
              {/* Ambient Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/30 via-amber-500/25 to-yellow-400/20 rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              {/* Badge */}
              <div className="relative z-20 mb-3 px-3.5 py-1.5 rounded-full bg-black/90 border border-amber-500/50 shadow-lg text-[11px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-red-500">menu_book</span>
                Manual Táctico Digital + Video Masterclass
              </div>

              {/* 3D Realistic Book Image */}
              <div className="relative z-10 w-full flex justify-center">
                <img
                  src="/libro-mockup-3d.png"
                  alt="Libro 3D Protocolo de Respuestas Inteligentes - Víctor Martínez"
                  className="w-full h-auto max-h-[520px] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)] transform group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Quick Video Trigger / Masterclass Link */}
              <div className="relative z-20 mt-3 text-center">
                <a
                  href="#video-masterclass"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-black/80 hover:bg-black border border-white/10 hover:border-amber-500/50 px-4 py-2 rounded-xl transition-all shadow-md group/btn"
                >
                  <span className="material-symbols-outlined text-red-500 text-base group-hover/btn:scale-110 transition-transform">play_circle</span>
                  <span>Ver Clase Táctica en Video con Víctor Martínez ↓</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: VIDEO MASTERCLASS THEATER */}
      <section id="video-masterclass" className="relative z-10 w-full max-w-4xl mx-auto px-6 -mt-2 sm:-mt-6 mb-16">
        <div className="p-6 sm:p-8 rounded-3xl bg-black/90 border-2 border-amber-500/40 shadow-[0_0_60px_rgba(220,38,38,0.25)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                Clase Maestra en Video
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-2">
                Mira el Protocolo en Acción con Víctor Martínez
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Cómo responder preguntas incómodas o agresivas sin titubear ni ceder estatus.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold shrink-0 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Demostración en vivo</span>
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-red-600/30 bg-black">
            <iframe
              src="https://www.youtube.com/embed/WcFRCvUOYmw?si=_-87cuO2tzqYi81M"
              title="Mi protocolo para responder preguntas incómodas al instante - Víctor Martínez"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* SECTION: EL DOLOR MÁS PROFUNDO DEL AVATAR (Rodrigo / Mariana) */}
      <section className="relative z-10 w-full bg-black border-y border-white/10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-14 space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
              La Brecha Entre Saber y Comunicar
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              ¿Por qué gente menos competente <br />
              <span className="text-amber-500">gana las oportunidades que mereces tú?</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              La escena se repite en cientos de salas de reuniones cada día:
            </p>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 text-slate-300 leading-relaxed font-light text-base sm:text-lg">
            <p>
              Has preparado el informe. Llevas semanas resolviendo problemas técnicos, números y detalles operativos. Eres la persona que mejor entiende la realidad del proyecto.
            </p>
            
            <p>
              Pero en el minuto 42 de la junta, el director general o el cliente más exigente clava la mirada en ti y dispara una pregunta imprevista:
            </p>

            <div className="bg-black/60 border-l-4 border-red-500 p-4 sm:p-5 rounded-r-2xl italic text-red-200 text-base">
              «¿Por qué los números de conversión no están dando el margen proyectado para el trimestre?»
            </div>

            <p>
              En ese microsegundo, tu amígdala cerebral secuestra tu racionalidad. El cortisol inunda tu sistema nervioso. Sientes el calor subir por el cuello. Tu mente se acelera buscando una respuesta perfecta... <strong>y te quedas en blanco</strong>.
            </p>

            <p>
              Por puro instinto de supervivencia, empiezas a hablar antes de pensar:
              <br />
              <em className="text-amber-300">«Ehhh... bueno... lo que pasa es que... o sea... el equipo estuvo viendo que...»</em>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                <span className="text-red-400 font-bold text-xs uppercase tracking-wider block mb-1">Lo que tú sentías por dentro:</span>
                <p className="text-xs sm:text-sm text-slate-300">«Sé la respuesta, solo necesito 5 segundos para ordenar los factores en mi cabeza.»</p>
              </div>
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30">
                <span className="text-red-400 font-bold text-xs uppercase tracking-wider block mb-1">Lo que la mesa percibió:</span>
                <p className="text-xs sm:text-sm text-white font-medium">«No domina sus cifras. Está improvisando. Carece de madera de líder.»</p>
              </div>
            </div>

            <p className="text-white font-medium">
              Esa es la amarga verdad: <strong>en el mundo profesional, la percepción de competencia no depende de cuánto sabes, sino de cómo respondes cuando estás bajo presión.</strong>
            </p>
          </div>

          <div className="mt-12 text-center">
            <CtaButton
              href={defaultCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              location="mid_page"
              productId="protocolo-de-respuestas-inteligentes"
              productName="Protocolo de Respuestas Inteligentes"
              price={9.99}
              category="Libro Digital"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-105"
            >
              <span>Rompe Este Ciclo Hoy Mismo</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </CtaButton>
          </div>

        </div>
      </section>

      {/* SECTION: QUÉ ES EL PROTOCOLO (NO ES TEORÍA) */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Un Arsenal Quirúrgico
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Este no es otro libro <br />
            <span className="text-amber-500">de autoayuda o palabrería</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Olvídate de consejos como «ten confianza en ti mismo» o «imagina al público en ropa interior». Eso no te sirve cuando un cliente agresivo te acorrala con una objeción financiera.
          </p>
        </div>

        {/* Visual Showcase: 2D Book Cover - Anatomía de la Presión */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 bg-gradient-to-br from-black via-red-950/20 to-black p-6 sm:p-10 rounded-3xl border-2 border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.9)]">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-[280px] sm:max-w-[320px]">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-600/40 via-amber-500/30 to-yellow-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <img
                src="/libro-portada-2d.png"
                alt="Portada oficial del libro Protocolo de Respuestas Inteligentes"
                className="relative z-10 w-full h-auto rounded-xl shadow-2xl border-2 border-amber-500/30 group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
              Anatomía de la Presión Real
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
              Los Secretos de Quienes Siempre Saben Qué Responder Bajo Presión
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              La portada del manual ilustra con exactitud el momento crítico: cuando un comité, un cliente o un colega agresivo apunta directamente hacia ti esperando verte titubear o perder los estribos.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Frente a esa hostilidad, la reacción impulsiva o el silencio incómodo te destruyen. El <strong>Protocolo de Respuestas Inteligentes</strong> te equipa con los reflejos verbales y la templanza táctica para desarmar el ataque con precisión quirúrgica.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">menu_book</span>
                Manual de Consulta Rápida
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">shield</span>
                Escudo Verbal Anti-Ataques
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-amber-500/20 hover:border-amber-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">timer</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">
                1. El Protocolo de los 3 Segundos
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Cómo hackear tu respuesta biológica al estrés. Aprenderás a usar la pausa estratégica, el anclaje respiratorio y el lenguaje corporal para ganar tiempo proyectando estatus deliberado, haciendo que el silencio juegue a tu favor y nunca en tu contra.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              Dominio del Tiempo &bull; Cero Muletillas
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-amber-500/20 hover:border-amber-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">account_tree</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">
                2. Las 3 Estructuras Mentales
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Tres plantillas cognitivas infalibles para organizar cualquier idea en tiempo real. Responde de manera ejecutiva: Titular contundente, Evidencia tangible y Cierre de acción. Sin rodeos, sin titubeos y sin una sola gota de relleno.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              Arquitectura Mental &bull; Claridad Total
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-amber-500/20 hover:border-amber-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">menu_book</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">
                3. Recetario Letal de 25 Casos
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                25 situaciones reales de fuego cruzado con el contraste exacto: la «reacción perdedora» (lo que hace el 95%) frente a la «respuesta estratégica» (lo que hace el líder con autoridad). Sabrás exactamente qué palabras usar en cada situación.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              Guiones Quirúrgicos &bull; Aplicación Inmediata
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: INTERACTIVE DEMO RECETARIO 25 SITUACIONES */}
      <section id="recetario" className="relative z-10 w-full bg-slate-950 border-y border-white/5 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12 space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Muestra Exclusiva del Manual
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              El Contraste Que Define Carreras: <br />
              <span className="text-amber-500">Reacción Perdedora vs. Respuesta Estratégica</span>
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              Haz clic en cada situación para ver cómo el Protocolo desarma el problema en segundos:
            </p>
          </div>

          {/* Situation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center mb-8 px-1 py-1 -mx-2 sm:mx-0">
            {situationDemos.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 min-h-[44px] flex items-center justify-center ${
                  activeTab === index
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105"
                    : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.category}
              </button>
            ))}
          </div>

          {/* Active Card Comparison */}
          <div className="bg-black/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400" />
            
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              {situationDemos[activeTab].title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Loser Reaction */}
              <div className="p-5 sm:p-6 rounded-2xl bg-red-950/25 border-2 border-red-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-widest mb-3">
                    <span className="material-symbols-outlined text-base">cancel</span>
                    Reacción Común (Pierdes Autoridad)
                  </div>
                  <p className="text-sm sm:text-base text-red-200/95 italic font-mono leading-relaxed">
                    {situationDemos[activeTab].loserReaction}
                  </p>
                </div>
                <p className="mt-4 text-xs text-red-400 font-medium">
                  → Proyecta inseguridad, titubeo y necesidad de aprobación.
                </p>
              </div>

              {/* Strategic Response */}
              <div className="p-5 sm:p-6 rounded-2xl bg-amber-950/20 border-2 border-amber-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-widest mb-3">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Respuesta del Protocolo (Ganas Estatus)
                  </div>
                  <p className="text-sm sm:text-base text-amber-100 font-mono leading-relaxed font-semibold">
                    {situationDemos[activeTab].strategicResponse}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-500/30 text-xs text-amber-300 font-medium">
                  <strong>Por qué funciona:</strong> {situationDemos[activeTab].takeaway}
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <span>Este es solo 1 de los 25 escenarios analizados a nivel micro-quirúrgico en el manual.</span>
              <a href="#comprar" className="text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                Ver los 25 escenarios completos →
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: AUTHOR / CREDIBILITY */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center bg-black/80 border-2 border-amber-500/30 shadow-[0_0_60px_rgba(220,38,38,0.2)] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
              <img
                src="/victor-martinez.png"
                alt="Profesor Víctor Martínez"
                className="w-full h-full object-cover object-[center_20%]"
                loading="lazy"
              />
            </div>
            <p className="mt-4 font-black text-white text-base text-center">Víctor Martínez</p>
            <p className="text-xs text-amber-400 font-medium uppercase tracking-wider text-center">
              Docente en Lengua & Comunicación
            </p>
          </div>

          <div className="md:col-span-8 space-y-4 text-slate-200 font-light leading-relaxed">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Acerca del Autor
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Más de 20 años entrenando la palabra hablada en el mundo real.
            </h3>
            <p className="text-sm sm:text-base">
              Docente uruguayo de Educación Secundaria y Educación Técnico Profesional, con más de dos décadas formando a profesionales, líderes y emprendedores en comunicación, retórica y oratoria práctica.
            </p>
            <p className="text-sm sm:text-base">
              Fundador del canal de YouTube <strong className="text-white">@oratoria_efectiva</strong> (con cientos de miles de visualizaciones y una comunidad activa en México, Uruguay, España y Latinoamérica), Víctor ha dedicado su vida a desarmar el mito de que «la oratoria es un don natural».
            </p>
            <div className="p-4 rounded-xl bg-white/[0.03] border-l-2 border-amber-400 text-xs sm:text-sm text-slate-300 italic">
              «La autoridad no se improvisa con suerte ni carisma fingido. Se entrena mediante estructuras cognitivas y pausas deliberadas. Cuando tienes un método probado, el miedo a la pregunta difícil simplemente desaparece.»
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: PARA QUIÉN ES Y PARA QUIÉN NO ES */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SÍ ES PARA TI */}
          <div className="p-8 rounded-3xl bg-black/80 border-2 border-amber-500/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-amber-400 font-black text-sm uppercase tracking-wider">
              <span className="material-symbols-outlined">check_circle</span>
              Este manual es exactamente para ti si:
            </div>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Eres profesional de empresa, líder o consultor y necesitas defender propuestas ante jefes o clientes exigentes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Sientes que tu mente se acelera o sueltas muletillas cuando te hacen preguntas inesperadas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Quieres admitir que no tienes un dato sin sonar débil ni perder el respeto de tus colegas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Quieres un manual táctico y conciso que puedas leer en una tarde y aplicar al día siguiente.</span>
              </li>
            </ul>
          </div>

          {/* NO ES PARA TI */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-red-500/20 space-y-4">
            <div className="flex items-center gap-3 text-red-400 font-black text-sm uppercase tracking-wider">
              <span className="material-symbols-outlined">block</span>
              Este manual NO es para ti si:
            </div>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✗</span>
                <span>Buscas un tratado teórico y académico de lingüística con 500 páginas de bibliografía.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✗</span>
                <span>Esperas fórmulas mágicas sin estar dispuesto a aplicar el protocolo de los 3 segundos en tus reuniones.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✗</span>
                <span>Quieres aprender a declamar poesías o fingir una personalidad que no es la tuya.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* SECTION: CHECKOUT / OFERTA */}
      <section id="comprar" className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20">
        <div className="rounded-[2.5rem] bg-gradient-to-b from-black via-red-950/30 to-black border-2 border-amber-500/40 p-8 sm:p-14 text-center shadow-[0_0_80px_rgba(220,38,38,0.2)] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-[16px] text-amber-400">bolt</span>
            Edición Táctica Digital &bull; Acceso Instantáneo
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Convierte Tu Voz En Tu Activo <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400">
              Más Rentable e Irrebatible
            </span>
          </h2>

          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-light">
            Deja de rezar para que no te hagan la pregunta difícil. Ten a mano el manual con las 3 estructuras mentales y el recetario exacto de las 25 situaciones reales.
          </p>

          {/* Book Mockup Preview in Checkout Box: 3D Hardcover + 2D Cover */}
          <div className="mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="w-40 sm:w-48 aspect-[3/4] relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.3)] border-2 border-amber-500/50 bg-black flex items-center justify-center p-2 group">
              <img
                src="/libro-mockup-3d.png"
                alt="Edición 3D de Protocolo de Respuestas Inteligentes"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="w-36 sm:w-40 aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500/40 bg-black hidden sm:flex items-center justify-center group">
              <img
                src="/libro-portada-2d.png"
                alt="Portada Oficial de Protocolo de Respuestas Inteligentes"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Price display */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 line-through text-lg sm:text-xl font-bold">$27 USD</span>
              <span className="text-4xl sm:text-6xl font-black text-amber-400 tracking-tight">$9,99</span>
              <span className="text-base sm:text-lg text-white font-bold">USD</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              Acceso Instantáneo
            </span>
          </div>

          {/* Offer inclusions */}
          <div className="max-w-md mx-auto text-left space-y-3 mb-8 bg-black/60 border border-white/10 p-5 rounded-2xl">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
              <span><strong>Manual Táctico Completo:</strong> Protocolo de Respuestas Inteligentes (PDF de alta resolución).</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
              <span><strong>El Protocolo de los 3 Segundos:</strong> Guía de biohackeo del estrés y pausas de autoridad.</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
              <span><strong>Las 3 Estructuras Mentales:</strong> Plantillas ejecutivas listas para usar.</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
              <span><strong>Recetario Quirúrgico:</strong> 25 Contrastes Reales (Pierdes vs Ganas).</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <span className="material-symbols-outlined text-amber-400 text-base">check_circle</span>
              <span>Actualizaciones gratuitas de por vida en la versión digital.</span>
            </div>
          </div>

          {/* CTA Link to Checkout */}
          <CtaButton
            href={defaultCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            location="pricing"
            productId="protocolo-de-respuestas-inteligentes"
            productName="Protocolo de Respuestas Inteligentes"
            price={9.99}
            category="Libro Digital"
            className="inline-flex items-center justify-center gap-3 w-full max-w-md py-5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-base uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95"
          >
            <span>Quiero Mi Copia Ahora</span>
            <span className="material-symbols-outlined text-xl">shopping_cart</span>
          </CtaButton>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-400 text-sm">verified_user</span>
              Garantía de 7 días 100% segura
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-red-400 text-sm">devices</span>
              Apto para móvil, PC y Kindle
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-400 text-sm">schedule</span>
              Acceso inmediato tras el pago
            </span>
          </div>

        </div>
      </section>

      {/* SECTION: FAQ ACCORDION */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3">
            Preguntas Frecuentes
          </h2>
          <p className="text-slate-400 text-sm">
            Respuestas claras para que tomes la mejor decisión profesional.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-2xl bg-slate-900/50 overflow-hidden transition-colors hover:border-amber-500/30"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 text-left font-bold text-white flex items-center justify-between gap-4 text-sm sm:text-base focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-amber-400 shrink-0 transition-transform duration-300">
                  {openFaq === index ? "expand_less" : "expand_more"}
                </span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER (Zero Leaks: 100% Compliant con políticas de Google Ads) */}
      <footer className="w-full border-t border-white/5 py-10 px-6 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm tracking-tight">ORATORIA EFECTIVA</span>
            <span>&copy; {new Date().getFullYear()} Oratoria Efectiva. Todos los derechos reservados.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 text-slate-400 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Garantía de 7 Días Incondicional
            </span>
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <span className="material-symbols-outlined text-sm">lock</span>
              Pago 100% Seguro vía Hotmart
            </span>
            <span className="text-slate-500">Soporte: contacto@oratoriaefectiva.in</span>
          </div>
        </div>
      </footer>

      {/* STICKY BOTTOM CTA (Visible tras pasar el Hero para móvil y escritorio) */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-slate-950/95 border-t border-amber-500/30 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg flex items-center justify-between gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] animate-fade-in max-w-6xl md:left-1/2 md:-translate-x-1/2 md:rounded-t-2xl">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-12 relative shrink-0 rounded overflow-hidden border border-white/20">
              <img
                src="/libro-portada-2d.png"
                alt="Miniatura libro"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="leading-tight truncate">
              <p className="text-[12px] sm:text-sm font-black text-white truncate">Protocolo de Respuestas Inteligentes</p>
              <p className="text-[10px] sm:text-xs text-amber-400 font-bold">Manual Táctico Digital — Solo $9,99 USD</p>
            </div>
          </div>
          <CtaButton
            href={defaultCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            location="checkout"
            productId="protocolo-de-respuestas-inteligentes"
            productName="Protocolo de Respuestas Inteligentes"
            price={9.99}
            category="Libro Digital"
            className="px-5 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)] min-h-[44px] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            Adquirir Ahora
          </CtaButton>
        </div>
      )}

      {/* EXIT-INTENT POPUP (100% Legal y Compliant con Google Ads - Atrapa abandonos) */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-neutral-900 to-black border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.3)] text-center">
            {/* Close button */}
            <button
              onClick={() => setShowExitModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-red-600/20 text-red-400 border border-red-500/30 mb-3">
              ¡Espera un momento!
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
              No dejes que tu próxima reunión te agarre desprevenido
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              Una sola respuesta titubeante ante tu jefe o cliente puede costarte respeto profesional. Llévate el manual táctico hoy mismo con acceso instantáneo.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left space-y-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Descarga inmediata en PDF (30 min de lectura)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Garantía total de 7 días:</strong> si no te sirve, te devolvemos el 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Pago único de solo <strong>$9,99 USD</strong> (acceso de por vida)</span>
              </div>
            </div>

            <CtaButton
              href={defaultCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              location="checkout"
              productId="protocolo-de-respuestas-inteligentes"
              productName="Protocolo de Respuestas Inteligentes"
              price={9.99}
              category="Libro Digital"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.02] flex items-center justify-center gap-2 mb-3"
            >
              <span>SÍ, QUIERO EL PROTOCOLO ($9,99 USD)</span>
            </CtaButton>

            <button
              onClick={() => setShowExitModal(false)}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline transition-colors"
            >
              No gracias, prefiero improvisar en mi próxima reunión
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
