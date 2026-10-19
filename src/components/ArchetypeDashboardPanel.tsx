"use client";

import React, { useMemo } from "react";
import { calculateVoiceArchetype, VoiceArchetype } from "@/domain/archetype/ArchetypeEngine";

interface ArchetypeDashboardProps {
  answers: Record<string, string>;
  currentStepIndex: number;
  className?: string;
  showTopPills?: boolean;
}

interface DimensionData {
  id: string;
  name: string;
  shortLabel: string;
  max: number;
  currentVal: number;
  ratioText: string;
  percent: number;
  grade: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  dotColor: string;
  dotGlow: string;
  gradientClass: string;
  glowClass: string;
  tx: number;
  ty: number;
  labelColor: string;
  rayStroke: string;
  x: number;
  y: number;
}

export default function ArchetypeDashboardPanel({
  answers,
  currentStepIndex,
  className = "",
  showTopPills = false,
}: ArchetypeDashboardProps) {
  const answeredCount = Object.keys(answers).length;
  const isUnanswered = answeredCount === 0;

  // Progreso dinámico: si no ha respondido nada, el progreso es exactamente 0
  const progressRatio = isUnanswered ? 0 : Math.min(1, answeredCount / 12);

  // Clasificación dinámica del Arquetipo de Voz según las elecciones actuales del usuario
  const activeArchetype: VoiceArchetype = useMemo(() => {
    return calculateVoiceArchetype(answers);
  }, [answers]);

  // Geometría del Radar: Centro en (110, 115)
  const cx = 110;
  const cy = 115;

  // 5 Dimensiones Acústicas Forenses:
  // Si no se ha respondido nada, TODOS parten desde 0 y en gris absoluto.
  const dimensions: DimensionData[] = useMemo(() => {
    const arc = activeArchetype;

    if (isUnanswered) {
      return [
        {
          id: "consistency",
          name: "Consistencia Vocal",
          shortLabel: "CONS",
          max: 20,
          currentVal: 0,
          ratioText: "0/20",
          percent: 0,
          grade: "-",
          badgeBg: "bg-slate-900/60",
          badgeBorder: "border-white/5",
          badgeText: "text-slate-600",
          dotColor: "#475569",
          dotGlow: "transparent",
          gradientClass: "from-slate-700/40 to-slate-800/40",
          glowClass: "",
          tx: 110,
          ty: 16,
          labelColor: "#64748b",
          rayStroke: "rgba(255, 255, 255, 0.03)",
          x: cx,
          y: cy,
        },
        {
          id: "clarity",
          name: "Claridad & Articulación",
          shortLabel: "CLAR",
          max: 17,
          currentVal: 0,
          ratioText: "0/17",
          percent: 0,
          grade: "-",
          badgeBg: "bg-slate-900/60",
          badgeBorder: "border-white/5",
          badgeText: "text-slate-600",
          dotColor: "#475569",
          dotGlow: "transparent",
          gradientClass: "from-slate-700/40 to-slate-800/40",
          glowClass: "",
          tx: 208,
          ty: 89,
          labelColor: "#64748b",
          rayStroke: "rgba(255, 255, 255, 0.03)",
          x: cx,
          y: cy,
        },
        {
          id: "rhythm",
          name: "Ritmo & Capacidad de Pausa",
          shortLabel: "RITM",
          max: 25,
          currentVal: 0,
          ratioText: "0/25",
          percent: 0,
          grade: "-",
          badgeBg: "bg-slate-900/60",
          badgeBorder: "border-white/5",
          badgeText: "text-slate-600",
          dotColor: "#475569",
          dotGlow: "transparent",
          gradientClass: "from-slate-700/40 to-slate-800/40",
          glowClass: "",
          tx: 172,
          ty: 201,
          labelColor: "#64748b",
          rayStroke: "rgba(255, 255, 255, 0.03)",
          x: cx,
          y: cy,
        },
        {
          id: "authority",
          name: "Peso & Tono de Autoridad",
          shortLabel: "PESO",
          max: 15,
          currentVal: 0,
          ratioText: "0/15",
          percent: 0,
          grade: "-",
          badgeBg: "bg-slate-900/60",
          badgeBorder: "border-white/5",
          badgeText: "text-slate-600",
          dotColor: "#475569",
          dotGlow: "transparent",
          gradientClass: "from-slate-700/40 to-slate-800/40",
          glowClass: "",
          tx: 11,
          ty: 89,
          labelColor: "#64748b",
          rayStroke: "rgba(255, 255, 255, 0.03)",
          x: cx,
          y: cy,
        },
        {
          id: "regulation",
          name: "Regulación Neuro-Vocal",
          shortLabel: "REG",
          max: 15,
          currentVal: 0,
          ratioText: "0/15",
          percent: 0,
          grade: "-",
          badgeBg: "bg-slate-900/60",
          badgeBorder: "border-white/5",
          badgeText: "text-slate-600",
          dotColor: "#475569",
          dotGlow: "transparent",
          gradientClass: "from-slate-700/40 to-slate-800/40",
          glowClass: "",
          tx: 48,
          ty: 201,
          labelColor: "#64748b",
          rayStroke: "rgba(255, 255, 255, 0.03)",
          x: cx,
          y: cy,
        },
      ];
    }

    // Cuando el usuario ya seleccionó al menos una respuesta:
    const v1 = Math.max(1, Math.round(arc.coreDimensions.consistency * progressRatio));
    const v2 = Math.max(1, Math.round(arc.coreDimensions.clarity * progressRatio));
    const v3 = Math.max(1, Math.round(arc.coreDimensions.rhythm * progressRatio));
    const v4 = Math.max(1, Math.round(arc.coreDimensions.authority * progressRatio));
    const v5 = Math.max(1, Math.round(arc.coreDimensions.regulation * progressRatio));

    const r1 = Math.min(1, v1 / 20);
    const r2 = Math.min(1, v2 / 17);
    const r3 = Math.min(1, v3 / 25);
    const r4 = Math.min(1, v4 / 15);
    const r5 = Math.min(1, v5 / 15);

    const getGrade = (val: number, max: number) => {
      const p = val / max;
      if (p >= 0.88) return "A+";
      if (p >= 0.8) return "A";
      if (p >= 0.68) return "B";
      if (p >= 0.5) return "C";
      return "D";
    };

    return [
      {
        id: "consistency",
        name: "Consistencia Vocal",
        shortLabel: "CONS",
        max: 20,
        currentVal: v1,
        ratioText: `${v1}/20`,
        percent: Math.round(r1 * 100),
        grade: getGrade(v1, 20),
        badgeBg: "bg-emerald-950/80",
        badgeBorder: "border-emerald-500/40",
        badgeText: "text-emerald-400",
        dotColor: "#10b981",
        dotGlow: "#34d399",
        gradientClass: "from-emerald-500 to-emerald-300",
        glowClass: "glow-emerald",
        tx: 110,
        ty: 16,
        labelColor: "#34d399",
        rayStroke: "#10b981",
        x: Math.round(cx + 0 * r1),
        y: Math.round(cy - 90 * r1),
      },
      {
        id: "clarity",
        name: "Claridad & Articulación",
        shortLabel: "CLAR",
        max: 17,
        currentVal: v2,
        ratioText: `${v2}/17`,
        percent: Math.round(r2 * 100),
        grade: getGrade(v2, 17),
        badgeBg: "bg-cyan-950/80",
        badgeBorder: "border-cyan-500/40",
        badgeText: "text-cyan-300",
        dotColor: "#06b6d4",
        dotGlow: "#22d3ee",
        gradientClass: "from-cyan-500 to-teal-300",
        glowClass: "glow-cyan",
        tx: 208,
        ty: 89,
        labelColor: "#22d3ee",
        rayStroke: "#06b6d4",
        x: Math.round(cx + 86 * r2),
        y: Math.round(cy - 28 * r2),
      },
      {
        id: "rhythm",
        name: "Ritmo & Capacidad de Pausa",
        shortLabel: "RITM",
        max: 25,
        currentVal: v3,
        ratioText: `${v3}/25`,
        percent: Math.round(r3 * 100),
        grade: getGrade(v3, 25),
        badgeBg: "bg-sky-950/80",
        badgeBorder: "border-sky-500/40",
        badgeText: "text-sky-400",
        dotColor: "#3b82f6",
        dotGlow: "#60a5fa",
        gradientClass: "from-blue-500 to-sky-400",
        glowClass: "glow-blue",
        tx: 172,
        ty: 201,
        labelColor: "#60a5fa",
        rayStroke: "#3b82f6",
        x: Math.round(cx + 53 * r3),
        y: Math.round(cy + 73 * r3),
      },
      {
        id: "authority",
        name: "Peso & Tono de Autoridad",
        shortLabel: "PESO",
        max: 15,
        currentVal: v4,
        ratioText: `${v4}/15`,
        percent: Math.round(r4 * 100),
        grade: getGrade(v4, 15),
        badgeBg: "bg-amber-950/80",
        badgeBorder: "border-amber-500/40",
        badgeText: "text-amber-400",
        dotColor: "#f59e0b",
        dotGlow: "#fbbf24",
        gradientClass: "from-orange-500 to-amber-400",
        glowClass: "glow-orange",
        tx: 11,
        ty: 89,
        labelColor: "#fbbf24",
        rayStroke: "#f59e0b",
        x: Math.round(cx - 86 * r4),
        y: Math.round(cy - 28 * r4),
      },
      {
        id: "regulation",
        name: "Regulación Neuro-Vocal",
        shortLabel: "REG",
        max: 15,
        currentVal: v5,
        ratioText: `${v5}/15`,
        percent: Math.round(r5 * 100),
        grade: getGrade(v5, 15),
        badgeBg: "bg-rose-950/80",
        badgeBorder: "border-rose-500/40",
        badgeText: "text-rose-400",
        dotColor: "#f43f5e",
        dotGlow: "#f43f5e",
        gradientClass: "from-rose-600 to-red-400",
        glowClass: "glow-red",
        tx: 48,
        ty: 201,
        labelColor: "#fb7185",
        rayStroke: "#f43f5e",
        x: Math.round(cx - 53 * r5),
        y: Math.round(cy + 73 * r5),
      },
    ];
  }, [answers, progressRatio, isUnanswered, activeArchetype, cx, cy]);

  // Puntuación Global: exactamente 0 si no se ha respondido nada
  const totalScore = useMemo(() => {
    if (isUnanswered) return 0;
    const raw = dimensions.reduce((acc, d) => acc + d.currentVal, 0);
    return Math.min(100, Math.max(1, Math.round(raw)));
  }, [dimensions, isUnanswered]);

  // Offset para el medidor circular de 100 puntos (circunferencia = 2 * PI * 40 ≈ 251.2)
  const circleCircumference = 251.2;
  const strokeDashoffset = isUnanswered
    ? circleCircumference
    : Math.round((circleCircumference - (circleCircumference * totalScore) / 100) * 10) / 10;

  // Puntos del polígono de arquetipo en orden perimetral: CONS -> CLAR -> RITM -> REG -> PESO
  const polygonPoints = useMemo(() => {
    if (isUnanswered) {
      return `${cx},${cy} ${cx},${cy} ${cx},${cy} ${cx},${cy} ${cx},${cy}`;
    }
    const p1 = dimensions[0]; // CONS
    const p2 = dimensions[1]; // CLAR
    const p3 = dimensions[2]; // RITM
    const p5 = dimensions[4]; // REG
    const p4 = dimensions[3]; // PESO
    return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p5.x},${p5.y} ${p4.x},${p4.y}`;
  }, [dimensions, isUnanswered, cx, cy]);

  const activeStep = Math.min(12, currentStepIndex + 1);

  return (
    <div
      suppressHydrationWarning
      className={`w-full max-w-2xl flex flex-col items-center select-none font-sans ${className}`}
    >
      <style jsx>{`
        .glow-yellow {
          box-shadow: 0 0 15px rgba(250, 204, 21, 0.7);
        }
        .glow-emerald {
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
        }
        .glow-cyan {
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.6);
        }
        .glow-blue {
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
        }
        .glow-orange {
          box-shadow: 0 0 12px rgba(249, 115, 22, 0.6);
        }
        .glow-red {
          box-shadow: 0 0 12px rgba(244, 63, 94, 0.6);
        }
        @keyframes energy-flow {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-energy-path {
          stroke-dasharray: 6 4;
          animation: energy-flow 2.5s linear infinite;
        }
        @keyframes node-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.45);
            opacity: 0.85;
          }
        }
        .pulse-ring {
          transform-box: fill-box;
          transform-origin: center;
          animation: node-pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* === INDICADOR SUPERIOR DE NODOS (OPCIONAL O AUTÓNOMO) === */}
      {showTopPills && (
        <div className="flex items-center space-x-4 mb-4">
          <span className="font-mono text-xs md:text-sm tracking-widest text-slate-300 uppercase">
            NODO <strong className={isUnanswered ? "text-slate-500" : "text-white"}>{isUnanswered ? 0 : activeStep}</strong> / 12
          </span>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {Array.from({ length: 12 }).map((_, i) => {
              const isCurrent = !isUnanswered && i === currentStepIndex;
              const isPassed = !isUnanswered && (i < currentStepIndex || !!Object.values(answers)[i]);
              return (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "w-7 h-2.5 bg-yellow-400 glow-yellow"
                      : isPassed
                      ? "w-2.5 h-2.5 bg-cyan-400"
                      : "w-2.5 h-2.5 bg-slate-700/70"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* === PANEL PRINCIPAL GLASSMORPHISM === */}
      <div className="w-full rounded-3xl p-5 md:p-8 space-y-6 relative overflow-hidden bg-[#12192b]/80 backdrop-blur-2xl border border-white/15 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.08)]">
        {/* Luces ambientales de fondo */}
        <div className={`absolute -top-24 -left-24 w-60 h-60 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${isUnanswered ? "opacity-0" : "bg-cyan-500/10 opacity-100"}`} />
        <div className={`absolute -bottom-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${isUnanswered ? "opacity-0" : "bg-rose-500/10 opacity-100"}`} />

        {/* 1. CABECERA */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors duration-500 ${
              isUnanswered
                ? "bg-slate-800/40 border-white/10 text-slate-500"
                : "bg-yellow-500/10 border-yellow-400/40 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]"
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-base md:text-lg font-bold tracking-wider uppercase text-white">
              Auditoría de Perfil Vocal
            </h2>
          </div>

          <div className={`flex items-center space-x-2 border px-3.5 py-1.5 rounded-full transition-all duration-500 ${
            isUnanswered
              ? "bg-slate-900/60 border-white/10"
              : "bg-emerald-950/60 border-emerald-500/30"
          }`}>
            <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${
              isUnanswered
                ? "bg-slate-600"
                : "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
            }`} />
            <span className={`text-xs font-semibold ${isUnanswered ? "text-slate-400 font-mono" : "text-slate-200"}`}>
              {isUnanswered ? "En Espera (0 de 12)" : `Nodo ${activeStep} de 12`}
            </span>
          </div>
        </div>

        {/* 2. TARJETA DE PERFIL Y PUNTUACIÓN */}
        <div className="rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 bg-[#172036]/65 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          {/* Medidor Circular */}
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <div className={`absolute inset-2 rounded-full border-4 pointer-events-none transition-all duration-700 ${
              isUnanswered ? "border-transparent" : "border-amber-400/20 blur-md"
            }`} />

            <svg
              suppressHydrationWarning
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={isUnanswered ? "rgba(255, 255, 255, 0.05)" : "rgba(251, 191, 36, 0.2)"}
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={isUnanswered ? "rgba(255, 255, 255, 0.08)" : "#fde047"}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-700 ease-out ${
                  isUnanswered ? "" : "drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]"
                }`}
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-extrabold leading-none transition-colors duration-500 ${
                isUnanswered ? "text-slate-500" : "text-white"
              }`}>
                {totalScore}
              </span>
              <span className={`text-[9px] font-semibold tracking-widest uppercase mt-1 ${
                isUnanswered ? "text-slate-500" : "text-slate-300"
              }`}>
                OUT OF 100
              </span>
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Avatar"
                  className={`w-14 h-14 rounded-full object-cover border-2 transition-all duration-500 ${
                    isUnanswered
                      ? "border-slate-700 opacity-60"
                      : "border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] opacity-100"
                  }`}
                />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold leading-snug text-white">
                  <span className={isUnanswered ? "text-slate-400" : "text-amber-300"}>Víctor Martínez</span>
                  <span className="text-slate-400 font-normal"> - {isUnanswered ? "Calibración en Reposo" : activeArchetype.name}</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">
                  {isUnanswered
                    ? "Selecciona tu primera respuesta para activar el escaneo bioacústico"
                    : activeArchetype.tagline}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl py-2.5 px-3 text-center bg-[#080c18]/85 border border-white/10">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase block">
                  Nodos
                </span>
                <span className={`font-mono text-sm md:text-base font-bold mt-0.5 block ${
                  isUnanswered ? "text-slate-500" : "text-amber-200"
                }`}>
                  {answeredCount}/12
                </span>
              </div>

              <div className="rounded-xl py-2.5 px-3 text-center bg-[#080c18]/85 border border-white/10">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase block">
                  Calibración
                </span>
                <span className={`font-mono text-sm md:text-base font-bold mt-0.5 block ${
                  isUnanswered ? "text-slate-500" : "text-cyan-400"
                }`}>
                  {totalScore}%
                </span>
              </div>

              <div className="rounded-xl py-2.5 px-3 text-center bg-[#080c18]/85 border border-white/10">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase block">
                  Estado
                </span>
                <div className="flex items-center justify-center space-x-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                    isUnanswered ? "bg-slate-600" : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  }`} />
                  <span className={`text-xs md:text-sm font-extrabold uppercase tracking-wide transition-colors duration-500 ${
                    isUnanswered ? "text-slate-400 font-mono" : "text-emerald-400"
                  }`}>
                    {isUnanswered ? "En Espera" : "En Vivo"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TÍTULOS DE SECCIÓN */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white">
              Category Breakdown
            </h4>
            <span
              className={`text-[10px] font-mono border px-2.5 py-0.5 rounded font-bold uppercase transition-all duration-300 ${
                isUnanswered ? "bg-white/5 border-white/10 text-slate-400" : ""
              }`}
              style={
                isUnanswered
                  ? {}
                  : {
                      backgroundColor: `${activeArchetype.themeColor}20`,
                      borderColor: `${activeArchetype.themeColor}50`,
                      color: activeArchetype.themeColor,
                      boxShadow: `0 0 10px ${activeArchetype.glowColor}`,
                    }
              }
            >
              {isUnanswered ? "CALIBRACIÓN EN REPOSO" : activeArchetype.name}
            </span>
          </div>
          <span className={`text-xs font-mono font-bold tracking-wider uppercase transition-colors duration-500 ${
            isUnanswered
              ? "text-slate-500"
              : "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
          }`}>
            {isUnanswered ? "EN ESPERA" : activeArchetype.code}
          </span>
        </div>

        {/* 4. TARJETA INFERIOR: GRÁFICO DE ARQUETIPO + BARRAS */}
        <div className="rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#172036]/65 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          {/* === GRÁFICO DE RADAR CON RECORRIDO DE ARQUETIPO === */}
          <div className="md:col-span-5 flex items-center justify-center relative py-2">
            {/* Resplandor ambiental detrás del polígono (solo activo con respuestas) */}
            <div className={`absolute w-36 h-36 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-400/20 to-cyan-500/25 blur-2xl pointer-events-none transition-opacity duration-700 ${
              isUnanswered ? "opacity-0" : "opacity-100"
            }`} />

            <svg
              suppressHydrationWarning
              className="w-56 h-56 overflow-visible"
              viewBox="0 0 220 220"
              aria-label="Radar de Arquetipo Vocal"
            >
              <defs>
                {/* Gradiente de relleno del Arquetipo */}
                <linearGradient id="archetypeFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.38" />
                  <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.32" />
                  <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.35" />
                </linearGradient>

                {/* Gradiente para la línea de recorrido principal */}
                <linearGradient id="archetypeStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="35%" stopColor="#22d3ee" />
                  <stop offset="70%" stopColor="#60a5fa" />
                  <stop offset="85%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>

                {/* Filtro de brillo neón intenso para el trazado */}
                <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. ANILLOS PENTAGONALES DE LA RED (Centro en 110, 115) */}
              {/* Nivel 1: 100% (Exterior) */}
              <polygon
                points="110,25 196,87 163,188 57,188 24,87"
                fill="rgba(15, 23, 42, 0.45)"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1"
              />
              {/* Nivel 2: 75% */}
              <polygon
                points="110,47.5 174.5,94 149.7,169.7 70.3,169.7 45.5,94"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* Nivel 3: 50% */}
              <polygon
                points="110,70 153,101 136.5,151.5 83.5,151.5 67,101"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
              {/* Nivel 4: 25% (Interior) */}
              <polygon
                points="110,92.5 131.5,108 123.2,133.2 96.8,133.2 88.5,108"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />

              {/* 2. EJES RADIALES BASE */}
              <g stroke="rgba(255,255,255,0.1)" strokeWidth="1">
                <line x1="110" y1="115" x2="110" y2="25" />
                <line x1="110" y1="115" x2="196" y2="87" />
                <line x1="110" y1="115" x2="163" y2="188" />
                <line x1="110" y1="115" x2="57" y2="188" />
                <line x1="110" y1="115" x2="24" y2="87" />
              </g>

              {/* 3. ETIQUETAS TÉCNICAS EN LOS VÉRTICES */}
              <g className="font-mono text-[8px] fill-slate-400 font-semibold" textAnchor="middle">
                {dimensions.map((d) => (
                  <text key={d.id} x={d.tx} y={d.ty} fill={isUnanswered ? "#64748b" : d.labelColor}>
                    {d.shortLabel}
                  </text>
                ))}
              </g>

              {/* 4. LÍNEAS DE RASTRO DESDE EL NÚCLEO HASTA CADA BOLA */}
              {!isUnanswered && (
                <g strokeWidth="1.5" strokeDasharray="2 3" opacity="0.75">
                  {dimensions.map((d) => (
                    <line
                      key={`ray-${d.id}`}
                      x1="110"
                      y1="115"
                      x2={d.x}
                      y2={d.y}
                      stroke={d.rayStroke}
                      className="transition-all duration-700 ease-out"
                    />
                  ))}
                </g>
              )}

              {/* 5. POLÍGONO DEL ARQUETIPO (Área + Línea de recorrido brillante) */}
              <polygon
                points={polygonPoints}
                fill={isUnanswered ? "transparent" : "url(#archetypeFill)"}
                stroke={isUnanswered ? "rgba(255,255,255,0.08)" : "url(#archetypeStroke)"}
                strokeWidth={isUnanswered ? 1 : 2.5}
                strokeLinejoin="round"
                filter={isUnanswered ? undefined : "url(#glowFilter)"}
                className="transition-all duration-700 ease-out"
              />

              {/* Línea de flujo energético animado sobre el borde del arquetipo (solo activo con respuestas) */}
              {!isUnanswered && (
                <polygon
                  points={polygonPoints}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  opacity="0.7"
                  className="animate-energy-path transition-all duration-700 ease-out"
                />
              )}

              {/* Punto de origen (Centro de la red) */}
              <circle
                cx="110"
                cy="115"
                r="2.5"
                fill={isUnanswered ? "#64748b" : "#ffffff"}
                opacity={isUnanswered ? 0.3 : 0.6}
              />

              {/* 6. BOLAS DE COLORES UBICADAS EN DISTINTOS LUGARES DE LA RED */}
              {dimensions.map((d, i) => (
                <g key={`ball-${d.id}`} className="transition-all duration-700 ease-out">
                  {!isUnanswered && (
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r="10"
                      fill="none"
                      stroke={d.dotColor}
                      strokeWidth="1.2"
                      className="pulse-ring"
                      style={{ animationDelay: `${i * 0.45}s` }}
                    />
                  )}
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={isUnanswered ? 3.5 : 5.5}
                    fill={isUnanswered ? "#475569" : d.dotColor}
                    stroke={isUnanswered ? "#334155" : "#ffffff"}
                    strokeWidth={isUnanswered ? 1 : 2}
                    style={{
                      filter: isUnanswered ? undefined : `drop-shadow(0 0 10px ${d.dotColor})`,
                    }}
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* === BARRAS DE PROGRESO SINCRONIZADAS CON EL ARQUETIPO === */}
          <div className="md:col-span-7 space-y-4">
            {dimensions.map((dim) => (
              <div key={dim.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-500"
                      style={{
                        backgroundColor: dim.dotColor,
                        boxShadow: isUnanswered ? "none" : `0 0 8px ${dim.dotGlow}`,
                      }}
                    />
                    <span className={`font-semibold transition-colors duration-500 ${
                      isUnanswered ? "text-slate-400" : "text-slate-100"
                    }`}>
                      {dim.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <span className={`font-mono text-xs transition-colors duration-500 ${
                      isUnanswered ? "text-slate-500" : "text-slate-300"
                    }`}>
                      {dim.ratioText}
                    </span>
                    <span
                      className={`w-5 h-5 rounded ${dim.badgeBg} border ${dim.badgeBorder} ${dim.badgeText} text-[11px] font-bold flex items-center justify-center transition-all duration-500`}
                    >
                      {dim.grade}
                    </span>
                  </div>
                </div>

                {/* Barra ancha con neón y bisel interior */}
                <div className="w-full h-2.5 bg-slate-950/90 rounded-full overflow-hidden p-[1px] border border-white/10 shadow-inner">
                  <div
                    className={`h-full bg-gradient-to-r ${dim.gradientClass} rounded-full ${dim.glowClass} transition-all duration-700 ease-out`}
                    style={{ width: `${dim.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
