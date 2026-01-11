'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { VOICE_EXERCISES } from '@/domain/training/VoiceExercises';
import ExerciseCard from '@/components/ExerciseCard';
import { getCategoryLabel } from '@/domain/training/CategoryLabels';

const CATEGORIES = ['ALL', 'PROJECTION', 'BREATHING', 'ARTICULATION', 'INTONATION', 'MINDSET', 'RELAXATION', 'IMPROVISATION', 'VOCABULARY'];

export default function GymPage() {
  const { data: session, status } = useSession();
  const [filter, setFilter] = useState('ALL');
  const [planType, setPlanType] = useState<string>('FREE');
  const router = useRouter();

  React.useEffect(() => {
    if (status === "loading") return;
    
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('user_plan') || 'FREE';
      setPlanType(storedPlan);
    }
  }, [session, status]);

  const isPremium = planType === 'PREMIUM';
  const isStarter = planType === 'STARTER';

  const filteredExercises = filter === 'ALL' 
    ? VOICE_EXERCISES 
    : VOICE_EXERCISES.filter(ex => ex.category === filter);

  let displayExercises = filteredExercises;
  let showUpsell = false;
  let upsellTitle = "";
  let upsellMessage = "";

  if (planType === 'FREE') {
    displayExercises = filteredExercises;
    showUpsell = false; // No bloqueamos contenido que no cuesta
  } else if (planType === 'STARTER') {
    // STARTER: Only Audio exercises
    displayExercises = filteredExercises.filter(ex => ex.requiredMode === 'AUDIO');
    
    // Check if there are video exercises hidden/locked in this view
    const hasVideoExercises = filteredExercises.some(ex => ex.requiredMode === 'VIDEO');
    if (hasVideoExercises) {
        showUpsell = true;
        upsellTitle = "Desbloquear Radar de Video";
        upsellMessage = "Eleva tu suscripción a Dominancia Elite para activar el escáner de presencia y lenguaje corporal.";
    }
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white pb-24 font-display">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/listen" className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-bold text-lg uppercase tracking-widest text-blue-400">Arsenal Pro</h1>
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
        
        {/* ⚠️ MEDICAL DISCLAIMER */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex gap-3 text-sm text-blue-200/80">
           <span className="material-symbols-outlined text-blue-400 shrink-0">info</span>
           <p className="leading-relaxed text-xs">
              <strong className="text-blue-300 block mb-0.5">Nota de Seguridad Médica</strong>
              Oratoria Efectiva es una herramienta de entrenamiento, no un tratamiento médico. Si experimentas dolor, fatiga crónica o tienes patologías vocales previas, consulta a un especialista antes de realizar estos ejercicios.
           </p>
        </div>
        

        {/* Library Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            Activación de Poder 🚀
            <span className="text-sm font-normal text-slate-500">
                {planType === 'FREE' ? 'Nivel Base' : `(${displayExercises.length})`}
            </span>
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            
            {/* 🌬️ SPECIAL BREATHING EXERCISE CARD (FEATURED) */}
            {(filter === 'ALL' || filter === 'BREATHING') && (
                <Link href="/practice/breathing" className="block group">
                    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] active:scale-[0.98]">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                        
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="size-14 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-3xl">air</span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
                                        Nuevo
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Soporte de Aire</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">Soporte SSSS (Diafragma)</h3>
                                <p className="text-xs text-slate-400 line-clamp-2">
                                    Reto de estabilidad y duración. Fortalece tu apoyo diafragmático manteniendo una emisión constante.
                                </p>
                            </div>
                            
                            <div className="shrink-0 self-center">
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-white transition-colors">arrow_forward_ios</span>
                            </div>
                        </div>

                        {/* Gamification footer */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">timer</span>
                                45s Objetivo
                            </span>
                             <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">monitor_heart</span>
                                Feedback Tiempo Real
                            </span>
                        </div>
                    </div>
                </Link>
            )}

            {/* 🗣️ SPECIAL ARTICULATION EXERCISE CARD (FEATURED) */}
            {(filter === 'ALL' || filter === 'ARTICULATION') && (
                <Link href="/practice/articulation" className="block group">
                    <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] border border-violet-500/30 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-violet-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] active:scale-[0.98]">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full" />
                        
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="size-14 rounded-2xl bg-violet-500/20 text-violet-300 flex items-center justify-center shrink-0 border border-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-3xl">record_voice_over</span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 text-[10px] font-black uppercase tracking-wider border border-violet-500/20">
                                        Nuevo
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dicción Ejecutiva</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">Trabalenguas Progresivos</h3>
                                <p className="text-xs text-slate-400 line-clamp-2">
                                    Mejora tu dicción con niveles de dificultad creciente. Análisis de velocidad (WPM) y precisión en tiempo real.
                                </p>
                            </div>
                            
                            <div className="shrink-0 self-center">
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-white transition-colors">arrow_forward_ios</span>
                            </div>
                        </div>

                        {/* Gamification footer */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">speed</span>
                                Medición WPM
                            </span>
                             <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">mic</span>
                                Reconocimiento de Voz
                            </span>
                        </div>
                    </div>
                </Link>
            )}

            {/* ⏱️ SPECIAL IMPROVISATION EXERCISE CARD (FEATURED) */}
            {(filter === 'ALL' || filter === 'IMPROVISATION') && (
                <Link href="/practice/improvisation" className="block group">
                    <div className="bg-gradient-to-br from-[#451a03] to-[#78350f] border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] active:scale-[0.98]">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
                        
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="size-14 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-3xl">timer</span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
                                        Nuevo
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agilidad Mental</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">Minuto de Oro</h3>
                                <p className="text-xs text-slate-400 line-clamp-2">
                                    Habla 60 segundos sobre un tema aleatorio sin detenerte. Elimina el miedo a quedarte en blanco.
                                </p>
                            </div>
                            
                            <div className="shrink-0 self-center">
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-white transition-colors">arrow_forward_ios</span>
                            </div>
                        </div>

                        {/* Gamification footer */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                Cronómetro de Pánico
                            </span>
                             <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">mic</span>
                                Detector de Silencio
                            </span>
                        </div>
                    </div>
                </Link>
            )}

            {/* 🎵 SPECIAL INTONATION EXERCISE CARD (FEATURED) */}
            {(filter === 'ALL' || filter === 'INTONATION') && (
                <Link href="/practice/intonation" className="block group">
                     <div className="bg-gradient-to-br from-[#14532d] to-[#166534] border border-green-500/30 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] active:scale-[0.98]">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full" />
                        
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="size-14 rounded-2xl bg-green-500/20 text-green-300 flex items-center justify-center shrink-0 border border-green-500/20 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-3xl">graphic_eq</span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-300 text-[10px] font-black uppercase tracking-wider border border-green-500/20">
                                        Nuevo
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rango de Dominancia</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-300 transition-colors">Afinador de Voz</h3>
                                <p className="text-xs text-slate-400 line-clamp-2">
                                    Visualiza la "melodía" de tu voz en tiempo real. Aprende a variar tu tono para no sonar monótono.
                                </p>
                            </div>
                            
                            <div className="shrink-0 self-center">
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-white transition-colors">arrow_forward_ios</span>
                            </div>
                        </div>

                        {/* Gamification footer */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">music_note</span>
                                Detección Hz
                            </span>
                             <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">show_chart</span>
                                Visualizador
                            </span>
                        </div>
                    </div>
                </Link>
            )}

            {/* 📢 SPECIAL PROJECTION EXERCISE CARD (FEATURED) */}
            {(filter === 'ALL' || filter === 'PROJECTION') && (
                <Link href="/practice/projection" className="block group">
                     <div className="bg-gradient-to-br from-[#7f1d1d] to-[#991b1b] border border-red-500/30 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-red-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] active:scale-[0.98]">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full" />
                        
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="size-14 rounded-2xl bg-red-500/20 text-red-300 flex items-center justify-center shrink-0 border border-red-500/20 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-3xl">volume_up</span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 text-[10px] font-black uppercase tracking-wider border border-red-500/20">
                                        Nuevo
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Proyección de Poder</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-300 transition-colors">Dinamómetro Vocal</h3>
                                <p className="text-xs text-slate-400 line-clamp-2">
                                    Controla el volumen de tu voz. Aprende a proyectar sin gritar y evita los susurros inseguros.
                                </p>
                            </div>
                            
                            <div className="shrink-0 self-center">
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-white transition-colors">arrow_forward_ios</span>
                            </div>
                        </div>

                        {/* Gamification footer */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">equalizer</span>
                                Medidor de Decibelios
                            </span>
                             <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">campaign</span>
                                Control de Potencia
                            </span>
                        </div>
                    </div>
                </Link>
            )}

            {displayExercises.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>

          {showUpsell && (
            <div className="bg-gradient-to-br from-slate-900 to-blue-900/30 rounded-3xl p-8 border border-blue-500/30 text-center space-y-4 shadow-xl">
               <div className="size-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-400">
                  <span className="material-symbols-outlined text-3xl">lock</span>
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-bold">{upsellTitle}</h3>
                  <p className="text-slate-400 text-sm">
                    {upsellMessage}
                  </p>
               </div>
               <Link 
                 href="/upgrade"
                 className="inline-block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 active:scale-95"
               >
                 Obtener Acceso Elite
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
