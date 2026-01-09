'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  credits: number;
  plan: string;
  totalUsage: number;
  subscriptionStatus?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      router.push("/");
      return;
    }

    // Fetch real-time data from DB to verify usage
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setUser(data);
      })
      .catch(err => {
         console.error("Error loading profile:", err);
         // Fallback basic info
         const name = localStorage.getItem("user_name") || "Usuario";
         const email = localStorage.getItem("user_email") || "";
         setUser({ 
             name, 
             email, 
             credits: parseInt(localStorage.getItem("user_credits") || "0"), 
             plan: "FREE", 
             totalUsage: 0 
         });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    if (confirm("¿Seguro que quieres cerrar sesión?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const handleManageSubscription = () => {
      // Redirigir siempre a /upgrade por ahora
      // En el futuro, aquí iría la lógica del Portal de Cliente si es PREMIUM
      router.push("/upgrade");
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Cargando perfil...</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white font-display pb-32">
      {/* Header */}
      <header className="p-6 flex items-center gap-4 bg-slate-900 border-b border-slate-800">
        <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-slate-400">{user.email}</p>
          <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase tracking-wide text-blue-400">
            <span className={`w-1.5 h-1.5 rounded-full ${user.plan === 'FREE' ? 'bg-slate-500' : 'bg-green-500 animate-pulse'}`}/>
            {user.plan === 'FREE' ? 'Plan Básico' : `Plan ${user.plan}`}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8 max-w-md mx-auto">
        
        {/* Sección: Uso y Saldo (VERIFICACIÓN) */}
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Métricas de Entrenamiento</h2>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                 <span className="material-symbols-outlined">bolt</span>
               </div>
               <div>
                 <p className="font-bold text-lg">{user.credits} Sesiones</p>
                 <p className="text-xs text-slate-500 font-mono">
                    Histórico: <strong className="text-slate-300">{user.totalUsage} Optimizaciones</strong>
                 </p>
               </div>
            </div>
            <Link href="/upgrade">
              <button className="px-4 py-2 bg-white text-slate-950 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                Recargar
              </button>
            </Link>
          </div>
        </section>

        {/* Sección: Suscripción */}
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Suscripción</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
             <button 
               onClick={handleManageSubscription}
               className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors text-left"
             >
               <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-slate-400">credit_card</span>
                 <span className="text-sm font-medium">Gestionar Pagos</span>
               </div>
               <span className="material-symbols-outlined text-slate-600 text-sm">arrow_forward_ios</span>
             </button>
          </div>
          <p className="text-[10px] text-slate-600 mt-2 px-2">
            Gestionado de forma segura por Lemon Squeezy.
          </p>
        </section>

        {/* Sección: Zona de Peligro & Cuenta */}
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Cuenta</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
             <a 
               href="mailto:soporte@oratoriaefectiva.in?subject=Solicitud de Baja&body=Hola, deseo eliminar mi cuenta permanentemente."
               className="w-full flex items-center justify-between p-4 hover:bg-red-500/5 transition-colors text-left group"
             >
               <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-red-400 group-hover:text-red-500">delete_forever</span>
                 <span className="text-sm font-medium text-slate-300 group-hover:text-red-400 transition-colors">Eliminar mi cuenta</span>
               </div>
             </a>

             <button 
               onClick={handleLogout}
               className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors text-left text-red-500"
             >
               <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined">logout</span>
                 <span className="text-sm font-bold">Cerrar Sesión</span>
               </div>
             </button>
          </div>
        </section>
        
        <div className="text-center pt-8">
           <p className="text-[10px] text-slate-700 font-mono">ID: {user.email}</p>
        </div>

      </div>
    </main>
  );
}
