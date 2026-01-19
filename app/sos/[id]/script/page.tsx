"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { SITUATIONS, SituationId } from '../../data';
import Link from 'next/link';

export default function ScriptPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as SituationId;
  const situationData = SITUATIONS[id];

  // --- LOGICA DEFEND (PROTOCOLO CRÍTICO) ---
  const [defendStep, setDefendStep] = useState<'BIOHACK' | 'ALGORITHM' | 'COMPLETE'>('BIOHACK');
  const [timer, setTimer] = useState(15); // 15s iniciales para BioHack

  useEffect(() => {
    if (id !== 'DEFEND' || defendStep !== 'BIOHACK') return;
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
            setDefendStep('ALGORITHM');
            return 45; // 45s para el algoritmo
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [id, defendStep]);

  // Timer para la fase Algoritmo (opcional, solo visual)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  // --- LOGICA ESTANDAR (EDITOR) ---
  const initialRaw = searchParams.get('q');
  let initialNotes: string[] = [];
  if (initialRaw) {
     try { initialNotes = decodeURIComponent(initialRaw).split('|'); } 
     catch(e) { initialNotes = initialRaw.split('|'); }
  }

  const [notes, setNotes] = useState<string[]>(
    initialNotes.length > 0 ? initialNotes : new Array(situationData ? situationData.structure.length : 3).fill('')
  );


  if (!situationData) return null;

  // 🔴 RENDER CASE: DEFEND (Protocolo Estático)
  if (id === 'DEFEND') {
      return (
        <div className="min-h-[100dvh] bg-red-950 text-white font-display overflow-hidden flex flex-col p-6 animate-fade-in relative">
            
            {defendStep === 'BIOHACK' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                     <div className="size-32 rounded-full border-4 border-red-500 flex items-center justify-center animate-pulse">
                         <span className="text-5xl font-black">{timer}</span>
                     </div>
                     <h2 className="text-2xl font-black uppercase tracking-widest text-red-400">Bio-Hack de Emergencia</h2>
                     <p className="text-xl font-medium max-w-sm">
                         Realiza un <strong className="text-white">Core Lock</strong> (vacío abdominal).<br/><br/>
                         Envía señal de seguridad al nervio vago.<br/>
                         Detén el temblor vocal.
                     </p>
                     <p className="text-sm text-red-300 italic">"No respondas desde la garganta. Responde desde el plexo."</p>
                     <button onClick={() => setDefendStep('ALGORITHM')} className="mt-8 px-6 py-3 bg-red-800 rounded-lg uppercase font-bold text-xs tracking-widest">Saltar Fase</button>
                </div>
            )}

            {defendStep === 'ALGORITHM' && (
                <div className="flex-1 flex flex-col pt-4 pb-20 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6 border-b border-red-800 pb-4">
                        <h2 className="text-lg font-black uppercase tracking-widest text-white">Algoritmo de Respuesta</h2>
                        <span className="text-xs font-mono text-red-400 px-2 py-1 bg-red-900/50 rounded">TIEMPO TÁCTICO: {timer}s</span> 
                    </div>

                    <div className="space-y-6">
                        {/* Paso 1 */}
                        <div className="bg-black/40 border-l-4 border-slate-400 p-4 rounded-r-lg">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">01. Validación Neutra (El Escudo)</span>
                            <p className="text-lg font-medium leading-relaxed">
                                "Es un punto de vista interesante para poner sobre la mesa..."
                            </p>
                            <p className="text-xs text-red-300 mt-2 italic">Valida la existencia de la pregunta, no la crítica.</p>
                        </div>

                        {/* Paso 2 */}
                        <div className="bg-black/40 border-l-4 border-amber-500 p-4 rounded-r-lg">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-2">02. Puente de Soberanía</span>
                            <p className="text-lg font-medium leading-relaxed">
                                "...sin embargo, para tomar una decisión informada debemos mirar el dato estructural, que es [X]."
                            </p>
                            <p className="text-xs text-red-300 mt-2 italic">Mueve de la emoción a la lógica.</p>
                        </div>

                        {/* Paso 3 */}
                        <div className="bg-black/40 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mb-2">03. Devolución de Marco</span>
                            <p className="text-lg font-medium leading-relaxed">
                                "¿Cómo crees que ese factor altera el KPI principal que estamos discutiendo hoy?"
                            </p>
                            <p className="text-xs text-red-300 mt-2 italic">Devuelve la carga de trabajo. No parpadees.</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setDefendStep('COMPLETE')}
                        className="mt-8 w-full py-5 bg-white text-red-900 font-black text-xl uppercase tracking-widest rounded-xl shadow-2xl active:scale-[0.98] transition-transform"
                    >
                        Ejecutar Protocolo
                    </button>
                    
                    <p className="text-center text-[10px] text-red-400 mt-4 uppercase tracking-widest">
                        Tono: Lectura de Villano (Bajo y Lento)
                    </p>
                </div>
            )}

            {defendStep === 'COMPLETE' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                     <span className="material-symbols-outlined text-6xl text-green-500 mb-4 animate-bounce">check_circle</span>
                     <h2 className="text-3xl font-black uppercase italic text-white">Crisis Neutralizada</h2>
                     
                     <div className="bg-black/50 p-6 rounded-2xl border border-red-800 max-w-sm">
                         <p className="text-sm text-slate-300 leading-relaxed mb-4">
                             Protocolo ejecutado con éxito. Has recuperado el control del marco comunicativo.
                         </p>
                         <p className="text-sm text-white font-bold mb-6">
                             Refuerza tu biometría de mando en el Arsenal de entrenamiento.
                         </p>
                         <Link href="/gym" className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-lg hover:scale-105 transition-transform">
                             Ir al Arsenal Pro
                         </Link>
                     </div>

                     <button onClick={() => router.push('/sos')} className="text-xs text-red-400 font-bold uppercase tracking-widest mt-8">
                         Volver a Base
                     </button>
                </div>
            )}
        </div>
      );
  }

  // 🔵 RENDER CASE: STANDARD (Editor)
  return (
    <div className="min-h-[100dvh] bg-black text-white font-display overflow-hidden flex flex-col p-4 animate-fade-in">
       <div className="text-center mb-8 mt-2">
          <p className="text-2xl md:text-3xl uppercase tracking-widest font-black text-white drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            Tu Guion de <span className="text-red-500 animate-pulse">Emergencia</span>
          </p>
       </div>

       <div className="flex-1 flex flex-col gap-3 justify-center max-w-2xl mx-auto w-full">
         {situationData.prompts.map((prompt, i) => (
           <div key={i} className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center gap-2 transition-colors focus-within:bg-white/10 focus-within:border-white/30">
             
             {/* Label Pasos */}
             <div className="flex items-center gap-2 mb-1">
                <div className={`size-2 rounded-full ${
                  i === 0 || i === 3 ? 'bg-blue-500' : i === 1 ? 'bg-amber-500' : 'bg-green-500'
                }`}></div>
                <label className={`text-xs md:text-sm font-black uppercase tracking-[0.2em] ${
                    i === 0 || i === 3 ? 'text-blue-400' : i === 1 ? 'text-amber-400' : 'text-green-400'
                }`}>
                    {situationData.structure[i].title}
                </label>
             </div>
             
             {/* La Pregunta Guía */}
             <h3 className="text-gray-400 text-lg md:text-xl font-medium leading-tight">
               {prompt}
             </h3>

             {/* Input Masivo */}
             <input 
               type="text" 
               className="bg-transparent text-3xl md:text-4xl font-bold text-white placeholder:text-lg placeholder:font-medium placeholder-white/20 outline-none w-full py-2"
               placeholder={situationData.placeholders[i]}
               value={notes[i]}
               onChange={(e) => {
                 const newNotes = [...notes];
                 newNotes[i] = e.target.value;
                 setNotes(newNotes);
               }}
               autoComplete="off"
             />
           </div>
         ))}
       </div>

       <div className="mt-6 flex justify-between items-center px-2 pb-12 mb-8 w-full max-w-2xl mx-auto z-20 relative">
          <button 
            onClick={() => router.back()}
            className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors py-3 px-4"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span className="hidden md:inline">Atrás</span>
          </button>

          <button 
            onClick={() => {
              const data = encodeURIComponent(notes.join('|'));
              router.push(`/sos/${id}/prompter?q=${data}`);
            }} 
            className="flex-1 max-w-[200px] md:max-w-xs ml-4 px-6 py-4 bg-white text-black rounded-xl text-xs md:text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
          >
            Fijar Guion
            <span className="material-symbols-outlined text-lg">visibility</span>
          </button>
       </div>
    </div>
  );
}
