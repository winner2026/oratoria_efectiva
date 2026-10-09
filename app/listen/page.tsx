"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { type CoachingDashboardViewModel } from "@/application/coaching/getCoachingDashboard";

export default function CoachHomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [dashboard, setDashboard] = useState<CoachingDashboardViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = session?.user?.email || 'guest-user';

    fetch(`/api/coaching/dashboard?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setDashboard(res.data);
        }
      })
      .catch((err) => console.error("Error al cargar Coach Home:", err))
      .finally(() => setLoading(false));
  }, [session]);

  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Operador";

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col overflow-x-hidden bg-[#05070A] pb-16 text-white font-display selection:bg-amber-500/30">

      {/* 🌌 DYNAMIC STUDIO BACKGROUND (Warm Gold Accent Top-Right + Deep Navy Bottom-Left) */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] bg-amber-500/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-900/20 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full px-6">

        {/* --- TOP EXECUTIVE BAR --- */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="size-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20 flex items-center justify-center shadow-xl group overflow-hidden">
              <span className="material-symbols-outlined text-amber-400 group-hover:text-amber-300 transition-colors text-xl">person</span>
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Coach Personal</span>
              <h2 className="text-sm font-bold tracking-tight text-white">{userName}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
              Día {dashboard?.progress.currentDay || 1} / 21
            </span>
          </div>
        </header>

        {/* --- MAIN COACH HOME CONTENT --- */}
        <main className="flex-1 space-y-6 pb-10">

          {/* 1. SECCIÓN PRINCIPAL: AUTHORITY INDEX */}
          <section className="bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-amber-500/20 rounded-[32px] p-7 text-center relative overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="absolute top-0 right-0 bg-amber-500/10 px-3 py-1 rounded-bl-2xl border-l border-b border-amber-500/30">
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">TU ENTRENAMIENTO</span>
            </div>

            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">
              AUTHORITY INDEX
            </span>

            <div className="flex items-baseline justify-center gap-3 my-1">
              <span className="text-6xl font-black tracking-tighter text-white">
                {loading ? "--" : dashboard?.authorityIndex || 50}
              </span>
              {dashboard && dashboard.scoreDelta !== 0 && (
                <span className={`text-sm font-bold px-2.5 py-1 rounded-full border ${
                  dashboard.scoreDelta > 0 
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {dashboard.scoreDelta > 0 ? `↑ +${dashboard.scoreDelta}` : `↓ ${dashboard.scoreDelta}`} esta semana
                </span>
              )}
            </div>

            <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto mt-2 leading-relaxed">
              Índice compuesto basado en estabilidad de señal, pausas estratégicas y fluidez.
            </p>
          </section>

          {/* 2. FOCUS LOCK: TU FOCO ACTUAL */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-1.5">
                <span>🎯</span> TU FOCO ACTUAL
              </h3>
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Focus Lock
              </span>
            </div>

            <div className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 space-y-3 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <h4 className="text-xl font-black text-white uppercase tracking-tight">
                {loading ? "Cargando foco..." : dashboard?.currentFocus.title}
              </h4>
              
              <p className="text-slate-300 text-xs font-medium leading-relaxed italic border-l-2 border-amber-500 pl-3">
                "{loading ? "Analizando patrones vocales..." : dashboard?.currentFocus.explanation}"
              </p>

              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold pt-1">
                Las demás métricas están siendo monitoreadas automáticamente.
              </p>
            </div>
          </section>

          {/* 3. MISIÓN DE HOY (BOTÓN PRINCIPAL) */}
          <section className="pt-2">
            <div className="flex items-center justify-between px-1 mb-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-1.5">
                <span>🏋️</span> MISIÓN DE HOY
              </h3>
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Prescripción Adaptativa
              </span>
            </div>

            <div className="bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 text-slate-950 rounded-[32px] p-7 shadow-[0_0_50px_-10px_rgba(245,158,11,0.3)] space-y-5 relative overflow-hidden group border border-amber-300/40">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-900 text-[10px] font-bold uppercase tracking-widest">
                  <span>{dashboard?.todayMission.durationMinutes || 3} minutos</span>
                  <span>Nivel {dashboard?.todayMission.level || 1}</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-950 leading-tight">
                  {loading ? "Preparando misión..." : dashboard?.todayMission.title}
                </h3>
                <p className="text-slate-900/80 text-xs font-semibold leading-relaxed">
                  {dashboard?.todayMission.description}
                </p>
              </div>

              <button
                onClick={() => router.push(dashboard?.todayMission.customRoute || "/practice")}
                className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl group-hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
              >
                <span className="material-symbols-outlined text-xl text-amber-400">play_arrow</span>
                Comenzar Entrenamiento
              </button>
            </div>
          </section>

          {/* 4. TU PROGRESO & SIGUIENTE OBJETIVO */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Gráfico / Trayectoria de Progreso */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-6 space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5">
                <span>📈</span> TU PROGRESO
              </h4>
              <div className="flex items-center gap-2 pt-1">
                {dashboard?.progress.history.slice(-4).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-white">{item.score}</span>
                      <span className="text-[9px] text-slate-500 font-bold">{item.date}</span>
                    </div>
                    {idx < (dashboard?.progress.history.slice(-4).length - 1) && (
                      <span className="text-amber-500/60 text-xs font-bold">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Próximo Objetivo */}
            {dashboard?.nextGoal && (
              <div className="bg-white/[0.03] border border-white/10 rounded-[28px] p-6 space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5">
                  <span>🔓</span> PRÓXIMO OBJETIVO
                </h4>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-white uppercase">{dashboard.nextGoal.title}</h5>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-1000" 
                      style={{ width: `${dashboard.nextGoal.progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-amber-400 tracking-wider block text-right pt-1">
                    {dashboard.nextGoal.progressPercentage}% completado
                  </span>
                </div>
              </div>
            )}

          </section>

        </main>
      </div>
    </div>
  );
}
