"use client";

import { FormEvent, useState } from "react";

type GuideStep = {
  title: string;
  description: string;
};

const guideSteps: GuideStep[] = [
  {
    title: "Ordena una idea",
    description:
      "Elige un tema sencillo y completa estas tres frases: lo que quiero decir, por qué importa y qué quiero que la otra persona recuerde.",
  },
  {
    title: "Marca tus pausas",
    description:
      "Lee las frases en voz alta. Haz una pausa breve al terminar cada una y otra un poco más larga antes de la idea principal.",
  },
  {
    title: "Practica a ritmo cómodo",
    description:
      "Repite el mensaje en 30 segundos. Pronuncia cada frase completa y deja que el aire acompañe la pausa; no intentes llenar todos los silencios.",
  },
  {
    title: "Escúchate una vez",
    description:
      "Graba una nota de voz y escucha solo una cosa: ¿se entiende cuál es tu idea principal? Elige un aspecto para repetir, sin juzgar toda tu voz.",
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
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">Tu regalo está listo</p>
        <h2 id="guide-title" className="mt-3 text-2xl font-black text-white">Práctica de claridad en 5 minutos</h2>
        <ol className="mt-6 space-y-5">
          {guideSteps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-400 font-black text-slate-950" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3 className="font-bold text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-slate-400">
          La práctica termina cuando encuentres un cambio concreto que quieras probar en tu próxima conversación.
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
            autoComplete="name"
            maxLength={120}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label htmlFor="lead-email" className="mb-2 block text-sm font-semibold text-slate-200">Correo electrónico</label>
          <input
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            placeholder="nombre@correo.com"
          />
        </div>
      </div>

      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="lead-website">Deja este campo vacío</label>
        <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>

      <label className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-slate-300">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-amber-400"
        />
        <span>Acepto que Víctor Martínez Pro utilice mi nombre y correo para gestionar mi solicitud y darme acceso a esta guía. No recibiré comunicaciones promocionales.</span>
      </label>

      {error && <p role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}

      <button
        type="submit"
        disabled={!consent || isSubmitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-4 text-sm font-black uppercase tracking-wide text-slate-950 shadow-lg shadow-amber-500/15 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Preparando tu guía..." : "Quiero recibir el regalo"}
        {!isSubmitting && <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>}
      </button>
      <p className="mt-4 text-center text-xs text-slate-400">Gratis. Sin tarjeta y sin suscripción automática a promociones.</p>
    </form>
  );
}
