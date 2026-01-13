import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * usePitchDetector
 * Returns the current pitch (in Hz) and volume (RMS).
 */
export function usePitchDetector() {
  const [pitch, setPitch] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [isListening, setIsListening] = useState(false);
  const [clarity, setClarity] = useState<number>(0); // Confidence (0-1)

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const bufferRef = useRef<Float32Array | null>(null);

  // Auto-correlate algorithm
  // Based on common implementations for tuner apps
  const autoCorrelate = (buf: Float32Array, sampleRate: number) => {
    // 1. Calculate RMS (Volume)
    let size = buf.length;
    let rms = 0;
    for (let i = 0; i < size; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / size);
    
    // Threshold to avoid noise - Lowered for mobile sensitivity (was 0.01)
    if (rms < 0.002) return { freq: 0, clarity: 0, rms };

    // 2. Autocorrelation (Optimized for robust detection)
    // Constrain search range for human voice (approx 50Hz to 1000Hz)
    
    // Safer trimming: only trim if we have enough data
    let r1 = 0, r2 = size - 1;
    const thres = 0.2;
    
    // Scan from front
    for (let i = 0; i < size / 2; i++) {
        if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    
    // Scan from back
    for (let i = 1; i < size / 2; i++) {
        if (Math.abs(buf[size - i]) < thres) { r2 = size - i; break; }
    }
    
    // Safety check: if trimming removes too much, use full buffer
    if ((r2 - r1) < size * 0.4) {
        r1 = 0;
        r2 = size - 1;
    }

    // Simple autocorrelation
    const buf2 = buf.slice(r1, r2);
    size = buf2.length;
    
    const c = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - i; j++) {
            c[i] = c[i] + buf2[j] * buf2[j + i];
        }
    }

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    
    for (let i = d; i < size; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }
    
    let T0 = maxpos;

    // Interpolation for better precision
    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    const freq = sampleRate / T0;
    
    // Normalize logic
    if (!isFinite(freq) || freq > 2000 || freq < 50) {
        return { freq: 0, clarity: 0, rms };
    }
    
    // Clarity approximation based on peak height relative to max correlation at lag 0 (energy)
    let clarityVal = maxval / c[0]; 

    return { freq: freq, clarity: clarityVal, rms };
  };

  const startListening = useCallback(async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048; // Good balance for bass/treble
      analyserRef.current = analyser;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const microphone = audioContext.createMediaStreamSource(stream);
      microphoneRef.current = microphone;
      microphone.connect(analyser);

      const bufferLength = analyser.fftSize;
      const buffer = new Float32Array(bufferLength);
      bufferRef.current = buffer;

      setIsListening(true);

      const update = () => {
        if (!analyserRef.current || !bufferRef.current) return;
        
        analyserRef.current.getFloatTimeDomainData(bufferRef.current as any);
        const { freq, clarity, rms } = autoCorrelate(bufferRef.current, audioContext.sampleRate);
        
        // Lower threshold (0.4) for natural speech detection
        // Singing has high clarity (~0.8-0.95), speech has lower (~0.4-0.7)
        if (clarity > 0.4 && freq > 0) {
            setPitch(freq);
        } else {
            setPitch(0);
        }
        
        setVolume(rms);
        setClarity(clarity);

        rafIdRef.current = requestAnimationFrame(update);
      };

      update();

    } catch (err) {
      console.error("Error accessing mic for pitch:", err);
      alert("No se pudo acceder al micrófono.");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    
    // Disconnect nodes
    if (microphoneRef.current) {
      // Stop the media stream tracks to release microphone
      const mediaStream = microphoneRef.current.mediaStream;
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    
    // Only close if not already closed
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {
        // Ignore close errors (already closed)
      });
      audioContextRef.current = null;
    }
    
    setIsListening(false);
    setPitch(0);
    setVolume(0);
    setClarity(0);
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return { isListening, startListening, stopListening, pitch, volume, clarity };
}
