'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VOICE_EXERCISES } from '@/domain/training/VoiceExercises';
import ExerciseCard from '@/components/ExerciseCard';
import { getCategoryLabel } from '@/domain/training/CategoryLabels';

const CATEGORIES = ['ALL', 'BREATHING', 'ARTICULATION', 'INTONATION', 'MINDSET', 'IMPROVISATION'];

export default function GymPage() {
  const [filter, setFilter] = useState('ALL');

  const [planType, setPlanType] = useState<string>('FREE');
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('user_plan') || 'FREE';
      setPlanType(storedPlan);

      // 🔒 PROTECCIÓN ESTRICTA: GIMNASIO DE VIDEO
      // Solo accesible si tienes plan de Video.
      // Si tienes Voz (o Free), no puedes entrar aquí. Debes comprarlo en tu Perfil.
      if (!storedPlan.includes('VIDEO')) {
          // Redirigir suavemente al dashboard de audio
          router.replace('/listen');
      }
    }
  }, [router]);

  const isFullAccess = planType !== 'FREE';

  const filteredExercises = filter === 'ALL' 
    ? VOICE_EXERCISES 
    : VOICE_EXERCISES.filter(ex => ex.category === filter);

  // Limitamos a 3 para usuarios free
  const displayExercises = isFullAccess ? filteredExercises : filteredExercises.slice(0, 3);

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white pb-24 font-display">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/listen" className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-bold text-lg">Gimnasio Vocal 🏋️</h1>
          <div className="w-6"></div> {/* Spacer balance */}
        </div>
        
        {/* Category Filter */}
        <div className="w-full overflow-x-auto pb-2 px-6 no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap
                  ${filter === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 mobile-container space-y-8 animate-fade-in">
        

        {/* Library Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Biblioteca 
            <span className="text-sm font-normal text-slate-500">({filteredExercises.length})</span>
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {displayExercises.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>

          {!isFullAccess && filteredExercises.length > 3 && (
            <div className="bg-gradient-to-br from-slate-900 to-blue-900/30 rounded-3xl p-8 border border-blue-500/30 text-center space-y-4 shadow-xl">
               <div className="size-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-400">
                  <span className="material-symbols-outlined text-3xl">lock</span>
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-bold">Desbloquea {VOICE_EXERCISES.length}+ Ejercicios</h3>
                  <p className="text-slate-400 text-sm">
                    Los usuarios Premium tienen acceso a la biblioteca completa de oratoria y lenguaje corporal.
                  </p>
               </div>
               <Link 
                 href="/upgrade"
                 className="inline-block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
               >
                 Subir de Nivel
               </Link>
            </div>
          )}

          {filteredExercises.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              <p>No hay ejercicios en esta categoría aún.</p>
            </div>
          )}
        </div>

      </main>

    </div>
  );
}
