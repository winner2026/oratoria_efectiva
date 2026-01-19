"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SynthesisPage() {
  const router = useRouter();
  
  // Game State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // Focus Ref
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Count words logic
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
  }, [content]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  const handleNext = () => {
    setStep(prev => (prev < 4 ? prev + 1 : 4) as any);
  };

  const reset = () => {
      setStep(1);
      setContent("");
  };

  const getStepInfo = () => {
      switch(step) {
          case 1: return { 
              title: "Vuelca tu Mente", 
              desc: "Escribe tu idea completa. Sin filtros, sin editar. Solo sácala.", 
              limit: null,
              placeholder: "Estaba pensando en que..."
          };
          case 2: return { 
              title: "Poda lo Sobrante", 
              desc: "Ahora redúcelo a máximo 3 oraciones. Quédate con lo vital.", 
              limit: "3 oraciones",
              placeholder: "Lo importante es..."
          };
          case 3: return { 
              title: "La Esencia", 
              desc: "Tienes 12 palabras. Ni una más. Haz que cada una cueste $1,000.", 
              limit: "12 palabras", // Logic check needed
              placeholder: "La idea es..."
          };
          default: return { title: "Hecho", desc: "", limit: "", placeholder: ""};
      }
  };

  const info = getStepInfo();

  // Validation for Step 3
  const isOverLimit = step === 3 && wordCount > 12;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-display flex flex-col relative overflow-hidden transition-colors duration-1000">
        
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-amber-900/10 blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-slate-800/20 blur-[100px]" />
      </div>

      <div className="relative z-10 px-6 py-4 flex justify-between items-center">
         <Link href="/gym" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Gimnasio</span>
         </Link>
         <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="material-symbols-outlined text-sm text-amber-400">content_cut</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">Síntesis</span>
         </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-3xl mx-auto text-center">
        
        {step < 4 ? (
            <div className="w-full space-y-8 animate-fade-in">
                
                {/* Progress */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 w-12 rounded-full transition-colors ${i <= step ? 'bg-amber-500' : 'bg-slate-800'}`} />
                    ))}
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{info.title}</h1>
                    <p className="text-slate-400 text-lg max-w-lg mx-auto">{info.desc}</p>
                </div>

                <div className="relative group">
                    <textarea
                        ref={inputRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={info.placeholder}
                        className={`w-full bg-slate-900/50 border rounded-3xl p-8 text-xl md:text-2xl font-serif text-white focus:outline-none transition-all resize-none min-h-[300px] 
                            ${isOverLimit ? 'border-red-500/50 focus:border-red-500 ring-1 ring-red-500/20' : 'border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50'}
                        `}
                    />
                    
                    <div className={`absolute bottom-6 right-6 text-sm font-bold font-mono py-1 px-3 rounded-full border ${
                        isOverLimit ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-black/30 border-white/10 text-slate-500'
                    }`}>
                        {wordCount} palabras {step === 3 && "/ 12"}
                    </div>
                </div>

                <button
                    onClick={handleNext}
                    disabled={!content.trim() || isOverLimit}
                    className="px-12 py-4 bg-white text-black font-black text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 mx-auto"
                >
                    {step === 3 ? "FINALIZAR" : "SIGUIENTE PASO"}
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        ) : (
            <div className="w-full space-y-8 animate-fade-in-up">
                <div className="size-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(245,158,11,0.4)] mb-8">
                    <span className="material-symbols-outlined text-5xl text-black">diamond</span>
                </div>
                
                <h1 className="text-4xl font-black text-white">Idea Destilada</h1>
                
                <div className="p-12 border-y-2 border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent">
                    <p className="text-3xl md:text-5xl font-black italic leading-tight text-amber-100">
                        "{content}"
                    </p>
                </div>

                <div className="flex gap-4 justify-center pt-8">
                    <button 
                        onClick={reset}
                        className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-colors uppercase tracking-widest text-xs"
                    >
                        Nueva Idea
                    </button>
                    <Link href="/gym">
                        <button className="px-8 py-3 bg-white text-black border border-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest text-xs">
                            Volver al Gym
                        </button>
                    </Link>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
