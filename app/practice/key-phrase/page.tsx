"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function KeyPhrasePage() {
  const router = useRouter();
  const [phrase, setPhrase] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const MAX_CHARS = 120;

  useEffect(() => {
    // Load from local storage if exists
    const saved = localStorage.getItem("user_key_phrase");
    if (saved) {
      setPhrase(saved);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!phrase.trim()) return;
    localStorage.setItem("user_key_phrase", phrase);
    setIsSaved(true);
  };

  const handleEdit = () => {
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-display flex flex-col relative overflow-hidden transition-colors duration-1000">
        
       {/* Background Ambience */}
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-1/2 bg-indigo-900/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-900/10 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4 flex justify-between items-center bg-transparent">
         <Link href="/gym" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Gimnasio</span>
         </Link>
         <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="material-symbols-outlined text-sm text-indigo-400">fingerprint</span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Identidad</span>
         </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-2xl mx-auto text-center">
        
        <div className="animate-fade-in w-full space-y-8">
            
            <div className="space-y-4">
                <span className="inline-block p-4 rounded-full bg-slate-900 border border-white/5 mb-4 shadow-xl">
                    <span className="material-symbols-outlined text-4xl text-slate-400">psychology_alt</span>
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    La Frase Clave
                </h1>
                <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
                    Si solo pudieras decir <strong className="text-white">una cosa</strong> al mundo,<br/> ¿qué sería?
                </p>
            </div>

            {/* INPUT AREA */}
            <div className={`relative transition-all duration-500 transform ${isSaved ? 'scale-105' : 'scale-100'}`}>
                {isSaved ? (
                     <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 border border-indigo-500/30 p-8 rounded-3xl backdrop-blur-xl shadow-[0_0_50px_rgba(79,70,229,0.1)] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
                        
                        <p className="text-2xl md:text-4xl font-serif italic leading-relaxed text-indigo-100 drop-shadow-md">
                            "{phrase}"
                        </p>
                        
                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={handleEdit}
                                className="text-xs text-slate-400 hover:text-white uppercase tracking-widest font-bold flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Editar
                            </button>
                        </div>
                     </div>
                ) : (
                    <div className="relative group">
                        <textarea
                            value={phrase}
                            onChange={(e) => setPhrase(e.target.value)}
                            maxLength={MAX_CHARS}
                            placeholder="Escribe aquí tu verdad..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-3xl p-8 text-2xl md:text-3xl font-serif text-center placeholder:text-slate-700 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none min-h-[200px]"
                        />
                        <div className="absolute bottom-4 right-6 text-xs font-mono font-bold text-slate-500">
                            {phrase.length}/{MAX_CHARS}
                        </div>
                    </div>
                )}
            </div>

            {/* ACTION BUTTON */}
            {!isSaved && (
                <button
                    onClick={handleSave}
                    disabled={!phrase.trim()}
                    className="px-12 py-4 bg-white text-black font-black text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    GRABAR EN PIEDRA
                </button>
            )}

            {isSaved && (
                <div className="animate-fade-in-up delay-300">
                    <p className="text-slate-500 text-sm mb-6">Esta frase guiará todas tus futuras intervenciones.</p>
                    <Link href="/gym">
                        <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-colors uppercase tracking-widest text-xs">
                            Volver al Gimnasio
                        </button>
                    </Link>
                </div>
            )}

        </div>
      </main>
    </div>
  );
}
