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
      STARTER: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/d5f9fc04-259c-4e38-a10e-9a5c6626013a", // Pro Semanal
      PREMIUM: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/c7518e21-7638-44e7-a49b-79bbcdd0e9c6", // Elite Mensual
      VOICE_WEEKLY: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/ec9352e2-5007-45c4-a68c-01743188b21e?embed=1", 
      VOICE_MONTHLY: "https://oratoria-efectiva.lemonsqueezy.com/checkout/buy/bb848dae-ad86-486a-b7ba-7c93d42021e8?embed=1", // Voz Pro Mensual
    };

    let url = checkoutUrls[planName];

    if (url && !url.startsWith("#")) {
      const user = session?.user as any;
      if (user?.id) {
        const separator = url.includes("?") ? "&" : "?";
        url = `${url}${separator}checkout[custom][user_id]=${user.id}`;
      }
      window.location.href = url;
    } else {
      alert(`Redirigiendo a pago de plan ${planName}... (Url pendiente)`);
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
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Invierte en tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Activo Más Valioso</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            No vendemos "clases de oratoria". Vendemos la certeza de que tu voz no te traicionará en momentos críticos.
          </p>
        </div>

        {/* Value Ladder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. PLAN GRATIS (Anchor) */}
          <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
             <div className="space-y-1 mb-6">
                <h3 className="text-lg font-bold text-gray-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-500 text-xl">person</span>
                  Acceso Inicial
                </h3>
                <div className="pt-2">
                   <span className="text-3xl font-black text-white">$0</span>
                </div>
             </div>
             <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
               Para conocer tu línea base y calibrar tu hardware vocal.
             </p>
             <ul className="space-y-3 mb-8 flex-1 text-[13px]">
                <li className="flex items-center gap-2 text-gray-400">
                   <span className="material-symbols-outlined text-gray-600 text-sm">check</span>
                   Diagnóstico Biométrico
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                   <span className="material-symbols-outlined text-gray-600 text-sm">check</span>
                   3 Calibraciones (Audio)
                </li>
             </ul>
             <Link href="/listen" className="w-full py-3 rounded-xl border border-gray-700 hover:bg-gray-800 text-gray-400 text-center font-bold transition-all text-[11px] uppercase tracking-widest">
                Continuar Gratis
             </Link>
          </div>

          {/* 2. VOZ MONTHLY (Hábito / Best Value for Santiago) */}
          <div className="bg-[#0D131A] border-2 border-blue-600 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden group shadow-[0_0_40px_-10px_rgba(37,99,235,0.2)] transform hover:-translate-y-1 transition-all">
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
             <div className="absolute top-4 right-4 bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">
                Recomendado
             </div>
             
             <div className="space-y-1 mb-6 mt-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-xl">psychology</span>
                  Hábito de Alto Rendimiento
                </h3>
                <div className="pt-2">
                   <span className="text-3xl font-black text-white">$12</span>
                   <span className="text-gray-500 text-[10px] ml-1 uppercase font-bold">/ mes</span>
                </div>
             </div>
             <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
               Diseñado para erradicar el Síndrome del Impostor mediante la repetición diaria.
             </p>
             <ul className="space-y-3 mb-8 flex-1 text-[13px]">
                <li className="flex items-center gap-2 text-white">
                   <span className="material-symbols-outlined text-blue-500 text-sm">verified</span>
                   Entrenamiento Diario (100/mes)
                </li>
                <li className="flex items-center gap-2 text-white">
                   <span className="material-symbols-outlined text-blue-500 text-sm">verified</span>
                   Seguimiento de Historial
                </li>
                <li className="flex items-center gap-2 text-white">
                   <span className="material-symbols-outlined text-blue-500 text-sm">verified</span>
                   Eliminación de Muletillas
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("VOICE_MONTHLY")}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-[11px] uppercase tracking-widest shadow-lg shadow-blue-900/40"
             >
                Activar Hábito
             </button>
          </div>

          {/* 3. SPRINT SEMANAL (Urgencia) */}
          <div className="bg-[#111] border border-gray-700 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden group hover:border-gray-500 transition-all">
             <div className="space-y-1 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-xl">bolt</span>
                  Sprint Intensivo
                </h3>
                <div className="pt-2">
                   <span className="text-3xl font-black text-white">$9</span>
                   <span className="text-gray-500 text-[10px] ml-1 uppercase font-bold">/ semana</span>
                </div>
             </div>
             <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
               Ideal para preparar una presentación específica o entrevista la próxima semana.
             </p>
             <ul className="space-y-3 mb-8 flex-1 text-[13px]">
                <li className="flex items-center gap-2 text-gray-300">
                   <span className="material-symbols-outlined text-amber-500 text-sm">check</span>
                   70 Análisis (Voz + Video)
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                   <span className="material-symbols-outlined text-amber-500 text-sm">check</span>
                   Feedback Visual Express
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("STARTER")}
                className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all text-[11px] uppercase tracking-widest border border-gray-700"
             >
                Iniciar Sprint
             </button>
          </div>

          {/* 4. ELITE (Aspiracional) */}
          <div className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-indigo-500/30 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden group">
             <div className="space-y-1 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400 text-xl">diamond</span>
                  Presencia Ejecutiva
                </h3>
                <div className="pt-2 text-white">
                   <span className="text-3xl font-black">$29</span>
                   <span className="text-indigo-300 text-[10px] ml-1 uppercase font-bold">/ mes</span>
                </div>
             </div>
             <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
               La suite completa para líderes que no pueden permitirse dudar frente a la cámara.
             </p>
             <ul className="space-y-3 mb-8 flex-1 text-[13px]">
                <li className="flex items-center gap-2 text-white">
                   <span className="material-symbols-outlined text-indigo-400 text-sm">verified</span>
                   Análisis de Video Ilimitado
                </li>
                <li className="flex items-center gap-2 text-indigo-100">
                   <span className="material-symbols-outlined text-indigo-400 text-sm">verified</span>
                   Biometría de Gestos y Mirada
                </li>
                <li className="flex items-center gap-2 text-indigo-100">
                   <span className="material-symbols-outlined text-indigo-400 text-sm">verified</span>
                   Coach IA 24/7
                </li>
             </ul>
             <button 
                onClick={() => handlePlanSelect("PREMIUM")}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg uppercase tracking-widest text-[11px]"
             >
                Obtener Suite Completa
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
