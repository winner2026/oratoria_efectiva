"use client";

import React from "react";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label: string;
  subValue?: string;
  icon?: string;
}

export default function CircularProgress({
  value,
  size = 140,
  strokeWidth = 10,
  color,
  label,
  subValue,
  icon
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center group cursor-help transition-all duration-500 hover:scale-105">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect background */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          style={{ backgroundColor: color }}
        />
        
        {/* SVG Container */}
        <svg
          width={size}
          height={size}
          className="transform rotate-[-90deg] relative z-10"
        >
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-800/50"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 1.5s ease-in-out",
              strokeLinecap: "round",
              filter: `drop-shadow(0 0 6px ${color})`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {icon && (
            <span className="material-symbols-outlined text-slate-500 text-sm mb-0.5 opacity-50">
              {icon}
            </span>
          )}
          <span className="text-3xl font-black text-white tracking-tighter">
            {value}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest -mt-1">
            /100
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-0.5 group-hover:text-blue-400 transition-colors">
          {label}
        </h4>
        {subValue && (
          <p className="text-[10px] text-slate-500 font-medium">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
