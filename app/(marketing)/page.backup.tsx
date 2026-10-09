import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-6 bg-[#090810] font-sans n8n-grid-bg relative overflow-hidden">
      <div className="n8n-glow-spot w-[500px] h-[500px] bg-brand-orange/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse" />

      <div className="n8n-card p-8 md:p-12 max-w-2xl w-full space-y-8 relative z-10 border border-white/15 shadow-card-glow">
        <div className="space-y-4 text-center">
          <span className="n8n-badge n8n-badge-highlight">ENTRENAMIENTO VOCAL CON IA</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            ORATORIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-amber to-brand-purple">EFECTIVA</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Mejora tu forma de hablar, domina el miedo escénico y comunica con autoridad inamovible.
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Link href="/practice?mode=video" className="w-full max-w-md">
            <button
              type="button"
              className="n8n-btn-primary w-full py-5 text-xl font-black tracking-wide"
            >
              Comienza Ahora ⚡
            </button>
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">
            Ver página del curso completo →
          </Link>
        </div>
      </div>
    </main>
  );
}
