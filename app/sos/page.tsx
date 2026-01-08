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
    // Navigate to the specific Anchor page for this situation
    router.push(`/sos/${id}/anchor`);
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white font-display overflow-hidden flex flex-col">
      <main className="flex-1 flex flex-col justify-center p-6 animate-fade-in-up">
         {/* Header Táctico */}
         <header className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase">Modo Activo</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-2">
              Selecciona tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Crisis</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Te daremos la estructura exacta para sobrevivir ahora mismo.
            </p>
         </header>
         <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
           {(Object.keys(SITUATIONS) as SituationId[]).map((key) => {
             const situation = SITUATIONS[key];
             const spanishKeys: Record<string, string> = {
                EXPOSE: 'EXPOSICIÓN',
                RESPOND: 'RESPUESTA',
                DEFEND: 'DEFENSA',
                SUMMARIZE: 'SÍNTESIS'
             };

             return (
               <button
                 key={key}
                 onClick={() => handleSelect(key)}
                 className={`group relative w-full h-24 bg-[#111] border border-white/10 rounded-xl flex items-center px-6 overflow-hidden transition-all hover:border-${situation.color.split('-')[1]}-500/50 hover:bg-[#161616] active:scale-[0.99]`}
               >
                 {/* ID / Number Faded */}
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                   {key === 'EXPOSE' ? '01' : key === 'DEFEND' ? '02' : key === 'RESPOND' ? '03' : '04'}
                 </span>

                 {/* Content */}
                 <div className="flex flex-col items-start gap-1 relative z-10">
                   <h3 className="text-xl font-bold text-white tracking-tight uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                     {situation.label}
                   </h3>
                   <span className={`text-[10px] uppercase tracking-widest font-bold text-${situation.color.split('-')[1]}-400`}>
                     Protocolo {spanishKeys[key]}
                   </span>
                 </div>
                 
                 {/* Arrow */}
                 <span className="ml-auto text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all">
                   <span className="material-symbols-outlined">arrow_forward_ios</span>
                 </span>
               </button>
             );
           })}
         </div>
      </main>
    </div>
  );
}
