import React from 'react';

type RadarProps = {
  articulation: number;
  authority: number;
  structure: number;
  improv: number;
  projection: number;
  resistance: number;
};

export const SovereigntyRadar = ({ articulation, authority, structure, improv, projection, resistance }: RadarProps) => {
  
  const DIMENSIONS = [
    { label: 'ARTICULACIÓN', value: articulation, benchmark: 100 },
    { label: 'AUTORIDAD', value: authority, benchmark: 100 },
    { label: 'IMPROVISACIÓN', value: improv, benchmark: 100 },
    { label: 'PROYECCIÓN', value: projection, benchmark: 100 },
    { label: 'ESTRUCTURA', value: structure, benchmark: 100 },
    { label: 'RESISTENCIA', value: resistance, benchmark: 100 },
  ];

  const size = 300;
  const center = size / 2;
  const radius = 90; // Reduced radius slightly to fit labels
  const totalSides = DIMENSIONS.length;
  const angleStep = (2 * Math.PI) / totalSides;

  const getPoint = (index: number, value: number, max: number = 100) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / max) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const benchmarkPath = DIMENSIONS.map((_, i) => getPoint(i, 100)).map(p => `${p.x},${p.y}`).join(' ');
  const gridLevels = [33, 66];
  const userPath = DIMENSIONS.map((d, i) => getPoint(i, d.value)).map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#0F1318] rounded-[32px] border border-slate-800 relative overflow-hidden shadow-2xl">
      
      <div className="flex items-center gap-2 mb-6 z-10">
         <span className="material-symbols-outlined text-blue-500 text-sm">radar</span>
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Mapa de Asimetría
         </h3>
      </div>

      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
            
            {/* Background Benchmark */}
            <polygon points={benchmarkPath} fill="#1e293b" fillOpacity="0.2" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Grid Levels */}
            {gridLevels.map(level => (
                 <polygon 
                    key={level}
                    points={DIMENSIONS.map((_, i) => {
                        const { x, y } = getPoint(i, level);
                        return `${x},${y}`;
                    }).join(' ')} 
                    fill="none" 
                    stroke="#334155" 
                    strokeWidth="0.5" 
                    opacity="0.5"
                 />
            ))}

            {/* Axes */}
            {DIMENSIONS.map((_, i) => {
                const end = getPoint(i, 100);
                return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="#334155" strokeWidth="0.5" opacity="0.5" />;
            })}

            {/* User Area */}
            <polygon 
                points={userPath} 
                fill="rgba(59, 130, 246, 0.15)" 
                stroke="#3b82f6" 
                strokeWidth="2"
                className="drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse"
                style={{ animationDuration: '3s' }}
            />
            
            {/* Data Points & Labels */}
            {DIMENSIONS.map((d, i) => {
                const { x, y } = getPoint(i, d.value);
                const labelPos = getPoint(i, 115); // Labels further out
                
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="3" className="fill-blue-400" />
                        
                        {/* Label Name */}
                        <text 
                            x={labelPos.x} 
                            y={labelPos.y} 
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-slate-500 text-[8px] font-bold uppercase tracking-widest"
                            style={{ fontSize: '8px' }}
                        >
                            {d.label}
                        </text>
                        
                        {/* Value */}
                         <text 
                            x={labelPos.x} 
                            y={labelPos.y + 10} 
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className={`text-[9px] font-black ${d.value < 50 ? 'fill-red-400' : 'fill-white'}`}
                            style={{ fontSize: '9px' }}
                        >
                            {d.value}%
                        </text>
                    </g>
                )
            })}
        </svg>

        {/* Warning Badge if Improv is low */}
        {improv < 40 && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                 <div className="px-3 py-1 bg-red-500/90 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-bounce">
                     ¡Fallo Crítico!
                 </div>
             </div>
        )}
      </div>

    </div>
  );
};
