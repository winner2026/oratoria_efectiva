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
       if (storedEmail) setUserName(storedEmail.split('@')[0]);
    }
  }, []);

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
        <div className="flex items-center justify-end">
          <button 
            onClick={() => router.push("/my-sessions")}
            className="text-slate-500 dark:text-[#9dabb9] text-sm font-bold leading-normal tracking-wide shrink-0 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Mi Progreso
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center w-full px-6 gap-4">
        
        {/* Tip del Día */}
        {tipOfDay && (
          <div className="w-full max-w-sm bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl p-4 border border-blue-800/50 mb-2">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
                  Tip #{tipNumber}
                </p>
                <p className="text-white text-sm leading-relaxed">
                  {tipOfDay}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Image Section */}
        <div className="w-full flex justify-center py-2">
          <div 
            className="relative w-full aspect-[4/5] max-w-sm overflow-hidden rounded-2xl bg-center bg-cover shadow-xl" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAsg_obJLOwS2nVBOtyH35z-BE2fxyya8Z_uHs6fwCRR9w0XLek0_fyX3ywp93QKIk807iNb4-EVb-a2q78_Ek1GfCkohrsn79KJeka_3GR7eu_mZrap1IuPulOAOdLS9pVlJ1oNewOrLTyUvHVAS8lbEibBg94ziKRczHCzNSfBzPTwZBNwnkmNh6JyXKUJf5mFl1u7xZPC2yXCfSheMNSUHZ2H_X70bdiqPnf1NifFfaGju5unLtCIN7xdO2CNMVcHg0bPx_fh-4")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-dark/20 dark:to-background-dark/50"></div>
            
            {/* Badge overlay si tiene streak alto */}
            {badge && streak && streak.currentStreak >= 7 && (
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/20">
                <span className={`${badge.color} font-bold text-sm`}>
                  {badge.emoji} {badge.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-2 text-center w-full max-w-xs mx-auto">
          <h1 className="text-white tracking-tight text-[28px] sm:text-[32px] font-bold leading-tight uppercase whitespace-nowrap">
            ORATORIA EFECTIVA
          </h1>
          <p className="text-gray-400 text-base font-normal leading-relaxed">
            {streak ? getStreakMessage(streak.currentStreak, practicedToday) : "La herramienta definitiva para mejorar tu confianza al hablar."}
          </p>
        </div>

        {/* PageIndicators */}
        <div className="flex flex-row items-center justify-center gap-2 py-2">
          <div className="h-2 w-6 rounded-full bg-primary transition-all duration-300"></div>
          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-[#3b4754]"></div>
          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-[#3b4754]"></div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full p-6 pt-0 mt-auto">
        <div className="flex flex-col gap-3 w-full max-w-md mx-auto">

          <button
            onClick={() => {
              if (session || userName || localStorage.getItem("user_email")) {
                router.push("/practice");
              } else {
                router.push("/");
              }
            }}
            className={`flex w-full items-center justify-center overflow-hidden rounded-xl h-14 px-5 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg ${
              practicedToday 
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30' 
                : 'bg-primary hover:bg-blue-600 shadow-primary/20'
            }`}
          >
            <span className="mr-2 material-symbols-outlined text-[20px]">mic</span>
            {practicedToday ? "Practicar de nuevo" : "Comenzar ahora"}
            {!practicedToday && streak && streak.currentStreak > 0 && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                +1 🔥
              </span>
            )}
          </button>
          
          <button 
            onClick={() => router.push("/gym")}
            className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-transparent h-12 px-5 text-slate-600 dark:text-slate-400 text-sm font-bold leading-normal tracking-[0.015em] hover:text-white dark:hover:text-white transition-colors border border-slate-700 hover:bg-slate-800"
          >
            <span className="mr-2 text-lg">🏋️</span>
            Gimnasio Vocal
          </button>

          <button 
            onClick={() => router.push("/courses")}
            className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-transparent h-12 px-5 text-slate-600 dark:text-slate-400 text-sm font-bold leading-normal tracking-[0.015em] hover:text-amber-400 dark:hover:text-amber-400 transition-colors border border-slate-700 hover:border-amber-900/50 hover:bg-slate-900"
          >
            <span className="mr-2 text-lg">🗺️</span>
            Ruta del Héroe
          </button>

          <button 
            onClick={() => router.push("/my-sessions")}
            className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 h-12 px-5 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/30"
          >
            <span className="mr-2 text-lg">📈</span>
            Mi Progreso
            {streak && streak.totalDays > 0 && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {streak.totalDays} sesiones
              </span>
            )}
          </button>

          <button 
            onClick={() => router.push("/referrals")}
            className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 h-12 px-5 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-900/30"
          >
            <span className="mr-2 text-lg">🎁</span>
            Invitar Amigos
          </button>
          
          <button 
            onClick={() => router.push("/auth/signin")}
            className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-transparent h-12 px-5 text-slate-600 dark:text-slate-500 text-xs font-bold leading-normal tracking-[0.015em] hover:text-primary dark:hover:text-white transition-colors"
          >
            ¿Ya tienes cuenta? <span className="text-primary ml-1">Inicia sesión</span>
          </button>
        </div>
        {/* Bottom safe area spacer */}
        <div className="h-6 w-full"></div>
      </div>

    </div>
  );
}
