import type { Metadata } from "next";
import Link from "next/link";
import LeadCaptureForm from "./LeadCaptureForm";

export const metadata: Metadata = {
  title: "Regalo gratuito: guía para hablar con claridad | Oratoria Efectiva",
  description:
    "Recibe una práctica breve para trabajar el ritmo, las pausas y la claridad al hablar.",
};

export const dynamic = "force-dynamic";

export default function RegalosPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute -left-32 top-16 size-96 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 size-[28rem] rounded-full bg-blue-900/20 blur-[140px]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-sm font-black tracking-wide text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
          ORATORIA <span className="text-amber-400">EFECTIVA</span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-slate-300 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
          Volver al inicio
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-12 md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-300">
            <span className="material-symbols-outlined text-base" aria-hidden="true">redeem</span>
            Regalo gratuito
          </p>
          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Habla con más claridad en solo <span className="text-amber-400">5 minutos</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Recibe una práctica guiada para ordenar tus ideas, controlar el ritmo y usar pausas que ayuden a que tu mensaje llegue mejor.
          </p>

          <ul className="mt-8 space-y-4 text-sm leading-relaxed text-slate-300">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 text-amber-400" aria-hidden="true">check_circle</span>
              Un ejercicio sencillo para preparar lo que quieres decir.
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 text-amber-400" aria-hidden="true">check_circle</span>
              Una técnica de pausa para hablar con un ritmo más cómodo.
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 text-amber-400" aria-hidden="true">check_circle</span>
              Una forma de escucharte y elegir qué practicar después.
            </li>
          </ul>

          <p className="mt-8 text-sm text-slate-400">
            Creado por el profesor Víctor Martínez, docente uruguayo con más de 20 años de experiencia en Lengua y Comunicación.
          </p>
        </div>

        <LeadCaptureForm isConfigured={Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL && process.env.GOOGLE_SHEETS_WEBHOOK_SECRET)} />
      </section>

      <footer className="relative z-10 border-t border-white/10 px-6 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Oratoria Efectiva
      </footer>
    </main>
  );
}
