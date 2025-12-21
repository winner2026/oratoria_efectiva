"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AnalysisResult = {
  transcription: string;
  authorityScore: {
    level: "LOW" | "MEDIUM" | "HIGH";
    score: number;
    strengths: string[];
    weaknesses: string[];
    priorityAdjustment: string;
  };
  diagnosis: string;
  strengths: string[];
  weaknesses: string[];
  decision: string;
  payoff: string;
  feedback?: {
    nivel: string;
    loQueSuma: string;
    loQueResta: string;
    hoy: string;
  };
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedResult = localStorage.getItem("voiceAnalysisResult");
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    } else {
      // Si no hay resultados, redirigir a la página de práctica
      router.push("/practice");
    }
    setLoading(false);
  }, [router]);

  const handleNewAnalysis = () => {
    localStorage.removeItem("voiceAnalysisResult");
    router.push("/practice");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-white text-xl">Cargando...</div>
      </main>
    );
  }

  if (!result) {
    return null;
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "HIGH":
        return "text-green-400";
      case "MEDIUM":
        return "text-yellow-400";
      case "LOW":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "HIGH":
        return "Alta";
      case "MEDIUM":
        return "Media";
      case "LOW":
        return "Baja";
      default:
        return level;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-8 md:p-12 max-w-3xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Análisis completado
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="text-gray-400">Nivel de autoridad:</span>
            <span className={`text-2xl font-bold ${getLevelColor(result.authorityScore.level)}`}>
              {getLevelText(result.authorityScore.level)}
            </span>
            <span className="text-gray-500">({result.authorityScore.score}/100)</span>
          </div>
        </div>

        {/* Diagnóstico */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">Diagnóstico</h2>
          <p className="text-gray-300 leading-relaxed">{result.diagnosis}</p>
        </div>

        {/* Transcripción */}
        {result.transcription && (
          <div className="bg-gray-800 rounded-xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-white">Lo que dijiste</h2>
            <p className="text-gray-300 italic leading-relaxed">
              "{result.transcription}"
            </p>
          </div>
        )}

        {/* Fortalezas */}
        {result.strengths.length > 0 && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-green-400">Lo que suma</h2>
            <ul className="space-y-2">
              {result.strengths.map((strength, index) => (
                <li key={index} className="text-gray-300 flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Debilidades */}
        {result.weaknesses.length > 0 && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 space-y-3">
            <h2 className="text-xl font-semibold text-red-400">Lo que resta</h2>
            <ul className="space-y-2">
              {result.weaknesses.map((weakness, index) => (
                <li key={index} className="text-gray-300 flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Acción recomendada */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-blue-400">Hoy</h2>
          <p className="text-gray-300 leading-relaxed">{result.decision}</p>
        </div>

        {/* Payoff */}
        <div className="bg-gray-800 rounded-xl p-6">
          <p className="text-gray-300 text-center italic leading-relaxed">
            {result.payoff}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={handleNewAnalysis}
            className="flex-1 py-4 rounded-xl bg-gray-300 text-dark-950 font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Nuevo análisis
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-4 rounded-xl bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-all duration-200"
          >
            Inicio
          </button>
        </div>

        <p className="text-gray-500 text-center text-sm">
          Simple · Directo · Paz Mental
        </p>
      </div>
    </main>
  );
}
