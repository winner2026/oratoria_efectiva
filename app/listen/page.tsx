"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getStreakData, getStreakBadge, getStreakMessage, hasPracticedToday, type StreakData } from "@/lib/streaks/streakSystem";
import { getDailyProtocol, getProtocolStats, type ProtocolAccess } from "@/lib/tips/dailyTips";
import { type PlanType } from "@/types/Plan";

export default function ListenPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Estado local para usuario simulado o sesión real
  const [userName, setUserName] = useState<string | null>(null);
  
  // Estado para streak y tip (se cargan en cliente)
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [practicedToday, setPracticedToday] = useState(false);
  
  // Nuevo Estado: Protocolo Diario con Gating
  const [protocolAccess, setProtocolAccess] = useState<ProtocolAccess | null>(null);

  const [planType, setPlanType] = useState<PlanType>("FREE");

  useEffect(() => {
    // Cargar datos del streak desde localStorage
    const streakData = getStreakData();
    setStreak(streakData);
    setPracticedToday(hasPracticedToday());

    if (session?.user) {
      setUserName(session.user.name || session.user.email?.split('@')[0] || 'Operador');
      
      // Obtener plan del usuario (esto debería venir de la sesión o API en el futuro)
      const storedPlan = (localStorage.getItem("user_plan") || "FREE") as PlanType;
      setPlanType(storedPlan);
      
      // Cargar Protocolo del Día con gating
      const currentDay = new Date().getDate(); 
      const access = getDailyProtocol(storedPlan, currentDay);
      setProtocolAccess(access);
    }
  }, [session]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear(); // Limpiamos todo por seguridad
      window.location.href = "/";
    }
  };

  const badge = streak ? getStreakBadge(streak.currentStreak) : null;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col overflow-x-hidden bg-[#050505] pb-12 text-white font-display selection:bg-blue-500/30">

      {/* 🌌 DYNAMIC BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full px-6">

          {/* --- TOP EXECUTIVE BAR --- */}
          <header className="flex items-center justify-between py-8">
            <div className="flex items-center gap-3">
               <Link href="/profile" className="size-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center shadow-2xl relative group overflow-hidden">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors">person</span>
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </Link>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/80">Estatus: {planType}</span>
                  <h2 className="text-sm font-bold tracking-tight text-white">{userName || 'Operador'}</h2>
               </div>
            </div>

            <div className="flex items-center gap-2">
               {streak && streak.currentStreak > 0 && (
                 <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
                   <span className="text-orange-500 text-sm">🔥</span>
                   <span className="text-white text-xs font-black">{streak.currentStreak}</span>
                 </div>
               )}
               <button 
                onClick={handleLogout}
                className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"
               >
                 <span className="material-symbols-outlined text-[18px]">logout</span>
               </button>
            </div>
          </header>

          {/* --- MAIN DASHBOARD CONTENT --- */}
          <main className="flex-1 space-y-8 pb-10">
            
            {/* 1. PROTOCOLO DEL DÍA (Misión Actual) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Misión Diaria</h3>
                 {protocolAccess && !protocolAccess.isLocked && (
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full">En Curso</span>
                 )}
              </div>

              {protocolAccess && (
                protocolAccess.isLocked ? (
                  <div className="bg-gradient-to-br from-amber-900/10 to-black/40 border border-amber-500/20 rounded-[28px] p-6 relative overflow-hidden backdrop-blur-md">
                    {planType !== 'FREE' && (
                        <div className="absolute top-0 right-0 bg-amber-600/20 px-3 py-1 rounded-bl-2xl border-l border-b border-amber-500/10">
                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Día {new Date().getDate()}/30</span>
                        </div>
                    )}
                    <div className="opacity-30 blur-[1px] mb-4">
                        <h3 className="text-lg font-bold text-white leading-tight">Misión Bloqueada</h3>
                        <p className="text-slate-500 text-xs mt-1">Requiere actualización de estatus.</p>
                    </div>
                    <Link href="/upgrade" className="block w-full py-4 bg-amber-600 text-white text-center font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                       Desbloquear Pase Elite
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-6 relative overflow-hidden backdrop-blur-sm group hover:bg-white/[0.05] transition-all">
                    {planType !== 'FREE' && (
                        <div className="absolute top-0 right-0 bg-blue-600/10 px-3 py-1 rounded-bl-2xl border-l border-b border-blue-500/10">
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Día {protocolAccess.protocol.day}/30</span>
                        </div>
                    )}
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">{protocolAccess.protocol.phase}</span>
                    <h3 className="text-xl font-black text-white leading-tight mb-3">{protocolAccess.protocol.title}</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed italic border-l border-blue-500/50 pl-4 mb-5">
                        "{protocolAccess.protocol.action}"
                    </p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${protocolAccess.completionPercentage}%` }}></div>
                    </div>
                  </div>
                )
              )}
            </section>

            {/* 2. TRIGGER PRINCIPAL (Escanear Autoridad) */}
            <section className="pt-4">
              <button 
                onClick={() => router.push("/practice?mode=voice")}
                className="w-full relative group overflow-hidden rounded-[32px] bg-white text-black py-10 shadow-2xl transition-all active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-100 to-slate-300"></div>
                <div className="relative flex flex-col items-center gap-4">
                   <div className="size-16 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-4xl">mic</span>
                   </div>
                   <div className="space-y-1">
                      <h2 className="text-2xl font-black uppercase tracking-tighter">Escanear Autoridad</h2>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">IA Performance Radar</p>
                   </div>
                </div>
              </button>
            </section>

            {/* 3. NAVEGACIÓN SECUNDARIA (GRID) */}
            <section className="grid grid-cols-2 gap-4">
               {/* Centro de Auditoría */}
               <Link href="/my-sessions" className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 hover:bg-white/5 transition-all group">
                  <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                     <span className="material-symbols-outlined text-2xl">query_stats</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Auditoría</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Historial de sesiones.</p>
               </Link>

               {/* Arsenal Pro */}
               <Link href="/gym" className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 hover:bg-white/5 transition-all group">
                  <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                     <span className="material-symbols-outlined text-2xl">fitness_center</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Arsenal</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Ejercicios tácticos.</p>
               </Link>

               {/* Ruta de Maestría */}
               <Link href="/courses" className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 hover:bg-white/5 transition-all group">
                  <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                     <span className="material-symbols-outlined text-2xl">school</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Cursos</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Protocolos Maestros.</p>
               </Link>

               {/* SOS Feedback (Nuevo Slot) */}
               <Link href="/sos" className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 hover:bg-white/5 transition-all group">
                  <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                     <span className="material-symbols-outlined text-2xl">emergency</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">SOS</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Ayuda inmediata.</p>
               </Link>
            </section>

            {/* 4. FOOTER / REFERRAL */}
            <div className="pt-6 text-center">
               <Link href="/referrals" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-blue-400 transition-colors">
                  Invitar Colegas • Ganar Créditos
               </Link>
            </div>

          </main>
      </div>
    </div>
  );
}
