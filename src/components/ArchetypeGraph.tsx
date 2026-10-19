"use client";

import React, { useMemo } from "react";

export interface ArchetypeNodeConfig {
  id: string;
  label: string;
  category: string;
  color: string;
  activeColor: string;
}

export const ARCHETYPE_NODES_12: ArchetypeNodeConfig[] = [
  { id: "objective", label: "PROPÓSITO", category: "Biomecánica", color: "#06b6d4", activeColor: "#22d3ee" },
  { id: "breath", label: "RESPIRACIÓN", category: "Fisiología", color: "#0ea5e9", activeColor: "#38bdf8" },
  { id: "pace", label: "RITMO", category: "Dinámica", color: "#3b82f6", activeColor: "#60a5fa" },
  { id: "difficulty", label: "TENSIÓN", category: "Neuro-Vocal", color: "#6366f1", activeColor: "#818cf8" },
  { id: "impromptu", label: "IMPROVISACIÓN", category: "Adaptabilidad", color: "#8b5cf6", activeColor: "#a78bfa" },
  { id: "volume", label: "RESONANCIA", category: "Acústica", color: "#a855f7", activeColor: "#c084fc" },
  { id: "profession", label: "ENTORNO", category: "Contexto", color: "#ec4899", activeColor: "#f472b6" },
  { id: "situation", label: "ESCENARIO", category: "Demanda", color: "#f43f5e", activeColor: "#fb7185" },
  { id: "structure", label: "ESTRUCTURA", category: "Cognición", color: "#ef4444", activeColor: "#f87171" },
  { id: "bodyLanguage", label: "PRESENCIA", category: "Cinética", color: "#f97316", activeColor: "#fb923c" },
  { id: "fillerWords", label: "PUREZA", category: "Cadencia", color: "#f59e0b", activeColor: "#fbbf24" },
  { id: "interest", label: "VECTOR", category: "Maestría", color: "#10b981", activeColor: "#34d399" },
];

interface ArchetypeGraphProps {
  answers: Record<string, string>;
  currentStepIndex: number;
  className?: string;
}

export default function ArchetypeGraph({
  answers,
  currentStepIndex,
  className = "",
}: ArchetypeGraphProps) {
  const width = 380;
  const height = 380;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 135;

  // Calcular posiciones radiales para los 12 nodos
  const nodes = useMemo(() => {
    return ARCHETYPE_NODES_12.map((node, i) => {
      const angleDeg = -90 + i * (360 / 12);
      const rad = (angleDeg * Math.PI) / 180;
      const isAnswered = !!answers[node.id];
      const isCurrent = currentStepIndex === i;

      return {
        ...node,
        index: i + 1,
        angleDeg,
        x: Math.round((cx + radius * Math.cos(rad)) * 100) / 100,
        y: Math.round((cy + radius * Math.sin(rad)) * 100) / 100,
        isAnswered,
        isCurrent,
        answerValue: answers[node.id],
      };
    });
  }, [answers, currentStepIndex, cx, cy, radius]);

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / 12) * 100);

  // Generar líneas de conexión entre nodos activos y al núcleo central
  const connections = useMemo(() => {
    const lines: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      strokeWidth: number;
      opacity: number;
      isCore: boolean;
      id: string;
    }> = [];

    const activeList = nodes.filter((n) => n.isAnswered);

    // 1. Conexión de cada nodo activo con el núcleo central
    activeList.forEach((node) => {
      lines.push({
        id: `core-${node.id}`,
        x1: cx,
        y1: cy,
        x2: node.x,
        y2: node.y,
        color: node.color,
        strokeWidth: 1.8,
        opacity: 0.85,
        isCore: true,
      });
    });

    // 2. Conexiones inter-nodales (forman la constelación / red neuronal del arquetipo)
    for (let i = 0; i < activeList.length; i++) {
      for (let j = i + 1; j < activeList.length; j++) {
        const n1 = activeList[i];
        const n2 = activeList[j];
        // Conectar adyacentes y armónicos
        const diff = Math.abs(n1.index - n2.index);
        if (diff === 1 || diff === 11 || diff === 3 || diff === 4 || diff === 6) {
          lines.push({
            id: `line-${n1.id}-${n2.id}`,
            x1: n1.x,
            y1: n1.y,
            x2: n2.x,
            y2: n2.y,
            color: n1.color,
            strokeWidth: diff === 1 || diff === 11 ? 1.6 : 1.0,
            opacity: diff === 1 || diff === 11 ? 0.75 : 0.35,
            isCore: false,
          });
        }
      }
    }

    return lines;
  }, [nodes, cx, cy]);

  // Arquetipo sintetizado dinámicamente según avance
  const archetypeTitle = useMemo(() => {
    if (answeredCount === 0) return "CALIBRACIÓN EN REPOSO";
    if (answeredCount < 4) return "INICIANDO MAPEO NEURAL";
    if (answeredCount < 8) return "VECTOR ACÚSTICO DETECTADO";
    if (answeredCount < 12) return "SÍNTESIS DE ARQUETIPO: 85%";
    return "ARQUETIPO CONSOLIDADO: RESONADOR ESTRATÉGICO";
  }, [answeredCount]);

  return (
    <div
      suppressHydrationWarning
      className={`relative w-full max-w-[420px] rounded-3xl border border-white/10 bg-[#060913]/90 p-6 shadow-2xl backdrop-blur-2xl text-slate-300 font-sans ${className}`}
    >
      {/* HUD Telemetría Superior */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-white">
              MATRIZ BIOMÉTRICA DE ARQUETIPO
            </h4>
            <p className="text-[9px] font-mono text-cyan-400">BIOACOUSTIC-SYNAPSE v4.0</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-amber-400">
            {answeredCount} / 12
          </span>
          <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono">
            {progressPercent}% CONECTADO
          </span>
        </div>
      </div>

      {/* Gráfico SVG de Conexiones Circulares */}
      <div className="relative flex items-center justify-center my-2">
        <svg
          suppressHydrationWarning
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-w-[340px] select-none"
          aria-label="Gráfico de conexiones del arquetipo vocal"
        >
          <defs>
            {/* Filtros de Resplandor Neón */}
            <filter id="glow-core" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-node" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradiente radial para el fondo del núcleo */}
            <radialGradient id="core-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f1b2d" />
              <stop offset="70%" stopColor="#060c18" />
              <stop offset="100%" stopColor="#020409" />
            </radialGradient>
          </defs>

          {/* Anillos de Radar de fondo (Geometría Científica) */}
          <circle cx={cx} cy={cy} r={radius * 1.05} fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 4" />
          <circle cx={cx} cy={cy} r={radius * 0.7} fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 3" />
          <circle cx={cx} cy={cy} r={radius * 0.35} fill="none" stroke="rgba(56,189,248,0.12)" />

          {/* Ejes cruzados / Crosshairs */}
          <line x1={cx - radius * 1.15} y1={cy} x2={cx + radius * 1.15} y2={cy} stroke="rgba(255,255,255,0.04)" />
          <line x1={cx} y1={cy - radius * 1.15} x2={cx} y2={cy + radius * 1.15} stroke="rgba(255,255,255,0.04)" />

          {/* LÍNEAS DE CONEXIÓN ENTRE PUNTOS */}
          {connections.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              strokeOpacity={line.opacity}
              strokeLinecap="round"
              filter={line.isCore ? "url(#glow-node)" : undefined}
              className="transition-all duration-700 ease-out"
            />
          ))}

          {/* NÚCLEO CENTRAL (ARQUETIPO CENTRAL HUB) */}
          <g className="cursor-pointer">
            {/* Halo pulsante del núcleo cuando hay respuestas */}
            {answeredCount > 0 && (
              <circle
                cx={cx}
                cy={cy}
                r={28}
                fill="none"
                stroke={answeredCount >= 12 ? "#10b981" : "#f59e0b"}
                strokeWidth="1.5"
                opacity="0.4"
                className="animate-ping"
                style={{ animationDuration: "2.5s" }}
              />
            )}
            <circle
              cx={cx}
              cy={cy}
              r={24}
              fill="url(#core-bg)"
              stroke={answeredCount >= 12 ? "#10b981" : answeredCount > 0 ? "#38bdf8" : "rgba(255,255,255,0.15)"}
              strokeWidth={2}
              filter="url(#glow-core)"
            />
            <text
              x={cx}
              y={cy - 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[9px] font-black uppercase tracking-wider fill-white font-mono"
            >
              {answeredCount >= 12 ? "SYN" : "CORE"}
            </text>
            <text
              x={cx}
              y={cy + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[7px] font-bold fill-cyan-400 font-mono"
            >
              {progressPercent}%
            </text>
          </g>

          {/* 12 NODOS EN LA CIRCUNFERENCIA */}
          {nodes.map((node) => {
            const hasGlow = node.isAnswered || node.isCurrent;

            return (
              <g key={node.id} className="transition-all duration-500">
                {/* Halo de nodo activo */}
                {node.isAnswered && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={14}
                    fill={node.color}
                    fillOpacity="0.2"
                    filter="url(#glow-node)"
                    className="animate-pulse"
                  />
                )}

                {/* Círculo del Nodo */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.isCurrent ? 9.5 : node.isAnswered ? 8.5 : 5.5}
                  fill={node.isAnswered ? node.color : node.isCurrent ? "#1e293b" : "#090d16"}
                  stroke={node.isAnswered ? "#ffffff" : node.isCurrent ? node.color : "rgba(255,255,255,0.2)"}
                  strokeWidth={node.isCurrent || node.isAnswered ? 2 : 1}
                  className="transition-all duration-300"
                />

                {/* Número del nodo / check */}
                {node.isAnswered ? (
                  <circle cx={node.x} cy={node.y} r={2.5} fill="#ffffff" />
                ) : (
                  <text
                    x={node.x}
                    y={node.y + 0.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[6px] font-mono font-bold fill-slate-400 pointer-events-none"
                  >
                    {node.index}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Barra de Progreso y Clasificación Científica */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400">ESTADO NEURAL:</span>
          <span className="font-bold text-amber-300">{archetypeTitle}</span>
        </div>

        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Resumen de Últimos Nodos Calibrados */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-mono">
          <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 block">Último Nodo:</span>
            <span className="font-bold text-white truncate block">
              {nodes[currentStepIndex]?.label || "N/A"}
            </span>
          </div>
          <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 block">Densidad de Red:</span>
            <span className="font-bold text-emerald-400 block">
              {Math.min(100, Math.round(answeredCount * 8.33))}% Coherente
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
