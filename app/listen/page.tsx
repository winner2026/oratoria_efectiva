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

    // Login simulado chequeo
    if (typeof window !== 'undefined') {
       const storedEmail = localStorage.getItem("user_email");
       const storedName = localStorage.getItem("user_name");
       
       if (storedName) {
         setUserName(storedName);
       } else if (storedEmail) {
         setUserName(storedEmail.split('@')[0]);
       }

       // Obtener plan del usuario
       const storedPlan = (localStorage.getItem("user_plan") || "FREE") as PlanType;
       setPlanType(storedPlan);
       
       // Cargar Protocolo del Día con gating
       const currentDay = new Date().getDate(); // MVP: usar día del mes
       const access = getDailyProtocol(storedPlan, currentDay);
       setProtocolAccess(access);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_credits");
      // Redirect to landing
      window.location.href = "/";
    }
  };

  const badge = streak ? getStreakBadge(streak.currentStreak) : null;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col overflow-x-hidden bg-[#050505] pb-24 text-white font-display selection:bg-blue-500/30">

      {/* 🌌 DYNAMIC BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative z-10 flex-col flex h-full">

          {/* TopAppBar: Streak Counter */}
          <div className="flex items-center justify-between p-6 pb-2">
            <div className="flex items-center gap-2">
              {streak && streak.currentStreak > 0 && (
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg shadow-orange-500/5">
                  <span className="text-orange-500 text-xl animate-pulse">🔥</span>
                  <span className="text-white font-black">{streak.currentStreak}</span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">días</span>
                  {badge && <span className={`${badge.color} ml-1`}>{badge.emoji}</span>}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-2">
              {/* UPGRADE BADGE */}
              <Link href="/upgrade" className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all shadow-lg flex items-center gap-2 backdrop-blur-md ${
                planType === 'PREMIUM' ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-blue-500/20' :
                planType === 'STARTER' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-indigo-500/20' :
                'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}>
                <span className="material-symbols-outlined text-[14px]">
                    {planType === 'PREMIUM' ? 'diamond' : planType === 'STARTER' ? 'bolt' : 'lock_open'}
                </span>
                {planType === 'FREE' ? 'Muestra Gratis' : planType}
              </Link>
              
              <button 
                onClick={handleLogout}
                className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                title="Cerrar Sesión"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>

          {/* Main Content - Ultra Focused */}
          <div className="flex flex-1 flex-col items-center justify-center w-full px-6 text-center mt-4">
            
            <div className="space-y-8 max-w-sm w-full animate-fade-in">
              {/* Title & Concept */}
              <div className="space-y-2 text-left pl-1">
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] pl-1">
                  Dashboard Personal
                </span>
                <h1 className="text-white tracking-tight text-3xl sm:text-4xl font-bold leading-tight">
                  Hola, <span className="bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent capitalize">{userName || 'Invitado'}</span>
                </h1>
              </div>

              {/* PROTOCOLO DEL DÍA CARD */}
              {protocolAccess ? (
                protocolAccess.isLocked ? (
                  // 🔒 PAYWALL: Contenido Bloqueado (Glass)
                  <div className="bg-gradient-to-br from-amber-900/10 via-black/40 to-black/40 border border-amber-500/20 rounded-[24px] p-6 text-left relative overflow-hidden backdrop-blur-md group hover:border-amber-500/40 transition-all">
                    <div className="absolute top-0 right-0 bg-amber-600/20 px-3 py-1.5 rounded-bl-2xl backdrop-blur-md border-b border-l border-amber-500/10">
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">lock</span>
                          Día {new Date().getDate()}/30
                        </span>
                    </div>
                    
                    {/* Preview Borroso */}
                    <div className="mb-5 relative mt-2">
                        <div className="absolute inset-0 backdrop-blur-md bg-black/40 z-10 rounded-xl border border-white/5"></div>
                        <div className="opacity-30 blur-[1px]">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{protocolAccess.protocol.phase}</span>
                          <h3 className="text-lg font-bold text-white leading-tight mt-1">{protocolAccess.protocol.title}</h3>
                          <p className="text-slate-400 text-xs leading-relaxed mt-2 font-light">
                            {protocolAccess.protocol.action.substring(0, 60)}...
                          </p>
                        </div>
                    </div>

                    {/* CTA de Conversión */}
                    <div className="space-y-3 relative z-20">
                        <div className="flex items-start gap-2 text-xs text-amber-200/60 font-medium">
                          <span className="material-symbols-outlined text-sm mt-0.5 text-amber-500">stars</span>
                          <p>
                            <strong className="text-amber-400">¡Siguiente Nivel!</strong> Desbloquea el entrenamiento oficial de 30 días.
                          </p>
                        </div>

                        <Link 
                          href="/upgrade" 
                          className="block w-full text-center bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black py-3.5 px-4 rounded-[18px] shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] text-[11px] uppercase tracking-widest"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">workspace_premium</span>
                            Desbloquear Curso
                          </span>
                        </Link>
                    </div>
                  </div>
                ) : (
                  // ✅ DESBLOQUEADO: Mostrar Protocolo (Glass)
                  <div className="relative bg-white/[0.03] border border-white/10 rounded-[28px] p-6 text-left overflow-hidden group hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-sm">
                    {/* Glow effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>

                    <div className="absolute top-0 right-0 bg-white/5 border-l border-b border-white/5 px-3 py-1.5 rounded-bl-2xl">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Día {protocolAccess.protocol.day}/30</span>
                    </div>
                    
                    <div className="mb-4 relative z-10">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border border-white/10 px-2 py-0.5 rounded-full bg-black/20">{protocolAccess.protocol.phase}</span>
                        <h3 className="text-xl font-bold text-white leading-tight mt-3">{protocolAccess.protocol.title}</h3>
                    </div>
                    
                    <p className="text-slate-300 text-sm font-medium leading-relaxed border-l-2 border-blue-500 pl-4 mb-5 italic">
                        "{protocolAccess.protocol.action}"
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-5">
                        <span className="material-symbols-outlined text-base text-blue-500">science</span>
                        <span className="opacity-70 truncate">{protocolAccess.protocol.science}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-4 border-t border-white/5">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-wider mb-2">
                          <span className="text-slate-500">Progreso</span>
                          <span className="text-blue-400">{protocolAccess.completionPercentage}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            style={{ width: `${protocolAccess.completionPercentage}%` }}
                          ></div>
                        </div>
                    </div>
                  </div>
                )
              ) : (
                // Loading state
                <div className="bg-white/5 border border-white/5 rounded-[24px] p-6 animate-pulse h-[200px]"></div>
              )}

              {/* STATS & CTA SECTION */}
              {(planType === 'STARTER' || planType === 'FREE') ? (
                <div className="w-full space-y-6">
                    
                    {/* 1. CIRCULAR STATS (Glass) */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Autoridad */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-4 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm group hover:border-white/10 transition-all">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50"></div>
                            <div className="relative size-20 mb-2 flex items-center justify-center">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out" 
                                          strokeDasharray={`${75}, 100`} 
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                </svg>
                                <span className="absolute text-xl font-black text-white">75</span>
                            </div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Autoridad</span>
                        </div>

                        {/* Fluidez */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-4 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm group hover:border-white/10 transition-all">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 opacity-50"></div>
                            <div className="relative size-20 mb-2 flex items-center justify-center">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" 
                                          strokeDasharray={`${82}, 100`} 
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                </svg>
                                <span className="absolute text-xl font-black text-white">82</span>
                            </div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Fluidez</span>
                        </div>
                    </div>

                    {/* 2. MAIN ACTION BUTTON (Glowing) */}
                    <button
                      onClick={() => router.push("/practice?mode=voice")}
                      className="w-full relative group overflow-hidden rounded-[28px] bg-white text-black p-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-200 to-slate-400 opacity-100 group-hover:scale-105 transition-transform duration-700"></div>
                        <div className="relative flex flex-col items-center gap-3">
                            <div className="size-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                                <span className="material-symbols-outlined text-3xl">mic</span>
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Analizar mi Voz</h2>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">IA en Tiempo Real</p>
                        </div>
                    </button>
                    
                    {/* GYM & WARMUP SECTION */}
                    <div className="grid grid-cols-1 gap-4 w-full">
                        {/* 1. VOCAL GYM (Library) - ALWAYS VISIBLE */}
                        <Link
                          href="/gym"
                          className="group relative flex w-full items-center gap-5 overflow-hidden rounded-[28px] p-6 bg-gradient-to-br from-blue-600/20 to-indigo-900/20 border border-blue-500/30 hover:from-blue-600/30 hover:to-indigo-900/40 transition-all shadow-xl text-left"
                        >
                          <div className="size-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl font-bold">fitness_center</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Biblioteca</span>
                              {planType === 'FREE' && <span className="text-[8px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">365+ Ejercicios</span>}
                            </div>
                            <h3 className="text-white text-lg font-bold">Gimnasio Vocal</h3>
                            <p className="text-slate-500 text-xs font-medium">Buscador y Rutinas diarias.</p>
                          </div>
                          <span className="material-symbols-outlined text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">arrow_forward</span>
                        </Link>

                        {/* 2. WARMUP PIANO */}
                        <Link
                          href="/warmup"
                          className="flex items-center gap-5 overflow-hidden rounded-[24px] p-4 bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all group"
                        >
                          <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-xl">piano</span>
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-white text-xs font-bold uppercase tracking-wider">Calentamiento de Voz</h3>
                            <p className="text-slate-500 text-[10px] font-medium tracking-wide italic">"Afinación y resonancia"</p>
                          </div>
                          <span className="material-symbols-outlined text-slate-700 text-sm group-hover:text-white transition-colors">arrow_forward</span>
                        </Link>
                    </div>

                </div>
              ) : (
                // PREMIUM VIEW
                  <div className="grid grid-cols-1 gap-4 w-full">
                     {/* 1. VOCAL MASTER (Audio Only) */}
                     <button
                       onClick={() => router.push("/practice?mode=voice")}
                       className="group relative flex w-full items-center gap-5 overflow-hidden rounded-[24px] p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all shadow-lg text-left"
                     >
                       <div className="size-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                         <span className="material-symbols-outlined text-3xl font-bold">mic</span>
                       </div>
                       <div className="flex-1">
                         <div className="flex items-center gap-2 mb-0.5">
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Nivel 1</span>
                           <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">Starter</span>
                         </div>
                         <h3 className="text-white text-lg font-bold">Analizador Vocal</h3>
                         <p className="text-slate-500 text-xs font-medium">Tono, ritmo y muletillas.</p>
                       </div>
                       <span className="material-symbols-outlined text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">arrow_forward</span>
                     </button>

                     {/* 2. ELITE PRESENCE (Video + Audio) */}
                     <button
                       onClick={() => router.push("/practice?mode=video")}
                       className="group relative flex w-full items-center gap-5 overflow-hidden rounded-[24px] p-6 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 transition-all shadow-2xl shadow-blue-500/20 text-left border border-white/10"
                     >
                       <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner">
                         <span className="material-symbols-outlined text-3xl font-bold">videocam</span>
                       </div>
                       <div className="flex-1">
                         <div className="flex items-center gap-2 mb-0.5">
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-100/60">Nivel 2</span>
                           <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">Elite</span>
                         </div>
                         <h3 className="text-white text-lg font-bold">Entrenamiento Elite</h3>
                         <p className="text-blue-100/60 text-xs font-medium">Gestos, mirada y postura.</p>
                       </div>
                       {/* Premium Glow Effect */}
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                         <span className="material-symbols-outlined text-6xl">stars</span>
                       </div>
                       <span className="material-symbols-outlined text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all">arrow_forward</span>
                     </button>

                     {/* WARMUP / GYM QUICK ACCESS FOR PREMIUM TOO */}
                     <Link
                       href="/gym"
                       className="group relative flex w-full items-center gap-5 overflow-hidden rounded-[24px] p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all shadow-lg text-left"
                     >
                       <div className="size-14 rounded-2xl bg-green-600/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                         <span className="material-symbols-outlined text-3xl font-bold">fitness_center</span>
                       </div>
                       <div className="flex-1">
                         <h3 className="text-white text-lg font-bold">Gimnasio Vocal</h3>
                         <p className="text-slate-500 text-xs font-medium">Biblioteca de 365+ ejercicios.</p>
                       </div>
                       <span className="material-symbols-outlined text-slate-700 group-hover:text-green-500 group-hover:translate-x-1 transition-all">arrow_forward</span>
                     </Link>
                  </div>
              )}

              {/* Subtle Stats */}
              <div className="pt-6 pb-4 flex items-center justify-center gap-8 border-t border-white/5 opacity-50 hover:opacity-100 transition-opacity">
                 <div className="text-center">
                    <span className="block text-white font-black text-xl mb-1">{streak?.totalDays || 0}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Total</span>
                 </div>
                 <div className="h-8 w-px bg-white/10"></div>
                 <div className="text-center">
                    <span className="block text-white font-black text-xl mb-1">{streak?.currentStreak || 0}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Racha</span>
                 </div>
              </div>

            </div>

          </div>

          {/* Footer subtle link */}
          <div className="w-full pb-8 pt-2 px-6 text-center opacity-30 hover:opacity-100 transition-opacity">
              <Link href="/referrals" className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-white transition-colors">
                Ganar meses gratis
              </Link>
          </div>

      </div>
    </div>
  );
}
