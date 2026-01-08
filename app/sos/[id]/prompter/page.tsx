'use client';

import React, { Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { SITUATIONS, SituationId } from '../../data';

function PrompterContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const id = params.id as SituationId;
  const rawData = searchParams.get('q') || '';
  
  let notes: string[] = ['', '', ''];
  try {
     // searchParams are often already decoded by Next.js, 
     // but if we double encoded, we might need this.
     // Safe approach: try decode, fallback to split raw.
     notes = decodeURIComponent(rawData).split('|');
  } catch (e) {
     console.warn('Failed to decode notes, using raw', e);
     notes = rawData.split('|');
  }
  const situationData = SITUATIONS[id];

  if (!situationData) return null;

  return (
    <div className="min-h-[100dvh] bg-black text-white font-display flex flex-col p-6 animate-fade-in">
      
      {/* Header Minimalista */}
      <header className="mb-8 flex justify-between items-center opacity-70">
         <span className="text-[10px] uppercase tracking-[0.3em]">Modo Lectura</span>
         
         <button 
           onClick={() => {
             // Pass data back to script for editing
             const data = encodeURIComponent(notes.join('|'));
             router.push(`/sos/${id}/script?q=${data}`);
           }}
           className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white transition-colors border border-white/20 px-3 py-1 rounded-full"
         >
            <span className="material-symbols-outlined text-sm">edit</span>
            Editar
         </button>
      </header>

      {/* TARJETAS DE LECTURA GIGANTES */}
      <div className="flex-1 flex flex-col gap-6 justify-center max-w-2xl mx-auto w-full">
         {situationData.structure.map((block, i) => (
           <div key={i} className="flex flex-col gap-2">
              <label className={`text-xs font-bold uppercase tracking-widest ${
                 i === 0 || i === 3 ? 'text-blue-500' : i === 1 ? 'text-amber-500' : 'text-green-500'
              }`}>
                {block.title}
              </label>
              
              <div className="text-3xl md:text-5xl font-black leading-tight text-white border-l-4 pl-6 py-2 border-white/20">
                {notes[i] || <span className="text-gray-700 italic text-2xl">...</span>}
              </div>
           </div>
         ))}
      </div>

      {/* Footer de Salida */}
      <div className="mt-12 mb-8 flex flex-col gap-4 max-w-md mx-auto w-full pb-20">
         <p className="text-center text-gray-500 text-xs uppercase tracking-widest">¿Cómo salió?</p>
         
         <button 
           onClick={() => router.push('/sos/feedback')}
           className="w-full py-5 bg-[#1a1a1a] border border-white/10 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
         >
           Terminar Sesión
         </button>
      </div>

    </div>
  );
}

export default function PrompterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PrompterContent />
    </Suspense>
  );
}
