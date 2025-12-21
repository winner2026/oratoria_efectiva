"use client";

import { useRouter } from "next/navigation";

export default function ListenPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6 text-white">
      <div className="w-full max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <div className="text-3xl md:text-4xl font-semibold uppercase tracking-[0.5em] text-zinc-300">
          KREDIA
        </div>

        <p className="text-3xl font-semibold">Hola.</p>

        <div className="space-y-1 text-center">
          <p className="text-[clamp(1rem,2vw,1.4rem)] font-bold leading-tight text-white">
            Sabrás cómo se percibe tu voz cuando hablas.
          </p>
        </div>

        <p className="text-lg font-semibold text-zinc-100 leading-relaxed">
          Vamos a medir tu presencia comunicativa.
        </p>

        <p className="text-sm text-zinc-300 leading-relaxed">
          Graba un fragmento corto, como en una reunión o al explicar una idea importante.
        </p>

        <button
          onClick={() => router.push("/practice")}
          className="w-full rounded-2xl bg-white py-4 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900 transition hover:scale-[1.01]"
        >
          Analizar mi voz
        </button>

        <p className="text-xs uppercase tracking-[0.5em] text-zinc-500">
          Simple · Directo · Paz Mental
        </p>
      </div>
    </div>
  );
}
