"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getStreakData, getStreakBadge, getStreakMessage, hasPracticedToday, type StreakData } from "@/lib/streaks/streakSystem";
import { getDailyProtocol, type DailyProtocol } from "@/lib/tips/dailyTips";

export default function ListenPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Estado local para usuario simulado o sesión real
  const [userName, setUserName] = useState<string | null>(null);
  
  // Estado para streak y tip (se cargan en cliente)
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [practicedToday, setPracticedToday] = useState(false);
  
  // Nuevo Estado: Protocolo Diario
  const [protocol, setProtocol] = useState<DailyProtocol>({
    day: 1,
    phase: "HARDWARE",
    title: "Cargando...",
    action: "Sincronizando...",
    science: ""
  });

  const [planType, setPlanType] = useState<string>("FREE");

  useEffect(() => {
    // Cargar datos del streak desde localStorage
    const streakData = getStreakData();
    setStreak(streakData);
    setPracticedToday(hasPracticedToday());
    
    // Cargar Protocolo del Día
    setProtocol(getDailyProtocol());

    // Login simulado chequeo
    if (typeof window !== 'undefined') {
       const storedEmail = localStorage.getItem("user_email");
       const storedName = localStorage.getItem("user_name");
       
       if (storedName) {
         setUserName(storedName);
       } else if (storedEmail) {
         setUserName(storedEmail.split('@')[0]);
       }

       // Simulación de plan para demo (o fetch real si hubiera API)
       const storedPlan = localStorage.getItem("user_plan") || "FREE";
       setPlanType(storedPlan);
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
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-full flex-col overflow-x-hidden bg-slate-950 pb-24">

      {/* TopAppBar: Streak Counter */}
      <div className="flex items-center justify-between p-4 pt-6 pb-2">
        <div className="flex items-center gap-2">
          {streak && streak.currentStreak > 0 && (
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-slate-700">
              <span className="text-orange-500 text-xl">🔥</span>
              <span className="text-white font-bold">{streak.currentStreak}</span>
              <span className="text-slate-400 text-sm">días</span>
              {badge && <span className={`${badge.color} ml-1`}>{badge.emoji}</span>}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-2">
          <Link href="/upgrade" className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all shadow-lg ${
            planType === 'PREMIUM' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-blue-500/10' :
            planType === 'STARTER' ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-amber-500/10' :
            planType === 'COACHING' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-purple-500/10' :
            'bg-slate-800 border-slate-700 text-slate-500'
          }`}>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
              {planType}
            </span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="size-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all"
            title="Cerrar Sesión"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>

      {/* Main Content - Ultra Focused */}
      <div className="flex flex-1 flex-col items-center justify-center w-full px-6 text-center">
        
        <div className="space-y-6 max-w-xs animate-fade-in">
          {/* Title & Concept */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-primary text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
                Dashboard
              </span>
              <h1 className="text-white tracking-tight text-3xl sm:text-5xl font-black leading-tight">
                ¡Hola, <span className="capitalize">{userName || 'Santiago'}</span>! 👋
              </h1>
            </div>

            {/* PROTOCOLO DEL DÍA CARD */}
            <div className="bg-[#161B22] border border-blue-500/30 rounded-2xl p-4 text-left relative overflow-hidden group hover:border-blue-500/60 transition-colors">
               <div className="absolute top-0 right-0 bg-blue-600/20 px-2 py-1 rounded-bl-lg">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Día {protocol.day}/30</span>
               </div>
               
               <div className="mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{protocol.phase}</span>
                  <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{protocol.title}</h3>
               </div>
               
               <p className="text-gray-400 text-xs leading-relaxed border-l-2 border-blue-500 pl-3 mb-3">
                  "{protocol.action}"
               </p>

               <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <span className="material-symbols-outlined text-sm">science</span>
                  <span className="opacity-70 truncate">{protocol.science}</span>
               </div>
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="pt-4 grid grid-cols-1 gap-4 w-full">
            {/* 1. VOCAL MASTER (Audio Only) */}
            <button
              onClick={() => router.push("/practice?mode=voice")}
              className="group relative flex w-full items-center gap-5 overflow-hidden rounded-3xl p-6 bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all shadow-xl text-left"
            >
              <div className="size-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl font-bold">mic</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Nivel 1</span>
                   <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">Starter</span>
                </div>
                <h3 className="text-white text-lg font-bold">Analizador Vocal</h3>
                <p className="text-slate-500 text-xs font-medium">Tono, ritmo y muletillas.</p>
              </div>
              <span className="material-symbols-outlined text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">arrow_forward</span>
            </button>

            {/* 2. ELITE PRESENCE (Video + Audio) */}
            <button
              onClick={() => router.push("/practice")}
              className="group relative flex w-full items-center gap-5 overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 transition-all shadow-2xl shadow-blue-500/20 text-left border border-white/10"
            >
              <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner">
                <span className="material-symbols-outlined text-3xl font-bold">videocam</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60">Nivel 2</span>
                   <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">Elite</span>
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
          </div>

          {/* Subtle Stats / Info */}
          <div className="pt-4 flex items-center justify-center gap-6">
             <div className="text-center">
                <span className="block text-white font-bold text-lg">{streak?.totalDays || 0}</span>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Sesiones</span>
             </div>
             <div className="h-8 w-px bg-slate-800"></div>
             <div className="text-center">
                <span className="block text-white font-bold text-lg">{streak?.currentStreak || 0}</span>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Racha 🔥</span>
             </div>
          </div>
        </div>

      </div>

      {/* Footer subtle link */}
      <div className="w-full pb-8 pt-4 px-6 text-center opacity-40 hover:opacity-100 transition-opacity">
          <Link href="/referrals" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Invitar amigos y ganar premios
          </Link>
      </div>

    </div>
  );
}
