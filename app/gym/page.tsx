'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { VOICE_EXERCISES } from '@/domain/training/VoiceExercises';
import ExerciseCard from '@/components/ExerciseCard';
import { getCategoryLabel } from '@/domain/training/CategoryLabels';

const CATEGORIES = ['ALL', 'PROJECTION', 'BREATHING', 'ARTICULATION', 'INTONATION', 'MINDSET', 'RELAXATION', 'IMPROVISATION'];

export default function GymPage() {
  const { data: session, status } = useSession();
  const [filter, setFilter] = useState('ALL');
  const [planType, setPlanType] = useState<string>('FREE');

  React.useEffect(() => {
    if (status === "loading") return;
    
    // Initial load from storage
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('user_plan') || 'FREE';
      setPlanType(storedPlan);
    }

    // Sync with API if user is logged in
    if (session?.user) {
        fetch('/api/users/me')
        .then(res => res.json())
        .then(data => {
            if (data.plan) {
               localStorage.setItem("user_plan", data.plan);
               setPlanType(data.plan);
            }
        })
        .catch(err => console.error("Error syncing plan in Gym:", err));
    }
  }, [session, status]);

  // 🔒 LOGICA DE APILAMIENTO DE PODER (ACCESS GATING)
  const organizedExercises = useMemo(() => {
    const isStarter = planType === 'STARTER';
    const isElite = planType === 'ELITE' || planType === 'PREMIUM'; // PREMIUM is old name for ELITE

    return VOICE_EXERCISES.filter(ex => {
        if (filter === 'ALL') return true;
        return ex.category === filter;
    }).map(ex => {
        let isLocked = true;
        let isVisible = true;

        if (planType === 'FREE') {
            // Usuario FREE: Solo ve ejercicios FREE. Ve STARTER bloqueados. ELITE ocultos.
            if (ex.tier === 'FREE') isLocked = false;
            else if (ex.tier === 'STARTER') isLocked = true;
            else isVisible = false; // Ocultar ELITE para no abrumar al novato
        } 
        else if (isStarter) {
           // Usuario STARTER: Ve FREE y STARTER abiertos. Ve ELITE bloqueados.
           if (ex.tier === 'FREE' || ex.tier === 'STARTER') isLocked = false;
           else if (ex.tier === 'ELITE') isLocked = true;
        }
        else if (isElite) {
            // Dios: Ve todo abierto.
            isLocked = false;
        }

        return { ...ex, isLocked, isVisible };
    }).filter(ex => ex.isVisible); // Eliminar los ocultos del array final

  }, [planType, filter]);

  const coreExercises = organizedExercises.filter(ex => ex.isCore);
  const libraryExercises = organizedExercises.filter(ex => !ex.isCore);

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
                {planType === 'FREE' ? 'Tu Nivel: 🥈 Monitor' : planType === 'STARTER' ? 'Tu Nivel: 🥉 CONTROL' : 'Tu Nivel: 🥇 PRECISION'}
             </span>
          </div>
          <div className="w-6"></div> 
        </div>
        
        {/* Category Filter */}
        <div className="w-full overflow-x-auto pb-2 px-6 no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border
                  ${filter === cat 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 mobile-container space-y-10 animate-fade-in">
        
        {/* SECTION 1: CORE 12 (FUNDAMENTALS) - Solo si no hay filtro activo o coincide */}
        {coreExercises.length > 0 && (
            <div className="space-y-4 px-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="flex size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                        Lo Básico
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {coreExercises.map(ex => (
                        <ExerciseCard key={ex.id} exercise={ex} locked={ex.isLocked} />
                    ))}
                </div>
            </div>
        )}

        {/* SECTION 2: LIBRARY (EXPANDED) */}
        {libraryExercises.length > 0 && (
             <div className="space-y-4 px-1">
                <div className="flex items-center gap-2 mb-2 pt-6 border-t border-slate-800/50">
                    <span className="material-symbols-outlined text-sm text-blue-500">grid_view</span>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                        Juegos Avanzados
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {libraryExercises.map(ex => (
                        <ExerciseCard key={ex.id} exercise={ex} locked={ex.isLocked} />
                    ))}
                </div>
            </div>
        )}

        {organizedExercises.length === 0 && (
            <div className="text-center py-20 opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">filter_list_off</span>
                <p>No hay juegos de este tipo.</p>
            </div>
        )}

        {/* UPSELL BANNER (Si es FREE) */}
        {planType === 'FREE' && (
            <div className="mt-12 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-3xl p-6 text-center space-y-4">
                <p className="text-sm text-blue-200 font-medium">
                    ¿Quieres más juegos?
                </p>
                <h3 className="text-xl font-black text-white italic">
                    Desbloquear Todo
                </h3>
                <Link href="/upgrade" className="inline-block w-full py-4 bg-white text-blue-900 font-black rounded-xl uppercase tracking-widest shadow-xl">
                    Ver Cómo
                </Link>
            </div>
        )}

      </main>

    </div>
  );
}
