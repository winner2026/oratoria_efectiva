'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{name: string, email: string, credits: string} | null>(null);

  useEffect(() => {
    // Cargar datos básicos del localStorage
    const name = localStorage.getItem("user_name");
    const email = localStorage.getItem("user_email");
    const credits = localStorage.getItem("user_credits");
    
    if (!email) {
      router.push("/");
      return;
    }

    setUser({
      name: name || "Usuario Invitado",
      email: email,
      credits: credits || "0"
    });
  }, [router]);

  const handleLogout = () => {
    if (confirm("¿Seguro que quieres cerrar sesión?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const handleManageSubscription = () => {
      // Aquí iría el link al portal de cliente de Lemon Squeezy
      // Por ahora, redirigimos a /upgrade si es free
      router.push("/upgrade"); 
  };

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
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>
            Plan Activo
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8 max-w-md mx-auto">
        
        {/* Sección: Créditos */}
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Tu Saldo</h2>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                 <span className="material-symbols-outlined">bolt</span>
               </div>
               <div>
                 <p className="font-bold text-lg">{user.credits} Análisis</p>
                 <p className="text-xs text-slate-500">Disponibles esta semana</p>
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
             
             <button 
               onClick={() => window.open('https://billing.lemonsqueezy.com', '_blank')}
               className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors text-left"
             >
               <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-slate-400">receipt_long</span>
                 <span className="text-sm font-medium">Historial de Facturas</span>
               </div>
               <span className="material-symbols-outlined text-slate-600 text-sm">open_in_new</span>
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
               href="mailto:soporte@oratoriaefectiva.in?subject=Solicitud de Baja&body=Hola, deseo eliminar mi cuenta y mis datos permanentemente."
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
           <p className="text-[10px] text-slate-700 font-mono">Oratoria Efectiva v1.0.4</p>
        </div>

      </div>
    </main>
  );
}
