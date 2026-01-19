'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { VOICE_EXERCISES } from '@/domain/training/VoiceExercises';
import ExerciseCard from '@/components/ExerciseCard';

export default function GymPage() {
  const { data: session } = useSession();

  // Show all exercises in order
  const exercises = useMemo(() => {
    return VOICE_EXERCISES.map(ex => ({ 
        ...ex, 
        isLocked: false, 
        isVisible: true 
    }));
  }, []);

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white pb-24 font-display">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/listen" className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex flex-col items-center">
             <h1 className="font-bold text-sm uppercase tracking-widest text-white">Zona de Entrenamiento</h1>
             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Plan Completo
             </span>
          </div>
          <div className="w-6"></div> 
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 mobile-container space-y-10 animate-fade-in">
        
        {/* EXERCISES LIST */}
        <div className="px-1 space-y-4">
             {exercises.length > 0 ? (
                exercises.map(ex => (
                    <ExerciseCard key={ex.id} exercise={ex} locked={ex.isLocked} />
                ))

             ) : (
                <div className="text-center py-20 opacity-50">
                    <span className="material-symbols-outlined text-4xl mb-2">filter_list_off</span>
                    <p>No hay juegos en esta categoría.</p>
                </div>
             )}
        </div>

      </main>

    </div>
  );
}
