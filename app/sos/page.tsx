'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SITUATIONS, SituationId } from './data';

export default function SOSPage() {
  const router = useRouter();

  const handleSelect = (id: SituationId) => {
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    router.push(`/sos/${id}/anchor`);
  };

  // Mapeo situacional para "Santiago"
  const situationalTitles: Record<string, string> = {
    EXPOSE: "Tengo que presentar",
    RESPOND: "Tengo que improvisar",
    DEFEND: "Me están atacando",
    SUMMARIZE: "Tengo que cerrar"
  };

  const situationalSubtitles: Record<string, string> = {
    EXPOSE: "Pitch, Reporte o Discurso",
    RESPOND: "Preguntas y Respuestas (Q&A)",
    DEFEND: "Objeciones o Críticas Hostiles",
    SUMMARIZE: "Conclusiones Memorables"
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white font-display overflow-hidden flex flex-col">
      <main className="flex-1 flex flex-col justify-center p-6 animate-fade-in-up">
         {/* Banner de Gratuidad */}
         <div className="w-full max-w-md mx-auto mb-8 bg-green-900/20 border border-green-500/30 rounded-lg p-3 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-green-500 text-sm">lock_open</span>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
              Acceso Gratuito • No Consume Créditos
            </span>
         </div>

         {/* Header Táctico */}
         <header className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/10 border border-red-500/20 mb-4 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">Modo Crisis Activo</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-3">
              ¿Cuál es la <span className="text-red-500">emergencia</span>?
            </h1>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Selecciona tu situación actual. Te daremos la estructura de supervivencia en 60 segundos.
            </p>
         </header>
         
         <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
           {(Object.keys(SITUATIONS) as SituationId[]).map((key) => {
             const situation = SITUATIONS[key];
             
             return (
               <button
                 key={key}
                 onClick={() => handleSelect(key)}
                 className={`group relative w-full h-28 bg-[#111] border border-white/10 rounded-xl flex items-center px-6 overflow-hidden transition-all hover:border-${situation.color.split('-')[1]}-500/50 hover:bg-[#161616] active:scale-[0.99]`}
               >
                 {/* Decorative BG Number */}
                 <span className="absolute right-2 bottom-[-10px] text-7xl font-black text-white/[0.03] group-hover:text-white/[0.05] transition-colors leading-none pointer-events-none">
                   {key === 'EXPOSE' ? '01' : key === 'DEFEND' ? '02' : key === 'RESPOND' ? '03' : '04'}
                 </span>

                 <div className="flex items-center gap-4 w-full relative z-10">
                    {/* Icon Box */}
                    <div className={`size-12 rounded-lg bg-${situation.color.split('-')[1]}-500/10 flex items-center justify-center text-${situation.color.split('-')[1]}-500 group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-2xl">{situation.icon}</span>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col items-start gap-1">
                      <h3 className="text-lg font-bold text-white tracking-tight uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all text-left">
                        {situationalTitles[key]}
                      </h3>
                      <span className="text-xs text-gray-500 font-medium">
                        {situationalSubtitles[key]}
                      </span>
                    </div>
                 </div>
                 
                 <span className="ml-auto text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all">
                   <span className="material-symbols-outlined">arrow_forward</span>
                 </span>
               </button>
             );
           })}
         </div>

         <div className="mt-8 text-center">
            <button onClick={() => router.push("/")} className="text-xs text-gray-600 hover:text-gray-400 uppercase tracking-widest font-bold transition-colors">
               Cancelar y Volver
            </button>
         </div>
      </main>
    </div>
  );
}
