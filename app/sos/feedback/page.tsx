'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/'); 
  };

  const handleStruggle = () => {
    // Redirección a la pantalla de diagnóstico rápido para perfilar el fallo
    router.push('/sos/diagnostico');
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white font-display overflow-hidden flex flex-col items-center justify-center relative p-6">
        <main className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in w-full max-w-sm">
           <header className="mb-12">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3 block text-center">Post-Análisis</span>
              <h2 className="text-4xl font-black tracking-tight">Reporte de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Desempeño</span></h2>
           </header>
           
           <div className="grid grid-cols-1 gap-4 w-full px-4">
             <button 
               onClick={handleSuccess}
               className="group p-6 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/[0.08] hover:border-blue-500/50 transition-all flex items-center gap-6"
             >
               <div className="size-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-3xl">verified</span>
               </div>
               <div className="text-left">
                  <span className="block font-black text-xl text-white">Impacto Logrado</span>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Misión Cumplida</span>
               </div>
             </button>

             <button 
               onClick={handleStruggle}
               className="group p-6 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/[0.08] hover:border-red-500/50 transition-all flex items-center gap-6"
             >
               <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-3xl">error_outline</span>
               </div>
               <div className="text-left">
                  <span className="block font-black text-xl text-white">Falla Detectada</span>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Analizar por qué fallé</span>
               </div>
             </button>
           </div>
           
           <p className="mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
             Calibración Automática de Resultados
           </p>
        </main>
    </div>
  );
}
