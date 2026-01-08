"use client";

import Link from "next/link";
import { useEffect } from "react";
import { logEvent } from "@/lib/events/logEvent";

import { useSession } from "next-auth/react";

/**
 * Upgrade Page - MVP
 *
 * Aparece cuando el usuario Free agota su análisis.
 * Simple, claro, sin distracciones.
 */
export default function UpgradePage() {
  const { data: session } = useSession();
  
  useEffect(() => {
    logEvent("upgrade_page_viewed");
  }, []);

  const handlePlanSelect = (planName: string) => {
    logEvent("upgrade_plan_selected", { plan: planName });
    
    // Mapeo de URLs de Lemon Squeezy (Modo Test / Live)
    // IMPORTANT: Ensure these Product IDs match your Lemon Squeezy Dashboard
    const checkoutUrls: Record<string, string> = {
      STARTER: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/d5f9fc04-259c-4e38-a10e-9a5c6626013a",
      PREMIUM: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/c7518e21-7638-44e7-a49b-79bbcdd0e9c6",
      VOICE_WEEKLY: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/ec9352e2-5007-45c4-a68c-01743188b21e?embed=1", // Voz Semanal - Live Link
      VOICE_MONTHLY: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/bb848dae-ad86-486a-b7ba-7c93d42021e8?embed=1", // Voz Pro Monthly - Live Link
      COACHING: "#" 
    };

    let url = checkoutUrls[planName];

    if (url && !url.startsWith("#")) {
      // Append User ID for Webhook tracking
      const user = session?.user as any;
      if (user?.id) {
        const separator = url.includes("?") ? "&" : "?";
        url = `${url}${separator}checkout[custom][user_id]=${user.id}`;
      }
      window.location.href = url;
    } else {
      // Fallback temporal para demos
      alert(`Redirigiendo a pago de plan ${planName}... (Integración Pendiente: falta URL en código)`);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-slate-950 text-white p-6 pb-24 font-display">
      <div className="max-w-6xl mx-auto space-y-12 py-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Escala tu <span className="text-blue-500">Autoridad</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
            Elige el nivel de transformación que necesitas hoy.
          </p>
        </div>

        {/* Value Ladder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. VOZ SEMANAL (Entry Level) */}
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden group hover:border-blue-400 transition-all shadow-lg hover:translate-y-[-4px]">
             <div className="space-y-1 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-xl">mic</span>
                  Voz Semanal
                </h3>
                <div className="pt-2">
                   <span className="text-3xl font-black">$4</span>
                   <span className="text-slate-500 text-[10px] ml-1 uppercase font-bold">/ semana</span>
                </div>
             </div>
             <ul className="space-y-3 mb-6 flex-1 text-[13px]">
                <li className="flex items-center gap-2 text-slate-300">
                   <span className="material-symbols-outlined text-blue-400 text-sm">verified</span>
                   50 Análisis / semana
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                   <span className="material-symbols-outlined text-blue-400 text-sm">verified</span>
                   Historial Completo
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("VOICE_WEEKLY")}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-[11px] uppercase tracking-widest"
             >
                Empezar
             </button>
          </div>

          {/* 2. VOZ MENSUAL (Best Value Voice) */}
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden group hover:border-emerald-400 transition-all shadow-lg hover:translate-y-[-4px]">
             <div className="absolute top-0 right-0 bg-emerald-500/20 px-2 py-0.5 rounded-bl-lg text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                Ahorra +20%
             </div>
             <div className="space-y-1 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-xl">record_voice_over</span>
                  Voz Pro
                </h3>
                <div className="pt-2">
                   <span className="text-3xl font-black">$12</span>
                   <span className="text-slate-500 text-[10px] ml-1 uppercase font-bold">/ mes</span>
                </div>
             </div>
             <ul className="space-y-3 mb-6 flex-1 text-[13px]">
                <li className="flex items-center gap-2 text-slate-300">
                   <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
                   100 Análisis / mes
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                   <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
                   Historial Ilimitado
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                   <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
                   Prioridad
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("VOICE_MONTHLY")}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-[11px] uppercase tracking-widest"
             >
                Elegir Mensual
             </button>
          </div>

          {/* 3. PRO SEMANAL (Voice + Video) */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden group hover:border-indigo-500/30 transition-all">
             <div className="space-y-1 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-500 text-xl">bolt</span>
                  Pro Semanal
                </h3>
                <div className="pt-2">
                   <span className="text-3xl font-black">$9</span>
                   <span className="text-slate-500 text-[10px] ml-1 uppercase font-bold">/ semana</span>
                </div>
             </div>
             <ul className="space-y-3 mb-6 flex-1 text-[13px]">
                <li className="flex items-center gap-2 text-slate-300">
                   <span className="material-symbols-outlined text-indigo-500 text-sm">verified</span>
                   Video + Voz
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                   <span className="material-symbols-outlined text-indigo-500 text-sm">check</span>
                   70 Análisis / semana
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                   <span className="material-symbols-outlined text-indigo-500 text-sm">check</span>
                   Feedback Visual
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("STARTER")}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all text-[11px] uppercase tracking-widest"
             >
                Empezar Pro
             </button>
          </div>

          {/* 4. PREMIUM ELITE (Core) */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden shadow-2xl shadow-blue-500/20 z-10 border border-white/10 group">
             <div className="absolute top-0 right-0 bg-white/20 px-2 py-0.5 rounded-bl-lg text-[9px] font-black text-white uppercase tracking-widest">
                Más Completo
             </div>
             <div className="space-y-1 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-white text-xl">stars</span>
                  Elite
                </h3>
                <div className="pt-2 text-white">
                   <span className="text-3xl font-black">$29</span>
                   <span className="text-blue-200 text-[10px] ml-1 uppercase font-bold">/ mes</span>
                </div>
             </div>
             <ul className="space-y-3 mb-6 flex-1 text-[13px]">
                <li className="flex items-center gap-2 text-white">
                   <span className="material-symbols-outlined text-white text-sm">verified</span>
                   250 Análisis / mes
                </li>
                <li className="flex items-center gap-2 text-blue-100">
                   <span className="material-symbols-outlined text-white text-sm">verified</span>
                   Postura y Gestos
                </li>
                <li className="flex items-center gap-2 text-blue-100">
                   <span className="material-symbols-outlined text-white text-sm">verified</span>
                   Coach IA 24/7
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("PREMIUM")}
                className="w-full py-3 rounded-xl bg-white text-blue-600 font-bold transition-all shadow-xl uppercase tracking-widest text-[11px] hover:bg-blue-50"
             >
                Acceso Total
             </button>
          </div>

        </div>

        {/* Bottom CTA for Free users */}
        <div className="text-center pt-8">
           <Link href="/listen" className="text-slate-500 hover:text-white transition-colors text-sm underline">
              Seguir en modo gratuito (limitado)
           </Link>
        </div>

        <div className="mt-12 text-center text-[10px] text-slate-500 max-w-lg mx-auto leading-relaxed">
          <p>
            * El índice de autoridad se calcula algorítmicamente y no sustituye el consejo profesional. 
          </p>
          <p className="mt-2">
            ** Política de Devolución: El Pase Semanal es un producto digital de consumo inmediato. 
            Al adquirirlo, renuncias al derecho de desistimiento una vez que hayas realizado tu primer análisis con créditos de pago.
            <br/>Las suscripciones mensuales (Voz Pro) tienen garantía de satisfacción de 7 días.
          </p>
        </div>
      </div>
    </main>
  );
}
