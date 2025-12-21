"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Contrato único de salida del análisis.
 * Este tipo debe coincidir exactamente con lo que devuelve /api/analysis
 */
type AnalysisResult = {
  transcription: string;
  transcriptionWithSilences: string;
  authorityScore: {
    level: "LOW" | "MEDIUM" | "HIGH";
    score: number;
    strengths: string[];
    weaknesses: string[];
    priorityAdjustment: string;
  };
  metrics: {
    wordsPerMinute: number;
    avgPauseDuration: number;
    pauseCount: number;
    fillerCount: number;
    pitchVariation: number;
    energyStability: number;
  };
  durationSeconds: number;
  diagnosis: string;
  strengths: string[];
  weaknesses: string[];
  decision: string;
  payoff: string;
};

type ComparisonData = {
  hasPreviousSession: boolean;
  previousScore: number | null;
  currentScore: number;
  dynamicCopy: string[];
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      const savedResult = localStorage.getItem("voiceAnalysisResult");
      if (!savedResult) {
        router.push("/practice");
        return;
      }

      const analysisResult = JSON.parse(savedResult);
      setResult(analysisResult);

      // Obtener comparación con sesión anterior
      try {
        const response = await fetch("/api/session-comparison", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "anonymous", // TODO: usar userId real cuando implementes auth
            currentMetrics: analysisResult.metrics,
            currentScore: analysisResult.authorityScore.score,
          }),
        });

        if (response.ok) {
          const comparisonData = await response.json();
          setComparison(comparisonData);
        }
      } catch (error) {
        console.error("Error al obtener comparación:", error);
      }

      setLoading(false);
    };

    loadResults();
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

  // Generar indicador visual minimalista
  const renderAuthorityBar = () => {
    if (!comparison?.hasPreviousSession) {
      return null;
    }

    const prev = comparison.previousScore || 0;
    const curr = result.authorityScore.score;
    const filledBars = Math.round((curr / 100) * 9);

    return (
      <div className="flex items-center gap-3 text-gray-300">
        <div className="flex gap-0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={i < filledBars ? "text-white" : "text-gray-700"}>
              ▮
            </span>
          ))}
        </div>
        <span className="text-sm">
          {prev} → {curr}
        </span>
      </div>
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-8 md:p-12 max-w-3xl w-full space-y-8">
        {/* Header: Solo el número de autoridad */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl text-gray-400 font-normal">Autoridad</h1>
          <div className="text-6xl font-bold text-white">
            {result.authorityScore.score}<span className="text-gray-500 text-4xl">/100</span>
          </div>
          {renderAuthorityBar()}
        </div>

        {/* Copy dinámico: QUÉ cambió */}
        {comparison?.dynamicCopy && comparison.dynamicCopy.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 space-y-3">
            {comparison.dynamicCopy.map((copy, index) => (
              <p key={index} className="text-gray-300 leading-relaxed">
                {copy}
              </p>
            ))}
          </div>
        )}

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

        {/* CTA FIJO: Lo más importante */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center space-y-3">
          <button
            type="button"
            onClick={handleNewAnalysis}
            className="w-full py-4 rounded-xl bg-gray-300 text-dark-950 font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Volver a grabar para ganar autoridad
          </button>
          <p className="text-gray-400 text-sm">
            Una grabación al día es suficiente para mejorar.
          </p>
        </div>

        {/* Botón secundario */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full py-3 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-all duration-200"
        >
          Inicio
        </button>

        <p className="text-gray-500 text-center text-sm">
          Simple · Directo · Paz Mental
        </p>
      </div>
    </main>
  );
}
