"use client";

import Link from "next/link";
import { useEffect } from "react";
import { logEvent } from "@/lib/events/logEvent";
import { useSession } from "next-auth/react";

export default function UpgradePage() {
  const { data: session } = useSession();
  
  useEffect(() => {
    logEvent("upgrade_page_viewed");
  }, []);

  const handlePlanSelect = (planName: string) => {
    logEvent("upgrade_plan_selected", { plan: planName });
    const checkoutUrls: Record<string, string> = {
      STARTER: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/ec9352e2-5007-45c4-a68c-01743188b21e", 
      PREMIUM: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/bb848dae-ad86-486a-b7ba-7c93d42021e8", 
    };

    let url = checkoutUrls[planName];
    if (url && !url.startsWith("#")) {
      const user = session?.user as any;
      if (user?.id) {
        const separator = url.includes("?") ? "&" : "?";
        url = `${url}${separator}checkout[custom][user_id]=${user.id}`;
      }
      window.location.href = url;
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#050505] text-white font-display pb-32 selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* 🌌 Background FX */}
      <div className="fixed inset-0 z-0">
          <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full" />
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-amber-900/5 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        
        {/* 1. HERO SECTION (EL IMPACTO) */}
        <div className="text-center space-y-6 mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-md">
             <span className="size-2 rounded-full bg-amber-500 animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">Informe de Inteligencia</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[1.2] md:leading-[0.9]">
            Tu mente es <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">C-Suite.</span><br/>
            Tu voz es <span className="text-slate-600 line-through decoration-amber-500 decoration-4">Junior.</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            <strong className="text-white">ORATORIA EFECTIVA</strong> es el primer laboratorio de entrenamiento vocal que utiliza telemetría para mejorar tu autoridad.
          </p>
          
          <div className="pt-4">
             <Link href="/sos/diagnostico" className="bg-white/10 hover:bg-white/20 border border-white/5 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all">
                Ver mi Diagnóstico Forense
             </Link>
          </div>
        </div>


        {/* 2. LA TABLA DE INVERSIÓN (COMPARATIVA) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto mb-24 items-stretch">
          
           {/* PLAN STARTER (4 columnas) */}
           <div className="md:col-span-5 bg-[#0c1219] border border-blue-900/30 rounded-[32px] p-8 flex flex-col relative opacity-80 hover:opacity-100 transition-opacity">
               <div className="mb-6 border-b border-white/5 pb-6">
                   <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Entrenamiento Base</h3>
                   <div className="flex items-baseline gap-1">
                       <span className="text-4xl font-black text-white">$12</span>
                       <span className="text-[10px] text-slate-500 font-bold uppercase">/mes</span>
                   </div>
                   <p className="text-[11px] text-blue-200/60 mt-3 font-medium">
                       Para evitar la atrofia. Entorno controlado.
                   </p>
               </div>
               
               <ul className="space-y-4 mb-8 flex-1">
                    <FeatureRow label="Biblioteca de Ejercicios" value="300+ (Estándar)" highlight={false} />
                    <FeatureRow label="Análisis de Audio" value="Solo App (Laboratorio)" highlight={false} />
                    <FeatureRow label="Métricas" value="Ritmo, dB, Claridad" highlight={false} />
                    <FeatureRow label="IA Coach" value="Guía Pasiva" highlight={false} />
               </ul>

               <button 
                  onClick={() => handlePlanSelect("STARTER")}
                  className="w-full py-4 rounded-xl bg-blue-900/10 hover:bg-blue-800/30 text-blue-400 border border-blue-500/20 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
               >
                  Seleccionar Starter
               </button>
           </div>

           {/* PLAN ELITE (7 columnas - Destacado) */}
           <div className="md:col-span-7 bg-[#050505] border border-amber-500/50 rounded-[32px] p-8 flex flex-col relative shadow-[0_0_60px_-15px_rgba(245,158,11,0.2)] z-10 overflow-hidden transform md:scale-[1.02]">
                {/* Scan Animation */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600 z-20"></div>
                <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-[0.03] pointer-events-none mix-blend-overlay animate-scan"></div>

               <div className="mb-6 border-b border-white/10 pb-6 relative z-10">
                   <div className="flex justify-between items-start mb-2">
                       <h3 className="text-sm font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
                           <span className="material-symbols-outlined text-base">verified_user</span>
                           Dominio Estratégico
                       </h3>
                       <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-[9px] font-black text-amber-500 uppercase tracking-widest animate-pulse">
                           Recomendado
                       </span>
                   </div>
                   <div className="flex flex-col">
                      <div className="flex items-baseline gap-1">
                         <span className="text-5xl font-black text-white">$29</span>
                         <span className="text-[10px] text-slate-500 font-bold uppercase">/mes</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-wider mt-1">
                          Inversión: $0.96 / día
                      </span>
                   </div>
                   <p className="text-xs text-slate-300 mt-3 font-medium">
                       Reingeniería de Impacto. Corrección de errores en telemetría real.
                   </p>
               </div>
               
               <ul className="space-y-5 mb-10 flex-1 relative z-10">
                    <FeatureRow label="Biblioteca de Ejercicios" value="360+ (Incluye Black Ops)" highlight={true} icon="lock_open" />
                    <FeatureRow label="Análisis de Reuniones" value="Zoom / Teams / Grabaciones Reales" highlight={true} icon="upload_file" />
                    <FeatureRow label="Biometría Forense" value="Jitter, Shimmer, Ataque Glótico" highlight={true} icon="query_stats" />
                    <FeatureRow label="Director Médico IA" value="Prescripción Quirúrgica Diaria" highlight={true} icon="medical_services" />
                    <FeatureRow label="Reportes" value="Ejecutivos PDF Mensuales" highlight={true} icon="description" />
               </ul>

               <button 
                  onClick={() => handlePlanSelect("PREMIUM")}
                  className="relative z-10 w-full py-5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-black text-[12px] uppercase tracking-[0.25em] shadow-[0_10px_30px_rgba(245,158,11,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
               >
                  <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">lock_open</span>
                  Cambiar mi Voz
               </button>
           </div>
        </div>


        {/* 3. DIFERENCIACIÓN: ¿POR QUÉ ELITE? */}
        <div className="mb-24 py-12 border-y border-slate-900">
             <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                 <div className="flex-1 space-y-4">
                     <h2 className="text-2xl font-black text-white uppercase italic leading-normal md:leading-none">
                         La diferencia entre <span className="text-slate-500">ser escuchado</span> y <span className="text-amber-500">Ser Seguido.</span>
                     </h2>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium">
                         El plan Starter te da las pesas; el plan Elite te da al <strong className="text-white">entrenador experto</strong>. 
                         <br/><br/>
                         Mientras el mundo entrena oratoria básica, tú haces corrección técnica. Con el Plan Elite, puedes subir la grabación de esa junta donde sentiste "ruido", y la IA te dirá exactamente dónde falló tu voz.
                     </p>
                 </div>
                 {/* Testimonio Táctico */}
                 <div className="flex-1 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 italic relative">
                     <span className="absolute -top-3 -left-3 text-4xl text-slate-700 font-serif">"</span>
                     <p className="text-sm text-slate-300 mb-4 relative z-10">
                         Pasé de ser el experto técnico al que nadie miraba, a liderar la mesa de decisiones. Mi Puntuación de Voz subió de 45 a 92 en 3 semanas. <strong className="text-amber-500">Los datos no mienten.</strong>
                     </p>
                     <div className="flex items-center gap-3 not-italic">
                         <div className="size-8 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">DO</div>
                         <div>
                             <p className="text-[10px] font-black text-white uppercase">Director de Operaciones</p>
                             <p className="text-[9px] text-slate-500 uppercase">Consultora Tech Global</p>
                         </div>
                     </div>
                 </div>
             </div>
        </div>


        {/* 4. FAQ QUIRÚRGICO */}
        <div className="max-w-3xl mx-auto space-y-8 mb-24">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] text-center mb-8">
                Despeje de Incógnitas
            </h3>
            
            <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                   <span className="material-symbols-outlined text-amber-500 text-sm">shield</span>
                   ¿Es seguro subir mis reuniones confidenciales?
                </h4>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                   Encriptación de grado militar. Tu voz es tu dato más privado; nosotros solo analizamos la telemetría biométrica (ondas), no indexamos el contenido semántico sensible.
                </p>
            </div>

            <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                   <span className="material-symbols-outlined text-amber-500 text-sm">schedule</span>
                   No tengo tiempo. ¿Cuánto requiere?
                </h4>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                   Diseñado para agendas C-Suite. Protocolos de 5 a 7 minutos. No son clases largas, son intervenciones quirúrgicas.
                </p>
            </div>
        </div>


        {/* 5. CIERRE VISCERAL */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white uppercase italic leading-none">
                Mañana tienes otra reunión.
            </h3>
            <p className="text-sm text-slate-400 font-medium">
                Puedes entrar con la misma voz de siempre, o puedes entrar con una <strong className="text-white">Voz Segura</strong>. Tú decides.
            </p>
            <div className="pt-4">
                <button 
                  onClick={() => handlePlanSelect("PREMIUM")}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-[0.2em] transition-all"
                >
                   Activar Protocolo Elite ($29)
                </button>
            </div>
        </div>

      </div>
    </main>
  );
}

function FeatureRow({ label, value, highlight, icon }: { label: string, value: string, highlight: boolean, icon?: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-2 rounded -mx-2 transition-colors">
            <span className={`text-[11px] font-bold bg-clip-text uppercase ${highlight ? 'text-slate-200' : 'text-slate-500'}`}>
                {label}
            </span>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium text-right ${highlight ? 'text-amber-100 font-bold' : 'text-slate-400'}`}>
                    {value}
                </span>
                {icon && <span className="material-symbols-outlined text-amber-500 text-sm">{icon}</span>}
            </div>
        </div>
    )
}
