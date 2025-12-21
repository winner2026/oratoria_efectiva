"use client";

import Link from "next/link";
import {
  buildAuthorityScore,
  buildDiagnosis,
  buildStrengths,
  buildWeaknesses,
  buildDecision,
} from "@/domain/authority/buildAuthorityScore";
import { VoiceMetrics } from "@/domain/voice/VoiceMetrics";

const SAMPLE_METRICS: VoiceMetrics = {
  wordsPerMinute: 130,
  avgPauseDuration: 0.45,
  pauseCount: 5,
  fillerCount: 3,
  pitchVariation: 0.18,
  energyStability: 0.65,
};

const PAYOFF =
  "Si corriges esto, tu voz se va a percibir más firme en reuniones, presentaciones y conversaciones importantes.";

const renderList = (items: string[], emptyLabel: string, icon: string, iconClass: string) => {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((entry) => (
        <li key={entry} className="flex items-start gap-2 text-white text-sm">
          <span className={iconClass} aria-hidden>
            {icon}
          </span>
          <span>{entry}</span>
        </li>
      ))}
    </ul>
  );
};

export default function AnalyzerPage() {
  const authorityScore = buildAuthorityScore(SAMPLE_METRICS);
  const diagnosis = buildDiagnosis(authorityScore.score);
  const strengths = buildStrengths(SAMPLE_METRICS);
  const weaknesses = buildWeaknesses(SAMPLE_METRICS);
  const decision = buildDecision(weaknesses);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6 text-white">
      <div className="w-full max-w-3xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-left shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">{diagnosis}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-3 rounded-2xl border border-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Lo que suma</p>
            {renderList(
              strengths,
              "En tu grabación actual aún no detectamos puntos fuertes.",
              "✔",
              "text-emerald-400"
            )}
          </section>
          <section className="space-y-3 rounded-2xl border border-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Lo que resta</p>
            {renderList(
              weaknesses,
              "El ritmo y energía están equilibrados en esta toma.",
              "⚠",
              "text-yellow-400"
            )}
          </section>
        </div>

        <section className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-yellow-200">Decisión</p>
          <p className="text-white text-base">{decision}</p>
        </section>

        <p className="text-sm text-gray-400">{PAYOFF}</p>

        <div className="flex justify-center">
          <Link
            href="/listen"
            className="w-full max-w-xs rounded-2xl bg-white py-4 text-center text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900 transition hover:scale-[1.01]"
          >
            Volver a grabar para ganar autoridad
          </Link>
        </div>
      </div>
    </div>
  );
}
