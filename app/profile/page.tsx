'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  credits: number;
  plan: string;
  totalUsage: number;
  subscriptionStatus?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      router.push("/");
      return;
    }

    // Fetch real-time data from DB to verify usage
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setUser(data);
      })
      .catch(err => {
         console.error("Error loading profile:", err);
         // Fallback basic info
         const name = localStorage.getItem("user_name") || "Agente Anónimo";
         const email = localStorage.getItem("user_email") || "ID Desconocido";
         setUser({ 
             name, 
             email, 
             credits: parseInt(localStorage.getItem("user_credits") || "0"), 
             plan: "FREE", 
             totalUsage: 0 
         });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    if (confirm("¿Confirmar desconexión de red segura?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const handleManageSubscription = () => {
      router.push("/upgrade");
  };

  // 🛡️ PLAN MAPPING
  const getPlanLabel = (plan: string) => {
    if (plan === 'STARTER') return 'ACCESO BÁSICO';
    if (plan === 'PREMIUM' || plan === 'ELITE') return 'RANGO PROFESIONAL';
    return 'ACCESO GRATUITO';
  };

  const getPlanColor = (plan: string) => {
    if (plan === 'STARTER') return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
    if (plan === 'PREMIUM' || plan === 'ELITE') return 'text-amber-500 border-amber-500/50 bg-amber-500/10';
    return 'text-slate-500 border-slate-700 bg-slate-800/50';
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-slate-500 text-xs font-mono uppercase animate-pulse">Cargando perfil...</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-display pb-32 selection:bg-blue-500/30">
        
      {/* 🌌 BACKGROUND FX */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-800/20 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="p-6 relative z-10 flex items-center justify-between border-b border-white/5 backdrop-blur-sm sticky top-0">
        <Link href="/listen" className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95">
             <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div className="text-right">
             <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Perfil</h2>
             <p className="text-sm font-bold font-mono tracking-tighter text-white">#{user.email.split('@')[0].toUpperCase()}</p>
        </div>
      </header>

      <div className="p-6 space-y-10 max-w-md mx-auto relative z-10">
        
        {/* ID CARD */}
        <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${user.plan === 'ELITE' || user.plan === 'PREMIUM' ? 'from-amber-500/20 to-orange-500/20' : 'from-blue-500/20 to-purple-500/20'} blur-xl rounded-3xl opacity-50`}></div>
            <div className="relative bg-[#0A0F14] border border-white/10 rounded-[24px] p-6 overflow-hidden">
                <div className="flex items-start justify-between mb-8">
                    <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-2xl font-black text-slate-400">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getPlanColor(user.plan)}`}>
                        {getPlanLabel(user.plan)}
                    </div>
                </div>
                
                <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Identidad del Usuario</p>
                    <h1 className="text-2xl font-black text-white">{user.name}</h1>
                    <p className="text-sm text-slate-400 font-mono">{user.email}</p>
                </div>

                {/* DECORATIVE BARCODE */}
                <div className="mt-6 flex gap-1 opacity-20">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="h-4 w-1 bg-white" style={{ opacity: Math.random() }}></div>
                    ))}
                </div>
            </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0F1318] border border-white/5 p-5 rounded-[20px] flex flex-col justify-between h-32 hover:border-blue-500/30 transition-colors group">
                <div className="p-2 bg-blue-500/10 w-fit rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-lg">mic</span>
                </div>
                <div>
                     <span className="text-3xl font-black text-white block">{user.totalUsage}</span>
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Prácticas (Total)</span>
                </div>
            </div>
            
            <div className="bg-[#0F1318] border border-white/5 p-5 rounded-[20px] flex flex-col justify-between h-32 hover:border-emerald-500/30 transition-colors group">
                <div className="p-2 bg-emerald-500/10 w-fit rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-lg">bolt</span>
                </div>
                <div>
                     <span className="text-3xl font-black text-white block">{user.credits}</span>
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Créditos</span>
                </div>
                {user.plan === 'FREE' && (
                    <Link href="/upgrade" className="absolute top-4 right-4 text-emerald-500 animate-pulse">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                    </Link>
                )}
            </div>
        </div>


        {/* SETTINGS LIST */}
        <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">Configuración</h3>
            
            <button 
               onClick={handleManageSubscription}
               className="w-full flex items-center justify-between p-5 bg-[#0F1318] border border-white/5 rounded-[20px] hover:bg-white/5 transition-all group active:scale-[0.98]"
            >
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">credit_card</span>
                    </div>
                    <div className="text-left">
                        <span className="text-sm font-bold text-slate-200 block group-hover:text-white">Suscripción</span>
                        <span className="text-[10px] text-slate-500 font-medium">Gestionar plan y facturación</span>
                    </div>
                </div>
                <span className="material-symbols-outlined text-slate-600">chevron_right</span>
            </button>

            {/* AUDITORÍA (Locked for FREE) */}
            <button 
               onClick={() => router.push(user.plan === 'FREE' ? '/upgrade' : '/my-sessions')}
               className={`w-full flex items-center justify-between p-5 border rounded-[20px] transition-all group active:scale-[0.98] ${
                   user.plan === 'FREE' 
                   ? 'bg-[#0F1318]/50 border-slate-800' 
                   : 'bg-[#0F1318] border-white/5 hover:bg-white/5'
               }`}
            >
                <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center transition-colors relative ${
                        user.plan === 'FREE' ? 'bg-slate-900 text-slate-600' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                    }`}>
                        <span className="material-symbols-outlined">query_stats</span>
                        {user.plan === 'FREE' && (
                            <div className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-slate-700 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[10px] text-slate-500">lock</span>
                            </div>
                        )}
                    </div>
                    <div className="text-left">
                        <span className={`text-sm font-bold block ${user.plan === 'FREE' ? 'text-slate-500' : 'text-slate-200 group-hover:text-white'}`}>
                             {user.plan === 'FREE' ? 'Mis Sesiones (Bloqueado)' : 'Mis Sesiones'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                            {user.plan === 'FREE' ? 'Requiere Plan Profesional' : 'Historial y métricas'}
                        </span>
                    </div>
                </div>
                <span className="material-symbols-outlined text-slate-600">chevron_right</span>
            </button>

            <button 
               onClick={() => router.push('/gym')}
               className="w-full flex items-center justify-between p-5 bg-[#0F1318] border border-white/5 rounded-[20px] hover:bg-white/5 transition-all group active:scale-[0.98]"
            >
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">fitness_center</span>
                    </div>
                    <div className="text-left">
                        <span className="text-sm font-bold text-slate-200 block group-hover:text-white">Gimnasio Vocal</span>
                        <span className="text-[10px] text-slate-500 font-medium">Ejercicios de práctica</span>
                    </div>
                </div>
                <span className="material-symbols-outlined text-slate-600">chevron_right</span>
            </button>
        </section>

        {/* DANGER ZONE (Minimalist) */}
        <div className="pt-8 border-t border-white/5 flex justify-between items-center">
            <button onClick={handleLogout} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">power_settings_new</span>
                Cerrar Sesión
            </button>
            <a href="mailto:soporte@oratoriaefectiva.in" className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">
                Soporte
            </a>
        </div>

      </div>
    </main>
  );
}
