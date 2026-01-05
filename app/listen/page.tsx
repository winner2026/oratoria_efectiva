"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getStreakData, getStreakBadge, getStreakMessage, hasPracticedToday, type StreakData } from "@/lib/streaks/streakSystem";
import { getTipOfTheDay, getTipNumber } from "@/lib/tips/dailyTips";

export default function ListenPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Estado local para usuario simulado o sesión real
  const [userName, setUserName] = useState<string | null>(null);
  
  // Estado para streak y tip (se cargan en cliente)
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [practicedToday, setPracticedToday] = useState(false);
  const [tipOfDay, setTipOfDay] = useState<string>("");
  const [tipNumber, setTipNumber] = useState<number>(1);
  const [planType, setPlanType] = useState<string>("FREE");

  useEffect(() => {
    // Cargar datos del streak desde localStorage
    const streakData = getStreakData();
    setStreak(streakData);
    setPracticedToday(hasPracticedToday());
    setTipOfDay(getTipOfTheDay());
    setTipNumber(getTipNumber());

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
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-slate-950 pb-24">

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
                ¡Hola, <span className="capitalize">{userName || 'Orador'}</span>! 👋
              </h1>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed px-4 max-w-[280px] mx-auto">
              {streak ? getStreakMessage(streak.currentStreak, practicedToday) : "Mejora tu impacto al hablar con inteligencia artificial."}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-8">
            <button
              onClick={() => {
                if (session || userName || localStorage.getItem("user_email")) {
                  router.push("/practice");
                } else {
                  router.push("/");
                }
              }}
              className={`group relative flex w-full items-center justify-center overflow-hidden rounded-3xl h-24 px-8 text-white text-xl font-black leading-normal tracking-wider transition-all shadow-2xl ${
                practicedToday 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40' 
                  : 'bg-primary hover:bg-blue-600 shadow-primary/40'
              }`}
            >
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <span className="mr-4 material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">mic</span>
              <div className="text-left leading-tight">
                <span className="block">{practicedToday ? "Practicar" : "Comenzar"}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-60">Sesión de hoy</span>
              </div>
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
