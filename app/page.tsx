"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6 text-white">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.5em] text-zinc-400">
          KREDIA
        </div>

        <div className="space-y-3">
          <p className="text-3xl font-semibold">Hola.</p>
          <p className="text-lg text-zinc-300 leading-relaxed">
            Vamos a escuchar tu voz con atención.
          </p>
        </div>

        <div className="space-y-2 text-sm text-zinc-400">
          <p>No vamos a juzgarte.</p>
          <p>Vamos a decirte cómo se percibe cuando hablas.</p>
        </div>

        <p className="text-base text-zinc-200">
          Graba un fragmento corto hablando como lo harías en una reunión o al explicar una idea importante.
        </p>

        <Link
          href="/practice"
          className="inline-flex w-full justify-center rounded-2xl bg-white px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900 transition hover:scale-[1.01]"
        >
          Analizar mi voz
        </Link>

        <p className="text-xs uppercase tracking-[0.5em] text-zinc-500">
          Simple · Directo · Paz Mental
        </p>
      </div>
    </div>
  );
}
