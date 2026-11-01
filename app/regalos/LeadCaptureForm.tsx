"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { trackGenerateLead } from "@/lib/analytics/gtag";

type GuideStep = {
  title: string;
  description: string;
  example?: {
    label: string;
    phrase: string;
  }[];
};

const guideSteps: GuideStep[] = [
  {
    title: "Ordena una idea (Estructura de 3 frases)",
    description:
      "Antes de hablar en una reunión importante, completa mentalmente o por escrito estas 3 frases:",
    example: [
      { label: "Lo que quiero decir:", phrase: '"Necesitamos aplazar la entrega una semana."' },
      { label: "Por qué importa:", phrase: '"Para garantizar la estabilidad del sistema y cuidar a los clientes."' },
      { label: "Lo que deben recordar:", phrase: '"Priorizamos la solidez y la confianza sobre el apuro."' },
    ],
  },
  {
    title: "Marca tus pausas tácticas",
    description:
      "Lee las 3 frases en voz alta. Haz una pausa de 1 segundo al terminar cada una, y una pausa más marcada justo antes de tu punto clave. La pausa transmite peso y autoridad; el apuro transmite inseguridad.",
  },
  {
    title: "Respira y mantén el ritmo",
    description:
      "Repite el mensaje en 30 segundos. Deja que el aire entre en cada pausa sin prisa. Recuerda: el silencio no es un error, es tu herramienta para captar la atención de la sala.",
  },
  {
    title: "Grábate y evalúa sin juzgarte",
    description:
      "Graba una nota de voz de 15 a 30 segundos y evalúa solo esto: ¿se entiende tu punto principal sin rodeos? Elige un solo ajuste para tu próxima conversación, sin castigar el timbre de tu voz.",
  },
];

export default function LeadCaptureForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/regalos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, consent, website }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "No pudimos registrar tu solicitud. Inténtalo de nuevo.");
      }

      setIsComplete(true);
      trackGenerateLead({ leadType: "guia_claridad_5_minutos", location: "regalos_page" });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No pudimos registrar tu solicitud. Inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isComplete) {
    return (
      <section className="rounded-3xl border border-emerald-400/25 bg-[#090C10]/95 p-6 shadow-2xl shadow-black/30 sm:p-8" aria-labelledby="guide-title">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-lg" aria-hidden="true">check_circle</span>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Tu regalo está listo</p>
        </div>
        <h2 id="guide-title" className="mt-2 text-2xl font-black text-white">Práctica de claridad en 5 minutos</h2>
        <p className="mt-1 text-xs text-slate-400">Guarda o aplica esta guía antes de tu próxima conversación.</p>

        <ol className="mt-6 space-y-5">
          {guideSteps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-slate-950" aria-hidden="true">
                {index + 1}
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{step.description}</p>
                {step.example && (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs">
                    <p className="font-semibold text-amber-300">Ejemplo práctico:</p>
                    <ul className="mt-2 space-y-1 text-slate-300">
                      {step.example.map((item) => (
                        <li key={item.label}>
                          <span className="font-medium text-white">{item.label}</span> {item.phrase}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Siguiente paso recomendado</p>
          <p className="mt-1 text-xs text-slate-300">
            Pon a prueba esta estructura y mide tu ritmo, pausas y nivel de autoridad con un análisis gratuito de tu voz.
          </p>
          <div className="mt-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              Probar mi voz gratis en el simulador
              <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
        </div>

        <p className="mt-6 border-t border-white/10 pt-4 text-center text-xs leading-relaxed text-slate-400">
          La práctica termina cuando apliques un cambio concreto en tu próxima conversación.
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative rounded-3xl border border-white/10 bg-[#090C10]/95 p-6 shadow-2xl shadow-black/30 sm:p-8">
      <h2 className="text-2xl font-black text-white">Recibe tu guía gratis</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">Completa tus datos para enviarte la práctica y desplegarla aquí mismo.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="lead-name" className="mb-2 block text-sm font-semibold text-slate-200">Nombre</label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre"
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 backdrop-blur-md transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        <div>
          <label htmlFor="lead-email" className="mb-2 block text-sm font-semibold text-slate-200">Correo electrónico</label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 backdrop-blur-md transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        {/* Honeypot field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="lead-website">Website</label>
          <input
            id="lead-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <label className="flex items-start gap-3 text-xs leading-relaxed text-slate-400 cursor-pointer pt-2">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            disabled={isSubmitting}
            className="mt-0.5 size-4 rounded border-white/20 bg-white/5 text-amber-400 focus:ring-amber-400/30"
          />
          <span>Acepto recibir la guía y contenidos de oratoria por correo. Puedo darme de baja cuando quiera.</span>
        </label>

        {error && (
          <p role="alert" className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-xs leading-relaxed text-rose-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-[0_0_25px_rgba(251,191,36,0.25)]"
        >
          {isSubmitting ? "Preparando tu guía..." : "Quiero recibir el regalo"}
          <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsComplete(true)}
            className="text-[11px] text-amber-400/80 hover:text-amber-300 underline font-semibold transition-colors cursor-pointer"
          >
            O ver la guía de claridad inmediatamente sin esperar →
          </button>
        </div>
      </div>
    </form>
  );
}
