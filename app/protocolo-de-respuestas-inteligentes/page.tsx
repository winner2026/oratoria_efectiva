"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ProtocoloRespuestasPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showStickyCta, setShowStickyCta] = useState(false);

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
    return () => window.removeEventListener("scroll", handleScroll);
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
    <main className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-amber-500/30 overflow-x-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-amber-600/15 via-red-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Top Notification Bar */}
      <div className="w-full bg-gradient-to-r from-neutral-900 via-amber-950/80 to-neutral-900 border-b border-amber-500/20 py-2.5 px-4 text-center">
        <p className="text-xs md:text-sm font-semibold tracking-wide text-amber-200 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>MANUAL TÁCTICO DE ÉLITE: Para profesionales que no pueden permitirse dudar en público</span>
        </p>
      </div>

      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5 relative z-20">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-black tracking-tight text-xl text-white">
            ORATORIA<span className="text-amber-500">EFECTIVA</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-slate-300">
            Libro
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/productos"
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors hidden sm:block"
          >
            Ver catálogo
          </Link>
          <a
            href={defaultCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-md hover:scale-105"
          >
            Adquirir Libro
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-12 md:pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Painful Hook & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              El fin de la improvisación y los bloqueos mentales
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08]">
              ¿Te quedas en blanco <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-orange-400">
                ante una pregunta difícil?
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed">
              Tu mente se acelera, el pulso se dispara y sueltas un <span className="text-amber-400 font-semibold">«ehhh... bueno...»</span> que destruye tu estatus en segundos. No importa cuánto sepas: <strong>si titubeas bajo presión, tu entorno percibe incompetencia.</strong>
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border-l-4 border-amber-500 border-white/5 space-y-2">
              <p className="text-sm font-bold text-white uppercase tracking-wider">
                El Escudo Definitivo Para Pensar Rápido y Responder Con Autoridad
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                El <strong>Protocolo de Respuestas Inteligentes</strong> es un manual táctico de intervención inmediata. Cero teoría motivacional. Puros sistemas ejecutivos para desarmar preguntas capciosas, frenar interrupciones y hablar con frialdad de cirujano.
              </p>
            </div>

            {/* Quick Benefits Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">verified</span>
                <span className="text-xs sm:text-sm text-slate-300"><strong>Protocolo de los 3 Segundos:</strong> Gana tiempo proyectando estatus.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">verified</span>
                <span className="text-xs sm:text-sm text-slate-300"><strong>3 Estructuras Mentales:</strong> Respuestas sin una sola gota de relleno.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">verified</span>
                <span className="text-xs sm:text-sm text-slate-300"><strong>Recetario de 25 Escenarios:</strong> Neutraliza ataques y trampas.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">verified</span>
                <span className="text-xs sm:text-sm text-slate-300"><strong>Biohackeo del Estrés:</strong> Desactiva el pánico en tiempo real.</span>
              </div>
            </div>

            {/* Primary CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <a
                href={defaultCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-widest text-center transition-all shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                <span>Obtener Mi Copia Ahora</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
              <a
                href="#recetario"
                className="px-6 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2"
              >
                <span>Ver los 25 Casos</span>
                <span className="material-symbols-outlined text-sm">visibility</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
              <span className="material-symbols-outlined text-emerald-400 text-sm">lock</span>
              Descarga digital inmediata &bull; Acceso de por vida &bull; Garantía 7 días
            </p>
          </div>

          {/* Right Column: Physical-style Book Mockup Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.2)] border border-amber-500/30 group">
              <img
                src="/libro-protocolo-respuestas-inteligentes.jpg"
                alt="Libro Protocolo de Respuestas Inteligentes por Víctor Martínez"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40 pointer-events-none" />
              
              {/* Badge overlay */}
              <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                Manual Táctico
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs font-semibold text-slate-400">
                Por <strong className="text-white">Víctor Martínez</strong> &bull; Oratoria Efectiva
              </p>
              <p className="text-[11px] text-amber-400/90 font-medium mt-0.5">
                Los secretos de las personas que siempre saben qué responder bajo presión
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: EL DOLOR MÁS PROFUNDO DEL AVATAR (Rodrigo / Mariana) */}
      <section className="relative z-10 w-full bg-slate-950 border-y border-white/5 py-20 px-6">
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
            <a
              href={defaultCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-105"
            >
              <span>Rompe Este Ciclo Hoy Mismo</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
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
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {situationDemos.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
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
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
            
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              {situationDemos[activeTab].title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Loser Reaction */}
              <div className="p-5 sm:p-6 rounded-2xl bg-red-950/20 border border-red-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-widest mb-3">
                    <span className="material-symbols-outlined text-base">cancel</span>
                    Reacción Común (Pierdes Autoridad)
                  </div>
                  <p className="text-sm sm:text-base text-red-200/90 italic font-mono leading-relaxed">
                    {situationDemos[activeTab].loserReaction}
                  </p>
                </div>
                <p className="mt-4 text-xs text-red-400 font-medium">
                  → Proyecta inseguridad, titubeo y necesidad de aprobación.
                </p>
              </div>

              {/* Strategic Response */}
              <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest mb-3">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Respuesta del Protocolo (Ganas Estatus)
                  </div>
                  <p className="text-sm sm:text-base text-emerald-200 font-mono leading-relaxed font-semibold">
                    {situationDemos[activeTab].strategicResponse}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-500/20 text-xs text-emerald-400/90 font-medium">
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center bg-slate-900/40 border border-white/10 rounded-3xl p-8 sm:p-12">
          
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-2xl">
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

          <div className="md:col-span-8 space-y-4 text-slate-300 font-light leading-relaxed">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Acerca del Autor
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Más de 20 años entrenando la palabra hablada en el mundo real.
            </h3>
            <p className="text-sm sm:text-base">
              Docente uruguayo de Educación Secundaria y Educación Técnico Profesional, con más de dos décadas formando a profesionales, líderes y docentes en comunicación, retórica y oratoria práctica.
            </p>
            <p className="text-sm sm:text-base">
              Fundador del canal de YouTube <strong className="text-white">@victormartinezpro</strong> (con cientos de miles de visualizaciones y una comunidad activa en México, Uruguay, España y Latinoamérica), Víctor ha dedicado su vida a desarmar el mito de que «la oratoria es un don natural».
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
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-emerald-500/20 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400 font-black text-sm uppercase tracking-wider">
              <span className="material-symbols-outlined">check_circle</span>
              Este manual es exactamente para ti si:
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Eres profesional de empresa, líder o consultor y necesitas defender propuestas ante jefes o clientes exigentes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Sientes que tu mente se acelera o sueltas muletillas cuando te hacen preguntas inesperadas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Quieres admitir que no tienes un dato sin sonar débil ni perder el respeto de tus colegas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
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
        <div className="rounded-[2.5rem] bg-gradient-to-b from-slate-900 via-neutral-950 to-slate-950 border-2 border-amber-500/40 p-8 sm:p-14 text-center shadow-[0_0_80px_rgba(245,158,11,0.15)] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            Edición Táctica Digital &bull; Acceso Instantáneo
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Convierte Tu Voz En Tu Activo <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">
              Más Rentable e Irrebatible
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-light">
            Deja de rezar para que no te hagan la pregunta difícil. Ten a mano el manual con las 3 estructuras mentales y el recetario exacto de las 25 situaciones reales.
          </p>

          {/* Book Mockup Preview in Checkout Box */}
          <div className="mx-auto w-36 sm:w-44 aspect-[4/5] relative rounded-xl overflow-hidden shadow-2xl border border-white/20 mb-8">
            <img
              src="/libro-protocolo-respuestas-inteligentes.jpg"
              alt="Portada de Protocolo de Respuestas Inteligentes"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Offer inclusions */}
          <div className="max-w-md mx-auto text-left space-y-3 mb-8 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
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
          <a
            href={defaultCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full max-w-md py-5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95"
          >
            <span>Quiero Mi Copia Ahora</span>
            <span className="material-symbols-outlined text-xl">shopping_cart</span>
          </a>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-400 text-sm">verified_user</span>
              Garantía de 7 días 100% segura
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-400 text-sm">devices</span>
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

      {/* FOOTER */}
      <footer className="w-full border-t border-white/5 py-12 px-6 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm tracking-tight">ORATORIA EFECTIVA</span>
            <span>&copy; {new Date().getFullYear()} Víctor Martínez Pro. Todos los derechos reservados.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/productos" className="hover:text-white transition-colors">Productos</Link>
            <Link href="/sin_miedo_a_hablar" className="hover:text-amber-400 transition-colors">Curso Sin Miedo a Hablar</Link>
            <a href="https://www.youtube.com/@victormartinezpro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
          </div>
        </div>
      </footer>

      {/* STICKY BOTTOM CTA FOR MOBILE (90.9% OF USERS ACCORDING TO AUDIENCE REPORT) */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-950/95 border-t border-amber-500/30 p-3 backdrop-blur-lg sm:hidden flex items-center justify-between gap-3 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-11 relative shrink-0 rounded overflow-hidden border border-white/20">
              <img
                src="/libro-protocolo-respuestas-inteligentes.jpg"
                alt="Miniatura libro"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="leading-tight truncate">
              <p className="text-[11px] font-black text-white truncate">Protocolo de Respuestas</p>
              <p className="text-[10px] text-amber-400 font-bold">Manual Táctico Digital</p>
            </div>
          </div>
          <a
            href={defaultCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 shadow-lg"
          >
            Adquirir Ahora
          </a>
        </div>
      )}

    </main>
  );
}
