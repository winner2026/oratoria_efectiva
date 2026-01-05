"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Practice Page Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#101922] flex flex-col items-center justify-center p-6 text-center font-display text-white">
      <div className="bg-[#1a242d] border border-red-500/30 rounded-2xl p-8 max-w-md shadow-2xl">
        <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
          <span className="material-symbols-outlined text-3xl">error_outline</span>
        </div>
        
        <h2 className="text-xl font-bold mb-2">Algo salió mal</h2>
        <p className="text-[#9dabb9] mb-6 text-sm">
          Tuvimos un problema al cargar la grabadora o acceder a tus dispositivos.
          <br/>
          <span className="italic text-xs opacity-70 mt-2 block">
            {error.message || "Error desconocido"}
          </span>
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-primary hover:bg-blue-600 rounded-xl font-bold transition-colors"
          >
            Intentar de nuevo
          </button>
          
          <Link href="/listen">
            <button className="w-full py-3 bg-[#283039] hover:bg-[#3b4754] text-white rounded-xl font-medium transition-colors">
              Volver al inicio
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
