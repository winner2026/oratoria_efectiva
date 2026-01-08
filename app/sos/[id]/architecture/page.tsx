'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SITUATIONS, SituationId } from '../../data';

export default function ArchitecturePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as SituationId;
  const situationData = SITUATIONS[id];

  if (!situationData) return null; // Or meaningful error

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#0a0a0a] to-black text-white font-display overflow-hidden flex flex-col p-6 animate-fade-in">
       <header className="mb-6 flex items-center gap-3">
          <div className={`w-1 h-8 ${situationData.color}`}></div>
          <h2 className="text-xl font-bold uppercase tracking-wide">Tu Estrategia</h2>
       </header>

       <div className="flex-1 flex flex-col justify-center gap-4">
         {situationData.structure.map((block, i) => (
           <div 
             key={i} 
             onClick={() => router.push(`/sos/${id}/script`)}
             className="bg-[#111] border-l-4 border-white/20 p-6 rounded-r-xl flex items-center gap-6 animate-slide-in-right cursor-pointer hover:bg-white/5 transition-colors active:scale-[0.98]"
             style={{ animationDelay: `${i * 150}ms`, borderLeftColor: i===0 ? '#3b82f6' : i===1 ? '#f59e0b' : '#22c55e' }}
           >
              <span className="text-4xl font-black text-white/10 opacity-50">{i + 1}</span>
              <div>
                <h3 className="text-xl font-bold uppercase mb-1">{block.title}</h3>
                <p className="text-gray-400 text-sm font-medium">{block.desc}</p>
              </div>
           </div>
         ))}
       </div>

       <button 
         onClick={() => router.push(`/sos/${id}/script`)}
         className="w-full py-5 bg-white text-black font-black text-xl tracking-wide uppercase rounded-lg hover:scale-[1.01] transition-transform shadow-xl mt-6"
       >
         Listo para hablar
       </button>
    </div>
  );
}
