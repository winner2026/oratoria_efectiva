'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getOrCreateAnonymousUserId } from '@/lib/anonymousUser';

interface Session {
  id: string;
  createdAt: string;
  transcription: string;
  authorityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  authorityScore: number;
  wordsPerMinute: number;
  durationSeconds: number;
  strengths: string[];
  weaknesses: string[];
  diagnosis: string;
}

interface Stats {
  totalSessions: number;
  avgScore: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  evolution: { date: string; score: number; level: string }[];
}

interface Usage {
  current: number;
  limit: number;
  resetDate?: string;
  isLimitReached: boolean;
}

const levelColors = {
  LOW: 'bg-red-500',
  MEDIUM: 'bg-amber-500',
  HIGH: 'bg-emerald-500',
};

const levelLabels = {
  LOW: 'Crítico',
  MEDIUM: 'Moderado',
  HIGH: 'Consistente',
};

export default function MySessionsPage() {
  const { data: session, status } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const userId = session?.user?.email || "";
        const response = await fetch(`/api/my-sessions?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
          setSessions(data.data.sessions);
          setStats(data.data.stats);
          setUsage(data.data.usage);
        } else {
          setError(data.error || 'Error desconocido');
        }
      } catch (err) {
        setError('Error de conexión');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [session, status]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white pb-24 font-display">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/listen" className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-black text-lg uppercase tracking-widest text-blue-500">Auditoría</h1>
          <div className="w-6"></div>
        </div>
      </header>

      <main className="pt-24 mobile-container space-y-8 animate-fade-in">
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-xl p-4 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {sessions.length === 0 && !error && (
          <div className="text-center py-16 space-y-6">
            <div className="text-6xl">🎤</div>
            <h2 className="text-2xl font-bold">No tienes sesiones aún</h2>
            <p className="text-slate-400">
              Graba tu primera práctica para ver tu progreso aquí.
            </p>
            <Link 
              href="/practice?mode=video"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all"
            >
              Grabar ahora
            </Link>
          </div>
        )}

        {stats && sessions.length > 0 && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Auditorías</p>
                <p className="text-4xl font-black text-white">{stats.totalSessions}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Score de Dominancia</p>
                <p className="text-4xl font-black text-blue-500">{stats.avgScore}</p>
              </div>
            </div>


            {/* Authority Distribution */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold mb-4">Distribución de Autoridad</h3>
              <div className="flex gap-2 h-8">
                {stats.highCount > 0 && (
                  <div 
                    className="bg-emerald-500 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ flex: stats.highCount }}
                  >
                    {stats.highCount}
                  </div>
                )}
                {stats.mediumCount > 0 && (
                  <div 
                    className="bg-amber-500 rounded-lg flex items-center justify-center text-xs font-bold text-black"
                    style={{ flex: stats.mediumCount }}
                  >
                    {stats.mediumCount}
                  </div>
                )}
                {stats.lowCount > 0 && (
                  <div 
                    className="bg-red-500 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ flex: stats.lowCount }}
                  >
                    {stats.lowCount}
                  </div>
                )}
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>🟢 Alta: {stats.highCount}</span>
                <span>🟡 Media: {stats.mediumCount}</span>
                <span>🔴 Baja: {stats.lowCount}</span>
              </div>
            </div>

            {/* Evolution Chart */}
            {stats.evolution.length > 1 && (
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-lg font-bold mb-4">Tu Evolución</h3>
                <div className="relative h-48">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 pr-2">
                    <span>100</span>
                    <span>50</span>
                    <span>0</span>
                  </div>
                  
                  {/* Chart area */}
                  <div className="ml-8 h-full flex items-end justify-between gap-2">
                    {stats.evolution.map((point, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                        {/* Bar */}
                        <div 
                          className={`w-full max-w-12 rounded-t-lg transition-all duration-500 ${
                            point.level === 'HIGH' ? 'bg-emerald-500' :
                            point.level === 'MEDIUM' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ height: `${point.score}%` }}
                        >
                          <div className="text-xs font-bold text-center pt-1 text-white drop-shadow">
                            {point.score}
                          </div>
                        </div>
                        {/* Date label */}
                        <div className="text-[10px] text-slate-500 mt-2 truncate w-full text-center">
                          {new Date(point.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Trend indicator */}
                {stats.evolution.length >= 2 && (
                  <div className="mt-4 text-center">
                    {(() => {
                      const first = stats.evolution[0].score;
                      const last = stats.evolution[stats.evolution.length - 1].score;
                      const diff = last - first;
                      if (diff > 5) {
                        return <span className="text-emerald-400 font-bold">📈 +{diff} puntos de mejora!</span>;
                      } else if (diff < -5) {
                        return <span className="text-red-400">📉 {diff} puntos. ¡Sigue practicando!</span>;
                      } else {
                        return <span className="text-slate-400">➡️ Manteniéndose estable</span>;
                      }
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Sessions List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Historial de Sesiones</h3>
              
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className="w-full bg-slate-900 rounded-2xl p-5 border border-slate-800 hover:border-slate-600 transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400 text-sm">{formatDate(session.createdAt)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${levelColors[session.authorityLevel]}`}>
                      {levelLabels[session.authorityLevel]} · {session.authorityScore}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm line-clamp-2 group-hover:text-white transition-colors">
                    "{session.transcription}"
                  </p>
                  <div className="flex gap-4 mt-3 text-xs text-slate-500">
                    <span>⏱️ {Math.round(session.durationSeconds)}s</span>
                    <span>🗣️ {session.wordsPerMinute} ppm</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* CTA to practice more */}
        {sessions.length > 0 && (
          <div className="text-center pt-8 pb-4">
            <Link 
              href="/practice?mode=video"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105"
            >
              <span className="material-symbols-outlined">mic</span>
              Nueva práctica
            </Link>
          </div>
        )}
      </main>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedSession(null)}
        >
          <div 
            className="bg-slate-900 rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto border border-slate-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{formatDate(selectedSession.createdAt)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${levelColors[selectedSession.authorityLevel]}`}>
                      Autoridad {levelLabels[selectedSession.authorityLevel]}
                    </span>
                    <span className="text-3xl font-black text-white">{selectedSession.authorityScore}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Diagnosis */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <h4 className="text-sm font-bold text-slate-400 mb-2">Diagnóstico</h4>
                <p className="text-white">{selectedSession.diagnosis}</p>
              </div>

              {/* Transcription */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 mb-2">Lo que dijiste</h4>
                <p className="text-slate-300 italic">"{selectedSession.transcription}"</p>
              </div>

              {/* Strengths */}
              {Array.isArray(selectedSession.strengths) && selectedSession.strengths.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 mb-2">✓ Lo que suma</h4>
                  <ul className="space-y-1">
                    {selectedSession.strengths.map((s, i) => (
                      <li key={i} className="text-slate-300 text-sm">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {Array.isArray(selectedSession.weaknesses) && selectedSession.weaknesses.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-red-400 mb-2">✗ Lo que resta</h4>
                  <ul className="space-y-1">
                    {selectedSession.weaknesses.map((w, i) => (
                      <li key={i} className="text-slate-300 text-sm">• {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-xs">Duración</p>
                  <p className="text-2xl font-bold text-white">{Math.round(selectedSession.durationSeconds)}s</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-xs">Palabras/minuto</p>
                  <p className="text-2xl font-bold text-white">{selectedSession.wordsPerMinute}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
