'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/'); 
  };

  const handleStruggle = () => {
    // Redirección directa al modo "Solo Voz" para análisis inmediato sin fricción
    router.push('/practice?mode=voice');
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white font-display overflow-hidden flex flex-col items-center justify-center relative p-6">
       <main className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-8">¿Lograste sobrevivir?</h2>
          
          <div className="grid grid-cols-2 gap-6 w-full">
            <button 
              onClick={handleSuccess}
              className="py-8 bg-green-600/20 border-2 border-green-600 rounded-3xl text-green-500 hover:bg-green-600 hover:text-white transition-all flex flex-col items-center gap-2"
            >
              <span className="material-symbols-outlined text-4xl">thumb_up</span>
              <span className="font-bold text-xl">¡SÍ!</span>
            </button>

            <button 
              onClick={handleStruggle}
              className="py-8 bg-red-600/20 border-2 border-red-600 rounded-3xl text-red-500 hover:bg-red-600 hover:text-white transition-all flex flex-col items-center gap-2"
            >
              <span className="material-symbols-outlined text-4xl">thumb_down</span>
              <span className="font-bold text-xl">Más o menos</span>
            </button>
          </div>
          
          <p className="mt-8 text-gray-500 text-sm">
            Cualquier resultado que no sea un desmayo es una victoria.
          </p>
       </main>
    </div>
  );
}
