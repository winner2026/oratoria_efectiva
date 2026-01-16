"use client";

import { useEffect, useRef } from "react";

interface AudioLevelMeterProps {
  stream: MediaStream | null;
  isActive: boolean;
}

export default function AudioLevelMeter({ stream, isActive }: AudioLevelMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(undefined);
  const analyzerRef = useRef<AnalyserNode>(undefined);
  const peakRef = useRef<number>(0);
  const dropRef = useRef<number>(0);

  useEffect(() => {
    if (!stream || !isActive || !canvasRef.current) return;

    // Verificar si el stream tiene pistas de audio
    if (stream.getAudioTracks().length === 0) {
      console.warn("[AudioLevelMeter] No audio tracks found in stream");
      return;
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Auto-resume logic
      if (audioContext.state === 'suspended') {
          audioContext.resume();
      }

      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      
      analyzer.fftSize = 256;
      analyzer.smoothingTimeConstant = 0.4; // Respuesta rápida pero suave
      source.connect(analyzer);
      analyzerRef.current = analyzer;

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      const canvas = canvasRef.current;
      if (!canvas) {
          audioContext.close();
          return;
      }
      const ctx = canvas.getContext("2d");

      // Dimensiones
      const width = canvas.width;
      const height = canvas.height;
      const segmentHeight = 4;
      const gap = 2;
      const totalSegments = Math.floor(height / (segmentHeight + gap));

      const draw = () => {
        if (!ctx) return;
        animationRef.current = requestAnimationFrame(draw);
        
        analyzer.getByteFrequencyData(dataArray);

        // Calcular volumen RMS
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        
        // --- NOISE GATE VISUAL ---
        // Ignorar ruido de fondo bajo (ej. ventiladores, estática)
        // El RMS suele ser ~0-10 con ruido ambiente. Ponemos el umbral en 15.
        // Si es menor a 15, lo tratamos como 0 absoluto.
        const noiseGateThreshold = 15;
        const effectiveRms = rms < noiseGateThreshold ? 0 : rms;

        // Convertir a "dB" logarítmico simulado (0 a 1)
        // RMS ajustado: 0 silencio, 255 pico.
        const normalizedVol = Math.min(1, Math.max(0, (effectiveRms - 10) / 100));

        // Peak Hold
        if (normalizedVol > peakRef.current) {
          peakRef.current = normalizedVol;
          dropRef.current = 0;
        } else {
          dropRef.current += 0.01;
          peakRef.current = Math.max(normalizedVol, peakRef.current - dropRef.current);
        }

        ctx.clearRect(0, 0, width, height);

        // Dibujar segmentos
        const activeSegments = Math.floor(normalizedVol * totalSegments);
        const peakSegment = Math.floor(peakRef.current * totalSegments);

        for (let i = 0; i < totalSegments; i++) {
          // Invertir índice (0 abajo, max arriba)
          const index = i; 
          const y = height - (i * (segmentHeight + gap)) - segmentHeight;
          
          let color = "#1f2937"; // Apagado (gris oscuro)
          
          if (i < activeSegments) {
            // Colores basados en nivel (de abajo hacia arriba)
            const ratio = i / totalSegments;
            if (ratio > 0.85) color = "#ef4444"; // Rojo (> -3dB)
            else if (ratio > 0.6) color = "#eab308"; // Amarillo (> -12dB)
            else color = "#22c55e"; // Verde
          }

          ctx.fillStyle = color;
          
          // Estilo LED
          ctx.beginPath();
          if (ctx.roundRect) {
              ctx.roundRect(0, y, width, segmentHeight, 1);
          } else {
              ctx.rect(0, y, width, segmentHeight);
          }
          ctx.fill();
        }

        // Dibujar indicador de Peak
        const peakY = height - (peakSegment * (segmentHeight + gap)) - segmentHeight;
        if (peakSegment >= 0 && peakSegment < totalSegments) {
           ctx.fillStyle = "#ffffff";
           ctx.fillRect(0, peakY, width, 2);
        }
      };

      draw();

      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioContext.state !== 'closed') {
             audioContext.close().catch(e => console.error("Error closing AudioContext", e));
        }
      };
    } catch (e) {
      console.error("Error initializing level meter:", e);
    }
  }, [stream, isActive]);

  return (
    <div className="relative h-full w-full flex flex-col items-center py-2">
      <div className="h-full w-2 md:w-3 relative">
        <canvas 
          ref={canvasRef} 
          width={40} 
          height={400} 
          className="w-full h-full opacity-90"
        />
      </div>
    </div>
  );
}
