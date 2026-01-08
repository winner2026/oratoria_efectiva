'use client';

import React, { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { SITUATIONS, SituationId } from '../../data';

export default function ScriptPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as SituationId;
  const situationData = SITUATIONS[id];
  
  // Try to load initial data from URL (if editing)
  const initialRaw = searchParams.get('q');
  let initialNotes: string[] = [];
  
  if (initialRaw) {
     try {
       initialNotes = decodeURIComponent(initialRaw).split('|');
     } catch(e) {
       initialNotes = initialRaw.split('|');
     }
  }

  const [notes, setNotes] = useState<string[]>(
    initialNotes.length > 0 
      ? initialNotes 
      : new Array(situationData ? situationData.structure.length : 3).fill('')
  );

  if (!situationData) return null;

  return (
    <div className="min-h-[100dvh] bg-black text-white font-display overflow-hidden flex flex-col p-4 animate-fade-in">
       <div className="text-center mb-8 mt-2">
          <p className="text-2xl md:text-3xl uppercase tracking-widest font-black text-white drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            Tu Guion de <span className="text-red-500 animate-pulse">Emergencia</span>
          </p>
       </div>

       <div className="flex-1 flex flex-col gap-3 justify-center max-w-2xl mx-auto w-full">
         {situationData.prompts.map((prompt, i) => (
           <div key={i} className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center gap-2 transition-colors focus-within:bg-white/10 focus-within:border-white/30">
             
             {/* Label Pasos */}
             <div className="flex items-center gap-2 mb-1">
                <div className={`size-2 rounded-full ${
                  i === 0 || i === 3 ? 'bg-blue-500' : i === 1 ? 'bg-amber-500' : 'bg-green-500'
                }`}></div>
                <label className={`text-xs md:text-sm font-black uppercase tracking-[0.2em] ${
                    i === 0 || i === 3 ? 'text-blue-400' : i === 1 ? 'text-amber-400' : 'text-green-400'
                }`}>
                    {situationData.structure[i].title}
                </label>
             </div>
             
             {/* La Pregunta Guía (Más grande) */}
             <h3 className="text-gray-400 text-lg md:text-xl font-medium leading-tight">
               {prompt}
             </h3>

             {/* Input Masivo */}
             <input 
               type="text" 
               className="bg-transparent text-3xl md:text-4xl font-bold text-white placeholder:text-lg placeholder:font-medium placeholder-white/20 outline-none w-full py-2"
               placeholder={situationData.placeholders[i]}
               value={notes[i]}
               onChange={(e) => {
                 const newNotes = [...notes];
                 newNotes[i] = e.target.value;
                 setNotes(newNotes);
               }}
               autoComplete="off"
             />
           </div>
         ))}
       </div>

       <div className="mt-6 flex justify-between items-center px-2 pb-12 mb-8 w-full max-w-2xl mx-auto z-20 relative">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors py-3 px-4"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span className="hidden md:inline">Atrás</span>
          </button>

          {/* Primary Action */}
          <button 
            onClick={() => {
              // Encode notes to pass to prompter e.g. "note1|note2|note3"
              const data = encodeURIComponent(notes.join('|'));
              router.push(`/sos/${id}/prompter?q=${data}`);
            }} 
            className="flex-1 max-w-[200px] md:max-w-xs ml-4 px-6 py-4 bg-white text-black rounded-xl text-xs md:text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
          >
            Fijar Guion
            <span className="material-symbols-outlined text-lg">visibility</span>
          </button>
       </div>
    </div>
  );
}
