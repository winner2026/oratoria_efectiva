import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NavigationBar = () => {
  const pathname = usePathname();

  // No mostrar en landing, práctica o resultados para mantener el foco
  const isExcluded = pathname === '/' || 
                     pathname?.includes('/practice') || 
                     pathname?.includes('/results') || 
                     pathname?.includes('/auth/') || 
                     pathname?.includes('/sos') ||
                     pathname?.includes('/admin') ||
                     pathname === '/waitlist' ||
                     pathname === '/offer';

  if (isExcluded) {
    return null;
  }

  // Estado para controlar visibilidad de features
  const [showVideo, setShowVideo] = React.useState(false);

  React.useEffect(() => {
     // Solo mostramos Gimnasio si tiene un plan avanzado SUPERIOR a Voz
     // Por ahora, oculto para todos los Free/Básicos para cumplir la regla de "Escalera de Valor"
     // En el futuro: if (plan === 'VIDEO_PRO') setShowVideo(true);
     const plan = localStorage.getItem("user_plan");
     if (plan && plan !== 'FREE' && plan !== 'VOICE_WEEKLY') {
         // Lógica futura: Solo si compró el módulo de video
         // setShowVideo(true);
     }
  }, []);

  const navItems = [
    { label: 'Inicio', icon: 'dashboard_customize', href: '/listen' }, 
    { label: 'Entrenar', icon: 'fitness_center', href: '/gym' },
    { label: 'Clases', icon: 'school', href: '/courses' },
    { label: 'Historial', icon: 'query_stats', href: '/my-sessions' },
    { label: '¡Ayuda!', icon: 'emergency', href: '/sos' },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_credits");
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* GLOBAL TOP HEADER FOR APP */}
      <header className="fixed top-0 left-0 w-full p-4 md:p-6 z-40 bg-gradient-to-b from-[#0A0F14] to-transparent pointer-events-none flex items-center justify-between">
          <div className="flex items-center gap-3 pointer-events-auto">
             {/* <div className="relative size-8 md:size-10 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 p-1.5 shadow-2xl">
                <Image 
                   src="/logo-new.png" 
                   alt="Oratoria Efectiva Logo" 
                   fill 
                   className="object-contain p-0.5"
                />
             </div> */}
             <span className="font-black tracking-tighter text-xs md:text-sm uppercase text-white/50">
                Oratoria <span className="text-blue-500">Efectiva</span>
             </span>
          </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 pb-safe">
        <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-all duration-300 min-w-[64px] ${
                  isActive ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className={`relative flex items-center justify-center p-2 rounded-2xl transition-all ${
                  isActive ? 'bg-blue-500/10' : ''
                }`}>
                  <span className={`material-symbols-outlined text-[22px] ${isActive ? 'fill-1' : ''}`}>
                    {item.icon}
                  </span>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {/* Logout Item */}
          {/* Profile Item */}
          <Link 
            href="/profile"
            className={`flex flex-col items-center gap-1 transition-all duration-300 min-w-[64px] ${
              pathname === '/profile' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`relative flex items-center justify-center p-2 rounded-2xl transition-all ${
              pathname === '/profile' ? 'bg-blue-500/10' : 'hover:bg-slate-800'
            }`}>
              <span className={`material-symbols-outlined text-[22px] ${pathname === '/profile' ? 'fill-1' : ''}`}>
                person
              </span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
              Perfil
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;
