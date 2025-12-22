"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { getOrCreateAnonymousUserId } from "@/lib/anonymousUser";
import { logEvent } from "@/lib/events/logEvent";

// 🎯 CONTROL DE ABANDONO TEMPRANO
const MIN_RECORDING_DURATION = 3; // segundos
const EARLY_ABANDONMENT_THRESHOLD = 5; // segundos

// 💰 CONTROL DE COSTOS - Límite máximo de grabación
const MAX_RECORDING_DURATION = 60; // segundos (límite de Whisper)

export default function PracticePage() {
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number | null>(null);
  const autoStopTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showIncognitoWarning, setShowIncognitoWarning] = useState(false);
  const [isCheckingIncognito, setIsCheckingIncognito] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);

  // Detectar modo incógnito y generar userId
  useEffect(() => {
    const checkAccess = async () => {
      const { shouldBlockAccess } = await import("@/lib/detectIncognito");
      const shouldBlock = await shouldBlockAccess();

      console.log('[PRACTICE] Access check result - shouldBlock:', shouldBlock);

      if (shouldBlock) {
        console.log('[PRACTICE] ❌ BLOQUEANDO acceso - modo incógnito o localStorage no persistente');
        setShowIncognitoWarning(true);
        setIsCheckingIncognito(false);
        return;
      }

      // Si no debe bloquear, generar userId
      console.log('[PRACTICE] ✅ Permitiendo acceso');
      const id = getOrCreateAnonymousUserId();
      setUserId(id);
      setIsCheckingIncognito(false);
    };

    checkAccess();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Intentar forzar formato webm (mejor compatibilidad con Whisper)
      let options = { mimeType: "audio/webm" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn("audio/webm no soportado, intentando alternativa...");
        options = { mimeType: "audio/mp4" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn("audio/mp4 no soportado, usando default");
          options = {} as any;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();
      setRecordingTime(0);

      // 📊 EVENTO: recording_started
      logEvent("recording_started");

      // 🎯 CONTADOR DE TIEMPO VISUAL
      const countdownInterval = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          return newTime;
        });
      }, 1000);

      // 💰 AUTO-STOP A LOS 60 SEGUNDOS (control de costos)
      autoStopTimerRef.current = setTimeout(() => {
        console.log("⏱️ Auto-stop: 60 segundos alcanzados");
        clearInterval(countdownInterval);
        stopRecording();
        logEvent("recording_auto_stopped", { duration: MAX_RECORDING_DURATION });
      }, MAX_RECORDING_DURATION * 1000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        // Validar duración mínima
        const recordingDuration = recordingStartTimeRef.current ? (Date.now() - recordingStartTimeRef.current) / 1000 : 0;

        console.log("🎙️ Grabación completada:");
        console.log("- Duración:", recordingDuration.toFixed(1), "segundos");
        console.log("- Tamaño:", blob.size, "bytes");
        console.log("- Tipo:", blob.type);

        if (recordingDuration < MIN_RECORDING_DURATION) {
          // 📊 EVENTO: recording_abandoned (demasiado corta)
          logEvent("recording_abandoned", {
            duration: recordingDuration,
            reason: "too_short"
          });
          alert("La grabación es muy corta. Habla al menos 3 segundos para poder analizar tu voz.");
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        // 🎯 Detectar abandono temprano (< 5 segundos)
        if (recordingDuration < EARLY_ABANDONMENT_THRESHOLD) {
          logEvent("early_abandonment", { duration: recordingDuration });
        }

        if (blob.size === 0) {
          // 📊 EVENTO: recording_abandoned (audio vacío)
          logEvent("recording_abandoned", {
            duration: recordingDuration,
            reason: "empty_audio"
          });
          alert("Error: El audio está vacío. Intenta grabar de nuevo.");
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        // 📊 EVENTO: recording_completed
        logEvent("recording_completed", { duration: recordingDuration });

        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());

        // Limpiar el timestamp DESPUÉS de usarlo
        recordingStartTimeRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("No se pudo acceder al micrófono. Por favor, permite el acceso.");
    }
  };

  const stopRecording = () => {
    // Limpiar timers
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }

    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    // NO limpiar recordingStartTimeRef aquí - se necesita en mediaRecorder.onstop
    // Se limpiará después de calcular la duración
  };

  const reRecord = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    recordingStartTimeRef.current = null;
    audioChunksRef.current = [];

    // Limpiar timers si existen
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
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

    // ✅ VALIDACIÓN CRÍTICA 1: Verificar tamaño
    if (audioBlob.size === 0) {
      alert("El audio está vacío. Por favor, graba de nuevo.");
      console.error("❌ Audio blob vacío detectado antes de enviar");
      return;
    }

    // ✅ VALIDACIÓN CRÍTICA 2: Verificar tipo
    if (!audioBlob.type || audioBlob.type === "") {
      console.warn("⚠️ Audio sin mimeType, forzando audio/webm");
    }

    // 💰 VALIDACIÓN CRÍTICA 3: Estimar duración por tamaño de archivo
    // WebM audio: ~12-16 KB/segundo aproximadamente
    // Si el archivo es muy grande, probablemente excede los 60 segundos
    const estimatedDuration = audioBlob.size / 12000; // Estimación conservadora
    const MAX_FILE_SIZE = MAX_RECORDING_DURATION * 16000; // ~960 KB para 60 segundos

    if (audioBlob.size > MAX_FILE_SIZE) {
      alert(
        `⚠️ El audio es muy largo (${Math.round(estimatedDuration)}s estimados).\n\n` +
        `Máximo permitido: ${MAX_RECORDING_DURATION} segundos.\n\n` +
        `Por favor, graba un audio más corto.`
      );
      console.error("❌ Audio demasiado largo:", {
        size: audioBlob.size,
        estimatedDuration: Math.round(estimatedDuration),
        maxAllowed: MAX_RECORDING_DURATION
      });
      return;
    }

    // VERIFICACIÓN: Log detallado antes de enviar
    console.log("📤 Enviando audio al servidor:");
    console.log("  - Tamaño:", audioBlob.size, "bytes");
    console.log("  - Tipo:", audioBlob.type);
    console.log("  - User ID:", userId);

    // 📊 EVENTO: cta_analyze_clicked (proceeded to analysis)
    logEvent("cta_analyze_clicked");
    logEvent("proceeded_to_analysis");

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      // Forzar nombre con extensión correcta
      const fileName = audioBlob.type.includes("mp4") ? "voice.mp4" : "voice.webm";
      formData.append("audio", audioBlob, fileName);
      formData.append("userId", userId);

      console.log("🚀 Llamando a /api/analysis...");

      const response = await fetch("/api/analysis", {
        method: "POST",
        body: formData,
        // NO agregar Content-Type, FormData lo hace automáticamente
      });

      console.log("Respuesta del servidor:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        console.error("API Error:", errorData);

        // 🚫 MANEJO ESPECIAL: Free limit reached
        if (response.status === 403 && errorData.error === "FREE_LIMIT_REACHED") {
          console.log("🔒 Free limit reached, showing modal");
          // 📊 EVENTO: free_limit_reached
          logEvent("free_limit_reached");
          setShowLimitModal(true);
          return;
        }

        throw new Error(errorData.message || errorData.error || "Error en el análisis");
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

  // Mostrar loading mientras se verifica incógnito
  if (isCheckingIncognito) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-gray-400">Verificando...</div>
      </main>
    );
  }

  // Si está en modo incógnito, mostrar solo el modal de bloqueo
  if (showIncognitoWarning) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full space-y-6 border border-white/10">
            <div className="space-y-4 text-center">
              <div className="text-4xl">🔒</div>
              <h2 className="text-2xl font-bold text-white">
                No se puede usar en modo incógnito
              </h2>
              <div className="space-y-3 text-gray-300 text-left">
                <p className="leading-relaxed">
                  <strong className="text-white">Oratoria Efectiva</strong> necesita guardar tu progreso para funcionar correctamente.
                </p>
                <p className="leading-relaxed">
                  En modo incógnito no podemos:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Guardar tu historial de análisis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Recordar tu progreso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Controlar tu plan gratuito</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-400 pt-2">
                  💡 <strong>Solución:</strong> Abre esta página en una ventana normal del navegador.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/")}
                className="w-full py-4 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

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

          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
            <p className="text-blue-300 text-sm">
              ⏱️ <strong>Máximo 60 segundos.</strong> La grabación se detendrá automáticamente.
            </p>
          </div>
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

              {/* Timer visual */}
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-4xl font-bold text-white font-mono">
                  {recordingTime}s
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Máximo: {MAX_RECORDING_DURATION}s
                </div>
                {recordingTime >= 45 && (
                  <div className="text-yellow-500 text-xs mt-2 animate-pulse">
                    ⚠️ Se detendrá automáticamente en {MAX_RECORDING_DURATION - recordingTime}s
                  </div>
                )}
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
                <audio
                  controls
                  src={audioUrl}
                  className="w-full"
                  onPlay={() => {
                    // 📊 EVENTO: playback_started
                    logEvent("playback_started");
                  }}
                  onEnded={() => {
                    // 📊 EVENTO: playback_completed
                    logEvent("playback_completed");
                  }}
                />
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

      {/* Modal - Límite alcanzado */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full space-y-6 border border-white/10">
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-bold text-white">
                Ya terminaste tu prueba gratuita
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Esta prueba era única. Para seguir entrenando tu voz, desbloquea el plan completo.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/upgrade")}
                className="w-full py-4 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Desbloquear Premium
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full py-3 text-gray-400 hover:text-white transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
