"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  conversionRate: string;
  activationRate: string;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

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
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-display">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">Panel de Conversión</h1>
            <p className="text-slate-400">Métricas de crecimiento en tiempo real</p>
          </div>
          <Link href="/listen">
            <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm">Volver</button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Usuarios" value={stats?.totalUsers || 0} subtitle="Entradas únicas" />
          <StatCard title="Usuarios Activos" value={stats?.activeUsers || 0} subtitle="Hicieron al menos 1 análisis" />
          <StatCard title="Usuarios Premium" value={stats?.premiumUsers || 0} subtitle="Plan != FREE" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PercentCard title="Tasa de Activación" value={stats?.activationRate || "0%"} description="Visitantes que realmente usan la herramienta" color="blue" />
          <PercentCard title="Tasa de Conversión" value={stats?.conversionRate || "0%"} description="Activos que saltan a plan de pago" color="green" />
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-lg font-bold mb-4">Próximos Pasos de Data</h2>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
              Eventos de 'Upgrade viewed' trackeados.
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
              Click en planes específicos trackeados.
            </li>
            <li className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined text-sm">pending</span>
              Integrar Webhook de Stripe para marcar plan_type automáticamente.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: number | string; subtitle: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-black my-2">{value}</p>
      <p className="text-slate-600 text-xs">{subtitle}</p>
    </div>
  );
}

function PercentCard({ title, value, description, color }: { title: string; value: string; description: string; color: "blue" | "green" }) {
  const colorClass = color === "blue" ? "text-blue-500" : "text-green-500";
  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex items-center justify-between">
      <div className="space-y-1">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      <div className={`text-5xl font-black ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}
