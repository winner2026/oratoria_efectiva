import { Suspense } from "react";
import ConversionTracker from "@/components/ConversionTracker";

export const metadata = {
  title: "¡Gracias por tu compra! - Oratoria Efectiva",
  description: "Tu acceso a Sin Miedo a Hablar está confirmado.",
};

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans flex items-center justify-center px-6">
      <Suspense fallback={null}>
        <ConversionTracker />
      </Suspense>

      <div className="max-w-2xl mx-auto text-center">
        <div className="text-8xl mb-8">🎉</div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          ¡Gracias por tu compra!
        </h1>

        <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
          Tu acceso a{" "}
          <strong className="text-orange-500">Sin Miedo a Hablar</strong> está
          confirmado. En unos minutos recibirás un correo de Hotmart con tus
          datos de acceso.
        </p>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-10">
          <h2 className="text-lg font-bold text-white mb-4">
            📧 Próximos pasos
          </h2>
          <ol className="text-left space-y-3 text-neutral-400">
            <li>
              <span className="text-orange-500 font-bold">1.</span> Revisá tu
              correo electrónico (incluyendo spam)
            </li>
            <li>
              <span className="text-orange-500 font-bold">2.</span> Hacé clic
              en el enlace de acceso de Hotmart
            </li>
            <li>
              <span className="text-orange-500 font-bold">3.</span> Comenzá tu
              transformación 🚀
            </li>
          </ol>
        </div>

        <a
          href="/"
          className="inline-block text-orange-500 hover:text-orange-400 font-medium transition-colors"
        >
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}
