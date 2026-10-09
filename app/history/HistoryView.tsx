"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Resource } from "@prisma/client";

interface HistoryViewProps {
  videos: Resource[];
  books: Resource[];
  sessions: any[];
}

export default function HistoryView({ videos, books, sessions }: HistoryViewProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-[100dvh] bg-[#05070A] font-display antialiased text-white flex justify-center selection:bg-amber-500/30">
        <div className="relative mobile-container bg-[#05070A] flex flex-col min-h-[100dvh] shadow-xl pb-24 px-0">
            
            {/* Top App Bar */}
            <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-[#05070A]/95 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.push("/practice?mode=video")}
                        className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
                    >
                         <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-white">Historial de Prácticas</h1>
                </div>
                <button className="group flex items-center justify-center rounded-full p-2 hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-amber-400 transition-colors">filter_list</span>
                </button>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6 p-4 overflow-y-auto no-scrollbar">
                
                {/* Summary Stats */}
                <section aria-label="Estadísticas generales">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 rounded-2xl p-5 bg-[#090C10] shadow-sm border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-amber-400 text-[20px]">mic</span>
                                <p className="text-slate-400 text-sm font-medium">Sesiones</p>
                            </div>
                            <p className="text-3xl font-black tracking-tight text-white">
                                {sessions.length}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 rounded-2xl p-5 bg-[#090C10] shadow-sm border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-amber-400 text-[20px]">analytics</span>
                                <p className="text-slate-400 text-sm font-medium">Promedio</p>
                            </div>
                            <p className="text-3xl font-black tracking-tight text-white">
                                {sessions.length > 0 
                                    ? Math.round(sessions.reduce((acc, s) => acc + s.authorityScore, 0) / sessions.length)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </section>

                {/* Chart Preview (Visual Separator) */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Esta Semana</h3>
                    <div className="h-32 w-full rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-blue-900/20 flex items-end justify-between px-4 pb-2 pt-8 relative overflow-hidden border border-white/10">
                        {/* Abstract Chart Bars */}
                        <div className="w-[12%] h-[40%] bg-amber-500/30 rounded-t-sm"></div>
                        <div className="w-[12%] h-[60%] bg-amber-500/40 rounded-t-sm"></div>
                        <div className="w-[12%] h-[30%] bg-amber-500/30 rounded-t-sm"></div>
                        <div className="w-[12%] h-[80%] bg-amber-500/60 rounded-t-sm"></div>
                        <div className="w-[12%] h-[50%] bg-amber-500/40 rounded-t-sm"></div>
                        <div className="w-[12%] h-[90%] bg-amber-400 rounded-t-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]"></div>
                        <div className="w-[12%] h-[70%] bg-amber-500/50 rounded-t-sm"></div>
                        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            +12% vs sem. ant.
                        </div>
                    </div>
                </div>

                {/* History List */}
                <section aria-label="Lista de sesiones" className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Recientes</h3>
                    
                    {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 bg-[#090C10] rounded-2xl border border-dashed border-white/10 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">history</span>
                            <p className="text-sm text-slate-400">Aún no tienes sesiones grabadas.</p>
                            <button 
                                onClick={() => router.push("/voz_efectiva")}
                                className="mt-4 text-xs font-bold text-amber-400 hover:underline uppercase tracking-wider"
                            >
                                ¡Empieza tu primera práctica!
                            </button>
                        </div>
                    ) : (
                        sessions.map((session, i) => {
                            const date = new Date(session.createdAt);
                            const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                            const score = (session.authorityScore / 10).toFixed(1);
                            const color = session.authorityScore >= 80 ? "emerald" : session.authorityScore >= 60 ? "amber" : "amber";
                            const duration = Math.round(session.durationSeconds);
                            
                            return (
                                <div key={session.id} className="group relative flex gap-4 bg-[#090C10] px-4 py-4 rounded-2xl border border-white/10 shadow-sm active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden hover:border-amber-500/30">
                                    <div className="shrink-0 flex flex-col items-center justify-center gap-1">
                                        <div className={`relative size-12 flex items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20`}>
                                            <span className={`text-amber-400 font-bold text-sm`}>{score}</span>
                                            <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 36 36">
                                                <path className="text-transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                                <path className={`text-amber-400 stroke-current`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray={`${session.authorityScore}, 100`} strokeWidth="3"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-center min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white text-base font-bold leading-tight truncate">Análisis de Voz</h4>
                                            <span className="text-xs font-medium text-slate-500">{formattedDate}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px] text-slate-500">schedule</span>
                                                <span className="text-xs text-slate-400">{duration} seg</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                            <div className="flex items-center gap-1 min-w-0">
                                                <span className="material-symbols-outlined text-[14px] text-slate-500">insights</span>
                                                <span className="text-xs text-slate-400 truncate">{session.feedbackDiagnostico}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex items-center">
                                        <button className="size-8 flex items-center justify-center rounded-full bg-white/5 text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </section>

                <div className="h-px bg-white/10 w-full mx-auto my-2"></div>

                {/* FEATURED RESOURCE (Top Video) */}
                <section>
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">Destacado de hoy</h3>
                   <div className="flex flex-col items-stretch justify-start rounded-2xl shadow-lg bg-[#090C10] overflow-hidden transition-all hover:shadow-xl border border-white/10">
                        <div className="w-full relative bg-center bg-no-repeat aspect-video bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdGTtP3OC3HqFQIZw85Y3Zm-z_nlc1N9weBF7ABn_lO-fc0QH0jDe6llb2QAZSQ384t5-po8NtFtIubveip181Kh67R1Z2KcuBGVMVg8wh7ycPgmTNRLyTf-hXRc27nybD2Rj5Vzt4oeY6OyPJctZjD-e4a7nlem0d0ichU0sGayakQPil0bo85x1QzjGY8fPkwYlm2wY3GOCxwKkY7bTK6BFkK9jkLcUz-gghuj0BZTmRwQwHuIMn-h-cLj0QSXzgC73VjYCnL-s")' }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                                    <span className="material-symbols-outlined text-[16px] mr-1">play_circle</span> Video
                                </span>
                            </div>
                        </div>
                        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-3 p-5">
                            <div className="flex flex-col gap-1">
                                <p className="text-white text-lg font-bold leading-tight">Calentamiento vocal en 5 minutos</p>
                                <p className="text-slate-400 text-sm font-normal leading-normal line-clamp-2">Prepárate antes de tu presentación con esta rutina rápida diseñada por expertos.</p>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span> 5 min
                                </div>
                                <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 px-4 bg-amber-500 text-slate-950 text-sm font-bold shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-colors">
                                    Ver Video
                                </button>
                            </div>
                        </div>
                   </div>
                </section>

                {/* HORIZONTAL SCROLL: RECURSOS EXTRA */}
                <section>
                    <div className="flex items-center justify-between pb-3">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Miedo Escénico</h2>
                        <a className="text-amber-400 text-xs font-bold hover:underline cursor-pointer">Ver todo</a>
                    </div>
                    <div className="flex overflow-x-auto snap-x gap-4 pb-4 no-scrollbar -mx-4 px-4">
                        {videos.map((video, i) => (
                            <div key={i} className="snap-center shrink-0 w-[260px] flex flex-col rounded-2xl bg-[#090C10] shadow-sm overflow-hidden border border-white/10 group cursor-pointer hover:border-amber-500/30 transition-colors">
                                <div className="h-36 w-full bg-cover bg-center relative" style={{ backgroundImage: `url("${video.imageUrl}")` }}>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 border border-white/10">
                                        <span className={`material-symbols-outlined text-sm text-amber-400`}>
                                            {video.type === 'VIDEO' ? 'play_arrow' : 'article'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-2 h-full justify-between">
                                    <div>
                                        <p className={`text-xs font-semibold mb-1 uppercase tracking-wider text-amber-400`}>{video.type}</p>
                                        <h3 className="text-white text-base font-bold leading-tight line-clamp-2">{video.title}</h3>
                                    </div>
                                    <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span> {video.duration}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BOOKS LIST (Vertical Rich) */}
                <section>
                    <div className="flex items-center justify-between pb-3 mt-2">
                         <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Lecturas para ti</h2>
                         <a className="text-amber-400 text-xs font-bold hover:underline cursor-pointer">Ver todo</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        {books.map((book, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#090C10] shadow-sm border border-white/10 hover:border-amber-500/30 transition-colors cursor-pointer group">
                                <div className="size-16 shrink-0 rounded-lg bg-cover bg-center relative overflow-hidden shadow-inner" style={{ backgroundImage: `url("${book.imageUrl}")` }}>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white drop-shadow-md">menu_book</span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 gap-1">
                                    <h4 className="text-white font-bold text-sm leading-tight">{book.title}</h4>
                                    <p className="text-slate-400 text-xs line-clamp-1">{book.author}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">{book.type}</span>
                                        <span className="text-[10px] text-slate-400">• {book.duration}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center size-8 rounded-full bg-white/5 text-slate-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Newsletter Section */}
                <section aria-label="Newsletter" className="mt-4">
                    <div className="bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 rounded-2xl p-6 text-center text-slate-950 relative overflow-hidden shadow-lg shadow-amber-500/20 border border-amber-300/40">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-950/20 rounded-full blur-xl -ml-10 -mb-10"></div>
                        
                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="size-12 bg-slate-950/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                                <span className="material-symbols-outlined text-2xl text-slate-950">mark_email_unread</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight">Domina tu comunicación</h3>
                                <p className="text-slate-900/80 text-sm font-semibold mt-1">Recibe tips semanales, ejercicios y secretos de oratoria en tu correo.</p>
                            </div>
                            
                            <div className="flex flex-col gap-2 mt-2">
                                <input 
                                    type="email" 
                                    placeholder="tu@email.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl px-4 py-2.5 text-white bg-slate-950 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 border border-white/10"
                                />
                                <button className="w-full bg-slate-950 text-amber-400 font-black py-3 rounded-xl text-sm hover:bg-slate-900 transition-colors shadow-md uppercase tracking-wider border border-amber-400/30">
                                    Suscribirme GRATIS
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-900/70 font-medium mt-1">Sin spam. Desuscríbete cuando quieras.</p>
                        </div>
                    </div>
                </section>
                
            </div>
            
        </div>
    </main>
  );
}
