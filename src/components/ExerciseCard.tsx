'use client';

import React, { useState } from 'react';
import { VoiceExercise } from '@/domain/training/VoiceExercises';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface ExerciseCardProps {
  exercise: VoiceExercise;
  locked?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, locked = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  React.useEffect(() => {
    const completed = JSON.parse(localStorage.getItem('completed_exercises') || '[]');
    setIsCompleted(completed.includes(exercise.id));
  }, [exercise.id]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'text-emerald-400 bg-emerald-400/10';
      case 'INTERMEDIATE': return 'text-amber-400 bg-amber-400/10';
      case 'ADVANCED': return 'text-rose-400 bg-rose-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'NIVEL 1';
      case 'INTERMEDIATE': return 'NIVEL 2';
      case 'ADVANCED': return 'NIVEL 3';
      default: return difficulty;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BREATHING': return 'air';
      case 'ARTICULATION': return 'record_voice_over';
      case 'INTONATION': return 'graphic_eq';
      case 'PROJECTION': return 'campaign';
      case 'MINDSET': return 'psychology';
      case 'IMPROVISATION': return 'auto_fix_high';
      case 'VOCABULARY': return 'menu_book';
      case 'RELAXATION': return 'self_improvement';
      default: return 'fitness_center';
    }
  };

  // 🔒 RENDER BLOQUEADO (CONVERSIÓN BLACK OPS)
  if (locked) {
    return (
      <div className="group relative bg-[#080b0f] border border-slate-800/50 rounded-3xl overflow-hidden opacity-60 hover:opacity-100 transition-all duration-300">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]"></div>
        
        {/* BLURRED CONTENT PREVIEW */}
        <div className="p-6 relative filter blur-[2px] group-hover:blur-[4px] transition-all duration-500">
             <div className="flex justify-between items-start mb-4 opacity-50 grayscale">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center">
                     <span className="material-symbols-outlined">{getCategoryIcon(exercise.category)}</span>
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-300">{exercise.title}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Protocolo {exercise.tier}</p>
                   </div>
                </div>
             </div>
             <p className="text-sm text-slate-600 line-clamp-2">Este contenido está encriptado para personal no autorizado. Requiere nivel de acceso superior.</p>
        </div>
        
        {/* LOCK OVERLAY (EL CIERRE DE TRATO) */}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 text-center backdrop-blur-sm">
            
            <span className="material-symbols-outlined text-amber-500 text-4xl mb-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                verified_user
            </span>
            
            <h5 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-2">
                Acceso Restringido
            </h5>
            
            <p className="text-[10px] text-slate-300 font-medium mb-6 leading-relaxed max-w-[200px]">
                No necesitas más consejos. Necesitas <span className="text-amber-400">Reingeniería de Poder</span>.
            </p>

            <Link href="/upgrade" className="w-full">
                <button className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-amber-900/40 hover:scale-105 transition-transform border border-amber-400/20">
                    Reclamar mi Soberanía Vocal
                </button>
            </Link>
        </div>

        {/* STATIC LOCK ICON (Always visible when not hovering) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group-hover:opacity-0 transition-opacity">
             <span className="material-symbols-outlined text-slate-600 text-3xl">lock</span>
        </div>

      </div>
    );
  }

  // 🔓 RENDER NORMAL
  return (
    <div 
      className={`group relative bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] ${isExpanded ? 'ring-1 ring-blue-500/30 shadow-2xl shadow-blue-900/20' : ''}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-blue-400'}`}>
              <span className="material-symbols-outlined">{isCompleted ? 'check_circle' : getCategoryIcon(exercise.category)}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 group-hover:text-white transition-colors flex items-center gap-2">
                {exercise.title}
                {isCompleted && <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded font-black tracking-wider uppercase">Hecho</span>}
              </h4>
              
              <div className="flex items-center gap-2 mt-1">

                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${getDifficultyColor(exercise.difficulty)}`}>
                  {getDifficultyLabel(exercise.difficulty)}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter flex items-center gap-1 ${exercise.requiredMode === 'VIDEO' ? 'text-purple-400 bg-purple-400/10' : 'text-cyan-400 bg-cyan-400/10'}`}>
                    <span className="material-symbols-outlined text-[10px]">{exercise.requiredMode === 'VIDEO' ? 'videocam' : 'mic'}</span>
                    {exercise.requiredMode === 'VIDEO' ? 'Cámara' : 'Voz'}
                </span>
                {exercise.tier === 'ELITE' && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        ELITE
                    </span>
                )}
              </div>

            </div>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <span className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-400' : ''}`}>
              expand_more
            </span>
          </button>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all">
          {exercise.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {exercise.targetMetrics.map(metric => (
            <span key={metric} className="text-[10px] bg-slate-800/50 text-slate-500 px-2 py-1 rounded-md border border-slate-700/50">
              #{metric}
            </span>
          ))}
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-slate-800 animate-fade-in space-y-4">
            <div>
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Pasos a seguir</h5>
              <ul className="space-y-3">
                {exercise.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300">
                    <span className="text-blue-500 font-bold opacity-50">{idx + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Beneficio</h5>
              <p className="text-sm text-blue-200/70">{exercise.benefit}</p>
            </div>

            <div className="pt-2 flex gap-3">
              <Link 
                href={exercise.customRoute || `/practice?exercise=${exercise.id}`}
                 onClick={() => {
                  const { logEvent } = require('@/lib/events/logEvent');
                  logEvent("exercise_started", { 
                    exerciseId: exercise.id, 
                    title: exercise.title,
                    tier: exercise.tier 
                  });
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-bold text-sm text-center transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">play_arrow</span>
                Iniciar Práctica
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;
