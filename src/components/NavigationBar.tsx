'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavigationBar = () => {
  const pathname = usePathname();

  // No mostrar en landing, práctica o resultados para mantener el foco
  const isExcluded = pathname === '/' || 
                     pathname?.includes('/practice') || 
                     pathname?.includes('/results') || 
                     pathname?.includes('/auth/') || 
                     pathname?.includes('/sos') ||
                     pathname === '/waitlist' ||
                     pathname === '/offer';

  if (isExcluded) {
    return null;
  }

  const navItems = [
    { label: 'Inicio', icon: 'home', href: '/' },
    { label: 'Gimnasio', icon: 'fitness_center', href: '/gym' },
    { label: 'Cursos', icon: 'map', href: '/courses' },
    { label: 'Progreso', icon: 'trending_up', href: '/my-sessions' },
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
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-red-400 transition-all duration-300 min-w-[64px]"
          >
            <div className="relative flex items-center justify-center p-2 rounded-2xl hover:bg-red-500/10 transition-all">
              <span className="material-symbols-outlined text-[22px]">logout</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
              Salir
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;
