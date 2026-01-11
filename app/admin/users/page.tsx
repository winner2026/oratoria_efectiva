"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  createdAt: string;
  usage?: {
    totalAnalyses: number;
  };
}

interface GroupedUsers {
  FREE: User[];
  STARTER: User[];
  PREMIUM: User[];
  OTHER: User[];
}

export default function AdminUsersPage() {
  const [groups, setGroups] = useState<GroupedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("admin_secret_key");
    if (savedKey) {
       loadUsers(savedKey);
    } else {
       setLoading(false);
    }
  }, []);

  const loadUsers = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
         headers: { 'x-admin-key': key }
      });
      
      if (res.status === 401) {
          alert("Clave incorrecta");
          localStorage.removeItem("admin_secret_key");
          setIsAuthenticated(false);
      } else if (res.ok) {
          const data = await res.json();
          setGroups(data);
          setIsAuthenticated(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (userId: string, newPlan: string) => {
    const key = localStorage.getItem("admin_secret_key");
    if (!key) return;

    setActionLoading(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 
          'x-admin-key': key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, newPlan })
      });

      if (res.ok) {
        await loadUsers(key); // Reload
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      localStorage.setItem("admin_secret_key", inputKey);
      loadUsers(inputKey);
  };

  if (!isAuthenticated && !loading) {
      return (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
              <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-sm">
                  <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tighter">Acceso de Control</h2>
                  <input 
                    type="password" 
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Admin Secret Key"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white mb-4 outline-none focus:border-blue-500 transition-colors"
                  />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
                      DESBLOQUEAR
                  </button>
              </form>
          </div>
      );
  }

  if (loading) return <div className="p-10 text-center text-slate-500 font-mono animate-pulse">ACCEDIENDO A ARCHIVOS...</div>;
  if (!groups) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white font-display pb-32">
      <div className="max-w-[1400px] mx-auto p-6 md:p-12">
        
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/admin/stats" className="size-10 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-xl text-slate-400 hover:text-white">
               <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Clasificación de Usuarios</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Movimiento de activos en tiempo real</p>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem("admin_secret_key"); window.location.reload(); }} className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold">
            LOGOUT
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUMNA: FREE */}
          <UserColumn 
            title="Nivel Free (Leads)" 
            count={groups.FREE.length}
            users={groups.FREE}
            color="slate"
            onMove={handleUpdatePlan}
            loadingId={actionLoading}
          />

          {/* COLUMNA: STARTER */}
          <UserColumn 
            title="Nivel Starter (Sprint)" 
            count={groups.STARTER.length}
            users={groups.STARTER}
            color="blue"
            onMove={handleUpdatePlan}
            loadingId={actionLoading}
          />

          {/* COLUMNA: PREMIUM */}
          <UserColumn 
            title="Nivel Premium (Elite)" 
            count={groups.PREMIUM.length}
            users={groups.PREMIUM}
            color="emerald"
            onMove={handleUpdatePlan}
            loadingId={actionLoading}
          />

        </div>

      </div>
    </main>
  );
}

function UserColumn({ title, count, users, color, onMove, loadingId }: { 
  title: string, 
  count: number, 
  users: User[], 
  color: string,
  onMove: (id: string, plan: string) => void,
  loadingId: string | null
}) {
  const getBannerColor = () => {
    if (color === 'emerald') return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    if (color === 'blue') return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
  };

  const getDotColor = () => {
    if (color === 'emerald') return 'bg-emerald-500';
    if (color === 'blue') return 'bg-blue-500';
    return 'bg-slate-500';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className={`p-4 rounded-2xl border flex items-center justify-between ${getBannerColor()}`}>
        <div className="flex items-center gap-2">
           <span className={`size-2 rounded-full ${getDotColor()} animate-pulse`} />
           <h2 className="text-xs font-black uppercase tracking-widest">{title}</h2>
        </div>
        <span className="text-lg font-black">{count}</span>
      </div>

      <div className="flex flex-col gap-3 min-h-[500px] bg-white/[0.02] border border-white/5 rounded-[32px] p-4">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-700 italic text-sm">
            Vacío
          </div>
        ) : (
          users.map(user => (
            <div key={user.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl group relative overflow-hidden">
               {loadingId === user.id && (
                  <div className="absolute inset-0 bg-slate-950/80 z-20 flex items-center justify-center">
                    <div className="size-4 border-2 border-blue-500 border-t-transparent animate-spin rounded-full" />
                  </div>
               )}
               <div className="flex flex-col gap-1 mb-3">
                 <p className="text-sm font-bold text-white truncate">{user.name || 'Sin Nombre'}</p>
                 <p className="text-[10px] text-slate-500 truncate font-mono">{user.email}</p>
                 <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-[10px] text-slate-600 font-bold uppercase">Uso:</span>
                    <span className="text-xs font-black text-slate-300">{user.usage?.totalAnalyses || 0}</span>
                 </div>
               </div>

               <div className="flex gap-1">
                  {user.plan !== 'FREE' && (
                    <button onClick={() => onMove(user.id, 'FREE')} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-[9px] font-bold rounded-lg transition-colors">
                       TO FREE
                    </button>
                  )}
                  {user.plan !== 'STARTER' && (
                    <button onClick={() => onMove(user.id, 'STARTER')} className="flex-1 py-1.5 bg-blue-900/40 hover:bg-blue-900/60 text-[9px] font-bold text-blue-400 rounded-lg transition-colors">
                       TO STARTER
                    </button>
                  )}
                  {user.plan !== 'PREMIUM' && (
                    <button onClick={() => onMove(user.id, 'PREMIUM')} className="flex-1 py-1.5 bg-emerald-900/40 hover:bg-emerald-900/60 text-[9px] font-bold text-emerald-400 rounded-lg transition-colors">
                       TO PREMIUM
                    </button>
                  )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
