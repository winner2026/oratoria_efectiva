'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SosDiagnosticoPage() {
  const router = useRouter();

  const options = [
    {
      id: 'voice',
      title: 'Mi voz me traicionó',
      desc: 'Sentí falta de aire, voz temblorosa o mala dicción.',
      icon: 'record_voice_over',
      color: 'blue',
      link: '/gym?filter=BREATHING'
    },
    {
      id: 'confidence',
      title: 'Me sentí inseguro',
      desc: 'Muchos nervios, ansiedad o miedo a la mirada del otro.',
      icon: 'psychology',
      color: 'purple',
      link: '/gym?filter=MINDSET'
    },
    {
      id: 'structure',
      title: 'Perdí el hilo / Divagué',
      desc: 'No supe redondear la idea o me quedé en blanco.',
      icon: 'account_tree',
      color: 'amber',
      link: '/gym?filter=IMPROVISATION'
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-black text-white font-display flex flex-col items-center justify-center relative p-6 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />

      <main className="relative z-10 w-full max-w-md flex flex-col items-center animate-fade-in">
        <header className="text-center mb-10">
          <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3 block">
            Diagnóstico de Emergencia
          </span>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Identifica el <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Punto de Falla</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Para que no vuelva a pasar, debemos atacar la raíz. ¿Qué sentiste que falló más?
          </p>
        </header>

        <div className="space-y-4 w-full">
          {options.map((opt) => (
            <Link 
              key={opt.id} 
              href={opt.link}
              className="group block"
            >
              <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 flex items-center gap-5 hover:bg-white/[0.07] hover:border-white/20 transition-all active:scale-[0.98]">
                <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 
                  ${opt.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : 
                    opt.color === 'purple' ? 'bg-purple-500/10 text-purple-400' : 
                    'bg-amber-500/10 text-amber-400'}`}
                >
                  <span className="material-symbols-outlined text-3xl">{opt.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg group-hover:text-white transition-colors">
                    {opt.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
                <span className="material-symbols-outlined text-gray-700 group-hover:text-white transition-colors">
                  arrow_forward_ios
                </span>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-12">
          <Link href="/" className="text-gray-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
            Volver al inicio
          </Link>
        </footer>
      </main>
    </div>
  );
}
