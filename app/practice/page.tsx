"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { getOrCreateAnonymousUserId } from "@/lib/anonymousUser";

export default function PracticePage() {
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Generar o recuperar userId anónimo al montar
  useEffect(() => {
    const id = getOrCreateAnonymousUserId();
    setUserId(id);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("No se pudo acceder al micrófono. Por favor, permite el acceso.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const reRecord = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    audioChunksRef.current = [];
  };

  const analyzeAudio = async () => {
    if (!audioBlob) {
      alert("No hay audio para analizar");
      return;
    }

    if (!userId) {
      alert("Error: No se pudo identificar el usuario");
      return;
    }

    // VERIFICACIÓN: Log del blob antes de enviar
    console.log("Audio blob:", audioBlob, "Size:", audioBlob.size, "bytes");
    console.log("User ID:", userId);

    if (audioBlob.size === 0) {
      alert("El audio está vacío. Por favor, graba de nuevo.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice.webm");
      formData.append("userId", userId);

      console.log("Enviando audio al servidor...");

      const response = await fetch("/api/analysis", {
        method: "POST",
        body: formData,
        // NO agregar Content-Type, FormData lo hace automáticamente
      });

      console.log("Respuesta del servidor:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Error en el análisis");
      }

      const result = await response.json();
      console.log("Resultado del análisis:", result);

      // Guardar resultado en localStorage para la siguiente pantalla
      // Si la API devuelve result.data, usarlo; si no, usar result directamente
      const dataToSave = result.data || result;
      localStorage.setItem("voiceAnalysisResult", JSON.stringify(dataToSave));

      // Navegar a la pantalla de resultados
      router.push("/results");
    } catch (error) {
      console.error("Error al analizar:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error: ${errorMessage}\n\nRevisa la consola para más detalles.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-8 md:p-12 max-w-2xl w-full space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
          Graba tu voz
        </h1>

        <div className="space-y-6 text-center">
          <p className="text-gray-300">
            Habla durante 10-30 segundos como lo harías en una reunión importante.
          </p>

          <p className="text-gray-400 text-sm">
            Explica una idea, comparte una opinión o describe un proyecto.
          </p>
        </div>

        <div className="space-y-6">
          {!audioBlob && !isRecording && (
            <button
              onClick={startRecording}
              className="w-full py-6 rounded-xl bg-red-600 text-white font-bold text-xl hover:bg-red-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <span className="text-2xl">●</span>
              Iniciar grabación
            </button>
          )}

          {isRecording && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-red-600 animate-pulse">
                <span className="text-3xl">●</span>
                <span className="text-xl font-semibold">Grabando...</span>
              </div>
              <button
                onClick={stopRecording}
                className="w-full py-6 rounded-xl bg-gray-700 text-white font-bold text-xl hover:bg-gray-600 transition-all duration-200"
              >
                ■ Detener grabación
              </button>
            </div>
          )}

          {audioUrl && audioBlob && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-xl p-6 space-y-4">
                <p className="text-gray-300 text-sm font-semibold">Vista previa:</p>
                <audio controls src={audioUrl} className="w-full" />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={reRecord}
                  disabled={isAnalyzing}
                  className="flex-1 py-4 rounded-xl bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ↻ Grabar de nuevo
                </button>

                <button
                  onClick={analyzeAudio}
                  disabled={isAnalyzing}
                  className="flex-1 py-4 rounded-xl bg-gray-300 text-dark-950 font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? "Analizando..." : "Analizar →"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-gray-500 text-center text-sm">
          Simple · Directo · Paz Mental
        </p>
      </div>
    </main>
  );
}
