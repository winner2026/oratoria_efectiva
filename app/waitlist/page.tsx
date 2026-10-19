'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [position, setPosition] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setPosition(data.position);
        // Store in localStorage to remember
        localStorage.setItem('waitlist_email', email);
      } else {
        setError(data.error || 'Error al registrarse');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col font-display">
      
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          ← Volver
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center mobile-container py-12">
          
          {!submitted ? (
            <>
              {/* Hero */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                  <span className="text-blue-400 text-sm font-bold">🎤 Beta Privada</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  Mejora tu voz.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    Antes que nadie.
                  </span>
                </h1>
                
                <p className="text-slate-400 text-lg">
                  Únete a la lista de espera y sé de los primeros en probar
                  <strong className="text-white"> Oratoria Efectiva</strong>.
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-800">
                <h3 className="font-bold mb-4 text-slate-300">Como beta tester recibirás:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 text-xl">✓</span>
                    <span className="text-slate-300">Acceso anticipado exclusivo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 text-xl">✓</span>
                    <span className="text-slate-300">50% de descuento de por vida en Premium</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 text-xl">✓</span>
                    <span className="text-slate-300">Influencia directa en las features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 text-xl">✓</span>
                    <span className="text-slate-300">Badge de "Fundador" en tu perfil</span>
                  </li>
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30"
                >
                  {loading ? 'Registrando...' : 'Quiero acceso anticipado'}
                </button>
              </form>

              <p className="text-center text-slate-500 text-sm mt-6">
                🔒 Solo usamos tu email para avisarte del lanzamiento.
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center animate-fade-in">
              <div className="text-8xl mb-6">🎉</div>
              <h2 className="text-3xl font-black mb-4">¡Estás en la lista!</h2>
              
              {position && (
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-6 mb-6">
                  <p className="text-blue-100 text-sm uppercase tracking-wider mb-1">Tu posición</p>
                  <p className="text-5xl font-black">#{position}</p>
                </div>
              )}
              
              <p className="text-slate-400 mb-8">
                Te avisaremos por email cuando tengas acceso.
                <br />
                <span className="text-white font-bold">Revisa tu bandeja de entrada.</span>
              </p>

              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h3 className="font-bold mb-3">🚀 Sube posiciones compartiendo:</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Cada amigo que se registre con tu link te adelanta 5 puestos.
                </p>
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/waitlist?ref=${encodeURIComponent(email)}`;
                    navigator.clipboard.writeText(shareUrl);
                    alert('¡Link copiado!');
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-colors"
                >
                  📋 Copiar mi link de referido
                </button>
              </div>

              <Link 
                href="/"
                className="inline-block mt-8 text-slate-400 hover:text-white transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          )}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-600 text-sm">
        © 2024 Oratoria Efectiva
      </footer>
    </div>
  );
}
