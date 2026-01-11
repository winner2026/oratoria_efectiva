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
  avgUsageByPlan: any[];
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<{title: string, text: string} | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem("admin_secret_key");
    if (savedKey) {
       loadMetrics(savedKey);
    } else {
       setLoading(false);
    }
  }, []);

  const loadMetrics = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
         headers: {
            'x-admin-key': key
         }
      });
      
      if (res.status === 401) {
          alert("Clave incorrecta o expirada");
          localStorage.removeItem("admin_secret_key");
          setIsAuthenticated(false);
      } else if (res.ok) {
          const data = await res.json();
          setStats(data);
          setIsAuthenticated(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      localStorage.setItem("admin_secret_key", inputKey);
      loadMetrics(inputKey);
  };

  if (!isAuthenticated && !loading) {
      return (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
              <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-sm">
                  <h2 className="text-xl font-bold text-white mb-6">Acceso Restringido</h2>
                  <input 
                    type="password" 
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Admin Secret Key"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white mb-4"
                  />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg">
                      Entrar
                  </button>
              </form>
          </div>
      );
  }

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando métricas...</div>;
  if (!stats) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white font-display pb-32 overflow-x-hidden">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Startup Dashboard</h1>
            <p className="text-slate-400">Métricas clave para validación Lean</p>
          </div>
          <div className="flex gap-2">
             <button onClick={() => {
                 localStorage.removeItem("admin_secret_key");
                 window.location.reload();
             }} className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold text-red-400">
                 Salir
             </button>
             <div className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider">
               Live Data
             </div>
          </div>
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
              title="Leads (Free)" 
              value={stats?.freeUsers || 0} 
              subtitle="Nivel Base" 
              target="Conversion Target"
              onClick={() => setExplanation({
                title: "Usuarios Gratuitos",
                text: "Usuarios que han probado la herramienta pero aún no han comprado. Tu misión es convertirlos a Starter o Premium."
              })}
            />
            <StatCard 
              title="Starter" 
              value={stats?.starterUsers || 0} 
              subtitle="Plan Sprint" 
              target="Growth Target"
              positive={ (stats?.starterUsers || 0) > 0 }
              onClick={() => setExplanation({
                title: "Usuarios Starter",
                text: "Clientes que han pagado por el plan intermedio. Han dado el primer paso hacia la oratoria profesional."
              })}
            />
            <StatCard 
              title="Premium" 
              value={stats?.premiumUsers || 0} 
              subtitle="Elite Ejecutivo" 
              target="Target: 3% de Activos"
              positive={ (stats?.premiumUsers || 0) > 0 }
              onClick={() => setExplanation({
                title: "Usuarios Premium",
                text: "Tus mejores clientes. Aquellos que han invertido en el análisis avanzado y acceso total."
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
                text: "Si ves Rojo aquí, significa que hay problemas técnicos bloqueando la experiencia."
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

        {/* 4. RENTABILIDAD POR PLAN (CONSUMO) */}
        {stats?.avgUsageByPlan && (stats.avgUsageByPlan as any[]).length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-emerald-400">monetization_on</span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Rentabilidad (Uso vs Precio)</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {(stats.avgUsageByPlan as any[]).map((plan: any) => {
                // Definir límites para calcular la "salud" del margen
                const limits: Record<string, number> = {
                  'FREE': 3,
                  'VOICE_WEEKLY': 55,
                  'VOICE_MONTHLY': 120,
                  'STARTER': 75,
                  'PREMIUM': 300
                };
                
                const limit = limits[plan.plan] || 100;
                const usage = Number(plan.avg_usage);
                const percentage = Math.min((usage / limit) * 100, 100);
                
                // Rentabilidad es inversa al uso:
                // < 30% uso = Marginazo (Verde)
                // < 70% uso = Saludable (Amarillo)
                // > 70% uso = Margen Apretado (Naranja/Rojo)
                let healthColor = 'bg-emerald-500';
                let healthText = 'Excelente';
                let textColor = 'text-emerald-400';
                
                if (percentage > 70) {
                  healthColor = 'bg-red-500';
                  healthText = 'Crítico';
                  textColor = 'text-red-400';
                } else if (percentage > 30) {
                  healthColor = 'bg-amber-500';
                  healthText = 'Saludable';
                  textColor = 'text-amber-400';
                }

                return (
                  <div key={plan.plan} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-600 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                         <p className="text-xs font-bold uppercase text-slate-500">{plan.plan}</p>
                         <p className="text-[10px] text-slate-600">Base: {Number(plan.count)} usuarios</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border bg-slate-950 ${textColor} border-slate-700`}>
                        {healthText}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 mb-2">
                      <p className="text-3xl font-black text-white">{plan.avg_usage}</p>
                      <span className="text-xs text-slate-500">/ {limit} máx</span>
                    </div>

                    {/* Barra de Consumo */}
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                           className={`h-full ${healthColor} transition-all duration-1000`}
                           style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-right text-slate-500">
                        {percentage.toFixed(0)}% del cupo usado
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
