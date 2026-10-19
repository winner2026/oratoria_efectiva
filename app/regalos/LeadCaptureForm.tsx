"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

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

export default function LeadCaptureForm({ isConfigured }: { isConfigured: boolean }) {
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
                  <div className="mt-2.5 space-y-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
                    {step.example.map((ex) => (
                      <div key={ex.label} className="leading-relaxed">
                        <span className="font-semibold text-amber-300/90">{ex.label}</span>{" "}
                        <span className="italic text-slate-300">{ex.phrase}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* CTA: Puente hacia la plataforma */}
        <div className="mt-8 rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent p-5 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            <span className="material-symbols-outlined text-base" aria-hidden="true">graphic_eq</span>
            Siguiente paso recomendado
          </div>
          <h3 className="mt-1.5 text-base font-black text-white">¿Quieres medir tu voz con Inteligencia Artificial?</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-300 max-w-sm mx-auto">
            Prueba nuestro simulador gratuito de 15 segundos para analizar tus pausas, ritmo y claridad en tiempo real.
          </p>
          <div className="mt-4">
            <Link
              href="/voz_efectiva"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 hover:scale-105 active:scale-95"
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

  if (!isConfigured) {
    return (
      <div className="rounded-3xl border border-amber-400/20 bg-[#090C10]/95 p-6 shadow-2xl shadow-black/30 sm:p-8" role="status">
        <h2 className="text-2xl font-black text-white">El regalo estará disponible en breve</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">Estamos preparando la entrega. Por ahora no pediremos ni guardaremos tus datos.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative rounded-3xl border border-white/10 bg-[#090C10]/95 p-6 shadow-2xl shadow-black/30 sm:p-8">
      <h2 className="text-2xl font-black text-white">Recibe tu guía gratis</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">Completa tus datos y te mostraremos el regalo aquí mismo.</p>

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
            placeholder="tu@correo.com"
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 backdrop-blur-md transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        {/* Campo oculto para bots */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="lead-website">Sitio web</label>
          <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-slate-300">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            disabled={isSubmitting}
            className="mt-0.5 size-4 rounded border-white/20 bg-white/5 text-amber-400 accent-amber-400 focus:ring-amber-400/20"
          />
          <span>
            Acepto que estos datos se utilicen para darme acceso a esta guía y enviarme consejos puntuales sobre oratoria y comunicación clara.
          </span>
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-btn-gradient px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-glow-amber transition hover:bg-btn-gradient-hover hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">redeem</span>
        {isSubmitting ? "Preparando tu guía..." : "Quiero recibir el regalo"}
      </button>

      <p className="mt-4 text-center text-xs text-slate-400">
        Respetamos tu privacidad. Tus datos quedan protegidos y no enviamos spam.
      </p>
    </form>
  );
}
