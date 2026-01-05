'use client';

import React, { useState } from 'react';
import { VoiceExercise } from '@/domain/training/VoiceExercises';
import Link from 'next/link';

interface ExerciseCardProps {
  exercise: VoiceExercise;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'text-emerald-400 bg-emerald-400/10';
      case 'INTERMEDIATE': return 'text-amber-400 bg-amber-400/10';
      case 'ADVANCED': return 'text-rose-400 bg-rose-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BREATHING': return 'air';
      case 'ARTICULATION': return 'record_voice_over';
      case 'INTONATION': return 'graphic_eq';
      case 'PROJECTION': return 'campaign';
      case 'MINDSET': return 'psychology';
      case 'STAGE_PRESENCE': return 'visibility';
      case 'IMPROVISATION': return 'auto_fix_high';
      default: return 'fitness_center';
    }
  };

  return (
    <div 
      className={`group relative bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] ${isExpanded ? 'ring-1 ring-blue-500/30 shadow-2xl shadow-blue-900/20' : ''}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">{getCategoryIcon(exercise.category)}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 group-hover:text-white transition-colors">
                {exercise.title}
              </h4>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
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

        <p className="text-sm text-slate-400 leading-relaxed mb-4">
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
                href={`/practice?exercise=${exercise.id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-bold text-sm text-center transition-all shadow-lg shadow-blue-900/20 active:scale-95"
              >
                Practicar ahora
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;
