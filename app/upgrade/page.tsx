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
    
    // 🔗 Checkout URLs para los nuevos planes
    // IMPORTANTE: Reemplazar [VARIANT_ID] con los IDs reales de Lemon Squeezy
    const checkoutUrls: Record<string, string> = {
      STARTER: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/ec9352e2-5007-45c4-a68c-01743188b21e", // Starter Mensual ($12)
      PREMIUM: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/bb848dae-ad86-486a-b7ba-7c93d42021e8", // Premium Mensual ($29)
    };

    let url = checkoutUrls[planName];

    if (url && !url.startsWith("#")) {
      const user = session?.user as any;
      if (user?.id) {
        const separator = url.includes("?") ? "&" : "?";
        // Pasamos user_id para que el webhook sepa a quién asignar el plan
        url = `${url}${separator}checkout[custom][user_id]=${user.id}`;
      }
      window.location.href = url;
    } else {
      console.error(`Plan ${planName} no configurado correctamente.`);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#0A0F14] text-white p-6 pb-24 font-display">
      <div className="max-w-6xl mx-auto space-y-12 py-12">
        
        {/* Header Ejecutivo */}
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            Niveles de Acceso
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">
            Eleva tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Capacidad de Mando</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            No vendemos "clases de oratoria". Vendemos la certeza de que tu voz no te traicionará en momentos críticos.
          </p>
        </div>

        {/* Value Ladder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* 1. PLAN FREE */}
          <div className="bg-[#111] border border-gray-800 rounded-[32px] p-8 flex flex-col h-full relative overflow-hidden backdrop-blur-sm opacity-80">
             <div className="space-y-1 mb-6">
                <h3 className="text-lg font-black text-slate-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-slate-600">biometrics</span>
                  FREE
                </h3>
                <div className="pt-2">
                   <span className="text-4xl font-black text-white">$0</span>
                </div>
             </div>
             <p className="text-sm text-gray-500 mb-8 font-medium">
               Para auditoría inicial y calibración de hardware vocal.
             </p>
              <ul className="space-y-4 mb-10 flex-1 text-[13px] font-medium text-slate-400">
                <li className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-slate-700 text-sm">check</span>
                   1 Auditoría IA (Deep Audit)
                </li>
                <li className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-slate-700 text-sm">check</span>
                   30 Días de Protocolo de Mando
                </li>
                <li className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-slate-700 text-sm">check</span>
                   Arsenal de Tácticas Completo
                </li>
                <li className="flex items-center gap-3 text-emerald-500/80">
                   <span className="material-symbols-outlined text-sm">check</span>
                   Bio-Calibración Ilimitada
                </li>
             </ul>
             <Link href="/listen" className="w-full py-4 rounded-2xl border border-white/5 bg-white/5 text-slate-400 text-center font-black transition-all text-[10px] uppercase tracking-[0.2em]">
                Plan Actual
             </Link>
          </div>

          {/* 2. PLAN STARTER */}
          <div className="bg-[#0D131A] border-2 border-blue-600 rounded-[32px] p-8 flex flex-col h-full relative overflow-hidden group shadow-[0_0_50px_-10px_rgba(37,99,235,0.3)] transform hover:scale-[1.02] transition-all duration-500">
             <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
             <div className="absolute top-6 right-8 bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                RECOMENDADO
             </div>
             
             <div className="space-y-1 mb-6 mt-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-blue-500">bolt</span>
                  STARTER
                </h3>
                <div className="pt-2">
                   <span className="text-4xl font-black text-white">$12</span>
                   <span className="text-slate-500 text-[10px] ml-1 uppercase font-black">/ Mes</span>
                </div>
             </div>
             <p className="text-sm text-slate-300 mb-8 font-medium italic leading-relaxed">
               "Diseñado para crear el hábito de dominancia y eliminar el miedo escénico."
             </p>
             <ul className="space-y-4 mb-10 flex-1 text-[13px] font-bold text-white">
                 <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-500 text-lg">verified</span>
                    100 Auditorías IA / mes
                 </li>
                <li className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-blue-500 text-lg">verified</span>
                   21 Días de Protocolo Elite
                </li>
                <li className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-blue-500 text-lg">verified</span>
                   Arsenal de Recursos Completo
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("STARTER")}
                className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black transition-all text-[11px] uppercase tracking-[0.25em] shadow-[0_10px_20px_rgba(37,99,235,0.3)] active:scale-95"
             >
                Activar Licencia
             </button>
          </div>

          {/* 3. PLAN PREMIUM */}
          <div className="bg-gradient-to-b from-[#111] to-black border border-amber-500/30 rounded-[32px] p-8 flex flex-col h-full relative overflow-hidden group hover:border-amber-500/60 transition-all duration-500 shadow-2xl">
             <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600"></div>
             
             <div className="space-y-1 mb-6 mt-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-amber-500">military_tech</span>
                  PREMIUM
                </h3>
                <div className="pt-2">
                   <span className="text-4xl font-black text-white">$29</span>
                   <span className="text-slate-500 text-[10px] ml-1 uppercase font-black">/ Mes</span>
                </div>
             </div>
             <p className="text-sm text-slate-400 mb-8 font-medium leading-relaxed">
               Para ejecutivos de alto impacto que necesitan control total en cada negociación.
             </p>
             <ul className="space-y-4 mb-10 flex-1 text-[13px] font-bold text-slate-200">
                 <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-500 text-lg">grade</span>
                    Auditorías IA Ilimitadas
                 </li>
                <li className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-amber-500 text-lg">videocam</span>
                   Análisis Espectral Elite
                </li>
                <li className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-amber-500 text-lg">verified</span>
                   Protocolo 30 Días de Mando
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("PREMIUM")}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-white font-black transition-all text-[11px] uppercase tracking-[0.25em] shadow-[0_10px_20px_rgba(217,119,6,0.2)] active:scale-95 border border-white/5"
             >
                Obtener Pase Elite
             </button>
          </div>
        </div>

        <div className="mt-12 text-center text-[10px] text-gray-600 max-w-2xl mx-auto leading-relaxed border-t border-gray-800 pt-8">
          <p>
            GARANTÍA DE BIO-CALIBRACIÓN: Si tras 14 días de uso diario no sientes una reducción notable en tu ansiedad comunicativa, te devolvemos el 100% de tu inversión. Sin preguntas.
          </p>
        </div>
      </div>
    </main>
  );
}
