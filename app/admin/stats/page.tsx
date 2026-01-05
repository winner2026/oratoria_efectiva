"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  conversionRate: string;
  activationRate: string;
  technicalErrors: number;
  exerciseStarts: number;
  resultsShared: number;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<{title: string, text: string} | null>(null);

  useEffect(() => {
    fetch("/api/stats/conversion")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-display relative">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">Panel de Crecimiento</h1>
            <p className="text-slate-400">Estado de salud del negocio en tiempo real</p>
          </div>
          <Link href="/listen">
            <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition-colors">Volver</button>
          </Link>
        </header>

        {/* Modal de Explicación */}
        {explanation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setExplanation(null)}>
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold border-b border-slate-800 pb-2">{explanation.title}</h3>
              <p className="text-slate-300 leading-relaxed text-sm">{explanation.text}</p>
              <button 
                onClick={() => setExplanation(null)}
                className="w-full py-3 bg-blue-600 rounded-xl font-bold text-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* 1. MÉTRICAS DE VOLUMEN Y SALUD */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-blue-400">analytics</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Volumen y Salud Técnica</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="Usuarios" 
              value={stats?.totalUsers || 0} 
              subtitle="Tráfico Total" 
              target="Crecer +10% semanal"
              onClick={() => setExplanation({
                title: "Tráfico de Entrada",
                text: "Si este número sube y la Tasa de Conversión se mantiene, el negocio crece. Si este número sube pero los errores técnicos también, estás desperdiciando dinero en publicidad."
              })}
            />
            <StatCard 
              title="Activos" 
              value={stats?.activeUsers || 0} 
              subtitle="Usaron la IA" 
              target="Mín. 30% del Total"
              onClick={() => setExplanation({
                title: "Activación de Usuarios",
                text: "Un usuario activo es quien ya grabó y probó el producto. Si este número es bajo comparado al Total, tu página de inicio no está convenciendo a la gente de probar la herramienta."
              })}
            />
            <StatCard 
              title="Premium" 
              value={stats?.premiumUsers || 0} 
              subtitle="Clientes" 
              target="Target: 3% de Activos"
              positive={ (stats?.premiumUsers || 0) > 0 }
              onClick={() => setExplanation({
                title: "Conversión a Pago",
                text: "Usuarios que valoran tanto la herramienta que pagan. Un 3% es el estándar de oro en aplicaciones Pro. Si es < 1%, debemos revisar los precios o la oferta."
              })}
            />
            <StatCard 
              title="Errores" 
              value={stats?.technicalErrors || 0} 
              subtitle="Cámara/Mic" 
              target="Ideal: 0"
              urgent={ (stats?.technicalErrors || 0) > 0 }
              onClick={() => setExplanation({
                title: "Salud Técnica",
                text: "Si ves Rojo aquí, significa que hay usuarios queriendo usar tu app pero su navegador o dispositivo falla. Cada error aquí es un cliente perdido por frustración."
              })}
            />
          </div>
        </section>

        {/* 2. ENGAGEMENT Y VIRALIDAD */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-purple-400">rocket_launch</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Motor de Crecimiento</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
              title="Enganche Gym" 
              value={stats?.exerciseStarts || 0} 
              subtitle="Ejercicios en curso" 
              target="Retención > 20%"
              onClick={() => setExplanation({
                title: "Retención y Hábito",
                text: "Mide cuánta gente entra al Gimnasio Vocal. Un número alto indica que el usuario percibe la app como una academia, no solo como un probador. Esto justifica el pago mensual."
              })}
            />
            <StatCard 
              title="Efecto Viral" 
              value={stats?.resultsShared || 0} 
              subtitle="Shared Results" 
              target="Target: > 5%"
              positive={ (stats?.resultsShared || 0) > 5 }
              onClick={() => setExplanation({
                title: "Viralidad Orgánica",
                text: "Mide cuántos usuarios presumen su nivel de oratoria. Si este número crece, tu costo de adquisición de clientes bajará porque tus propios usuarios te hacen publicidad."
              })}
            />
          </div>
        </section>

        {/* 3. PORCENTAJES CRÍTICOS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-green-400">equalizer</span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Eficiencia Comercial</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PercentCard 
              title="Tasa de Activación" 
              value={stats?.activationRate || "0%"} 
              description="Visitantes -> Usuarios Reales" 
              color="blue"
              benchmark="Bueno: > 35%"
              status={ parseFloat(stats?.activationRate || "0") > 35 ? 'good' : 'low' }
              onClick={() => setExplanation({
                title: "Filtro de Entrada",
                text: "Si es bajo (Rojo), la gente tiene miedo de usar la cámara o el proceso es confuso. Si es Verde, tu propuesta de valor está clarísima."
              })}
            />
            <PercentCard 
              title="Tasa de Conversión" 
              value={stats?.conversionRate || "0%"} 
              description="Usuarios -> Clientes Premium" 
              color="green"
              benchmark="Sano: 2% - 5%"
              status={ parseFloat(stats?.conversionRate || "0") > 2 ? 'good' : 'warning' }
              onClick={() => setExplanation({
                title: "Corazón del Negocio",
                text: "Este es el dato que paga las facturas. Si estás en Verde (> 2%), tienes un negocio escalable. Si estás en Amarillo/Rojo, necesitamos mejorar la oferta en la página de Upgrade."
              })}
            />
          </div>
        </section>

      </div>
    </main>
  );
}

function StatCard({ title, value, subtitle, target, urgent, positive, onClick }: { 
  title: string; 
  value: number | string; 
  subtitle: string; 
  target: string;
  urgent?: boolean; 
  positive?: boolean;
  onClick: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`bg-slate-900 border cursor-pointer hover:scale-[1.02] transition-all duration-300 p-6 rounded-3xl group
        ${urgent ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
          positive ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-slate-800'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
        <span className="material-symbols-outlined text-slate-700 group-hover:text-blue-500 text-sm">info</span>
      </div>
      <p className={`text-4xl font-black my-2 ${urgent ? 'text-red-500' : positive ? 'text-green-400' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-slate-600 text-xs mb-3">{subtitle}</p>
      <div className={`text-[9px] font-bold px-2 py-1 rounded-md border inline-block
        ${urgent ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
          positive ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}
      `}>
        Objetivo: {target}
      </div>
    </div>
  );
}

function PercentCard({ title, value, description, color, benchmark, status, onClick }: { 
  title: string; 
  value: string; 
  description: string; 
  color: "blue" | "green";
  benchmark: string;
  status: 'good' | 'low' | 'warning';
  onClick: () => void;
}) {
  const colorClass = status === 'good' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : 'text-red-400';
  
  return (
    <div 
      onClick={onClick}
      className={`bg-slate-900 border border-slate-800 p-8 rounded-3xl flex items-center justify-between cursor-pointer hover:border-slate-600 transition-all group`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold">{title}</h3>
          <span className="material-symbols-outlined text-slate-700 group-hover:text-slate-400 text-sm">help</span>
        </div>
        <p className="text-slate-500 text-xs mb-2">{description}</p>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
          Ref: {benchmark}
        </span>
      </div>
      <div className={`text-5xl font-black ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}
