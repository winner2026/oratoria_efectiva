'use client';

import React from 'react';
import Link from 'next/link';
import { COURSES } from '@/domain/training/VoiceCourses';
import { useState, useEffect } from 'react';

export default function CoursesPage() {
  const [planType, setPlanType] = useState<string>('FREE');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('user_plan') || 'FREE';
      setPlanType(storedPlan);
    }
  }, []);

  const hasCourseAccess = true;
  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white pb-24 font-display">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/listen" className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-black text-lg uppercase tracking-[0.2em] text-blue-500">MANDO</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 mobile-container space-y-8 animate-fade-in">
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-600 uppercase tracking-tighter">
            Ruta de Maestría
          </h2>
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            Protocolos de entrenamiento avanzado para el 1% ejecutivo.
          </p>
        </div>

        <div className="space-y-6">
          {COURSES.map(course => (
            <div key={course.id} className="relative">
              <Link 
                href={hasCourseAccess ? (course.externalLink || `/courses/${course.id}`) : "/upgrade"} 
                target={course.externalLink && hasCourseAccess ? "_blank" : "_self"}
                className={`block group ${!hasCourseAccess ? 'cursor-default' : ''}`}
              >
                <div className={`bg-slate-900 rounded-3xl overflow-hidden border transition-all ${
                  hasCourseAccess 
                    ? 'border-slate-800 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/20 group-hover:-translate-y-1' 
                    : 'border-slate-800 opacity-60 grayscale'
                }`}>
                  
                  {/* Course Art */}
                  <div className={`h-40 flex items-center justify-center relative ${course.image ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}>
                    {course.image ? (
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-6xl {hasCourseAccess ? 'group-hover:scale-110' : ''} transition-transform duration-500">
                        {course.externalLink ? '🚀' : (course.id === 'sprint-7' ? '⚡' : '🦁')}
                      </span>
                    )}
                    <div className="absolute bottom-3 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                      {course.durationDays} Días
                    </div>
                    

                      <div className="absolute top-3 left-4 bg-blue-600/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white border border-blue-400/50">
                        Acceso de Video
                      </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-2xl font-bold transition-colors ${hasCourseAccess ? 'text-white group-hover:text-amber-400' : 'text-slate-500'}`}>
                        {course.title}
                        {course.externalLink && hasCourseAccess && <span className="material-symbols-outlined text-sm ml-2">open_in_new</span>}
                      </h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${hasCourseAccess ? 'text-slate-400' : 'text-slate-600'}`}>
                      {course.description}
                    </p>
                    
                    {hasCourseAccess && !course.externalLink && (
                      <div className="pt-2">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-500">Progreso</span>
                          <span className="text-amber-500">0%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-0"></div>
                        </div>
                      </div>
                    )}

                    {course.externalLink && hasCourseAccess && (
                      <div className="pt-2">
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">rocket_launch</span>
                          Acceso en plataforma externa
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
