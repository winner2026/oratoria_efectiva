'use client';

import React, { useEffect, useState } from 'react';

// Tipos para las métricas
type Metrics = {
  totalUsers: number;
  activeUsers: number; // Usuarios con >= 1 sesión
  activationRate: string; // %
  retainedUsers: number; // Usuarios con > 1 sesión
  retentionRate: string; // %
  totalSessions: number;
  anonymousSessions: number; // Fingerprint only
};

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error cargando métricas');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando datos...</div>;
  if (error) return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">{error}</div>;
  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-display">
      <h1 className="text-3xl font-bold mb-2">📊 Panel de Validación Lean</h1>
      <p className="text-slate-400 mb-8">La verdad empírica sobre tu MVP.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: ACTIVACIÓN (La Métrica Estrella) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Tasa de Activación</h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${parseFloat(metrics.activationRate) > 40 ? 'text-green-500' : 'text-amber-500'}`}>
              {metrics.activationRate}%
            </span>
            <span className="text-sm text-slate-400">Objetivo: &gt;40%</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {metrics.activeUsers} de {metrics.totalUsers} usuarios registrados han completado su primer análisis.
          </p>
        </div>

        {/* KPI 2: RETENCIÓN (Stickiness) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Retención Inicial</h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${parseFloat(metrics.retentionRate) > 15 ? 'text-blue-500' : 'text-slate-500'}`}>
              {metrics.retentionRate}%
            </span>
             <span className="text-sm text-slate-400">Objetivo: &gt;15%</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {metrics.retainedUsers} usuarios han vuelto a usarlo (>1 sesión).
          </p>
        </div>

        {/* KPI 3: VOLUMEN */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Sesiones</h3>
          <span className="text-4xl font-black text-white">
            {metrics.totalSessions}
          </span>
          <p className="text-xs text-slate-500 mt-2">
            Total histórico de análisis realizados.
          </p>
        </div>

        {/* KPI 4: USO ANÓNIMO (SOS) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Uso Anónimo</h3>
          <span className="text-4xl font-black text-white">
            {metrics.anonymousSessions}
          </span>
          <p className="text-xs text-slate-500 mt-2">
            Sesiones sin login (SOS/Pruebas/Fingerprint).
          </p>
        </div>
      </div>

      <div className="mt-12 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <h3 className="text-lg font-bold mb-4">📢 Diagnóstico Automático</h3>
        <ul className="space-y-2 text-sm">
           {parseFloat(metrics.activationRate) < 10 && (
             <li className="text-red-400 flex items-center gap-2">
               <span className="material-symbols-outlined">warning</span>
               ALERTA: La activación es muy baja (&lt;10%). La gente se registra pero NO se graba. Revisa el miedo/fricción en el onboarding.
             </li>
           )}
           {parseFloat(metrics.activationRate) >= 40 && (
             <li className="text-green-400 flex items-center gap-2">
               <span className="material-symbols-outlined">check_circle</span>
               ÉXITO: ¡Excelente activación! La propuesta de valor supera al miedo.
             </li>
           )}
           {metrics.totalUsers === 0 && (
             <li className="text-slate-400">
               Esperando primeros usuarios para generar insights...
             </li>
           )}
        </ul>
      </div>
    </div>
  );
}
