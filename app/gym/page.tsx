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
             <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">
                Gimnasio
             </span>
          </div>
          <div className="w-6"></div> 
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 mobile-container space-y-10 animate-fade-in">
        
          <div className="space-y-4 px-1">
              <div className="flex items-center gap-2 mb-2">
                  <span className="flex size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      Misiones Disponibles
                  </h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                  {exercises.map(ex => (
                      <ExerciseCard key={ex.id} exercise={ex} locked={false} />
                  ))}
              </div>
          </div>

      </main>

    </div>
  );
}
