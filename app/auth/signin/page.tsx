"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/practice" });
  };

  return (
    <main className="min-h-[100dvh] bg-background-dark text-white font-display flex flex-col items-center justify-center p-6 relative overflow-hidden pt-safe">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="mobile-container bg-surface-dark border border-[#3b4754] rounded-2xl p-8 z-10 shadow-2xl">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight uppercase text-white mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-gray-400 text-sm">
              Accede para guardar tu progreso
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="group relative flex items-center justify-center gap-3 w-full bg-white text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
               <div className="size-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : (
                <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google Logo" 
                    className="w-5 h-5"
                />
            )}
            <span>Continuar con Google</span>
          </button>
          
          <div className="text-center mt-4 text-xs text-gray-500">
             Al continuar aceptas los términos de servicio.
          </div>
        </div>

        <div className="mt-8 text-center">
           <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
              ← Volver al inicio
           </Link>
        </div>
      </div>
      
      <div className="mt-8 text-center z-10">
        <p className="text-gray-500 text-xs">
           Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
        </p>
      </div>

    </main>
  );
}
