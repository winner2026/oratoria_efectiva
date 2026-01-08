'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SituationId } from '../../data';

export default function AnchorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as SituationId; // We trust it's a valid ID for now
  
  const [timeLeft, setTimeLeft] = useState(4); 
  const [cycle, setCycle] = useState(0); 
  const [phase, setPhase] = useState<'INHALE' | 'EXHALE'>('INHALE');

  // Timer logic for breathing phase
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
           if (phase === 'INHALE') {
              setPhase('EXHALE');
              return 4;
           } else {
              // End of one full breath
              setPhase('INHALE');
              setCycle(c => c + 1);
              return 4;
           }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Handle navigation ONLY when cycle is complete
  useEffect(() => {
    if (cycle >= 1) {
       router.push(`/sos/${id}/script`); 
    }
  }, [cycle, id, router]);

  return (
    <div className="min-h-[100dvh] bg-black text-white font-display overflow-hidden flex flex-col items-center justify-center relative">
        <button 
          onClick={() => router.push(`/sos/${id}/script`)}
          className="absolute top-8 right-6 z-50 text-gray-500 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest border border-transparent hover:border-gray-700 rounded-full transition-all"
        >
          Saltar &gt;
        </button>

       <div className={`relative flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
         phase === 'INHALE' ? 'scale-125' : 'scale-50'
       }`}>
         <div className="size-48 rounded-full border border-green-500/50 bg-green-900/10 shadow-[0_0_60px_rgba(34,197,94,0.2)] flex items-center justify-center">
         </div>
       </div>

       <h2 className="mt-16 text-3xl font-light tracking-widest animate-pulse text-green-400/80">
         {phase === 'INHALE' ? 'INHALA...' : 'EXHALA...'}
       </h2>
       
       <p className="absolute bottom-10 text-gray-600 text-xs uppercase tracking-widest">
         Solo 10 segundos para recuperar el control
       </p>
    </div>
  );
}
