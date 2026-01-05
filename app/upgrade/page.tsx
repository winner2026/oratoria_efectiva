"use client";

import Link from "next/link";
import { useEffect } from "react";
import { logEvent } from "@/lib/events/logEvent";

/**
 * Upgrade Page - MVP
 *
 * Aparece cuando el usuario Free agota su análisis.
 * Simple, claro, sin distracciones.
 */
export default function UpgradePage() {
  useEffect(() => {
    logEvent("upgrade_page_viewed");
  }, []);

  const handlePlanSelect = (planName: string) => {
    logEvent("upgrade_plan_selected", { plan: planName });
    // Aquí iría la redirección a Checkout (Stripe/PayPal)
    alert(`Redirigiendo a pago de plan ${planName}... (MVP)`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-12 py-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Escala tu <span className="text-blue-500">Autoridad</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Elige el nivel de transformación que necesitas hoy.
          </p>
        </div>

        {/* Value Ladder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. STARTER (Tripwire) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col h-full relative overflow-hidden group hover:border-blue-500/50 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">bolt</span>
             </div>
             <div className="space-y-2 mb-8">
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <p className="text-slate-400 text-sm">El impulso inicial.</p>
                <div className="pt-4">
                   <span className="text-4xl font-black">$9</span>
                   <span className="text-slate-500 text-sm ml-2">pago único</span>
                </div>
             </div>
             <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                   <span className="material-symbols-outlined text-blue-500 text-lg">check_circle</span>
                   Sprint de 7 Días
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                   <span className="material-symbols-outlined text-blue-500 text-lg">check_circle</span>
                   10 Análisis de Voz/Postura
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                   <span className="material-symbols-outlined text-blue-500 text-lg">check_circle</span>
                   Guía de Calentamiento
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("STARTER")}
                className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
             >
                Empezar Sprint
             </button>
          </div>

          {/* 2. PREMIUM (Core Offer) */}
          <div className="bg-blue-600 rounded-3xl p-8 flex flex-col h-full relative overflow-hidden shadow-2xl shadow-blue-500/20 transform md:scale-105 z-10 border border-blue-400/30">
             <div className="absolute top-0 right-0 bg-white/20 px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-widest">
                Más Popular
             </div>
             <div className="space-y-2 mb-8">
                <h3 className="text-xl font-bold text-white">Premium</h3>
                <p className="text-blue-100 text-sm">Domina la escena.</p>
                <div className="pt-4 text-white">
                   <span className="text-4xl font-black">$29</span>
                   <span className="text-blue-200 text-sm ml-2">/ mes</span>
                </div>
             </div>
             <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-white">
                   <span className="material-symbols-outlined text-white text-lg">verified</span>
                   Análisis Ilimitados IA
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                   <span className="material-symbols-outlined text-white text-lg">verified</span>
                   Ruta del Héroe Completa
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                   <span className="material-symbols-outlined text-white text-lg">verified</span>
                   Coach IA Personalizado
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                   <span className="material-symbols-outlined text-white text-lg">verified</span>
                   Historial sin límites
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("PREMIUM")}
                className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
             >
                Obtener Todo
             </button>
          </div>

          {/* 3. COACHING (High Ticket) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col h-full relative overflow-hidden group hover:border-amber-500/50 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">school</span>
             </div>
             <div className="space-y-2 mb-8">
                <h3 className="text-xl font-bold text-white">Mentoring</h3>
                <p className="text-slate-400 text-sm">Transformación 1-a-1.</p>
                <div className="pt-4">
                   <span className="text-4xl font-black">$499</span>
                   <span className="text-slate-500 text-sm ml-2">Trimestre</span>
                </div>
             </div>
             <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                   <span className="material-symbols-outlined text-amber-500 text-lg">stars</span>
                   Sesiones 1-a-1 en vivo
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                   <span className="material-symbols-outlined text-amber-500 text-lg">stars</span>
                   Revisión de tu contenido
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                   <span className="material-symbols-outlined text-amber-500 text-lg">stars</span>
                   Acceso Directo WhatsApp
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("COACHING")}
                className="w-full py-4 rounded-xl bg-slate-800 hover:bg-amber-600 border border-amber-500/50 text-white font-bold transition-all"
             >
                Reservar Mi Coach
             </button>
          </div>

        </div>

        {/* Bottom CTA for Free users */}
        <div className="text-center pt-8">
           <Link href="/listen" className="text-slate-500 hover:text-white transition-colors text-sm underline">
              Seguir en modo gratuito (limitado)
           </Link>
        </div>

      </div>
    </main>
  );
}
